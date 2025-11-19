from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import User
from models.observacion import Observacion
from services.user_service import obtener_usuario_por_id
from datetime import date


def crear_observacion(db: Session, nueva_observacion: Observacion):
    db.add(nueva_observacion)
    db.commit()
    db.refresh(nueva_observacion)
    return nueva_observacion

def obtener_observaciones(db: Session):
    return db.query(Observacion).all()

def eliminar_observacion(db: Session, observacion_id: int):
    observacion = db.query(Observacion).filter(Observacion.id == observacion_id).first()
    if observacion:
        db.delete(observacion)
        db.commit()
    return observacion

def get_observacion_by_id(id: int, db: Session):
    return db.query(Observacion).filter(Observacion.id == id).first()

def get_observaciones_por_proyecto(id_proyecto: int, db: Session):
    observaciones = (
        db.query(Observacion)
        .join(User, Observacion.id_observante == User.id)
        .filter(Observacion.id_proyecto == id_proyecto, Observacion.resuelto == False)
        .all()
    )

    return [
        {
            "id": obs.id,
            "descripcion": obs.descripcion,
            "fecha_creacion": obs.fecha_creacion,
            "id_proyecto": obs.id_proyecto,
            "id_observante": obs.id_observante,
            "resuelto": obs.resuelto,
            "nombre_observante": obs.observante.username,
        }
        for obs in observaciones
    ]

def get_all_observations(id_proyecto, db: Session):
    return db.query(Observacion).filter(Observacion.id_proyecto == id_proyecto).all()

def resolve_observation(observation_id: int, db: Session):
    observation = get_observacion_by_id(observation_id, db)
    if not observation:
        return
    observation.resuelto = True # type: ignore
    db.commit()
    db.refresh(observation)

def has_unresolved_observations(id_proyecto, db):
    obs = db.query(Observacion).filter(Observacion.id_proyecto == id_proyecto, Observacion.resuelto == False).first()
    return obs is not None
