"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon, Clock, MapPin, FileText, Trash2, Edit, Plus, X } from "lucide-react"
import { supabase } from "../lib/supabase"
import type { Meeting } from "../types/database"
import * as supabaseService from "../services/supabaseService"
import { format } from "date-fns"

export function MeetingScheduler() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    agenda: "",
    links_documents: "",
    location: "",
    meeting_date: "",
    meeting_time: "",
  })
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [buddyId, setBuddyId] = useState<string | null>(null)
  const [inviteBuddy, setInviteBuddy] = useState(true)

  useEffect(() => {
    const fetchUserAndMeetings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUserId(user.id)

        // Get buddy information
        const buddyPair = await supabaseService.getBuddyPair(user.id)
        if (buddyPair) {
          setBuddyId(buddyPair.buddy_id)
        }

        // Get meetings
        const meetingsData = await supabaseService.getMeetings(user.id)
        setMeetings(meetingsData || [])

        // Subscribe to real-time updates
        const subscription = supabaseService.subscribeToMeetings(user.id, (payload) => {
          if (payload.eventType === "INSERT") {
            setMeetings((prev) => [...prev, payload.new])
          } else if (payload.eventType === "UPDATE") {
            setMeetings((prev) => prev.map((meeting) => (meeting.id === payload.new.id ? payload.new : meeting)))
          } else if (payload.eventType === "DELETE") {
            setMeetings((prev) => prev.filter((meeting) => meeting.id !== payload.old.id))
          }
        })

        setLoading(false)

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error fetching meetings:", error)
        setLoading(false)
      }
    }

    fetchUserAndMeetings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) return

    try {
      if (editingMeetingId) {
        // Update existing meeting
        await supabaseService.updateMeeting(editingMeetingId, formData)
      } else {
        // Create new meeting
        const meeting = await supabaseService.createMeeting({
          ...formData,
          created_by: userId,
          performance_metrics: "",
        })

        // Add buddy as participant if requested
        if (inviteBuddy && buddyId) {
          await supabaseService.addMeetingParticipant(meeting.id, buddyId)
        }
      }

      // Reset form
      setFormData({
        name: "",
        agenda: "",
        links_documents: "",
        location: "",
        meeting_date: "",
        meeting_time: "",
      })
      setEditingMeetingId(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving meeting:", error)
      alert("There was an error saving the meeting. Please try again.")
    }
  }

  const handleEdit = (meeting: Meeting) => {
    setFormData({
      name: meeting.name,
      agenda: meeting.agenda,
      links_documents: meeting.links_documents || "",
      location: meeting.location,
      meeting_date: meeting.meeting_date,
      meeting_time: meeting.meeting_time,
    })
    setEditingMeetingId(meeting.id)
    setShowForm(true)
  }

  const handleCancel = async (meetingId: string) => {
    if (confirm("Are you sure you want to cancel this meeting?")) {
      try {
        await supabaseService.cancelMeeting(meetingId)
      } catch (error) {
        console.error("Error canceling meeting:", error)
        alert("There was an error canceling the meeting. Please try again.")
      }
    }
  }

  const upcomingMeetings = meetings
    .filter((meeting) => new Date(meeting.meeting_date) >= new Date() && !meeting.is_cancelled)
    .sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())

  const pastMeetings = meetings
    .filter((meeting) => new Date(meeting.meeting_date) < new Date() && !meeting.is_cancelled)
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime())

  const canceledMeetings = meetings
    .filter((meeting) => meeting.is_cancelled)
    .sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Meeting Scheduler</h2>
        <button
          onClick={() => {
            setFormData({
              name: "",
              agenda: "",
              links_documents: "",
              location: "",
              meeting_date: "",
              meeting_time: "",
            })
            setEditingMeetingId(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editingMeetingId ? "Edit Meeting" : "Schedule New Meeting"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                  Agenda
                </label>
                <textarea
                  id="agenda"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="links_documents" className="block text-sm font-medium text-gray-700 mb-1">
                  Links & Documents (Optional)
                </label>
                <input
                  type="text"
                  id="links_documents"
                  name="links_documents"
                  value={formData.links_documents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add links to relevant documents or resources"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="meeting_date"
                    name="meeting_date"
                    value={formData.meeting_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="meeting_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="meeting_time"
                    name="meeting_time"
                    value={formData.meeting_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Webex, Office Room 101, etc."
                />
              </div>

              {!editingMeetingId && buddyId && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="invite_buddy"
                    checked={inviteBuddy}
                    onChange={() => setInviteBuddy(!inviteBuddy)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="invite_buddy" className="ml-2 block text-sm text-gray-700">
                    Invite my buddy to this meeting
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  {editingMeetingId ? "Update Meeting" : "Schedule Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading meetings...</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Meetings</h3>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} onEdit={handleEdit} onCancel={handleCancel} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4">No upcoming meetings scheduled.</p>
              )}
            </div>

            {pastMeetings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Past Meetings</h3>
                <div className="space-y-4">
                  {pastMeetings.slice(0, 3).map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} isPast />
                  ))}
                  {pastMeetings.length > 3 && (
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View all past meetings
                    </button>
                  )}
                </div>
              </div>
            )}

            {canceledMeetings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Canceled Meetings</h3>
                <div className="space-y-4">
                  {canceledMeetings.slice(0, 3).map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} isCanceled />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface MeetingCardProps {
  meeting: Meeting
  isPast?: boolean
  isCanceled?: boolean
  onEdit?: (meeting: Meeting) => void
  onCancel?: (meetingId: string) => void
}

function MeetingCard({ meeting, isPast, isCanceled, onEdit, onCancel }: MeetingCardProps) {
  const formattedDate = format(new Date(meeting.meeting_date), "MMMM d, yyyy")

  return (
    <div className={`border rounded-lg p-4 ${isCanceled ? "bg-gray-50 border-gray-200" : "bg-white"}`}>
      <div className="flex justify-between items-start">
        <h4 className={`font-medium ${isCanceled ? "text-gray-500 line-through" : "text-gray-900"}`}>{meeting.name}</h4>
        {!isPast && !isCanceled && onEdit && onCancel && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(meeting)}
              className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded"
              title="Edit Meeting"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onCancel(meeting.id)}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded"
              title="Cancel Meeting"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{meeting.meeting_time}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{meeting.location}</span>
        </div>

        {meeting.agenda && (
          <div className="flex items-start text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2 mt-0.5" />
            <span className="line-clamp-2">{meeting.agenda}</span>
          </div>
        )}
      </div>

      {isCanceled && <div className="mt-2 text-sm text-red-600">This meeting has been canceled.</div>}
    </div>
  )
}

