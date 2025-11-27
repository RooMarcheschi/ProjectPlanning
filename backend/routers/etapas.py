from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services import etapa_service, proyecto_service, user_service
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
import requests
router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
@router.get("/")
def get_all_etapas(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    ''' Obtener todas las etapas excluyendo las de los proyectos de la ONG del usuario '''
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = user_service.obtener_usuario_por_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Obtener los IDs de los proyectos de la ONG
    proyectos_id = proyecto_service.obtener_projectos_id_para_ong(db=db, u_id=user.id)
    # Post para conseguir las etapas del cloud
    url = "https://projectplanning-cloud-yxzf.onrender.com/etapas/excluir-por-proyectos"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    try:
        resp = requests.post(url, json=proyectos_id, headers=headers, timeout=10)
        resp.raise_for_status()
        etapas = resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error consiguiendo las etapas del cloud: {e}")
    return etapas

@router.get("/projecto/{project_id}")
def get_etapas_from_project(project_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # Obtener el usuario a partir del token
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    proyecto = proyecto_service.obtener_proyecto_por_id(db, project_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Project non existent")
    
    # Post para conseguir las etapas del cloud
    url = "https://projectplanning-cloud-yxzf.onrender.com/etapas/proyecto/" + str(project_id) + "/todas"  # reemplaza con la URL destino
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        etapas = resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error consiguiendo las etapas del cloud: {e}")
    return {"success": True, "etapas": etapas}