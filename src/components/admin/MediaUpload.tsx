"use client";

import { useState } from "react";
import { IconPhoto, IconVideo, IconPlus, IconX } from "@tabler/icons-react";

interface MediaItem {
  type: 'screenshot' | 'youtube' | 'video';
  url: string;
  caption: string;
}

interface MediaUploadProps {
  onMediaChange: (media: MediaItem[]) => void;
  initialMedia?: MediaItem[];
}

export function MediaUpload({ onMediaChange, initialMedia = [] }: MediaUploadProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [activeForm, setActiveForm] = useState<'screenshot' | 'youtube' | 'video' | null>(null);
  const [formData, setFormData] = useState({ url: '', caption: '' });

  const detectMediaType = (url: string, selectedType: 'screenshot' | 'youtube' | 'video'): 'screenshot' | 'youtube' | 'video' => {
    // If it's a YouTube URL, always return youtube
    if (url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/)) {
      return 'youtube';
    }
    
    // Check if it's an image URL by file extension or known image hosts
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
    const imageHosts = /(imgur\.com|i\.imgur\.com|cdn\.discordapp\.com|steamuserimages)/i;
    
    if (imageExtensions.test(url) || imageHosts.test(url)) {
      return 'screenshot';
    }
    
    // Check if it's a video URL by file extension
    const videoExtensions = /\.(mp4|webm|avi|mov|wmv|flv|mkv)(\?.*)?$/i;
    if (videoExtensions.test(url)) {
      return 'video';
    }
    
    // Fall back to user's selected type
    return selectedType;
  };

  const handleAddMedia = () => {
    if (!activeForm || !formData.url || !formData.caption) return;

    const detectedType = detectMediaType(formData.url, activeForm);
    
    const newMedia: MediaItem = {
      type: detectedType,
      url: formData.url,
      caption: formData.caption
    };

    const updatedMedia = [...mediaItems, newMedia];
    setMediaItems(updatedMedia);
    onMediaChange(updatedMedia);
    
    setFormData({ url: '', caption: '' });
    setActiveForm(null);
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedMedia);
    onMediaChange(updatedMedia);
  };

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  return (
    <div className="media-upload-section">
      <h4>Media Items</h4>
      
      {mediaItems.length > 0 && (
        <div className="media-items-list">
          {mediaItems.map((media, index) => (
            <div key={index} className="media-item-preview">
              <div className="media-preview-icon">
                {media.type === 'youtube' ? <IconVideo size={20} /> : <IconPhoto size={20} />}
              </div>
              <div className="media-item-info">
                <div className="media-item-caption">{media.caption}</div>
                <div className="media-item-url">
                  {media.type === 'youtube' ? `YouTube: ${extractYouTubeId(media.url)}` : 
                   media.type === 'video' ? `Video: ${media.url}` : 
                   `Image: ${media.url}`}
                </div>
              </div>
              <button
                type="button"
                className="media-remove-btn"
                onClick={() => handleRemoveMedia(index)}
              >
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!activeForm ? (
        <div className="media-add-buttons">
          <button
            type="button"
            className="button"
            onClick={() => setActiveForm('screenshot')}
          >
            <IconPhoto size={16} />
            Add Image
          </button>
          <button
            type="button"
            className="button"
            onClick={() => setActiveForm('youtube')}
          >
            <IconVideo size={16} />
            Add YouTube Video
          </button>
          <button
            type="button"
            className="button"
            onClick={() => setActiveForm('video')}
          >
            <IconVideo size={16} />
            Add Video Link
          </button>
        </div>
      ) : (
        <div className="media-form">
          <div className="form-group">
            <label>
              {activeForm === 'youtube' ? 'YouTube URL' : 
               activeForm === 'video' ? 'Video URL' : 
               'Image URL'}
            </label>
            <input
              type="url"
              className="setting-input"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder={
                activeForm === 'youtube' ? 'https://youtube.com/watch?v=...' : 
                activeForm === 'video' ? 'https://example.com/video.mp4' :
                'https://imgur.com/image.jpg'
              }
            />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input
              type="text"
              className="setting-input"
              value={formData.caption}
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
              placeholder="Describe this moment..."
            />
          </div>
          <div className="media-form-actions">
            <button
              type="button"
              className="button active"
              onClick={handleAddMedia}
              disabled={!formData.url || !formData.caption}
            >
              <IconPlus size={16} />
              Add {activeForm === 'youtube' ? 'YouTube Video' : 
                   activeForm === 'video' ? 'Video' : 
                   'Image'}
            </button>
            <button
              type="button"
              className="button"
              onClick={() => {
                setActiveForm(null);
                setFormData({ url: '', caption: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}