"use client";

import { IconEdit, IconTrash, IconArrowLeft, IconEye, IconCalendar, IconDeviceGamepad } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  game: string;
  platform: string;
  content: string;
  playtime?: string;
  rating?: number;
  mood: string;
  createdAt: string;
  mediaItems: any[];
}

export default function PostsManagementPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  const moods = [
    { value: 'all', label: 'All Moods' },
    { value: 'excited', label: 'Excited', emoji: '🎉' },
    { value: 'satisfied', label: 'Satisfied', emoji: '😊' },
    { value: 'amazed', label: 'Amazed', emoji: '🤯' },
    { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
    { value: 'disappointed', label: 'Disappointed', emoji: '😔' }
  ];

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
    if (isAuthenticated()) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleLogin = () => {
    setAuthenticated(true);
    fetchPosts();
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = selectedMood === 'all' || post.mood === selectedMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-column-container">
          <div className="loading-skeleton" style={{ height: '200px' }}></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onSuccess={handleLogin} />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <Link href="/admin" className="button">
            <IconArrowLeft size={16} />
            Back to Admin
          </Link>
          <div>
            <h1>Posts Management</h1>
            <p className="subtext">View, edit, and manage all your gaming posts</p>
          </div>
        </div>
      </div>

      <div className="posts-management-page">
        <div className="posts-filters">
          <div className="search-bar">
            <input
              type="text"
              className="setting-input"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              className="setting-select"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
            >
              {moods.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.emoji ? `${mood.emoji} ${mood.label}` : mood.label}
                </option>
              ))}
            </select>

            <select
              className="setting-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="posts-stats">
          <div className="stat-card">
            <div className="stat-number">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filteredPosts.length}</div>
            <div className="stat-label">Filtered Results</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{posts.reduce((acc, post) => acc + post.mediaItems.length, 0)}</div>
            <div className="stat-label">Media Items</div>
          </div>
        </div>

        <div className="posts-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="post-management-card">
                <div className="post-card-header">
                  <div className="post-basic-info">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-game">
                        <IconDeviceGamepad size={14} />
                        {post.game}
                      </span>
                      <span className="post-platform">{post.platform}</span>
                      <span className="post-date">
                        <IconCalendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="post-badges">
                    <span className={`mood-badge mood-${post.mood}`}>
                      {moods.find(m => m.value === post.mood)?.emoji} {post.mood}
                    </span>
                    {post.rating && (
                      <span className="rating-badge">
                        ★ {post.rating}/5
                      </span>
                    )}
                  </div>
                </div>

                <div className="post-preview">
                  <p>{post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
                </div>

                <div className="post-stats">
                  <span className="post-stat">
                    {post.content.split(' ').length} words
                  </span>
                  <span className="post-stat">
                    {post.mediaItems.length} media items
                  </span>
                  {post.playtime && (
                    <span className="post-stat">
                      {post.playtime} played
                    </span>
                  )}
                </div>

                <div className="post-actions">
                  <Link 
                    href={`/games/${post.id}`}
                    className="post-action-btn view"
                    target="_blank"
                  >
                    <IconEye size={16} />
                    View
                  </Link>
                  <button 
                    className="post-action-btn edit"
                    onClick={() => alert('Edit functionality coming soon!')}
                  >
                    <IconEdit size={16} />
                    Edit
                  </button>
                  <button 
                    className="post-action-btn delete"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <IconTrash size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <IconDeviceGamepad size={48} />
              <h3>No posts found</h3>
              <p className="subtext">
                {posts.length === 0 
                  ? "You haven't created any posts yet."
                  : "No posts match your current filters."
                }
              </p>
              {posts.length === 0 && (
                <Link href="/admin" className="button active">
                  Create your first post
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}