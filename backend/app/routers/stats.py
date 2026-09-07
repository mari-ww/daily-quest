from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry, Task, Activity
from app.services.gamification import ACTIVITY_STAT_REWARD


router = APIRouter(
    prefix="/stats",
    tags=["Stats"],
)


VALID_STATS = {
    "intelligence",
    "physical",
    "creativity",
    "social",
    "mental",
}


@router.get("/month/{year}/{month}")
def get_monthly_stats(
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
        .all()
    )

    entry_ids = [entry.id for entry in entries]

    result = {
        stat: 0
        for stat in VALID_STATS
    }

    if not entry_ids:
        return result

    # -----------------------------------------
    # TASK PROGRESS
    # -----------------------------------------

    tasks = (
        db.query(Task)
        .filter(
            Task.daily_entry_id.in_(entry_ids),
        )
        .all()
    )

    total_by_stat = {
        stat: 0
        for stat in VALID_STATS
    }

    completed_by_stat = {
        stat: 0
        for stat in VALID_STATS
    }

    for task in tasks:
        for task_stat in task.task_stats:
            if task_stat.stat not in VALID_STATS:
                continue

            total_by_stat[task_stat.stat] += 1

            if task.is_completed:
                completed_by_stat[task_stat.stat] += 1

    for stat in VALID_STATS:
        total = total_by_stat[stat]
        completed = completed_by_stat[stat]

        if total > 0:
            result[stat] = round(
                (completed / total) * 100
            )

    # -----------------------------------------
    # REWARD BONUS
    # -----------------------------------------

    completed_activities = (
        db.query(Activity)
        .filter(
            Activity.daily_entry_id.in_(entry_ids),
            Activity.is_completed.is_(True),
            Activity.stat.isnot(None),
        )
        .all()
    )

    for activity in completed_activities:
        if activity.stat not in VALID_STATS:
            continue

        result[activity.stat] += ACTIVITY_STAT_REWARD

    # Stats cannot exceed 100.
    for stat in VALID_STATS:
        result[stat] = min(100, result[stat])

    return result