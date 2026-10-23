/**
 * Game E: Keyboard Challenge
 * Reflex drill testing reaction time (ms) and key accuracy with visual keyboard guidance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, Target, Zap, Clock } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';
import { VirtualKeyboard } from '../common/VirtualKeyboard';

const CHALLENGE_KEYS = [
  'a', 's', 'd', 'f', 'j', 'k', 'l', ';',
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const KeyboardChallengeGame: React.FC<Props> = ({ student, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [targetKey, setTargetKey] = useState<string>('f');
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [totalRounds] = useState<number>(20);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const roundStartTimeRef = useRef<number>(0);

  const startChallenge = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setRoundsCompleted(0);
    setLatencies([]);
    setLastLatency(null);
    pickNextKey();
  };

  const pickNextKey = () => {
    const nextKey = CHALLENGE_KEYS[Math.floor(Math.random() * CHALLENGE_KEYS.length)];
    setTargetKey(nextKey);
    roundStartTimeRef.current = performance.now();
  };

  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      const pressed = e.key.toLowerCase();

      if (pressed === targetKey.toLowerCase()) {
        const latencyMs = Math.round(performance.now() - roundStartTimeRef.current);
        soundService.playSuccess();
        setLastLatency(latencyMs);
        setLatencies((prev) => [...prev, latencyMs]);

        const nextRound = roundsCompleted + 1;
        setRoundsCompleted(nextRound);

        if (nextRound >= totalRounds) {
          setIsFinished(true);
          setIsPlaying(false);
          soundService.playFanfare();
        } else {
          pickNextKey();
        }
      } else {
        soundService.playError();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFinished, targetKey, roundsCompleted, totalRounds]);

  const avgLatency = latencies.length > 0 
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-[#081220] text-white p-4 select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a182d] border border-sky-900/60 rounded-xl mb-3 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arcade</span>
        </button>

        <div className="flex items-center gap-6">
          <span className="text-slate-400">
            Progress: <strong className="text-sky-300 font-mono">{roundsCompleted} / {totalRounds}</strong>
          </span>
          <div className="flex items-center gap-1.5 font-mono text-amber-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Avg Latency: <strong>{avgLatency} ms</strong></span>
          </div>
        </div>
      </div>

      {/* Main Challenge Screen */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-between bg-[#06101d] border-2 border-sky-950 rounded-2xl p-6 relative">
        {isPlaying && (
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-mono">
              STRIKE KEY IMMEDIATELY
            </span>
            <div className="w-28 h-28 rounded-2xl bg-sky-500/10 border-2 border-sky-400/60 flex items-center justify-center text-6xl font-black font-mono text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-bounce">
              {targetKey.toUpperCase()}
            </div>
            {lastLatency !== null && (
              <div className="mt-3 text-xs font-mono text-emerald-400">
                Reaction: {lastLatency} ms
              </div>
            )}
          </div>
        )}

        {!isPlaying && !isFinished && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Target className="w-12 h-12 text-sky-400 mx-auto" />
            <h2 className="text-2xl font-heading font-bold text-white">Game E: Keyboard Challenge</h2>
            <p className="text-xs text-slate-400 max-w-sm">
              Drill single-key neuro-muscular reflexes. Observe the target letter and strike it instantaneously without glancing down!
            </p>
            <button
              onClick={startChallenge}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Begin Reflex Drill</span>
            </button>
          </div>
        )}

        {isFinished && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <h2 className="text-3xl font-heading font-extrabold text-white">Challenge Completed!</h2>
            <div className="p-4 bg-[#0a182d] border border-sky-900 rounded-xl min-w-[240px]">
              <div className="text-xs text-slate-400">Average Reaction Reflex</div>
              <div className="text-4xl font-mono font-bold text-emerald-400 mt-1">{avgLatency} ms</div>
              <div className="text-xs text-sky-300 mt-1">20/20 Reflex Strikes Verified</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startChallenge}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat Drill</span>
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
              >
                Arcade Lobby
              </button>
            </div>
          </div>
        )}

        {/* Guided Visual Keyboard */}
        <div className="mt-4 pt-4 border-t border-sky-950">
          <VirtualKeyboard activeChar={targetKey} compact={true} />
        </div>
      </div>
    </div>
  );
};
