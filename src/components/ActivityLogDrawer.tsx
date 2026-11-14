import React from 'react';
import { SpideyPin, FilterState } from '../types';
import { soundManager } from '../services/soundManager';
import { X, Info } from 'lucide-react';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pins: SpideyPin[];
  filters?: FilterState;
  onSelectPin: (pin: SpideyPin) => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  pins,
  filters = { confirmed: true, rumored: true, watchParty: true, events: true },
  onSelectPin
}) => {
  const [showInfo, setShowInfo] = React.useState(false);

  if (!isOpen) return null;

  // Filter and sort sightings chronologically
  const filteredPins = pins.filter((p) => {
    const type = (p.pinTypeOverride || p.pinType || p.type || '').toLowerCase();
    if (type === 'confirmed' && !filters.confirmed) return false;
    if (type === 'rumored' && !filters.rumored) return false;
    if (type.includes('watch') && !filters.watchParty) return false;
    return true;
  });

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-[#0a0d14]/95 border-r-2 border-[#09a4c7] backdrop-blur-md shadow-[5px_0_30px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-[#09a4c7]/40 flex items-center justify-between bg-[#0e1c3b]/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#96e0f7] rounded-full animate-pulse shadow-[0_0_8px_#96e0f7]"></span>
          <h2 className="text-lg font-bold tracking-widest text-[#96e0f7]">
            ACTIVITY LOG
          </h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            title="Activity Log Info"
            className="text-gray-400 hover:text-[#96e0f7] transition-colors p-1"
          >
            <Info size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            soundManager.playCategory('activity');
            onClose();
          }}
          className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
        >
          <X size={14} />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Info Explainer Panel */}
      {showInfo && (
        <div className="p-3 bg-[#0e1c3b] border-b border-[#09a4c7] text-xs text-[#96e0f7] font-mono leading-relaxed">
          <p className="font-bold mb-1 text-white">ACTIVITY LOG INTEL:</p>
          "Check this out - I built a running list of all the Spidey sightings and events. An easy way to make sure you're seeing all the latest updates."
          <div className="text-[10px] text-gray-400 mt-1">- Ned Leeds, CEO & Founder</div>
        </div>
      )}

      {/* Subheader / Count */}
      <div className="px-4 py-2 bg-black/40 border-b border-gray-800 text-xs font-mono text-gray-400 flex justify-between items-center">
        <span>RECORDED SIGHTINGS: {filteredPins.length}</span>
        <span className="text-[#00ff50]">LIVE SYNC [OK]</span>
      </div>

      {/* Sightings List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredPins.map((pin) => {
          const isWatchParty = pin.pinType === 'watchParty';
          const isConfirmed = pin.pinType === 'confirmed';
          const isRumored = pin.pinType === 'rumored';
          const isTrailer = pin.pinType === 'trailer';

          const badgeColor = isWatchParty
            ? 'bg-[#00ff50]/20 text-[#00ff50] border-[#00ff50]'
            : isConfirmed
            ? 'bg-[#00ff50]/20 text-[#00ff50] border-[#00ff50]'
            : isRumored
            ? 'bg-[#ff4040]/20 text-[#ff4040] border-[#ff4040]'
            : 'bg-[#96e0f7]/20 text-[#96e0f7] border-[#96e0f7]';

          const badgeText = isWatchParty
            ? 'WATCH PARTY'
            : isConfirmed
            ? 'CONFIRMED'
            : isRumored
            ? 'RUMORED'
            : isTrailer
            ? 'TRAILER'
            : 'EVENT';

          const thumb = pin.cardThumbImg || pin.imageSrc || '/images/shareImage/shareImage.jpg';

          return (
            <div
              key={pin.id}
              onClick={() => {
                soundManager.playCategory('activity');
                onSelectPin(pin);
              }}
              className="p-2.5 bg-[#0e1c3b]/40 hover:bg-[#0e1c3b] border border-[#09a4c7]/30 hover:border-[#96e0f7] rounded transition-all cursor-pointer group flex gap-3 items-center"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 shrink-0 rounded overflow-hidden border border-[#09a4c7]/40 bg-black">
                <img
                  src={thumb}
                  alt={pin.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded border ${badgeColor}`}>
                    {badgeText}
                  </span>
                  {pin.createdAt && (
                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(pin.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }).toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white group-hover:text-[#96e0f7] truncate">
                  {pin.title}
                </h3>

                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {pin.watchPartyCopy || `Coordinates: ${pin.lat?.toFixed(2) || '40.71'}, ${pin.lng?.toFixed(2) || '-74.00'}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
