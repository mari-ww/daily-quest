export interface DailyEntry {
  id: number
  date: string
  hp: number
  mana: number
  mood: string | null
  xp: number
  level: number
  intelligence: number
  physical: number
  creativity: number
  social: number
  mental: number
}

export interface Task {
  id: number
  title: string
  scheduled_time: string | null
  is_completed: boolean
  is_important: boolean
  xp_reward: number
  stats: string[]
  daily_entry_id: number
}

export interface TaskCreate {
  title: string
  scheduled_time: string | null
  is_important: boolean
  xp_reward: number
  stats: string[]
}

export interface TaskUpdate {
  title?: string
  scheduled_time?: string | null
  is_important?: boolean
  xp_reward?: number
  stats?: string[]
}

export interface Activity {
  id: number
  title: string
  mana_reward: number
  stat: string | null
  is_completed: boolean
  daily_entry_id: number
}

export interface ActivityCreate {
  title: string
  mana_reward: number
  stat: string | null
}

export interface Quest {
  id: number
  title: string
  is_completed: boolean
  daily_entry_id: number
}

export interface QuestCreate {
  title: string
}

export interface WeatherData {
  temperature: number
  weather_code: number
}