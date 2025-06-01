"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "./ui/CardDB"
import { BadgeCelebration } from "./badges/BadgeCelebration"

export function NewBadgeNotification({ badge, onViewAllBadges }) {
  const [showCelebration, setShowCelebration] = useState(false)

  return (
    <>
      <Card
        variant="elevated"
        className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border border-gray-200 shadow-sm"
        onClick={() => setShowCelebration(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{badge.emoji}</div>
              <h4 className="font-semibold text-gray-900 text-lg">{badge.title}</h4>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              NEW!
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{badge.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Click to celebrate!</span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>

      <BadgeCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} badge={badge} />
    </>
  )
}
