from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    email = Column(String, nullable=False, unique=True)

    #ong = relationship("Ong", back_populates="user", uselist=False)

    
def __repr__(self):
    return f"<User(id='{self.id}', username='{self.username}', email='{self.email}')>"
