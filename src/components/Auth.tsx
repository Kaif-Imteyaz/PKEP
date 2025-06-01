"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Users, Lock, Shield, ArrowRight, Eye, EyeOff } from "lucide-react"
import PunjabOfficersMap from "./PunjabOfficersMap"

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("test@punjab.gov.in")
  const [password, setPassword] = useState("test123")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        alert(error.message)
      } else {
        alert("Account created! You can now sign in.")
        setIsSignUp(false)
      }
    } else {
      localStorage.setItem("email", email)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert(error.message)
      localStorage.setItem("email", email)
    }

    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      alert(error.message)
    } else {
      setResetSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 flex flex-col lg:flex-row overflow-auto">
      {/* Map Section - Left Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 lg:p-8 bg-gradient-to-b from-primary-700 to-primary-900 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="text-center mb-4 lg:mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Peer Knowledge Exchange Platform</h2>
            <p className="text-primary-100">Connecting officers across Punjab</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 lg:p-6 shadow-2xl border border-white/20 animate-fade-in">
            <div className="max-h-[350px] md:max-h-[500px] lg:max-h-none overflow-hidden">
              <PunjabOfficersMap isLoginVariant={true} />
            </div>
          </div>

          {/* Add a hidden preload for the map image to ensure it loads */}
          <img src="/map.webp" alt="" className="hidden" />

          <div className="mt-3 lg:mt-6 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-primary-100">
              <Users className="h-5 w-5" />
              <span>Officer Network</span>
            </div>
            <div className="h-4 border-r border-primary-300/30"></div>
            <div className="flex items-center space-x-2 text-primary-100">
              <Shield className="h-5 w-5" />
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section - Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white py-6 lg:py-8">
        <div className="w-full max-w-md px-6">
          {/* Powered by section */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-xs text-gray-400 mb-2">Powered by</span>
            <div className="flex justify-center items-center space-x-4">
              <img
                src="/punjab-gov.svg"
                alt="Department of Good Governance and Information Technology, Punjab"
                className="h-16 w-auto"
              />
              <img src="/isb.png" alt="Indian School of Business" className="h-10 w-auto" />
            </div>
          </div>

          {/* Auth Form Container */}
          <div className="w-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border-0">
            <div className="p-8 space-y-2">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                  {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back!"}
                </h2>
                <p className="text-slate-600">
                  {isForgotPassword
                    ? "We'll help you get back into your account"
                    : isSignUp
                      ? "Join the knowledge exchange platform"
                      : "Sign in to access your dashboard"}
                </p>
              </div>

              {/* Department Info */}
              {/* <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-lg">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Department of Good Governance</p>
                  <p className="text-xs text-slate-500">Information Technology, Punjab</p>
                </div>
              </div> */}

              {!isForgotPassword ? (
                <form onSubmit={handleAuth} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@punjab.gov.in"
                        className="w-full pl-10 h-12 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 h-12 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {isSignUp && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 h-12 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </button>

                  {/* Toggle Sign Up/Sign In */}
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {isSignUp ? "Sign In" : "Create Account"}
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Forgot Password Form */
                <div className="space-y-6">
                  {!resetSent ? (
                    <>
                      <div className="text-center space-y-2">
                        {/* <h3 className="text-xl font-semibold text-slate-800">Reset Password</h3> */}
                        <p className="text-slate-600">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="resetEmail" className="text-sm font-medium text-slate-700">
                            Email Address
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                              id="resetEmail"
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="officer@punjab.gov.in"
                              className="w-full pl-10 h-12 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Sending...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>Send Reset Link</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    /* Reset Email Sent Confirmation */
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-800">Check Your Email</h3>
                        <p className="text-slate-600">
                          We've sent a password reset link to <strong>{resetEmail}</strong>
                        </p>
                        <p className="text-sm text-slate-500">
                          Didn't receive the email? Check your spam folder or try again.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setResetSent(false)
                          setResetEmail("")
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Back to Sign In */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false)
                        setResetSent(false)
                        setResetEmail("")
                      }}
                      className="text-sm text-slate-600 hover:text-slate-700 transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="text-center text-sm text-gray-500">
                  <a href="https://dit.punjab.gov.in/" target="_blank" rel="noopener noreferrer">
                    Department of Good Governance and Information Technology
                  </a>
                  <p className="mt-1">Government of Punjab</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
