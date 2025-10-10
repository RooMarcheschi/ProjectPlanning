from fastapi import APIRouter, Body, Depends, HTTPException, status
from bonita_client import BonitaClient
from sqlalchemy.orm import Session
from services import proyecto_service, etapa_service
from models.proyecto import Proyecto, EstadoProyecto
from models.etapa import Etapa, EstadoEtapa
from datetime import date
from config.database import get_db
from dependencies import get_bonita_client

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])


# Crear un proyecto
@router.post("/crearProyecto")
def crear_proyecto(proyecto: dict = Body(...), db: Session = Depends(get_db)):
    ong_Name = proyecto["ongName"]
    project_name = proyecto["projectName"]
    project_desc = proyecto["projectDesc"]
    amount_stages = proyecto["stagesAmount"]

    # Validaciones

    if not project_name or type(project_name) != str or project_name.strip() == "":
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_name",
                "message": "El nombre del proyecto es inválido",
            },
        )

    if proyecto_service.existe_proyecto_para_ong(db, project_name, ong_Name):
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_name",
                "message": "El nombre del proyecto ya está en uso",
            },
        )

    if not amount_stages or type(amount_stages) != int:
        raise HTTPException(
            status_code=409,
            detail={"field": "amount_stages", "message": "Cantidad de etapas inválida"},
        )

    if not project_desc or type(project_desc) != str or project_desc.strip() == "":
        raise HTTPException(
            status_code=409,
            detail={
                "field": "project_desc",
                "message": "Descripción de proyecto inválida",
            },
        )

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
            raise HTTPException(
                status_code=409,
                detail={
                    "field": "project_desc",
                    "message": f"Error con la etapa {i+1}",
                },
            )

    try:
        # Conexión con Bonita
        bonita = get_bonita_client()
        # Consigo el id del proceso
        process_id = bonita.get_process_id_by_name("Proyecto")
        # Inicio el proceso con las variables
        result = bonita.start_process(process_definition_id=process_id)
        # Seteo las variables del proceso, por ahora solo etaapasTotales
        res = bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="etapasTotales",
            value=amount_stages,
            type_hint="java.lang.Integer",
        )
        # Subir a la db el proyecto
        proy = Proyecto(
            titulo=project_name,
            descripcion=project_desc,
            ong=ong_Name,
            fecha_creacion=date.today(),
            estado=EstadoProyecto.publicado,
            idBonita=result["caseId"],
        )
        nuevo_proyecto = proyecto_service.crear_proyecto(db, proy)
        # Seteo la variable iddb en bonita
        res = bonita.set_case_variable(
            case_id=result["caseId"],
            variable_name="iddb",
            value=nuevo_proyecto.id,
            type_hint="java.lang.Integer",
        )
        # Subir a la db las etapas
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
        raise HTTPException(status_code=500, detail=str(e))
