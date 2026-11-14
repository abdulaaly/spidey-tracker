import React from 'react';
import { FilterState } from '../types';
import { soundManager } from '../services/soundManager';
import { Volume2, VolumeX, Music, Shield, Award, Crosshair, Users, Globe } from 'lucide-react';
import { SuitId } from '../data/suits';

interface MainUIPanelProps {
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState) => void;
  onOpenActivityLog: () => void;
  onOpenWebWatch: () => void;
  onOpenEvents: () => void;
  onOpenVideos: () => void;
  onOpenHelp: () => void;
  onOpenReport: () => void;
  // Multiverse additions
  onOpenSuitLocker?: () => void;
  onOpenMissions?: () => void;
  onOpenQuiz?: () => void;
  onOpenCensus?: () => void;
  onOpenPartnerLink?: () => void;
  currentSuit?: SuitId;
  level?: number;
  xp?: number;
  activeMissionsCount?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ringtonePlaying?: boolean;
  onToggleRingtone?: () => void;
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
  onOpenSuitLocker,
  onOpenMissions,
  onOpenQuiz,
  onOpenCensus,
  onOpenPartnerLink,
  currentSuit = 'classic',
  level = 1,
  xp = 140,
  activeMissionsCount = 5,
  soundEnabled,
  onToggleSound,
  ringtonePlaying = false,
  onToggleRingtone,
  tickerText
}) => {
  return (
    <div className="absolute top-2 left-0 right-0 z-30 flex flex-col items-center pointer-events-auto px-4 select-none">
      {/* Top Navigation Row */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-2 flex-wrap">
        {/* Left Branding & Spidey Figure */}
        <div className="flex items-center gap-2">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => {
              soundManager.playJingle();
              onOpenHelp();
            }}
            title="Spidey Guide & Help"
          >
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

        {/* Center Nav Buttons: Official Sony + Multiverse Enhancements */}
        <nav className="flex items-center gap-1 md:gap-1.5 flex-wrap justify-center text-xs md:text-sm font-bold tracking-wider">
          {/* OFFICIAL SONY BUTTONS */}
          <button
            onClick={() => {
              soundManager.playCategory('activity');
              onOpenActivityLog();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer flex items-center gap-1.5"
            title="Inspect Worldwide Activity Log"
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
            title="Transmit Eyewitness Sighting"
          >
            REPORT SIGHTINGS
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('webwatch');
              onOpenWebWatch();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
            title="Web Watch 1.5 Rogues Gallery"
          >
            WEB WATCH
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('general');
              onOpenVideos();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
            title="Watch Trailers & Transmissions"
          >
            VIDEOS
          </button>

          <button
            onClick={() => {
              soundManager.playCategory('events');
              onOpenEvents();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#96e0f7] border border-[#09a4c7] transition-all cursor-pointer"
            title="78 Worldwide Tour Stops"
          >
            EVENTS (78)
          </button>

          <button
            onClick={() => {
              soundManager.playJingle();
              onOpenHelp();
            }}
            className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#f8b800] border border-[#f8b800] transition-all cursor-pointer"
            title="System Guide"
          >
            HELP
          </button>

          {/* MULTIVERSE ENHANCEMENT BUTTONS */}
          {onOpenSuitLocker && (
            <button
              onClick={() => {
                soundManager.playCategory('general');
                onOpenSuitLocker();
              }}
              className="bit-border-3step px-2.5 py-1.5 bg-gradient-to-r from-[#e53935]/30 to-[#0e1c3b] hover:bg-[#e53935]/40 text-[#ff8080] border border-[#e53935] transition-all cursor-pointer flex items-center gap-1"
              title="Open Nanotech Suit Arsenal Locker"
            >
              <span>🕷️</span>
              <span className="hidden md:inline">SUIT:</span> {currentSuit.toUpperCase()}
            </button>
          )}

          {onOpenMissions && (
            <button
              onClick={() => {
                soundManager.playCategory('general');
                onOpenMissions();
              }}
              className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#00ff50] border border-[#00ff50]/60 transition-all cursor-pointer flex items-center gap-1"
              title="Daily Field Bounties"
            >
              <Crosshair size={13} />
              <span className="hidden md:inline">BOUNTIES</span>
              <span className="text-[10px] px-1 bg-[#00ff50]/20 rounded font-mono">
                {activeMissionsCount}
              </span>
            </button>
          )}

          {onOpenQuiz && (
            <button
              onClick={() => {
                soundManager.playCategory('general');
                onOpenQuiz();
              }}
              className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#ffcc22] border border-[#ffcc22]/60 transition-all cursor-pointer flex items-center gap-1"
              title="Multiverse Trivia Quiz"
            >
              <Award size={13} />
              <span className="hidden md:inline">TRIVIA</span>
              <span className="text-[9px] text-[#00ff50]">+XP</span>
            </button>
          )}

          {onOpenCensus && (
            <button
              onClick={() => {
                soundManager.playCategory('general');
                onOpenCensus();
              }}
              className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#5ce1e6] border border-[#5ce1e6]/60 transition-all cursor-pointer flex items-center gap-1"
              title="Worldwide Spider Census (19 Heroes)"
            >
              <Globe size={13} />
              <span className="hidden lg:inline">CENSUS</span>
            </button>
          )}

          {onOpenPartnerLink && (
            <button
              onClick={() => {
                soundManager.playCategory('general');
                onOpenPartnerLink();
              }}
              className="bit-border-3step px-2.5 py-1.5 bg-[#0e1c3b] hover:bg-[#152e63] text-[#e0a8ff] border border-[#e0a8ff]/60 transition-all cursor-pointer flex items-center gap-1"
              title="Encrypted Partner Squad Link"
            >
              <Users size={13} />
              <span className="hidden lg:inline">COMM</span>
            </button>
          )}
        </nav>

        {/* Right Controls: Level Badge & Sound Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Level Progress Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#040c18] border border-[#09a4c7]/50 rounded text-[11px] font-mono text-[#96e0f7]">
            <Shield size={12} className="text-[#00ff50]" />
            <span className="font-bold text-white">LVL {level}</span>
            <span className="text-gray-400">·</span>
            <span className="text-[#00ff50]">{xp} XP</span>
          </div>

          {/* 60s Theme Ringtone Toggle */}
          {onToggleRingtone && (
            <button
              onClick={onToggleRingtone}
              aria-label="Toggle 60s Theme Ringtone"
              className={`bit-border-3step px-2 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                ringtonePlaying
                  ? 'bg-[#ffcc22] text-black border border-white animate-pulse'
                  : 'bg-[#0e1c3b] text-[#ffcc22] border border-[#ffcc22]/40 hover:bg-[#152e63]'
              }`}
              title="1960s Spider-Man Cartoon Ringtone"
            >
              <Music size={14} />
              <span className="hidden sm:inline">60s THEME</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute Sound" : "Unmute Sound"}
            className={`bit-border-3step px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              soundEnabled 
                ? 'bg-[#09a4c7] text-black border border-[#96e0f7]' 
                : 'bg-black/60 text-gray-400 border border-gray-600 hover:text-white'
            }`}
            title="Toggle Tactical Audio Effects"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Authentic Sony Status Ticker */}
      <div className="w-full max-w-4xl mt-1.5 flex items-center justify-center">
        <div className="relative w-full grid grid-cols-[9px_1fr_9px] h-[38px] items-center">
          <div 
            className="h-[38px] bg-no-repeat bg-contain" 
            style={{ backgroundImage: "url('/images/ui/ticker/ticker1-1.png')" }} 
          />
          <div 
            className="h-[38px] flex items-center overflow-hidden px-3 bg-repeat-x"
            style={{ backgroundImage: "url('/images/ui/ticker/ticker1-2.png')", backgroundSize: '72px 38px' }}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-[#96e0f7] font-mono text-xs sm:text-sm tracking-wider flex items-center">
              <span className="inline-block mr-3 text-[#f8b800] font-bold">● LIVE HUD:</span>
              <div className="animate-marquee inline-block">
                <span>{tickerText}</span>
              </div>
            </div>
          </div>
          <div 
            className="h-[38px] bg-no-repeat bg-contain" 
            style={{ backgroundImage: "url('/images/ui/ticker/ticker1-3.png')" }} 
          />
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-center text-[10px] sm:text-xs">
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
          title="Toggle Confirmed Movie Sightings"
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
          title="Toggle Rumored Eyewitness Reports"
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
          title="Toggle Worldwide Watch Parties"
        >
          <span className="w-2 h-2 rounded-full bg-[#96e0f7] inline-block shadow-[0_0_5px_#96e0f7]"></span>
          WATCH PARTY ({filters.watchParty ? 'ON' : 'OFF'})
        </button>

        {/* Global Tour Events Filter */}
        <button
          onClick={() => {
            soundManager.playCategory('activity');
            onToggleFilter('events');
          }}
          className={`bit-border-3step px-2.5 py-1 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            filters.events 
              ? 'bg-[#f8b800]/20 text-[#f8b800] border border-[#f8b800]' 
              : 'bg-black/50 text-gray-500 border border-gray-700 opacity-60'
          }`}
          title="Toggle 78 Worldwide Tour Stops"
        >
          <span className="w-2 h-2 rounded-full bg-[#f8b800] inline-block shadow-[0_0_5px_#f8b800]"></span>
          TOUR ({filters.events ? 'ON' : 'OFF'})
        </button>
      </div>
    </div>
  );
};
