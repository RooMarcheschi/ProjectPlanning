from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.compromiso import Compromiso, EstadoCompromiso
from models.etapa import EstadoEtapa
from services.etapa_service import get_etapa_by_id
from services.user_service import obtener_usuario_por_id


def crear_compromiso(db: Session, nuevo_compromiso: Compromiso):
    db.add(nuevo_compromiso)
    db.commit()
    db.refresh(nuevo_compromiso)
    return nuevo_compromiso

def asumir_compromiso(db: Session, etapa_id: int, contribuyente_id: int):
    etapa = get_etapa_by_id(etapa_id)

    if not etapa:
        raise HTTPException(status_code=404, detail="Etapa no encontrada")

    compromiso = etapa.compromiso
    if not compromiso:
        raise HTTPException(status_code=404, detail="La etapa no tiene compromiso asociado")

    if compromiso.estado != EstadoCompromiso.libre:
        raise HTTPException(status_code=400, detail="El compromiso ya fue asumido o no está disponible")


    contribuyente = obtener_usuario_por_id(contribuyente_id)
    if not contribuyente:
        raise HTTPException(status_code=404, detail="ONG contribuyente no encontrada")

    compromiso.id_ong_contribuyente = contribuyente.id
    compromiso.estado = EstadoCompromiso.comprometida
    # cambiar fechas de inicio y fin tambien? Las propone la ong duena de la etapa o la contribuyente?
    etapa.estado = EstadoEtapa.cubierta #no es redundante?

    db.commit()
    db.refresh(compromiso)
    db.refresh(etapa)

    return compromiso

def obtener_compromisos(db: Session):
    return db.query(Compromiso).all()

def eliminar_compromiso(db: Session, compromiso_id: int):
    compromiso = db.query(Compromiso).filter(Compromiso.id == compromiso_id).first()
    if compromiso:
        db.delete(compromiso)
        db.commit()
    return compromiso

def get_compromiso_by_id(id: int, db: Session):
    return db.query(Compromiso).filter(Compromiso.id == id).first()
