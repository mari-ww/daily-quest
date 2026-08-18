import type {
  DailyEntry,
  Task,
  TaskCreate,
  TaskUpdate,
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

export async function createTask(
  dailyEntryId: number,
  task: TaskCreate,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/days/${dailyEntryId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  return response.json()
}

export async function toggleTask(
  taskId: number,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/toggle`,
    {
      method: "PATCH",
    },
  )

  if (!response.ok) {
    throw new Error("Failed to toggle task")
  }

  return response.json()
}

export async function updateTask(
  taskId: number,
  task: TaskUpdate,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to update task")
  }

  return response.json()
}

export async function deleteTask(
  taskId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    },
  )

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
}