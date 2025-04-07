"use client"

import React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon, Clock, MapPin, FileText, Trash2, Edit, Plus, X, Calendar } from "lucide-react"
import { supabase } from "../lib/supabase"
import type { Meeting } from "../types/database"
import * as supabaseService from "../services/supabaseService"
import { format } from "date-fns"

export function MeetingScheduler() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        setLoading(true)
        setError(null)

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setError("Please sign in to view meetings")
          return
        }

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
        const subscription = supabaseService.subscribeToMeetings(user.id || "", (payload) => {
          if (payload.eventType === "INSERT") {
            const newMeeting = {
              ...payload.new,
              meeting_date: payload.new.date,
              meeting_time: payload.new.time,
              links_documents: payload.new.links,
              is_cancelled: payload.new.status === "cancelled"
            } as Meeting
            setMeetings((prev) => [...prev, newMeeting])
          } else if (payload.eventType === "UPDATE") {
            const updatedMeeting = {
              ...payload.new,
              meeting_date: payload.new.date,
              meeting_time: payload.new.time,
              links_documents: payload.new.links,
              is_cancelled: payload.new.status === "cancelled"
            } as Meeting
            setMeetings((prev) => prev.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting)))
          } else if (payload.eventType === "DELETE") {
            setMeetings((prev) => prev.filter((meeting) => meeting.id !== payload.old.id))
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error fetching meetings:", error)
        setError("Failed to load meetings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndMeetings()
  }, [userId])

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
        await supabaseService.updateMeeting(editingMeetingId, {
          name: formData.name,
          agenda: formData.agenda,
          links_documents: formData.links_documents,
          meeting_date: formData.meeting_date,
          meeting_time: formData.meeting_time,
          location: formData.location,
        })
      } else {
        // Create new meeting
        const meeting = await supabaseService.createMeeting({
          name: formData.name,
          agenda: formData.agenda,
          links: formData.links_documents,
          date: formData.meeting_date,
          time: formData.meeting_time,
          location: formData.location,
          created_by: userId,
        })

        // Add buddy as participant if requested
        if (inviteBuddy && buddyId && meeting) {
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
      links_documents: meeting.links || "",
      location: meeting.location,
      meeting_date: meeting.date,
      meeting_time: meeting.time,
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
    .filter((meeting) => new Date(meeting.date) >= new Date() && meeting.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastMeetings = meetings
    .filter((meeting) => new Date(meeting.date) < new Date() && meeting.status !== "cancelled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const canceledMeetings = meetings
    .filter((meeting) => meeting.status === "cancelled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h2>
            <p className="mt-1 text-sm text-gray-500">
              View, schedule, and manage your meetings
            </p>
          </div>
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
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Meeting
          </button>
        </div>

        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h2>
            <p className="mt-1 text-sm text-gray-500">
              View, schedule, and manage your meetings
            </p>
          </div>
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
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Meeting
          </button>
        </div>

        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h2>
          <p className="mt-1 text-sm text-gray-500">
            View, schedule, and manage your meetings
          </p>
        </div>
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
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingMeetings.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Meetings ({upcomingMeetings.length})
              </h3>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    isPast={false}
                    isCanceled={false}
                    onEdit={() => handleEdit(meeting)}
                    onCancel={(id) => handleCancel(id)}
                  />
                ))}
              </div>
            </section>
          )}

          {pastMeetings.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Past Meetings ({pastMeetings.length})
              </h3>
              <div className="space-y-4">
                {pastMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    isPast={true}
                    isCanceled={false}
                  />
                ))}
              </div>
            </section>
          )}

          {canceledMeetings.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Canceled Meetings ({canceledMeetings.length})
              </h3>
              <div className="space-y-4">
                {canceledMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    isPast={false}
                    isCanceled={true}
                  />
                ))}
              </div>
            </section>
          )}

          {meetings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
              <p className="text-gray-500">
                Click the "Schedule Meeting" button to create your first meeting
              </p>
            </div>
          )}
        </div>
      )}

      {/* Meeting Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMeetingId ? "Edit Meeting" : "Schedule New Meeting"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Meeting Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
                  Agenda
                </label>
                <textarea
                  id="agenda"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="meeting_date"
                    name="meeting_date"
                    value={formData.meeting_date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="meeting_time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="meeting_time"
                    name="meeting_time"
                    value={formData.meeting_time}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="links_documents" className="block text-sm font-medium text-gray-700">
                  Meeting Documents URL
                </label>
                <input
                  type="url"
                  id="links_documents"
                  name="links_documents"
                  value={formData.links_documents}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {!editingMeetingId && buddyId && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inviteBuddy"
                    checked={inviteBuddy}
                    onChange={(e) => setInviteBuddy(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inviteBuddy" className="ml-2 block text-sm text-gray-700">
                    Invite my buddy to this meeting
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingMeetingId ? "Save Changes" : "Schedule Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  const formattedDate = format(new Date(meeting.date), "MMMM d, yyyy")

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
          <span>{meeting.time}</span>
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

