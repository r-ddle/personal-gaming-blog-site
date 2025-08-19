"use client";

import { IconPhoto, IconVideo, IconUpload, IconTrash, IconArrowLeft, IconCheck, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

interface MediaItem {
  id?: string;
  type: 'screenshot' | 'video' | 'youtube';
  url: string;
  caption: string;
  game: string;
  postId?: string;
}

export default function MediaUploadPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [activeUpload, setActiveUpload] = useState<'screenshot' | 'youtube' | 'video' | null>(null);
  const [uploadForm, setUploadForm] = useState({
    url: '',
    caption: '',
    game: '',
    type: 'screenshot' as 'screenshot' | 'video' | 'youtube'
  });

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
    if (isAuthenticated()) {
      fetchMediaList();
    }
  }, []);

  const fetchMediaList = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMediaList(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleLogin = () => {
    setAuthenticated(true);
    fetchMediaList();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm)
      });

      if (response.ok) {
        const newMedia = await response.json();
        setMediaList([newMedia, ...mediaList]);
        setUploadForm({ url: '', caption: '', game: '', type: 'screenshot' });
        setActiveUpload(null);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const response = await fetch(`/api/media?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMediaList(mediaList.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

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
            <h1>Media Management</h1>
            <p className="subtext">Upload and manage your gaming media</p>
          </div>
        </div>
      </div>

      <div className="media-upload-page">
        {!activeUpload ? (
          <div className="media-upload-dashboard">
            <div className="upload-actions">
              <button 
                className="upload-action-card"
                onClick={() => setActiveUpload('screenshot')}
              >
                <div className="action-icon">
                  <IconPhoto size={32} />
                </div>
                <h3>Upload Image</h3>
                <p>Add screenshots or gaming images</p>
              </button>

              <button 
                className="upload-action-card"
                onClick={() => setActiveUpload('youtube')}
              >
                <div className="action-icon">
                  <IconVideo size={32} />
                </div>
                <h3>Add YouTube Video</h3>
                <p>Share gaming clips from YouTube</p>
              </button>

              <button 
                className="upload-action-card"
                onClick={() => setActiveUpload('video')}
              >
                <div className="action-icon">
                  <IconUpload size={32} />
                </div>
                <h3>Video Link</h3>
                <p>Add video from external sources</p>
              </button>
            </div>

            <div className="media-list-section">
              <div className="section-header">
                <h2>Media Library ({mediaList.length})</h2>
              </div>
              
              <div className="media-grid">
                {mediaList.length > 0 ? (
                  mediaList.map((media) => (
                    <div key={media.id} className="media-card">
                      <div className="media-preview">
                        {media.type === 'screenshot' ? (
                          <img src={media.url} alt={media.caption} />
                        ) : media.type === 'youtube' ? (
                          <div className="youtube-preview">
                            <IconVideo size={24} />
                            <span>YouTube</span>
                          </div>
                        ) : (
                          <div className="video-preview">
                            <IconVideo size={24} />
                            <span>Video</span>
                          </div>
                        )}
                        <div className="media-overlay">
                          <button
                            className="delete-media-btn"
                            onClick={() => handleDeleteMedia(media.id!)}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="media-info">
                        <h4>{media.caption}</h4>
                        <p className="media-game">{media.game}</p>
                        <span className="media-type">{media.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <IconPhoto size={48} />
                    <h3>No media uploaded yet</h3>
                    <p className="subtext">Start by uploading your first screenshot or video!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-form-container">
            <div className="form-header">
              <h2>
                {activeUpload === 'screenshot' ? 'Upload Image' :
                 activeUpload === 'youtube' ? 'Add YouTube Video' :
                 'Add Video Link'}
              </h2>
              <button 
                className="button"
                onClick={() => setActiveUpload(null)}
              >
                <IconX size={16} />
                Cancel
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-group">
                <label>
                  {activeUpload === 'screenshot' ? 'Image URL' :
                   activeUpload === 'youtube' ? 'YouTube URL' :
                   'Video URL'}
                </label>
                <input
                  type="url"
                  className="setting-input"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({...uploadForm, url: e.target.value, type: activeUpload})}
                  placeholder={
                    activeUpload === 'screenshot' ? 'https://imgur.com/image.jpg' :
                    activeUpload === 'youtube' ? 'https://youtube.com/watch?v=...' :
                    'https://example.com/video.mp4'
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Caption</label>
                <input
                  type="text"
                  className="setting-input"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm({...uploadForm, caption: e.target.value})}
                  placeholder="Describe this moment..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Game</label>
                <input
                  type="text"
                  className="setting-input"
                  value={uploadForm.game}
                  onChange={(e) => setUploadForm({...uploadForm, game: e.target.value})}
                  placeholder="Game title"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="button active" disabled={uploading}>
                  <IconCheck size={16} />
                  {uploading ? 'Uploading...' : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}