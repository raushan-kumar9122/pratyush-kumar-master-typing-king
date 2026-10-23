/**
 * Official Printable Certificate for The Future Track Computer Education
 * PRATYUSH KUMAR MASTER PRO
 */

import React from 'react';
import { Printer, Download, X, Award, CheckCircle2, Shield } from 'lucide-react';
import { Student, TestResult } from '../../types';

interface Props {
  student: Student;
  result: TestResult;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ student, result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(result.timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certNumber = `FTCE-${result.language.toUpperCase().substring(0, 3)}-${student.rollNo.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-5)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b1626] border border-sky-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Modal Controls (Not printed) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-[#070e1a] border-b border-sky-900/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-semibold text-sky-200">
              Official Typing Proficiency Certificate
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium rounded-lg shadow-md transition-all text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Document */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 certificate-sheet selection:bg-amber-100">
          <div className="border-[6px] border-double border-[#0f2847] p-8 sm:p-12 relative bg-gradient-to-b from-amber-50/20 via-white to-sky-50/30">
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <div className="w-96 h-96 rounded-full border-[20px] border-slate-900 flex items-center justify-center text-center font-serif text-8xl font-black">
                FTCE
              </div>
            </div>

            {/* Certificate Header */}
            <div className="text-center relative z-10 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sky-900 text-sm font-semibold tracking-widest uppercase">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>An ISO 9001:2015 Certified IT Training Academy</span>
                <Shield className="w-4 h-4 text-amber-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                THE FUTURE TRACK COMPUTER EDUCATION
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Government Registered Institution for Advanced Information Technology & Vocational Training
              </p>
              <div className="pt-3">
                <span className="inline-block px-6 py-1.5 bg-[#0f2847] text-amber-300 font-heading text-sm sm:text-base font-bold tracking-wider uppercase rounded-sm shadow">
                  Certificate of Typing Proficiency
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="mt-8 text-center relative z-10 space-y-6 text-slate-800">
              <p className="text-sm italic font-serif text-slate-600">
                This is officially certified and awarded to
              </p>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f2847] underline decoration-amber-400 decoration-2 underline-offset-8">
                  {student.name}
                </h2>
                <p className="text-xs text-slate-600 mt-2 font-mono">
                  Roll No: <span className="font-semibold text-slate-900">{student.rollNo}</span> | Course: <span className="font-semibold text-slate-900">{student.course}</span>
                </p>
              </div>

              <p className="text-sm max-w-2xl mx-auto leading-relaxed text-slate-700">
                for demonstrating benchmark technical competency on the 
                <strong className="text-slate-900"> PRATYUSH KUMAR MASTER PRO</strong> examination platform.
                The candidate has undergone rigorous speed and accuracy evaluation under standard examination criteria.
              </p>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">Net Speed</div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-800 font-mono">
                    {result.netWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">Gross Speed</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-700 font-mono">
                    {result.grossWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">Accuracy</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono">
                    {result.accuracy}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">Awarded Grade</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600 font-mono">
                    {result.grade || 'A'}
                  </div>
                </div>
              </div>

              {/* Assessment Meta */}
              <div className="text-xs text-slate-500 flex flex-wrap justify-center gap-x-6 gap-y-1 pt-2 font-mono">
                <span>Assessment: <strong>{result.language === 'hindi' ? 'Hindi (Devanagari Unicode)' : 'English Touch Typing'}</strong></span>
                <span>Duration: <strong>{result.durationSeconds} Seconds</strong></span>
                <span>Total Characters: <strong>{result.totalCharacters}</strong></span>
                <span>Evaluated Date: <strong>{formattedDate}</strong></span>
              </div>
            </div>

            {/* Certificate Footer Signatures */}
            <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-center relative z-10 text-xs">
              <div>
                <div className="w-24 h-10 mx-auto flex items-center justify-center font-serif italic text-slate-700 text-sm">
                  P. Kumar
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                  Pratyush Kumar
                </div>
                <div className="text-[10px] text-slate-500">Software Architect / Lead</div>
              </div>

              {/* Official Seal Graphic */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-700/70 p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-amber-800/80 bg-amber-50 flex flex-col items-center justify-center text-[8px] font-bold text-amber-900 leading-tight">
                    <span>FTCE</span>
                    <span>SEAL</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1">
                  Cert No: {certNumber}
                </div>
              </div>

              <div>
                <div className="w-24 h-10 mx-auto flex items-center justify-center font-serif italic text-slate-700 text-sm">
                  Examiner Office
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                  Director / Examiner
                </div>
                <div className="text-[10px] text-slate-500">The Future Track Education</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
