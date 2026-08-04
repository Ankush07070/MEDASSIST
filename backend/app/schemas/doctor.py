from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DoctorCreate(BaseModel):
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
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )