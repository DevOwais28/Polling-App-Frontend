import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import useAppStore from "@/store";
import { apiRequest } from "@/api";
import { CommentActions } from "./CommentActions";

// Format date to relative time (e.g., "2h ago", "3d ago")
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Calculate time differences
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  // Return appropriate time string
  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const CommentSection = ({ pollId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const user = useAppStore((state) => state.user);

  const truncate = (value, max) => {
    if (!value) return '';
    return value.length > max ? value.slice(0, max) + '...' : value;
  };

  const fetchComments = async () => {
    try {
      const response = await apiRequest('GET', `comments/comment/${pollId}`);
      if (response.data.success) {
        setComments(response.data.comments);
                
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [pollId, showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const response = await apiRequest('POST', `comments/comment/${pollId}`, { text: newComment });

      if (response.data.success) {
        setComments([...comments, response.data.comment]);
        setNewComment('');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(prevComments =>
      prevComments.map(c =>
        c._id === updatedComment._id ? updatedComment : c
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment._id !== commentId)
    );
  };

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e7e5e4' }}>
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm transition-colors group"
        style={{ color: '#a8a29e' }}
      >
        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: '#d97706' }} />
        <span className="font-medium" style={{ color: '#57534e' }}>{showComments ? 'Hide' : 'Show'} Comments</span>
        {comments.length > 0 && (
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: '#f5f4f2', color: '#57534e' }}
          >
            {comments.length}
          </span>
        )}
      </button>

      {showComments && (
        <div className="mt-3 space-y-4 text-left">
          {/* Add Comment Form */}
          {user ? (
            <div className="rounded-lg p-3" style={{ background: '#f5f4f2' }}>
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0" style={{ border: '2px solid #fff' }}>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs font-medium" style={{ background: '#fef3c7', color: '#92400e' }}>
                    {user.username?.charAt(0)?.toUpperCase() || 
                     user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] text-sm resize-none text-left"
                    style={{ borderColor: '#e7e5e4', fontFamily: "'DM Sans', sans-serif" }}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-left" style={{ color: '#a8a29e' }}>
                      {newComment.length}/500
                    </span>
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || loading}
                      size="sm"
                      className="gap-1 syne font-semibold text-white hover:opacity-90"
                      style={{ background: '#1c1917', borderRadius: '8px', fontFamily: "'Syne', sans-serif" }}
                    >
                      <Send className="w-3 h-3" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-left py-6 rounded-lg" style={{ background: '#f5f4f2' }}>
              <MessageCircle className="w-8 h-8 mb-2" style={{ color: '#d97706' }} />
              <p className="text-sm mb-3" style={{ color: '#57534e' }}>Login to join the conversation</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.location.href = '/login'}
                style={{ borderColor: '#e7e5e4', color: '#57534e', borderRadius: '8px' }}
              >
                Login to Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-3 text-left">
              {comments.map((comment) => (
                <div 
                  key={comment._id} 
                  className="rounded-lg p-4 transition-colors text-left"
                  style={{ background: '#fff', border: '1px solid #e7e5e4' }}
                >
                  <div className="flex gap-3 text-left">
                    <Avatar className="w-8 h-8 flex-shrink-0" style={{ border: '2px solid #e7e5e4' }}>
                      <AvatarImage src={comment.userId?.avatar} />
                      <AvatarFallback className="text-xs font-medium" style={{ background: '#fef3c7', color: '#92400e' }}>
                        {comment.userId?.username?.charAt(0)?.toUpperCase() || 
                         comment.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-start mb-2 text-left">
                        <div className="flex items-center gap-2 text-left">
                          <p className="text-sm font-semibold text-left" style={{ color: '#1c1917' }}>
                            {truncate(comment.userId?.name || 'Anonymous User', 18)}
                          </p>
                          <p className="text-xs text-left" style={{ color: '#a8a29e' }}>
                            {/* @{comment.userId?.username || 'anonymous'} */}
                          </p>
                          <p className="text-xs hidden sm:inline" style={{ color: '#e7e5e4' }}>•</p>
                          <p className="text-xs" style={{ color: '#a8a29e' }}>
                            {/* {formatDate(comment.createdAt)} */}
                          </p>
                        </div>
                        <CommentActions 
                          comment={comment} 
                          isOwner={
                            comment.userId?._id === user?._id ||
                            comment.userId === user?._id ||
                            comment.userId === user?.id ||
                            comment.userId?._id === user?.id ||
                            (comment.userId?.username && comment.userId?.username === user?.username) ||
                            (comment.userId?.email && comment.userId?.email === user?.email)
                          }
                          onUpdate={handleUpdateComment} 
                          onDelete={handleDeleteComment} 
                        />
                      </div>
                      <p className="mt-1 text-sm" style={{ color: '#57534e' }}>
                        {comment.content || comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && !loading && (
            <div className="text-left py-4 text-sm" style={{ color: '#a8a29e' }}>
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
