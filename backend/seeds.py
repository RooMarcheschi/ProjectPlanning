from datetime import date, timedelta
from models.compromiso import Compromiso, EstadoCompromiso
from services import compromiso_service
from sqlalchemy.orm import Session
from config.database import Base, engine, SessionLocal
from models.user import User
from models.etapa import Etapa, EstadoEtapa
from core.security import get_password_hash as hash_password


def seed_data(db: Session):
    user = User(
        username="walter.bates",
        password=hash_password("123456"),
        email="walter.bates@example.com",
        puede_observar=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    user = User(
        username="william.jobs",
        password=hash_password("123456"),
        email="william.jobs@example.com",
        puede_observar=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    lalo = User(
        username="jan.fisher",
        password=hash_password("123456"),
        email="jan.fisher@example.com",
    )
    db.add(lalo)
    db.commit()
    db.refresh(lalo)
    user = User(
        username="favio.riviera",
        password=hash_password("123456"),
        email="favio.riviera@example.com",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
def main():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()