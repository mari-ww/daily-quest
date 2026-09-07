from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date] = mapped_column(Date, unique=True, nullable=False)

    hp: Mapped[int] = mapped_column(Integer, default=100)
    mana: Mapped[int] = mapped_column(Integer, default=100)
    mood: Mapped[str | None] = mapped_column(String(50), nullable=True)

    xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)

    # Mantidos temporariamente para compatibilidade com o banco.
    # O progresso mensal dos stats não será mais baseado nesses campos.
    intelligence: Mapped[int] = mapped_column(Integer, default=0)
    physical: Mapped[int] = mapped_column(Integer, default=0)
    creativity: Mapped[int] = mapped_column(Integer, default=0)
    social: Mapped[int] = mapped_column(Integer, default=0)
    mental: Mapped[int] = mapped_column(Integer, default=0)

    previous_day_processed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="daily_entry",
        cascade="all, delete-orphan",
    )

    activities: Mapped[list["Activity"]] = relationship(
        back_populates="daily_entry",
        cascade="all, delete-orphan",
    )

    quests: Mapped[list["Quest"]] = relationship(
        back_populates="daily_entry",
        cascade="all, delete-orphan",
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    scheduled_time: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    is_important: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    xp_reward: Mapped[int] = mapped_column(
        Integer,
        default=10,
    )

    daily_entry_id: Mapped[int] = mapped_column(
        ForeignKey("daily_entries.id"),
        nullable=False,
    )

    daily_entry: Mapped["DailyEntry"] = relationship(
        back_populates="tasks",
    )

    task_stats: Mapped[list["TaskStat"]] = relationship(
        back_populates="task",
        cascade="all, delete-orphan",
    )

    @property
    def stats(self) -> list[str]:
        return [task_stat.stat for task_stat in self.task_stats]


class TaskStat(Base):
    __tablename__ = "task_stats"

    id: Mapped[int] = mapped_column(primary_key=True)

    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id"),
        nullable=False,
    )

    stat: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    task: Mapped["Task"] = relationship(
        back_populates="task_stats",
    )

class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    mana_reward: Mapped[int] = mapped_column(
        Integer,
        default=10,
    )

    stat: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
    )

    daily_entry_id: Mapped[int] = mapped_column(
        ForeignKey("daily_entries.id"),
        nullable=False,
    )

    daily_entry: Mapped["DailyEntry"] = relationship(
        back_populates="activities",
    )


class Quest(Base):
    __tablename__ = "quests"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    daily_entry_id: Mapped[int] = mapped_column(
        ForeignKey("daily_entries.id"),
        nullable=False,
    )

    daily_entry: Mapped["DailyEntry"] = relationship(
        back_populates="quests",
    )