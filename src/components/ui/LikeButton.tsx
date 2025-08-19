"use client";

import { useState, useEffect } from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

export function LikeButton({ 
  postId, 
  initialLiked = false, 
  initialLikeCount = 0,
  size = 'medium',
  showCount = true 
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current like status on mount
    fetchLikeStatus();
  }, [postId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;
  const HeartIcon = liked ? IconHeartFilled : IconHeart;

  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''} ${size} ${loading ? 'loading' : ''}`}
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      <HeartIcon size={iconSize} />
      {showCount && <span className="like-count">{likeCount}</span>}
    </button>
  );
}