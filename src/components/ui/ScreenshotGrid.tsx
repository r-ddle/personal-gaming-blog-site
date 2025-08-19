"use client";

import { IconPhoto } from "@tabler/icons-react";

interface Screenshot {
  url: string;
  caption: string;
  game: string;
}

interface ScreenshotGridProps {
  screenshots: Screenshot[];
}

export function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  return (
    <div className="screenshot-preview-grid">
      {screenshots.map((screenshot, index) => (
        <div key={index} className="screenshot-item">
          <img 
            src={screenshot.url} 
            alt={screenshot.caption} 
            className="screenshot-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/200/120?random=${index + 10}`;
            }}
          />
        </div>
      ))}
      {screenshots.length === 0 && (
        <div className="empty-state-screenshots">
          <p className="subtext">No screenshots yet</p>
        </div>
      )}
      {/* Fill remaining slots with placeholders if less than 4 screenshots */}
      {Array.from({ length: Math.max(0, 4 - screenshots.length) }, (_, index) => (
        <div key={`placeholder-${index}`} className="screenshot-item screenshot-placeholder">
          <div className="screenshot-placeholder-content">
            <IconPhoto size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}