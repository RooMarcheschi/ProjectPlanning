from sqlalchemy import func
from sqlalchemy.orm import Session
from models.proyecto import Proyecto, EstadoProyecto
from models.user import User
from datetime import date


def get_project_status_stats(db: Session):
    total = db.query(func.count(Proyecto.id)).scalar()
    
    result = {
        estado.value: 0.0
        for estado in EstadoProyecto
    }
    
    if total == 0: return {} #no hay proyectos

    query = (
        db.query(
            Proyecto.estado,
            (func.count(Proyecto.id) * 100.0 / total).label("percentage")
        )
        .group_by(Proyecto.estado)
        .all()
    )

    for estado, percentage in query:
        result[estado.value] = round(percentage, 2)

    return result

def get_users_stats(db: Session): #Cuales son los users que publicaron proyectos y cuales no
    users_with_projects = (
        db.query(User.username)
        .join(Proyecto, User.id == Proyecto.user_id)
        .group_by(User.username)
        .all()
    )

    users_without_projects = (
        db.query(User.username)
        .outerjoin(Proyecto, User.id == Proyecto.user_id)
        .filter(Proyecto.id == None)
        .all()
    )

    return {
        "users_with_projects": [u[0] for u in users_with_projects],
        "users_without_projects": [u[0] for u in users_without_projects]
    }