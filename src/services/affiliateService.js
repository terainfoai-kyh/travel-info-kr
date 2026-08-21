/**
 * VORA AI 4.0 - Smart Affiliate Revenue Pipeline
 * Generates high-converting Klook Activities (aid=130249&af_wid=31000), Hanbok rentals, Sky Capsule tickets & Agoda Hotel deals (cid=1972217).
 */

import { buildAgodaDeepLink, buildKlookDeepLink } from './apiConfig.js';

export function getSpotAffiliateDeal(spotTitle = '', city = '서울', lang = 'ko') {
  const t = (spotTitle || '').toLowerCase();
  const c = (city || '').toLowerCase();
  const isEn = lang === 'en';

  // 1. Gyeongbokgung / Bukchon Hanok Hanbok Rental
  if (t.includes('경복궁') || t.includes('한옥') || t.includes('북촌') || t.includes('창덕궁') || t.includes('궁궐') || t.includes('gyeongbokgung') || t.includes('hanok') || t.includes('bukchon') || t.includes('palace') || t.includes('hanbok')) {
    return {
      dealTitle: isEn ? 'Hanbok Rental & Palace Snapshot 10% Off' : '한복 대여 & 궁궐 스냅 10% 특가 예약',
      dealBadge: isEn ? '👑 Hanbok Rental Deal' : '👑 한복 대여 특가',
      dealUrl: buildKlookDeepLink(isEn ? 'Seoul Hanbok Rental' : '서울 한복 대여')
    };
  }

  // 2. N Seoul Tower Observatory
  if (t.includes('타워') || t.includes('남산') || t.includes('tower') || t.includes('namsan')) {
    return {
      dealTitle: isEn ? 'N Seoul Tower Observatory Fast-Track Ticket' : 'N서울타워 전망대 패스트트랙 티켓 바로예약',
      dealBadge: isEn ? '🗼 Observatory Fast-Track' : '🗼 전망대 패스트트랙',
      dealUrl: buildKlookDeepLink(isEn ? 'N Seoul Tower Observatory' : 'N서울타워 전망대')
    };
  }

  // 3. Haeundae Blueline Park Sky Capsule
  if (t.includes('블루라인') || t.includes('스카이캡슐') || t.includes('해변열차') || t.includes('해운대') || t.includes('blueline') || t.includes('sky capsule') || t.includes('haeundae')) {
    return {
      dealTitle: isEn ? 'Haeundae Blueline Park Sky Capsule Ticket' : '해운대 블루라인파크 스카이캡슐 티켓 바로예약',
      dealBadge: isEn ? '🚊 Sky Capsule Booking' : '🚊 스카이캡슐 바로예약',
      dealUrl: buildKlookDeepLink(isEn ? 'Haeundae Blueline Park Sky Capsule' : '해운대 블루라인파크 스카이캡슐')
    };
  }

  // 4. Jeju Island Deals
  if (c.includes('제주') || c.includes('jeju') || t.includes('성산') || t.includes('협재') || t.includes('애월') || t.includes('서귀포') || t.includes('jusangjeolli') || t.includes('aewol') || t.includes('jeju') || t.includes('seogwipo') || t.includes('seongsan')) {
    return {
      dealTitle: isEn ? 'Jeju Car Rental & Popular Tours Instant Discount' : '제주도 렌터카 & 인기 액티비티 즉시 할인',
      dealBadge: isEn ? '🏝️ Jeju Car & Tour Deal' : '🏝️ 제주 렌터카/체험 특가',
      dealUrl: buildKlookDeepLink(isEn ? 'Jeju Car Rental Activities' : '제주도 렌터카 액티비티')
    };
  }

  // 5. Default Smart Deal (Agoda Hotel & Ticket Link with partner cid=1972217)
  const cleanSpot = (spotTitle || '').split('&')[0].trim() || city;
  return {
    dealTitle: isEn ? `Top 9.0+ Hotels & Activities near ${cleanSpot}` : `${cleanSpot} 주변 평점 9.0+ 호텔 & 액티비티 특가`,
    dealBadge: isEn ? '🏨 Top Hotel & Ticket Deal' : '🏨 주변 호텔/티켓 특가',
    dealUrl: buildAgodaDeepLink(cleanSpot, null, null, city)
  };
}
