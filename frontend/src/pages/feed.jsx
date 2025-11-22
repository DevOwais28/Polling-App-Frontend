import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import Navbar from '@/components/navbar'
import CreatePoll from '@/components/CreatePoll'
import PollCard from '@/components/PollCard'
import TrendingSection from '@/components/TrendingSection'
import { apiRequest } from '@/api'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const Feed = () => {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const [highlightPollId, setHighlightPollId] = useState(null)

  // Handle auth via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authData = params.get("auth")

    if (authData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authData))
        if (parsed.login && parsed.token && parsed.user) {
          localStorage.setItem("token", parsed.token)
          localStorage.setItem("user", JSON.stringify(parsed.user))
          toast.success(
            parsed.user.isNewUser
              ? "Welcome to WePollin! Your account has been created successfully."
              : "Successfully logged in with Google"
          )
          window.history.replaceState({}, "", window.location.pathname)
        }
      } catch (e) {
        console.error("Auth process error:", e)
        toast.error("Failed to process authentication. Please try again.")
      }
    }

    fetchPolls()
  }, [])

  // Fetch polls from API
  const fetchPolls = async () => {
    try {
      setLoading(true)
      const res = await apiRequest("GET", "/polls/poll")
      setPolls(res.data.Allpolls || [])
    } catch (e) {
      setError("Failed to load polls")
      console.error("Fetch error:", e)
    } finally {
      setLoading(false)
    }
  }

  const handlePollCreated = (newPoll) => {
    if (newPoll?._id) setPolls(prev => [newPoll, ...prev])
    else fetchPolls()
  }

  const handlePollUpdated = (updated) => {
    if (!updated) return fetchPolls()
    setPolls(prev => prev.map(p => (p._id === updated._id ? updated : p)))
  }

  // Detect poll ID from query (for notifications)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const pollId = params.get('poll')
    if (pollId) setHighlightPollId(pollId)
  }, [location.search])

  // Scroll to poll once polls are loaded
  useEffect(() => {
    if (highlightPollId && !loading && polls.length) {
      const el = document.getElementById(highlightPollId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-blue-400')
        setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400'), 3000)
      }
      setHighlightPollId(null)
    }
  }, [highlightPollId, polls, loading])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-xl border p-4">
                <AppSidebar />
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="md:col-span-2 space-y-4">

            {/* Create Poll */}
            <div className="bg-white rounded-xl border p-4 sm:p-6 shadow-sm">
              <CreatePoll onPollCreated={handlePollCreated} />
            </div>

            {/* Polls */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchPolls} className="bg-blue-600 text-white">Try Again</Button>
              </div>
            ) : polls.length === 0 ? (
              <div className="bg-white rounded-xl border p-6 sm:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">No polls yet</h3>
                <p className="text-sm text-gray-600 mb-4">Be the first to create one!</p>
                <Button className="bg-blue-600 text-white"
                  onClick={() => document.querySelector("textarea")?.focus()}>
                  Create Your First Poll
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {polls.map((poll, i) => (
                  <div
                    key={poll?._id || i}
                    id={poll?._id} // <--- needed for scroll
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md transition"
                  >
                    <PollCard poll={poll} onVote={fetchPolls} onPollUpdated={handlePollUpdated} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-xl border p-4 shadow-sm">
                <TrendingSection />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Feed
