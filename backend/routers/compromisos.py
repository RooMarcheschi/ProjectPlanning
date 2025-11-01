from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from config.database import get_db
from services import compromiso_service
from models.compromiso import Compromiso, EstadoCompromiso
from models.etapa import Etapa
from dependencies import get_bonita_client

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/compromisos",
    tags=["Compromisos"]
)

@router.get("/")
def get_all_compromisos(name: str, db: Session = Depends(get_db)):
    return compromiso_service.obtener_compromisos(db=db)

@router.post("/asumir")
def asumir_compromiso(etapa_id: int, db: Session = Depends(get_db),token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    #compromiso = compromiso_service.asumir_compromiso(db=db, etapa_id=etapa_id, contribuyente_id=contribuyente_id)
    bonita = get_bonita_client()
    #Conseguir id del case
    #Setear JWT del user en bonia
    #Setear el compromiso con el etapa_id
    
    #Avanzar las actividades en Bonita 3 veces
    
    return {"message": "Compromiso generado correctamente"}