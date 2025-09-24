"use client"

import { useState } from "react"
import Header from "./Header.jsx"
import Sidebar from "./Sidebar.jsx"

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 md:ml-0">
          {/* Mobile menu button */}
          <div className="md:hidden p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
