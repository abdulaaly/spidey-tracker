/**
 * Pure business logic for Spidey Tracker: Geo calculations, progression, filters, and quests.
 */

export interface GeoCoord {
  lat: number;
  lng: number;
}

/**
 * Calculates great-circle distance between two points in kilometers using Haversine formula.
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats distance into human-readable metric string.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Level progression calculator.
 * Level 1 starts at 0 XP. Each level requires 100 XP * level index.
 */
export interface LevelInfo {
  level: number;
  currentXp: number;
  levelStartXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function calculateLevelProgress(totalXp: number): LevelInfo {
  let level = 1;
  let accumulatedXp = 0;
  let requiredForNext = 100;

  while (totalXp >= accumulatedXp + requiredForNext) {
    accumulatedXp += requiredForNext;
    level += 1;
    requiredForNext = level * 100;
  }

  const xpInCurrentLevel = totalXp - accumulatedXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / requiredForNext) * 100)));

  return {
    level,
    currentXp: totalXp,
    levelStartXp: accumulatedXp,
    nextLevelXp: accumulatedXp + requiredForNext,
    progressPercent
  };
}

/**
 * Generates an authentic Spider Link Code (e.g. "SPDY-8X2F").
 */
export function generateSpiderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SPDY-${randomPart}`;
}

/**
 * Validates a Spider Link Code format.
 */
export function isValidSpiderCode(code: string): boolean {
  if (!code) return false;
  const trimmed = code.trim().toUpperCase();
  return /^SPDY-[A-Z0-9]{4}$/.test(trimmed);
}

/**
 * Sighting filters.
 */
export interface SightingItem {
  id: string;
  type?: string;
  pinTypeOverride?: string;
  [key: string]: any;
}

export interface FilterOptions {
  confirmed: boolean;
  rumored: boolean;
  watchParty: boolean;
  events?: boolean;
}

export function isSightingVisible(item: SightingItem, filters: FilterOptions): boolean {
  const type = (item.pinTypeOverride || item.type || '').toLowerCase();
  if (type === 'confirmed' || type === 'official') {
    return filters.confirmed;
  }
  if (type === 'rumored' || type === 'unconfirmed') {
    return filters.rumored;
  }
  if (type.includes('watch') || type.includes('party')) {
    return filters.watchParty;
  }
  // Default to confirmed if not specified
  return filters.confirmed;
}

/**
 * Quiz scoring evaluator.
 */
export interface QuizQuestionData {
  id: string;
  correctIndex: number;
}

export function evaluateQuiz(
  questions: QuizQuestionData[],
  selectedAnswers: (number | null)[]
): { correctCount: number; total: number; scorePercent: number; xpEarned: number } {
  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (selectedAnswers[i] === questions[i].correctIndex) {
      correctCount++;
    }
  }

  const total = questions.length;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const xpEarned = correctCount * 25 + (scorePercent === 100 ? 50 : 0);

  return { correctCount, total, scorePercent, xpEarned };
}
