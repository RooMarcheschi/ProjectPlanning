from models.observacion import Observacion
from models.proyecto import Proyecto
from models.user import User
from sqlalchemy.orm import Session
from typing import Any


def crear_observacion(db: Session, nueva_observacion: Observacion):
    db.add(nueva_observacion)
    db.commit()
    db.refresh(nueva_observacion)
    return nueva_observacion


def obtener_observaciones(db: Session):
    return db.query(Observacion).all()


def eliminar_observacion(db: Session, observacion_id: int):
    observacion = db.query(Observacion).filter(Observacion.id == observacion_id).first()
    if observacion:
        db.delete(observacion)
        db.commit()
    return observacion


def get_observacion_by_id(id: int, db: Session):
    return db.query(Observacion).filter(Observacion.id == id).first()


def get_observaciones_por_proyecto(id_proyecto: Any, db: Session):
    observaciones = (
        db.query(Observacion)
        .join(User, Observacion.id_observante == User.id)
        .filter(Observacion.id_proyecto == id_proyecto)
        .all()
    )

    return [
        {
            "id": obs.id,
            "descripcion": obs.descripcion,
            "fecha_creacion": obs.fecha_creacion,
            "id_proyecto": obs.id_proyecto,
            "id_observante": obs.id_observante,
            "resuelto": obs.resuelto,
            "nombre_observante": obs.observante.username,
            "fecha_resolucion": obs.fecha_resolucion,
        }
        for obs in observaciones
    ]


def resolve_observation(observation_id: int, db: Session):
    observation = get_observacion_by_id(observation_id, db)
    if not observation:
        return
    observation.resuelto = True  # type: ignore
    db.commit()
    db.refresh(observation)


def has_unresolved_observations(id_proyecto, db):
    obs = (
        db.query(Observacion)
        .filter(Observacion.id_proyecto == id_proyecto, Observacion.resuelto == False)
        .first()
    )
    return obs is not None


def observations_by_user(id_user: int, db: Session):
    resultados = (
        db.query(Observacion, Proyecto)
        .join(Proyecto, Proyecto.id == Observacion.id_proyecto)
        .filter(Observacion.id_observante == id_user)
        .all()
    )

    return [
        {
            "id": obs.id,
            "descripcion": obs.descripcion,
            "fecha_creacion": obs.fecha_creacion,
            "id_proyecto": obs.id_proyecto,
            "nombre_proyecto": proy.titulo,
            "id_observante": obs.id_observante,
            "resuelto": obs.resuelto,
            "fecha_resolucion": obs.fecha_resolucion,
        }
        for obs, proy in resultados
    ]
