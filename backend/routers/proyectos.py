from config.database import get_db
from core.security import decode_token
from datetime import date
from dependencies import (
    get_bonita_client,
    debug,
    wait_for_any_activity,
    wait_for_ready_activity,
)
from fastapi import APIRouter, Body, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordBearer
from io import BytesIO
import json
from models.proyecto import Proyecto, EstadoProyecto
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services import proyecto_service, observacion_service
from reportlab.pdfgen import canvas
import requests

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class ProjectID(BaseModel):
    project_id: int


@router.post("/crearProyecto")
def crear_proyecto(
    proyecto: dict = Body(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    project_name = proyecto["projectName"]
    project_desc = proyecto["projectDesc"]
    amount_stages = proyecto["stagesAmount"]
    u_id = int(proyecto["userId"])

    if not project_name or type(project_name) != str or project_name.strip() == "":
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_name",
                "message": "El nombre del proyecto es inválido",
            },
        )

    if proyecto_service.existe_proyecto_para_ong(db, project_name, u_id):
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_name",
                "message": "El nombre del proyecto ya está en uso",
            },
        )

    if not amount_stages or type(amount_stages) != int:
        raise HTTPException(
            status_code=409,
            detail={"field": "amount_stages", "message": "Cantidad de etapas inválida"},
        )

    if not project_desc or type(project_desc) != str or project_desc.strip() == "":
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_desc",
                "message": "Descripción de proyecto inválida",
            },
        )

    for i, stage in enumerate(proyecto["stages"]):
        name = stage["name"]
        desc = stage["description"]
        if (
            not name
            or type(name) != str
            or name.strip() == ""
            or not desc
            or type(desc) != str
            or desc.strip() == ""
        ):
            raise HTTPException(
                status_code=409,
                detail={
                    "field": "project_desc",
                    "message": f"Error con la etapa {i+1}",
                },
            )

    try:
        bonita = get_bonita_client()
        process_id = bonita.get_process_id_by_name("Proyecto")

        debug("Process ID:", process_id)

        result = bonita.start_process(process_definition_id=process_id)
        debug("Resultado start_process:", result)

        bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="etapasTotales",
            value=amount_stages,
            type_hint="java.lang.Integer",
        )

        proy = Proyecto(
            titulo=project_name,
            descripcion=project_desc,
            user_id=u_id,
            fecha_creacion=date.today(),
            estado=EstadoProyecto.publicado,
            idBonita=result["caseId"],
            cant_etapas=amount_stages,
        )
        nuevo_proyecto = proyecto_service.crear_proyecto(db, proy)

        bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="iddb",
            value=nuevo_proyecto.id,
            type_hint="java.lang.Integer",
        )

        activities = wait_for_any_activity(bonita, result["caseId"])
        task1 = activities[0]["id"]
        debug("Primera actividad:", activities[0])

        bonita.assign_task(task_id=task1, user_id=1)
        bonita.complete_activity(task_id=task1)

        etapas = []
        for stage in proyecto["stages"]:
            etapa_obj = {
                "titulo": stage["name"],
                "descripcion": stage["description"],
                "fecha_inicio": date.today().isoformat(),
                "fecha_fin": date.today().isoformat(),
                "id_proyecto": nuevo_proyecto.id,
                "estado": "publicada",
                "username": username,
                "project_name": project_name,
            }
            etapas.append(etapa_obj)

        bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="etapas",
            value=json.dumps(etapas),
            type_hint="java.lang.String",
        )

        last_id = None
        for i in range(1):
            debug(f"\n--- Ciclo actividad {i+1} ---")
            act = wait_for_ready_activity(bonita, result["caseId"], previous_id=last_id)

            bonita.assign_task(task_id=act["id"], user_id=2)
            bonita.complete_activity(task_id=act["id"])
            last_id = act["id"]

        return {"success": True, "message": "Project submitted successfully"}

    except Exception as e:
        debug("ERROR CAPTURADO:", str(e))
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.get("/allProjects")
def get_projects(
    user_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        projects = proyecto_service.get_all_projects_except_id(db=db, user_id=user_id)
        return {"success": True, "projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.get("/tengo_observaciones")
def tengo_observaciones(
    id_ong: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        all_my_projects = proyecto_service.obtener_proyectos_para_ong(db, id_ong)
        for project in all_my_projects:
            has_observations = observacion_service.get_observaciones_por_proyecto(
                project.id, db
            )
            if has_observations:
                return {"success": True, "has_observations": True}

        return {"success": True, "has_observations": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}")
def get_project(
    project_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        proyecto = proyecto_service.obtener_proyecto_por_id(db, project_id)
        if not proyecto:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"success": True, "project": proyecto}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.get("/myProjects/{user_id}")
def get_my_projects(
    user_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        proyectos = proyecto_service.obtener_proyectos_para_ong(db, user_id)
        return {"success": True, "projects": proyectos}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.post("/ejecutar/{project_id}")
def ejecutar_proyecto(
    project_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):

    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        proyecto = proyecto_service.obtener_proyecto_por_id(db, project_id)
        if not proyecto:
            raise HTTPException(status_code=404, detail="Project not found")
        # Cambiar estado de proyecto
        proyecto_service.actualizar_estado_proyecto(
            db, project_id, EstadoProyecto.ejecutandose
        )
        # Ejecuar tarea de bonita
        bonita = get_bonita_client()
        activities = wait_for_any_activity(bonita, proyecto.idBonita)
        task1 = activities[0]["id"]
        debug("Primera actividad:", activities[0])

        bonita.assign_task(task_id=task1, user_id=1)
        bonita.complete_activity(task_id=task1)

        return {"success": True, "message": "Project executed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.post("/terminar_proyecto")
def terminar_proyecto(
    data: ProjectID, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        proyecto = proyecto_service.terminar_proyecto(db, data.project_id)
        if not proyecto:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        # if str(proyecto.estado) != EstadoProyecto.ejecutandose:
        #     raise HTTPException(status_code=400, detail="Proyecto inválido")
        # if observacion_service.has_unresolved_observations(proyecto.id, db):
        #     raise HTTPException(status_code=400, detail="Proyecto inválido")
        bonita = get_bonita_client()

        activities = wait_for_any_activity(bonita, proyecto.idBonita)
        if not activities:
            raise HTTPException(
                status_code=409, detail="No hay actividades disponibles en Bonita"
            )

        task1 = activities[0]["id"]

        try:
            bonita.assign_task(task_id=task1, user_id=1)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error asignando tarea Bonita: {e}"
            )

        try:
            bonita.complete_activity(task_id=task1)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error completando actividad Bonita: {e}"
            )

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer)

        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(100, 800, f"Reporte del Proyecto {proyecto.titulo}")

        pdf.setFont("Helvetica", 12)
        pdf.drawString(100, 770, f"Descripción: {proyecto.descripcion}")
        pdf.drawString(100, 750, f"Fecha de creación: {proyecto.fecha_creacion}")
        pdf.drawString(100, 730, f"Estado final: Terminado")
        y = 730 - 20

        # Etapas
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(100, y, "Etapas:")
        y -= 20

        pdf.setFont("Helvetica", 12)
        pdf.drawString(100, y, f"Información de las {proyecto.cant_etapas} etapa/s:")
        y -= 20

        url = (
            "https://projectplanning-cloud-yxzf.onrender.com/etapas/proyecto/"
            + str(proyecto.id)
            + "/todas"
        )
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        etapas = []
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            etapas = resp.json()
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=503, detail=f"Error consiguiendo las etapas del cloud: {e}"
            )
        for index, etapa in enumerate(etapas):
            pdf.drawString(
                120, y, f"- Etapa {index+1}: {etapa['titulo']}: {etapa['descripcion']}"
            )
            y-=20
            pdf.drawString(
                120, y, f"- Descripción: {etapa['descripcion']}"
            )
            y -= 20
            pdf.drawString(
                120,
                y,
                f"Fecha de inicio: {etapa['fecha_inicio']}",
            )
            y -= 20
            pdf.drawString(
                120,
                y,
                f"Fecha de fin: {etapa['fecha_fin']}",
            )
            y-=10
            if y < 50:
                pdf.showPage()
                y = 800

        # Observaciones
        y -= 30

        if y < 80:
            pdf.showPage()
            y = 800

        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(100, y, "Observaciones:")
        y -= 20

        pdf.setFont("Helvetica", 12)

        observaciones = observacion_service.get_all_observations(proyecto.id, db)

        if not observaciones:
            pdf.drawString(120, y, "No hay observaciones registradas.")
            y -= 20
        else:
            for obs in observaciones:
                pdf.drawString(
                    120,
                    y,
                    f"- {obs.descripcion} : {f"Resuelta" if bool(obs.resuelto) else "Sin resolver"}",
                )
                y -= 20

                if y < 50:
                    pdf.showPage()
                    y = 800

        pdf.save()
        buffer.seek(0)
        return Response(
            content=buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=proyecto_{proyecto.id}.pdf"
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
