import { useEffect, useState } from "react"

import { getDailyEntry } from "./api/client"
import type { DailyEntry } from "./types/planner"

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

  return (
    <main>
      <h1>Daily Quest</h1>

      <p>{dailyEntry.date}</p>

      <section>
        <h2>Level {dailyEntry.level}</h2>

        <p>HP: {dailyEntry.hp}</p>
        <p>Mana: {dailyEntry.mana}</p>
        <p>XP: {dailyEntry.xp}</p>
        <p>Mood: {dailyEntry.mood ?? "Not set"}</p>
      </section>
    </main>
  )
}

export default App