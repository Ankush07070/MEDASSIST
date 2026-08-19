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

    # ==================================================
    # LINK TO USER ACCOUNT
    # ==================================================

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        unique=True,
        nullable=True,
        index=True,
    )

    # ==================================================
    # DOCTOR PROFILE
    # ==================================================

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

    # ==================================================
    # HOSPITAL
    # ==================================================

    hospital_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("hospitals.id"),
        nullable=False,
        index=True,
    )

    # ==================================================
    # RELATIONSHIPS
    # ==================================================

    user: Mapped["User"] = relationship(
        "User",
        back_populates="doctor_profile",
        uselist=False,
    )

    hospital: Mapped["Hospital"] = relationship(
        "Hospital",
        back_populates="doctors",
    )

    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment",
        back_populates="doctor",
        cascade="all, delete-orphan",
    )