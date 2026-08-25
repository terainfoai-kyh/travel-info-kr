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
    tags: ['바다', '카페거리', '커플', '일출'],
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
    tags: ['바다', '산책', '자전거', '피크닉'],
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
    tags: ['바다', '서핑', '이국적', '선셋바'],
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
    tags: ['바다', '일출', '해상정자', '인생샷'],
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
    tags: ['미식', '오징어순대', '갯배체험', '로컬'],
    summary: '손으로 끄는 무동력 갯배 체험과 고소한 오징어순대, 아바이순대를 맛보는 실향민 마을'
  },

  // ==========================================
  // 2. 서울 (성수, 종로, 한남, 홍대, 잠실, 강남)
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
    tags: ['한옥', '궁궐', '한복체험', 'K-헤리티지'],
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
    tags: ['카페', '팝업스토어', 'MZ핫플', '쇼핑'],
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
    tags: ['한옥', '골목길', '전통공예', '갤러리'],
    summary: '도심 속 고즈넉한 기와지붕 골목길과 한옥 갤러리, 삼청동의 감성 공방 투어'
  },
  {
    id: 'kt_seoul_namsan',
    title: 'N서울타워 & 남산공원',
    region: '서울',
    city: '서울',
    category: '명소',
    theme: '야경/전망',
    duration: 100,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/20/2650020_image2_1.jpg',
    lat: 37.5512,
    lng: 126.9882,
    tags: ['야경', '케이블카', '사랑의자물쇠', '선셋'],
    summary: '서울 도심 전체를 360도로 조망하는 랜드마크이자 로맨틱한 선셋과 야경 명소'
  },
  {
    id: 'kt_seoul_hongdae',
    title: '홍대 걷고싶은거리 & 연남동 연트럴파크',
    region: '서울',
    city: '서울',
    category: '핫플',
    theme: '스트리트/버스킹',
    duration: 120,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/55/2650055_image2_1.jpg',
    lat: 37.5563,
    lng: 126.9230,
    tags: ['버스킹', '쇼핑', '젊음의거리', '디저트'],
    summary: '자유로운 버스킹 공연과 인디 문화, 경의선숲길(연트럴파크) 잔디밭 피크닉'
  },

  // ==========================================
  // 3. 부산 (해운대, 광안리, 영도, 기장, 남포)
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
    tags: ['바다', '광안대교야경', '드론쇼', '오션뷰카페'],
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
    tags: ['스카이캡슐', '오션뷰열차', '인생샷', '해안절벽'],
    summary: '동해남부선 폐선 부지 해안 절벽 위를 달리는 알록달록 공중 캡슐 열차'
  },
  {
    id: 'kt_bs_huinnyeoul',
    title: '영도 흰여울문화마을',
    region: '부산',
    city: '부산',
    category: '명소',
    theme: '감성/포토',
    duration: 90,
    rating: 4.8,
    image: 'http://tong.visitkorea.or.kr/cms/resource/74/2650174_image2_1.jpg',
    lat: 35.0784,
    lng: 129.0454,
    tags: ['해안절벽', '골목길', '산토리니', '인생샷'],
    summary: '절영해안산책로를 따라 이어지는 하얀 집들과 푸른 바다가 어우러진 한국의 산토리니'
  },

  // ==========================================
  // 4. 제주 (애월, 서귀포, 성산, 협재)
  // ==========================================
  {
    id: 'kt_jj_aewol',
    title: '애월 한담해변 산책로',
    region: '제주',
    city: '제주',
    category: '바다',
    theme: '힐링/선셋',
    duration: 90,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/90/2650290_image2_1.jpg',
    lat: 33.4623,
    lng: 126.3115,
    tags: ['에메랄드바다', '선셋', '투명카약', '해안산책'],
    summary: '에메랄드빛 투명한 바다와 검은 현무암, 붉게 물드는 석양이 환상적인 해안길'
  },
  {
    id: 'kt_jj_seongsan',
    title: '성산일출봉 & 광치기해변',
    region: '제주',
    city: '서귀포',
    category: '명소',
    theme: '자연/유네스코',
    duration: 120,
    rating: 4.9,
    image: 'http://tong.visitkorea.or.kr/cms/resource/35/2650235_image2_1.jpg',
    lat: 33.4581,
    lng: 126.9426,
    tags: ['유네스코', '일출', '화산분화구', '웅장함'],
    summary: '바다 위로 우뚝 솟은 유네스코 세계자연유산 수성화산체와 신비로운 이끼 갯바위'
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

  // Score matching
  const scored = KOREA_TRAVEL_POI_DB.map(poi => {
    let score = 0;
    const titleClean = poi.title.toLowerCase().replace(/[\s\-_]/g, '');
    const summaryClean = poi.summary.toLowerCase();
    const cityClean = poi.city.toLowerCase();
    const regionName = poi.region.toLowerCase();

    // 1. Region Match (+100)
    if (regionClean && (regionName.includes(regionClean) || cityClean.includes(regionClean))) {
      score += 100;
    }
    if (clean.includes('강원') && (regionName === '강원' || ['강릉', '속초', '양양'].includes(cityClean))) {
      score += 100;
    }
    if (clean.includes('서울') && regionName === '서울') score += 100;
    if (clean.includes('부산') && regionName === '부산') score += 100;
    if (clean.includes('제주') && regionName === '제주') score += 100;

    // 2. City Direct Match (+80)
    if (clean.includes(cityClean)) score += 80;

    // 3. Category & Theme Match (+50)
    if (clean.includes('바다') && (poi.category === '바다' || poi.tags.includes('바다'))) score += 50;
    if (clean.includes('카페') && (poi.category === '카페' || poi.tags.includes('카페'))) score += 50;
    if (clean.includes('맛집') && (poi.category === '맛집' || poi.tags.includes('미식'))) score += 50;
    if (clean.includes('야경') && poi.tags.includes('야경')) score += 50;
    if (clean.includes('커플') && poi.tags.includes('커플')) score += 40;
    if (clean.includes('아이') && (poi.tags.includes('피크닉') || poi.tags.includes('산책'))) score += 40;

    // 4. Keyword Substring Match (+30)
    for (const tag of poi.tags) {
      if (clean.includes(tag.toLowerCase())) score += 30;
    }
    if (clean.includes(titleClean) || titleClean.includes(clean)) score += 40;

    return { ...poi, matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
}
