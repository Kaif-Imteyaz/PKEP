"use client"

import React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, message, className = "" }) => {
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "failed" | null>(null)
  const [userPhoneInput, setUserPhoneInput] = useState("")

  useEffect(() => {
    const checkUserVerification = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // Check if user has a WhatsApp number registered
        const { data: userSession } = await supabase.from("user_sessions").select("*").eq("user_id", user.id).single()

        if (userSession) {
          setUserPhoneNumber(userSession.whatsapp_number)

          // Check if verification is needed (more than 7 days since last verification)
          const lastVerification = new Date(userSession.last_verification)
          const now = new Date()
          const daysSinceVerification = Math.floor((now.getTime() - lastVerification.getTime()) / (1000 * 60 * 60 * 24))

          if (daysSinceVerification >= 7) {
            setShowVerificationPrompt(true)
          }
        } else {
          // No WhatsApp number registered yet
          setShowVerificationPrompt(true)
        }
      } catch (error) {
        console.error("Error checking user verification:", error)
      }
    }

    checkUserVerification()
  }, [])

  const handleVerification = async () => {
    try {
      if (!userPhoneInput.trim()) {
        alert("Please enter your WhatsApp number")
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setVerificationStatus("failed")
        return
      }

      // Format phone number (remove non-digits)
      const formattedPhone = userPhoneInput.replace(/[^0-9]/g, "")

      // Check if user already has a session
      const { data: existingSession } = await supabase.from("user_sessions").select("*").eq("user_id", user.id).single()

      if (existingSession) {
        // Update existing session
        await supabase
          .from("user_sessions")
          .update({
            whatsapp_number: formattedPhone,
            last_verification: new Date().toISOString(),
            is_verified: true,
          })
          .eq("id", existingSession.id)
      } else {
        // Create new session
        await supabase.from("user_sessions").insert([
          {
            user_id: user.id,
            whatsapp_number: formattedPhone,
            last_verification: new Date().toISOString(),
            is_verified: true,
          },
        ])
      }

      setUserPhoneNumber(formattedPhone)
      setVerificationStatus("verified")
      setShowVerificationPrompt(false)
    } catch (error) {
      console.error("Error during verification:", error)
      setVerificationStatus("failed")
    }
  }

  const getWhatsAppLink = () => {
    const baseUrl = "https://wa.me"
    const formattedPhone = (userPhoneNumber || phoneNumber).replace(/[^0-9]/g, "")
    const encodedMessage = message ? encodeURIComponent(message) : ""

    return message ? `${baseUrl}/${formattedPhone}?text=${encodedMessage}` : `${baseUrl}/${formattedPhone}`
  }

  return (
    <>
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2 ${className}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 15.32C16.46 15.86 15.62 16.4 15.04 16.58C14.63 16.7 14.14 16.8 11.81 15.69C8.89 14.27 7.01 11.28 6.85 11.06C6.7 10.84 5.7 9.45 5.7 8C5.7 6.55 6.49 5.8 6.71 5.55C6.93 5.3 7.21 5.23 7.39 5.23C7.57 5.23 7.75 5.23 7.91 5.24C8.07 5.25 8.29 5.19 8.5 5.73C8.72 6.28 9.28 7.73 9.35 7.88C9.43 8.03 9.49 8.21 9.38 8.42C9.27 8.63 9.21 8.76 9.06 8.94C8.91 9.12 8.75 9.33 8.61 9.47C8.46 9.61 8.31 9.77 8.48 10.09C8.65 10.41 9.21 11.35 10.07 12.12C11.19 13.11 12.12 13.44 12.48 13.59C12.84 13.74 13.03 13.71 13.21 13.5C13.39 13.29 13.92 12.67 14.13 12.31C14.34 11.95 14.55 12.01 14.84 12.12C15.13 12.23 16.58 12.94 16.9 13.1C17.22 13.26 17.43 13.33 17.5 13.47C17.58 13.61 17.58 14.09 17.34 14.68L16.64 15.32Z" />
        </svg>
        <span>Chat with us</span>
      </a>

      {showVerificationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">WhatsApp Verification</h3>
            <p className="mb-4">Please verify your WhatsApp number to continue using the PKEP WhatsApp services.</p>
            <div className="mb-4">
              <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="tel"
                id="whatsapp-number"
                value={userPhoneInput}
                onChange={(e) => setUserPhoneInput(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {verificationStatus === "failed" && (
              <p className="text-red-500 text-sm mb-4">Verification failed. Please try again.</p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVerificationPrompt(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleVerification}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

