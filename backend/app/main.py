from fastapi import FastAPI

from app.routers.daily_entries import router as daily_entries_router

app = FastAPI(
    title="Daily Quest API",
)

app.include_router(daily_entries_router)


@app.get("/")
def read_root():
    return {"message": "Daily Quest API is running"}