from dependencies import (
    debug,
    get_bonita_client,
    wait_for_any_activity,
    wait_for_ready_activity,
)
from config.database import get_db
from core.security import decode_token
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer
from models.observacion import Observacion
from pydantic import BaseModel
from services import observacion_service, user_service, etapa_service
from sqlalchemy.orm import Session
from services import proyecto_service

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class ObservacionCreate(BaseModel):
    proyecto_id: int
    observante_id: int
    descripcion: str
    case_id: int


@router.post("/generar_case")
def generar_case(token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        bonita = get_bonita_client(username=username)

        process_id = bonita.get_process_id_by_name("CargarObservacion")
        print("Process ID obtenido:", process_id)

        if not process_id:
            raise HTTPException(
                500, detail="Proceso 'CargarObservacion' no encontrado en Bonita"
            )

        result = bonita.start_process(process_definition_id=process_id)
        print("Respuesta Bonita:", result)

        case_id = result.get("caseId") or result.get("id") or result.get("rootCaseId")
        if not case_id:
            raise HTTPException(500, detail=f"Respuesta inesperada de Bonita: {result}")

        return {
            "success": True,
            "message": "Case de observación generado correctamente",
            "case_id": case_id,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating case in Bonita: {str(e)}"
        )

@router.post("/realizar_observacion")
def realizar_observacion(
    obs: ObservacionCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):

    username = decode_token(token)
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    case_id = obs.case_id
    obs = Observacion(
        id_proyecto=obs.proyecto_id,
        id_observante=obs.observante_id,
        descripcion=obs.descripcion,
        fecha_creacion=date.today(),
        fecha_resolucion=date.today() + timedelta(days=5),
        case_id=case_id,
    )
    try:
        observacion = observacion_service.crear_observacion(
            db=db, nueva_observacion=obs
        )
        # Acá es donde debería avanzar el proceso en Bonita
        try:
            bonita = get_bonita_client(username=username)
            bonita.set_case_variable(
                case_id=str(case_id),
                variable_name="hayObservaciones",
                value=True,
                type_hint="java.lang.Boolean",
            )
            activities = wait_for_any_activity(bonita, case_id)
            task1 = activities[0]["id"]

            bonita.assign_task(task_id=task1, user_id=user.id)
            bonita.complete_activity(task_id=task1)
            last_id = task1
            for i in range(1):
                act = wait_for_ready_activity(bonita, case_id, previous_id=last_id)
                bonita.assign_task(task_id=act["id"], user_id=user.id)
                bonita.complete_activity(task_id=act["id"])
                last_id = act["id"]

        except Exception as e:
            debug("No se pudo avanzar el proceso en Bonita:", str(e))
            raise HTTPException(status_code=500, detail="Error with Bonita")

        return {
            "success": True,
            "observacion": observacion,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/eliminar_observacion")
# def eliminar_observacion(
#     observacion_id: int,
#     db: Session = Depends(get_db),
#     token: str = Depends(oauth2_scheme),
# ):
#     username = decode_token(token)
#     user = user_service.obtener_usuario_por_username(db=db, user_username=username)
#     if not user:
#         raise HTTPException(status_code=404, detail="Usuario no encontrado")
#     observacion = observacion_service.eliminar_observacion(
#         db=db, observacion_id=observacion_id
#     )
#     return {
#         "message": "Observacion eliminada correctamente",
#         "observacion_id": observacion.id,
#     }


@router.get("/project_observations")
def get_project_observations(
    project_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})
    try:
        observations = observacion_service.get_observaciones_por_proyecto(
            id_proyecto=project_id, db=db
        )
        return {"success": True, "observations": observations}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})


@router.patch("/resolve_observation")
def patch_resolve_observation(
    observation_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})
    user = user_service.obtener_usuario_por_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    try:
        observacion_service.resolve_observation(observation_id, db)
        # Avanzar en el proceso de Bonita
        observacion = observacion_service.get_observacion_by_id(observation_id, db)
        bonita = get_bonita_client(username=username)
        activities = wait_for_any_activity(bonita, observacion.case_id)
        task1 = activities[0]["id"]
        bonita.assign_task(task_id=task1, user_id=user.id)
        bonita.complete_activity(task_id=task1)
        return {"success": True, "message": "Observation resolved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})

@router.post("/close_case")
def close_case(
    case_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})
    user = user_service.obtener_usuario_por_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    try:
        obs = observacion_service.get_observation_by_caseid(case_id, db)
        if obs:
            raise HTTPException(
                status_code=400,
                detail={"message": "No se puede cerrar el case, hay observaciones pendientes"},
            )
        bonita = get_bonita_client(username=username)

        hayObservaciones = bonita.get_variable_by_case(
            case_id=case_id, variable_name="hayObservaciones"
        )

        print("Valor de hayObservaciones:", hayObservaciones["value"])

        if hayObservaciones["value"] is True:
            raise HTTPException(
                status_code=400,
                detail={"message": "No se puede cerrar el case, hay observaciones pendientes"},
            )

        activities = wait_for_any_activity(bonita, case_id)
        task1 = activities[0]["id"]
        bonita.assign_task(task_id=task1, user_id=user.id)
        bonita.complete_activity(task_id=task1)

        return {"success": True, "message": "Case closed successfully"}

    except HTTPException:
        raise   # ✅ respeta tus errores HTTP reales

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"message": f"Error interno al cerrar el case: {str(e)}"},
        )

@router.get("/user_observations")
def user_observations(
    user_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})
    try:
        my_observations = observacion_service.observations_by_user(user_id, db)
        return {"success": True, "observations": my_observations}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})