from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.hospital import (
    HospitalCreate,
    HospitalResponse,
)
from app.services.hospital_service import HospitalService

router = APIRouter(
    prefix="/hospitals",
    tags=["Hospitals"],
)


@router.post(
    "",
    response_model=HospitalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_hospital(
    hospital: HospitalCreate,
    db: Session = Depends(get_db),
):

    service = HospitalService(db)

    return service.create_hospital(
        hospital
    )





@router.get(
    "",
    response_model=list[HospitalResponse],
)
def get_hospitals(
    city: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):

    service = HospitalService(db)

    if search:
        return service.search_hospitals(
            search
        )

    if city:
        return service.get_hospitals_by_city(
            city
        )

    return service.get_all_hospitals()



# GET HOSPITAL BY ID


@router.get(
    "/{hospital_id}",
    response_model=HospitalResponse,
)
def get_hospital(
    hospital_id: str,
    db: Session = Depends(get_db),
):

    service = HospitalService(db)

    try:

        return service.get_hospital(
            hospital_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )