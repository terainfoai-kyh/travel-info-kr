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

// 🗺️ 전국 대표 권역 빠른 좌표 오프라인 Fallback 맵 & 대표 4K 사진
const REGIONAL_FALLBACK_CENTERS = [
  { 
    nameKo: '서울 경복궁', 
    nameEn: 'Seoul Gyeongbokgung', 
    lat: 37.5796, 
    lng: 126.9770,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    highlightsKo: ['경복궁 & 근정전', '북촌 한옥마을', '익선동 감성거리'],
    highlightsEn: ['Gyeongbokgung Palace', 'Bukchon Hanok Village', 'Ikseon-dong Cafe Alley'],
    descKo: '600년 조선 왕조의 숨결과 현대적인 K-컬처가 공존하는 한국 여행 1번지'
  },
  { 
    nameKo: '서울', 
    nameEn: 'Seoul', 
    lat: 37.5665, 
    lng: 126.9780,
    image: '/images/themes/hero-hangang.jpg',
    highlightsKo: ['성수동 팝업거리', '한강 달빛피크닉', 'N서울타워 야경'],
    highlightsEn: ['Seongsu Pop-up Street', 'Hangang River Picnic', 'N Seoul Tower Sunset'],
    descKo: '트렌디한 K-패션 쇼핑부터 한강의 황금빛 노을까지 완벽한 하루'
  },
  { 
    nameKo: '수원', 
    nameEn: 'Suwon', 
    lat: 37.2636, 
    lng: 127.0286,
    image: '/images/themes/theme-suwon.jpg',
    highlightsKo: ['수원화성 성곽길', '행궁동 감성카페', '통닭거리 미식'],
    highlightsEn: ['Suwon Hwaseong Fortress', 'Haenggung-dong Cafes', 'Fried Chicken Street'],
    descKo: '유네스코 세계문화유산 수원화성과 감성 가득한 행리단길 투어'
  },
  { 
    nameKo: '인천', 
    nameEn: 'Incheon', 
    lat: 37.4563, 
    lng: 126.7052,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    highlightsKo: ['송도 센트럴파크', '차이나타운', '월미도 바다열차'],
    highlightsEn: ['Songdo Central Park', 'Chinatown', 'Wolmido Ocean Train'],
    descKo: '미래형 국제도시 송도와 근대 역사가 살아 숨 쉬는 해양 도시'
  },
  { 
    nameKo: '강릉', 
    nameEn: 'Gangneung', 
    lat: 37.7519, 
    lng: 128.8761,
    image: '/images/themes/theme-gangneung.jpg',
    highlightsKo: ['안목 커피거리', '경포대 에메랄드 해변', 'BTS 버스정류장'],
    highlightsEn: ['Anmok Coffee Street', 'Gyeongpo Beach', 'BTS Bus Stop'],
    descKo: '푸른 동해 바다와 짙은 커피 향이 어우러진 낭만적인 힐링 여행지'
  },
  { 
    nameKo: '속초', 
    nameEn: 'Sokcho', 
    lat: 38.2070, 
    lng: 128.5918,
    image: '/images/themes/theme-gangneung.jpg',
    highlightsKo: ['설악산 권금성', '속초관광수산시장', '아바이마을'],
    highlightsEn: ['Seoraksan Cable Car', 'Sokcho Tourist Market', 'Abai Village'],
    descKo: '웅장한 설악산의 절경과 신선한 동해 해산물 미식 탐방'
  },
  { 
    nameKo: '안동', 
    nameEn: 'Andong', 
    lat: 36.5683, 
    lng: 128.7294,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    highlightsKo: ['안동 하회마을', '병산서원 만대루', '월영교 야경'],
    highlightsEn: ['Andong Hahoe Village', 'Byeongsan Seowon', 'Woryeonggyo Bridge'],
    descKo: '한국의 전통 유교 문화와 고즈넉한 고택의 정취를 느끼는 헤리티지 여행'
  },
  { 
    nameKo: '경주', 
    nameEn: 'Gyeongju', 
    lat: 35.8562, 
    lng: 129.2247,
    image: '/images/themes/theme-gyeongju.jpg',
    highlightsKo: ['불국사 & 석굴암', '동궁과 월지 야경', '황리단길 핫플'],
    highlightsEn: ['Bulguksa Temple', 'Donggung & Wolji Pond', 'Hwangridan-gil Street'],
    descKo: '천년 신라의 찬란한 유적과 트렌디한 황리단길이 만나는 지붕 없는 박물관'
  },
  { 
    nameKo: '대구', 
    nameEn: 'Daegu', 
    lat: 35.8714, 
    lng: 128.6014,
    image: '/images/themes/theme-gyeongbokgung.jpg',
    highlightsKo: ['김광석 다시그리기길', '서문시장 야시장', '앞산전망대'],
    highlightsEn: ['Kim Gwangseok Street', 'Seomun Night Market', 'Apsan Observatory'],
    descKo: '음악과 미식, 야경이 살아있는 활기찬 영남의 중심 도시'
  },
  { 
    nameKo: '부산', 
    nameEn: 'Busan', 
    lat: 35.1796, 
    lng: 129.0756,
    image: '/images/themes/theme-busan.jpg',
    highlightsKo: ['해운대 블루라인파크', '광안대교 드론쇼', '감천문화마을'],
    highlightsEn: ['Haeundae Blueline Park', 'Gwangandaegyo Bridge', 'Gamcheon Village'],
    descKo: '끝없는 푸른 바다와 다채로운 해양 액티비티, 신선한 미식의 해양 수도'
  },
  { 
    nameKo: '여수', 
    nameEn: 'Yeosu', 
    lat: 34.7604, 
    lng: 127.6622,
    image: '/images/themes/theme-busan.jpg',
    highlightsKo: ['여수 해상케이블카', '오동도 동백숲', '낭만포차 밤바다'],
    highlightsEn: ['Yeosu Cable Car', 'Odongdo Island', 'Romantic Night Pocha'],
    descKo: '아름다운 남해 밤바다의 낭만과 신선한 해물 삼합의 미식 여행'
  },
  { 
    nameKo: '전주', 
    nameEn: 'Jeonju', 
    lat: 35.8242, 
    lng: 127.1480,
    image: '/images/themes/theme-jeonju.jpg',
    highlightsKo: ['전주한옥마을', '경기전 한복체험', '전주비빔밥 & 막걸리골목'],
    highlightsEn: ['Jeonju Hanok Village', 'Gyeonggijeon Hanbok', 'Jeonju Bibimbap'],
    descKo: '700여 채 한옥의 고풍스러운 골목길과 유네스코 음식창의도시의 맛'
  },
  { 
    nameKo: '제주', 
    nameEn: 'Jeju', 
    lat: 33.4996, 
    lng: 126.5312,
    image: '/images/themes/theme-jeju.jpg',
    highlightsKo: ['성산일출봉', '협재 & 애월 해안도로', '우도 산호해변'],
    highlightsEn: ['Seongsan Sunrise Peak', 'Hyeopjae Beach', 'Udo Coral Beach'],
    descKo: '에메랄드빛 청정 바다와 유네스코 세계자연유산이 빚어낸 힐링 아일랜드'
  }
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

  // 2. Initialize Leaflet Map Instance
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

      // 🗺️ 100% Free Official OpenStreetMap Standard Tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
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

  const handleStartPlan = () => {
    if (onSelectCityPlan) {
      onSelectCityPlan(selectedLocation.nameKo, selectedDays);
    }
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
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      {/* 🌟 Header Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        paddingBottom: '0.55rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '9px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Compass size={17} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {lang === 'en' 
                ? 'Click Anywhere on Korea Map to Explore & Plan AI Itinerary' 
                : '지명을 몰라도 괜찮아요! 지도에서 가고 싶은 곳 어디든 콕 찍어보세요'}
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomIn()}
            style={{
              width: '26px',
              height: '26px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
            }}
            title="확대"
          >
            <ZoomIn size={13} color="#0f172a" />
          </button>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomOut()}
            style={{
              width: '26px',
              height: '26px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
            }}
            title="축소"
          >
            <ZoomOut size={13} color="#0f172a" />
          </button>
          <button
            onClick={handleResetMap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.24rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#475569',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
            }}
            title="전국 전도 리셋"
          >
            <RefreshCw size={11} />
            <span>전국 보기</span>
          </button>
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

        {/* [2. 중앙 리얼 OpenStreetMap 지도 영역 (50% ↔ 100% 가변)] */}
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
            <span>{lang === 'en' ? 'Click anywhere on map' : '지도 위 가고 싶은 곳 어디든 클릭해보세요!'}</span>
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
                📍 {lang === 'en' ? 'Selected Destination' : '선택된 여행지'}
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)'
              }}>
                {selectedLocation.nameKo}
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginLeft: '6px' }}>
                  ({selectedLocation.nameEn})
                </span>
              </div>
            </div>
          </div>

          {/* Middle Body: Description & 3 Core Highlights */}
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
                {selectedLocation.descKo || '아름다운 자연과 다채로운 K-컬처를 체험할 수 있는 대한민국 대표 여행지입니다.'}
              </p>

              {/* 3 Core Highlights Chips */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', marginBottom: '6px' }}>
                  ✨ {lang === 'en' ? 'Top 3 Signature Highlights' : 'VORA 추천 3대 핵심 매력'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(selectedLocation.highlightsKo || ['대표 랜드마크', '로컬 미식 탐방', '야경 명소']).map((hl, hIdx) => (
                    <span 
                      key={hIdx}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #e9d5ff'
                      }}
                    >
                      #{hl}
                    </span>
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
                  {lang === 'en' ? 'Days:' : '일수:'}
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
                      {d}{lang === 'en' ? 'D' : '일'}
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
                    ? `Create ${selectedLocation.nameEn} Plan 🚀` 
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
