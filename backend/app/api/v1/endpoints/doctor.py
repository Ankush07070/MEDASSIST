from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
)
from app.services.doctor_service import DoctorService

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"],
)


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
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "",
    response_model=list[DoctorResponse],
)
def get_all_doctors(
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_all_doctors()


@router.get(
    "/available",
    response_model=list[DoctorResponse],
)
def get_available_doctors(
    db: Session = Depends(get_db),
):

    return DoctorService(db).get_available_doctors()


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