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
import { fetchDynamicRealtimeSpots, fetchLocationBasedTourApiSpots, getCityMultilingualName } from '../services/tourApi';
import { CITY_LOCAL_KNOWLEDGE } from '../data/voraDialogKnowledge';
import SubwayMapModal from './SubwayMapModal';
import HelplineModal from './HelplineModal';
import VoraAIChat from './VoraAIChat';
import MyTripTab from './MyTripTab';
import { generateGoogleMapsRouteUrl } from '../services/geminiNlpService';

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
    image: '/images/themes/hero-hangang.jpg',
    transitTipKo: '지하철 2호선 성수역 / 한강공원 직결',
    transitTipEn: 'Subway Line 2 Seongsu / Hangang River Link',
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
  const [selectedLocation, setSelectedLocation] = useState(REGIONAL_FALLBACK_CENTERS[0]);
  const [selectedDays, setSelectedDays] = useState(3);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isMapExpandedFull, setIsMapExpandedFull] = useState(false);
  const [isMapExpandedInStage3, setIsMapExpandedInStage3] = useState(false);
  const [isSubwayModalOpen, setIsSubwayModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
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
        if (leafletMapRef.current && window.L && isValidLatLng(found.lat, found.lng)) {
          try {
            leafletMapRef.current.flyTo([found.lat, found.lng], found.zoom || 11, { duration: 0.8 });
          } catch (e) {}
        }
      }
    }
  }, [itineraryData?.targetCity]);

  // 2. Initialize Leaflet Map Instance with 100% Free Official Clean OpenStreetMap Tiles
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [36.2, 127.8],
        zoom: 7.0,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
      });

      // 🗺️ 100% Free Official OpenStreetMap Standard Tiles (No Watermark, No API Key Required)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

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
            try {
              map.flyTo(spotPos, 15, { duration: 0.5 });
            } catch (e) {}
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
        leafletMapRef.current.invalidateSize();
        if (activeStage === 'itinerary' && currentDaySpots.length > 0) {
          const validSpots = currentDaySpots.filter(sp => {
            const lat = Number(sp.lat || sp.mapy || sp.latitude);
            const lng = Number(sp.lng || sp.mapx || sp.longitude);
            return lat && lng && lat > 32 && lat < 40 && lng > 124 && lng < 132;
          });
          if (validSpots.length > 0) {
            const latLngs = validSpots.map(sp => [Number(sp.lat || sp.mapy || sp.latitude), Number(sp.lng || sp.mapx || sp.longitude)]);
            const bounds = window.L.latLngBounds(latLngs);
            leafletMapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isMapExpandedFull, isMapExpandedInStage3, activeStage]);

  const createMarkerPinHtml = (nameKo, nameEn, currentLang) => {
    const label = currentLang === 'en' ? nameEn : nameKo;
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

  // 🎯 위경도 좌표에서 가장 가까운 대한민국 도시를 0.001초 만에 감지하는 공간 매퍼
  const findClosestCityFromCoords = (targetLat, targetLng) => {
    let minD = Infinity;
    let bestCity = '서울';
    
    // 1. 6대 거점 및 폴백 센터 검색
    for (const fc of REGIONAL_FALLBACK_CENTERS) {
      if (fc.lat && fc.lng) {
        const d = getDistanceKm(targetLat, targetLng, fc.lat, fc.lng);
        if (d < minD) {
          minD = d;
          bestCity = fc.nameKo;
        }
      }
    }
    // 2. 59개 로컬 지식베이스 도시 검색
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
      
      // 🛡️ 1. 6대 대표 거점(서울/부산/제주/수원/경주/강릉) 클릭 시: 검증된 대표 4K 사진 & 3대 랜드마크 100% 영구 보존!
      if (baseLoc.isPredefinedHub && baseLoc.image) {
        return {
          ...baseLoc,
          image: baseLoc.image,
          highlights: (baseLoc.highlights && baseLoc.highlights.length > 0) ? baseLoc.highlights : (localKn?.signatureHighlights?.slice(0, 3).map(h => ({ ko: h, en: h, ja: h, zh: h, lat: baseLoc.lat, lng: baseLoc.lng, zoom: 14 })) || []),
          foodieSecret: localKn?.localFoodieSecret || baseLoc.foodieSecret || null,
          nightHighlight: localKn?.nightHighlights ? localKn.nightHighlights[0]?.name : (baseLoc.nightHighlight || null),
          transitTipKo: localKn?.transitTip || baseLoc.transitTipKo,
          descKo: localKn?.badge || baseLoc.descKo
        };
      }

      // 🛡️ 2. 지도 위 임의의 위치(포항/안동/여수 등 226개 시·군) 클릭 시: TourAPI 4.0 실시간 정품 사진 & 명소 100% 동적 로드
      let liveSpots = await fetchDynamicRealtimeSpots(cityName, targetLang);
      if ((!liveSpots || liveSpots.length === 0) && baseLoc.lat && baseLoc.lng) {
        liveSpots = await fetchLocationBasedTourApiSpots(baseLoc.lat, baseLoc.lng, 15000, targetLang);
      }

      let livePhoto = null;
      let liveHighlights = [];

      if (liveSpots && liveSpots.length > 0) {
        const spotWithImg = liveSpots.find(s => s.firstimage || s.image) || liveSpots[0];
        if (spotWithImg?.firstimage || spotWithImg?.image) {
          livePhoto = spotWithImg.firstimage || spotWithImg.image;
        }
        liveHighlights = liveSpots.slice(0, 3).map((sp) => ({
          ko: sp.title,
          en: sp.titleEn || sp.title,
          ja: sp.titleJa || sp.title,
          zh: sp.titleZh || sp.title,
          lat: Number(sp.lat || sp.mapy) || baseLoc.lat,
          lng: Number(sp.lng || sp.mapx) || baseLoc.lng,
          zoom: 15
        }));
      } else if (localKn && localKn.signatureHighlights) {
        liveHighlights = localKn.signatureHighlights.slice(0, 3).map((hlStr) => ({
          ko: hlStr,
          en: hlStr,
          ja: hlStr,
          zh: hlStr,
          lat: baseLoc.lat,
          lng: baseLoc.lng,
          zoom: 14
        }));
      }

      return {
        ...baseLoc,
        image: livePhoto || baseLoc.image || localKn?.image || '/images/themes/hero-hangang.jpg',
        highlights: liveHighlights.length > 0 ? liveHighlights : (baseLoc.highlights || []),
        foodieSecret: localKn?.localFoodieSecret || baseLoc.foodieSecret || null,
        nightHighlight: localKn?.nightHighlights ? localKn.nightHighlights[0]?.name : (baseLoc.nightHighlight || null),
        transitTipKo: localKn?.transitTip || baseLoc.transitTipKo,
        descKo: localKn?.badge || baseLoc.descKo
      };
    } catch {
      return baseLoc;
    }
  };

  const handleMapLocationSelected = async (lat, lng) => {
    setIsGeocoding(true);
    setIsPhotoLoading(true);

    // 🎯 0.001초 즉시 가장 가까운 대한민국 도시 감지 (지연/타임아웃 100% 방지)
    const closest = findClosestCityFromCoords(lat, lng);
    let detectedCityNameKo = closest.distance <= 45 ? closest.city : '대한민국';
    let detectedCityNameEn = getCityMultilingualName(detectedCityNameKo, 'en') || 'Korea';
    let detectedFullAddr = `${detectedCityNameKo} 일대`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=11&addressdetails=1&accept-language=ko`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const stateCandidate = addr.province || addr.state || '';
          
          const candList = [addr.city, addr.county, addr.town, addr.borough, addr.district, addr.province].filter(Boolean);
          let matchedKey = '';
          for (const cand of candList) {
            const cClean = cand.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
            if (CITY_LOCAL_KNOWLEDGE[cClean] || CITY_LOCAL_KNOWLEDGE[cand]) {
              matchedKey = cClean || cand;
              break;
            }
          }

          const primaryName = matchedKey || addr.city || addr.county || addr.town || addr.borough || addr.district || '';
          if (primaryName && primaryName !== '대한민국') {
            detectedCityNameKo = primaryName.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim() || primaryName;
            detectedFullAddr = `${stateCandidate} ${primaryName}`.trim();
          }
        }
      }
    } catch {}

    // 🌐 지자체 표준 다국어(영문/일문/중문) 동적 사전 매핑
    detectedCityNameEn = getCityMultilingualName(detectedCityNameKo, 'en') || detectedCityNameKo;

    // 🧠 보라 AI 학습 공식 로컬 지식베이스 매핑
    const cleanKey = detectedCityNameKo.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    const localKn = CITY_LOCAL_KNOWLEDGE[cleanKey] || CITY_LOCAL_KNOWLEDGE[detectedCityNameKo];

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
      image: null, // 🛡️ 지도 클릭 시 실시간 TourAPI 사진 도착 전까지 클린 화이트 로딩 상태 유지
      foodieSecret: localKn?.localFoodieSecret || null,
      nightHighlight: localKn?.nightHighlights ? localKn.nightHighlights[0]?.name : null,
      highlights: localKn?.signatureHighlights?.slice(0, 3).map(h => ({ ko: h, en: h, ja: h, zh: h, lat, lng, zoom: 14 })) || [],
      lat,
      lng,
      isPredefinedHub: false
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
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([36.2, 127.8], 7.0, { duration: 0.8 });
    }
  };

  const handleQuickCityClick = (city) => {
    setIsPhotoLoading(false);
    const cleanK = city.nameKo.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    const foundData = REGIONAL_FALLBACK_CENTERS.find(c => c.nameKo === cleanK || c.nameKo === city.nameKo || c.nameKo.includes(cleanK) || cleanK.includes(c.nameKo)) || REGIONAL_FALLBACK_CENTERS[0];
    const localKn = CITY_LOCAL_KNOWLEDGE[cleanK] || CITY_LOCAL_KNOWLEDGE[city.nameKo];

    const baseLoc = {
      ...foundData,
      nameKo: city.nameKo,
      nameEn: city.nameEn,
      lat: city.lat,
      lng: city.lng,
      image: foundData.image || localKn?.image || '/images/themes/hero-hangang.jpg',
      highlights: (foundData.highlights && foundData.highlights.length > 0)
        ? foundData.highlights
        : (localKn?.signatureHighlights ? localKn.signatureHighlights.slice(0, 3).map(h => ({ ko: h, en: h, ja: h, zh: h, lat: city.lat, lng: city.lng, zoom: 14 })) : []),
      foodieSecret: localKn?.localFoodieSecret || foundData.foodieSecret || null,
      nightHighlight: localKn?.nightHighlights ? localKn.nightHighlights[0]?.name : (foundData.nightHighlight || null),
      transitTipKo: localKn?.transitTip || foundData.transitTipKo,
      descKo: localKn?.badge || foundData.descKo,
      isPredefinedHub: true // 🛡️ 6대 대표 거점 고정 플래그
    };
    setSelectedLocation(baseLoc);

    if (leafletMapRef.current && isValidLatLng(city.lat, city.lng)) {
      try {
        leafletMapRef.current.flyTo([city.lat, city.lng], city.zoom || 12, { duration: 0.8 });
      } catch (e) {}
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

  // 🎯 해시태그 클릭 시 해당 관광지 스팟으로 지도 스르륵 이동(Pan & Zoom) 인터랙션!
  const handleHighlightSpotClick = (highlight) => {
    if (!highlight || !leafletMapRef.current) return;
    
    if (isValidLatLng(highlight.lat, highlight.lng)) {
      try {
        leafletMapRef.current.flyTo([highlight.lat, highlight.lng], highlight.zoom || 15, { duration: 0.7 });
      } catch (e) {}
    }

    if (markerRef.current && window.L && isValidLatLng(highlight.lat, highlight.lng)) {
      markerRef.current.setLatLng([highlight.lat, highlight.lng]);
      const pinHtml = createMarkerPinHtml(highlight.ko, highlight.en, lang);
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
    if (lang === 'en') return city.nameEn;
    if (lang === 'ja') return city.nameJa || city.nameEn;
    if (lang === 'zh' || lang === 'zht') return city.nameZh || city.nameEn;
    return city.nameKo;
  };

  const getHighlightName = (hl) => {
    if (lang === 'en') return hl.en;
    if (lang === 'ja') return hl.ja || hl.en;
    if (lang === 'zh' || lang === 'zht') return hl.zh || hl.en;
    return hl.ko;
  };

  const getCleanCityKey = (name) => {
    if (!name) return '';
    const clean = name.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim();
    if (CITY_LOCAL_KNOWLEDGE[clean]) return clean;
    if (CITY_LOCAL_KNOWLEDGE[name]) return name;
    return Object.keys(CITY_LOCAL_KNOWLEDGE).find(k => k === clean || name.startsWith(k) || k.startsWith(clean)) || null;
  };

  const getSelectedDesc = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    const cityData = (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]) || CITY_LOCAL_KNOWLEDGE[selectedLocation.nameKo] || null;
    if (cityData) {
      if (lang === 'en') return cityData.badgeEn || cityData.descEn || selectedLocation.descEn || cityData.badge;
      if (lang === 'ja') return cityData.badgeJa || cityData.descJa || selectedLocation.descJa || cityData.badge;
      if (lang === 'zh' || lang === 'zht') return cityData.badgeZh || cityData.descZh || selectedLocation.descZh || cityData.badge;
      return cityData.badge || selectedLocation.descKo;
    }

    if (lang === 'en') return selectedLocation.descEn || `Discover iconic sights and cultural treasures in ${selectedLocation.nameEn || selectedLocation.nameKo}.`;
    if (lang === 'ja') return selectedLocation.descJa || `${selectedLocation.nameJa || selectedLocation.nameKo}の美しい名所と文化を満喫するヒーリング旅`;
    if (lang === 'zh' || lang === 'zht') return selectedLocation.descZh || `探寻${selectedLocation.nameZh || selectedLocation.nameKo}代表性名胜与历史文化的治愈之旅`;
    return selectedLocation.descKo || `${selectedLocation.nameKo} 대표 명소와 문화를 만끽하는 힐링 여행`;
  };

  const getSelectedTransitTip = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    if (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]?.transitTip) {
      return lang === 'en' 
        ? (selectedLocation.transitTipEn || 'Subway & KTX Direct Access')
        : CITY_LOCAL_KNOWLEDGE[cleanCityKey].transitTip;
    }
    return lang === 'en' 
      ? (selectedLocation.transitTipEn || 'Easy Public Transit Access') 
      : (selectedLocation.transitTipKo || '대중교통 접근 편리');
  };

  const getSelectedFoodieSecret = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    if (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]?.localFoodieSecret) {
      return CITY_LOCAL_KNOWLEDGE[cleanCityKey].localFoodieSecret;
    }
    return selectedLocation.foodieSecret || null;
  };

  const getSelectedNightHighlight = () => {
    const cleanCityKey = getCleanCityKey(selectedLocation.nameKo);
    if (cleanCityKey && CITY_LOCAL_KNOWLEDGE[cleanCityKey]?.nightHighlights) {
      const nh = CITY_LOCAL_KNOWLEDGE[cleanCityKey].nightHighlights[0];
      return nh ? `${nh.name} (${nh.desc})` : null;
    }
    return selectedLocation.nightHighlight || null;
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
              <span>{lang === 'en' ? '🔄 Explore Other Cities' : '🔄 다른 도시 탐색'}</span>
            </button>
          )}
        </div>

        {/* [Zone 2. 중앙 상태 안내 문구] */}
        <div style={{ flex: 1, textAlign: 'left', paddingLeft: '0.3rem' }}>
          <h2 style={{
            fontSize: '0.96rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
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
                <span>{selectedLocation.nameKo || itineraryData?.targetCity || '맞춤 여행'} 1:1 VORA AI 대화 조율</span>
              </span>
            )}
            {activeStage === 'itinerary' && (
              <span style={{ color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={15} color="#7c3aed" />
                <span>{itineraryData?.targetCity || selectedLocation.nameKo || '제주'} {itineraryData?.days || 3}일차 확정 타임라인 & AI 1:1 조율</span>
              </span>
            )}
          </h2>
        </div>

        {/* [Zone 3. 우측 액션 / 6대 인기 거점 칩] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexWrap: 'nowrap'
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
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isSelected 
                    ? '1px solid #2563eb' 
                    : '1px solid #e2e8f0',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
                    : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 3px 10px rgba(37, 99, 235, 0.35)' : 'none',
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
              <span>📋 {lang === 'en' ? 'View Itinerary Timeline' : '일정표 보기'}</span>
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
              <span>{isMapExpandedInStage3 ? (lang === 'en' ? '💬 Dual Chat & Itinerary' : '💬 대화창+일정표 듀얼') : (lang === 'en' ? '🗺️ View Route Map' : '🗺️ 동선 지도 보기')}</span>
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
            border: isMapExpandedFull ? 'none' : '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isMapExpandedFull ? 0 : 1,
            visibility: isMapExpandedFull ? 'hidden' : 'visible'
          }}>
            {/* STAGE 1 (EXPLORE): 4K 포토 매거진 프리뷰 카드 */}
            {activeStage === 'explore' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top 4K Photo Banner with Gradient Overlay */}
                <div style={{
                  position: 'relative',
                  height: '185px',
                  width: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc'
                }}>
                  {(isGeocoding || isPhotoLoading || !selectedLocation.image) ? (
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
                      {/* Ultra-Light Soft Scrim (사진 상단 70%는 100% 퓨어 원본, 하단 텍스트 영역만 은은한 그림자) */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 55%, rgba(15, 23, 42, 0.42) 85%, rgba(15, 23, 42, 0.68) 100%)'
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
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#38bdf8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                        }}>
                          <CheckCircle2 size={12} color="#38bdf8" />
                          <span>📍 {lang === 'en' ? 'TourAPI Certified Destination' : lang === 'ja' ? '公式認証 観光地' : (lang === 'zh' || lang === 'zht') ? '官方认证 目的地' : '한국관광공사 정품 인증 여행지'}</span>
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95)'
                        }}>
                          {lang === 'ko' ? selectedLocation.nameKo : selectedLocation.nameEn}
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginLeft: '6px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                            {lang === 'ko' ? `(${selectedLocation.nameEn})` : `(${selectedLocation.nameKo})`}
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
                      margin: '0 0 6px',
                      fontWeight: 600
                    }}>
                      {getSelectedDesc()}
                    </p>

                    {/* Tier 2: ✦ VORA AI Recommended Spot Flow */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} color="#7c3aed" />
                        <span>{lang === 'en' ? 'VORA AI Recommended Route' : lang === 'ja' ? 'VORA AI おすすめ連動コース' : (lang === 'zh' || lang === 'zht') ? 'VORA AI 推荐连游路线' : '✦ VORA AI 추천 연계 코스'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                        {(selectedLocation.highlights || []).map((hl, hIdx) => (
                          <React.Fragment key={hIdx}>
                            <button 
                              onClick={() => handleHighlightSpotClick(hl)}
                              title="클릭 시 지도가 이 명소로 이동합니다"
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                backgroundColor: '#f5f3ff',
                                color: '#6d28d9',
                                padding: '3px 9px',
                                borderRadius: '9999px',
                                border: '1px solid #ddd6fe',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span>📍</span>
                              <span>{getHighlightName(hl)}</span>
                            </button>
                            {hIdx < (selectedLocation.highlights || []).length - 1 && (
                              <span style={{ color: '#a78bfa', fontSize: '0.70rem', fontWeight: 900 }}>➔</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* 🍲 VORA Foodie Secret Pill Tags */}
                    {getSelectedFoodieSecret() && (
                      <div style={{
                        padding: '6px 8px',
                        backgroundColor: '#fff7ed',
                        borderRadius: '8px',
                        border: '1px solid #fed7aa',
                        marginBottom: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <Utensils size={12} color="#ea580c" />
                          <span style={{ fontSize: '0.70rem', fontWeight: 900, color: '#9a3412' }}>
                            {lang === 'en' ? 'Local Foodie Picks' : lang === 'ja' ? 'ローカル美食' : (lang === 'zh' || lang === 'zht') ? '地道美食' : 'VORA 찐 미식'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {getSelectedFoodieSecret().split(/[,•|·]/).map((item, iIdx) => {
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
                        marginBottom: '6px'
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
                        <span>{selectedLocation.subwayTip || '대중교통 쾌속 이동'}</span>
                      </span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Ticket size={11} />
                        <span>TAX FREE</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Area: Days Selector & Start Button */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '8px',
                    marginTop: '8px',
                    paddingBottom: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {/* Days Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#64748b' }}>
                        {lang === 'en' ? 'Days:' : lang === 'ja' ? '日程:' : (lang === 'zh' || lang === 'zht') ? '天数:' : '일수:'}
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((d) => (
                          <button
                            key={d}
                            onClick={() => setSelectedDays(d)}
                            style={{
                              border: selectedDays === d ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                              backgroundColor: selectedDays === d ? '#2563eb' : '#ffffff',
                              color: selectedDays === d ? '#ffffff' : '#475569',
                              borderRadius: '5px',
                              padding: '2px 5px',
                              fontSize: '0.70rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {d}{lang === 'en' ? 'D' : lang === 'ja' ? '日' : (lang === 'zh' || lang === 'zht') ? '天' : '일'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Start Button (No clipping, 100% safe fit) */}
                    <button
                      onClick={handleStartPlan}
                      style={{
                        background: 'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '6px 12px',
                        fontSize: '0.76rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                        transition: 'transform 0.15s ease',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Sparkles size={12} />
                      <span>
                        {lang === 'en' 
                          ? `${selectedLocation.nameEn} ${selectedDays}D Plan 🚀` 
                          : lang === 'ja'
                          ? `${selectedLocation.nameJa || selectedLocation.nameEn} ${selectedDays}日コース 🚀`
                          : (lang === 'zh' || lang === 'zht')
                          ? `${selectedLocation.nameZh || selectedLocation.nameEn} ${selectedDays}日行程 🚀`
                          : `${selectedLocation.nameKo} ${selectedDays}일 코스 🚀`}
                      </span>
                      <ChevronRight size={12} />
                    </button>
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
