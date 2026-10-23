/**
 * Windows 10/11 Fluent Title Bar Component for PRATYUSH KUMAR MASTER PRO
 * Provides desktop application window chrome, student switcher, offline indicator, and controls.
 */

import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize as MinimizeIcon,
  WifiOff, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown,
  Monitor
} from 'lucide-react';
import { Student, AppSettings } from '../../types';
import { soundService } from '../../services/sound';

interface Props {
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onOpenStudentModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const WindowsTitleBar: React.FC<Props> = ({
  activeStudent,
  allStudents,
  onSelectStudent,
  settings,
  onUpdateSettings,
  onOpenStudentModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const toggleSound = () => {
    const newVal = !settings.soundEnabled;
    soundService.setMuted(!newVal);
    onUpdateSettings({ ...settings, soundEnabled: newVal });
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  return (
    <header className="no-print h-10 bg-[#070e1e] border-b border-sky-950/80 flex items-center justify-between px-3 text-xs select-none z-50 sticky top-0">
      {/* Left: App Identity & Window Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-sm text-[11px] font-bold text-white tracking-tighter">
          PK
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100 tracking-wide font-heading hidden sm:inline">
            PRATYUSH KUMAR MASTER PRO
          </span>
          <span className="text-sky-400/80 hidden md:inline font-mono text-[11px]">
            | The Future Track Computer Education
          </span>
          <span className="px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 text-[10px] border border-sky-800/40 font-mono hidden lg:inline">
            v3.4.12 Native Win32/64
          </span>
        </div>
      </div>

      {/* Middle: Status Pills (Offline & Active Student) */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px]">
          <WifiOff className="w-3 h-3" />
          <span>100% Offline Mode</span>
        </div>

        {/* Student Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStudentMenu(!showStudentMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b192c] hover:bg-[#132742] text-slate-200 border border-sky-900/50 transition-colors"
            title="Switch Active Student"
          >
            <span className="text-sm">{activeStudent.avatar}</span>
            <span className="font-medium truncate max-w-[110px] sm:max-w-[140px] text-sky-100">
              {activeStudent.name}
            </span>
            <span className="text-[10px] text-sky-400 font-mono hidden md:inline">
              ({activeStudent.rollNo})
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {showStudentMenu && (
            <div 
              className="absolute right-0 mt-1 w-64 bg-[#0a1526] border border-sky-800/60 rounded-md shadow-2xl py-1 z-50 backdrop-blur-md"
              onMouseLeave={() => setShowStudentMenu(false)}
            >
              <div className="px-3 py-1.5 border-b border-sky-950 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Select Enrolled Student</span>
                <span className="text-sky-400 font-mono">{allStudents.length} Profiles</span>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {allStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectStudent(st.id);
                      setShowStudentMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between text-xs hover:bg-sky-900/40 transition-colors ${
                      st.id === activeStudent.id ? 'bg-sky-950/80 text-sky-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{st.avatar}</span>
                      <div className="truncate">
                        <div className="truncate">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.rollNo}</div>
                      </div>
                    </div>
                    {st.id === activeStudent.id && <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-sky-950 p-1">
                <button
                  onClick={() => {
                    setShowStudentMenu(false);
                    onOpenStudentModal();
                  }}
                  className="w-full text-center py-1 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-900/30 rounded font-medium transition-colors"
                >
                  + Add / Manage Students
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Sound, Theme, Fullscreen, and Windows Chrome Controls */}
      <div className="flex items-center">
        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-sky-950/50 rounded transition-colors mr-1"
          title={settings.soundEnabled ? 'Mute Keyboard Sounds' : 'Enable Keyboard Sounds'}
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-sky-950/50 rounded transition-colors mr-1"
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-sky-950/50 rounded transition-colors mr-2"
          title={isFullscreen ? 'Exit Full Screen (ESC)' : 'Full Screen Typing Mode (F11)'}
        >
          {isFullscreen ? <MinimizeIcon className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>

        {/* Simulated Windows Window Buttons */}
        <div className="flex items-center h-10 border-l border-sky-950/80 pl-1 -mr-3">
          <button 
            className="w-9 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
            title="Minimize Window"
            onClick={() => {}}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            className="w-9 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
            title={isFullscreen ? 'Restore' : 'Maximize'}
            onClick={onToggleFullscreen}
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
            title="Close Application"
            onClick={() => {
              if (window.confirm('Do you want to close PRATYUSH KUMAR MASTER PRO? All student progress is safely stored locally.')) {
                // simulated window close
              }
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
