import { useEffect, useState } from "react"

import {
  completeActivity,
  createActivity,
  createQuest,
  createTask,
  deleteTask,
  getActivities,
  getDailyEntry,
  getQuests,
  getTasks,
  getWeather,
  updateQuest,
  toggleTask,
  updateTask,
  updateMood,
} from "./api/client"

import type {
  Activity,
  ActivityCreate,
  DailyEntry,
  Quest,
  QuestCreate,
  Task,
  TaskCreate,
  TaskUpdate,
  WeatherData,
} from "./types/planner"

import "./App.css"

function App() {
  const [dailyEntry, setDailyEntry] =
    useState<DailyEntry | null>(null)

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [newTask, setNewTask] =
    useState<TaskCreate>({
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

  const [quests, setQuests] =
    useState<Quest[]>([])

  const [newQuest, setNewQuest] =
    useState<QuestCreate>({
      title: "",
    })

  const [selectedDate, setSelectedDate] =
    useState(
      new Date().toISOString().split("T")[0],
    )

  const [weather, setWeather] =
    useState<WeatherData | null>(null)

  const [avatar, setAvatar] =
    useState<string | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function loadPlanner(date: string) {
      try {
        setLoading(true)

        const data =
          await getDailyEntry(date)

        const taskData =
          await getTasks(data.id)

        const activityData =
          await getActivities(data.id)

        const questData =
          await getQuests(data.id)

        setDailyEntry(data)
        setTasks(taskData)
        setActivities(activityData)
        setQuests(questData)
      } catch (error) {
        console.error(error)

        setDailyEntry(null)
      } finally {
        setLoading(false)
      }
    }

    loadPlanner(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeather(
          -3.7319,
          -38.5267,
        )

        setWeather(data)
      } catch (error) {
        console.error(
          "Could not load weather:",
          error,
        )
      }
    }

    loadWeather()
  }, [])

  async function handleCreateTask(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !dailyEntry ||
      !newTask.title.trim()
    ) {
      return
    }

    try {
      const createdTask =
        await createTask(
          dailyEntry.id,
          newTask,
        )

      setTasks((currentTasks) =>
        [...currentTasks, createdTask].sort(
          (a, b) =>
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

  async function handleToggleTask(
    taskId: number,
  ) {
    if (!dailyEntry) {
      return
    }

    try {
      await toggleTask(taskId)

      const updatedDailyEntry =
        await getDailyEntry(
          dailyEntry.date,
        )

      const updatedTasks =
        await getTasks(
          updatedDailyEntry.id,
        )

      setDailyEntry(updatedDailyEntry)
      setTasks(updatedTasks)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDeleteTask(
    taskId: number,
  ) {
    try {
      await deleteTask(taskId)

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) =>
            task.id !== taskId,
        ),
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function handleEditTask(
    task: Task,
  ) {
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
      const updatedTask =
        await updateTask(
          task.id,
          taskData,
        )

      setTasks((currentTasks) =>
        currentTasks.map(
          (currentTask) =>
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

    if (
      !dailyEntry ||
      !newActivity.title.trim()
    ) {
      return
    }

    try {
      const createdActivity =
        await createActivity(
          dailyEntry.id,
          newActivity,
        )

      setActivities(
        (currentActivities) => [
          ...currentActivities,
          createdActivity,
        ],
      )

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
      await completeActivity(
        activityId,
      )

      const updatedDailyEntry =
        await getDailyEntry(
          dailyEntry.date,
        )

      const updatedActivities =
        await getActivities(
          updatedDailyEntry.id,
        )

      setDailyEntry(updatedDailyEntry)

      setActivities(
        updatedActivities,
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function handleCreateQuest(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !dailyEntry ||
      !newQuest.title.trim()
    ) {
      return
    }

    try {
      const createdQuest =
        await createQuest(
          dailyEntry.id,
          newQuest,
        )

      setQuests(
        (currentQuests) => [
          ...currentQuests,
          createdQuest,
        ],
      )

      setNewQuest({
        title: "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleToggleQuest(
    quest: Quest,
  ) {
    try {
      const updatedQuest =
        await updateQuest(
          quest.id,
          {
            is_completed:
              !quest.is_completed,
          },
        )

      setQuests((currentQuests) =>
        currentQuests.map(
          (currentQuest) =>
            currentQuest.id === quest.id
              ? updatedQuest
              : currentQuest,
        ),
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function handleMoodChange(
    mood: string,
  ) {
    if (!dailyEntry) {
      return
    }

    try {
      const updatedDailyEntry =
        await updateMood(
          dailyEntry.id,
          mood,
        )

      setDailyEntry(
        updatedDailyEntry,
      )
    } catch (error) {
      console.error(error)
    }
  }

  function getWeatherLabel(
    code: number,
  ) {
    const weatherLabels:
      Record<number, string> = {
        0: "Clear",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Cloudy",
        45: "Foggy",
        48: "Foggy",
        51: "Light Drizzle",
        53: "Drizzle",
        55: "Heavy Drizzle",
        61: "Light Rain",
        63: "Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Snow",
        75: "Heavy Snow",
        80: "Rain Showers",
        81: "Rain Showers",
        82: "Heavy Showers",
        95: "Thunderstorm",
      }

    return (
      weatherLabels[code] ??
      "Unknown"
    )
  }

  function getWeatherIcon(
    code: number,
  ) {
    if (code === 0 || code === 1) {
      return "☀️"
    }

    if (code === 2) {
      return "⛅"
    }

    if (code === 3) {
      return "☁️"
    }

    if (
      code === 45 ||
      code === 48
    ) {
      return "🌫️"
    }

    if (
      code >= 51 &&
      code <= 67
    ) {
      return "🌧️"
    }

    if (
      code >= 71 &&
      code <= 77
    ) {
      return "❄️"
    }

    if (
      code >= 80 &&
      code <= 82
    ) {
      return "🌦️"
    }

    if (code === 95) {
      return "⛈️"
    }

    return "🌤️"
  }

  function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const imageUrl =
      URL.createObjectURL(file)

    setAvatar(imageUrl)
  }

  if (loading) {
    return (
      <p>
        Loading your daily quest...
      </p>
    )
  }

  if (!dailyEntry) {
    return (
      <p>
        Could not load today's planner.
      </p>
    )
  }

  const stats = [
    [
      "Intelligence",
      dailyEntry.intelligence,
    ],
    [
      "Physical",
      dailyEntry.physical,
    ],
    [
      "Creativity",
      dailyEntry.creativity,
    ],
    [
      "Social",
      dailyEntry.social,
    ],
    [
      "Mental",
      dailyEntry.mental,
    ],
  ]

  return (
    <main className="app">
      <div className="dashboard">

        <header className="header">
          <div>
            <h1>
              Daily Quest
            </h1>

            <p>
              Your daily adventure awaits.
            </p>
          </div>

          <div className="header-actions">
            {weather && (
              <div className="weather-card">
                <span className="weather-icon">
                  {getWeatherIcon(
                    weather.weather_code,
                  )}
                </span>

                <div>
                  <strong>
                    {Math.round(
                      weather.temperature,
                    )}
                    °C
                  </strong>

                  <span>
                    {getWeatherLabel(
                      weather.weather_code,
                    )}
                  </span>
                </div>
              </div>
            )}

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value,
                )
              }
            />
          </div>
        </header>

        <div className="top-grid">

          <section className="panel character-panel">

            <label
              className="avatar"
              title="Choose your character image"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Character avatar"
                />
              ) : (
                <span>
                  +
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleAvatarChange
                }
              />
            </label>

            <div className="character-info">
              <div className="character-level">
                <span className="label">
                  LEVEL
                </span>

                <strong>
                  {dailyEntry.level}
                </strong>
              </div>

              <div className="character-xp">
                <span>
                  XP
                </span>

                <strong>
                  {dailyEntry.xp}
                </strong>
              </div>
            </div>

            <div className="resource-list">

              <div>
                <div className="resource-label">
                  <span>HP</span>

                  <span>
                    {dailyEntry.hp}/100
                  </span>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill hp"
                    style={{
                      width:
                        `${dailyEntry.hp}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="resource-label">
                  <span>MOOD</span>

                  <select
                    value={
                      dailyEntry.mood ?? ""
                    }
                    onChange={(event) =>
                      handleMoodChange(
                        event.target.value,
                      )
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="happy">
                      Happy
                    </option>

                    <option value="calm">
                      Calm
                    </option>

                    <option value="tired">
                      Tired
                    </option>

                    <option value="sad">
                      Sad
                    </option>

                    <option value="stressed">
                      Stressed
                    </option>
                  </select>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill mood"
                    style={{
                      width:
                        dailyEntry.mood
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="resource-label">
                  <span>MANA</span>

                  <span>
                    {dailyEntry.mana}/100
                  </span>
                </div>

                <div className="bar">
                  <div
                    className="bar-fill mana"
                    style={{
                      width:
                        `${dailyEntry.mana}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </section>

          <section className="panel stats-panel">
            <div className="section-header">
              <h2>
                Stats
              </h2>
            </div>

            <div className="stats-grid">
              {stats.map(
                ([name, value]) => (
                  <div
                    className="stat-card"
                    key={name}
                  >
                    <span>
                      {name}
                    </span>

                    <strong>
                      {value}
                    </strong>
                  </div>
                ),
              )}
            </div>
          </section>

        </div>

        <section className="panel schedule-panel">

          <div className="section-header">
            <div>
              <h2>
                Today's Schedule
              </h2>

              <span>
                {tasks.length} tasks
              </span>
            </div>
          </div>

          <form
            className="task-form"
            onSubmit={
              handleCreateTask
            }
          >
            <input
              type="text"
              placeholder="What is your next quest?"
              value={newTask.title}
              onChange={(event) =>
                setNewTask({
                  ...newTask,
                  title:
                    event.target.value,
                })
              }
            />

            <input
              type="time"
              value={
                newTask.scheduled_time
              }
              onChange={(event) =>
                setNewTask({
                  ...newTask,
                  scheduled_time:
                    event.target.value,
                })
              }
            />

            <select
              value={newTask.stat}
              onChange={(event) =>
                setNewTask({
                  ...newTask,
                  stat:
                    event.target.value,
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
                  xp_reward: Number(
                    event.target.value,
                  ),
                })
              }
            />

            <label className="important-label">
              <input
                type="checkbox"
                checked={
                  newTask.is_important
                }
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    is_important:
                      event.target.checked,
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
                    checked={
                      task.is_completed
                    }
                    onChange={() =>
                      handleToggleTask(
                        task.id,
                      )
                    }
                  />

                  <span className="task-time">
                    {task.scheduled_time}
                  </span>

                  <div className="task-content">
                    <strong>
                      {task.title}
                    </strong>

                    <div className="task-meta">

                      {task.is_important && (
                        <span>
                          Important
                        </span>
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
                      onClick={() =>
                        handleEditTask(
                          task,
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTask(
                          task.id,
                        )
                      }
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
              <h2>
                Mana Activities
              </h2>

              <span>
                Recharge your energy
              </span>
            </div>
          </div>

          <form
            className="activity-form"
            onSubmit={
              handleCreateActivity
            }
          >

            <input
              type="text"
              placeholder="Watch anime, draw, sing..."
              value={
                newActivity.title
              }
              onChange={(event) =>
                setNewActivity({
                  ...newActivity,
                  title:
                    event.target.value,
                })
              }
            />

            <input
              type="number"
              min="1"
              value={
                newActivity.mana_reward
              }
              onChange={(event) =>
                setNewActivity({
                  ...newActivity,
                  mana_reward: Number(
                    event.target.value,
                  ),
                })
              }
            />

            <select
              value={
                newActivity.stat
              }
              onChange={(event) =>
                setNewActivity({
                  ...newActivity,
                  stat:
                    event.target.value,
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
              activities.map(
                (activity) => (
                  <div
                    className="activity-item"
                    key={activity.id}
                  >

                    <div>
                      <strong>
                        {activity.title}
                      </strong>

                      <div className="task-meta">
                        <span>
                          +{
                            activity.mana_reward
                          }{" "}
                          Mana
                        </span>

                        <span>
                          {activity.stat}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCompleteActivity(
                          activity.id,
                        )
                      }
                    >
                      Recharge
                    </button>

                  </div>
                ),
              )
            )}
          </div>

        </section>

        <section className="panel quests-panel">

          <div className="section-header">
            <div>
              <h2>
                Quests
              </h2>

              <span>
                Goals bigger than today's tasks
              </span>
            </div>
          </div>

          <form
            className="quest-form"
            onSubmit={
              handleCreateQuest
            }
          >
            <input
              type="text"
              placeholder="Your next big quest..."
              value={
                newQuest.title
              }
              onChange={(event) =>
                setNewQuest({
                  title:
                    event.target.value,
                })
              }
            />

            <button type="submit">
              Add Quest
            </button>
          </form>

          <div className="quests-list">

            {quests.length === 0 ? (
              <p className="empty-state">
                No quests yet.
              </p>
            ) : (
              quests.map((quest) => (
                <div
                  className={`quest-item ${
                    quest.is_completed
                      ? "completed"
                      : ""
                  }`}
                  key={quest.id}
                >
                  <input
                    type="checkbox"
                    checked={
                      quest.is_completed
                    }
                    onChange={() =>
                      handleToggleQuest(
                        quest,
                      )
                    }
                  />

                  <strong>
                    {quest.title}
                  </strong>
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