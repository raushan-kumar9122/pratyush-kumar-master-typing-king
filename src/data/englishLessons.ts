/**
 * Structured English typing lessons for PRATYUSH KUMAR MASTER PRO
 * Complete pedagogical curriculum from Home Row to Advanced Speed passages.
 */

import { Lesson } from '../types';

export const ENGLISH_LESSONS: Lesson[] = [
  // 1. Home Row
  {
    id: 'eng-1',
    title: 'Lesson 1: Left Hand Home Row (A S D F)',
    category: 'home-row',
    level: 'beginner',
    description: 'Anchor your left hand: Pinky on A, Ring on S, Middle on D, Index on F.',
    targetWpm: 15,
    targetAccuracy: 92,
    keysIntroduced: ['a', 's', 'd', 'f', ' '],
    content: 'aaa sss ddd fff asdf asdf asdf fdsa fdsa aass ddff asdf asdf fdas dafs asdf fdsa fads asdf'
  },
  {
    id: 'eng-2',
    title: 'Lesson 2: Right Hand Home Row (J K L ;)',
    category: 'home-row',
    level: 'beginner',
    description: 'Anchor your right hand: Index on J, Middle on K, Ring on L, Pinky on semicolon.',
    targetWpm: 18,
    targetAccuracy: 92,
    keysIntroduced: ['j', 'k', 'l', ';', ' '],
    content: 'jjj kkk lll ;;; jkl; jkl; ;lkj ;lkj jjkk ll;; jkl; ;lkj kllj lkjj ;ljk jkl; ;lkj'
  },
  {
    id: 'eng-3',
    title: 'Lesson 3: Complete Home Row (A S D F G H J K L ;)',
    category: 'home-row',
    level: 'beginner',
    description: 'Reach index fingers inward: Left Index to G, Right Index to H.',
    targetWpm: 22,
    targetAccuracy: 94,
    keysIntroduced: ['g', 'h'],
    content: 'asdf g hjkl; asdfg hjkl; gaga haha flag flash glad half fall salad dash glass slag flask glad fall hall'
  },

  // 2. Upper Row
  {
    id: 'eng-4',
    title: 'Lesson 4: Upper Row Left Hand (Q W E R T)',
    category: 'upper-row',
    level: 'beginner',
    description: 'Reach up from home keys with left hand fingers.',
    targetWpm: 24,
    targetAccuracy: 92,
    keysIntroduced: ['q', 'w', 'e', 'r', 't'],
    content: 'qwert qwert sweet treat water refer quest draw raw wear fast water trade great sweet waste reset target'
  },
  {
    id: 'eng-5',
    title: 'Lesson 5: Upper Row Right Hand (Y U I O P)',
    category: 'upper-row',
    level: 'beginner',
    description: 'Reach up from home keys with right hand fingers.',
    targetWpm: 25,
    targetAccuracy: 92,
    keysIntroduced: ['y', 'u', 'i', 'o', 'p'],
    content: 'yuiop yuiop polo poll loop your pour pulp your plot output equip union supply pretty youth poetry pilot'
  },

  // 3. Lower Row
  {
    id: 'eng-6',
    title: 'Lesson 6: Lower Row (Z X C V B N M , . /)',
    category: 'lower-row',
    level: 'intermediate',
    description: 'Reach downward smoothly without shifting your wrist anchor.',
    targetWpm: 28,
    targetAccuracy: 93,
    keysIntroduced: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    content: 'zxcvb nm,./ zoom climb vibrant exact novel bronze maximum vocal balance matrix carbon zero dynamic visual'
  },

  // 4. Number Row
  {
    id: 'eng-7',
    title: 'Lesson 7: Top Number Row (1 2 3 4 5 6 7 8 9 0)',
    category: 'number-row',
    level: 'intermediate',
    description: 'Extend fingers to the number keys with accuracy and rhythm.',
    targetWpm: 25,
    targetAccuracy: 90,
    keysIntroduced: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    content: '102 304 506 708 901 1984 2026 54321 67890 12345 98760 1029 3847 5610 2026 404 8080 3000'
  },

  // 5. Capital Letters & Shift
  {
    id: 'eng-8',
    title: 'Lesson 8: Shift Keys & Proper Nouns',
    category: 'capitals',
    level: 'intermediate',
    description: 'Hold opposite Shift key with pinky while striking the target letter.',
    targetWpm: 32,
    targetAccuracy: 94,
    keysIntroduced: ['Shift'],
    content: 'India Delhi London Tokyo New York Future Track Computer Education Pratyush Kumar Microsoft Windows Apple Linux Google'
  },

  // 6. Punctuation
  {
    id: 'eng-9',
    title: 'Lesson 9: Punctuation Marks & Symbols',
    category: 'punctuation',
    level: 'intermediate',
    description: 'Master commas, periods, quotes, exclamation marks, and hyphens.',
    targetWpm: 30,
    targetAccuracy: 92,
    keysIntroduced: ['!', '?', '"', '\'', '-', ';', ':'],
    content: 'Ready, set, go! "Practice makes perfect." Don\'t give up; keep typing! Are you ready? High-speed typing is a valuable skill.'
  },

  // 7. Frequent Words
  {
    id: 'eng-10',
    title: 'Lesson 10: Top 100 Common English Words',
    category: 'words',
    level: 'intermediate',
    description: 'Build muscle memory for the most frequent English word patterns.',
    targetWpm: 40,
    targetAccuracy: 95,
    keysIntroduced: ['all'],
    content: 'the of and to a in that is was he for it with as his on be at by this had have from or one had by not but what all were when we there can an your which their if will each about'
  },

  // 8. Sentences
  {
    id: 'eng-11',
    title: 'Lesson 11: Fluency & Sentence Flow',
    category: 'sentences',
    level: 'advanced',
    description: 'Type continuous sentences with balanced cadence and rhythm.',
    targetWpm: 45,
    targetAccuracy: 96,
    keysIntroduced: ['all'],
    content: 'The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step. Continuous effort, not strength or intelligence, is the key to unlocking our potential.'
  },

  // 9. Paragraphs
  {
    id: 'eng-12',
    title: 'Lesson 12: Professional Office Typing',
    category: 'paragraphs',
    level: 'advanced',
    description: 'Simulate business office correspondence and reports.',
    targetWpm: 50,
    targetAccuracy: 96,
    keysIntroduced: ['all'],
    content: 'We are pleased to inform you that the Computer Education training module has been successfully finalized. All students must complete their daily typing assignments with high accuracy and speed before appearing for the institute certification examination.'
  },

  // 10. Advanced
  {
    id: 'eng-13',
    title: 'Lesson 13: Elite Master Speed Passage',
    category: 'advanced',
    level: 'expert',
    description: 'High difficulty passage featuring complex vocabulary, punctuation, and pacing.',
    targetWpm: 65,
    targetAccuracy: 97,
    keysIntroduced: ['all'],
    content: 'Proficiency in computer keyboard ergonomics and high-velocity transcription represents a cornerstone for modern administrative, clerical, and software engineering professions. Daily disciplined practice on Pratyush Kumar Master Pro guarantees measurable enhancement in both gross cadence and net analytical precision.'
  }
];
