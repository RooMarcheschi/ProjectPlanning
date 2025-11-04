from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base
import enum

class EstadoCompromiso(enum.Enum):
    libre = "libre"
    comprometida = "compremetida"

class Compromiso():
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_etapa = Column(Integer, ForeignKey("etapas.id"), unique=True, nullable=False)
    id_contribuyente = Column(Integer, ForeignKey("users.id"), nullable=True)
    descripcion = Column(String, nullable=False)
    estado = Column(Enum(EstadoCompromiso), nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

    etapa = relationship("Etapa", back_populates="compromiso", uselist=False)