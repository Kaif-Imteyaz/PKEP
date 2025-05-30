"use client"
import { useEffect, useState } from "react"
import { Auth } from "./components/Auth"
import { Layout } from "./components/Layout"
import { Dashboard } from "./components/Dashboard"
import { ReflectionBoard } from "./components/ReflectionBoard"
import { ResourceHub } from "./components/ResourceHub"
import { Home } from "./components/Home"
import { supabase } from "./lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { Chatbot } from "./components/Chatbot"
import { WhatsAppSettings } from "./components/WhatsAppSettings"
import { Profile } from "./components/Profile"
import { Notifications } from "./components/Notifications"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentView, setCurrentView] = useState("home")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Listen for view change events from the Home component
    const handleViewChange = (event: CustomEvent) => {
      setCurrentView(event.detail)
    }

    window.addEventListener("viewChange", handleViewChange as EventListener)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("viewChange", handleViewChange as EventListener)
    }
  }, [])

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Layout onViewChange={setCurrentView}>
        {currentView === "home" && <Home />}
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "reflection" && <ReflectionBoard />}
        {currentView === "resources" && <ResourceHub />}
        {/* {currentView === "whatsapp" && <WhatsAppSettings />} */}
        {currentView === "profile" && <Profile />}
        {currentView === "notifications" && <Notifications />}
        {currentView === "badges" && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Achievement Badges</h1>
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
          </div>
        )}
      </Layout>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
