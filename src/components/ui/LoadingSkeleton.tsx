"use client";

interface LoadingSkeletonProps {
  variant?: 'post' | 'rant' | 'media' | 'text';
  count?: number;
}

export function LoadingSkeleton({ variant = 'post', count = 1 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const renderPostSkeleton = () => (
    <div className="game-blog-post loading-skeleton-container">
      <div className="game-blog-header">
        <div className="game-cover-large">
          <div className="loading-skeleton game-placeholder"></div>
        </div>
        <div className="game-blog-meta">
          <div className="game-title-section">
            <div className="loading-skeleton skeleton-text skeleton-title"></div>
            <div className="loading-skeleton skeleton-text skeleton-subtitle"></div>
            <div className="loading-skeleton skeleton-text skeleton-rating"></div>
          </div>
          <div className="game-stats">
            <div className="loading-skeleton skeleton-text skeleton-stat"></div>
            <div className="loading-skeleton skeleton-text skeleton-stat"></div>
          </div>
        </div>
      </div>
      <div className="game-blog-content">
        <div className="loading-skeleton skeleton-text skeleton-content-title"></div>
        <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
        <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
        <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
      </div>
    </div>
  );

  const renderRantSkeleton = () => (
    <div className="quick-rant loading-skeleton-container">
      <div className="rant-header">
        <div className="loading-skeleton skeleton-text skeleton-badge"></div>
        <div className="loading-skeleton skeleton-text skeleton-time"></div>
      </div>
      <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
      <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
    </div>
  );

  const renderMediaSkeleton = () => (
    <div className="media-item">
      <div className="loading-skeleton media-size-small"></div>
    </div>
  );

  const renderTextSkeleton = () => (
    <div className="loading-skeleton skeleton-text skeleton-content-line"></div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'rant':
        return renderRantSkeleton();
      case 'media':
        return renderMediaSkeleton();
      case 'text':
        return renderTextSkeleton();
      default:
        return renderPostSkeleton();
    }
  };

  return (
    <>
      {skeletons.map((index) => (
        <div key={index} className="fade-in">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}