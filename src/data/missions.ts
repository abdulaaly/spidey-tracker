export interface MissionItem {
  id: string;
  title: string;
  description: string;
  category: 'DAILY' | 'SPECIAL OPS' | 'WORLDWIDE' | 'TRIVIA';
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'm1',
    title: 'SCAN SPIDEY SIGHTINGS',
    description: 'Inspect at least 3 active Spider-Man sightings on the global radar map.',
    category: 'DAILY',
    target: 3,
    current: 1,
    xpReward: 50,
    completed: false
  },
  {
    id: 'm2',
    title: 'MULTIVERSE TRIVIA RECON',
    description: 'Score 100% on a Multiverse Spider-Man intelligence quiz.',
    category: 'TRIVIA',
    target: 1,
    current: 0,
    xpReward: 75,
    completed: false
  },
  {
    id: 'm3',
    title: 'INSPECT VILLAIN DOSSIERS',
    description: 'Open the Web Watch 1.5 terminal and review intel on Punisher & Scorpion.',
    category: 'SPECIAL OPS',
    target: 2,
    current: 0,
    xpReward: 60,
    completed: false
  },
  {
    id: 'm4',
    title: 'GLOBAL TOUR TRACKING',
    description: 'Fly to at least 2 premiere tour activations across EMEA or APAC.',
    category: 'WORLDWIDE',
    target: 2,
    current: 0,
    xpReward: 80,
    completed: false
  },
  {
    id: 'm5',
    title: 'CYCLE WORLDWIDE SPIDERS',
    description: 'Cycle camera through 5 active Spiders across the international network.',
    category: 'DAILY',
    target: 5,
    current: 2,
    xpReward: 100,
    completed: false
  }
];

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  category: string;
  questions: QuizQuestion[];
}

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: 'bnd_intel',
    title: 'SPIDER-MAN: BRAND NEW DAY INTEL',
    category: 'CINEMATIC UNIVERSE',
    questions: [
      {
        id: 'q1',
        prompt: 'In Spider-Man: Brand New Day, who runs the Web Watch 1.5 intelligence terminal?',
        options: ['The Daily Bugle', 'NYPD Special Anti-Vigilante Taskforce', 'Oscorp Intelligence', 'Stark Industries Security'],
        correctIndex: 1,
        explanation: 'Captain Jean DeWolff and NYPD detectives operate the Web Watch unit monitoring masked vigilantes.'
      },
      {
        id: 'q2',
        prompt: 'Which villain dossier is categorized as an Australian boomerang assassin?',
        options: ['Fred Myers / Boomerang', 'Mac Gargan / Scorpion', 'Frank Castle', 'Black Tarantula'],
        correctIndex: 0,
        explanation: 'Fred Myers aka Boomerang is the Australian ex-baseball pitcher turned projectile assassin.'
      },
      {
        id: 'q3',
        prompt: 'What was the first movie premiere drone light show in history to light up the Great Pyramids of Giza?',
        options: ['Spider-Man: Brand New Day', 'Avengers: Endgame', 'No Way Home', 'Across the Spider-Verse'],
        correctIndex: 0,
        explanation: 'Spider-Man: Brand New Day lit up the skies above the Great Pyramids of Giza with a 1,000 drone fleet.'
      }
    ]
  },
  {
    id: 'multiverse_tech',
    title: 'SPIDER-VERSE TECH & SUITS',
    category: 'SUIT ARSENAL',
    questions: [
      {
        id: 'q1',
        prompt: 'What material powers Miguel O’Hara’s Spider-Man 2099 suit?',
        options: ['Vibranium Weave', 'Unstable Molecular Fabric', 'Kevlar Poly-blend', 'Carbon Nanotubes'],
        correctIndex: 1,
        explanation: 'Spider-Man 2099 wears unstable molecular fabric with light-byte cape foil.'
      },
      {
        id: 'q2',
        prompt: 'How does Big Time Stealth suit avoid detection?',
        options: ['Bends light and sound waves around wearer', 'Active thermal camouflage', 'Electromagnetic cloaking', 'Sonic baffles only'],
        correctIndex: 0,
        explanation: 'Peter created the Stealth Suit at Horizon Labs to bend light and sound, warping waves around the suit.'
      },
      {
        id: 'q3',
        prompt: 'Which Spider uses an organic venom bio-electric blast?',
        options: ['Peter Parker', 'Miles Morales', 'Ben Reilly', 'Billy Braddock'],
        correctIndex: 1,
        explanation: 'Miles Morales generates bio-electric venom blasts capable of paralyzing opponents and neutralizing tech.'
      }
    ]
  }
];
