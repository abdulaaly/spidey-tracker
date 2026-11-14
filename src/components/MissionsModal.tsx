'use client';

import React from 'react';
import { MissionItem } from '../data/missions';
import { soundManager } from '../services/soundManager';

interface Props {
  isOpen: boolean;
  missions: MissionItem[];
  onClose: () => void;
  onClaimBounty: (missionId: string, xpReward: number) => void;
}

export const MissionsModal: React.FC<Props> = ({
  isOpen,
  missions,
  onClose,
  onClaimBounty
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="pixel-panel w-full max-w-xl bg-[#071426] border-4 border-black p-4 flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[#ffe066]">
                ACTIVE MISSIONS & BOUNTIES
              </h2>
              <span className="font-mono text-[10px] text-[#5ce1e6]">
                COMPLETE SPATIAL RECON OBJECTIVES FOR BONUS XP
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn text-xs px-2 py-1 !bg-[#e53935] !text-white"
          >
            ✕
          </button>
        </div>

        {/* Missions List */}
        <div className="flex flex-col gap-3">
          {missions.map((mission) => {
            const isReadyToClaim = mission.current >= mission.target && !mission.completed;
            const progressPercent = Math.min(100, Math.round((mission.current / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className="pixel-inset p-3 bg-[#0a1a2e] flex flex-col gap-2 border border-black"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[7px] font-pixel px-1.5 py-0.5 border border-black ${
                        mission.category === 'SPECIAL OPS'
                          ? 'bg-[#e53935] text-white'
                          : mission.category === 'TRIVIA'
                          ? 'bg-[#aa00ff] text-white'
                          : 'bg-[#1a3a5c] text-[#5ce1e6]'
                      }`}
                    >
                      {mission.category}
                    </span>
                    <h3 className="font-pixel text-[9px] text-[#e8f4f8]">{mission.title}</h3>
                  </div>
                  <span className="font-pixel text-[8px] text-[#ffe066]">
                    +{mission.xpReward} XP
                  </span>
                </div>

                <p className="font-mono text-xs text-[#8fb8c4] leading-relaxed">
                  {mission.description}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                  <div className="flex-1 bg-black h-2.5 border border-[#1a3a5c] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        mission.completed ? 'bg-[#6fc041]' : 'bg-[#3a8fd4]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-[#5ce1e6]">
                    {mission.current} / {mission.target}
                  </span>
                </div>

                {/* Action button */}
                <div className="self-end">
                  {mission.completed ? (
                    <span className="text-[#6fc041] font-pixel text-[8px]">
                      ✓ BOUNTY CLAIMED
                    </span>
                  ) : isReadyToClaim ? (
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playFanfare();
                        onClaimBounty(mission.id, mission.xpReward);
                      }}
                      className="pixel-btn text-[9px] py-1 px-3 !bg-[#6fc041] !text-black animate-pulse"
                    >
                      CLAIM BOUNTY (+{mission.xpReward} XP)
                    </button>
                  ) : (
                    <span className="text-[#8fb8c4] font-mono text-xs">
                      IN PROGRESS ({progressPercent}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
