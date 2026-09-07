import { useEffect, useRef, useState } from "react"
import type React from "react"
import type { MonthlyStats } from "./api/client"

import {
  completeActivity,
  createActivity,
  createTask,
  deleteActivity,
  deleteTask,
  getActivities,
  getDailyEntry,
  getMonthlyEntries,
  getMonthlyStats,
  getTasks,
  getWeather,
  toggleTask,
  updateMood,
} from "./api/client"

import type {
  Activity,
  ActivityCreate,
  DailyEntry,
  Task,
  TaskCreate,
  WeatherData,
} from "./types/planner"

import "./App.css"

type Mood = {
  value: string
  label: string
  icon: React.ReactNode
  color: string
}

const moodIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 40,
  height: 40,
}

const moods: Mood[] = [
  {
    value: "happy",
    label: "Happy",
    color: "#cdb25b",
    icon: (
      <svg {...moodIconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle
          cx="9"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <circle
          cx="15"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" />
      </svg>
    ),
  },
  {
    value: "good",
    label: "Good",
    color: "#2e8cb4",
    icon: (
      <svg {...moodIconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle
          cx="9"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <circle
          cx="15"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <path d="M9 14c.8.8 1.8 1.2 3 1.2s2.2-.4 3-1.2" />
      </svg>
    ),
  },
  {
    value: "neutral",
    label: "Neutral",
    color: "#2f3ba9",
    icon: (
      <svg {...moodIconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle
          cx="9"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <circle
          cx="15"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <path d="M9 14h6" />
      </svg>
    ),
  },
  {
    value: "sad",
    label: "Sad",
    color: "#684fb3",
    icon: (
      <svg {...moodIconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle
          cx="9"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <circle
          cx="15"
          cy="10"
          r="0.8"
          fill="currentColor"
        />
        <path d="M9 15.5c.8-.9 1.8-1.4 3-1.4s2.2.5 3 1.4" />
      </svg>
    ),
  },
  {
    value: "angry",
    label: "Angry",
    color: "#994545",
    icon: (
      <svg {...moodIconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M8.5 9.5 10 10" />
        <path d="M15.5 9.5 14 10" />
        <circle
          cx="9.5"
          cy="11"
          r="0.8"
          fill="currentColor"
        />
        <circle
          cx="14.5"
          cy="11"
          r="0.8"
          fill="currentColor"
        />
        <path d="M9 15c1-.8 1.9-1.1 3-1.1s2 .3 3 1.1" />
      </svg>
    ),
  },
]

const STORAGE_KEYS = {
  name: "daily-quest-name",
  avatar: "daily-quest-avatar",
  avatarBackground: "daily-quest-avatar-background",
  calendarBackground: "daily-quest-calendar-background",
  quoteBackground: "daily-quest-quote-background",
  clockBackground: "daily-quest-clock-background",
}

const statOptions = [
  "intelligence",
  "physical",
  "creativity",
  "social",
  "mental",
] as const

const statLabels: Record<string, string> = {
  intelligence: "Intelligence",
  physical: "Physical",
  creativity: "Creativity",
  social: "Social",
  mental: "Mental",
}

type YouTubePlayer = {
  destroy: () => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string
          playerVars?: {
            autoplay?: number
            playsinline?: number
            rel?: number
          }
          events?: {
            onStateChange?: (event: {
              data: number
            }) => void
          }
        },
      ) => YouTubePlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export default function App() {
  const [dailyEntry, setDailyEntry] =
    useState<DailyEntry | null>(null)

  const [monthlyEntries, setMonthlyEntries] =
    useState<DailyEntry[]>([])

  const [monthlyStats, setMonthlyStats] =
    useState<MonthlyStats>({
      intelligence: 0,
      physical: 0,
      creativity: 0,
      social: 0,
      mental: 0,
    })

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [showCompletionConfetti, setShowCompletionConfetti] =
    useState(false)

  const [activities, setActivities] =
    useState<Activity[]>([])

  const [selectedDate, setSelectedDate] =
    useState(
      new Date().toISOString().split("T")[0],
    )

  const [weather, setWeather] =
    useState<WeatherData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  /* =========================================================
     TASK FORM
  ========================================================= */

  const [newTaskTitle, setNewTaskTitle] =
    useState("")

  const [newTaskXp, setNewTaskXp] =
    useState(10)

  const [newTaskStats, setNewTaskStats] =
    useState<string[]>(["intelligence"])

  /* =========================================================
     REWARD FORM
  ========================================================= */

  const [newActivityTitle, setNewActivityTitle] =
    useState("")

  const [newActivityMana, setNewActivityMana] =
    useState(10)

  const [newActivityStat, setNewActivityStat] =
    useState("intelligence")

  /* =========================================================
     PROFILE
  ========================================================= */

  const [name, setName] =
    useState("Mariana")

  const avatarInputRef =
    useRef<HTMLInputElement>(null)

  const [avatar, setAvatar] =
    useState<string | null>(null)

  const [avatarBackground, setAvatarBackground] =
    useState<string | null>(null)

  const [calendarBackground, setCalendarBackground] =
    useState<string | null>(null)

  const [quoteBackground, setQuoteBackground] =
    useState<string | null>(null)

  const [clockBackground, setClockBackground] =
    useState<string | null>(null)

  const [clockBackgroundOpacity, setClockBackgroundOpacity] =
    useState(0.85)

  const [editingProfile, setEditingProfile] =
    useState(false)

  const [editingName, setEditingName] =
    useState("Mariana")

  /* =========================================================
     CALENDAR
  ========================================================= */

  const [calendarDate, setCalendarDate] =
    useState(
      new Date(`${selectedDate}T12:00:00`),
    )

  /* =========================================================
     FOCUS TIMER
  ========================================================= */

  const [timerDuration, setTimerDuration] =
    useState(25 * 60)

  const [timerSeconds, setTimerSeconds] =
    useState(25 * 60)

  const [timerRunning, setTimerRunning] =
    useState(false)

  /* =========================================================
     YOUTUBE MUSIC
  ========================================================= */

  const [youtubeUrl, setYoutubeUrl] =
    useState("")

  const [youtubeVideoId, setYoutubeVideoId] =
    useState<string | null>(null)

  const [musicLoaded, setMusicLoaded] =
    useState(false)

  const [musicPlaying, setMusicPlaying] =
    useState(false)

  const youtubePlayerRef =
    useRef<YouTubePlayer | null>(null)

  const playerContainerRef =
    useRef<HTMLDivElement | null>(null)

  /* =========================================================
     LOAD PLANNER
  ========================================================= */

  useEffect(() => {
    loadPlanner()
  }, [selectedDate])

  /* =========================================================
     YOUTUBE PLAYER API
  ========================================================= */

  useEffect(() => {
    if (!youtubeVideoId) {
      setMusicPlaying(false)
      return
    }

    let cancelled = false

    function createPlayer() {
      if (
        cancelled ||
        !window.YT ||
        !playerContainerRef.current
      ) {
        return
      }

      if (!youtubeVideoId) {
        return
      }

      youtubePlayerRef.current =
        new window.YT.Player(
          playerContainerRef.current,
          {
            videoId: youtubeVideoId,
            playerVars: {
              autoplay: 1,
              playsinline: 1,
              rel: 0,
            },
            events: {
              onStateChange: (event) => {
                if (event.data === 1) {
                  setMusicPlaying(true)
                }

                if (
                  event.data === 0 ||
                  event.data === 2
                ) {
                  setMusicPlaying(false)
                }
              },
            },
          },
        )
    }

    if (window.YT) {
      createPlayer()
    } else {
      const previousCallback =
        window.onYouTubeIframeAPIReady

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        createPlayer()
      }

      const existingScript =
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]',
        )

      if (!existingScript) {
        const script =
          document.createElement("script")

        script.src =
          "https://www.youtube.com/iframe_api"

        script.async = true

        document.body.appendChild(script)
      }
    }

    return () => {
      cancelled = true

      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy()
        youtubePlayerRef.current = null
      }

      setMusicPlaying(false)
    }
  }, [youtubeVideoId])

  useEffect(() => {
    loadWeather()

    const savedName =
      localStorage.getItem(STORAGE_KEYS.name)

    const savedAvatar =
      localStorage.getItem(STORAGE_KEYS.avatar)

    const savedAvatarBackground =
      localStorage.getItem(
        STORAGE_KEYS.avatarBackground,
      )

    const savedCalendarBackground =
      localStorage.getItem(
        STORAGE_KEYS.calendarBackground,
      )

    const savedQuoteBackground =
      localStorage.getItem(
        STORAGE_KEYS.quoteBackground,
      )

    const savedClockBackground =
      localStorage.getItem(
        STORAGE_KEYS.clockBackground,
      )

    if (savedName) {
      setName(savedName)
      setEditingName(savedName)
    }

    if (savedAvatar) {
      setAvatar(savedAvatar)
    }

    if (savedAvatarBackground) {
      setAvatarBackground(savedAvatarBackground)
    }

    if (savedCalendarBackground) {
      setCalendarBackground(savedCalendarBackground)
    }

    if (savedQuoteBackground) {
      setQuoteBackground(savedQuoteBackground)
    }

    if (savedClockBackground) {
      setClockBackground(savedClockBackground)
    }
  }, [])

  useEffect(() => {
    setCalendarDate(
      new Date(`${selectedDate}T12:00:00`),
    )
  }, [selectedDate])

  useEffect(() => {
    loadMonthlyEntries()
  }, [calendarDate])

  async function loadPlanner() {
    try {
      setLoading(true)
      setError(null)

      const entry =
        await getDailyEntry(selectedDate)

      setDailyEntry(entry)

      const [
        tasksData,
        activitiesData,
      ] = await Promise.all([
        getTasks(entry.id),
        getActivities(entry.id),
      ])

      setTasks(tasksData)
      setActivities(activitiesData)

      await loadMonthlyEntries()
    } catch (err) {
      console.error(err)
      setError(
        "Could not load today's planner.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function loadMonthlyEntries() {
    try {
      const year =
        calendarDate.getFullYear()

      const month =
        calendarDate.getMonth() + 1

      const [
        entries,
        stats,
      ] = await Promise.all([
        getMonthlyEntries(
          year,
          month,
        ),
        getMonthlyStats(
          year,
          month,
        ),
      ])

      setMonthlyEntries(entries)
      setMonthlyStats(stats)
    } catch (err) {
      console.error(
        "Could not load monthly data:",
        err,
      )
    }
  }

  async function loadWeather() {
    try {
      const data =
        await getWeather(
          -3.7319,
          -38.5267,
        )

      setWeather(data)
    } catch (err) {
      console.error(
        "Could not load weather:",
        err,
      )
    }
  }

  /* =========================================================
     PROFILE
  ========================================================= */

  function openProfileEditor() {
    setEditingName(name)
    setEditingProfile(true)
  }

  function saveProfile() {
    const cleanName =
      editingName.trim() || "Mariana"

    setName(cleanName)

    localStorage.setItem(
      STORAGE_KEYS.name,
      cleanName,
    )

    setEditingProfile(false)
  }

  function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onload = () => {
      const result =
        reader.result

      if (
        typeof result !==
        "string"
      ) {
        return
      }

      setAvatar(result)

      try {
        localStorage.setItem(
          STORAGE_KEYS.avatar,
          result,
        )
      } catch (err) {
        console.error(
          "Could not save avatar:",
          err,
        )
      }
    }

    reader.readAsDataURL(file)
  }

  function handleBackgroundChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type:
      | "avatar"
      | "calendar"
      | "quote"
      | "clock",
  ) {
    const file =
      event.target.files?.[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onload = () => {
      const result =
        reader.result

      if (
        typeof result !==
        "string"
      ) {
        return
      }

      if (type === "avatar") {
        setAvatarBackground(result)

        localStorage.setItem(
          STORAGE_KEYS.avatarBackground,
          result,
        )
      }

      if (type === "calendar") {
        setCalendarBackground(result)

        localStorage.setItem(
          STORAGE_KEYS.calendarBackground,
          result,
        )
      }

      if (type === "quote") {
        setQuoteBackground(result)

        localStorage.setItem(
          STORAGE_KEYS.quoteBackground,
          result,
        )
      }

      if (type === "clock") {
        setClockBackground(result)

        localStorage.setItem(
          STORAGE_KEYS.clockBackground,
          result,
        )
      }
    }

    reader.readAsDataURL(file)
  }

  /* =========================================================
     DATE
  ========================================================= */

  function formatDateInput(
    date: Date,
  ) {
    const year =
      date.getFullYear()

    const month =
      String(
        date.getMonth() + 1,
      ).padStart(2, "0")

    const day =
      String(
        date.getDate(),
      ).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  function handleDateChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSelectedDate(
      event.target.value,
    )
  }

  function changeDay(
    amount: number,
  ) {
    const date =
      new Date(
        `${selectedDate}T12:00:00`,
      )

    date.setDate(
      date.getDate() + amount,
    )

    setSelectedDate(
      formatDateInput(date),
    )
  }

  function formatDisplayDate(
    date: string,
  ) {
    return new Date(
      `${date}T12:00:00`,
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    )
  }

  function formatWeekday(
    date: string,
  ) {
    return new Date(
      `${date}T12:00:00`,
    ).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      },
    )
  }

  /* =========================================================
     TASKS
  ========================================================= */

  function toggleTaskStat(
    stat: string,
  ) {
    setNewTaskStats((current) => {
      if (current.includes(stat)) {
        return current.filter(
          (item) => item !== stat,
        )
      }

      if (current.length >= 3) {
        return current
      }

      return [
        ...current,
        stat,
      ]
    })
  }

  async function handleCreateTask(
    event: React.FormEvent,
  ) {
    event.preventDefault()

    if (
      !dailyEntry ||
      !newTaskTitle.trim()
    ) {
      return
    }

    const payload: TaskCreate = {
      title:
        newTaskTitle.trim(),

      scheduled_time:
        null,

      is_important:
        false,

      xp_reward:
        Math.max(
          10,
          Math.min(
            newTaskXp,
            100,
          ),
        ),

      stats:
        newTaskStats,
    }

    try {
      const task =
        await createTask(
          dailyEntry.id,
          payload,
        )

      setTasks((current) => [
        ...current,
        task,
      ])

      setNewTaskTitle("")
      setNewTaskXp(10)
      setNewTaskStats([
        "intelligence",
      ])
    } catch (err) {
      console.error(err)
    }
  }

async function handleToggleTask(
  task: Task,
) {
  try {
    const updated =
      await toggleTask(
        task.id,
      )

    setTasks((current) => {
      const updatedTasks =
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        )

      const allCompleted =
        updatedTasks.length > 0 &&
        updatedTasks.every(
          (item) => item.is_completed,
        )

      if (
        allCompleted &&
        !task.is_completed
      ) {
        setShowCompletionConfetti(true)

        setTimeout(() => {
          setShowCompletionConfetti(false)
        }, 2000)
      }

      return updatedTasks
    })

    await refreshDailyEntry()
    await loadMonthlyEntries()
  } catch (err) {
    console.error(err)
  }
}

  async function handleDeleteTask(
    taskId: number,
  ) {
    try {
      await deleteTask(taskId)

      setTasks((current) =>
        current.filter(
          (task) =>
            task.id !== taskId,
        ),
      )

      await loadMonthlyEntries()
    } catch (err) {
      console.error(err)
    }
  }

  /* =========================================================
     REWARDS
  ========================================================= */

  async function handleCreateActivity(
    event: React.FormEvent,
  ) {
    event.preventDefault()

    if (
      !dailyEntry ||
      !newActivityTitle.trim()
    ) {
      return
    }

    const payload: ActivityCreate = {
      title:
        newActivityTitle.trim(),

      mana_reward:
        Math.max(
          1,
          Math.min(
            newActivityMana,
            100,
          ),
        ),

      stat:
        newActivityStat,
    }

    try {
      const activity =
        await createActivity(
          dailyEntry.id,
          payload,
        )

      setActivities((current) => [
        ...current,
        activity,
      ])

      setNewActivityTitle("")
      setNewActivityMana(10)
      setNewActivityStat(
        "intelligence",
      )
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCompleteActivity(
    activity: Activity,
  ) {
    try {
      const updated =
        await completeActivity(
          activity.id,
        )

      setActivities((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      )

      await refreshDailyEntry()
      await loadMonthlyEntries()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteActivity(
    activityId: number,
  ) {
    try {
      await deleteActivity(
        activityId,
      )

      setActivities((current) =>
        current.filter(
          (activity) =>
            activity.id !==
            activityId,
        ),
      )
    } catch (err) {
      console.error(err)
    }
  }

  /* =========================================================
     MOOD
  ========================================================= */

  async function handleMoodChange(
    mood: string,
  ) {
    if (!dailyEntry) {
      return
    }

    try {
      const updated =
        await updateMood(
          dailyEntry.id,
          mood,
        )

      setDailyEntry(updated)

      await loadMonthlyEntries()
    } catch (err) {
      console.error(err)
    }
  }

  async function refreshDailyEntry() {
    if (!dailyEntry) {
      return
    }

    try {
      const updated =
        await getDailyEntry(
          selectedDate,
        )

      setDailyEntry(updated)
    } catch (err) {
      console.error(err)
    }
  }

  /* =========================================================
     WEATHER
  ========================================================= */

  function getWeatherLabel(
    code: number,
  ) {
    const labels: Record<
      number,
      string
    > = {
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
      labels[code] ??
      "Unknown"
    )
  }

  function getWeatherIcon(
    code: number,
  ) {
    if (code === 0) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
          />

          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )
    }

    if (
      code === 1 ||
      code === 2
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle
            cx="8"
            cy="8"
            r="3"
          />

          <path d="M8 2v2M3.8 3.8l1.4 1.4M2 8h2" />

          <path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7 12a4 4 0 0 0 0 6Z" />
        </svg>
      )
    }

    if (
      code === 45 ||
      code === 48
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M4 9h16M3 13h18M5 17h14" />
        </svg>
      )
    }

    if (
      code >= 51 &&
      code <= 67
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7 12a4 4 0 0 0 0 6Z" />

          <path d="M8 20v1M12 20v1M16 20v1" />
        </svg>
      )
    }

    if (
      code === 71 ||
      code === 73 ||
      code === 75
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11.7 1.6A4 4 0 0 1 18 18H7Z" />

          <path d="M8 20v.01M12 20v.01M16 20v.01" />
        </svg>
      )
    }

    if (code === 95) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7 12a4 4 0 0 0 0 6Z" />

          <path d="m13 13-2 4h3l-2 4" />
        </svg>
      )
    }

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7 12a4 4 0 0 0 0 6Z" />
      </svg>
    )
  }

  /* =========================================================
     CALENDAR
  ========================================================= */

  function getMoodForDay(day: number) {
    const date = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      day,
    )

    const dateString =
      formatDateInput(date)

    const entry =
      monthlyEntries.find(
        (item) =>
          String(item.date).slice(0, 10) ===
          dateString,
      )

    const moodValue =
      entry?.mood ??
      (
        dailyEntry &&
        String(dailyEntry.date).slice(0, 10) ===
          dateString
          ? dailyEntry.mood
          : null
      )

    if (!moodValue) {
      return null
    }

    return (
      moods.find(
        (mood) =>
          mood.value === moodValue,
      ) ?? null
    )
  }

  function getCalendarDays() {
    const year =
      calendarDate.getFullYear()

    const month =
      calendarDate.getMonth()

    const firstDay =
      new Date(
        year,
        month,
        1,
      )

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0,
      ).getDate()

    const startingDay =
      firstDay.getDay()

    const days:
      Array<number | null> = []

    for (
      let i = 0;
      i < startingDay;
      i++
    ) {
      days.push(null)
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day)
    }

    return days
  }

  function changeCalendarMonth(
    amount: number,
  ) {
    setCalendarDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            amount,
          1,
        ),
    )
  }

  function selectCalendarDay(
    day: number,
  ) {
    const date =
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        day,
      )

    setSelectedDate(
      formatDateInput(date),
    )
  }

  function isSelectedDay(
    day: number,
  ) {
    return (
      selectedDate ===
      formatDateInput(
        new Date(
          calendarDate.getFullYear(),
          calendarDate.getMonth(),
          day,
        ),
      )
    )
  }

  function isToday(
    day: number,
  ) {
    const today =
      new Date()

    return (
      today.getFullYear() ===
        calendarDate.getFullYear() &&
      today.getMonth() ===
        calendarDate.getMonth() &&
      today.getDate() ===
        day
    )
  }

  /* =========================================================
     FOCUS TIMER
  ========================================================= */

  useEffect(() => {
    if (!timerRunning) {
      return
    }

    if (timerSeconds <= 0) {
      setTimerRunning(false)
      playTimerBeep()
      return
    }

    const interval =
      window.setInterval(() => {
        setTimerSeconds((current) =>
          Math.max(0, current - 1),
        )
      }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    timerRunning,
    timerSeconds,
  ])

  function playTimerBeep() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext
          }
        ).webkitAudioContext

      if (!AudioContextClass) {
        return
      }

      const context =
        new AudioContextClass()

      const oscillator =
        context.createOscillator()

      const gain =
        context.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 660

      gain.gain.setValueAtTime(
        0.001,
        context.currentTime,
      )

      gain.gain.exponentialRampToValueAtTime(
        0.2,
        context.currentTime + 0.02,
      )

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.45,
      )

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start()

      oscillator.stop(
        context.currentTime + 0.45,
      )
    } catch (err) {
      console.error(
        "Could not play timer beep:",
        err,
      )
    }
  }

  function handleTimerDurationChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const seconds =
      Number(event.target.value)

    setTimerDuration(seconds)
    setTimerSeconds(seconds)
    setTimerRunning(false)
  }

  function toggleTimer() {
    if (timerSeconds <= 0) {
      setTimerSeconds(timerDuration)
    }

    setTimerRunning(
      (current) => !current,
    )
  }

  function resetTimer() {
    setTimerRunning(false)
    setTimerSeconds(timerDuration)
  }

  function formatTimer(
    seconds: number,
  ) {
    const minutes =
      Math.floor(seconds / 60)

    const remainingSeconds =
      seconds % 60

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`
  }

  /* =========================================================
     YOUTUBE MUSIC
  ========================================================= */

  function extractYouTubeId(
    url: string,
  ) {
    const value =
      url.trim()

    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?&]+)/,
      /(?:youtube\.com\/shorts\/)([^?&]+)/,
      /(?:youtube\.com\/embed\/)([^?&]+)/,
    ]

    for (const pattern of patterns) {
      const match =
        value.match(pattern)

      if (match?.[1]) {
        return match[1]
      }
    }

    return null
  }

  function loadYouTubeMusic(
    event: React.FormEvent,
  ) {
    event.preventDefault()

    const videoId =
      extractYouTubeId(
        youtubeUrl,
      )

    if (!videoId) {
      setYoutubeVideoId(null)
      setMusicLoaded(false)
      setMusicPlaying(false)
      return
    }

    setYoutubeVideoId(videoId)
    setMusicLoaded(true)
    setMusicPlaying(false)
  }

  /* =========================================================
     CALCULATED
  ========================================================= */

  const completedTasks =
    tasks.filter(
      (task) =>
        task.is_completed,
    ).length

  const totalTasks =
    tasks.length

  const taskProgress =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100,
        )
      : 0

  const currentXp =
    dailyEntry?.xp ?? 0

  const level =
    dailyEntry?.level ?? 1

  const xpToNextLevel =
    600

  const xpProgress =
    Math.min(
      (currentXp /
        xpToNextLevel) *
        100,
      100,
    )

  const currentMood =
    dailyEntry?.mood ?? null

  const currentMoodData =
    moods.find(
      (mood) =>
        mood.value ===
        currentMood,
    )

  const monthName =
    calendarDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
      },
    )

  const calendarYear =
    calendarDate.getFullYear()

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    !dailyEntry
  ) {
    return (
      <div className="loading-screen">
        Loading your journey...
      </div>
    )
  }

  if (
    error &&
    !dailyEntry
  ) {
    return (
      <div className="error-screen">
        {error}
      </div>
    )
  }

  return (
    <div className="app">
      <main className="dashboard">

      {showCompletionConfetti && (
        <div
          className="completion-confetti"
          aria-hidden="true"
        >
          {Array.from({ length: 80 }).map(
            (_, index) => (
              <span key={index}>
                {
                  [
                    "✦",
                    "✧",
                    "⋆",
                    "◇",
                    "+",
                    "·",
                    "˚",
                    "○",
                    "✶",
                    "✷",
                    "✹",
                    "✧",
                  ][
                    index % 6
                  ]
                }
              </span>
            ),
          )}
        </div>
     )}

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="dashboard-header">

          <div className="brand">

            <span className="brand-mark">
              ✦
            </span>

            <div className="brand-copy">

              <span className="brand-title">
                DAILY QUEST
              </span>

              <span className="brand-subtitle">
                Your daily adventure awaits
              </span>

            </div>

          </div>

          <div className="header-level">

            <span>
              Lv.
            </span>

            <strong>
              {level}
            </strong>

            <small>
              Soul Wanderer
            </small>

          </div>

          <div className="header-xp">

            <div className="header-xp-top">

              <span>
                Experience
              </span>

              <strong>
                {currentXp} XP
              </strong>

            </div>

            <div className="header-xp-bar">

              <div
                className="header-xp-fill"
                style={{
                  width:
                    `${xpProgress}%`,
                }}
              />

            </div>

          </div>

          <div className="header-date">

            <label
              className="date-button"
              htmlFor="date-picker"
            >

              <span>
                ◷
              </span>

              <div>

                <strong>
                  {formatDisplayDate(
                    selectedDate,
                  )}
                </strong>

                <span>
                  {formatWeekday(
                    selectedDate,
                  )}
                </span>

              </div>

            </label>

            <input
              id="date-picker"
              className="date-picker"
              type="date"
              value={selectedDate}
              onChange={
                handleDateChange
              }
            />

          </div>

          {weather && (
            <div className="header-weather">

              <span className="header-weather-icon">

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

                <small>
                  Fortaleza, CE
                </small>

              </div>

            </div>
          )}

          <div className="header-actions">

            <button
              type="button"
              className="header-action"
              onClick={() =>
                changeDay(-1)
              }
            >
              ‹
            </button>

            <button
              type="button"
              className="header-action"
              onClick={() =>
                changeDay(1)
              }
            >
              ›
            </button>

          </div>

        </header>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="hero-grid">

          <article
            className="character-hero"
            style={
              avatarBackground
                ? {
                    backgroundImage: `
                      linear-gradient(
                        90deg,
                        rgba(5,5,7,.96) 0%,
                        rgba(5,5,7,.86) 48%,
                        rgba(5,5,7,.55) 100%
                      ),
                      url("${avatarBackground}")
                    `,
                  }
                : undefined
            }
          >

            <div className="hero-character-glow" />

            <div
              className="hero-avatar"
              title="Change avatar"
              onClick={() =>
                avatarInputRef.current?.click()
              }
            >

              {avatar ? (
                <img
                  src={avatar}
                  alt="Character avatar"
                />
              ) : (
                <span>
                  ♧
                </span>
              )}

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleAvatarChange
                }
              />

            </div>

            <label className="background-button">

              ✧

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleBackgroundChange(
                    event,
                    "avatar",
                  )
                }
              />

            </label>

            <div className="hero-character-info">

              <div className="hero-eyebrow">
                Player Character
              </div>

              <h1 className="hero-character-name">
                {name}
              </h1>

              <p className="hero-quote">
                “Ainda há muito para viver.”
              </p>

              <div className="hero-divider" />

              <div className="hero-meta">

                <div className="hero-meta-item">

                  <span>
                    Level
                  </span>

                  <strong>
                    {level}
                  </strong>

                </div>

                <div className="hero-meta-item">

                  <span>
                    XP
                  </span>

                  <strong>
                    {currentXp}
                  </strong>

                </div>

                <div className="hero-meta-item">

                  <span>
                    Status
                  </span>

                  <strong>
                    {currentMoodData?.label ??
                      "Unknown"}
                  </strong>

                </div>

                <button
                  type="button"
                  className="profile-button"
                  onClick={
                    openProfileEditor
                  }
                >
                  ✎ Edit profile
                </button>

              </div>

            </div>

          </article>

          <article className="mood-card">

            <div className="card-eyebrow">
              Daily Mood
            </div>

            <h2 className="mood-title">
              How are you feeling?
            </h2>

            <div className="mood-options">

              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  className={`mood-button ${
                    currentMood ===
                    mood.value
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleMoodChange(
                      mood.value,
                    )
                  }
                  title={mood.label}
                >

                  <div className="mood-icon">
                    {mood.icon}
                  </div>

                  <span
                    className="mood-indicator"
                    style={{
                      backgroundColor:
                        mood.color,
                    }}
                  />

                </button>
              ))}

            </div>

            <div className="mood-current">

              {currentMoodData
                ? `Current mood: ${currentMoodData.label}`
                : "No mood recorded"}

            </div>

          </article>

          <article
            className="quote-card"
            style={
              quoteBackground
                ? {
                    backgroundImage: `
                      linear-gradient(
                        rgba(5,5,7,.80),
                        rgba(5,5,7,.90)
                      ),
                      url("${quoteBackground}")
                    `,
                  }
                : undefined
            }
          >

            <label className="background-button quote-background-button">

              ✧

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleBackgroundChange(
                    event,
                    "quote",
                  )
                }
              />

            </label>

            <span className="quote-mark">
              “
            </span>

            <blockquote>
              Every day is another
              chance to become who
              you want to be.
            </blockquote>

            <span className="quote-author">
              Daily Quest
            </span>

          </article>

        </section>

        {/* ==================================================
            RESOURCES
        ================================================== */}

        <section className="resources-panel">

          <div className="resource-item">

            <div className="resource-header">

              <span>
                HP
              </span>

              <strong>
                {dailyEntry?.hp ?? 0} / 100
              </strong>

            </div>

            <div className="resource-bar">

              <div
                className="resource-fill"
                style={{
                  width:
                    `${Math.max(
                      0,
                      Math.min(
                        dailyEntry?.hp ?? 0,
                        100,
                      ),
                    )}%`,
                }}
              />

            </div>

          </div>

          <div className="resource-item">

            <div className="resource-header">

              <span>
                MP
              </span>

              <strong>
                {dailyEntry?.mana ?? 0} / 100
              </strong>

            </div>

            <div className="resource-bar">

              <div
                className="resource-fill"
                style={{
                  width:
                    `${Math.max(
                      0,
                      Math.min(
                        dailyEntry?.mana ?? 0,
                        100,
                      ),
                    )}%`,
                }}
              />

            </div>

          </div>

          <div className="resource-item">

            <div className="resource-header">

              <span>
                XP
              </span>

              <strong>
                {currentXp} /{" "}
                {xpToNextLevel}
              </strong>

            </div>

            <div className="resource-bar">

              <div
                className="resource-fill"
                style={{
                  width:
                    `${xpProgress}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* ==================================================
            MAIN
        ================================================== */}

        <section className="main-grid">

          {/* DAILY TASKS */}

          <article className="panel tasks-panel">

            <div className="panel-header">

              <h2 className="panel-title">
                Daily Tasks
              </h2>

              <span className="panel-subtitle">
                {completedTasks}/
                {totalTasks} completed
              </span>

            </div>

            <div className="task-list">

              {tasks.length === 0 ? (

                <div className="empty-state">
                  No tasks for today.
                </div>

              ) : (

                tasks.map((task) => (

                  <div
                    key={task.id}
                    className={`task-item ${
                      task.is_completed
                        ? "task-completed"
                        : ""
                    }`}
                  >

                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={
                        task.is_completed
                      }
                      onChange={() =>
                        handleToggleTask(
                          task,
                        )
                      }
                    />

                    <div className="task-content">

                      <div className="task-title">
                        {task.title}
                      </div>

                      <div className="task-meta">

                        {task.stats.length > 0
                          ? task.stats
                              .map(
                                (stat) =>
                                  statLabels[
                                    stat
                                  ],
                              )
                              .join(" · ")
                          : "Daily task"}

                      </div>

                    </div>

                    <span className="task-xp">
                      +{task.xp_reward} XP
                    </span>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDeleteTask(
                          task.id,
                        )
                      }
                      title="Delete task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      ×
                    </button>

                  </div>

                ))

              )}

            </div>

            <form
              className="inline-form task-form"
              onSubmit={
                handleCreateTask
              }
            >

              <input
                className="text-input"
                value={newTaskTitle}
                onChange={(event) =>
                  setNewTaskTitle(
                    event.target.value,
                  )
                }
                placeholder="Add a new task..."
              />

              <input
                className="number-input"
                type="number"
                min="10"
                max="100"
                step="10"
                value={newTaskXp}
                onChange={(event) =>
                  setNewTaskXp(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                title="XP reward"
              />

              <div
                className="stat-selector"
                role="group"
                aria-label="Task stats"
              >

                {statOptions.map(
                  (stat) => (

                    <button
                      key={stat}
                      type="button"
                      className={`stat-option ${
                        newTaskStats.includes(
                          stat,
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleTaskStat(
                          stat,
                        )
                      }
                      aria-pressed={
                        newTaskStats.includes(
                          stat,
                        )
                      }
                    >
                      {statLabels[stat]}
                    </button>

                  ),
                )}

              </div>

              <button
                className="small-button"
                type="submit"
              >
                Add
              </button>

            </form>

          </article>

          {/* REWARDS */}

          <article className="panel">

            <div className="panel-header">

              <h2 className="panel-title">
                Rewards
              </h2>

              <span className="panel-subtitle">
                Restore MP
              </span>

            </div>

            <div className="activity-list">

              {activities.length === 0 ? (

                <div className="empty-state">
                  No rewards yet.
                </div>

              ) : (

                activities.map(
                  (activity) => (

                    <div
                      key={activity.id}
                      className={`activity-item ${
                        activity.is_completed
                          ? "activity-completed"
                          : ""
                      }`}
                    >

                      <button
                        className={`complete-button ${
                          activity.is_completed
                            ? "completed"
                            : ""
                        }`}
                        type="button"
                        onClick={() =>
                          handleCompleteActivity(
                            activity,
                          )
                        }
                        title={
                          activity.is_completed
                            ? "Undo reward"
                            : "Use reward"
                        }
                      >
                        {activity.is_completed
                          ? "✓"
                          : "+"}
                      </button>

                      <div className="activity-content">

                        <div className="activity-title">
                          {activity.title}
                        </div>

                        <div className="activity-meta">

                          {activity.stat
                            ? `${statLabels[activity.stat]} · Restore MP`
                            : "Restore MP"}

                        </div>

                      </div>

                      <span className="reward">
                        +{activity.mana_reward} MP
                      </span>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeleteActivity(
                            activity.id,
                          )
                        }
                        title="Delete reward"
                        aria-label={`Delete reward ${activity.title}`}
                      >
                        ×
                      </button>

                    </div>

                  ),
                )

              )}

            </div>

            <form
              className="inline-form"
              onSubmit={
                handleCreateActivity
              }
            >

              <input
                className="text-input"
                value={newActivityTitle}
                onChange={(event) =>
                  setNewActivityTitle(
                    event.target.value,
                  )
                }
                placeholder="Add a reward..."
              />

              <input
                className="number-input"
                type="number"
                min="1"
                max="100"
                value={newActivityMana}
                onChange={(event) =>
                  setNewActivityMana(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                title="MP restored"
              />

              <div className="activity-stat-field">

                <span className="form-field-label">
                  Stat
                </span>

                <select
                  className="select-input reward-stat-select"
                  value={newActivityStat}
                  onChange={(event) =>
                    setNewActivityStat(
                      event.target.value,
                    )
                  }
                  title="Stat"
                  aria-label="Reward stat"
                >

                  {statOptions.map(
                    (stat) => (

                      <option
                        key={stat}
                        value={stat}
                      >
                        {statLabels[stat]}
                      </option>

                    ),
                  )}

                </select>

              </div>

              <button
                className="small-button"
                type="submit"
              >
                Add
              </button>

            </form>

          </article>

          {/* FOCUS STACK */}

          <div className="focus-stack">

            {/* FOCUS TIMER */}

            <article
              className="panel focus-timer-panel"
              style={
                clockBackground
                  ? {
                      backgroundImage: `
                        linear-gradient(
                          to bottom,
                          rgba(5,5,7,0.75),
                          rgba(5,5,7,0.25) 100%,
                          rgba(5,5,7,0.75)
                        ),
                        url("${clockBackground}")
                      `,
                    }
                  : undefined
              }
            >

              <label className="background-button clock-background-button">

                ✧

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleBackgroundChange(
                      event,
                      "clock",
                    )
                  }
                />

              </label>

              <div className="focus-timer-content">

                <div className="gothic-clock">

                  <svg
                    className="gothic-clock-svg"
                    viewBox="0 0 180 180"
                    aria-hidden="true"
                  >

                    <circle
                      cx="90"
                      cy="90"
                      r="82"
                      className="clock-ring outer"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="76"
                      className="clock-ring"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="69"
                      className="clock-ring inner"
                    />

                    <line
                      x1="90"
                      y1="20"
                      x2="90"
                      y2="29"
                    />

                    <line
                      x1="90"
                      y1="151"
                      x2="90"
                      y2="160"
                    />

                    <line
                      x1="20"
                      y1="90"
                      x2="29"
                      y2="90"
                    />

                    <line
                      x1="151"
                      y1="90"
                      x2="160"
                      y2="90"
                    />

                    <line
                      x1="40"
                      y1="40"
                      x2="47"
                      y2="47"
                    />

                    <line
                      x1="133"
                      y1="133"
                      x2="140"
                      y2="140"
                    />

                    <line
                      x1="140"
                      y1="40"
                      x2="133"
                      y2="47"
                    />

                    <line
                      x1="47"
                      y1="133"
                      x2="40"
                      y2="140"
                    />

                    <path d="M90 10 L94 17 L90 24 L86 17 Z" />

                    <path d="M90 156 L94 163 L90 170 L86 163 Z" />

                    <line
                      className={`clock-hand clock-hour ${
                        timerRunning
                          ? "running"
                          : ""
                      }`}
                      x1="90"
                      y1="90"
                      x2="90"
                      y2="54"
                    />

                    <line
                      className={`clock-hand clock-minute ${
                        timerRunning
                          ? "running"
                          : ""
                      }`}
                      x1="90"
                      y1="90"
                      x2="117"
                      y2="90"
                    />

                    <circle
                      cx="90"
                      cy="90"
                      r="5"
                      className="clock-center"
                    />

                    <path
                      className="clock-star"
                      d="M90 78 L93 87 L102 90 L93 93 L90 102 L87 93 L78 90 L87 87 Z"
                    />

                  </svg>

                  <div className="timer-time">
                    {formatTimer(
                      timerSeconds,
                    )}
                  </div>

                </div>

                <div className="timer-controls">

                  <select
                    className="timer-select"
                    value={timerDuration}
                    onChange={
                      handleTimerDurationChange
                    }
                    disabled={
                      timerRunning
                    }
                  >

                    <option value={5 * 60}>
                      05 MIN
                    </option>

                    <option value={10 * 60}>
                      10 MIN
                    </option>

                    <option value={15 * 60}>
                      15 MIN
                    </option>

                    <option value={25 * 60}>
                      25 MIN
                    </option>

                    <option value={30 * 60}>
                      30 MIN
                    </option>

                    <option value={45 * 60}>
                      45 MIN
                    </option>

                    <option value={60 * 60}>
                      60 MIN
                    </option>

                  </select>

                  <button
                    type="button"
                    className="timer-button"
                    onClick={
                      toggleTimer
                    }
                  >
                    {timerRunning
                      ? "Pause"
                      : "Start"}
                  </button>

                  <button
                    type="button"
                    className="timer-button"
                    onClick={
                      resetTimer
                    }
                  >
                    Reset
                  </button>

                </div>

              </div>

            </article>

            {/* YOUTUBE MUSIC */}

            <article className="panel music-panel">

              <div className="music-content">

                <div
                  className={`music-waveform ${
                    musicPlaying
                      ? "active"
                      : ""
                  }`}
                  aria-hidden="true"
                >

                  {Array.from(
                    { length: 40 },
                    (_, index) => (

                      <span
                        key={index}
                        style={{
                          animationDelay:
                            `${index * -0.06}s`,
                        }}
                      />

                    ),
                  )}

                </div>

                <div className="music-label">

                  <span>
                    ♫
                  </span>

                  YouTube Music

                </div>

                <form
                  className="music-form"
                  onSubmit={
                    loadYouTubeMusic
                  }
                >

                  <input
                    className="music-input"
                    type="text"
                    value={youtubeUrl}
                    onChange={(event) =>
                      setYoutubeUrl(
                        event.target.value,
                      )
                    }
                    placeholder="Paste YouTube link..."
                    aria-label="YouTube music URL"
                  />

                  <button
                    className="music-load-button"
                    type="submit"
                  >
                    Load
                  </button>

                </form>

                {youtubeVideoId && (

                  <div className="youtube-player">

                    <div
                      ref={
                        playerContainerRef
                      }
                      className="youtube-player-frame"
                    />

                  </div>

                )}

              </div>

            </article>

          </div>

          {/* CALENDAR */}

          <article
            className="panel calendar-panel"
            style={
              calendarBackground
                ? {
                    backgroundImage: `
                      linear-gradient(
                        rgba(11,12,16,.86),
                        rgba(11,12,16,.94)
                      ),
                      url("${calendarBackground}")
                    `,
                  }
                : undefined
            }
          >

            <label className="background-button calendar-background-button">

              ✧

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleBackgroundChange(
                    event,
                    "calendar",
                  )
                }
              />

            </label>

            <div className="calendar-header">

              <span className="calendar-month">
                {monthName}{" "}
                {calendarYear}
              </span>

              <div className="calendar-nav">

                <button
                  type="button"
                  onClick={() =>
                    changeCalendarMonth(
                      -1,
                    )
                  }
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeCalendarMonth(
                      1,
                    )
                  }
                >
                  ›
                </button>

              </div>

            </div>

            <div className="calendar-weekdays">

              {[
                "S",
                "M",
                "T",
                "W",
                "T",
                "F",
                "S",
              ].map(
                (day, index) => (

                  <span key={index}>
                    {day}
                  </span>

                ),
              )}

            </div>

            <div className="calendar-grid">

              {getCalendarDays().map(
                (day, index) =>
                  day === null ? (

                    <span
                      key={index}
                      className="calendar-day empty"
                    />

                  ) : (

                    <button
                      key={index}
                      type="button"
                      className={`calendar-day ${
                        isToday(day)
                          ? "today"
                          : ""
                      } ${
                        isSelectedDay(day)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectCalendarDay(
                          day,
                        )
                      }
                    >

                      <span className="calendar-day-number">
                        {day}
                      </span>

                      {getMoodForDay(day) && (

                        <span
                          className="calendar-day-mood"
                          title={
                            getMoodForDay(
                              day,
                            )?.label
                          }
                          style={{
                            backgroundColor:
                              getMoodForDay(
                                day,
                              )?.color,
                            display:
                              "block",
                            position:
                              "absolute",
                            left:
                              "50%",
                            bottom:
                              "3px",
                            transform:
                              "translateX(-50%)",
                            width:
                              "18px",
                            height:
                              "2px",
                            borderRadius:
                              "2px",
                            zIndex: 2,
                            pointerEvents:
                              "none",
                          }}
                        />

                      )}

                    </button>

                  ),
              )}

            </div>

          </article>

          {/* SUMMARY */}

          <article className="panel">

            <div className="panel-header">

              <h2 className="panel-title">
                Daily Summary
              </h2>

            </div>

            <div className="summary-content">

              <div className="summary-main">

                <strong>
                  {taskProgress}%
                </strong>

                <span>
                  Tasks completed
                </span>

              </div>

              <div className="summary-row">

                <span>
                  Tasks
                </span>

                <strong>
                  {completedTasks}/
                  {totalTasks}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Rewards
                </span>

                <strong>
                  {activities.length}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  XP earned
                </span>

                <strong>
                  {currentXp} XP
                </strong>

              </div>

            </div>

          </article>

          {/* STATS */}

          <article className="panel stats-panel-compact">

            <div className="panel-header">

              <h2 className="panel-title">
                Stats
              </h2>

            </div>

            <div className="stats-list stats-scroll">

              {[
                [
                  "Intelligence",
                  monthlyStats.intelligence,
                ],
                [
                  "Physical",
                  monthlyStats.physical,
                ],
                [
                  "Creativity",
                  monthlyStats.creativity,
                ],
                [
                  "Social",
                  monthlyStats.social,
                ],
                [
                  "Mental",
                  monthlyStats.mental,
                ],
              ].map(
                ([statName, value]) => (

                  <div
                    className="stat-row"
                    key={statName}
                  >

                    <span className="stat-name">
                      {statName}
                    </span>

                    <div className="stat-bar">

                      <div
                        className="stat-fill"
                        style={{
                          width:
                            `${Number(
                              value,
                            )}%`,
                        }}
                      />

                    </div>

                    <span className="stat-value">
                      {value}
                    </span>

                  </div>

                ),
              )}

            </div>

          </article>

        </section>

      </main>

      {/* PROFILE MODAL */}

      {editingProfile && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setEditingProfile(
              false,
            )
          }
        >

          <div
            className="profile-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-eyebrow">
              Player Character
            </div>

            <h2>
              Edit Profile
            </h2>

            <label className="modal-label">

              Character name

              <input
                className="text-input"
                value={
                  editingName
                }
                onChange={(event) =>
                  setEditingName(
                    event.target.value,
                  )
                }
                autoFocus
              />

            </label>

            <div className="modal-actions">

              <button
                type="button"
                className="small-button"
                onClick={() =>
                  setEditingProfile(
                    false,
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="small-button primary-button"
                onClick={
                  saveProfile
                }
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}