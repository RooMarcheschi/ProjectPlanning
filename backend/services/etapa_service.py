from sqlalchemy.orm import Session
from models.etapa import Etapa, EstadoEtapa
from schemas.etapas import EtapaCreate
from datetime import date

def crear_etapa(db: Session, etapa: EtapaCreate):
    nueva_etapa = Etapa(nombre=etapa.titulo, 
                            descripcion=etapa.descripcion, 
                            fecha_creacion=date,
                            fecha_inicio=etapa.fecha_inicio, 
                            fecha_fin=etapa.fecha_fin,
                            id_proyecto=etapa.id_proyecto,
                            estado=EstadoEtapa.publicada)
    db.add(nueva_etapa)
    db.commit()
    db.refresh(nueva_etapa)
    return nueva_etapa

def obtener_etapas(db: Session):
    return db.query(Etapa).all()

def obtener_etapa_por_id(db: Session, etapa_id: int):
    return db.query(Etapa).filter(Etapa.id == etapa_id).first()

def eliminar_etapa(db: Session, etapa_id: int):
    etapa = db.query(Etapa).filter(Etapa.id == etapa_id).first()
    if etapa:
        db.delete(etapa)
        db.commit()
    return etapa