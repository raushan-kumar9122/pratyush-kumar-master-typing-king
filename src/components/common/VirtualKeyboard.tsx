/**
 * Interactive Virtual Keyboard for PRATYUSH KUMAR MASTER PRO
 * Features ergonomic finger color mapping, active key guidance, and Hindi/English layout support.
 */

import React, { useEffect, useState } from 'react';

interface Props {
  activeChar?: string;
  layout?: 'qwerty' | 'inscript';
  compact?: boolean;
}

// Finger zones
// lp: Left Pinky, lr: Left Ring, lm: Left Middle, li: Left Index
// th: Thumbs
// ri: Right Index, rm: Right Middle, rr: Right Ring, rp: Right Pinky
const FINGER_MAP: Record<string, string> = {
  // Left Pinky
  '`': 'lp', '1': 'lp', 'q': 'lp', 'a': 'lp', 'z': 'lp',
  '~': 'lp', '!': 'lp', 'Q': 'lp', 'A': 'lp', 'Z': 'lp',
  // Left Ring
  '2': 'lr', 'w': 'lr', 's': 'lr', 'x': 'lr',
  '@': 'lr', 'W': 'lr', 'S': 'lr', 'X': 'lr',
  // Left Middle
  '3': 'lm', 'e': 'lm', 'd': 'lm', 'c': 'lm',
  '#': 'lm', 'E': 'lm', 'D': 'lm', 'C': 'lm',
  // Left Index
  '4': 'li', '5': 'li', 'r': 'li', 't': 'li', 'f': 'li', 'g': 'li', 'v': 'li', 'b': 'li',
  '$': 'li', '%': 'li', 'R': 'li', 'T': 'li', 'F': 'li', 'G': 'li', 'V': 'li', 'B': 'li',
  // Thumbs
  ' ': 'th',
  // Right Index
  '6': 'ri', '7': 'ri', 'y': 'ri', 'u': 'ri', 'h': 'ri', 'j': 'ri', 'n': 'ri', 'm': 'ri',
  '^': 'ri', '&': 'ri', 'Y': 'ri', 'U': 'ri', 'H': 'ri', 'J': 'ri', 'N': 'ri', 'M': 'ri',
  // Right Middle
  '8': 'rm', 'i': 'rm', 'k': 'rm', ',': 'rm',
  '*': 'rm', 'I': 'rm', 'K': 'rm', '<': 'rm',
  // Right Ring
  '9': 'rr', 'o': 'rr', 'l': 'rr', '.': 'rr',
  '(': 'rr', 'O': 'rr', 'L': 'rr', '>': 'rr',
  // Right Pinky
  '0': 'rp', '-': 'rp', '=': 'rp', 'p': 'rp', '[': 'rp', ']': 'rp', '\\': 'rp',
  ';': 'rp', '\'': 'rp', '/': 'rp',
  ')': 'rp', '_': 'rp', '+': 'rp', 'P': 'rp', '{': 'rp', '}': 'rp', '|': 'rp',
  ':': 'rp', '"': 'rp', '?': 'rp',
};

const FINGER_NAMES: Record<string, string> = {
  lp: 'Left Pinky',
  lr: 'Left Ring',
  lm: 'Left Middle',
  li: 'Left Index',
  th: 'Thumb (Space)',
  ri: 'Right Index',
  rm: 'Right Middle',
  rr: 'Right Ring',
  rp: 'Right Pinky',
};

const FINGER_COLORS: Record<string, string> = {
  lp: 'border-rose-500/40 text-rose-300',
  lr: 'border-amber-500/40 text-amber-300',
  lm: 'border-emerald-500/40 text-emerald-300',
  li: 'border-sky-500/40 text-sky-300',
  th: 'border-indigo-500/40 text-indigo-300',
  ri: 'border-sky-500/40 text-sky-300',
  rm: 'border-emerald-500/40 text-emerald-300',
  rr: 'border-amber-500/40 text-amber-300',
  rp: 'border-rose-500/40 text-rose-300',
};

// Hindi Inscript key map definitions for labels
const HINDI_INSC_MAP: Record<string, string> = {
  'q': 'ौ', 'w': 'ै', 'e': 'ा', 'r': 'ी', 't': 'ू', 'y': 'ब', 'u': 'ह', 'i': 'ग', 'o': 'द', 'p': 'ज', '[': 'ड', ']': '़',
  'a': 'ो', 's': 'े', 'd': '्', 'f': 'ि', 'g': 'ु', 'h': 'प', 'j': 'र', 'k': 'क', 'l': 'त', ';': 'च', '\'': 'ट',
  'z': 'ं', 'x': 'ं', 'c': 'म', 'v': 'न', 'b': 'व', 'n': 'ल', 'm': 'स', ',': ',', '.': '.', '/': 'य'
};

interface KeyItem {
  key: string;
  shift?: string;
  hindi?: string;
  width?: string;
  special?: boolean;
  home?: boolean;
  label?: string;
}

export const VirtualKeyboard: React.FC<Props> = ({ activeChar = '', layout = 'qwerty', compact = false }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toLowerCase());
    };
    const handleKeyUp = () => {
      setPressedKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const normalizedTarget = activeChar.toLowerCase();
  const currentFinger = activeChar ? FINGER_MAP[activeChar] || 'th' : null;

  const rows: KeyItem[][] = [
    // Row 1: Numbers
    [
      { key: '`', shift: '~', width: 'w-8 sm:w-10' },
      { key: '1', shift: '!', hindi: '१' },
      { key: '2', shift: '@', hindi: '२' },
      { key: '3', shift: '#', hindi: '३' },
      { key: '4', shift: '$', hindi: '४' },
      { key: '5', shift: '%', hindi: '५' },
      { key: '6', shift: '^', hindi: '६' },
      { key: '7', shift: '&', hindi: '७' },
      { key: '8', shift: '*', hindi: '८' },
      { key: '9', shift: '(', hindi: '९' },
      { key: '0', shift: ')', hindi: '०' },
      { key: '-', shift: '_' },
      { key: '=', shift: '+' },
      { key: 'Backspace', width: 'w-16 sm:w-20', special: true },
    ],
    // Row 2: Tab + QWERTY
    [
      { key: 'Tab', width: 'w-14 sm:w-16', special: true },
      { key: 'q', shift: 'Q' },
      { key: 'w', shift: 'W' },
      { key: 'e', shift: 'E' },
      { key: 'r', shift: 'R' },
      { key: 't', shift: 'T' },
      { key: 'y', shift: 'Y' },
      { key: 'u', shift: 'U' },
      { key: 'i', shift: 'I' },
      { key: 'o', shift: 'O' },
      { key: 'p', shift: 'P' },
      { key: '[', shift: '{' },
      { key: ']', shift: '}' },
      { key: '\\', shift: '|', width: 'w-10 sm:w-12' },
    ],
    // Row 3: Caps + ASDF
    [
      { key: 'Caps', width: 'w-16 sm:w-20', special: true },
      { key: 'a', shift: 'A' },
      { key: 's', shift: 'S' },
      { key: 'd', shift: 'D', home: true },
      { key: 'f', shift: 'F', home: true },
      { key: 'g', shift: 'G' },
      { key: 'h', shift: 'H' },
      { key: 'j', shift: 'J', home: true },
      { key: 'k', shift: 'K', home: true },
      { key: 'l', shift: 'L' },
      { key: ';', shift: ':' },
      { key: '\'', shift: '"' },
      { key: 'Enter', width: 'w-16 sm:w-20', special: true },
    ],
    // Row 4: Shift + ZXCVB
    [
      { key: 'Shift', width: 'w-20 sm:w-24', special: true },
      { key: 'z', shift: 'Z' },
      { key: 'x', shift: 'X' },
      { key: 'c', shift: 'C' },
      { key: 'v', shift: 'V' },
      { key: 'b', shift: 'B' },
      { key: 'n', shift: 'N' },
      { key: 'm', shift: 'M' },
      { key: ',', shift: '<' },
      { key: '.', shift: '>' },
      { key: '/', shift: '?' },
      { key: 'Shift ', width: 'w-20 sm:w-24', special: true },
    ],
    // Row 5: Space
    [
      { key: 'Ctrl', width: 'w-12 sm:w-14', special: true },
      { key: 'Win', width: 'w-10 sm:w-12', special: true },
      { key: 'Alt', width: 'w-10 sm:w-12', special: true },
      { key: ' ', width: 'flex-1 max-w-[340px]', label: 'Spacebar' },
      { key: 'Alt ', width: 'w-10 sm:w-12', special: true },
      { key: 'Win ', width: 'w-10 sm:w-12', special: true },
      { key: 'Ctrl ', width: 'w-12 sm:w-14', special: true },
    ],
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto p-3 bg-[#071120]/90 border border-sky-900/40 rounded-xl shadow-xl select-none ${compact ? 'scale-90 origin-top' : ''}`}>
      {/* Top Helper: Target Finger Guideline */}
      {activeChar && (
        <div className="flex items-center justify-between mb-2 px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Next Target:</span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-sm border border-sky-400/30">
              {activeChar === ' ' ? 'SPACE' : activeChar}
            </span>
          </div>
          {currentFinger && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-400">Finger:</span>
              <span className={`px-2 py-0.5 rounded border ${FINGER_COLORS[currentFinger] || 'text-slate-300'} bg-slate-900/60 font-semibold`}>
                {FINGER_NAMES[currentFinger]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Matrix */}
      <div className="space-y-1.5 font-mono">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((item, cIdx) => {
              const k = item.key;
              const isSpace = k === ' ';
              const isTarget =
                (isSpace && activeChar === ' ') ||
                (k.length === 1 && (k.toLowerCase() === normalizedTarget || item.shift === activeChar)) ||
                (layout === 'inscript' && HINDI_INSC_MAP[k.toLowerCase()] === activeChar);

              const isDown = pressedKey === k.toLowerCase() || (isSpace && pressedKey === ' ');
              const finger = FINGER_MAP[k] || 'th';
              const hindiChar = layout === 'inscript' ? HINDI_INSC_MAP[k.toLowerCase()] || item.hindi : null;

              let keyStyle = 'bg-[#0f2138] border-[#1e3e62] text-slate-300 hover:border-sky-500/50';
              if (item.special) {
                keyStyle = 'bg-[#091526] border-sky-950 text-slate-400 text-[10px] sm:text-xs';
              }
              if (item.home) {
                keyStyle += ' border-b-2 border-b-sky-400/80';
              }
              if (isTarget) {
                keyStyle = 'bg-sky-500 text-white font-bold border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.7)] animate-pulse scale-[1.03] z-10';
              } else if (isDown) {
                keyStyle = 'bg-blue-600 text-white scale-95 border-sky-400';
              }

              return (
                <div
                  key={cIdx}
                  className={`h-9 sm:h-11 ${item.width || 'w-8 sm:w-11'} rounded-md border flex flex-col items-center justify-center transition-all duration-75 relative ${keyStyle}`}
                >
                  {/* Home row bump indicator for F and J */}
                  {(k === 'f' || k === 'j') && !isTarget && (
                    <div className="absolute bottom-1 w-3 h-0.5 bg-sky-400/80 rounded-full" />
                  )}

                  {/* Hindi & Shift labels */}
                  {layout === 'inscript' && hindiChar ? (
                    <>
                      <span className="text-[11px] sm:text-xs font-bold leading-none text-sky-200">{hindiChar}</span>
                      <span className="text-[8px] sm:text-[9px] opacity-60 leading-none mt-0.5">{k.toUpperCase()}</span>
                    </>
                  ) : (
                    <>
                      {item.shift && item.shift !== k.toUpperCase() && (
                        <span className="text-[8px] opacity-60 leading-none">{item.shift}</span>
                      )}
                      <span className={`text-[11px] sm:text-xs leading-none font-medium ${isTarget ? 'text-white font-bold' : ''}`}>
                        {item.label || (k.length === 1 ? k.toUpperCase() : k)}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ergonomic Finger Zone Guide Legend */}
      <div className="hidden md:flex items-center justify-center gap-4 mt-3 pt-2.5 border-t border-sky-950/80 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
          <span>Pinky</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span>Ring</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span>Middle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500/80"></span>
          <span>Index</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80"></span>
          <span>Thumbs (Space)</span>
        </div>
      </div>
    </div>
  );
};
