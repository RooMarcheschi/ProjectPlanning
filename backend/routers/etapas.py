from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services import etapa_service, proyecto_service

router = APIRouter(
    prefix="/etapas",
    tags=["Etapas"]
)

@router.get("/")
def get_all_etapas(name: str, db: Session = Depends(get_db)):
    return etapa_service.get_all_etapas_filter(db=db, ongName=name)

@router.get("/project/{project_id}")
def get_etapas_from_project(project_id: int, db: Session = Depends(get_db)):
    # Esto se deberia hacer con Bonita de intermediario
    proyecto = proyecto_service.obtener_proyecto_por_id(db, project_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Project non existent")
    return {"success": True, "etapas": etapa_service.get_etapas_from_project(db=db, project_id=project_id)}
