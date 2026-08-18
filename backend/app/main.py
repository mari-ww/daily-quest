from fastapi import FastAPI

app = FastAPI(
    title="Daily Gamification Planner API",
)


@app.get("/")
def read_root():
    return {"message": "Daily Gamification Planner API is running"}