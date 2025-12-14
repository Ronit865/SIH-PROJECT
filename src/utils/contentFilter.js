// Content filter for inappropriate words in multiple languages
// English, Hindi, and Gujarati abusive words and their variations

const inappropriateWords = [
  // English profanity and slurs (only severe/explicit words to avoid false positives)
  'fuck', 'fucking', 'fucker', 'fucked', 'fucks', 'motherfucker', 'motherfuckers',
  'shit', 'shitting', 'shitty', 'shits', 'bullshit',
  'bitch', 'bitching', 'bitches', 'asshole', 'assholes',
  'bastard', 'bastards', 'whore', 'whores',
  'slut', 'sluts', 'slutty', 'cunt', 'cunts',
  'faggot', 'nigger', 'nigga', 'niggas',
  'mofo', 'mfer', 'dumbass', 'jackass', 'dipshit', 'asshat',
  'rape', 'raping', 'rapist', 'molest', 'pedophile', 'pedo',
  'porn', 'pornography', 'xxx',
  'cumshot', 'masturbate',
  
  // Common shortforms (only explicit ones)
  'wtf', 'stfu', 'gtfo', 'omfg',
  
  // Hindi abusive words (romanized) - only explicit offensive terms
  'chutiya', 'chutiye', 'chutiyapa', 'chut', 'choot', 'chod', 'chodu', 'chodna',
  'madarchod', 'maderchod', 'mkc', 'maa ki chut',
  'bhenchod', 'bahenchod', 'behnchod', 'bkl', 'bhosad', 'bhosada',
  'bhosdike', 'bhosdi', 'bsdk', 'bsdke', 'betichod', 'betichodd',
  'gandu', 'gaand', 'gaandu',
  'lodu', 'lode', 'loda', 'lavde', 'laude', 'lavda', 'lawde', 'lund',
  'randi', 'raand', 'randwa', 'randibaaz',
  'harami', 'haramzada', 'haramzadi', 'haraamkhor', 'haramkhor',
  'kutiya', 'kuttiya',
  'kamina', 'kamine', 'kaminey',
  'bhadwa', 'bhadwe', 'bhadva', 'bhadve', 'bhadvaa',
  'dalla', 'dallal',
  'chinal',
  'teri maa', 'teri behen', 'maa chod',
  
  // Gujarati abusive words (romanized) - only explicit offensive terms
  'gando', 'gandi', 'ganda', 'gande',
  'bhadvo', 'bhadvi', 'bhadva',
  'bhosdo', 'bhosdi', 'bhosda', 'bhosde',
  'lavdo', 'lavdi', 'lavda', 'lavde', 'lodo', 'lodi',
  'chodiyu', 'chodu', 'chodvi',
  'randio', 'randi', 'rando',
  
  // Variations with numbers/symbols (only for major profanity)
  'f*ck', 'f**k', 'fck', 'fuk', 'phuck', 'phuk',
  'sh*t', 'sh!t', 'shyt', 'shet',
  'b*tch', 'b!tch', 'biatch',
  'a**hole', '@sshole',
  'n1gger', 'n1gga',
  
  // Offensive harmful terms
  'kill yourself', 'kys',
  'kuttiya',
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
    // Skip words that are too short (< 4 chars) to avoid false positives
    if (word.length < 4) {
      // Only add short words if they're explicit variations
      if (word.includes('*') || word.includes('@') || word.includes('!')) {
        const escapedWord = escapeRegex(word);
        patterns.push(new RegExp(`\\b${escapedWord}\\b`, 'gi'));
      }
      return;
    }
    
    // Exact match with word boundaries - most reliable
    const escapedWord = escapeRegex(word);
    patterns.push(new RegExp(`\\b${escapedWord}\\b`, 'gi'));
    
    // Only apply variations to longer explicit profanity (6+ chars) to avoid false positives
    if (word.length >= 6 && !/[^a-z0-9]/i.test(word)) {
      // Match with leetspeak/numbers for major words only
      const withNumbers = word
        .replace(/i/g, '[i1]')
        .replace(/e/g, '[e3]')
        .replace(/a/g, '[a4@]')
        .replace(/s/g, '[s5$]')
        .replace(/o/g, '[o0]');
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
