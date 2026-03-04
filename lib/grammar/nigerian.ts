import type { HarperIssue } from './harper';

// Nigerian English words Harper would flag as spelling errors
const WHITELIST_WORDS = new Set([
  // Core expressions
  'wahala', 'oya', 'abeg', 'nau', 'sha', 'abi', 'sef', 'ehn', 'ehen',
  'jare', 'kpele', 'walahi', 'gist', 'oga', 'pikin', 'waka', 'commot',
  'sabi', 'chop', 'palava', 'yawa', 'shey', 'nawa', 'naija', 'danfo',
  'keke', 'okada', 'garri', 'eba', 'amala', 'egusi', 'jollof', 'suya',
  'agbada', 'ankara', 'buka', 'owambe', 'aso-ebi', 'asoebi',
  // Foods & drinks
  'puff-puff', 'puffpuff', 'akara', 'moimoi', 'moin-moin', 'boli',
  'kilishi', 'zobo', 'kunu', 'ogi', 'nkwobi', 'ofada', 'agege',
  'pepper-soup', 'peppersoup', 'isi-ewu', 'isiewu',
  // Exclamations & discourse
  'chai', 'choi', 'chineke', 'tufiakwa', 'gbam', 'haba', 'kai', 'howfar',
  // Social & slang
  'shakara', 'ajebutter', 'ajepako', 'jara', 'gbedu', 'sapa', 'japa',
  'yab', 'yabis', 'gbege', 'razz', 'lamba', 'toasting', 'packaging',
  'werey', 'maga', 'wayo', 'ment', 'tori',
  // Transport & urban
  'molue', 'tokunbo', 'bolekaja',
  // People & address
  'alhaji', 'alhaja',
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
  "next tomorrow",
  "flash me",
  "borrow me",
  "i am hearing",
  "manage it",
  "been long",
  "sharp sharp",
  "last last",
  "soft life",
  "no dulling",
  "long throat",
  "dry eye",
  "shine your eyes",
  "do and come",
  "pepper them",
  "e don do",
  "no be so",
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
    pattern: /\bhow ?far\b/gi,
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
  {
    pattern: /\bnext tomorrow\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "the day after tomorrow"',
  },
  {
    pattern: /\bflash (?:me|you|him|her|them|us)\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "give a missed call"',
  },
  {
    pattern: /\bmanage(?: it| the| this)?\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "make do with what\'s available"',
  },
  {
    pattern: /\bbeen long\b/gi,
    message: '🇳🇬 Nigerian greeting — means "long time no see"',
  },
  {
    pattern: /\bsharp sharp\b/gi,
    message: '🇳🇬 Nigerian expression — means "quickly / immediately"',
  },
  {
    pattern: /\blast last\b/gi,
    message: '🇳🇬 Nigerian expression — means "in the end / ultimately"',
  },
  {
    pattern: /\bsoft life\b/gi,
    message: '🇳🇬 Nigerian expression — means "comfortable, easy living"',
  },
  {
    pattern: /\blong throat\b/gi,
    message: '🇳🇬 Nigerian expression — means "greediness / excessive desire"',
  },
  {
    pattern: /\bdry eye\b/gi,
    message: '🇳🇬 Nigerian expression — means "shamelessness / brazen boldness"',
  },
  {
    pattern: /\bshine your eyes\b/gi,
    message: '🇳🇬 Nigerian expression — means "be alert / don\'t be naive"',
  },
  {
    pattern: /\bno dulling\b/gi,
    message: '🇳🇬 Nigerian expression — means "don\'t hesitate / keep moving"',
  },
  {
    pattern: /\bpepper them\b/gi,
    message: '🇳🇬 Nigerian expression — means "impress / show off to others"',
  },
  {
    pattern: /\bjapa\b/gi,
    message: '🇳🇬 Nigerian slang — means "to flee / emigrate abroad"',
  },
  {
    pattern: /\bsapa\b/gi,
    message: '🇳🇬 Nigerian slang — means "being broke / financially strained"',
  },
  {
    pattern: /\bgbedu\b/gi,
    message: '🇳🇬 Nigerian slang — means "good music / a great beat"',
  },
  {
    pattern: /\bshakara\b/gi,
    message: '🇳🇬 Nigerian expression — means "showing off / putting on airs"',
  },
  {
    pattern: /\bpackaging\b/gi,
    message: '🇳🇬 Nigerian slang — means "putting on a false impression"',
  },
  {
    pattern: /\bjara\b/gi,
    message: '🇳🇬 Nigerian expression — means "extra / a bonus thrown in"',
  },
  {
    pattern: /\bgbam\b/gi,
    message: '🇳🇬 Nigerian exclamation — means "exactly / precisely / that\'s it"',
  },
  {
    pattern: /\bchai\b/gi,
    message: '🇳🇬 Nigerian exclamation of surprise, pain, or distress',
  },
  {
    pattern: /\bhaba\b/gi,
    message: '🇳🇬 Nigerian exclamation — means "come on / that\'s too much"',
  },
  {
    pattern: /\bdo and come\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "go do it and come back quickly"',
  },
  {
    pattern: /\bginger\b/gi,
    message: '🇳🇬 Nigerian slang — used as a verb meaning "to motivate / excite"',
  },
  {
    pattern: /\btokunbo\b/gi,
    message: '🇳🇬 Nigerian word — means "used / second-hand" (often of cars or goods)',
  },
  {
    pattern: /\be don do\b/gi,
    message: '🇳🇬 Nigerian expression — means "it\'s done / it\'s over"',
  },
  {
    pattern: /\bno be so\b/gi,
    message: '🇳🇬 Nigerian tag question — means "isn\'t that right?"',
  },
  {
    pattern: /\bi am hearing\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "I can hear you"',
  },
  {
    pattern: /\bborrow me\b/gi,
    message: '🇳🇬 Valid Nigerian English — used to mean "lend me"',
  },
];

// Custom error rules for common Nigerian writing mistakes Harper may miss
const NIGERIAN_ERROR_RULES: Array<{
  pattern: RegExp;
  message: string;
  suggestion: string;
  type: string;
}> = [
  // Spelling conventions
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
    pattern: /\bbarbing salon\b/gi,
    message: '"Barbing salon" is a Nigerian coinage — consider "barbershop" for international audiences',
    suggestion: 'barbershop',
    type: 'style',
  },
  // Stative verbs incorrectly used in progressive form
  {
    pattern: /\bI am hearing\b/gi,
    message: '"Hear" is a stative verb — use "I can hear you" in standard English',
    suggestion: 'I can hear you',
    type: 'grammar',
  },
  {
    pattern: /\b(?:is|are|am) owing\b/gi,
    message: '"Owe" is a stative verb — use "owes" or "owe" instead of "is/are owing"',
    suggestion: 'owes / owe',
    type: 'grammar',
  },
  // Borrow / lend confusion
  {
    pattern: /\bborrow me\b/gi,
    message: 'In standard English, "lend me" is used — "borrow" means to receive, "lend" means to give',
    suggestion: 'lend me',
    type: 'grammar',
  },
  // Severally
  {
    pattern: /\bseverally\b/gi,
    message: '"Severally" in Nigerian English is used to mean "several times" — in standard English it means "separately / individually"',
    suggestion: 'several times',
    type: 'style',
  },
  // Formal Nigerian English quirks
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
  {
    pattern: /\bwith immediate effect\b/gi,
    message: '"With immediate effect" is formal Nigerian English — consider "effective immediately" for international audiences',
    suggestion: 'effective immediately',
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
