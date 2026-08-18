from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry
from app.schemas import DailyEntryResponse


router = APIRouter(
    prefix="/days",
    tags=["Daily Planner"],
)


@router.get("/{entry_date}", response_model=DailyEntryResponse)
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
        daily_entry = DailyEntry(date=entry_date)
        db.add(daily_entry)
        db.commit()
        db.refresh(daily_entry)

    return daily_entry