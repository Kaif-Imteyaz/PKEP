export interface Meeting {
  id: string
  name: string
  agenda: string
  links?: string | null
  date: string
  time: string
  location: string
  status: "scheduled" | "cancelled"
  created_at: string
  created_by: string
  // Frontend-only properties for compatibility
  meeting_date?: string
  meeting_time?: string
  links_documents?: string
  is_cancelled?: boolean
}

export interface MeetingParticipant {
  meeting_id: string
  user_id: string
  status: "pending" | "accepted" | "declined"
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
  officer1_id: string
  officer2_id: string
  created_at: string
  // Frontend compatibility properties
  buddy_id?: string
  buddy?: any
}

export interface Note {
  id: string
  content: string
  type: string
  created_at: string
  created_by: string
  edited_at?: string
  user_id: string
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

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
  metadata?: any
}

