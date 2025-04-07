import { supabase } from "../lib/supabase"
import { meetingService } from "./meetingService"

export interface Participant {
  id: string
  name: string
  email: string
}

export interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export const schedulingService = {
  async getParticipantAvailability(participants: string[], dateRange: { start: string; end: string }): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from("meetings")
      .select("date, time")
      .in("created_by", participants)
      .eq("status", "scheduled")
      .gte("date", dateRange.start)
      .lte("date", dateRange.end)

    if (error) throw error

    // Generate all possible time slots in the date range
    const timeSlots: TimeSlot[] = []
    const currentDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    while (currentDate <= endDate) {
      // Add time slots for each day (9 AM to 5 PM)
      for (let hour = 9; hour <= 17; hour++) {
        const timeSlot = {
          date: currentDate.toISOString().split("T")[0],
          time: `${hour}:00`,
          available: true,
        }

        // Check if this slot is already booked
        const isBooked = data?.some(
          (meeting) => meeting.date === timeSlot.date && meeting.time === timeSlot.time
        )

        if (!isBooked) {
          timeSlots.push(timeSlot)
        }
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return timeSlots
  },

  async suggestTimeSlots(
    participants: string[],
    dateRange: { start: string; end: string },
    duration: number = 60
  ): Promise<TimeSlot[]> {
    const availableSlots = await this.getParticipantAvailability(participants, dateRange)
    
    // Group consecutive available slots to form meeting slots
    const meetingSlots: TimeSlot[] = []
    let currentSlot: TimeSlot | null = null

    for (const slot of availableSlots) {
      if (!currentSlot) {
        currentSlot = { ...slot }
      } else {
        const currentTime = parseInt(currentSlot.time)
        const nextTime = parseInt(slot.time)

        if (nextTime - currentTime === 1) {
          // Consecutive slots
          currentSlot.time = `${currentTime}-${nextTime + 1}:00`
        } else {
          // Non-consecutive slots
          if (parseInt(currentSlot.time.split("-")[1]) - parseInt(currentSlot.time.split("-")[0]) >= duration / 60) {
            meetingSlots.push(currentSlot)
          }
          currentSlot = { ...slot }
        }
      }
    }

    // Add the last slot if it meets the duration requirement
    if (currentSlot) {
      const [start, end] = currentSlot.time.split("-")
      if (parseInt(end || start) - parseInt(start) >= duration / 60) {
        meetingSlots.push(currentSlot)
      }
    }

    return meetingSlots
  },

  async scheduleMeeting(
    name: string,
    agenda: string,
    participants: string[],
    date: string,
    time: string,
    location: string,
    createdBy: string
  ): Promise<void> {
    // Check if all participants are available
    const isAvailable = await meetingService.checkAvailability(date, time, createdBy)
    if (!isAvailable) {
      throw new Error("Selected time slot is not available")
    }

    // Create the meeting
    await meetingService.createMeeting({
      name,
      agenda,
      date,
      time,
      location,
      status: "scheduled",
      created_by: createdBy,
    })

    // TODO: Send notifications to participants
  },
} 