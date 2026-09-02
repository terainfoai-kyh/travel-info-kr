/**
 * VORA AI Security & Guardrail Service
 * 
 * 1. Prompt Injection & Jailbreak Defense (0-Token Block)
 * 2. XSS & HTML Script Sanitization
 * 3. Profanity & Harmful Request Filtering
 * 4. Off-Topic (Non-Travel) 0-Token Smart Redirection
 * 5. Full Multilingual Response Support (KO, EN, JA, ZH)
 */

// 1. Prompt Injection & System Prompt Leak Patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s*prompt/i,
  /api[_\s-]?key/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /지침(을)?\s*(무시|알려|출력|보여)/i,
  /시스템\s*프롬프트/i,
  /비밀번호|비밀키|토큰\s*값/i,
  /roleplay\s+as/i,
  /act\s+as\s+unrestricted/i,
  /developer\s+mode/i
];

// 2. Severe Profanity & Inappropriate Query Patterns
const PROFANITY_PATTERNS = [
  /시발|씨발|개새끼|병신|지랄|존나|좆|미친놈|미친년|꺼져|죽어/i,
  /fuck|bitch|bastard|asshole|shit|dick|pussy/i,
  /죽이고\s*싶|자살|테러|폭탄|마약|도박/i
];

// 3. Off-Topic / Non-Travel Patterns (Dating, Stocks, Coding, Homework, etc.)
const OFF_TOPIC_PATTERNS = [
  /애인\s*(구해|만들어|소개)|여자친구\s*(구해|소개)|남자친구\s*(구해|소개)/i,
  /사랑해|결혼해\s*줘|나랑\s*사귀자/i,
  /주식\s*(추천|전망|종목)|비트코인|코인\s*추천|로또\s*번호/i,
  /코딩\s*(해줘|짜줘)|파이썬\s*코드|자바스크립트\s*코드|리액트\s*코드/i,
  /숙제\s*해줘|과제\s*해줘|수학\s*문제\s*풀어/i,
  /dating|marry\s*me|girlfriend|boyfriend|stock\s*pick|crypto\s*prediction|lottery/i,
  /write\s*code|solve\s*my\s*homework/i
];

/**
 * Sanitize input text to neutralize XSS, scripts and HTML tags
 */
export function sanitizeInput(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  return rawText
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/eval\s*\(/gi, '')
    .trim()
    .slice(0, 300); // 300 char max limit
}

/**
 * Validate input query against security & travel relevance guardrails
 * Returns { isBlocked: boolean, replyText?: string, quickSuggestions?: string[] }
 */
export function inspectSecurityGuardrails(rawQuery, lang = 'ko') {
  const clean = (rawQuery || '').trim();
  if (!clean) return { isBlocked: false };

  // 🛡️ 1. Prompt Injection & Jailbreak Defense
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      const reply = (lang === 'en')
        ? `🛡️ **Security Policy Notice**\nI am dedicated to helping you discover Korea's finest destinations, dining, and culture. For security reasons, system-level modification requests cannot be processed. Please ask about your travel plans! 😊`
        : (lang === 'ja')
        ? `🛡️ **セキュリティ保護ポリシー**\n韓国旅行に関するご案内を専門としております。システムに関する指示や機密情報への要求はお受けできません。旅行のご質問をお待ちしております！😊`
        : (lang === 'zh' || lang === 'zht')
        ? `🛡️ **安全防护提示**\n我是专注韩国旅游的专属向导。为确保系统安全，无法处理涉及底层指令或非旅游安全策略的请求。欢迎咨询旅游行程！😊`
        : `🛡️ **보안 안심 가드레일 안내**\n저는 안전하고 즐거운 대한민국 여행을 돕는 VORA AI예요! 보안 정책상 시스템 지침이나 내부 정보 관련 요청은 처리할 수 없어요. 설레는 여행에 대해 질문해 주세요! 😊`;

      return {
        isBlocked: true,
        replyText: reply,
        quickSuggestions: [
          (lang === 'en' ? '👑 Seoul Hotspots' : lang === 'ja' ? '👑 ソウル人気コース' : (lang === 'zh' || lang === 'zht') ? '👑 首尔热门路线' : '👑 서울 인기 코스'),
          (lang === 'en' ? '🌊 Busan Ocean View' : lang === 'ja' ? '🌊 釜山オーシャンビュー' : (lang === 'zh' || lang === 'zht') ? '🌊 釜山海景路线' : '🌊 부산 오션뷰 코스')
        ]
      };
    }
  }

  // 🛡️ 2. Profanity & Harmful Request Filter
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(clean)) {
      const reply = (lang === 'en')
        ? `🌸 Let's keep our travel planning friendly and warm! Please ask anything about Korean attractions, cafes, and tours. 😊`
        : (lang === 'ja')
        ? `🌸 気持ちの良いご案内を心がけております。韓国の観光地やカフェ、グルメについてお気軽にお尋ねください！😊`
        : (lang === 'zh' || lang === 'zht')
        ? `🌸 让我们保持愉快友善的交流！欢迎随时向我咨询韩国的景点、美食与特色行程。😊`
        : `🌸 서로 존중하는 따뜻한 대화를 지향해요! 대한민국 여행 명소나 맛집, 카페에 대해 편하게 물어봐 주세요. 😊`;

      return {
        isBlocked: true,
        replyText: reply,
        quickSuggestions: [
          (lang === 'en' ? '👑 Seoul Highlights' : lang === 'ja' ? '👑 ソウル ヒーリング' : (lang === 'zh' || lang === 'zht') ? '👑 首尔 治愈之旅' : '👑 서울 힐링 코스'),
          (lang === 'en' ? '🍊 Jeju Island Tour' : lang === 'ja' ? '🍊 済州 ネイチャーツアー' : (lang === 'zh' || lang === 'zht') ? '🍊 济州 自然探索' : '🍊 제주 자연 코스')
        ]
      };
    }
  }

  // 🛡️ 3. Off-Topic / Non-Travel 0-Token Smart Redirection
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(clean)) {
      const reply = (lang === 'en')
        ? `✈️ I am your dedicated Korean travel AI concierge, **VORA**!\nI specialize in crafting personalized itineraries, hidden local gems, and gourmet tours across Korea.\n\nWhich destination in Korea would you like to explore? 😊`
        : (lang === 'ja')
        ? `✈️ 韓国旅行専門のAIコンシェルジュ、**VORA**です！\n韓国各地のカスタム旅程、おすすめのカフェや名所、本場のグルメをご案内しています。\n\nソウル、釜山、済州など、どちらへ旅行されたいですか？😊`
        : (lang === 'zh' || lang === 'zht')
        ? `✈️ 我是您的韩国专属旅游AI向导 **VORA**！\n我专注于为您定制韩国特色行程、地道美食与热门打卡名所。\n\n您计划前往首尔、釜山还是济州岛呢？😊`
        : `✈️ 저는 대한민국 여행 전문 AI 컨시어지 **VORA**예요!\n한국의 멋진 명소, 감성 카페, 로컬 맛집과 맞춤 일정표를 가장 완벽하게 안내해 드리고 있어요. 😊\n\n혹시 서울, 부산, 제주 중 어디로 여행을 떠나고 싶으신가요?`;

      return {
        isBlocked: true,
        replyText: reply,
        quickSuggestions: [
          (lang === 'en' ? '👑 Seoul Palace & Bukchon' : lang === 'ja' ? '👑 ソウル 景福宮＆北村' : (lang === 'zh' || lang === 'zht') ? '👑 首尔 景福宫与北村' : '👑 서울 경복궁 & 북촌'),
          (lang === 'en' ? '🌊 Busan Ocean & Sky Capsule' : lang === 'ja' ? '🌊 釜山 スカイカプセル' : (lang === 'zh' || lang === 'zht') ? '🌊 釜山 海云台胶囊列车' : '🌊 부산 오션 스카이캡슐'),
          (lang === 'en' ? '🍊 Jeju Aewol Coast' : lang === 'ja' ? '🍊 済州 涯月海岸ドライブ' : (lang === 'zh' || lang === 'zht') ? '🍊 济州 涯月海岸公路' : '🍊 제주 애월 해안 드라이브')
        ]
      };
    }
  }

  return { isBlocked: false };
}
