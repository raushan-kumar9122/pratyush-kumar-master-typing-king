/**
 * Game D: Sentence Sprint
 * Type complete sentences with high precision before time runs out per lap.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, Timer, CheckCircle, Award } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';

const SPRINT_SENTENCES = [
  { text: "Consistency beats intensity every single day.", time: 14 },
  { text: "Focus your eyes on the screen and trust your fingers.", time: 15 },
  { text: "Accurate typing unlocks high speed without mental exhaustion.", time: 16 },
  { text: "The Future Track Computer Education empowers students for technical excellence.", time: 18 },
  { text: "Pratyush Kumar Master Pro delivers commercial grade desktop typing precision.", time: 20 },
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const SentenceSprintGame: React.FC<Props> = ({ student, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lapIndex, setLapIndex] = useState<number>(0);
  const [typed, setTyped] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(14);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [victory, setVictory] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLap = SPRINT_SENTENCES[lapIndex];

  const startSprint = () => {
    setIsPlaying(true);
    setLapIndex(0);
    setTyped('');
    setTimeLeft(SPRINT_SENTENCES[0].time);
    setGameOver(false);
    setVictory(false);
  };

  useEffect(() => {
    if (!isPlaying || gameOver || victory) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          soundService.playError();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameOver, lapIndex, victory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPlaying || gameOver || victory) return;

    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        soundService.playKeypress(true);
      }
      return;
    }

    if (e.key.length === 1) {
      const nextChar = e.key;
      const expectedChar = currentLap.text[typed.length];
      if (nextChar === expectedChar) {
        soundService.playKeypress(nextChar === ' ');
        const nextTyped = typed + nextChar;
        setTyped(nextTyped);

        // Check if finished lap
        if (nextTyped === currentLap.text) {
          soundService.playSuccess();
          if (lapIndex + 1 < SPRINT_SENTENCES.length) {
            setLapIndex((l) => l + 1);
            setTyped('');
            setTimeLeft(SPRINT_SENTENCES[lapIndex + 1].time);
          } else {
            setVictory(true);
            setIsPlaying(false);
            soundService.playFanfare();
          }
        }
      } else {
        soundService.playError();
      }
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

        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            Lap: <strong className="text-sky-300 font-mono">{lapIndex + 1} / {SPRINT_SENTENCES.length}</strong>
          </span>
          <div className="flex items-center gap-1.5 font-mono">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Sprint Stage */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center bg-[#06101d] border-2 border-sky-950 rounded-2xl p-6 sm:p-10 relative shadow-2xl">
        {isPlaying && !gameOver && !victory && (
          <div className="space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Lap {lapIndex + 1}: Type with flawless cadence
            </div>

            <div className="font-mono text-xl sm:text-2xl leading-relaxed p-6 bg-[#0a1b32] rounded-xl border border-sky-900/80">
              {currentLap.text.split('').map((char, i) => {
                const isTyped = i < typed.length;
                const isCurrent = i === typed.length;
                return (
                  <span
                    key={i}
                    className={
                      isTyped
                        ? 'text-emerald-400 font-bold'
                        : isCurrent
                        ? 'text-sky-300 underline font-bold bg-sky-500/20'
                        : 'text-slate-500'
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            <input
              type="text"
              readOnly
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Keep typing the highlighted sentence..."
              className="w-full px-5 py-3 rounded-xl bg-[#091728] border-2 border-sky-500 text-center font-mono text-white outline-none"
            />
          </div>
        )}

        {!isPlaying && !gameOver && !victory && (
          <div className="text-center space-y-4 max-w-sm mx-auto">
            <h2 className="text-2xl font-heading font-bold text-white">Game D: Sentence Sprint</h2>
            <p className="text-xs text-slate-400">
              Clear 5 intense sentence laps. Each lap has an unyielding countdown. Perfect for building stamina!
            </p>
            <button
              onClick={startSprint}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl mx-auto"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Sprint</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-bold text-rose-400">Out of Time on Lap {lapIndex + 1}!</h2>
            <p className="text-xs text-slate-400">You ran out of time before completing the lap sentence.</p>
            <button
              onClick={startSprint}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Sprint</span>
            </button>
          </div>
        )}

        {victory && (
          <div className="text-center space-y-4">
            <Award className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-heading font-extrabold text-white">Sprint Champion!</h2>
            <p className="text-xs text-sky-300">You successfully cleared all 5 sentence laps with precision speed!</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={startSprint}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Sprint Again</span>
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
      </div>
    </div>
  );
};
