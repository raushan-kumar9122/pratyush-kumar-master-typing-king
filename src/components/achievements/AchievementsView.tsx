/**
 * Achievements Trophy Room for PRATYUSH KUMAR MASTER PRO
 */

import React from 'react';
import { Award, Lock, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { Achievement, Student } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  activeStudent: Student;
}

export const AchievementsView: React.FC<Props> = ({ activeStudent }) => {
  const achievements: Achievement[] = storageService.getAchievements();

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Honor Roll & Milestones</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Student Achievements
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Earn badges by mastering speed milestones, exceptional precision, and consistent daily practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#071322] border border-sky-900/60 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">BADGES EARNED</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {unlockedCount} / {achievements.length} <span className="text-xs text-slate-400 font-normal">({progressPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#06101d] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {achievements.map((ach) => {
          const isUnlocked = ach.unlockedAt !== null;
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#0a1e38] to-[#071324] border-sky-500/70 shadow-lg shadow-sky-500/10'
                  : 'bg-[#060e1a] border-sky-950 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-inner ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-400/50 shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 grayscale'
                  }`}>
                    {ach.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className={`font-heading font-bold text-base mb-1 ${
                  isUnlocked ? 'text-white' : 'text-slate-400'
                }`}>
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-sky-950 text-[11px] font-mono flex items-center justify-between text-slate-500">
                <span>Criteria: <strong className="text-sky-300">{ach.requirement}</strong></span>
                {isUnlocked && (
                  <span className="text-[10px] text-amber-400">
                    {new Date(ach.unlockedAt!).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
