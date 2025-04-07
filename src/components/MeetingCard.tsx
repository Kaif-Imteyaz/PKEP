import React from "react"
import { format } from "date-fns"
import { Meeting } from "../types/database"
import { Calendar, Clock, MapPin, Link, Edit2, XCircle } from "react-feather"

interface MeetingCardProps {
  meeting: Meeting
  isPast?: boolean
  isCanceled?: boolean
  onEdit?: (meeting: Meeting) => void
  onCancel?: (meetingId: string) => void
}

export function MeetingCard({ meeting, isPast = false, isCanceled = false, onEdit, onCancel }: MeetingCardProps) {
  const formattedDate = format(new Date(meeting.date), "MMMM d, yyyy")
  const formattedTime = format(new Date(`${meeting.date}T${meeting.time}`), "h:mm a")
  const statusColor = isCanceled ? "text-red-600" : isPast ? "text-gray-600" : "text-green-600"
  const statusText = isCanceled ? "Cancelled" : isPast ? "Past" : "Scheduled"

  return (
    <div className={`
      p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200
      ${isCanceled ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"}
      ${isPast ? "opacity-80" : ""}
    `}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-medium ${isCanceled ? "text-gray-500 line-through" : "text-gray-900"}`}>
              {meeting.name}
            </h4>
            <span className={`text-sm font-medium ${statusColor}`}>
              {statusText}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{formattedTime}</span>
            </div>
            {meeting.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{meeting.location}</span>
              </div>
            )}
            {meeting.links && (
              <div className="flex items-center text-gray-600">
                <Link className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href={meeting.links}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Meeting Documents
                </a>
              </div>
            )}
          </div>

          {meeting.agenda && (
            <div className="mt-3 text-gray-600 text-sm">
              <strong className="font-medium">Agenda:</strong>
              <p className="mt-1 whitespace-pre-wrap">{meeting.agenda}</p>
            </div>
          )}
        </div>

        {!isPast && !isCanceled && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(meeting)}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                title="Edit meeting"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(meeting.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                title="Cancel meeting"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 