/**
 * Settings and Application Preferences View for PRATYUSH KUMAR MASTER PRO
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Keyboard, 
  Monitor, 
  HardDrive, 
  Save, 
  Check, 
  RotateCcw,
  VolumeX,
  Sparkles,
  Command
} from 'lucide-react';
import { AppSettings, SoundTheme, BackspacePolicy } from '../../types';
import { soundService } from '../../services/sound';
import { storageService } from '../../services/storage';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetAllData?: () => void;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const handleSave = () => {
    storageService.saveSettings(localSettings);
    soundService.setMuted(!localSettings.soundEnabled);
    soundService.setVolume(localSettings.soundVolume);
    soundService.setTheme(localSettings.soundTheme);
    onUpdateSettings(localSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestSound = (theme: SoundTheme) => {
    soundService.setTheme(theme);
    soundService.playKeypress(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Settings className="w-4 h-4" />
              <span>Application Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              System Settings & Ergonomics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Customize keystroke acoustics, exam strictness rules, and desktop environment options.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            {saveToast ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveToast ? 'Settings Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="max-w-4xl w-full mx-auto space-y-6 pb-12">
        {/* 1. Acoustic Sound Engine */}
        <div className="p-6 rounded-2xl bg-[#071322] border border-sky-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-950">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">Keyboard Acoustics Engine</h3>
                <p className="text-xs text-slate-400">Procedural zero-latency audio synthesized via Web Audio API.</p>
              </div>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, soundEnabled: !localSettings.soundEnabled })}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
                localSettings.soundEnabled
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-700 text-rose-300'
              }`}
            >
              {localSettings.soundEnabled ? 'Audio Active' : 'Muted'}
            </button>
          </div>

          {/* Sound Themes */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Mechanical Switch Acoustic Profile</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'mechanical', name: 'Cherry MX Blue', desc: 'Crisp tactile click' },
                { id: 'typewriter', name: 'Royal Typewriter', desc: 'Heavy chassis clack' },
                { id: 'soft', name: 'Silent Membrane', desc: 'Gentle laptop bubble' },
                { id: 'modern', name: 'Digital Sci-Fi', desc: 'Futuristic blip' },
              ].map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => {
                    setLocalSettings({ ...localSettings, soundTheme: theme.id as SoundTheme });
                    handleTestSound(theme.id as SoundTheme);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    localSettings.soundTheme === theme.id
                      ? 'bg-sky-500/15 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-[#06101d] border-sky-950 hover:border-sky-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-white flex items-center justify-between">
                    <span>{theme.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{theme.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span>Keystroke Volume</span>
              <span className="text-sky-300">{Math.round(localSettings.soundVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localSettings.soundVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setLocalSettings({ ...localSettings, soundVolume: vol });
                soundService.setVolume(vol);
              }}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-[#050e18] rounded-lg"
            />
          </div>
        </div>

        {/* 2. Typing Practice & Examination Rules */}
        <div className="p-6 rounded-2xl bg-[#071322] border border-sky-900/60 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sky-950">
            <Keyboard className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-heading font-semibold text-white text-sm">Typing Rules & Examination Protocol</h3>
              <p className="text-xs text-slate-400">Configure default Backspace policy and on-screen keyboard guidance.</p>
            </div>
          </div>

          {/* Backspace Policy */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Default Backspace Policy</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'allowed', name: 'Free Backspace', desc: 'Can freely correct errors anytime' },
                { id: 'restricted', name: 'Restricted Backspace', desc: 'Cannot backspace across word boundary' },
                { id: 'disabled', name: 'Strictly Disabled', desc: 'No corrections permitted (Exam rule)' },
              ].map((pol) => (
                <div
                  key={pol.id}
                  onClick={() => setLocalSettings({ ...localSettings, backspacePolicy: pol.id as BackspacePolicy })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    localSettings.backspacePolicy === pol.id
                      ? 'bg-sky-500/15 border-sky-400'
                      : 'bg-[#06101d] border-sky-950 hover:border-sky-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{pol.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{pol.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Show Virtual Keyboard Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-medium text-white">Show Virtual On-Screen Keyboard by Default</div>
              <div className="text-[11px] text-slate-400">Displays real-time tactile finger placement guide below test text.</div>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, showKeyboard: !localSettings.showKeyboard })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                localSettings.showKeyboard ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                localSettings.showKeyboard ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* 3. Keyboard Shortcuts Reference */}
        <div className="p-6 rounded-2xl bg-[#071322] border border-sky-900/60 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-sky-950">
            <Command className="w-5 h-5 text-sky-400" />
            <h3 className="font-heading font-semibold text-white text-sm">Windows Desktop Keyboard Shortcuts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06101d] border border-sky-950 font-mono">
              <span className="text-slate-400">Toggle Fullscreen Mode:</span>
              <kbd className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">F11</kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06101d] border border-sky-950 font-mono">
              <span className="text-slate-400">Hindi / English IME Switch:</span>
              <kbd className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">Alt + Shift</kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06101d] border border-sky-950 font-mono">
              <span className="text-slate-400">Cancel / Exit Current View:</span>
              <kbd className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">Esc</kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06101d] border border-sky-950 font-mono">
              <span className="text-slate-400">Instant Restart Test:</span>
              <kbd className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">Ctrl + R</kbd>
            </div>
          </div>
        </div>

        {/* 4. Local Database Storage & Maintenance */}
        <div className="p-6 rounded-2xl bg-[#071322] border border-sky-900/60 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-sky-950">
            <HardDrive className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-heading font-semibold text-white text-sm">Local Storage & Institution Data</h3>
              <p className="text-xs text-slate-400">Offline SQLite/JSON database stored securely in local browser application storage.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const backup = storageService.exportFullBackup();
                const blob = new Blob([backup], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `FTCE_Full_Database_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 rounded-xl bg-[#0a1b32] hover:bg-[#122e54] border border-sky-800 text-sky-300 font-medium text-xs transition-colors"
            >
              Export Full Database Backup
            </button>

            <button
              onClick={() => {
                if (confirm('Reset application to initial installation state? All custom records will be restored to default institute seeds.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-medium text-xs transition-colors"
            >
              Reset to Factory Default Seeds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
