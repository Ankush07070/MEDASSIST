from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.appointment import AppointmentResponse

from app.core.roles import require_role
from app.database.session import get_db
from app.models.user import User
from app.schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
    DoctorProfileUpdate,
)
from app.services.doctor_service import DoctorService


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"],
)


# =========================================================
# CREATE DOCTOR
# =========================================================

@router.post(
    "",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor(
    doctor: DoctorCreate,
    db: Session = Depends(get_db),
):

    service = DoctorService(db)

    try:
        return service.create_doctor(doctor)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# GET ALL DOCTORS
# =========================================================

@router.get(
    "",
    response_model=list[DoctorResponse],
)
def get_all_doctors(
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_all_doctors()


# =========================================================
# GET AVAILABLE DOCTORS
# =========================================================

@router.get(
    "/available",
    response_model=list[DoctorResponse],
)
def get_available_doctors(
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_available_doctors()


# =========================================================
# GET DOCTORS BY HOSPITAL
# =========================================================

@router.get(
    "/hospital/{hospital_id}",
    response_model=list[DoctorResponse],
)
def get_doctors_by_hospital(
    hospital_id: UUID,
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_doctors_by_hospital(
        hospital_id
    )


# =========================================================
# GET DOCTORS BY SPECIALIZATION
# =========================================================

@router.get(
    "/specialization/{specialization}",
    response_model=list[DoctorResponse],
)
def get_doctors_by_specialization(
    specialization: str,
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_doctors_by_specialization(
        specialization
    )


# =========================================================
# GET MY DOCTOR PROFILE
# =========================================================

@router.get(
    "/me",
    response_model=DoctorResponse,
)
def get_my_profile(
    current_user: User = Depends(
        require_role("doctor")
    ),
    db: Session = Depends(get_db),
):

    service = DoctorService(db)

    try:
        return service.get_my_profile(
            current_user.id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# UPDATE MY DOCTOR PROFILE
# =========================================================

@router.put(
    "/me",
    response_model=DoctorResponse,
)
def update_my_profile(
    data: DoctorProfileUpdate,
    current_user: User = Depends(
        require_role("doctor")
    ),
    db: Session = Depends(get_db),
):

    service = DoctorService(db)

    try:
        return service.update_my_profile(
            current_user.id,
            data.model_dump(exclude_unset=True),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# GET DOCTOR BY ID
# =========================================================

@router.get(
    "/{doctor_id}",
    response_model=DoctorResponse,
)
def get_doctor(
    doctor_id: UUID,
    db: Session = Depends(get_db),
):

    service = DoctorService(db)

    try:
        return service.get_doctor(doctor_id)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


    # checking doctor appointments
@router.get(
    "/me/appointments",
    response_model=list[AppointmentResponse],
)
def get_my_appointments(
    current_user: User = Depends(
        require_role("doctor")
    ),
    db: Session = Depends(get_db),
):

    service = DoctorService(db)

    try:
        return service.get_my_appointments(
            current_user.id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )