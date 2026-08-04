from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class HospitalCreate(BaseModel):
    name: str
    address: str
    city: str
    state: str
    phone: str
    email: EmailStr


class HospitalResponse(BaseModel):
    id: UUID
    name: str
    address: str
    city: str
    state: str
    phone: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )