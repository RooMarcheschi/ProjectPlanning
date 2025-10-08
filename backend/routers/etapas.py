from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import etapa_service

router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)

@router.get("/")
def get_all_etapas(db: Session = Depends(get_db)):
    return etapa_service.get_all_published_etapas(db)

@router.get("/{id}")
def get_etapa(id: int, db: Session = Depends(get_db)):
    return etapa_service.get_etapa_by_id(id, db)