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


def get_all_etapas_filter(ongName: str, db: Session):
    all_published_etapas = db.query(Etapa).filter(Etapa.estado == EstadoEtapa.publicada).all()
    not_mine_etapas: list = []
    for etapa in all_published_etapas:
        proyect = db.query(Proyecto).filter(Proyecto.id == etapa.id_proyecto).first().ong
        if proyect != ongName:
            etapa.ong = proyect
            not_mine_etapas.append(etapa)
    return not_mine_etapas

def get_etapa_by_id(id: int, db: Session):
    etapa = db.query(Etapa).filter(Etapa.id == id).first()
    if etapa:
        etapa.ong = db.query(Proyecto).filter(Proyecto.id == etapa.id_proyecto).first().ong
    return etapa

def cant_etapas_cubiertas_por_proyecto(db: Session, proyecto_id: int):
    return (db.query(Etapa).filter(
        Etapa.id_proyecto==proyecto_id,
        Etapa.estado==EstadoEtapa.cubierta
    ).scalar()
    or 0)
