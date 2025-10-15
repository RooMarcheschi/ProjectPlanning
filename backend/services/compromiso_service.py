from sqlalchemy.orm import Session
from models.compromiso import Compromiso


def crear_compromiso(db: Session, nuevo_compromiso: Compromiso):
    db.add(nuevo_compromiso)
    db.commit()
    db.refresh(nuevo_compromiso)
    return nuevo_compromiso

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
