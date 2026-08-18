from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date] = mapped_column(Date, unique=True, nullable=False)

    hp: Mapped[int] = mapped_column(Integer, default=100)
    mana: Mapped[int] = mapped_column(Integer, default=50)
    mood: Mapped[str | None] = mapped_column(String(50), nullable=True)

    xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)

    intelligence: Mapped[int] = mapped_column(Integer, default=0)
    physical: Mapped[int] = mapped_column(Integer, default=0)
    creativity: Mapped[int] = mapped_column(Integer, default=0)
    social: Mapped[int] = mapped_column(Integer, default=0)
    mental: Mapped[int] = mapped_column(Integer, default=0)

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
    title: Mapped[str] = mapped_column(String(200), nullable=False)

    scheduled_time: Mapped[str | None] = mapped_column(String(10), nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    is_important: Mapped[bool] = mapped_column(Boolean, default=False)

    xp_reward: Mapped[int] = mapped_column(Integer, default=10)
    stat: Mapped[str | None] = mapped_column(String(50), nullable=True)

    daily_entry_id: Mapped[int] = mapped_column(
        ForeignKey("daily_entries.id"),
        nullable=False,
    )

    daily_entry: Mapped["DailyEntry"] = relationship(
        back_populates="tasks",
    )


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)

    mana_reward: Mapped[int] = mapped_column(Integer, default=10)
    stat: Mapped[str | None] = mapped_column(String(50), nullable=True)

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
    title: Mapped[str] = mapped_column(String(200), nullable=False)

    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    daily_entry_id: Mapped[int] = mapped_column(
        ForeignKey("daily_entries.id"),
        nullable=False,
    )

    daily_entry: Mapped["DailyEntry"] = relationship(
        back_populates="quests",
    )