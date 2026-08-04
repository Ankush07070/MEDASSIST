import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin


class Appointment(TimestampMixin, Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id"),
        nullable=False,
    )

    appointment_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="booked",
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    patient: Mapped["User"] = relationship(
    back_populates="appointments"
    )

    doctor: Mapped["Doctor"] = relationship(
    back_populates="appointments"
    )