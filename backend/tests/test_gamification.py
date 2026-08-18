from types import SimpleNamespace

from app.services.gamification import (
    calculate_level,
    update_hp,
    update_stat,
)


def test_calculate_level():
    assert calculate_level(0) == 1
    assert calculate_level(99) == 1
    assert calculate_level(100) == 2
    assert calculate_level(250) == 3


def test_update_stat_increases_stat():
    daily_entry = SimpleNamespace(
        intelligence=0,
        physical=0,
        creativity=0,
        social=0,
        mental=0,
    )

    update_stat(
        daily_entry,
        "intelligence",
        1,
    )

    assert daily_entry.intelligence == 1


def test_update_stat_never_goes_below_zero():
    daily_entry = SimpleNamespace(
        intelligence=0,
        physical=0,
        creativity=0,
        social=0,
        mental=0,
    )

    update_stat(
        daily_entry,
        "intelligence",
        -1,
    )

    assert daily_entry.intelligence == 0


def test_update_hp_for_important_task():
    daily_entry = SimpleNamespace(hp=90)

    update_hp(
        daily_entry,
        True,
        10,
    )

    assert daily_entry.hp == 100


def test_update_hp_is_limited_to_zero():
    daily_entry = SimpleNamespace(hp=5)

    update_hp(
        daily_entry,
        True,
        -10,
    )

    assert daily_entry.hp == 0


def test_update_hp_ignores_non_important_task():
    daily_entry = SimpleNamespace(hp=50)

    update_hp(
        daily_entry,
        False,
        10,
    )

    assert daily_entry.hp == 50