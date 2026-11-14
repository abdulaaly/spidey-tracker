'use client';

import React from 'react';
import { SuitId } from '../data/suits';

interface Props {
  suitId: SuitId;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const SUIT_SOURCES: Record<SuitId, string> = {
  iron: '/suits/iron.gif',
  america: '/suits/america.gif',
  classic: '/suits/classic.png',
  black: '/suits/black.png',
  scarlet: '/suits/scarlet.png',
  noir: '/suits/noir.png',
  future: '/suits/future.png',
  stealth: '/suits/stealth.png',
  mystery: '/suits/mystery.png'
};

export const PixelSpideySprite: React.FC<Props> = ({
  suitId = 'classic',
  size = 80,
  className = '',
  onClick
}) => {
  const src = SUIT_SOURCES[suitId] || SUIT_SOURCES.classic;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      title={`Current Suit: ${suitId.toUpperCase()}`}
    >
      <img
        src={src}
        alt={suitId}
        style={{
          width: `${size}px`,
          height: `${Math.round(size * 1.15)}px`,
          imageRendering: 'pixelated',
          objectFit: 'contain'
        }}
        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter brightness-105"
        onError={(e) => {
          // Fallback if image fails
          (e.target as HTMLImageElement).src = '/suits/classic.png';
        }}
      />
    </div>
  );
};
