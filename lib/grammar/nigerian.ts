import type { HarperIssue } from './harper';

// Nigerian English words Harper would flag as spelling errors
const WHITELIST_WORDS = new Set([
  'wahala', 'oya', 'abeg', 'nau', 'sha', 'abi', 'sef', 'ehn', 'ehen',
  'jare', 'kpele', 'walahi', 'gist', 'oga', 'pikin', 'waka', 'commot',
  'sabi', 'chop', 'palava', 'yawa', 'shey', 'nawa', 'naija', 'danfo',
  'keke', 'okada', 'garri', 'eba', 'amala', 'egusi', 'jollof', 'suya',
  'agbada', 'ankara', 'buka', 'owambe', 'aso-ebi', 'asoebi',
]);

// Nigerian phrases — suppress Harper issues whose position falls within these
const WHITELIST_PHRASES = [
  "i'm coming",
  "am coming",
  "till date",
  "safe journey",
  "journey mercies",
  "do the needful",
  "ease myself",
  "come and see",
  "see finish",
  "carry last",
  "carry go",
  "hold on small",
  "small small",
];

// Positive recognitions — detect Nigerian expressions and mark isCorrect: true
const NIGERIAN_EXPRESSIONS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /\bi'?m coming\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "I\'ll be right back"',
  },
  {
    pattern: /\bdrop (?:your |my |the )?(?:contact|number)\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "share your contact/number"',
  },
  {
    pattern: /\bno wahala\b/gi,
    message: '🇳🇬 Valid Nigerian expression — means "no problem"',
  },
  {
    pattern: /\bhow far\b/gi,
    message: '🇳🇬 Nigerian greeting — means "how are you?"',
  },
  {
    pattern: /\btill date\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "up until now / to date"',
  },
  {
    pattern: /\bdo the needful\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "do what\'s necessary"',
  },
  {
    pattern: /\b(?:safe journey|journey mercies)\b/gi,
    message: '🇳🇬 Valid Nigerian send-off — means "have a safe trip"',
  },
  {
    pattern: /\boya\b/gi,
    message: '🇳🇬 Nigerian expression — means "let\'s go / come on"',
  },
  {
    pattern: /\b(?:ehn|ehen)\b/gi,
    message: '🇳🇬 Nigerian discourse particle — used for emphasis or agreement',
  },
  {
    pattern: /\bhold on small\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "wait a moment"',
  },
  {
    pattern: /\bsmall small\b/gi,
    message: '🇳🇬 Valid Nigerian expression — means "gradually / little by little"',
  },
  {
    pattern: /\bcarry last\b/gi,
    message: '🇳🇬 Nigerian expression — means "to come last / fail"',
  },
  {
    pattern: /\bcarry go\b/gi,
    message: '🇳🇬 Nigerian expression — means "take it / go ahead"',
  },
  {
    pattern: /\bsee finish\b/gi,
    message: '🇳🇬 Nigerian expression — means "to be overly familiar with someone"',
  },
  {
    pattern: /\bnawa\b/gi,
    message: '🇳🇬 Nigerian exclamation of surprise or exasperation',
  },
  {
    pattern: /\bkpele\b/gi,
    message: '🇳🇬 Nigerian expression — means "sorry / I sympathise"',
  },
  {
    pattern: /\bwaka\b/gi,
    message: '🇳🇬 Nigerian expression — means "go away / walk"',
  },
  {
    pattern: /\bna\s+you\s+sabi\b/gi,
    message: '🇳🇬 Nigerian expression — means "that\'s your business"',
  },
  {
    pattern: /\bowambe\b/gi,
    message: '🇳🇬 Valid Nigerian word — means "a lavish party"',
  },
];

// Custom error rules for common Nigerian writing mistakes Harper may miss
const NIGERIAN_ERROR_RULES: Array<{
  pattern: RegExp;
  message: string;
  suggestion: string;
  type: string;
}> = [
  {
    pattern: /\bofcourse\b/gi,
    message: '"ofcourse" should be two words',
    suggestion: 'of course',
    type: 'spelling',
  },
  {
    pattern: /\binfact\b/gi,
    message: '"infact" should be two words',
    suggestion: 'in fact',
    type: 'spelling',
  },
  {
    pattern: /\binorder\b/gi,
    message: '"inorder" should be two words',
    suggestion: 'in order',
    type: 'spelling',
  },
  {
    pattern: /\baswell\b/gi,
    message: '"aswell" should be two words',
    suggestion: 'as well',
    type: 'spelling',
  },
  {
    pattern: /\bkindly revert\b/gi,
    message: '"Kindly revert" is commonly used to mean "please reply" in Nigerian English — consider "kindly reply" for clarity',
    suggestion: 'kindly reply',
    type: 'style',
  },
  {
    pattern: /\bI beg to state\b/gi,
    message: '"I beg to state" is a formal Nigerian English phrase — in most contexts, simply state your point directly',
    suggestion: '',
    type: 'style',
  },
];

function isPositionInPhrase(position: number, text: string): boolean {
  const lower = text.toLowerCase();
  for (const phrase of WHITELIST_PHRASES) {
    let idx = lower.indexOf(phrase);
    while (idx !== -1) {
      if (position >= idx && position < idx + phrase.length) return true;
      idx = lower.indexOf(phrase, idx + 1);
    }
  }
  return false;
}

export function filterNigerianIssues(
  harperIssues: HarperIssue[],
  text: string
): HarperIssue[] {
  const results: HarperIssue[] = [];

  // 1. Filter Harper issues — remove false positives for Nigerian expressions
  for (const issue of harperIssues) {
    const word = issue.text.toLowerCase().trim();
    if (WHITELIST_WORDS.has(word)) continue;
    if (isPositionInPhrase(issue.position, text)) continue;
    results.push(issue);
  }

  // 2. Positive Nigerian expression recognitions
  for (const expr of NIGERIAN_EXPRESSIONS) {
    const regex = new RegExp(expr.pattern.source, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const alreadyAdded = results.some(
        (r) => r.isCorrect && r.position === match!.index
      );
      if (!alreadyAdded) {
        results.push({
          text: match[0],
          type: 'nigerian',
          message: expr.message,
          suggestion: '',
          isCorrect: true,
          position: match.index,
        });
      }
    }
  }

  // 3. Custom Nigerian error rules
  for (const rule of NIGERIAN_ERROR_RULES) {
    const regex = new RegExp(rule.pattern.source, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      results.push({
        text: match[0],
        type: rule.type,
        message: rule.message,
        suggestion: rule.suggestion,
        isCorrect: false,
        position: match.index,
      });
    }
  }

  return results;
}
