from sqlalchemy import String, func
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

def obtener_proyecto_por_titulo(db: Session, proyecto_titulo: String):
    return db.query(Proyecto).filter(Proyecto.titulo == proyecto_titulo).first()

def existe_proyecto_para_ong(db: Session, proyecto_titulo: String, nombre_ong: String):
    return db.query(Proyecto).filter(
        Proyecto.ong.ilike(nombre_ong),
        Proyecto.titulo.ilike(proyecto_titulo)
    ).first() is not None
def eliminar_proyecto(db: Session, proyecto_id: int):
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if proyecto:
        db.delete(proyecto)
        db.commit()
    return proyecto