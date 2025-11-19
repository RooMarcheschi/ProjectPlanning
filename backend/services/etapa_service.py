from sqlalchemy.orm import Session
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from models.proyecto import Proyecto
from models.user import User
from services.user_service import obtener_usuario_por_username


def crear_etapa(db: Session, nueva_etapa: Etapa):
    db.add(nueva_etapa)
    db.commit()
    db.refresh(nueva_etapa)
    return nueva_etapa


def obtener_etapas(db: Session):
    return db.query(Etapa).all()


def eliminar_etapa(db: Session, etapa_id: int):
    etapa = db.query(Etapa).filter(Etapa.id == etapa_id).first()
    if etapa:
        db.delete(etapa)
        db.commit()
    return etapa


def get_all_etapas_filter(ongName: str, db: Session):
    user = obtener_usuario_por_username(db=db, user_username=ongName)
    if not user:
        return []
    results = (
        db.query(Etapa, User.username)
        .join(User, Etapa.id_user == User.id)
        .filter(Etapa.estado == EstadoEtapa.publicada, Etapa.id_user != user.id)
        .all()
    )
    etapas = []
    for etapa, ong in results:
        etapa.ong = ong
        etapas.append(etapa)
    return etapas


def get_etapas_from_project(db: Session, project_id: int):
    return (
        db.query(Etapa)
        .filter(Etapa.id_proyecto == project_id)
        .all()
    )


def get_etapa_by_id(id: int, db: Session):
    etapa = db.query(Etapa).filter(Etapa.id == id).first()
    if etapa:
        etapa.ong = (
            db.query(Proyecto).filter(Proyecto.id == etapa.id_proyecto).first().ong
        )
    return etapa


def cant_etapas_cubiertas_por_proyecto(db: Session, proyecto_id: int):
    return (
        db.query(Etapa)
        .filter(Etapa.id_proyecto == proyecto_id, Etapa.estado == EstadoEtapa.cubierta)
        .scalar()
        or 0
    )
