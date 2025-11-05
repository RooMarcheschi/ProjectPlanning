from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from sqlalchemy.orm import Session
from datetime import date

from config.database import get_db
from services import observacion_service, user_service, etapa_service
from models.observacion import Observacion

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.get("/")
def get_all_observaciones(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    return observacion_service.obtener_observaciones(db=db)


@router.post("/realizar_observacion")
def realizar_observacion(
    proyecto_id: int,
    observante_id: int,
    descripcion: str,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    ):

    username = decode_token(token)
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    obs = Observacion(
        id_proyecto=proyecto_id,
        id_observante=observante_id,
        descripcion=descripcion,
        fecha_creacion=date.today()
    )
    observacion = observacion_service.crear_observacion(
        db=db, nueva_observacion=obs
    )
    
    return {
        "message": "Observacion cargada correctamente.",
        "observacion_id": observacion.id,
    }

@router.post("/eliminar_observacion")
def eliminar_observacion(observacion_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    observacion = observacion_service.eliminar_observacion(db=db, observacion_id=observacion_id)
    return {
        "message": "Observacion eliminada correctamente",
        "observacion_id": observacion.id
    }
