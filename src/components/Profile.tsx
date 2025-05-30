"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Camera, Save, Eye, EyeOff, LogOut } from "lucide-react"
import { supabase } from "../lib/supabase"
import { Card, CardContent, CardHeader } from "./ui/Card"
import { Button } from "./ui/Button"

export function Profile() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)
      setProfile({
        full_name: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
        avatar_url: user.user_metadata?.avatar_url || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        },
      })

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setIsChangingPassword(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      setMessage({ type: "success", text: "Password updated successfully!" })
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // In a real app, you would upload to Supabase Storage
      // For now, we'll create a local URL and save it to user metadata
      const url = URL.createObjectURL(file)

      // Update the profile state
      setProfile({ ...profile, avatar_url: url })

      // Save to Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          avatar_url: url,
        },
      })

      if (error) throw error

      setMessage({ type: "success", text: "Profile picture updated successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          icon={<LogOut className="h-4 w-4" />}
        >
          <span className="text-red-600">Sign Out</span>
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card variant="elevated">
          <CardHeader title="Profile Information" />
          <CardContent className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.full_name?.charAt(0) || user?.email?.charAt(0) || "U"
                  )}
                </div>
                <label className="absolute bottom-0 right-0 h-6 w-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Camera className="h-3 w-3 text-gray-600" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{profile.full_name || "Add your name"}</h3>
                <p className="text-sm text-gray-500">Click the camera icon to update your photo</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500">Email address cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                />
              </div>
            </div>

            <Button onClick={updateProfile} disabled={loading} className="w-full" icon={<Save className="h-4 w-4" />}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card variant="elevated">
          <CardHeader title="Change Password" />
          <CardContent className="p-6 space-y-6">
            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>

            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Mix of letters and numbers recommended</li>
                <li>• Avoid using personal information</li>
              </ul>
            </div>

            <Button
              onClick={updatePassword}
              disabled={
                isChangingPassword ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
              className="w-full"
              icon={<Lock className="h-4 w-4" />}
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card variant="elevated">
        <CardHeader title="Achievement Badges" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Efficiency Expert Badge */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🏅</div>
                <div>
                  <h4 className="font-semibold text-amber-800">Efficiency Expert</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Officer reduced Process Days by more than 20% from last month.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Earned 3 days ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delay Defender Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Delay Defender</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Officer reduced delayed applications rate compared to last month.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Earned 1 week ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performer Badge */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <h4 className="font-semibold text-purple-800">Top Performer</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Officer is ranked among the Top 5 in both Delay Rate and Process Days across the state.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Earned 2 weeks ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Tracker Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-green-800">Fast Tracker</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Officer completed Document Upload stage in record time compared to peers.
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Earned 5 days ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => {
                const event = new CustomEvent("viewChange", { detail: "badges" })
                window.dispatchEvent(event)
              }}
            >
              View All Badges
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card variant="elevated">
        <CardHeader title="Account Settings" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Email notifications for meetings</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">WhatsApp reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Weekly progress reports</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Privacy</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Show profile to other officers</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Allow meeting invitations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Share progress with mentors</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
