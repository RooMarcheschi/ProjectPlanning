from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from config.database import get_db
from dependencies import get_bonita_client
from services import proyecto_service
from pydantic import BaseModel
import requests

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/compromisos", tags=["Compromisos"])

# @router.get("/")
# def get_all_compromisos(name: str, db: Session = Depends(get_db)):
#     return compromiso_service.obtener_compromisos(db=db)

class CompromisoPayload(BaseModel):
    etapa_id: int
    proyecto_id: int

class TerminarCompromisoIn(BaseModel):
    proyecto_id: int
    compromiso_id: int

@router.post("/asumir")
def asumir_compromiso(
    payload: CompromisoPayload,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    etapa_id: int = payload.etapa_id
    proyecto_id: int = payload.proyecto_id
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        bonita = get_bonita_client()
        proyecto = proyecto_service.obtener_proyecto_por_id(db, proyecto_id)
        # Conseguir id del case
        case = bonita.get_case_by_id(case_id=proyecto.idBonita)
        # Setear JWT del user en bonia
        bonita.set_case_variable(
            case_id=case["id"],
            variable_name="jwt",
            value=token,
            type_hint="java.lang.String",
        )
        # Setear el compromiso con el etapa_id
        bonita.set_case_variable(
            case_id=case["id"],
            variable_name="compromiso",
            value=etapa_id,
            type_hint="java.lang.Integer",
        )
        # Avanzar las actividades en Bonita 1 vez
        # Coom me fijo si anda o no  de bonita al cloud, por ejemplo si esta apagado el cloud
        activity = bonita.search_activity_by_case(case_id=case["id"])
        task = activity[0]["id"]
        while activity[0]["state"] != "ready":
            activity = bonita.search_activity_by_case(case_id=case["id"])
        bonita.assign_task(
            task_id=task, user_id=1
        )  # Asignar la tarea al usuario ni siquiera es walter.bates ese como arreglamos?
        res = bonita.complete_activity(task_id=task)
        print(f"RES:{res}")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error communicating with Bonita: " + str(e)
        )
    return {"success": True, "message": "Compromiso generado correctamente"}


@router.post("/terminar/")
def terminar_compromiso(
    data: TerminarCompromisoIn,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    proyecto_id = data.proyecto_id
    compromiso_id = data.compromiso_id
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        bonita = get_bonita_client()
        proyecto = proyecto_service.obtener_proyecto_por_id(db, proyecto_id)
        # Conseguir id del case
        case = bonita.get_case_by_id(case_id=proyecto.idBonita)
        # Setear JWT del user en bonia
        bonita.set_case_variable(
            case_id=case["id"],
            variable_name="jwt",
            value=token,
            type_hint="java.lang.String",
        )
        # Setear el compromiso con el etapa_id
        bonita.set_case_variable(
            case_id=case["id"],
            variable_name="compromiso",
            value=compromiso_id,
            type_hint="java.lang.Integer",
        )
        # Avanzar las actividades en Bonita 1 vez
        # Coom me fijo si anda o no  de bonita al cloud, por ejemplo si esta apagado el cloud
        activity = bonita.search_activity_by_case(case_id=case["id"])
        task = activity[0]["id"]
        while activity[0]["state"] != "ready":
            activity = bonita.search_activity_by_case(case_id=case["id"])
        bonita.assign_task(
            task_id=task, user_id=1
        )  # Asignar la tarea al usuario ni siquiera es walter.bates ese como arreglamos?
        res = bonita.complete_activity(task_id=task)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Error communicating with Bonita: " + str(e)
        )
    return {
        "success": True,
        "message": "Compromiso terminado correctamente",
        "compromiso_id": compromiso_id,
    }


@router.get("/my_compromisos")
def get_my_compromisos(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):
    username = decode_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    url = "https://projectplanning-cloud.onrender.com/compromisos/usuario/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        compromisos = resp.json()
        for compromiso in compromisos:
            proyecto = proyecto_service.obtener_proyecto_por_id(db, compromiso["id_proyecto"])
            compromiso["titulo_proyecto"] = proyecto.titulo
        return {"success": True, "compromisos": compromisos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
