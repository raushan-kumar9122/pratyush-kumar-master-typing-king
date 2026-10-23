/**
 * Game F: Survival Typing
 * Progressive wave challenges where typos consume limited hearts!
 */

import React, { useState } from 'react';
import { Play, RotateCcw, ArrowLeft, Heart, ShieldAlert, Award, AlertTriangle } from 'lucide-react';
import { Student } from '../../types';
import { soundService } from '../../services/sound';

const WAVES = [
  { wave: 1, text: "The future belongs to those who prepare for it today.", speedGoal: "Wave 1 - Steady" },
  { wave: 2, text: "Accurate keystrokes eliminate cognitive friction and boost endurance.", speedGoal: "Wave 2 - Elevation" },
  { wave: 3, text: "Complex syntax: function calculateVelocity(dx: number, dt: number): number { return dx / dt; }", speedGoal: "Wave 3 - Code Syntax" },
  { wave: 4, text: "Hyper-velocity transcription requires flawless emotional composure under pressure.", speedGoal: "Wave 4 - High Stakes" },
  { wave: 5, text: "The Future Track Computer Education: Elite Typing Mastery unlocked successfully!", speedGoal: "Final Wave - Apex" },
];

interface Props {
  student: Student;
  onExit: () => void;
}

export const SurvivalTypingGame: React.FC<Props> = ({ student, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [waveIdx, setWaveIdx] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [typed, setTyped] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [victory, setVictory] = useState<boolean>(false);

  const currentWave = WAVES[waveIdx];

  const startSurvival = () => {
    setIsPlaying(true);
    setWaveIdx(0);
    setLives(3);
    setTyped('');
    setGameOver(false);
    setVictory(false);
  };

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
      const expectedChar = currentWave.text[typed.length];

      if (nextChar === expectedChar) {
        soundService.playKeypress(nextChar === ' ');
        const nextTyped = typed + nextChar;
        setTyped(nextTyped);

        if (nextTyped === currentWave.text) {
          soundService.playSuccess();
          if (waveIdx + 1 < WAVES.length) {
            setWaveIdx((w) => w + 1);
            setTyped('');
            // Bonus life reward on clear
            setLives((l) => Math.min(3, l + 1));
          } else {
            setVictory(true);
            setIsPlaying(false);
            soundService.playFanfare();
          }
        }
      } else {
        // Punish typo with life loss!
        soundService.playExplosion();
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          soundService.playError();
        }
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

        <div className="flex items-center gap-6">
          <span className="text-slate-400">
            Wave: <strong className="text-amber-400 font-mono">{waveIdx + 1} / {WAVES.length}</strong>
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Survival Arena */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center bg-[#06101d] border-2 border-sky-950 rounded-2xl p-6 sm:p-10 relative shadow-2xl">
        {isPlaying && !gameOver && !victory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 uppercase font-bold tracking-wider">
                {currentWave.speedGoal}
              </span>
              <span className="text-rose-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Any typo deducts 1 Life!
              </span>
            </div>

            <div className="font-mono text-xl sm:text-2xl leading-relaxed p-6 bg-[#0a1b32] rounded-xl border border-sky-900/80">
              {currentWave.text.split('').map((char, i) => {
                const isTyped = i < typed.length;
                const isCurrent = i === typed.length;
                return (
                  <span
                    key={i}
                    className={
                      isTyped
                        ? 'text-emerald-400 font-bold'
                        : isCurrent
                        ? 'text-rose-400 underline font-bold bg-rose-500/20'
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
              placeholder="Flawless typing only..."
              className="w-full px-5 py-3 rounded-xl bg-[#091728] border-2 border-rose-500/70 text-center font-mono text-white outline-none shadow-lg shadow-rose-950/40"
            />
          </div>
        )}

        {!isPlaying && !gameOver && !victory && (
          <div className="text-center space-y-4 max-w-sm mx-auto">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-heading font-bold text-white">Game F: Survival Typing</h2>
            <p className="text-xs text-slate-400">
              Only elite typists survive! Every mistyped character instantly damages your shields. Clear all 5 waves without flatlining!
            </p>
            <button
              onClick={startSurvival}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl mx-auto"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Enter Survival Protocol</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-heading font-extrabold text-rose-500">Shields Depleted!</h2>
            <p className="text-xs text-slate-400">You succumbed to errors on Wave {waveIdx + 1}.</p>
            <button
              onClick={startSurvival}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Survival</span>
            </button>
          </div>
        )}

        {victory && (
          <div className="text-center space-y-4">
            <Award className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-heading font-extrabold text-white">Ultimate Survivor!</h2>
            <p className="text-xs text-sky-300">You conquered all 5 punishing waves without depleting your lives!</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={startSurvival}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
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
        )}
      </div>
    </div>
  );
};
