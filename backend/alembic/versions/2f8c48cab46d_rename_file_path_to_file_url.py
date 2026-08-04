"""rename file_path to file_url

Revision ID: 2f8c48cab46d
Revises: 341ff4ff4405
Create Date: 2026-08-04 04:06:28.315085
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "2f8c48cab46d"
down_revision: Union[str, Sequence[str], None] = "341ff4ff4405"
branch_labels = None
depends_on = None


def upgrade() -> None:

    # Rename file_path -> file_url
    op.alter_column(
        "reports",
        "file_path",
        new_column_name="file_url",
    )

    # Increase length and make nullable
    op.alter_column(
        "reports",
        "file_url",
        existing_type=sa.String(length=500),
        type_=sa.String(length=1000),
        nullable=True,
    )

    # Store Cloudinary public_id
    op.add_column(
        "reports",
        sa.Column(
            "cloudinary_public_id",
            sa.String(length=500),
            nullable=True,
        ),
    )


def downgrade() -> None:

    op.drop_column(
        "reports",
        "cloudinary_public_id",
    )

    op.alter_column(
        "reports",
        "file_url",
        existing_type=sa.String(length=1000),
        type_=sa.String(length=500),
        nullable=False,
    )

    op.alter_column(
        "reports",
        "file_url",
        new_column_name="file_path",
    )