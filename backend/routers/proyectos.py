from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from services import proyecto_service, etapa_service
from models.proyecto import Proyecto, EstadoProyecto
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from config.database import get_db

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])


# Crear un proyecto
@router.post("/crearProyecto")
def crear_proyecto(proyecto: dict = Body(...), db: Session = Depends(get_db)):
    ong_Name = proyecto["ongName"]
    project_name = proyecto["projectName"]
    project_desc = proyecto["projectDesc"]
    amount_stages = proyecto["stagesAmount"]

    if not ong_Name or type(ong_Name) != str or ong_Name.strip() == "":
        return {"success": False, "message": "Invalid ONG name"}

    if not project_name or type(project_name) != str or project_name.strip() == "":
        return {"success": False, "message": "Invalid Project name"}

    if not amount_stages or type(amount_stages) != int:
        return {"success": False, "message": "Invalid amount of stages"}

    if not project_desc or type(project_desc) != str or project_desc.strip() == "":
        return {"success": False, "message": "Invalid Project description"}

    for i, stage in enumerate(proyecto["stages"]):
        name = stage["name"]
        desc = stage["description"]
        if (
            not name
            or type(name) != str
            or name.strip() == ""
            or not desc
            or type(desc) != str
            or desc.strip() == ""
        ):
            return {"success": False, "message": f"Error with stage {i+1}"}

    try:
        proy = Proyecto(
            titulo=project_name,
            descripcion=project_desc,
            fecha_creacion=date.today(),
            estado=EstadoProyecto.publicado,
        )
        nuevo_proyecto = proyecto_service.crear_proyecto(db, proy)

        for i, stage in enumerate(proyecto["stages"]):
            name = stage["name"]
            desc = stage["description"]
            # tenemos que chequear fecha inicio y fecha fin
            etapa = Etapa(
                id_proyecto=nuevo_proyecto.id,
                titulo=name,
                descripcion=desc,
                fecha_creacion=date.today(),
                fecha_inicio=date.today(),
                fecha_fin=date.today(),
                estado=EstadoEtapa.publicada,
            )
            nueva_etapa = etapa_service.crear_etapa(db, etapa)
        return {"success": True, "message": "Project submitted successfully"}

    except Exception as e:
        return {"success": False, "message": f"Error with db :{e}"}
