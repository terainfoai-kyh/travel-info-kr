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
  X,
  Laptop,
  Smartphone,
  Share2,
  Check,
  Calendar,
  Utensils,
  BookOpen,
  Award,
  Navigation
} from 'lucide-react';
import { getLocalizedCityName, TRANSLATIONS } from '../i18n/translations';
import { buildKlookDeepLink } from '../services/apiConfig';
import SubwayMapModal from './SubwayMapModal';
import HelplineModal from './HelplineModal';

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
    spotQuery: '경복궁',
    image: '/images/themes/theme-gyeongbokgung.jpg',
    tagKo: '👑 서울 K-헤리티지',
    tagEn: '👑 Seoul K-Heritage',
    tagJa: '👑 ソウル文化遺産',
    tagZh: '👑 首尔传统文化',
    city: '서울'
  },
  {
    id: 2,
    titleKo: '세계가 인정한 유네스코 세계문화유산 수원화성',
    titleEn: 'UNESCO World Heritage Suwon Hwaseong Fortress',
    titleJa: 'ユネスコ世界文化遺産 水原華城の壮大な城郭',
    titleZh: '世界文化遗产 水原华城壮阔古城墙',
    subKo: '웅장한 성곽길 트레킹과 감성 행궁동 카페거리의 조화',
    subEn: 'Historic fortress wall trekking meets trendy Haenggung-dong cafes',
    subJa: '歴史ある城郭道トレッキングとレトロな行宮洞カフェ巡り',
    subZh: '壮丽古城墙漫步与充满情调的行宫洞咖啡街',
    spotQuery: '수원화성',
    image: '/images/themes/hero-suwon-hwaseong.jpg',
    tagKo: '🏰 경기·수원 세계유산',
    tagEn: '🏰 Suwon UNESCO Fortress',
    tagJa: '🏰 水原 世界遺産',
    tagZh: '🏰 水原 世界遗产',
    city: '수원'
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
    spotQuery: '광안리해수욕장',
    image: '/images/themes/theme-busan.jpg',
    tagKo: '🌊 부산 오션뷰 & 미식',
    tagEn: '🌊 Busan Ocean & Dining',
    tagJa: '🌊 釜山 海＆グルメ',
    tagZh: '🌊 釜山 海景与美食',
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
    spotQuery: '성산일출봉',
    image: '/images/themes/theme-jeju.jpg',
    tagKo: '🍊 제주 자연 & 힐링',
    tagEn: '🍊 Jeju Nature & Healing',
    tagJa: '🍊 済州 癒やしの旅',
    tagZh: '🍊 济州 自然治愈',
    city: '제주'
  },
  {
    id: 5,
    titleKo: '신라 천년의 달빛 아래 빛나는 역사 도시',
    titleEn: 'Millennium Starlight in Ancient Gyeongju',
    titleJa: '新羅千年の月明かりが輝く歴史の都 慶州',
    titleZh: '新罗千年古都 璀璨月光下的庆州',
    subKo: '동궁과 월지 야경과 황리단길 감성 한옥 골목 탐방',
    subEn: 'Enchanting Donggung Palace night reflection & Hwangnidan-gil Hanok cafes',
    subJa: '東宮と月池の幻想的な夜景と皇理団通りのレトロな韓屋散歩',
    subZh: '东宫与月池梦幻夜景与皇理团路特色韩屋街',
    spotQuery: '동궁과 월지',
    image: '/images/themes/theme-gyeongju.jpg',
    tagKo: '🌙 경주 천년고도',
    tagEn: '🌙 Gyeongju Ancient Capital',
    tagJa: '🌙 慶州 千年の古都',
    tagZh: '🌙 庆州 千年古都',
    city: '경주'
  }
];

// 🎪 실시간 전국 공식 대표 축제 & 문화 행사 데이터셋
const NATIONWIDE_FESTIVALS = [
  {
    id: 'fest-1',
    titleKo: '서울 빛초롱 축제 & 광화문 마켓',
    titleEn: 'Seoul Lantern Festival & Gwanghwamun Market',
    titleJa: 'ソウルランタンフェスティバル＆光化門マーケット',
    titleZh: '首尔水光灯节与光化门圣诞市集',
    dateKo: '2026.11 ~ 2026.12 (겨울 시즌)',
    dateEn: 'Nov - Dec 2026 (Winter Season)',
    dateJa: '2026年11月～12月 (冬シーズン)',
    dateZh: '2026年11月至12月 (冬季)',
    city: '서울',
    locationKo: '광화문광장 & 청계천 일대',
    locationEn: 'Gwanghwamun Square & Cheonggyecheon',
    locationJa: '光化門広場＆清渓川一帯',
    locationZh: '光化门广场与清溪川一带',
    image: '/images/themes/hero-hangang.jpg',
    badgeKo: '🏮 대표 등불 축제',
    badgeEn: '🏮 Lantern Festival',
    badgeJa: '🏮 光の祭典',
    badgeZh: '🏮 灯光盛典',
    descKo: '화려한 전통 한지 등불과 현대 미디어 파사드가 광화문 광장을 수놓는 서울 최대 겨울 축제',
    descEn: 'Seoul’s iconic winter night festival featuring hundreds of glowing Hanji lanterns and modern media art.',
    descJa: '伝統韓紙ランタンと最新メディアアートが光化門広場を彩るソウル最大の冬祭り',
    descZh: '传统韩纸彩灯与现代新媒体艺术点亮光化门广场的首尔代表性冬季夜间庆典',
    prompt: '서울 빛초롱 축제와 광화문 광장, 청계천 야경 중심의 2박3일 서울 겨울 낭만 코스'
  },
  {
    id: 'fest-2',
    titleKo: '부산 불꽃축제 (광안리 해변)',
    titleEn: 'Busan International Fireworks Festival',
    titleJa: '釜山国際花火祭り（広安里海岸）',
    titleZh: '釜山国际烟花节（广安里海滩）',
    dateKo: '2026.11 (가을·겨울 시즌)',
    dateEn: 'November 2026',
    dateJa: '2026年11月',
    dateZh: '2026年11月',
    city: '부산',
    locationKo: '광안리 해수욕장 & 광안대교',
    locationEn: 'Gwangalli Beach & Gwangan Bridge',
    locationJa: '広安里海水浴場＆広安大橋',
    locationZh: '广安里海水浴场与广安大桥',
    image: '/images/themes/theme-busan.jpg',
    badgeKo: '🎆 오션 불꽃쇼',
    badgeEn: '🎆 Mega Fireworks',
    badgeJa: '🎆 海上花火',
    badgeZh: '🎆 海上烟花',
    descKo: '광안대교를 배경으로 밤하늘과 바다를 화려하게 수놓는 아시아 최대 규모의 해상 멀티미디어 불꽃쇼',
    descEn: 'Asia’s premier oceanfront fireworks extravaganza illuminated over the iconic Diamond Bridge.',
    descJa: '広安大橋をバックに夜空と海を華麗に染め上げるアジア最大級のマルチメディア花火ショー',
    descZh: '以广安大桥为背景、点亮海天夜空的亚洲超大规模多媒体海上烟花盛宴',
    prompt: '부산 불꽃축제 관람과 광안리, 해운대 블루라인파크 중심의 3박4일 부산 힐링 코스'
  },
  {
    id: 'fest-3',
    titleKo: '수원화성 문화제 & 미디어아트쇼',
    titleEn: 'Suwon Hwaseong Cultural Festival',
    titleJa: '水原華城文化祭＆メディアアート',
    titleZh: '水原华城文化节与新媒体灯光秀',
    dateKo: '2026.10 (가을 시즌)',
    dateEn: 'October 2026 (Autumn)',
    dateJa: '2026年10月 (秋シーズン)',
    dateZh: '2026年10月 (秋季)',
    city: '수원',
    locationKo: '수원 화성행궁 & 화서문 성곽',
    locationEn: 'Suwon Hwaseong Fortress & Palace',
    locationJa: '水原華城行宮＆城郭一帯',
    locationZh: '水原华城行宫与古城墙',
    image: '/images/themes/hero-suwon-hwaseong.jpg',
    badgeKo: '🏰 세계유산 축제',
    badgeEn: '🏰 UNESCO Festival',
    badgeJa: '🏰 世界遺産の祭り',
    badgeZh: '🏰 世界遗产庆典',
    descKo: '정조대왕 능행차 재현과 유네스코 세계문화유산 성곽에 투사되는 환상적인 3D 미디어아트',
    descEn: 'Spectacular UNESCO fortress projection mapping and historical royal procession reenactment.',
    descJa: '正祖大王の壮大な行列再現と世界遺産の城壁に映し出される幻想的な3Dメディアアート',
    descZh: '正祖大王盛大出巡历史重现与世界文化遗产城墙上的梦幻3D光影大秀',
    prompt: '수원화성 문화제와 행궁동 카페거리, 방화수류정 야경 1일 당일치기 코스'
  },
  {
    id: 'fest-4',
    titleKo: '강릉 커피축제 (안목해변 & 오죽헌)',
    titleEn: 'Gangneung Coffee & Coastal Festival',
    titleJa: '江陵コーヒーフェスティバル',
    titleZh: '江陵咖啡节与海滨风情',
    dateKo: '2026.10 (가을 시즌)',
    dateEn: 'October 2026',
    dateJa: '2026年10月',
    dateZh: '2026年10月',
    city: '강릉',
    locationKo: '안목해변 커피거리 & 아레나',
    locationEn: 'Anmok Beach Coffee Street',
    locationJa: '安木海岸コーヒー通り',
    locationZh: '安木海边咖啡街',
    image: '/images/themes/theme-gangneung.jpg',
    badgeKo: '☕ K-커피 힐링',
    badgeEn: '☕ Specialty Coffee',
    badgeJa: '☕ 名品コーヒー',
    badgeZh: '☕ 精品咖啡',
    descKo: '파도 소리와 함께 전국 100여 개 로스터리의 스페셜티 커피를 맛볼 수 있는 대한민국 커피 수도 축제',
    descEn: 'Taste master roaster artisan coffees along the breezy Anmok oceanfront coffee boulevard.',
    descJa: '波の音を聞きながら名門ロースタリーのスペシャリティコーヒーを味わう韓国コーヒーの都の祭典',
    descZh: '在涛声中品鉴全国百余家顶尖烘焙工坊的手冲咖啡，打卡韩国咖啡之都的秋日盛会',
    prompt: '강릉 커피축제와 안목해변, BTS 정류장, 주문진 도깨비 촬영지 1박2일 힐링 코스'
  }
];

// 🏛️ 관광공사 스타일 전국 대표 도시 아치형(Arch) 감성 큐레이션 데이터셋
const REGIONAL_ARCH_DESTINATIONS = [
  {
    id: 'arch-seoul',
    nameKo: '서울',
    nameEn: 'Seoul',
    nameJa: 'ソウル',
    nameZh: '首尔',
    tagKo: '고궁 & 트렌드',
    tagEn: 'Palaces & Trends',
    tagJa: '古宮＆トレンド',
    tagZh: '古宫与潮流',
    image: '/images/themes/theme-gyeongbokgung.jpg',
    color: '#8b5cf6',
    promptKo: '서울 경복궁, 북촌 한옥마을, 성수동 3박4일 추천 코스',
    promptEn: '3-day classic and trendy Seoul travel course with Gyeongbokgung and Seongsu',
    promptJa: '景福宮、北村韓屋村、聖水洞を巡るソウル3泊4日おすすめコース',
    promptZh: '景福宫、北村韩屋村、圣水洞首尔3天2晚精选路线'
  },
  {
    id: 'arch-busan',
    nameKo: '부산',
    nameEn: 'Busan',
    nameJa: '釜山',
    nameZh: '釜山',
    tagKo: '오션뷰 & 미식',
    tagEn: 'Ocean & Seafood',
    tagJa: 'オーシャン＆海鮮',
    tagZh: '海景与海鲜',
    image: '/images/themes/theme-busan.jpg',
    color: '#3b82f6',
    promptKo: '부산 해운대, 광안리 오션뷰와 자갈치 미식 2박3일 코스',
    promptEn: '2-day scenic Busan ocean and seafood itinerary with Haeundae and Gwangalli',
    promptJa: '海雲台、広安里のオーシャンビューと海鮮グルメ釜山2泊3日コース',
    promptZh: '海云台、广安里海景与札嘎其海鲜美食釜山2天1晚路线'
  },
  {
    id: 'arch-jeju',
    nameKo: '제주',
    nameEn: 'Jeju',
    nameJa: '済州',
    nameZh: '济州',
    tagKo: '자연 & 힐링',
    tagEn: 'Nature & Coast',
    tagJa: '自然＆癒やし',
    tagZh: '自然与疗愈',
    image: '/images/themes/theme-jeju.jpg',
    color: '#10b981',
    promptKo: '제주 성산일출봉, 애월 해안도로, 서귀포 3박4일 힐링 코스',
    promptEn: '3-day Jeju nature and coastal scenic drive tour with Seongsan Peak',
    promptJa: '城山日出峰、涯月海岸道路、西帰浦を巡る済州3泊4日ヒーリングコース',
    promptZh: '城山日出峰、涯月海岸公路、西归浦济州3天2晚疗愈路线'
  },
  {
    id: 'arch-gyeongju',
    nameKo: '경주',
    nameEn: 'Gyeongju',
    nameJa: '慶州',
    nameZh: '庆州',
    tagKo: '천년고도 & 야경',
    tagEn: 'Heritage & Starlight',
    tagJa: '世界遺産＆夜景',
    tagZh: '世界遗产与夜景',
    image: '/images/themes/theme-gyeongju.jpg',
    color: '#f59e0b',
    promptKo: '경주 불국사, 동궁과 월지 야경, 황리단길 2박3일 역사 낭만 코스',
    promptEn: '2-day historic Gyeongju tour with Bulguksa and Donggung Palace night views',
    promptJa: '仏国寺、東宮と月池の夜景、皇理団通りを巡る慶州2泊3日コース',
    promptZh: '佛国寺、东宫与月池夜景、皇理团路庆州2天1晚历史浪漫路线'
  },
  {
    id: 'arch-suwon',
    nameKo: '수원',
    nameEn: 'Suwon',
    nameJa: '水原',
    nameZh: '水原',
    tagKo: '세계유산 & 행궁동',
    tagEn: 'Fortress & Cafes',
    tagJa: '世界遺産＆カフェ',
    tagZh: '世界遗产与咖啡街',
    image: '/images/themes/hero-suwon-hwaseong.jpg',
    color: '#ec4899',
    promptKo: '수원화성 성곽길 트레킹과 행궁동 감성 카페거리 1일 당일치기 코스',
    promptEn: '1-day Suwon Hwaseong fortress wall walk and Haenggung cafe street tour',
    promptJa: '水原華城の城郭散歩と行宮洞カフェ巡り1日コース',
    promptZh: '水原华城城墙漫步与行宫洞特色咖啡街一日游路线'
  },
  {
    id: 'arch-gangneung',
    nameKo: '강릉',
    nameEn: 'Gangneung',
    nameJa: '江陵',
    nameZh: '江陵',
    tagKo: '커피거리 & 바다',
    tagEn: 'Coffee & K-Wave',
    tagJa: 'カフェ通り＆海',
    tagZh: '咖啡街与海景',
    image: '/images/themes/theme-gangneung.jpg',
    color: '#06b6d4',
    promptKo: '강릉 안목해변 커피거리, BTS 정류장, 주문진 1박2일 감성 코스',
    promptEn: '2-day Gangneung trip with Anmok Beach Coffee Street and BTS bus stop',
    promptJa: '安木海岸カフェ通り、BTSバス停、注文津を巡る江陵1泊2日コース',
    promptZh: '安木海边咖啡街、BTS打卡点、订单津江陵2天1晚浪漫路线'
  },
  {
    id: 'arch-seongsu',
    nameKo: '성수·한남',
    nameEn: 'Seongsu',
    nameJa: '聖水・漢南',
    nameZh: '圣水·汉南',
    tagKo: 'K-패션 & 팝업',
    tagEn: 'K-Fashion & Pop-ups',
    tagJa: 'Kファッション＆カフェ',
    tagZh: '韩流潮牌与快闪店',
    image: '/images/themes/theme-seongsu.jpg',
    color: '#a855f7',
    promptKo: '서울 성수동과 한남동 감성 카페와 K-패션 팝업스토어 1일 트렌드 코스',
    promptEn: '1-day Seongsu hip cafes and Hannam K-fashion pop-up trend tour',
    promptJa: '聖水洞＆漢南洞の映えカフェとKファッション1日トレンドコース',
    promptZh: '首尔圣水洞与汉南洞人气咖啡馆与潮牌快闪店一日打卡路线'
  },
  {
    id: 'arch-incheon',
    nameKo: '인천',
    nameEn: 'Incheon',
    nameJa: '仁川',
    nameZh: '仁川',
    tagKo: '송도 & 개항장',
    tagEn: 'Future City & Chinatown',
    tagJa: '未来都市＆開港場',
    tagZh: '未来之城与开港场',
    image: '/images/themes/hero-hangang.jpg',
    color: '#6366f1',
    promptKo: '인천 송도 센트럴파크 수상택시와 개항장 차이나타운 1일 코스',
    promptEn: '1-day Incheon Songdo Central Park and Chinatown historic heritage tour',
    promptJa: '仁川松島セントラルパークと開港場チャイナタウン1日コース',
    promptZh: '仁川松岛中央公园水上出租车与开港场中国城一日游路线'
  }
];

// 🍲 K-Food & 로컬 미식 골목 큐레이션
const K_FOOD_HOTSPOTS = [
  {
    id: 'food-1',
    titleKo: '서울 광장시장 전통 먹거리',
    titleEn: 'Seoul Gwangjang Market Delicacies',
    titleJa: 'ソウル広蔵市場 伝統グルメ',
    titleZh: '首尔广藏市场经典传统美食',
    signatureKo: '바삭한 녹두빈대떡 · 원조 마약김밥 · 신선 한우육회',
    signatureEn: 'Crispy Bindaetteok · Mayak Gimbap · Fresh Beef Tartare',
    signatureJa: 'ピンデトック · 麻薬キンパ · 新鮮ユッケ',
    signatureZh: '酥脆绿豆煎饼 · 麻药紫菜包饭 · 鲜美生牛肉',
    city: '서울',
    cityCode: 'seoul',
    locationKo: '종로 5가역 도보 1분',
    locationEn: 'Jongno 5-ga Station (1 min walk)',
    locationJa: '鍾路5街駅 徒歩1分',
    locationZh: '钟路5街站 步行1分钟',
    tagKo: '🍲 100년 전통 미식',
    tagEn: '🍲 100-Year Street Food',
    tagJa: '🍲 100年の屋台通り',
    tagZh: '🍲 百年老字号街市',
    image: '/images/themes/theme-seongsu.jpg',
    prompt: '서울 광장시장 빈대떡과 육회, 동대문 DDP와 청계천 야경 중심의 1일 미식 투어 코스'
  },
  {
    id: 'food-2',
    titleKo: '전주 한옥마을 전통 비빔밥 & 떡갈비',
    titleEn: 'Jeonju Hanok Bibimbap & Tteokgalbi',
    titleJa: '全州韓屋村 伝統ビビンバ＆トッカルビ',
    titleZh: '全州韩屋村 正统全州拌饭与烤牛排饼',
    signatureKo: '유네스코 음식창의도시 전주비빔밥 · 숯불 떡갈비 · 모주',
    signatureEn: 'UNESCO Gastronomy Bibimbap · Grilled Short Rib Patties · Moju',
    signatureJa: 'ユネスコ認定 全州ビビンバ · 炭火トッカルビ · 母酒',
    signatureZh: '联合国教科文组织美食之都全州拌饭 · 炭烤牛排饼 · 传统母酒',
    city: '전주',
    cityCode: 'jeonju',
    locationKo: '전주 한옥마을 경기전 일대',
    locationEn: 'Jeonju Hanok Village Gyeonggijeon',
    locationJa: '全州韓屋村 慶基殿一帯',
    locationZh: '全州韩屋村 庆基殿周边',
    tagKo: '🍚 유네스코 미식',
    tagEn: '🍚 UNESCO Gastronomy',
    tagJa: '🍚 美食の聖地',
    tagZh: '🍚 世界美食之都',
    image: '/images/themes/theme-gyeongbokgung.jpg',
    prompt: '전주 한옥마을 비빔밥 맛집과 경기전, 전동성당, 자만벽화마을 1박2일 미식 코스'
  },
  {
    id: 'food-3',
    titleKo: '부산 자갈치시장 & 민락회타운',
    titleEn: 'Busan Jagalchi Fresh Seafood Market',
    titleJa: '釜山チャガルチ市場＆民楽刺身タウン',
    titleZh: '釜山扎嘎其海鲜市场与民乐生鱼片城',
    signatureKo: '살아있는 대게 코스 · 자연산 제철 활어회 · 꼼장어 구이',
    signatureEn: 'Live King Crab Course · Seasonal Sashimi · Grilled Sea Eel',
    signatureJa: '獲れたて活ズワイガニ · 旬の刺身盛り · ヌタウナギ焼き',
    signatureZh: '现捞帝王蟹套餐 · 时令鲜甜海鲜刺身 · 鲜香烤盲鳗',
    city: '부산',
    cityCode: 'busan',
    locationKo: '남포역 자갈치시장 & 광안리 민락동',
    locationEn: 'Nampo Jagalchi & Gwangan Millak',
    locationJa: '南浦チャガルチ＆広安里民楽',
    locationZh: '南浦扎嘎其与广安里民乐',
    tagKo: '🐟 청정 해산물',
    tagEn: '🐟 Fresh Ocean Seafood',
    tagJa: '🐟 活きの良い魚介',
    tagZh: '🐟 鲜活大海鲜',
    image: '/images/themes/theme-busan.jpg',
    prompt: '부산 자갈치시장 신선 해산물과 해운대, 광안리 오션뷰 2박3일 미식 코스'
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
    spotQuery: '성수동 카페거리',
    image: '/images/themes/theme-seongsu.jpg',
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
    spotQuery: '경복궁',
    image: '/images/themes/theme-gyeongbokgung.jpg',
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
    spotQuery: '광안리해수욕장',
    image: '/images/themes/theme-busan.jpg',
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
    spotQuery: '성산일출봉',
    image: '/images/themes/theme-jeju.jpg',
    tagsKo: ['#애월해안', '#성산일출봉', '#오설록', '#서귀포오션뷰'],
    tagsEn: ['#AewolCoast', '#SeongsanPeak', '#Osulloc', '#OceanView'],
    tagsJa: ['#海岸道路', '#城山日出峰', '#オソルロク', '#絶景リゾート'],
    tagsZh: ['#涯月海岸', '#城山日出峰', '#雪绿茶园', '#海景度假'],
    prompt: '제주도 서귀포와 애월 해안 드라이브, 성산일출봉과 자연 힐링 명소 3박4일 코스'
  },
  {
    id: 'theme-5',
    titleKo: '수원 화성행궁 & 방화수류정 K-헤리티지',
    titleEn: 'Suwon Hwaseong Fortress & Scenic Heritage',
    titleJa: '水原華城と行宮洞 K-ヘリテージツアー',
    titleZh: '水原华城与行宫洞古迹风情游',
    descKo: '유네스코 세계문화유산 7개 수문 화홍문과 성곽길, 아기자기한 행리단길 감성 카페거리',
    descEn: 'UNESCO World Heritage fortress, 7-arch Hwahongmun water gate, and Haengnidan-gil cafe street',
    descJa: '世界遺産・水原華城と華虹門、レトロでおしゃれな行理団通りカフェ巡り',
    descZh: '联合国教科文组织世界遗产水原华城、七孔华虹门与行理团路文艺街区',
    city: '수원',
    cityCode: 'suwon',
    durationKo: '1일 당일치기',
    durationEn: '1 Day',
    durationJa: '日帰り',
    durationZh: '1日游',
    rating: 4.8,
    reviews: '1.8k',
    spotQuery: '수원화성',
    image: '/images/themes/theme-suwon.jpg',
    tagsKo: ['#수원화성', '#화홍문', '#행리단길', '#방화수류정'],
    tagsEn: ['#SuwonFortress', '#Hwahongmun', '#Haengnidan', '#Heritage'],
    tagsJa: ['#水原華城', '#華虹門', '#行理団通り', '#世界遺産'],
    tagsZh: ['#水原华城', '#华虹门', '#行理团路', '#世界遗产'],
    prompt: '수원 화성행궁과 7대 수문 화홍문, 방화수류정과 행리단길 감성 카페를 즐기는 1일 당일치기 코스'
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
    spotQuery: '강릉 안목해변',
    image: '/images/themes/theme-gangneung.jpg',
    tagsKo: ['#안목해변', '#커피거리', '#BTS정류장', '#주문진'],
    tagsEn: ['#AnmokBeach', '#CoffeeStreet', '#BTSStop', '#Jumunjin'],
    tagsJa: ['#安木ビーチ', '#カフェ通り', '#BTSスポット', '#注文津'],
    tagsZh: ['#安木海滩', '#咖啡街', '#BTS打卡点', '#订单津'],
    prompt: '강릉 안목해변 커피거리와 BTS 버스정류장, 주문진 해변 1박2일 힐링 코스'
  }
];

const ROLLING_TIPS = [
  {
    textKo: '"경복궁 & 북촌 한옥마을 K-헤리티지 코스 짜줘"',
    textEn: '"Create a Gyeongbokgung & Bukchon Hanok heritage trip"',
    textJa: '「景福宮＆北村韓屋村の伝統歴史コース教えて」',
    textZh: '“规划景福宫与北村韩屋村传统文化一日游”',
    prompt: '서울 경복궁과 북촌 한옥마을, 인사동 전통찻집 1일 헤리티지 코스'
  },
  {
    textKo: '"성수동 감성 카페 & K-패션 팝업스토어 추천해줘"',
    textEn: '"Recommend Seongsu hip cafes & K-fashion pop-ups"',
    textJa: '「聖水洞の映えカフェ＆Kファッション巡り教えて」',
    textZh: '“推荐圣水洞人气咖啡馆与潮牌快闪店攻略”',
    prompt: '서울 성수동 디뮤지엄, 핫플 팝업스토어, 감성 카페거리 2박3일 트렌드 코스'
  },
  {
    textKo: '"부산 광안리 오션뷰 & 해운대 미식 힐링 일정 짜줘"',
    textEn: '"Plan a Busan Gwangalli Ocean & Haeundae gourmet trip"',
    textJa: '「釜山 広安里オーシャンビュー＆海雲台グルメコース」',
    textZh: '“定制釜山广安里海景与海云台美食治愈之旅”',
    prompt: '부산 광안리 해변과 해운대 블루라인파크, 해동용궁사 3박4일 힐링 코스'
  },
  {
    textKo: '"제주 서귀포 에메랄드 해안 드라이브 코스 추천해줘"',
    textEn: '"Recommend Jeju Seogwipo Emerald coastal drive trip"',
    textJa: '「済州 西帰浦エメラルド海岸ドライブコース教えて」',
    textZh: '“推荐济州西归浦翡翠海岸自驾疗愈之旅”',
    prompt: '제주 서귀포 애월 해안도로, 성산일출봉, 오설록 3박4일 드라이브 코스'
  }
];

export default function PortalHomePrototype({
  lang = 'ko',
  onSearchSubmit,
  onOpenWeather,
  onOpenEssentials,
  onOpenPlanner,
  onSelectTheme,
  onNavigateTab,
  targetCity = '서울'
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCityTab, setSelectedCityTab] = useState('all');
  const [isSubwayModalOpen, setIsSubwayModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Auto-advance cinematic hero slides every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Auto-rotate smart recommendation tips every 4.0 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ROLLING_TIPS.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

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
    { 
      labelKo: '👑 경복궁 & 북촌', 
      labelEn: '👑 Gyeongbok Palace', 
      labelJa: '👑 景福宮＆北村',
      labelZh: '👑 景福宫·北村',
      promptKo: '경복궁과 북촌 한옥마을, 인사동 전통 문화 코스',
      promptEn: '1-day traditional culture tour of Gyeongbokgung Palace, Bukchon Hanok Village, and Insadong',
      promptJa: '景福宮と北村韓屋村、仁寺洞の伝統文化1日コース',
      promptZh: '景福宫与北村韩屋村、仁寺洞传统文化一日游'
    },
    { 
      labelKo: '☕ 성수·한남 힙플', 
      labelEn: '☕ Seongsu & Hannam', 
      labelJa: '☕ 聖水＆漢南',
      labelZh: '☕ 圣水·汉南',
      promptKo: '서울 성수동과 한남동 감성 카페와 핫플 코스',
      promptEn: '3-day trendy tour of Seongsu-dong cafe street and Hannam-dong in Seoul',
      promptJa: 'ソウル聖水洞と漢南洞のカフェ通り＆最新ホットスポットコース',
      promptZh: '首尔圣水洞与汉南洞氛围咖啡街与潮流探店路线'
    },
    { 
      labelKo: '🌊 부산 광안리 오션', 
      labelEn: '🌊 Busan Gwangan', 
      labelJa: '🌊 釜山 広安里オーシャン',
      labelZh: '🌊 釜山广安里海景',
      promptKo: '부산 해운대와 광안리 오션뷰 미식 코스',
      promptEn: '3-day ocean view and seafood tour of Haeundae and Gwangalli in Busan',
      promptJa: '釜山海雲台と広安里オーシャンビュー＆グルメ3日間コース',
      promptZh: '釜山海云台与广安里海景美食3天2晚路线'
    },
    { 
      labelKo: '🍊 제주 서귀포 힐링', 
      labelEn: '🍊 Jeju Island', 
      labelJa: '🍊 済州 ヒーリングドライブ',
      labelZh: '🍊 济州西归浦疗愈',
      promptKo: '제주도 애월과 서귀포 해안 힐링 코스',
      promptEn: '3-day coastal scenic drive and healing tour of Aewol and Seogwipo in Jeju',
      promptJa: '済州島涯月海岸と西帰浦ヒーリングドライブ3日間コース',
      promptZh: '济州岛涯月与西归浦海岸公路治愈自驾路线'
    },
    {
      labelKo: '🌙 경주 천년고도 야경',
      labelEn: '🌙 Gyeongju Starlight',
      labelJa: '🌙 慶州 夜景遺産',
      labelZh: '🌙 庆州 千年夜景',
      promptKo: '경주 동궁과 월지, 첨성대, 황리단길 2박3일 역사 낭만 코스',
      promptEn: '2-day historic starlight trip in Gyeongju including Donggung Palace and Hwangnidan-gil',
      promptJa: '慶州 東宮と月池、瞻星台、皇理団通り2泊3日歴史ツアー',
      promptZh: '庆州东宫与月池、瞻星台、皇理团路2天1晚历史浪漫路线'
    }
  ];

  const CITY_TABS = [
    { code: 'all', labelKo: '전체 (All)', labelEn: 'All Destinations', labelJa: 'すべて', labelZh: '全部目的地' },
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
    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', color: 'var(--text-main)', padding: '0 0.5rem 2rem' }}>
      
      {/* ☀️ 1. Grand Natural Scenic Hero Section */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '280px',
          maxHeight: '380px',
          height: 'clamp(280px, 36vh, 380px)',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 1rem 1rem 1rem',
          boxSizing: 'border-box',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35)',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Background Image Carousel with Smooth Crossfade */}
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
              backgroundPosition: 'center 35%',
              opacity: idx === currentSlideIndex ? 1 : 0,
              transform: idx === currentSlideIndex ? 'scale(1.03)' : 'scale(1.0)',
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out',
              zIndex: 1
            }}
          />
        ))}

        {/* Ambient Contrast Scrim */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.25) 45%, rgba(15, 23, 42, 0.85) 100%)',
          zIndex: 2
        }} />

        {/* [TOP] Master Hero Headline */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          width: '100%',
          maxWidth: '900px',
          paddingTop: '0.2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(139, 92, 246, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#ffffff',
            marginBottom: '0.4rem',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={12} />
            <span>{currentSlide[`tag${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || currentSlide.tagEn || 'KOREA AI CONCIERGE'}</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.3rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            color: '#ffffff',
            margin: '0 0 0.3rem',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)',
            letterSpacing: '-0.02em'
          }}>
            {currentSlide[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || currentSlide.titleEn}
          </h1>
          <p style={{
            fontSize: 'clamp(0.8rem, 1.8vw, 1.0rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontWeight: 600,
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.8)'
          }}>
            {currentSlide[`sub${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || currentSlide.subEn}
          </p>
        </div>

        {/* [BOTTOM] Master AI Search Box */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          maxWidth: '680px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '0.8rem'
        }}>
          <form 
            onSubmit={handleSearch}
            style={{ width: '100%' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              padding: '0.3rem 0.35rem 0.3rem 1.1rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              transition: 'all 0.3s ease'
            }}>
              <MapPin size={18} style={{ color: '#8b5cf6', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'en' ? 'Where to in Korea? (e.g. Seoul 3 days with night views)' :
                  lang === 'ja' ? 'どこへ旅行しますか？ (例: ソウル 3泊4日 夜景＆グルメ)' :
                  (lang === 'zh' || lang === 'zht') ? '想去韩国哪里？ (例如: 首尔 3天2晚 夜景与美食之旅)' :
                  '어디로 여행하시나요? (예: 서울 3일 야경과 미식 코스)'
                }
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  padding: '0.4rem 0.6rem',
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.55rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <Sparkles size={15} />
                <span>{lang === 'en' ? 'AI Itinerary' : lang === 'ja' ? 'AIコース作成' : (lang === 'zh' || lang === 'zht') ? 'AI定制行程' : '✦ 3초 코스 생성'}</span>
              </button>
            </div>
          </form>

          {/* Quick Intent Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.6rem',
            width: '100%'
          }}>
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip[`prompt${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || chip.promptEn)}
                style={{
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {chip[`label${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || chip.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '0.4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.45rem',
          zIndex: 3
        }}>
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                width: idx === currentSlideIndex ? '28px' : '8px',
                height: '7px',
                borderRadius: '4px',
                backgroundColor: idx === currentSlideIndex ? '#8b5cf6' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 🏛️ 2. Tourism Org Style: Arch Regional Destinations Ribbon (전국 대표 여행지 아치형 감성 띠) */}
      <section style={{
        marginBottom: '2.2rem',
        padding: '1.25rem 1rem 1.3rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.45) 0%, rgba(224, 242, 254, 0.45) 50%, rgba(254, 243, 199, 0.45) 100%)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.9rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>✨</span>
              <h2 style={{
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                {lang === 'en' ? 'Where to in Korea? Iconic Regional Destinations' :
                 lang === 'ja' ? '韓国のどこへ旅しますか？ 全国代表観光地' :
                 (lang === 'zh' || lang === 'zht') ? '想去韩国哪里旅行？ 全国代表性旅游名胜' :
                 '대한민국 어디로 떠나볼까요? 전국 대표 여행지'}
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0 1.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'One-click AI curated courses for Korea’s top scenic regions' :
               lang === 'ja' ? 'ワンクリックで完成する韓国人気都市のAIカスタムコース' :
               (lang === 'zh' || lang === 'zht') ? '一键生成韩国热门城市AI专属旅行路线' :
               '원하는 도시를 콕 집으면 VORA AI가 맞춤 일정표를 즉시 완성해 드립니다'}
            </p>
          </div>
        </div>

        {/* Arch Shaped Horizontal Scroll Grid */}
        <div style={{
          display: 'flex',
          gap: '0.9rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}>
          {REGIONAL_ARCH_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                const prompt = dest[`prompt${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || dest.promptEn;
                if (onSelectTheme) {
                  onSelectTheme(prompt, dest.nameKo);
                } else if (onSearchSubmit) {
                  onSearchSubmit(prompt);
                }
              }}
              style={{
                flex: '0 0 135px',
                width: '135px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '40px 40px 18px 18px',
                border: '1.5px solid var(--border-color)',
                padding: '6px 6px 10px 6px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                scrollSnapAlign: 'start',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 12px 24px -6px ${dest.color}40`;
                e.currentTarget.style.borderColor = dest.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {/* Arch Dome Image Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '115px',
                borderRadius: '34px 34px 12px 12px',
                overflow: 'hidden',
                backgroundColor: '#0f172a'
              }}>
                <img
                  src={dest.image}
                  alt={dest.nameEn}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(15, 23, 42, 0.7) 100%)'
                }} />
                <span style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: dest.color,
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                }}>
                  {dest[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || dest.nameEn}
                </span>
              </div>

              {/* City Tag */}
              <span style={{
                marginTop: '0.5rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.2
              }}>
                {dest[`tag${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || dest.tagEn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 🎪 3. Real-Time Nationwide Festivals & Cultural Events Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎪</span>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                {lang === 'en' ? 'Live Nationwide Festivals & Events' :
                 lang === 'ja' ? '全国 リアルタイム祭り＆文化イベント' :
                 (lang === 'zh' || lang === 'zht') ? '韩国实时节庆与文化盛典' :
                 '지금 한국은 축제 중! 전국 실시간 축제 & 문화 행사'}
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0 1.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Official Korea Tourism Organization real-time event updates' :
               lang === 'ja' ? '韓国観光公社公式 リアルタイムイベント情報連動' :
               (lang === 'zh' || lang === 'zht') ? '韩国旅游发展局官方实时庆典活动联动' :
               '한국관광공사 TourAPI 4.0 실시간 직결 · 일정에 바로 쏙 넣는 맞춤 코스'}
            </p>
          </div>
        </div>

        {/* Festivals Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.1rem'
        }}>
          {NATIONWIDE_FESTIVALS.map((fest) => (
            <div
              key={fest.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Image & Badges */}
              <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={fest.image}
                  alt={fest.titleEn}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {fest[`badge${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || fest.badgeEn}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {getLocalizedCityName(fest.city, lang)}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    <Calendar size={13} />
                    <span>{fest[`date${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || fest.dateEn}</span>
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
                    {fest[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || fest.titleEn}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {fest[`desc${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || fest.descEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTheme) {
                      onSelectTheme(fest.prompt, fest.city);
                    } else if (onSearchSubmit) {
                      onSearchSubmit(fest.prompt);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={14} />
                  <span>
                    {lang === 'en' ? 'Create Route with this Festival' :
                     lang === 'ja' ? 'この祭りのコースを作る' :
                     (lang === 'zh' || lang === 'zht') ? '生成此庆典定制路线' :
                     '이 축제 포함 AI 일정 만들기'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ 3. Full-Screen 4K Interactive Map Launcher Banner */}
      <div style={{
        marginBottom: '2.5rem',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <Navigation size={26} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Explore Korea on 4K Interactive Map' :
               lang === 'ja' ? '4K インタラクティブ地図で韓国全土を探検' :
               (lang === 'zh' || lang === 'zht') ? '在4K全景交互地图上探索韩国全境' :
               '전국 4,100개 명소를 4K 인터랙티브 지도로 탐색하기'}
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Visualize daily travel routes, spot clusters & subway lines seamlessly' :
               lang === 'ja' ? '日別ルート、スポット密集エリア、地下鉄路線をひと目で可視化' :
               (lang === 'zh' || lang === 'zht') ? '直观查看每日路线、景点分布与地铁线路' :
               '일차별 동선 클러스터링, 이동 시간, 지하철 노선도를 한눈에 확인하세요'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('map');
          }}
          style={{
            padding: '0.65rem 1.4rem',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}
        >
          <Map size={16} />
          <span>
            {lang === 'en' ? 'Open 4K Map Explorer' :
             lang === 'ja' ? '4K 地図を開く' :
             (lang === 'zh' || lang === 'zht') ? '打开4K交互地图' :
             '4K 인터랙티브 지도 열기'}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 🍲 4. Iconic K-Food & Street Markets Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🍲</span>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                {lang === 'en' ? 'Must-Eat K-Food & Iconic Street Markets' :
                 lang === 'ja' ? '必食！K-フード＆名物屋台市場' :
                 (lang === 'zh' || lang === 'zht') ? '必吃韩国美食与标志性夜市' :
                 '놓치면 후회할 대표 K-푸드 & 전통 미식 시장'}
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0 1.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Authentic regional street foodie secrets certified by local experts' :
               lang === 'ja' ? 'ローカル専門家が認めた本場の名物グルメ通り' :
               (lang === 'zh' || lang === 'zht') ? '当地美食专家力荐的正宗地道美食街区' :
               '현지인과 글로벌 여행객이 극찬한 100년 전통 미식 골목'}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.1rem'
        }}>
          {K_FOOD_HOTSPOTS.map((food) => (
            <div
              key={food.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                padding: '1.1rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.8rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444'
                  }}>
                    {food[`tag${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || food.tagEn}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {getLocalizedCityName(food.city, lang)}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {food[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || food.titleEn}
                </h3>

                <div style={{
                  padding: '0.6rem 0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginBottom: '0.35rem'
                }}>
                  ✨ {food[`signature${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || food.signatureEn}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  📍 {food[`location${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || food.locationEn}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectTheme) {
                    onSelectTheme(food.prompt, food.city);
                  } else if (onSearchSubmit) {
                    onSearchSubmit(food.prompt);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Utensils size={13} />
                <span>
                  {lang === 'en' ? 'Plan Foodie Course' :
                   lang === 'ja' ? 'グルメコースを計画' :
                   (lang === 'zh' || lang === 'zht') ? '定制美食路线' :
                   '이 미식 코스 기획하기'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🏙️ 5. Curated Regional Signature Themes Grid */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🏙️</span>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                {lang === 'en' ? 'Curated Regional Travel Itineraries' :
                 lang === 'ja' ? '地域別 おすすめ定番旅行コース' :
                 (lang === 'zh' || lang === 'zht') ? '热门目的地精选推荐路线' :
                 '인기 도시별 엄선 추천 여행 코스'}
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0 1.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Verified 1 to 4-day signature routes optimized for seamless spatial travel' :
               lang === 'ja' ? '無駄のない動線で設計された1〜4日間の定番おすすめプラン' :
               (lang === 'zh' || lang === 'zht') ? '精心设计的1至4日经典路线，游览更省心' :
               '외국인 관광객 만족도 1위 · 1일~4일 동선 낭비 제로 시그니처 코스'}
            </p>
          </div>

          {/* City Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            {CITY_TABS.map((ct) => (
              <button
                key={ct.code}
                onClick={() => setSelectedCityTab(ct.code)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  border: selectedCityTab === ct.code ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                  backgroundColor: selectedCityTab === ct.code ? '#8b5cf6' : 'var(--bg-card)',
                  color: selectedCityTab === ct.code ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {ct[`label${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || ct.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Themes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Photo & Duration Badge */}
              <div style={{ position: 'relative', height: '175px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={theme.image}
                  alt={theme.titleEn}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  ⏱️ {theme[`duration${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || theme.durationEn}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(6px)',
                  color: '#f59e0b',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Star size={12} fill="#f59e0b" />
                  <span>{theme.rating}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.68rem' }}>({theme.reviews})</span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.8rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
                    {theme[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || theme.titleEn}
                  </h3>
                  <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {theme[`desc${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || theme.descEn}
                  </p>
                  
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {(theme[`tags${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || theme.tagsEn || []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTheme) {
                      onSelectTheme(theme.prompt, theme.city);
                    } else if (onSearchSubmit) {
                      onSearchSubmit(theme.prompt);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={14} />
                  <span>
                    {lang === 'en' ? 'Generate 3D Itinerary' :
                     lang === 'ja' ? 'このコースで日程を作成' :
                     (lang === 'zh' || lang === 'zht') ? '生成此路线行程' :
                     '이 코스로 3초 만에 일정 생성'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ 6. Travel Essentials Quick Hub */}
      <div style={{ marginBottom: '1rem' }}>
        <div className="portal-quick-hub-grid">
          {/* Icon 1: AI Course Planner */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => {
              if (onOpenPlanner) onOpenPlanner();
              else if (onNavigateTab) onNavigateTab('ai');
            }}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 8px 16px rgba(139, 92, 246, 0.25)'
            }}>
              <Sparkles size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? 'AI Planner' : lang === 'ja' ? 'AIプラン作成' : (lang === 'zh' || lang === 'zht') ? 'AI行程规划' : 'AI 코스 플래너'}
            </div>
          </div>

          {/* Icon 2: Real-time Weather & Styling */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => {
              if (onOpenWeather) onOpenWeather(targetCity);
            }}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              boxShadow: '0 8px 16px rgba(245, 158, 11, 0.25)'
            }}>
              <CloudSun size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? 'Weather & Outfit' : lang === 'ja' ? '天気＆コーデ' : (lang === 'zh' || lang === 'zht') ? '实时天气穿搭' : '실시간 날씨 & 코디'}
            </div>
          </div>

          {/* Icon 3: Climate Card & Transit */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => {
              if (onOpenEssentials) onOpenEssentials();
            }}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
            }}>
              <Train size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? 'Climate Card' : lang === 'ja' ? '気候同行カード' : (lang === 'zh' || lang === 'zht') ? '气候同行卡' : '기후동행카드'}
            </div>
          </div>

          {/* Icon 4: Nationwide Metro Map */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => setIsSubwayModalOpen(true)}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #0284c7, #3b82f6)',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.25)'
            }}>
              <Map size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? 'Metro Map' : lang === 'ja' ? '地下鉄路線図' : (lang === 'zh' || lang === 'zht') ? '地铁路线图' : '지하철 노선도'}
            </div>
          </div>

          {/* Icon 5: Unlimited eSIM */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => {
              const esimQuery = lang === 'en' ? 'Korea eSIM Unlimited' : lang === 'ja' ? '韓国 無制限 eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国 无限流量 eSIM' : '한국 무제한 eSIM';
              window.open(buildKlookDeepLink(esimQuery), '_blank', 'noopener,noreferrer');
            }}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 8px 16px rgba(139, 92, 246, 0.25)'
            }}>
              <Wifi size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? 'Korea eSIM' : lang === 'ja' ? '韓国eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国eSIM' : '무제한 eSIM'}
            </div>
          </div>

          {/* Icon 6: 1330 Emergency Helpline */}
          <div 
            className="portal-quick-hub-card"
            onClick={() => setIsHelplineModalOpen(true)}
          >
            <div className="portal-quick-hub-icon" style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.25)'
            }}>
              <PhoneCall size={22} />
            </div>
            <div className="portal-quick-hub-label">
              {lang === 'en' ? '1330 Hotline' : lang === 'ja' ? '1330 通訳' : (lang === 'zh' || lang === 'zht') ? '1330 翻译热线' : '1330 긴급통역'}
            </div>
          </div>
        </div>
      </div>

      {/* 🚇 전국 지하철 노선도 모달 */}
      <SubwayMapModal
        isOpen={isSubwayModalOpen}
        onClose={() => setIsSubwayModalOpen(false)}
        lang={lang}
      />

      {/* 📞 1330 스마트 헬프라인 모달 */}
      <HelplineModal
        isOpen={isHelplineModalOpen}
        onClose={() => setIsHelplineModalOpen(false)}
        lang={lang}
      />

    </div>
  );
}
