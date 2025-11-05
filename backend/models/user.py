from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    email = Column(String, nullable=False, unique=True)
    puede_observar = Column(Boolean, default=False)

    proyectos = relationship("Proyecto", back_populates="user", cascade="all, delete-orphan")
    observaciones = relationship("Observacion", back_populates="observante")

    

def __repr__(self):
    return f"<User(id='{self.id}', username='{self.username}', email='{self.email}')>"
