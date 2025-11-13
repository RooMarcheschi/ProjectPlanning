from sqlalchemy import String
from sqlalchemy.orm import Session
from models.user import User

def crear_usuario(db: Session, nuevo_usuario: User):
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def obtener_usuario(db: Session):
    return db.query(User).all()

def obtener_usuario_por_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def obtener_usuario_por_email(db: Session, user_email: str):
    return db.query(User).filter(User.email == user_email).first()

def obtener_usuario_por_username(db: Session, user_username: str):
    return db.query(User).filter(User.username == user_username).first()

def puede_observar_id(db: Session, id:int):
    user = db.query(User).filter(User.id == id).first()
    return user.puede_observar

def eliminar_usuario(db: Session, user_id: int):
    usuario = db.query(User).filter(User.id == user_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()
    return usuario

def user_has_permissions(db: Session, username: str):
    user = obtener_usuario_por_username(db, username)
    return user and bool(user.puede_observar)