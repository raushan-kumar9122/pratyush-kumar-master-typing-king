/**
 * Post-test Results Analysis Modal for PRATYUSH KUMAR MASTER PRO
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, ArrowRight, Printer, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Student, TestResult } from '../../types';
import { soundService } from '../../services/sound';

interface Props {
  result: TestResult;
  student: Student;
  onRetry: () => void;
  onClose: () => void;
  onOpenCertificate: () => void;
}

export const TestResultsModal: React.FC<Props> = ({
  result,
  student,
  onRetry,
  onClose,
  onOpenCertificate,
}) => {
  useEffect(() => {
    if (result.netWpm >= 40 && result.accuracy >= 90) {
      soundService.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      soundService.playSuccess();
    }
  }, [result]);

  const isExam = result.mode === 'exam';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0b192c] border border-sky-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
            {isExam ? 'Official Examination Submitted' : 'Typing Assessment Complete'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Performance Summary
          </h2>
          <p className="text-xs text-slate-400">
            Candidate: <span className="text-sky-300 font-medium">{student.name}</span> ({student.rollNo})
          </p>
        </div>

        {/* Big Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 text-center">
            <div className="text-xs text-slate-400 font-medium">Net Speed</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 font-mono mt-1">
              {result.netWpm}
            </div>
            <div className="text-[11px] text-sky-300/80 font-mono">WPM</div>
          </div>

          <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 text-center">
            <div className="text-xs text-slate-400 font-medium">Accuracy</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1">
              {result.accuracy}%
            </div>
            <div className="text-[11px] text-emerald-300/80 font-mono">Score</div>
          </div>

          <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 text-center">
            <div className="text-xs text-slate-400 font-medium">Gross Speed</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-200 font-mono mt-1">
              {result.grossWpm}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">WPM</div>
          </div>

          <div className="p-4 rounded-xl bg-[#071322] border border-sky-900/60 text-center">
            <div className="text-xs text-slate-400 font-medium">Grade Awarded</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-1">
              {result.grade || 'A'}
            </div>
            <div className="text-[11px] text-amber-300/80 font-mono">Rating</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-[#071120] border border-sky-950 rounded-xl p-4 mb-6 text-xs space-y-2.5">
          <div className="font-semibold text-slate-300 flex items-center justify-between pb-1.5 border-b border-sky-950">
            <span>Detailed Metrics</span>
            <span className="font-mono text-sky-400">{result.passageTitle}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-slate-400">
            <div>Total Typed: <strong className="text-slate-200">{result.totalCharacters} chars</strong></div>
            <div>Correct Chars: <strong className="text-emerald-400">{result.correctCharacters}</strong></div>
            <div>Mistyped Chars: <strong className="text-rose-400">{result.errorCharacters}</strong></div>
            <div>Test Duration: <strong className="text-slate-200">{result.durationSeconds}s</strong></div>
            <div>Backspaces Used: <strong className="text-slate-200">{result.backspaceCount}</strong></div>
            <div>Keystroke Rate: <strong className="text-sky-300">{Math.round((result.totalCharacters / (result.durationSeconds || 60)) * 60)} CPM</strong></div>
          </div>
        </div>

        {/* Weak Keys Advisory */}
        {result.weakKeys && result.weakKeys.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl mb-6 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="text-slate-300">
              <span className="text-rose-300 font-medium">Keys Needing Focus: </span>
              {result.weakKeys.map((k, i) => (
                <span key={i} className="inline-block px-2 py-0.5 ml-1 rounded bg-rose-900/40 border border-rose-700/50 text-rose-200 font-mono font-bold uppercase">
                  {k === ' ' ? 'SPACE' : k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sky-950">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#11243b] hover:bg-[#183454] text-slate-200 font-medium text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium text-xs shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Official Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs shadow-md transition-colors"
            >
              <span>Main Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
