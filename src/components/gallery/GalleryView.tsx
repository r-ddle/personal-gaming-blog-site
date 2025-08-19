"use client";

import { useState } from "react";
import { IconPhoto, IconVideo, IconFilter, IconSearch } from "@tabler/icons-react";
import { MediaDialog } from "@/components/gallery/MediaDialog";
import { MediaRenderer } from "@/components/media/MediaRenderer";

interface MediaItem {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  game: string;
  createdAt: string;
}

interface GalleryViewProps {
  mediaItems: MediaItem[];
}

export function GalleryView({ mediaItems }: GalleryViewProps) {
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');

  // Convert mediaItems to format expected by MediaDialog
  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const mediaForDialog = mediaItems.map((item, index) => ({
    id: index,
    game: item.game,
    caption: item.caption || `${item.game} media`,
    date: item.createdAt,
    type: item.type as 'screenshot' | 'video' | 'youtube',
    url: item.url,
    youtubeId: item.type === 'youtube' ? extractYouTubeId(item.url) : undefined,
    notes: `Captured while playing ${item.game}`,
    likes: Math.floor(Math.random() * 20) + 1,
    tags: [item.game, item.type]
  }));

  const handleMediaClick = (index: number) => {
    setSelectedMediaId(index);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMediaId(null);
  };

  // Get unique games for filter
  const uniqueGames = Array.from(new Set(mediaItems.map(item => item.game)));

  // Filter media items
  const filteredItems = mediaItems.filter(item => {
    const typeMatch = filter === 'all' ||
                     (filter === 'screenshots' && item.type === 'screenshot') ||
                     (filter === 'videos' && (item.type === 'video' || item.type === 'youtube'));
    const gameMatch = gameFilter === 'all' || item.game === gameFilter;
    return typeMatch && gameMatch;
  });

  if (mediaItems.length === 0) {
    return (
      <div className="empty-state">
        <IconPhoto size={48} />
        <h3>No media yet</h3>
        <p className="subtext">Start creating gaming posts with media to see them here!</p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-filters">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'screenshots' ? 'active' : ''}`}
            onClick={() => setFilter('screenshots')}
          >
            Screenshots
          </button>
          <button
            className={`filter-btn ${filter === 'videos' ? 'active' : ''}`}
            onClick={() => setFilter('videos')}
          >
            Videos
          </button>
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${gameFilter === 'all' ? 'active' : ''}`}
            onClick={() => setGameFilter('all')}
          >
            All Games
          </button>
          {uniqueGames.slice(0, 4).map(game => (
            <button
              key={game}
              className={`filter-btn ${gameFilter === game ? 'active' : ''}`}
              onClick={() => setGameFilter(game)}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="gallery-item slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleMediaClick(index)}
          >
            <div className="gallery-image">
              <MediaRenderer
                media={{
                  type: item.type as 'screenshot' | 'video' | 'youtube',
                  url: item.url,
                  caption: item.caption || undefined
                }}
                size="medium"
              />
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  {item.type === 'youtube' ? <IconVideo size={20} /> :
                   item.type === 'video' ? <IconVideo size={20} /> :
                   <IconPhoto size={20} />}
                  <span>{item.game}</span>
                </div>
              </div>
            </div>

            <div className="gallery-item-info">
              <p className="gallery-caption">{item.caption || `${item.game} media`}</p>
              <div className="gallery-meta">
                <span className="gallery-date">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <IconSearch size={48} />
          <h3>No results found</h3>
          <p className="subtext">Try adjusting your filters to see more content.</p>
        </div>
      )}

      <MediaDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        mediaId={selectedMediaId}
        allMedia={mediaForDialog}
      />
    </>
  );
}
