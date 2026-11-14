import { EventItem } from '../types';
import { EVENTS_PART_1 } from './eventsPart1';
import { EVENTS_PART_2 } from './eventsPart2';
import { EVENTS_PART_3 } from './eventsPart3';

export const INITIAL_EVENTS: EventItem[] = [
  ...EVENTS_PART_1,
  ...EVENTS_PART_2,
  ...EVENTS_PART_3
];
