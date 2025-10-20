from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.database import get_db
from services import compromiso_service
from models.compromiso import Compromiso, EstadoCompromiso
from models.etapa import Etapa

router = APIRouter(
    prefix="/compromisos",
    tags=["Compromisos"]
)

@router.get("/")
def get_all_compromisos(name: str, db: Session = Depends(get_db)):
    return compromiso_service.obtener_compromisos(db=db)

@router.post("/asumir")
def asumir_compromiso(etapa_id: int, contribuyente_id: int, db: Session = Depends(get_db)):
    compromiso = compromiso_service.asumir_compromiso(db=db, etapa_id=etapa_id, contribuyente_id=contribuyente_id)

    return {"message": "Compromiso generado correctamente", "compromiso_id": compromiso.id}