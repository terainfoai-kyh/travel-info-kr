/**
 * VORA Q&A Question Filter & Sanitizer Utility
 * 
 * 🛡️ 단순 코스 생성 버튼 클릭 및 시스템 액션 지시어 필터링 (미답변 큐 적재 100% 원천 차단)
 */

export function isSystemActionOrCourseDirective(rawStr) {
  if (!rawStr || typeof rawStr !== 'string') return true;
  const clean = rawStr.trim();
  if (clean.length < 2) return true;

  // 1. 코스/일정 생성 및 조율 지시어 (e.g. "강릉 3일 코스 만들기", "서울 2박3일 일정 짜줘", "코스 만들기 🚀")
  const isCourseAction = /(코스\s*(만들기|짜줘|생성|설계|추천|보기|완성|잡아줘|세워줘|짜|뽑아줘)|일정\s*(만들기|짜줘|생성|설계|추천|보기|완성|세워줘|뽑아줘|변경|수정|조율)|일정표\s*(만들기|보기|완성)?|여행\s*(코스|일정|계획)|루트\s*(짜줘|추천|만들기)|create.*plan|build.*itinerary|make.*course|generate.*itinerary|start.*plan|plan.*trip|コース作成|日程作成|行程)/i.test(clean);

  // 2. [지역명] [N]일 [코스/일정/여행/투어] 패턴 (e.g. "강릉 3일", "서울 2박3일 코스", "제주 당일치기")
  const isCityDaysPattern = /^[가-힣a-zA-Z\s]+\s*\d+\s*(일|박|박\s*\d+일|days?|d)?\s*(코스|일정|여행|투어|plan|course)?\s*(만들기|짜줘|생성|추천|시작|가자|해줘|잡아줘)?$/i.test(clean);

  // 3. 버튼 칩 프리픽스 또는 이모지 포함 액션
  const isButtonChip = /^(📷|📍|✨|🚀|🍴|☔|🚶|👨‍👩‍👧|☕|🌅|🏙️|🏮|🏨|🌊|🏖️|🏢|👑|💡|🗓️)/.test(clean) || /(코스\s*만들기|일정\s*만들기)/i.test(clean);

  // 4. 단순 단편어/도시명 단독/기간 단독/동행 단독/수락어/시간 지시어/제외 지시어
  const isSimpleCityOnly = /^(서울|부산|제주|경주|강릉|수원|인천|전주|여수|대구|대전|광주|포항|통영|거제|춘천|속초|안동|한국|korea|seoul|busan|jeju)(\s*로|\s*에|\s*가자|\s*갈래|\s*여행)?$/i.test(clean);
  const isSimpleDuration = /^(\d+\s*일|\d+\s*박\s*\d+\s*일|\d+\s*박|당일치기|하루|이틀|사흘|\d+\s*days?)$/i.test(clean);
  const isSimpleCompanion = /^(혼자|커플|가족|친구|아이|부모님|아이\s*동반|부모님\s*동반|아이랑|부모님이랑|친구랑|연인이랑)$/i.test(clean);
  const isSimpleActionOrAccept = /^(짜줘|맞춰줘|해줘|잡아줘|추천해줘|추천|만들어줘|일정\s*생성|생성해줘|설계해줘|준비해줘|정해줘|응|어|네|예|좋아|좋아요|오케이|ok|콜|그래|부탁해|이대로|시작|가자|가보자|바로\s*일정\s*만들기|바로\s*짜줘|일정표\s*만들기)$/i.test(clean);
  const isSimpleThemeOnly = /^(맛집|카페|관광지|쇼핑|자연|야경|힐링|인생샷|핫플레이스|핫플|덜\s*걷기|걷기\s*적게|비\/실내|실내|비오는날|아이\s*동반|로컬\s*맛집|야경\s*맛집(\s*추천)?|감성\s*카페(\s*투어)?|인생샷\s*핫플레이스|대표\s*맛집\s*&\s*카페|인기\s*호텔\/숙소|전통\s*한옥\s*스테이|가성비\s*인기\s*호텔|오션뷰\s*감성\s*펜션)$/i.test(clean);
  const isArrivalTimeDirective = /(\d{1,2}:\d{2}|오전\s*도착|오후\s*도착|도착\s*\()/i.test(clean);
  const isExclusionDirective = /(빼줘|빼주세요|제외해줘|제외|없애줘|삭제해줘|빼|지워줘)/i.test(clean);

  return isCourseAction || isCityDaysPattern || isButtonChip || isSimpleCityOnly || isSimpleDuration || isSimpleCompanion || isSimpleActionOrAccept || isSimpleThemeOnly || isArrivalTimeDirective || isExclusionDirective;
}
