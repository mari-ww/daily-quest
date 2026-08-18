import type {
  DailyEntry,
  Task,
} from "../types/planner"

const API_URL = "http://localhost:8000"

export async function getDailyEntry(
  date: string,
): Promise<DailyEntry> {
  const response = await fetch(
    `${API_URL}/days/${date}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch daily entry")
  }

  return response.json()
}

export async function getTasks(
  dailyEntryId: number,
): Promise<Task[]> {
  const response = await fetch(
    `${API_URL}/tasks/days/${dailyEntryId}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}