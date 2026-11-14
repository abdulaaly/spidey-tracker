'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '../services/soundManager';
import { PixelSpideySprite } from './PixelSpideySprite';
import { SuitId } from '../data/suits';

export type TrackerViewMode = 'MOVIE' | 'GADGET' | 'UNIFIED';

interface Props {
  tickerText: string;
  viewMode: TrackerViewMode;
  onSetViewMode: (mode: TrackerViewMode) => void;
  level: number;
  xp: number;
  currentSuit: SuitId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ringtonePlaying: boolean;
  onToggleRingtone: () => void;
  onOpenSuitLocker: () => void;
  onOpenWebWatch: () => void;
  onOpenEvents: () => void;
  onOpenLog: () => void;
  onOpenReport: () => void;
  onOpenHelp: () => void;
}

export const EnhancedHUDHeader: React.FC<Props> = ({
  tickerText,
  viewMode,
  onSetViewMode,
  level,
  xp,
  currentSuit,
  soundEnabled,
  onToggleSound,
  ringtonePlaying,
  onToggleRingtone,
  onOpenSuitLocker,
  onOpenWebWatch,
  onOpenEvents,
  onOpenLog,
  onOpenReport,
  onOpenHelp
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(' ')[0] + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#071426] border-b-2 border-black flex flex-col z-20 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
      {/* 1. Top Cyber Status Micro-Strip */}
      <div className="w-full bg-[#030914] px-3 py-1 flex items-center justify-between text-[8px] sm:text-[9px] font-pixel text-[#5ce1e6] border-b border-[#0a203a]">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fc041] animate-ping" />
            <span className="text-[#6fc041]">SPIDER-SENSE: ACTIVE</span>
          </span>
          <span className="text-[#8fb8c4] hidden md:inline">
            LVL {level} · {xp} XP · SUIT: {currentSuit.toUpperCase()}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1">
          <span className="text-[#8fb8c4] hidden sm:inline mr-1">FEED:</span>
          <button
            type="button"
            onClick={() => {
              soundManager.playBeep(700, 0.05);
              onSetViewMode('MOVIE');
            }}
            className={`px-1.5 py-0.5 text-[8px] border transition-all ${
              viewMode === 'MOVIE'
                ? 'bg-[#e53935] text-white border-black shadow-[1px_1px_0_#000]'
                : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
            }`}
          >
            MOVIE INTEL
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playBeep(700, 0.05);
              onSetViewMode('GADGET');
            }}
            className={`px-1.5 py-0.5 text-[8px] border transition-all ${
              viewMode === 'GADGET'
                ? 'bg-[#3a8fd4] text-white border-black shadow-[1px_1px_0_#000]'
                : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
            }`}
          >
            SPIDER-NET
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playBeep(700, 0.05);
              onSetViewMode('UNIFIED');
            }}
            className={`px-1.5 py-0.5 text-[8px] border transition-all ${
              viewMode === 'UNIFIED'
                ? 'bg-[#ffcc22] text-black border-black shadow-[1px_1px_0_#000]'
                : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
            }`}
          >
            UNIFIED ALL
          </button>
        </div>

        {/* Clock & Ringtone Quick Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleRingtone}
            className={`px-1.5 py-0.5 text-[7px] border transition-all ${
              ringtonePlaying
                ? 'bg-[#ffcc22] text-black border-black animate-pulse'
                : 'bg-[#0c2238] text-[#8fb8c4] border-[#1a3a5c]'
            }`}
            title="Play iconic 1960s Spider-Man Theme Ringtone"
          >
            🎵 {ringtonePlaying ? 'STOP THEME' : '60s THEME'}
          </button>
          <span className="font-mono text-[#8fb8c4] hidden sm:inline">{timeStr}</span>
        </div>
      </div>

      {/* 2. Main HUD Bar */}
      <div className="px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Suit Avatar Sprite & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={onOpenSuitLocker}
            className="cursor-pointer group flex items-center gap-1.5 p-1 bg-[#0a1a2e] border-2 border-black shadow-[2px_2px_0_#000] hover:scale-105 transition-transform"
            title="Open Suit Arsenal Locker"
          >
            <PixelSpideySprite suitId={currentSuit} size={42} />
            <div className="hidden lg:flex flex-col">
              <span className="font-pixel text-[8px] text-[#ffe066]">{currentSuit.toUpperCase()}</span>
              <span className="font-mono text-[10px] text-[#5ce1e6]">TAP TO EQUIP</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-xs sm:text-sm font-bold text-[#ffcc22] tracking-wider drop-shadow-[2px_2px_0_#000]">
                SPIDEY TRACKER
              </span>
              <span className="text-[7px] font-pixel px-1 py-0.5 bg-[#e53935] text-white border border-black hidden sm:inline">
                BRAND NEW DAY
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-mono text-[#8fb8c4] tracking-tight">
              WORLDWIDE RECON INTEL // PRIVATE CYBER-NETWORK
            </span>
          </div>
        </div>

        {/* Center: Live Tactical Marquee Ticker */}
        <div className="flex-1 mx-2 sm:mx-4 max-w-2xl hidden md:flex items-center bg-[#020810] border-2 border-black shadow-[inset_2px_2px_0_rgba(0,0,0,0.8)] px-3 py-1 overflow-hidden h-8">
          <span className="font-pixel text-[8px] text-[#e53935] mr-2 shrink-0 animate-pulse">
            LIVE:
          </span>
          <div className="w-full overflow-hidden whitespace-nowrap">
            <span className="inline-block text-[#5ce1e6] font-mono text-xs font-semibold animate-marquee">
              {tickerText}
            </span>
          </div>
        </div>

        {/* Right: Tactical Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenWebWatch}
            className="pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 bg-gradient-to-b from-[#2468a8] to-[#0a1a2e] text-white"
            title="Inspect 6 Villain Dossiers"
          >
            DOSSIERS
          </button>
          <button
            type="button"
            onClick={onOpenEvents}
            className="pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 bg-gradient-to-b from-[#2468a8] to-[#0a1a2e] text-white"
            title="Inspect 78 Global Tour Stops"
          >
            TOUR (78)
          </button>
          <button
            type="button"
            onClick={onOpenLog}
            className="pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 bg-gradient-to-b from-[#2468a8] to-[#0a1a2e] text-white"
            title="Inspect 71 Sightings Feed"
          >
            SIGHTINGS (71)
          </button>
          <button
            type="button"
            onClick={onOpenReport}
            className="pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 !bg-[#e53935] !text-white"
            title="Transmit New Sighting"
          >
            + TRANSMIT
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className={`pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 ${
              soundEnabled ? '!bg-[#6fc041] !text-black' : '!bg-[#0c2238] !text-[#8fb8c4]'
            }`}
            title="Toggle Web Audio SFX"
          >
            SFX {soundEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={onOpenHelp}
            className="pixel-btn text-[8px] sm:text-[9px] py-1.5 px-2 !bg-[#ffcc22] !text-black"
            title="Tactical Operator Manual"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
};
