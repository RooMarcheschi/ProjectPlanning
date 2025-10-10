from config.database import get_db
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from services import user_service
import re
from core.security import get_password_hash as hash_password


router = APIRouter(prefix="/users")


@router.post("/register")
def register_user(user: dict = Body(...), db: Session = Depends(get_db)):
    name: str = user["name"]
    email: str = user["email"]
    password: str = user["password"]
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not name or type(name) != str or name.strip() == "":
        return {"success": False, "message": "Invalid name"}

    if (
        not email
        or type(email) != str
        or email.strip() == ""
        or not re.match(email_regex, email)
    ):
        return {"success": False, "message": "Invalid email"}

    if (
        not password
        or type(password) != str
        or password.strip() == ""
        or len(password) < 6
        or not re.search(r"\d", password)
    ):
        return {"success": False, "message": "Invalid password"}

    # Validacion con BD (el mail no esté registrado)
    if user_service.obtener_usuario_por_email(db, email):
        return {"success": False, "message": "Email already in use"}

    # que el username no este registrado
    if user_service.obtener_usuario_por_username(db, name):
        return {"success": False, "message": "Username already in use"}

    # Subir usuario a BD
    try:
        print(password)  # 123456
        hashed = hash_password(password)
        print(hashed, len(hashed))  # no aparece
        user = User(username=name, password=hashed, email=email)
        nuevo_usuario = user_service.crear_usuario(db, user)
        return {"success": True, "message": "Upload successful"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
