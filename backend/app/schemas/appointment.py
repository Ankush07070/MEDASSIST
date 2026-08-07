from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AppointmentCreate(BaseModel):
    doctor_id: UUID

    appointment_time: datetime

    reason: str = Field(
        min_length=5,
        max_length=500,
    )


class DoctorAppointmentInfo(BaseModel):
    id: UUID
    full_name: str
    specialization: str
    qualification: str
    experience: int
    consultation_fee: float
    is_available: bool
    hospital_id: UUID

    model_config = ConfigDict(
        from_attributes=True
    )


class AppointmentResponse(BaseModel):
    id: UUID
    patient_id: UUID
    doctor_id: UUID

    doctor: DoctorAppointmentInfo

    appointment_time: datetime
    status: str
    reason: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )