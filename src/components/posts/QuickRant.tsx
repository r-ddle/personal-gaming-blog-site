"use client";

import { IconMoodAngry, IconMoodHappy, IconMoodSad, IconClock } from "@tabler/icons-react";

export interface QuickRantData {
  id: string;
  game: string;
  content: string;
  mood: 'angry' | 'happy' | 'sad' | 'neutral';
  createdAt: string;
}

interface QuickRantProps {
  rant: QuickRantData;
}

export function QuickRant({ rant }: QuickRantProps) {
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'angry': return <IconMoodAngry size={20} color="var(--red)" />;
      case 'happy': return <IconMoodHappy size={20} color="var(--green)" />;
      case 'sad': return <IconMoodSad size={20} color="var(--blue)" />;
      default: return <IconClock size={20} color="var(--gray)" />;
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="quick-rant">
      <div className="rant-header">
        <div className="rant-game-badge">{rant.game}</div>
        <div className="rant-meta">
          {getMoodIcon(rant.mood)}
          <span className="rant-time">{timeAgo(rant.createdAt)}</span>
        </div>
      </div>
      <div className="rant-content">
        <p>{rant.content}</p>
      </div>
    </div>
  );
}