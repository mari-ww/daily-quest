"""add previous day processing

Revision ID: 3c96e33c83b2
Revises: 38944bcbf247
Create Date: 2026-09-07 15:12:00.552420
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3c96e33c83b2"
down_revision: Union[str, Sequence[str], None] = "38944bcbf247"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "daily_entries",
        sa.Column(
            "previous_day_processed",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
    )

    op.alter_column(
        "daily_entries",
        "previous_day_processed",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "daily_entries",
        "previous_day_processed",
    )