/**
 * Game A: Falling Words
 * Words fall down screen. Type them before they reach the bottom laser barrier!
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Shield, Heart, Zap, Award, ArrowLeft } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';
import { storageService } from '../../services/storage';

interface WordItem {
  id: string;
  text: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 0% to 100%
  speed: number;
}

const WORD_BANK = [
  'apple', 'swift', 'logic', 'cloud', 'binary', 'matrix', 'stream', 'engine',
  'system', 'future', 'track', 'cursor', 'memory', 'socket', 'output', 'vector',
  'python', 'react', 'kernel', 'branch', 'client', 'server', 'neural', 'syntax',
  'prompt', 'layout', 'native', 'thread', 'signal', 'module', 'design', 'master'
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const FallingWordsGame: React.FC<Props> = ({ student, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [words, setWords] = useState<WordItem[]>([]);
  const wordsRef = useRef<WordItem[]>([]);
  const livesRef = useRef<number>(3);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  wordsRef.current = words;
  livesRef.current = lives;

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setCurrentInput('');
    setWords([]);
    lastSpawnRef.current = performance.now();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Spawn words based on level
      const spawnInterval = Math.max(1200, 2500 - level * 200);
      if (currentTime - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = currentTime;
        const randomWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        const newWord: WordItem = {
          id: `w-${Date.now()}-${Math.random()}`,
          text: randomWord,
          x: Math.floor(Math.random() * 75) + 5,
          y: 0,
          speed: 8 + level * 2.5,
        };
        setWords((prev) => [...prev, newWord]);
      }

      // Update positions
      let damaged = false;
      const updatedWords = wordsRef.current
        .map((w) => ({
          ...w,
          y: w.y + w.speed * dt,
        }))
        .filter((w) => {
          if (w.y >= 92) {
            damaged = true;
            return false;
          }
          return true;
        });

      if (damaged) {
        soundService.playExplosion();
        const nextLives = livesRef.current - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          soundService.playError();
          return;
        }
      }

      setWords(updatedWords);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, gameOver, level]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setCurrentInput(val);
    soundService.playKeypress(false);

    // Check if matches any word
    const matchIdx = words.findIndex((w) => w.text.toLowerCase() === val);
    if (matchIdx >= 0) {
      soundService.playLaser();
      setWords((prev) => prev.filter((_, i) => i !== matchIdx));
      setCurrentInput('');
      const points = 100 * level;
      setScore((prev) => {
        const next = prev + points;
        if (next >= level * 500) {
          setLevel((lvl) => lvl + 1);
          soundService.playSuccess();
        }
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070e1c] text-white p-4 select-none relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b172a] border border-sky-900/60 rounded-xl mb-3 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arcade</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Score:</span>
            <span className="text-sky-400 font-mono font-bold text-sm">{score}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Level:</span>
            <span className="text-amber-400 font-mono font-bold">{level}</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 ${
                  heart <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="flex-1 bg-[#050b14] border-2 border-sky-950 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4">
        {/* Starfield & Defense Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

        {/* Falling Words Arena */}
        <div className="relative flex-1 w-full overflow-hidden">
          {words.map((w) => {
            const isTargeted = currentInput.length > 0 && w.text.startsWith(currentInput);
            return (
              <div
                key={w.id}
                className={`absolute px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wide transition-all shadow-lg ${
                  isTargeted
                    ? 'bg-sky-500 text-slate-950 border-white scale-110 shadow-sky-400/50 z-20'
                    : 'bg-[#0f243e] text-sky-200 border-sky-700/60'
                }`}
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                {w.text}
              </div>
            );
          })}
        </div>

        {/* Laser Defense Barrier at Bottom */}
        <div className="relative w-full h-1 bg-gradient-to-r from-rose-500 via-sky-400 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] my-2" />

        {/* Typing Input Dock */}
        <div className="relative z-10 max-w-md w-full mx-auto">
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={!isPlaying || gameOver}
            placeholder={isPlaying ? "Type falling word..." : "Press Start Game"}
            autoFocus={isPlaying}
            className="w-full px-4 py-3 rounded-xl bg-[#0a182d] border-2 border-sky-600/80 focus:border-sky-400 text-center font-mono text-lg text-white placeholder-slate-500 outline-none shadow-xl"
          />
        </div>

        {/* Start / Game Over Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3 bg-sky-500/20 border border-sky-400/40 rounded-2xl mb-3 text-sky-300">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Game A: Falling Words</h2>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Words are dropping towards your base defense perimeter. Type each word accurately before it touches the laser barrier!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Defense</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <h2 className="text-3xl font-heading font-extrabold text-rose-400 mb-1">Defense Breached!</h2>
            <p className="text-xs text-slate-400 mb-4">All defensive barriers collapsed.</p>
            <div className="p-4 rounded-xl bg-[#0a192c] border border-sky-900 mb-6 text-center min-w-[200px]">
              <div className="text-xs text-slate-400">Final Defense Score</div>
              <div className="text-3xl font-mono font-black text-amber-400 mt-1">{score}</div>
              <div className="text-[11px] text-sky-400 mt-0.5">Reached Wave {level}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
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
