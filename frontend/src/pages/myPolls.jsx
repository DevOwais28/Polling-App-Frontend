import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import Navbar from '@/components/navbar'
import MyPolls from '@/components/MyPolls'

const MyPollsPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
                <AppSidebar />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
              <MyPolls />
            </div>
          </div>

          {/* Right Sidebar - Empty for now or can add future features */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Future widgets can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPollsPage
