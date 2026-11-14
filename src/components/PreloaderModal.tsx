import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface PreloaderModalProps {
  isOpen?: boolean;
  onComplete: (soundChoice: boolean) => void;
}

export const PreloaderModal: React.FC<PreloaderModalProps> = ({
  isOpen = true,
  onComplete
}) => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const lines = [
    "INITIALIZING SPIDEY TRACKER v4.2.0...",
    "BOOTING CORE SERVICES [OK]",
    "INITIALIZING MAP RENDER PIPELINE...",
    "LOADING BASE ASSETS: FRAME UI [OK]",
    "LOADING BASE ASSETS: TICKER MODULE [OK]",
    "SYNCHRONIZING TACTICAL RADAR [OK]",
    "CONNECTING TO GLOBAL SIGHTINGS REPOSITORY [OK]",
    "STARTING EVENT BUS [OK]"
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        const text = lines[currentLine];
        if (text) {
          setBootLines((prev) => [...prev, text]);
          setProgress(Math.round(((currentLine + 1) / lines.length) * 100));
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowPrompt(true), 300);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleSelectSound = (enable: boolean) => {
    soundManager.setEnabled(enable);
    if (enable) {
      soundManager.playCategory('preloader');
    }
    onComplete(enable);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-xl bg-[#0a0d14] border-2 border-[#09a4c7] shadow-[0_0_35px_rgba(9,164,199,0.5)] rounded p-6 flex flex-col font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#09a4c7]/40 pb-2 mb-4 text-[#96e0f7]">
          <div className="flex items-center gap-2 text-xs">
            <Terminal size={16} />
            <span>SYS_BOOT // SPIDEY_TRACKER_OS</span>
          </div>
          <span className="text-xs text-[#00ff50] animate-pulse">● LIVE</span>
        </div>

        {/* Console Log Output */}
        <div className="h-44 overflow-y-auto space-y-1 text-xs text-[#96e0f7] mb-4 bg-black/60 p-3 rounded border border-gray-800">
          {bootLines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-gray-500">&gt;</span>
              <span className={line.includes('[OK]') ? 'text-[#00ff50]' : 'text-gray-300'}>
                {line}
              </span>
            </div>
          ))}
          {!showPrompt && (
            <div className="inline-block w-2 h-4 bg-[#96e0f7] animate-pulse"></div>
          )}
        </div>

        {/* Progress Bar with Spider-Man Web graphic */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>LOADING ASSETS</span>
            <span className="text-[#96e0f7] font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-900 rounded overflow-hidden border border-gray-800 relative">
            <div
              className="h-full bg-gradient-to-r from-[#09a4c7] to-[#00ff50] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sound Opt-In Prompt */}
        {showPrompt && (
          <div className="p-4 bg-[#0e1c3b]/80 border border-[#09a4c7] rounded flex flex-col items-center text-center animate-fadeIn">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wider mb-2">
              WELCOME TO THE SPIDEY TRACKER
            </h3>
            <p className="text-xs text-gray-300 font-sans max-w-md mb-4 leading-relaxed">
              Interact with the map to view Spider-Man sightings, watch party transmissions, and villain intelligence all over the world.
            </p>
            <div className="text-[11px] font-mono text-[#f8b800] mb-3">
              CHOOSE AUDIO PREFERENCE TO ENTER:
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSelectSound(true)}
                className="bit-border-3step px-5 py-2.5 bg-[#09a4c7] hover:bg-[#96e0f7] text-black font-bold text-xs transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Volume2 size={16} />
                <span>SOUND ON</span>
              </button>
              <button
                onClick={() => handleSelectSound(false)}
                className="bit-border-3step px-5 py-2.5 bg-black/80 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <VolumeX size={16} />
                <span>SOUND OFF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
