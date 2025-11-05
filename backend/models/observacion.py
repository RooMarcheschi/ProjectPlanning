from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Observacion(Base):
    __tablename__ = "observaciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), unique=True, nullable=False) #por ahora solo guarda el id, no apunta a ningun proyecto
    id_observante = Column(Integer, ForeignKey("users.id"), nullable=True)
    descripcion = Column(String, nullable=False)
    fecha_creacion = Column(Date, nullable=False)

    proyecto = relationship("Proyecto", back_populates="observaciones")
    observante = relationship("User", back_populates="observaciones")