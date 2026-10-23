/**
 * Automated Test Suite for Typing Scoring & Examination Engine
 * PRATYUSH KUMAR MASTER PRO - The Future Track Computer Education
 */

import { calculateTypingScores } from './scoring';

export function runScoringTests() {
  const tests = [
    {
      name: 'Perfect 1-minute 60 WPM test with zero errors',
      target: 'The quick brown fox jumps over the lazy dog and runs fast into the woods.',
      typed: 'The quick brown fox jumps over the lazy dog and runs fast into the woods.',
      elapsedSeconds: 60,
      backspaces: 0,
      assert: (res: ReturnType<typeof calculateTypingScores>) => {
        return res.accuracy === 100 && res.errorChars === 0 && res.grossWpm === res.netWpm;
      }
    },
    {
      name: 'Test with error penalty subtraction in Net WPM',
      target: 'Hello world test passage for typing score calculations.',
      typed: 'Hello world tXst passage for typing scorX calculations.',
      elapsedSeconds: 60,
      backspaces: 2,
      assert: (res: ReturnType<typeof calculateTypingScores>) => {
        return res.errorChars === 2 && res.netWpm < res.grossWpm && res.accuracy < 100;
      }
    },
    {
      name: 'Division by zero protection on immediate start',
      target: 'Quick start test.',
      typed: 'Q',
      elapsedSeconds: 0,
      backspaces: 0,
      assert: (res: ReturnType<typeof calculateTypingScores>) => {
        return !isNaN(res.grossWpm) && !isNaN(res.netWpm) && isFinite(res.grossWpm);
      }
    },
    {
      name: 'Hindi Unicode character evaluation test',
      target: 'द फ्यूचर ट्रैक कंप्यूटर एजुकेशन में आपका स्वागत है।',
      typed: 'द फ्यूचर ट्रैक कंप्यूटर एजुकेशन में आपका स्वागत है।',
      elapsedSeconds: 60,
      backspaces: 1,
      assert: (res: ReturnType<typeof calculateTypingScores>) => {
        return res.accuracy === 100 && res.errorChars === 0;
      }
    }
  ];

  const results = tests.map((t) => {
    const output = calculateTypingScores({
      targetText: t.target,
      typedText: t.typed,
      elapsedSeconds: t.elapsedSeconds,
      backspaceCount: t.backspaces,
    });
    const passed = t.assert(output);
    return { name: t.name, passed, output };
  });

  return results;
}
