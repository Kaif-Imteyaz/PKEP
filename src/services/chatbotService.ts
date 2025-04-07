import type { ChatMessage } from "../types/database"
import * as supabaseService from "./supabaseService"

// Initial messages when the chatbot starts
export const getInitialMessages = (): ChatMessage[] => {
  return [
    {
      id: "1",
      content: "Hello! I am your PKEP assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      content:
        "You can ask me about:\n- Scheduling meetings\n- Your performance metrics\n- Searching resources\n- Adding reflections",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]
}

// Process user message and generate bot response
export const processMessage = async (
  message: string,
  userId: string,
  conversationState: any = {},
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const lowerMessage = message.toLowerCase()
  const responses: ChatMessage[] = []
  let newState = { ...conversationState }

  // Check if we're in the middle of a multi-step process
  if (conversationState.currentProcess) {
    return handleOngoingProcess(message, userId, conversationState)
  }

  // Handle initial intents
  if (lowerMessage.includes("schedule") && lowerMessage.includes("meeting")) {
    responses.push({
      id: Date.now().toString(),
      content: "Let's schedule a new meeting. What would you like to name this meeting?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    newState = {
      currentProcess: "scheduleMeeting",
      step: 1,
      meetingData: {},
    }
  } else if (lowerMessage.includes("performance") || lowerMessage.includes("metrics")) {
    try {
      const metrics = await supabaseService.getPerformanceMetrics(userId)
      responses.push({
        id: Date.now().toString(),
        content: `Here are your current performance metrics:\n- Delayed Applications: ${metrics.delayed_applications}%\n- Process Days: ${metrics.process_days} days\n- Applications Handled: ${metrics.applications_handled}`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      responses.push({
        id: Date.now().toString(),
        content: "I couldn't retrieve your performance metrics at the moment. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
    }
  } else if (lowerMessage.includes("search") && lowerMessage.includes("reflection")) {
    responses.push({
      id: Date.now().toString(),
      content: "What would you like to search for in the reflections? Enter a keyword or phrase.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    newState = {
      currentProcess: "search",
      step: 1,
      searchType: "reflections"
    }
  } else if (lowerMessage.includes("search") || lowerMessage.includes("find")) {
    responses.push({
      id: Date.now().toString(),
      content: "What would you like to search for?\n1. Reflections\n2. Resources",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    newState = {
      currentProcess: "search",
      step: 1,
      searchType: "menu"
    }
  } else if (
    lowerMessage.includes("reflection") ||
    lowerMessage.includes("rose") ||
    lowerMessage.includes("thorn") ||
    lowerMessage.includes("bud")
  ) {
    responses.push({
      id: Date.now().toString(),
      content:
        "I can help you add a reflection. What type would you like to add?\n1. Rose (Success)\n2. Thorn (Challenge)\n3. Bud (Opportunity)",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    newState = {
      currentProcess: "addReflection",
      step: 1,
    }
  } else if (lowerMessage.includes("meetings") || lowerMessage.includes("upcoming")) {
    try {
      const meetings = await supabaseService.getMeetings(userId)
      if (meetings && meetings.length > 0) {
        const upcomingMeetings = meetings
          .filter((m) => new Date(m.meeting_date) >= new Date() && !m.is_cancelled)
          .slice(0, 3)

        if (upcomingMeetings.length > 0) {
          let meetingsList = "Here are your upcoming meetings:\n\n"
          upcomingMeetings.forEach((meeting, index) => {
            meetingsList += `${index + 1}. ${meeting.name} - ${new Date(meeting.meeting_date).toLocaleDateString()} at ${meeting.meeting_time}\n`
          })
          meetingsList += "\nWould you like to see details for any of these meetings? Reply with the number."

          responses.push({
            id: Date.now().toString(),
            content: meetingsList,
            sender: "bot",
            timestamp: new Date().toISOString(),
            metadata: { meetings: upcomingMeetings },
          })

          newState = {
            currentProcess: "viewMeetings",
            step: 1,
            meetings: upcomingMeetings,
          }
        } else {
          responses.push({
            id: Date.now().toString(),
            content: "You don't have any upcoming meetings scheduled.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          })
        }
      } else {
        responses.push({
          id: Date.now().toString(),
          content: "You don't have any meetings scheduled yet. Would you like to schedule one?",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      responses.push({
        id: Date.now().toString(),
        content: "I couldn't retrieve your meetings at the moment. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
    }
  } else if (lowerMessage.includes("help")) {
    responses.push({
      id: Date.now().toString(),
      content:
        "I can help you with:\n- Scheduling, rescheduling, or canceling meetings\n- Viewing your performance metrics\n- Searching resources and reflections\n- Adding reflections (Rose, Thorn, Bud)\n- Viewing your upcoming meetings\n\nJust let me know what you'd like to do!",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
  } else {
    responses.push({
      id: Date.now().toString(),
      content:
        "I'm not sure I understand. You can ask me about scheduling meetings, your performance metrics, searching resources, or adding reflections.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
  }

  return { messages: responses, newState }
}

// Handle ongoing multi-step processes
const handleOngoingProcess = async (
  message: string,
  userId: string,
  state: any,
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const responses: ChatMessage[] = []
  let newState = { ...state }

  switch (state.currentProcess) {
    case "scheduleMeeting":
      return handleScheduleMeeting(message, userId, state)
    case "search":
      return handleSearch(message, userId, state)
    case "addReflection":
      return handleAddReflection(message, userId, state)
    case "viewMeetings":
      return handleViewMeetings(message, userId, state)
    default:
      responses.push({
        id: Date.now().toString(),
        content: "I'm not sure what we were discussing. How can I help you?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      newState = {} // Reset state
      return { messages: responses, newState }
  }
}

// Handle the meeting scheduling process
const handleScheduleMeeting = async (
  message: string,
  userId: string,
  state: any,
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const responses: ChatMessage[] = []
  let newState = { ...state }
  const { step, meetingData } = state

  switch (step) {
    case 1: // Meeting name
      newState.meetingData = { ...meetingData, name: message }
      newState.step = 2
      responses.push({
        id: Date.now().toString(),
        content: "Great! Now, please provide the agenda for this meeting.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 2: // Agenda
      newState.meetingData = { ...meetingData, agenda: message }
      newState.step = 3
      responses.push({
        id: Date.now().toString(),
        content: "Please provide any links or documents for this meeting (or type 'none' if there aren't any).",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 3: // Links & Documents
      newState.meetingData = { ...meetingData, links_documents: message === "none" ? "" : message }
      newState.step = 4
      responses.push({
        id: Date.now().toString(),
        content: "What date would you like to schedule this meeting for? (Please use YYYY-MM-DD format)",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 4: // Date
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(message)) {
        responses.push({
          id: Date.now().toString(),
          content: "Please provide the date in YYYY-MM-DD format (e.g., 2025-02-15).",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
        break
      }

      newState.meetingData = { ...meetingData, meeting_date: message }
      newState.step = 5
      responses.push({
        id: Date.now().toString(),
        content: "What time would you like to schedule this meeting for? (Please use HH:MM format, e.g., 14:00)",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 5: // Time
      // Validate time format
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
      if (!timeRegex.test(message)) {
        responses.push({
          id: Date.now().toString(),
          content: "Please provide the time in HH:MM format (e.g., 14:00 for 2:00 PM).",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
        break
      }

      newState.meetingData = { ...meetingData, meeting_time: message }
      newState.step = 6
      responses.push({
        id: Date.now().toString(),
        content: "Where will this meeting take place? (e.g., Webex, Office Room 101, etc.)",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 6: // Location
      newState.meetingData = { ...meetingData, location: message }
      newState.step = 7

      // Get buddy information to add as participant
      try {
        const buddyPair = await supabaseService.getBuddyPair(userId)
        if (buddyPair) {
          newState.buddyId = buddyPair.buddy_id
          responses.push({
            id: Date.now().toString(),
            content: `Would you like to invite your buddy ${buddyPair.buddy.name || "buddy"} to this meeting? (yes/no)`,
            sender: "bot",
            timestamp: new Date().toISOString(),
          })
        } else {
          newState.step = 8 // Skip buddy invitation
          responses.push({
            id: Date.now().toString(),
            content:
              "Please confirm the meeting details:\n\n" +
              `Name: ${meetingData.name}\n` +
              `Agenda: ${meetingData.agenda}\n` +
              `Date: ${meetingData.meeting_date}\n` +
              `Time: ${meetingData.meeting_time}\n` +
              `Location: ${message}\n\n` +
              "Is this correct? (yes/no)",
            sender: "bot",
            timestamp: new Date().toISOString(),
          })
        }
      } catch (error) {
        // If there's an error getting buddy info, just skip to confirmation
        newState.step = 8
        responses.push({
          id: Date.now().toString(),
          content:
            "Please confirm the meeting details:\n\n" +
            `Name: ${meetingData.name}\n` +
            `Agenda: ${meetingData.agenda}\n` +
            `Date: ${meetingData.meeting_date}\n` +
            `Time: ${meetingData.meeting_time}\n` +
            `Location: ${message}\n\n` +
            "Is this correct? (yes/no)",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
      }
      break
    case 7: // Buddy invitation
      const inviteBuddy = message.toLowerCase() === "yes"
      newState.inviteBuddy = inviteBuddy
      newState.step = 8

      responses.push({
        id: Date.now().toString(),
        content:
          "Please confirm the meeting details:\n\n" +
          `Name: ${meetingData.name}\n` +
          `Agenda: ${meetingData.agenda}\n` +
          `Date: ${meetingData.meeting_date}\n` +
          `Time: ${meetingData.meeting_time}\n` +
          `Location: ${meetingData.location}\n` +
          `Invite Buddy: ${inviteBuddy ? "Yes" : "No"}\n\n` +
          "Is this correct? (yes/no)",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      break
    case 8: // Confirmation
      if (message.toLowerCase() === "yes") {
        try {
          // Create the meeting
          const meeting = await supabaseService.createMeeting({
            ...meetingData,
            created_by: userId,
            performance_metrics: "",
          })

          // Add buddy as participant if requested
          if (newState.inviteBuddy && newState.buddyId) {
            await supabaseService.addMeetingParticipant(meeting.id, newState.buddyId)
          }

          responses.push({
            id: Date.now().toString(),
            content: "Great! Your meeting has been scheduled successfully.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          })

          // Reset state
          newState = {}
        } catch (error) {
          responses.push({
            id: Date.now().toString(),
            content: "I'm sorry, there was an error scheduling your meeting. Please try again later.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          })
        }
      } else {
        responses.push({
          id: Date.now().toString(),
          content: "No problem. Let's start over. What would you like to do?",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
        // Reset state
        newState = {}
      }
      break
    default:
      responses.push({
        id: Date.now().toString(),
        content: "I'm not sure where we are in the scheduling process. Let's start over. What would you like to do?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      // Reset state
      newState = {}
  }

  return { messages: responses, newState }
}

// Handle the search process
const handleSearch = async (
  message: string,
  userId: string,
  state: any,
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const responses: ChatMessage[] = []
  let newState = { ...state }

  try {
    // Search for reflections
    const reflections = await supabaseService.searchReflections(message, userId)
    
    if (reflections.length === 0) {
      responses.push({
        id: Date.now().toString(),
        content: `I couldn't find any reflections matching "${message}". Would you like to try a different search term?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
    } else {
      let resultMessage = `Here are the reflections matching "${message}":\n\n`
      
      reflections.forEach((reflection, index) => {
        const type = reflection.type.toUpperCase()
        const preview = reflection.content.length > 100 
          ? reflection.content.substring(0, 100) + "..."
          : reflection.content
        const date = new Date(reflection.created_at).toLocaleDateString()
        
        resultMessage += `${index + 1}. ${type} (${date})\n${preview}\n\n`
      })

      if (reflections.length > 5) {
        resultMessage += `Found ${reflections.length} reflections in total. Showing the first 5 most recent ones.`
      }

      responses.push({
        id: Date.now().toString(),
        content: resultMessage,
        sender: "bot",
        timestamp: new Date().toISOString(),
        metadata: { reflections: reflections.slice(0, 5) }
      })

      newState = {
        currentProcess: "viewReflections",
        step: 1,
        reflections: reflections.slice(0, 5)
      }
    }
  } catch (error) {
    responses.push({
      id: Date.now().toString(),
      content: "I'm sorry, there was an error performing your search. Please try again later.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
  }

  return { messages: responses, newState }
}

// Handle the reflection addition process
const handleAddReflection = async (
  message: string,
  userId: string,
  state: any,
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const responses: ChatMessage[] = []
  let newState = { ...state }
  const { step } = state

  switch (step) {
    case 1: // Reflection type selection
      let reflectionType: "rose" | "thorn" | "bud" | null = null

      if (message === "1" || message.toLowerCase().includes("rose") || message.toLowerCase().includes("success")) {
        reflectionType = "rose"
      } else if (
        message === "2" ||
        message.toLowerCase().includes("thorn") ||
        message.toLowerCase().includes("challenge")
      ) {
        reflectionType = "thorn"
      } else if (
        message === "3" ||
        message.toLowerCase().includes("bud") ||
        message.toLowerCase().includes("opportunity")
      ) {
        reflectionType = "bud"
      }

      if (reflectionType) {
        newState.reflectionType = reflectionType
        newState.step = 2

        const typeLabels = {
          rose: "success story",
          thorn: "challenge",
          bud: "opportunity",
        }

        responses.push({
          id: Date.now().toString(),
          content: `Please share your ${typeLabels[reflectionType]}:`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
      } else {
        responses.push({
          id: Date.now().toString(),
          content:
            "I didn't understand your selection. Please choose:\n1. Rose (Success)\n2. Thorn (Challenge)\n3. Bud (Opportunity)",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
      }
      break
    case 2: // Reflection content
      try {
        await supabaseService.createNote({
          type: state.reflectionType,
          content: message,
          user_id: userId,
          created_by: userId
        })

        responses.push({
          id: Date.now().toString(),
          content: "Thank you for sharing your reflection! It has been added to the board.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })

        // Reset state
        newState = {}
      } catch (error) {
        responses.push({
          id: Date.now().toString(),
          content: "I'm sorry, there was an error adding your reflection. Please try again later.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        })
        // Reset state
        newState = {}
      }
      break
    default:
      responses.push({
        id: Date.now().toString(),
        content: "I'm not sure where we are in the reflection process. Let's start over. What would you like to do?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      })
      // Reset state
      newState = {}
  }

  return { messages: responses, newState }
}

// Handle viewing meeting details
const handleViewMeetings = async (
  message: string,
  userId: string,
  state: any,
): Promise<{ messages: ChatMessage[]; newState: any }> => {
  const responses: ChatMessage[] = []
  let newState = { ...state }
  const { meetings } = state

  // Check if user selected a meeting by number
  const meetingIndex = Number.parseInt(message) - 1
  if (isNaN(meetingIndex) || meetingIndex < 0 || meetingIndex >= meetings.length) {
    responses.push({
      id: Date.now().toString(),
      content: "I didn't understand your selection. Please reply with the number of the meeting you'd like to view.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    return { messages: responses, newState }
  }

  const selectedMeeting = meetings[meetingIndex]

  try {
    // Get meeting participants
    const participants = await supabaseService.getMeetingParticipants(selectedMeeting.id)

    let meetingDetails = `Meeting Details: ${selectedMeeting.name}\n\n`
    meetingDetails += `Date: ${new Date(selectedMeeting.meeting_date).toLocaleDateString()}\n`
    meetingDetails += `Time: ${selectedMeeting.meeting_time}\n`
    meetingDetails += `Location: ${selectedMeeting.location}\n\n`
    meetingDetails += `Agenda: ${selectedMeeting.agenda}\n\n`

    if (selectedMeeting.links_documents) {
      meetingDetails += `Links/Documents: ${selectedMeeting.links_documents}\n\n`
    }

    if (participants && participants.length > 0) {
      meetingDetails += "Participants:\n"
      participants.forEach((participant) => {
        meetingDetails += `- ${participant.profiles?.name || "Unknown"} (${participant.status})\n`
      })
    }

    meetingDetails += "\nWould you like to:\n1. Reschedule this meeting\n2. Cancel this meeting\n3. Go back"

    responses.push({
      id: Date.now().toString(),
      content: meetingDetails,
      sender: "bot",
      timestamp: new Date().toISOString(),
    })

    newState.step = 2
    newState.selectedMeeting = selectedMeeting
  } catch (error) {
    responses.push({
      id: Date.now().toString(),
      content: "I'm sorry, there was an error retrieving the meeting details. Please try again later.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    })
    // Reset state
    newState = {}
  }

  return { messages: responses, newState }
}

