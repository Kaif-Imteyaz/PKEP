"use client"

import { ArrowLeft, Calendar, Users, Target } from "lucide-react"
import { Badge } from "../ui/BadgeDB"
import { Card, CardContent } from "../ui/CardDB"

export function BadgeDetail({ badge, onBack }) {
  const getBadgeStyle = (category) => {
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
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to badges
      </button>

      <div className={`rounded-lg ${style.bgClass} border border-${style.accentClass.split("-")[1]}-200 p-8`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="text-6xl">{badge.emoji}</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-2xl font-bold ${style.textClass} mb-2`}>{badge.title}</h1>
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
                    {badge.daysAgo === 0 ? "Today" : badge.daysAgo === 1 ? "Yesterday" : `${badge.daysAgo} days ago`}
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

    </div>
  )
}
