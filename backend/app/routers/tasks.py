from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry, Task, TaskStat
from app.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.services.gamification import calculate_level


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "/days/{daily_entry_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    daily_entry_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    daily_entry = db.get(DailyEntry, daily_entry_id)

    if daily_entry is None:
        raise HTTPException(
            status_code=404,
            detail="Daily entry not found",
        )

    task = Task(
        title=task_data.title,
        scheduled_time=task_data.scheduled_time,
        is_important=task_data.is_important,
        xp_reward=task_data.xp_reward,
        daily_entry_id=daily_entry_id,
    )

    db.add(task)
    db.flush()

    for stat in task_data.stats:
        task_stat = TaskStat(
            task_id=task.id,
            stat=stat,
        )
        db.add(task_stat)

    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/days/{daily_entry_id}",
    response_model=list[TaskResponse],
)
def get_tasks(
    daily_entry_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Task)
        .filter(Task.daily_entry_id == daily_entry_id)
        .order_by(Task.scheduled_time)
        .all()
    )


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    update_data = task_data.model_dump(
        exclude_unset=True,
    )

    stats = update_data.pop("stats", None)

    for field, value in update_data.items():
        setattr(task, field, value)

    if stats is not None:
        task.task_stats.clear()

        for stat in stats:
            task.task_stats.append(
                TaskStat(stat=stat)
            )

    db.commit()
    db.refresh(task)

    return task


@router.patch(
    "/{task_id}/toggle",
    response_model=TaskResponse,
)
def toggle_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    daily_entry = task.daily_entry

    # -----------------------------------------
    # UNCOMPLETE TASK
    # -----------------------------------------

    if task.is_completed:
        task.is_completed = False

        # Remove XP previously gained.
        daily_entry.xp = max(
            0,
            daily_entry.xp - task.xp_reward,
        )

        # Refund the MP previously spent.
        daily_entry.mana = min(
            100,
            daily_entry.mana + task.xp_reward,
        )

        # Remove stat points previously gained.
        for task_stat in task.task_stats:
            current_value = getattr(
                daily_entry,
                task_stat.stat,
            )

            setattr(
                daily_entry,
                task_stat.stat,
                max(
                    0,
                    current_value - 1,
                ),
            )

    # -----------------------------------------
    # COMPLETE TASK
    # -----------------------------------------

    else:
        task.is_completed = True

        # XP gained.
        daily_entry.xp += task.xp_reward

        # MP cost is equal to the XP reward.
        daily_entry.mana = max(
            0,
            daily_entry.mana - task.xp_reward,
        )

        # Grant stat points.
        for task_stat in task.task_stats:
            current_value = getattr(
                daily_entry,
                task_stat.stat,
            )

            setattr(
                daily_entry,
                task_stat.stat,
                current_value + 1,
            )

    # Recalculate level after XP changes.
    daily_entry.level = calculate_level(
        daily_entry.xp
    )

    db.commit()
    db.refresh(task)

    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()