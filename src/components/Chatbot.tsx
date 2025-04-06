"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, X, Minimize2, Maximize2, Bot } from "lucide-react"
import type { ChatMessage } from "../types/database"
import { getInitialMessages, processMessage } from "../services/chatbotService"
import { supabase } from "../lib/supabase"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [conversationState, setConversationState] = useState<any>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }

    getCurrentUser()
  }, [])

  // Initialize messages when chatbot is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(getInitialMessages())
    }
  }, [isOpen, messages.length])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chatbot is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsLoading(true)

    try {
      const { messages: botResponses, newState } = await processMessage(newMessage, userId, conversationState)

      setConversationState(newState)

      // Add a small delay to make it feel more natural
      setTimeout(() => {
        setMessages((prev) => [...prev, ...botResponses])
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error processing message:", error)

      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChatbot = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  const closeChatbot = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  // Format message content with line breaks
  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="flex items-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <Bot className="h-5 w-5" />
          <span className="font-medium">Chat with PKEP</span>
        </button>
      )}

      {isOpen && (
        <div
          className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
            isMinimized ? "w-64 h-16" : "w-full sm:w-96 h-[500px]"
          }`}
        >
          <div className="p-4 border-b flex items-center justify-between bg-indigo-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">PKEP Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleChatbot}
                className="p-1 hover:bg-indigo-500 rounded-full transition-colors duration-200"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={closeChatbot}
                className="p-1 hover:bg-indigo-500 rounded-full transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-[400px] p-4 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {formatMessageContent(message.content)}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-left mb-4">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className={`p-2 rounded-lg ${
                      !newMessage.trim() || isLoading
                        ? "bg-gray-200 text-gray-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } transition-colors duration-200`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

