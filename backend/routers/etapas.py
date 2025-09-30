from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import etapa_service

router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)
