from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from config.database import Base

class Ong(Base):
    __tablename__ = "ongs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String(100), nullable=False)
    #id_user = Column(Integer, ForeignKey("users.id"), unique=True)

    #user =  relationship("User", back_populates="ong")
    #proyectos = relationship("Proyecto", back_populates="ong", cascade="all, delete-orphan")
    
    
def __repr__(self):
    return f"<Ong(id='{self.id}', nombre='{self.nombre}', descripcion='{self.descripcion}')>"
