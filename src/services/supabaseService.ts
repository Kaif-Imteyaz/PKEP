import { supabase } from "../lib/supabase"
import type { Meeting, Note } from "../types/database"

// Meeting Management
export const createMeeting = async (
  meetingData: Omit<Meeting, "id" | "created_at" | "updated_at" | "is_cancelled">,
) => {
  const { data, error } = await supabase
    .from("meetings")
    .insert([
      {
        ...meetingData,
        is_cancelled: false,
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

export const updateMeeting = async (id: string, meetingData: Partial<Meeting>) => {
  const { data, error } = await supabase
    .from("meetings")
    .update({
      ...meetingData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

export const cancelMeeting = async (id: string) => {
  const { data, error } = await supabase
    .from("meetings")
    .update({
      is_cancelled: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

export const getMeetings = async (userId: string) => {
  // Get meetings where user is creator or participant
  const { data: participantMeetings, error: participantError } = await supabase
    .from("meeting_participants")
    .select("meeting_id")
    .eq("user_id", userId)

  if (participantError) throw participantError

  const meetingIds = participantMeetings?.map((p) => p.meeting_id) || []

  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .or(`created_by.eq.${userId},id.in.(${meetingIds.join(",")})`)
    .order("meeting_date", { ascending: true })

  if (error) throw error
  return data
}

export const getMeetingById = async (id: string) => {
  const { data, error } = await supabase.from("meetings").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

// Meeting Participants
export const addMeetingParticipant = async (meetingId: string, userId: string) => {
  const { data, error } = await supabase
    .from("meeting_participants")
    .insert([
      {
        meeting_id: meetingId,
        user_id: userId,
        status: "pending",
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

export const updateParticipantStatus = async (meetingId: string, userId: string, status: "accepted" | "declined") => {
  const { data, error } = await supabase
    .from("meeting_participants")
    .update({ status })
    .eq("meeting_id", meetingId)
    .eq("user_id", userId)
    .select()

  if (error) throw error
  return data?.[0]
}

export const getMeetingParticipants = async (meetingId: string) => {
  const { data, error } = await supabase
    .from("meeting_participants")
    .select("*, profiles:user_id(*)")
    .eq("meeting_id", meetingId)

  if (error) throw error
  return data
}

// User Sessions (WhatsApp verification)
export const createUserSession = async (userId: string, whatsappNumber: string) => {
  const { data, error } = await supabase
    .from("user_sessions")
    .insert([
      {
        user_id: userId,
        whatsapp_number: whatsappNumber,
        last_verification: new Date().toISOString(),
        is_verified: true,
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

export const updateUserVerification = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_sessions")
    .update({
      last_verification: new Date().toISOString(),
      is_verified: true,
    })
    .eq("user_id", userId)
    .select()

  if (error) throw error
  return data?.[0]
}

export const getUserSession = async (userId: string) => {
  const { data, error } = await supabase.from("user_sessions").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") throw error // PGRST116 is "no rows returned"
  return data
}

// Notes (Reflections)
export const createNote = async (noteData: Omit<Note, "id" | "created_at">) => {
  const { data, error } = await supabase.from("notes").insert([noteData]).select()

  if (error) throw error
  return data?.[0]
}

export const updateNote = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from("notes")
    .update({
      content,
      edited_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

export const getNotes = async () => {
  const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Performance Metrics
export const getPerformanceMetrics = async (userId: string) => {
  const { data, error } = await supabase.from("dashboard_metrics").select("*").eq("user_id", userId).single()

  if (error) throw error
  return data
}

export const getHistoricalMetrics = async (userId: string) => {
  const { data, error } = await supabase
    .from("historical_metrics")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: true })

  if (error) throw error
  return data
}

// Search functionality
export const searchResources = async (query: string) => {
  // Search in notes
  const { data: notes, error: notesError } = await supabase.from("notes").select("*").ilike("content", `%${query}%`)

  if (notesError) throw notesError

  // Search in meetings
  const { data: meetings, error: meetingsError } = await supabase
    .from("meetings")
    .select("*")
    .or(`name.ilike.%${query}%,agenda.ilike.%${query}%`)

  if (meetingsError) throw meetingsError

  return {
    notes: notes || [],
    meetings: meetings || [],
  }
}

// Buddy Pairs
export const getBuddyPair = async (userId: string) => {
  const { data, error } = await supabase
    .from("buddy_pairs")
    .select("*, buddy:buddy_id(*)")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// Real-time subscriptions
export const subscribeToMeetings = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel("meetings-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "meetings",
        filter: `created_by=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

export const subscribeToNotes = (callback: (payload: any) => void) => {
  return supabase
    .channel("notes-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notes",
      },
      callback,
    )
    .subscribe()
}

export const subscribeToMeetingParticipants = (meetingId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`meeting-participants-${meetingId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "meeting_participants",
        filter: `meeting_id=eq.${meetingId}`,
      },
      callback,
    )
    .subscribe()
}

