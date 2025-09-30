from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services import proyecto_service, etapa_service
from schemas.proyectos import ProyectoCreate, ProyectoOut
from models.proyecto import Proyecto, EstadoProyecto
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from config.database import get_db as db

router = APIRouter(
    prefix="/proyectos",
    tags=["Proyectos"]
)


# Crear un proyecto
@router.post("/crearProyecto", response_model=ProyectoOut)
def crear_proyecto(proyecto: dict = Body(...)):
    ong_Name = proyecto["ongName"]
    project_name = proyecto["projectName"]
    amount_stages = proyecto["stagesAmount"]

    if not ong_Name or type(ong_Name) != str or ong_Name.strip() == "":
        return {"success": False, "message": "Invalid ONG name"}

    if not project_name or type(project_name) != str or ong_Name.strip() == "":
        return {"success": False, "message": "Invalid Project name"}

    if not amount_stages or type(amount_stages) != int:
        return {"success": False, "message": "Invalid amount of stages"}

    for i, stage in enumerate(proyecto["stages"]):
        name = stage["name"]
        desc = stage["description"]
        if not name or type(name) != str or name.strip() == "" or not desc or type(desc) != str or desc.strip() == "":
            return {"success": False, "message": f"Error with stage {i+1}"}
        
    try:
        proyecto = Proyecto(titulo=project_name, descripcion="", fecha_creacion=date.today(), estado=EstadoProyecto.publicado) 
        proyecto = proyecto_service.crear_proyecto(db, proyecto)

        for i, stage in enumerate(proyecto["stages"]):
            name = stage["name"]
            desc = stage["description"]
            # tenemos que chequear fecha inicio y fecha fin
            etapa = Etapa(id_proyecto=proyecto.id, titulo=name, descripcion=desc, fecha_creacion=date.today(), fecha_inicio=date.today(), fecha_fin=date.today(), estado=EstadoEtapa.publicada)    
            etapa = etapa_service.crear_etapa(db, etapa)
        return {"success": True, "message": "Project submitted successfully"}
    
    except:
        return {"success": False, "message": f"Error with db"}


