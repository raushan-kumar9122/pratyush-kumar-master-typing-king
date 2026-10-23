/**
 * Accurate Scoring & WPM Engine for PRATYUSH KUMAR MASTER PRO
 * Implements official commercial and government certification standards.
 */

export interface ScoringInput {
  targetText: string;
  typedText: string;
  elapsedSeconds: number;
  backspaceCount: number;
}

export interface ScoringResult {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalCharsTyped: number;
  correctChars: number;
  errorChars: number;
  elapsedMinutes: number;
  cpm: number; // Characters Per Minute
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  weakKeys: string[];
}

export function calculateTypingScores(input: ScoringInput): ScoringResult {
  const { targetText, typedText, elapsedSeconds } = input;

  // Prevent divide-by-zero, default to 1 second minimum for calculation
  const safeSeconds = Math.max(1, elapsedSeconds);
  const elapsedMinutes = safeSeconds / 60;

  const totalCharsTyped = typedText.length;
  let correctChars = 0;
  let errorChars = 0;
  const errorKeyMap: Record<string, number> = {};

  const minLength = Math.min(targetText.length, typedText.length);

  for (let i = 0; i < minLength; i++) {
    const expectedChar = targetText[i];
    const actualChar = typedText[i];

    if (expectedChar === actualChar) {
      correctChars++;
    } else {
      errorChars++;
      // Log expected key that was mistyped
      if (expectedChar.trim().length > 0) {
        errorKeyMap[expectedChar.toLowerCase()] = (errorKeyMap[expectedChar.toLowerCase()] || 0) + 1;
      }
    }
  }

  // If typed more characters than target
  if (typedText.length > targetText.length) {
    errorChars += (typedText.length - targetText.length);
  }

  // Gross WPM = (Total Characters Typed / 5) / Elapsed Minutes
  // 5 characters = 1 standard word
  const grossWpm = Math.round((totalCharsTyped / 5) / elapsedMinutes);

  // Net WPM = Gross WPM - (Penalized Errors / Elapsed Minutes)
  const penalty = errorChars / elapsedMinutes;
  const netWpm = Math.max(0, Math.round(grossWpm - penalty));

  // Accuracy % = (Correct Evaluated Characters / Total Characters Typed) * 100
  const accuracy = totalCharsTyped > 0 
    ? Math.min(100, Math.max(0, parseFloat(((correctChars / totalCharsTyped) * 100).toFixed(1))))
    : 100;

  // Characters per minute (CPM)
  const cpm = Math.round(totalCharsTyped / elapsedMinutes);

  // Grade determination based on commercial typing exam criteria
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (netWpm >= 50 && accuracy >= 95) {
    grade = 'A+';
  } else if (netWpm >= 40 && accuracy >= 90) {
    grade = 'A';
  } else if (netWpm >= 30 && accuracy >= 85) {
    grade = 'B';
  } else if (netWpm >= 20 && accuracy >= 80) {
    grade = 'C';
  } else if (netWpm >= 15) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  // Extract top mistyped keys
  const weakKeys = Object.entries(errorKeyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => key);

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalCharsTyped,
    correctChars,
    errorChars,
    elapsedMinutes,
    cpm,
    grade,
    weakKeys,
  };
}
