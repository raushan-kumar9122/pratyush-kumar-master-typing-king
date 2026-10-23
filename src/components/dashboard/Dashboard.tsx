/**
 * Main Dashboard Component for PRATYUSH KUMAR MASTER PRO
 * The Future Track Computer Education
 * Real statistics, quick actions, performance charts, and intuitive navigation.
 */

import React from 'react';
import { 
  Play, 
  BookOpen, 
  Languages, 
  Gamepad2, 
  Layers, 
  History, 
  TrendingUp, 
  Trophy, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Target, 
  Clock, 
  Award,
  ChevronRight,
  Flame,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { Student, AppSettings, TestResult } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  activeStudent: Student;
  onNavigate: (view: 'test' | 'english-lessons' | 'hindi' | 'games' | 'exam' | 'analytics' | 'achievements' | 'students' | 'settings') => void;
  onStartQuickTest: () => void;
}

export const Dashboard: React.FC<Props> = ({
  activeStudent,
  onNavigate,
  onStartQuickTest,
}) => {
  const results = storageService.getResults(activeStudent.id);
  const achievements = storageService.getAchievements();

  // Calculate REAL statistics
  const totalTests = results.length;
  const bestWpm = Math.max(...results.map((r) => r.netWpm), 0);
  const latestResult = results[0] as TestResult | undefined;
  const latestWpm = latestResult ? latestResult.netWpm : 0;
  const avgAccuracy = totalTests > 0
    ? Math.round(results.reduce((a, b) => a + b.accuracy, 0) / totalTests)
    : 100;
  const totalPracticeSeconds = (activeStudent.totalPracticeTimeSeconds || 0) + 
    results.reduce((acc, r) => acc + (r.durationSeconds || 0), 0);
  const totalPracticeMinutes = Math.round(totalPracticeSeconds / 60);

  // Dynamic Level Calculation
  let currentLevel = 'Level 1: Novice';
  let levelProgress = 20;
  if (bestWpm >= 80 && avgAccuracy >= 95) {
    currentLevel = 'Level 5: Grandmaster';
    levelProgress = 100;
  } else if (bestWpm >= 60 && avgAccuracy >= 92) {
    currentLevel = 'Level 4: Master';
    levelProgress = 85;
  } else if (bestWpm >= 40 && avgAccuracy >= 90) {
    currentLevel = 'Level 3: Specialist';
    levelProgress = 65;
  } else if (bestWpm >= 25) {
    currentLevel = 'Level 2: Apprentice';
    levelProgress = 40;
  }

  const unlockedBadges = achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <div className="flex flex-col h-full bg-[#081220] p-4 sm:p-6 text-slate-100 overflow-y-auto">
      {/* Top Welcome Banner */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a1e38] via-[#0d284a] to-[#071526] border border-sky-800/60 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-4xl shadow-lg border border-sky-300/30">
              {activeStudent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                  Welcome back, {activeStudent.name}!
                </h1>
                <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700/80 text-sky-300 font-mono text-xs">
                  {activeStudent.rollNo}
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-1">
                The Future Track Computer Education | {activeStudent.course}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-semibold">
                  {currentLevel}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Target: <strong className="text-sky-300">{activeStudent.targetWpm} WPM</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={onStartQuickTest}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-xl shadow-sky-500/20 transition-all cursor-pointer transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start 50-Min Test (टोटल 50 मिनट टेस्ट)</span>
            </button>

            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#091a32] hover:bg-[#112a4e] border border-emerald-600/60 text-emerald-300 font-semibold text-xs transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Examination Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 REAL Metric Cards (No Fake Statistics) */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {/* Best WPM */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Best Speed</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono mt-1">
            {bestWpm}
          </div>
          <div className="text-[10px] text-sky-300/80 font-mono">NET WPM</div>
        </div>

        {/* Latest WPM */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Latest Speed</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono mt-1">
            {latestWpm}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">NET WPM</div>
        </div>

        {/* Average Accuracy */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Avg Accuracy</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
            {avgAccuracy}%
          </div>
          <div className="text-[10px] text-emerald-300/80 font-mono">PRECISION</div>
        </div>

        {/* Total Tests */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Total Tests</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
            {totalTests}
          </div>
          <div className="text-[10px] text-amber-300/80 font-mono">COMPLETED</div>
        </div>

        {/* Total Practice Time */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Practice Time</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono mt-1">
            {totalPracticeMinutes}m
          </div>
          <div className="text-[10px] text-indigo-300/80 font-mono">TIME LOGGED</div>
        </div>

        {/* Achievements */}
        <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 shadow-lg text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Badges</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
            {unlockedBadges}
          </div>
          <div className="text-[10px] text-purple-300/80 font-mono">UNLOCKED</div>
        </div>
      </div>

      {/* Main Core Modules Grid */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-heading font-semibold text-white">
            Core Learning & Assessment Modules
          </h2>
          <span className="text-xs text-sky-400 font-mono">Select a program</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: English Typing */}
          <div
            onClick={() => onNavigate('english-lessons')}
            className="group p-5 rounded-2xl bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 cursor-pointer transition-all shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                English Typing Lessons
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step curriculum: Home Row, Upper & Lower Row, Numbers, Capitals, and Advanced.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400">
              <span>Explore Curriculum</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Hindi Typing */}
          <div
            onClick={() => onNavigate('hindi')}
            className="group p-5 rounded-2xl bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 cursor-pointer transition-all shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                हिंदी टाइपिंग (Unicode)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                यूनिकोड इंस्क्रिप्ट एवं रेमिंगटन गेल लेआउट, मात्राएं, संयुक्त वर्ण, एवं स्पीड टेस्ट।
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>हिंदी अभ्यास खोलें</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Typing Games */}
          <div
            onClick={() => onNavigate('games')}
            className="group p-5 rounded-2xl bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 cursor-pointer transition-all shadow-lg hover:shadow-sky-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                6 Typing Games Arcade
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Falling Words, Type Racer, Word Blitz, Sentence Sprint, Keyboard Challenge & Survival.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>Play Arcade Games</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Official Examination */}
          <div
            onClick={() => onNavigate('exam')}
            className="group p-5 rounded-2xl bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-emerald-400/60 cursor-pointer transition-all shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                Institute Examination
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Supervised exam with disabled Backspace, locked duration, marksheet, and certificates.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Enter Exam Terminal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Modules & Recent History Bar */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 pb-6">
        {/* Left: Quick Navigation Links */}
        <div className="p-5 rounded-2xl bg-[#071322] border border-sky-900/60 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Institute Tools & Records
          </div>

          <button
            onClick={() => onNavigate('analytics')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#091628] hover:bg-[#0f233f] text-xs text-slate-200 transition-colors border border-sky-950"
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span className="font-medium">Analytics & Progress Charts</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onNavigate('students')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#091628] hover:bg-[#0f233f] text-xs text-slate-200 transition-colors border border-sky-950"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Student Management & Targets</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#091628] hover:bg-[#0f233f] text-xs text-slate-200 transition-colors border border-sky-950"
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Achievements & Badges</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#091628] hover:bg-[#0f233f] text-xs text-slate-200 transition-colors border border-sky-950"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">Audio, Theme & Database Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Right: Recent Test Feed */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#071322] border border-sky-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-950 mb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                <span>Recent Practice Sessions</span>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
              >
                View Full Log ➔
              </button>
            </div>

            <div className="space-y-2">
              {results.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-[#091728] border border-sky-950 flex items-center justify-between text-xs"
                >
                  <div className="truncate max-w-[220px] sm:max-w-[320px]">
                    <div className="font-medium text-white truncate">{r.passageTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(r.timestamp).toLocaleDateString()} • {r.durationSeconds}s • <span className="capitalize">{r.language}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-bold text-sky-400 font-mono text-sm">{r.netWpm} WPM</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{r.accuracy}% Acc</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-amber-300 font-bold font-mono text-[10px]">
                      {r.grade || 'A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
