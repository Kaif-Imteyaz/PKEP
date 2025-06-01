"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Calendar, Users, Target, ArrowLeft } from "lucide-react"
import { Badge } from "../ui/BadgeDB"
import { Card, CardContent } from "../ui/CardDB"
interface BadgeCelebrationProps {
  isOpen: boolean
  onClose: () => void
  badge: any
}

export function BadgeCelebration({ isOpen, onClose, badge }: BadgeCelebrationProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Shoot confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => {
        clearInterval(interval)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "Efficiency":
        return {
          bgClass: "bg-gradient-to-r from-yellow-50 to-amber-50",
          textClass: "text-amber-800",
          accentClass: "bg-amber-100",
          accentTextClass: "text-amber-800",
        }
      case "Speed":
        return {
          bgClass: "bg-gradient-to-r from-green-50 to-emerald-50",
          textClass: "text-green-800",
          accentClass: "bg-green-100",
          accentTextClass: "text-green-800",
        }
      case "Quality":
        return {
          bgClass: "bg-gradient-to-r from-blue-50 to-indigo-50",
          textClass: "text-blue-800",
          accentClass: "bg-blue-100",
          accentTextClass: "text-blue-800",
        }
      default:
        return {
          bgClass: "bg-gradient-to-r from-gray-50 to-slate-50",
          textClass: "text-gray-800",
          accentClass: "bg-gray-100",
          accentTextClass: "text-gray-800",
        }
    }
  }

  const style = getBadgeStyle(badge.category)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4"
      onClick={onClose} // Allow closing by clicking backdrop
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-500 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Combined celebration and details view */}
        <div className="space-y-6 p-6">
          {/* Celebration Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{badge.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
            <p className="text-lg text-gray-700 mb-6">
              You've earned the <strong>{badge.title}</strong> badge!
            </p>
            <p className="text-gray-600 mb-6">{badge.description}</p>
          </div>

          {/* Badge Details */}
          <div className={`rounded-lg ${style.bgClass} border border-${style.accentClass.split("-")[1]}-200 p-6`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="text-4xl">{badge.emoji}</div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className={`text-xl font-bold ${style.textClass} mb-2`}>{badge.title}</h1>
                <Badge variant="primary" className={`${style.accentClass} ${style.accentTextClass} mb-4`}>
                  {badge.category}
                </Badge>
                <p className={`${style.textClass} mb-6`}>{badge.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${style.accentClass} flex items-center`}>
                    <Calendar className={`h-5 w-5 mr-3 ${style.accentTextClass}`} />
                    <div>
                      <p className="text-xs text-gray-600">Earned On</p>
                      <p className={`font-medium ${style.accentTextClass}`}>
                        {badge.daysAgo === 0
                          ? "Today"
                          : badge.daysAgo === 1
                            ? "Yesterday"
                            : `${badge.daysAgo} days ago`}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${style.accentClass} flex items-center`}>
                    <Users className={`h-5 w-5 mr-3 ${style.accentTextClass}`} />
                    <div>
                      <p className="text-xs text-gray-600">Rarity</p>
                      <p className={`font-medium ${style.accentTextClass}`}>{badge.rarity || "Common"}</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${style.accentClass} flex items-center`}>
                    <Target className={`h-5 w-5 mr-3 ${style.accentTextClass}`} />
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <p className={`font-medium ${style.accentTextClass}`}>Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Awesome!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
