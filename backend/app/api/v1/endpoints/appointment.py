from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
)
from app.services.appointment_service import AppointmentService

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def book_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AppointmentService(db)

    try:
        return service.book_appointment(
            appointment,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=list[AppointmentResponse],
)
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AppointmentService(db).get_my_appointments(
        current_user
    )


@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse,
)
def cancel_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AppointmentService(db)

    try:
        return service.cancel_appointment(
            appointment_id,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )