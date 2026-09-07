VALID_STATS = {
    "intelligence",
    "physical",
    "creativity",
    "social",
    "mental",
}

TASK_STAT_REWARD = 1
ACTIVITY_STAT_REWARD = 5
XP_STEP = 10


def calculate_level(total_xp: int) -> int:
    return total_xp // 100 + 1


def is_valid_stat(stat: str | None) -> bool:
    return stat in VALID_STATS


def update_hp(
    daily_entry,
    is_important: bool,
    amount: int,
) -> None:
    if is_important:
        daily_entry.hp = max(
            0,
            min(100, daily_entry.hp + amount),
        )