'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SpideyPin, EventItem, VillainItem, VideoItem, FilterState } from '../types';
import { soundManager } from '../services/soundManager';
import { FifteenSliceFrame } from '../components/FifteenSliceFrame';
import { MainUIPanel } from '../components/MainUIPanel';
import { RadarWidget } from '../components/RadarWidget';
import { ActivityLogDrawer } from '../components/ActivityLogDrawer';
import { EventsDrawer } from '../components/EventsDrawer';
import { WebWatchModal } from '../components/WebWatchModal';
import { LightboxModal } from '../components/LightboxModal';
import { HelpScreenModal } from '../components/HelpScreenModal';
import { PreloaderModal } from '../components/PreloaderModal';
import { ReportSightingModal } from '../components/ReportSightingModal';
import { FooterLegal } from '../components/FooterLegal';

// Dynamically import MapEngine with SSR disabled for Leaflet window safety
const MapEngine = dynamic(
  () => import('../components/MapEngine').then((mod) => mod.MapEngine),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#06080e] flex items-center justify-center font-mono text-[#96e0f7] text-xs">
        <span className="animate-pulse">● INITIALIZING SPATIAL TACTICAL MAPPING ENGINE...</span>
      </div>
    )
  }
);

export default function Home() {
  const [pins, setPins] = useState<SpideyPin[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [villains, setVillains] = useState<VillainItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [tickerText, setTickerText] = useState<string>(
    'WELCOME TO THE SPIDEY TRACKER • INTERACT WITH THE MAP TO VIEW SPIDER-MAN SIGHTINGS ALL OVER THE WORLD • REPORT YOUR SIGHTINGS ON X'
  );

  const [filters, setFilters] = useState<FilterState>({
    confirmed: true,
    rumored: true,
    watchParty: true,
    events: true
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(true);

  // Active Modals & Drawers
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isWebWatchOpen, setIsWebWatchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Lightbox Media State
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    mediaType: 'youtube' | 'video' | 'image';
    src: string;
    title: string;
  }>({
    isOpen: false,
    mediaType: 'youtube',
    src: '',
    title: ''
  });

  // Map Navigation State
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState<number>(2.5);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // Load Data on Mount
  useEffect(() => {
    // 1. Fetch main.json
    fetch('/data/main.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.spideyPins) setPins(data.spideyPins);
        if (data.webwatch?.articles) setVillains(data.webwatch.articles);
        if (data.videoGallery?.videos) setVideos(data.videoGallery.videos);
      })
      .catch((err) => console.error('Failed to load main.json:', err));

    // 2. Fetch events.php.json
    fetch('/data/events.php.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.events?.global) {
          setEvents(data.events.global);
        }
      })
      .catch((err) => console.error('Failed to load events:', err));
  }, []);

  // Filter Toggle
  const handleToggleFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundManager.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundManager.playCategory('notification');
  };

  // Pin Click from Map or Log
  const handleSelectPin = (pin: SpideyPin) => {
    setFlyToTarget({ lat: pin.lat, lng: pin.lng, zoom: 8 });

    // Open appropriate media
    if (pin.watchPartyLink) {
      setLightboxState({
        isOpen: true,
        mediaType: 'youtube',
        src: pin.watchPartyLink,
        title: pin.title
      });
    } else if (pin.imageSrc) {
      setLightboxState({
        isOpen: true,
        mediaType: 'image',
        src: pin.imageSrc,
        title: pin.title
      });
    }
  };

  // Fly to Event Location
  const handleFlyToEvent = (lat: number, lng: number, title: string) => {
    setFlyToTarget({ lat, lng, zoom: 10 });
    setTickerText(`FOCUSING SENSOR ARRAY ON EVENT: ${title.toUpperCase()}`);
  };

  // Radar: Zoom Global
  const handleZoomGlobal = () => {
    setFlyToTarget({ lat: 20, lng: 0, zoom: 2 });
    setTickerText('SENSOR ARRAY RESET: GLOBAL PROJECTION ACTIVE');
  };

  // Radar: Center Neighborhood
  const handleCenterNeighborhood = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFlyToTarget({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            zoom: 12
          });
          setTickerText('SENSOR ARRAY LOCKED: LOCAL NEIGHBORHOOD SIGHTINGS');
        },
        () => {
          // Default fallback to Queens / NYC
          setFlyToTarget({ lat: 40.7282, lng: -73.7949, zoom: 12 });
          setTickerText('NEIGHBORHOOD COORDINATE RESOLVED: QUEENS, NY');
        }
      );
    } else {
      setFlyToTarget({ lat: 40.7282, lng: -73.7949, zoom: 12 });
    }
  };

  // User submitted sighting
  const handleAddSighting = (newPin: SpideyPin) => {
    setPins((prev) => [newPin, ...prev]);
    setFlyToTarget({ lat: newPin.lat, lng: newPin.lng, zoom: 10 });
    setTickerText(`NEW SIGHTING TRANSMITTED: ${newPin.title.toUpperCase()}`);
  };

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* 15-Slice Tactical Cyber Frame */}
      <FifteenSliceFrame>
        {/* Full-bleed Map Engine in viewport */}
        <MapEngine
          pins={pins}
          filters={filters}
          onSelectPin={handleSelectPin}
          onViewportChange={(center, zoom) => {
            setMapCenter(center);
            setMapZoom(zoom);
          }}
          flyToTarget={flyToTarget}
        />

        {/* Top HUD Controls & Marquee Ticker */}
        <MainUIPanel
          filters={filters}
          onToggleFilter={handleToggleFilter}
          onOpenActivityLog={() => setIsActivityLogOpen(true)}
          onOpenWebWatch={() => setIsWebWatchOpen(true)}
          onOpenEvents={() => setIsEventsOpen(true)}
          onOpenVideos={() => {
            if (videos.length > 0) {
              setLightboxState({
                isOpen: true,
                mediaType: 'youtube',
                src: videos[0].src,
                title: videos[0].title
              });
            }
          }}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          tickerText={tickerText}
        />

        {/* Tactical Radar Sweep Widget (Bottom Right) */}
        <RadarWidget
          pins={pins}
          center={mapCenter}
          zoom={mapZoom}
          onZoomGlobal={handleZoomGlobal}
          onCenterNeighborhood={handleCenterNeighborhood}
        />

        {/* Legal & Credits Bar (Bottom) */}
        <FooterLegal />
      </FifteenSliceFrame>

      {/* Drawers & Modals */}
      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        pins={pins}
        filters={filters}
        onSelectPin={(pin) => {
          handleSelectPin(pin);
          setIsActivityLogOpen(false);
        }}
      />

      <EventsDrawer
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        events={events}
        onFlyTo={handleFlyToEvent}
        onOpenVideo={(src, title) => {
          setLightboxState({
            isOpen: true,
            mediaType: src.endsWith('.mp4') ? 'video' : 'youtube',
            src,
            title
          });
        }}
      />

      <WebWatchModal
        isOpen={isWebWatchOpen}
        onClose={() => setIsWebWatchOpen(false)}
        villains={villains}
      />

      <LightboxModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        mediaType={lightboxState.mediaType}
        mediaSrc={lightboxState.src}
        title={lightboxState.title}
        videoList={videos}
        onSelectVideo={(vid) => {
          setLightboxState({
            isOpen: true,
            mediaType: 'youtube',
            src: vid.src,
            title: vid.title
          });
        }}
      />

      <HelpScreenModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ReportSightingModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitSighting={handleAddSighting}
      />

      {/* Initial Boot Sequence / Preloader */}
      {preloaderActive && (
        <PreloaderModal
          onComplete={(soundChoice) => {
            setSoundEnabled(soundChoice);
            setPreloaderActive(false);
          }}
        />
      )}
    </main>
  );
}
