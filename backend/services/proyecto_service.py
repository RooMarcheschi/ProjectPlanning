from sqlalchemy.orm import Session
from models.proyecto import Proyecto, EstadoProyecto
from datetime import date

def crear_proyecto(db: Session, nuevo_proyecto: Proyecto):
    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    return nuevo_proyecto

def obtener_proyectos(db: Session):
    return db.query(Proyecto).all()

def obtener_proyecto_por_id(db: Session, proyecto_id: int):
    return db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()

def eliminar_proyecto(db: Session, proyecto_id: int):
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if proyecto:
        db.delete(proyecto)
        db.commit()
    return proyecto