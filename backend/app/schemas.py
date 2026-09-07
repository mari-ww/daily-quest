from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_STATS = {
    "intelligence",
    "physical",
    "creativity",
    "social",
    "mental",
}


class DailyEntryResponse(BaseModel):
    id: int
    date: date
    hp: int
    mana: int
    mood: str | None
    xp: int
    level: int

    # Mantidos temporariamente para compatibilidade.
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
    xp_reward: int = Field(
        default=10,
        multiple_of=10,
        ge=10,
        le=100,
    )
    stats: list[str] = Field(
        default_factory=list,
        max_length=3,
    )

    @field_validator("stats")
    @classmethod
    def validate_stats(cls, stats: list[str]) -> list[str]:
        if len(stats) != len(set(stats)):
            raise ValueError("A stat cannot be selected more than once.")

        invalid_stats = set(stats) - VALID_STATS

        if invalid_stats:
            raise ValueError(
                f"Invalid stats: {', '.join(sorted(invalid_stats))}"
            )

        return stats


class TaskUpdate(BaseModel):
    title: str | None = None
    scheduled_time: str | None = None
    is_important: bool | None = None
    xp_reward: int | None = Field(
        default=None,
        multiple_of=10,
        ge=10,
        le=100,
    )
    stats: list[str] | None = Field(
        default=None,
        max_length=3,
    )

    @field_validator("stats")
    @classmethod
    def validate_stats(
        cls,
        stats: list[str] | None,
    ) -> list[str] | None:
        if stats is None:
            return None

        if len(stats) != len(set(stats)):
            raise ValueError("A stat cannot be selected more than once.")

        invalid_stats = set(stats) - VALID_STATS

        if invalid_stats:
            raise ValueError(
                f"Invalid stats: {', '.join(sorted(invalid_stats))}"
            )

        return stats


class TaskResponse(BaseModel):
    id: int
    title: str
    scheduled_time: str | None
    is_completed: bool
    is_important: bool
    xp_reward: int
    stats: list[str]
    daily_entry_id: int

    model_config = ConfigDict(from_attributes=True)


class ActivityCreate(BaseModel):
    title: str
    mana_reward: int = Field(
        default=10,
        ge=1,
        le=100,
    )
    stat: str | None = None

    @field_validator("stat")
    @classmethod
    def validate_stat(
        cls,
        stat: str | None,
    ) -> str | None:
        if stat is not None and stat not in VALID_STATS:
            raise ValueError(f"Invalid stat: {stat}")

        return stat


class ActivityResponse(BaseModel):
    id: int
    title: str
    mana_reward: int
    stat: str | None
    is_completed: bool
    daily_entry_id: int

    model_config = ConfigDict(from_attributes=True)


class MoodUpdate(BaseModel):
    mood: str | None = None


class QuestCreate(BaseModel):
    title: str


class QuestUpdate(BaseModel):
    title: str | None = None
    is_completed: bool | None = None


class QuestResponse(BaseModel):
    id: int
    title: str
    is_completed: bool
    daily_entry_id: int

    model_config = ConfigDict(from_attributes=True)