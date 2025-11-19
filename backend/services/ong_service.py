from sqlalchemy.orm import Session
from models.ong import Ong

def crear_ong(db: Session, nueva_ong: Ong):
    db.add(nueva_ong)
    db.commit()
    db.refresh(nueva_ong)
    return nueva_ong

def obtener_ong(db: Session):
    return db.query(Ong).all()

def obtener_ong_por_id(db: Session, ong_id: int):
    return db.query(Ong).filter(Ong.id == ong_id).first()

def eliminar_ong(db: Session, ong_id: int):
    ong = db.query(Ong).filter(Ong.id == ong_id).first()
    if ong:
        db.delete(ong)
        db.commit()
    return ong