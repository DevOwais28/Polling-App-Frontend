import React, { useState, useEffect } from 'react'
import { TrendingUp, Hash, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/api"
import { useNavigate } from "react-router-dom"

const TrendingSection = () => {
  const [trendingPolls, setTrendingPolls] = useState([])
  const [activePolls, setActivePolls] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTrendingData()
  }, [])

  const fetchTrendingData = async () => {
    try {
      setLoading(true)
      const [trendingResponse, activeResponse] = await Promise.all([
        apiRequest("GET", "/polls/trending"),
        apiRequest("GET", "/polls/active")
      ])
      
      setTrendingPolls(trendingResponse.data.trendingPolls || [])
      setActivePolls(activeResponse.data.activePolls || [])
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePollClick = (pollId) => {
    navigate(`/poll/${pollId}`)
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  // Generate trending topics from poll descriptions
  const generateTrendingTopics = () => {
    const topics = {}
    trendingPolls.forEach(poll => {
      const words = poll.description.toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 4) { // Only consider words longer than 4 characters
          topics[word] = (topics[word] || 0) + poll.voteCount
        }
      })
    })
    
    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({
        hashtag: `#${topic}`,
        posts: count
      }))
  }

  const trendingTopics = generateTrendingTopics()

  if (loading) {
    return (
      <div className="space-y-6">
        <Card style={{ border: '1px solid #e7e5e4', borderRadius: '16px' }}>
          <CardContent className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 rounded w-1/3" style={{ background: '#e7e5e4' }}></div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-3 rounded" style={{ background: '#e7e5e4' }}></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card style={{ border: '1px solid #e7e5e4', borderRadius: '16px' }}>
          <CardContent className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 rounded w-1/3" style={{ background: '#e7e5e4' }}></div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-3 rounded" style={{ background: '#e7e5e4' }}></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div>
        <h3 
          className="text-sm font-semibold mb-3 flex items-center gap-2 syne"
          style={{ color: '#1c1917' }}
        >
          <TrendingUp className="h-4 w-4" style={{ color: '#f59e0b' }} />
          Trending Topics
        </h3>
        <div className="space-y-2">
          {trendingTopics.length > 0 ? (
            trendingTopics.map((topic, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between text-sm p-2 rounded-lg transition-colors cursor-pointer hover:bg-amber-50"
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-3 w-3" style={{ color: '#a8a29e' }} />
                  <span 
                    className="transition-colors hover:text-amber-600"
                    style={{ color: '#57534e' }}
                  >
                    {topic.hashtag}
                  </span>
                </div>
                <span className="text-xs font-medium" style={{ color: '#a8a29e' }}>
                  {topic.posts} votes
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm p-2" style={{ color: '#a8a29e' }}>No trending topics yet</p>
          )}
        </div>
      </div>

      {/* Active Polls */}
      <div>
        <h3 
          className="text-sm font-semibold mb-3 flex items-center gap-2 syne"
          style={{ color: '#1c1917' }}
        >
          <Activity className="h-4 w-4" style={{ color: '#22c55e' }} />
          Active Polls
        </h3>
        <div className="space-y-2">
          {activePolls.length > 0 ? (
            activePolls.map((poll, index) => (
              <div 
                key={poll._id} 
                className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-amber-50"
                onClick={() => handlePollClick(poll._id)}
              >
                <p 
                  className="text-sm transition-colors mb-1 font-medium hover:text-amber-600"
                  style={{ color: '#57534e' }}
                >
                  {truncateText(poll.description, 45)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: '#a8a29e' }}>
                    {poll.recentVoteCount} votes
                  </span>
                  <span className="text-xs" style={{ color: '#d6d3d1' }}>
                    {formatTimeAgo(poll.lastActivity)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm p-2" style={{ color: '#a8a29e' }}>No active polls recently</p>
          )}
        </div>
      </div>

      {/* Most Voted */}
      {trendingPolls.length > 0 && (
        <div>
          <h3 
            className="text-sm font-semibold mb-3 flex items-center gap-2 syne"
            style={{ color: '#1c1917' }}
          >
            <Users className="h-4 w-4" style={{ color: '#8b5cf6' }} />
            Most Voted
          </h3>
          <div className="space-y-2">
            {trendingPolls.slice(0, 5).map((poll, index) => (
              <div 
                key={poll._id} 
                className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-amber-50"
                onClick={() => handlePollClick(poll._id)}
              >
                <p 
                  className="text-sm transition-colors mb-1 font-medium hover:text-amber-600"
                  style={{ color: '#57534e' }}
                >
                  {truncateText(poll.description, 45)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: '#a8a29e' }}>
                    {poll.voteCount} votes
                  </span>
                  <span className="text-xs" style={{ color: '#d6d3d1' }}>
                    @{poll.createdBy?.username || 'anonymous'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrendingSection
