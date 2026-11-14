'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  SpideyPin,
  EventItem,
  VillainItem,
  VideoItem,
  FilterState,
  UserReport
} from '../types';
import { soundManager } from '../services/soundManager';
import { INITIAL_PINS, INITIAL_EVENTS, INITIAL_VILLAINS, INITIAL_VIDEOS } from '../data/initialData';
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
  const [pins, setPins] = useState<SpideyPin[]>(INITIAL_PINS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [villains, setVillains] = useState<VillainItem[]>(INITIAL_VILLAINS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
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
    // 1. Fetch main pins and intel from Next.js API or static fallback
    fetch('/api/main')
      .then((res) => {
        if (!res.ok) throw new Error('API route unavailable');
        return res.json();
      })
      .catch(() => fetch('/data/main.json').then((r) => r.json()))
      .then((data) => {
        if (data?.spideyPins) setPins(data.spideyPins);
        if (data?.webwatch?.articles) setVillains(data.webwatch.articles);
        if (data?.videoGallery?.videos) setVideos(data.videoGallery.videos);
      })
      .catch((err) => console.log('Using compiled static initial data:', err.message));

    // 2. Fetch events from Next.js API or static fallback
    fetch('/api/events')
      .then((res) => {
        if (!res.ok) throw new Error('API route unavailable');
        return res.json();
      })
      .catch(() => fetch('/data/events.php.json').then((r) => r.json()))
      .then((data) => {
        if (data?.events?.global) {
          setEvents(data.events.global);
        }
      })
      .catch((err) => console.log('Using compiled static events data:', err.message));
  }, []);

  // Filter Toggle
  const handleToggleFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    soundManager.playBeep(650, 0.08);
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.setEnabled(nextState);
    if (nextState) {
      soundManager.playBeep(880, 0.12);
    }
  };

  // Preloader Complete Handler
  const handlePreloaderComplete = (withAudio: boolean) => {
    setPreloaderActive(false);
    setSoundEnabled(withAudio);
    soundManager.setEnabled(withAudio);
    if (withAudio) {
      soundManager.playFanfare();
    }
  };

  // FlyTo Map Location
  const handleNavigateTo = (lat: number, lng: number, zoom = 14) => {
    setFlyToTarget({ lat, lng, zoom });
    soundManager.playBeep(920, 0.09);
  };

  // Lightbox Opener
  const handleOpenLightbox = (mediaType: 'youtube' | 'video' | 'image', src: string, title: string) => {
    setLightboxState({
      isOpen: true,
      mediaType,
      src,
      title
    });
    soundManager.playWhoosh();
  };

  // User Sighting Report Submission
  const handleAddUserReport = (report: UserReport) => {
    const newPin: SpideyPin = {
      id: report.id,
      title: report.title,
      type: report.type,
      location: {
        address: report.address,
        lat: report.lat,
        lng: report.lng
      },
      description: report.description,
      datetime: report.timestamp,
      highlighted: true,
      hidePin: false,
      attachments: {
        images: report.imageUrl ? [report.imageUrl] : [],
        videos: []
      }
    };

    setPins((prev) => [newPin, ...prev]);
    setTickerText(`NEW SIGHTING TRANSMITTED • ${report.title.toUpperCase()} AT ${report.address.toUpperCase()}`);
    handleNavigateTo(report.lat, report.lng, 15);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#06080e] select-none text-[#96e0f7] relative">
      {/* 15-Slice Tactical Container Frame */}
      <FifteenSliceFrame>
        {/* Top Tactical HUD Panel */}
        <MainUIPanel
          tickerText={tickerText}
          filters={filters}
          onToggleFilter={handleToggleFilter}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHelp={() => {
            setIsHelpOpen(true);
            soundManager.playWhoosh();
          }}
          onOpenLog={() => {
            setIsActivityLogOpen(true);
            soundManager.playWhoosh();
          }}
          onOpenEvents={() => {
            setIsEventsOpen(true);
            soundManager.playWhoosh();
          }}
          onOpenWebWatch={() => {
            setIsWebWatchOpen(true);
            soundManager.playWhoosh();
          }}
          onOpenReport={() => {
            setIsReportOpen(true);
            soundManager.playWhoosh();
          }}
        />

        {/* Viewport Area: Map Engine + Tactical Radar Overlay */}
        <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px]">
          {/* Spatial Map Engine */}
          <MapEngine
            pins={pins}
            events={events}
            filters={filters}
            center={mapCenter}
            zoom={mapZoom}
            flyToTarget={flyToTarget}
            onOpenLightbox={handleOpenLightbox}
            onSelectPin={(pin) => {
              setTickerText(`TARGET LOCKED: ${pin.title.toUpperCase()} • ${pin.location.address.toUpperCase()}`);
              soundManager.playRadarPing();
            }}
          />

          {/* Tactical Sweep Radar */}
          <RadarWidget
            pins={pins}
            center={mapCenter}
            onSelectTarget={(pin) => {
              handleNavigateTo(pin.location.lat, pin.location.lng, 15);
            }}
          />
        </div>

        {/* Tactical Footer & Legal Bar */}
        <FooterLegal />
      </FifteenSliceFrame>

      {/* Slide-out Activity Log Drawer (Left) */}
      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        pins={pins}
        onSelectPin={(pin) => {
          setIsActivityLogOpen(false);
          handleNavigateTo(pin.location.lat, pin.location.lng, 15);
        }}
      />

      {/* Slide-out Events Drawer (Right) */}
      <EventsDrawer
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        events={events}
        onSelectEvent={(evt) => {
          setIsEventsOpen(false);
          handleNavigateTo(evt.location.lat, evt.location.lng, 15);
        }}
      />

      {/* Villain Dossier Carousel Modal (Web Watch 1.5) */}
      <WebWatchModal
        isOpen={isWebWatchOpen}
        onClose={() => setIsWebWatchOpen(false)}
        villains={villains}
      />

      {/* Media Lightbox */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        mediaType={lightboxState.mediaType}
        src={lightboxState.src}
        title={lightboxState.title}
        playlist={videos}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Tactical Help / Operator Guide Modal */}
      <HelpScreenModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Sighting Submission Modal */}
      <ReportSightingModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitReport={handleAddUserReport}
      />

      {/* Terminal Preloader & Audio Permission Modal */}
      <PreloaderModal
        isOpen={preloaderActive}
        onComplete={handlePreloaderComplete}
      />
    </main>
  );
}
