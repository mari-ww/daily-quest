"""redesign stats system

Revision ID: b1c8772d4047
Revises: 3c96e33c83b2
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1c8772d4047"
down_revision: Union[str, None] = "3c96e33c83b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "task_stats",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("task_id", sa.Integer(), nullable=False),
        sa.Column("stat", sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint(
            ["task_id"],
            ["tasks.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Preserve existing task stats before removing the old columns.
    op.execute(
        """
        INSERT INTO task_stats (task_id, stat)
        SELECT id, stat
        FROM tasks
        WHERE stat IS NOT NULL
        """
    )

    op.add_column(
        "activities",
        sa.Column(
            "is_completed",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
    )

    op.alter_column(
        "activities",
        "is_completed",
        server_default=None,
    )

    op.drop_column("tasks", "stat_reward")
    op.drop_column("tasks", "stat")


def downgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column(
            "stat",
            sa.String(length=50),
            nullable=True,
        ),
    )

    op.add_column(
        "tasks",
        sa.Column(
            "stat_reward",
            sa.Integer(),
            nullable=False,
            server_default="10",
        ),
    )

    op.alter_column(
        "tasks",
        "stat_reward",
        server_default=None,
    )

    op.execute(
        """
        UPDATE tasks
        SET stat = task_stats.stat
        FROM task_stats
        WHERE tasks.id = task_stats.task_id
        """
    )

    op.drop_column("activities", "is_completed")
    op.drop_table("task_stats")