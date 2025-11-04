from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_token
from config.database import get_db
from services import compromiso_service
from models.compromiso import Compromiso, EstadoCompromiso
from models.etapa import Etapa
from dependencies import get_bonita_client
from services import proyecto_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/compromisos",
    tags=["Compromisos"]
)

@router.get("/")
def get_all_compromisos(name: str, db: Session = Depends(get_db)):
    return compromiso_service.obtener_compromisos(db=db)

@router.post("/asumir")
def asumir_compromiso(payload: dict, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    etapa_id: int = payload["etapa_id"]
    proyecto_id: int = payload["proyecto_id"]
    username = decode_token(token)
    # if not username:
    #     raise
    #compromiso = compromiso_service.asumir_compromiso(db=db, etapa_id=etapa_id, contribuyente_id=contribuyente_id)
    bonita = get_bonita_client()
    proyecto = proyecto_service.obtener_proyecto_por_id(db, proyecto_id)
    #Conseguir id del case
    case = bonita.get_case_by_id(case_id=proyecto.idBonita)
    #Setear JWT del user en bonia
    bonita.set_case_variable(
        case_id=case["id"],
        variable_name="jwt",
        value=token,
        type_hint="java.lang.String"
    )
    #Setear el compromiso con el etapa_id
    bonita.set_case_variable(
        case_id=case["id"],
        variable_name="compromiso",
        value=etapa_id,
        type_hint="java.lang.Integer"
    )   
    #Avanzar las actividades en Bonita 1 vez
    activity = bonita.search_activity_by_case(case_id=case["id"])
    task = activity[0]["id"]
    while activity[0]["state"] != "ready":
        activity = bonita.search_activity_by_case(case_id=case["id"])
    bonita.assign_task(task_id=task, user_id=1)
    res = bonita.complete_activity(task_id=task)
    return {"success": True,"message": "Compromiso generado correctamente"}