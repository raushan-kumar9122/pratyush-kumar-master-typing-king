/**
 * Game C: Word Blitz
 * 60-second rapid fire word test with streak combos and score multipliers.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, Flame, Zap, Award, Sparkles } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';

const BLITZ_WORDS = [
  'fast', 'code', 'type', 'wire', 'data', 'byte', 'core', 'chip', 'disk', 'flow',
  'link', 'node', 'port', 'push', 'pull', 'sync', 'task', 'term', 'unit', 'user',
  'view', 'zoom', 'host', 'jump', 'load', 'mode', 'open', 'ping', 'root', 'seek'
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const WordBlitzGame: React.FC<Props> = ({ student, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>('blitz');
  const [inputVal, setInputVal] = useState<string>('');
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startBlitz = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setWordsCompleted(0);
    setInputVal('');
    setCurrentWord(BLITZ_WORDS[Math.floor(Math.random() * BLITZ_WORDS.length)]);
  };

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsPlaying(false);
          soundService.playFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const multiplier = streak >= 15 ? 4 : streak >= 10 ? 3 : streak >= 5 ? 2 : 1;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setInputVal(val);
    soundService.playKeypress(false);

    if (val === currentWord) {
      soundService.playSuccess();
      const points = 50 * multiplier;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setWordsCompleted((w) => w + 1);
      setInputVal('');
      setCurrentWord(BLITZ_WORDS[Math.floor(Math.random() * BLITZ_WORDS.length)]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#081220] text-white p-4 select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a182d] border border-sky-900/60 rounded-xl mb-4 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arcade</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Time:</span>
            <span className={`font-mono font-bold text-sm ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-sky-300'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">Score:</span>
            <span className="text-amber-400 font-mono font-bold text-sm">{score}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{streak} Streak ({multiplier}x)</span>
          </div>
        </div>
      </div>

      {/* Main Blitz Arena */}
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col items-center justify-center relative p-8 bg-[#06101d] border-2 border-sky-950 rounded-2xl shadow-2xl">
        {isPlaying ? (
          <div className="w-full text-center space-y-6">
            <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
              Type As Fast As You Can!
            </div>

            <div className="text-5xl sm:text-7xl font-mono font-black text-white tracking-widest py-4 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              {currentWord}
            </div>

            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={inputVal}
                onChange={handleInput}
                autoFocus
                placeholder="Type word..."
                className="w-full px-5 py-3.5 rounded-xl bg-[#0a1b32] border-2 border-sky-500 text-center font-mono text-2xl text-white outline-none shadow-lg shadow-sky-500/20"
              />
            </div>
          </div>
        ) : timeLeft === 0 ? (
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-heading font-extrabold text-white">Time's Up!</h2>
            <div className="p-4 bg-[#0a182d] border border-sky-900 rounded-xl min-w-[240px]">
              <div className="text-xs text-slate-400">Total Blitz Score</div>
              <div className="text-4xl font-mono font-bold text-amber-400 mt-1">{score}</div>
              <div className="text-xs text-sky-300 mt-1">{wordsCompleted} Words Typed in 60s</div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={startBlitz}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
              >
                Arcade Lobby
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">Game C: Word Blitz</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rapid-fire typing sprint. Score multipliers increase with every consecutive word without error. 60 seconds on the clock!
            </p>
            <button
              onClick={startBlitz}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl mx-auto"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Blitz Frenzy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
