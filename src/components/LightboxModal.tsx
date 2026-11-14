import React, { useState } from 'react';
import { VideoItem } from '../types';
import { soundManager } from '../services/soundManager';
import { X, Play, Film, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'youtube' | 'video' | 'image';
  mediaSrc: string;
  title: string;
  videoList?: VideoItem[];
  onSelectVideo?: (v: VideoItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  mediaType,
  mediaSrc,
  title,
  videoList = [],
  onSelectVideo
}) => {
  if (!isOpen) return null;

  // Convert regular YouTube link to embed link
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0a0d14] border-2 border-[#09a4c7] shadow-[0_0_35px_rgba(9,164,199,0.5)] rounded overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#0e1c3b] border-b border-[#09a4c7]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film size={18} className="text-[#96e0f7]" />
            <span className="text-sm font-bold text-[#96e0f7] tracking-wider uppercase truncate">
              {title || 'SPIDEY MEDIA INTEL'}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playCategory('general');
              onClose();
            }}
            className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <X size={14} />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Media Viewport */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {mediaType === 'youtube' && (
            <iframe
              src={getEmbedUrl(mediaSrc)}
              title={title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {mediaType === 'video' && (
            <video
              src={mediaSrc}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}

          {mediaType === 'image' && (
            <img
              src={mediaSrc}
              alt={title}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Video Gallery Carousel (if available) */}
        {videoList.length > 0 && (
          <div className="p-3 bg-[#0e1c3b]/80 border-t border-[#09a4c7]/40">
            <div className="text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
              NOW PLAYING / SELECT TRANSMISSION:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {videoList.map((vid) => {
                const isActive = vid.src === mediaSrc;
                return (
                  <button
                    key={vid.title}
                    onClick={() => {
                      soundManager.playCategory('general');
                      onSelectVideo?.(vid);
                    }}
                    className={`shrink-0 px-3 py-2 text-xs font-bold rounded border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#09a4c7] text-black border-[#96e0f7]'
                        : 'bg-[#0e1c3b] text-[#96e0f7] border-[#09a4c7]/50 hover:border-[#96e0f7]'
                    }`}
                  >
                    <Play size={12} fill={isActive ? '#000' : '#96e0f7'} />
                    <span className="truncate max-w-[180px]">{vid.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
