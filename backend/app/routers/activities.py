from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Activity, DailyEntry
from app.schemas import ActivityCreate, ActivityResponse


router = APIRouter(
    prefix="/activities",
    tags=["Activities"],
)


@router.post(
    "/days/{daily_entry_id}",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_activity(
    daily_entry_id: int,
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
):
    daily_entry = db.get(DailyEntry, daily_entry_id)

    if daily_entry is None:
        raise HTTPException(
            status_code=404,
            detail="Daily entry not found",
        )

    activity = Activity(
        **activity_data.model_dump(),
        daily_entry_id=daily_entry_id,
    )

    daily_entry.mana = min(
        100,
        daily_entry.mana + activity.mana_reward,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


@router.get(
    "/days/{daily_entry_id}",
    response_model=list[ActivityResponse],
)
def get_activities(
    daily_entry_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Activity)
        .filter(Activity.daily_entry_id == daily_entry_id)
        .all()
    )


@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
):
    activity = db.get(Activity, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=404,
            detail="Activity not found",
        )

    daily_entry = activity.daily_entry

    daily_entry.mana = max(
        0,
        daily_entry.mana - activity.mana_reward,
    )

    db.delete(activity)
    db.commit()