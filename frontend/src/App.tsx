import { useEffect, useState } from "react"

import {
  getDailyEntry,
  getTasks,
} from "./api/client"

import type {
  DailyEntry,
  Task,
} from "./types/planner"

import "./App.css"

function App() {
  const [dailyEntry, setDailyEntry] =
    useState<DailyEntry | null>(null)

  const [tasks, setTasks] = useState<Task[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0]

    async function loadDailyEntry() {
      try {
        const data = await getDailyEntry(today)

        const taskData = await getTasks(data.id)

        setDailyEntry(data)
        setTasks(taskData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDailyEntry()
  }, [])

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