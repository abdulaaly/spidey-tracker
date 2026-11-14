import React, { useEffect, useRef } from 'react';
import { SpideyPin } from '../types';
import { soundManager } from '../services/soundManager';
import { Globe, Crosshair } from 'lucide-react';

interface RadarWidgetProps {
  pins: SpideyPin[];
  center: { lat: number; lng: number };
  zoom?: number;
  onZoomGlobal?: () => void;
  onCenterNeighborhood?: () => void;
  onSelectTarget?: (pin: SpideyPin) => void;
}

export const RadarWidget: React.FC<RadarWidgetProps> = ({
  pins,
  center,
  zoom = 3,
  onZoomGlobal,
  onCenterNeighborhood,
  onSelectTarget
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  // Haversine distance calculation in km
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Bearing calculation
  const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
    const x =
      Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
      Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);
    return Math.atan2(y, x);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 100;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size / 2;
    const centerPt = size / 2;

    const render = () => {
      angleRef.current = (angleRef.current + 0.04) % (Math.PI * 2);
      const angle = angleRef.current;

      ctx.clearRect(0, 0, size, size);

      // Radar clipping mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerPt, centerPt, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      // Background grid circles
      ctx.strokeStyle = 'rgba(9, 164, 199, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerPt, centerPt, radius * 0.33, 0, Math.PI * 2);
      ctx.arc(centerPt, centerPt, radius * 0.66, 0, Math.PI * 2);
      ctx.arc(centerPt, centerPt, radius - 4, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerPt, 0);
      ctx.lineTo(centerPt, size);
      ctx.moveTo(0, centerPt);
      ctx.lineTo(size, centerPt);
      ctx.stroke();

      // Radar Sweep Fan
      const sweepAngle = Math.PI * 0.5;
      ctx.beginPath();
      ctx.moveTo(centerPt, centerPt);
      ctx.arc(centerPt, centerPt, radius, angle - sweepAngle, angle);
      ctx.closePath();

      const sweepGrad = ctx.createRadialGradient(centerPt, centerPt, 0, centerPt, centerPt, radius);
      sweepGrad.addColorStop(0, 'rgba(9, 164, 199, 0)');
      sweepGrad.addColorStop(1, 'rgba(9, 164, 199, 0.25)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Radar Leading Beam
      ctx.beginPath();
      ctx.moveTo(centerPt, centerPt);
      ctx.lineTo(centerPt + radius * Math.cos(angle), centerPt + radius * Math.sin(angle));
      ctx.strokeStyle = '#96e0f7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center blip
      ctx.beginPath();
      ctx.arc(centerPt, centerPt, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff50';
      ctx.fill();

      // Range in km based on zoom
      const maxRangeKm = Math.max(100, 15000 / Math.pow(1.8, Math.max(1, zoom - 1)));

      // Draw pins on radar
      pins.forEach((pin) => {
        const pinLat = pin.lat ?? pin.location?.lat;
        const pinLng = pin.lng ?? pin.location?.lng;
        if (pinLat == null || pinLng == null) return;

        const dist = getDistanceKm(center.lat, center.lng, pinLat, pinLng);
        if (dist > maxRangeKm) return;

        const bearing = getBearing(center.lat, center.lng, pinLat, pinLng) - Math.PI / 2;
        const normalizedDist = Math.pow(dist / maxRangeKm, 0.85);
        const blipRadius = normalizedDist * (radius - 8);

        const bx = centerPt + blipRadius * Math.cos(bearing);
        const by = centerPt + blipRadius * Math.sin(bearing);

        // Blip color by category
        let color = '#00ff50';
        const type = (pin.pinTypeOverride || pin.pinType || pin.type || '').toLowerCase();
        if (type === 'rumored') color = '#ff4040';
        if (type === 'watchparty' || type.includes('watch')) color = '#ffcc22';
        if (type === 'event') color = '#96e0f7';

        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [pins, center, zoom]);

  return (
    <div className="absolute bottom-8 right-6 z-30 pointer-events-auto flex flex-col items-center">
      {/* Outer Tactical Radar Housing */}
      <div className="relative w-[110px] h-[110px] p-1 bg-black/80 rounded-full border-2 border-[#09a4c7] shadow-[0_0_15px_rgba(9,164,199,0.4)] flex items-center justify-center">
        {/* Radar Canvas */}
        <canvas
          ref={canvasRef}
          className="w-[100px] h-[100px] rounded-full"
          style={{ width: '100px', height: '100px' }}
        />

        {/* Global Zoom Out Action Button */}
        <button
          onClick={() => {
            soundManager.playJingle();
            onZoomGlobal?.();
          }}
          title="Zoom to Global View"
          className="absolute -top-1 -right-1 w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        >
          <Globe size={14} />
        </button>

        {/* Center Neighborhood Action Button */}
        <button
          onClick={() => {
            soundManager.playJingle();
            onCenterNeighborhood?.();
          }}
          title="Center on Neighborhood"
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        >
          <Crosshair size={14} />
        </button>
      </div>

      <div className="mt-1 text-[10px] font-mono text-[#96e0f7] tracking-widest uppercase">
        TACTICAL RADAR
      </div>
    </div>
  );
};
