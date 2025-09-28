from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import etapa_service
from schemas.etapas import EtapaCreate, EtapaOut

router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)

# Crear una etapa
@router.post("/", response_model=EtapaOut)
def crear_etapa(etapa: EtapaCreate, db: Session = Depends(get_db)):
    return etapa_service.crear_etapa(db, etapa)
