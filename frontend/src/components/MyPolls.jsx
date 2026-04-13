import React, { useState, useEffect } from 'react'
import { Copy, Lock, Users, Eye, EyeOff, MoreVertical, Trash2, Pencil } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/api"
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { EditPollDialog } from './EditPollDialog'

const MyPolls = () => {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [showKeys, setShowKeys] = useState({})
  const [editingPoll, setEditingPoll] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchMyPolls()
  }, [])

  const fetchMyPolls = async () => {
    try {
      setLoading(true)
      const response = await apiRequest("GET", "/polls/my-polls")
      setPolls(response.data.polls || [])
    } catch (error) {
      console.error('Error fetching your polls:', error)
      toast.error(error.response?.data?.message || 'Failed to load your polls')
    } finally {
      setLoading(false)
    }
  }

  const handlePollUpdated = (updatedPoll) => {
    if (!updatedPoll) {
      // Poll was deleted, refresh the list
      fetchMyPolls();
      return;
    }
    
    setPolls(prevPolls => 
      prevPolls.map(poll => 
        poll._id === updatedPoll._id ? updatedPoll : poll
      )
    );
  };

  const handleEditPoll = (poll) => {
    setEditingPoll(poll);
    setIsEditDialogOpen(true);
  };

  const handleDeletePoll = (pollId) => {
    toast.custom((t) => (
      <div 
        className="rounded-lg shadow-lg p-4 w-full max-w-md"
        style={{ background: '#fff', border: '1px solid #e7e5e4' }}
      >
        <h3 className="font-semibold text-lg mb-2 syne" style={{ color: '#1c1917' }}>Delete Poll</h3>
        <p className="mb-4" style={{ color: '#57534e' }}>Are you sure you want to delete this poll? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors"
            style={{ background: '#f5f4f2', color: '#57534e' }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                await apiRequest('DELETE', `polls/poll/${pollId}`);
                toast.success('Poll deleted successfully');
                fetchMyPolls();
              } catch (error) {
                console.error('Error deleting poll:', error);
                toast.error(error.response?.data?.message || 'Failed to delete poll');
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none transition-opacity hover:opacity-90"
            style={{ background: '#dc2626' }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  const copyToClipboard = (text, pollId) => {
    navigator.clipboard.writeText(text)
    toast("Private key copied to clipboard!")
  }

  const toggleKeyVisibility = (pollId) => {
    setShowKeys(prev => ({
      ...prev,
      [pollId]: !prev[pollId]
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#fef3c7' }}>
          <Users className="h-8 w-8" style={{ color: '#d97706' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2 syne" style={{ color: '#1c1917' }}>No polls created yet</h3>
        <p className="mb-6" style={{ color: '#57534e' }}>You haven't created any polls yet. Start by creating your first poll!</p>
        <Button 
          onClick={() => window.location.href = '/feed'}
          className="text-white hover:opacity-90 syne font-semibold"
          style={{ background: '#1c1917', borderRadius: '12px' }}
        >
          Create Your First Poll
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold syne" style={{ color: '#1c1917' }}>Your Created Polls</h2>
        <span 
          className="text-sm px-3 py-1 rounded-full"
          style={{ background: '#fef3c7', color: '#92400e' }}
        >
          {polls.length} {polls.length === 1 ? 'poll' : 'polls'}
        </span>
      </div>
      
      <div className="space-y-4">
        {polls.map((poll) => (
          <Card 
            key={poll._id} 
            className="shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ border: '1px solid #e7e5e4', borderRadius: '16px' }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <CardTitle 
                      className="text-base font-semibold mb-3 leading-tight syne"
                      style={{ color: '#1c1917' }}
                    >
                      {poll.description}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Poll actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPoll(poll)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit Poll</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeletePoll(poll._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Poll</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: poll.isPrivate ? '#fef2f2' : '#f0fdf4',
                        color: poll.isPrivate ? '#dc2626' : '#16a34a'
                      }}
                    >
                      {poll.isPrivate ? (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </>
                      ) : (
                        <>
                          <Users className="h-3 w-3 mr-1" />
                          Public
                        </>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: '#a8a29e' }}>
                      {formatDate(poll.createdAt)}
                    </span>
                  </div>
                  <CardDescription className="text-sm" style={{ color: '#57534e' }}>
                    {poll.options?.length || 0} options • {poll.isPrivate ? 'Private poll' : 'Public poll'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {poll.isPrivate && (
              <CardContent className="pt-0">
                <div 
                  className="rounded-lg p-4"
                  style={{ background: '#fef3c7', border: '1px solid #fde68a' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label 
                      className="text-sm font-semibold"
                      style={{ color: '#92400e' }}
                    >
                      Private Access Key
                    </label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleKeyVisibility(poll._id)}
                      className="h-7 px-2 hover:opacity-80"
                      style={{ color: '#d97706' }}
                    >
                      {showKeys[poll._id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={showKeys[poll._id] ? poll.privateKey : '••••••••••••••••'}
                      readOnly
                      className="font-mono text-sm"
                      type={showKeys[poll._id] ? "text" : "password"}
                      style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '8px' }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(poll.privateKey, poll._id)}
                      className="px-3 hover:opacity-80"
                      style={{ border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e' }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p 
                    className="text-xs mt-3 font-medium"
                    style={{ color: '#a16207' }}
                  >
                    Share this key with users you want to invite to your private poll.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Poll Dialog */}
      {editingPoll && (
        <EditPollDialog 
          poll={editingPoll}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onPollUpdated={(updatedPoll) => {
            handlePollUpdated(updatedPoll);
            setEditingPoll(null);
          }}
        />
      )}
    </div>
  )
}

export default MyPolls
