from pydantic import BaseModel
from datetime import date
from enum import Enum

class EstadoEtapaEnum(str, Enum):
    publicada = "publicada"
    ejecutandose = "ejecutandose"
    terminada = "terminada"

class EtapaCreate(BaseModel):
    titulo: str
    descripcion: str
    fecha_inicio: date
    fecha_fin: date
    id_proyecto: int

    class Config:
        orm_mode = True

class EtapaOut(BaseModel):
    id: int
    id_proyecto: int
    titulo: str
    descripcion: str
    fecha_creacion: date
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoEtapaEnum

    class Config:
        orm_mode = True
