/**
 * PRATYUSH KUMAR MASTER PRO - Type Definitions
 * The Future Track Computer Education
 */

export type TypingLanguage = 'english' | 'hindi';

export type TestMode = 'practice' | 'test' | 'exam' | 'lesson' | 'game';

export type BackspacePolicy = 'allowed' | 'restricted' | 'disabled';

export type SoundTheme = 'mechanical' | 'typewriter' | 'soft' | 'modern';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  batch: string;
  course: string;
  avatar: string;
  createdAt: string;
  targetWpm: number;
  targetAccuracy: number;
  totalPracticeTimeSeconds: number;
}

export interface TestResult {
  id: string;
  studentId: string;
  timestamp: string;
  language: TypingLanguage;
  durationSeconds: number;
  passageTitle: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  errorCharacters: number;
  backspaceCount: number;
  mode: TestMode;
  grade?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  weakKeys?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  category: 'home-row' | 'upper-row' | 'lower-row' | 'number-row' | 'capitals' | 'punctuation' | 'words' | 'sentences' | 'paragraphs' | 'advanced';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  targetWpm: number;
  targetAccuracy: number;
  content: string;
  keysIntroduced: string[];
}

export interface HindiLesson {
  id: string;
  title: string;
  category: 'characters' | 'matras' | 'combined' | 'words' | 'sentences' | 'paragraphs' | 'speed';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  content: string;
  inscriptGuide?: string;
  remingtonGuide?: string;
}

export interface Passage {
  id: string;
  title: string;
  language: TypingLanguage;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  content: string;
  wordCount: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  soundVolume: number;
  soundTheme: SoundTheme;
  backspacePolicy: BackspacePolicy;
  showKeyboard: boolean;
  fontSize: 'normal' | 'large' | 'huge';
  keyboardLayout: 'qwerty' | 'inscript' | 'remington';
  activeStudentId: string;
  fullscreen: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
}

export interface GameScore {
  gameId: 'falling-words' | 'type-racer' | 'word-blitz' | 'sentence-sprint' | 'keyboard-challenge' | 'survival-typing';
  studentId: string;
  score: number;
  wpm: number;
  accuracy: number;
  date: string;
  levelReached?: number;
}
