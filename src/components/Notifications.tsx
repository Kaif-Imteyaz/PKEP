"use client"

import { useState } from "react"
import { Bell, Award, Calendar, TrendingUp, X, ChevronRight } from "lucide-react"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"

interface Notification {
  id: string
  type: "progress" | "badge" | "meeting" | "general"
  title: string
  message: string
  time: string
  read: boolean
  actionable?: boolean
  action?: string
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "badge",
    title: "New Badge Earned! 🏅",
    message: "Congratulations! You've earned the 'Efficiency Expert' badge for reducing process days by 20%.",
    time: "2 hours ago",
    read: false,
    actionable: true,
    action: "badges",
  },
  {
    id: "2",
    type: "progress",
    title: "Weekly Progress Update",
    message: "Your application processing time improved by 15% this week. Keep up the great work!",
    time: "1 day ago",
    read: false,
    actionable: true,
    action: "dashboard",
  },
  {
    id: "3",
    type: "meeting",
    title: "Upcoming Peer Meeting",
    message: "Reminder: Your meeting with Dharmendra is scheduled for tomorrow at 2:00 PM.",
    time: "1 day ago",
    read: true,
    actionable: false,
  },
  {
    id: "4",
    type: "progress",
    title: "Monthly Performance Summary",
    message: "You've processed 45 applications this month with an average completion time of 3.2 days.",
    time: "3 days ago",
    read: true,
    actionable: true,
    action: "dashboard",
  },
  {
    id: "5",
    type: "badge",
    title: "Badge Progress Update",
    message: "You're 80% of the way to earning the 'Speed Demon' badge. Process 5 more applications quickly!",
    time: "5 days ago",
    read: true,
    actionable: true,
    action: "badges",
  },
  {
    id: "6",
    type: "meeting",
    title: "Meeting Completed",
    message: "Your peer learning session with Amitabh Bachchan has been marked as completed.",
    time: "1 week ago",
    read: true,
    actionable: false,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const handleNavigation = (view: string) => {
    const event = new CustomEvent("viewChange", { detail: view })
    window.dispatchEvent(event)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((notif) => !notif.read) : notifications

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Award className="h-5 w-5 text-yellow-600" />
      case "progress":
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case "meeting":
        return <Calendar className="h-5 w-5 text-green-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? "50" : "100"
    switch (type) {
      case "badge":
        return `bg-yellow-${opacity} border-yellow-200`
      case "progress":
        return `bg-blue-${opacity} border-blue-200`
      case "meeting":
        return `bg-green-${opacity} border-green-200`
      default:
        return `bg-gray-${opacity} border-gray-200`
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="primary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with your progress and activities</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
            className="text-sm"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "primary" : "outline"}
            onClick={() => setFilter("unread")}
            className="text-sm"
          >
            Unread ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="text-sm">
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <Card variant="elevated">
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === "unread" ? "You're all caught up!" : "No notifications to show"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {notification.actionable && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleNavigation(notification.action!)
                              markAsRead(notification.id)
                            }}
                            className="text-xs h-8"
                            icon={<ChevronRight className="h-3 w-3" />}
                            iconPosition="right"
                          >
                            {notification.action === "dashboard"
                              ? "View Metrics"
                              : notification.action === "badges"
                                ? "View Badges"
                                : "View Details"}
                          </Button>
                          {!notification.read && (
                            <Button variant="ghost" onClick={() => markAsRead(notification.id)} className="text-xs h-8">
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          variant="elevated"
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleNavigation("dashboard")}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Recent Progress</h4>
                <p className="text-sm text-gray-500">15% improvement this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          variant="elevated"
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleNavigation("badges")}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">New Badges</h4>
                <p className="text-sm text-gray-500">2 earned this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Upcoming Meetings</h4>
                <p className="text-sm text-gray-500">1 meeting tomorrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
