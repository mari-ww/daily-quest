VALID_STATS = {
    "intelligence",
    "physical",
    "creativity",
    "social",
    "mental",
}


def calculate_level(total_xp: int) -> int:
    return total_xp // 100 + 1


def update_stat(
    daily_entry,
    stat: str | None,
    amount: int,
) -> None:
    if stat in VALID_STATS:
        current_value = getattr(daily_entry, stat)
        setattr(
            daily_entry,
            stat,
            max(0, current_value + amount),
        )


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