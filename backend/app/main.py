from fastapi import FastAPI

from app.routers.daily_entries import router as daily_entries_router
from app.routers.tasks import router as tasks_router
from app.routers.activities import router as activities_router
from app.routers.mood import router as mood_router

app = FastAPI(
    title="Daily Quest API",
)

app.include_router(daily_entries_router)
app.include_router(tasks_router)
app.include_router(activities_router)
app.include_router(mood_router)


@app.get("/")
def read_root():
    return {"message": "Daily Quest API is running"}