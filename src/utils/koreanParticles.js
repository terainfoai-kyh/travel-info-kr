/**
 * Korean Particle Formatter & Template Interpolator
 * Handles Korean particles (은/는, 이/가, 을/를, 과/와, 으로/로) dynamically based on Hangul 받침.
 */

// Check if the last character of a Korean word has a final consonant (받침)
export function hasBatchim(word) {
  if (!word || typeof word !== 'string') return false;
  const cleanWord = word.trim();
  if (cleanWord.length === 0) return false;
  const lastChar = cleanWord.charCodeAt(cleanWord.length - 1);
  
  // Check if it's a Hangul syllable (AC00 - D7A3)
  if (lastChar < 0xac00 || lastChar > 0xd7a3) {
    return false;
  }
  
  // (charCode - 0xAC00) % 28 > 0 means it has a final consonant (받침)
  return (lastChar - 0xac00) % 28 > 0;
}

// Check specifically for 'ㄹ' 받침 for '으로/로' particle
export function hasRieulBatchim(word) {
  if (!word || typeof word !== 'string') return false;
  const cleanWord = word.trim();
  if (cleanWord.length === 0) return false;
  const lastChar = cleanWord.charCodeAt(cleanWord.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;
  
  // (charCode - 0xAC00) % 28 === 8 is 'ㄹ' 받침 (e.g. 서울, 통영 is not, 강릉 is not)
  return (lastChar - 0xac00) % 28 === 8;
}

/**
 * Attach the correct particle to a Korean word
 * @param {string} word e.g. '거제', '서울', '부산', '제주'
 * @param {string} particleType e.g. '은/는', '이/가', '을/를', '으로/로', '과/와'
 */
export function formatWithParticle(word, particleType) {
  if (!word) return '';
  const batchim = hasBatchim(word);
  
  switch (particleType) {
    case '은/는':
    case '은':
    case '는':
      return `${word}${batchim ? '은' : '는'}`;
    case '이/가':
    case '이':
    case '가':
      return `${word}${batchim ? '이' : '가'}`;
    case '을/를':
    case '을':
    case '를':
      return `${word}${batchim ? '을' : '를'}`;
    case '과/와':
    case '과':
    case '와':
      return `${word}${batchim ? '과' : '와'}`;
    case '으로/로':
    case '으로':
    case '로':
      // 'ㄹ' 받침이거나 받침이 없으면 '로', 그 외 받침은 '으로' (e.g. 서울로, 거제로, 제주로 vs 부산으로, 인천으로, 강릉으로, 수원으로)
      if (!batchim || hasRieulBatchim(word)) {
        return `${word}로`;
      }
      return `${word}으로`;
    case '의':
      return `${word}의`;
    default:
      return `${word}${particleType}`;
  }
}

/**
 * Template interpolator supporting dynamic Korean particles
 * e.g. "【 {city:은/는} 】 아름다운 곳입니다. {city:으로/로} 떠나볼까요?"
 * with { city: '거제' } -> "【 거제는 】 아름다운 곳입니다. 거제로 떠나볼까요?"
 * with { city: '서울' } -> "【 서울은 】 아름다운 곳입니다. 서울로 떠나볼까요?"
 * with { city: '부산' } -> "【 부산은 】 아름다운 곳입니다. 부산으로 떠나볼까요?"
 */
export function interpolateTemplate(template = '', variables = {}) {
  if (!template || typeof template !== 'string') return '';
  
  return template.replace(/\{([a-zA-Z0-9_]+)(?::([^\}]+))?\}/g, (match, key, particle) => {
    const rawVal = variables[key];
    if (rawVal === undefined || rawVal === null) {
      return '';
    }
    const valStr = String(rawVal);
    if (!particle) {
      return valStr;
    }
    return formatWithParticle(valStr, particle);
  });
}
