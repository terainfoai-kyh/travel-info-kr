/**
 * KoreaTravel Travel Context Engine (VORA 지능형 여행 컨텍스트 엔진 2.0)
 * 
 * Architecture (Gemini-Distilled Autonomous Knowledge & State Manager):
 * 1. Trip Memory: Long-term trip identity (destination, days, companions, preferences)
 * 2. Current Context: Real-time runtime environment (currentCity, activeDay, timeSlot, weather)
 * 3. Gemini-Distilled Knowledge Base Integration: Uses `voraDialogKnowledge.js` for 0.01s instant wisdom
 * 4. Multi-City Advanced Routing: Supports Pattern A (도시 1일 강릉 1일), Pattern B (2일은 남해 3일은 통영), Pattern C (남해->통영->거제)
 * 5. Tiki-Taka Chit-Chat & Proactive Hooks: Resolves casual emotions, complaints, banters, and compliments instantly
 * 6. 100% Zero-Hallucination & TourAPI 4.0 Authentic Mapping
 */

import {
  CITY_LOCAL_KNOWLEDGE,
  TIKITAKA_CHITCHAT_MATRIX,
  K_FOOD_PAIRING_KNOWLEDGE,
  K_FASHION_WEATHER_GUIDE,
  FOREIGNER_ESSENTIALS_KNOWLEDGE,
  PROACTIVE_CONVERSATION_HOOKS,
  resolveTikitakaResponse,
  resolveKnowledgeScenario
} from '../data/voraDialogKnowledge.js';
import { matchVoraQna } from './voraQnaMatcher.js';

export const INITIAL_TRAVEL_STATE = {
  tripMemory: {
    destination: null,
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
    currentCity: null,
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
 * Classify user prompt into actionable intent
 */
export function classifyUserIntent(userPrompt = '', currentState = INITIAL_TRAVEL_STATE) {
  const clean = (userPrompt || '').trim().toLowerCase();

  // 1. Explicit Full Itinerary Build or Affirmative Agreement Intent (좋아, 굿, 응, 일정 짜줘 등 - 단어 경계 철저)
  const isExplicitBuild = /(전체\s*일정\s*(만들|줘|생성|보기)|일정\s*(확정|생성|생성해줘|만들어줘|짜줘|세워줘|짜봐)|일정을\s*(보여줘|만들어줘|짜줘|세워줘)|이\s*조건으로\s*전체\s*일정|바로\s*일정|일정표\s*(만들|줘|보여|생성)|완성해줘|만들어|짜줘)/i.test(clean) ||
    /(^|\s)(좋아|좋아요|굿|오케이|ok|응|네|그래|가자|콜)($|\s|[!?.~])/i.test(clean);
  if (isExplicitBuild) {
    return 'REGENERATE_ITINERARY';
  }

  // 2. Multi-City Combined Intent ("서울 1일 강릉 1일 속초 1일" or "2일은 남해 3일은 통영")
  const multiCity = parseMultiCityPrompt(userPrompt, currentState);
  if (multiCity && multiCity.isMultiCity) {
    return 'MULTI_CITY_PLAN';
  }

  // 3. Days / Duration Change Intent ("4일로 변경해줘", "2박으로 바꿔줘")
  const isDaysChange = /(\d+일|\d+박|하루|이틀|사흘|나흘).*(바꿔|변경|늘려|수정|할래|해줘)/.test(clean);
  if (isDaysChange) {
    return 'ADD_OR_PATCH_CONDITION';
  }

  // 4. Destination Switch Intent ("서울로 갈래", "부산으로 바꿔줘")
  const isDestChange = /(으?로\s*(바꿔|변경|갈래|가자|수정|할래)|가자\s*)/.test(clean) && !/(일정|코스|날짜|기간)/.test(clean);
  if (isDestChange) {
    return 'UPDATE_DESTINATION';
  }

  // 5. Off-Topic Query
  const isOffTopic = /(주식|비트코인|코인|부동산|로또|정치|축구|야구|게임|영화|음악\s*추천)/.test(clean);
  if (isOffTopic) {
    return 'OFF_TOPIC';
  }

  // 6. Tiki-Taka / Chit-Chat / Emotional / Incremental Condition
  return 'CONFIRM_OR_QUERY';
}

/**
 * Patch Travel State with incremental updates
 */
export function patchTravelState(prevState = INITIAL_TRAVEL_STATE, userPrompt = '', detectedCity = null, parsedDays = null) {
  const clean = (userPrompt || '').toLowerCase();
  const multiCity = parseMultiCityPrompt(userPrompt, prevState);
  const intent = classifyUserIntent(userPrompt, prevState);
  let hasNewCondition = false;

  const prevTrip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const prevPrefs = prevTrip.preferences || INITIAL_TRAVEL_STATE.tripMemory.preferences;
  const prevComp = prevTrip.companion || INITIAL_TRAVEL_STATE.tripMemory.companion;

  // 1. Patch Destination & Days (Multi-City aware)
  let nextDestination = prevTrip.destination || null;
  let nextDays = prevTrip.days || 3;
  let nextMultiCity = prevTrip.multiCityInfo || null;

  if (multiCity && multiCity.isMultiCity) {
    nextDestination = multiCity.combinedLabel;
    nextDays = multiCity.totalDays;
    nextMultiCity = multiCity;
    hasNewCondition = true;
  } else {
    if (detectedCity) {
      nextDestination = detectedCity;
      nextMultiCity = null;
      if (detectedCity !== prevTrip.destination) {
        hasNewCondition = true;
      }
    }
    if (parsedDays && parsedDays > 0) {
      nextDays = parsedDays;
    }
  }

  // 2. Patch Companion
  const nextComp = { ...prevComp };
  if (/(아이|애기|키즈|유모차|어린이|자녀|초등)/.test(clean)) {
    nextComp.isKids = true;
    nextComp.type = '키즈/가족';
    hasNewCondition = true;
  }
  if (/(부모님|어르신|할머니|할아버지|엄마|아빠|어머니|아버지)/.test(clean)) {
    nextComp.isElder = true;
    nextComp.type = '부모님/효도';
    hasNewCondition = true;
  }
  if (/(혼자|나홀로|솔로|혼행)/.test(clean)) {
    nextComp.isSolo = true;
    nextComp.type = '나홀로/솔로';
    hasNewCondition = true;
  }

  // 3. Patch Preferences
  const nextPrefs = { ...prevPrefs };
  if (/(덜\s*걷|안\s*걷|걷기\s*싫|다리\s*아|편하게|동선\s*짧|평지|휴식)/.test(clean)) {
    nextPrefs.isMinimalWalking = true;
    hasNewCondition = true;
  }
  if (/(배고파|맛집|미식|먹방|푸드|맛있는|식사|밥)/.test(clean)) {
    nextPrefs.isFoodie = true;
    hasNewCondition = true;
  }
  if (/(카페|디저트|베이커리|커피|빵지순례)/.test(clean)) {
    nextPrefs.isCafe = true;
    hasNewCondition = true;
  }

  // 4. Weather Override
  let nextIsRain = prevTrip.isRainPreferred;
  if (/(비|우천|비오는|폭우|실내)/.test(clean)) {
    nextIsRain = true;
    hasNewCondition = true;
  }

  // 5. Door-to-Door Gateway & Hotel Area Extraction
  let nextGateway = prevTrip.gateway || null;
  let nextHotelArea = prevTrip.hotelArea || null;

  if (/(인천공항|인천국제공항|incheon)/i.test(clean)) { nextGateway = '인천국제공항'; hasNewCondition = true; }
  else if (/(김포공항|gimpo)/i.test(clean)) { nextGateway = '김포국제공항'; hasNewCondition = true; }
  else if (/(김해공항|gimhae)/i.test(clean)) { nextGateway = '김해국제공항'; hasNewCondition = true; }
  else if (/(제주공항|jeju\s*airport)/i.test(clean)) { nextGateway = '제주국제공항'; hasNewCondition = true; }
  else if (/(서울역|ktx\s*서울)/i.test(clean)) { nextGateway = '서울역 KTX'; hasNewCondition = true; }
  else if (/(부산역|ktx\s*부산)/i.test(clean)) { nextGateway = '부산역 KTX'; hasNewCondition = true; }
  else if (/(강릉역|ktx\s*강릉)/i.test(clean)) { nextGateway = 'KTX 강릉역'; hasNewCondition = true; }
  else if (/(신경주역|경주역)/i.test(clean)) { nextGateway = '신경주역 KTX'; hasNewCondition = true; }
  else if (/(전주역)/i.test(clean)) { nextGateway = '전주역 KTX'; hasNewCondition = true; }
  else if (/(여수역|여수expo)/i.test(clean)) { nextGateway = '여수EXPO역 KTX'; hasNewCondition = true; }

  if (/(명동|종로|myeongdong)/i.test(clean)) { nextHotelArea = '명동/종로'; hasNewCondition = true; }
  else if (/(홍대|마포|hongdae)/i.test(clean)) { nextHotelArea = '홍대/마포'; hasNewCondition = true; }
  else if (/(강남|잠실|gangnam)/i.test(clean)) { nextHotelArea = '강남/잠실'; hasNewCondition = true; }
  else if (/(해운대|광안리|haeundae)/i.test(clean)) { nextHotelArea = '해운대/광안리'; hasNewCondition = true; }
  else if (/(서면|전포|seomyeon)/i.test(clean)) { nextHotelArea = '서면/전포'; hasNewCondition = true; }
  else if (/(애월|협재|한림|aewol)/i.test(clean)) { nextHotelArea = '애월/협재'; hasNewCondition = true; }
  else if (/(서귀포|중문|seogwipo)/i.test(clean)) { nextHotelArea = '서귀포/중문'; hasNewCondition = true; }
  else if (/(경포대|안목|안목해변)/i.test(clean)) { nextHotelArea = '경포대/안목'; hasNewCondition = true; }
  else if (/(황리단길|대릉원)/i.test(clean)) { nextHotelArea = '황리단길/대릉원'; hasNewCondition = true; }
  else if (/(한옥마을)/i.test(clean)) { nextHotelArea = '전주 한옥마을'; hasNewCondition = true; }

  // 6. Season Extraction
  let nextSeason = prevTrip.season || null;
  if (/(겨울|winter|동계|눈|설경)/i.test(clean)) { nextSeason = '겨울'; hasNewCondition = true; }
  else if (/(가을|autumn|fall|단풍)/i.test(clean)) { nextSeason = '가을'; hasNewCondition = true; }
  else if (/(봄|spring|벚꽃)/i.test(clean)) { nextSeason = '봄'; hasNewCondition = true; }
  else if (/(여름|summer|물놀이|해수욕|바다)/i.test(clean)) { nextSeason = '여름'; hasNewCondition = true; }

  // 7. Arrival Time Extraction (전체 24시간 및 자연어 완벽 지원)
  let nextArrivalTime = prevTrip.arrivalTime || null;
  if (/(오전|아침|morning|[6-9]시|10시|11시|12시\s*이전)/i.test(clean)) { nextArrivalTime = '오전'; hasNewCondition = true; }
  else if (/(오후|낮|afternoon|12시|13시|14시|15시|16시|17시|[1-5]시)/i.test(clean)) { nextArrivalTime = '오후'; hasNewCondition = true; }
  else if (/(저녁|밤|night|evening|18시|19시|20시|21시|22시|23시|[6-9]시\s*도착)/i.test(clean)) { nextArrivalTime = '저녁'; hasNewCondition = true; }

  return {
    ...prevState,
    tripMemory: {
      destination: nextDestination,
      days: nextDays,
      companion: nextComp,
      preferences: nextPrefs,
      isRainPreferred: nextIsRain,
      multiCityInfo: nextMultiCity,
      gateway: nextGateway,
      hotelArea: nextHotelArea,
      arrivalTime: nextArrivalTime,
      season: nextSeason
    },
    currentContext: {
      ...prevState.currentContext,
      currentCity: nextDestination,
      activeFilters: [
        nextComp.isKids && 'kids',
        nextComp.isElder && 'elder',
        nextComp.isSolo && 'solo',
        nextPrefs.isMinimalWalking && 'minimal_walking',
        nextPrefs.isFoodie && 'foodie',
        nextPrefs.isCafe && 'cafe',
        nextIsRain && 'rain'
      ].filter(Boolean)
    },
    lastIntent: intent,
    hasPendingChanges: hasNewCondition
  };
}

/**
 * Multi-City & Multi-Day Advanced Parser
 */
export function parseMultiCityPrompt(prompt = '', prevState = INITIAL_TRAVEL_STATE) {
  if (!prompt || typeof prompt !== 'string') return null;
  const clean = prompt.trim();
  
  // 1. Pattern A: [도시] [N]일/일간
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

  // 2. Pattern B: [N]일차/N일은 [도시]
  const dayCityRegex = /(\d+)\s*일\s*(차|에|에는|째|은|는)?\s*(은|는|에|에는|으로|로)?\s*(서울|수원|인천|강릉|속초|양양|부산|제주|서귀포|경주|여수|전주|대구|대전|광주|울산|가평|춘천|포항|통영|거제|남해|안동)/g;
  const dayCityMatches = [...clean.matchAll(dayCityRegex)];

  if (dayCityMatches && dayCityMatches.length >= 1) {
    const prevDestination = prevState?.tripMemory?.destination || prevState?.currentContext?.currentCity || '남해';
    const baseCity = prevDestination.split('·')[0] || '남해';
    const dayMap = {};
    let maxDay = prevState?.tripMemory?.days || 3;

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

  // 3. Pattern C: Arrow or Separator Sequence
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
 * Context Chip Helpers
 */
export function toggleContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const trip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const comp = { ...(trip.companion || {}) };
  const prefs = { ...(trip.preferences || {}) };
  let isRain = trip.isRainPreferred;

  if (chipId === 'kids') comp.isKids = !comp.isKids;
  if (chipId === 'elder') comp.isElder = !comp.isElder;
  if (chipId === 'couple') comp.isCouple = !comp.isCouple;
  if (chipId === 'solo') comp.isSolo = !comp.isSolo;
  if (chipId === 'rain') isRain = !isRain;
  if (chipId === 'minimal_walking') prefs.isMinimalWalking = !prefs.isMinimalWalking;
  if (chipId === 'cafe') prefs.isCafe = !prefs.isCafe;
  if (chipId === 'foodie') prefs.isFoodie = !prefs.isFoodie;
  if (chipId === 'photo') prefs.isPhoto = !prefs.isPhoto;

  return {
    ...prevState,
    tripMemory: {
      ...trip,
      companion: comp,
      preferences: prefs,
      isRainPreferred: isRain
    }
  };
}

export function removeContextChip(prevState = INITIAL_TRAVEL_STATE, chipId = '') {
  const trip = prevState.tripMemory || INITIAL_TRAVEL_STATE.tripMemory;
  const comp = { ...(trip.companion || {}) };
  const prefs = { ...(trip.preferences || {}) };
  let isRain = trip.isRainPreferred;

  if (chipId === 'kids') comp.isKids = false;
  if (chipId === 'elder') {
    comp.isElder = false;
    prefs.isMinimalWalking = false;
  }
  if (chipId === 'couple') comp.isCouple = false;
  if (chipId === 'solo') comp.isSolo = false;
  if (chipId === 'rain') isRain = false;
  if (chipId === 'minimal_walking') prefs.isMinimalWalking = false;
  if (chipId === 'cafe') prefs.isCafe = false;
  if (chipId === 'foodie') prefs.isFoodie = false;
  if (chipId === 'photo') prefs.isPhoto = false;

  return {
    ...prevState,
    tripMemory: {
      ...trip,
      companion: comp,
      preferences: prefs,
      isRainPreferred: isRain
    }
  };
}

export function getActiveContextChips(travelState = INITIAL_TRAVEL_STATE, lang = 'ko') {
  const chips = [];
  const trip = travelState.tripMemory || travelState;
  const comp = trip.companion || {};
  const prefs = trip.preferences || {};

  if (comp.isKids) chips.push({ id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 With Kids' : '👨‍👩‍👧 아이 동반', color: '#ec4899' });
  if (comp.isElder) chips.push({ id: 'elder', label: lang === 'en' ? '🌿 With Parents' : '🌿 부모님 동반', color: '#10b981' });
  if (comp.isCouple) chips.push({ id: 'couple', label: lang === 'en' ? '💖 Couple' : '💖 커플/데이트', color: '#f43f5e' });
  if (comp.isSolo) chips.push({ id: 'solo', label: lang === 'en' ? '🍃 Solo Trip' : '🍃 나홀로 여행', color: '#06b6d4' });

  if (trip.isRainPreferred || travelState.isRainQuery) chips.push({ id: 'rain', label: lang === 'en' ? '☔ Rainy/Indoor' : '☔ 비/실내 선호', color: '#3b82f6' });
  if (prefs.isMinimalWalking) chips.push({ id: 'minimal_walking', label: lang === 'en' ? '🚶 Minimal Walking' : '🚶 걷기 적게', color: '#8b5cf6' });
  if (prefs.isCafe) chips.push({ id: 'cafe', label: lang === 'en' ? '☕ Cafe Tour' : '☕ 감성 카페', color: '#f59e0b' });
  if (prefs.isFoodie) chips.push({ id: 'foodie', label: lang === 'en' ? '🍴 Gourmet Food' : '🍴 로컬 맛집', color: '#ef4444' });
  if (prefs.isPhoto) chips.push({ id: 'photo', label: lang === 'en' ? '📸 Photo Spots' : '📸 인생샷/뷰', color: '#14b8a6' });

  return chips;
}

/**
 * Builds real-time runtime context snapshot
 */
export function buildTravelContext({
  targetCity = '서울',
  activeDay = 1,
  currentItinerary = null,
  userPrompt = '',
  weatherData = null,
  sessionState = INITIAL_TRAVEL_STATE
}) {
  const now = new Date();
  const currentHour = now.getHours();

  let timeSlot = 'afternoon';
  let timeSlotLabel = '오후';
  if (currentHour >= 6 && currentHour < 11) {
    timeSlot = 'morning';
    timeSlotLabel = '오전';
  } else if (currentHour >= 11 && currentHour < 14) {
    timeSlot = 'lunch';
    timeSlotLabel = '점심';
  } else if (currentHour >= 14 && currentHour < 17) {
    timeSlot = 'afternoon';
    timeSlotLabel = '오후';
  } else if (currentHour >= 17 && currentHour < 21) {
    timeSlot = 'dinner';
    timeSlotLabel = '저녁';
  } else {
    timeSlot = 'night';
    timeSlotLabel = '야간';
  }

  const trip = sessionState.tripMemory || sessionState;
  const isRainy = weatherData?.condition?.includes('비') || 
                  weatherData?.condition?.includes('rain') || 
                  /(비|우천|비오는|폭우|실내)/i.test(userPrompt) ||
                  trip.isRainPreferred ||
                  sessionState.isRainQuery;

  const isHot = (weatherData?.temp && weatherData.temp >= 30) || /(더위|폭염|더운)/i.test(userPrompt);
  const isCold = (weatherData?.temp && weatherData.temp <= 0) || /(추위|한파|추운)/i.test(userPrompt);

  const companion = trip.companion || { isKids: false, isElder: false, isCouple: false, isSolo: false, type: '일반' };
  const preferences = trip.preferences || {};

  const daySchedule = currentItinerary?.dailySchedules?.find(s => s.day === activeDay);
  const existingSpots = daySchedule?.spots || [];
  const existingSpotNames = existingSpots.map(s => s.title || s.name || '');

  return {
    targetCity: targetCity || trip.destination || '서울',
    activeDay,
    currentTime: `${String(currentHour).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    timeSlot,
    timeSlotLabel,
    weather: {
      isRainy,
      isHot,
      isCold,
      summary: isRainy ? '우천 (실내 추천)' : isHot ? '폭염 (실내/카페 추천)' : isCold ? '한파 (따뜻한 실내 추천)' : '쾌적'
    },
    companion,
    preferences,
    existingSpotNames,
    totalSpotsToday: existingSpots.length,
    hasNewCondition: sessionState.hasNewCondition,
    userPrompt: userPrompt || sessionState.lastUpdatedPrompt || '',
    multiCity: sessionState.multiCity || trip.multiCityInfo,
    tripMemory: trip
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
 * Gemini-Distilled 0.01s Instant Layered Advice & Tiki-Taka Generator
 * Returns string directly for seamless rendering in chat stream.
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const cleanPrompt = (context.userPrompt || context.lastUpdatedPrompt || '').trim();
  const targetCity = context.targetCity || context.currentContext?.currentCity || context.tripMemory?.destination || null;
  const displayCity = targetCity || (lang === 'en' ? 'Korea' : '대한민국');
  const activeDay = context.activeDay || context.currentContext?.activeDay || 1;
  const timeSlotLabel = context.timeSlotLabel || context.currentContext?.timeSlotLabel || '점심';
  const multiCity = context.multiCity;
  const cityInfo = CITY_LOCAL_KNOWLEDGE[targetCity] || CITY_LOCAL_KNOWLEDGE['서울'];
  const seasonMatch = cleanPrompt.match(/(겨울|가을|봄|여름|[0-9]+월)/);
  let season = context.tripMemory?.season || null;
  if (seasonMatch) {
    const raw = seasonMatch[1];
    if (raw === '12월' || raw === '1월' || raw === '2월' || raw === '겨울') season = '겨울';
    else if (raw === '9월' || raw === '10월' || raw === '11월' || raw === '가을') season = '가을';
    else if (raw === '3월' || raw === '4월' || raw === '5월' || raw === '봄') season = '봄';
    else if (raw === '6월' || raw === '7월' || raw === '8월' || raw === '여름') season = '여름';
  }

  // 1. Primary High-Speed Q&A Knowledge Vault Matcher (Golden Distilled AI Intelligence)
  const qnaMatch = matchVoraQna(cleanPrompt, targetCity, context, lang);
  if (qnaMatch) {
    if (qnaMatch.followUp) {
      return `${qnaMatch.reply}\n\n👉 **${qnaMatch.followUp}**`;
    }
    return qnaMatch.reply;
  }

  // 1-1. Secondary Legacy Tiki-Taka Matrix Matcher (Fallback)
  const tikitaka = resolveTikitakaResponse(cleanPrompt, displayCity, season);
  if (tikitaka) {
    return `${tikitaka.reply}\n\n👉 **${tikitaka.followUp}**`;
  }

  // 2. Door-to-Door Interactive Flow Check (공항/숙소/도착시간/계절 연계)
  const isGatewayOrHotelMentioned = /(공항|ktx|터미널|강남|명동|홍대|해운대|서면|애월|서귀포|바람의언덕|매미성)/i.test(cleanPrompt) || Boolean(context.tripMemory?.gateway || context.tripMemory?.hotelArea);
  const isTimeMentioned = /(오전|오후|저녁|밤|도착|[0-9]+시)/i.test(cleanPrompt) || Boolean(context.tripMemory?.arrivalTime);

  // 2-1. Season / Month specified without gateway/time/hotel
  const isSeasonOrMonthOnly = /(겨울|가을|봄|여름|[0-9]+월)/.test(cleanPrompt) && !isGatewayOrHotelMentioned && !isTimeMentioned && !/(복장|뭐\s*입|뭘\s*입|옷|패션|코디)/.test(cleanPrompt);
  if (isSeasonOrMonthOnly) {
    const seasonName = season || '가을';
    const targetLabel = targetCity ? `${targetCity}` : '대한민국';
    return (lang === 'en')
      ? `Wonderful choice for a **${seasonName}** trip to **${targetLabel}**! 🍁 What time do you arrive, and where is your hotel? 😊`
      : `운치 있는 **${seasonName}철 ${targetLabel}** 여행이시군요! 🍁 혹시 몇 시쯤 어디(공항/터미널/KTX역)로 도착하시고 숙소는 어디쯤이신가요? ✈️🏨`;
  }

  if (isGatewayOrHotelMentioned && !context.tripMemory?.arrivalTime && !isTimeMentioned) {
    const gw = context.tripMemory?.gateway || '공항/역';
    const hotel = context.tripMemory?.hotelArea || '호텔';
    const targetLabel = targetCity ? `${targetCity} 여행` : '한국 여행';
    return (lang === 'en')
      ? `${targetLabel}: Arrival via **${gw}** & luggage drop at **${hotel} stay**! ✈️🏨\n\nAround what time do you arrive in Korea? 😊`
      : `${targetLabel}을 위해 **${gw}** 도착 후 **${hotel}** 짐 보관(Luggage Drop) 코스로 잡아드릴게요! ✈️🏨\n\n한국에는 대략 몇 시쯤 도착하시나요? 😊`;
  }

  if (isTimeMentioned || (isGatewayOrHotelMentioned && context.tripMemory?.arrivalTime)) {
    const arrTime = context.tripMemory?.arrivalTime || '오후';
    const hotel = context.tripMemory?.hotelArea || (targetCity ? `${targetCity} 숙소` : '숙소');
    const gw = context.tripMemory?.gateway || (targetCity === '거제' ? '거제터미널' : targetCity === '부산' ? '김해공항' : targetCity === '제주' ? '제주공항' : '인천국제공항');
    const seasonPrefix = season ? `${season}철 ` : '';

    const cityLabel = targetCity || '한국';
    if (arrTime === '오전') {
      return (lang === 'en')
        ? `${seasonPrefix}Morning arrival: **${gw}** ➔ **${hotel}** luggage drop ➔ **[${cityLabel} signature landmarks & local lunch]** course. Shall I prepare this itinerary for you? 👑✨`
        : `${seasonPrefix}**${gw}** ➔ **${hotel}** 짐 보관 후 **[${cityLabel} 대표 명소 & 로컬 미식]** 산뜻한 오후 코스로 잡아드릴까요? 👑✨`;
    } else if (arrTime === '저녁') {
      return (lang === 'en')
        ? `${seasonPrefix}Evening arrival: Check-in at **${hotel}** ➔ **[${cityLabel} romantic night view & dinner]** course. Shall I prepare this itinerary for you? 🗼✨`
        : `${seasonPrefix}**${gw}** ➔ **${hotel}** 체크인 후 **[${cityLabel} 로맨틱 야경 & 제철 미식 만찬]** 코스로 잡아드릴까요? 🗼✨`;
    } else {
      return (lang === 'en')
        ? `${seasonPrefix}Afternoon arrival: **${gw}** ➔ **${hotel}** luggage drop ➔ **[${cityLabel} highlight afternoon stroll]** course. Shall I prepare this itinerary for you? 🧳✨`
        : `${seasonPrefix}**${gw}** ➔ **${hotel}** 짐 보관 후 **[${cityLabel} 핵심 힐링 & 오후 티타임]** 코스로 딱 잡아드릴까요? 🧳✨`;
    }
  }

  // 3. Prompt-Specific Scenario Matching (Only triggers when the CURRENT prompt explicitly asks for it!)
  const isPromptKids = /(아이|애기|키즈|유모차|어린이|자녀|초등)/i.test(cleanPrompt);
  const isPromptElder = /(부모님|어르신|할머니|할아버지|엄마|아빠|시니어)/i.test(cleanPrompt);
  const isPromptRain = /(비|우천|비오|폭우|실내|비오는)/i.test(cleanPrompt);
  const isPromptWalking = /(덜\s*걷|안\s*걷|다리\s*아|편안|무릎|걷기\s*싫)/i.test(cleanPrompt);
  const isPromptSolo = /(혼자|나홀로|솔로|혼행)/i.test(cleanPrompt);
  const isPromptFoodie = /(배고파|맛집|미식|먹방|식사|밥|뭐\s*먹)/i.test(cleanPrompt);

  if (multiCity && multiCity.isMultiCity) {
    return (lang === 'en')
      ? `Shall I craft a seamless multi-city itinerary for **[${multiCity.combinedLabel}] ${multiCity.totalDays} Days**? 🚅✨`
      : `**[${multiCity.combinedLabel}] ${multiCity.totalDays}일 연계 코스**를 광역 교통 최적 동선으로 시원하게 잡아드릴까요? 🚅✨`;
  }
  if (isPromptKids) {
    return (lang === 'en')
      ? `Shall I tailor a stroller-friendly itinerary featuring hands-on interactive experiences, aquariums & spacious parks for kids? 👨‍👩‍👧‍👦🎈`
      : `아이와 함께 편하게 이동할 수 있는 **오감 체험·아쿠아리움·넓은 잔디마당** 중심의 안심 코스로 잡아드릴까요? 👨‍👩‍👧‍👦🎈`;
  }
  if (isPromptElder || isPromptWalking) {
    return (lang === 'en')
      ? `Shall I prepare a gentle, step-free itinerary focusing on scenic cable cars, flat walking trails & panoramic cafes? 😊🌿`
      : `부모님과 함께 계단 없이 편안한 **케이블카·평지 산책로·전망 카페** 위주 안심 코스로 잡아드릴까요? 😊🌿`;
  }
  if (isPromptRain) {
    return (lang === 'en')
      ? `Shall I craft an indoor itinerary with mesmerizing media art, indoor aquariums & ocean-view cafes? ☔☕✨`
      : `비 한 방울 안 맞는 **환상적인 몰입형 미디어아트 & 실내 수족관·오션뷰 카페** 코스로 잡아드릴까요? ☔☕✨`;
  }
  if (isPromptSolo) {
    return (lang === 'en')
      ? `Shall I design a peaceful solo journey with tranquil walking paths, indie bookstores & cozy cafes? 🎧🌿`
      : `혼자만의 여유로운 사색을 위한 **고즈넉한 산책길 & 감성 독립서점·힐링 카페** 코스로 잡아드릴까요? 🎧🌿`;
  }
  if (isPromptFoodie) {
    return (lang === 'en')
      ? `Shall I tailor a delicious local foodie trail with authentic, highly-rated local restaurants? 🍴🤤`
      : `현지인들이 줄 서는 **착한 가격의 찐 맛집 & 로컬 미식 투어** 코스로 맞춰드릴까요? 🍴🤤`;
  }

  // 4. 오타, 모호한 문장, 미인식 입력 시 센스 있는 지능형 재질문 (절대 이전 상태를 앵무새처럼 반복하지 않음!)
  if (targetCity) {
    return (lang === 'en')
      ? `Could you tell me a little more detail so I can tailor your **${targetCity}** itinerary perfectly? 😊 (e.g. cafe tour, local foodie, relaxing course)`
      : `말씀해 주신 내용을 조금만 더 자세히 알려주시면 **${targetCity}** 일정에 쏙 반영해 드릴게요! 😊 (예: 2일차 맛집, 감성 카페, 덜 걷는 힐링 코스 등)`;
  }

  return (lang === 'en')
    ? `Could you tell me which city in Korea (Seoul, Busan, Jeju, Geoje, Suwon, Changwon, Gangneung, etc.) you'd like to visit, or what you're curious about? 🌸✨`
    : `말씀해 주신 내용을 조금만 더 자세히 알려주실 수 있나요? 🥺 가고 싶으신 도시(서울, 부산, 제주, 거제, 수원, 창원, 강릉 등)나 궁금하신 점을 편하게 말씀해 주세요! 🌸✨`;
}
