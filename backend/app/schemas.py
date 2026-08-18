from datetime import date

from pydantic import BaseModel, ConfigDict


class DailyEntryResponse(BaseModel):
    id: int
    date: date

    hp: int
    mana: int
    mood: str | None

    xp: int
    level: int

    intelligence: int
    physical: int
    creativity: int
    social: int
    mental: int

    model_config = ConfigDict(from_attributes=True)


class TaskCreate(BaseModel):
    title: str
    scheduled_time: str | None = None
    is_important: bool = False
    xp_reward: int = 10
    stat: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    scheduled_time: str | None = None
    is_important: bool | None = None
    xp_reward: int | None = None
    stat: str | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    scheduled_time: str | None
    is_completed: bool
    is_important: bool
    xp_reward: int
    stat: str | None
    daily_entry_id: int

    model_config = ConfigDict(from_attributes=True)