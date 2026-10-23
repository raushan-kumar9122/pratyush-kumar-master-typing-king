/**
 * Arcade Games Hub for PRATYUSH KUMAR MASTER PRO
 * Complete launcher for all 6 typing games.
 */

import React, { useState } from 'react';
import { 
  Gamepad2, 
  Car, 
  Zap, 
  Flame, 
  Timer, 
  Target, 
  ShieldAlert, 
  ChevronRight, 
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { Student } from '../../types';
import { FallingWordsGame } from './FallingWordsGame';
import { TypeRacerGame } from './TypeRacerGame';
import { WordBlitzGame } from './WordBlitzGame';
import { SentenceSprintGame } from './SentenceSprintGame';
import { KeyboardChallengeGame } from './KeyboardChallengeGame';
import { SurvivalTypingGame } from './SurvivalTypingGame';

interface Props {
  activeStudent: Student;
  onBackToDashboard: () => void;
}

type ActiveGame = 'none' | 'falling-words' | 'type-racer' | 'word-blitz' | 'sentence-sprint' | 'keyboard-challenge' | 'survival-typing';

export const TypingGamesHub: React.FC<Props> = ({ activeStudent, onBackToDashboard }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  if (activeGame === 'falling-words') {
    return <FallingWordsGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'type-racer') {
    return <TypeRacerGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'word-blitz') {
    return <WordBlitzGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'sentence-sprint') {
    return <SentenceSprintGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'keyboard-challenge') {
    return <KeyboardChallengeGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'survival-typing') {
    return <SurvivalTypingGame student={activeStudent} onExit={() => setActiveGame('none')} />;
  }

  const GAMES_LIST = [
    {
      id: 'falling-words' as ActiveGame,
      title: 'Game A: Falling Words',
      badge: 'Arcade Classic',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
      icon: Zap,
      iconColor: 'text-emerald-400',
      description: 'Words cascade from the sky. Vaporize them with accurate typing before they breach your ground defense barrier!',
      skills: 'Reaction Speed & Word Recognition',
    },
    {
      id: 'type-racer' as ActiveGame,
      title: 'Game B: Type Racer',
      badge: 'Multi-Racer',
      badgeColor: 'bg-sky-950 text-sky-400 border-sky-800/40',
      icon: Car,
      iconColor: 'text-sky-400',
      description: 'Race against 3 computer AI drivers on a 4-lane grand prix circuit. Your live WPM directly powers your engine velocity!',
      skills: 'Sustained Velocity & Real-time Pressure',
    },
    {
      id: 'word-blitz' as ActiveGame,
      title: 'Game C: Word Blitz',
      badge: 'Multiplier Frenzy',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800/40',
      icon: Flame,
      iconColor: 'text-amber-400',
      description: '60 seconds of high-tempo rapid words. String together consecutive error-free words to unlock up to 4x score multipliers!',
      skills: 'High-frequency Keystroke Rhythm',
    },
    {
      id: 'sentence-sprint' as ActiveGame,
      title: 'Game D: Sentence Sprint',
      badge: 'Time Trial',
      badgeColor: 'bg-blue-950 text-blue-400 border-blue-800/40',
      icon: Timer,
      iconColor: 'text-blue-400',
      description: 'Clear full English sentences under strict lap deadlines. Advance through 5 demanding laps without letting the clock hit zero!',
      skills: 'Full sentence flow & Punctuation',
    },
    {
      id: 'keyboard-challenge' as ActiveGame,
      title: 'Game E: Keyboard Challenge',
      badge: 'Reflex Drill',
      badgeColor: 'bg-indigo-950 text-indigo-400 border-indigo-800/40',
      icon: Target,
      iconColor: 'text-indigo-400',
      description: 'Single-key muscle memory training. Striking highlighted keys measures your neurological reflex response in milliseconds (ms)!',
      skills: 'Individual Finger Precision & Latency',
    },
    {
      id: 'survival-typing' as ActiveGame,
      title: 'Game F: Survival Typing',
      badge: 'Hardcore',
      badgeColor: 'bg-rose-950 text-rose-400 border-rose-800/40',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      description: '3 hearts only! Every mistyped character inflicts structural shield damage. Survive 5 relentless waves to reach the apex!',
      skills: 'Zero-tolerance Error Elimination',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>Interactive Arcade Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Typing Games Arena
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Build speed, endurance, and razor-sharp reflexes through 6 specialized interactive games.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091728] border border-sky-900/60 text-xs text-sky-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Active Gamer: <strong>{activeStudent.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Games 6-Grid */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
        {GAMES_LIST.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="group bg-[#091628] hover:bg-[#0c1f38] border border-sky-900/50 hover:border-sky-400/60 rounded-2xl p-5 cursor-pointer shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-sky-900/60 ${game.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              <div>
                <div className="p-2 rounded-lg bg-[#06101d] border border-sky-950 text-[11px] text-slate-300 mb-4 font-mono">
                  Focus: {game.skills}
                </div>

                <div className="flex items-center justify-between text-xs text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Launch Game</span>
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
