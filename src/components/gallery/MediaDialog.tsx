"use client";

import { useState, useEffect } from "react";
import { IconX, IconPhoto, IconVideo, IconHeart, IconShare, IconCalendar } from "@tabler/icons-react";
import { ShareButton } from "@/components/ui/ShareButton";
import { LikeButton } from "@/components/ui/LikeButton";

interface MediaItem {
  id: number;
  game: string;
  caption: string;
  date: string;
  type: "screenshot" | "video" | "youtube";
  url?: string;
  youtubeId?: string;
  notes: string;
  likes?: number;
  tags?: string[];
  postId?: string;
}

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number | null;
  allMedia: MediaItem[];
}

export function MediaDialog({ isOpen, onClose, mediaId, allMedia }: MediaDialogProps) {
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mediaId !== null && allMedia.length > 0) {
      const index = mediaId;
      if (index >= 0 && index < allMedia.length) {
        setCurrentIndex(index);
        setCurrentMedia(allMedia[index]);
      }
    }
  }, [mediaId, allMedia]);

  const navigateToNext = () => {
    const nextIndex = (currentIndex + 1) % allMedia.length;
    setCurrentIndex(nextIndex);
    setCurrentMedia(allMedia[nextIndex]);
  };

  const navigateToPrev = () => {
    const prevIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
    setCurrentIndex(prevIndex);
    setCurrentMedia(allMedia[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          navigateToNext();
          break;
        case "ArrowLeft":
          navigateToPrev();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, allMedia.length]);

  if (!isOpen || !currentMedia) return null;

  return (
    <div className="media-dialog-overlay" onClick={onClose}>
      <div className="media-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="media-dialog-close" onClick={onClose}>
          <IconX size={24} />
        </button>
        
        <div className="media-dialog-content">
          <div className="media-display">
            <div className="media-main">
              {currentMedia.type === "youtube" && currentMedia.youtubeId ? (
                <div className="youtube-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentMedia.youtubeId}?autoplay=0&rel=0`}
                    title={currentMedia.caption}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="youtube-iframe"
                  ></iframe>
                </div>
              ) : currentMedia.type === "video" && currentMedia.url ? (
                <div className="video-container">
                  <video 
                    controls 
                    className="media-video"
                    onError={() => {
                      // Fallback to placeholder if video fails to load
                      const container = document.querySelector('.video-container');
                      if (container) {
                        container.innerHTML = `
                          <div class="video-placeholder">
                            <div class="media-type-badge">
                              <span>Video unavailable</span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  >
                    <source src={currentMedia.url} type="video/mp4" />
                    <source src={currentMedia.url} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : currentMedia.url ? (
                <div className="image-container">
                  <img 
                    src={currentMedia.url} 
                    alt={currentMedia.caption}
                    className="media-image"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const container = img.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="image-placeholder">
                            <div class="media-type-badge">
                              <span>Image unavailable</span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="media-placeholder">
                  <div className="media-type-badge">
                    <IconPhoto size={32} />
                    <span>Media unavailable</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="media-navigation">
              <button 
                className="nav-button prev" 
                onClick={navigateToPrev}
                disabled={allMedia.length <= 1}
              >
                ←
              </button>
              <span className="media-counter">
                {currentIndex + 1} of {allMedia.length}
              </span>
              <button 
                className="nav-button next" 
                onClick={navigateToNext}
                disabled={allMedia.length <= 1}
              >
                →
              </button>
            </div>
          </div>
          
          <div className="media-sidebar">
            <div className="media-info">
              <div className="media-game-badge">{currentMedia.game}</div>
              
              <h3 className="media-title">{currentMedia.caption}</h3>
              
              <div className="media-meta">
                <div className="meta-row">
                  <IconCalendar size={16} />
                  <span>{new Date(currentMedia.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              {currentMedia.tags && (
                <div className="media-tags">
                  {currentMedia.tags.map((tag) => (
                    <span key={tag} className="media-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="media-notes">
              <h4>Tom's Notes</h4>
              <div className="notes-content">
                {currentMedia.notes || "No notes for this moment yet."}
              </div>
            </div>
            
            <div className="media-actions">
              {currentMedia.postId && (
                <LikeButton postId={currentMedia.postId} size="medium" />
              )}
              <ShareButton 
                title={`${currentMedia.caption} - ${currentMedia.game}`}
                description={`Check out this awesome ${currentMedia.type} from ${currentMedia.game}!`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}