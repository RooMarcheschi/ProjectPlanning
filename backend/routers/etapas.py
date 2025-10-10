from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import etapa_service

router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)

@router.get("/")
def get_all_etapas(name: str, db: Session = Depends(get_db)):
    return etapa_service.get_all_etapas_filter(db=db, ongName=name)