from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.hospital import HospitalResponse


class DoctorCreate(BaseModel):
    user_id: UUID
    full_name: str = Field(min_length=2, max_length=100)
    specialization: str
    qualification: str
    experience: int = Field(ge=0)
    consultation_fee: float = Field(gt=0)
    hospital_id: UUID


class DoctorResponse(BaseModel):
    id: UUID
    full_name: str
    specialization: str
    qualification: str
    experience: int
    consultation_fee: float
    is_available: bool
    hospital_id: UUID
    hospital: HospitalResponse
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

class DoctorProfileUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    specialization: str | None = None

    qualification: str | None = None

    experience: int | None = Field(
        default=None,
        ge=0,
    )

    consultation_fee: float | None = Field(
        default=None,
        gt=0,
    )

    is_available: bool | None = None


class DoctorAppointmentResponse(BaseModel):
    id: UUID
    patient_id: UUID
    doctor_id: UUID
    appointment_time: datetime
    status: str
    reason: str

    model_config = ConfigDict(
        from_attributes=True
    )