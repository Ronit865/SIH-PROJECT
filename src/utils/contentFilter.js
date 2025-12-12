// Content filter for inappropriate words in multiple languages
// English, Hindi, and Gujarati abusive words and their variations

const inappropriateWords = [
  // English profanity and slurs
  'fuck', 'fucking', 'fucker', 'fucked', 'fucks', 'shit', 'shitting', 'shitty', 'shits',
  'bitch', 'bitching', 'bitches', 'asshole', 'assholes', 'bastard', 'bastards',
  'damn', 'damned', 'dammit', 'crap', 'crappy', 'dick', 'dicks', 'cock', 'cocks',
  'pussy', 'pussies', 'whore', 'whores', 'slut', 'sluts', 'slutty', 'cunt', 'cunts',
  'fag', 'faggot', 'fags', 'nigger', 'nigga', 'niggas', 'retard', 'retarded', 'retards',
  'piss', 'pissed', 'pissing', 'motherfucker', 'motherfuckers', 'mofo', 'mfer',
  'bullshit', 'ass', 'arse', 'douche', 'douchebag', 'screw', 'screwed',
  'jackass', 'dumbass', 'dipshit', 'horseshit', 'chickenshit', 'asshat',
  'bellend', 'wanker', 'twat', 'prick', 'tosser', 'bollocks', 'bugger',
  'rape', 'raping', 'rapist', 'molest', 'pedophile', 'pedo',
  'sex', 'sexy', 'porn', 'pornography', 'nude', 'naked', 'xxx',
  'dildo', 'viagra', 'penis', 'vagina', 'boobs', 'tits', 'titties',
  'cumshot', 'orgasm', 'masturbate', 'horny', 'anal',
  
  // Common shortforms and variations
  'wtf', 'wth', 'stfu', 'gtfo', 'mf', 'mfer', 'pos', 'sob', 'bs', 'omfg', 'af',
  'lmao', 'lmfao', 'smh', 'jfc', 'fml', 'milf', 'dilf', 'thot',
  
  // Hindi abusive words (romanized) - expanded
  'chutiya', 'chutiye', 'chutiyapa', 'chut', 'choot', 'chod', 'chodu', 'chodna',
  'madarchod', 'maderchod', 'mc', 'mkc', 'maa ki chut', 'maaki', 'maki',
  'bhenchod', 'bahenchod', 'bc', 'behen', 'behnchod', 'bkl', 'bhosad', 'bhosada',
  'bhosdike', 'bhosdi', 'bsdk', 'bsdke', 'betichod', 'beti', 'betichodd',
  'gandu', 'gand', 'gaand', 'gaandu', 'gandwe', 'gandfat', 'gandmasti',
  'lodu', 'lode', 'loda', 'lavde', 'laude', 'lavda', 'lawde', 'lund', 'ling',
  'randi', 'rand', 'raand', 'randwa', 'randi rona', 'randirona', 'randibaaz',
  'harami', 'haramzada', 'haramzadi', 'haraamkhor', 'haramkhor',
  'kutta', 'kutte', 'kutiya', 'kutti', 'kuttiya',
  'kamina', 'kamine', 'kamini', 'kaminey', 'kamino',
  'saala', 'sala', 'saale', 'saali', 'sali',
  'pela', 'pelu', 'jhaat', 'jhaant', 'jhatu', 'jhattu',
  'bhadwa', 'bhadwe', 'bhadva', 'bhadve', 'bhadvaa',
  'chakka', 'chhakka', 'hijra', 'hijda', 'kinnar',
  'dalla', 'dallal', 'dalaal', 'dalal',
  'chamiya', 'chamiye', 'chamiya', 'chinal', 'raandwa',
  'bhikari', 'bhikhari', 'garib', 'kangal',
  'besharam', 'badtameez', 'badtamiz', 'ghatia', 'neech',
  'kameena', 'gadha', 'gadhe', 'ullu', 'bevakoof', 'bewakoof', 'buddhu',
  'pagal', 'paagal', 'mental', 'psycho', 'dimag kharab',
  'teri maa', 'teri behen', 'maa chod', 'baap',
  
  // Gujarati abusive words (romanized) - expanded
  'gando', 'gandi', 'ganda', 'gande', 'gandigiri',
  'bhadvo', 'bhadvi', 'bhadva', 'bhadvi', 'bhadvagiri',
  'bhosdo', 'bhosdi', 'bhosda', 'bhosde',
  'lavdo', 'lavdi', 'lavda', 'lavde', 'lodo', 'lodi',
  'madarchod', 'mc', 'mchod', 'mkc',
  'benchod', 'bc', 'behenchod', 'bahen',
  'chodiyu', 'chodu', 'chodiyu', 'chodvi',
  'randio', 'randi', 'rand', 'rando',
  'dafat', 'dafar', 'popat', 'popatgiri',
  'vadhani', 'vadhanu', 'fatakdi', 'fatakdo', 'fatakda',
  'bewakuf', 'bewakoof', 'gadhedu', 'gadhedi', 'gadhedo',
  'dhimak', 'dhimakh', 'dimaag', 'buddhu', 'budhdho',
  'khajurbhai', 'saand', 'bail', 'kukdo',
  'haraami', 'harami', 'kamino', 'neech', 'ghatiya',
  'bhukho', 'bhikharo', 'kangal', 'daridri',
  
  // Variations with numbers/symbols
  'f*ck', 'f**k', 'f***', 'sh*t', 'sh!t', 'b*tch', 'b!tch',
  'a**hole', 'a**', '@ss', '@sshole', 'fck', 'fuk', 'phuck', 'phuk',
  'shyt', 'sht', 'shiet', 'azz', 'asz', 'biatch', 'beech', 'beeches',
  'shet', 'd!ck', 'd1ck', 'dik', 'c0ck', 'fag0t',
  'n1gger', 'n1gga', 'nig*a', 'p*ssy', 'pu$$y',
  
  // Common patterns with spaces or symbols
  'f u c k', 'b i t c h', 'm o t h e r f u c k e r', 'a s s h o l e',
  's h i t', 'c u n t', 'd i c k', 'p u s s y',
  
  // Offensive terms
  'kill yourself', 'kys', 'die', 'suicide', 'hang yourself',
  'cancer', 'aids', 'disease', 'ugly', 'disgusting',
  'hate you', 'hate u', 'loser', 'failure', 'worthless', 'useless',
  'idiot', 'stupid', 'dumb', 'moron', 'imbecile', 'cretin',
];

// Create regex patterns for variations
const createRegexPatterns = () => {
  const patterns = [];
  
  // Helper function to escape special regex characters
  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  inappropriateWords.forEach(word => {
    // Skip words that are just symbols or very short
    if (word.length < 2) return;
    
    // Exact match with escaped word
    const escapedWord = escapeRegex(word);
    patterns.push(new RegExp(`\\b${escapedWord}\\b`, 'gi'));
    
    // Match with special characters in between (only for words without special chars)
    if (!/[^a-z0-9]/i.test(word)) {
      const wordWithSpaces = word.split('').join('[\\s\\-_]*');
      patterns.push(new RegExp(wordWithSpaces, 'gi'));
      
      // Match with numbers replacing letters (1=i, 3=e, 4=a, 5=s, 0=o, 7=t, 8=b)
      const withNumbers = word
        .replace(/i/g, '[i1]')
        .replace(/e/g, '[e3]')
        .replace(/a/g, '[a4@]')
        .replace(/s/g, '[s5$]')
        .replace(/o/g, '[o0]')
        .replace(/t/g, '[t7]')
        .replace(/b/g, '[b8]');
      patterns.push(new RegExp(`\\b${withNumbers}\\b`, 'gi'));
    }
  });
  
  return patterns;
};

const regexPatterns = createRegexPatterns();

/**
 * Check if text contains inappropriate content
 * @param {string} text - Text to check
 * @returns {boolean} - True if inappropriate content found
 */
export const containsInappropriateContent = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  const normalizedText = text.toLowerCase().trim();
  
  // Check against all patterns
  for (const pattern of regexPatterns) {
    if (pattern.test(normalizedText)) {
      return true;
    }
  }
  
  // Check for repeated characters (common abuse pattern like "aaassss")
  const repeatedPattern = /(.)\1{4,}/g;
  if (repeatedPattern.test(normalizedText)) {
    const withoutRepeated = normalizedText.replace(/(.)\1+/g, '$1');
    for (const pattern of regexPatterns) {
      if (pattern.test(withoutRepeated)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Get list of inappropriate words found in text
 * @param {string} text - Text to check
 * @returns {array} - Array of inappropriate words found
 */
export const getInappropriateWords = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const normalizedText = text.toLowerCase().trim();
  const foundWords = [];
  
  inappropriateWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundWords.push(word);
    }
  });
  
  return [...new Set(foundWords)]; // Remove duplicates
};

/**
 * Censor inappropriate content in text
 * @param {string} text - Text to censor
 * @returns {string} - Censored text
 */
export const censorContent = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let censoredText = text;
  
  regexPatterns.forEach(pattern => {
    censoredText = censoredText.replace(pattern, (match) => {
      return '*'.repeat(match.length);
    });
  });
  
  return censoredText;
};

export default {
  containsInappropriateContent,
  getInappropriateWords,
  censorContent
};
