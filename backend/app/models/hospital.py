import uuid

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin


class Hospital(TimestampMixin, Base):
    __tablename__ = "hospitals"

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
    # HOSPITAL PROFILE
    # ==================================================

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )

    address: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    # ==================================================
    # RELATIONSHIPS
    # ==================================================

    user: Mapped["User"] = relationship(
        "User",
        back_populates="hospital_profile",
        uselist=False,
    )

    doctors: Mapped[list["Doctor"]] = relationship(
        "Doctor",
        back_populates="hospital",
        cascade="all, delete-orphan",
    )