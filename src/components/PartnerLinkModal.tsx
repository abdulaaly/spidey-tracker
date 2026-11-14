'use client';

import React, { useState } from 'react';
import { soundManager } from '../services/soundManager';
import { isValidSpiderCode } from '../utils/spideyLogic';

interface Props {
  isOpen: boolean;
  myCode: string;
  onClose: () => void;
  onLinkSuccess: (partnerCode: string) => void;
}

export const PartnerLinkModal: React.FC<Props> = ({
  isOpen,
  myCode,
  onClose,
  onLinkSuccess
}) => {
  const [inputCode, setInputCode] = useState('');
  const [linkedPartner, setLinkedPartner] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isNudging, setIsNudging] = useState(false);

  if (!isOpen) return null;

  const handleLink = () => {
    setErrorMsg('');
    const code = inputCode.trim().toUpperCase();
    if (!isValidSpiderCode(code)) {
      setErrorMsg('INVALID FORMAT. EXPECTED FORMAT: SPDY-XXXX');
      soundManager.playBeep(300, 0.15, 'sawtooth');
      return;
    }
    if (code === myCode) {
      setErrorMsg('CANNOT LINK TO YOUR OWN SPIDER CODE.');
      soundManager.playBeep(300, 0.15, 'sawtooth');
      return;
    }

    setLinkedPartner(code);
    soundManager.playFanfare();
    onLinkSuccess(code);
  };

  const handleSendNudge = () => {
    setIsNudging(true);
    soundManager.playRingtone();
    setTimeout(() => {
      setIsNudging(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="pixel-panel w-full max-w-md bg-[#071426] border-4 border-black p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[#ffe066]">
                PARTNER & FRIEND LINK
              </h2>
              <span className="font-mono text-[10px] text-[#5ce1e6]">
                ENCRYPTED SPIDER-NETWORK HANDSHAKE
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

        {/* My Code */}
        <div className="pixel-inset p-3 bg-[#0a1a2e] flex flex-col items-center gap-1 border border-black text-center">
          <span className="font-pixel text-[8px] text-[#8fb8c4]">YOUR SPIDER LINK CODE:</span>
          <span className="font-pixel text-lg text-[#ffe066] tracking-widest my-1">
            {myCode}
          </span>
          <span className="font-mono text-xs text-[#5ce1e6]">
            SHARE THIS WITH YOUR CRIME-FIGHTING PARTNER OR FRIEND
          </span>
        </div>

        {/* Link Input or Active Partner */}
        {!linkedPartner ? (
          <div className="flex flex-col gap-2">
            <label className="font-pixel text-[8px] text-[#8fb8c4]">
              ENTER FRIEND OR PARTNER CODE:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="SPDY-XXXX"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={9}
                className="pixel-input text-sm py-2 px-3 bg-[#040c18] border-2 border-black text-white flex-1"
              />
              <button
                type="button"
                onClick={handleLink}
                className="pixel-btn text-xs px-3 !bg-[#6fc041] !text-black"
              >
                LINK ➔
              </button>
            </div>
            {errorMsg && (
              <span className="font-mono text-xs text-[#e53935] font-bold">
                ⚠️ {errorMsg}
              </span>
            )}
          </div>
        ) : (
          <div className="pixel-inset p-3 bg-[#0c2238] border-2 border-[#6fc041] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-[#6fc041]">
                ✓ ENCRYPTED LINK ACTIVE
              </span>
              <span className="font-pixel text-[8px] text-[#ffe066]">{linkedPartner}</span>
            </div>
            <p className="font-mono text-xs text-[#8fb8c4]">
              Partner link established on the Spider-Net. You can now transmit high-priority signals and trigger remote Spider-Nudges.
            </p>
            <button
              type="button"
              onClick={handleSendNudge}
              disabled={isNudging}
              className={`pixel-btn text-xs py-2 w-full ${
                isNudging ? '!bg-[#ffcc22] !text-black animate-pulse' : '!bg-[#e53935] !text-white'
              }`}
            >
              {isNudging ? '🔊 TRANSMITTING SPIDER THEME...' : '🚨 SEND SPIDER NUDGE (60s THEME)'}
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="text-[10px] font-mono text-[#8fb8c4] border-t border-[#1a3a5c] pt-2 text-center">
          Encrypted peer channel via Spider-Tracker protocol // End-to-end simulated telemetry
        </div>
      </div>
    </div>
  );
};
