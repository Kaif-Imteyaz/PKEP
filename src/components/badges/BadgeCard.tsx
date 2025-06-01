"use client"

import { ChevronRight } from "lucide-react"
import { Badge } from "../ui/BadgeDB"

export function BadgeCard({ badge, onClick }) {
  return (
    <div
      className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-lg bg-white border border-gray-200 shadow-sm"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{badge.emoji}</div>
            <h4 className="font-semibold text-gray-900 text-lg">{badge.title}</h4>
          </div>
          {badge.earned && badge.daysAgo <= 7 && (
            <Badge
              variant="primary"
              className="text-xs bg-blue-100 text-blue-800 border border-blue-200 rounded-md px-2 py-1"
            >
              NEW!
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{badge.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Earned {badge.daysAgo === 0 ? "today" : badge.daysAgo === 1 ? "yesterday" : `${badge.daysAgo} days ago`}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  )
}
