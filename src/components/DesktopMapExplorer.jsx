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
  PhoneCall
} from 'lucide-react';
import { buildKlookDeepLink } from '../services/apiConfig';
import SubwayMapModal from './SubwayMapModal';
import HelplineModal from './HelplineModal';

// 🗺️ 전국 대표 권역 상세 데이터 & 태그별 정밀 좌표
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
  onSelectCityPlan,
  onOpenWeather,
  onOpenEssentials
}) {
  const [selectedLocation, setSelectedLocation] = useState(REGIONAL_FALLBACK_CENTERS[0]);
  const [selectedDays, setSelectedDays] = useState(3);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isMapExpandedFull, setIsMapExpandedFull] = useState(false);
  const [isSubwayModalOpen, setIsSubwayModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // 1. Leaflet Ready Check
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
    }
  }, []);

  // 2. Initialize Leaflet Map Instance with Modern Global CartoDB Voyager Tile
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

      // 🗺️ Global Clean Pastel English/Multilingual Map Tiles (CartoDB Voyager)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      leafletMapRef.current = map;

      // Click anywhere to select location
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

      const timer1 = setTimeout(() => { if (leafletMapRef.current) leafletMapRef.current.invalidateSize(); }, 100);
      const timer2 = setTimeout(() => { if (leafletMapRef.current) leafletMapRef.current.invalidateSize(); }, 300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLeafletReady]);

  // Handle Resize on Expand/Collapse
  useEffect(() => {
    if (leafletMapRef.current) {
      const timer = setTimeout(() => {
        leafletMapRef.current.invalidateSize();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isMapExpandedFull]);

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
        box-shadow: 0 8px 20px rgba(37,99,235,0.4), 0 0 0 3px rgba(255,255,255,0.95);
        border: 2px solid #ffffff;
        cursor: pointer;
        transform: translate(-50%, -50%);
        animation: voraPinPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <span style="width: 7px; height: 7px; border-radius: 50%; background-color: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
        <span>📍 ${label}</span>
      </div>
    `;
  };

  const handleMapLocationSelected = async (lat, lng) => {
    setIsGeocoding(true);

    let closestCity = REGIONAL_FALLBACK_CENTERS[0];
    let minDistance = 999999;
    REGIONAL_FALLBACK_CENTERS.forEach((c) => {
      const dist = getDistanceKm(lat, lng, c.lat, c.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = c;
      }
    });

    let detectedCityNameKo = closestCity.nameKo;
    let detectedCityNameEn = closestCity.nameEn;
    let detectedFullAddr = `${closestCity.nameKo} 일대`;

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
          const cityCandidate = addr.city || addr.town || addr.county || addr.borough || addr.district || addr.province || '';
          const stateCandidate = addr.province || addr.state || '';
          
          if (cityCandidate) {
            detectedCityNameKo = cityCandidate.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)/g, '').trim() || cityCandidate;
            detectedFullAddr = `${stateCandidate} ${cityCandidate}`.trim();
          }
        }
      }
    } catch {}

    const newLoc = {
      ...closestCity,
      nameKo: detectedCityNameKo,
      nameEn: detectedCityNameEn,
      fullAddress: detectedFullAddr,
      lat,
      lng
    };

    setSelectedLocation(newLoc);
    setIsGeocoding(false);

    if (markerRef.current && window.L) {
      markerRef.current.setLatLng([lat, lng]);
      const pinHtml = createMarkerPinHtml(newLoc.nameKo, newLoc.nameEn, lang);
      markerRef.current.setIcon(window.L.divIcon({
        html: pinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      }));
    }
  };

  const handleResetMap = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([36.2, 127.8], 7.0, { duration: 0.8 });
    }
  };

  const handleQuickCityClick = (city) => {
    const foundData = REGIONAL_FALLBACK_CENTERS.find(c => c.nameKo.includes(city.nameKo) || city.nameKo.includes(c.nameKo)) || REGIONAL_FALLBACK_CENTERS[0];
    const newLoc = {
      ...foundData,
      nameKo: city.nameKo,
      nameEn: city.nameEn,
      lat: city.lat,
      lng: city.lng
    };
    setSelectedLocation(newLoc);

    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([city.lat, city.lng], city.zoom || 12, { duration: 0.8 });
    }

    if (markerRef.current && window.L) {
      markerRef.current.setLatLng([city.lat, city.lng]);
      const pinHtml = createMarkerPinHtml(newLoc.nameKo, newLoc.nameEn, lang);
      markerRef.current.setIcon(window.L.divIcon({
        html: pinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      }));
    }
  };

  // 🎯 해시태그 클릭 시 해당 관광지 스팟으로 지도 스르륵 이동(Pan & Zoom) 인터랙션!
  const handleHighlightSpotClick = (highlight) => {
    if (!highlight || !leafletMapRef.current) return;
    
    leafletMapRef.current.flyTo([highlight.lat, highlight.lng], highlight.zoom || 15, { duration: 0.7 });

    if (markerRef.current && window.L) {
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

  const getCityDisplayName = (city) => {
    if (lang === 'en') return city.nameEn;
    if (lang === 'ja') return city.nameJa || city.nameEn;
    if (lang === 'zh' || lang === 'zht') return city.nameZh || city.nameEn;
    return city.nameKo;
  };

  const getHighlightLabel = (hl) => {
    if (lang === 'en') return hl.en;
    if (lang === 'ja') return hl.ja || hl.en;
    if (lang === 'zh' || lang === 'zht') return hl.zh || hl.en;
    return hl.ko;
  };

  const getSelectedDesc = () => {
    if (lang === 'en') return selectedLocation.descEn || selectedLocation.descKo;
    if (lang === 'ja') return selectedLocation.descJa || selectedLocation.descKo;
    if (lang === 'zh' || lang === 'zht') return selectedLocation.descZh || selectedLocation.descKo;
    return selectedLocation.descKo;
  };

  return (
    <div className="desktop-map-explorer-container hide-mobile" style={{
      width: '100%',
      maxWidth: '1260px',
      margin: '0.1rem auto 2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08)',
      overflow: 'hidden',
      padding: '0.9rem 1.1rem 1.1rem 1.1rem',
      boxSizing: 'border-box'
    }}>
      {/* =========================================================================
          🌟 3-Zone Smart Top Header [좌: 조작 툴킷 + 중: 가이드 타이틀 + 우: 6대 도시 스마트 칩]
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
        {/* [Zone 1. 좌측 맵 컨트롤 탭 그룹] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: '#f8fafc',
          padding: '0.25rem 0.45rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
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
        </div>

        {/* [Zone 2. 중앙 간결 가이드 문구] */}
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
            <span>
              {lang === 'en' ? 'Click anywhere on map to explore Korea!' : 
               lang === 'ja' ? '地図の行きたい場所を自由にクリック！' : 
               (lang === 'zh' || lang === 'zht') ? '点击地图任意位置，开启韩国之旅！' : 
               '대한민국 어디든 지도를 콕 찍어보세요!'}
            </span>
          </h2>
        </div>

        {/* [Zone 3. 우측 6대 인기 거점 스마트 퀵점프 칩 (수원 포함 🏰)] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexWrap: 'nowrap'
        }}>
          {POPULAR_QUICK_CITIES.map((city) => {
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
        </div>
      </div>

      {/* =========================================================================
          🗺️ 일체형 3-Section 지도 스테이션 [좌측 52px 미니 툴바 + 리얼 지도 + AI 프리뷰]
          ========================================================================= */}
      <div style={{
        display: 'flex',
        gap: '0.85rem',
        height: '420px',
        position: 'relative'
      }}>
        {/* [1. 최좌측 일체형 52px 미니 툴바] */}
        <div style={{
          width: '52px',
          height: '100%',
          backgroundColor: '#f8fafc',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 0',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          {/* Top Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem', width: '100%' }}>
            {/* Map Reset */}
            <button
              onClick={handleResetMap}
              title={lang === 'en' ? 'Reset Map' : '지도 리셋'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Compass size={17} />
            </button>

            {/* Weather */}
            <button
              onClick={() => onOpenWeather && onOpenWeather(selectedLocation.nameKo)}
              title={lang === 'en' ? 'Weather & Outfit' : '실시간 날씨 & 코디'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#f59e0b',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <CloudSun size={17} />
            </button>

            {/* Climate Pass */}
            <button
              onClick={() => onOpenEssentials && onOpenEssentials()}
              title={lang === 'en' ? 'Climate Card' : '기후동행카드'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#059669',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <CreditCard size={17} />
            </button>

            {/* Subway */}
            <button
              onClick={() => setIsSubwayModalOpen(true)}
              title={lang === 'en' ? 'Metro Map' : '지하철 노선도'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#0284c7',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Train size={17} />
            </button>

            {/* eSIM */}
            <button
              onClick={() => {
                const esimQuery = lang === 'en' ? 'Korea eSIM Unlimited' : lang === 'ja' ? '韓国 無制限 eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国 无限流量 eSIM' : '한국 무제한 eSIM';
                window.open(buildKlookDeepLink(esimQuery), '_blank', 'noopener,noreferrer');
              }}
              title={lang === 'en' ? 'Korea eSIM' : '무제한 eSIM'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#8b5cf6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Wifi size={17} />
            </button>

            {/* 1330 */}
            <button
              onClick={() => setIsHelplineModalOpen(true)}
              title={lang === 'en' ? '1330 Hotline' : '1330 긴급통역'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <PhoneCall size={17} />
            </button>
          </div>

          <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8' }}>
            VORA
          </div>
        </div>

        {/* [2. 중앙 리얼 OpenStreetMap & CartoDB 파스텔 지도 영역 (50% ↔ 100% 가변)] */}
        <div style={{
          flex: isMapExpandedFull ? '1 1 100%' : '1 1 50%',
          height: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #cbd5e1',
          transition: 'flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Leaflet Mount Node */}
          <div 
            ref={mapContainerRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              position: 'absolute',
              top: 0,
              left: 0
            }} 
          />

          {/* Map Top Guide Chip */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#2563eb',
            zIndex: 400,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Navigation size={11} />
            <span>{lang === 'en' ? 'Click anywhere on map' : lang === 'ja' ? '地図をクリック' : (lang === 'zh' || lang === 'zht') ? '点击地图任意位置' : '지도 위 가고 싶은 곳 어디든 클릭해보세요!'}</span>
          </div>

          {/* ◀ / ▶ 네이버 지도 스타일 패널 접기/펼치기 플로팅 토글 버튼 */}
          <button
            onClick={() => setIsMapExpandedFull(!isMapExpandedFull)}
            title={isMapExpandedFull ? '우측 프리뷰 카드 보기' : '지도를 넓게 전체화면으로 보기'}
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 450,
              width: '22px',
              height: '48px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              boxShadow: '-3px 0 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            {isMapExpandedFull ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>

        {/* [3. 우측 VORA AI 선택 지역 4K 포토 & 3대 핵심 매력 & AI 코스 생성 프리뷰 카드 (50% ↔ 0%)] */}
        <div style={{
          flex: isMapExpandedFull ? '0 0 0px' : '1 1 50%',
          width: isMapExpandedFull ? 0 : 'auto',
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
          {/* Top 4K Photo Banner with Gradient Overlay */}
          <div style={{
            position: 'relative',
            height: '160px',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#0f172a'
          }}>
            <img 
              src={selectedLocation.image || '/images/themes/theme-gyeongbokgung.jpg'} 
              alt={selectedLocation.nameKo}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15, 23, 42, 0.85) 100%)'
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
                marginBottom: '2px'
              }}>
                📍 {lang === 'en' ? 'Selected Destination' : lang === 'ja' ? '選択された目的地' : (lang === 'zh' || lang === 'zht') ? '已选目的地' : '선택된 여행지'}
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)'
              }}>
                {lang === 'ko' ? selectedLocation.nameKo : selectedLocation.nameEn}
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginLeft: '6px' }}>
                  {lang === 'ko' ? `(${selectedLocation.nameEn})` : `(${selectedLocation.nameKo})`}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Body: Description & 3 Interactive Highlight Spot Chips */}
          <div style={{
            padding: '14px 16px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#faf5ff08'
          }}>
            <div>
              <p style={{
                fontSize: '0.82rem',
                color: '#475569',
                lineHeight: '1.45',
                margin: '0 0 10px',
                fontWeight: 600
              }}>
                {getSelectedDesc()}
              </p>

              {/* 3 Core Highlights Chips (🎯 Click to FlyTo & Pin on Map!) */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', marginBottom: '6px' }}>
                  ✨ {lang === 'en' ? 'Top Highlights (Click to View on Map)' : lang === 'ja' ? 'おすすめスポット (クリックして地図で確認)' : (lang === 'zh' || lang === 'zht') ? '核心亮点 (点击在地图查看)' : 'VORA 추천 핵심 명소 (클릭 시 지도 이동)'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(selectedLocation.highlights || []).map((hl, hIdx) => (
                    <button 
                      key={hIdx}
                      onClick={() => handleHighlightSpotClick(hl)}
                      title={lang === 'en' ? 'Click to pinpoint on map' : '클릭 시 지도가 이 명소로 이동합니다'}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: '1px solid #e9d5ff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#7c3aed';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3e8ff';
                        e.currentTarget.style.color = '#7c3aed';
                      }}
                    >
                      <span>#</span>
                      <span>{getHighlightLabel(hl)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Area: Days Selector & Start Button */}
            <div style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              {/* Days Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b' }}>
                  {lang === 'en' ? 'Days:' : lang === 'ja' ? '日程:' : (lang === 'zh' || lang === 'zht') ? '天数:' : '일수:'}
                </span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDays(d)}
                      style={{
                        border: selectedDays === d ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: selectedDays === d ? '#2563eb' : '#ffffff',
                        color: selectedDays === d ? '#ffffff' : '#475569',
                        borderRadius: '6px',
                        padding: '3px 7px',
                        fontSize: '0.74rem',
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

              {/* Start Button */}
              <button
                onClick={handleStartPlan}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Sparkles size={14} />
                <span>
                  {lang === 'en' 
                    ? `Create ${selectedLocation.nameEn} ${selectedDays}D Plan 🚀` 
                    : lang === 'ja'
                    ? `✨ ${selectedLocation.nameJa || selectedLocation.nameEn} ${selectedDays}日コース作成 🚀`
                    : (lang === 'zh' || lang === 'zht')
                    ? `✨ 生成 ${selectedLocation.nameZh || selectedLocation.nameEn} ${selectedDays}日行程 🚀`
                    : `✨ ${selectedLocation.nameKo} ${selectedDays}일 코스 만들기 🚀`}
                </span>
                <ChevronRight size={14} />
              </button>
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
