"use client"

import React, { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send, Calendar, Clock, Users, MapPin, FileText } from 'lucide-react'
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from 'uuid'
import { meetingService, type Meeting } from "../services/meetingService"
import { schedulingService, type TimeSlot } from "../services/schedulingService"
import { reflectionService, type ReflectionType, type Reflection } from "../services/reflectionService"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  buttons?: Button[]
}

interface Button {
  id: string
  text: string
  action: string
  data?: any
}

type ConversationState = {
  mode?: "new_meeting" | "smart_scheduling" | "add_reflection" | "view_reflections" | "search"
  step?: number
  meetingData?: Partial<Meeting>
  participants?: string[]
  dateRange?: { start: string; end: string }
  reflectionType?: ReflectionType
  noteType?: string
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [conversationState, setConversationState] = useState<ConversationState>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        showMainMenu()
      } else {
        addBotMessage("Please sign in to use the meeting assistant.")
      }
    }
    getCurrentUser()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addBotMessage = (content: string, buttons?: Button[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type: "bot",
        content: content.split("\n").join("\n\n"),
        timestamp: new Date(),
        buttons,
      },
    ])
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type: "user",
        content: content.split("\n").join("\n\n"),
        timestamp: new Date(),
      },
    ])
  }

  const showMainMenu = () => {
    const buttons: Button[] = [
      { id: "view_meetings", text: "📅 View Meetings", action: "view_meetings" },
      { id: "new_meeting", text: "➕ New Meeting", action: "new_meeting" },
      { id: "smart_schedule", text: "🤖 Smart Schedule", action: "smart_schedule" },
      { id: "reflections", text: "📝 Reflections & Knowledge", action: "reflections" },
      { id: "search", text: "🔍 Search Notes", action: "search" },
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("Welcome to the Meeting Assistant! How can I help you today?", buttons)
  }

  const handleButtonClick = async (button: Button) => {
    switch (button.action) {
      case "view_meetings":
        await fetchMeetings()
        break
      case "new_meeting":
        startNewMeetingFlow()
        break
      case "smart_schedule":
        startSmartSchedulingFlow()
        break
      case "reschedule":
        await handleReschedule(button.data)
        break
      case "cancel":
        await handleCancel(button.data)
        break
      case "details":
        await handleDetails(button.data)
        break
      case "confirm_cancel":
        await confirmCancel(button.data)
        break
      case "select_time":
        await handleTimeSelection(button.data)
        break
      case "reflections":
        showReflectionsMenu()
        break
      case "add_reflection":
        startAddReflectionFlow(button.data)
        break
      case "view_reflections":
        await viewReflections(button.data)
        break
      case "search":
        startSearchFlow()
        break
      case "back_to_menu":
        showMainMenu()
        break
      case "search_filter":
        startSearchWithFilter(button.data)
        break
    }
  }

  const handleCommand = async (command: string) => {
    if (!userId) {
      addBotMessage("Please sign in to use the meeting assistant.")
      return
    }

    switch (command) {
      case "/meetings":
        await fetchMeetings()
        break
      case "/new_meeting":
        startNewMeetingFlow()
        break
      case "/schedule_meeting":
        startSmartSchedulingFlow()
        break
      case "/menu":
        showMainMenu()
        break
      default:
        addBotMessage("I don't understand that command. Try /menu to see available options.")
    }
  }

  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-')
  }

  const formatDateForDB = (dateStr: string) => {
    const [day, month, year] = dateStr.split('-')
    return `${year}-${month}-${day}`
  }

  const formatMeetingMessage = (meeting: Meeting) => {
    return `📅 Meeting: ${meeting.name}
📝 Agenda: ${meeting.agenda}
📍 Location: ${meeting.location}
🕒 Time: ${meeting.time}, ${formatDateForDisplay(meeting.date)}`
  }

  const fetchMeetings = async () => {
    try {
      const meetings = await meetingService.getMeetings(userId!)
      if (meetings.length === 0) {
        // Add example meeting
        const exampleMeeting = {
          id: "example",
          name: "abort",
          agenda: "2026-10-09",
          location: "Zoom",
          time: "12:00:00",
          date: "2026-10-09",
          status: "scheduled" as const,
          created_by: userId!,
          created_at: new Date().toISOString(),
        }

        const buttons: Button[] = [
          { id: `reschedule_${exampleMeeting.id}`, text: "🔄 Reschedule", action: "reschedule", data: exampleMeeting.id },
          { id: `cancel_${exampleMeeting.id}`, text: "❌ Cancel", action: "cancel", data: exampleMeeting.id },
          { id: `details_${exampleMeeting.id}`, text: "📄 Details", action: "details", data: exampleMeeting.id },
        ]

        addBotMessage(formatMeetingMessage(exampleMeeting), buttons)

        const actionButtons: Button[] = [
          { id: "new_meeting", text: "➕ Schedule New Meeting", action: "new_meeting" },
          { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
        ]
        addBotMessage("What would you like to do?", actionButtons)
        return
      }

      meetings.forEach((meeting) => {
        const buttons: Button[] = [
          { id: `reschedule_${meeting.id}`, text: "🔄 Reschedule", action: "reschedule", data: meeting.id },
          { id: `cancel_${meeting.id}`, text: "❌ Cancel", action: "cancel", data: meeting.id },
          { id: `details_${meeting.id}`, text: "📄 Details", action: "details", data: meeting.id },
        ]

        addBotMessage(formatMeetingMessage(meeting), buttons)
      })

      const buttons: Button[] = [
        { id: "new_meeting", text: "➕ Schedule New Meeting", action: "new_meeting" },
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage("What would you like to do next?", buttons)
    } catch (error) {
      console.error("Error fetching meetings:", error)
      addBotMessage("Sorry, I couldn't fetch your meetings. Please try again later.")
      showMainMenu()
    }
  }

  const startNewMeetingFlow = () => {
    setConversationState({ mode: "new_meeting", step: 1, meetingData: {} })
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("📅 Creating a new meeting...\n\n📝 Enter Meeting Name:", buttons)
  }

  const startSmartSchedulingFlow = () => {
    setConversationState({ mode: "smart_scheduling", step: 1, meetingData: {}, participants: [] })
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("📅 Let's schedule a new meeting!\n\n📝 Enter Meeting Name:", buttons)
  }

  const handleReschedule = async (meetingId: string) => {
    try {
      const meeting = await meetingService.getMeetingDetails(meetingId)
      const buttons: Button[] = [
        { id: "reschedule_1", text: "+1 Day", action: "select_time", data: { meetingId, days: 1 } },
        { id: "reschedule_2", text: "+2 Days", action: "select_time", data: { meetingId, days: 2 } },
        { id: "reschedule_custom", text: "Custom Date", action: "select_time", data: { meetingId, custom: true } },
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage(`🗓️ Select new date & time for "${meeting.name}":`, buttons)
    } catch (error) {
      console.error("Error rescheduling meeting:", error)
      addBotMessage("Sorry, I couldn't reschedule the meeting. Please try again later.")
      showMainMenu()
    }
  }

  const handleCancel = async (meetingId: string) => {
    const buttons: Button[] = [
      { id: "confirm_cancel", text: "✅ Yes", action: "confirm_cancel", data: meetingId },
      { id: "cancel_cancel", text: "❌ No", action: "cancel_cancel" },
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("⚠️ Are you sure you want to cancel this meeting?", buttons)
  }

  const confirmCancel = async (meetingId: string) => {
    try {
      await meetingService.cancelMeeting(meetingId)
      addBotMessage("✅ Meeting has been canceled successfully.")
      showMainMenu()
    } catch (error) {
      console.error("Error canceling meeting:", error)
      addBotMessage("Sorry, I couldn't cancel the meeting. Please try again later.")
      showMainMenu()
    }
  }

  const handleDetails = async (meetingId: string) => {
    try {
      const meeting = await meetingService.getMeetingDetails(meetingId)
      const buttons: Button[] = [
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage(
        `📅 Meeting Details:
📝 Name: ${meeting.name}
📍 Location: ${meeting.location}
📆 Date: ${formatDateForDisplay(meeting.date)}
🕒 Time: ${meeting.time}
👤 Created by: You
🕰️ Created at: ${new Date(meeting.created_at).toLocaleString()}`,
        buttons
      )
    } catch (error) {
      console.error("Error fetching meeting details:", error)
      addBotMessage("Sorry, I couldn't fetch the meeting details. Please try again later.")
      showMainMenu()
    }
  }

  const handleTimeSelection = async (data: { meetingId: string; days?: number; custom?: boolean }) => {
    if (data.custom) {
      const buttons: Button[] = [
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage("Please enter the new date (DD-MM-YYYY):", buttons)
      return
    }

    try {
      const meeting = await meetingService.getMeetingDetails(data.meetingId)
      const newDate = new Date(meeting.date)
      newDate.setDate(newDate.getDate() + (data.days || 0))

      await meetingService.updateMeeting(data.meetingId, {
        date: newDate.toISOString().split("T")[0],
      })

      addBotMessage(`✅ Meeting rescheduled to ${formatDateForDisplay(newDate.toISOString().split("T")[0])} at ${meeting.time}`)
      showMainMenu()
    } catch (error) {
      console.error("Error updating meeting time:", error)
      addBotMessage("Sorry, I couldn't update the meeting time. Please try again later.")
      showMainMenu()
    }
  }

  const showReflectionsMenu = () => {
    const buttons: Button[] = [
      { id: "add_bud", text: "🌱 Add Opportunity", action: "add_reflection", data: "bud" },
      { id: "add_rose", text: "🌹 Add Success Story", action: "add_reflection", data: "rose" },
      { id: "add_thorn", text: "🌵 Add Challenge", action: "add_reflection", data: "thorn" },
      { id: "view_all", text: "👀 View All", action: "view_reflections" },
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("📝 Reflections & Knowledge Sharing\n\nCapture and share your experiences:", buttons)
  }

  const startAddReflectionFlow = (type: ReflectionType) => {
    setConversationState({ mode: "add_reflection", reflectionType: type })
    const emoji = reflectionService.getReflectionTypeEmoji(type)
    const description = reflectionService.getReflectionTypeDescription(type)
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage(`${emoji} Add a new ${description}\n\nPlease enter your reflection:`, buttons)
  }

  const viewReflections = async (type?: ReflectionType) => {
    try {
      const reflections = await reflectionService.getReflections(userId!, type)
      
      if (reflections.length === 0) {
        const buttons: Button[] = [
          { id: "add_reflection", text: "➕ Add Reflection", action: "reflections" },
          { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
        ]
        addBotMessage("No reflections found.", buttons)
        return
      }

      reflections.forEach((reflection) => {
        const emoji = reflectionService.getReflectionTypeEmoji(reflection.type)
        const description = reflectionService.getReflectionTypeDescription(reflection.type)
        addBotMessage(
          `${emoji} ${description}:\n${reflection.content}\n\n📅 ${new Date(reflection.created_at).toLocaleDateString()}`
        )
      })

      const buttons: Button[] = [
        { id: "add_reflection", text: "➕ Add Reflection", action: "reflections" },
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage("What would you like to do next?", buttons)
    } catch (error) {
      console.error("Error fetching reflections:", error)
      addBotMessage("Sorry, I couldn't fetch the reflections. Please try again later.")
      showMainMenu()
    }
  }

  const startSearchFlow = () => {
    setConversationState({ mode: "search", step: 1 })
    const buttons: Button[] = [
      { id: "search_all", text: "🔍 All Notes", action: "search_filter", data: "all" },
      { id: "search_rose", text: "🌹 Success Stories", action: "search_filter", data: "rose" },
      { id: "search_thorn", text: "🌵 Challenges", action: "search_filter", data: "thorn" },
      { id: "search_bud", text: "🌱 Opportunities", action: "search_filter", data: "bud" },
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("🔍 What type of notes would you like to search?", buttons)
  }

  const startSearchWithFilter = (filter: string) => {
    setConversationState({ mode: "search", step: 2, noteType: filter })
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]
    addBotMessage("🔍 Enter your search keywords:", buttons)
  }

  const handleSearch = async (query: string) => {
    try {
      const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
      
      if (keywords.length === 0) {
        addBotMessage("Please enter at least one keyword to search.")
        return
      }

      let searchQuery = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply type filter if specified
      if (conversationState.noteType && conversationState.noteType !== 'all') {
        searchQuery = searchQuery.eq('type', conversationState.noteType)
      }

      const { data: notes, error } = await searchQuery

      if (error) throw error

      if (!notes || notes.length === 0) {
        const buttons: Button[] = [
          { id: "search", text: "🔍 New Search", action: "search" },
          { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
        ]
        addBotMessage("No notes found matching your search.", buttons)
        return
      }

      // Filter notes based on keywords
      const matchedNotes = notes.filter(note => {
        const content = note.content.toLowerCase()
        // Return true if any keyword matches
        return keywords.some(keyword => content.includes(keyword))
      })

      if (matchedNotes.length === 0) {
        const buttons: Button[] = [
          { id: "search", text: "🔍 New Search", action: "search" },
          { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
        ]
        addBotMessage("No notes found matching your keywords.", buttons)
        return
      }

      // Sort notes by number of keyword matches (most relevant first)
      const scoredNotes = matchedNotes.map(note => {
        const content = note.content.toLowerCase()
        const matchCount = keywords.reduce((count, keyword) => 
          count + (content.includes(keyword) ? 1 : 0), 0)
        return { ...note, matchCount }
      }).sort((a, b) => b.matchCount - a.matchCount)

      // Display results
      addBotMessage(`Found ${scoredNotes.length} matching notes:`)
      
      scoredNotes.slice(0, 5).forEach((note) => {
        const emoji = note.type === 'rose' ? '🌹' : note.type === 'thorn' ? '🌵' : '🌱'
        const typeLabel = note.type === 'rose' ? 'Success Story' : note.type === 'thorn' ? 'Challenge' : 'Opportunity'
        const content = `${emoji} ${typeLabel}:\n${note.content}\n\n📅 ${new Date(note.created_at).toLocaleDateString()}\n🎯 Matched ${note.matchCount} keyword${note.matchCount > 1 ? 's' : ''}`
        addBotMessage(content)
      })

      const buttons: Button[] = [
        { id: "search", text: "🔍 New Search", action: "search" },
        { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
      ]
      addBotMessage("What would you like to do next?", buttons)
    } catch (error) {
      console.error("Error searching notes:", error)
      addBotMessage("Sorry, I couldn't perform the search. Please try again later.")
      showMainMenu()
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const message = input.trim()
    addUserMessage(message)

    if (message.startsWith("/")) {
      handleCommand(message)
    } else if (conversationState.mode === "new_meeting") {
      handleNewMeetingInput(message)
    } else if (conversationState.mode === "smart_scheduling") {
      handleSmartSchedulingInput(message)
    } else if (conversationState.mode === "add_reflection") {
      await handleAddReflection(message)
    } else if (conversationState.mode === "search") {
      await handleSearch(message)
    } else {
      showMainMenu()
    }

    setInput("")
  }

  const handleNewMeetingInput = (message: string) => {
    const { step, meetingData } = conversationState
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]

    switch (step) {
      case 1:
        setConversationState({
          ...conversationState,
          step: 2,
          meetingData: { ...meetingData, name: message },
        })
        addBotMessage("📝 Enter Meeting Agenda:", buttons)
        break
      case 2:
        setConversationState({
          ...conversationState,
          step: 3,
          meetingData: { ...meetingData, agenda: message },
        })
        addBotMessage("📍 Enter Meeting Location:", buttons)
        break
      case 3:
        setConversationState({
          ...conversationState,
          step: 4,
          meetingData: { ...meetingData, location: message },
        })
        addBotMessage("📆 Enter Meeting Date (DD-MM-YYYY):", buttons)
        break
      case 4:
        // Convert date format before saving
        const formattedDate = formatDateForDB(message)
        setConversationState({
          ...conversationState,
          step: 5,
          meetingData: { ...meetingData, date: formattedDate },
        })
        addBotMessage("🕒 Enter Meeting Time (HH:MM):", buttons)
        break
      case 5:
        const finalMeetingData = {
          ...meetingData,
          time: message,
          created_by: userId!,
        }
        createMeeting(finalMeetingData as Meeting)
        break
    }
  }

  const handleSmartSchedulingInput = async (message: string) => {
    const { step, meetingData, participants, dateRange } = conversationState
    const buttons: Button[] = [
      { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
    ]

    switch (step) {
      case 1:
        setConversationState({
          ...conversationState,
          step: 2,
          meetingData: { ...meetingData, name: message },
        })
        addBotMessage("📝 Enter Meeting Agenda:", buttons)
        break
      case 2:
        setConversationState({
          ...conversationState,
          step: 3,
          meetingData: { ...meetingData, agenda: message },
        })
        addBotMessage("👥 Enter Participant Emails (comma-separated):", buttons)
        break
      case 3:
        const participantEmails = message.split(",").map((email) => email.trim())
        setConversationState({
          ...conversationState,
          step: 4,
          participants: participantEmails,
        })
        const dateRangeButtons: Button[] = [
          { id: "this_week", text: "1️⃣ This Week", action: "select_date_range", data: "1" },
          { id: "next_week", text: "2️⃣ Next Week", action: "select_date_range", data: "2" },
          { id: "custom_range", text: "3️⃣ Custom Range", action: "select_date_range", data: "3" },
          { id: "back_to_menu", text: "🔙 Back to Menu", action: "back_to_menu" },
        ]
        addBotMessage("📆 Choose a date range:", dateRangeButtons)
        break
      case 4:
        if (message === "3") {
          addBotMessage("Enter start date (YYYY-MM-DD):", buttons)
          setConversationState({ ...conversationState, step: 4.1 })
        } else {
          const today = new Date()
          const startDate = new Date(today)
          const endDate = new Date(today)

          if (message === "1") {
            endDate.setDate(today.getDate() + 7)
          } else {
            startDate.setDate(today.getDate() + 7)
            endDate.setDate(today.getDate() + 14)
          }

          const range = {
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
          }

          setConversationState({
            ...conversationState,
            step: 5,
            dateRange: range,
          })

          await suggestTimeSlots(range)
        }
        break
      case 4.1:
        setConversationState({
          ...conversationState,
          step: 4.2,
          dateRange: { ...dateRange!, start: message },
        })
        addBotMessage("Enter end date (YYYY-MM-DD):", buttons)
        break
      case 4.2:
        const finalRange = {
          ...dateRange!,
          end: message,
        }
        setConversationState({
          ...conversationState,
          step: 5,
          dateRange: finalRange,
        })
        await suggestTimeSlots(finalRange)
        break
    }
  }

  const createMeeting = async (meetingData: Meeting) => {
    try {
      await meetingService.createMeeting(meetingData)
      addBotMessage("✅ Meeting created successfully!")
      showMainMenu()
    } catch (error) {
      console.error("Error creating meeting:", error)
      addBotMessage("Sorry, I couldn't create the meeting. Please try again later.")
      showMainMenu()
    }
  }

  const suggestTimeSlots = async (dateRange: { start: string; end: string }) => {
    try {
      const timeSlots = await schedulingService.suggestTimeSlots(
        conversationState.participants || [],
        dateRange
      )

      if (timeSlots.length === 0) {
        addBotMessage("No available time slots found in the selected range. Please try a different range.")
        showMainMenu()
        return
      }

      const buttons = timeSlots.map((slot, index) => ({
        id: `slot_${index}`,
        text: `${index + 1}️⃣ ${slot.date} ${slot.time}`,
        action: "select_time",
        data: { slot, meetingData: conversationState.meetingData },
      }))

      buttons.push({
        id: "back_to_menu",
        text: "🔙 Back to Menu",
        action: "back_to_menu",
        data: { slot: timeSlots[0], meetingData: conversationState.meetingData },
      })

      addBotMessage("⏳ Available time slots:", buttons)
    } catch (error) {
      console.error("Error suggesting time slots:", error)
      addBotMessage("Sorry, I couldn't find available time slots. Please try again later.")
      showMainMenu()
    }
  }

  const handleAddReflection = async (content: string) => {
    if (!conversationState.reflectionType) return

    try {
      await reflectionService.addReflection(userId!, conversationState.reflectionType, content)
      const emoji = reflectionService.getReflectionTypeEmoji(conversationState.reflectionType)
      addBotMessage(`${emoji} Reflection added successfully!`)
      showReflectionsMenu()
    } catch (error) {
      console.error("Error adding reflection:", error)
      addBotMessage("Sorry, I couldn't add your reflection. Please try again later.")
      showMainMenu()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-full shadow-lg hover:from-primary-800 hover:to-primary-700 transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Meeting Assistant</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-primary-700 to-primary-600 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-white" />
              <h3 className="font-medium text-white">Meeting Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-primary-600/50 rounded-full text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
                {message.buttons && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.buttons.map((button) => (
                      <button
                        key={button.id}
                        onClick={() => handleButtonClick(button)}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 border border-primary-200 transition-colors"
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
