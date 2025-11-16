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


@router.get("/")
def get_all_observaciones(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    return observacion_service.obtener_observaciones(db=db)


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