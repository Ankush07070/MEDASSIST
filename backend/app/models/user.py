import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.appointment import Appointment

from app.database.base import Base
from app.database.mixins import TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        default="patient",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    # ==================================================
    # PATIENT RELATIONSHIPS
    # ==================================================

    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    reports: Mapped[list["Report"]] = relationship(
        "Report",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    chats: Mapped[list["Chat"]] = relationship(
        "Chat",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    # ==================================================
    # DOCTOR PROFILE
    # ==================================================

    doctor_profile: Mapped["Doctor | None"] = relationship(
        "Doctor",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # ==================================================
    # HOSPITAL PROFILE
    # ==================================================

    hospital_profile: Mapped["Hospital | None"] = relationship(
        "Hospital",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )