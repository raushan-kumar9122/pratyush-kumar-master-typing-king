/**
 * Typing Test Engine for PRATYUSH KUMAR MASTER PRO
 * Accurate elapsed time calculation, configurable Backspace policy, live HUD, and evaluation.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Timer, 
  Zap, 
  Target, 
  AlertCircle, 
  ChevronRight, 
  Maximize2, 
  Keyboard, 
  Settings2,
  FileText
} from 'lucide-react';
import { Passage, Student, TestResult, BackspacePolicy, AppSettings, TestMode } from '../../types';
import { TYPING_PASSAGES } from '../../data/passages';
import { calculateTypingScores } from '../../utils/scoring';
import { soundService } from '../../services/sound';
import { storageService } from '../../services/storage';
import { VirtualKeyboard } from '../common/VirtualKeyboard';
import { TestResultsModal } from './TestResultsModal';
import { CertificateModal } from '../certificate/CertificateModal';

interface Props {
  activeStudent: Student;
  initialPassage?: Passage;
  defaultDuration?: number;
  mode?: TestMode;
  backspaceOverride?: BackspacePolicy;
  onFinish?: (result: TestResult) => void;
  onBackToDashboard?: () => void;
  settings: AppSettings;
}

const DURATIONS = [
  { label: '50 Min (टोटल/Full)', value: 3000 },
  { label: '10 Min (मानक/Exam)', value: 600 },
  { label: '5 Min', value: 300 },
  { label: '2 Min', value: 120 },
  { label: '1 Min', value: 60 },
  { label: '30s', value: 30 },
];

export const TypingTestEngine: React.FC<Props> = ({
  activeStudent,
  initialPassage,
  defaultDuration = 3000,
  mode = 'test',
  backspaceOverride,
  onFinish,
  onBackToDashboard,
  settings,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(defaultDuration);
  const [currentPassage, setCurrentPassage] = useState<Passage>(() => {
    if (initialPassage) return initialPassage;
    const tenMinPassage = TYPING_PASSAGES.find((p) => p.id === 'eng-pass-10min');
    return tenMinPassage || TYPING_PASSAGES[0];
  });
  const [typedText, setTypedText] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [backspaceWarning, setBackspaceWarning] = useState<string | null>(null);

  // Time tracking using performance.now()
  const [remainingSeconds, setRemainingSeconds] = useState<number>(defaultDuration);
  const startTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);

  // Modals
  const [completedResult, setCompletedResult] = useState<TestResult | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showKeyboardLocal, setShowKeyboardLocal] = useState<boolean>(settings.showKeyboard);

  const containerRef = useRef<HTMLDivElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  // Active Backspace policy
  const effectiveBackspacePolicy = backspaceOverride || settings.backspacePolicy;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current) cancelAnimationFrame(timerIdRef.current);
    };
  }, []);

  // Set passage if initialPassage changes
  useEffect(() => {
    if (initialPassage) {
      setCurrentPassage(initialPassage);
      resetTest(initialPassage, selectedDuration);
    }
  }, [initialPassage]);

  const resetTest = useCallback((passage: Passage = currentPassage, duration: number = selectedDuration) => {
    if (timerIdRef.current) cancelAnimationFrame(timerIdRef.current);
    setIsRunning(false);
    setIsFinished(false);
    setTypedText('');
    setBackspaceCount(0);
    setBackspaceWarning(null);
    setRemainingSeconds(duration);
    startTimeRef.current = null;
    setCompletedResult(null);
    setShowCertificate(false);
  }, [currentPassage, selectedDuration]);

  // Finish evaluation
  const handleCompleteTest = useCallback((finalTyped: string, forcedElapsedSeconds?: number) => {
    if (timerIdRef.current) cancelAnimationFrame(timerIdRef.current);
    setIsRunning(false);
    setIsFinished(true);

    const actualElapsed = forcedElapsedSeconds ?? (
      startTimeRef.current ? Math.min(selectedDuration, (performance.now() - startTimeRef.current) / 1000) : selectedDuration
    );

    const scores = calculateTypingScores({
      targetText: currentPassage.content,
      typedText: finalTyped,
      elapsedSeconds: Math.max(1, actualElapsed),
      backspaceCount,
    });

    const result: TestResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: activeStudent.id,
      timestamp: new Date().toISOString(),
      language: currentPassage.language,
      durationSeconds: Math.round(actualElapsed),
      passageTitle: currentPassage.title,
      grossWpm: scores.grossWpm,
      netWpm: scores.netWpm,
      accuracy: scores.accuracy,
      totalCharacters: scores.totalCharsTyped,
      correctCharacters: scores.correctChars,
      errorCharacters: scores.errorChars,
      backspaceCount,
      mode,
      grade: scores.grade,
      weakKeys: scores.weakKeys,
    };

    storageService.addResult(result);
    setCompletedResult(result);
    if (onFinish) onFinish(result);
  }, [activeStudent.id, backspaceCount, currentPassage, mode, onFinish, selectedDuration]);

  // High precision timer loop
  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, selectedDuration - elapsed);

    setRemainingSeconds(Math.ceil(remaining));

    if (remaining <= 0) {
      // Completed by timer expiry
      handleCompleteTest(typedText, selectedDuration);
    } else {
      timerIdRef.current = requestAnimationFrame(updateTimer);
    }
  }, [handleCompleteTest, selectedDuration, typedText]);

  const startTest = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = performance.now();
    timerIdRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, updateTimer]);

  // Keyboard capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut combinations
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isFinished) return;

      // Handle Backspace policy
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (effectiveBackspacePolicy === 'disabled') {
          soundService.playError();
          setBackspaceWarning('Backspace is strictly disabled in examination mode!');
          setTimeout(() => setBackspaceWarning(null), 1800);
          return;
        }

        if (effectiveBackspacePolicy === 'restricted') {
          // Check if previous char was a space (cannot delete past word boundary)
          if (typedText.length > 0 && typedText[typedText.length - 1] === ' ') {
            soundService.playError();
            setBackspaceWarning('Restricted Backspace: You cannot erase previous words!');
            setTimeout(() => setBackspaceWarning(null), 1800);
            return;
          }
        }

        if (typedText.length > 0) {
          setBackspaceCount((prev) => prev + 1);
          setTypedText((prev) => prev.slice(0, -1));
          soundService.playKeypress(true);
        }
        return;
      }

      // Ignore functional keys
      if (e.key.length !== 1) return;

      // Start on first keypress if not running
      if (!isRunning) {
        startTest();
      }

      e.preventDefault();
      const inputChar = e.key;
      const targetChar = currentPassage.content[typedText.length];

      if (inputChar === targetChar) {
        soundService.playKeypress(inputChar === ' ');
      } else {
        soundService.playError();
      }

      const nextTyped = typedText + inputChar;
      setTypedText(nextTyped);

      // Check if passage reached end
      if (nextTyped.length >= currentPassage.content.length) {
        if (selectedDuration >= 300) {
          // For 5 or 10 minute tests, extend passage content seamlessly so candidate continues typing
          setCurrentPassage((prev) => ({
            ...prev,
            content: prev.content + ' ' + (prev.content),
          }));
        } else {
          handleCompleteTest(nextTyped);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPassage.content, effectiveBackspacePolicy, handleCompleteTest, isFinished, isRunning, startTest, typedText]);

  // Live Score stats
  const elapsedMinutes = startTimeRef.current
    ? Math.max(0.01, (performance.now() - startTimeRef.current) / 60000)
    : 0.01;

  const liveGrossWpm = isRunning && typedText.length > 0
    ? Math.round((typedText.length / 5) / elapsedMinutes)
    : 0;

  let liveErrors = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] !== currentPassage.content[i]) liveErrors++;
  }

  const liveAccuracy = typedText.length > 0
    ? Math.max(0, Math.round(((typedText.length - liveErrors) / typedText.length) * 100))
    : 100;

  const liveNetWpm = isRunning && typedText.length > 0
    ? Math.max(0, Math.round(liveGrossWpm - (liveErrors / elapsedMinutes)))
    : 0;

  // Active Next Character for keyboard guidance
  const nextTargetChar = currentPassage.content[typedText.length] || '';

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (typedText.length / currentPassage.content.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#081220] text-slate-100 p-4 sm:p-6 overflow-y-auto">
      {/* Test Controls Bar */}
      <div className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-sky-950">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2">
              <span>{currentPassage.title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                currentPassage.difficulty === 'easy' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' :
                currentPassage.difficulty === 'medium' ? 'bg-sky-950/60 text-sky-400 border border-sky-800/40' :
                'bg-rose-950/60 text-rose-400 border border-rose-800/40'
              }`}>
                {currentPassage.difficulty}
              </span>
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Candidate: <strong className="text-sky-300">{activeStudent.name}</strong></span>
              <span>•</span>
              <span>Backspace: <strong className="capitalize text-slate-300">{effectiveBackspacePolicy}</strong></span>
            </div>
          </div>
        </div>

        {/* Duration Selectors (Only selectable if not yet running) */}
        <div className="flex items-center gap-2">
          {!isRunning && !isFinished && (
            <div className="flex items-center bg-[#071322] border border-sky-950 p-1 rounded-lg">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelectedDuration(d.value);
                    setRemainingSeconds(d.value);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                    selectedDuration === d.value
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowKeyboardLocal(!showKeyboardLocal)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showKeyboardLocal
                ? 'bg-sky-950/60 border-sky-600/50 text-sky-300'
                : 'bg-[#0b192c] border-sky-900/50 text-slate-400 hover:text-white'
            }`}
            title="Toggle On-Screen Virtual Keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={() => resetTest()}
            className="p-2 rounded-lg bg-[#0b192c] hover:bg-[#122842] border border-sky-900/50 text-slate-300 hover:text-white transition-colors"
            title="Restart Test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live HUD Floating Dashboard */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        {/* Timer */}
        <div className="p-3 rounded-xl bg-[#091628] border border-sky-900/50 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Time Left</div>
            <div className={`text-xl sm:text-2xl font-mono font-bold ${
              remainingSeconds <= 10 && isRunning ? 'text-rose-400 animate-pulse' : 'text-sky-300'
            }`}>
              {formatTime(remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Live Net WPM */}
        <div className="p-3 rounded-xl bg-[#091628] border border-sky-900/50 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Net WPM</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
              {liveNetWpm}
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-3 rounded-xl bg-[#091628] border border-sky-900/50 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Accuracy</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-sky-300">
              {liveAccuracy}%
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="p-3 rounded-xl bg-[#091628] border border-sky-900/50 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Errors</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-rose-400">
              {liveErrors}
            </div>
          </div>
        </div>

        {/* Gross WPM */}
        <div className="hidden sm:flex p-3 rounded-xl bg-[#091628] border border-sky-900/50 items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Gross WPM</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
              {liveGrossWpm}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl w-full mx-auto mb-4">
        <div className="w-full h-1.5 bg-[#06101d] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Backspace Warning Toast */}
      {backspaceWarning && (
        <div className="max-w-5xl w-full mx-auto mb-3 p-2 bg-rose-950/80 border border-rose-600 rounded-lg text-rose-200 text-xs font-medium text-center animate-bounce">
          ⚠️ {backspaceWarning}
        </div>
      )}

      {/* Main Interactive Typing Canvas / Passage Display */}
      <div 
        ref={containerRef}
        className="max-w-5xl w-full mx-auto flex-1 min-h-[180px] bg-[#071322] border-2 border-sky-900/60 focus-within:border-sky-500 rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden cursor-text mb-4"
        onClick={() => {
          if (!isRunning && !isFinished) startTest();
        }}
      >
        {/* Subtle Start Guide Prompt */}
        {!isRunning && !isFinished && (
          <div className="absolute top-3 right-4 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-medium flex items-center gap-1.5 animate-pulse">
            <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
            <span>Click or press any key to begin</span>
          </div>
        )}

        <div 
          ref={textDisplayRef}
          className="font-mono text-base sm:text-xl leading-relaxed tracking-wide select-none max-h-[300px] overflow-y-auto pr-2"
        >
          {currentPassage.content.split('').map((char, index) => {
            const isTyped = index < typedText.length;
            const isCurrent = index === typedText.length;
            const isCorrect = isTyped && typedText[index] === char;
            const isIncorrect = isTyped && typedText[index] !== char;

            let charClass = 'text-slate-500';
            if (isCorrect) {
              charClass = 'text-emerald-400 font-medium';
            } else if (isIncorrect) {
              charClass = 'text-rose-400 bg-rose-950/60 rounded underline decoration-rose-500 font-bold';
            }

            return (
              <span key={index} className="relative inline-block">
                {/* Flashing Caret on Current Character */}
                {isCurrent && (
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                )}
                <span className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* On-Screen Virtual Keyboard */}
      {showKeyboardLocal && (
        <div className="max-w-5xl w-full mx-auto mb-2">
          <VirtualKeyboard
            activeChar={nextTargetChar}
            layout={currentPassage.language === 'hindi' ? 'inscript' : 'qwerty'}
            compact={true}
          />
        </div>
      )}

      {/* Completed Results Modal */}
      {isFinished && completedResult && (
        <TestResultsModal
          result={completedResult}
          student={activeStudent}
          onRetry={() => resetTest()}
          onClose={() => {
            if (onBackToDashboard) onBackToDashboard();
            else resetTest();
          }}
          onOpenCertificate={() => setShowCertificate(true)}
        />
      )}

      {/* Official Certificate Modal */}
      {showCertificate && completedResult && (
        <CertificateModal
          student={activeStudent}
          result={completedResult}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
