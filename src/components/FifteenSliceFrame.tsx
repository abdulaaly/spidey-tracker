import React from 'react';

interface FifteenSliceFrameProps {
  children?: React.ReactNode;
}

export const FifteenSliceFrame: React.FC<FifteenSliceFrameProps> = ({ children }) => {
  return (
    <div className="fifteen-slice-frame">
      {/* Row 1: Top Bar */}
      <div className="frame-r1c1" style={{ backgroundImage: "url('/images/frame/frame1-1.png')" }} />
      <div className="frame-r1c2" style={{ backgroundImage: "url('/images/frame/frame1-2.png')" }} />
      <div className="frame-r1c3" style={{ backgroundImage: "url('/images/frame/frame1-3.png')" }} />

      {/* Row 2: Main Viewport Row */}
      <div className="frame-r2c1" style={{ backgroundImage: "url('/images/frame/frame2-1.png')" }} />
      <div className="frame-r2c2 relative w-full h-full overflow-hidden">
        {children}
      </div>
      <div className="frame-r2c3" style={{ backgroundImage: "url('/images/frame/frame2-3.png')" }} />

      {/* Row 3: Accent Row */}
      <div className="frame-r3c1" style={{ backgroundImage: "url('/images/frame/frame3-1.png')" }} />
      <div className="frame-r3c2" style={{ backgroundImage: "url('/images/frame/frame3-2.png')" }} />
      <div className="frame-r3c3" style={{ backgroundImage: "url('/images/frame/frame3-3.png')" }} />

      {/* Row 4: Lower Control Accent Row */}
      <div className="frame-r4c1" style={{ backgroundImage: "url('/images/frame/frame4-1.png')" }} />
      <div className="frame-r4c2" style={{ backgroundImage: "url('/images/frame/frame4-2.png')" }} />
      <div className="frame-r4c3" style={{ backgroundImage: "url('/images/frame/frame4-3.png')" }} />

      {/* Row 5: Bottom Lip */}
      <div className="frame-r5c1" style={{ backgroundImage: "url('/images/frame/frame5-1.png')" }} />
      <div className="frame-r5c2" style={{ backgroundImage: "url('/images/frame/frame5-2.png')" }} />
      <div className="frame-r5c3" style={{ backgroundImage: "url('/images/frame/frame5-3.png')" }} />
    </div>
  );
};
