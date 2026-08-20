from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints import (
    auth,
    users,
    hospitals,
    doctor,
    appointment,
    reports,
    chat,
    admin,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------- #

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} 🚀"
    }


app.include_router(
    auth.router,
    prefix="/api/v1",
)

app.include_router(
    users.router,
    prefix="/api/v1",
)

app.include_router(
    hospitals.router,
    prefix="/api/v1",
)

app.include_router(
    doctor.router,
    prefix="/api/v1",
)

app.include_router(
    appointment.router,
    prefix="/api/v1",
)

app.include_router(
    reports.router,
    prefix="/api/v1",
)

app.include_router(
    chat.router,
    prefix="/api/v1",
)
app.include_router(
    admin.router,
    prefix="/api/v1",
)