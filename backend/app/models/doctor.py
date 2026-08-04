import uuid

from sqlalchemy import String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin


class Doctor(TimestampMixin, Base):
    __tablename__ = "doctors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    specialization: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    qualification: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    experience: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    consultation_fee: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    hospital_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("hospitals.id"),
        nullable=False,
    )

    hospital = relationship(
        "Hospital",
        back_populates="doctors",
    )
    appointments: Mapped[list["Appointment"]] = relationship(
    back_populates="doctor",
    cascade="all, delete-orphan",
)