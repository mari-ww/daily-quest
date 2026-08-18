import { useEffect, useState } from "react"

import { getDailyEntry } from "./api/client"
import type { DailyEntry } from "./types/planner"
import "./App.css"

function App() {
  const [dailyEntry, setDailyEntry] =
    useState<DailyEntry | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0]

    async function loadDailyEntry() {
      try {
        const data = await getDailyEntry(today)
        setDailyEntry(data)
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
      </div>
    </main>
  )
}

export default App