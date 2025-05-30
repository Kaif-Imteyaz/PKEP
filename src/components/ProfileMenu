"use client"

import { useState, useRef, useEffect } from "react"
import { User, Bell, LogOut, ChevronDown, Award } from "lucide-react"
import { supabase } from "../lib/supabase"

interface ProfileMenuProps {
  userEmail?: string
  userName?: string
}

export function ProfileMenu({ userEmail, userName }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleNavigation = (view: string) => {
    const event = new CustomEvent("viewChange", { detail: view })
    window.dispatchEvent(event)
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
          {userName?.charAt(0) || userEmail?.charAt(0) || "U"}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{userName || "Officer"}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{userName || "Officer"}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>

          <button
            onClick={() => handleNavigation("profile")}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <User className="h-4 w-4 mr-3" />
            Profile Settings
          </button>

          <button
            onClick={() => handleNavigation("notifications")}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-4 w-4 mr-3" />
            Notifications
          </button>

          <button
            onClick={() => handleNavigation("badges")}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Award className="h-4 w-4 mr-3" />
            My Badges
          </button>

          <div className="border-t border-gray-200 mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
