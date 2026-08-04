"""add cloudinary public id

Revision ID: <NEW_REVISION_ID>
Revises: a54efde6dcef
Create Date: 2026-08-04
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "<NEW_REVISION_ID>"
down_revision: Union[str, Sequence[str], None] = "a54efde6dcef"
branch_labels = None
depends_on = None


def upgrade() -> None:
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