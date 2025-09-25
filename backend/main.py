from fastapi import Body, FastAPI, HTTPException
from pydantic import BaseModel
from bonita_client import BonitaClient

app = FastAPI()
# Inicializa el cliente Bonita con las credenciales de el usuario walter.bates,
# tuve que cambiar la contraseña a bpm desde el cli de bonita
bonita = BonitaClient(
    base_url="http://localhost:8080",  # "http://host.docker.internal:8080" en docker
    username="walter.bates",
    password="bpm",
)


@app.get("/")
def read_root():
    return {"message": "Backend FastAPI funcionando"}


# Endpoint para crear un nuevo proyecto, recibe un dict con
# etapasTotales
@app.post("/proyecto/")
def crear_proyecto(payload: dict = Body(...)):
    try:
        # Consigo el id del proceso, antes era "pool" lo tuve q cambiar en bonita
        process_id = bonita.get_process_id_by_name("Proyecto")
        # Inicio el proceso con las variables, capaz tendriamos q añadir variables?
        # Nombre de ong?Descripcion?etc?
        result = bonita.start_process(
            process_definition_id=process_id, variables=payload
        )
        return {"status": "ok", "process_instance": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
