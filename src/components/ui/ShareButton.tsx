"use client";

import { useState, useRef, useEffect } from "react";
import { IconShare, IconCopy, IconBrandTwitter, IconBrandFacebook, IconBrandReddit, IconCheck } from "@tabler/icons-react";

interface ShareButtonProps {
  title: string;
  url?: string;
  description?: string;
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = description || title;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled sharing or sharing failed, show menu instead
        setShowMenu(!showMenu);
      }
    } else {
      // Fallback to showing share menu
      setShowMenu(!showMenu);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
  };

  return (
    <div className="share-button-wrapper">
      <button 
        ref={buttonRef}
        className="button"
        onClick={handleShareClick}
      >
        <IconShare size={16} />
        Share
      </button>

      {showMenu && (
        <div 
          ref={menuRef}
          className="share-dropdown"
        >
          <div className="share-dropdown-arrow"></div>
          <div className="share-dropdown-content">
            <button 
              className="share-dropdown-item"
              onClick={handleCopyLink}
            >
              <div className="share-dropdown-icon">
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </div>
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="share-dropdown-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="share-dropdown-icon twitter">
                <IconBrandTwitter size={16} />
              </div>
              <span>Twitter</span>
            </a>

            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="share-dropdown-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="share-dropdown-icon facebook">
                <IconBrandFacebook size={16} />
              </div>
              <span>Facebook</span>
            </a>

            <a
              href={shareLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="share-dropdown-item"
              onClick={() => setShowMenu(false)}
            >
              <div className="share-dropdown-icon reddit">
                <IconBrandReddit size={16} />
              </div>
              <span>Reddit</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
}