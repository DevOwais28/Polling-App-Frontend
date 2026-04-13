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
        <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
                <AppSidebar />
              </div>
            </div>
          </div>

          {/* Main Content - Full width on mobile, 2 cols on md/lg */}
          <div className="md:col-span-2">
            <div className="rounded-xl p-4 sm:p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
              <MyPolls />
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile and md, visible on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
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
