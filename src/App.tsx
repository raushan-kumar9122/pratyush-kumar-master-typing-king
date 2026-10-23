/**
 * PRATYUSH KUMAR MASTER PRO
 * Official Windows Desktop Typing Tutor & Game Software
 * Built for The Future Track Computer Education
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Play, 
  BookOpen, 
  Languages, 
  Gamepad2, 
  ShieldCheck, 
  TrendingUp, 
  Trophy, 
  Users, 
  Settings,
  Monitor
} from 'lucide-react';
import { Student, AppSettings } from './types';
import { storageService } from './services/storage';
import { soundService } from './services/sound';
import { WindowsTitleBar } from './components/common/WindowsTitleBar';
import { Dashboard } from './components/dashboard/Dashboard';
import { TypingTestEngine } from './components/test/TypingTestEngine';
import { LessonViewer } from './components/lessons/LessonViewer';
import { HindiPracticeView } from './components/hindi/HindiPracticeView';
import { TypingGamesHub } from './components/games/TypingGamesHub';
import { ExaminationMode } from './components/examination/ExaminationMode';
import { AnalyticsView } from './components/reports/AnalyticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { StudentManager } from './components/students/StudentManager';
import { SettingsView } from './components/settings/SettingsView';

type AppView = 
  | 'dashboard' 
  | 'test' 
  | 'english-lessons' 
  | 'hindi' 
  | 'games' 
  | 'exam' 
  | 'analytics' 
  | 'achievements' 
  | 'students' 
  | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const [activeStudent, setActiveStudent] = useState<Student>(storageService.getActiveStudent());
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync settings with audio service on load
  useEffect(() => {
    soundService.setMuted(!settings.soundEnabled);
    soundService.setVolume(settings.soundVolume);
    soundService.setTheme(settings.soundTheme);
  }, [settings]);

  // Handle Fullscreen F11 / ESC keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && currentView !== 'dashboard') {
        // Return to dashboard on ESC
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleSelectStudent = (id: string) => {
    storageService.setActiveStudent(id);
    const updated = storageService.getActiveStudent();
    setActiveStudent(updated);
  };

  const refreshStudentsList = () => {
    const refreshed = storageService.getStudents();
    setStudents(refreshed);
    setActiveStudent(storageService.getActiveStudent());
  };

  const NAV_ITEMS = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'test' as AppView, label: 'Start Test', icon: Play, highlight: true },
    { id: 'english-lessons' as AppView, label: 'English Lessons', icon: BookOpen },
    { id: 'hindi' as AppView, label: 'हिंदी टाइपिंग', icon: Languages },
    { id: 'games' as AppView, label: 'Typing Games', icon: Gamepad2 },
    { id: 'exam' as AppView, label: 'Examination', icon: ShieldCheck },
    { id: 'analytics' as AppView, label: 'Progress & Logs', icon: TrendingUp },
    { id: 'achievements' as AppView, label: 'Achievements', icon: Trophy },
    { id: 'students' as AppView, label: 'Students', icon: Users },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${
      settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#060c18] text-slate-100'
    }`}>
      {/* 1. Native Windows Fluent Titlebar */}
      <WindowsTitleBar
        activeStudent={activeStudent}
        allStudents={students}
        onSelectStudent={handleSelectStudent}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onOpenStudentModal={() => setCurrentView('students')}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. Main Desktop Workstation Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Windows Fluent Ribbon Sidebar Navigation */}
        <aside className="no-print w-16 md:w-56 bg-[#07101e] border-r border-sky-950/80 flex flex-col justify-between py-3 shrink-0 z-20 select-none">
          {/* Main Nav Items */}
          <div className="space-y-1 px-2">
            <div className="hidden md:block px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
              Software Menu
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                      : item.highlight
                      ? 'bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-[#0c1c33] hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Institute Badge */}
          <div className="px-2 pt-2 border-t border-sky-950 hidden md:block">
            <div className="p-2.5 rounded-xl bg-[#091728] border border-sky-900/40 text-[11px] text-slate-400">
              <div className="font-semibold text-sky-200 truncate">The Future Track</div>
              <div className="text-[10px] text-slate-400 truncate">Computer Education</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-1">● Offline Database Active</div>
            </div>
          </div>
        </aside>

        {/* 3. Primary Content Screen Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentView === 'dashboard' && (
            <Dashboard
              activeStudent={activeStudent}
              onNavigate={(view) => setCurrentView(view)}
              onStartQuickTest={() => setCurrentView('test')}
            />
          )}

          {currentView === 'test' && (
            <TypingTestEngine
              activeStudent={activeStudent}
              defaultDuration={3000}
              mode="test"
              onBackToDashboard={() => setCurrentView('dashboard')}
              settings={settings}
            />
          )}

          {currentView === 'english-lessons' && (
            <LessonViewer
              activeStudent={activeStudent}
              settings={settings}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'hindi' && (
            <HindiPracticeView
              activeStudent={activeStudent}
              settings={settings}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'games' && (
            <TypingGamesHub
              activeStudent={activeStudent}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'exam' && (
            <ExaminationMode
              activeStudent={activeStudent}
              settings={settings}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView activeStudent={activeStudent} />
          )}

          {currentView === 'achievements' && (
            <AchievementsView activeStudent={activeStudent} />
          )}

          {currentView === 'students' && (
            <StudentManager
              activeStudent={activeStudent}
              allStudents={students}
              onSelectStudent={handleSelectStudent}
              onRefreshStudents={refreshStudentsList}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
            />
          )}
        </main>
      </div>

      {/* 4. Windows Desktop Status Bar */}
      <footer className="no-print h-6 bg-[#050a14] border-t border-sky-950/80 flex items-center justify-between px-3 text-[10px] text-slate-400 font-mono select-none shrink-0 z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM READY
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">WINDOWS 10/11 x64 NATIVE</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">EN-US / HI-IN UNICODE SUPPORT</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sky-400 font-semibold">PRATYUSH KUMAR MASTER PRO</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">THE FUTURE TRACK COMPUTER EDUCATION</span>
        </div>
      </footer>
    </div>
  );
}
