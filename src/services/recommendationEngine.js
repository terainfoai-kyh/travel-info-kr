export function getRecommendedFoodAndOutfit({ weather, region, theme, age, gender, keyword = '' }) {
  const isSunny = weather?.weatherText?.includes('맑음');
  const isRainy = weather?.weatherText?.includes('비') || weather?.weatherText?.includes('흐림');
  const temp = parseInt(weather?.temperature || '24', 10);
  const kw = keyword.trim().toLowerCase();

  // Extract Season from travel forecastDate (e.g. 2026-12-14 ~ 2026-12-18 or current date)
  let travelMonth = new Date().getMonth() + 1; // Default current month
  if (weather?.forecastDate) {
    const match = weather.forecastDate.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match && match[2]) {
      travelMonth = parseInt(match[2], 10);
    }
  }

  let seasonName = 'summer'; // 'spring', 'summer', 'autumn', 'winter'
  if (travelMonth === 12 || travelMonth === 1 || travelMonth === 2) {
    seasonName = 'winter';
  } else if (travelMonth >= 3 && travelMonth <= 5) {
    seasonName = 'spring';
  } else if (travelMonth >= 6 && travelMonth <= 8) {
    seasonName = 'summer';
  } else {
    seasonName = 'autumn';
  }

  // Expanded Master Food Catalog tagged with season, region, and weather
  const MASTER_FOODS = [
    {
      id: 'f-winter-1',
      name: '뜨끈한 뚝배기 국밥 & 쫄깃 수육',
      category: '국밥 / 한식',
      regions: ['전국', '부산', '서울', '경기', '인천', '제주', '강원'],
      weatherType: 'all',
      seasons: ['winter', 'autumn'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['국밥', '수육', '돼지국밥', '설렁탕', '곰탕'],
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
      reason: '추운 겨울철 몸을 온화하고 따스하게 녹여주는 깊은 풍미의 대표 국밥'
    },
    {
      id: 'f-winter-2',
      name: '제주 청정 흑돼지 구이 & 멜젓',
      category: '구이 / 제주특산',
      regions: ['제주', '전국'],
      weatherType: 'all',
      seasons: ['winter', 'spring', 'summer', 'autumn'],
      targetAge: ['20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['제주', '흑돼지', '돼지', '삼겹살'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      reason: '제주 청정 자연에서 자란 두툼하고 육즙 가득한 명품 흑돼지'
    },
    {
      id: 'f-winter-3',
      name: '얼큰한 해물 뚝배기 전골 & 칼국수',
      category: '전골 / 면류',
      regions: ['전국', '제주', '부산', '강원', '인천'],
      weatherType: 'all',
      seasons: ['winter', 'autumn'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['전골', '해물탕', '칼국수', '뚝배기'],
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      reason: '겨울철 동해/남해 해산물의 얼큰함과 깊은 육수가 일품인 탕 요리'
    },
    {
      id: 'f-summer-1',
      name: '시원한 살얼음 물냉면 & 숯불고기',
      category: '면류 / 육류',
      regions: ['전국', '서울', '경기', '인천', '강원', '부산', '대구'],
      weatherType: 'sunny',
      seasons: ['summer', 'spring'],
      targetAge: ['10대', '20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['냉면', '물냉면', '비빔냉면', '면', '고기'],
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      reason: '화창하고 더운 날씨에 열기를 식혀주는 시원한 원픽 면요리'
    },
    {
      id: 'f-summer-2',
      name: '제주 해산물 물회 & 싱싱 전복죽',
      category: '해산물 / 오션뷰',
      regions: ['제주', '부산', '강원', '인천', '전국'],
      weatherType: 'sunny',
      seasons: ['summer', 'spring'],
      targetAge: ['20대', '30대', '40대', '50대이상', '전체'],
      targetGender: ['남성', '여성', '무관'],
      keywords: ['물회', '해산물', '전복', '생선'],
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      reason: '시원한 오션뷰와 어울리는 청정 해산물의 싱싱한 식감'
    }
  ];

  // Multi-Condition Scoring Function for Foods
  let scoredFoods = MASTER_FOODS.map(food => {
    let score = 0;
    if (food.seasons.includes(seasonName)) score += 50; // High seasonal score
    if (region === '전국' || food.regions.includes(region)) score += 30;
    if (gender === '무관' || food.targetGender.includes(gender)) score += 10;
    if (age === '전체' || food.targetAge.includes(age)) score += 10;
    return { ...food, score };
  });

  scoredFoods.sort((a, b) => b.score - a.score);

  const selectedFoods = scoredFoods.slice(0, 3).map(f => ({
    name: f.name,
    category: f.category,
    image: f.image,
    reason: `${weather?.forecastDate ? `[${weather.forecastDate}] ` : ''}${f.reason}`
  }));

  // Season & Gender-aware Outfit Recommendations Engine
  const isMale = gender === '남성';
  const isFemale = gender === '여성';

  let outfitList = [];

  if (seasonName === 'winter') {
    // WINTER OUTFITS
    if (isMale) {
      outfitList = [
        {
          title: '남성 헤비다운 패딩 & 슬림 롱비니 룩',
          season: '겨울 (한파 / 영하 기온)',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
          items: ['방한 구스다운 롱패딩', '기모 목폴라 니트', '방한 방수 장갑', '보온 방한화'],
          reason: `${weather?.forecastDate || '겨울 여행 기간'} 칼바람을 완벽 방어하고 체온을 지켜주는 스타일`
        },
        {
          title: '남성 댄디 울 코트 & 목도리 스타일',
          season: '겨울 (실내/도시 야경 투어)',
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
          items: ['오버핏 롱 울 코트', '울 머플러(목도리)', '슬림 스니커즈', '핫팩'],
          reason: '박물관/전시관 실내 관람 및 도심 야경 촬영에 어울리는 포근하고 클래식한 룩'
        }
      ];
    } else if (isFemale) {
      outfitList = [
        {
          title: '여성 숏 숏패딩 & 뽀글이 플리스 룩',
          season: '겨울 (한파 대비 / 레저)',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          items: ['볼륨 숏패딩/플리스', '기모 울 니트', '캐시미어 머플러', '방한 미들부츠'],
          reason: `${weather?.forecastDate || '겨울 여행'} 인생샷과 완벽한 방한 보온성을 갖춘 겨울 룩`
        },
        {
          title: '여성 클래식 롱코트 & 울 베레모 룩',
          season: '겨울 (카페 / 스냅 촬영)',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
          items: ['핸드메이드 롱코트', '울 베레모', '가죽 방한 장갑', '앵클 부츠'],
          reason: '겨울 감성 사진을 더욱 돋보이게 하는 포근하고 감성적인 스타일'
        }
      ];
    } else {
      outfitList = [
        {
          title: '남녀공용 헤비 패딩 & 워머 룩',
          season: '겨울 (한파 / 영하 기온)',
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
          items: ['롱/숏 방한 패딩', '기모 맨투맨/후드', '방한 장갑/귀마개', '윈터 스니커즈'],
          reason: `${weather?.forecastDate || '겨울 여행'} 따뜻하고 편안한 보온 위주 남녀공용 스타일`
        },
        {
          title: '남녀공용 오버핏 울코트 룩',
          season: '겨울 (실내 & 도시 산책)',
          image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
          items: ['오버핏 울 코트', '체크 목도리', '방한 장갑', '보온 워커'],
          reason: '겨울 도시 여행 및 관광명소 탐방 시 세련된 연출이 가능한 룩'
        }
      ];
    }
  } else {
    // SPRING / SUMMER / AUTUMN OUTFITS
    if (isMale) {
      outfitList = [
        {
          title: '남성 캐주얼 레이어드 트래블 룩',
          season: `${seasonName === 'summer' ? '여름 (28°C ~ 33°C)' : '봄/가을 (18°C ~ 24°C)'}`,
          image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80',
          items: ['린넨/옥스퍼드 셔츠', '치노 팬츠/데님', '편안한 스니커즈', '슬림 백팩'],
          reason: `${weather?.forecastDate || '여행 기간'} (${region !== '전국' ? region : '여행지'}) 활동성이 뛰어난 댄디 남성 스타일`
        },
        {
          title: isSunny ? '남성 시원한 린넨 & 숏팬츠 룩' : '남성 아웃도어 윈드브레이커 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: isSunny 
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
          items: isSunny ? ['반팔 린넨 셔츠', '이지 반바지', '볼캡 모자', '선글라스'] : ['기능성 경량 점퍼', '방수 트레킹화', '휴대용 우산'],
          reason: isSunny ? '야외 활동 시 땀 배출이 원활하고 스타일리시한 시원한 스타일' : '갑작스러운 비나 바람에 철저히 대비하는 스포츠 룩'
        }
      ];
    } else if (isFemale) {
      outfitList = [
        {
          title: '여성 트렌디 레이어드 캐주얼 룩',
          season: `${seasonName === 'summer' ? '여름 (28°C ~ 33°C)' : '봄/가을 (18°C ~ 24°C)'}`,
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
          items: ['가벼운 카디건/크롭 셔츠', '하이웨이스트 슬랙스', '쿠션 스니커즈', '미니 크로스백'],
          reason: `${weather?.forecastDate || '여행 기간'} (${region !== '전국' ? region : '여행지'}) 인생샷 촬영과 활동성을 모두 잡은 스타일`
        },
        {
          title: isSunny ? '여성 시원한 원피스 & 리조트 룩' : '여성 바람막이 & 케이프 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: isSunny 
            ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
          items: isSunny ? ['통기성 린넨 원피스', '챙 넓은 라피아 햇', '플랫 샌들', '양산'] : ['경량 바람막이', '레인 코트', '방수 샌들'],
          reason: isSunny ? '햇살 강한 야외에서 화사하고 자외선 차단에 우수한 리조트 스타일' : '비바람에도 편안하고 감각적인 스타일'
        }
      ];
    } else {
      outfitList = [
        {
          title: '남녀공용 시티 캐주얼 레이어드 룩',
          season: '봄/가을 (18°C ~ 24°C)',
          image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
          items: ['오버핏 셔츠', '편안한 슬랙스/데님', '러닝 스니커즈', '에코백'],
          reason: `${weather?.forecastDate || '여행 기간'} 무난하고 세련된 남녀공용 캐주얼 스타일`
        },
        {
          title: isSunny ? '시원한 린넨 & 아웃도어 트래블 룩' : '경량 아웃도어 바람막이 룩',
          season: isSunny ? '여름 / 햇살 강한 날' : '흐림 / 비 소식 준비',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
          items: isSunny ? ['통기성 반팔 셔츠', '자외선 차단 모자', '트레킹 샌들', '선글라스'] : ['방풍 점퍼', '접이식 우산', '미끄럼 방지 신발'],
          reason: isSunny ? '땀 배출이 쉽고 자외선으로부터 피부를 보호하는 아웃도어 룩' : '날씨 변화에 민첩하게 대응할 수 있는 기능성 스타일'
        }
      ];
    }
  }

  return { foods: selectedFoods, outfits: outfitList };
}
