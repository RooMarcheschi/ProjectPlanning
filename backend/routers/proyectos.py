from fastapi import APIRouter, Body, Depends, HTTPException, status
import json
from bonita_client import BonitaClient
from sqlalchemy.orm import Session
from models.compromiso import Compromiso, EstadoCompromiso
from services import compromiso_service, proyecto_service, etapa_service
from models.proyecto import Proyecto, EstadoProyecto
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from config.database import get_db
from dependencies import get_bonita_client
import time

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])


# Crear un proyecto
@router.post("/crearProyecto")
def crear_proyecto(proyecto: dict = Body(...), db: Session = Depends(get_db)):
    project_name = proyecto["projectName"]
    project_desc = proyecto["projectDesc"]
    amount_stages = proyecto["stagesAmount"]
    u_id = int(proyecto["userId"])

    # Validaciones

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
        result = bonita.start_process(process_definition_id=process_id)
        res = bonita.set_case_variable(
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
        res = bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="iddb",
            value=nuevo_proyecto.id,
            type_hint="java.lang.Integer",
        )
        activity = bonita.search_activity_by_case(case_id=result["caseId"])
        task1 = activity[0]["id"]
        bonita.assign_task(task_id=task1, user_id=1)
        res = bonita.complete_activity(task_id=task1)
        etapas = []
        for i, stage in enumerate(proyecto["stages"]):
            name = stage["name"]
            desc = stage["description"]

            etapa = Etapa(
                id_proyecto=nuevo_proyecto.id,
                id_user=u_id,
                titulo=name,
                descripcion=desc,
                fecha_creacion=date.today(),
                fecha_inicio=date.today(),
                fecha_fin=date.today(),
                estado=EstadoEtapa.publicada,
            )

            etapa_json = {
                "titulo": etapa.titulo,
                "descripcion": etapa.descripcion,
                "fecha_inicio": (
                    etapa.fecha_inicio.isoformat()
                    if hasattr(etapa.fecha_inicio, "isoformat")
                    else str(etapa.fecha_inicio)
                ),
                "fecha_fin": (
                    etapa.fecha_fin.isoformat()
                    if hasattr(etapa.fecha_fin, "isoformat")
                    else str(etapa.fecha_fin)
                ),
                "id_proyecto": etapa.id_proyecto,
                "estado": getattr(etapa.estado, "name", str(etapa.estado)),
            }
            etapas.append(etapa_json)
            nueva_etapa = etapa_service.crear_etapa(db, etapa)
        res = bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="etapas",
            value=json.dumps(etapas),
            type_hint="java.lang.String",
        )
        id_ant = 9999999999999
        for i in range(3):
            activity2 = bonita.search_activity_by_case(case_id=result["caseId"])
            while not activity2:
                activity2 = bonita.search_activity_by_case(case_id=result["caseId"])
                time.sleep(1)
            while activity2[0]["state"] != "ready" or id_ant == activity2[0]["id"]:
                activity2 = bonita.search_activity_by_case(case_id=result["caseId"])
                print("Activity state:", activity2[0]["state"])
                print("Activity id:", activity2[0]["id"])
                print("Previous id:", id_ant)
                time.sleep(1)
            bonita.assign_task(task_id=activity2[0]["id"], user_id=2)
            res = bonita.complete_activity(task_id=activity2[0]["id"])
            id_ant = activity2[0]["id"]
        return {"success": True, "message": "Project submitted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    try:
        proyecto = proyecto_service.obtener_proyecto_por_id(db, project_id)
        print("Se encontro el proyeco")
        if not proyecto:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"success": True, "project": proyecto}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/myProjects/{user_id}")
def get_my_projects(user_id: int, db: Session = Depends(get_db)):
    try:
        proyectos = proyecto_service.obtener_proyectos_para_ong(db, user_id)
        return {"success": True, "projects": proyectos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
