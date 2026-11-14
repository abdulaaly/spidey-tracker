import React, { useState } from 'react';
import { VillainItem } from '../types';
import { soundManager } from '../services/soundManager';
import { X, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

interface WebWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  villains: VillainItem[];
}

export const WebWatchModal: React.FC<WebWatchModalProps> = ({
  isOpen,
  onClose,
  villains
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || villains.length === 0) return null;

  const current = villains[currentIndex];

  const handlePrev = () => {
    soundManager.playCategory('webwatch');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : villains.length - 1));
  };

  const handleNext = () => {
    soundManager.playCategory('webwatch');
    setCurrentIndex((prev) => (prev < villains.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0a0d14] border-2 border-[#09a4c7] shadow-[0_0_30px_rgba(9,164,199,0.5)] flex flex-col rounded overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#0e1c3b] border-b border-[#09a4c7]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-[#f8b800]" />
            <h2 className="text-lg font-bold tracking-widest text-[#96e0f7]">
              WEB WATCH 1.5
            </h2>
            <span className="text-xs font-mono text-gray-400">
              [{currentIndex + 1} / {villains.length}]
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playCategory('webwatch');
              onClose();
            }}
            className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <X size={14} />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Character Card Body */}
        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
          {/* Portrait with Stepped Border */}
          <div className="relative w-64 h-64 shrink-0 rounded overflow-hidden border-2 border-[#09a4c7] bg-black shadow-[0_0_15px_rgba(9,164,199,0.3)]">
            <img
              src={current.image.replace('./', '/')}
              alt={current.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 text-xs font-mono text-[#00ff50]">
              STATUS: IDENTIFIED
            </div>
          </div>

          {/* Dossier Information */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#f8b800] tracking-widest uppercase mb-1">
                INTEL DOSSIER // CLASSIFIED
              </div>
              <h3 className="text-2xl font-black text-white tracking-wider mb-3">
                {current.name}
              </h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                {current.desc}
              </p>
            </div>

            {/* Tactical Quote */}
            <div className="p-3 bg-[#0e1c3b]/60 border-l-2 border-[#09a4c7] text-xs font-mono text-[#96e0f7]">
              "Honestly, it's hard to keep track of all the bad guys Spidey takes on, so I've started a collection with all the info I've put together from sightings."
              <div className="text-[10px] text-gray-400 mt-1">- Ned Leeds Intel Desk</div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Footer */}
        <div className="p-4 bg-[#0e1c3b]/80 border-t border-[#09a4c7]/40 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="bit-border-3step px-4 py-2 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>PREV</span>
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            {villains.map((v, i) => (
              <button
                key={v.name}
                onClick={() => {
                  soundManager.playCategory('webwatch');
                  setCurrentIndex(i);
                }}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  i === currentIndex
                    ? 'bg-[#96e0f7] shadow-[0_0_8px_#96e0f7] scale-125'
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
                title={v.name}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bit-border-3step px-4 py-2 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>NEXT</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
