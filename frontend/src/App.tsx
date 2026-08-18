import { useEffect, useState } from "react"

import {
  completeActivity,
  createActivity,
  createTask,
  deleteTask,
  getActivities,
  getDailyEntry,
  getTasks,
  toggleTask,
  updateTask,
} from "./api/client"

import type {
  Activity,
  ActivityCreate,
  DailyEntry,
  Task,
  TaskCreate,
  TaskUpdate,
} from "./types/planner"

import "./App.css"

function App() {
  const [dailyEntry, setDailyEntry] =
    useState<DailyEntry | null>(null)

  const [tasks, setTasks] = useState<Task[]>([])

  const [newTask, setNewTask] = useState<TaskCreate>({
  title: "",
  scheduled_time: "09:00",
  is_important: false,
  xp_reward: 10,
  stat: "intelligence",
})

const [activities, setActivities] =
  useState<Activity[]>([])

const [newActivity, setNewActivity] =
  useState<ActivityCreate>({
    title: "",
    mana_reward: 10,
    stat: "creativity",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0]

    async function loadDailyEntry() {
      try {
        const data = await getDailyEntry(today)

        const taskData = await getTasks(data.id)

        const activityData = await getActivities(data.id)

        setDailyEntry(data)
        setTasks(taskData)
        setActivities(activityData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDailyEntry()
  }, [])

  async function handleCreateTask(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault()

  if (!dailyEntry || !newTask.title.trim()) {
    return
  }

  try {
    const createdTask = await createTask(
      dailyEntry.id,
      newTask,
    )

    setTasks((currentTasks) =>
      [...currentTasks, createdTask].sort((a, b) =>
        a.scheduled_time.localeCompare(
          b.scheduled_time,
        ),
      ),
    )

    setNewTask({
      title: "",
      scheduled_time: "09:00",
      is_important: false,
      xp_reward: 10,
      stat: "intelligence",
    })
  } catch (error) {
    console.error(error)
  }
}

async function handleToggleTask(taskId: number) {
  try {
    await toggleTask(taskId)

    const updatedDailyEntry = await getDailyEntry(
      dailyEntry!.date,
    )

    const updatedTasks = await getTasks(
      updatedDailyEntry.id,
    )

    setDailyEntry(updatedDailyEntry)
    setTasks(updatedTasks)
  } catch (error) {
    console.error(error)
  }
}

async function handleDeleteTask(taskId: number) {
  try {
    await deleteTask(taskId)

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId,
      ),
    )
  } catch (error) {
    console.error(error)
  }
}

async function handleEditTask(task: Task) {
  const title = window.prompt(
    "Edit task title:",
    task.title,
  )

  if (!title?.trim()) {
    return
  }

  const taskData: TaskUpdate = {
    title: title.trim(),
  }

  try {
    const updatedTask = await updateTask(
      task.id,
      taskData,
    )

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? updatedTask
          : currentTask,
      ),
    )
  } catch (error) {
    console.error(error)
  }
}

async function handleCreateActivity(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault()

  if (!dailyEntry || !newActivity.title.trim()) {
    return
  }

  try {
    const createdActivity = await createActivity(
      dailyEntry.id,
      newActivity,
    )

    setActivities((currentActivities) => [
      ...currentActivities,
      createdActivity,
    ])

    setNewActivity({
      title: "",
      mana_reward: 10,
      stat: "creativity",
    })
  } catch (error) {
    console.error(error)
  }
}

async function handleCompleteActivity(
  activityId: number,
) {
  if (!dailyEntry) {
    return
  }

  try {
    await completeActivity(activityId)

    const updatedDailyEntry =
      await getDailyEntry(dailyEntry.date)

    const updatedActivities =
      await getActivities(updatedDailyEntry.id)

    setDailyEntry(updatedDailyEntry)
    setActivities(updatedActivities)
  } catch (error) {
    console.error(error)
  }
}

  if (loading) {
    return <p>Loading your daily quest...</p>
  }

  if (!dailyEntry) {
    return <p>Could not load today's planner.</p>
  }

  const stats = [
    ["Intelligence", dailyEntry.intelligence],
    ["Physical", dailyEntry.physical],
    ["Creativity", dailyEntry.creativity],
    ["Social", dailyEntry.social],
    ["Mental", dailyEntry.mental],
  ]

  return (
    <main className="app">
      <div className="dashboard">
        <header className="header">
          <h1>Daily Quest</h1>
          <p>{dailyEntry.date}</p>
        </header>

        <div className="top-grid">
          <section className="panel character-panel">
            <div className="character-header">
              <div className="avatar">⚔️</div>

              <div>
                <h2>Level {dailyEntry.level}</h2>
                <p>Your daily adventure awaits.</p>
              </div>
            </div>

            <div className="resource-list">
              <div>
                <div className="resource-label">
                  <span>HP</span>
                  <span>{dailyEntry.hp}/100</span>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill hp"
                    style={{ width: `${dailyEntry.hp}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="resource-label">
                  <span>Mana</span>
                  <span>{dailyEntry.mana}/100</span>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill mana"
                    style={{ width: `${dailyEntry.mana}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="resource-label">
                  <span>XP</span>
                  <span>{dailyEntry.xp % 100}/100</span>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill xp"
                    style={{
                      width: `${dailyEntry.xp % 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="panel stats-panel">
            <h2>Stats</h2>

            <div className="stats-grid">
              {stats.map(([name, value]) => (
                <div
                  className="stat-card"
                  key={name}
                >
                  <span>{name}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <h2>Mood</h2>

            <p className="mood-value">
              {dailyEntry.mood ?? "Not set"}
            </p>
          </section>
        </div>
        <section className="panel schedule-panel">
  <div className="section-header">
    <h2>Today's Schedule</h2>
    <span>{tasks.length} tasks</span>
  </div>

  <form
  className="task-form"
  onSubmit={handleCreateTask}
>
  <input
    type="text"
    placeholder="What is your next quest?"
    value={newTask.title}
    onChange={(event) =>
      setNewTask({
        ...newTask,
        title: event.target.value,
      })
    }
  />

  <input
    type="time"
    value={newTask.scheduled_time}
    onChange={(event) =>
      setNewTask({
        ...newTask,
        scheduled_time: event.target.value,
      })
    }
  />

  <select
    value={newTask.stat}
    onChange={(event) =>
      setNewTask({
        ...newTask,
        stat: event.target.value,
      })
    }
  >
    <option value="intelligence">
      Intelligence
    </option>
    <option value="physical">
      Physical
    </option>
    <option value="creativity">
      Creativity
    </option>
    <option value="social">
      Social
    </option>
    <option value="mental">
      Mental
    </option>
  </select>

  <input
    type="number"
    min="1"
    value={newTask.xp_reward}
    onChange={(event) =>
      setNewTask({
        ...newTask,
        xp_reward: Number(event.target.value),
      })
    }
  />

  <label className="important-label">
    <input
      type="checkbox"
      checked={newTask.is_important}
      onChange={(event) =>
        setNewTask({
          ...newTask,
          is_important: event.target.checked,
        })
      }
    />
    Important
  </label>

  <button type="submit">
    Add Quest
  </button>
</form>

  <div className="schedule">
    {tasks.length === 0 ? (
      <p className="empty-state">
        No tasks planned yet.
      </p>
    ) : (
      tasks.map((task) => (
        <div
  className={`task-item ${
    task.is_completed
      ? "completed"
      : ""
  }`}
  key={task.id}
>
  <input
    type="checkbox"
    checked={task.is_completed}
    onChange={() =>
      handleToggleTask(task.id)
    }
  />
          <span className="task-time">
            {task.scheduled_time}
          </span>

          <div className="task-content">
            <strong>{task.title}</strong>

            <div className="task-meta">
              {task.is_important && (
                <span>Important</span>
              )}

              <span>
                +{task.xp_reward} XP
              </span>

              <span>
                {task.stat}
              </span>
            </div>
          </div>
          <div className="task-actions">
  <button
    type="button"
    onClick={() => handleEditTask(task)}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteTask(task.id)}
  >
    Delete
  </button>
</div>
        </div>
      ))
    )}
  </div>
</section>
<section className="panel activities-panel">
  <div className="section-header">
    <div>
      <h2>Mana Activities</h2>
      <span>Recharge your energy</span>
    </div>
  </div>

  <form
    className="activity-form"
    onSubmit={handleCreateActivity}
  >
    <input
      type="text"
      placeholder="Watch anime, draw, sing..."
      value={newActivity.title}
      onChange={(event) =>
        setNewActivity({
          ...newActivity,
          title: event.target.value,
        })
      }
    />

    <input
      type="number"
      min="1"
      value={newActivity.mana_reward}
      onChange={(event) =>
        setNewActivity({
          ...newActivity,
          mana_reward: Number(event.target.value),
        })
      }
    />

    <select
      value={newActivity.stat}
      onChange={(event) =>
        setNewActivity({
          ...newActivity,
          stat: event.target.value,
        })
      }
    >
      <option value="intelligence">
        Intelligence
      </option>
      <option value="physical">
        Physical
      </option>
      <option value="creativity">
        Creativity
      </option>
      <option value="social">
        Social
      </option>
      <option value="mental">
        Mental
      </option>
    </select>

    <button type="submit">
      Add Activity
    </button>
  </form>

  <div className="activities-list">
    {activities.length === 0 ? (
      <p className="empty-state">
        No mana activities yet.
      </p>
    ) : (
      activities.map((activity) => (
        <div
          className="activity-item"
          key={activity.id}
        >
          <div>
            <strong>{activity.title}</strong>

            <div className="task-meta">
              <span>
                +{activity.mana_reward} Mana
              </span>

              <span>{activity.stat}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleCompleteActivity(activity.id)
            }
          >
            Recharge
          </button>
        </div>
      ))
    )}
  </div>
</section>
      </div>
    </main>
  )
}

export default App