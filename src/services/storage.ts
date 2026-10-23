/**
 * Local offline storage & database management for PRATYUSH KUMAR MASTER PRO
 * Uses robust local persistence with database schema versioning and backup/restore.
 */

import { Student, TestResult, AppSettings, Achievement, GameScore } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'pkmp_students_v1',
  ACTIVE_STUDENT: 'pkmp_active_student_v1',
  RESULTS: 'pkmp_results_v1',
  SETTINGS: 'pkmp_settings_v1',
  ACHIEVEMENTS: 'pkmp_achievements_v1',
  GAME_SCORES: 'pkmp_game_scores_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  soundVolume: 0.6,
  soundTheme: 'mechanical',
  backspacePolicy: 'allowed',
  showKeyboard: true,
  fontSize: 'normal',
  keyboardLayout: 'qwerty',
  activeStudentId: 'ft-student-1',
  fullscreen: false,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_test', title: 'First Keystroke', description: 'Complete your first typing test or lesson.', icon: '🎯', unlockedAt: '2026-10-20T10:00:00.000Z', requirement: '1 Completed Test' },
  { id: 'wpm_20', title: 'Novice Typist', description: 'Achieve a typing speed of 20 WPM or higher.', icon: '🌱', unlockedAt: '2026-10-20T10:15:00.000Z', requirement: '20+ WPM' },
  { id: 'wpm_40', title: 'Skilled Operator', description: 'Achieve a typing speed of 40 WPM or higher.', icon: '⚡', unlockedAt: '2026-10-21T11:30:00.000Z', requirement: '40+ WPM' },
  { id: 'wpm_60', title: 'Speedster Pro', description: 'Achieve a typing speed of 60 WPM or higher.', icon: '🚀', unlockedAt: null, requirement: '60+ WPM' },
  { id: 'wpm_80', title: 'Master of Keys', description: 'Achieve an elite typing speed of 80 WPM or higher.', icon: '👑', unlockedAt: null, requirement: '80+ WPM' },
  { id: 'acc_95', title: 'Eagle Accuracy', description: 'Complete a test with 95% or higher accuracy.', icon: '🎯', unlockedAt: '2026-10-21T11:30:00.000Z', requirement: '95%+ Accuracy' },
  { id: 'streak_7', title: 'Dedicated Scholar', description: 'Maintain a 7-day typing practice streak.', icon: '🔥', unlockedAt: null, requirement: '7 Consecutive Days' },
  { id: 'personal_best', title: 'Breaking Limits', description: 'Set a new personal high score in speed.', icon: '🏆', unlockedAt: '2026-10-22T09:40:00.000Z', requirement: 'Improve Personal Best' },
  { id: 'hindi_warrior', title: 'Devanagari Master', description: 'Complete a Hindi typing test with 90%+ accuracy.', icon: '🇮🇳', unlockedAt: null, requirement: 'Hindi 90%+ Acc' },
  { id: 'exam_cert', title: 'Institute Certified', description: 'Pass an official Examination Mode test with Grade A or A+.', icon: '📜', unlockedAt: null, requirement: 'Exam Grade A/A+' },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'ft-student-1',
    rollNo: 'FT-2026-001',
    name: 'Pratyush Kumar',
    batch: 'Morning 09:00 AM - 10:30 AM',
    course: 'Diploma in Computer Application (DCA) & Typing',
    avatar: '👨‍🎓',
    createdAt: '2026-10-15T08:00:00.000Z',
    targetWpm: 50,
    targetAccuracy: 95,
    totalPracticeTimeSeconds: 4320,
  },
  {
    id: 'ft-student-2',
    rollNo: 'FT-2026-014',
    name: 'Ananya Sharma',
    batch: 'Afternoon 02:00 PM - 03:30 PM',
    course: 'ADCA Pro & Hindi/English Typing',
    avatar: '👩‍🎓',
    createdAt: '2026-10-18T09:00:00.000Z',
    targetWpm: 45,
    targetAccuracy: 96,
    totalPracticeTimeSeconds: 2800,
  },
];

const INITIAL_RESULTS: TestResult[] = [
  {
    id: 'res-1',
    studentId: 'ft-student-1',
    timestamp: '2026-10-20T10:15:00.000Z',
    language: 'english',
    durationSeconds: 60,
    passageTitle: 'Home Row Fundamental Mastery',
    grossWpm: 34,
    netWpm: 31,
    accuracy: 94.2,
    totalCharacters: 170,
    correctCharacters: 160,
    errorCharacters: 10,
    backspaceCount: 4,
    mode: 'test',
    grade: 'B',
    weakKeys: ['g', 'h'],
  },
  {
    id: 'res-2',
    studentId: 'ft-student-1',
    timestamp: '2026-10-21T11:30:00.000Z',
    language: 'english',
    durationSeconds: 120,
    passageTitle: 'The Future of Computer Technology',
    grossWpm: 43,
    netWpm: 41,
    accuracy: 97.6,
    totalCharacters: 430,
    correctCharacters: 420,
    errorCharacters: 10,
    backspaceCount: 8,
    mode: 'test',
    grade: 'A',
    weakKeys: ['p', 'b'],
  },
  {
    id: 'res-3',
    studentId: 'ft-student-1',
    timestamp: '2026-10-22T09:40:00.000Z',
    language: 'english',
    durationSeconds: 60,
    passageTitle: 'Effective Communication and Speed',
    grossWpm: 48,
    netWpm: 46,
    accuracy: 96.8,
    totalCharacters: 240,
    correctCharacters: 232,
    errorCharacters: 8,
    backspaceCount: 5,
    mode: 'test',
    grade: 'A',
    weakKeys: ['q', 'z'],
  },
  {
    id: 'res-4',
    studentId: 'ft-student-1',
    timestamp: '2026-10-22T14:20:00.000Z',
    language: 'hindi',
    durationSeconds: 60,
    passageTitle: 'कंप्यूटर शिक्षा का महत्व',
    grossWpm: 28,
    netWpm: 25,
    accuracy: 92.5,
    totalCharacters: 140,
    correctCharacters: 130,
    errorCharacters: 10,
    backspaceCount: 6,
    mode: 'practice',
    grade: 'C',
    weakKeys: ['्', 'ं'],
  },
];

class StorageService {
  // Students
  public getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  public saveStudent(student: Student) {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  public deleteStudent(id: string) {
    const students = this.getStudents().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  public getActiveStudent(): Student {
    const students = this.getStudents();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || students[0]?.id;
    const found = students.find((s) => s.id === activeId);
    return found || students[0] || INITIAL_STUDENTS[0];
  }

  public setActiveStudent(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, id);
    const settings = this.getSettings();
    settings.activeStudentId = id;
    this.saveSettings(settings);
  }

  // Results
  public getResults(studentId?: string): TestResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      let results: TestResult[] = data ? JSON.parse(data) : INITIAL_RESULTS;
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(INITIAL_RESULTS));
      }
      if (studentId) {
        results = results.filter((r) => r.studentId === studentId);
      }
      return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return INITIAL_RESULTS;
    }
  }

  public addResult(result: TestResult) {
    const results = this.getResults();
    results.unshift(result);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));

    // Update student practice time
    const student = this.getActiveStudent();
    if (student && student.id === result.studentId) {
      student.totalPracticeTimeSeconds = (student.totalPracticeTimeSeconds || 0) + result.durationSeconds;
      this.saveStudent(student);
    }

    // Check for new achievements
    this.checkAchievements(result);
  }

  // Settings
  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Achievements
  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
        return INITIAL_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public unlockAchievement(id: string): boolean {
    const achievements = this.getAchievements();
    const item = achievements.find((a) => a.id === id);
    if (item && !item.unlockedAt) {
      item.unlockedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return true;
    }
    return false;
  }

  private checkAchievements(result: TestResult) {
    this.unlockAchievement('first_test');
    if (result.netWpm >= 20) this.unlockAchievement('wpm_20');
    if (result.netWpm >= 40) this.unlockAchievement('wpm_40');
    if (result.netWpm >= 60) this.unlockAchievement('wpm_60');
    if (result.netWpm >= 80) this.unlockAchievement('wpm_80');
    if (result.accuracy >= 95) this.unlockAchievement('acc_95');
    if (result.language === 'hindi' && result.accuracy >= 90) this.unlockAchievement('hindi_warrior');
    if (result.mode === 'exam' && (result.grade === 'A+' || result.grade === 'A')) {
      this.unlockAchievement('exam_cert');
    }

    // Check personal best
    const studentResults = this.getResults(result.studentId);
    const maxOtherWpm = Math.max(...studentResults.filter((r) => r.id !== result.id).map((r) => r.netWpm), 0);
    if (result.netWpm > maxOtherWpm && maxOtherWpm > 0) {
      this.unlockAchievement('personal_best');
    }
  }

  // Game Scores
  public getGameScores(gameId?: string): GameScore[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_SCORES);
      let scores: GameScore[] = data ? JSON.parse(data) : [];
      if (gameId) {
        scores = scores.filter((s) => s.gameId === gameId);
      }
      return scores.sort((a, b) => b.score - a.score);
    } catch {
      return [];
    }
  }

  public saveGameScore(score: GameScore) {
    const scores = this.getGameScores();
    scores.push(score);
    localStorage.setItem(STORAGE_KEYS.GAME_SCORES, JSON.stringify(scores));
  }

  // Backup & Restore
  public exportFullBackup(): string {
    const backupData = {
      version: '3.4.12',
      exportedAt: new Date().toISOString(),
      institution: 'The Future Track Computer Education',
      students: this.getStudents(),
      results: this.getResults(),
      achievements: this.getAchievements(),
      settings: this.getSettings(),
      gameScores: this.getGameScores(),
    };
    return JSON.stringify(backupData, null, 2);
  }

  public importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.students || !Array.isArray(data.students)) {
        return { success: false, message: 'Invalid backup file structure: missing student records.' };
      }
      if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      if (data.results) localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(data.results));
      if (data.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.gameScores) localStorage.setItem(STORAGE_KEYS.GAME_SCORES, JSON.stringify(data.gameScores));
      return { success: true, message: `Successfully restored backup from ${new Date(data.exportedAt || Date.now()).toLocaleDateString()}!` };
    } catch (e: unknown) {
      return { success: false, message: `Failed to restore database: ${(e as Error).message}` };
    }
  }
}

export const storageService = new StorageService();
