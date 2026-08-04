"""make file_url nullable

Revision ID: a54efde6dcef
Revises: 2f8c48cab46d
Create Date: 2026-08-04
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "a54efde6dcef"
down_revision: Union[str, Sequence[str], None] = "2f8c48cab46d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Make file_url nullable
    op.alter_column(
        "reports",
        "file_url",
        existing_type=sa.String(length=1000),
        nullable=True,
    )

    # Add Cloudinary public id
    op.add_column(
        "reports",
        sa.Column(
            "cloudinary_public_id",
            sa.String(length=500),
            nullable=True,
        ),
    )


def downgrade() -> None:
    # Remove Cloudinary public id
    op.drop_column(
        "reports",
        "cloudinary_public_id",
    )

    # Make file_url NOT NULL again
    op.alter_column(
        "reports",
        "file_url",
        existing_type=sa.String(length=1000),
        nullable=False,
    )