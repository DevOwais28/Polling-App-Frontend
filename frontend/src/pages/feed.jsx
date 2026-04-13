import React, { useState, useEffect, useRef } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import Navbar from '@/components/navbar'
import CreatePoll from '@/components/CreatePoll'
import PollCard from '@/components/PollCard'
import TrendingSection from '@/components/TrendingSection'
import { apiRequest } from '@/api'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom'

const Feed = () => {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [highlightedPollId, setHighlightedPollId] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const pollRefs = useRef({})

  useEffect(() => {
    // Derive highlighted poll from query string (reacts to SPA navigation)
    const qp = new URLSearchParams(location.search)
    const pollIdFromQuery = qp.get('pollId')

    // If a pollId is present in the URL and it's not already highlighted,
    // set it in state and then clean up the URL (remove the query param)
    if (pollIdFromQuery && pollIdFromQuery !== highlightedPollId) {
      setHighlightedPollId(pollIdFromQuery)
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, location.pathname, navigate, highlightedPollId])

  useEffect(() => {
    // When polls and highlightedPollId are ready, scroll that poll into view
    if (!loading && highlightedPollId && pollRefs.current[highlightedPollId]) {
      pollRefs.current[highlightedPollId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [loading, highlightedPollId])

  useEffect(() => {
    // Handle Google auth redirect
    const params = new URLSearchParams(window.location.search);
    const authData = params.get("auth");

    if (authData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authData));
        if (parsed.login && parsed.token && parsed.user) {
          localStorage.setItem('token', parsed.token);
          localStorage.setItem('user', JSON.stringify(parsed.user));
          
          // Show welcome message for new users
          if (parsed.user.isNewUser) {
            toast.success('Welcome to WePollin! Your account has been created successfully.');
          } else {
            toast.success('Successfully logged in with Google');
          }
          
          // Clean up the URL
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (error) {
        console.error('Error processing auth data:', error);
        toast.error('Failed to process authentication. Please try again.');
      }
    }
    
    fetchPolls();
  }, [])

  const fetchPolls = async () => {
    try {
      setLoading(true)
      const response = await apiRequest("GET", "/polls/poll")
      setPolls(response.data.Allpolls || [])
    } catch (err) {
      setError('Failed to load polls')
      console.error('Error fetching polls:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePollCreated = (newPoll) => {
    // Ensure the new poll has the correct structure
    if (newPoll && newPoll._id) {
      setPolls(prevPolls => [newPoll, ...prevPolls])
    } else {
      // If the poll structure is different, refresh the entire list
      fetchPolls()
    }
  }

  const handlePollUpdated = (updatedPoll) => {
    if (!updatedPoll) {
      // If updatedPoll is null, it means the poll was deleted
      fetchPolls();
      return;
    }
    
    setPolls(prevPolls => 
      prevPolls.map(poll => 
        poll._id === updatedPoll._id ? updatedPoll : poll
      )
    );
  };

  const refreshPolls = async () => {
    await fetchPolls()
  }

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
        <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Left Sidebar - Hidden on mobile, visible on md+ screens */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
                <AppSidebar />
              </div>
            </div>
          </div>

          {/* Main Feed - Full width on mobile, 2 columns on md, 2 columns on lg */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            {/* Create Poll Card */}
            <div className="rounded-xl p-4 sm:p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
              <CreatePoll onPollCreated={handlePollCreated} />
            </div>

            {/* Feed Content */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-xl p-4 sm:p-6 text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <p className="mb-4" style={{ color: '#dc2626' }}>{error}</p>
                <Button 
                  onClick={refreshPolls}
                  className="text-white hover:opacity-90"
                  style={{ background: '#1c1917', borderRadius: '12px' }}
                >
                  Try Again
                </Button>
              </div>
            ) : polls.length === 0 ? (
              <div className="rounded-xl p-6 sm:p-12 text-center" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fef3c7' }}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 syne" style={{ color: '#1c1917' }}>No polls yet</h3>
                <p className="text-sm mb-4 sm:mb-6" style={{ color: '#57534e' }}>Be the first to create a poll and start the conversation!</p>
                <Button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="text-white hover:opacity-90 syne font-semibold"
                  style={{ background: '#1c1917', borderRadius: '12px' }}
                >
                  Create Your First Poll
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {polls.map((poll, index) => {
                  const isHighlighted = highlightedPollId && poll?._id === highlightedPollId
                  return (
                    <div
                      key={poll?._id || index}
                      ref={(el) => {
                        if (poll?._id) {
                          pollRefs.current[poll._id] = el
                        }
                      }}
                      className={`rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${
                        isHighlighted ? 'ring-2' : ''
                      }`}
                      style={{ 
                        background: '#fff', 
                        border: isHighlighted ? '2px solid #f59e0b' : '1px solid #e7e5e4',
                        boxShadow: isHighlighted ? '0 0 0 3px #fef3c7' : undefined
                      }}
                    >
                      <PollCard 
                        poll={poll} 
                        onVote={refreshPolls} 
                        onPollUpdated={handlePollUpdated}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar - Hidden on mobile and md, visible on lg+ screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl p-4 shadow-sm" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
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
