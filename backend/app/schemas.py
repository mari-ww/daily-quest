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