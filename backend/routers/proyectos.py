from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import proyecto_service
from schemas.proyectos import ProyectoCreate, ProyectoOut

router = APIRouter(
    prefix="/proyectos",
    tags=["Proyectos"]
)

# Crear un proyecto
@router.post("/", response_model=ProyectoOut)
def crear_proyecto(proyecto: ProyectoCreate, db: Session = Depends(get_db)):
    return proyecto_service.crear_proyecto(db, proyecto)
