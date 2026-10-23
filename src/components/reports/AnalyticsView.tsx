/**
 * Reports and Analytics View for PRATYUSH KUMAR MASTER PRO
 * Complete progress charts, accuracy trends, key heat-maps, and English/Hindi split.
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Award, 
  Printer, 
  Download, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Student, TestResult } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  activeStudent: Student;
}

export const AnalyticsView: React.FC<Props> = ({ activeStudent }) => {
  const [langFilter, setLangFilter] = useState<'all' | 'english' | 'hindi'>('all');

  const allResults = storageService.getResults(activeStudent.id);
  const filteredResults = langFilter === 'all'
    ? allResults
    : allResults.filter((r) => r.language === langFilter);

  // Statistics
  const totalTests = filteredResults.length;
  const bestWpm = Math.max(...filteredResults.map((r) => r.netWpm), 0);
  const avgAccuracy = totalTests > 0
    ? Math.round(filteredResults.reduce((a, b) => a + b.accuracy, 0) / totalTests)
    : 100;
  const avgWpm = totalTests > 0
    ? Math.round(filteredResults.reduce((a, b) => a + b.netWpm, 0) / totalTests)
    : 0;

  // Separate English & Hindi stats
  const englishResults = allResults.filter((r) => r.language === 'english');
  const hindiResults = allResults.filter((r) => r.language === 'hindi');

  const engBestWpm = Math.max(...englishResults.map((r) => r.netWpm), 0);
  const hinBestWpm = Math.max(...hindiResults.map((r) => r.netWpm), 0);

  // Extract frequently mistyped keys
  const weakKeyCounts: Record<string, number> = {};
  filteredResults.forEach((r) => {
    r.weakKeys?.forEach((k) => {
      weakKeyCounts[k] = (weakKeyCounts[k] || 0) + 1;
    });
  });

  const sortedWeakKeys = Object.entries(weakKeyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Chart data: chronological latest 10 tests
  const chartItems = [...filteredResults].reverse().slice(-10);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Performance Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Student Progress & Test History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive telemetry for {activeStudent.name} ({activeStudent.rollNo})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language filter */}
            <div className="flex items-center bg-[#071322] border border-sky-900/60 p-1 rounded-xl text-xs">
              {(['all', 'english', 'hindi'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLangFilter(l)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    langFilter === l
                      ? 'bg-sky-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Transcript</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[#091628] border border-sky-900/60 text-center">
          <div className="text-xs text-slate-400 font-medium">Personal Best</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 font-mono mt-1">
            {bestWpm}
          </div>
          <div className="text-[11px] text-sky-300 font-mono">NET WPM</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091628] border border-sky-900/60 text-center">
          <div className="text-xs text-slate-400 font-medium">Average Accuracy</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-emerald-300 font-mono">PRECISION</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091628] border border-sky-900/60 text-center">
          <div className="text-xs text-slate-400 font-medium">Completed Tests</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-1">
            {totalTests}
          </div>
          <div className="text-[11px] text-amber-300 font-mono">SESSIONS</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091628] border border-sky-900/60 text-center">
          <div className="text-xs text-slate-400 font-medium">Average Cadence</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono mt-1">
            {avgWpm}
          </div>
          <div className="text-[11px] text-indigo-300 font-mono">AVERAGE WPM</div>
        </div>
      </div>

      {/* Split Comparison Cards: English vs Hindi */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
        <div className="p-5 rounded-2xl bg-[#071322] border border-sky-950 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sky-400 font-mono uppercase font-bold tracking-wider">English Typing Metric</span>
            <h3 className="font-heading font-semibold text-base text-white">Touch Typing Cadence</h3>
            <div className="text-slate-400">{englishResults.length} Tests Completed</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-sky-400">{engBestWpm} WPM</div>
            <div className="text-slate-400">Peak Speed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#071322] border border-sky-950 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-amber-400 font-mono uppercase font-bold tracking-wider">Hindi Typing Metric</span>
            <h3 className="font-heading font-semibold text-base text-white">यूनिकोड देवनागरी</h3>
            <div className="text-slate-400">{hindiResults.length} Tests Completed</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-amber-400">{hinBestWpm} WPM</div>
            <div className="text-slate-400">Peak Speed</div>
          </div>
        </div>
      </div>

      {/* Visual WPM & Accuracy Trend Chart */}
      <div className="max-w-6xl w-full mx-auto p-6 rounded-2xl bg-[#071322] border border-sky-900/60 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-base text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <span>WPM Velocity Progression (Last 10 Tests)</span>
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span> Net WPM
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Accuracy %
            </span>
          </div>
        </div>

        {chartItems.length > 0 ? (
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-sky-950">
            {chartItems.map((item, i) => {
              const maxScale = Math.max(80, bestWpm + 10);
              const heightPercent = Math.min(100, Math.max(10, (item.netWpm / maxScale) * 100));
              return (
                <div key={item.id} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                    {item.netWpm} WPM
                  </div>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-sky-300 rounded-t-lg transition-all duration-300 relative shadow-md shadow-sky-500/20"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Small accuracy dot */}
                    <div 
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 border border-slate-900"
                      title={`Accuracy: ${item.accuracy}%`}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    #{i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-500 text-xs">
            No test records available for selected criteria yet. Complete your first typing test!
          </div>
        )}
      </div>

      {/* Weak Keys Heat Map */}
      <div className="max-w-6xl w-full mx-auto p-6 rounded-2xl bg-[#071322] border border-sky-900/60 mb-6">
        <h3 className="font-heading font-semibold text-base text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>Frequently Mistyped Keys (Targeted Muscle Drill)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Keys where mistakes most frequently occurred across all sessions. Prioritize these keys during daily lesson practice.
        </p>

        {sortedWeakKeys.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {sortedWeakKeys.map(([key, count]) => (
              <div
                key={key}
                className="px-4 py-2.5 rounded-xl bg-[#0a1b32] border border-rose-900/60 flex items-center gap-3 text-xs"
              >
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-base flex items-center justify-center border border-rose-500/40 uppercase">
                  {key === ' ' ? 'SPC' : key}
                </span>
                <div>
                  <div className="text-white font-medium">Mistyped: {count} times</div>
                  <div className="text-[10px] text-slate-400">Needs deliberate practice</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-emerald-400 font-medium">
            Outstanding work! Minimal repeat key errors logged.
          </div>
        )}
      </div>

      {/* Detailed Historical Log Table */}
      <div className="max-w-6xl w-full mx-auto rounded-2xl bg-[#071322] border border-sky-900/60 overflow-hidden shadow-xl mb-8">
        <div className="p-4 bg-[#091728] border-b border-sky-950 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-sm text-white">Full Practice Session History</h3>
          <span className="text-xs text-slate-400 font-mono">{filteredResults.length} Entries Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#050e18] text-slate-400 uppercase font-mono text-[10px] border-b border-sky-950">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Passage Title</th>
                <th className="px-4 py-3">Medium</th>
                <th className="px-4 py-3 text-right">Net WPM</th>
                <th className="px-4 py-3 text-right">Gross WPM</th>
                <th className="px-4 py-3 text-right">Accuracy</th>
                <th className="px-4 py-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-950/60 font-mono">
              {filteredResults.map((res) => (
                <tr key={res.id} className="hover:bg-sky-950/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(res.timestamp).toLocaleDateString()} {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-sans font-medium text-white truncate max-w-[200px]">
                    {res.passageTitle}
                  </td>
                  <td className="px-4 py-3 capitalize text-sky-400">
                    {res.language}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-sky-300">
                    {res.netWpm}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    {res.grossWpm}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {res.accuracy}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-amber-300 font-bold text-[10px]">
                      {res.grade || 'A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
