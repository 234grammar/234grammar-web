import type { HarperIssue } from './harper';

// Core Pidgin vocabulary
const PIDGIN_DICTIONARY = new Set([
  // Pronouns / person markers
  'im', 'am', 'una', 'dem',
  // Copula / aspect / tense markers
  'na', 'dey', 'don', 'bin', 'neva',
  // Modals
  'fit', 'wan', 'sabi', 'gree',
  // Common Pidgin verbs
  'chop', 'waka', 'commot', 'chook', 'kuku', 'knack',
  // Nouns / expressives
  'wahala', 'oga', 'madam', 'pikin', 'pesin', 'palava',
  'gist', 'kpele', 'abeg', 'walahi', 'oya', 'jare', 'sef',
  'sha', 'abi', 'ehn', 'ehen', 'nau', 'shey', 'yawa',
  'nawa', 'naija', 'danfo', 'keke', 'okada', 'wetin',
  // Question words
  'wia', 'wen',
  // Negation
  'nor',
  // Common Pidgin particles
  'sef', 'oo', 'o',
]);

// Curated misspelling map: wrong → correct
const PIDGIN_MISSPELLINGS: Record<string, string> = {
  wettin: 'wetin',
  wetting: 'wetin',
  waitin: 'wetin',
  wethin: 'wetin',
  wahalla: 'wahala',
  wahallah: 'wahala',
  wahalah: 'wahala',
  ogaa: 'oga',
  pikkin: 'pikin',
  pikeen: 'pikin',
  comot: 'commot',
  comuot: 'commot',
  sabbi: 'sabi',
  sabby: 'sabi',
  abii: 'abi',
  oyaa: 'oya',
  oyaaa: 'oya',
  palavar: 'palava',
  perison: 'pesin',
  nauw: 'nau',
  shaa: 'sha',
  abeeg: 'abeg',
  kpeleh: 'kpele',
  deh: 'dey',
  dn: 'don',
  fiit: 'fit',
  wahn: 'wan',
  commout: 'commot',
};

// Common English words to exclude from Pidgin spell-check false positives
const COMMON_ENGLISH = new Set([
  'a', 'i', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
  'should', 'may', 'might', 'can', 'could', 'must', 'to', 'of', 'in', 'on',
  'at', 'by', 'for', 'with', 'as', 'into', 'from', 'up', 'down', 'out',
  'off', 'over', 'not', 'no', 'and', 'or', 'but', 'if', 'so', 'yet', 'nor',
  'he', 'she', 'it', 'we', 'they', 'you', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'all', 'each', 'few', 'more', 'most', 'some', 'any', 'both', 'here', 'there',
  'when', 'where', 'why', 'how', 'what', 'who', 'which', 'go', 'say', 'come',
  'see', 'know', 'get', 'make', 'take', 'give', 'think', 'look', 'want', 'find',
  'tell', 'ask', 'work', 'feel', 'try', 'leave', 'call', 'keep', 'let', 'show',
  'hear', 'play', 'run', 'hold', 'bring', 'put', 'set', 'read', 'stand', 'pay',
  'meet', 'ok', 'okay', 'yes', 'yeah', 'nah', 'too', 'just', 'like', 'also',
  'well', 'now', 'then', 'here', 'time', 'day', 'good', 'new', 'old', 'big',
  'long', 'great', 'little', 'own', 'right', 'high', 'place', 'man', 'woman',
  'say', 'people', 'talk', 'write', 'one', 'two', 'three', 'four', 'five',
]);

// Levenshtein edit distance (iterative, space-efficient)
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Find closest Pidgin dictionary word within edit distance 1
function suggestPidginWord(word: string): string | null {
  if (word.length < 3) return null;
  let best: string | null = null;
  let bestDist = 2;
  for (const dictWord of PIDGIN_DICTIONARY) {
    const dist = levenshtein(word, dictWord);
    if (dist < bestDist) {
      bestDist = dist;
      best = dictWord;
    }
  }
  return best;
}

// Positive Pidgin grammar patterns — mark valid Pidgin as isCorrect: true
const PIDGIN_POSITIVE_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /\bwetin dey happen\b/gi,
    message: '✓ Valid Pidgin — "what is happening?"',
  },
  {
    pattern: /\bno wahala\b/gi,
    message: '✓ Valid Pidgin — "no problem"',
  },
  {
    pattern: /\bI no fit\b/gi,
    message: '✓ Valid Pidgin negation with modal — "I can\'t"',
  },
  {
    pattern: /\b\w+ dey \w+/gi,
    message: '✓ Valid Pidgin progressive construction',
  },
  {
    pattern: /\bna im\b/gi,
    message: '✓ Valid Pidgin emphasis — "it is him / it is that"',
  },
  {
    pattern: /\b\w+ don \w+/gi,
    message: '✓ Valid Pidgin perfective — completed action',
  },
  {
    pattern: /\be don do\b/gi,
    message: '✓ Valid Pidgin — "it\'s done / it\'s over"',
  },
  {
    pattern: /\bno be so\b/gi,
    message: '✓ Valid Pidgin tag question — "isn\'t that right?"',
  },
  {
    pattern: /\bhow far\b/gi,
    message: '✓ Valid Pidgin greeting — "how are you?"',
  },
  {
    pattern: /\babeg\b/gi,
    message: '✓ Valid Pidgin — "please"',
  },
  {
    pattern: /\bna so\b/gi,
    message: '✓ Valid Pidgin — "that\'s right / indeed"',
  },
  {
    pattern: /\b\w+ go \w+/gi,
    message: '✓ Valid Pidgin future tense construction',
  },
  {
    pattern: /\bwetin be\b/gi,
    message: '✓ Valid Pidgin — "what is"',
  },
  {
    pattern: /\bwhere you dey\b/gi,
    message: '✓ Valid Pidgin — "where are you?"',
  },
  {
    pattern: /\bI dey\b/gi,
    message: '✓ Valid Pidgin — "I am / I\'m here"',
  },
];

// English structure warnings in Pidgin mode
const PIDGIN_ENGLISH_WARNINGS: Array<{
  pattern: RegExp;
  message: string;
  suggestion: string;
}> = [
  {
    pattern: /\bcannot\b/gi,
    message: 'In Pidgin, "no fit" is used instead of "cannot"',
    suggestion: 'no fit',
  },
  {
    pattern: /\bcan't\b/gi,
    message: 'In Pidgin, "no fit" is used instead of "can\'t"',
    suggestion: 'no fit',
  },
  {
    pattern: /\bI am going\b/gi,
    message: 'In Pidgin, "I dey go" is used instead of "I am going"',
    suggestion: 'I dey go',
  },
  {
    pattern: /\bI have done\b/gi,
    message: 'In Pidgin, "I don do am" is used for completed actions',
    suggestion: 'I don do am',
  },
  {
    pattern: /\bhe is (?!called|named)\w+/gi,
    message: 'In Pidgin, "e dey" or "na im" is used instead of "he is"',
    suggestion: 'e dey / na im',
  },
];

export function lintPidgin(text: string): HarperIssue[] {
  const results: HarperIssue[] = [];
  const usedPositions = new Set<number>();

  // 1. Spell-check: tokenize and check each word
  const wordRegex = /\b[a-zA-Z']+\b/g;
  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    const lower = word.toLowerCase();
    const pos = match.index;

    if (usedPositions.has(pos)) continue;
    if (COMMON_ENGLISH.has(lower)) continue;
    if (PIDGIN_DICTIONARY.has(lower)) continue;

    // Curated misspelling map first
    if (PIDGIN_MISSPELLINGS[lower]) {
      results.push({
        text: word,
        type: 'spelling',
        message: `"${word}" may be a misspelling`,
        suggestion: PIDGIN_MISSPELLINGS[lower],
        isCorrect: false,
        position: pos,
      });
      usedPositions.add(pos);
      continue;
    }

    // Edit distance fallback (words ≥ 4 chars only, distance ≤ 1)
    if (lower.length >= 4) {
      const suggestion = suggestPidginWord(lower);
      if (suggestion) {
        results.push({
          text: word,
          type: 'spelling',
          message: `Did you mean the Pidgin word "${suggestion}"?`,
          suggestion,
          isCorrect: false,
          position: pos,
        });
        usedPositions.add(pos);
      }
    }
  }

  // 2. Positive Pidgin pattern recognition
  for (const pat of PIDGIN_POSITIVE_PATTERNS) {
    const regex = new RegExp(pat.pattern.source, 'gi');
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (!usedPositions.has(m.index)) {
        results.push({
          text: m[0],
          type: 'pidgin',
          message: pat.message,
          suggestion: '',
          isCorrect: true,
          position: m.index,
        });
        usedPositions.add(m.index);
      }
    }
  }

  // 3. English structure warnings
  for (const warn of PIDGIN_ENGLISH_WARNINGS) {
    const regex = new RegExp(warn.pattern.source, 'gi');
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (!usedPositions.has(m.index)) {
        results.push({
          text: m[0],
          type: 'grammar',
          message: warn.message,
          suggestion: warn.suggestion,
          isCorrect: false,
          position: m.index,
        });
        usedPositions.add(m.index);
      }
    }
  }

  return results;
}
