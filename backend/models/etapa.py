from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from .proyecto import Proyecto
from config.database import Base
import enum

class EstadoEtapa(enum.Enum):
    publicada = "publicada"
    ejecutandose = "ejecutandose"
    terminada = "terminada"

class Etapa(Base):
    __tablename__ = "etapas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False)
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estado = Column(Enum(EstadoEtapa), nullable=False)

    proyecto = relationship("Proyecto", back_populates="proyecto")
    
