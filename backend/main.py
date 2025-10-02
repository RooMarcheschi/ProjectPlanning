from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bonita_client import BonitaClient
from routers import proyectos, etapas


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI()

# routers
app.include_router(proyectos.router)
app.include_router(etapas.router)

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
