/**
 * Game B: Type Racer
 * Real-time racing against clearly labeled computer AI racers based on typing performance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, Trophy, Flag, Car } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';
import confetti from 'canvas-confetti';

interface Racer {
  id: string;
  name: string;
  isPlayer: boolean;
  color: string;
  speedWpm: number;
  progress: number; // 0 to 100
  finished: boolean;
  finishTime?: number;
  rank?: number;
}

const RACE_PASSAGES = [
  "Speed is a byproduct of accuracy. When your fingers know the keys effortlessly, the words flow onto the screen like pure thought.",
  "The racetrack of technology never sleeps. Developers, typists, and engineers build the future line by line with discipline.",
  "In typing competition, rhythm is everything. Breathe steadily, look ahead at the next word, and never hesitate."
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const TypeRacerGame: React.FC<Props> = ({ student, onExit }) => {
  const [passage, setPassage] = useState<string>(RACE_PASSAGES[0]);
  const [typed, setTyped] = useState<string>('');
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [racers, setRacers] = useState<Racer[]>([
    { id: 'player', name: `${student.name} (You)`, isPlayer: true, color: 'from-sky-400 to-blue-600', speedWpm: 0, progress: 0, finished: false },
    { id: 'bot1', name: 'Maya Swift [AI: 36 WPM]', isPlayer: false, color: 'from-pink-500 to-rose-600', speedWpm: 36, progress: 0, finished: false },
    { id: 'bot2', name: 'Alex Turbo [AI: 48 WPM]', isPlayer: false, color: 'from-amber-400 to-orange-500', speedWpm: 48, progress: 0, finished: false },
    { id: 'bot3', name: 'CyberBot 9000 [AI: 60 WPM]', isPlayer: false, color: 'from-emerald-400 to-teal-600', speedWpm: 60, progress: 0, finished: false },
  ]);

  const startTimeRef = useRef<number | null>(null);
  const finishCounterRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);

  const startRaceCountdown = () => {
    setIsFinished(false);
    setTyped('');
    finishCounterRef.current = 1;
    setPassage(RACE_PASSAGES[Math.floor(Math.random() * RACE_PASSAGES.length)]);
    setRacers([
      { id: 'player', name: `${student.name} (You)`, isPlayer: true, color: 'from-sky-400 to-blue-600', speedWpm: 0, progress: 0, finished: false },
      { id: 'bot1', name: 'Maya Swift [AI: 36 WPM]', isPlayer: false, color: 'from-pink-500 to-rose-600', speedWpm: 36, progress: 0, finished: false },
      { id: 'bot2', name: 'Alex Turbo [AI: 48 WPM]', isPlayer: false, color: 'from-amber-400 to-orange-500', speedWpm: 48, progress: 0, finished: false },
      { id: 'bot3', name: 'CyberBot 9000 [AI: 60 WPM]', isPlayer: false, color: 'from-emerald-400 to-teal-600', speedWpm: 60, progress: 0, finished: false },
    ]);

    setCountdown(3);
    const countTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev === 1) {
          clearInterval(countTimer);
          setIsRacing(true);
          startTimeRef.current = performance.now();
          soundService.playSuccess();
          return null;
        }
        soundService.playKeypress(true);
        return prev - 1;
      });
    }, 1000);
  };

  // AI bots driving loop
  useEffect(() => {
    if (!isRacing || isFinished) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const elapsedMinutes = startTimeRef.current ? (time - startTimeRef.current) / 60000 : 0.01;
      const targetWords = passage.length / 5;

      setRacers((prev) =>
        prev.map((racer) => {
          if (racer.finished) return racer;

          if (racer.isPlayer) {
            const pProgress = Math.min(100, (typed.length / passage.length) * 100);
            const isDone = typed.length >= passage.length;
            if (isDone && !racer.finished) {
              const rank = finishCounterRef.current++;
              if (rank === 1) {
                confetti();
                soundService.playFanfare();
              } else {
                soundService.playSuccess();
              }
              setIsFinished(true);
              return { ...racer, progress: 100, finished: true, rank };
            }
            return { ...racer, progress: pProgress };
          }

          // AI Bot progression based on designated WPM with slight random micro-variation
          const wordsTypedSoFar = racer.speedWpm * elapsedMinutes;
          const botProgress = Math.min(100, (wordsTypedSoFar / targetWords) * 100);

          if (botProgress >= 100 && !racer.finished) {
            const rank = finishCounterRef.current++;
            return { ...racer, progress: 100, finished: true, rank };
          }

          return { ...racer, progress: botProgress };
        })
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRacing, isFinished, passage, typed]);

  // Handle typing input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRacing || isFinished) return;
    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        soundService.playKeypress(true);
      }
      return;
    }
    if (e.key.length === 1) {
      const nextChar = e.key;
      const expectedChar = passage[typed.length];
      if (nextChar === expectedChar) {
        soundService.playKeypress(nextChar === ' ');
        setTyped((prev) => prev + nextChar);
      } else {
        soundService.playError();
      }
    }
  };

  const playerRacer = racers.find((r) => r.isPlayer);
  const playerRank = playerRacer?.rank;

  return (
    <div className="flex flex-col h-full bg-[#081324] text-white p-4 select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b1b33] border border-sky-900/60 rounded-xl mb-3 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-heading font-semibold text-sky-200">Game B: Grand Prix Type Racer</span>
        </div>
      </div>

      {/* Race Track Canvas */}
      <div className="max-w-4xl w-full mx-auto bg-[#06101d] border-2 border-sky-950 rounded-2xl p-4 sm:p-6 mb-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-2">
          <span>START LINE</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
            <Flag className="w-4 h-4" />
            <span>FINISH LINE</span>
          </div>
        </div>

        {/* 4 Lanes */}
        <div className="space-y-4">
          {racers.map((racer) => (
            <div key={racer.id} className="relative">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-medium ${racer.isPlayer ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
                  {racer.name}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {racer.finished ? (
                    <span className="text-amber-400 font-bold">🏁 Finished #{racer.rank}</span>
                  ) : (
                    `${Math.round(racer.progress)}%`
                  )}
                </span>
              </div>

              {/* Lane asphalt */}
              <div className="w-full h-10 bg-[#091728] border border-sky-900/40 rounded-xl relative overflow-hidden flex items-center px-2">
                {/* Checkered strip at 100% */}
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-50" />

                {/* Animated Race Car */}
                <div
                  className="absolute transition-all duration-100 flex items-center gap-1"
                  style={{ left: `calc(${Math.min(92, racer.progress)}%)` }}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${racer.color} shadow-lg text-white`}>
                    <Car className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Race Typing Box */}
      <div className="max-w-4xl w-full mx-auto flex-1 bg-[#071322] border-2 border-sky-900/60 rounded-2xl p-6 relative flex flex-col justify-between">
        {/* Race Passage Display */}
        <div className="font-mono text-lg sm:text-xl leading-relaxed mb-6 select-none">
          {passage.split('').map((char, i) => {
            const isTyped = i < typed.length;
            const isCurrent = i === typed.length;
            return (
              <span
                key={i}
                className={
                  isTyped
                    ? 'text-emerald-400 font-bold'
                    : isCurrent
                    ? 'text-sky-300 bg-sky-500/20 underline font-bold'
                    : 'text-slate-500'
                }
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            onKeyDown={handleKeyDown}
            readOnly
            disabled={!isRacing || isFinished}
            placeholder={
              !isRacing
                ? 'Press Start Race to begin...'
                : 'Type the passage directly using your keyboard...'
            }
            className="w-full px-4 py-3 bg-[#0a1b30] border-2 border-sky-600/60 rounded-xl text-white font-mono text-center outline-none shadow-inner"
          />
        </div>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <div className="text-7xl font-extrabold text-amber-400 font-mono animate-ping">
              {countdown}
            </div>
            <div className="text-sm font-heading font-semibold text-sky-200 mt-4 uppercase tracking-widest">
              Ready... Engines Revving!
            </div>
          </div>
        )}

        {/* Start Overlay */}
        {!isRacing && !isFinished && countdown === null && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Grand Prix Type Racer</h2>
            <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">
              Race against 3 AI drivers calibrated to realistic typing speeds. Your typing velocity directly accelerates your car!
            </p>
            <button
              onClick={startRaceCountdown}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Race</span>
            </button>
          </div>
        )}

        {/* Finished Podium Overlay */}
        {isFinished && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-30">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h2 className="text-3xl font-heading font-extrabold text-white">Race Finished!</h2>
            <p className="text-sm text-sky-300 font-medium mt-1">
              You finished in <strong className="text-amber-400">#{playerRank || 1} Place</strong>
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={startRaceCountdown}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Race Again</span>
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
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
