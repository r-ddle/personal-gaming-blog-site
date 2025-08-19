"use client";

import { IconClock, IconCalendar, IconDeviceGamepad, IconPhoto, IconVideo } from "@tabler/icons-react";
import Link from "next/link";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { LikeButton } from "@/components/ui/LikeButton";
import { useState } from "react";
import { MediaDialog } from "@/components/gallery/MediaDialog";

export interface GameLogPostData {
  id: string;
  title: string;
  game: string;
  platform: string;
  content: string;
  mediaItems: {
    type: 'screenshot' | 'video' | 'youtube';
    url: string;
    caption?: string;
  }[];
  createdAt: string;
  playtime?: string;
  rating?: number;
  mood: 'excited' | 'frustrated' | 'satisfied' | 'disappointed' | 'amazed';
}

interface GameLogPostProps {
  post: GameLogPostData;
  variant?: 'full' | 'preview';
}

// Move extractYouTubeId above its first usage to avoid ReferenceError
const extractYouTubeId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : '';
};

export function GameLogPost({ post, variant = 'preview' }: GameLogPostProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);

  const moodColors = {
    excited: 'var(--green)',
    frustrated: 'var(--red)',
    satisfied: 'var(--blue)',
    disappointed: 'var(--orange)',
    amazed: 'var(--purple)'
  };

  const moodEmojis = {
    excited: '🎉',
    frustrated: '😤',
    satisfied: '😊',
    disappointed: '😔',
    amazed: '🤯'
  };

  // Convert post media items to match MediaDialog format
  const mediaForDialog = post.mediaItems.map((media, index) => ({
    id: index,
    game: post.game,
    caption: media.caption || `${post.game} media`,
    date: post.createdAt,
    type: media.type as 'screenshot' | 'video' | 'youtube',
    url: media.url,
    youtubeId: media.type === 'youtube' ? extractYouTubeId(media.url) : undefined,
    notes: post.content,
    tags: [post.game, post.platform, post.mood],
    postId: post.id
  }));

  const handleMediaClick = (index: number) => {
    if (variant === 'full') {
      setSelectedMediaId(index);
      setDialogOpen(true);
    }
  };

  return (
    <article className="game-blog-post">
      <div className="game-blog-header">
        <div className="game-cover-large">
          <div className="game-placeholder"></div>
          <div className="game-status-overlay" style={{ backgroundColor: moodColors[post.mood] }}>
            <span>{moodEmojis[post.mood]}</span>
            <span>{post.mood}</span>
          </div>
        </div>
        
        <div className="game-blog-meta">
          <div className="game-title-section">
            <h2>{post.game}</h2>
            <div className="game-platform">{post.platform}</div>
            {post.rating && (
              <div className="game-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < post.rating! ? "star-filled" : "star-empty"}>
                    ★
                  </span>
                ))}
                <span className="rating-text">{post.rating}/5</span>
              </div>
            )}
          </div>
          
          <div className="game-stats">
            <div className="stat-item">
              <IconCalendar size={14} />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.playtime && (
              <div className="stat-item">
                <IconClock size={14} />
                <span>{post.playtime}</span>
              </div>
            )}
            <div className="stat-item">
              <IconPhoto size={14} />
              <span>{post.mediaItems.filter(m => m.type === 'screenshot').length} screenshots</span>
            </div>
            <div className="stat-item">
              <IconVideo size={14} />
              <span>{post.mediaItems.filter(m => m.type === 'video').length} clips</span>
            </div>
          </div>
        </div>
      </div>

      <div className="game-blog-content">
        <h3>{post.title}</h3>
        <div className="game-thoughts">
          {variant === 'preview' 
            ? <p>{post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')}</p>
            : <ContentRenderer content={post.content} />
          }
        </div>
        
        {post.mediaItems.length > 0 && (
          <div className="media-preview-section">
            <div className="media-preview-grid">
              {post.mediaItems.slice(0, variant === 'preview' ? 4 : post.mediaItems.length).map((media, i) => (
                <MediaRenderer
                  key={i}
                  media={media}
                  size="small"
                  onClick={() => handleMediaClick(i)}
                  showCaption={variant === 'full'}
                />
              ))}
            </div>
            {variant === 'preview' && post.mediaItems.length > 4 && (
              <span className="media-count-badge">+{post.mediaItems.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="game-blog-actions">
        <LikeButton postId={post.id} size="small" />
        {variant === 'preview' && (
          <Link href={`/games/${post.id}`} className="button">
            <IconDeviceGamepad size={16} />
            Read Full Post
          </Link>
        )}
      </div>

      <MediaDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mediaId={selectedMediaId}
        allMedia={mediaForDialog}
      />
    </article>
  );
}