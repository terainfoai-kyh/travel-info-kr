/**
 * KoreaTravel Verified POI (Point of Interest) Database
 * 
 * - Standardized display titles (cleaned from raw TourAPI titles)
 * - Official TourAPI 4.0 Verified CDN Images & Coordinates
 * - Curated tags, average visit duration, and themes
 * - 0-Token Instant Semantic Matching (< 0.01s)
 */

export const KOREA_TRAVEL_POI_DB = [
  // ==========================================
  // 1. 강원도 (강릉, 속초, 양양, 평창)
  // ==========================================
  {
    id: 'kt_gw_anmok',
    title: '안목해변 커피거리',
    region: '강원',
    city: '강릉',
    category: '바다',
    theme: '카페/바다',
    duration: 90,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/46/2607546_image2_1.jpg',
    lat: 37.7718,
    lng: 128.9482,
    tags: ['바다', '카페거리', '커플', '일출', '오션뷰'],
    summary: '동해의 푸른 바다를 파노라마로 감상하며 스페셜티 커피를 즐기는 강릉 최고의 감성 핫플'
  },
  {
    id: 'kt_gw_gyeongpo',
    title: '경포해변 & 경포호수',
    region: '강원',
    city: '강릉',
    category: '바다',
    theme: '자연/명소',
    duration: 100,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/38/2607538_image2_1.jpg',
    lat: 37.8055,
    lng: 128.9080,
    tags: ['바다', '산책', '자전거', '피크닉', '가족'],
    summary: '끝없이 펼쳐진 백사장과 울창한 해송 숲, 자전거 드라이브가 낭만적인 동해안 대표 해변'
  },
  {
    id: 'kt_gw_surfyy',
    title: '양양 서피비치',
    region: '강원',
    city: '양양',
    category: '바다',
    theme: '핫플/서핑',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/66/2784566_image2_1.jpg',
    lat: 38.0286,
    lng: 128.7176,
    tags: ['바다', '서핑', '이국적', '선셋바', 'MZ핫플'],
    summary: '이국적인 트로피컬 감성의 비치 바와 서핑 전용 해변으로 젊음의 열기가 가득한 성지'
  },
  {
    id: 'kt_gw_yeonggeumjeong',
    title: '속초 영금정',
    region: '강원',
    city: '속초',
    category: '바다',
    theme: '전망/명소',
    duration: 60,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/71/2607571_image2_1.jpg',
    lat: 38.2118,
    lng: 128.6015,
    tags: ['바다', '일출', '해상정자', '인생샷', '동해'],
    summary: '바위에 부딪히는 거문고 소리 같은 파도와 동해 바다 한가운데 정자가 선사하는 절경'
  },
  {
    id: 'kt_gw_abai',
    title: '속초 아바이마을 & 갯배',
    region: '강원',
    city: '속초',
    category: '맛집',
    theme: '로컬/미식',
    duration: 80,
    rating: 4.7,
    image: 'http://tong.visitkorea.or.kr/cms/resource/63/2607563_image2_1.jpg',
    lat: 38.2045,
    lng: 128.5925,
    tags: ['미식', '오징어순대', '갯배체험', '로컬', '아이동반'],
    summary: '손으로 끄는 무동력 갯배 체험과 고소한 오징어순대, 아바이순대를 맛보는 실향민 마을'
  },

  // ==========================================
  // 2. 키즈 & 아이동반 전용 (서울/수도권)
  // ==========================================
  {
    id: 'kt_kids_lotte_aquarium',
    title: '롯데월드 아쿠아리움',
    region: '서울',
    city: '서울',
    category: '키즈',
    theme: '실내/키즈/체험',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/67/2618967_image2_1.jpg',
    lat: 37.5133,
    lng: 127.1042,
    tags: ['아이동반', '키즈', '실내', '아쿠아리움', '벨루가', '비오는날'],
    summary: '귀여운 벨루가와 바다사자, 650종 5만여 마리의 해양생물이 반겨주는 도심 속 바다 세상'
  },
  {
    id: 'kt_kids_grandpark',
    title: '서울어린이대공원 & 상상나라',
    region: '서울',
    city: '서울',
    category: '키즈',
    theme: '자연/동물원/놀이터',
    duration: 150,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/35/2618935_image2_1.jpg',
    lat: 37.5480,
    lng: 127.0817,
    tags: ['아이동반', '키즈', '동물원', '어린이상상나라', '놀이터', '피크닉'],
    summary: '무료 동물원과 식물원, 오감 체험형 실내 상상나라 박물관이 어우러진 어린이 천국'
  },
  {
    id: 'kt_kids_lotteworld',
    title: '롯데월드 어드벤처',
    region: '서울',
    city: '서울',
    category: '키즈',
    theme: '테마파크/실내',
    duration: 240,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/54/2618954_image2_1.jpg',
    lat: 37.5111,
    lng: 127.0982,
    tags: ['아이동반', '키즈', '테마파크', '실내놀이', '퍼레이드', '비오는날'],
    summary: '세계 최대 규모의 실내 테마파크 어드벤처와 화려한 매직캐슬, 환상적인 야간 퍼레이드'
  },

  // ==========================================
  // 3. 비오는 날 & 실내 핫플 (서울/수도권)
  // ==========================================
  {
    id: 'kt_indoor_coex',
    title: '코엑스 별마당도서관 & 아쿠아리움',
    region: '서울',
    city: '서울',
    category: '실내',
    theme: '실내/복합문화',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/88/2618988_image2_1.jpg',
    lat: 37.5118,
    lng: 127.0592,
    tags: ['실내', '비오는날', '별마당도서관', '쇼핑', '인생샷', '데이트'],
    summary: '13m 높이의 웅장한 서가와 7만여 권의 책이 선사하는 문화 공간이자 비 오는 날 최적의 실내 명소'
  },
  {
    id: 'kt_indoor_thehyundai',
    title: '더현대 서울 & 사운즈 포레스트',
    region: '서울',
    city: '서울',
    category: '실내',
    theme: '쇼핑/카페/실내정원',
    duration: 150,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/02/2784502_image2_1.jpg',
    lat: 37.5259,
    lng: 126.9284,
    tags: ['실내', '비오는날', '팝업스토어', '미식', '실내정원', 'MZ핫플'],
    summary: '도심 속 거대한 실내 온실 정원과 전 세계 트렌디 팝업스토어, 지하 글로벌 미식관'
  },
  {
    id: 'kt_indoor_museum',
    title: '국립중앙박물관 & 거울못',
    region: '서울',
    city: '서울',
    category: '실내',
    theme: '문화/역사/실내',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/11/2619011_image2_1.jpg',
    lat: 37.5240,
    lng: 126.9803,
    tags: ['실내', '비오는날', '사유의방', '국보', '박물관', '힐링'],
    summary: '반가사유상이 빛나는 ‘사유의 방’과 찬란한 대한민국의 국보급 문화유산을 만나는 힐링 실내 공간'
  },
  {
    id: 'kt_indoor_ddp',
    title: 'DDP 동대문디자인플라자 실내 전시',
    region: '서울',
    city: '서울',
    category: '실내',
    theme: '건축/디자인/전시',
    duration: 90,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/18/2650018_image2_1.jpg',
    lat: 37.5665,
    lng: 127.0092,
    tags: ['실내', '비오는날', '건축명소', '전시회', '디자인랩'],
    summary: '자하 하디드의 미래지향적 곡선 건축물 속 다채로운 글로벌 디자인 전시와 라이프스타일 숍'
  },

  // ==========================================
  // 4. 서울 대표 하이라이트 (성수, 종로, 한남, 홍대)
  // ==========================================
  {
    id: 'kt_seoul_gyeongbok',
    title: '경복궁 & 국립고궁박물관',
    region: '서울',
    city: '서울',
    category: '명소',
    theme: '역사/헤리티지',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/23/2678623_image2_1.jpg',
    lat: 37.5796,
    lng: 126.9770,
    tags: ['한옥', '궁궐', '한복체험', 'K-헤리티지', '대표명소'],
    summary: '조선 왕실의 정취가 살아 숨 쉬는 대한민국 제1의 법궁과 근정전의 웅장한 아름다움'
  },
  {
    id: 'kt_seoul_seongsu',
    title: '성수동 카페거리 & 연무장길',
    region: '서울',
    city: '서울',
    category: '핫플',
    theme: '카페/쇼핑',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/78/2650078_image2_1.jpg',
    lat: 37.5445,
    lng: 127.0560,
    tags: ['카페', '팝업스토어', 'MZ핫플', '쇼핑', '데이트'],
    summary: '붉은 벽돌 공장과 트렌디한 디자이너 팝업, 감성 브루잉 카페가 공존하는 한국의 브루클린'
  },
  {
    id: 'kt_seoul_bukchon',
    title: '북촌한옥마을 & 삼청동길',
    region: '서울',
    city: '서울',
    category: '명소',
    theme: '전통/골목',
    duration: 90,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/03/2650003_image2_1.jpg',
    lat: 37.5826,
    lng: 126.9837,
    tags: ['한옥', '골목길', '전통공예', '갤러리', '커플'],
    summary: '도심 속 고즈넉한 기와지붕 골목길과 한옥 갤러리, 삼청동의 감성 공방 투어'
  },

  // ==========================================
  // 5. 부산 대표 하이라이트
  // ==========================================
  {
    id: 'kt_bs_gwangan',
    title: '광안리해수욕장 & 민락더마켓',
    region: '부산',
    city: '부산',
    category: '바다',
    theme: '야경/바다',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/28/2650128_image2_1.jpg',
    lat: 35.1532,
    lng: 129.1186,
    tags: ['바다', '광안대교야경', '드론쇼', '오션뷰카페', '데이트'],
    summary: '광안대교의 찬란한 LED 라이트와 드론 라이트쇼, 트렌디한 복합문화마켓의 오션뷰'
  },
  {
    id: 'kt_bs_skycapsule',
    title: '해운대 블루라인파크 스카이캡슐',
    region: '부산',
    city: '부산',
    category: '명소',
    theme: '액티비티/전망',
    duration: 90,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/82/2784582_image2_1.jpg',
    lat: 35.1587,
    lng: 129.1724,
    tags: ['스카이캡슐', '오션뷰열차', '인생샷', '해안절벽', '아이동반'],
    summary: '동해남부선 폐선 부지 해안 절벽 위를 달리는 알록달록 공중 캡슐 열차'
  }
];

/**
 * Fast 0-Token Semantic Matcher for recommended POIs
 */
export function findRecommendedPois(query = '', targetRegion = '', limit = 3) {
  if (!query && !targetRegion) {
    return KOREA_TRAVEL_POI_DB.slice(0, limit);
  }

  const clean = (query || '').toLowerCase().replace(/[\s\-_]/g, '');
  const regionClean = (targetRegion || '').toLowerCase();

  const isKidsQuery = /(아이|키즈|어린이|유아|아기|가족|초등)/i.test(clean);
  const isIndoorQuery = /(실내|비|우천|비오는|더위|추위)/i.test(clean);
  const isSeaQuery = /(바다|해변|오션|해수욕장|서핑)/i.test(clean);
  const isGangwonQuery = /(강원|강릉|속초|양양|동해)/i.test(clean);

  // Score matching
  const scored = KOREA_TRAVEL_POI_DB.map(poi => {
    let score = 0;
    const titleClean = poi.title.toLowerCase().replace(/[\s\-_]/g, '');
    const summaryClean = poi.summary.toLowerCase();
    const cityClean = poi.city.toLowerCase();
    const regionName = poi.region.toLowerCase();

    // 1. Theme Priority Match (+150)
    if (isKidsQuery && (poi.category === '키즈' || poi.tags.includes('아이동반') || poi.tags.includes('키즈'))) {
      score += 150;
    }
    if (isIndoorQuery && (poi.category === '실내' || poi.tags.includes('실내') || poi.tags.includes('비오는날'))) {
      score += 150;
    }
    if (isSeaQuery && (poi.category === '바다' || poi.tags.includes('바다'))) {
      score += 120;
    }
    if (isGangwonQuery && (regionName === '강원' || ['강릉', '속초', '양양'].includes(cityClean))) {
      score += 120;
    }

    // 2. Region Match (+100)
    if (regionClean && (regionName.includes(regionClean) || cityClean.includes(regionClean))) {
      score += 100;
    }
    if (clean.includes('서울') && regionName === '서울') score += 100;
    if (clean.includes('부산') && regionName === '부산') score += 100;
    if (clean.includes('제주') && regionName === '제주') score += 100;

    // 3. Keyword Substring Match (+30)
    for (const tag of poi.tags) {
      if (clean.includes(tag.toLowerCase())) score += 30;
    }
    if (clean.includes(titleClean) || titleClean.includes(clean)) score += 50;

    return { ...poi, matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  
  // Filter top matches
  const topMatches = scored.filter(p => p.matchScore > 0);
  if (topMatches.length > 0) {
    return topMatches.slice(0, limit);
  }

  return KOREA_TRAVEL_POI_DB.slice(0, limit);
}
