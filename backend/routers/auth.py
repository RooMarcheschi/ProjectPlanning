from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from core.security import verify_password, create_access_token, decode_token
from schemas.Token import Token
from config.database import get_db
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from services import user_service
import re

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, form_data.username):
        raise HTTPException(status_code=400, detail="Invalid email")
    user = user_service.obtener_usuario_por_email(db = db, user_email=form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "id": user.id, "name": user.username, "permissions": user.puede_observar}


# @router.get("/me")
# def read_users_me(token: str = Depends(oauth2_scheme)):
#     username = decode_token(token)
#     return {"username": username}
