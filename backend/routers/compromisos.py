from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import compromiso_service

router = APIRouter(
    prefix="/compromisos",
    tags=["Compromisos"]
)

@router.get("/")
def get_all_compromisos(name: str, db: Session = Depends(get_db)):
    return compromiso_service.obtener_compromisos(db=db)
