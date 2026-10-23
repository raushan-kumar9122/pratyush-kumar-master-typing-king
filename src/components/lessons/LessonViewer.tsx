/**
 * English Typing Lessons Component for PRATYUSH KUMAR MASTER PRO
 * Structured curriculum from Home Row to Advanced Speed passages.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Target, 
  Zap, 
  Award,
  ArrowLeft,
  Flame,
  Layers
} from 'lucide-react';
import { Lesson, Student, AppSettings } from '../../types';
import { ENGLISH_LESSONS } from '../../data/englishLessons';
import { TypingTestEngine } from '../test/TypingTestEngine';

interface Props {
  activeStudent: Student;
  settings: AppSettings;
  onBackToDashboard: () => void;
}

export const LessonViewer: React.FC<Props> = ({ activeStudent, settings, onBackToDashboard }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('all');

  const filteredLessons = levelFilter === 'all' 
    ? ENGLISH_LESSONS 
    : ENGLISH_LESSONS.filter((l) => l.level === levelFilter);

  // If a lesson is currently being practiced, launch the engine with the lesson passage
  if (selectedLesson) {
    return (
      <div className="flex flex-col h-full bg-[#081220]">
        <div className="px-6 py-3 bg-[#0a1628] border-b border-sky-950 flex items-center justify-between text-xs">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f233d] hover:bg-[#16365d] text-sky-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Lessons Curriculum</span>
          </button>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Target: <strong className="text-emerald-400">{selectedLesson.targetWpm} WPM</strong></span>
            <span>Accuracy: <strong className="text-sky-300">{selectedLesson.targetAccuracy}%</strong></span>
          </div>
        </div>

        <TypingTestEngine
          activeStudent={activeStudent}
          initialPassage={{
            id: selectedLesson.id,
            title: selectedLesson.title,
            language: 'english',
            category: selectedLesson.category,
            difficulty: selectedLesson.level === 'beginner' ? 'easy' : selectedLesson.level === 'intermediate' ? 'medium' : 'hard',
            content: selectedLesson.content,
            wordCount: selectedLesson.content.split(' ').length,
          }}
          defaultDuration={60}
          mode="lesson"
          onBackToDashboard={() => setSelectedLesson(null)}
          settings={settings}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Structured Typing Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              English Keyboard Lessons
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Master touch typing finger by finger, row by row with progressive benchmarks.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center bg-[#071322] border border-sky-900/60 p-1 rounded-xl">
            {(['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all ${
                  levelFilter === lvl
                    ? 'bg-sky-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
        {filteredLessons.map((lesson, idx) => {
          return (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="group bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 rounded-2xl p-5 cursor-pointer shadow-lg hover:shadow-sky-500/10 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Category Badge & Level Indicator */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                    lesson.level === 'beginner' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                    lesson.level === 'intermediate' ? 'bg-sky-950 text-sky-400 border border-sky-800/40' :
                    lesson.level === 'advanced' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' :
                    'bg-purple-950 text-purple-400 border border-purple-800/40'
                  }`}>
                    {lesson.level}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    #{idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-heading font-semibold text-white group-hover:text-sky-300 transition-colors mb-1.5">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {lesson.description}
                </p>
              </div>

              {/* Benchmarks & Start CTA */}
              <div>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#06101d] border border-sky-950 text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Goal: <strong>{lesson.targetWpm} WPM</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Acc: <strong>{lesson.targetAccuracy}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Start Practice Session</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
