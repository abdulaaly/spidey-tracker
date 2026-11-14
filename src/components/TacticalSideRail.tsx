'use client';

import React from 'react';
import { soundManager } from '../services/soundManager';
import { SuitId } from '../data/suits';

interface Props {
  currentSuit: SuitId;
  spidersCount: number;
  unclaimedMissions: number;
  onOpenSuitLocker: () => void;
  onOpenMissions: () => void;
  onOpenQuiz: () => void;
  onOpenCensus: () => void;
  onCycleSpiders: () => void;
  onOpenPartnerLink: () => void;
}

export const TacticalSideRail: React.FC<Props> = ({
  currentSuit,
  spidersCount,
  unclaimedMissions,
  onOpenSuitLocker,
  onOpenMissions,
  onOpenQuiz,
  onOpenCensus,
  onCycleSpiders,
  onOpenPartnerLink
}) => {
  return (
    <aside className="absolute left-3 top-16 z-20 flex flex-col gap-3 pointer-events-auto">
      {/* 1. Suit Locker Orb */}
      <button
        type="button"
        onClick={() => {
          soundManager.playWhoosh();
          onOpenSuitLocker();
        }}
        className="side-control group bg-[#0a1a2e]"
        style={{ '--i': 0 } as React.CSSProperties}
        title="SUIT LOCKER & ARSENAL"
      >
        <span className="side-control__face">
          <span className="text-base select-none">🕷️</span>
        </span>
        <span className="side-control__tip">SUIT: {currentSuit.toUpperCase()}</span>
      </button>

      {/* 2. Missions & Bounties Orb */}
      <button
        type="button"
        onClick={() => {
          soundManager.playWhoosh();
          onOpenMissions();
        }}
        className="side-control group bg-[#0a1a2e]"
        style={{ '--i': 1 } as React.CSSProperties}
        title="SPIDER MISSIONS & BOUNTIES"
      >
        <span className="side-control__face">
          <span className="text-base select-none">🎯</span>
        </span>
        {unclaimedMissions > 0 && <span className="side-control__pulse" />}
        <span className="side-control__tip">MISSIONS ({unclaimedMissions} ACTIVE)</span>
      </button>

      {/* 3. Spider Quiz Orb */}
      <button
        type="button"
        onClick={() => {
          soundManager.playWhoosh();
          onOpenQuiz();
        }}
        className="side-control group bg-[#0a1a2e]"
        style={{ '--i': 2 } as React.CSSProperties}
        title="MULTIVERSE TRIVIA"
      >
        <span className="side-control__face">
          <span className="text-base select-none">🧠</span>
        </span>
        <span className="side-control__tip">SPIDEY TRIVIA (+XP)</span>
      </button>

      {/* 4. Spider Census & Cycle Orb */}
      <button
        type="button"
        onClick={() => {
          soundManager.playRadarPing();
          onCycleSpiders();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onOpenCensus();
        }}
        className="side-control group bg-[#0a1a2e]"
        style={{ '--i': 3 } as React.CSSProperties}
        title="CYCLE 19 SPIDERS AROUND THE GLOBE"
      >
        <span className="side-control__face">
          <span className="text-base select-none">🌐</span>
        </span>
        <span className="side-control__tip">CYCLE 19 SPIDERS</span>
      </button>

      {/* 5. Secret Link Orb */}
      <button
        type="button"
        onClick={() => {
          soundManager.playSignal();
          onOpenPartnerLink();
        }}
        className="side-control group bg-[#0a1a2e]"
        style={{ '--i': 4 } as React.CSSProperties}
        title="PARTNER LINK / SECRET SPIDER CODE"
      >
        <span className="side-control__face">
          <span className="text-base select-none">🤝</span>
        </span>
        <span className="side-control__tip">PARTNER LINK</span>
      </button>
    </aside>
  );
};
