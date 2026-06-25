import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Sidebar from '../../components/dashboard/Sidebar'

const SIDEBAR_EXPANDED  = 220
const SIDEBAR_COLLAPSED = 60

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-black-base">
      {/* Fixed header */}
      <DashboardHeader onToggleSidebar={() => setSidebarOpen(o => !o)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content — shifts right based on sidebar width */}
      <motion.main
        className="pt-[60px] min-h-screen"
        animate={{ marginLeft: sidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          {/* Outlet renders Home / SearchLeads / Analytics / AnalyticsDetail */}
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}