from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from config.database import Base

class Observacion(Base):
    __tablename__ = "observaciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"), nullable=False) 
    id_observante = Column(Integer, ForeignKey("users.id"), nullable=True)
    descripcion = Column(String, nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    resuelto = Column(Boolean, nullable=False, default=False)
    case_id = Column(Integer, nullable=False)
    fecha_resolucion = Column(Date, nullable=False)
    
    proyecto = relationship("Proyecto", back_populates="observaciones")
    observante = relationship("User", back_populates="observaciones")