"use client"

import { useEffect, useRef } from "react"
import { Award } from "lucide-react"
import { Card, CardContent } from "../ui/CardDB"

export function BadgeMetricsChart({ data }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clear any existing content
    chartRef.current.innerHTML = ""

    // Create the chart
    data.forEach((item, index) => {
      // Create bar container
      const barContainer = document.createElement("div")
      barContainer.className = "flex items-center mb-6"

      // Create label
      const label = document.createElement("div")
      label.className = "w-32 text-sm text-gray-700 pr-4 font-medium"
      label.textContent = item.name
      barContainer.appendChild(label)

      // Create bar wrapper
      const barWrapper = document.createElement("div")
      barWrapper.className = "flex-1 relative h-8 bg-gray-100 rounded-full overflow-hidden"

      // Create the bar
      const bar = document.createElement("div")
      const percentage = (item.count / item.total) * 100
      bar.className = `h-full rounded-full ${getBadgeColor(item.name)}`
      bar.style.width = "0%" // Start at 0 for animation
      bar.style.transition = "width 1.5s ease-out"

      // Animate the bar after a delay
      setTimeout(() => {
        bar.style.width = `${percentage}%`
      }, 200 * index)

      barWrapper.appendChild(bar)

      // Create count label inside the bar
      const countLabel = document.createElement("div")
      countLabel.className = "absolute inset-y-0 left-2 flex items-center text-xs font-medium text-white"
      countLabel.textContent = item.count.toString()
      barWrapper.appendChild(countLabel)

      barContainer.appendChild(barWrapper)

      // Create percentage and count label
      const statsLabel = document.createElement("div")
      statsLabel.className = "ml-4 text-sm text-gray-600 min-w-[100px]"
      statsLabel.innerHTML = `<span class="font-medium">${Math.round(percentage)}%</span><br><span class="text-xs text-gray-500">(${item.count}/${item.total})</span>`
      barContainer.appendChild(statsLabel)

      chartRef.current.appendChild(barContainer)
    })
  }, [data])

  const getBadgeColor = (badgeName) => {
    switch (badgeName) {
      case "Efficiency Expert":
        return "bg-amber-500" // Amber for Efficiency Expert
      case "Fast Tracker":
        return "bg-emerald-500" // Emerald for Fast Tracker
      case "Top Performer":
        return "bg-indigo-500" // Indigo for Top Performer
      case "Delay Defender":
        return "bg-purple-500" // Purple for Delay Defender
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card variant="elevated" className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {["Efficiency Expert", "Fast Tracker", "Top Performer", "Delay Defender"].map((badgeName) => (
              <div key={badgeName} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getBadgeColor(badgeName)} mr-2`}></div>
                <span className="text-sm text-gray-600">{badgeName}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">Total Officers: 120</div>
        </div>

        <div ref={chartRef} className="space-y-6">
          {/* Chart bars will be rendered here */}
          <div className="flex items-center justify-center py-12">
            <Award className="animate-pulse h-8 w-8 text-gray-300 mr-3" />
            <span className="text-gray-400">Loading chart data...</span>
          </div>
        </div>

        {/* Badge metrics explanations */}
        {/* <div className="mt-12 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Understanding the Badge Distribution</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="elevated" className="bg-amber-50 border border-amber-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                  <span className="text-lg mr-2">🏅</span>
                  Efficiency Expert
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  Awarded to officers who reduced process days by more than 20% from the previous month.
                </p>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-amber-800 mr-2">Current Distribution:</span>
                  <span className="text-amber-600 font-medium">35%</span>
                  <span className="text-amber-600 ml-2">(42 out of 120 officers)</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="bg-emerald-50 border border-emerald-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                  <span className="text-lg mr-2">⚡</span>
                  Fast Tracker
                </h4>
                <p className="text-sm text-emerald-700 mb-2">
                  Awarded to officers who completed specific stages in record time compared to peers.
                </p>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-emerald-800 mr-2">Current Distribution:</span>
                  <span className="text-emerald-600 font-medium">65%</span>
                  <span className="text-emerald-600 ml-2">(78 out of 120 officers)</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="bg-indigo-50 border border-indigo-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                  <span className="text-lg mr-2">🚀</span>
                  Top Performer
                </h4>
                <p className="text-sm text-indigo-700 mb-2">
                  Awarded to officers ranked among the Top 5 in both Delay Rate and Process Days across the state.
                </p>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-indigo-800 mr-2">Current Distribution:</span>
                  <span className="text-indigo-600 font-medium">4%</span>
                  <span className="text-indigo-600 ml-2">(5 out of 120 officers)</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="bg-purple-50 border border-purple-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                  <span className="text-lg mr-2">🛡️</span>
                  Delay Defender
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  Awarded to officers who reduced delayed applications rate compared to the previous month.
                </p>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-purple-800 mr-2">Current Distribution:</span>
                  <span className="text-purple-600 font-medium">29%</span>
                  <span className="text-purple-600 ml-2">(35 out of 120 officers)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated" className="bg-blue-50 border border-blue-100">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">How Badge Distribution is Calculated</h4>
              <p className="text-sm text-blue-700">
                Badge distribution is calculated monthly based on performance data from all officers across the state.
                The percentages represent the proportion of officers who have earned each badge. Higher percentages
                indicate more common achievements, while lower percentages represent more exclusive accomplishments.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </CardContent>
    </Card>
  )
}
