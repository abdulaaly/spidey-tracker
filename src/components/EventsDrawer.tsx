import React from 'react';
import { EventItem } from '../types';
import { soundManager } from '../services/soundManager';
import { X, Calendar, MapPin, ExternalLink, Play } from 'lucide-react';

interface EventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onFlyTo: (lat: number, lng: number, title: string) => void;
  onOpenVideo?: (videoUrl: string, title: string) => void;
}

export const EventsDrawer: React.FC<EventsDrawerProps> = ({
  isOpen,
  onClose,
  events,
  onFlyTo,
  onOpenVideo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0a0d14]/95 border-l-2 border-[#09a4c7] backdrop-blur-md shadow-[-5px_0_30px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-[#09a4c7]/40 flex items-center justify-between bg-[#0e1c3b]/60">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#96e0f7]" />
          <h2 className="text-lg font-bold tracking-widest text-[#96e0f7]">
            GLOBAL EVENTS & TOUR
          </h2>
        </div>

        <button
          onClick={() => {
            soundManager.playCategory('events');
            onClose();
          }}
          className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
        >
          <X size={14} />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Subheader */}
      <div className="px-4 py-2 bg-black/40 border-b border-gray-800 text-xs font-mono text-gray-400 flex justify-between items-center">
        <span>ACTIVATIONS: {events.length}</span>
        <span className="text-[#f8b800]">TOUR VERIFIED</span>
      </div>

      {/* Event Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.map((event) => {
          const videoAttachment = event.attachments?.videos?.[0];
          const imageAttachment = event.attachments?.images?.[0];
          const thumb = event.cardThumbImg || imageAttachment || '/images/shareImage/shareImage.jpg';

          return (
            <div
              key={event.id}
              className="p-3.5 bg-[#0e1c3b]/40 border border-[#09a4c7]/30 hover:border-[#96e0f7] rounded transition-all flex flex-col gap-2.5"
            >
              {/* Media Thumbnail */}
              {thumb && (
                <div className="relative w-full h-36 rounded overflow-hidden border border-[#09a4c7]/40 bg-black group">
                  <img
                    src={thumb}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {videoAttachment && (
                    <button
                      onClick={() => onOpenVideo?.(videoAttachment.src, event.name)}
                      className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#09a4c7]/80 flex items-center justify-center shadow-lg">
                        <Play size={20} className="ml-1 text-black" fill="#000" />
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Title & Description */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#00ff50] font-bold font-mono tracking-wider">
                    {event.datetime || 'GLOBAL TOUR'}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    {event.location.lat.toFixed(2)}, {event.location.lng.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {event.name}
                </h3>
                <p className="text-xs text-gray-300 font-sans mt-1 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
                {event.location.address && (
                  <div className="flex items-center gap-1 text-[11px] text-[#96e0f7] font-mono mt-2">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{event.location.address}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
                <button
                  onClick={() => {
                    soundManager.playCategory('events');
                    onFlyTo(event.location.lat, event.location.lng, event.name);
                    onClose();
                  }}
                  className="flex-1 py-1.5 px-3 bg-[#09a4c7] hover:bg-[#96e0f7] text-black font-bold text-xs rounded transition-colors text-center cursor-pointer"
                >
                  VIEW ON MAP
                </button>
                {event.cta && (
                  <a
                    href={event.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] font-bold text-xs rounded transition-colors flex items-center gap-1"
                  >
                    <span>{event.cta.text}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
