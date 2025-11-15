from sqlalchemy import String, func
from sqlalchemy.orm import Session
from models.proyecto import Proyecto, EstadoProyecto
from models.user import User
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


def obtener_proyecto_por_titulo(db: Session, proyecto_titulo: str):
    return db.query(Proyecto).filter(Proyecto.titulo == proyecto_titulo).first()


def existe_proyecto_para_ong(db: Session, proyecto_titulo: str, u_id: int):
    return (
        db.query(Proyecto)
        .filter(Proyecto.user_id == u_id, Proyecto.titulo.ilike(proyecto_titulo))
        .first()
        is not None
    )


def actualizar_estado_proyecto(db: Session, proyecto_id: int, nuevo_estado: EstadoProyecto):
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if proyecto:
        proyecto.estado = nuevo_estado
        db.commit()
        db.refresh(proyecto)
    return proyecto


def obtener_proyectos_para_ong(db: Session, u_id: int):
    return (
        db.query(Proyecto)
        .filter(Proyecto.user_id == u_id)
        .order_by(Proyecto.id.desc())
        .all()
    )


def obtener_projectos_id_para_ong(db: Session, u_id: int):
    results = (
        db.query(Proyecto.id)
        .filter(Proyecto.user_id == u_id)
        .order_by(Proyecto.id.desc())
        .all()
    )
    return [r[0] for r in results]


def eliminar_proyecto(db: Session, proyecto_id: int):
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if proyecto:
        db.delete(proyecto)
        db.commit()
    return proyecto


def get_all_projects_except_id(db: Session, user_id: int):
    results = (
        db.query(Proyecto, User)
        .join(User, Proyecto.user_id == User.id)
        .filter(Proyecto.user_id != user_id, Proyecto.estado != "terminado")
        .order_by(Proyecto.id.desc())
        .all()
    )

    proyectos = [
        {
            "id": p.id,
            "titulo": p.titulo,
            "descripcion": p.descripcion,
            "estado": p.estado,
            "fecha_creacion": p.fecha_creacion,
            "cant_etapas": p.cant_etapas,
            "user_id": p.user_id,
            "nombre_usuario": u.username,
        }
        for p, u in results
    ]
    return proyectos


def terminar_proyecto(db: Session, proyecto_id: int):
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto:
        return None
    proyecto.estado = EstadoProyecto.terminado
    db.commit()
    db.refresh(proyecto)
    return proyecto
