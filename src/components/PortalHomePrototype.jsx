import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  CloudSun, 
  Compass, 
  Train, 
  Wifi, 
  PhoneCall,
  Map,
  ArrowRight, 
  ChevronRight, 
  Star, 
  Clock, 
  Flame,
  CreditCard,
  Shirt,
  X
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    titleKo: '천년의 역사가 숨 쉬는 아름다운 고궁',
    titleEn: 'Timeless Royal Heritage in Seoul',
    titleJa: '千年の歴史が息づく美しい古宮',
    titleZh: '流淌千年历史的壮美首尔古宫',
    subKo: '경복궁 & 북촌 한옥마을의 고즈넉한 정취를 걸어보세요',
    subEn: 'Experience the serene beauty of Gyeongbokgung Palace & Bukchon',
    subJa: '景福宮と北村韓屋村の風情を感じる特別な散歩',
    subZh: '漫步景福宫与北村韩屋村的静谧风情',
    image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg',
    tagKo: '👑 서울 K-헤리티지',
    city: '서울'
  },
  {
    id: 2,
    titleKo: '트렌디한 K-컬처와 한강의 황금빛 노을',
    titleEn: 'Vibrant K-Culture & Golden Sunset Sky',
    titleJa: '最新トレンドのK-カルチャーと漢江の夕焼け',
    titleZh: '前沿K-Culture与汉江绝美晚霞',
    subKo: '성수동 팝업스토어부터 한강 피크닉까지 완벽한 하루',
    subEn: 'From Seongsu-dong pop-up cafes to breezy Hangang sunset picnics',
    subJa: '聖水洞のカフェから漢江ピクニックまで完璧な1日',
    subZh: '从圣水洞快闪店到汉江野餐的完美一日',
    image: 'https://tong.visitkorea.or.kr/cms/resource/50/2619450_image2_1.jpg',
    tagKo: '🏙️ 성수·한남 트렌드',
    city: '서울'
  },
  {
    id: 3,
    titleKo: '푸른 파도와 화려한 광안대교 오션뷰',
    titleEn: 'Azure Ocean Waves & Sparkling Diamond Bridge',
    titleJa: '青い海と輝く広安里のナイトビュー',
    titleZh: '蔚蓝海浪与璀璨广安大桥夜景',
    subKo: '해운대 요트 투어와 신선한 해산물 미식 기행',
    subEn: 'Haeundae luxury yacht sailing and fresh seaside foodie journey',
    subJa: '海雲台ヨットツアーと新鮮なシーフードのグルメ旅',
    subZh: '海云台游艇巡游与鲜美海鲜美食之旅',
    image: 'https://tong.visitkorea.or.kr/cms/resource/71/2619471_image2_1.jpg',
    tagKo: '🌊 부산 오션뷰 & 미식',
    city: '부산'
  },
  {
    id: 4,
    titleKo: '에메랄드빛 바다와 유네스코 세계자연유산',
    titleEn: 'Emerald Coasts & UNESCO World Heritage',
    titleJa: 'エメラルドの海とユネスコ世界自然遺産',
    titleZh: '翡翠海岸与联合国教科文组织自然遗产',
    subKo: '성산일출봉과 애월 해안도로에서 만나는 제주 힐링',
    subEn: 'Seongsan Sunrise Peak and Aewol coastal breeze drive in Jeju',
    subJa: '城山日出峰と涯月海岸道路で出会うヒーリング済州',
    subZh: '城山日出峰与涯月海岸公路的济州治愈之旅',
    image: 'https://tong.visitkorea.or.kr/cms/resource/82/2944282_image2_1.bmp',
    tagKo: '🍊 제주 자연 & 힐링',
    city: '제주'
  }
];

const CURATED_THEMES = [
  {
    id: 'theme-1',
    titleKo: '서울 성수 & 한남 K-트렌드 핫플',
    titleEn: 'Seoul Seongsu & Hannam K-Trend Tour',
    titleJa: 'ソウル聖水＆漢南 K-トレンドツアー',
    titleZh: '首尔圣水与汉南 K-潮流之旅',
    descKo: '외국인 MZ세대가 가장 사랑하는 팝업스토어, 디자이너 브랜드, 감성 카페거리',
    descEn: 'Top-rated pop-up boutiques, designer showrooms, and artisan roastery cafes loved by global travelers',
    descJa: '世界中の旅行者が訪れるポップアップ、デザイナーズブランド、隠れ家カフェ',
    descZh: '全球游客最爱的快闪店、设计师品牌与氛围感咖啡街区',
    city: '서울',
    cityCode: 'seoul',
    durationKo: '2박 3일',
    durationEn: '3 Days',
    durationJa: '2泊3日',
    durationZh: '3天2晚',
    rating: 4.9,
    reviews: '2.4k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/50/2619450_image2_1.jpg',
    tagsKo: ['#성수동', '#K패션', '#감성카페', '#디뮤지엄'],
    tagsEn: ['#Seongsu', '#KFashion', '#TrendyCafe', '#DMuseum'],
    tagsJa: ['#聖水洞', '#Kファッション', '#人気カフェ', '#美術館'],
    tagsZh: ['#圣水洞', '#韩国时尚', '#氛围咖啡', '#美术馆'],
    prompt: '서울 성수동과 한남동 중심의 트렌디한 K-패션 쇼핑과 감성 카페거리 2박3일 코스'
  },
  {
    id: 'theme-2',
    titleKo: '서울 경복궁 & 북촌 한옥마을 K-헤리티지',
    titleEn: 'Seoul Royal Palace & Hanok Village Tour',
    titleJa: 'ソウル景福宮＆北村韓屋村 文化遺産ツアー',
    titleZh: '首尔景福宫与北村韩屋村传统文化之旅',
    descKo: '조선 왕실의 정취가 살아있는 고궁 한복 체험과 북촌 한옥마을, 인사동 전통 찻집',
    descEn: 'Authentic Hanbok royal palace experience, historic Hanok alleys, and Insadong artisan teahouses',
    descJa: '朝鮮王室の歴史を感じる韓服体験と北村韓屋村、仁寺洞の伝統茶屋めぐり',
    descZh: '景福宫韩服古风体验、北村韩屋古巷与仁寺洞传统茶室文化漫步',
    city: '서울',
    cityCode: 'seoul',
    durationKo: '1일 당일치기',
    durationEn: '1 Day',
    durationJa: '日帰り',
    durationZh: '1日游',
    rating: 4.9,
    reviews: '5.1k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg',
    tagsKo: ['#경복궁', '#한복체험', '#북촌한옥', '#인사동'],
    tagsEn: ['#Gyeongbokgung', '#Hanbok', '#Bukchon', '#Insadong'],
    tagsJa: ['#景福宮', '#韓服体験', '#北村韓屋', '#仁寺洞'],
    tagsZh: ['#景福宫', '#韩服体验', '#北村韩屋', '#仁寺洞'],
    prompt: '경복궁과 북촌 한옥마을, 인사동 전통 문화와 수문장 교대의식 1일 코스'
  },
  {
    id: 'theme-3',
    titleKo: '부산 광안리 오션뷰 & 해운대 미식 힐링',
    titleEn: 'Busan Gwangan Ocean & Haeundae Foodie',
    titleJa: '釜山広安里オーシャン＆海雲台グルメ癒やし旅',
    titleZh: '釜山广安里海景与海云台美食治愈',
    descKo: '탁 트인 동해 바다 전망과 요트 투어, 해리단길 브런치와 자갈치 신선 해산물 코스',
    descEn: 'Sweeping ocean panorama, private yacht sunset sailing, Haeridan-gil brunch & fresh seafood market',
    descJa: '爽快な海原とプライベートヨットクルーズ、海理団通りブランチと新鮮シーフード',
    descZh: '开阔海景、夕阳游艇体验、海理团路早午餐与扎嘎其海鲜盛宴',
    city: '부산',
    cityCode: 'busan',
    durationKo: '3박 4일',
    durationEn: '4 Days',
    durationJa: '3泊4日',
    durationZh: '4天3晚',
    rating: 4.9,
    reviews: '3.1k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/71/2619471_image2_1.jpg',
    tagsKo: ['#광안대교', '#해운대요트', '#해리단길', '#더베이101'],
    tagsEn: ['#GwanganBridge', '#YachtTour', '#Haeridan', '#TheBay101'],
    tagsJa: ['#広安大橋', '#ヨットクルーズ', '#グルメ通り', '#ベイ101'],
    tagsZh: ['#广安大桥', '#游艇出海', '#海理团路', '#TheBay101'],
    prompt: '부산 해운대와 광안리 오션뷰, 요트 투어와 미식 탐방 중심의 3박4일 코스'
  },
  {
    id: 'theme-4',
    titleKo: '제주 서귀포 에메랄드 해안 & 힐링 드라이브',
    titleEn: 'Jeju Emerald Coast & Nature Healing',
    titleJa: '済州エメラルド海岸＆ネイチャーヒーリング',
    titleZh: '济州翡翠海岸与自然治愈自驾',
    descKo: '에메랄드빛 애월 해안도로 드라이브, 성산일출봉 비경과 조용한 녹차밭 쉼표',
    descEn: 'Scenic coastal highway drive along Aewol, breathtaking Seongsan Peak, and serene green tea hills',
    descJa: 'エメラルドの海岸ドライブ、城山日出峰の絶景と静寂な緑茶畑でのリフレッシュ',
    descZh: '沿涯月海岸公路自驾、城山日出峰绝景与宁静茶园疗愈之旅',
    city: '제주',
    cityCode: 'jeju',
    durationKo: '3박 4일',
    durationEn: '4 Days',
    durationJa: '3泊4日',
    durationZh: '4天3晚',
    rating: 4.9,
    reviews: '4.2k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/82/2944282_image2_1.bmp',
    tagsKo: ['#애월해안', '#성산일출봉', '#오설록', '#서귀포오션뷰'],
    tagsEn: ['#AewolCoast', '#SeongsanPeak', '#Osulloc', '#OceanView'],
    tagsJa: ['#海岸道路', '#城山日出峰', '#オソルロク', '#絶景リゾート'],
    tagsZh: ['#涯月海岸', '#城山日出峰', '#雪绿茶园', '#海景度假'],
    prompt: '제주도 서귀포와 애월 해안 드라이브, 성산일출봉과 자연 힐링 명소 3박4일 코스'
  },
  {
    id: 'theme-5',
    titleKo: '수원 행궁동 K-헤리티지 & 열기구 야경',
    titleEn: 'Suwon Hwaseong Heritage & Night Balloon',
    titleJa: '水原行宮洞 K-ヘリテージ＆気球夜景',
    titleZh: '水原行宫洞文化遗产与热气球夜景',
    descKo: '유네스코 세계문화유산 수원화성과 감성 행리단길, 하늘에서 보는 화려한 성곽 야경',
    descEn: 'UNESCO World Heritage fortress, romantic Haengnidan-gil street, and hot air balloon night vista',
    descJa: '世界遺産・水原華城とレトロな行理団通り、気球から見下ろす幻想的な夜景',
    descZh: '联合国教科文组织世界遗产水原华城、文艺行理团路与俯瞰城郭的热气球夜景',
    city: '수원',
    cityCode: 'suwon',
    durationKo: '1일 당일치기',
    durationEn: '1 Day',
    durationJa: '日帰り',
    durationZh: '1日游',
    rating: 4.8,
    reviews: '1.8k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/21/2656921_image2_1.jpg',
    tagsKo: ['#수원화성', '#행리단길', '#플라잉수원', '#야경명소'],
    tagsEn: ['#SuwonFortress', '#Haengnidan', '#FlyingSuwon', '#NightView'],
    tagsJa: ['#水原華城', '#カフェ通り', '#気球体験', '#夜景スポット'],
    tagsZh: ['#水原华城', '#行理团路', '#热气球体验', '#夜景圣地'],
    prompt: '수원 화성행궁과 행리단길 감성 카페, 플라잉수원 열기구 야경을 즐기는 1일 당일치기 코스'
  },
  {
    id: 'theme-6',
    titleKo: '강릉 안목해변 커피거리 & K-컬처 투어',
    titleEn: 'Gangneung Coffee Beach & K-Culture Tour',
    titleJa: '江陵 安木海岸コーヒー通り＆K-カルチャーツアー',
    titleZh: '江陵安木海边咖啡街与K-Culture圣地巡礼',
    descKo: '파도 소리와 함께 즐기는 안목해변 오션뷰 카페거리, BTS 버스정류장과 주문진 도깨비 촬영지',
    descEn: 'Aromatic coastal coffee street along Anmok beach, BTS bus stop, and Jumunjin drama filming spots',
    descJa: '安木海岸のオーシャンビューカフェ通り、BTSバス停と人気ドラマロケ地めぐり',
    descZh: '安木海边海景咖啡街、BTS海边公交站与经典韩剧经典取景地',
    city: '강릉',
    cityCode: 'gangneung',
    durationKo: '1박 2일',
    durationEn: '2 Days',
    durationJa: '1泊2日',
    durationZh: '2天1晚',
    rating: 4.8,
    reviews: '1.9k',
    image: 'https://tong.visitkorea.or.kr/cms/resource/13/2678613_image2_1.jpg',
    tagsKo: ['#안목해변', '#커피거리', '#BTS정류장', '#주문진'],
    tagsEn: ['#AnmokBeach', '#CoffeeStreet', '#BTSStop', '#Jumunjin'],
    tagsJa: ['#安木ビーチ', '#カフェ通り', '#BTSスポット', '#注文津'],
    tagsZh: ['#安木海滩', '#咖啡街', '#BTS打卡点', '#订单津'],
    prompt: '강릉 안목해변 커피거리와 BTS 버스정류장, 주문진 해변 1박2일 힐링 코스'
  }
];

export default function PortalHomePrototype({
  lang = 'ko',
  onSearchSubmit,
  onOpenWeather,
  onOpenEssentials,
  onSelectTheme,
  targetCity = '서울'
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCityTab, setSelectedCityTab] = useState('all');

  // Auto-advance cinematic hero slides every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleChipClick = (promptText) => {
    setSearchQuery(promptText);
    if (onSearchSubmit) {
      onSearchSubmit(promptText);
    }
  };

  const QUICK_CHIPS = [
    { labelKo: '☕ 성수·한남 힙플', labelEn: '☕ Seongsu & Hannam', prompt: '서울 성수동과 한남동 감성 카페와 핫플 코스' },
    { labelKo: '👑 경복궁 & 북촌', labelEn: '👑 Gyeongbokgung Palace', prompt: '경복궁과 북촌 한옥마을, 인사동 전통 문화 코스' },
    { labelKo: '🌊 부산 광안리 오션뷰', labelEn: '🌊 Busan Gwangan Ocean', prompt: '부산 해운대와 광안리 오션뷰 미식 코스' },
    { labelKo: '🍊 제주 서귀포 힐링', labelEn: '🍊 Jeju Healing Drive', prompt: '제주도 애월과 서귀포 해안 힐링 코스' },
    { labelKo: '🏯 수원 행궁동 투어', labelEn: '🏯 Suwon Fortress Tour', prompt: '수원 화성행궁과 행리단길 1일 투어' }
  ];

  const CITY_TABS = [
    { code: 'all', labelKo: '전체', labelEn: 'All', labelJa: 'すべて', labelZh: '全部' },
    { code: 'seoul', labelKo: '서울', labelEn: 'Seoul', labelJa: 'ソウル', labelZh: '首尔' },
    { code: 'busan', labelKo: '부산', labelEn: 'Busan', labelJa: '釜山', labelZh: '釜山' },
    { code: 'jeju', labelKo: '제주', labelEn: 'Jeju', labelJa: '済州', labelZh: '济州' },
    { code: 'suwon', labelKo: '수원', labelEn: 'Suwon', labelJa: '水原', labelZh: '水原' },
    { code: 'gangneung', labelKo: '강릉', labelEn: 'Gangneung', labelJa: '江陵', labelZh: '江陵' }
  ];

  const filteredThemes = selectedCityTab === 'all' 
    ? CURATED_THEMES 
    : CURATED_THEMES.filter(t => t.cityCode === selectedCityTab);

  return (
    <div style={{ width: '100%', color: 'var(--text-main)', paddingBottom: '2.5rem' }}>
      
      {/* ☀️ 1. Grand Natural Bright & Scenic Hero */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          maxHeight: '580px',
          height: '56vh',
          borderRadius: '28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Background Image Carousel with Smooth Crossfade & Zoom */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === currentSlideIndex ? 1 : 0,
              transform: idx === currentSlideIndex ? 'scale(1.03)' : 'scale(1.0)',
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out',
              zIndex: 1
            }}
          />
        ))}

        {/* Ambient Subtle Light Scrim (Photos stay 100% bright, sunny and natural) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.02) 40%, rgba(15, 23, 42, 0.58) 100%)',
          zIndex: 2
        }} />

        {/* Hero Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          maxWidth: '860px',
          padding: '1.25rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          
          {/* Top Sparkling Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#93c5fd',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            <span>
              {lang === 'en' ? 'VORA AI 3.0 • Official Korea Travel Concierge' :
               lang === 'ja' ? 'VORA AI 3.0 • 公式韓国旅行コンシェルジュ' :
               (lang === 'zh' || lang === 'zht') ? 'VORA AI 3.0 • 韩国旅游官方智能礼宾' :
               'VORA AI 3.0 • 대한민국 대표 AI 여행 컨시어지'}
            </span>
          </div>

          {/* Dynamic Headline */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4.2vw, 2.85rem)',
            fontWeight: 900,
            lineHeight: 1.22,
            color: '#ffffff',
            margin: 0,
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9)',
            letterSpacing: '-0.02em'
          }}>
            {lang === 'en' ? currentSlide.titleEn :
             lang === 'ja' ? currentSlide.titleJa :
             (lang === 'zh' || lang === 'zht') ? currentSlide.titleZh :
             currentSlide.titleKo}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.92rem, 1.8vw, 1.15rem)',
            color: '#ffffff',
            margin: 0,
            maxWidth: '680px',
            lineHeight: 1.5,
            fontWeight: 600,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)'
          }}>
            {lang === 'en' ? currentSlide.subEn :
             lang === 'ja' ? currentSlide.subJa :
             (lang === 'zh' || lang === 'zht') ? currentSlide.subZh :
             currentSlide.subKo}
          </p>

          {/* 🔍 HanaTour / Airbnb Style Pure White Smart Search Box */}
          <form 
            onSubmit={handleSearch}
            style={{
              width: '100%',
              maxWidth: '640px',
              marginTop: '0.4rem',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              padding: '0.35rem 0.4rem 0.35rem 1.1rem',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              transition: 'all 0.3s ease'
            }}>
              <Search size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'en' ? 'Where do you want to explore? (e.g. 3-day Jeju drive, Seongsu cafes)' :
                  lang === 'ja' ? 'どこへ行きたいですか？ (例: 済州ドライブ、聖水カフェ)' :
                  (lang === 'zh' || lang === 'zht') ? '想去哪里旅行？ (例如: 济州3日自驾、首尔圣水洞咖啡)' :
                  '어디로 떠나고 싶으신가요? (예: 2박3일 제주 힐링, 성수동 카페 투어)'
                }
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  padding: '0.6rem 0.8rem',
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.65rem 1.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <Sparkles size={15} />
                <span>{lang === 'en' ? 'Generate' : lang === 'ja' ? 'AI作成' : (lang === 'zh' || lang === 'zht') ? 'AI生成' : 'AI 일정생성'}</span>
              </button>
            </div>
          </form>

          {/* Quick Suggestion Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.45rem',
            marginTop: '0.1rem'
          }}>
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.prompt)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#0f172a',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.94)';
                  e.currentTarget.style.color = '#0f172a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{lang === 'en' ? chip.labelEn : chip.labelKo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slide Indicators / Navigation Dots */}
        <div style={{
          position: 'absolute',
          bottom: '0.9rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 3
        }}>
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                width: idx === currentSlideIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === currentSlideIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ⚡ 2. HanaTour / VisitKorea Style 6-Icon Circular Quick Hub */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem'
        }}>
          
          {/* Icon 1: AI Course Planner */}
          <div 
            onClick={() => {
              const el = document.getElementById('search-filter-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(37, 99, 235, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)'
            }}>
              <Sparkles size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'AI Planner' : lang === 'ja' ? 'AIプラン作成' : (lang === 'zh' || lang === 'zht') ? 'AI行程规划' : 'AI 코스 플래너'}
            </div>
          </div>

          {/* Icon 2: Real-time Weather & Styling */}
          <div 
            onClick={() => {
              if (onOpenWeather) onOpenWeather(targetCity);
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(245, 158, 11, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(245, 158, 11, 0.25)'
            }}>
              <CloudSun size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Weather & Outfit' : lang === 'ja' ? '天気＆コーデ' : (lang === 'zh' || lang === 'zht') ? '实时天气穿搭' : '실시간 날씨 & 코디'}
            </div>
          </div>

          {/* Icon 3: Climate Card & Transit */}
          <div 
            onClick={() => {
              const el = document.getElementById('travel-essentials-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else if (onOpenEssentials) onOpenEssentials();
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
            }}>
              <Train size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Climate Card' : lang === 'ja' ? '気候同行カード' : (lang === 'zh' || lang === 'zht') ? '气候同行卡' : '기후동행카드'}
            </div>
          </div>

          {/* Icon 4: Seoul Metro Map */}
          <div 
            onClick={() => {
              window.open('http://www.seoulmetro.co.kr/kr/cyberStation.do', '_blank');
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(2, 132, 199, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.25)'
            }}>
              <Map size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Metro Map' : lang === 'ja' ? '地下鉄路線図' : (lang === 'zh' || lang === 'zht') ? '地铁路线图' : '지하철 노선도'}
            </div>
          </div>

          {/* Icon 5: Unlimited eSIM */}
          <div 
            onClick={() => {
              window.open('https://affiliate.klook.com', '_blank');
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(139, 92, 246, 0.25)'
            }}>
              <Wifi size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Korea eSIM' : lang === 'ja' ? '韓国eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国eSIM' : '무제한 eSIM'}
            </div>
          </div>

          {/* Icon 6: 1330 Emergency Helpline */}
          <div 
            onClick={() => {
              window.open(lang === 'en' ? 'https://english.visitkorea.or.kr' : lang === 'ja' ? 'https://japanese.visitkorea.or.kr' : (lang === 'zh' || lang === 'zht') ? 'https://chinese.visitkorea.or.kr' : 'https://korean.visitkorea.or.kr', '_blank');
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.1rem 0.6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(239, 68, 68, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.25)'
            }}>
              <PhoneCall size={24} />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? '1330 Hotline' : lang === 'ja' ? '1330 通訳' : (lang === 'zh' || lang === 'zht') ? '1330 翻译热线' : '1330 긴급통역'}
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 3. Trending Curated AI Magazine Cards with City Filter Tabs */}
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#ef4444',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <Star size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
                <span>TRENDING THEMES</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0.15rem 0 0 0' }}>
                {lang === 'en' ? 'Popular Curated AI Travel Itineraries' :
                 lang === 'ja' ? '外国人旅行者に大人気の厳選AIコース' :
                 (lang === 'zh' || lang === 'zht') ? '海外游客精选高分推荐路线' :
                 '외국인 인기 추천 테마 AI 여행 코스'}
              </h2>
            </div>

            {/* City Segmented Filter Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.25rem',
              gap: '0.2rem',
              overflowX: 'auto',
              maxWidth: '100%'
            }}>
              {CITY_TABS.map((tab) => (
                <button
                  key={tab.code}
                  onClick={() => setSelectedCityTab(tab.code)}
                  style={{
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: selectedCityTab === tab.code ? 800 : 600,
                    backgroundColor: selectedCityTab === tab.code ? 'var(--accent-primary)' : 'transparent',
                    color: selectedCityTab === tab.code ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{lang === 'en' ? tab.labelEn : lang === 'ja' ? tab.labelJa : (lang === 'zh' || lang === 'zht') ? tab.labelZh : tab.labelKo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Themed Magazine Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => {
                if (onSelectTheme) {
                  onSelectTheme(theme.prompt, theme.city);
                }
              }}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '22px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Card Photo Header with Badges */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '185px',
                overflow: 'hidden'
              }}>
                <img
                  src={theme.image}
                  alt={theme.titleKo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                />
                
                {/* Gradient Shadow on Image */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, transparent 60%)'
                }} />

                {/* City & Duration Floating Badges */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  display: 'flex',
                  gap: '0.4rem'
                }}>
                  <span style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <MapPin size={11} style={{ color: '#60a5fa' }} />
                    <span>{theme.city}</span>
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Clock size={11} />
                    <span>
                      {lang === 'en' ? theme.durationEn :
                       lang === 'ja' ? theme.durationJa :
                       (lang === 'zh' || lang === 'zht') ? theme.durationZh :
                       theme.durationKo}
                    </span>
                  </span>
                </div>

                {/* Star Rating Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#fbbf24',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Star size={12} style={{ fill: '#fbbf24' }} />
                  <span>{theme.rating}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '0.68rem' }}>({theme.reviews})</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    margin: '0 0 0.4rem 0',
                    lineHeight: 1.35
                  }}>
                    {lang === 'en' ? theme.titleEn :
                     lang === 'ja' ? theme.titleJa :
                     (lang === 'zh' || lang === 'zht') ? theme.titleZh :
                     theme.titleKo}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                    margin: '0 0 0.75rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {lang === 'en' ? theme.descEn :
                     lang === 'ja' ? theme.descJa :
                     (lang === 'zh' || lang === 'zht') ? theme.descZh :
                     theme.descKo}
                  </p>

                  {/* Hash Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.35rem',
                    marginBottom: '1rem'
                  }}>
                    {(lang === 'en' ? theme.tagsEn :
                      lang === 'ja' ? theme.tagsJa :
                      (lang === 'zh' || lang === 'zht') ? theme.tagsZh :
                      theme.tagsKo).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Trigger */}
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {lang === 'en' ? 'Open AI Itinerary' : lang === 'ja' ? 'AIコースを開く' : (lang === 'zh' || lang === 'zht') ? '开启AI行程' : 'AI 일정 열기'}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
