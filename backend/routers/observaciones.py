from dependencies import debug, get_bonita_client, wait_for_any_activity, wait_for_ready_activity
from config.database import get_db
from core.security import decode_token
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer
from models.observacion import Observacion
from pydantic import BaseModel
from services import observacion_service, user_service, etapa_service
from sqlalchemy.orm import Session

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class ObservacionCreate(BaseModel):
    proyecto_id: int
    observante_id: int
    descripcion: str

@router.post("/generar_case")
def generar_case(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        bonita = get_bonita_client()
        process_id = bonita.get_process_id_by_name("CargarObservacion")


        result = bonita.start_process(process_definition_id=process_id)
        
        #Cargar 
        return {"success": True, "message": "Case de observacion generado correctamente", "case_id": result["caseId"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating case in Bonita: " + str(e))
    
@router.get("/")
def get_all_observaciones(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    return observacion_service.obtener_observaciones(db=db)

@router.post("/cancelar_observacion")
def cancelar_observacion(
    case_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_token(token)
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    try:
        bonita = get_bonita_client()
        activities = wait_for_any_activity(bonita, case_id)
        task1 = activities[0]["id"]
        bonita.assign_task(task_id=task1, user_id=1)
        bonita.complete_activity(task_id=task1)
        return {"success": True, "message": "Observacion cancelada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})

@router.post("/realizar_observacion")
def realizar_observacion(
    obs: ObservacionCreate,
    case_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):

    username = decode_token(token)
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    obs = Observacion(
        id_proyecto=obs.proyecto_id,
        id_observante=obs.observante_id,
        descripcion=obs.descripcion,
        fecha_creacion=date.today(),
    )
    try:
        observacion = observacion_service.crear_observacion(
            db=db, nueva_observacion=obs
        )
        # Acá es donde debería avanzar el proceso en Bonita
        try:
            bonita = get_bonita_client()
            bonita.set_case_variable(
            case_id=case_id,
            variable_name="hayObservaciones",
            value=True,
            type_hint="java.lang.Boolean",
            )
            activities = wait_for_any_activity(bonita, case_id)
            task1 = activities[0]["id"]

            bonita.assign_task(task_id=task1, user_id=1)
            bonita.complete_activity(task_id=task1)
            last_id = task1
            for i in range(2):
                act = wait_for_ready_activity(bonita, case_id, previous_id=last_id)
                bonita.assign_task(task_id=act["id"], user_id=2)
                bonita.complete_activity(task_id=act["id"])
                last_id = act["id"]
        except Exception as e:
            debug("No se pudo avanzar el proceso en Bonita:", str(e))
            
        return {
            "success": True,
            "observacion": observacion,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})

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
def patch_resolve_observation(observation_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail={"message": "Invalid token"})
    try:
        observacion_service.resolve_observation(observation_id, db)
        # Avanzar en el proceso de Bonita
        return {"success": True, "message": "Observation resolved" }
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": str(e)})