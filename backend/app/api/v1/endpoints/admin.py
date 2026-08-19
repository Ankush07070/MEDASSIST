from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import require_role
from app.database.session import get_db
from app.models.user import User

from app.schemas.admin import AdminDoctorCreate
from app.schemas.doctor import DoctorResponse

from app.schemas.hospital import (
    HospitalCreate,
    HospitalResponse,
)

from app.services.admin_service import AdminService
from app.services.hospital_service import HospitalService


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ==========================================
# CREATE HOSPITAL
# ==========================================

@router.post(
    "/hospitals",
    response_model=HospitalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_hospital(
    hospital: HospitalCreate,

    current_user: User = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db),
):

    try:

        return HospitalService(db).create_hospital(
            hospital
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==========================================
# CREATE DOCTOR
# ==========================================

@router.post(
    "/doctors",
    response_model=DoctorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor(
    data: AdminDoctorCreate,

    current_user: User = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db),
):

    try:

        return AdminService(db).create_doctor(
            data
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )