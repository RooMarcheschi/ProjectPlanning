from fastapi import APIRouter, Body, Depends, HTTPException, status
import json
from sqlalchemy.orm import Session
from services import proyecto_service
from models.proyecto import Proyecto, EstadoProyecto
from models.etapa import Etapa, EstadoEtapa
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from datetime import date
from config.database import get_db
from dependencies import get_bonita_client
import time

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/crearProyecto")
def crear_proyecto(
    proyecto: dict = Body(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    import time

    def debug(msg, *args):
        print(f"[DEBUG] {msg}", *args)

    def wait_for_any_activity(bonita, case_id, timeout=10):
        """Espera a que haya alguna actividad disponible."""
        debug("Esperando primera actividad...")
        start = time.time()
        while time.time() - start < timeout:
            acts = bonita.search_activity_by_case(case_id=case_id)
            debug("search_activity_by_case devolvió:", acts)
            if acts:
                return acts
            time.sleep(0.5)
        raise Exception("Timeout esperando primera actividad del proceso")

    def wait_for_ready_activity(bonita, case_id, previous_id=None, timeout=10):
        """
        Espera una actividad ready distinta de previous_id.
        """
        debug(f"Esperando actividad READY (anterior id = {previous_id})...")
        start = time.time()
        while time.time() - start < timeout:
            acts = bonita.search_activity_by_case(case_id=case_id)
            debug("Actividades actuales:", acts)

            if not acts:
                time.sleep(0.5)
                continue

            act = acts[0]

            if act.get("state") == "ready" and act.get("id") != previous_id:
                debug("Actividad lista:", act)
                return act

            time.sleep(0.5)

        raise Exception("Timeout esperando actividad ready")

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
                "username":username,
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
        for i in range(2):
            debug(f"\n--- Ciclo actividad {i+1} ---")
            act = wait_for_ready_activity(bonita, result["caseId"], previous_id=last_id)

            bonita.assign_task(task_id=act["id"], user_id=2)
            bonita.complete_activity(task_id=act["id"])
            last_id = act["id"]

        return {"success": True, "message": "Project submitted successfully"}

    except Exception as e:
        debug("ERROR CAPTURADO:", str(e))
        raise HTTPException(status_code=500, detail={"message": str(e)})


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
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))
