export type PinType = 'confirmed' | 'rumored' | 'trailer' | 'watchParty' | 'event';

export interface SpideyPin {
  id: string;
  pinType: PinType;
  pinTypeOverride?: PinType;
  lat: number;
  lng: number;
  title: string;
  imageSrc?: string;
  cardThumbImg?: string;
  createdAt?: string;
  url?: string | null;
  contentCreatorName?: string;
  msgCenterTickerMsg?: string;
  watchPartyCopy?: string;
  watchPartyCtaText?: string;
  watchPartyLink?: string;
}

export interface EventItem {
  id: string;
  name: string;
  description: string;
  datetime?: string;
  liveat?: string;
  createdAt?: string;
  cardThumbImg?: string;
  highlighted?: boolean;
  pinTypeOverride?: PinType;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  cta?: {
    text: string;
    href: string;
  } | null;
  attachments?: {
    images?: string[];
    videos?: Array<{
      src: string;
      title: string;
      videoPoster?: string;
    }>;
  };
}

export interface VillainItem {
  name: string;
  desc: string;
  image: string;
}

export interface VideoItem {
  title: string;
  src: string;
  default?: boolean;
}

export interface FilterState {
  confirmed: boolean;
  rumored: boolean;
  watchParty: boolean;
  events: boolean;
}
