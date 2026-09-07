"""update task stat reward and mana

Revision ID: 38944bcbf247
Revises: 529be3eda0fd
Create Date: 2026-09-07 15:04:54.397190
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "38944bcbf247"
down_revision: Union[str, Sequence[str], None] = "529be3eda0fd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "tasks",
        sa.Column(
            "stat_reward",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )

    op.alter_column(
        "tasks",
        "stat_reward",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("tasks", "stat_reward")