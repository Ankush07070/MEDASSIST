import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin


class Report(TimestampMixin, Base):
    __tablename__ = "reports"

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

    file_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    file_url: Mapped[str] = mapped_column(
    String(1000),
    nullable=True,
    )
    cloudinary_public_id: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
    )

    report_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    patient: Mapped["User"] = relationship(
        back_populates="reports",
    )
    processing_status: Mapped[str] = mapped_column(
    String(20),
    default="processing",
    nullable=False,
    )