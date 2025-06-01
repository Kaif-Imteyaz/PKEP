"use client"

import { useState, useMemo } from "react"
import { Award, Search } from "lucide-react"
import { Card, CardContent } from "../ui/CardDB"
import { Badge } from "../ui/BadgeDB"
import { BadgeDetail } from "./BadgeDetails"
import { BadgeCard } from "./BadgeCard"
import { BadgeMetricsChart } from "./BadgeMetricsChart"
import { badgeData, badgeMetrics, motivationalQuotes } from "../../lib/badge-data"
import { BadgeCelebration } from "./BadgeCelebration"

export function BadgesPage() {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [activeTab, setActiveTab] = useState("current")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratingBadge, setCelebratingBadge] = useState(null)

  // Get a random motivational quote that stays consistent during the session
  const randomQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }, [])

  // Filter badges based on search query
  const filterBadges = (badges) => {
    return badges.filter((badge) => {
      const matchesSearch =
        searchQuery === "" ||
        badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }

  // Get current badges (earned in the last 30 days)
  const currentBadges = badgeData.filter((badge) => badge.earned && badge.daysAgo <= 30)

  // Get previous badges (earned more than 30 days ago)
  const previousBadges = badgeData.filter((badge) => badge.earned && badge.daysAgo > 30)

  // Apply filters
  const filteredCurrentBadges = filterBadges(currentBadges)
  const filteredPreviousBadges = filterBadges(previousBadges)

  // Handle badge click
  const handleBadgeClick = (badge) => {
    if (badge.daysAgo <= 7) {
      // Show celebration for recently earned badges
      setCelebratingBadge(badge)
      setShowCelebration(true)
    } else {
      // Show badge detail for older badges
      setSelectedBadge(badge)
    }
  }

  return (
    <div className="space-y-8 pb-24">
      {selectedBadge ? (
        <BadgeDetail badge={selectedBadge} onBack={() => setSelectedBadge(null)} />
      ) : (
        <>
          <div className="text-center px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">My Badges</h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Track your achievements and milestones.
            </p>
            <br />
            {/* Motivational Quote */}
            <div className="max-w-3xl mx-auto mb-4">
              <blockquote className="text-lg italic text-gray-600 mb-2">"{randomQuote.quote}"</blockquote>
              <cite className="text-sm text-gray-500 font-medium">— {randomQuote.author}</cite>
            </div>

          </div>

          {/* Search */}
          {/* <div className="flex items-center justify-center px-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div> */}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-4">
              <button
                onClick={() => setActiveTab("current")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "current"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Current & New ({currentBadges.length + previousBadges.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "categories"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Badges
              </button>
              <button
                onClick={() => setActiveTab("graph")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "graph"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Badge Graph
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-4">
            {activeTab === "current" && (
              <>
                {/* Current & New Badges */}
                {filteredCurrentBadges.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Current & New Badges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCurrentBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} onClick={() => handleBadgeClick(badge)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous Badges */}
                {filteredPreviousBadges.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Previous Badges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredPreviousBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} onClick={() => handleBadgeClick(badge)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* No badges found */}
                {filteredCurrentBadges.length === 0 && filteredPreviousBadges.length === 0 && (
                  <div className="text-center py-12">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No badges found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? "Try adjusting your search terms." : "You haven't earned any badges yet."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "categories" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">All Available Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {badgeData.map((badge) => (
                    <Card
                      key={badge.id}
                      variant="elevated"
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleBadgeClick(badge)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{badge.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{badge.title}</h3>
                              {badge.earned ? (
                                <Badge variant="success" className="bg-green-100 text-green-800">
                                  Earned
                                </Badge>
                              ) : (
                                <Badge variant="default" className="bg-gray-100 text-gray-600">
                                  Available
                                </Badge>
                              )}
                            </div>
                            <Badge variant="primary" className="mb-3">
                              {badge.category}
                            </Badge>
                            <p className="text-gray-600 text-sm mb-4">{badge.description}</p>

                            {badge.earned && (
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  Earned{" "}
                                  {badge.daysAgo === 0
                                    ? "today"
                                    : badge.daysAgo === 1
                                      ? "yesterday"
                                      : `${badge.daysAgo} days ago`}
                                </span>
                                <span className="font-medium">{badge.rarity}</span>
                              </div>
                            )}

                            {!badge.earned && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">How to earn:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {badge.criteria?.slice(0, 2).map((criterion, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-2">•</span>
                                      <span>{criterion}</span>
                                    </li>
                                  ))}
                                  {badge.criteria?.length > 2 && (
                                    <li className="text-primary-600 font-medium">
                                      +{badge.criteria.length - 2} more criteria
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "graph" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Badge Distribution</h2>
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                      This chart shows the distribution of badges across all officers in the system. See how your
                      achievements compare to your peers.
                    </p>
                    <BadgeMetricsChart data={badgeMetrics} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Badge Celebration Modal */}
          {showCelebration && celebratingBadge && (
            <BadgeCelebration
              isOpen={showCelebration}
              onClose={() => {
                setShowCelebration(false)
                setCelebratingBadge(null)
              }}
              badge={celebratingBadge}
            />
          )}
        </>
      )}
    </div>
  )
}
