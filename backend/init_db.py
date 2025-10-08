from config.database import Base, engine
from models.proyecto import Proyecto  # Importá todos los modelos para que se registren
from models.etapa import Etapa
from models.user import User
from models.ong import Ong

print("Borrando todas las tablas!")
Base.metadata.drop_all(bind=engine)
print("Creando tablas en la Base de Datos!")
Base.metadata.create_all(bind=engine)
print("Se crearon las tablas en la Base de Datos :)")
