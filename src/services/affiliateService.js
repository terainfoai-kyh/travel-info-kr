/**
 * VORA AI 4.0 - Smart Affiliate Revenue Pipeline
 * Generates high-converting Klook Activities (aid=130249&af_wid=31000), Hanbok rentals, Sky Capsule tickets & Agoda Hotel deals (cid=1972217).
 */

import { buildAgodaDeepLink, buildKlookDeepLink } from './apiConfig.js';

export function getSpotAffiliateDeal(spotTitle = '', city = '서울', lang = 'ko') {
  const t = (spotTitle || '').toLowerCase();
  const c = (city || '').toLowerCase();

  // 1. Gyeongbokgung / Bukchon Hanok Hanbok Rental
  if (t.includes('경복궁') || t.includes('한옥') || t.includes('북촌') || t.includes('창덕궁') || t.includes('궁궐') || t.includes('gyeongbokgung') || t.includes('hanok') || t.includes('bukchon') || t.includes('palace') || t.includes('hanbok') || t.includes('景福宮') || t.includes('韓服') || t.includes('韩服') || t.includes('景福宫') || t.includes('北村')) {
    let dealTitle = '한복 대여 & 궁궐 스냅 10% 특가 예약';
    let dealBadge = '👑 한복 대여 특가';
    if (lang === 'en') {
      dealTitle = 'Hanbok Rental & Palace Snapshot 10% Off';
      dealBadge = '👑 Hanbok Rental Deal';
    } else if (lang === 'ja') {
      dealTitle = '韓服レンタル＆宮殿スナップ 10%OFF予約';
      dealBadge = '👑 韓服レンタル特価';
    } else if (lang === 'zh' || lang === 'zht') {
      dealTitle = lang === 'zht' ? '韓服租借與宮殿寫真 9折特惠預訂' : '韩服租赁与宫殿写真 9折特惠预约';
      dealBadge = lang === 'zht' ? '👑 韓服體驗特惠' : '👑 韩服体验特惠';
    }
    return {
      dealTitle,
      dealBadge,
      dealUrl: buildKlookDeepLink(lang === 'en' ? 'Seoul Hanbok Rental' : '서울 한복 대여')
    };
  }

  // 2. N Seoul Tower Observatory
  if (t.includes('타워') || t.includes('남산') || t.includes('tower') || t.includes('namsan') || t.includes('タワー') || t.includes('南山') || t.includes('首尔塔') || t.includes('首爾塔')) {
    let dealTitle = 'N서울타워 전망대 패스트트랙 티켓 바로예약';
    let dealBadge = '🗼 전망대 패스트트랙';
    if (lang === 'en') {
      dealTitle = 'N Seoul Tower Observatory Fast-Track Ticket';
      dealBadge = '🗼 Observatory Fast-Track';
    } else if (lang === 'ja') {
      dealTitle = 'Nソウルタワー展望台 ファストトラック入場券';
      dealBadge = '🗼 展望台ファストトラック';
    } else if (lang === 'zh' || lang === 'zht') {
      dealTitle = lang === 'zht' ? 'N首爾塔觀景台 快速通行門票即時預訂' : 'N首尔塔观景台 快速通行门票即时预订';
      dealBadge = lang === 'zht' ? '🗼 觀景台快速通道' : '🗼 观景台快速通道';
    }
    return {
      dealTitle,
      dealBadge,
      dealUrl: buildKlookDeepLink(lang === 'en' ? 'N Seoul Tower Observatory' : 'N서울타워 전망대')
    };
  }

  // 3. Haeundae Blueline Park Sky Capsule
  if (t.includes('블루라인') || t.includes('스카이캡슐') || t.includes('해변열차') || t.includes('해운대') || t.includes('blueline') || t.includes('sky capsule') || t.includes('haeundae') || t.includes('スカイカプセル') || t.includes('海雲台') || t.includes('天空胶囊') || t.includes('天空膠囊') || t.includes('海云台')) {
    let dealTitle = '해운대 블루라인파크 스카이캡슐 티켓 바로예약';
    let dealBadge = '🚊 스카이캡슐 바로예약';
    if (lang === 'en') {
      dealTitle = 'Haeundae Blueline Park Sky Capsule Ticket';
      dealBadge = '🚊 Sky Capsule Booking';
    } else if (lang === 'ja') {
      dealTitle = '海雲台ブルーラインパーク スカイカプセルチケット';
      dealBadge = '🚊 スカイカプセル予約';
    } else if (lang === 'zh' || lang === 'zht') {
      dealTitle = lang === 'zht' ? '海雲台藍線公園 天空膠囊列車門票特惠' : '海云台蓝线公园 天空胶囊列车门票特惠';
      dealBadge = lang === 'zht' ? '🚊 天空膠囊即時預訂' : '🚊 天空胶囊即时预订';
    }
    return {
      dealTitle,
      dealBadge,
      dealUrl: buildKlookDeepLink(lang === 'en' ? 'Haeundae Blueline Park Sky Capsule' : '해운대 블루라인파크 스카이캡슐')
    };
  }

  // 4. Jeju Island Deals
  if (c.includes('제주') || c.includes('jeju') || c.includes('済州') || c.includes('济州') || c.includes('濟州') || t.includes('성산') || t.includes('협재') || t.includes('애월') || t.includes('서귀포') || t.includes('jusangjeolli') || t.includes('aewol') || t.includes('jeju') || t.includes('seogwipo') || t.includes('seongsan')) {
    let dealTitle = '제주도 렌터카 & 인기 액티비티 즉시 할인';
    let dealBadge = '🏝️ 제주 렌터카/체험 특가';
    if (lang === 'en') {
      dealTitle = 'Jeju Car Rental & Popular Tours Instant Discount';
      dealBadge = '🏝️ Jeju Car & Tour Deal';
    } else if (lang === 'ja') {
      dealTitle = '済州島レンタカー＆人気アクティビティ即時割引';
      dealBadge = '🏝️ 済州レンタカー/体験特価';
    } else if (lang === 'zh' || lang === 'zht') {
      dealTitle = lang === 'zht' ? '濟州島租車與熱門體驗項目即時折扣' : '济州岛租车与热门体验项目即时立减';
      dealBadge = lang === 'zht' ? '🏝️ 濟州租車/遊玩特惠' : '🏝️ 济州租车/游玩特惠';
    }
    return {
      dealTitle,
      dealBadge,
      dealUrl: buildKlookDeepLink(lang === 'en' ? 'Jeju Car Rental Activities' : '제주도 렌터카 액티비티')
    };
  }

  // 5. Default Smart Deal (Agoda Hotel & Ticket Link with partner cid=1972217)
  const cleanSpot = (spotTitle || '').split('&')[0].trim() || city;
  let dealTitle = `${cleanSpot} 주변 평점 9.0+ 호텔 & 액티비티 특가`;
  let dealBadge = '🏨 주변 호텔/티켓 특가';
  if (lang === 'en') {
    dealTitle = `Top 9.0+ Hotels & Activities near ${cleanSpot}`;
    dealBadge = '🏨 Top Hotel & Ticket Deal';
  } else if (lang === 'ja') {
    dealTitle = `${cleanSpot}周辺 高評価ホテル＆人気チケット特価`;
    dealBadge = '🏨 周辺ホテル/体験特価';
  } else if (lang === 'zh' || lang === 'zht') {
    dealTitle = lang === 'zht' ? `${cleanSpot}周邊 評分9.0+高分飯店與門票特惠` : `${cleanSpot}周边 评分9.0+高分酒店与门票特惠`;
    dealBadge = lang === 'zht' ? '🏨 周邊飯店/門票特惠' : '🏨 周边酒店/门票特惠';
  }

  return {
    dealTitle,
    dealBadge,
    dealUrl: buildAgodaDeepLink(cleanSpot, null, null, city)
  };
}
