export type SuitId =
  | 'classic'
  | 'iron'
  | 'america'
  | 'black'
  | 'scarlet'
  | 'noir'
  | 'future'
  | 'stealth'
  | 'mystery';

export interface SuitDef {
  id: SuitId;
  name: string;
  codename: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  asset: string;
  isAnimated: boolean;
  requiredLevel: number;
  stats: {
    defense: number;
    agility: number;
    tech: number;
  };
}

export const SUITS: SuitDef[] = [
  {
    id: 'classic',
    name: 'CLASSIC SPIDER',
    codename: 'PETER PARKER ORIGIN',
    description: 'The iconic red and blue suit. Webbed pattern with high tensile strength.',
    rarity: 'COMMON',
    asset: '/suits/classic.png',
    isAnimated: false,
    requiredLevel: 1,
    stats: { defense: 70, agility: 95, tech: 60 }
  },
  {
    id: 'iron',
    name: 'IRON SPIDER',
    codename: 'STARK NANOTECH',
    description: 'Advanced nanotech armor with animated arc-glow and four articulated spider legs.',
    rarity: 'LEGENDARY',
    asset: '/suits/iron.gif',
    isAnimated: true,
    requiredLevel: 4,
    stats: { defense: 98, agility: 88, tech: 100 }
  },
  {
    id: 'america',
    name: 'CAPTAIN SPIDER',
    codename: 'FREEDOM WEAVER',
    description: 'Stars and stripes reinforced tactical weave with kinetic shock absorption.',
    rarity: 'EPIC',
    asset: '/suits/america.gif',
    isAnimated: true,
    requiredLevel: 5,
    stats: { defense: 92, agility: 85, tech: 80 }
  },
  {
    id: 'black',
    name: 'SYMBIOTE BLACK',
    codename: 'KLYNTAR WEAVE',
    description: 'Liquid alien organism enhancing strength, agility, and camouflage.',
    rarity: 'EPIC',
    asset: '/suits/black.png',
    isAnimated: false,
    requiredLevel: 3,
    stats: { defense: 85, agility: 100, tech: 70 }
  },
  {
    id: 'scarlet',
    name: 'SCARLET SPIDER',
    codename: 'BEN REILLY HOODIE',
    description: 'Crimson bodysuit with sleeveless denim hoodie and external impact webbing.',
    rarity: 'RARE',
    asset: '/suits/scarlet.png',
    isAnimated: false,
    requiredLevel: 2,
    stats: { defense: 75, agility: 92, tech: 65 }
  },
  {
    id: 'noir',
    name: 'SPIDER-MAN NOIR',
    codename: '1933 HARD-BOILED',
    description: 'Dark trenchcoat, fedora, bulletproof vest, and goggles from the Great Depression era.',
    rarity: 'RARE',
    asset: '/suits/noir.png',
    isAnimated: false,
    requiredLevel: 2,
    stats: { defense: 80, agility: 82, tech: 50 }
  },
  {
    id: 'future',
    name: 'SPIDER-MAN 2099',
    codename: 'MIGUEL O\'HARA ALCHEMAX',
    description: 'Unstable molecule fabric with light-byte cape and venom fangs from 2099.',
    rarity: 'EPIC',
    asset: '/suits/future.png',
    isAnimated: false,
    requiredLevel: 6,
    stats: { defense: 88, agility: 96, tech: 98 }
  },
  {
    id: 'stealth',
    name: 'BIG TIME STEALTH',
    codename: 'HORIZON LABS CAMO',
    description: 'Bends light and sound around the wearer to grant complete visual & audio invisibility.',
    rarity: 'LEGENDARY',
    asset: '/suits/stealth.png',
    isAnimated: false,
    requiredLevel: 7,
    stats: { defense: 72, agility: 98, tech: 95 }
  }
];

export function getSuit(id: SuitId): SuitDef {
  return SUITS.find((s) => s.id === id) || SUITS[0];
}
