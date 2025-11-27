import requests
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from sqlalchemy.orm import Session
from datetime import date

from config.database import get_db
from services import consultas_service, user_service

router = APIRouter(prefix="/consultas", tags=["Consultas"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.get("/")
def get_consultas(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    #chequear permisos
    user = user_service.obtener_usuario_por_username(db=db, user_username=username)
    if user.puede_observar == False:
        raise HTTPException(
            status_code=403,
            detail="No tiene permisos para ver las consultas del sistema"
        )
    
    #crear caso en bonita, se me ocurre mandar los resultados y la fecha de cuando se realizo la consulta

    resultado_consultas = {
        "date": date.today(), #devuelve fecha de cuando se hico la consulta
        "get_project_status_stats": consultas_service.get_project_status_stats(db=db), #devuelve un dicc con % de proyectos x estado --> ver como hago para que si hay 0% se devuelva en 0 el estado
        "get_users_stats": consultas_service.get_users_stats(db=db), #devuelve un dicc con listas de users(ong) que publicaron proyectos y cuales no publicaron proyectos
        "get_stages_status_stats": get_cloud_stages_stats(token=token) #devuelve un dicc con % de etapas x estado (lo consulta al cloud)
    }
    return resultado_consultas


def get_cloud_stages_stats(token: str = Depends(oauth2_scheme)):
    try:
        response = requests.get(
            "https://projectplanning-cloud-yxzf.onrender.com/consultas/stages_stats"
            #"http://host.docker.internal:8000/consultas/stages_stats"
            #"http://localhost:8000/consultas/stages_stats",
            #headers={"Authorization": f"Bearer {token}"}
        )
        return response.json() if response.ok else {"error": response.text}
    except Exception as e:
        return {"error": str(e)}
    
    