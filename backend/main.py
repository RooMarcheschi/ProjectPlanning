from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bonita_client import BonitaClient

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI()
# Inicializa el cliente Bonita con las credenciales de el usuario walter.bates,
# tuve que cambiar la contraseña a bpm desde el cli de bonita
bonita = BonitaClient(
    # http://host.docker.internal:8080 o "http://localhost:8080"
    base_url="http://host.docker.internal:8080",
    username="walter.bates",
    password="bpm",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        # Nombre de ong? Descripcion? etc?
        result = bonita.start_process(
            process_definition_id=process_id, variables=payload
        )
        return {"status": "ok", "process_instance": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/submitProject")
def submit_project(data: dict = Body(...)):
    ong_Name = data["ongName"]
    project_name = data["projectName"]
    amount_stages = data["stagesAmount"]

    if not ong_Name or type(ong_Name) != str or ong_Name.strip() == "":
        return {"success": False, "message": "Invalid ONG name"}

    if not project_name or type(project_name) != str or ong_Name.strip() == "":
        return {"success": False, "message": "Invalid Project name"}

    if not amount_stages or type(amount_stages) != int:
        return {"success": False, "message": "Invalid amount of stages"}

    for i, stage in enumerate(data["stages"]):
        name = stage["name"]
        desc = stage["description"]
        if not name or type(name) != str or name.strip() == "" or not desc or type(desc) != str or desc.strip() == "":
            return {"success": False, "message": f"Error with stage {i+1}"}

    # conexion con BD

    return {"success": True, "message": "Project submitted successfully"}
