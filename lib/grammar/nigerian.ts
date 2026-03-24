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
  'pepper-soup', 'peppersoup', 'isi-ewu', 'isiewu', 'fufu', 'pomo',
  'dodo', 'efo', 'ogbono', 'edikaikong', 'afang', 'ewedu', 'gbegiri',
  'tuwo', 'masa', 'fura', 'nono', 'kunun', 'kuli-kuli', 'kulikuli',
  'chin-chin', 'chinchin', 'shawarma',
  // Exclamations & discourse
  'chai', 'choi', 'chineke', 'tufiakwa', 'gbam', 'haba', 'kai', 'howfar',
  'ewoo', 'mogbe', 'hian', 'mehn', 'nna', 'chaii',
  // Social & slang
  'shakara', 'ajebutter', 'ajepako', 'jara', 'gbedu', 'sapa', 'japa',
  'yab', 'yabis', 'gbege', 'razz', 'lamba', 'toasting', 'packaging',
  'werey', 'maga', 'wayo', 'ment', 'tori', 'amebo', 'ashawo',
  'omo', 'bobo', 'sisi', 'bros', 'broda', 'babe', 'padi', 'paddy',
  'detty', 'litty', 'steeze', 'cruise', 'vibe', 'flex',
  'shalaye', 'vawulence', 'idan', 'shege', 'kasala', 'katakata',
  'famz', 'konji', 'kolo', 'ajebo', 'orobo', 'lepa', 'lekpa',
  'gbas', 'gbos', 'trenches',
  // Transport & urban
  'molue', 'tokunbo', 'bolekaja', 'okrika', 'agbero',
  // People & address
  'alhaji', 'alhaja', 'baba', 'iya', 'oyinbo', 'oyibo',
  // Places & cultural
  'owambe', 'asoebi', 'gele', 'fila', 'iro', 'buba', 'dashiki',
  'igbo', 'yoruba', 'hausa', 'ijaw', 'efik', 'ibibio', 'tiv', 'nupe',
  // Business & formal
  'revert', 'severally', 'opportuned',
  // Religious
  'alhamdulillah', 'insha', 'allah', 'subhanallah', 'mashallah',
  'billahi', 'tallahi',
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
  // New phrases
  "well done",
  "sorry oh",
  "no vex",
  "how far",
  "you don hear",
  "ginger me",
  "on God",
  "e choke",
  "gbas gbos",
  "las las",
  "na so",
  "na true",
  "God dey",
  "make we",
  "no shaking",
  "na cruise",
  "drop for me",
  "turn up",
  "na wa",
  "na wa oh",
  "see trouble",
  "bone face",
  "change am",
  "use your head",
  "no send anybody",
  "you sabi",
  "catch cruise",
  "carry go",
  "enter one chance",
  "jack hammer",
  "off head",
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
  // New expressions
  {
    pattern: /\bwell done\b/gi,
    message: '🇳🇬 Nigerian greeting — used to greet someone who is working',
  },
  {
    pattern: /\bsorry oh\b/gi,
    message: '🇳🇬 Valid Nigerian English — expression of sympathy or apology',
  },
  {
    pattern: /\bno vex\b/gi,
    message: '🇳🇬 Nigerian expression — means "don\'t be angry / sorry"',
  },
  {
    pattern: /\benter one chance\b/gi,
    message: '🇳🇬 Nigerian expression — means "to be scammed or tricked"',
  },
  {
    pattern: /\bcatch cruise\b/gi,
    message: '🇳🇬 Nigerian slang — means "to have fun / joke around"',
  },
  {
    pattern: /\bna wa oh?\b/gi,
    message: '🇳🇬 Nigerian exclamation — means "this is unbelievable / I\'m shocked"',
  },
  {
    pattern: /\bno shaking\b/gi,
    message: '🇳🇬 Nigerian expression — means "no worries / all is well"',
  },
  {
    pattern: /\boff head\b/gi,
    message: '🇳🇬 Nigerian expression — means "to go crazy / lose one\'s mind"',
  },
  {
    pattern: /\bbone face\b/gi,
    message: '🇳🇬 Nigerian expression — means "to keep a straight/serious face"',
  },
  {
    pattern: /\bsoro soke\b/gi,
    message: '🇳🇬 Nigerian expression — means "speak up / speak louder" (Yoruba)',
  },
  {
    pattern: /\bdetty\b/gi,
    message: '🇳🇬 Nigerian slang — means "dirty" in a fun/party sense (e.g., "detty December")',
  },
  {
    pattern: /\bno send anybody\b/gi,
    message: '🇳🇬 Nigerian expression — means "I don\'t care about anyone\'s opinion"',
  },
  {
    pattern: /\buse your head\b/gi,
    message: '🇳🇬 Valid Nigerian English — means "think wisely / be smart about it"',
  },
  {
    pattern: /\bGod dey\b/gi,
    message: '🇳🇬 Nigerian expression — means "God exists / God is in control"',
  },
  {
    pattern: /\bon God\b/gi,
    message: '🇳🇬 Nigerian/slang expression — means "I swear / truly"',
  },
  {
    pattern: /\be choke\b/gi,
    message: '🇳🇬 Nigerian slang — means "it\'s overwhelming / impressive"',
  },
  {
    pattern: /\bgbas gbos\b/gi,
    message: '🇳🇬 Nigerian expression — means "exchange of blows / back and forth"',
  },
  {
    pattern: /\bvawulence\b/gi,
    message: '🇳🇬 Nigerian slang — means "violence / drama" (intentional respelling)',
  },
  {
    pattern: /\bshalaye\b/gi,
    message: '🇳🇬 Nigerian slang — means "to explain yourself / confess"',
  },
  {
    pattern: /\bidan\b/gi,
    message: '🇳🇬 Nigerian slang — means "wizard / someone who is exceptionally skilled"',
  },
];

// Custom error rules for common Nigerian writing mistakes Harper may miss
const NIGERIAN_ERROR_RULES: Array<{
  pattern: RegExp;
  message: string;
  suggestion: string;
  type: string;
}> = [
  // Spelling conventions — compound words written as one
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
    pattern: /\balot\b/gi,
    message: '"alot" should be two words',
    suggestion: 'a lot',
    type: 'spelling',
  },
  {
    pattern: /\batleast\b/gi,
    message: '"atleast" should be two words',
    suggestion: 'at least',
    type: 'spelling',
  },
  {
    pattern: /\bincase\b/gi,
    message: '"incase" should be two words',
    suggestion: 'in case',
    type: 'spelling',
  },
  {
    pattern: /\binfront\b/gi,
    message: '"infront" should be two words',
    suggestion: 'in front',
    type: 'spelling',
  },
  {
    pattern: /\binbetween\b/gi,
    message: '"inbetween" should be two words',
    suggestion: 'in between',
    type: 'spelling',
  },
  {
    pattern: /\beventho\b/gi,
    message: '"eventho" should be "even though"',
    suggestion: 'even though',
    type: 'spelling',
  },
  {
    pattern: /\bontop\b/gi,
    message: '"ontop" should be two words',
    suggestion: 'on top',
    type: 'spelling',
  },
  // Nigerian English style — words with different meanings internationally
  {
    pattern: /\bbarbing salon\b/gi,
    message: '"Barbing salon" is a Nigerian coinage — consider "barbershop" for international audiences',
    suggestion: 'barbershop',
    type: 'style',
  },
  {
    pattern: /\bopportune(?:d)\b/gi,
    message: '"Opportuned" is not standard English — use "had the opportunity" or "was fortunate"',
    suggestion: 'had the opportunity',
    type: 'grammar',
  },
  {
    pattern: /\bflash light\b/gi,
    message: 'In Nigerian English "flash light" often means "torch" — in standard English it\'s one word: "flashlight"',
    suggestion: 'flashlight',
    type: 'spelling',
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
  {
    pattern: /\b(?:is|are|am) having\b/gi,
    message: '"Have" (possession) is a stative verb — use "has" or "have" instead of "is/are having"',
    suggestion: 'has / have',
    type: 'grammar',
  },
  {
    pattern: /\b(?:is|are|am) containing\b/gi,
    message: '"Contain" is a stative verb — use "contains" or "contain" instead',
    suggestion: 'contains / contain',
    type: 'grammar',
  },
  {
    pattern: /\b(?:is|are|am) comprising\b/gi,
    message: '"Comprise" is a stative verb — use "comprises" or "comprise" instead',
    suggestion: 'comprises / comprise',
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
  // Additional formal / business writing quirks
  {
    pattern: /\bkindly(?= (?:assist|help|do|ensure|confirm|note|advise))\b/gi,
    message: '"Kindly" is common in Nigerian formal English — "please" is more natural in most international contexts',
    suggestion: 'please',
    type: 'style',
  },
  {
    pattern: /\bplease be informed that\b/gi,
    message: '"Please be informed that" is overly formal — consider a more direct phrasing',
    suggestion: '',
    type: 'style',
  },
  {
    pattern: /\bI wish to bring to your notice\b/gi,
    message: 'This is a formal Nigerian English phrase — consider "I\'d like to let you know" or simply state the point',
    suggestion: "I'd like to let you know",
    type: 'style',
  },
  {
    pattern: /\bas at when due\b/gi,
    message: '"As at when due" is Nigerian English — use "when due" or "at the appropriate time"',
    suggestion: 'when due',
    type: 'style',
  },
  {
    pattern: /\bput to bed\b/gi,
    message: '"Put to bed" in Nigerian English means "to give birth" — in international English it means "to finish / finalize"',
    suggestion: '',
    type: 'style',
  },
  // Common grammar errors
  {
    pattern: /\bwould of\b/gi,
    message: '"Would of" should be "would have" or "would\'ve"',
    suggestion: 'would have',
    type: 'grammar',
  },
  {
    pattern: /\bcould of\b/gi,
    message: '"Could of" should be "could have" or "could\'ve"',
    suggestion: 'could have',
    type: 'grammar',
  },
  {
    pattern: /\bshould of\b/gi,
    message: '"Should of" should be "should have" or "should\'ve"',
    suggestion: 'should have',
    type: 'grammar',
  },
  {
    pattern: /\birregardless\b/gi,
    message: '"Irregardless" is non-standard — use "regardless"',
    suggestion: 'regardless',
    type: 'grammar',
  },
  {
    pattern: /\bmore better\b/gi,
    message: '"More better" is a double comparative — use just "better"',
    suggestion: 'better',
    type: 'grammar',
  },
  {
    pattern: /\bmore easier\b/gi,
    message: '"More easier" is a double comparative — use just "easier"',
    suggestion: 'easier',
    type: 'grammar',
  },
  {
    pattern: /\bmost biggest\b/gi,
    message: '"Most biggest" is a double superlative — use just "biggest"',
    suggestion: 'biggest',
    type: 'grammar',
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
