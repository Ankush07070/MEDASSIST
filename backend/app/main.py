from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.endpoints import auth, users, hospitals, doctor,appointment,reports

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

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