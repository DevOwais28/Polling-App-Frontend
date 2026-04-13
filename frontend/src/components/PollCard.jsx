import React, { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { PollProgress } from "./PollProgress";
import CommentSection from "./CommentSection";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditPollDialog } from './EditPollDialog';
import { apiRequest } from '@/api';
import { toast } from 'sonner';
import useAppStore from '@/store';
import { ShareButton } from './sharebutton';

const PollCard = ({ poll, onVote, onPollUpdated }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Calculate expiration status
  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);
  const timeRemaining = poll.expiresAt 
    ? Math.max(1, Math.floor((new Date(poll.expiresAt) - new Date()) / (1000 * 60 * 60)))
    : null;
  const currentUser = useAppStore(state => state.user);
  const isPollOwner = currentUser?._id === poll.createdBy?._id;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!poll || !poll._id) {
    return (
      <div className="rounded-lg shadow-sm p-4" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
        <div className="text-center py-2" style={{ color: '#a8a29e' }}>Loading poll...</div>
      </div>
    );
  }

  
  const handleDeletePoll = async () => {
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
                setIsDeleting(true);
                await apiRequest('DELETE', `polls/poll/${poll._id}`);
                toast.success('Poll deleted successfully');
                if (onPollUpdated) {
                  onPollUpdated(null);
                }
              } catch (error) {
                console.error('Error deleting poll:', error);
                toast.error(error.response?.data?.message || 'Failed to delete poll');
              } finally {
                setIsDeleting(false);
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none transition-opacity hover:opacity-90"
            style={{ background: '#dc2626' }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  const handlePollUpdated = (updatedPoll) => {
    if (onPollUpdated) {
      onPollUpdated(updatedPoll);
    }
  };

  return (
    <div className="p-4 sm:p-6 relative">

      {/* Creator Info and Actions */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10" style={{ border: '2px solid #e7e5e4' }}>
            <AvatarImage 
              src={poll.createdBy?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'} 
              alt={poll.createdBy?.username || 'Anonymous'} 
            />
            <AvatarFallback 
              className="font-medium text-xs sm:text-sm"
              style={{ background: '#fef3c7', color: '#92400e' }}
            >
              {(poll.createdBy?.username || 'Anonymous').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p 
              className="text-sm sm:text-base font-medium truncate"
              style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
            >
              {poll.createdBy?.name || poll.createdBy?.username || 'Anonymous User'}
            </p>
            <p className="text-xs sm:text-sm" style={{ color: '#a8a29e' }}>
              @{poll.createdBy?.username || 'anonymous'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs sm:text-sm" style={{ color: '#a8a29e' }}>
          {isPollOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-amber-50"
                  style={{ color: '#a8a29e' }}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Poll actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ background: '#fff', border: '1px solid #e7e5e4' }}>
                <DropdownMenuItem 
                  onClick={() => setIsEditDialogOpen(true)}
                  style={{ color: '#57534e' }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Poll</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="focus:text-red-600"
                  onClick={handleDeletePoll}
                  disabled={isDeleting}
                  style={{ color: '#dc2626' }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Poll'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="flex items-center gap-2">
            <span>{formatDateShort(poll.createdAt || new Date())}</span>
            <span 
              className="font-medium px-2 py-0.5 rounded-full text-xs"
              style={{ 
                background: poll.isPrivate ? '#fef2f2' : '#f0fdf4',
                color: poll.isPrivate ? '#dc2626' : '#16a34a'
              }}
            >
              {poll.isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Poll Question */}
      <h3 
        className="text-base sm:text-lg font-semibold mb-5 sm:mb-6 leading-tight"
        style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
      >
        {poll.description || 'Untitled Poll'}
      </h3>

      {/* Poll Options */}
      <div className="mb-5 sm:mb-6">
        <PollProgress
          key={poll._id}
          options={poll.options || []}
          pollId={poll._id}
          onVoteComplete={onVote}
        />
      </div>

      {/* Poll Stats (compact) */}
      <div 
        className="flex justify-end pt-3 mt-1"
        style={{ borderTop: '1px solid #f5f4f2' }}
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#a8a29e' }}>
          {!isExpired && timeRemaining > 0 ? (
            <>
              <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }}></div>
              <span className="text-xs sm:text-sm" style={{ color: '#57534e' }}>{timeRemaining} hours remaining</span>
            </>
          ) : (
            <span className="text-xs sm:text-sm" style={{ color: '#dc2626' }}>Poll Ended</span>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-5 pt-2">
        <CommentSection pollId={poll._id} />
        <ShareButton pollId={poll._id} pollDescription={poll.description} />
      </div>

      {/* Edit Poll Dialog */}
      {isEditDialogOpen && (
        <EditPollDialog 
          poll={poll} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onPollUpdated={handlePollUpdated}
        />
      )}
    </div>
  );
};

export default PollCard
