import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Clock, 
  Calendar, 
  Layers, 
  Heart, 
  Star, 
  CloudSun, 
  CreditCard, 
  Train, 
  Wifi, 
  PhoneCall, 
  CheckCircle2, 
  Ticket, 
  Utensils, 
  Moon,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { buildKlookDeepLink } from '../services/apiConfig';
import { fetchCityTourApiSpots, fetchDynamicRealtimeSpots, fetchLocationBasedTourApiSpots, fetchPinpointLandmarkSpots, getCityMultilingualName } from '../services/tourApi';
import { CITY_LOCAL_KNOWLEDGE } from '../data/voraDialogKnowledge';
import SubwayMapModal from './SubwayMapModal';
import HelplineModal from './HelplineModal';
import VoraAIChat from './VoraAIChat';
import { TRANSLATIONS, getLocalizedCityName } from '../i18n/translations';
import { SOUTH_KOREA_MAP_BOUNDS, isInSouthKorea, updateMapTileLayer } from '../utils/mapTileUtils';
import MyTripTab from './MyTripTab';

// 🎯 Organic Curved Route Generator for smooth travel paths in Route Map mode
function generateSmoothCurvedRoute(points) {
  if (!points || points.length < 2) return points || [];
  const curved = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midLat = (p1[0] + p2[0]) / 2;
    const midLng = (p1[1] + p2[1]) / 2;
    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const sign = (i % 2 === 0) ? 1 : -1;
    const curveIntensity = 0.12 * sign;
    const ctrlLat = midLat - dLng * curveIntensity;
    const ctrlLng = midLng + dLat * curveIntensity;
    const steps = 10;
    for (let step = 0; step < (i === points.length - 2 ? steps + 1 : steps); step++) {
      const t = step / steps;
      const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * ctrlLat + t * t * p2[0];
      const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * ctrlLng + t * t * p2[1];
      curved.push([lat, lng]);
    }
  }
  return curved.length > 1 ? curved : points;
}

// 🗺️ 전국 대표 권역 검증된 고화질 Fallback 데이터
const REGIONAL_FALLBACK_CENTERS = [
  { 
    nameKo: '서울 경복궁', 
    nameEn: 'Seoul Gyeongbokgung', 
    nameJa: 'ソウル 景福宮',
    nameZh: '首尔 景福宫',
    lat: 37.5796, 
    lng: 126.9770,
    zoom: 13,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    transitTipKo: '지하철 3호선 경복궁역 도보 3분',
    transitTipEn: 'Line 3 Gyeongbokgung Station (3 min walk)',
    transitTipJa: '地下鉄3号線 景福宮駅 徒歩3分',
    transitTipZh: '地铁3号线 景福宫站 步行3分钟',
    foodieSecretKo: '광장시장 마약김밥, 육회, 빈대떡, 성수동 스페셜티 브루잉 카페, 종로 생선구이 백반',
    foodieSecretEn: 'Gwangjang Market Kimbap, Yukhoe (Beef Tartare), Mung Bean Pancake, Seongsu Specialty Brew Cafe, Jongno Grilled Fish',
    foodieSecretJa: '広蔵市場 麻薬キンパ, ユッケ, ピンデトック, 聖水洞スペシャルティカフェ, 鍾路 焼き魚定食',
    foodieSecretZh: '广藏市场 紫菜包饭, 生牛肉, 绿豆煎饼, 圣水洞精品咖啡, 钟路 烤鱼套餐',
    nightHighlightKo: 'N서울타워 & 남산 파노라마 (서울 도심 360도 파노라마 야경과 사랑의 자물쇠 명소)',
    nightHighlightEn: 'N Seoul Tower & Namsan Panorama (360° Seoul City Night Skyline & Love Padlocks)',
    nightHighlightJa: 'Nソウルタワー＆南山パノラマ（ソウル都心360度パノラマ夜景＆愛の南京錠）',
    nightHighlightZh: 'N首尔塔与南山全景（首尔市中心360度全景夜景与爱情锁名所）',
    highlights: [
      { ko: '경복궁 & 근정전', en: 'Gyeongbokgung Palace', ja: '景福宮', zh: '景福宫', lat: 37.5796, lng: 126.9770, zoom: 15 },
      { ko: '북촌 한옥마을', en: 'Bukchon Hanok Village', ja: '北村韓屋村', zh: '北村韩屋村', lat: 37.5826, lng: 126.9835, zoom: 15 },
      { ko: '익선동 감성거리', en: 'Ikseon-dong Alley', ja: '益善洞', zh: '益善洞', lat: 37.5744, lng: 126.9892, zoom: 15 }
    ],
    descKo: '600년 조선 왕조의 숨결과 현대적인 K-컬처가 공존하는 한국 여행 1번지',
    descEn: 'The heartbeat of Korea where 600 years of royal heritage meets modern K-culture.',
    descJa: '600年の歴史を持つ朝鮮王朝の伝統と現代のK-カルチャーが共存する韓国観光の拠点',
    descZh: '融合600年朝鲜王朝历史底蕴与现代K-Culture潮流的韩国必游名所'
  },
  { 
    nameKo: '서울', 
    nameEn: 'Seoul', 
    nameJa: 'ソウル',
    nameZh: '首尔',
    lat: 37.5665, 
    lng: 126.9780,
    zoom: 12,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    transitTipKo: '지하철 2호선 성수역 / 한강공원 직결',
    transitTipEn: 'Subway Line 2 Seongsu / Hangang River Link',
    transitTipJa: '地下鉄2号線 聖水駅／漢江公園直結',
    transitTipZh: '地铁2号线 圣水站/汉江公园直达',
    foodieSecretKo: '성수동 감성 브런치, 익선동 한옥 베이커리, 광장시장 빈대떡, 마포 돼지갈비',
    foodieSecretEn: 'Seongsu Hip Brunch, Ikseon Hanok Bakery, Gwangjang Market Pancake, Mapo Pork Ribs',
    foodieSecretJa: '聖水洞ブランチ, 益善洞韓屋ベーカリー, 広蔵市場ピンデトック, 麻浦豚カルビ',
    foodieSecretZh: '圣水洞早午餐, 益善洞韩屋烘焙, 广藏市场煎饼, 麻浦烤猪排骨',
    nightHighlightKo: 'DDP 동대문 디자인플라자 LED 미디어파사드 & 한강 달빛 피크닉',
    nightHighlightEn: 'DDP Dongdaemun LED Media Facade & Hangang Moonlight Picnic',
    nightHighlightJa: 'DDP東大門メディアファサード＆漢江ムーンライトピクニック',
    nightHighlightZh: 'DDP东大门设计广场LED媒体灯光秀与汉江月色野餐',
    highlights: [
      { ko: '성수동 팝업거리', en: 'Seongsu Pop-up Street', ja: '聖水洞', zh: '圣水洞', lat: 37.5445, lng: 127.0560, zoom: 15 },
      { ko: '한강 달빛피크닉', en: 'Hangang River Picnic', ja: '漢江ピクニック', zh: '汉江公园', lat: 37.5284, lng: 126.9341, zoom: 14 },
      { ko: 'N서울타워 야경', en: 'N Seoul Tower Sunset', ja: 'Nソウルタワー', zh: 'N首尔塔', lat: 37.5512, lng: 126.9882, zoom: 15 }
    ],
    descKo: '트렌디한 K-패션 쇼핑부터 한강의 황금빛 노을까지 완벽한 하루',
    descEn: 'From trendy K-fashion popup stores to golden sunsets over the Hangang River.',
    descJa: 'トレンディなK-ファッションから漢江の美しい夕日まで楽しめる人気コース',
    descZh: '从潮流K-Fashion快闪店到汉江金色落日野餐的完美一日游'
  },
  { 
    nameKo: '수원', 
    nameEn: 'Suwon', 
    nameJa: '水原',
    nameZh: '水原',
    lat: 37.2636, 
    lng: 127.0286,
    zoom: 13,
    image: '/images/themes/theme-suwon.jpg',
    transitTipKo: '서울역에서 KTX 30분 / 1호선 직결',
    transitTipEn: 'KTX from Seoul Station (30 min) / Line 1 Direct',
    transitTipJa: 'ソウル駅からKTXで30分／地下鉄1号線直結',
    transitTipZh: '首尔站乘坐KTX约30分钟/地铁1号线直达',
    foodieSecretKo: '수원 전통 왕갈비, 행리단길 감성 카페, 통닭거리 가마솥 치킨',
    foodieSecretEn: 'Suwon Traditional Wang-galbi (King Ribs), Haengridan Hanok Cafes, Cauldron Fried Chicken Street',
    foodieSecretJa: '水原伝統王カルビ, 行理団通り韓屋カフェ, 水原チキン通り',
    foodieSecretZh: '水原传统王牛排骨, 行理团路韩屋咖啡街, 炸鸡一条街',
    nightHighlightKo: '수원화성 방화수류정 야경 (연못에 비치는 성곽 달빛 야경)',
    nightHighlightEn: 'Suwon Hwaseong & Banghwasuryujeong Pavilion Moonlit Night View',
    nightHighlightJa: '水原華城・訪花随柳亭の月夜散歩（池に映る城郭ライトアップ）',
    nightHighlightZh: '水原华城与访花随柳亭月色夜景（倒映于池塘的城郭灯光）',
    highlights: [
      { ko: '수원화성 성곽길', en: 'Suwon Hwaseong Fortress', ja: '水原華城', zh: '水原华城', lat: 37.2872, lng: 127.0118, zoom: 15 },
      { ko: '행궁동 감성카페', en: 'Haenggung-dong Cafes', ja: '行宮洞カフェ通り', zh: '行宫洞咖啡街', lat: 37.2830, lng: 127.0150, zoom: 15 },
      { ko: '통닭거리 미식', en: 'Fried Chicken Street', ja: 'チキン通り', zh: '炸鸡一条街', lat: 37.2790, lng: 127.0175, zoom: 15 }
    ],
    descKo: '유네스코 세계문화유산 수원화성과 감성 가득한 행리단길 투어',
    descEn: 'UNESCO World Heritage fortress walking trails and vibrant cafe culture in Haengridan-gil.',
    descJa: 'ユネスコ世界遺産の水原華城とレトロな行宮洞カフェ通りを巡る旅',
    descZh: '漫步联合国教科文组织世界遗产水原华城与充满情调的行宫洞'
  },
  { 
    nameKo: '부산', 
    nameEn: 'Busan', 
    nameJa: '釜山',
    nameZh: '釜山',
    lat: 35.1796, 
    lng: 129.0756,
    zoom: 12,
    image: '/images/themes/theme-busan.jpg',
    transitTipKo: '서울역에서 KTX 2시간 15분 / 김해공항 연결',
    transitTipEn: 'KTX from Seoul (2h 15m) / Gimhae Airport Link',
    transitTipJa: 'ソウル駅からKTXで2時間15分／金海空港直結',
    transitTipZh: '首尔站乘坐KTX约2小时15分/金海机场直通',
    foodieSecretKo: '자갈치시장 신선 활어회, 해운대 암소갈비, 부산 돼지국밥, 남포동 씨앗호떡',
    foodieSecretEn: 'Jagalchi Fresh Sashimi, Haeundae Beef Ribs, Busan Dwaeji Gukbap (Pork Soup), Nampo Ssiat Hotteok',
    foodieSecretJa: 'チャガルチ新鮮刺身, 海雲台韓牛カルビ, 釜山テジクッパ, 南浦洞シアホットク',
    foodieSecretZh: '札嘎其生鱼片, 海云台韩牛排骨, 釜山猪肉汤饭, 南浦洞坚果糖饼',
    nightHighlightKo: '광안대교 오션 드론 레이저쇼 & 해운대 더베이101 마천루 야경',
    nightHighlightEn: 'Gwangandaegyo Bridge Ocean Laser & Drone Show, The Bay 101 Skyline',
    nightHighlightJa: '広安大橋ドローンショー＆海雲台ザ・ベイ101夜景',
    nightHighlightZh: '广安大桥海上无人机秀与海云台The Bay 101夜景',
    highlights: [
      { ko: '해운대 블루라인파크', en: 'Haeundae Blueline Park', ja: '海雲台ブルーライン', zh: '海云台蓝线公园', lat: 35.1631, lng: 129.1764, zoom: 14 },
      { ko: '광안대교 드론쇼', en: 'Gwangandaegyo Bridge', ja: '広安大橋', zh: '广安大桥', lat: 35.1532, lng: 129.1189, zoom: 14 },
      { ko: '감천문화마을', en: 'Gamcheon Culture Village', ja: '甘川文化村', zh: '甘川文化村', lat: 35.0975, lng: 129.0106, zoom: 15 }
    ],
    descKo: '끝없는 푸른 바다와 다채로운 해양 액티비티, 신선한 미식의 해양 수도',
    descEn: 'Dynamic marine capital with ocean-view capsule trains and fresh seafood markets.',
    descJa: '青い海と多彩なアクティビティ、新鮮な海鮮グルメが楽しめる海洋都市',
    descZh: '坐拥绝美海岸胶囊列车与丰富海鲜美食的活力海洋之都'
  },
  { 
    nameKo: '제주', 
    nameEn: 'Jeju', 
    nameJa: '済州',
    nameZh: '济州',
    lat: 33.4996, 
    lng: 126.5312,
    zoom: 10,
    image: '/images/themes/theme-jeju.jpg',
    transitTipKo: '김포공항 국내선 1시간 / 렌터카·급행버스',
    transitTipEn: 'Flight from Gimpo (1 hr) / Express Tourist Bus',
    transitTipJa: '金浦空港から国内線1時間／レンタカー・急行バス',
    transitTipZh: '金浦机场国内线约1小时/租车或观光快线大巴',
    foodieSecretKo: '제주 흑돼지 근고기, 고기국수, 갈치조림 & 해물라면, 우도 땅콩 아이스크림',
    foodieSecretEn: 'Jeju Black Pork BBQ, Pork Noodle Soup (Gogi Guksu), Braised Cutlassfish & Seafood Ramen, Udo Peanut Ice Cream',
    foodieSecretJa: '済州黒豚焼肉, 肉うどん（コギククス）, 太刀魚の煮付け＆海鮮ラーメン, 牛島ピーナッツアイス',
    foodieSecretZh: '济州黑猪肉烤肉, 猪肉汤面, 辣炖带鱼与海鲜拉面, 牛岛花生冰淇淋',
    nightHighlightKo: '용두암 해안도로 야간 드라이브 & 새연교 미디어 조명 야경',
    nightHighlightEn: 'Yongduam Coastal Night Drive & Saeyeongyo Bridge Illuminations',
    nightHighlightJa: '竜頭岩海岸ナイトドライブ＆鳥島連結橋ライトアップ',
    nightHighlightZh: '龙头岩海岸公路夜间兜风与新缘桥梦幻夜景',
    highlights: [
      { ko: '성산일출봉', en: 'Seongsan Sunrise Peak', ja: '城山日出峰', zh: '城山日出峰', lat: 33.4581, lng: 126.9426, zoom: 14 },
      { ko: '협재 & 애월 해안도로', en: 'Hyeopjae & Aewol Coast', ja: '挟才・涯月海岸', zh: '挟才·涯月海岸', lat: 33.3941, lng: 126.2397, zoom: 14 },
      { ko: '우도 산호해변', en: 'Udo Island Coral Beach', ja: '牛島 サンゴビーチ', zh: '牛岛 珊瑚海滩', lat: 33.5042, lng: 126.9545, zoom: 14 }
    ],
    descKo: '에메랄드빛 청정 바다와 유네스코 세계자연유산이 빚어낸 힐링 아일랜드',
    descEn: 'Emerald ocean coastlines and volcanic natural wonders on Korea’s premier resort island.',
    descJa: 'エメラルドグリーンの海とユネスコ世界自然遺産が織りなす癒しの島',
    descZh: '拥有翡翠色纯净大海与联合国世界自然遗产的疗愈度假胜地'
  },
  { 
    nameKo: '경주', 
    nameEn: 'Gyeongju', 
    nameJa: '慶州',
    nameZh: '庆州',
    lat: 35.8562, 
    lng: 129.2247,
    zoom: 13,
    image: '/images/themes/theme-gyeongju.jpg',
    transitTipKo: '신경주역 KTX 2시간 / 황리단길 도보 여행',
    transitTipEn: 'KTX Singyeongju Station (2 hrs) / Walkable Hwangridan',
    transitTipJa: '新慶州駅KTXで2時間／皇理団通り徒歩観光',
    transitTipZh: '新庆州站乘坐KTX约2小时/皇理团路步行游览',
    foodieSecretKo: '경주 황남빵, 십원빵, 교리김밥, 떡갈비 쌈밥 정식',
    foodieSecretEn: 'Gyeongju Hwangnam Bread, 10-Won Cheese Bread, Gyori Kimbap, Tteokgalbi (Grilled Short Rib Patties)',
    foodieSecretJa: '慶州 皇南パン, 10ウォンパン, 校里キンパ, トッカルビ定食',
    foodieSecretZh: '庆州 皇南饼, 十元奶酪饼, 校里紫菜包饭, 牛肉饼定食',
    nightHighlightKo: '동궁과 월지(안압지) & 첨성대 야경 (달빛에 빛나는 신라 궁궐터)',
    nightHighlightEn: 'Donggung Palace & Wolji Pond, Cheomseongdae Moonlit Ancient Night View',
    nightHighlightJa: '東宮と月池（雁鴨池）＆瞻星台の夜景（ライトアップされた古都遺跡）',
    nightHighlightZh: '东宫与月池（雁鸭池）及瞻星台梦幻夜景',
    highlights: [
      { ko: '불국사 & 석굴암', en: 'Bulguksa Temple', ja: '仏国寺', zh: '佛国寺', lat: 35.7900, lng: 129.3320, zoom: 14 },
      { ko: '동궁과 월지 야경', en: 'Donggung & Wolji Pond', ja: '東宮と月池', zh: '东宫与月池', lat: 35.8341, lng: 129.2267, zoom: 15 },
      { ko: '황리단길 핫플', en: 'Hwangridan-gil Street', ja: '皇理団通り', zh: '皇理团路', lat: 35.8378, lng: 129.2096, zoom: 15 }
    ],
    descKo: '천년 신라의 찬란한 유적과 트렌디한 황리단길이 만나는 지붕 없는 박물관',
    descEn: 'Open-air museum of millennium Silla dynasty heritage meets retro Hanok cafes.',
    descJa: '千年王国新羅の歴史遺産とトレンディな皇理団通りが調和する古都',
    descZh: '千年新罗灿烂历史遗址与复古韩屋咖啡街交相辉映的无露天博物馆'
  },
  { 
    nameKo: '강릉', 
    nameEn: 'Gangneung', 
    nameJa: '江陵',
    nameZh: '江陵',
    lat: 37.7519, 
    lng: 128.8761,
    zoom: 12,
    image: '/images/themes/theme-gangneung.jpg',
    transitTipKo: '서울역에서 KTX 이음 1시간 40분',
    transitTipEn: 'KTX-Eum from Seoul Station (1h 40m)',
    transitTipJa: 'ソウル駅からKTXイウムで1時間40分',
    transitTipZh: '首尔站乘坐KTX-Eum约1小时40分钟',
    foodieSecretKo: '초당 순두부마을, 안목해변 핸드드립 스페셜티 커피, 중앙시장 닭강정',
    foodieSecretEn: 'Chodang Soft Tofu Village, Anmok Beach Specialty Hand-Drip Coffee, Central Market Dakgangjeong',
    foodieSecretJa: '草堂スンドゥブ村, 安木海岸ハンドドリップコーヒー, 中央市場タッカンジョン',
    foodieSecretZh: '草堂嫩豆腐村, 安木海滩手冲精品咖啡, 中央市场炸鸡块',
    nightHighlightKo: '경포호수 야간 달빛산책로 & 안목해변 오션뷰 카페거리 조명',
    nightHighlightEn: 'Gyeongpo Lake Moonlit Boardwalk & Anmok Beach Ocean View Cafe Lights',
    nightHighlightJa: '鏡浦湖ナイトウォーク＆安木海岸カフェ通り夜景',
    nightHighlightZh: '镜浦湖月色步道与安木海滩海景咖啡街夜景',
    highlights: [
      { ko: '안목 커피거리', en: 'Anmok Coffee Street', ja: '安木コーヒー通り', zh: '安木咖啡街', lat: 37.7719, lng: 128.9482, zoom: 15 },
      { ko: '경포대 에메랄드 해변', en: 'Gyeongpo Beach', ja: '鏡浦海水浴場', zh: '镜浦海水浴场', lat: 37.8055, lng: 128.9079, zoom: 14 },
      { ko: 'BTS 버스정류장', en: 'BTS Bus Stop', ja: 'BTSバス停', zh: 'BTS防弹少年团车站', lat: 37.8917, lng: 128.8276, zoom: 15 }
    ],
    descKo: '푸른 동해 바다와 짙은 커피 향이 어우러진 낭만적인 힐링 여행지',
    descEn: 'Romantic seaside city famous for specialty coffee aroma and crystal blue East Sea.',
    descJa: '青い東海と香ばしいコーヒーの香りが広がるロマンチックな癒しの地',
    descZh: '漫溢浓郁咖啡香气与蔚蓝东海美景的浪漫治愈之城'
  }
];

// 🏰 6대 인기 거점 퀵점프 칩 라인업 (수원 포함)
const POPULAR_QUICK_CITIES = [
  { nameKo: '서울', nameEn: 'Seoul', nameJa: 'ソウル', nameZh: '首尔', icon: '📍', lat: 37.5665, lng: 126.9780, zoom: 11 },
  { nameKo: '수원', nameEn: 'Suwon', nameJa: '水原', nameZh: '水原', icon: '🏰', lat: 37.2636, lng: 127.0286, zoom: 12 },
  { nameKo: '부산', nameEn: 'Busan', nameJa: '釜山', nameZh: '釜山', icon: '🌊', lat: 35.1796, lng: 129.0756, zoom: 11 },
  { nameKo: '제주', nameEn: 'Jeju', nameJa: '済州', nameZh: '济州', icon: '🌴', lat: 33.4996, lng: 126.5312, zoom: 10 },
  { nameKo: '경주', nameEn: 'Gyeongju', nameJa: '慶州', nameZh: '庆州', icon: '🏛️', lat: 35.8562, lng: 129.2247, zoom: 12 },
  { nameKo: '강릉', nameEn: 'Gangneung', nameJa: '江陵', nameZh: '江陵', icon: '☕', lat: 37.7519, lng: 128.8761, zoom: 12 }
];

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DesktopMapExplorer({ 
  lang = 'ko', 
  activeStage = 'explore', // 'explore' | 'chat' | 'itinerary'
  onNavigateStage,
  onSelectCityPlan,
  onOpenWeather,
  onOpenEssentials,
  // Chat Props
  chatMessages = [],
  isLoading = false,
  onSendMessage,
  onConfirmItinerary,
  onAddPoiToItinerary,
  sessionContext = {},
  onRemoveContextChip,
  onToggleContextChip,
  onResetChat,
  onUpdateTimeSlot,
  // Itinerary Props
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  savedTrips = [],
  onSelectTrip,
  onDeleteTrip,
  onCreateNewTrip,
  onSaveCurrentTrip,
  questionQuota = { remaining: 3, total: 3 },
  currentUser = null,
  onOpenGoogleAuth,
  onSyncTrips,
  onOpenRewardedAd
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [selectedLocation, setSelectedLocation] = useState(REGIONAL_FALLBACK_CENTERS[0]);
  const [selectedDays, setSelectedDays] = useState(3);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isMapExpandedFull, setIsMapExpandedFull] = useState(false);
  const [isMapExpandedInStage3, setIsMapExpandedInStage3] = useState(true);
  const [isSubwayModalOpen, setIsSubwayModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const numberedMarkersRef = useRef([]);

  // Current day spots for itinerary mode
  const currentDaySpots = React.useMemo(() => {
    if (!itineraryData?.dailySchedules) {
      return itineraryData?.spots || [];
    }
    const daySchedule = itineraryData.dailySchedules.find(s => s.day === activeDay);
    return daySchedule?.spots || itineraryData.spots || [];
  }, [itineraryData, activeDay]);

  // 🛡️ Bulletproof LatLng Validator
  const isValidLatLng = (lat, lng) => {
    const nLat = Number(lat);
    const nLng = Number(lng);
    return !isNaN(nLat) && !isNaN(nLng) && isFinite(nLat) && isFinite(nLng) && nLat > 30 && nLat < 45 && nLng > 120 && nLng < 135;
  };

  // 🛡️ Zero-Defect Safe flyTo Helper (prevents Leaflet NaN/zero-size projection crashes)
  const safeFlyTo = (targetLatLng, targetZoom = 14, options = { duration: 0.8 }) => {
    if (!leafletMapRef.current || !window.L) return;
    const map = leafletMapRef.current;
    const lat = Array.isArray(targetLatLng) ? Number(targetLatLng[0]) : Number(targetLatLng?.lat);
    const lng = Array.isArray(targetLatLng) ? Number(targetLatLng[1]) : Number(targetLatLng?.lng);
    if (!isValidLatLng(lat, lng)) return;
    const zoom = (typeof targetZoom === 'number' && !isNaN(targetZoom) && isFinite(targetZoom)) ? targetZoom : 14;
    try {
      const size = map.getSize?.();
      if (!size || size.x <= 0 || size.y <= 0) {
        map.setView([lat, lng], zoom, { animate: false });
        return;
      }
      map.flyTo([lat, lng], zoom, options);
    } catch (e) {
      try {
        map.setView([lat, lng], zoom, { animate: false });
      } catch (_) {}
    }
  };

  // 1. Leaflet Ready Check
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
    }
  }, []);

  // 🌟 Sync selectedLocation with itineraryData.targetCity when updated
  useEffect(() => {
    if (itineraryData?.targetCity) {
      const cityKey = itineraryData.targetCity;
      const found = REGIONAL_FALLBACK_CENTERS.find(c => 
        c.nameKo.includes(cityKey) || cityKey.includes(c.nameKo)
      );
      if (found && selectedLocation.nameKo !== cityKey) {
        setSelectedLocation(prev => ({
          ...prev,
          ...found,
          nameKo: cityKey
        }));
        if (isValidLatLng(found.lat, found.lng)) {
          safeFlyTo([found.lat, found.lng], found.zoom || 11, { duration: 0.8 });
        }
      }
    }
  }, [itineraryData?.targetCity]);

  // 2. Initialize Leaflet Map Instance with 100% Free Official Clean OpenStreetMap Tiles
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const southKoreaBounds = window.L.latLngBounds(SOUTH_KOREA_MAP_BOUNDS);
      const map = window.L.map(mapContainerRef.current, {
        center: [36.2, 127.8],
        zoom: 7.0,
        minZoom: 6.5,
        maxZoom: 18,
        maxBounds: southKoreaBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
      });

      // 🗺️ 언어별 지도 타일 동적 장착 (KO: OSM 국문, EN/JA/ZH: CartoDB Voyager 글로벌 영문)
      updateMapTileLayer(map, tileLayerRef, lang);

      leafletMapRef.current = map;

      // Click anywhere to select location (in explore/chat mode)
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        handleMapLocationSelected(lat, lng);
      });

      // Add Default Pin
      const initPinHtml = createMarkerPinHtml(selectedLocation.nameKo, selectedLocation.nameEn, lang);
      const customIcon = window.L.divIcon({
        html: initPinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      });

      markerRef.current = window.L.marker([selectedLocation.lat, selectedLocation.lng], { icon: customIcon }).addTo(map);

      map.whenReady(() => {
        map.invalidateSize();
      });
    }
  }, [isLeafletReady]);

  // 🗺️ 언어 변경 시 지도 타일 실시간 동적 스위칭 (KO: OSM 국문, EN/JA/ZH: CartoDB Voyager 글로벌 영문)
  useEffect(() => {
    if (leafletMapRef.current) {
      updateMapTileLayer(leafletMapRef.current, tileLayerRef, lang);
    }
  }, [lang]);

  // 3. Stage 3 (Itinerary Mode): Render Numbered Pins & Curved Routes on Map
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;
    const map = leafletMapRef.current;

    // Invalidate size on stage transition or layout toggle
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (activeStage === 'itinerary' && currentDaySpots.length > 0) {
      // Hide single explorer marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Clear old route markers
      numberedMarkersRef.current.forEach(m => m.remove());
      numberedMarkersRef.current = [];

      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      const validSpots = currentDaySpots.filter(sp => {
        const lat = Number(sp.lat || sp.mapy || sp.latitude);
        const lng = Number(sp.lng || sp.mapx || sp.longitude);
        return isValidLatLng(lat, lng);
      });

      const latLngs = [];

      validSpots.forEach((spot, idx) => {
        const lat = Number(spot.lat || spot.mapy || spot.latitude);
        const lng = Number(spot.lng || spot.mapx || spot.longitude);
        const spotPos = [lat, lng];
        latLngs.push(spotPos);

        const markerHtml = `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 13px;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
            border: 2px solid #ffffff;
            cursor: pointer;
          ">
            ${idx + 1}
          </div>
        `;

        const icon = window.L.divIcon({
          html: markerHtml,
          className: 'docked-map-pin-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = window.L.marker(spotPos, { icon }).addTo(map);
        marker.on('click', () => {
          if (onOpenDetail) onOpenDetail(spot);
          if (isValidLatLng(spotPos[0], spotPos[1])) {
            safeFlyTo(spotPos, 15, { duration: 0.5 });
          }
        });

        numberedMarkersRef.current.push(marker);
      });

      // Draw Smooth Curved Route
      if (latLngs.length > 1) {
        const curvedPath = generateSmoothCurvedRoute(latLngs);
        const polyline = window.L.polyline(curvedPath, {
          color: '#2563eb',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 6',
          lineCap: 'round'
        }).addTo(map);
        routeLayerRef.current = polyline;
      }

      // Fit Bounds
      if (latLngs.length > 0 && window.L) {
        const validC = latLngs.filter(p => isValidLatLng(p[0], p[1]));
        if (validC.length > 0) {
          const bounds = window.L.latLngBounds(validC);
          if (bounds && bounds.isValid()) {
            try {
              map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
            } catch (e) {}
          }
        }
      }
    } else {
      // Clear route layers in Explore & Chat mode and restore single pin
      numberedMarkersRef.current.forEach(m => m.remove());
      numberedMarkersRef.current = [];
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      if (markerRef.current && isValidLatLng(selectedLocation.lat, selectedLocation.lng)) {
        markerRef.current.addTo(map);
        markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      }
    }

    return () => clearTimeout(timer);
  }, [activeStage, currentDaySpots, activeDay, isMapExpandedFull, isMapExpandedInStage3]);

  // Handle Resize on Expand/Collapse & Stage transition
  useEffect(() => {
    if (leafletMapRef.current) {
      const timer = setTimeout(() => {
        if (!leafletMapRef.current || !window.L) return;
        try {
          leafletMapRef.current.invalidateSize();
          if (activeStage === 'itinerary' && currentDaySpots.length > 0) {
            const validSpots = currentDaySpots.filter(sp => {
              const lat = Number(sp.lat || sp.mapy || sp.latitude);
              const lng = Number(sp.lng || sp.mapx || sp.longitude);
              return isValidLatLng(lat, lng);
            });
            if (validSpots.length > 0) {
              const latLngs = validSpots.map(sp => [Number(sp.lat || sp.mapy || sp.latitude), Number(sp.lng || sp.mapx || sp.longitude)]);
              const bounds = window.L.latLngBounds(latLngs);
              if (bounds && bounds.isValid()) {
                leafletMapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
              }
            }
          }
        } catch (e) {}
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isMapExpandedFull, isMapExpandedInStage3, activeStage]);

  // 🌐 언어(lang) 변경 시 현재 선택된 도시의 실시간 명소 및 마커 라벨 즉시 동기화
  useEffect(() => {
    if (selectedLocation?.nameKo) {
      if (markerRef.current && window.L && isValidLatLng(selectedLocation.lat, selectedLocation.lng)) {
        const pinHtml = createMarkerPinHtml(selectedLocation.nameKo, selectedLocation.nameEn, lang);
        markerRef.current.setIcon(window.L.divIcon({
          html: pinHtml,
          className: 'vora-explorer-div-icon',
          iconSize: [0, 0]
        }));
      }
      enrichLocationWithLiveTourApi(selectedLocation, selectedLocation.nameKo, lang).then(enriched => {
        setSelectedLocation(prev => ({
          ...prev,
          ...enriched,
          nameEn: getLocalizedCityName(prev.nameKo, 'en'),
          nameJa: getLocalizedCityName(prev.nameKo, 'ja'),
          nameZh: getLocalizedCityName(prev.nameKo, 'zh')
        }));
      });
    }
  }, [lang]);

  const createMarkerPinHtml = (nameKo, nameEn, currentLang, customLabel = null) => {
    const label = customLabel || getLocalizedCityName(nameKo, currentLang);
    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #ffffff;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
        box-shadow: 0 8px 20px rgba(37,99,235,0.45), 0 0 0 3px rgba(255,255,255,0.95);
        border: 2px solid #ffffff;
        cursor: pointer;
        transform: translate(-50%, -50%);
        z-index: 999;
        animation: voraPinPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
        <span>📍 ${label}</span>
      </div>
    `;
  };

  // 🏝️ 대한민국 주요 도서/섬 공간 클러스터 (울릉도, 독도, 백령도, 신안, 완도, 진도 등)
  const KOREA_ISLAND_CLUSTERS = [
    { nameKo: '울릉도', nameEn: 'Ulleungdo Island', nameJa: '鬱陵島', nameZh: '郁陵岛', lat: 37.4843, lng: 130.9056, radiusKm: 45, city: '울릉' },
    { nameKo: '독도', nameEn: 'Dokdo Island', nameJa: '独島', nameZh: '独岛', lat: 37.2427, lng: 131.8686, radiusKm: 30, city: '독도' },
    { nameKo: '신안', nameEn: 'Sinan (Purple Island)', nameJa: '新安（パープル島）', nameZh: '新安（紫色岛）', lat: 34.8290, lng: 126.1080, radiusKm: 55, city: '신안' },
    { nameKo: '흑산도', nameEn: 'Heuksando Island', nameJa: '黒山島', nameZh: '黑山岛', lat: 34.6811, lng: 125.4414, radiusKm: 40, city: '신안' },
    { nameKo: '홍도', nameEn: 'Hongdo Island', nameJa: '紅島', nameZh: '红岛', lat: 34.6931, lng: 125.1953, radiusKm: 30, city: '신안' },
    { nameKo: '완도', nameEn: 'Wando Island', nameJa: '莞島', nameZh: '莞岛', lat: 34.3110, lng: 126.7550, radiusKm: 45, city: '완도' },
    { nameKo: '청산도', nameEn: 'Cheongsando Island', nameJa: '青山島', nameZh: '青山岛', lat: 34.1780, lng: 126.8790, radiusKm: 30, city: '완도' },
    { nameKo: '보길도', nameEn: 'Bogildo Island', nameJa: '甫吉島', nameZh: '甫吉岛', lat: 34.1530, lng: 126.5510, radiusKm: 30, city: '완도' },
    { nameKo: '백령도', nameEn: 'Baengnyeongdo Island', nameJa: '白翎島', nameZh: '白翎岛', lat: 37.9620, lng: 124.6730, radiusKm: 35, city: '백령도' },
    { nameKo: '대청도', nameEn: 'Daecheongdo Island', nameJa: '大青島', nameZh: '大青岛', lat: 37.8280, lng: 124.7100, radiusKm: 25, city: '백령도' },
    { nameKo: '연평도', nameEn: 'Yeonpyeongdo Island', nameJa: '延坪島', nameZh: '延坪岛', lat: 37.6690, lng: 125.6980, radiusKm: 30, city: '인천' },
    { nameKo: '강화도', nameEn: 'Ganghwado Island', nameJa: '江華島', nameZh: '江华岛', lat: 37.7460, lng: 126.4880, radiusKm: 35, city: '인천' },
    { nameKo: '우도', nameEn: 'Udo Island', nameJa: '牛島', nameZh: '牛岛', lat: 33.5042, lng: 126.9545, radiusKm: 20, city: '제주' },
    { nameKo: '가파도', nameEn: 'Gapado Island', nameJa: '加波島', nameZh: '加波岛', lat: 33.1690, lng: 126.2730, radiusKm: 20, city: '제주' },
    { nameKo: '마라도', nameEn: 'Marado Island', nameJa: '馬羅島', nameZh: '马罗岛', lat: 33.1180, lng: 126.2690, radiusKm: 20, city: '제주' },
    { nameKo: '추자도', nameEn: 'Chujado Island', nameJa: '楸子島', nameZh: '楸子岛', lat: 33.9570, lng: 126.2970, radiusKm: 30, city: '제주' },
    { nameKo: '거문도', nameEn: 'Geomundo Island', nameJa: '巨文島', nameZh: '巨文岛', lat: 34.0280, lng: 127.3100, radiusKm: 30, city: '여수' },
    { nameKo: '욕지도', nameEn: 'Yokjido Island', nameJa: '欲知島', nameZh: '欲知岛', lat: 34.6970, lng: 128.2580, radiusKm: 25, city: '통영' },
    { nameKo: '사량도', nameEn: 'Saryangdo Island', nameJa: '蛇梁島', nameZh: '蛇梁岛', lat: 34.8450, lng: 128.1970, radiusKm: 25, city: '통영' },
    { nameKo: '선유도', nameEn: 'Seonyudo Island', nameJa: '仙遊島', nameZh: '仙游岛', lat: 35.8110, lng: 126.4170, radiusKm: 30, city: '군산' },
    { nameKo: '안면도', nameEn: 'Anmyeondo Island', nameJa: '安眠島', nameZh: '安眠岛', lat: 36.5290, lng: 126.3680, radiusKm: 35, city: '태안' },
    { nameKo: '진도', nameEn: 'Jindo Island', nameJa: '珍島', nameZh: '珍岛', lat: 34.4860, lng: 126.2630, radiusKm: 40, city: '진도' }
  ];

  // 🎯 위경도 좌표에서 가장 가까운 대한민국 도시/섬을 0.001초 만에 감지하는 공간 매퍼
  const findClosestCityFromCoords = (targetLat, targetLng) => {
    for (const isl of KOREA_ISLAND_CLUSTERS) {
      const d = getDistanceKm(targetLat, targetLng, isl.lat, isl.lng);
      if (d <= (isl.radiusKm || 30)) {
        return { city: isl.city || isl.nameKo, distance: d, isIsland: true, nameKo: isl.nameKo };
      }
    }

    let minD = Infinity;
    let bestCity = '서울';
    
    for (const fc of REGIONAL_FALLBACK_CENTERS) {
      if (fc.lat && fc.lng) {
        const d = getDistanceKm(targetLat, targetLng, fc.lat, fc.lng);
        if (d < minD) {
          minD = d;
          bestCity = fc.nameKo;
        }
      }
    }
    for (const [cName, cData] of Object.entries(CITY_LOCAL_KNOWLEDGE)) {
      if (cData.lat && cData.lng) {
        const d = getDistanceKm(targetLat, targetLng, cData.lat, cData.lng);
        if (d < minD) {
          minD = d;
          bestCity = cName;
        }
      }
    }
    return { city: bestCity, distance: minD };
  };

  // 🏛️ 한국관광공사 TourAPI 4.0 실시간 정품 연동 보강 (전국 226개 시·군 100% 대응)
  const enrichLocationWithLiveTourApi = async (baseLoc, cityName, targetLang) => {
    try {
      const cleanCityKey = (cityName || '').replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
      const localKn = CITY_LOCAL_KNOWLEDGE[cleanCityKey] || CITY_LOCAL_KNOWLEDGE[cityName];
      // 🛡️ 거점 허브는 정확한 일치(Exact Match)로만 엄격 매칭 (엉뚱한 서울 매칭 100% 방지)
      const foundHub = cleanCityKey ? REGIONAL_FALLBACK_CENTERS.find(c => c.nameKo === cleanCityKey || c.nameKo === cityName) : null;

      let verifiedImage = (foundHub && foundHub.image) ? foundHub.image : (localKn?.image || '');
      let liveHighlights = [];
      let isAbstractHighlights = false;
      let allCleanSpots = [];

      // 🌟 1. [Architecture Rule] 검증된 대표 거점 허브(서울, 부산, 제주, 수원, 경주, 강릉 등)는 완벽한 정품 사진 & 하이라이트 100% 고정 보존!
      if (foundHub && foundHub.image) {
        verifiedImage = foundHub.image;
        if (foundHub.highlights && foundHub.highlights.length > 0) {
          liveHighlights = foundHub.highlights.map(h => ({
            ko: h.ko,
            en: h.en || h.ko,
            ja: h.ja || h.ko,
            zh: h.zh || h.ko,
            title: targetLang === 'ja' ? (h.ja || h.ko) : targetLang === 'en' ? (h.en || h.ko) : (targetLang === 'zh' || targetLang === 'zht') ? (h.zh || h.ko) : h.ko,
            name: targetLang === 'ja' ? (h.ja || h.ko) : targetLang === 'en' ? (h.en || h.ko) : (targetLang === 'zh' || targetLang === 'zht') ? (h.zh || h.ko) : h.ko,
            lat: h.lat || baseLoc.lat,
            lng: h.lng || baseLoc.lng,
            zoom: h.zoom || 14
          }));
        }
      }

      // 🛡️ 2. 거점 허브가 아닌 지식베이스 등록 도시 데이터 보강
      if (!foundHub && localKn && localKn.signatureHighlights && localKn.signatureHighlights.length > 0) {
        const sigKo = localKn.signatureHighlights || [];
        const sigEn = localKn.signatureHighlightsEn || sigKo;
        const sigJa = localKn.signatureHighlightsJa || sigKo;
        const sigZh = localKn.signatureHighlightsZh || sigKo;

        // 추상적인 문구('대표 랜드마크', '수변 생태공원', '역사 문화거리', '로컬 전통시장', '힐링 명소' 등)인지 검사
        isAbstractHighlights = sigKo.some(h => /(대표 랜드마크|수변 생태공원|역사 문화거리|로컬 전통시장|힐링 명소|핫플레이스|생태공원 & 숲길)/i.test(h));

        if (!isAbstractHighlights) {
          liveHighlights = sigKo.slice(0, 4).map((koName, idx) => ({
            ko: koName,
            en: sigEn[idx] || koName,
            ja: sigJa[idx] || koName,
            zh: sigZh[idx] || koName,
            title: targetLang === 'ja' ? (sigJa[idx] || koName) : targetLang === 'en' ? (sigEn[idx] || koName) : (targetLang === 'zh' || targetLang === 'zht') ? (sigZh[idx] || koName) : koName,
            name: targetLang === 'ja' ? (sigJa[idx] || koName) : targetLang === 'en' ? (sigEn[idx] || koName) : (targetLang === 'zh' || targetLang === 'zht') ? (sigZh[idx] || koName) : koName,
            lat: baseLoc.lat,
            lng: baseLoc.lng,
            zoom: 14
          }));

          // 구체적 랜드마크인 경우 실시간 TourAPI 핀포인트 사진 최우선 수신
          try {
            const landmarkSpots = await fetchPinpointLandmarkSpots(sigKo.slice(0, 2), targetLang, cityName);
            const foundPhotoSpot = landmarkSpots?.find(s => (s.image || s.firstimage) && !(s.image || s.firstimage).includes('default-spot'));
            if (foundPhotoSpot?.image || foundPhotoSpot?.firstimage) {
              verifiedImage = foundPhotoSpot.image || foundPhotoSpot.firstimage;
            }
          } catch {}
        }
      }

      // 🛡️ 3. 미등록 226개 소도시 및 사진 미확보 지역: TourAPI 인기순(arrange=P) 실시간 공공데이터 수신
      if (!foundHub && (!verifiedImage || isAbstractHighlights || liveHighlights.length === 0)) {
        let liveSpots = await fetchCityTourApiSpots(cleanCityKey || cityName, targetLang);
        if (!liveSpots || liveSpots.length === 0) {
          liveSpots = await fetchDynamicRealtimeSpots(cityName, targetLang);
        }
        if ((!liveSpots || liveSpots.length === 0) && baseLoc.lat && baseLoc.lng) {
          liveSpots = await fetchLocationBasedTourApiSpots(baseLoc.lat, baseLoc.lng, 25000, targetLang);
        }

        allCleanSpots = [];
        if (liveSpots && liveSpots.length > 0) {
          const cleanSpots = liveSpots.filter(sp => !/(소공원|어린이공원|마을쉼터|쌈지공원|노인정|놀이터|분관|관리소|교육관|주차장|공영주차장|현판|표지석|주민센터|배수지)/i.test(sp.title || sp.name || ''));
          const spotsToUse = cleanSpots.length > 0 ? cleanSpots : liveSpots;
          allCleanSpots = spotsToUse.map((sp) => {
            const rawTitle = (sp.title || sp.name || '').trim();
            return {
              title: rawTitle,
              name: rawTitle,
              ko: targetLang === 'ko' ? rawTitle : (sp.titleKo || rawTitle),
              en: targetLang === 'en' ? rawTitle : (sp.titleEn || rawTitle),
              ja: targetLang === 'ja' ? rawTitle : (sp.titleJa || rawTitle),
              zh: (targetLang === 'zh' || targetLang === 'zht') ? rawTitle : (sp.titleZh || rawTitle),
              lat: Number(sp.lat || sp.mapy) || baseLoc.lat,
              lng: Number(sp.lng || sp.mapx) || baseLoc.lng,
              zoom: 15
            };
          });

          const spotWithImg = spotsToUse.find(s => (s.firstimage || s.image)) || liveSpots.find(s => s.firstimage || s.image);
          if (spotWithImg?.firstimage || spotWithImg?.image) {
            verifiedImage = spotWithImg.firstimage || spotWithImg.image;
          }

          if (isAbstractHighlights || liveHighlights.length === 0) {
            liveHighlights = allCleanSpots.slice(0, 4);
          }
        }
      }

      if (!verifiedImage) {
        verifiedImage = localKn?.image || foundHub?.image || '';
      }

      return {
        ...baseLoc,
        image: verifiedImage,
        allSpots: allCleanSpots.length > 0 ? allCleanSpots : (baseLoc.allSpots || []),
        highlights: liveHighlights.length > 0 ? liveHighlights : (baseLoc.highlights || []),
        foodieSecret: localKn?.localFoodieSecret || baseLoc.foodieSecret || null,
        foodieSecretEn: localKn?.localFoodieSecretEn || baseLoc.foodieSecretEn || null,
        foodieSecretJa: localKn?.localFoodieSecretJa || baseLoc.foodieSecretJa || null,
        foodieSecretZh: localKn?.localFoodieSecretZh || baseLoc.foodieSecretZh || null,
        nightHighlight: localKn?.nightHighlights ? (typeof localKn.nightHighlights[0] === 'string' ? localKn.nightHighlights[0] : localKn.nightHighlights[0]?.name) : (baseLoc.nightHighlight || null),
        nightHighlightEn: localKn?.nightHighlightsEn ? localKn.nightHighlightsEn[0] : (localKn?.nightHighlights?.[0]?.nameEn || baseLoc.nightHighlightEn || null),
        nightHighlightJa: localKn?.nightHighlightsJa ? localKn.nightHighlightsJa[0] : (localKn?.nightHighlights?.[0]?.nameJa || baseLoc.nightHighlightJa || null),
        nightHighlightZh: localKn?.nightHighlightsZh ? localKn.nightHighlightsZh[0] : (localKn?.nightHighlights?.[0]?.nameZh || baseLoc.nightHighlightZh || null),
        transitTipKo: localKn?.transitTip || baseLoc.transitTipKo,
        transitTipEn: localKn?.transitTipEn || baseLoc.transitTipEn,
        transitTipJa: localKn?.transitTipJa || baseLoc.transitTipJa,
        transitTipZh: localKn?.transitTipZh || baseLoc.transitTipZh,
        descKo: localKn?.badge || baseLoc.descKo,
        descEn: localKn?.badgeEn || localKn?.descEn || baseLoc.descEn,
        descJa: localKn?.badgeJa || localKn?.descJa || baseLoc.descJa,
        descZh: localKn?.badgeZh || localKn?.descZh || baseLoc.descZh
      };
    } catch (err) {
      console.warn('[enrichLocationWithLiveTourApi] Error:', err);
      return {
        ...baseLoc,
        image: baseLoc.image || '/images/themes/theme-jeju.jpg'
      };
    }
  };

  const handleMapLocationSelected = async (lat, lng) => {
    setIsGeocoding(true);
    setIsPhotoLoading(true);

    // 🇰🇷 대한민국 관할 영토(위도 33.0 ~ 38.6, 경도 124.5 ~ 132.0) 외 클릭 시 안전 보정
    const isInsideKorea = isInSouthKorea(lat, lng);

    // 🎯 0.001초 즉시 가장 가까운 대한민국 도시/섬 감지 (지연/타임아웃 100% 방지)
    const closest = findClosestCityFromCoords(lat, lng);
    let detectedCityNameKo = (closest.isIsland || closest.distance <= 120) ? closest.city : '대한민국';
    let detectedCityNameEn = getCityMultilingualName(detectedCityNameKo, 'en') || 'Korea';
    let detectedFullAddr = `${detectedCityNameKo} 일대`;

    // 대한민국 영토 내부일 때만 Nominatim 역지오코딩 시도
    if (isInsideKorea) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=11&addressdetails=1&accept-language=ko`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          // 대한민국 국가 코드(kr)인 경우에만 지명 채택 (북한 kp, 중국 cn 등 원천 차단)
          if (data && data.address && (data.address.country_code === 'kr' || !data.address.country_code)) {
            const addr = data.address;
            const stateCandidate = addr.province || addr.state || '';
            
            const candList = [
              addr.island,
              addr.municipality,
              addr.village,
              addr.hamlet,
              addr.town,
              addr.city,
              addr.county,
              addr.borough,
              addr.district,
              addr.suburb,
              addr.province
            ].filter(Boolean);

            let matchedKey = '';
            for (const cand of candList) {
              const cClean = cand.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구|면|읍|도)$/, '').trim();
              if (CITY_LOCAL_KNOWLEDGE[cClean] || CITY_LOCAL_KNOWLEDGE[cand] || CITY_LOCAL_KNOWLEDGE[`${cClean}도`]) {
                matchedKey = cClean || cand;
                break;
              }
            }

            const primaryName = matchedKey || addr.island || addr.city || addr.county || addr.town || addr.borough || addr.district || '';
            if (primaryName && primaryName !== '대한민국') {
              const cleanPrimary = primaryName.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim() || primaryName;
              if (CITY_LOCAL_KNOWLEDGE[cleanPrimary] || closest.isIsland || closest.distance <= 150) {
                detectedCityNameKo = cleanPrimary;
                detectedFullAddr = `${stateCandidate} ${primaryName}`.trim();
              }
            }
          }
        }
      } catch {}
    }

    // 🌐 지자체 표준 다국어(영문/일문/중문) 동적 사전 매핑
    detectedCityNameEn = getCityMultilingualName(detectedCityNameKo, 'en') || detectedCityNameKo;

    // 🧠 보라 AI 학습 공식 로컬 지식베이스 매핑
    const cleanKey = detectedCityNameKo.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    const localKn = CITY_LOCAL_KNOWLEDGE[cleanKey] || CITY_LOCAL_KNOWLEDGE[detectedCityNameKo];
    const foundHub = cleanKey ? REGIONAL_FALLBACK_CENTERS.find(c => c.nameKo === cleanKey || c.nameKo === detectedCityNameKo) : null;

    const baseLoc = {
      nameKo: detectedCityNameKo,
      nameEn: localKn?.nameEn || detectedCityNameEn,
      nameJa: localKn?.nameJa || getCityMultilingualName(detectedCityNameKo, 'ja') || detectedCityNameKo,
      nameZh: localKn?.nameZh || getCityMultilingualName(detectedCityNameKo, 'zh') || detectedCityNameKo,
      fullAddress: detectedFullAddr,
      descKo: localKn?.badge || `${detectedCityNameKo} 대표 명소와 문화를 만끽하는 힐링 여행`,
      descEn: localKn?.badgeEn || `Discover iconic sights and cultural treasures in ${detectedCityNameEn}.`,
      descJa: localKn?.badgeJa || `${getCityMultilingualName(detectedCityNameKo, 'ja') || detectedCityNameKo}の美しい名所と文化を満喫するヒーリング旅`,
      descZh: localKn?.badgeZh || `探寻${getCityMultilingualName(detectedCityNameKo, 'zh') || detectedCityNameKo}代表性名胜与历史文化的治愈之旅`,
      transitTipKo: localKn?.transitTip || 'KTX 및 고속버스로 쾌속 연결',
      transitTipEn: 'Accessible via KTX and Express Bus',
      image: (foundHub && foundHub.image) ? foundHub.image : (localKn?.image || ''),
      foodieSecret: localKn?.localFoodieSecret || null,
      nightHighlight: localKn?.nightHighlights ? (typeof localKn.nightHighlights[0] === 'string' ? localKn.nightHighlights[0] : localKn.nightHighlights[0]?.name) : null,
      highlights: (foundHub && foundHub.highlights) ? foundHub.highlights : (localKn?.signatureHighlights?.slice(0, 4).map((h, idx) => ({ 
        ko: h, 
        en: localKn?.signatureHighlightsEn?.[idx] || h, 
        ja: localKn?.signatureHighlightsJa?.[idx] || h, 
        zh: localKn?.signatureHighlightsZh?.[idx] || h, 
        lat, lng, zoom: 14 
      })) || []),
      lat,
      lng,
      isPredefinedHub: Boolean(foundHub && foundHub.image)
    };

    setSelectedLocation(baseLoc);
    setIsGeocoding(false);

    if (markerRef.current && window.L) {
      markerRef.current.setLatLng([lat, lng]);
      const pinHtml = createMarkerPinHtml(baseLoc.nameKo, baseLoc.nameEn, lang);
      markerRef.current.setIcon(window.L.divIcon({
        html: pinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      }));
    }

    // 🏛️ TourAPI 실시간 정품 데이터 비동기 보정 (사진, 명소 3개, 반경 조회)
    enrichLocationWithLiveTourApi(baseLoc, detectedCityNameKo, lang)
      .then(enriched => {
        setSelectedLocation(enriched);
        setIsPhotoLoading(false);
      })
      .catch(() => {
        setIsPhotoLoading(false);
      });
  };

  const handleResetMap = () => {
    safeFlyTo([36.2, 127.8], 7.0, { duration: 0.8 });
  };

  const handleQuickCityClick = (city) => {
    setIsPhotoLoading(false);
    const cleanK = (city.nameKo || '').replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    const foundData = cleanK ? REGIONAL_FALLBACK_CENTERS.find(c => c.nameKo === cleanK || c.nameKo === city.nameKo) : null;
    const localKn = CITY_LOCAL_KNOWLEDGE[cleanK] || CITY_LOCAL_KNOWLEDGE[city.nameKo];

    const baseLoc = {
      ...(foundData || {}),
      nameKo: city.nameKo,
      nameEn: city.nameEn,
      nameJa: city.nameJa || localKn?.nameJa || city.nameKo,
      nameZh: city.nameZh || localKn?.nameZh || city.nameKo,
      lat: city.lat,
      lng: city.lng,
      image: foundData?.image || localKn?.image || '/images/themes/theme-jeju.jpg',
      highlights: (foundData?.highlights && foundData.highlights.length > 0)
        ? foundData.highlights
        : (localKn?.signatureHighlights ? localKn.signatureHighlights.slice(0, 4).map((h, idx) => ({ 
            ko: h, 
            en: localKn?.signatureHighlightsEn?.[idx] || h, 
            ja: localKn?.signatureHighlightsJa?.[idx] || h, 
            zh: localKn?.signatureHighlightsZh?.[idx] || h, 
            lat: city.lat, lng: city.lng, zoom: 14 
          })) : []),
      foodieSecret: localKn?.localFoodieSecret || foundData?.foodieSecret || null,
      nightHighlight: localKn?.nightHighlights ? (typeof localKn.nightHighlights[0] === 'string' ? localKn.nightHighlights[0] : localKn.nightHighlights[0]?.name) : (foundData?.nightHighlight || null),
      transitTipKo: localKn?.transitTip || foundData?.transitTipKo || '대중교통으로 편리하게 이동',
      descKo: localKn?.badge || foundData?.descKo || `${city.nameKo} 대표 명소 여행`,
      isPredefinedHub: Boolean(foundData?.image)
    };
    setSelectedLocation(baseLoc);

    if (isValidLatLng(city.lat, city.lng)) {
      safeFlyTo([city.lat, city.lng], city.zoom || 12, { duration: 0.8 });
    }

    if (markerRef.current && window.L && isValidLatLng(city.lat, city.lng)) {
      markerRef.current.setLatLng([city.lat, city.lng]);
      const pinHtml = createMarkerPinHtml(baseLoc.nameKo, baseLoc.nameEn, lang);
      markerRef.current.setIcon(window.L.divIcon({
        html: pinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      }));
    }

    // 🏛️ TourAPI 실시간 정품 데이터 비동기 보정
    enrichLocationWithLiveTourApi(baseLoc, city.nameKo, lang).then(enriched => {
      setSelectedLocation(enriched);
    });

    // 🌟 If already in Chat or Itinerary stage, automatically regenerate for the clicked city!
    if ((activeStage === 'chat' || activeStage === 'itinerary') && onSelectCityPlan) {
      onSelectCityPlan(city.nameKo, selectedDays);
    }
  };

  /**
   * 🎯 [Highlight Pill Click Handler & Map Pan/Zoom Interaction]
   * - 연계 코스 뱃지(Pill) 클릭 시 해당 명소 위경도 좌표로 부드럽게 Pan & Zoom(0.7s) 수행
   * - 마커 핀 라벨을 해당 명소 명칭으로 갱신하여 직관적인 위치 확인 제공
   */
  const handleHighlightSpotClick = (highlight) => {
    if (!highlight || !leafletMapRef.current) return;
    
    if (isValidLatLng(highlight.lat, highlight.lng)) {
      safeFlyTo([highlight.lat, highlight.lng], highlight.zoom || 15, { duration: 0.7 });
    }

    if (markerRef.current && window.L && isValidLatLng(highlight.lat, highlight.lng)) {
      markerRef.current.setLatLng([highlight.lat, highlight.lng]);
      const spotLabel = getHighlightName(highlight);
      const pinHtml = createMarkerPinHtml(highlight.ko, highlight.en, lang, spotLabel);
      markerRef.current.setIcon(window.L.divIcon({
        html: pinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      }));
    }
  };

  const handleStartPlan = () => {
    if (onSelectCityPlan) {
      onSelectCityPlan(selectedLocation.nameKo, selectedDays);
    }
  };

  // 🌟 Smart Stage Navigation (화면 전환만 수행하고, 사용자가 명시적으로 요청하지 않은 도시 자동 덮어쓰기 100% 영구 차단!)
  const handleStageNavigation = (targetStage) => {
    if (onNavigateStage) {
      onNavigateStage(targetStage);
    }
  };

  const getCityDisplayName = (city) => {
    if (!city) return '';
    const ko = city.nameKo || city.name || '';
    if (ko) return getLocalizedCityName(ko, lang);
    if (lang === 'en') return city.nameEn || ko;
    if (lang === 'ja') return city.nameJa || city.nameEn || ko;
    if (lang === 'zh' || lang === 'zht') return city.nameZh || city.nameEn || ko;
    return ko;
  };

  const getHighlightName = (hl) => {
    if (!hl) return '';
    if (typeof hl === 'string') return hl;
    let name = '';
    if (lang === 'en') name = hl.en || hl.nameEn || hl.titleEn;
    else if (lang === 'ja') name = hl.ja || hl.nameJa || hl.titleJa;
    else if (lang === 'zh' || lang === 'zht') name = hl.zh || hl.nameZh || hl.titleZh;
    else name = hl.ko || hl.nameKo || hl.titleKo;

    if (!name) name = hl.title || hl.name || hl.ko || hl.en || '';
    
    // 외국어 모드일 때 괄호 안 한국어 표기 정리 (예: "尚州银沙滩海边(상주은모래비치)" -> "尚州银沙滩海边")
    if (lang !== 'ko' && name && /[\u4e00-\u9fa5\u3040-\u30ffA-Za-z]/.test(name)) {
      name = name.replace(/\([가-힣\s]+\)$/, '').trim();
    }
    return name;
  };

  const getCleanCityKey = (name) => {
    if (!name) return '';
    const clean = name.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    if (CITY_LOCAL_KNOWLEDGE[clean]) return clean;
    if (CITY_LOCAL_KNOWLEDGE[name]) return name;
    return Object.keys(CITY_LOCAL_KNOWLEDGE).find(k => k === clean || name.startsWith(k) || k.startsWith(clean)) || null;
  };

// 🍲 Smart Multilingual Foodie & Nightview Translators
const COMMON_FOOD_TRANSLATIONS = {
  '광장시장 마약김밥': { en: 'Gwangjang Market Kimbap', ja: '広蔵市場 麻薬キンパ', zh: '广藏市场 紫菜包饭' },
  '육회': { en: 'Yukhoe (Beef Tartare)', ja: 'ユッケ', zh: '生牛肉' },
  '빈대떡': { en: 'Mung Bean Pancake', ja: 'ピンデトック', zh: '绿豆煎饼' },
  '성수동 스페셜티 브루잉 카페': { en: 'Seongsu Specialty Brew Cafe', ja: '聖水洞スペシャルティカフェ', zh: '圣水洞精品咖啡' },
  '종로 생선구이 백반': { en: 'Jongno Grilled Fish Set', ja: '鍾路 焼き魚定食', zh: '钟路 烤鱼套餐' },
  '성수동 감성 브런치': { en: 'Seongsu Hip Brunch', ja: '聖水洞ブランチ', zh: '圣水洞早午餐' },
  '익선동 한옥 베이커리': { en: 'Ikseon Hanok Bakery', ja: '益善洞韓屋ベーカリー', zh: '益善洞韩屋烘焙' },
  '광장시장 빈대떡': { en: 'Gwangjang Market Pancake', ja: '広蔵市場ピンデトック', zh: '广藏市场煎饼' },
  '마포 돼지갈비': { en: 'Mapo Pork Ribs', ja: '麻浦豚カルビ', zh: '麻浦烤猪排骨' },
  '수원 전통 왕갈비': { en: 'Suwon Wang-galbi (King Ribs)', ja: '水原王カルビ', zh: '水原王牛排骨' },
  '행리단길 감성 카페': { en: 'Haengridan Hanok Cafes', ja: '行理団通り韓屋カフェ', zh: '行理团路韩屋咖啡街' },
  '통닭거리 가마솥 치킨': { en: 'Cauldron Fried Chicken Street', ja: '水原チキン通り', zh: '炸鸡一条街' },
  '자갈치시장 신선 활어회': { en: 'Jagalchi Fresh Sashimi', ja: 'チャガルチ新鮮刺身', zh: '札嘎其生鱼片' },
  '해운대 암소갈비': { en: 'Haeundae Beef Ribs', ja: '海雲台韓牛カルビ', zh: '海云台韩牛排骨' },
  '부산 돼지국밥': { en: 'Busan Pork Soup (Dwaeji Gukbap)', ja: '釜山テジクッパ', zh: '釜山猪肉汤饭' },
  '남포동 씨앗호떡': { en: 'Nampo Ssiat Hotteok', ja: '南浦洞シアホットク', zh: '南浦洞坚果糖饼' },
  '제주 흑돼지 근고기': { en: 'Jeju Black Pork BBQ', ja: '済州黒豚焼肉', zh: '济州黑猪肉烤肉' },
  '고기국수': { en: 'Pork Noodle Soup (Gogi Guksu)', ja: '肉うどん（コギククス）', zh: '猪肉汤面' },
  '갈치조림 & 해물라면': { en: 'Braised Cutlassfish & Seafood Ramen', ja: '太刀魚の煮付け＆海鮮ラーメン', zh: '辣炖带鱼与海鲜拉面' },
  '우도 땅콩 아이스크림': { en: 'Udo Peanut Ice Cream', ja: '牛島ピーナッツアイス', zh: '牛岛花生冰淇淋' },
  '경주 황남빵': { en: 'Gyeongju Hwangnam Bread', ja: '慶州 皇南パン', zh: '庆州 皇南饼' },
  '십원빵': { en: '10-Won Cheese Bread', ja: '10ウォンパン', zh: '十元奶酪饼' },
  '교리김밥': { en: 'Gyori Kimbap', ja: '校里キンパ', zh: '校里紫菜包饭' },
  '떡갈비 쌈밥 정식': { en: 'Tteokgalbi (Grilled Short Rib Patties)', ja: 'トッカルビ定食', zh: '牛肉饼定食' },
  '초당 순두부마을': { en: 'Chodang Soft Tofu Village', ja: '草堂スンドゥブ村', zh: '草堂嫩豆腐村' },
  '안목해변 핸드드립 스페셜티 커피': { en: 'Anmok Beach Specialty Hand-Drip Coffee', ja: '安木海岸ハンドドリップコーヒー', zh: '安木海滩手冲精品咖啡' },
  '중앙시장 닭강정': { en: 'Central Market Dakgangjeong', ja: '中央市場タッカンジョン', zh: '中央市场炸鸡块' },
  '전주 비빔밥': { en: 'Jeonju Bibimbap', ja: '全州ビビンバ', zh: '全州石锅拌饭' },
  '전주 콩나물국밥': { en: 'Jeonju Bean Sprout Soup', ja: '全州もやしクッパ', zh: '全州豆芽汤饭' },
  '춘천 닭갈비': { en: 'Chuncheon Dakgalbi (Spicy Chicken)', ja: '春川タッカルビ', zh: '春川炒鸡排' },
  '막국수': { en: 'Buckwheat Makguksu', ja: 'マッククス', zh: '荞麦凉面' },
  '안동 찜닭': { en: 'Andong Jjimdak (Braised Chicken)', ja: '安東チムタク', zh: '安东炖鸡' },
  '간고등어': { en: 'Salted Mackerel', ja: '塩サバ', zh: '盐渍青花鱼' },
  '포항 물회': { en: 'Pohang Mulhoe (Cold Raw Fish Soup)', ja: '浦項ムルフェ', zh: '浦项水拌生鱼片' },
  '여수 돌게장': { en: 'Yeosu Soy Crab', ja: '麗水カニ醤油漬け', zh: '丽水酱蟹' },
  '돌산 갓김치': { en: 'Dolsan Mustard Kimchi', ja: '突山からし菜キムチ', zh: '突山芥菜辛奇' },
  '통영 충무김밥': { en: 'Tongyeong Chungmu Kimbap', ja: '統営忠武キンパ', zh: '统营忠武紫菜包饭' },
  '꿀빵': { en: 'Honey Bread', ja: 'クルパン', zh: '蜂蜜面包' }
};

function translateFoodieSecret(foodStr, lang, cityName = '') {
  if (!foodStr || lang === 'ko') return foodStr;
  const localCity = cityName ? getLocalizedCityName(cityName, lang) : '';

  if (foodStr.includes('로컬 대표 향토음식') || foodStr.includes('전통시장 시그니처 먹거리') || foodStr.includes('향토음식')) {
    if (lang === 'en') return `${localCity || 'Local'} Signature Specialties & Traditional Market Foodie Gems`;
    if (lang === 'ja') return `${localCity || '地域'}の郷土料理＆伝統市場名物グルメ`;
    if (lang === 'zh' || lang === 'zht') return `${localCity || '当地'}地道特色美食与传统市场小吃`;
  }

  const items = foodStr.split(/[,•|·]/).map(s => s.trim()).filter(Boolean);
  const translated = items.map(item => {
    if (COMMON_FOOD_TRANSLATIONS[item]) {
      const entry = COMMON_FOOD_TRANSLATIONS[item];
      return entry[lang] || (lang === 'zht' ? entry.zh : null) || entry.en || item;
    }
    for (const [k, v] of Object.entries(COMMON_FOOD_TRANSLATIONS)) {
      if (item.includes(k) || k.includes(item)) {
        return v[lang] || (lang === 'zht' ? v.zh : null) || v.en || item;
      }
    }
    return item;
  });
  return translated.join(', ');
}

function translateNightHighlight(nightStr, lang, cityName = '') {
  if (!nightStr || lang === 'ko') return nightStr;
  const localCity = cityName ? getLocalizedCityName(cityName, lang) : '';

  if (nightStr.includes('도심 야경 산책로') || nightStr.includes('밤마실') || nightStr.includes('야경 산책로')) {
    if (lang === 'en') return `${localCity || 'City'} Scenic Night Walk (Romantic promenade under cozy street lights)`;
    if (lang === 'ja') return `${localCity || '市内'}の夜景散歩道（ライトアップされた夜の散策路）`;
    if (lang === 'zh' || lang === 'zht') return `${localCity || '城市'}夜景漫步道（灯光璀璨的夜间漫步好去处）`;
  }
  if (nightStr.includes('수변산책로') || nightStr.includes('달빛')) {
    if (lang === 'en') return `${localCity || 'Riverside'} Moonlit Boardwalk & Sparkling Night Lights`;
    if (lang === 'ja') return `${localCity || '水辺'}の月夜のウォーターフロント散歩道`;
    if (lang === 'zh' || lang === 'zht') return `${localCity || '水滨'}月色水滨步道与夜间灯光`;
  }
  if (nightStr.includes('N서울타워') || nightStr.includes('남산')) {
    if (lang === 'en') return 'N Seoul Tower & Namsan Panorama (360° City Night View & Love Padlocks)';
    if (lang === 'ja') return 'Nソウルタワー＆南山パノラマ（都心360度夜景＆愛の南京錠）';
    if (lang === 'zh' || lang === 'zht') return 'N首尔塔与南山全景（首尔360度全景夜景与爱情锁名所）';
  }
  if (nightStr.includes('수원화성') || nightStr.includes('방화수류정')) {
    if (lang === 'en') return 'Suwon Hwaseong Fortress & Banghwasuryujeong Moonlit Night View';
    if (lang === 'ja') return '水原華城・訪花随柳亭の月夜散歩';
    if (lang === 'zh' || lang === 'zht') return '수원 화성 방화수류정 야경';
  }
  if (nightStr.includes('광안대교') || nightStr.includes('더베이')) {
    if (lang === 'en') return 'Gwangandaegyo Bridge Ocean Laser & Drone Show, The Bay 101 Skyline';
    if (lang === 'ja') return '広安大橋ドローンレーザーショー＆ザ・ベイ101夜景';
    if (lang === 'zh' || lang === 'zht') return '广安大桥海上无人机秀与The Bay 101夜景';
  }
  if (nightStr.includes('동궁과 월지') || nightStr.includes('안압지') || nightStr.includes('첨성대')) {
    if (lang === 'en') return 'Donggung Palace & Wolji Pond Moonlit Ancient Night View';
    if (lang === 'ja') return '東宮と月池（雁鴨池）＆瞻星台の古都夜景';
    if (lang === 'zh' || lang === 'zht') return '东宫与月池及瞻星台梦幻夜景';
  }
  if (nightStr.includes('경포') || nightStr.includes('안목')) {
    if (lang === 'en') return 'Gyeongpo Lake Moonlit Boardwalk & Anmok Ocean Cafe Lights';
    if (lang === 'ja') return '鏡浦湖ナイトウォーク＆安木海岸カフェ通り夜景';
    if (lang === 'zh' || lang === 'zht') return '镜浦湖月色步道与安木海滩海景咖啡街夜景';
  }
  if (nightStr.includes('DDP') || nightStr.includes('동대문')) {
    if (lang === 'en') return 'DDP Dongdaemun LED Media Facade & Moonlight Picnic';
    if (lang === 'ja') return 'DDP東大門メディアファサード＆ムーンライトピクニック';
    if (lang === 'zh' || lang === 'zht') return 'DDP东大门设计广场LED媒体灯光秀与月色野餐';
  }
  if (nightStr.includes('용두암') || nightStr.includes('새연교')) {
    if (lang === 'en') return 'Yongduam Coastal Night Drive & Saeyeongyo Bridge Illuminations';
    if (lang === 'ja') return '竜頭岩海岸ナイトドライブ＆鳥島連結橋ライトアップ';
    if (lang === 'zh' || lang === 'zht') return '龙头岩海岸公路夜间兜风与新缘桥梦幻夜景';
  }
  return nightStr;
}

  const getSelectedDesc = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    const cityData = (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]) || CITY_LOCAL_KNOWLEDGE[selectedLocation.nameKo] || null;
    const localizedCity = getLocalizedCityName(selectedLocation.nameKo, lang);
    if (cityData) {
      if (lang === 'en') return cityData.badgeEn || cityData.descEn || selectedLocation.descEn || cityData.badge;
      if (lang === 'ja') return cityData.badgeJa || cityData.descJa || selectedLocation.descJa || cityData.badge;
      if (lang === 'zh' || lang === 'zht') return cityData.badgeZh || cityData.descZh || selectedLocation.descZh || cityData.badge;
      return cityData.badge || selectedLocation.descKo;
    }

    if (lang === 'en') return selectedLocation.descEn || `Discover iconic sights and cultural treasures in ${localizedCity}.`;
    if (lang === 'ja') return selectedLocation.descJa || `${localizedCity}の美しい名所と文化を満喫するヒーリング旅`;
    if (lang === 'zh' || lang === 'zht') return selectedLocation.descZh || `探寻${localizedCity}代表性名胜与历史文化的治愈之旅`;
    return selectedLocation.descKo || `${selectedLocation.nameKo} 대표 명소와 문화를 만끽하는 힐링 여행`;
  };

  const getSelectedTransitTip = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    const cityData = (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]) || CITY_LOCAL_KNOWLEDGE[selectedLocation.nameKo] || null;
    if (cityData?.transitTip) {
      if (lang === 'en') return cityData.transitTipEn || selectedLocation.transitTipEn || 'Accessible via Subway & KTX';
      if (lang === 'ja') return cityData.transitTipJa || selectedLocation.transitTipJa || '地下鉄・KTXで快適アクセス';
      if (lang === 'zh' || lang === 'zht') return cityData.transitTipZh || selectedLocation.transitTipZh || '地铁与KTX快速直达';
      return cityData.transitTip;
    }
    if (lang === 'en') return selectedLocation.transitTipEn || 'Fast Public Transit Access';
    if (lang === 'ja') return selectedLocation.transitTipJa || '公共交通で快速移動';
    if (lang === 'zh' || lang === 'zht') return selectedLocation.transitTipZh || '便捷公共交通直达';
    return selectedLocation.transitTipKo || t.publicTransitFast || '대중교통 쾌속 이동';
  };

  const getSelectedFoodieSecret = () => {
    const cityName = selectedLocation.nameKo || '';
    if (lang === 'en' && selectedLocation.foodieSecretEn) return selectedLocation.foodieSecretEn;
    if (lang === 'ja' && selectedLocation.foodieSecretJa) return selectedLocation.foodieSecretJa;
    if ((lang === 'zh' || lang === 'zht') && selectedLocation.foodieSecretZh) return selectedLocation.foodieSecretZh;

    const cleanCityKey = getCleanCityKey(cityName);
    const cityData = (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]) || CITY_LOCAL_KNOWLEDGE[cityName] || null;
    if (cityData) {
      if (lang === 'en' && cityData.localFoodieSecretEn) return cityData.localFoodieSecretEn;
      if (lang === 'ja' && cityData.localFoodieSecretJa) return cityData.localFoodieSecretJa;
      if ((lang === 'zh' || lang === 'zht') && cityData.localFoodieSecretZh) return cityData.localFoodieSecretZh;
      if (cityData.localFoodieSecret) return translateFoodieSecret(cityData.localFoodieSecret, lang, cityName);
    }
    if (selectedLocation.foodieSecret) return translateFoodieSecret(selectedLocation.foodieSecret, lang, cityName);
    return null;
  };

  const getSelectedNightHighlight = () => {
    const cityName = selectedLocation.nameKo || '';
    if (lang === 'en' && selectedLocation.nightHighlightEn) return selectedLocation.nightHighlightEn;
    if (lang === 'ja' && selectedLocation.nightHighlightJa) return selectedLocation.nightHighlightJa;
    if ((lang === 'zh' || lang === 'zht') && selectedLocation.nightHighlightZh) return selectedLocation.nightHighlightZh;

    const cleanCityKey = getCleanCityKey(cityName);
    const cityData = (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]) || CITY_LOCAL_KNOWLEDGE[cityName] || null;
    if (cityData?.nightHighlights && cityData.nightHighlights.length > 0) {
      const nh = cityData.nightHighlights[0];
      const nhRawStr = typeof nh === 'string' ? nh : (nh.name && nh.desc ? `${nh.name} (${nh.desc})` : nh.name || '');
      if (lang === 'en') return (nh.nameEn && nh.descEn) ? `${nh.nameEn} (${nh.descEn})` : nh.nameEn || translateNightHighlight(nhRawStr, lang, cityName);
      if (lang === 'ja') return (nh.nameJa && nh.descJa) ? `${nh.nameJa} (${nh.descJa})` : nh.nameJa || translateNightHighlight(nhRawStr, lang, cityName);
      if (lang === 'zh' || lang === 'zht') return (nh.nameZh && nh.descZh) ? `${nh.nameZh} (${nh.descZh})` : nh.nameZh || translateNightHighlight(nhRawStr, lang, cityName);
      return nhRawStr;
    }
    if (selectedLocation.nightHighlight) return translateNightHighlight(selectedLocation.nightHighlight, lang, cityName);
    return null;
  };

  return (
    <div className="desktop-map-explorer-container hide-mobile" style={{
      width: '100%',
      maxWidth: '1260px',
      margin: '0.35rem auto 0.25rem',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08)',
      overflow: 'hidden',
      padding: '0.9rem 1.1rem 1.1rem 1.1rem',
      boxSizing: 'border-box'
    }}>
      {/* =========================================================================
          🌟 3-Zone Smart Top Header (모핑 스테이지 연동 1단계 ↔ 2단계 ↔ 3단계)
          ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        paddingBottom: '0.65rem',
        borderBottom: '1px solid #f1f5f9',
        gap: '0.8rem'
      }}>
        {/* [Zone 1. 좌측 컨트롤/복귀 탭 그룹] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: '#f8fafc',
          padding: '0.25rem 0.45rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          {activeStage === 'explore' ? (
            <>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                marginRight: '0.15rem'
              }}>
                <Compass size={14} />
              </div>
              <button
                onClick={() => leafletMapRef.current && leafletMapRef.current.zoomIn()}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={lang === 'en' ? 'Zoom In' : '확대'}
              >
                <ZoomIn size={12} color="#0f172a" />
              </button>
              <button
                onClick={() => leafletMapRef.current && leafletMapRef.current.zoomOut()}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={lang === 'en' ? 'Zoom Out' : '축소'}
              >
                <ZoomOut size={12} color="#0f172a" />
              </button>
              <button
                onClick={handleResetMap}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title={lang === 'en' ? 'View Whole Country' : '전국 전도 리셋'}
              >
                <RefreshCw size={10} />
                <span>{lang === 'en' ? 'All Korea' : lang === 'ja' ? '全国表示' : (lang === 'zh' || lang === 'zht') ? '全国地图' : '전국 보기'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleStageNavigation('explore')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#2563eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="1단계 도시 탐색으로 돌아가기"
            >
              <ArrowLeft size={13} />
              <span>
                {lang === 'en' ? '🔄 Explore Other Cities' :
                 lang === 'ja' ? '🔄 他の都市を探索' :
                 (lang === 'zh' || lang === 'zht') ? '🔄 探索其他城市' :
                 '🔄 다른 도시 탐색'}
              </span>
            </button>
          )}
        </div>

        {/* [Zone 2. 중앙 상태 안내 문구] */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left', paddingLeft: '0.3rem', paddingRight: '0.6rem' }}>
          <h2 style={{
            fontSize: '0.96rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {activeStage === 'explore' && (
              <span>
                {lang === 'en' ? '🧭 Anywhere in Korea, Your Journey Begins Here' : 
                 lang === 'ja' ? '🧭 韓国のどこへでも、旅はここから始まります' : 
                 (lang === 'zh' || lang === 'zht') ? '🧭 韩国全域，专属旅程由此启程' : 
                 '🧭 대한민국 어디든, 여행은 여기서 시작됩니다.'}
              </span>
            )}
            {activeStage === 'chat' && (
              <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={15} color="#2563eb" />
                <span>{t.dialogTuningHeader ? t.dialogTuningHeader(getLocalizedCityName(selectedLocation.nameKo || itineraryData?.targetCity || '', lang)) : `${selectedLocation.nameKo || itineraryData?.targetCity || '맞춤 여행'} 1:1 VORA AI`}</span>
              </span>
            )}
            {activeStage === 'itinerary' && (
              <span style={{ color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={15} color="#7c3aed" />
                <span>{t.timelineTuningHeader ? t.timelineTuningHeader(getLocalizedCityName(itineraryData?.targetCity || selectedLocation.nameKo || '', lang), itineraryData?.days) : `${itineraryData?.targetCity || selectedLocation.nameKo || '추천'} ${itineraryData?.days || 3}일차`}</span>
              </span>
            )}
          </h2>
        </div>

        {/* [Zone 3. 우측 액션 / 6대 인기 거점 칩] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexShrink: 0,
          maxWidth: '100%',
          paddingBottom: '2px'
        }}>
          {activeStage === 'explore' && POPULAR_QUICK_CITIES.map((city) => {
            const isSelected = selectedLocation.nameKo.includes(city.nameKo) || city.nameKo.includes(selectedLocation.nameKo);
            return (
              <button
                key={city.nameKo}
                onClick={() => handleQuickCityClick(city)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isSelected 
                    ? '1px solid #f43f5e' 
                    : '1px solid #f0ebe1',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)' 
                    : '#ffffff',
                  color: isSelected ? '#ffffff' : '#57534e',
                  boxShadow: isSelected ? '0 3px 10px rgba(124, 58, 237, 0.35)' : 'none',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                <span>{city.icon}</span>
                <span>{getCityDisplayName(city)}</span>
                {isSelected && <span style={{ fontSize: '0.65rem' }}>★</span>}
              </button>
            );
          })}

          {activeStage === 'chat' && (
            <button
              onClick={() => handleStageNavigation('itinerary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.32rem 0.85rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <span>{t.viewTimeline || '📋 일정표 보기'}</span>
              <ChevronRight size={13} />
            </button>
          )}

          {activeStage === 'itinerary' && (
            <button
              onClick={() => setIsMapExpandedInStage3(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: isMapExpandedInStage3 ? '#eff6ff' : '#f5f3ff',
                color: isMapExpandedInStage3 ? '#2563eb' : '#7c3aed',
                border: isMapExpandedInStage3 ? '1px solid #bfdbfe' : '1px solid #ddd6fe',
                borderRadius: '9999px',
                padding: '0.32rem 0.85rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Navigation size={13} />
              <span>{isMapExpandedInStage3 ? (t.dualChatTimeline || '💬 대화창+일정표 듀얼') : (t.viewRouteMap || '🗺️ 동선 지도 보기')}</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          🌟 2-Column Split Workspace (1·2단계: 지도 50% ↔ 우측 50% | 3단계: 도킹레일 46px ↔ 대화45%+일정표55%)
          ========================================================================= */}
      <div style={{
        display: 'flex',
        gap: '12px',
        height: '580px',
        width: '100%',
        position: 'relative'
      }}>
        {/* [1. 좌측 영역 (도킹 툴바 + 인터랙티브 지도)] */}
        <div style={{
          flex: activeStage === 'itinerary'
            ? (isMapExpandedInStage3 ? '1 1 50%' : '0 0 46px')
            : (isMapExpandedFull ? '1 1 100%' : '1 1 54%'),
          width: activeStage === 'itinerary'
            ? (isMapExpandedInStage3 ? '50%' : '46px')
            : (isMapExpandedFull ? '100%' : '54%'),
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          backgroundColor: '#ffffff'
        }}>
          {/* 🌟 좌측 일체형 도킹 툴바 (선배님 캡처 100% 일치) */}
          <div style={{
            width: '46px',
            height: '100%',
            backgroundColor: '#f8fafc',
            borderRight: (activeStage === 'itinerary' && !isMapExpandedInStage3) ? 'none' : '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0 8px 0',
            boxSizing: 'border-box',
            zIndex: 10,
            flexShrink: 0
          }}>
            {/* 상단 툴 아이콘 그룹 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
              <button
                onClick={() => {
                  if (activeStage === 'itinerary') {
                    setIsMapExpandedInStage3(prev => !prev);
                  } else {
                    handleStageNavigation('explore');
                  }
                }}
                title={lang === 'en' ? 'Explore Map' : '지도 탐색'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: (activeStage === 'explore' || (activeStage === 'itinerary' && isMapExpandedInStage3)) ? '1px solid #bfdbfe' : 'none',
                  backgroundColor: (activeStage === 'explore' || (activeStage === 'itinerary' && isMapExpandedInStage3)) ? '#eff6ff' : 'transparent',
                  color: (activeStage === 'explore' || (activeStage === 'itinerary' && isMapExpandedInStage3)) ? '#2563eb' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Compass size={17} />
              </button>

              <button
                onClick={() => onOpenWeather && onOpenWeather(selectedLocation.nameKo || '서울')}
                title={lang === 'en' ? 'Weather & Temperature' : '실시간 날씨 & 체감온도'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <CloudSun size={17} />
              </button>

              <button
                onClick={() => onOpenEssentials && onOpenEssentials()}
                title={lang === 'en' ? 'Transit Pass (Climate Card/T-money)' : '교통 패스 (기후동행카드/T-money)'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <CreditCard size={17} />
              </button>

              <button
                onClick={() => setIsSubwayModalOpen(true)}
                title={lang === 'en' ? 'Subway Route Map' : '전국 지하철 노선도'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Train size={17} />
              </button>

              <button
                onClick={() => onOpenEssentials && onOpenEssentials()}
                title={lang === 'en' ? 'Korea eSIM / SIM' : '한국 eSIM / 유심 안내'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Wifi size={17} />
              </button>

              <button
                onClick={() => setIsHelplineModalOpen(true)}
                title={lang === 'en' ? '1330 Korea Travel Helpline' : '1330 관광 통역 안내'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <PhoneCall size={17} />
              </button>
            </div>

            {/* 하단 VORA 심볼 */}
            <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.02em' }}>
              VORA
            </span>
          </div>

          {/* 메인 좌측 인터랙티브 지도 뷰 (항상 DOM에 유지하여 Leaflet 인스턴스 보존) */}
          <div style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', flex: 1, minHeight: '100%', zIndex: 1 }}
            />
          </div>

          {/* ◀ / ▶ 중앙 경계선 슬라이드 토글 알약 버튼 */}
          <button
            onClick={() => {
              if (activeStage === 'itinerary') {
                setIsMapExpandedInStage3(prev => !prev);
              } else {
                setIsMapExpandedFull(prev => !prev);
              }
            }}
            title={activeStage === 'itinerary' 
              ? (isMapExpandedInStage3 ? '대화창+일정표 듀얼 뷰로 복원' : '동선 지도 펼치기')
              : (isMapExpandedFull ? '우측 화면 복원' : '좌측 화면 전체확대')}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-1px',
              transform: 'translateY(-50%)',
              zIndex: 450,
              width: '26px',
              height: '56px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #2563eb',
              borderRight: 'none',
              borderRadius: '12px 0 0 12px',
              boxShadow: '-4px 0 12px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#2563eb',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.width = '30px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.width = '26px';
            }}
          >
            {activeStage === 'itinerary' 
              ? (isMapExpandedInStage3 ? <ChevronLeft size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />)
              : (isMapExpandedFull ? <ChevronLeft size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />)}
          </button>
        </div>

        {/* [2. 우측 워크스페이스 (1·2단계 또는 3단계 지도 펼침 시 46% 패널)] */}
        {(activeStage !== 'itinerary' || isMapExpandedInStage3) && (
          <div style={{
            flex: isMapExpandedFull ? '0 0 0px' : '1 1 46%',
            width: isMapExpandedFull ? 0 : '46%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: isMapExpandedFull ? 'none' : '1px solid #f0ebe1',
            boxShadow: '0 8px 24px rgba(41, 37, 36, 0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isMapExpandedFull ? 0 : 1,
            visibility: isMapExpandedFull ? 'hidden' : 'visible'
          }}>
            {/* STAGE 1 (EXPLORE): 4K 포토 매거진 프리뷰 카드 */}
            {activeStage === 'explore' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                {/* 🌟 1-Click Itinerary Generator Bar (선배님 피드백 반영: Days 1D~5D 선택 + 즉시 코스 생성 CTA) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  flexShrink: 0
                }}>
                  {/* Days Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b' }}>
                      {lang === 'en' ? 'Days:' : lang === 'ja' ? '日程:' : (lang === 'zh' || lang === 'zht') ? '天数:' : '일정:'}
                    </span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map((d) => {
                        const isSelected = selectedDays === d;
                        return (
                          <button
                            key={d}
                            onClick={() => setSelectedDays(d)}
                            style={{
                              padding: '2px 7px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                              backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#475569',
                              boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {d}D
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* One-Click Plan Generation Button with Gradient & Sparkle */}
                  <button
                    onClick={handleStartPlan}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.76rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #e11d48 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      boxShadow: '0 3px 12px rgba(225, 29, 72, 0.35)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      letterSpacing: '-0.01em'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 5px 16px rgba(225, 29, 72, 0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 3px 12px rgba(225, 29, 72, 0.35)';
                    }}
                  >
                    <Sparkles size={12} color="#ffffff" />
                    <span>
                      {lang === 'en' ? `🪄 ${getCityDisplayName(selectedLocation)} ${selectedDays}D Plan 🚀` :
                       lang === 'ja' ? `🪄 ${getCityDisplayName(selectedLocation)} ${selectedDays}日コース作成 🚀` :
                       (lang === 'zh' || lang === 'zht') ? `🪄 ${getCityDisplayName(selectedLocation)} ${selectedDays}日路线生成 🚀` :
                       `🪄 ${getCityDisplayName(selectedLocation)} ${selectedDays}일 코스 생성 🚀`}
                    </span>
                    <ChevronRight size={13} color="#ffffff" />
                  </button>
                </div>

                {/* Top 4K Photo Banner with Gradient Overlay */}
                <div style={{
                  position: 'relative',
                  height: '165px',
                  width: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc'
                }}>
                  {(isGeocoding || isPhotoLoading) ? (
                    /* 🕊️ 완전 정적이고 차분한 화이트 바탕 + 정중앙 로딩 뱃지 (쉬머/번쩍임 0%, 편안함 100%) */
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#ffffff',
                        padding: '9px 20px',
                        borderRadius: '9999px',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                        border: '1.5px solid #e2e8f0'
                      }}>
                        <RefreshCw size={14} color="#7c3aed" style={{ animation: 'voraSpin 1.2s linear infinite' }} />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', letterSpacing: '-0.01em' }}>
                          {lang === 'en' ? 'Connecting Live TourAPI 4.0...' : lang === 'ja' ? '韓国観光公社 4K 接続中...' : (lang === 'zh' || lang === 'zht') ? '正在连接韩国旅游发展局 4K 数据...' : '한국관광공사 TourAPI 4.0 실시간 연결 중...'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={selectedLocation.image} 
                        alt={selectedLocation.nameKo}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/themes/theme-gyeongbokgung.jpg';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          imageRendering: 'crisp-edges',
                          transition: 'opacity 0.25s ease'
                        }}
                      />
                      {/* Ultra-Clear Soft Scrim (하단 텍스트 영역의 시인성을 완벽 보장하는 다크 그라데이션) */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(15, 23, 42, 0.20) 45%, rgba(15, 23, 42, 0.65) 75%, rgba(15, 23, 42, 0.90) 100%)'
                      }} />

                      {/* Photo Overlay Title */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '16px',
                        right: '16px',
                        color: '#ffffff'
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'rgba(15, 23, 42, 0.78)',
                          backdropFilter: 'blur(6px)',
                          WebkitBackdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          borderRadius: '9999px',
                          padding: '2px 9px',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          color: '#ffffff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          marginBottom: '4px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)'
                        }}>
                          <CheckCircle2 size={11} color="#38bdf8" />
                          <span>📍 {lang === 'en' ? 'TourAPI Certified Destination' : lang === 'ja' ? '公式認証 観光地' : (lang === 'zh' || lang === 'zht') ? '官方认证 目的地' : '한국관광공사 정품 인증 여행지'}</span>
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)'
                        }}>
                          {getCityDisplayName(selectedLocation)}
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginLeft: '6px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                            {lang === 'ko' ? `(${getLocalizedCityName(selectedLocation.nameKo, 'en')})` : `(${selectedLocation.nameKo})`}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Middle Body: Description, 3 Highlights & Badges */}
                <div style={{
                  padding: '12px 14px 14px 14px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  overflowY: 'auto'
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.80rem',
                      color: '#334155',
                      lineHeight: '1.4',
                      margin: '0 0 8px',
                      fontWeight: 600
                    }}>
                      {getSelectedDesc()}
                    </p>

                    {/* ✦ VORA AI Recommended Course Flow (선택된 도시의 핵심 대표 동선) */}
                    {selectedLocation.highlights && selectedLocation.highlights.length > 0 && (
                      <div style={{
                        marginBottom: '8px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '5px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.70rem',
                            fontWeight: 900,
                            color: '#1e293b'
                          }}>
                            <Sparkles size={11} color="#2563eb" />
                            <span>
                              {lang === 'en' ? '✦ VORA Recommended Route Flow' :
                               lang === 'ja' ? '✦ VORA おすすめ連携コース' :
                               (lang === 'zh' || lang === 'zht') ? '✦ VORA 推荐连游路线' :
                               '✦ VORA AI 추천 연계 코스'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b' }}>
                            {lang === 'en' ? 'Click spot to fly on map 📍' : lang === 'ja' ? 'スポットをクリックして位置確認 📍' : (lang === 'zh' || lang === 'zht') ? '点击景点定位地图 📍' : '클릭 시 지도 이동 📍'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                          {selectedLocation.highlights.map((hl, hIdx) => {
                            const hlName = getHighlightName(hl);
                            return (
                              <React.Fragment key={hIdx}>
                                <button
                                  onClick={() => handleHighlightSpotClick(hl)}
                                  title="클릭 시 지도가 이 명소로 이동합니다"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    fontSize: '0.70rem',
                                    fontWeight: 800,
                                    color: '#1e293b',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    padding: '2px 7px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.color = '#2563eb';
                                    e.currentTarget.style.backgroundColor = '#eff6ff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#1e293b';
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                  }}
                                >
                                  <span style={{
                                    width: '13px',
                                    height: '13px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    fontSize: '8px',
                                    fontWeight: 900,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1
                                  }}>
                                    {hIdx + 1}
                                  </span>
                                  <span>{hlName}</span>
                                </button>
                                {hIdx < selectedLocation.highlights.length - 1 && (
                                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94a3b8', margin: '0 1px' }}>
                                    ➔
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 🍲 VORA Foodie Secret Pill Tags */}
                    {getSelectedFoodieSecret() && (
                      <div style={{
                        padding: '6px 8px',
                        backgroundColor: '#fff7ed',
                        borderRadius: '8px',
                        border: '1px solid #fed7aa',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <Utensils size={12} color="#ea580c" />
                          <span style={{ fontSize: '0.70rem', fontWeight: 900, color: '#9a3412' }}>
                            {lang === 'en' ? 'Local Foodie Picks' : lang === 'ja' ? 'ローカル美食' : (lang === 'zh' || lang === 'zht') ? '地道美食' : 'VORA 찐 미식'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {getSelectedFoodieSecret().split(/[,•|·/、，]/).map((item, iIdx) => {
                            const cleanItem = item.trim();
                            if (!cleanItem) return null;
                            return (
                              <span
                                key={iIdx}
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: '#c2410c',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #fed7aa',
                                  padding: '2px 7px',
                                  borderRadius: '9999px',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                {cleanItem}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 🌙 VORA Signature Night Highlight Card */}
                    {getSelectedNightHighlight() && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        padding: '6px 8px',
                        backgroundColor: '#f5f3ff',
                        borderRadius: '8px',
                        border: '1px solid #ddd6fe',
                        marginBottom: '8px'
                      }}>
                        <Moon size={12} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.70rem', color: '#6d28d9', lineHeight: '1.35' }}>
                          <span style={{ fontWeight: 900 }}>
                            {lang === 'en' ? 'Night View: ' : lang === 'ja' ? '夜景名所: ' : (lang === 'zh' || lang === 'zht') ? '夜景打卡: ' : '시그니처 야경: '}
                          </span>
                          <span>{getSelectedNightHighlight()}</span>
                        </div>
                      </div>
                    )}

                    {/* Practical Information Badges */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      padding: '4px 6px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Train size={11} />
                        <span>{getSelectedTransitTip()}</span>
                      </span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Ticket size={11} />
                        <span>TAX FREE</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* STAGE 2 (CHAT): VORA AI 맞춤 대화 조율창 */}
          {activeStage === 'chat' && (
            <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <VoraAIChat
                lang={lang}
                chatMessages={chatMessages}
                isLoading={isLoading}
                onSendMessage={onSendMessage}
                activeDay={activeDay}
                onSelectDay={onSelectDay}
                currentUser={currentUser}
                onConfirmItinerary={onConfirmItinerary}
                onViewTimeline={() => handleStageNavigation('itinerary')}
                onAddPoiToItinerary={onAddPoiToItinerary}
                sessionContext={sessionContext}
                onRemoveContextChip={onRemoveContextChip}
                onToggleContextChip={onToggleContextChip}
                onResetChat={onResetChat}
                onUpdateTimeSlot={onUpdateTimeSlot}
              />
            </div>
          )}

          {/* STAGE 3 (ITINERARY - 지도 펼침 50% 상태): 확정 타임라인 일정표 */}
          {activeStage === 'itinerary' && isMapExpandedInStage3 && (
            <div style={{ height: '100%', overflowY: 'auto', padding: '0.65rem' }}>
              <MyTripTab
                lang={lang}
                itineraryData={itineraryData}
                activeDay={activeDay}
                onSelectDay={onSelectDay}
                onOpenDetail={onOpenDetail}
                onGoToMap={() => setIsMapExpandedInStage3(prev => !prev)}
                onGoToModify={() => handleStageNavigation('chat')}
                onOpenWeather={onOpenWeather}
                onOpenEssentials={onOpenEssentials}
                savedTrips={savedTrips}
                onSelectTrip={onSelectTrip}
                onDeleteTrip={onDeleteTrip}
                onCreateNewTrip={onCreateNewTrip}
                onSaveCurrentTrip={onSaveCurrentTrip}
                currentUser={currentUser}
                onOpenGoogleAuth={onOpenGoogleAuth}
                onSyncTrips={onSyncTrips}
                onOpenRewardedAd={onOpenRewardedAd}
                isDesktop={true}
                isMapOpen={true}
              />
            </div>
          )}
        </div>
      )}

      {/* 🌟 STAGE 3 전용 메인 듀얼 워크스페이스: [좌측 45% AI 대화창] + [우측 55% 확정 일정표] (지도가 46px로 접혔을 때) */}
      {activeStage === 'itinerary' && !isMapExpandedInStage3 && (
        <div style={{
          flex: '1 1 auto',
          width: 'calc(100% - 58px)',
          height: '100%',
          display: 'flex',
          gap: '12px'
        }}>
          {/* [좌측 45%] VORA AI 대화 조율창 */}
          <div style={{
            flex: '0 0 45%',
            width: '45%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <VoraAIChat
              lang={lang}
              chatMessages={chatMessages}
              isLoading={isLoading}
              onSendMessage={onSendMessage}
              activeDay={activeDay}
              onSelectDay={onSelectDay}
              currentUser={currentUser}
              onConfirmItinerary={onConfirmItinerary}
              onViewTimeline={() => handleStageNavigation('itinerary')}
              onAddPoiToItinerary={onAddPoiToItinerary}
              sessionContext={sessionContext}
              onRemoveContextChip={onRemoveContextChip}
              onToggleContextChip={onToggleContextChip}
              onResetChat={onResetChat}
              onUpdateTimeSlot={onUpdateTimeSlot}
            />
          </div>

          {/* [우측 55%] 확정 타임라인 일정표 (MyTripTab) */}
          <div style={{
            flex: '1 1 55%',
            width: '55%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
            overflowY: 'auto',
            padding: '0.65rem'
          }}>
            <MyTripTab
              lang={lang}
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={onSelectDay}
              onOpenDetail={onOpenDetail}
              onGoToMap={() => setIsMapExpandedInStage3(prev => !prev)}
              onGoToModify={() => handleStageNavigation('chat')}
              onOpenWeather={onOpenWeather}
              onOpenEssentials={onOpenEssentials}
              savedTrips={savedTrips}
              onSelectTrip={onSelectTrip}
              onDeleteTrip={onDeleteTrip}
              onCreateNewTrip={onCreateNewTrip}
              onSaveCurrentTrip={onSaveCurrentTrip}
              currentUser={currentUser}
              onOpenGoogleAuth={onOpenGoogleAuth}
              onSyncTrips={onSyncTrips}
              onOpenRewardedAd={onOpenRewardedAd}
              isDesktop={true}
              isMapOpen={false}
            />
          </div>
        </div>
      )}
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

      {/* 🌟 VORA Explorer Keyframes */}
      <style>{`
        @keyframes voraShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes voraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes voraPinPop {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
