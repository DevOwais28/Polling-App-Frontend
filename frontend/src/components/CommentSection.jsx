import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import useAppStore from "@/store";
import { apiRequest } from "@/api";
import { CommentActions } from "./CommentActions";

// Format date to relative time
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  const m = Math.floor(diff / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const mo = Math.floor(d / 30);
  const y = Math.floor(d / 365);

  if (y > 0) return `${y}y ago`;
  if (mo > 0) return `${mo}mo ago`;
  if (w > 0) return `${w}w ago`;
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "Just now";
};

const CommentSection = ({ pollId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const user = useAppStore((s) => s.user);

  const truncate = (str, max) => (str?.length > max ? str.slice(0, max) + "..." : str || "");

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await apiRequest("GET", `comments/comment/${pollId}`);
      if (res.data.success) setComments(res.data.comments);
    } catch (e) {
      console.error("Error fetching comments:", e);
    }
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments, pollId]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);

    try {
      const res = await apiRequest("POST", `comments/comment/${pollId}`, {
        text: newComment,
      });

      if (res.data.success) {
        setNewComment("");
        fetchComments();
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    } finally {
      setLoading(false);
    }
  };

  // Update comment
  const handleUpdateComment = (updated) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

  // Delete comment
  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      {/* Toggle button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{showComments ? "Hide" : "Show"} Comments</span>
        {comments.length > 0 && (
          <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600">
            {comments.length}
          </span>
        )}
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">

          {/* Add Comment Field */}
          {user ? (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex gap-3 items-start">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    maxLength={500}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] text-sm border-gray-200 resize-none"
                  />

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {newComment.length}/500
                    </span>

                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || loading}
                      size="sm"
                      className="gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 text-center p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Login to join the conversation
              </p>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/login")}>
                Login
              </Button>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition"
                >
                  <div className="flex items-start gap-3">

                    {/* Avatar */}
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.userId?.avatar} />
                      <AvatarFallback>
                        {comment.userId?.username?.[0]?.toUpperCase() ||
                          comment.userId?.name?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      {/* Header row (responsive) */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">

                        {/* Name + username */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                            {truncate(comment.userId?.name || "Anonymous", 18)}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">
                            @{comment.userId?.username || "anonymous"}
                          </p>

                          <p className="text-xs text-gray-400 hidden sm:inline">•</p>

                         <p className="text-xs text-gray-400" title="">
  {formatDate(comment.createdAt)}
</p>

                        </div>

                        {/* Actions */}
                        <div className="self-end sm:self-auto mt-1 sm:mt-0">
                          <CommentActions
                            comment={comment}
                            onUpdate={handleUpdateComment}
                            onDelete={handleDeleteComment}
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <p className="mt-2 text-sm text-gray-700 break-words">
                        {comment.content || comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
