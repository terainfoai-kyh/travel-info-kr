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
  Send,
  ArrowRight,
  ExternalLink,
  Map,
  Share2,
  Bookmark,
  Check,
  CreditCard,
  CloudSun,
  Train,
  Wifi,
  PhoneCall,
  Heart,
  Globe,
  Settings,
  Layers
} from 'lucide-react';
import { TRANSLATIONS, CITY_TRANSLATIONS, getLocalizedCityName } from '../i18n/translations';
import { buildKlookDeepLink } from '../services/apiConfig';
import SubwayMapModal from './SubwayMapModal';
import HelplineModal from './HelplineModal';

// 🗺️ 전국 대표 권역 빠른 좌표 오프라인 Fallback 맵
const REGIONAL_FALLBACK_CENTERS = [
  { nameKo: '서울 경복궁', nameEn: 'Seoul Gyeongbokgung', lat: 37.5796, lng: 126.9770 },
  { nameKo: '서울', nameEn: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { nameKo: '수원', nameEn: 'Suwon', lat: 37.2636, lng: 127.0286 },
  { nameKo: '인천', nameEn: 'Incheon', lat: 37.4563, lng: 126.7052 },
  { nameKo: '강릉', nameEn: 'Gangneung', lat: 37.7519, lng: 128.8761 },
  { nameKo: '속초', nameEn: 'Sokcho', lat: 38.2070, lng: 128.5918 },
  { nameKo: '춘천', nameEn: 'Chuncheon', lat: 37.8813, lng: 127.7298 },
  { nameKo: '안동', nameEn: 'Andong', lat: 36.5683, lng: 128.7294 },
  { nameKo: '경주', nameEn: 'Gyeongju', lat: 35.8562, lng: 129.2247 },
  { nameKo: '포항', nameEn: 'Pohang', lat: 36.0190, lng: 129.3435 },
  { nameKo: '대구', nameEn: 'Daegu', lat: 35.8714, lng: 128.6014 },
  { nameKo: '부산', nameEn: 'Busan', lat: 35.1796, lng: 129.0756 },
  { nameKo: '통영', nameEn: 'Tongyeong', lat: 34.8544, lng: 128.4332 },
  { nameKo: '거제', nameEn: 'Geoje', lat: 34.8806, lng: 128.6211 },
  { nameKo: '남해', nameEn: 'Namhae', lat: 34.8377, lng: 127.8924 },
  { nameKo: '여수', nameEn: 'Yeosu', lat: 34.7604, lng: 127.6622 },
  { nameKo: '순천', nameEn: 'Suncheon', lat: 34.9506, lng: 127.4872 },
  { nameKo: '전주', nameEn: 'Jeonju', lat: 35.8242, lng: 127.1480 },
  { nameKo: '군산', nameEn: 'Gunsan', lat: 35.9676, lng: 126.7366 },
  { nameKo: '대전', nameEn: 'Daejeon', lat: 36.3504, lng: 127.3845 },
  { nameKo: '단양', nameEn: 'Danyang', lat: 36.9845, lng: 128.3655 },
  { nameKo: '제주', nameEn: 'Jeju', lat: 33.4996, lng: 126.5312 },
  { nameKo: '서귀포', nameEn: 'Seogwipo', lat: 33.2541, lng: 126.5601 }
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

export default function WebMapDashboard({
  lang = 'ko',
  onGenerateItinerary,
  itineraryData = null,
  isLoading = false,
  chatMessages = [],
  onSendMessage,
  onOpenWeather,
  onOpenEssentials,
  onOpenSubwayModal,
  onOpenHelplineModal,
  onOpenWishlist,
  wishlistCount = 0,
  savedTripsCount = 0,
  onNavigateTab,
  onSelectSpot,
  onToggleBookmark,
  bookmarks = []
}) {
  const [selectedLocation, setSelectedLocation] = useState({
    nameKo: '서울 경복궁',
    nameEn: 'Seoul Gyeongbokgung',
    fullAddress: '서울특별시 종로구 경복궁',
    lat: 37.5796,
    lng: 126.9770
  });
  const [selectedDays, setSelectedDays] = useState(3);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('chat'); // 'chat' | 'itinerary'
  const [chatInput, setChatInput] = useState('');
  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [isSubwayModalOpen, setIsSubwayModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const chatBottomRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Auto-switch to itinerary tab when itineraryData changes
  useEffect(() => {
    if (itineraryData && itineraryData.dailySchedules && itineraryData.dailySchedules.length > 0) {
      setActiveRightTab('itinerary');
      setSelectedDayTab(1);
    }
  }, [itineraryData]);

  // Leaflet check
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
    }
  }, []);

  // Initialize Map
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

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      leafletMapRef.current = map;

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        handleMapLocationSelected(lat, lng);
      });

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

  // Map resize when panel collapse toggles
  useEffect(() => {
    if (leafletMapRef.current) {
      const timer = setTimeout(() => {
        leafletMapRef.current.invalidateSize();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isPanelCollapsed]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoading]);

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
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
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

  const handleStartPlan = () => {
    if (onGenerateItinerary) {
      const targetQuery = `${selectedLocation.nameKo} ${selectedDays}일 여행 코스 짜줘`;
      if (isPanelCollapsed) setIsPanelCollapsed(false);
      setActiveRightTab('chat');
      onGenerateItinerary(targetQuery, false, true);
    }
  };

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    const text = chatInput.trim();
    setChatInput('');
    if (onSendMessage) {
      onSendMessage(text);
    } else if (onGenerateItinerary) {
      onGenerateItinerary(text, false, true);
    }
  };

  const currentSchedule = itineraryData?.dailySchedules?.find(s => s.day === selectedDayTab) || itineraryData?.dailySchedules?.[0];

  return (
    <div className="web-map-dashboard-container hide-mobile" style={{
      display: 'flex',
      width: '100vw',
      height: 'calc(100vh - 68px)',
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      position: 'relative'
    }}>
      {/* =========================================================================
          [1단] 최좌측 슬림 사이드바 (64px) - 네이버 지도 스타일 아이콘 내비게이션
          ========================================================================= */}
      <aside style={{
        width: '64px',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.8rem 0',
        boxSizing: 'border-box',
        zIndex: 20,
        flexShrink: 0,
        boxShadow: '2px 0 10px rgba(0,0,0,0.02)'
      }}>
        {/* Top Icon Group */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem', width: '100%' }}>
          {/* Home / Reset Map */}
          <button 
            onClick={() => {
              if (leafletMapRef.current) {
                leafletMapRef.current.flyTo([36.2, 127.8], 7.0, { duration: 0.8 });
              }
            }}
            title={lang === 'en' ? 'Reset Map' : '지도 초기화'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <Compass size={20} />
            <span style={{ fontSize: '9px', fontWeight: 800 }}>{lang === 'en' ? 'Map' : '지도'}</span>
          </button>

          {/* AI Chat Tab */}
          <button 
            onClick={() => {
              setIsPanelCollapsed(false);
              setActiveRightTab('chat');
            }}
            title={lang === 'en' ? 'AI Chat' : 'AI 대화'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: activeRightTab === 'chat' && !isPanelCollapsed ? '#f3e8ff' : 'transparent',
              color: activeRightTab === 'chat' && !isPanelCollapsed ? '#7c3aed' : '#64748b',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <Sparkles size={20} />
            <span style={{ fontSize: '9px', fontWeight: 800 }}>AI</span>
          </button>

          {/* Itinerary Tab */}
          <button 
            onClick={() => {
              setIsPanelCollapsed(false);
              setActiveRightTab('itinerary');
            }}
            title={lang === 'en' ? 'Itinerary' : '일정표'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: activeRightTab === 'itinerary' && !isPanelCollapsed ? '#dbeafe' : 'transparent',
              color: activeRightTab === 'itinerary' && !isPanelCollapsed ? '#2563eb' : '#64748b',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <Calendar size={20} />
            <span style={{ fontSize: '9px', fontWeight: 800 }}>{lang === 'en' ? 'Plan' : '일정'}</span>
          </button>

          <div style={{ width: '32px', height: '1px', backgroundColor: '#e2e8f0', margin: '0.2rem 0' }} />

          {/* Weather & Outfit Modal */}
          <button 
            onClick={() => onOpenWeather && onOpenWeather(selectedLocation.nameKo)}
            title={lang === 'en' ? 'Weather & Outfit' : '실시간 날씨 & 코디'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#0284c7',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <CloudSun size={20} />
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Weather' : '날씨'}</span>
          </button>

          {/* Climate Card */}
          <button 
            onClick={() => onOpenEssentials && onOpenEssentials()}
            title={lang === 'en' ? 'Climate Card' : '기후동행카드'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#059669',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <CreditCard size={20} />
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Pass' : '패스'}</span>
          </button>

          {/* Subway Map */}
          <button 
            onClick={() => setIsSubwayModalOpen(true)}
            title={lang === 'en' ? 'Metro Map' : '지하철 노선도'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#2563eb',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <Train size={20} />
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Metro' : '지하철'}</span>
          </button>

          {/* eSIM (Klook) */}
          <button 
            onClick={() => {
              const esimQuery = lang === 'en' ? 'Korea eSIM Unlimited' : lang === 'ja' ? '韓国 無制限 eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国 无限流量 eSIM' : '한국 무제한 eSIM';
              window.open(buildKlookDeepLink(esimQuery), '_blank', 'noopener,noreferrer');
            }}
            title={lang === 'en' ? 'Korea eSIM' : '무제한 eSIM'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#8b5cf6',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <Wifi size={20} />
            <span style={{ fontSize: '9px', fontWeight: 700 }}>eSIM</span>
          </button>

          {/* 1330 Helpline */}
          <button 
            onClick={() => setIsHelplineModalOpen(true)}
            title={lang === 'en' ? '1330 Hotline' : '1330 긴급통역'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '2px'
            }}
          >
            <PhoneCall size={20} />
            <span style={{ fontSize: '9px', fontWeight: 700 }}>1330</span>
          </button>
        </div>

        {/* Bottom Icon Group: My Trips / Wishlist */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            onClick={() => onOpenWishlist && onOpenWishlist()}
            title={lang === 'en' ? 'Wishlist' : '찜 목록'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: wishlistCount > 0 ? '#fef2f2' : 'transparent',
              color: wishlistCount > 0 ? '#ef4444' : '#94a3b8',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Heart size={18} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 900,
                borderRadius: '9999px',
                padding: '1px 4px'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          [2단] 중앙 리얼 인터랙티브 지도 영역 (42% ↔ 100% 가변 탄력 캔버스)
          ========================================================================= */}
      <section style={{
        flex: isPanelCollapsed ? '1 1 100%' : '1 1 45%',
        height: '100%',
        position: 'relative',
        transition: 'flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Leaflet Map DOM Container */}
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

        {/* Top Floating Helper Banner */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px' }}>✨</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
            {lang === 'en' ? 'Click anywhere on map to discover Korea' : '지도에서 가고 싶은 곳 어디든 콕 찍어보세요!'}
          </span>
        </div>

        {/* Top-Right Map Controls */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomIn()}
            title="Zoom In"
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              color: '#334155'
            }}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomOut()}
            title="Zoom Out"
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              color: '#334155'
            }}
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => {
              if (leafletMapRef.current) {
                leafletMapRef.current.flyTo([36.2, 127.8], 7.0, { duration: 0.8 });
              }
            }}
            title={lang === 'en' ? 'Full View' : '전국 보기'}
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              color: '#334155'
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Bottom Floating Action Card (선택된 지역 & 코스 생성 바) */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: 'calc(100% - 32px)',
          maxWidth: '540px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 16px 36px -8px rgba(15, 23, 42, 0.16)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0
              }}>
                <MapPin size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {isGeocoding ? (lang === 'en' ? 'Detecting Location...' : '위치 감지 중...') : (lang === 'en' ? selectedLocation.nameEn : selectedLocation.nameKo)}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {selectedLocation.fullAddress}
                </div>
              </div>
            </div>

            {/* Days Pill Selector */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: '9999px',
              padding: '3px',
              gap: '2px',
              flexShrink: 0
            }}>
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDays(d)}
                  style={{
                    border: 'none',
                    backgroundColor: selectedDays === d ? '#2563eb' : 'transparent',
                    color: selectedDays === d ? '#ffffff' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {d}{lang === 'en' ? 'D' : '일'}
                </button>
              ))}
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={handleStartPlan}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 18px rgba(37, 99, 235, 0.3)',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            <Sparkles size={15} />
            <span>
              {isLoading 
                ? (lang === 'en' ? 'Crafting AI Itinerary...' : 'VORA AI 맞춤 코스 조립 중...') 
                : `${lang === 'en' ? selectedLocation.nameEn : selectedLocation.nameKo} ${selectedDays}${lang === 'en' ? '-Day AI Plan' : '일 코스 만들기'} 🚀`}
            </span>
          </button>
        </div>

        {/* ◀ / ▶ 네이버 지도 스타일 패널 접기/펼치기 플로팅 토글 버튼 */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          title={isPanelCollapsed ? (lang === 'en' ? 'Open AI Panel' : 'AI 패널 펼치기') : (lang === 'en' ? 'Collapse AI Panel' : 'AI 패널 접기')}
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 15,
            width: '24px',
            height: '56px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRight: 'none',
            borderRadius: '10px 0 0 10px',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'background-color 0.2s'
          }}
        >
          {isPanelCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </section>

      {/* =========================================================================
          [3단] 우측 Vora AI 대화 & 인터랙티브 일정표 패널 (55% ↔ 0% 가변 패널)
          ========================================================================= */}
      <section style={{
        flex: isPanelCollapsed ? '0 0 0px' : '1 1 55%',
        width: isPanelCollapsed ? 0 : 'auto',
        height: '100%',
        backgroundColor: '#ffffff',
        borderLeft: isPanelCollapsed ? 'none' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isPanelCollapsed ? 0 : 1,
        visibility: isPanelCollapsed ? 'hidden' : 'visible'
      }}>
        {/* Top Tab Bar: [💬 Vora AI 대화] vs [📅 코스 타임라인] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveRightTab('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeRightTab === 'chat' ? '#f3e8ff' : 'transparent',
                color: activeRightTab === 'chat' ? '#7c3aed' : '#64748b',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Sparkles size={15} />
              <span>{lang === 'en' ? 'VORA AI Assistant' : 'VORA AI 대화'}</span>
            </button>

            <button
              onClick={() => setActiveRightTab('itinerary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeRightTab === 'itinerary' ? '#dbeafe' : 'transparent',
                color: activeRightTab === 'itinerary' ? '#2563eb' : '#64748b',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Calendar size={15} />
              <span>
                {lang === 'en' ? 'Itinerary Timeline' : '일정표 타임라인'}
                {itineraryData?.dailySchedules?.length ? ` (${itineraryData.dailySchedules.length}일)` : ''}
              </span>
            </button>
          </div>

          {/* Target City Indicator */}
          <div style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#64748b',
            backgroundColor: '#f8fafc',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0'
          }}>
            📍 {itineraryData?.targetCity || selectedLocation.nameKo}
          </div>
        </div>

        {/* =====================================================================
            TAB CONTENT 1: 💬 Vora AI 실시간 대화창
            ===================================================================== */}
        {activeRightTab === 'chat' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#faf5ff10'
          }}>
            {/* Messages Scroll Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Default Welcome Message if empty */}
              {chatMessages.length === 0 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  maxWidth: '85%'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: 900,
                    fontSize: '13px'
                  }}>
                    V
                  </div>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '0 16px 16px 16px',
                    padding: '14px 18px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.06)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#1e293b'
                  }}>
                    <div style={{ fontWeight: 800, color: '#7c3aed', marginBottom: '4px' }}>
                      {lang === 'en' ? 'Hello! I am VORA, your Korea AI Concierge.' : '안녕하세요! 대한민국 AI 여행 컨시어지 VORA입니다.'}
                    </div>
                    <div>
                      {lang === 'en' 
                        ? 'Click anywhere on the map on the left, or tell me your travel style (e.g., "3 days in Busan with ocean view", "Seoul trendy cafe tour"). I will craft your perfect itinerary in 0.2s!'
                        : '왼쪽 지도에서 가고 싶은 곳을 콕 찍으시거나, 원하시는 여행 스타일을 말씀해 주세요! (예: "경복궁 & 북촌 한옥마을 코스 짜줘", "부산 3일 바다뷰 여행") 0.2초 만에 완벽한 일정을 조립해 드립니다.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Message Stream */}
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {msg.role !== 'user' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 900,
                      fontSize: '12px'
                    }}>
                      V
                    </div>
                  )}

                  <div style={{
                    maxWidth: '80%',
                    backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text || msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: 900,
                    fontSize: '12px'
                  }}>
                    V
                  </div>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '0 16px 16px 16px',
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{lang === 'en' ? 'VORA AI is crafting your route...' : 'VORA AI가 최적의 동선을 시뮬레이션 중입니다...'}</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Chat Input Form */}
            <form 
              onSubmit={handleSendChat}
              style={{
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: '8px'
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'en' ? 'Ask VORA AI (e.g. "Add trendy cafes in Seongsu", "Rainy day indoor plan")...' : 'VORA AI에게 무엇이든 물어보세요 (예: "성수동 감성카페 추가해줘", "비 올 때 실내 코스")...'}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: chatInput.trim() ? '#2563eb' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.15s'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* =====================================================================
            TAB CONTENT 2: 📅 1일차~N일차 인터랙티브 일정표 타임라인
            ===================================================================== */}
        {activeRightTab === 'itinerary' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Day Selector Tabs */}
            {itineraryData?.dailySchedules?.length > 0 ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  overflowX: 'auto',
                  flexShrink: 0
                }}>
                  {itineraryData.dailySchedules.map((sch) => (
                    <button
                      key={sch.day}
                      onClick={() => setSelectedDayTab(sch.day)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: selectedDayTab === sch.day ? 'none' : '1px solid #e2e8f0',
                        backgroundColor: selectedDayTab === sch.day ? '#2563eb' : '#ffffff',
                        color: selectedDayTab === sch.day ? '#ffffff' : '#64748b',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: selectedDayTab === sch.day ? '0 4px 10px rgba(37, 99, 235, 0.25)' : 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s'
                      }}
                    >
                      {sch.day}{lang === 'en' ? ' Day' : '일차'}
                    </button>
                  ))}
                </div>

                {/* Day Spots Timeline List */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Summary / Theme for the day */}
                  {currentSchedule?.theme && (
                    <div style={{
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      border: '1px solid rgba(37, 99, 235, 0.15)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#1d4ed8'
                    }}>
                      ✨ {currentSchedule.theme}
                    </div>
                  )}

                  {/* Spot Cards */}
                  {(currentSchedule?.spots || []).map((spot, sIdx) => {
                    const isFav = bookmarks.some(b => 
                      (typeof b === 'object' && ((b.contentId && b.contentId === (spot.contentId || spot.id)) || (b.id && b.id === spot.id) || (b.title && b.title === spot.title))) ||
                      (typeof b === 'string' && (b === spot.id || b === spot.contentId || b === spot.title))
                    );

                    return (
                      <div
                        key={spot.id || sIdx}
                        onClick={() => onSelectSpot && onSelectSpot(spot)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '14px',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          {/* Step Index Badge */}
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {sIdx + 1}
                          </div>

                          <div style={{ overflow: 'hidden' }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: 800,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {spot.title || spot.name}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '2px'
                            }}>
                              <span>⏱️ {spot.duration || '90분'}</span>
                              {spot.time && <span>• {spot.time}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Favorite & Arrow */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleBookmark) onToggleBookmark(spot);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isFav ? '#ef4444' : '#cbd5e1',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
                          </button>
                          <ChevronRight size={16} color="#94a3b8" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Google Maps Full Route Button */}
                  <button
                    onClick={() => {
                      const spots = currentSchedule?.spots || [];
                      if (spots.length === 0) return;
                      const origin = encodeURIComponent(spots[0].title || spots[0].name);
                      const destination = encodeURIComponent(spots[spots.length - 1].title || spots[spots.length - 1].name);
                      const waypoints = spots.slice(1, -1).map(s => encodeURIComponent(s.title || s.name)).join('|');
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=transit`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    <Map size={15} />
                    <span>{lang === 'en' ? 'Open Today Route in Google Maps ↗' : '🗺️ 구글맵에서 오늘 코스 전체 길찾기 ↗'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                color: '#94a3b8',
                gap: '12px'
              }}>
                <Compass size={40} strokeWidth={1.5} />
                <div style={{ fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                  {lang === 'en' 
                    ? 'No itinerary created yet.\nClick "Create AI Plan" on the map!' 
                    : '아직 생성된 일정이 없습니다.\n왼쪽 지도에서 지역을 선택하고 [코스 만들기]를 눌러보세요!'}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

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
