from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.core.roles import require_role
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
    current_user: User = Depends(require_role("patient")),
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
    current_user: User = Depends(require_role("patient")),
):
    return AppointmentService(db).get_my_appointments(
        current_user
    )


@router.get(
    "/doctor/me",
    response_model=list[AppointmentResponse],
)
def get_doctor_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("doctor")
    ),
):

    try:
        return AppointmentService(
            db
        ).get_doctor_appointments(
            current_user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse,
)
def cancel_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    service = AppointmentService(db)

    try:
        return service.cancel_appointment(
            appointment_id,
            current_user,
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch(
    "/{appointment_id}/confirm",
    response_model=AppointmentResponse,
)
def confirm_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("doctor")
    ),
):

    service = AppointmentService(db)

    try:
        return service.update_appointment_status(
            appointment_id,
            current_user,
            "confirmed",
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch(
    "/{appointment_id}/reject",
    response_model=AppointmentResponse,
)
def reject_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("doctor")
    ),
):

    service = AppointmentService(db)

    try:
        return service.update_appointment_status(
            appointment_id,
            current_user,
            "rejected",
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch(
    "/{appointment_id}/complete",
    response_model=AppointmentResponse,
)
def complete_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("doctor")
    ),
):

    service = AppointmentService(db)

    try:
        return service.update_appointment_status(
            appointment_id,
            current_user,
            "completed",
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )