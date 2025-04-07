import { supabase } from "../lib/supabase"

export interface Meeting {
  id: string
  name: string
  agenda: string
  location: string
  date: string
  time: string
  status: "scheduled" | "canceled"
  created_by: string
  created_at: string
  links?: string
}

export const meetingService = {
  async getMeetings(userId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("created_by", userId)
      .eq("status", "scheduled")
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if (error) throw error
    return data || []
  },

  async createMeeting(meeting: Omit<Meeting, "id" | "created_at">): Promise<Meeting> {
    const { data, error } = await supabase
      .from("meetings")
      .insert([meeting])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const { data, error } = await supabase
      .from("meetings")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancelMeeting(id: string): Promise<void> {
    const { error } = await supabase
      .from("meetings")
      .update({ status: "canceled" })
      .eq("id", id)

    if (error) throw error
  },

  async getMeetingDetails(id: string): Promise<Meeting> {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async checkAvailability(date: string, time: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("meetings")
      .select("id")
      .eq("date", date)
      .eq("time", time)
      .eq("created_by", userId)
      .eq("status", "scheduled")

    if (error) throw error
    return !data || data.length === 0
  },
} 