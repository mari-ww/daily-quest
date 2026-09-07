from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Activity, DailyEntry
from app.schemas import ActivityCreate, ActivityResponse
from app.services.gamification import (
    ACTIVITY_STAT_REWARD,
    is_valid_stat,
)


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

    if not is_valid_stat(activity_data.stat):
        raise HTTPException(
            status_code=400,
            detail="Invalid stat",
        )

    activity = Activity(
        title=activity_data.title,
        mana_reward=activity_data.mana_reward,
        stat=activity_data.stat,
        daily_entry_id=daily_entry_id,
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
        .order_by(Activity.created_at)
        .all()
    )


@router.patch(
    "/{activity_id}/complete",
    response_model=ActivityResponse,
)
def complete_activity(
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

    # -----------------------------------------
    # UNCOMPLETE REWARD
    # -----------------------------------------

    if activity.is_completed:
        activity.is_completed = False

        # Remove the Mana restored by the reward.
        daily_entry.mana = max(
            0,
            daily_entry.mana - activity.mana_reward,
        )

        # Remove the stat points granted by the reward.
        if activity.stat and is_valid_stat(activity.stat):
            current_value = getattr(
                daily_entry,
                activity.stat,
            )

            setattr(
                daily_entry,
                activity.stat,
                max(
                    0,
                    current_value - ACTIVITY_STAT_REWARD,
                ),
            )

    # -----------------------------------------
    # COMPLETE REWARD
    # -----------------------------------------

    else:
        activity.is_completed = True

        # Restore Mana.
        daily_entry.mana = min(
            100,
            daily_entry.mana + activity.mana_reward,
        )

        # Grant stat points.
        if activity.stat and is_valid_stat(activity.stat):
            current_value = getattr(
                daily_entry,
                activity.stat,
            )

            setattr(
                daily_entry,
                activity.stat,
                current_value + ACTIVITY_STAT_REWARD,
            )

    db.commit()
    db.refresh(activity)

    return activity


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

    db.delete(activity)
    db.commit()