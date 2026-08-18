from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import DailyEntry, Quest
from app.schemas import (
    QuestCreate,
    QuestResponse,
    QuestUpdate,
)


router = APIRouter(
    prefix="/quests",
    tags=["Quests"],
)


@router.post(
    "/days/{daily_entry_id}",
    response_model=QuestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_quest(
    daily_entry_id: int,
    quest_data: QuestCreate,
    db: Session = Depends(get_db),
):
    daily_entry = db.get(DailyEntry, daily_entry_id)

    if daily_entry is None:
        raise HTTPException(
            status_code=404,
            detail="Daily entry not found",
        )

    quest = Quest(
        title=quest_data.title,
        daily_entry_id=daily_entry_id,
    )

    db.add(quest)
    db.commit()
    db.refresh(quest)

    return quest


@router.get(
    "/days/{daily_entry_id}",
    response_model=list[QuestResponse],
)
def get_quests(
    daily_entry_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(Quest)
        .filter(Quest.daily_entry_id == daily_entry_id)
        .all()
    )


@router.patch(
    "/{quest_id}",
    response_model=QuestResponse,
)
def update_quest(
    quest_id: int,
    quest_data: QuestUpdate,
    db: Session = Depends(get_db),
):
    quest = db.get(Quest, quest_id)

    if quest is None:
        raise HTTPException(
            status_code=404,
            detail="Quest not found",
        )

    for field, value in quest_data.model_dump(
        exclude_unset=True,
    ).items():
        setattr(quest, field, value)

    db.commit()
    db.refresh(quest)

    return quest


@router.delete(
    "/{quest_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_quest(
    quest_id: int,
    db: Session = Depends(get_db),
):
    quest = db.get(Quest, quest_id)

    if quest is None:
        raise HTTPException(
            status_code=404,
            detail="Quest not found",
        )

    db.delete(quest)
    db.commit()