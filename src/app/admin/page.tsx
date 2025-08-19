"use client";

import { IconPlus, IconDeviceGamepad, IconPhoto, IconMoodHappy, IconStar, IconClock, IconLogout } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthenticated, logout } from "@/lib/auth";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<'post' | 'rant' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    gameLogo: '',
    platform: '',
    content: '',
    playtime: '',
    rating: 0,
    mood: 'satisfied' as 'excited' | 'frustrated' | 'satisfied' | 'disappointed' | 'amazed'
  });
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    try {
      const endpoint = activeForm === 'post' ? '/api/posts' : '/api/rants';
      const payload = {
        ...formData,
        ...(activeForm === 'post' && { mediaItems })
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setActiveForm(null);
        setFormData({
          title: '',
          game: '',
          gameLogo: '',
          platform: '',
          content: '',
          playtime: '',
          rating: 0,
          mood: 'satisfied'
        });
        setMediaItems([]);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const platforms = [
    'PC', 'PlayStation 5', 'Xbox Series X/S', 'Nintendo Switch', 
    'Steam Deck', 'Mobile', 'PlayStation 4', 'Xbox One'
  ];

  const moods = [
    { value: 'excited', label: 'Excited', emoji: '🎉' },
    { value: 'satisfied', label: 'Satisfied', emoji: '😊' },
    { value: 'amazed', label: 'Amazed', emoji: '🤯' },
    { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
    { value: 'disappointed', label: 'Disappointed', emoji: '😔' }
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="center-column-container">
          <p>Loading...</p>
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
          <h1>Admin Panel</h1>
          <p className="subtext">Create new posts and manage your gaming log</p>
        </div>
        <div className="page-actions">
          <button className="button" onClick={handleLogout}>
            <IconLogout size={16} />
            Logout
          </button>
        </div>
      </div>

      {!activeForm ? (
        <div className="admin-dashboard">
          <div className="admin-quick-actions">
            <button 
              className="admin-action-card"
              onClick={() => setActiveForm('post')}
            >
              <div className="action-icon">
                <IconDeviceGamepad size={32} />
              </div>
              <h3>New Gaming Post</h3>
              <p>Write a detailed post about your gaming experience</p>
            </button>

            <button 
              className="admin-action-card"
              onClick={() => setActiveForm('rant')}
            >
              <div className="action-icon">
                <IconMoodHappy size={32} />
              </div>
              <h3>Quick Rant</h3>
              <p>Share a quick thought or frustration</p>
            </button>

            <a href="/admin/media" className="admin-action-card">
              <div className="action-icon">
                <IconPhoto size={32} />
              </div>
              <h3>Upload Media</h3>
              <p>Add screenshots and game clips</p>
            </a>

            <a href="/admin/posts" className="admin-action-card">
              <div className="action-icon">
                <IconDeviceGamepad size={32} />
              </div>
              <h3>Manage Posts</h3>
              <p>View, edit, and delete existing posts</p>
            </a>
          </div>
        </div>
      ) : (
        <div className="admin-form-container">
          <div className="form-header">
            <h2>{activeForm === 'post' ? 'New Gaming Post' : 'Quick Rant'}</h2>
            <button 
              className="button"
              onClick={() => setActiveForm(null)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Game Title</label>
                <input
                  type="text"
                  className="setting-input"
                  value={formData.game}
                  onChange={(e) => setFormData({...formData, game: e.target.value})}
                  placeholder="e.g. Elden Ring"
                  required
                />
              </div>

              <div className="form-group">
                <label>Game Logo URL (optional)</label>
                <input
                  type="url"
                  className="setting-input"
                  value={formData.gameLogo}
                  onChange={(e) => setFormData({...formData, gameLogo: e.target.value})}
                  placeholder="e.g. https://example.com/game-logo.png"
                />
              </div>

              <div className="form-group">
                <label>Platform</label>
                <select 
                  className="setting-select"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  required
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mood</label>
                <div className="mood-selector">
                  {moods.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      className={`mood-button ${formData.mood === mood.value ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, mood: mood.value as any})}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span className="mood-label">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeForm === 'post' && (
                <>
                  <div className="form-group">
                    <label>Post Title</label>
                    <input
                      type="text"
                      className="setting-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Finally beat the final boss!"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Playtime (optional)</label>
                    <input
                      type="text"
                      className="setting-input"
                      value={formData.playtime}
                      onChange={(e) => setFormData({...formData, playtime: e.target.value})}
                      placeholder="e.g. 45 hours"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-selector">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          className={`rating-star ${formData.rating >= rating ? 'filled' : ''}`}
                          onClick={() => setFormData({...formData, rating})}
                        >
                          <IconStar size={20} />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group full-width">
                <label>{activeForm === 'post' ? 'Your thoughts' : 'What\'s on your mind?'}</label>
                {activeForm === 'post' ? (
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Share your detailed thoughts about this game..."
                    minRows={8}
                  />
                ) : (
                  <textarea
                    className="content-textarea"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Quick rant or thought..."
                    rows={4}
                    required
                  />
                )}
              </div>

              {activeForm === 'post' && (
                <div className="form-group full-width">
                  <MediaUpload 
                    onMediaChange={setMediaItems}
                    initialMedia={mediaItems}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="button active">
                <IconPlus size={16} />
                {activeForm === 'post' ? 'Create Post' : 'Post Rant'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}