import React from 'react';
import { soundManager } from '../services/soundManager';
import { X, HelpCircle, Navigation, Filter, Radio, Target } from 'lucide-react';

interface HelpScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpScreenModal: React.FC<HelpScreenModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Tactical HUD Overlay Box */}
      <div className="relative w-full max-w-3xl bg-[#0a0d14] border-2 border-[#f8b800] shadow-[0_0_35px_rgba(248,184,0,0.4)] rounded p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f8b800]/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={22} className="text-[#f8b800]" />
            <h2 className="text-xl font-bold tracking-widest text-[#f8b800]">
              SPIDEY TRACKER HUD OPERATOR MANUAL
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playCategory('general');
              onClose();
            }}
            className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#f8b800] text-[#f8b800] hover:text-black border border-[#f8b800] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <X size={14} />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Intro */}
        <p className="text-sm text-gray-300 font-sans mb-6">
          WELCOME! HERE'S A HANDY GUIDE TO HELP YOU NAVIGATE THE TRACKER EXPERIENCE AND REPORTED SPIDER-MAN SIGHTINGS WORLDWIDE.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Navigation */}
          <div className="p-3 bg-[#0e1c3b]/60 border border-[#09a4c7] rounded">
            <div className="flex items-center gap-2 text-[#96e0f7] font-bold text-sm mb-1">
              <Navigation size={16} />
              <span>TOP NAVIGATION</span>
            </div>
            <p className="text-gray-300 font-sans text-xs">
              Access the running <strong>LOG</strong> of chronological sightings, villain dossiers in <strong>WEB WATCH</strong>, movie trailers in <strong>VIDEOS</strong>, and tour stops in <strong>EVENTS</strong>.
            </p>
          </div>

          {/* Map Filters */}
          <div className="p-3 bg-[#0e1c3b]/60 border border-[#09a4c7] rounded">
            <div className="flex items-center gap-2 text-[#00ff50] font-bold text-sm mb-1">
              <Filter size={16} />
              <span>MAP FILTERS</span>
            </div>
            <p className="text-gray-300 font-sans text-xs">
              Toggle pins on/off: <strong>CONFIRMED</strong> (verified sightings), <strong>RUMORED</strong> (unverified bystander reports), and <strong>WATCH PARTY</strong> pins.
            </p>
          </div>

          {/* Tactical Radar */}
          <div className="p-3 bg-[#0e1c3b]/60 border border-[#09a4c7] rounded">
            <div className="flex items-center gap-2 text-[#96e0f7] font-bold text-sm mb-1">
              <Radio size={16} />
              <span>TACTICAL RADAR</span>
            </div>
            <p className="text-gray-300 font-sans text-xs">
              Real-time polar sweep displaying proximity and bearing to all sightings. Use the globe icon to reset to global view, or crosshair icon to center on your neighborhood.
            </p>
          </div>

          {/* Pins & Sightings */}
          <div className="p-3 bg-[#0e1c3b]/60 border border-[#09a4c7] rounded">
            <div className="flex items-center gap-2 text-[#f8b800] font-bold text-sm mb-1">
              <Target size={16} />
              <span>INTERACTIVE SIGHTINGS</span>
            </div>
            <p className="text-gray-300 font-sans text-xs">
              Click any pin on the map to reveal high-resolution photography, video clips, coordinate data, and launch the media viewer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>SPIDEY TRACKER SYSTEM v4.2.0</span>
          <button
            onClick={() => {
              soundManager.playCategory('general');
              onClose();
            }}
            className="px-4 py-1.5 bg-[#f8b800] hover:bg-yellow-400 text-black font-bold rounded transition-colors cursor-pointer"
          >
            DISMISS GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
