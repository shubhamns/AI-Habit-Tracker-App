import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker


ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/ai_habit_tracker",
)
FALLBACK_DATABASE_URL = os.getenv("FALLBACK_DATABASE_URL", "sqlite:///./habit_tracker.db")
ACTIVE_DATABASE_URL = DATABASE_URL


def _create_engine(database_url: str):
    engine_kwargs = {"future": True}
    if database_url.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(database_url, **engine_kwargs)


engine = _create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


def init_database():
    global engine, SessionLocal, ACTIVE_DATABASE_URL

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        ACTIVE_DATABASE_URL = DATABASE_URL
    except OperationalError:
        if DATABASE_URL.startswith("sqlite"):
            raise
        engine = _create_engine(FALLBACK_DATABASE_URL)
        SessionLocal.configure(bind=engine)
        ACTIVE_DATABASE_URL = FALLBACK_DATABASE_URL

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
