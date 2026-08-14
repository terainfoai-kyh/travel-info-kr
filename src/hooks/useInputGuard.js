/**
 * useInputGuard.js
 * 1차 로컬 자연어 입력 방어 및 필터링 모듈 (0ms 응답, Gemini API 코스트 0원 처리)
 */

const NON_TRAVEL_PATTERNS = [
  /주식|코인|비트코인|투자|증권|종목/i,
  /프로그래밍|코딩|자바스크립트|파이썬|버그|에러|소스/i,
  /수학|방정식|계산기|풀어줘/i,
  /욕설|성인|음란|비하/i
];

export function validateTravelQuery(query, lang = 'ko') {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      reason: 'empty',
      message: getGuardMessage('empty', lang)
    };
  }

  const clean = query.trim();

  // 1. 단문/의미없는 입력 차단 (2자 미만)
  if (clean.length < 2) {
    return {
      isValid: false,
      reason: 'too_short',
      message: getGuardMessage('too_short', lang)
    };
  }

  // 2. 비관광 주제 로컬 차단
  const isNonTravel = NON_TRAVEL_PATTERNS.some(pattern => pattern.test(clean));
  if (isNonTravel) {
    return {
      isValid: false,
      reason: 'non_travel',
      message: getGuardMessage('non_travel', lang)
    };
  }

  return {
    isValid: true,
    reason: null,
    message: ''
  };
}

function getGuardMessage(reason, lang = 'ko') {
  const messages = {
    ko: {
      empty: '여행하고 싶으신 지역이나 테마를 입력해 주세요! 📍',
      too_short: '조금 더 자세히 여행지를 입력해 주세요 (예: 서울 2박3일 맛집 코스) ✈️',
      non_travel: '보라는 대한민국 여행 가이드입니다! 관광지, 명소, 미식 관련 질문을 입력해 주세요 🇰🇷'
    },
    en: {
      empty: 'Please enter a destination or travel theme! 📍',
      too_short: 'Please enter a bit more detail (e.g. 3-day Seoul food tour) ✈️',
      non_travel: 'Vora is a Korea Travel Concierge! Please ask about sights, food, or itineraries 🇰🇷'
    },
    ja: {
      empty: '旅行したい地域やテーマを入力してください！📍',
      too_short: 'もう少し詳しく目的地を入力してください（例：ソウル2泊3日グルメコース）✈️',
      non_travel: 'Voraは韓国 travelガイドです！観光地やグルメに関するご質問をお願いします 🇰🇷'
    },
    zh: {
      empty: '请输入您想去的旅行目的地或主题！📍',
      too_short: '请输入更详细的行程（例如：首尔3天2晚美食之旅）✈️',
      non_travel: 'Vora是韩国旅游 AI 助手！请询问与景点、美食或行程相关的问题 🇰🇷'
    }
  };

  const langMap = messages[lang] || messages.ko;
  return langMap[reason] || langMap.empty;
}
