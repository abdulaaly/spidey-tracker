'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SpideyPin, EventItem, FilterState } from '../types';
import { NetworkSpider, WORLDWIDE_SPIDERS } from '../data/spiders';
import { TrackerViewMode } from './EnhancedHUDHeader';
import { soundManager } from '../services/soundManager';
import { ArrowUp, ArrowDown, RotateCw, RotateCcw } from 'lucide-react';

interface MapEngineProps {
  pins: SpideyPin[];
  events: EventItem[];
  spiders?: NetworkSpider[];
  filters: FilterState;
  viewMode?: TrackerViewMode;
  center?: { lat: number; lng: number };
  zoom?: number;
  flyToTarget?: { lat: number; lng: number; zoom?: number } | null;
  onOpenLightbox?: (mediaType: 'youtube' | 'video' | 'image', src: string, title: string) => void;
  onSelectPin?: (pin: SpideyPin) => void;
  onSelectEvent?: (event: EventItem) => void;
  onSelectSpider?: (spider: NetworkSpider) => void;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  pins,
  events,
  spiders = WORLDWIDE_SPIDERS,
  filters,
  viewMode = 'UNIFIED',
  flyToTarget,
  onOpenLightbox,
  onSelectPin,
  onSelectEvent,
  onSelectSpider
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [tilt, setTilt] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25, 10],
      zoom: 2.8,
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

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

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
      flyToTarget.zoom || 14,
      { duration: 1.4 }
    );
  }, [flyToTarget]);

  // Update Markers based on viewMode & filters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Render Official Sightings Pins (if MOVIE or UNIFIED)
    if (viewMode === 'MOVIE' || viewMode === 'UNIFIED') {
      pins.forEach((pin) => {
        const type = (pin.type || 'confirmed').toLowerCase();
        if (type === 'confirmed' && !filters.confirmed) return;
        if (type === 'rumored' && !filters.rumored) return;
        if (type.includes('watch') && !filters.watchParty) return;

        let iconUrl = '/images/ui/map/red_pin.png';
        if (type === 'rumored') iconUrl = '/images/ui/map/white_pin.png';
        if (type.includes('watch')) iconUrl = '/images/ui/map/green_pin.png';

        const customIcon = L.icon({
          iconUrl,
          iconSize: [28, 38],
          iconAnchor: [14, 38],
          popupAnchor: [0, -38]
        });

        const lat = pin.location?.lat || pin.lat;
        const lng = pin.location?.lng || pin.lng;
        if (lat === undefined || lng === undefined) return;

        const marker = L.marker([lat, lng], {
          icon: customIcon,
          title: pin.title
        });

        const thumb =
          pin.attachments?.images?.[0] ||
          '/images/shareImage/shareImage.jpg';

        const popupHtml = `
          <div style="width: 250px; background: #071426; border: 3px solid #020810; padding: 10px; font-family: monospace;">
            <img src="${thumb}" style="width: 100%; height: 110px; object-fit: cover; border: 2px solid #000; margin-bottom: 6px;" />
            <div style="font-size: 8px; color: #5ce1e6; font-weight: bold; text-transform: uppercase;">
              ● ${pin.type?.toUpperCase() || 'OFFICIAL'} SIGHTING
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #fff; margin: 4px 0 2px;">
              ${pin.title}
            </div>
            <div style="font-size: 10px; color: #8fb8c4; margin-bottom: 8px;">
              📍 ${pin.location?.address || pin.address || 'Classified Coordinates'}
            </div>
            <button id="pin-btn-${pin.id}" style="width: 100%; padding: 6px; background: #ffcc22; color: #000; font-weight: bold; font-size: 10px; border: 2px solid #000; cursor: pointer; text-transform: uppercase;">
              INSPECT DOSSIER ➔
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: true });
        marker.on('popupopen', () => {
          soundManager.playRadarPing();
          const btn = document.getElementById(`pin-btn-${pin.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectPin?.(pin);
            };
          }
        });

        layer.addLayer(marker);
      });
    }

    // 2. Render Global Tour Event Pins (if MOVIE or UNIFIED)
    if ((viewMode === 'MOVIE' || viewMode === 'UNIFIED') && filters.events) {
      events.forEach((evt) => {
        if (!evt.location) return;

        const eventIcon = L.icon({
          iconUrl: '/images/ui/map/event_pin.png',
          iconSize: [30, 40],
          iconAnchor: [15, 40],
          popupAnchor: [0, -40]
        });

        const marker = L.marker([evt.location.lat, evt.location.lng], {
          icon: eventIcon,
          title: evt.name
        });

        const thumb =
          evt.cardThumbImg ||
          evt.attachments?.images?.[0] ||
          '/images/shareImage/shareImage.jpg';

        const hasVideo = (evt.attachments?.videos?.length ?? 0) > 0;
        const videoSrc = evt.attachments?.videos?.[0]?.src;

        const popupHtml = `
          <div style="width: 250px; background: #071426; border: 3px solid #020810; padding: 10px; font-family: monospace;">
            <img src="${thumb}" style="width: 100%; height: 110px; object-fit: cover; border: 2px solid #000; margin-bottom: 6px;" />
            <div style="font-size: 8px; color: #ffe066; font-weight: bold; text-transform: uppercase;">
              ★ GLOBAL TOUR ACTIVATION
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #fff; margin: 4px 0 2px;">
              ${evt.name}
            </div>
            <div style="font-size: 10px; color: #8fb8c4; margin-bottom: 8px;">
              📍 ${evt.location.address}
            </div>
            ${
              hasVideo
                ? `<button id="evt-btn-${evt.id}" style="width: 100%; padding: 6px; background: #e53935; color: #fff; font-weight: bold; font-size: 10px; border: 2px solid #000; cursor: pointer; text-transform: uppercase;">
                    ▶ PLAY PREMIERE FOOTAGE
                  </button>`
                : `<button id="evt-btn-${evt.id}" style="width: 100%; padding: 6px; background: #3a8fd4; color: #fff; font-weight: bold; font-size: 10px; border: 2px solid #000; cursor: pointer; text-transform: uppercase;">
                    VIEW ACTIVATION DETAILS
                  </button>`
            }
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: true });
        marker.on('popupopen', () => {
          soundManager.playRadarPing();
          const btn = document.getElementById(`evt-btn-${evt.id}`);
          if (btn) {
            btn.onclick = () => {
              if (hasVideo && videoSrc && onOpenLightbox) {
                onOpenLightbox('video', videoSrc, evt.name);
              } else {
                onSelectEvent?.(evt);
              }
            };
          }
        });

        layer.addLayer(marker);
      });
    }

    // 3. Render Worldwide Network Spiders (if GADGET or UNIFIED)
    if (viewMode === 'GADGET' || viewMode === 'UNIFIED') {
      spiders.forEach((spider) => {
        const spiderHtml = `
          <div class="map-spidey-pin">
            <div class="map-spidey-pin__orb-wrap">
              <div class="map-spidey-pin__orb" style="background: #0a1a2e; border: 2px solid #5ce1e6;">
                <span style="font-size: 16px;">🕷️</span>
              </div>
            </div>
            <div class="map-spidey-pin__label" style="color: #ffcc22; font-family: monospace;">
              ${spider.codename.slice(0, 14)}
            </div>
          </div>
        `;

        const spiderDivIcon = L.divIcon({
          html: spiderHtml,
          className: 'custom-spider-marker',
          iconSize: [44, 48],
          iconAnchor: [22, 48],
          popupAnchor: [0, -48]
        });

        const marker = L.marker([spider.location.lat, spider.location.lng], {
          icon: spiderDivIcon,
          title: spider.codename
        });

        const popupHtml = `
          <div style="width: 240px; background: #071426; border: 3px solid #020810; padding: 10px; font-family: monospace;">
            <div style="font-size: 8px; color: #6fc041; font-weight: bold;">
              ● SPIDER-NET ACTIVE HERO [LVL ${spider.level}]
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #ffcc22; margin: 4px 0 2px;">
              ${spider.codename}
            </div>
            <div style="font-size: 11px; color: #fff;">
              Operator: ${spider.realName}
            </div>
            <div style="font-size: 10px; color: #8fb8c4; margin-bottom: 6px;">
              📍 ${spider.city}, ${spider.country}
            </div>
            <div style="font-size: 9px; color: #5ce1e6; margin-bottom: 8px;">
              STATUS: ${spider.status} · SIGNAL: ${spider.signalStrength}%
            </div>
            <button id="spider-btn-${spider.id}" style="width: 100%; padding: 6px; background: #6fc041; color: #000; font-weight: bold; font-size: 10px; border: 2px solid #000; cursor: pointer; text-transform: uppercase;">
              LOCK TARGET & COMMUNICATE
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: true });
        marker.on('popupopen', () => {
          soundManager.playSignal();
          const btn = document.getElementById(`spider-btn-${spider.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectSpider?.(spider);
            };
          }
        });

        layer.addLayer(marker);
      });
    }
  }, [pins, events, spiders, filters, viewMode, onSelectPin, onSelectEvent, onSelectSpider, onOpenLightbox]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Map Perspective Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`
        }}
      />

      {/* 3D Camera & Orientation Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 items-center bg-[#071426]/90 p-2 border-2 border-black shadow-[3px_3px_0_#000]">
        <span className="font-pixel text-[7px] text-[#5ce1e6] tracking-wider mb-1">
          CAMERA 3D
        </span>
        <button
          type="button"
          onClick={() => {
            setTilt((prev) => Math.min(prev + 10, 45));
            soundManager.playBeep(850, 0.04);
          }}
          title="Tilt Pitch Up"
          className="w-7 h-7 bg-[#0a1a2e] hover:bg-[#3a8fd4] hover:text-black text-[#5ce1e6] border-2 border-black flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowUp size={14} />
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => {
              setRotation((prev) => prev - 15);
              soundManager.playBeep(850, 0.04);
            }}
            title="Rotate Left"
            className="w-7 h-7 bg-[#0a1a2e] hover:bg-[#3a8fd4] hover:text-black text-[#5ce1e6] border-2 border-black flex items-center justify-center cursor-pointer transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setRotation((prev) => prev + 15);
              soundManager.playBeep(850, 0.04);
            }}
            title="Rotate Right"
            className="w-7 h-7 bg-[#0a1a2e] hover:bg-[#3a8fd4] hover:text-black text-[#5ce1e6] border-2 border-black flex items-center justify-center cursor-pointer transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setTilt((prev) => Math.max(prev - 10, 0));
            soundManager.playBeep(850, 0.04);
          }}
          title="Tilt Pitch Down"
          className="w-7 h-7 bg-[#0a1a2e] hover:bg-[#3a8fd4] hover:text-black text-[#5ce1e6] border-2 border-black flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowDown size={14} />
        </button>
        {(tilt !== 0 || rotation !== 0) && (
          <button
            type="button"
            onClick={() => {
              setTilt(0);
              setRotation(0);
              soundManager.playSignal();
            }}
            title="Reset Perspective"
            className="text-[7px] font-pixel px-1.5 py-1 bg-[#e53935] text-white border border-black mt-1"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  );
};
