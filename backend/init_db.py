from config.database import Base, engine
from models.proyecto import Proyecto  
from models.etapa import Etapa
from models.user import User
from models.ong import Ong
#from models.compromiso import Compromiso
from seeds import main as seed_main


def init_db():
    print("Borrando todas las tablas!")
    Base.metadata.drop_all(bind=engine)
    print("Creando tablas en la Base de Datos!")
    Base.metadata.create_all(bind=engine)
    print("Se crearon las tablas en la Base de Datos :)")
    print("Insertando datos de prueba (seeds)...")
    seed_main()
    print("Datos de prueba insertados correctamente :)")

init_db()