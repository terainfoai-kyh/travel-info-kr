/**
 * KoreaTravel Travel Context Engine (🧩 여행 컨텍스트 엔진)
 * 
 * Aggregates real-time contextual variables:
 * - Target City & Active Day
 * - Time of day (morning, afternoon, evening, night)
 * - Weather condition (sunny, rainy, snowy, heatwave)
 * - Companions (kids, parents/elderly, couple, solo, friends)
 * - Current itinerary spots (to check proximity and avoid duplicates)
 * 
 * Provides instant contextual insights for 1:1 chat and itinerary optimization.
 */

export function buildTravelContext({
  targetCity = '서울',
  activeDay = 1,
  currentItinerary = null,
  userPrompt = '',
  weatherData = null
}) {
  const now = new Date();
  const currentHour = now.getHours();

  // 1. Time Slot Analysis
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

  // 2. Weather Context
  const isRainy = weatherData?.condition?.includes('비') || 
                  weatherData?.condition?.includes('rain') || 
                  /(비|우천|비오는|폭우|흐림)/i.test(userPrompt);

  const isHot = (weatherData?.temp && weatherData.temp >= 30) || /(더위|폭염|더운)/i.test(userPrompt);
  const isCold = (weatherData?.temp && weatherData.temp <= 0) || /(추위|한파|추운)/i.test(userPrompt);

  // 3. Companion Context
  const isKids = /(아이|아이동반|어린이|유아|아기|키즈|초등)/i.test(userPrompt);
  const isElder = /(노인|어르신|부모님|시니어|효도|할머니|할아버지)/i.test(userPrompt);
  const isCouple = /(커플|연인|데이트|로맨틱|신혼)/i.test(userPrompt);
  const isSolo = /(혼자|나홀로|솔로|1인)/i.test(userPrompt);

  // 4. Current Day Spots Extraction
  const daySchedule = currentItinerary?.dailySchedules?.find(s => s.day === activeDay);
  const existingSpots = daySchedule?.spots || [];
  const existingSpotNames = existingSpots.map(s => s.title);

  return {
    targetCity,
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
    companion: {
      isKids,
      isElder,
      isCouple,
      isSolo,
      type: isKids ? '아이 동반 가족' : isElder ? '부모님 동반' : isCouple ? '커플/데이트' : isSolo ? '나홀로 여행' : '일반'
    },
    existingSpotNames,
    totalSpotsToday: existingSpots.length
  };
}

/**
 * Generates an empathetic contextual advisor message based on the trip context
 */
export function generateContextualAdvice(context, lang = 'ko') {
  const { targetCity, activeDay, timeSlotLabel, weather, companion } = context;

  if (weather.isRainy && companion.isKids) {
    return lang === 'en'
      ? `Considering the rainy weather with kids, I recommend spacious indoor spots like aquariums and play museums in ${targetCity}! 🎈☔`
      : `현재 비 소식이 있고 아이와 함께하는 일정이니, ${targetCity}의 쾌적한 실내 아쿠아리움이나 키즈 상상나라를 추천해 드려요! 🎈☔`;
  }

  if (weather.isRainy) {
    return lang === 'en'
      ? `Since it's rainy today, I recommend comfortable indoor cultural complexes and cozy cafes in ${targetCity}! ☔☕`
      : `비 오는 날씨에 맞춰 이동이 편안한 ${targetCity}의 대형 복합문화공간과 감성 카페 위주로 안내해 드릴게요! ☔☕`;
  }

  if (companion.isKids) {
    return lang === 'en'
      ? `For a fun & safe family trip with kids, here are the top stroller-friendly spots in ${targetCity}! 🎈`
      : `아이와 함께 안전하고 편안하게 즐길 수 있는 ${targetCity}의 키즈 프렌들리 맞춤 명소예요! 🎈`;
  }

  if (companion.isElder) {
    return lang === 'en'
      ? `Here are tranquil healing gardens and authentic gourmet dining with minimal walking for your parents in ${targetCity}! 🌿`
      : `어르신과 부모님의 보행 피로를 줄이고 편안한 쉼과 정갈한 한식을 즐길 수 있는 ${targetCity} 힐링 명소예요! 🌿`;
  }

  return lang === 'en'
    ? `Here are the top curated destinations for Day ${activeDay} in ${targetCity}! ✨`
    : `${targetCity} ${activeDay}일차 ${timeSlotLabel} 일정에 딱 어울리는 보라의 큐레이션 명소예요! ✨`;
}
