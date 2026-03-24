import type { HarperIssue } from './harper';

// Core Pidgin vocabulary, including modern slang, insults, and Lagos staples
const PIDGIN_DICTIONARY = new Set([
  // Pronouns / person markers
  'im', 'am', 'una', 'dem', 'hin', 'dis', 'dat', 'wey', 'sey',
  // Copula / aspect / tense markers
  'na', 'dey', 'don', 'bin', 'neva', 'neber',
  // Modals
  'fit', 'wan', 'sabi', 'gree', 'mak',
  // Common Pidgin verbs
  'chop', 'waka', 'commot', 'chook', 'kuku', 'knack', 'japa', 'fashi', 'kpai',
  'siddon', 'tanda', 'helep', 'kukuma', 'jejely', 'para', 'yab', 'yarn',
  'baff', 'vex', 'kolo', 'jolly', 'torment', 'tey', 'dodo', 'follow',
  'gather', 'scatter', 'block', 'bounce', 'rush', 'hammer', 'burst',
  'cruise', 'flex', 'jab', 'form', 'toast', 'famz', 'hype', 'getat',
  'denge', 'pose', 'land', 'settle', 'bail', 'drag', 'spray', 'chill',
  'vibe', 'enter', 'comess', 'package', 'serve', 'sharp',
  // Nouns / expressives / slang
  'wahala', 'oga', 'madam', 'pikin', 'pesin', 'palava',
  'gist', 'kpele', 'abeg', 'walahi', 'oya', 'jare', 'sef',
  'sha', 'abi', 'ehn', 'ehen', 'nau', 'shey', 'yawa',
  'nawa', 'naija', 'danfo', 'keke', 'okada', 'wetin',
  'sapa', 'vawulence', 'shalaye', 'aza', 'trenches', 'idan', 'shege',
  'mumu', 'ode', 'werey', 'ment', 'oloriburuku',
  'tush', 'kpali', 'jara', 'awoof', 'berekete', 'soso', 'banza',
  'bodi', 'belle', 'mata', 'beta', 'lekpa', 'gbege', 'tori',
  'shakara', 'chai', 'gbam', 'haba', 'yansh', 'nyash', 'mehn', 'kai',
  'totori', 'wayo', 'maga',
  // People / address
  'omo', 'bobo', 'babe', 'sisi', 'bros', 'broda', 'sista', 'mama', 'papa',
  'padi', 'paddy', 'guy', 'nna', 'oyinbo', 'oyibo', 'alhaji', 'alhaja',
  'agbero', 'area', 'baba', 'iya',
  // Modern slang / Gen-Z Pidgin
  'amebo', 'ashawo', 'katakata', 'magomago', 'ogbanje', 'koboko',
  'detty', 'litty', 'steeze', 'drip', 'rizz', 'finz', 'gbas', 'gbos',
  'las', 'zaddy', 'jollof', 'suya', 'egusi', 'garri', 'eba', 'fufu',
  'akara', 'agege', 'pomo', 'dodo', 'okrika', 'asoebi', 'ankara',
  'owambe', 'shayo', 'gobe', 'kain', 'kain-kain', 'yama-yama',
  'ajebo', 'ajepako', 'butty', 'lepa', 'orobo', 'konji',
  'ehen', 'shebi', 'walahi', 'billahi', 'tallahi',
  'abi', 'ko', 'nko', 'ke', 'ba', 'otilo',
  // Question words
  'wia', 'wen', 'howfar', 'wetin', 'hau',
  // Negation
  'nor', 'nah',
  // Common Pidgin particles / connectors
  'sef', 'oo', 'o', 'gan', 'sha', 'kor', 'ni', 'jo',
  // Places / cultural
  'trenches', 'abroad', 'jand', 'yankee', 'obodo', 'buka',
  // Money
  'kudi', 'ego', 'owo', 'cheddar',
  // Expressions as single words
  'wahala', 'kasala', 'yawa', 'kpere', 'tueh', 'mtchew', 'hian',
  'chaii', 'ewoo', 'mogbe', 'chineke', 'tufiakwa',
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
  vawulance: 'vawulence',
  vawulense: 'vawulence',
  sappah: 'sapa',
  mummu: 'mumu',
  ashaawo: 'ashawo',
  shae: 'shey',
  // siddon
  sidon: 'siddon',
  sidong: 'siddon',
  siddong: 'siddon',
  // tanda
  tandah: 'tanda',
  tandar: 'tanda',
  // beta
  beter: 'beta',
  betta: 'beta',
  // jejely
  jejeli: 'jejely',
  jejeleh: 'jejely',
  jeejely: 'jejely',
  jeje: 'jejely',
  // para
  paara: 'para',
  paraa: 'para',
  // yab
  yabb: 'yab',
  yaab: 'yab',
  // mata
  matta: 'mata',
  mattar: 'mata',
  // kpai
  kpaii: 'kpai',
  kpay: 'kpai',
  // lekpa
  lekpah: 'lekpa',
  // werey
  weri: 'werey',
  wirry: 'werey',
  // wayo
  wayoo: 'wayo',
  // gbege
  gbegeh: 'gbege',
  // tori
  torii: 'tori',
  torry: 'tori',
  // helep
  halep: 'helep',
  // kukuma
  kookuma: 'kukuma',
  kukumah: 'kukuma',
  // omo
  omoo: 'omo',
  omoh: 'omo',
  // amebo
  ameboo: 'amebo',
  ameboh: 'amebo',
  // oyinbo
  oyimbo: 'oyinbo',
  oyingbo: 'oyinbo',
  // katakata
  katakarta: 'katakata',
  // padi
  paddii: 'paddy',
  pahdi: 'padi',
  // shalaye
  shalayee: 'shalaye',
  shallaye: 'shalaye',
  // shege
  shegeh: 'shege',
  sheggeh: 'shege',
  // broda
  brodah: 'broda',
  brodar: 'broda',
  // sista
  sistah: 'sista',
  sistar: 'sista',
  // banza
  banzah: 'banza',
  // konji
  konjii: 'konji',
  konjy: 'konji',
  // kasala
  kassala: 'kasala',
  kasalah: 'kasala',
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
  'sharp', 'correct', 'last', 'body', 'matter', 'story', 'blow', 'shine',
  'pepper', 'ginger', 'flash', 'yarn', 'manage', 'fit', 'para', 'beta',
  'about', 'after', 'back', 'bad', 'before', 'between', 'came', 'change',
  'children', 'city', 'close', 'cool', 'country', 'cut', 'door', 'eat',
  'end', 'even', 'every', 'eye', 'face', 'family', 'far', 'father', 'fine',
  'first', 'food', 'friend', 'full', 'hand', 'happy', 'hard', 'head', 'help',
  'home', 'hot', 'house', 'kind', 'land', 'left', 'life', 'light', 'live',
  'love', 'money', 'morning', 'mother', 'much', 'name', 'never', 'night',
  'nothing', 'number', 'open', 'only', 'other', 'part', 'pass', 'please',
  'point', 'power', 'problem', 'road', 'room', 'same', 'school', 'self',
  'side', 'sit', 'small', 'something', 'still', 'stop', 'strong', 'sure',
  'sweet', 'ten', 'thing', 'thought', 'turn', 'under', 'very', 'voice',
  'walk', 'water', 'way', 'week', 'word', 'world', 'wrong', 'year', 'young',
  'again', 'always', 'another', 'away', 'because', 'best', 'better', 'boy',
  'brother', 'car', 'church', 'clean', 'done', 'drink', 'drive', 'drop',
  'enough', 'everything', 'fast', 'fight', 'finish', 'follow', 'front',
  'girl', 'God', 'gone', 'ground', 'group', 'guy', 'happen', 'heart',
  'inside', 'job', 'know', 'late', 'laugh', 'line', 'market', 'mind',
  'miss', 'move', 'music', 'need', 'news', 'nice', 'office', 'outside',
  'own', 'person', 'phone', 'picture', 'plenty', 'pull', 'push', 'put',
  'rain', 'ready', 'reason', 'rest', 'return', 'rich', 'round', 'sell',
  'send', 'serious', 'single', 'sleep', 'somebody', 'sorry', 'start',
  'stay', 'street', 'true', 'ugly', 'use', 'wait', 'watch', 'wife',
  'win', 'wonder',
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
  // Questions
  { pattern: /\bwetin dey happen\b/gi, message: '✓ Valid Pidgin — "what is happening?"' },
  { pattern: /\bwetin be dis\b/gi, message: '✓ Valid Pidgin — "what is this?"' },
  { pattern: /\bwetin happen\b/gi, message: '✓ Valid Pidgin — "what happened?"' },
  { pattern: /\bwetin be\b/gi, message: '✓ Valid Pidgin — "what is"' },
  { pattern: /\bwetin you dey do\b/gi, message: '✓ Valid Pidgin — "what are you doing?"' },
  { pattern: /\bwetin you wan\b/gi, message: '✓ Valid Pidgin — "what do you want?"' },
  { pattern: /\bwetin dey\b/gi, message: '✓ Valid Pidgin — "what\'s up / what\'s going on?"' },
  { pattern: /\bwhere you dey\b/gi, message: '✓ Valid Pidgin — "where are you?"' },
  { pattern: /\bwia you dey\b/gi, message: '✓ Valid Pidgin — "where are you?"' },
  { pattern: /\bhow ?far\b/gi, message: '✓ Valid Pidgin greeting — "how are you?"' },
  { pattern: /\bhow bodi\b/gi, message: '✓ Valid Pidgin greeting — "how are you? (how\'s your body?)"' },
  { pattern: /\bhow e dey go\b/gi, message: '✓ Valid Pidgin — "how is it going?"' },
  { pattern: /\byou sabi\b/gi, message: '✓ Valid Pidgin — "do you know?"' },
  { pattern: /\bna who\b/gi, message: '✓ Valid Pidgin — "who is it?"' },
  // Greetings / common phrases
  { pattern: /\bno wahala\b/gi, message: '✓ Valid Pidgin — "no problem"' },
  { pattern: /\babeg\b/gi, message: '✓ Valid Pidgin — "please"' },
  { pattern: /\bna so\b/gi, message: '✓ Valid Pidgin — "that\'s right / indeed"' },
  { pattern: /\bna true\b/gi, message: '✓ Valid Pidgin — "that\'s true / indeed"' },
  { pattern: /\bna lie\b/gi, message: '✓ Valid Pidgin — "that\'s a lie"' },
  { pattern: /\bna joke\b/gi, message: '✓ Valid Pidgin — "it\'s a joke / just kidding"' },
  { pattern: /\bna im\b/gi, message: '✓ Valid Pidgin emphasis — "it is him / it is that"' },
  { pattern: /\bna me\b/gi, message: '✓ Valid Pidgin — "it is me"' },
  { pattern: /\bna you\b/gi, message: '✓ Valid Pidgin — "it is you"' },
  { pattern: /\bna dem\b/gi, message: '✓ Valid Pidgin — "it is them"' },
  { pattern: /\bna we\b/gi, message: '✓ Valid Pidgin — "it is us"' },
  { pattern: /\bI dey\b/gi, message: '✓ Valid Pidgin — "I am / I\'m here"' },
  { pattern: /\be dey\b/gi, message: '✓ Valid Pidgin — "he/she/it is (doing something)"' },
  // Grammar constructions
  { pattern: /\bI no fit\b/gi, message: '✓ Valid Pidgin negation with modal — "I can\'t"' },
  { pattern: /\bI no go\b/gi, message: '✓ Valid Pidgin future negation — "I won\'t"' },
  { pattern: /\bI no sabi\b/gi, message: '✓ Valid Pidgin — "I don\'t know"' },
  { pattern: /\bI no get\b/gi, message: '✓ Valid Pidgin — "I don\'t have"' },
  { pattern: /\bI don tire\b/gi, message: '✓ Valid Pidgin — "I\'m exhausted / fed up"' },
  { pattern: /\bI wan chop\b/gi, message: '✓ Valid Pidgin — "I want to eat"' },
  // Tightened: require known Pidgin subjects before 'dey' to avoid false positives
  { pattern: /\b(?:i|e|im|una|dem|we|you|na) +dey +\w+/gi, message: '✓ Valid Pidgin progressive construction' },
  { pattern: /\b\w+ +don +\w+\b/gi, message: '✓ Valid Pidgin perfective — completed action' },
  { pattern: /\b\w+ go \w+/gi, message: '✓ Valid Pidgin future tense construction' },
  { pattern: /\b(?:i|e|im|una|dem|we|you) +bin +\w+/gi, message: '✓ Valid Pidgin past tense construction' },
  { pattern: /\b(?:i|e|im|una|dem|we|you) +neva +\w+/gi, message: '✓ Valid Pidgin — "haven\'t yet"' },
  // Expressions
  { pattern: /\be don do\b/gi, message: '✓ Valid Pidgin — "it\'s done / it\'s over"' },
  { pattern: /\be don finish\b/gi, message: '✓ Valid Pidgin — "it\'s completely over"' },
  { pattern: /\be don happen\b/gi, message: '✓ Valid Pidgin — "it has happened"' },
  { pattern: /\be be like\b/gi, message: '✓ Valid Pidgin — "it seems / it looks like"' },
  { pattern: /\bno be so\b/gi, message: '✓ Valid Pidgin tag question — "isn\'t that right?"' },
  { pattern: /\bno be lie\b/gi, message: '✓ Valid Pidgin — "that\'s the truth / no joke"' },
  { pattern: /\bno dulling\b/gi, message: '✓ Valid Pidgin — "don\'t hesitate / keep it moving"' },
  { pattern: /\blast last\b/gi, message: '✓ Valid Pidgin — "in the end / ultimately"' },
  { pattern: /\bshine your eyes\b/gi, message: '✓ Valid Pidgin — "be alert / don\'t be naive"' },
  { pattern: /\bsee shege\b/gi, message: '✓ Valid Pidgin — "to go through extreme hardship"' },
  { pattern: /\bsapa dey\b/gi, message: '✓ Valid Pidgin — "there is brokenness / lack of money"' },
  { pattern: /\bwaka pass\b/gi, message: '✓ Valid Pidgin — "irrelevant / just passing by"' },
  { pattern: /\bgbe bodi\b/gi, message: '✓ Valid Pidgin — "show up / represent / show off"' },
  { pattern: /\bna you sabi\b/gi, message: '✓ Valid Pidgin — "that\'s your business"' },
  { pattern: /\bna God\b/gi, message: '✓ Valid Pidgin — "it\'s God (that did it / will do it)"' },
  { pattern: /\bGod dey\b/gi, message: '✓ Valid Pidgin — "God exists / God is in control"' },
  { pattern: /\bno vex\b/gi, message: '✓ Valid Pidgin — "don\'t be angry / sorry"' },
  { pattern: /\bI dey kampe\b/gi, message: '✓ Valid Pidgin — "I\'m fine / I\'m doing well"' },
  { pattern: /\bno shaking\b/gi, message: '✓ Valid Pidgin — "no worries / all is well"' },
  { pattern: /\bna so e be\b/gi, message: '✓ Valid Pidgin — "that\'s how it is"' },
  { pattern: /\bwetin concern\b/gi, message: '✓ Valid Pidgin — "what does it have to do with..."' },
  { pattern: /\bsharp sharp\b/gi, message: '✓ Valid Pidgin — "quickly / immediately"' },
  { pattern: /\bsmall small\b/gi, message: '✓ Valid Pidgin — "gradually / little by little"' },
  { pattern: /\byou don hear\b/gi, message: '✓ Valid Pidgin — "you\'ve heard / you understand now"' },
  { pattern: /\bmake we go\b/gi, message: '✓ Valid Pidgin — "let\'s go"' },
  { pattern: /\bmake I tell you\b/gi, message: '✓ Valid Pidgin — "let me tell you"' },
  { pattern: /\bI no dey\b/gi, message: '✓ Valid Pidgin — "I\'m not (doing it) / I refuse"' },
  { pattern: /\be no easy\b/gi, message: '✓ Valid Pidgin — "it\'s not easy"' },
  { pattern: /\be choke\b/gi, message: '✓ Valid Pidgin — "it\'s overwhelming / impressive"' },
  { pattern: /\bon God\b/gi, message: '✓ Valid Pidgin/slang — "I swear / truly"' },
  { pattern: /\bgbas gbos\b/gi, message: '✓ Valid Pidgin — "exchange of blows / back and forth"' },
  { pattern: /\bI no send\b/gi, message: '✓ Valid Pidgin — "I don\'t care"' },
  { pattern: /\bdem no fit\b/gi, message: '✓ Valid Pidgin — "they can\'t"' },
  { pattern: /\be no concern me\b/gi, message: '✓ Valid Pidgin — "it doesn\'t concern me"' },
  { pattern: /\bna cruise\b/gi, message: '✓ Valid Pidgin — "it\'s just for fun / jokes"' },
  { pattern: /\bI dey feel am\b/gi, message: '✓ Valid Pidgin — "I feel it / I\'m affected"' },
];

// English structure warnings in Pidgin mode
const PIDGIN_ENGLISH_WARNINGS: Array<{
  pattern: RegExp;
  message: string;
  suggestion: string;
}> = [
  { pattern: /\bcannot\b/gi, message: 'In Pidgin, "no fit" is used instead of "cannot"', suggestion: 'no fit' },
  { pattern: /\bcan't\b/gi, message: 'In Pidgin, "no fit" is used instead of "can\'t"', suggestion: 'no fit' },
  { pattern: /\bI am going\b/gi, message: 'In Pidgin, "I dey go" is used instead of "I am going"', suggestion: 'I dey go' },
  { pattern: /\bI have done\b/gi, message: 'In Pidgin, "I don do am" is used for completed actions', suggestion: 'I don do am' },
  { pattern: /\bhe is (?!called|named)\w+/gi, message: 'In Pidgin, "e dey" or "na im" is used instead of "he is"', suggestion: 'e dey / na im' },
  { pattern: /\bI will not\b/gi, message: 'In Pidgin, "I no go" is used instead of "I will not"', suggestion: 'I no go' },
  { pattern: /\bwe are going\b/gi, message: 'In Pidgin, "we dey go" is used instead of "we are going"', suggestion: 'we dey go' },
  { pattern: /\bthey have\b/gi, message: 'In Pidgin, "dem don" is used for "they have" (completed action)', suggestion: 'dem don' },
  { pattern: /\bit is not\b/gi, message: 'In Pidgin, "e no be" is used instead of "it is not"', suggestion: 'e no be' },
  // New warnings
  { pattern: /\bI don't know\b/gi, message: 'In Pidgin, "I no sabi" is used instead of "I don\'t know"', suggestion: 'I no sabi' },
  { pattern: /\bI don't have\b/gi, message: 'In Pidgin, "I no get" is used instead of "I don\'t have"', suggestion: 'I no get' },
  { pattern: /\bI am tired\b/gi, message: 'In Pidgin, "I don tire" is used instead of "I am tired"', suggestion: 'I don tire' },
  { pattern: /\bwhat happened\b/gi, message: 'In Pidgin, "wetin happen" is used instead of "what happened"', suggestion: 'wetin happen' },
  { pattern: /\bwhat is this\b/gi, message: 'In Pidgin, "wetin be dis" is used instead of "what is this"', suggestion: 'wetin be dis' },
  { pattern: /\blet us go\b/gi, message: 'In Pidgin, "make we go" is used instead of "let us go"', suggestion: 'make we go' },
  { pattern: /\blet's go\b/gi, message: 'In Pidgin, "make we go" is used instead of "let\'s go"', suggestion: 'make we go' },
  { pattern: /\bno problem\b/gi, message: 'In Pidgin, "no wahala" is the common expression', suggestion: 'no wahala' },
  { pattern: /\bI want to eat\b/gi, message: 'In Pidgin, "I wan chop" is used instead of "I want to eat"', suggestion: 'I wan chop' },
  { pattern: /\bwhere are you\b/gi, message: 'In Pidgin, "where you dey" or "wia you dey" is used', suggestion: 'where you dey' },
  { pattern: /\bI am fine\b/gi, message: 'In Pidgin, "I dey kampe" or "I dey" is used instead of "I am fine"', suggestion: 'I dey kampe' },
  { pattern: /\bhe doesn't\b/gi, message: 'In Pidgin, "e no" is used instead of "he doesn\'t"', suggestion: 'e no' },
  { pattern: /\bshe doesn't\b/gi, message: 'In Pidgin, "e no" is used (no gender distinction)', suggestion: 'e no' },
  { pattern: /\bdon't worry\b/gi, message: 'In Pidgin, "no wahala" or "no shaking" is used', suggestion: 'no wahala' },
  { pattern: /\bI am hungry\b/gi, message: 'In Pidgin, "hunger dey catch me" or "belle dey do me" is used', suggestion: 'hunger dey catch me' },
  { pattern: /\bthey are coming\b/gi, message: 'In Pidgin, "dem dey come" is used instead of "they are coming"', suggestion: 'dem dey come' },
  { pattern: /\bwhat do you want\b/gi, message: 'In Pidgin, "wetin you wan" is used', suggestion: 'wetin you wan' },
  { pattern: /\bit doesn't matter\b/gi, message: 'In Pidgin, "e no matter" or "no wahala" is used', suggestion: 'e no matter' },
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

    // Edit distance fallback (words >= 4 chars only, distance <= 1)
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
