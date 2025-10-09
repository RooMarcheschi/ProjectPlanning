from sqlalchemy.orm import Session
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from models.proyecto import Proyecto


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


def get_all_published_etapas(db: Session):
    etapas = db.query(Etapa).filter(Etapa.estado == EstadoEtapa.publicada).all()
    for etapa in etapas:
        etapa.ong = db.query(Proyecto).filter(Proyecto.id == etapa.id_proyecto).first().ong
    return etapas

def get_etapa_by_id(id: int, db: Session):
    etapa = db.query(Etapa).filter(Etapa.id == id).first()
    if etapa:
        etapa.ong = db.query(Proyecto).filter(Proyecto.id == etapa.id_proyecto).first().ong
    return etapa