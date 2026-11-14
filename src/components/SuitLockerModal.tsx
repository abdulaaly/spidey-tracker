'use client';

import React, { useState } from 'react';
import { SUITS, SuitDef, SuitId } from '../data/suits';
import { soundManager } from '../services/soundManager';

interface Props {
  isOpen: boolean;
  currentSuit: SuitId;
  playerLevel: number;
  onClose: () => void;
  onEquipSuit: (suitId: SuitId) => void;
}

export const SuitLockerModal: React.FC<Props> = ({
  isOpen,
  currentSuit,
  playerLevel,
  onClose,
  onEquipSuit
}) => {
  const [selectedSuit, setSelectedSuit] = useState<SuitDef>(
    SUITS.find((s) => s.id === currentSuit) || SUITS[0]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="pixel-panel w-full max-w-3xl bg-[#071426] border-4 border-black p-4 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕷️</span>
            <div>
              <h2 className="font-pixel text-sm text-[#ffe066] drop-shadow-[1px_1px_0_#000]">
                SUIT ARSENAL & LOCKER
              </h2>
              <p className="font-mono text-xs text-[#8fb8c4]">
                UNLOCK AND EQUIP ADVANCED NANOTECH & MULTIVERSE WEAVES
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn text-xs px-2 py-1 !bg-[#e53935] !text-white"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Main Content: Grid of Suits + Preview Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Suit List (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 gap-2">
            {SUITS.map((suit) => {
              const isEquipped = currentSuit === suit.id;
              const isSelected = selectedSuit.id === suit.id;
              const isLocked = playerLevel < suit.requiredLevel;

              return (
                <div
                  key={suit.id}
                  onClick={() => {
                    setSelectedSuit(suit);
                    soundManager.playBeep(800, 0.04);
                  }}
                  className={`p-2 border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#ffe066] bg-[#0c2238] shadow-[2px_2px_0_#000]'
                      : 'border-black bg-[#06101e] hover:border-[#5ce1e6]'
                  } ${isEquipped ? 'ring-2 ring-[#6fc041]' : ''}`}
                >
                  <div className="w-16 h-20 flex items-center justify-center relative">
                    <img
                      src={suit.asset}
                      alt={suit.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    {isLocked && (
                      <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-sm font-pixel text-red-500">
                        🔒 LVL {suit.requiredLevel}
                      </span>
                    )}
                  </div>
                  <span className="font-pixel text-[8px] text-center text-[#e8f4f8] truncate w-full">
                    {suit.name}
                  </span>
                  <span
                    className={`text-[7px] font-pixel px-1 py-0.5 border border-black ${
                      suit.rarity === 'LEGENDARY'
                        ? 'bg-[#ffcc22] text-black'
                        : suit.rarity === 'EPIC'
                        ? 'bg-[#aa00ff] text-white'
                        : suit.rarity === 'RARE'
                        ? 'bg-[#00bcd4] text-black'
                        : 'bg-[#1a3a5c] text-white'
                    }`}
                  >
                    {suit.rarity}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Suit Detailed Dossier (5 cols) */}
          <div className="md:col-span-5 pixel-inset p-3 bg-[#0a1a2e] flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="w-full h-36 bg-[#040c18] border-2 border-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 crt-overlay opacity-60" />
                <img
                  src={selectedSuit.asset}
                  alt={selectedSuit.name}
                  className="max-h-28 object-contain z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <div>
                <h3 className="font-pixel text-xs text-[#ffe066]">{selectedSuit.name}</h3>
                <p className="font-mono text-[10px] text-[#5ce1e6]">{selectedSuit.codename}</p>
                <p className="font-mono text-xs text-[#8fb8c4] mt-1 leading-snug">
                  {selectedSuit.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-1.5 mt-2 bg-[#06101e] p-2 border border-black">
                <span className="font-pixel text-[8px] text-[#5ce1e6]">SUIT PERFORMANCE METRICS</span>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>DEFENSE</span>
                  <div className="w-24 bg-black h-2 rounded overflow-hidden">
                    <div
                      className="bg-[#e53935] h-full"
                      style={{ width: `${selectedSuit.stats.defense}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{selectedSuit.stats.defense}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>AGILITY</span>
                  <div className="w-24 bg-black h-2 rounded overflow-hidden">
                    <div
                      className="bg-[#6fc041] h-full"
                      style={{ width: `${selectedSuit.stats.agility}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{selectedSuit.stats.agility}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>TECH WEAVE</span>
                  <div className="w-24 bg-black h-2 rounded overflow-hidden">
                    <div
                      className="bg-[#00bcd4] h-full"
                      style={{ width: `${selectedSuit.stats.tech}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{selectedSuit.stats.tech}%</span>
                </div>
              </div>
            </div>

            {/* Equip Button */}
            <div>
              {currentSuit === selectedSuit.id ? (
                <div className="w-full text-center py-2 bg-[#0c2238] border-2 border-[#6fc041] text-[#6fc041] font-pixel text-[9px]">
                  ✓ CURRENTLY EQUIPPED
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onEquipSuit(selectedSuit.id);
                    soundManager.playFanfare();
                  }}
                  className="pixel-btn w-full !bg-[#ffe066] !text-black text-center text-xs"
                >
                  EQUIP SUIT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
