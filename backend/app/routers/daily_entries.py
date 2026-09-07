from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry, Task
from app.schemas import DailyEntryResponse


router = APIRouter(
    prefix="/days",
    tags=["Daily Planner"],
)


@router.get(
    "/month/{year}/{month}",
    response_model=list[DailyEntryResponse],
)
def get_monthly_entries(
    year: int,
    month: int,
    db: Session = Depends(get_db),
):
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    entries = (
        db.query(DailyEntry)
        .filter(
            DailyEntry.date >= start_date,
            DailyEntry.date < end_date,
        )
        .order_by(DailyEntry.date)
        .all()
    )

    return entries


@router.get(
    "/{entry_date}",
    response_model=DailyEntryResponse,
)
def get_or_create_daily_entry(
    entry_date: date,
    db: Session = Depends(get_db),
):
    daily_entry = (
        db.query(DailyEntry)
        .filter(DailyEntry.date == entry_date)
        .first()
    )

    if daily_entry is None:
        daily_entry = DailyEntry(
            date=entry_date,
            hp=100,
            mana=100,
        )

        db.add(daily_entry)
        db.commit()
        db.refresh(daily_entry)

    # -----------------------------------------
    # PROCESS PREVIOUS DAY
    # -----------------------------------------

    previous_date = entry_date - timedelta(days=1)

    previous_entry = (
        db.query(DailyEntry)
        .filter(DailyEntry.date == previous_date)
        .first()
    )

    if (
        previous_entry is not None
        and not daily_entry.previous_day_processed
    ):
        incomplete_tasks = (
            db.query(Task)
            .filter(
                Task.daily_entry_id == previous_entry.id,
                Task.is_completed.is_(False),
            )
            .count()
        )

        # 10 HP lost for each unfinished task.
        hp_loss = incomplete_tasks * 10

        daily_entry.hp = max(
            0,
            daily_entry.hp - hp_loss,
        )

        daily_entry.previous_day_processed = True

        db.commit()
        db.refresh(daily_entry)

    return daily_entry