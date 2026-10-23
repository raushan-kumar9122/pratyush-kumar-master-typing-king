/**
 * Hindi Typing Practice Module for PRATYUSH KUMAR MASTER PRO
 * Supports Unicode Devanagari, Inscript & Remington layouts, and keyboard layout visualizer.
 */

import React, { useState } from 'react';
import { 
  Languages, 
  HelpCircle, 
  Keyboard as KeyboardIcon, 
  Play, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Student, AppSettings, HindiLesson, Passage } from '../../types';
import { HINDI_LESSONS, HINDI_KEY_MAP } from '../../data/hindiLessons';
import { TYPING_PASSAGES } from '../../data/passages';
import { TypingTestEngine } from '../test/TypingTestEngine';

interface Props {
  activeStudent: Student;
  settings: AppSettings;
  onBackToDashboard: () => void;
}

export const HindiPracticeView: React.FC<Props> = ({ activeStudent, settings, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'tests' | 'guide'>('lessons');
  const [selectedHindiLesson, setSelectedHindiLesson] = useState<HindiLesson | null>(null);
  const [selectedHindiPassage, setSelectedHindiPassage] = useState<Passage | null>(null);
  const [layoutMode, setLayoutMode] = useState<'inscript' | 'remington'>('inscript');

  const hindiPassages = TYPING_PASSAGES.filter((p) => p.language === 'hindi');

  // If currently running practice test
  if (selectedHindiLesson || selectedHindiPassage) {
    const targetPassage: Passage = selectedHindiPassage || {
      id: selectedHindiLesson!.id,
      title: selectedHindiLesson!.title,
      language: 'hindi',
      category: selectedHindiLesson!.category,
      difficulty: selectedHindiLesson!.level === 'beginner' ? 'easy' : selectedHindiLesson!.level === 'intermediate' ? 'medium' : 'hard',
      content: selectedHindiLesson!.content,
      wordCount: selectedHindiLesson!.content.split(' ').length,
    };

    return (
      <div className="flex flex-col h-full bg-[#081220]">
        <div className="px-6 py-3 bg-[#0a1628] border-b border-sky-950 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setSelectedHindiLesson(null);
              setSelectedHindiPassage(null);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f233d] hover:bg-[#16365d] text-sky-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hindi Practice Center</span>
          </button>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="px-2 py-0.5 rounded bg-sky-900/60 border border-sky-700/50 text-sky-300 font-mono text-[11px]">
              Unicode Devanagari {layoutMode.toUpperCase()}
            </span>
          </div>
        </div>

        <TypingTestEngine
          activeStudent={activeStudent}
          initialPassage={targetPassage}
          defaultDuration={selectedHindiPassage ? 3000 : 120}
          mode="practice"
          onBackToDashboard={() => {
            setSelectedHindiLesson(null);
            setSelectedHindiPassage(null);
          }}
          settings={settings}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Languages className="w-4 h-4" />
              <span>Devanagari Unicode Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-2.5">
              <span>हिंदी टाइपिंग अभ्यास</span>
              <span className="text-sm font-normal text-sky-400 font-mono">(Hindi Typing Tutor)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              सरकारी एवं व्यावसायिक परीक्षाओं (CPCT, High Court, SSC) हेतु प्रामाणिक यूनिकोड हिंदी टाइपिंग प्रणाली।
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center bg-[#071322] border border-sky-900/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'lessons'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              अभ्यास पाठ (Lessons)
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              स्पीड टेस्ट (Speed Tests)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              कीबोर्ड गाइड (Windows Setup)
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-6xl w-full mx-auto">
        {/* Tab 1: Hindi Lessons */}
        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {HINDI_LESSONS.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedHindiLesson(lesson)}
                className="group bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 rounded-2xl p-5 cursor-pointer shadow-lg hover:shadow-sky-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase bg-sky-950 text-sky-400 border border-sky-800/40">
                      {lesson.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-heading font-semibold text-white group-hover:text-sky-300 transition-colors mb-1.5">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {lesson.description}
                  </p>
                </div>

                <div>
                  {lesson.inscriptGuide && (
                    <div className="p-2.5 rounded-xl bg-[#06101d] border border-sky-950 text-[11px] text-sky-300 font-mono mb-4">
                      💡 {lesson.inscriptGuide}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>अभ्यास प्रारंभ करें (Start)</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Hindi Speed Tests */}
        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {hindiPassages.map((passage) => (
              <div
                key={passage.id}
                onClick={() => setSelectedHindiPassage(passage)}
                className="group bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 rounded-2xl p-5 cursor-pointer shadow-lg hover:shadow-sky-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase bg-amber-950 text-amber-400 border border-amber-800/40">
                      {passage.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{passage.wordCount} शब्द</span>
                  </div>

                  <h3 className="text-base font-heading font-semibold text-white group-hover:text-sky-300 transition-colors mb-2">
                    {passage.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {passage.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>गति परीक्षा शुरू करें (Start Test)</span>
                  <Play className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Windows Setup & Keyboard Reference Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6 pb-12">
            {/* Windows 10/11 Hindi IME Configuration Steps */}
            <div className="p-6 bg-[#091628] border border-sky-900/60 rounded-2xl">
              <div className="flex items-center gap-2.5 text-sky-300 font-heading font-semibold text-lg mb-3">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Windows 10 / 11 में हिंदी कीबोर्ड कैसे सक्रिय करें (Setup Guide)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 mt-4">
                <div className="p-4 rounded-xl bg-[#06101e] border border-sky-950 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center font-mono">1</div>
                  <h4 className="font-semibold text-white text-sm">Windows Settings खोलें</h4>
                  <p className="text-slate-400 leading-relaxed">
                    कीबोर्ड पर <strong>Win + I</strong> दबाएं, फिर <strong>Time & Language</strong> ➔ <strong>Language & Region</strong> पर जाएं।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#06101e] border border-sky-950 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center font-mono">2</div>
                  <h4 className="font-semibold text-white text-sm">Hindi Language जोड़ें</h4>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>Add a language</strong> पर क्लिक करें और <strong>Hindi (हिंदी)</strong> चुनें। Language Options में जाकर <strong>Hindi Traditional (Inscript)</strong> कीबोर्ड जोड़ें।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#06101e] border border-sky-950 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center font-mono">3</div>
                  <h4 className="font-semibold text-white text-sm">भाषा बदलें (Quick Switch)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    टाइपिंग के दौरान कभी भी <strong>Alt + Shift</strong> या <strong>Win + Space</strong> दबाकर अंग्रेजी और हिंदी के बीच तत्काल स्विच करें।
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Inscript Character Mapping Reference */}
            <div className="p-6 bg-[#091628] border border-sky-900/60 rounded-2xl">
              <h3 className="font-heading font-semibold text-lg text-white mb-4">
                यूनिकोड इंस्क्रिप्ट कीबोर्ड कुंजी मानचित्र (Inscript Quick Reference)
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold mb-2">मात्राएं (Matras)</h4>
                  <div className="flex flex-wrap gap-2">
                    {HINDI_KEY_MAP.matras.map((m, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-[#06101d] border border-sky-950 text-xs flex items-center gap-2">
                        <span className="text-base text-amber-300 font-bold">{m.char}</span>
                        <span className="text-slate-400 font-mono">({m.key})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold mb-2">स्वर (Vowels)</h4>
                  <div className="flex flex-wrap gap-2">
                    {HINDI_KEY_MAP.vowels.map((v, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-[#06101d] border border-sky-950 text-xs flex items-center gap-2">
                        <span className="text-base text-emerald-300 font-bold">{v.char}</span>
                        <span className="text-slate-400 font-mono">({v.key})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold mb-2">व्यंजन (Consonants)</h4>
                  <div className="flex flex-wrap gap-2">
                    {HINDI_KEY_MAP.consonants.slice(0, 16).map((c, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-[#06101d] border border-sky-950 text-xs flex items-center gap-2">
                        <span className="text-base text-sky-300 font-bold">{c.char}</span>
                        <span className="text-slate-400 font-mono">({c.key})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
