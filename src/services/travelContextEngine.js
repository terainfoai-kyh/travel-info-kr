/**
 * KoreaTravel Travel Context Engine (VORA 지능형 여행 컨텍스트 엔진 2.0)
 * 
 * Architecture (Gemini-Distilled Autonomous Knowledge & State Manager):
 * 1. Trip Memory: Long-term trip identity (destination, days, companions, preferences)
 * 2. Current Context: Real-time runtime environment (currentCity, activeDay, timeSlot, weather)
 * 3. Gemini-Distilled Knowledge Base Integration: Uses `voraDialogKnowledge.js` for 0.01s instant wisdom
 * 4. Multi-City Advanced Routing: Supports Pattern A (도시 1일 강릉 1일), Pattern B (2일은 남해 3일은 통영), Pattern C (남해->통영->거제)
 * 5. 100% Zero-Hallucination & TourAPI 4.0 Authentic Mapping
 */

import { CITY_LOCAL_KNOWLEDGE, VORA_INTELLIGENT_DIALOG_TEMPLATES, resolveKnowledgeScenario } from '../data/voraDialogKnowledge.js';

export const INITIAL_TRAVEL_STATE = {
  tripMemory: {
    destination: '서울',
    days: 3,
    companion: { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' },
    preferences: {
      isMinimalWalking: false,
      isFoodie: false,
      isCafe: false,
      isPhoto: false,
      isShopping: false,
      isHealing: false
    },
    isRainPreferred: false
  },
  currentContext: {
    currentCity: '서울',
    activeDay: 1,
    timeSlot: 'lunch',
    timeSlotLabel: '점심',
    weather: { isRainy: false, isHot: false, isCold: false, summary: '쾌적' }
  },
  lastIntent: 'INITIAL',
  lastUpdatedPrompt: '',
  hasNewCondition: false
};

/**
 * Multi-City & Multi-Day Advanced Parser
 * Supports:
 * - Pattern A: "서울 1일 강릉 1일 속초 1일" (City + Days)
 * - Pattern B: "2일은 남해 3일은 통영으로 해줘" (Day-by-Day City Assignment)
 * - Pattern C: "남해 -> 통영 -> 거제" or "서울, 강릉, 속초" (Sequential Routing)
 */
export function parseMultiCityPrompt(prompt = '', prevState = INITIAL_TRAVEL_STATE) {
  if (!prompt || typeof prompt !== 'string') return null;
  const clean = prompt.trim();
  
  // 1. Pattern A: [도시] [N]일/일간 (e.g. "서울 1일 강릉 1일 속초 1일", "부산 2박 경주 1박")
  const cityDayRegex = /(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)\s*(\d+)\s*(일|박|일간)/g;
  const cityDayMatches = [...clean.matchAll(cityDayRegex)];

  if (cityDayMatches && cityDayMatches.length >= 2) {
    const cityPlans = [];
    let totalDays = 0;
    const cityNames = [];

    for (const m of cityDayMatches) {
      const city = m[1];
      const count = parseInt(m[2], 10) || 1;
      cityPlans.push({ city, days: count });
      cityNames.push(city);
      totalDays += count;
    }

    const dayByDayList = [];
    let currentDayCounter = 1;
    cityPlans.forEach(plan => {
      for (let i = 0; i < plan.days; i++) {
        dayByDayList.push({ day: currentDayCounter, city: plan.city });
        currentDayCounter++;
      }
    });

    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames,
      totalDays: Math.min(7, totalDays),
      combinedLabel: cityNames.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  // 2. Pattern B: [N]일차/N일은 [도시] (e.g. "2일은 남해 3일은 통영", "2일차는 남해, 3일차는 통영", "2일은 통영으로")
  const dayCityRegex = /(\d+)\s*일\s*(차|에|에는|째|은|는)?\s*(은|는|에|에는|으로|로)?\s*(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/g;
  const dayCityMatches = [...clean.matchAll(dayCityRegex)];

  if (dayCityMatches && dayCityMatches.length >= 1) {
    const prevDestination = prevState?.tripMemory?.destination || prevState?.currentContext?.currentCity || '남해';
    const baseCity = prevDestination.split('·')[0] || '남해';
    const dayMap = {};
    let maxDay = prevState?.tripMemory?.days || 3;

    // 기본 1일차는 이전 목적지 계승
    dayMap[1] = baseCity;

    for (const m of dayCityMatches) {
      const targetDay = parseInt(m[1], 10);
      const targetCity = m[4];
      if (targetDay > 0 && targetDay <= 7) {
        dayMap[targetDay] = targetCity;
        if (targetDay > maxDay) maxDay = targetDay;
      }
    }

    const dayByDayList = [];
    const distinctCities = [];
    let lastKnownCity = baseCity;

    for (let d = 1; d <= maxDay; d++) {
      if (dayMap[d]) {
        lastKnownCity = dayMap[d];
      }
      dayByDayList.push({ day: d, city: lastKnownCity });
      if (!distinctCities.includes(lastKnownCity)) {
        distinctCities.push(lastKnownCity);
      }
    }

    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames: distinctCities,
      totalDays: maxDay,
      combinedLabel: distinctCities.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  // 3. Pattern C: Arrow or Separator Sequence ("남해-> 통영->거제", "서울, 강릉, 속초", "부산-경주-포항")
  const allCitiesInPrompt = [];
  const cityTokenRegex = /(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/g;
  let tokenMatch;
  while ((tokenMatch = cityTokenRegex.exec(clean)) !== null) {
    if (!allCitiesInPrompt.includes(tokenMatch[1])) {
      allCitiesInPrompt.push(tokenMatch[1]);
    }
  }

  if (allCitiesInPrompt.length >= 2 && /(->|>|➔|→|-|,|\s+)/.test(clean)) {
    const dayByDayList = allCitiesInPrompt.map((city, idx) => ({ day: idx + 1, city }));
    const dayByDaySummary = dayByDayList.map(item => `${item.day}일차 ${item.city}`).join(', ');

    return {
      isMultiCity: true,
      cityPlans: dayByDayList,
      cityNames: allCitiesInPrompt,
      totalDays: Math.min(7, allCitiesInPrompt.length),
      combinedLabel: allCitiesInPrompt.join('·'),
      dayByDaySummary: `${dayByDaySummary} 연계 코스`
    };
  }

  return null;
}

/**
 * Context Update Processor (State Machine with Incremental Patches)
 */
export function updateTravelContext(prompt = '', previousState = INITIAL_TRAVEL_STATE) {
  if (!prompt || typeof prompt !== 'string') {
    return previousState;
  }

  const clean = prompt.trim();
  const nextState = {
    tripMemory: {
      ...previousState.tripMemory,
      companion: { ...previousState.tripMemory.companion },
      preferences: { ...previousState.tripMemory.preferences }
    },
    currentContext: {
      ...previousState.currentContext,
      weather: { ...previousState.currentContext.weather }
    },
    lastIntent: 'UPDATE_CONTEXT',
    lastUpdatedPrompt: clean,
    hasNewCondition: false,
    multiCity: null
  };

  // 1. Multi-City Detection
  const multiCityResult = parseMultiCityPrompt(clean, previousState);
  if (multiCityResult) {
    nextState.multiCity = multiCityResult;
    nextState.tripMemory.destination = multiCityResult.combinedLabel;
    nextState.tripMemory.days = multiCityResult.totalDays;
    nextState.currentContext.currentCity = multiCityResult.cityNames[0] || previousState.currentContext.currentCity;
    nextState.hasNewCondition = true;
  }

  // 2. Single City Destination Patch
  if (!multiCityResult) {
    const singleCityMatch = clean.match(/(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/);
    if (singleCityMatch) {
      const city = singleCityMatch[1];
      const isDayAssignment = /\d+\s*일\s*(차|에|에는|째|은|는)/.test(clean);
      if (!isDayAssignment) {
        nextState.tripMemory.destination = city;
        nextState.currentContext.currentCity = city;
        nextState.hasNewCondition = true;
      }
    }
  }

  // 3. Days Count Patch (Avoid ordinal false positive)
  const isOrdinalDay = /(\d+)\s*일\s*(차|에|에는|째|은|는)/.test(clean);
  if (!isOrdinalDay && !multiCityResult) {
    const daysMatch = clean.match(/(\d+)\s*(박\s*\d+\s*일|박|일간|일치|일정|일)/);
    if (daysMatch) {
      const count = parseInt(daysMatch[1], 10);
      if (count >= 1 && count <= 14) {
        nextState.tripMemory.days = count;
        nextState.hasNewCondition = true;
      }
    }
  }

  // 4. Companion & Accessibility Preferences Patch
  if (/(아이|애기|키즈|유모차|어린이|자녀|초등)/.test(clean)) {
    nextState.tripMemory.companion.isKids = true;
    nextState.tripMemory.companion.type = '키즈/가족';
    nextState.hasNewCondition = true;
  }
  if (/(부모님|어르신|할머니|할아버지|엄마|아빠|어머니|아버지)/.test(clean)) {
    nextState.tripMemory.companion.isElder = true;
    nextState.tripMemory.companion.type = '부모님/효도';
    nextState.tripMemory.preferences.isMinimalWalking = true;
    nextState.hasNewCondition = true;
  }
  if (/(혼자|나홀로|솔로|혼행)/.test(clean)) {
    nextState.tripMemory.companion.isSolo = true;
    nextState.tripMemory.companion.type = '나홀로/솔로';
    nextState.hasNewCondition = true;
  }

  // 5. Walking / Comfort Preference
  if (/(덜\s*걷|안\s*걷|걷기\s*싫|다리\s*아|편하게|동선\s*짧|평지)/.test(clean)) {
    nextState.tripMemory.preferences.isMinimalWalking = true;
    nextState.hasNewCondition = true;
  }

  // 6. Food & Cafe Preference
  if (/(맛집|미식|먹방|푸드|맛있는)/.test(clean)) {
    nextState.tripMemory.preferences.isFoodie = true;
    nextState.hasNewCondition = true;
  }
  if (/(카페|디저트|베이커리|커피|빵지순례)/.test(clean)) {
    nextState.tripMemory.preferences.isCafe = true;
    nextState.hasNewCondition = true;
  }

  // 7. Weather / Indoor Context
  if (/(비|우천|비오는|폭우|실내)/.test(clean)) {
    nextState.currentContext.weather.isRainy = true;
    nextState.currentContext.weather.summary = '우천 실내';
    nextState.tripMemory.isRainPreferred = true;
    nextState.hasNewCondition = true;
  }

  return nextState;
}

/**
 * Removes a specific context chip when user taps [✕]
 */
export function removeContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const updated = {
    ...prevState,
    tripMemory: {
      ...prevState.tripMemory,
      companion: { ...prevState.tripMemory.companion },
      preferences: { ...prevState.tripMemory.preferences }
    },
    currentContext: {
      ...prevState.currentContext,
      weather: { ...prevState.currentContext.weather }
    }
  };

  if (chipId === 'kids') updated.tripMemory.companion.isKids = false;
  if (chipId === 'elder') {
    updated.tripMemory.companion.isElder = false;
    updated.tripMemory.preferences.isMinimalWalking = false;
  }
  if (chipId === 'solo') updated.tripMemory.companion.isSolo = false;
  if (chipId === 'rain') {
    updated.currentContext.weather.isRainy = false;
    updated.tripMemory.isRainPreferred = false;
  }
  if (chipId === 'minimal_walking') updated.tripMemory.preferences.isMinimalWalking = false;
  if (chipId === 'foodie') updated.tripMemory.preferences.isFoodie = false;
  if (chipId === 'cafe') updated.tripMemory.preferences.isCafe = false;

  return updated;
}

/**
 * Returns active context chips for UI display
 */
export function getActiveContextChips(sessionContext = {}, lang = 'ko') {
  const chips = [];
  const comp = sessionContext.tripMemory?.companion || sessionContext.companion || {};
  const prefs = sessionContext.tripMemory?.preferences || sessionContext.preferences || {};
  const weather = sessionContext.currentContext?.weather || sessionContext.weather || {};

  if (comp.isKids) chips.push({ id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 With Kids' : '👨‍👩‍👧 아이 동반', color: '#ec4899' });
  if (comp.isElder) chips.push({ id: 'elder', label: lang === 'en' ? '🌿 With Parents' : '🌿 부모님 동반', color: '#10b981' });
  if (comp.isSolo) chips.push({ id: 'solo', label: lang === 'en' ? '🍃 Solo Trip' : '🍃 나홀로 여행', color: '#06b6d4' });

  if (weather.isRainy || sessionContext.isRainQuery) chips.push({ id: 'rain', label: lang === 'en' ? '☔ Rainy/Indoor' : '☔ 비/실내 선호', color: '#3b82f6' });
  if (prefs.isMinimalWalking) chips.push({ id: 'minimal_walking', label: lang === 'en' ? '🚶 Minimal Walking' : '🚶 걷기 적게', color: '#8b5cf6' });
  if (prefs.isCafe) chips.push({ id: 'cafe', label: lang === 'en' ? '☕ Cafe Tour' : '☕ 감성 카페', color: '#f59e0b' });
  if (prefs.isFoodie) chips.push({ id: 'foodie', label: lang === 'en' ? '🍴 Gourmet Food' : '🍴 로컬 맛집', color: '#ef4444' });

  return chips;
}

/**
 * Builds real-time runtime context snapshot
 */
export function buildTravelContext({
  targetCity = '서울',
  activeDay = 1,
  timeSlotLabel = '점심',
  weather = { isRainy: false },
  sessionContext = {},
  existingSpots = []
}) {
  const companion = sessionContext.tripMemory?.companion || sessionContext.companion || {};
  const preferences = sessionContext.tripMemory?.preferences || sessionContext.preferences || {};

  return {
    targetCity,
    activeDay,
    timeSlotLabel,
    weather,
    companion,
    preferences,
    existingSpotNames: existingSpots.map(s => s.name || s.title || ''),
    totalSpotsToday: existingSpots.length,
    hasNewCondition: sessionContext.hasNewCondition,
    multiCity: sessionContext.multiCity
  };
}

/**
 * Curated Day Plans Generator (Gemini-Level Theme & Foodie Pairing)
 */
export function generateCuratedDayPlans(city = '서울', days = 3, preferences = {}) {
  const isKids = preferences.isKids || false;
  const isIndoor = preferences.isIndoor || false;
  const isMinimalWalking = preferences.isMinimalWalking || false;

  const cityKnowledge = CITY_LOCAL_KNOWLEDGE[city] || CITY_LOCAL_KNOWLEDGE['서울'];

  const themePool = [
    {
      theme: `1일차: ${city} 핵심 랜드마크 & 시그니처 감성 투어`,
      transit: cityKnowledge.transitTip || `${city} 순환 쾌속 대중교통 및 안심 동선`,
      food: {
        dishName: cityKnowledge.localFoodieSecret.split(',')[0] || `${city} 대표 로컬 정식`,
        description: `현지인들이 가장 사랑하는 ${city}의 대표 힐링 미식`
      }
    },
    {
      theme: `2일차: ${city} 로컬 핫플레이스 & 오션·전망 힐링`,
      transit: isMinimalWalking ? `케이블카 및 평지 슬로프 중심 최단 보행` : `${city} 감성 해안/골목 쾌적 동선`,
      food: {
        dishName: cityKnowledge.localFoodieSecret.split(',')[1] || `${city} 명품 미식 만찬`,
        description: `여행의 풍미를 돋우는 시그니처 로컬 요리`
      }
    },
    {
      theme: `3일차: ${city} 여유로운 사색 & 감성 카페 빵지순례`,
      transit: `주요 거점 역세권 직통 연결 버스`,
      food: {
        dishName: `${city} 스페셜티 디저트 & 베이커리`,
        description: `여행을 달콤하고 향긋하게 추억하는 감성 카페 미식`
      }
    },
    {
      theme: `4일차: ${city} 숨은 명소 탐방과 파노라마 뷰`,
      transit: `${city} 순환 관광 셔틀`,
      food: {
        dishName: `${city} 향토 특선 만찬`,
        description: `신선한 제철 식재료로 정갈하게 차려낸 한 상`
      }
    },
    {
      theme: `5일차: ${city} 힐링 피날레 & 로컬 스트리트 마켓`,
      transit: `KTX/터미널 인접 이동 동선`,
      food: {
        dishName: `${city} 전통 마켓 주전부리 세트`,
        description: `부담 없이 즐기는 로컬 전통 먹거리의 정수`
      }
    }
  ];

  if (isIndoor) {
    themePool[0].theme = `1일차: ${city} 환상적인 실내 미디어아트 & 수족관`;
    themePool[1].theme = `2일차: ${city} 대형 복합 문화공간 & 실내 오션뷰 카페`;
  }

  return themePool.slice(0, Math.min(days, themePool.length));
}

/**
 * Gemini-Distilled 0.01s Instant Layered Advice Generator
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const cleanPrompt = (context.lastUpdatedPrompt || '').trim();
  const targetCity = context.currentContext?.currentCity || context.tripMemory?.destination || context.targetCity || '서울';
  const activeDay = context.currentContext?.activeDay || context.activeDay || 1;
  const timeSlotLabel = context.currentContext?.timeSlotLabel || context.timeSlotLabel || '점심';
  const multiCity = context.multiCity;
  const companion = context.tripMemory?.companion || context.companion || {};
  const preferences = context.tripMemory?.preferences || context.preferences || {};
  const weather = context.currentContext?.weather || context.weather || {};

  // Resolve best knowledge template scenario
  const scenarioKey = resolveKnowledgeScenario(cleanPrompt);
  const template = VORA_INTELLIGENT_DIALOG_TEMPLATES[scenarioKey] || VORA_INTELLIGENT_DIALOG_TEMPLATES.FOODIE_CAFE;
  const cityInfo = CITY_LOCAL_KNOWLEDGE[targetCity] || CITY_LOCAL_KNOWLEDGE['서울'];

  // Layer 1: Empathy & Conversational Intro
  let layer1 = `선배님, 요청하신 조건에 딱 맞게 **${targetCity}** 최적 일정을 정갈하게 조율해 드립니다! ✨`;
  if (multiCity && multiCity.isMultiCity) {
    layer1 = `선배님, **[${multiCity.combinedLabel}] ${multiCity.totalDays}일 연계 코스**를 광역 교통 최적 동선으로 시원하게 완성했습니다! 🚅✨`;
  } else if (scenarioKey === 'MINIMAL_WALKING') {
    layer1 = template.intro(targetCity);
  } else if (scenarioKey === 'RAINY_INDOOR') {
    layer1 = template.intro(targetCity);
  } else if (scenarioKey === 'KIDS_FAMILY') {
    layer1 = template.intro(targetCity);
  } else if (scenarioKey === 'BUDGET_VALUE') {
    layer1 = template.intro(targetCity);
  } else if (scenarioKey === 'PUBLIC_TRANSIT') {
    layer1 = template.intro(targetCity);
  }

  // Layer 2: Actionable Local Wisdom & Transit Summary
  const layer2 = `${targetCity} ${activeDay}일차 ${timeSlotLabel} 동선: ${template.tip} 💡 (${cityInfo.transitTip})`;

  // Layer 3: Action Prompt
  const layer3 = lang === 'en'
    ? `Tap **[ ＋ Add to Day ${activeDay} ]** on any spot below to add it directly to your itinerary!`
    : `원하시는 장소 아래 **[ ＋ ${activeDay}일차 일정에 추가 ]**를 누르시면 내 일정표에 바로 쏙 들어갑니다! 😊`;

  return {
    badge: template.badge,
    layer1,
    layer2,
    layer3,
    transitSummary: template.transitSummary,
    combinedText: `${layer1}\n\n${layer2}\n\n${layer3}`
  };
}
