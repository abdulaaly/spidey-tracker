import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SpideyPin, FilterState } from '../types';
import { soundManager } from '../services/soundManager';
import { Compass, RotateCw, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

interface MapEngineProps {
  pins: SpideyPin[];
  filters: FilterState;
  onSelectPin: (pin: SpideyPin) => void;
  onViewportChange: (center: { lat: number; lng: number }, zoom: number) => void;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  pins,
  filters,
  onSelectPin,
  onViewportChange,
  flyToTarget
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [tilt, setTilt] = React.useState<number>(0);
  const [rotation, setRotation] = React.useState<number>(0);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Matter Tactical Map Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Viewport change listener
    map.on('moveend zoomend', () => {
      const center = map.getCenter();
      onViewportChange({ lat: center.lat, lng: center.lng }, map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Fly-To Requests
  useEffect(() => {
    if (!flyToTarget || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [flyToTarget.lat, flyToTarget.lng],
      flyToTarget.zoom || 8,
      { duration: 1.5 }
    );
  }, [flyToTarget]);

  // Update Markers according to filters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    const getPinIcon = (pin: SpideyPin) => {
      let iconUrl = '/images/ui/map/red_pin.png';
      if (pin.pinType === 'watchParty') iconUrl = '/images/ui/map/green_pin.png';
      else if (pin.pinType === 'rumored') iconUrl = '/images/ui/map/white_pin.png';
      else if (pin.pinType === 'event') iconUrl = '/images/ui/map/event_pin.png';

      return L.icon({
        iconUrl,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -38]
      });
    };

    pins.forEach((pin) => {
      // Check Filter
      if (pin.pinType === 'confirmed' && !filters.confirmed) return;
      if (pin.pinType === 'rumored' && !filters.rumored) return;
      if (pin.pinType === 'watchParty' && !filters.watchParty) return;
      if (pin.pinType === 'event' && !filters.events) return;

      const marker = L.marker([pin.lat, pin.lng], {
        icon: getPinIcon(pin),
        title: pin.title
      });

      // Custom HUD Pin Card Popup
      const thumb = pin.cardThumbImg || pin.imageSrc || '/images/shareImage/shareImage.jpg';
      const ctaText =
        pin.pinType === 'watchParty'
          ? 'WATCH PARTY INFO'
          : pin.pinType === 'event'
          ? 'VIEW EVENT'
          : 'VIEW SIGHTING';

      const popupHtml = `
        <div class="pin-card-dyn bit-border-3step" style="width: 240px; background: #0e1c3b; color: #fff; padding: 10px; border: 2px solid #09a4c7; box-shadow: 0 0 15px rgba(9,164,199,0.5);">
          ${thumb ? `<img src="${thumb}" style="width: 100%; height: 110px; object-fit: cover; margin-bottom: 8px; border: 1px solid #09a4c7;" />` : ''}
          <div style="font-size: 11px; font-weight: bold; color: #96e0f7; text-transform: uppercase; margin-bottom: 4px;">
            ● ${pin.pinType}
          </div>
          <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; line-height: 1.2;">
            ${pin.title}
          </div>
          <button id="popup-btn-${pin.id}" style="width: 100%; padding: 6px; background: #09a4c7; color: #000; font-weight: bold; font-size: 12px; border: none; cursor: pointer; text-transform: uppercase;">
            ${ctaText}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'spidey-popup'
      });

      marker.on('popupopen', () => {
        soundManager.playCategory('notification');
        const btn = document.getElementById(`popup-btn-${pin.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectPin(pin);
          };
        }
      });

      marker.on('click', () => {
        soundManager.playCategory('activity');
      });

      layer.addLayer(marker);
    });
  }, [pins, filters, onSelectPin]);

  return (
    <div className="relative w-full h-full">
      {/* Map Viewport with Simulated 3D Perspective Tilt/Rotation */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(900px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`
        }}
      />

      {/* 3D Perspective HUD Controls (Top Right Overlay) */}
      <div className="absolute top-28 right-6 z-20 flex flex-col gap-1.5 items-center bg-black/60 p-1.5 rounded border border-[#09a4c7]/40">
        <div className="text-[10px] font-mono text-[#96e0f7] tracking-wider mb-1">
          HUD 3D
        </div>
        <button
          onClick={() => setTilt(prev => Math.min(prev + 10, 45))}
          title="Tilt Up"
          className="w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] hover:text-black text-[#96e0f7] border border-[#09a4c7] rounded flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowUp size={14} />
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => setRotation(prev => prev - 15)}
            title="Rotate Counter-Clockwise"
            className="w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] hover:text-black text-[#96e0f7] border border-[#09a4c7] rounded flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setRotation(prev => prev + 15)}
            title="Rotate Clockwise"
            className="w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] hover:text-black text-[#96e0f7] border border-[#09a4c7] rounded flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCw size={14} />
          </button>
        </div>
        <button
          onClick={() => setTilt(prev => Math.max(prev - 10, 0))}
          title="Tilt Down"
          className="w-7 h-7 bg-[#0e1c3b] hover:bg-[#09a4c7] hover:text-black text-[#96e0f7] border border-[#09a4c7] rounded flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowDown size={14} />
        </button>
        {(tilt !== 0 || rotation !== 0) && (
          <button
            onClick={() => { setTilt(0); setRotation(0); }}
            className="mt-1 text-[9px] px-1.5 py-0.5 bg-red-900/60 hover:bg-red-800 text-white rounded cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  );
};
