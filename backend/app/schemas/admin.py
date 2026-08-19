from uuid import UUID

from pydantic import BaseModel, Field


class AdminDoctorCreate(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=100,
    )

    email: str

    password: str = Field(
        min_length=6,
    )

    specialization: str
    qualification: str

    experience: int = Field(
        ge=0,
    )

    consultation_fee: float = Field(
        gt=0,
    )

    hospital_id: UUID