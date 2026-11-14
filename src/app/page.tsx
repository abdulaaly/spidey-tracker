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

import { FifteenSliceFrame } from '../components/FifteenSliceFrame';
import { MainUIPanel } from '../components/MainUIPanel';
import { RadarWidget } from '../components/RadarWidget';
import { FooterLegal } from '../components/FooterLegal';
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
      <div className="w-full h-full bg-[#040c18] flex items-center justify-center font-mono text-[#5ce1e6] text-xs">
        <span className="animate-pulse">● INITIALIZING SPATIAL TACTICAL MAPPING ENGINE...</span>
      </div>
    )
  }
);

export default function Home() {
  // 1. Core Data State (Official Sony + Brand New Day intel)
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

  // 3. UI Status & Ticker
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
  const [ringtonePlaying, setRingtonePlaying] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [showWatchPartyCard, setShowWatchPartyCard] = useState(true);

  // 4. Modals & Drawers
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isWebWatchOpen, setIsWebWatchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Multiverse Modals
  const [isSuitLockerOpen, setIsSuitLockerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const [isCensusOpen, setIsCensusOpen] = useState(false);
  const [isPartnerLinkOpen, setIsPartnerLinkOpen] = useState(false);

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

      const savedSuit = localStorage.getItem('spidey_suit') as SuitId | null;
      if (savedSuit && SUITS.some((s) => s.id === savedSuit)) {
        setCurrentSuit(savedSuit);
      }

      const savedXp = localStorage.getItem('spidey_xp');
      if (savedXp) setTotalXp(parseInt(savedXp, 10) || 140);
    } catch {}

    // Load dynamic data from public if available
    fetch('/data/main.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.spideyPins && data.spideyPins.length > 0) setPins(data.spideyPins);
        if (data.webwatch?.articles) setVillains(data.webwatch.articles);
        if (data.videoGallery?.videos) setVideos(data.videoGallery.videos);
      })
      .catch(() => {});

    fetch('/data/events.php.json')
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
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundManager.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundManager.playCategory('notification');
  };

  // 1960s Ringtone Theme Toggle
  const handleToggleRingtone = () => {
    if (ringtonePlaying) {
      soundManager.stopRingtone();
      setRingtonePlaying(false);
    } else {
      soundManager.playRingtone();
      setRingtonePlaying(true);
      soundManager.onRingtoneEnded(() => setRingtonePlaying(false));
    }
  };

  // Map Navigation Actions
  const handleNavigateTo = (lat: number, lng: number, zoom = 14) => {
    setFlyToTarget({ lat, lng, zoom });
  };

  const handleZoomGlobal = () => {
    setFlyToTarget({ lat: 20, lng: 0, zoom: 2.5 });
    setTickerText('SENSOR ARRAY RESET • GLOBAL SATELLITE PROJECTION ACTIVE');
  };

  const handleCenterNeighborhood = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFlyToTarget({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            zoom: 13
          });
          setTickerText('SENSOR ARRAY LOCKED • LOCAL NEIGHBORHOOD SIGHTINGS');
        },
        () => {
          setFlyToTarget({ lat: 40.7282, lng: -73.7949, zoom: 12 });
          setTickerText('NEIGHBORHOOD COORDINATE RESOLVED • QUEENS, NY');
        }
      );
    } else {
      setFlyToTarget({ lat: 40.7282, lng: -73.7949, zoom: 12 });
    }
  };

  // Pin Click from Map or Log
  const handleSelectPin = (pin: SpideyPin) => {
    const lat = pin.lat || pin.location?.lat || 40.7128;
    const lng = pin.lng || pin.location?.lng || -74.006;
    setFlyToTarget({ lat, lng, zoom: 8 });

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

  // Cycle Spider Heroes
  const handleCycleSpiders = () => {
    spiderIndexRef.current = (spiderIndexRef.current + 1) % WORLDWIDE_SPIDERS.length;
    const nextSpider = WORLDWIDE_SPIDERS[spiderIndexRef.current];
    setFlyToTarget({
      lat: nextSpider.location.lat,
      lng: nextSpider.location.lng,
      zoom: 11
    });
    setTickerText(
      `SPIDER-NET HERO LOCKED • ${nextSpider.codename.toUpperCase()} • ${nextSpider.city.toUpperCase()}`
    );
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
    setTickerText(`SUIT EQUIPPED • ${suitId.toUpperCase()} ACTIVE PROTOCOL ENGAGED`);
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
    handleNavigateTo(lat, lng, 14);
    handleAwardXp(50);
  };

  const unclaimedMissions = missions.filter((m) => !m.completed).length;

  return (
    <main className="w-screen h-screen overflow-hidden bg-black relative select-none">
      {/* 15-Slice Tactical Cyber Frame (Exact Sony Movie Shell) */}
      <FifteenSliceFrame>
        {/* Full-bleed Map Engine in viewport */}
        <MapEngine
          pins={pins}
          events={events}
          spiders={WORLDWIDE_SPIDERS}
          filters={filters}
          viewMode="UNIFIED"
          flyToTarget={flyToTarget}
          onSelectPin={handleSelectPin}
          onSelectEvent={(evt) => {
            if (evt.location) {
              setFlyToTarget({ lat: evt.location.lat, lng: evt.location.lng, zoom: 10 });
              setTickerText(`FOCUSING SENSOR ARRAY ON EVENT: ${evt.title.toUpperCase()}`);
            }
          }}
          onSelectSpider={(spd) => {
            setFlyToTarget({ lat: spd.location.lat, lng: spd.location.lng, zoom: 11 });
            setTickerText(`LOCKING HERO FREQUENCY: ${spd.codename.toUpperCase()}`);
          }}
          onOpenLightbox={(mediaType, src, title) => {
            setLightboxState({ isOpen: true, mediaType, src, title });
          }}
        />

        {/* Top HUD Controls, Authentic Movie Buttons, Multiverse Tools & Marquee Ticker */}
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
          onOpenSuitLocker={() => setIsSuitLockerOpen(true)}
          onOpenMissions={() => setIsMissionsOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenCensus={() => setIsCensusOpen(true)}
          onOpenPartnerLink={() => setIsPartnerLinkOpen(true)}
          currentSuit={currentSuit}
          level={levelInfo.level}
          xp={levelInfo.currentXp}
          activeMissionsCount={unclaimedMissions}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          ringtonePlaying={ringtonePlaying}
          onToggleRingtone={handleToggleRingtone}
          tickerText={tickerText}
        />

        {/* Tactical Map Control Widgets Overlay */}
        <div className="absolute bottom-16 left-6 z-20 pointer-events-auto flex items-center gap-3">
          <button
            onClick={handleZoomGlobal}
            className="bit-border-3step px-3 py-1.5 bg-[#0e1c3b]/90 hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs tracking-wider cursor-pointer shadow-lg transition-all"
            title="Reset Map to Global Perspective"
          >
            BACK TO MAP
          </button>

          <button
            onClick={handleCycleSpiders}
            className="bit-border-3step px-3 py-1.5 bg-[#0e1c3b]/90 hover:bg-[#152e63] text-[#5ce1e6] border border-[#5ce1e6]/60 font-bold text-xs tracking-wider cursor-pointer shadow-lg transition-all flex items-center gap-1.5"
            title="Cycle through 19 Worldwide Spiders"
          >
            <span>🌐</span>
            <span>CYCLE SPIDERS (19)</span>
          </button>
        </div>

        {/* Watch Party Countdown Card (Exact Sony Feature) */}
        {showWatchPartyCard && (
          <div className="absolute top-28 right-6 z-20 pointer-events-auto hidden md:flex flex-col w-64 bg-[#0a0d14]/90 border border-[#09a4c7]/60 p-3 shadow-[0_0_20px_rgba(9,164,199,0.3)] rounded font-mono text-xs">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#09a4c7]/30">
              <span className="text-[#96e0f7] font-bold tracking-wider">WATCH PARTY LIVE</span>
              <button
                onClick={() => setShowWatchPartyCard(false)}
                className="text-gray-400 hover:text-white cursor-pointer text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full h-24 mb-2 overflow-hidden rounded border border-gray-800">
              <img
                src="/images/home_ent/watch_party_card_thm.jpg"
                alt="Watch Party"
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="text-[11px] text-gray-200 mb-2 font-sans leading-snug">
              WATCH SPIDER-MAN: BRAND NEW DAY AT HOME NOW.
            </div>
            <button
              onClick={() => {
                if (videos.length > 0) {
                  setLightboxState({
                    isOpen: true,
                    mediaType: 'youtube',
                    src: videos[0].src,
                    title: 'SPIDER-MAN: BRAND NEW DAY TRANSMISSION'
                  });
                }
              }}
              className="bit-border-3step w-full py-1.5 bg-[#09a4c7] hover:bg-[#96e0f7] text-black font-bold text-[11px] cursor-pointer transition-transform hover:scale-102"
            >
              WATCH AT HOME
            </button>
          </div>
        )}

        {/* Tactical Radar Sweep Widget (Bottom Right) */}
        <RadarWidget
          pins={pins}
          center={mapCenter}
          zoom={mapZoom}
          onZoomGlobal={handleZoomGlobal}
          onCenterNeighborhood={handleCenterNeighborhood}
        />

        {/* Authentic Movie Copyright & Legal Bar */}
        <FooterLegal />
      </FifteenSliceFrame>

      {/* Drawers & Modals (Official Sony Features) */}
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
        onFlyTo={(lat, lng, title) => {
          setFlyToTarget({ lat, lng, zoom: 10 });
          setTickerText(`FOCUSING SENSOR ARRAY ON EVENT: ${title.toUpperCase()}`);
        }}
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
        onSubmitSighting={handleAddUserReport}
      />

      {/* Multiverse Modals */}
      <SuitLockerModal
        isOpen={isSuitLockerOpen}
        onClose={() => setIsSuitLockerOpen(false)}
        currentSuit={currentSuit}
        playerLevel={levelInfo.level}
        onEquipSuit={handleEquipSuit}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAwardXp={handleAwardXp}
      />

      <MissionsModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        missions={missions}
        onClaimBounty={handleClaimMission}
      />

      <SpiderCensusModal
        isOpen={isCensusOpen}
        partnerCode={mySpiderCode}
        onClose={() => setIsCensusOpen(false)}
        onSelectSpider={(spider) => {
          setFlyToTarget({
            lat: spider.location.lat,
            lng: spider.location.lng,
            zoom: 11
          });
          setTickerText(
            `HERO LOCATED • ${spider.codename.toUpperCase()} • ${spider.city.toUpperCase()}`
          );
        }}
      />

      <PartnerLinkModal
        isOpen={isPartnerLinkOpen}
        onClose={() => setIsPartnerLinkOpen(false)}
        myCode={mySpiderCode}
        onLinkSuccess={(partnerCode) => {
          setTickerText(`QUANTUM LINK ESTABLISHED WITH OPERATOR ${partnerCode}!`);
          soundManager.playRingtone();
        }}
      />

      {/* Initial Boot Sequence / Preloader Modal */}
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
