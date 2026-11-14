'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  SpideyPin,
  EventItem,
  VillainItem,
  VideoItem,
  FilterState
} from '../types';
import { soundManager } from '../services/soundManager';
import { INITIAL_PINS, INITIAL_EVENTS, INITIAL_VILLAINS, INITIAL_VIDEOS } from '../data/initialData';
import { SUITS, SuitId } from '../data/suits';
import { WORLDWIDE_SPIDERS, NetworkSpider } from '../data/spiders';
import { INITIAL_MISSIONS, MissionItem } from '../data/missions';
import { calculateLevelProgress, generateSpiderCode } from '../utils/spideyLogic';

import { PixelHUDFrame } from '../components/PixelHUDFrame';
import { EnhancedHUDHeader, TrackerViewMode } from '../components/EnhancedHUDHeader';
import { TacticalSideRail } from '../components/TacticalSideRail';
import { RadarWidget } from '../components/RadarWidget';
import { ActivityLogDrawer } from '../components/ActivityLogDrawer';
import { EventsDrawer } from '../components/EventsDrawer';
import { WebWatchModal } from '../components/WebWatchModal';
import { LightboxModal } from '../components/LightboxModal';
import { HelpScreenModal } from '../components/HelpScreenModal';
import { PreloaderModal } from '../components/PreloaderModal';
import { ReportSightingModal } from '../components/ReportSightingModal';
import { SuitLockerModal } from '../components/SuitLockerModal';
import { QuizModal } from '../components/QuizModal';
import { MissionsModal } from '../components/MissionsModal';
import { SpiderCensusModal } from '../components/SpiderCensusModal';
import { PartnerLinkModal } from '../components/PartnerLinkModal';

// Dynamically import MapEngine with SSR disabled for Leaflet safety
const MapEngine = dynamic(
  () => import('../components/MapEngine').then((mod) => mod.MapEngine),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#040c18] flex items-center justify-center font-pixel text-[#5ce1e6] text-[10px]">
        <span className="animate-pulse">● INITIALIZING SPATIAL TACTICAL MAPPING ENGINE...</span>
      </div>
    )
  }
);

export default function Home() {
  // 1. Core Data State
  const [pins, setPins] = useState<SpideyPin[]>(INITIAL_PINS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [villains, setVillains] = useState<VillainItem[]>(INITIAL_VILLAINS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);

  // 2. Progression & Suit State
  const [totalXp, setTotalXp] = useState<number>(140);
  const [currentSuit, setCurrentSuit] = useState<SuitId>('classic');
  const [mySpiderCode, setMySpiderCode] = useState<string>('SPDY-7K9A');
  const spiderIndexRef = useRef<number>(0);

  // 3. UI View Mode & Status
  const [viewMode, setViewMode] = useState<TrackerViewMode>('UNIFIED');
  const [tickerText, setTickerText] = useState<string>(
    'WELCOME TO SPIDEY TRACKER // OFFICIAL SPIDER-MAN: BRAND NEW DAY WORLDWIDE SIGHTINGS & PRIVATE RECON NETWORK'
  );

  const [filters, setFilters] = useState<FilterState>({
    confirmed: true,
    rumored: true,
    watchParty: true,
    events: true
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ringtonePlaying, setRingtonePlaying] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(true);

  // 4. Modals & Drawers
  const [isSuitLockerOpen, setIsSuitLockerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isCensusOpen, setIsCensusOpen] = useState(false);
  const [isPartnerLinkOpen, setIsPartnerLinkOpen] = useState(false);

  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isWebWatchOpen, setIsWebWatchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // 5. Lightbox Media State
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

  // 6. Map Navigation
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 25, lng: 10 });
  const [mapZoom, setMapZoom] = useState<number>(2.8);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // Compute Level
  const levelInfo = calculateLevelProgress(totalXp);

  // Client init & localStorage hydration
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('spidey_code');
      if (savedCode) setMySpiderCode(savedCode);
      else {
        const newCode = generateSpiderCode();
        setMySpiderCode(newCode);
        localStorage.setItem('spidey_code', newCode);
      }

      const savedSuit = localStorage.getItem('spidey_suit') as SuitId;
      if (savedSuit && SUITS.some((s) => s.id === savedSuit)) {
        setCurrentSuit(savedSuit);
      }

      const savedXp = localStorage.getItem('spidey_xp');
      if (savedXp) setTotalXp(parseInt(savedXp, 10));
    } catch {
      // Ignore SSR issues
    }

    // Fetch dynamic updates if available
    fetch('/api/main')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.spideyPins) setPins(data.spideyPins);
        if (data?.webwatch?.articles) setVillains(data.webwatch.articles);
        if (data?.videoGallery?.videos) setVideos(data.videoGallery.videos);
      })
      .catch(() => {});

    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.events?.global) setEvents(data.events.global);
      })
      .catch(() => {});
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

  // Ringtone Toggle
  const handleToggleRingtone = async () => {
    if (ringtonePlaying) {
      soundManager.stopRingtone();
      setRingtonePlaying(false);
    } else {
      soundManager.setEnabled(true);
      setSoundEnabled(true);
      await soundManager.playRingtone();
      setRingtonePlaying(true);
    }
  };

  // Preloader Complete
  const handlePreloaderComplete = (withAudio: boolean) => {
    setPreloaderActive(false);
    setSoundEnabled(withAudio);
    soundManager.setEnabled(withAudio);
    if (withAudio) {
      soundManager.playFanfare();
    }
  };

  // FlyTo Navigation
  const handleNavigateTo = (lat: number, lng: number, zoom = 14) => {
    setFlyToTarget({ lat, lng, zoom });
    soundManager.playBeep(920, 0.08);
  };

  // Cycle Spiders
  const handleCycleSpiders = () => {
    const nextIdx = (spiderIndexRef.current + 1) % WORLDWIDE_SPIDERS.length;
    spiderIndexRef.current = nextIdx;
    const target = WORLDWIDE_SPIDERS[nextIdx];
    handleNavigateTo(target.location.lat, target.location.lng, 12);
    setTickerText(
      `TARGET LOCKED // ${target.codename.toUpperCase()} PATROLLING ${target.city.toUpperCase()} (${target.status})`
    );
  };

  // Lightbox
  const handleOpenLightbox = (mediaType: 'youtube' | 'video' | 'image', src: string, title: string) => {
    setLightboxState({
      isOpen: true,
      mediaType,
      src,
      title
    });
    soundManager.playWhoosh();
  };

  // Award XP
  const handleAwardXp = (amount: number) => {
    setTotalXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('spidey_xp', next.toString());
      } catch {}
      return next;
    });
  };

  // Equip Suit
  const handleEquipSuit = (suitId: SuitId) => {
    setCurrentSuit(suitId);
    try {
      localStorage.setItem('spidey_suit', suitId);
    } catch {}
    setTickerText(`SUIT EQUIPPED // ${suitId.toUpperCase()} ACTIVE PROTOCOL ENGAGED`);
    setIsSuitLockerOpen(false);
  };

  // Claim Mission
  const handleClaimMission = (missionId: string, xpReward: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: true } : m))
    );
    handleAwardXp(xpReward);
  };

  // User Sighting Report Submission
  const handleAddUserReport = (newPin: SpideyPin) => {
    const lat = newPin.lat || newPin.location?.lat || 40.7128;
    const lng = newPin.lng || newPin.location?.lng || -74.006;
    const formattedPin: SpideyPin = {
      ...newPin,
      location: {
        address: newPin.location?.address || 'Manhattan Sector, NY',
        lat,
        lng
      },
      lat,
      lng
    };

    setPins((prev) => [formattedPin, ...prev]);
    setTickerText(`NEW SIGHTING TRANSMITTED • ${formattedPin.title.toUpperCase()}`);
    handleNavigateTo(lat, lng, 15);
    handleAwardXp(50);
  };

  const unclaimedMissions = missions.filter((m) => !m.completed).length;

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#040c18] relative select-none">
      <PixelHUDFrame>
        {/* Top Tactical Cyber HUD Header */}
        <EnhancedHUDHeader
          tickerText={tickerText}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          level={levelInfo.level}
          xp={levelInfo.currentXp}
          currentSuit={currentSuit}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          ringtonePlaying={ringtonePlaying}
          onToggleRingtone={handleToggleRingtone}
          onOpenSuitLocker={() => setIsSuitLockerOpen(true)}
          onOpenWebWatch={() => setIsWebWatchOpen(true)}
          onOpenEvents={() => setIsEventsOpen(true)}
          onOpenLog={() => setIsActivityLogOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Center Main Viewport Area: Map + Left Rail + Tactical Radar */}
        <div className="relative w-full flex-1 overflow-hidden">
          {/* Tactical Side Rail (Floating Action Orbs) */}
          <TacticalSideRail
            currentSuit={currentSuit}
            spidersCount={WORLDWIDE_SPIDERS.length}
            unclaimedMissions={unclaimedMissions}
            onOpenSuitLocker={() => setIsSuitLockerOpen(true)}
            onOpenMissions={() => setIsMissionsOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenCensus={() => setIsCensusOpen(true)}
            onCycleSpiders={handleCycleSpiders}
            onOpenPartnerLink={() => setIsPartnerLinkOpen(true)}
          />

          {/* Map Engine */}
          <MapEngine
            pins={pins}
            events={events}
            spiders={WORLDWIDE_SPIDERS}
            filters={filters}
            viewMode={viewMode}
            center={mapCenter}
            zoom={mapZoom}
            flyToTarget={flyToTarget}
            onOpenLightbox={handleOpenLightbox}
            onSelectPin={(pin) => {
              setTickerText(`TARGET LOCKED: ${pin.title.toUpperCase()} • ${pin.location.address.toUpperCase()}`);
              soundManager.playRadarPing();
            }}
            onSelectEvent={(evt) => {
              setTickerText(`GLOBAL ACTIVATION: ${evt.name.toUpperCase()} • ${evt.location.address.toUpperCase()}`);
              soundManager.playRadarPing();
            }}
            onSelectSpider={(spider) => {
              setTickerText(`HERO TARGETED: ${spider.codename.toUpperCase()} • ${spider.city.toUpperCase()}`);
              handleNavigateTo(spider.location.lat, spider.location.lng, 14);
            }}
          />

          {/* Tactical Canvas Sweep Radar Overlay */}
          <RadarWidget
            pins={pins}
            center={mapCenter}
            onSelectTarget={(pin) => {
              handleNavigateTo(pin.location.lat, pin.location.lng, 15);
            }}
          />

          {/* Bottom Filter Ticker Bar */}
          <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-2 p-2 bg-[#071426]/90 border-2 border-black shadow-[3px_3px_0_#000]">
            <div className="flex items-center gap-1.5 flex-wrap text-[8px] font-pixel">
              <span className="text-[#8fb8c4] mr-1 hidden sm:inline">RADAR LAYERS:</span>
              <button
                type="button"
                onClick={() => handleToggleFilter('confirmed')}
                className={`px-2 py-1 border transition-all ${
                  filters.confirmed
                    ? 'bg-[#e53935] text-white border-black shadow-[1px_1px_0_#000]'
                    : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
                }`}
              >
                ● CONFIRMED ({pins.filter((p) => p.type === 'confirmed').length})
              </button>
              <button
                type="button"
                onClick={() => handleToggleFilter('rumored')}
                className={`px-2 py-1 border transition-all ${
                  filters.rumored
                    ? 'bg-white text-black border-black shadow-[1px_1px_0_#000]'
                    : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
                }`}
              >
                ○ RUMORED ({pins.filter((p) => p.type === 'rumored').length})
              </button>
              <button
                type="button"
                onClick={() => handleToggleFilter('watchParty')}
                className={`px-2 py-1 border transition-all ${
                  filters.watchParty
                    ? 'bg-[#6fc041] text-black border-black shadow-[1px_1px_0_#000]'
                    : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
                }`}
              >
                ★ WATCH PARTY ({pins.filter((p) => p.type === 'watchParty').length})
              </button>
              <button
                type="button"
                onClick={() => handleToggleFilter('events')}
                className={`px-2 py-1 border transition-all ${
                  filters.events
                    ? 'bg-[#3a8fd4] text-white border-black shadow-[1px_1px_0_#000]'
                    : 'bg-[#0a1a2e] text-[#8fb8c4] border-[#1a3a5c]'
                }`}
              >
                🌐 GLOBAL TOUR ({events.length})
              </button>
            </div>

            {/* Quick Action Fly-Tos */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNavigateTo(40.7128, -74.006, 12)}
                className="pixel-btn text-[8px] py-1 px-2 !bg-[#0c2238] !text-[#5ce1e6]"
              >
                NYC HUB
              </button>
              <button
                type="button"
                onClick={handleCycleSpiders}
                className="pixel-btn text-[8px] py-1 px-2 !bg-[#ffe066] !text-black"
              >
                CYCLE SPIDERS ➔
              </button>
            </div>
          </div>
        </div>
      </PixelHUDFrame>

      {/* Slide-out Activity Log Drawer (Left) */}
      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        pins={pins}
        filters={filters}
        onSelectPin={(pin) => {
          setIsActivityLogOpen(false);
          const pLat = pin.lat ?? pin.location?.lat ?? 40.7128;
          const pLng = pin.lng ?? pin.location?.lng ?? -74.006;
          handleNavigateTo(pLat, pLng, 15);
        }}
      />

      {/* Slide-out Events Drawer (Right) */}
      <EventsDrawer
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        events={events}
        onSelectEvent={(evt) => {
          setIsEventsOpen(false);
          if (evt.location) {
            handleNavigateTo(evt.location.lat, evt.location.lng, 15);
          }
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

      {/* Operator Manual */}
      <HelpScreenModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Sighting Submission Modal */}
      <ReportSightingModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitSighting={handleAddUserReport}
      />

      {/* Terminal Boot Modal */}
      <PreloaderModal
        isOpen={preloaderActive}
        onComplete={handlePreloaderComplete}
      />

      {/* Suit Locker Modal */}
      <SuitLockerModal
        isOpen={isSuitLockerOpen}
        currentSuit={currentSuit}
        playerLevel={levelInfo.level}
        onClose={() => setIsSuitLockerOpen(false)}
        onEquipSuit={handleEquipSuit}
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAwardXp={handleAwardXp}
      />

      {/* Missions Modal */}
      <MissionsModal
        isOpen={isMissionsOpen}
        missions={missions}
        onClose={() => setIsMissionsOpen(false)}
        onClaimBounty={handleClaimMission}
      />

      {/* Spider Census Modal */}
      <SpiderCensusModal
        isOpen={isCensusOpen}
        partnerCode={mySpiderCode}
        onClose={() => setIsCensusOpen(false)}
        onSelectSpider={(spider) => {
          handleNavigateTo(spider.location.lat, spider.location.lng, 14);
        }}
      />

      {/* Partner Link Modal */}
      <PartnerLinkModal
        isOpen={isPartnerLinkOpen}
        myCode={mySpiderCode}
        onClose={() => setIsPartnerLinkOpen(false)}
        onLinkSuccess={(code) => {
          setTickerText(`PARTNER LINK ESTABLISHED WITH ${code} // DUAL SPIDER BEACON ONLINE`);
        }}
      />
    </main>
  );
}
