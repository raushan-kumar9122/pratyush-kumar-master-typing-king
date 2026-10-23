/**
 * Examination Mode for The Future Track Computer Education
 * PRATYUSH KUMAR MASTER PRO
 * Official timed examination portal with candidate verification and strict test lock-down.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Award, 
  ArrowLeft,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { Student, AppSettings, Passage, TestResult } from '../../types';
import { TYPING_PASSAGES } from '../../data/passages';
import { TypingTestEngine } from '../test/TypingTestEngine';
import { CertificateModal } from '../certificate/CertificateModal';

interface Props {
  activeStudent: Student;
  settings: AppSettings;
  onBackToDashboard: () => void;
}

export const ExaminationMode: React.FC<Props> = ({
  activeStudent,
  settings,
  onBackToDashboard,
}) => {
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi'>('english');
  const [selectedDuration, setSelectedDuration] = useState<number>(3000); // 50 minutes total duration default
  const [backspaceRestricted, setBackspaceRestricted] = useState<boolean>(true);
  const [examinerCode, setExaminerCode] = useState<string>('FTCE-EXAM-2026');
  const [isCandidateVerified, setIsCandidateVerified] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<TestResult | null>(null);

  // Official 10-minute exam passages
  const tenMinPassage = TYPING_PASSAGES.find((p) => p.id === (selectedLanguage === 'english' ? 'eng-pass-10min' : 'hin-pass-10min'));
  const examPassages = TYPING_PASSAGES.filter((p) => p.category.includes('Official') && p.language === selectedLanguage);
  const chosenPassage: Passage = tenMinPassage || examPassages[0] || (selectedLanguage === 'english' ? TYPING_PASSAGES[3] : TYPING_PASSAGES[7]);

  if (examStarted) {
    return (
      <div className="flex flex-col h-full bg-[#060c18]">
        {/* Exam Warning Banner */}
        <div className="px-6 py-2 bg-rose-950/80 border-b border-rose-800 text-rose-200 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>OFFICIAL EXAMINATION IN PROGRESS — DO NOT SWITCH TABS OR REFRESH</span>
          </div>
          <div>
            Candidate: <strong>{activeStudent.name}</strong> ({activeStudent.rollNo})
          </div>
        </div>

        <TypingTestEngine
          activeStudent={activeStudent}
          initialPassage={chosenPassage}
          defaultDuration={selectedDuration}
          mode="exam"
          backspaceOverride={backspaceRestricted ? 'disabled' : 'allowed'}
          onFinish={(res) => {
            setExamResult(res);
            setExamStarted(false);
          }}
          onBackToDashboard={() => setExamStarted(false)}
          settings={settings}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Certification Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Institute Examination Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Conduct standardized speed and accuracy certification examinations under official institute rules.
            </p>
          </div>
        </div>
      </div>

      {/* Main Exam Configuration Container */}
      <div className="max-w-4xl w-full mx-auto bg-[#071322] border-2 border-sky-900/60 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
        {/* Verified Candidate Banner */}
        <div className="p-4 rounded-xl bg-[#09182d] border border-sky-800/80 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeStudent.avatar}</span>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Candidate Roll No:</div>
              <div className="font-heading font-bold text-base text-white">
                {activeStudent.name} <span className="font-mono text-sky-400 font-normal">({activeStudent.rollNo})</span>
              </div>
              <div className="text-xs text-slate-400">{activeStudent.course}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verify"
              checked={isCandidateVerified}
              onChange={(e) => setIsCandidateVerified(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-sky-700 cursor-pointer"
            />
            <label htmlFor="verify" className="text-xs text-sky-200 cursor-pointer select-none">
              Candidate Identity Verified by Invigilator
            </label>
          </div>
        </div>

        {/* Exam Parameter Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-xs">
          {/* Exam Language */}
          <div className="p-4 rounded-xl bg-[#06101d] border border-sky-950 space-y-2">
            <label className="block text-slate-400 font-medium">Examination Medium</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedLanguage('english')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  selectedLanguage === 'english'
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                    : 'bg-[#0a182b] text-slate-400 border-sky-950 hover:text-white'
                }`}
              >
                English Typing
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hindi')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  selectedLanguage === 'hindi'
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                    : 'bg-[#0a182b] text-slate-400 border-sky-950 hover:text-white'
                }`}
              >
                हिंदी (Unicode Inscript)
              </button>
            </div>
          </div>

          {/* Test Duration */}
          <div className="p-4 rounded-xl bg-[#06101d] border border-sky-950 space-y-2">
            <label className="block text-slate-400 font-medium">Prescribed Examination Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '50 Mins (टोटल)', secs: 3000 },
                { label: '10 Mins (मानक)', secs: 600 },
                { label: '5 Mins', secs: 300 },
                { label: '2 Mins', secs: 120 },
              ].map((d) => (
                <button
                  key={d.secs}
                  type="button"
                  onClick={() => setSelectedDuration(d.secs)}
                  className={`py-2 px-2 rounded-lg border text-center font-mono font-medium transition-all ${
                    selectedDuration === d.secs
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                      : 'bg-[#0a182b] text-slate-400 border-sky-950 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Backspace & Rule Toggles */}
        <div className="p-4 rounded-xl bg-[#06101d] border border-sky-950 mb-6 space-y-3 text-xs">
          <div className="font-semibold text-slate-300">Examination Protocol & Security Rules:</div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Strict Backspace Policy:</span>
            <button
              type="button"
              onClick={() => setBackspaceRestricted(!backspaceRestricted)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
                backspaceRestricted
                  ? 'bg-rose-950/80 border-rose-700 text-rose-300 font-bold'
                  : 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
              }`}
            >
              {backspaceRestricted ? 'Strictly Disabled (Standard Exam)' : 'Allowed'}
            </button>
          </div>
          <div className="flex items-center justify-between py-1 text-slate-400">
            <span>Passage Allocation:</span>
            <span className="font-mono text-sky-400">Official Standard Institute Passage</span>
          </div>
          <div className="flex items-center justify-between py-1 text-slate-400">
            <span>Certification Threshold:</span>
            <span className="font-mono text-emerald-400">Minimum 30 Net WPM & 90% Accuracy</span>
          </div>
        </div>

        {/* Tamper-Proof Advisory Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Security Notice:</strong> This offline examination environment secures test rules and disables user backspace locally during the session. As an offline desktop application, local examination mode is intended for supervised institute invigilation and is not tamper-proof against users with administrative OS access.
          </div>
        </div>

        {/* Start Examination CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-950">
          <button
            type="button"
            disabled={!isCandidateVerified}
            onClick={() => setExamStarted(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm shadow-xl transition-all ${
              isCandidateVerified
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Launch Official Examination</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal on completion */}
      {examResult && (
        <CertificateModal
          student={activeStudent}
          result={examResult}
          onClose={() => setExamResult(null)}
        />
      )}
    </div>
  );
};
