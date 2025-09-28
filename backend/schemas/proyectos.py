from pydantic import BaseModel
from datetime import date
from enum import Enum

class EstadoProyectoEnum(str, Enum):
    publicado = "publicado"
    ejecutandose = "ejecutandose"
    terminado = "terminado"

class ProyectoCreate(BaseModel):
    titulo: str
    descripcion: str
    
    class Config:
        orm_mode = True

class ProyectoOut(BaseModel):
    id: int
    id_proyecto: int
    titulo: str
    descripcion: str
    fecha_creacion: date
    estado: EstadoProyectoEnum

    class Config:
        orm_mode = True
