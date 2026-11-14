'use client';

import React from 'react';

interface PixelHUDFrameProps {
  children: React.ReactNode;
}

export const PixelHUDFrame: React.FC<PixelHUDFrameProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#040c18] relative flex flex-col justify-between p-1 sm:p-2 md:p-3 select-none">
      {/* CRT Scanline and ambient radar glow */}
      <div className="absolute inset-0 crt-overlay pointer-events-none z-30" />

      {/* Outer Stepped 3D Pixel Frame Bezel */}
      <div className="pixel-frame relative w-full h-full flex flex-col overflow-hidden z-10">
        {/* Top Rivet Accents handled via ::before and ::after in pixel.css */}

        {/* Inner Tactical Viewport */}
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#06101e]">
          {children}
        </div>
      </div>
    </div>
  );
};
