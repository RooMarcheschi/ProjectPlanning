from fastapi import Body, FastAPI, HTTPException
from pydantic import BaseModel
from bonita_client import BonitaClient

app = FastAPI()

bonita = BonitaClient(
    base_url="http://localhost:8080", username="walter.bates", password="bpm"
)


@app.get("/")
def read_root():
    return {"message": "Backend FastAPI funcionando"}


class ProyectoRequest(BaseModel):
    etapasTotales: int


@app.post("/proyecto/")
def crear_proyecto(payload: dict = Body(...)):
    try:
        process_id = bonita.get_process_id_by_name("Proyecto")
        result = bonita.start_process(
            process_definition_id=process_id, variables=payload
        )
        return {"status": "ok", "process_instance": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
