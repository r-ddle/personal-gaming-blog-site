"use client";

import { IconPhoto, IconVideo, IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";

interface MediaItem {
  type: 'screenshot' | 'video' | 'youtube';
  url: string;
  caption?: string;
}

interface MediaRendererProps {
  media: MediaItem;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  showCaption?: boolean;
}

export function MediaRenderer({ 
  media, 
  size = 'medium', 
  onClick, 
  showCaption = false 
}: MediaRendererProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'media-size-small';
      case 'large':
        return 'media-size-large';
      default:
        return 'media-size-medium';
    }
  };

  const renderContent = () => {
    if (media.type === 'youtube') {
      const videoId = extractYouTubeId(media.url);
      if (!videoId) {
        return (
          <div className="media-error">
            <IconVideo size={24} />
            <span>Invalid YouTube URL</span>
          </div>
        );
      }

      return (
        <div className={`media-container ${getSizeClasses()}`}>
          <img
            src={getYouTubeThumbnail(videoId)}
            alt={media.caption || 'YouTube video'}
            className="media-image"
            loading="lazy"
          />
          <div className="media-overlay">
            <div className="youtube-play-button">
              <IconPlayerPlay size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      );
    }

    if (media.type === 'screenshot') {
      if (imageError) {
        return (
          <div className="media-placeholder">
            <div className="media-type-badge">
              <IconPhoto size={24} />
              <span>Image unavailable</span>
            </div>
          </div>
        );
      }

      return (
        <div className={`media-container ${getSizeClasses()}`}>
          {imageLoading && (
            <div className="loading-skeleton" />
          )}
          <img
            src={media.url}
            alt={media.caption || 'Game screenshot'}
            className={`media-image ${imageLoading ? 'media-loading' : 'media-loaded'}`}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        </div>
      );
    }

    // Fallback for video type
    return (
      <div className="media-placeholder">
        <div className="media-type-badge">
          <IconVideo size={24} />
          <span>Video</span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`media-item ${onClick ? 'media-clickable' : ''}`}
      onClick={onClick}
    >
      {renderContent()}
      {showCaption && media.caption && (
        <p className="media-caption">
          {media.caption}
        </p>
      )}
    </div>
  );
}

// CSS classes that should be added to globals.css
const mediaStyles = `
.media-error,
.media-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--button-elevated);
  border-radius: calc(var(--border-radius) / 2);
  color: var(--gray);
  font-size: 12px;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.media-type-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
`;