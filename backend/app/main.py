import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import database
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router
from app.routes.habits import router as habits_router


database.init_database()

app = FastAPI(title="AI Habit Tracker API", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def healthcheck():
    return {"status": "ok", "database_url": database.ACTIVE_DATABASE_URL}


app.include_router(auth_router)
app.include_router(habits_router)
app.include_router(analytics_router)
