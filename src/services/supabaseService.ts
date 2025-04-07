import { supabase } from "../lib/supabase"
import type { Meeting, Note } from "../types/database"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface MeetingWithParticipants extends Meeting {
  meeting_participants?: Array<{ user_id: string; status: string }>
}

type MeetingPayload = RealtimePostgresChangesPayload<{
  [key: string]: any
  created_by: string
  meeting_participants?: Array<{ user_id: string; status: string }>
}>

// Meeting Management
export const createMeeting = async (
  meetingData: Omit<Meeting, "id" | "created_at" | "status">,
) => {
  const { data, error } = await supabase
    .from("meetings")
    .insert([
      {
        name: meetingData.name,
        agenda: meetingData.agenda,
        links: meetingData.links_documents,
        date: meetingData.meeting_date,
        time: meetingData.meeting_time,
        location: meetingData.location,
        status: "scheduled",
        created_by: meetingData.created_by,
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

export const updateMeeting = async (id: string, meetingData: Partial<Meeting>) => {
  const updateData: any = {}
  if (meetingData.name) updateData.name = meetingData.name
  if (meetingData.agenda) updateData.agenda = meetingData.agenda
  if (meetingData.links_documents) updateData.links = meetingData.links_documents
  if (meetingData.meeting_date) updateData.date = meetingData.meeting_date
  if (meetingData.meeting_time) updateData.time = meetingData.meeting_time
  if (meetingData.location) updateData.location = meetingData.location

  const { data, error } = await supabase
    .from("meetings")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

export const cancelMeeting = async (id: string) => {
  const { data, error } = await supabase
    .from("meetings")
    .update({
      status: "cancelled",
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data?.[0]
}

export const getMeetings = async (userId: string) => {
  try {
    // First get all meetings where user is a participant
    const { data: participantMeetings, error: participantError } = await supabase
      .from("meeting_participants")
      .select("meeting_id")
      .eq("user_id", userId)

    if (participantError) throw participantError

    const meetingIds = participantMeetings?.map((p) => p.meeting_id) || []

    // Then get all meetings where user is either creator or participant
    const { data, error } = await supabase
      .from("meetings")
      .select("*, meeting_participants(user_id, status)")
      .or(`created_by.eq.${userId}${meetingIds.length ? `,id.in.(${meetingIds.join(",")})` : ""}`)
      .order("date", { ascending: true })

    if (error) throw error

    // Transform the data to match the expected format
    return (data || []).map(meeting => ({
      ...meeting,
      meeting_date: meeting.date,
      meeting_time: meeting.time,
      links_documents: meeting.links,
      is_cancelled: meeting.status === "cancelled"
    }))
  } catch (error) {
    console.error("Error in getMeetings:", error)
    throw error
  }
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

// Search functionality
export const searchReflections = async (query: string, userId: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("created_by", userId)
    .ilike("content", `%${query}%`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Buddy Pairs
export const getBuddyPair = async (userId: string) => {
  const { data, error } = await supabase
    .from("buddy_pairs")
    .select("*, officer2:officer2_id(*)")
    .eq("officer1_id", userId)
    .single()

  if (!data) {
    // Check if user is officer2
    const { data: reverseData, error: reverseError } = await supabase
      .from("buddy_pairs")
      .select("*, officer1:officer1_id(*)")
      .eq("officer2_id", userId)
      .single()

    if (reverseError && reverseError.code !== "PGRST116") throw reverseError
    if (reverseData) {
      return {
        ...reverseData,
        buddy_id: reverseData.officer1_id,
        buddy: reverseData.officer1
      }
    }
  }

  if (error && error.code !== "PGRST116") throw error
  if (data) {
    return {
      ...data,
      buddy_id: data.officer2_id,
      buddy: data.officer2
    }
  }
  return null
}

// Real-time subscriptions
export const subscribeToMeetings = (userId: string, callback: (payload: MeetingPayload) => void) => {
  return supabase
    .channel("meetings-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "meetings",
      },
      (payload: MeetingPayload) => {
        // Check if user is creator or participant
        const newData = payload.new as { created_by: string; meeting_participants?: Array<{ user_id: string; status: string }> }
        if (
          newData.created_by === userId ||
          (newData.meeting_participants && newData.meeting_participants.some((p) => p.user_id === userId))
        ) {
          callback(payload)
        }
      }
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

