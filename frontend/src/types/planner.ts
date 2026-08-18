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
  scheduled_time: string
  is_completed: boolean
  is_important: boolean
  xp_reward: number
  stat: string
  daily_entry_id: number
}

export interface TaskCreate {
  title: string
  scheduled_time: string
  is_important: boolean
  xp_reward: number
  stat: string
}