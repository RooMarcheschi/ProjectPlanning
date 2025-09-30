from sqlalchemy import Column, Integer, String, Date, Enum
from sqlalchemy.orm import relationship
from config.database import Base
import enum


class EstadoProyecto(enum.Enum):
    publicado = "publicado"
    ejecutandose = "ejecutandose"
    terminado = "terminado"


class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    estado = Column(Enum(EstadoProyecto), nullable=False)

    etapas = relationship(
        "Etapa", back_populates="proyecto", cascade="all, delete-orphan"
    )
