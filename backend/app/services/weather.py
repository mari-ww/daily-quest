import httpx


async def get_weather(
    latitude: float,
    longitude: float,
) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,weather_code",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            params=params,
            timeout=10,
        )

        response.raise_for_status()

    data = response.json()

    return {
        "temperature": data["current"]["temperature_2m"],
        "weather_code": data["current"]["weather_code"],
    }