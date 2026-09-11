import { universalTranslateSpot, romanizeKorean } from '../src/utils/koreanRomanizer.js';
import { getTranslatedTitle } from '../src/i18n/translations.js';

const testCases = [
  '논산양촌곶감축제',
  '도정딸기마을',
  '쌍계사',
  '효암서원',
  '탑정저수지',
  '강경미내다리',
  '거창수승대',
  '김천직지사',
  '신안퍼플섬',
  '단양도담삼봉'
];

console.log('=== 🏛️ Nationwide Universal Translation Verification ===');
for (const tc of testCases) {
  const en = getTranslatedTitle(tc, 'en');
  const ja = getTranslatedTitle(tc, 'ja');
  const zh = getTranslatedTitle(tc, 'zh');
  console.log(`[${tc}]`);
  console.log(`  EN: ${en}`);
  console.log(`  JA: ${ja}`);
  console.log(`  ZH: ${zh}`);
}
