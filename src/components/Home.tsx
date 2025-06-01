"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  FileText,
  BarChart,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  BookOpen,
  Book,
  CheckSquare,
  LayoutGrid,
  Target,
  Award,
  Pin,
} from "lucide-react"
import { supabase } from "../lib/supabase"
import { differenceInDays } from "date-fns"
import { Card, CardContent, CardHeader, CardFooter } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { badgeData } from "../lib/badge-data"

const BUDDY_PAIRS: Record<string, string> = {
  "test@punjab.gov.in": "test2@punjab.gov.in",
  "test2@punjab.gov.in": "test@punjab.gov.in",
  "test3@punjab.gov.in": "test4@punjab.gov.in",
  "test4@punjab.gov.in": "test3@punjab.gov.in",
}

const BUDDY_NAMES: Record<string, string> = {
  "test@punjab.gov.in": "Amitabh Bachchan",
  "test2@punjab.gov.in": "Dharmendra",
  "test3@punjab.gov.in": "Rekha",
  "test4@punjab.gov.in": "Sridevi",
}

export function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [buddyName, setBuddyName] = useState<string | null>(null)
  const [meetingsCompleted] = useState(3)
  const [totalMeetings] = useState(5)
  const nextMeetingDate = new Date("2025-02-15T14:00:00")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    newBadgesEarned: 0,
    upcomingMeetings: 0,
    resourcesAccessed: 0,
    reflectionsSubmitted: 0,
  })

  // Get new badges (earned in the last 7 days)
  const newBadges = badgeData.filter((badge) => badge.earned && badge.daysAgo <= 7)

  useEffect(() => {
    fetchBuddyInfo()
  }, [])

  const fetchBuddyInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) return

      setUserEmail(user.email)
      setCurrentUser(BUDDY_NAMES[user.email])

      const buddyEmail = BUDDY_PAIRS[user.email]
      if (buddyEmail) {
        setBuddyName(BUDDY_NAMES[buddyEmail])
      }

      // Simulate fetching stats
      // In a real app, you would fetch this from your database
      setTimeout(() => {
        setStats({
          newBadgesEarned: newBadges.length, // Use consistent count
          upcomingMeetings: 2,
          resourcesAccessed: 28,
          reflectionsSubmitted: 5,
        })

        // Calculate profile completion based on some criteria
        const completionSteps = [
          !!user.user_metadata?.full_name,
          !!user.phone,
          !!user.user_metadata?.department,
          !!user.user_metadata?.designation,
          !!user.user_metadata?.location,
        ]

        // Set completion percentage to 83%
        setCompletionPercentage(83)

        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching buddy info:", error)
    }
  }

  const handleNavigation = (view: string) => {
    const event = new CustomEvent("viewChange", { detail: view })
    window.dispatchEvent(event)
  }

  const daysUntilNextMeeting = differenceInDays(nextMeetingDate, new Date())

  return (
    <div className="space-y-8">
      {/* Logos Ribbon */}
      <div className="bg-white border-b border-gray-200 shadow-sm animate-fade-in">
        <div className="flex flex-col items-center py-4">
          <span className="text-xs text-gray-500 mb-3">Powered by</span>
          <div className="flex items-center space-x-8">
            <img
              src="/punjab-gov.svg"
              alt="Department of Governance Reforms, Punjab"
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="h-8 border-r border-gray-300"></div>
            <img
              src="/isb.png"
              alt="Indian School of Business"
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-teal-700 shadow-lg animate-fade-in">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          ></div>
        </div>

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 animate-slide-up">
                Welcome back, {currentUser || "Officer"}
              </h1>
              <p
                className="text-primary-50 max-w-xl leading-relaxed animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                Your knowledge exchange journey continues today. Track your progress, connect with peers, and enhance
                your professional development.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-500/20 mr-3">
                  <Award className="h-5 w-5 text-yellow-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-yellow-100">New Badges Earned</p>
                  <p className="text-xl font-bold">{stats.newBadgesEarned}</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "250ms" }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-500/20 mr-3">
                  <Calendar className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-green-100">Upcoming Meetings</p>
                  <p className="text-xl font-bold">{stats.upcomingMeetings}</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                  <Book className="h-5 w-5 text-purple-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-purple-100">Resources Accessed</p>
                  <p className="text-xl font-bold">{stats.resourcesAccessed}</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "350ms" }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-500/20 mr-3">
                  <CheckSquare className="h-5 w-5 text-amber-300" />
                </div>
                <div className="text-white">
                  <p className="text-xs text-amber-100">Reflections Submitted</p>
                  <p className="text-xl font-bold">{stats.reflectionsSubmitted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Badges Section */}
      {newBadges.length > 0 && (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "375ms" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">New Achievements</h3>
            </div>
            <button
              className="text-primary-600 text-sm font-medium flex items-center"
              onClick={() => handleNavigation("badges")}
            >
              View all badges
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 mb-4">
            <p className="text-primary-800 font-medium">
              🎉 Congratulations! You've earned {newBadges.length} new badge{newBadges.length > 1 ? "s" : ""}. Visit the
              Badges page to celebrate your achievement!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newBadges.map((badge) => (
              <Card
                key={badge.id}
                variant="elevated"
                className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border border-gray-200 shadow-sm"
                onClick={() => handleNavigation("badges")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{badge.emoji}</div>
                      <h4 className="font-semibold text-gray-900 text-lg">{badge.title}</h4>
                    </div>
                    <Badge
                      variant="primary"
                      className="text-xs bg-blue-100 text-blue-800 border border-blue-200 rounded-md px-2 py-1"
                    >
                      NEW!
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{badge.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Earned{" "}
                      {badge.daysAgo === 0 ? "today" : badge.daysAgo === 1 ? "yesterday" : `${badge.daysAgo} days ago`}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Section - Changed from 2-column to full width */}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
          </div>
          <button
            className="text-primary-600 text-sm font-medium flex items-center"
            onClick={() => handleNavigation("#")}
          >
            View all meetings
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        {/* Next Meeting Card */}

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader
            title={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Peer Meeting</h3>
                <Badge variant="primary" className="animate-pulse-slow">
                  {daysUntilNextMeeting} days away
                </Badge>
              </div>
            }
          />
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-secondary-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                {buddyName ? buddyName.charAt(0) : "B"}
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">With {buddyName || "your buddy"}</h4>
                <p className="text-sm text-gray-500">Revenue Service, Mentor</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-gray-600">February 15, 2025 at 2:00 PM IST</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-gray-600">Virtual (Webex Meeting)</span>
              </div>

              <div className="pt-3 flex items-center space-x-4">
                <Button variant="primary" icon={<ArrowUpRight className="h-4 w-4" />} iconPosition="right">
                  Join Meeting
                </Button>

                <Button variant="outline" onClick={() => handleNavigation("reflection")}>
                  Prepare Reflection
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-600">
                Completed: {meetingsCompleted} of {totalMeetings} sessions
              </p>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round((meetingsCompleted / totalMeetings) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round((meetingsCompleted / totalMeetings) * 100)}%
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access Section */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "550ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Pin className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
          </div>
          <button className="text-primary-600 text-sm font-medium flex items-center">
            {/* Customize Dashboard */}
            <LayoutGrid className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            variant="elevated"
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation("reflection")}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-blue-100 mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Reflection Notes</h4>
                  <p className="text-xs text-gray-500 mt-1">Review and add meeting reflections</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            variant="elevated"
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation("dashboard")}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 mr-3 group-hover:bg-green-200 transition-colors duration-300">
                  <BarChart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Service Metrices</h4>
                  <p className="text-xs text-gray-500 mt-1">View your progress</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            variant="elevated"
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation("resources")}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-100 mr-3 group-hover:bg-amber-200 transition-colors duration-300">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Resource Hub</h4>
                  <p className="text-xs text-gray-500 mt-1">Access knowledge repository</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            variant="elevated"
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => handleNavigation("badges")}
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-yellow-100 mr-3 group-hover:bg-yellow-200 transition-colors duration-300">
                  <Target className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">My Badges</h4>
                  <p className="text-xs text-gray-500 mt-1">View achievements and progress</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Add keyframe animations to the index.css file
const styleTag = document.createElement("style")
styleTag.innerHTML = `
  @keyframes progressAnim {
    from { width: 0%; }
    to { width: ${Math.round((3 / 5) * 100)}%; }
  }
  
  @keyframes progressAnimation {
    from { stroke-dashoffset: 251.2; }
    to { stroke-dashoffset: ${251.2 - 251.2 * (3 / 5)}; }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`
document.head.appendChild(styleTag)
