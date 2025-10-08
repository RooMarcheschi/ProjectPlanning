from config.database import get_db
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
import re

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

    # Subir usuario a BD

    return {"success": True, "message": "Upload successful"}
