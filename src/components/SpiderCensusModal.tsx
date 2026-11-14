'use client';

import React, { useState } from 'react';
import { WORLDWIDE_SPIDERS, NetworkSpider } from '../data/spiders';
import { soundManager } from '../services/soundManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpider: (spider: NetworkSpider) => void;
  partnerCode: string;
}

export const SpiderCensusModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectSpider,
  partnerCode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filtered = WORLDWIDE_SPIDERS.filter(
    (s) =>
      s.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(partnerCode);
      setCopied(true);
      soundManager.playSignal();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="pixel-panel w-full max-w-2xl bg-[#071426] border-4 border-black p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[#ffe066]">
                WORLDWIDE SPIDER CENSUS ({WORLDWIDE_SPIDERS.length})
              </h2>
              <span className="font-mono text-[10px] text-[#5ce1e6]">
                ACTIVE SPIDER-HEROES DEPLOYED IN MAJOR METROPOLITAN HUBS
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

        {/* Secret Code Strip */}
        <div className="pixel-inset p-3 bg-[#0a1a2e] flex items-center justify-between gap-2 border border-black">
          <div>
            <span className="font-pixel text-[8px] text-[#8fb8c4]">YOUR SPIDER LINK CODE:</span>
            <div className="font-pixel text-sm text-[#ffe066] tracking-wider mt-0.5">
              {partnerCode}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="pixel-btn text-xs py-1 px-3 !bg-[#5ce1e6] !text-black"
          >
            {copied ? '✓ COPIED' : 'COPY CODE'}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by codename, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pixel-input text-xs sm:text-sm py-2 px-3 bg-[#040c18] border-2 border-black text-white w-full"
          />
        </div>

        {/* Spiders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map((spider) => (
            <div
              key={spider.id}
              onClick={() => {
                soundManager.playRadarPing();
                onSelectSpider(spider);
                onClose();
              }}
              className="p-2.5 bg-[#06101e] border-2 border-black hover:border-[#ffe066] cursor-pointer flex flex-col gap-1 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] text-[#ffe066] group-hover:text-white truncate">
                  {spider.codename}
                </span>
                <span className="text-[7px] font-pixel px-1 py-0.5 bg-[#0a1a2e] text-[#6fc041] border border-black">
                  LVL {spider.level}
                </span>
              </div>
              <div className="font-mono text-xs text-[#8fb8c4]">
                📍 {spider.city}, {spider.country}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-[#5ce1e6]">
                <span>STATUS: {spider.status}</span>
                <span>SIGNAL: {spider.signalStrength}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
