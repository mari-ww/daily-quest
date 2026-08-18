from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry
from app.schemas import DailyEntryResponse, MoodUpdate


router = APIRouter(
    prefix="/days",
    tags=["Mood"],
)


@router.patch(
    "/{daily_entry_id}/mood",
    response_model=DailyEntryResponse,
)
def update_mood(
    daily_entry_id: int,
    mood_data: MoodUpdate,
    db: Session = Depends(get_db),
):
    daily_entry = db.get(DailyEntry, daily_entry_id)

    if daily_entry is None:
        raise HTTPException(
            status_code=404,
            detail="Daily entry not found",
        )

    daily_entry.mood = mood_data.mood

    db.commit()
    db.refresh(daily_entry)

    return daily_entry