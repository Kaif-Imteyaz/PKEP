"use client"

import * as React from "react"
import { Home, BookOpen, ClipboardList, MessageSquare, BarChart2, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar"
import { supabase } from "../lib/supabase"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeView: string
  onViewChange: (view: string) => void
}

export function AppSidebar({ activeView, onViewChange, ...props }: AppSidebarProps) {
  const [userName, setUserName] = React.useState("Government Officer")
  const [userEmail, setUserEmail] = React.useState("")

  React.useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserEmail(data.user.email || "")
        // Try to get a name from the metadata if available
        const metadata = data.user.user_metadata
        const name = metadata?.full_name || metadata?.name || ""
        setUserName(name || "Government Officer")
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (err) {
      console.error("Sign out failed:", err)
      window.location.reload()
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, description: "Overview dashboard" },
    { id: "dashboard", label: "Service Metrics", icon: BarChart2, description: "Performance analytics" },
    { id: "reflection", label: "Reflection Board", icon: ClipboardList, description: "Meeting notes and insights" },
    { id: "resources", label: "Resource Hub", icon: BookOpen, description: "Knowledge repository" },
    { id: "whatsapp", label: "WhatsApp Settings", icon: MessageSquare, description: "Communication preferences" },
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center flex-shrink-0 px-4 py-4">
          <h1 className="text-xl font-bold text-sidebar-foreground">PKEP</h1>
        </div>
        <div className="text-xs text-sidebar-foreground/70 px-4 -mt-2">Peer Knowledge Exchange Platform</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={activeView === item.id} onClick={() => onViewChange(item.id)}>
                    <button>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">{userName}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{userEmail}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleSignOut}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground focus:outline-none transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
