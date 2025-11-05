from fastapi import HTTPException
from sqlalchemy.orm import Session
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
    return db.query(Observacion).filter(Observacion.id == id, Observacion.id_proyecto == id_proyecto).first()