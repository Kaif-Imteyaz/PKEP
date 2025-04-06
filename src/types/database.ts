export type Meeting = {
  id: string
  name: string
  agenda: string
  links_documents: string
  performance_metrics?: string
  location: string
  meeting_date: string
  meeting_time: string
  created_by: string
  created_at: string
  updated_at: string
  is_cancelled: boolean
}

export type MeetingParticipant = {
  id: string
  meeting_id: string
  user_id: string
  status: "pending" | "accepted" | "declined"
  created_at: string
}

export type UserSession = {
  id: string
  user_id: string
  whatsapp_number: string
  last_verification: string
  is_verified: boolean
  created_at: string
}

export type BuddyPair = {
  id: string
  user_id: string
  buddy_id: string
  created_at: string
}

export type ChatMessage = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
  metadata?: any
}

export type Note = {
  id: string
  type: "rose" | "thorn" | "bud"
  content: string
  created_at: string
  user_id: string
  edited_at?: string
}

export type DashboardMetric = {
  id: string
  user_id: string
  delayed_applications: number
  process_days: number
  applications_handled: number
}

export type HistoricalMetric = {
  id: string
  user_id: string
  metric_type: string
  month: string
  value: number
}

