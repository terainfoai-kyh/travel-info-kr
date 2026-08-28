import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Compass, MapPin, ChevronRight, RefreshCw, ZoomIn, ZoomOut, Navigation } from 'lucide-react';

// 🗺️ 전국 대표 권역 빠른 좌표 오프라인 Fallback 맵
const REGIONAL_FALLBACK_CENTERS = [
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

// 🧮 두 위경도 사이의 직선거리 (km) 계산
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

export default function DesktopMapExplorer({ lang = 'ko', onSelectCityPlan }) {
  const [selectedLocation, setSelectedLocation] = useState({
    nameKo: '안동',
    nameEn: 'Andong',
    fullAddress: '경상북도 안동시',
    lat: 36.5683,
    lng: 128.7294
  });
  const [selectedDays, setSelectedDays] = useState(2);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const [isGeocoding, setIsGeocoding] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // 1. Leaflet CSS & JS Dynamic Loader
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    }
  }, []);

  // 2. Initialize Full-Width Real Leaflet Map with Click-to-Explore Listener
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [35.8, 127.8],
        zoom: 7.2,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      });

      // CartoDB Voyager / OpenStreetMap Clean High-DPI Tiles
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      leafletMapRef.current = map;

      // 🌟 [핵심 인터랙션] 지도 위 어디든 클릭 시 해당 지역 감지 및 핀 이동!
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        handleMapLocationSelected(lat, lng);
      });

      // 초기 마커 장착
      const initPinHtml = createMarkerPinHtml(selectedLocation.nameKo, selectedLocation.nameEn, lang);
      const customIcon = window.L.divIcon({
        html: initPinHtml,
        className: 'vora-explorer-div-icon',
        iconSize: [0, 0]
      });

      markerRef.current = window.L.marker([selectedLocation.lat, selectedLocation.lng], { icon: customIcon }).addTo(map);

      // Force Invalidate Size to prevent gray blanks
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 250);
    }
  }, [isLeafletReady]);

  // 3. Pin Icon Generator Helper
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
        box-shadow: 0 8px 24px rgba(37,99,235,0.45), 0 0 0 4px rgba(255,255,255,0.9);
        border: 2px solid #ffffff;
        cursor: pointer;
        transform: translate(-50%, -50%);
        animation: voraPinPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
        <span>📍 ${label}</span>
      </div>
    `;
  };

  // 4. Reverse Geocoding Handler (OSM API + Instant Fallback)
  const handleMapLocationSelected = async (lat, lng) => {
    setIsGeocoding(true);

    // 1순위: 가장 가까운 한국 대표 권역 즉시 계산 (0.0001초 응답 보장)
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

    // 2순위: OpenStreetMap Nominatim Live Reverse Geocoding 호출로 정밀 행정구역 추출
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
    } catch {
      // Fallback to nearest city
    }

    const newLoc = {
      nameKo: detectedCityNameKo,
      nameEn: detectedCityNameEn,
      fullAddress: detectedFullAddr,
      lat,
      lng
    };

    setSelectedLocation(newLoc);
    setIsGeocoding(false);

    // Move Marker & Update Icon
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
      leafletMapRef.current.flyTo([35.8, 127.8], 7.2, { duration: 0.8 });
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
      margin: '0.6rem auto 2.2rem',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.1)',
      overflow: 'hidden',
      padding: '1.2rem 1.4rem'
    }}>
      {/* 🌟 Header Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.8rem',
        paddingBottom: '0.6rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Compass size={18} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {lang === 'en' 
                ? 'Click Anywhere on Korea Map to Plan Your AI Trip!' 
                : '지명을 몰라도 괜찮아요! 지도에서 가고 싶은 곳 어디든 콕 찍어보세요'}
            </h2>
            <p style={{
              fontSize: '0.76rem',
              color: '#64748b',
              margin: '0.1rem 0 0',
              fontWeight: 500
            }}>
              {lang === 'en'
                ? 'Click any region on the map -> Select trip days -> Click "AI Course Plan" to chat!'
                : '지도 위 원하는 지역을 자유롭게 클릭하면 위치가 인식되며, 우측 버튼으로 0.2초 만에 AI 일정을 시작할 수 있습니다.'}
            </p>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomIn()}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="확대"
          >
            <ZoomIn size={14} color="#0f172a" />
          </button>
          <button
            onClick={() => leafletMapRef.current && leafletMapRef.current.zoomOut()}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="축소"
          >
            <ZoomOut size={14} color="#0f172a" />
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
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer'
            }}
            title="전국 전도 리셋"
          >
            <RefreshCw size={12} />
            <span>전국 보기</span>
          </button>
        </div>
      </div>

      {/* 🗺️ Real Leaflet Wide Map Canvas with Click-to-Explore */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        backgroundColor: '#e2e8f0',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
      }}>
        {/* Leaflet Mount Node */}
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '100%', minHeight: '420px' }} 
        />

        {/* 🌟 [선배님 직관 디자인] 지도 하단 플로팅 선택 바 (선택된 지명 + 기간 + AI 플랜 만들기) */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '920px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1.5px solid rgba(37, 99, 235, 0.3)',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.22)',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 500,
          gap: '1rem'
        }}>
          {/* Left: Selected Region Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
            }}>
              <MapPin size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Selected Region on Map' : '지도에서 선택한 지역'}
              </div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {selectedLocation.fullAddress || selectedLocation.nameKo}
                <span style={{ fontSize: '0.80rem', color: '#2563eb', marginLeft: '0.35rem', fontWeight: 800 }}>
                  ({selectedLocation.nameEn})
                </span>
              </div>
            </div>
          </div>

          {/* Center: Trip Days Pill Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b' }}>
              {lang === 'en' ? 'Duration:' : '여행 기간:'}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDays(d)}
                  style={{
                    border: selectedDays === d ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: selectedDays === d ? '#2563eb' : '#ffffff',
                    color: selectedDays === d ? '#ffffff' : '#475569',
                    borderRadius: '6px',
                    padding: '0.18rem 0.5rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lang === 'en' ? `${d}D` : `${d}일`}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Direct Plan CTA Button */}
          <button
            onClick={handleStartPlan}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.1rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Sparkles size={15} />
            <span>
              {lang === 'en' 
                ? `Create ${selectedLocation.nameEn} Plan 🚀` 
                : `✨ ${selectedLocation.nameKo} AI 코스 플랜 만들기 🚀`}
            </span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Map Watermark Helper */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 800,
          color: '#2563eb',
          zIndex: 400,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Navigation size={12} />
          <span>{lang === 'en' ? 'Click anywhere on Korea map' : '지도 위 가고 싶은 곳 어디든 클릭해보세요!'}</span>
        </div>
      </div>
    </div>
  );
}
