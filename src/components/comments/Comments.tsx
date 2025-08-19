"use client";

import { useState, useEffect } from "react";
import { IconMessage, IconUser, IconTrash, IconPlus } from "@tabler/icons-react";
import { isAuthenticated } from "@/lib/auth";

interface Comment {
  id: string;
  username: string;
  content: string;
  postId: string;
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState({ username: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newComment,
          postId
        })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment({ username: '', content: '' });
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!authenticated) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="loading-skeleton comment-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>
          <IconMessage size={20} />
          Comments ({comments.length})
        </h3>
        {!showForm && (
          <button 
            className="button" 
            onClick={() => setShowForm(true)}
          >
            <IconPlus size={16} />
            Add Comment
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="comment-form fade-in">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                className="comment-input"
                placeholder="Your name"
                value={newComment.username}
                onChange={(e) => setNewComment({...newComment, username: e.target.value})}
                maxLength={50}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts..."
              value={newComment.content}
              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
              maxLength={1000}
              rows={3}
              required
            />
            <div className="character-count">
              {newComment.content.length}/1000
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="button" 
              onClick={() => {
                setShowForm(false);
                setNewComment({ username: '', content: '' });
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button active" 
              disabled={submitting || !newComment.username.trim() || !newComment.content.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-state">
            <IconMessage size={32} />
            <h4>No comments yet</h4>
            <p>Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id} className={`comment slide-up stagger-${Math.min(index + 1, 5)}`}>
              <div className="comment-header">
                <div className="comment-user">
                  <IconUser size={16} />
                  <span className="comment-username">{comment.username}</span>
                </div>
                <div className="comment-meta">
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  {authenticated && (
                    <button 
                      className="comment-delete" 
                      onClick={() => handleDelete(comment.id)}
                      title="Delete comment"
                    >
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}