import React from 'react';
import { FilterState } from '../types';
import { soundManager } from '../services/soundManager';
import { Volume2, VolumeX } from 'lucide-react';

interface MainUIPanelProps {
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState) => void;
  onOpenActivityLog: () => void;
  onOpenWebWatch: () => void;
  onOpenEvents: () => void;
  onOpenVideos: () => void;
  onOpenHelp: () => void;
  onOpenReport: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  tickerText: string;
}

export const MainUIPanel: React.FC<MainUIPanelProps> = ({
  filters,
  onToggleFilter,
  onOpenActivityLog,
  onOpenWebWatch,
  onOpenEvents,
  onOpenVideos,
  onOpenHelp,
  onOpenReport,
  soundEnabled,
  onToggleSound,
  tickerText
}) => {
  return (
    <div className="absolute top-2 left-0 right-0 z-30 flex flex-col items-center pointer-events-auto px-4 select-none">
      {/* Top Navigation Row */}
      <div className="w-full max-w-6xl flex items-center justify-between gap-2 flex-wrap">
        {/* Left Branding & Spidey Figure */}
        <div className="flex items-center gap-2">
          <div className="relative group cursor-pointer" onClick={onOpenHelp}>
            <img 
              src="/images/SpiderMan_HeadTurn.png" 
              alt="Spidey Figure" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_0_8px_rgba(150,224,247,0.5)] transition-transform group-hover:scale-110" 
            />
          </div>
          <img 
            src="/images/tracker_logo3.png" 
            alt="Spidey Tracker Logo" 
            className="h-7 md:h-9 object-contain" 
          />
        </div>

        {/* Center Nav Buttons */}
        <nav className="flex items-center gap-1 md:gap-2 flex-wrap justify-center text-xs md:text-sm font-bold tracking-wider">
          <button
            onClick={() => {
              soundManager.playCategory('activity');
              onOpenActivityLog();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 bg-[#96e0f7] rounded-full inline-block animate-ping"></span>
            LOG
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('general');
              onOpenReport();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer hidden sm:inline-flex"
          >
            REPORT SIGHTINGS
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('webwatch');
              onOpenWebWatch();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
          >
            WEB WATCH
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('general');
              onOpenVideos();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
          >
            VIDEOS
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('events');
              onOpenEvents();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
          >
            EVENTS
          </button>

          <button
            onClick={() => {
              soundManager.playJingle();
              onOpenHelp();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#f8b800] border border-[#f8b800] transition-all cursor-pointer"
          >
            HELP
          </button>
        </nav>

        {/* Sound Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute Sound" : "Unmute Sound"}
            className={`bit-border-3step px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              soundEnabled 
                ? 'bg-[#09a4c7] text-black border border-[#96e0f7]' 
                : 'bg-black/60 text-gray-400 border border-gray-600 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Status Ticker */}
      <div className="w-full max-w-2xl mt-2 flex items-center justify-center">
        <div className="relative w-full grid grid-cols-[9px_1fr_9px] h-[38px] items-center">
          <div className="h-[38px] bg-no-repeat bg-contain" style={{ backgroundImage: "url('/images/ui/ticker/ticker1-1.png')" }} />
          <div 
            className="h-[38px] flex items-center overflow-hidden px-3 bg-repeat-x"
            style={{ backgroundImage: "url('/images/ui/ticker/ticker1-2.png')", backgroundSize: '72px 38px' }}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-[#96e0f7] font-mono text-sm tracking-wider flex items-center">
              <span className="inline-block mr-3 text-[#f8b800] font-bold">● LIVE HUD:</span>
              <div className="animate-marquee inline-block">
                <span>{tickerText}</span>
              </div>
            </div>
          </div>
          <div className="h-[38px] bg-no-repeat bg-contain" style={{ backgroundImage: "url('/images/ui/ticker/ticker1-3.png')" }} />
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="mt-2 flex items-center gap-1.5 sm:gap-3 flex-wrap justify-center text-[11px] sm:text-xs">
        <span className="text-gray-400 font-mono tracking-widest hidden sm:inline">FILTERS:</span>
        
        {/* Confirmed Filter */}
        <button
          onClick={() => {
            soundManager.playCategory('activity');
            onToggleFilter('confirmed');
          }}
          className={`bit-border-3step px-2.5 py-1 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            filters.confirmed 
              ? 'bg-[#00ff50]/20 text-[#00ff50] border border-[#00ff50]' 
              : 'bg-black/50 text-gray-500 border border-gray-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#00ff50] inline-block shadow-[0_0_5px_#00ff50]"></span>
          CONFIRMED ({filters.confirmed ? 'ON' : 'OFF'})
        </button>

        {/* Rumored Filter */}
        <button
          onClick={() => {
            soundManager.playCategory('activity');
            onToggleFilter('rumored');
          }}
          className={`bit-border-3step px-2.5 py-1 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            filters.rumored 
              ? 'bg-[#ff4040]/20 text-[#ff4040] border border-[#ff4040]' 
              : 'bg-black/50 text-gray-500 border border-gray-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#ff4040] inline-block shadow-[0_0_5px_#ff4040]"></span>
          RUMORED ({filters.rumored ? 'ON' : 'OFF'})
        </button>

        {/* Watch Party Filter */}
        <button
          onClick={() => {
            soundManager.playCategory('activity');
            onToggleFilter('watchParty');
          }}
          className={`bit-border-3step px-2.5 py-1 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            filters.watchParty 
              ? 'bg-[#96e0f7]/20 text-[#96e0f7] border border-[#96e0f7]' 
              : 'bg-black/50 text-gray-500 border border-gray-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#96e0f7] inline-block shadow-[0_0_5px_#96e0f7]"></span>
          WATCH PARTY ({filters.watchParty ? 'ON' : 'OFF'})
        </button>
      </div>
    </div>
  );
};
