/**
 * VORA AI 4.0 - Smart Affiliate Revenue Pipeline
 * Generates high-converting Klook Activities, Hanbok rentals, Sky Capsule tickets & Agoda Hotel deals.
 */

export function getSpotAffiliateDeal(spotTitle = '', city = '서울') {
  const t = (spotTitle || '').toLowerCase();
  const c = (city || '').toLowerCase();

  // 1. Gyeongbokgung / Hanok Hanbok Rental
  if (t.includes('경복궁') || t.includes('한옥') || t.includes('창덕궁') || t.includes('궁궐')) {
    return {
      dealTitle: '한복 대여 & 궁궐 스냅 10% 특가 예약',
      dealBadge: '👑 한복 대여 특가',
      dealUrl: 'https://www.klook.com/ko/search?query=%EC%84%9C%EC%9A%B8%20%ED%95%9C%EB%B3%B5%20%EB%8C%80%EC%97%AC'
    };
  }

  // 2. N Seoul Tower Observatory
  if (t.includes('타워') || t.includes('남산')) {
    return {
      dealTitle: 'N서울타워 전망대 패스트트랙 티켓 바로예약',
      dealBadge: '🗼 전망대 패스트트랙',
      dealUrl: 'https://www.klook.com/ko/search?query=N%EC%84%9C%EC%9A%B8%ED%83%80%EC%9B%8C'
    };
  }

  // 3. Haeundae Blueline Park Sky Capsule
  if (t.includes('블루라인') || t.includes('스카이캡슐') || t.includes('해변열차') || t.includes('해운대')) {
    return {
      dealTitle: '해운대 블루라인파크 스카이캡슐 티켓 바로예약',
      dealBadge: '🚊 스카이캡슐 바로예약',
      dealUrl: 'https://www.klook.com/ko/search?query=%EB%B8%94%EB%A3%A8%EB%9D%BC%EC%9D%B8%ED%8C%8C%ED%81%AC'
    };
  }

  // 4. Jeju Island Deals
  if (c.includes('제주') || t.includes('성산') || t.includes('협재') || t.includes('애월') || t.includes('서귀포')) {
    return {
      dealTitle: '제주도 렌터카 & 인기 액티비티 즉시 할인',
      dealBadge: '🏝️ 제주 렌터카/체험 특가',
      dealUrl: 'https://www.klook.com/ko/search?query=%EC%A0%9C%EC%A3%BC%EB%8F%84%20%EC%95%A1%ED%8B%B0%EB%B9%84%ED%8B%B0'
    };
  }

  // 5. Default Smart Deal (Agoda Hotel & Ticket Link)
  return {
    dealTitle: `${spotTitle || city} 주변 평점 9.0+ 호텔 & 액티비티 특가`,
    dealBadge: '🏨 주변 호텔/티켓 특가',
    dealUrl: `https://www.agoda.com/search?text=${encodeURIComponent(spotTitle || city)}`
  };
}
