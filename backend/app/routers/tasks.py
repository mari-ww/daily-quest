from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry, Task
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
        **task_data.model_dump(),
        daily_entry_id=daily_entry_id,
    )

    db.add(task)
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

    for field, value in task_data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(task, field, value)

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

    if task.is_completed:
        task.is_completed = False
        daily_entry.xp = max(
            0,
            daily_entry.xp - task.xp_reward,
        )
    else:
        task.is_completed = True
        daily_entry.xp += task.xp_reward

    daily_entry.level = calculate_level(daily_entry.xp)

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