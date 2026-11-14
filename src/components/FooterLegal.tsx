import React, { useState } from 'react';
import { soundManager } from '../services/soundManager';
import { X, Shield, Code, Heart } from 'lucide-react';

export const FooterLegal: React.FC = () => {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <>
      {/* Bottom Legal Bar */}
      <footer className="absolute bottom-2 left-6 right-36 z-20 pointer-events-auto flex items-center justify-between text-[10px] md:text-xs text-gray-400 font-mono flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <span>© & ™ 2026 MARVEL. ©2026 CPII.</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#96e0f7] hidden sm:inline">SPIDER-MAN: BRAND NEW DAY</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playCategory('general');
              setShowCredits(true);
            }}
            className="hover:text-[#96e0f7] underline cursor-pointer"
          >
            CREDITS & OPEN-SOURCE ARCHITECTURE
          </button>
        </div>
      </footer>

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0a0d14] border-2 border-[#09a4c7] shadow-[0_0_35px_rgba(9,164,199,0.5)] rounded p-6 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#09a4c7]/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-[#96e0f7]" />
                <h3 className="text-base font-bold text-[#96e0f7] tracking-wider">
                  CREDITS & CLEAN-ROOM RECONSTRUCTION
                </h3>
              </div>
              <button
                onClick={() => setShowCredits(false)}
                className="bit-border-3step px-2.5 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3 text-gray-300 font-sans leading-relaxed">
              <p>
                <strong>Spidey Tracker (Open-Source Clean-Room Edition)</strong> is an educational, fully functional, MIT-licensed replica of the promotional web app for Sony Pictures' <em>Spider-Man: Brand New Day</em>.
              </p>
              <div className="p-3 bg-[#0e1c3b]/60 border border-[#09a4c7]/40 rounded font-mono text-[11px] text-[#96e0f7]">
                <div>• Architecture: Next.js 14 (App Router) + TypeScript + Tailwind CSS</div>
                <div>• Spatial Engine: Leaflet + CartoDB Dark Matter tiles</div>
                <div>• Radar Engine: Real-time Haversine Trigonometric Canvas</div>
                <div>• Visual Frame: 15-Slice Grid + Math Polygon Stepped Bevels</div>
                <div>• Audio Bus: Web Audio Controller & Voice Bite Triggers</div>
              </div>
              <p className="text-[11px] text-gray-400">
                All character names, imagery, and trademarks are the intellectual property of Marvel Entertainment and Columbia Pictures (Sony Pictures Entertainment).
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowCredits(false)}
                className="px-4 py-1.5 bg-[#09a4c7] hover:bg-[#96e0f7] text-black font-bold rounded cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
