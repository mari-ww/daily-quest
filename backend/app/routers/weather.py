from fastapi import APIRouter

from app.services.weather import get_weather


router = APIRouter(
    prefix="/weather",
    tags=["Weather"],
)


@router.get("")
async def get_current_weather(
    latitude: float,
    longitude: float,
):
    return await get_weather(
        latitude,
        longitude,
    )