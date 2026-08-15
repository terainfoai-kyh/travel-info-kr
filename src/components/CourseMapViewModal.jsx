import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, MapPin, Sparkles, Navigation, Calendar, 
  ChevronRight, Compass, Car, Bus, Footprints, ExternalLink,
  Lock, Unlock, Map as MapIcon, Share2, Check
} from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getSpotDetailButtonLabel, getCloseButtonLabel } from '../i18n/translations';
import { useModalHistory } from '../hooks/useModalHistory';

// Approximate city center coordinates for graceful map fallbacks
const REGION_COORDS = {
  '서울': [37.5665, 126.9780],
  '수원': [37.2636, 127.0286],
  '부산': [35.1796, 129.0756],
  '제주': [33.4996, 126.5312],
  '인천': [37.4563, 126.7052],
  '강릉': [37.7519, 128.8761],
  '경주': [35.8562, 129.2247],
  '전주': [35.8242, 127.1480],
  '대구': [35.8714, 128.6014],
  '대전': [36.3504, 127.3845],
  '광주': [35.1595, 126.8526],
  '여수': [34.7604, 127.6622],
  '속초': [38.2070, 128.5918],
  '거제': [34.8806, 128.6211],
  'default': [37.5665, 126.9780]
};

function getApproxCoords(spot, regionName, idx) {
  let lat = parseFloat(spot?.mapy || spot?.lat);
  let lng = parseFloat(spot?.mapx || spot?.lng);

  if (!isNaN(lat) && !isNaN(lng) && lat > 30 && lat < 45 && lng > 120 && lng < 135) {
    return [lat, lng];
  }

  const base = REGION_COORDS[regionName] || REGION_COORDS['default'];
  // Micro-spread offsets for distinct marker pins
  const offsetLat = ((idx % 3) - 1) * 0.012 + (Math.sin(idx + 1) * 0.005);
  const offsetLng = (((idx + 1) % 3) - 1) * 0.015 + (Math.cos(idx + 1) * 0.005);
  return [base[0] + offsetLat, base[1] + offsetLng];
}

export default function CourseMapViewModal({
  isOpen,
  onClose,
  spots = [],
  regionName = '추천',
  lang = 'ko',
  onOpenDetail
}) {
  useModalHistory(isOpen, onClose, 'course-map-modal');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [activeDay, setActiveDay] = useState(1);
  const [isMapUnlocked, setIsMapUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Responsive desktop detection
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group spots by assigned day (1~5)
  const daysGroup = {};
  spots.forEach((spot, index) => {
    const day = spot.assignedDay || 1;
    if (!daysGroup[day]) {
      daysGroup[day] = [];
    }
    daysGroup[day].push({ ...spot, _originalIndex: index });
  });

  const availableDays = Object.keys(daysGroup).map(Number).sort((a, b) => a - b);
  const currentDay = availableDays.includes(activeDay) ? activeDay : (availableDays[0] || 1);
  const currentDaySpots = daysGroup[currentDay] || [];

  // Reset to first available day on open
  useEffect(() => {
    if (isOpen && availableDays.length > 0 && !availableDays.includes(activeDay)) {
      setActiveDay(availableDays[0]);
    }
  }, [isOpen]);

  // Dynamically load Leaflet library if not already loaded
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const loadLeaflet = () => {
      if (window.L) {
        if (isMounted) setIsLeafletReady(true);
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
        script.onload = () => {
          if (isMounted) setIsLeafletReady(true);
        };
        document.head.appendChild(script);
      } else {
        const timer = setInterval(() => {
          if (window.L) {
            clearInterval(timer);
            if (isMounted) setIsLeafletReady(true);
          }
        }, 100);
      }
    };

    loadLeaflet();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Render & Update Leaflet Interactive Map
  useEffect(() => {
    if (!isOpen || !isLeafletReady || !window.L || !mapContainerRef.current) return;
    if (currentDaySpots.length === 0) return;

    const L = window.L;

    // Clean up existing map instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    if (mapContainerRef.current) {
      mapContainerRef.current._leaflet_id = null;
    }

    const coordsList = currentDaySpots.map((spot, idx) => getApproxCoords(spot, regionName, idx));

    // On PC: Always enable interactive mouse drag and wheel zoom. On Mobile: toggle with isMapUnlocked
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: isDesktop ? true : isMapUnlocked,
      touchZoom: isDesktop ? true : isMapUnlocked,
      scrollWheelZoom: isDesktop ? true : isMapUnlocked,
      doubleClickZoom: isDesktop ? true : isMapUnlocked
    });

    leafletMapRef.current = map;

    // Tile layer: OSM for Korean, CartoDB Voyager for Multilingual
    const tileUrl = (lang === 'ko')
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    // Numbered colorful custom markers
    const markerColors = ['#9333ea', '#2563eb', '#16a34a', '#ea580c', '#0891b2'];

    coordsList.forEach(([lat, lng], idx) => {
      const spot = currentDaySpots[idx];
      const color = markerColors[idx % markerColors.length];
      const title = getTranslatedTitle(spot.title, lang);

      const customIcon = L.divIcon({
        className: 'custom-course-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, ${color} 0%, #1e1b4b 100%);
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 14px;
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-size: 11px; font-weight: 800; color: ${color}; margin-bottom: 2px;">${currentDay}일차 · NO.${idx + 1}</div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 11px; color: #64748b;">${spot.location || spot.addr1 || ''}</div>
        </div>
      `);
    });

    // Draw Polyline connecting all spots in order
    if (coordsList.length > 1) {
      L.polyline(coordsList, {
        color: '#9333ea',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Auto fit bounds to enclose all spots
    try {
      const bounds = L.latLngBounds(coordsList);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } catch (e) {}

  }, [isOpen, isLeafletReady, currentDay, isMapUnlocked, isDesktop, lang, spots]);

  if (!isOpen) return null;

  // Build Google Maps Multi-Waypoint Navigation URL
  const buildGoogleMapsMultiStopUrl = () => {
    if (currentDaySpots.length === 0) return 'https://www.google.com/maps';
    if (currentDaySpots.length === 1) {
      const s = currentDaySpots[0];
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.title + ' ' + (s.location || s.addr1 || ''))}`;
    }

    const origin = currentDaySpots[0].title + ' ' + (currentDaySpots[0].location || currentDaySpots[0].addr1 || '');
    const destination = currentDaySpots[currentDaySpots.length - 1].title + ' ' + (currentDaySpots[currentDaySpots.length - 1].location || currentDaySpots[currentDaySpots.length - 1].addr1 || '');
    const waypoints = currentDaySpots.slice(1, -1).map(s => s.title + ' ' + (s.location || s.addr1 || '')).join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    url += '&travelmode=transit';
    return url;
  };

  const handleCopyCourse = () => {
    let summaryText = `[Vora AI] ${regionName} ${currentDay}일차 추천 코스 동선:\n`;
    currentDaySpots.forEach((s, idx) => {
      summaryText += `${idx + 1}. ${s.title} (${s.location || s.addr1 || ''})\n`;
    });
    summaryText += `\n구글 지도 경로: ${buildGoogleMapsMultiStopUrl()}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dayIcons = ['🏰', '🌿', '☕', '🌊', '🏯'];

  const modalNode = (
    <div
      className="modal-overlay-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: isDesktop ? '2rem 1.5rem 2.5rem 1.5rem' : '1rem 0.75rem 2rem 0.75rem',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '24px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          maxWidth: '1040px',
          width: '100%',
          maxHeight: isDesktop ? 'calc(100vh - 4.5rem)' : 'calc(100vh - 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10000000
        }}
      >
        {/* TOP HEADER */}
        <div style={{
          padding: isDesktop ? '1.2rem 1.5rem' : '1rem 1.15rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#9333ea',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
              flexShrink: 0
            }}>
              <Compass size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: isDesktop ? '1.15rem' : '1rem', fontWeight: 900, margin: 0, color: '#0f172a', letterSpacing: '-0.3px' }}>
                🗺️ {regionName} {availableDays.length > 1 ? `${availableDays.length}일 코스` : '당일 코스'} 스마트 동선
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                한국관광공사 TourAPI 4.0 정품 명소 & 실시간 GPS 연동
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              onClick={handleCopyCourse}
              style={{
                padding: '0.4rem 0.65rem',
                backgroundColor: copied ? '#dcfce7' : '#f1f5f9',
                color: copied ? '#15803d' : '#334155',
                border: copied ? '1px solid #86efac' : '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copied ? '복사 완료!' : '코스 복사'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="닫기"
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <X size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* DAY SELECTOR TABS BAR */}
        {availableDays.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '0.45rem',
            padding: '0.6rem 1.25rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {availableDays.map((dNum, idx) => {
              const isActive = dNum === currentDay;
              const count = daysGroup[dNum]?.length || 0;
              const icon = dayIcons[idx % dayIcons.length];

              return (
                <button
                  key={dNum}
                  onClick={() => setActiveDay(dNum)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #9333ea' : '1px solid #cbd5e1',
                    backgroundColor: isActive ? '#9333ea' : '#ffffff',
                    color: isActive ? '#ffffff' : '#334155',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 12px rgba(147, 51, 234, 0.25)' : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{icon} {dNum}일차</span>
                  <span style={{
                    fontSize: '0.68rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px'
                  }}>
                    {count}곳
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* MODAL BODY (DESKTOP: SPLIT 2-COLUMN | MOBILE: VERTICAL STACK) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column-reverse',
          overflowY: 'auto',
          minHeight: '380px'
        }}>
          
          {/* LEFT: TIMELINE STEPPER LIST */}
          <div style={{
            flex: isDesktop ? '1 1 50%' : '1 1 auto',
            padding: '1.15rem',
            overflowY: 'auto',
            borderRight: isDesktop ? '1px solid #e2e8f0' : 'none',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
                📍 {currentDay}일차 추천 일정 ({currentDaySpots.length}개 명소)
              </div>
              <span style={{ fontSize: '0.7rem', color: '#9333ea', fontWeight: 700, backgroundColor: '#f3e8ff', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                ① ➔ ② ➔ ③ 순서대로 추천
              </span>
            </div>

            {currentDaySpots.map((spot, idx) => {
              const isLast = idx === currentDaySpots.length - 1;
              const title = getTranslatedTitle(spot.title, lang);
              const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' ' + (spot.location || spot.addr1 || ''))}`;

              return (
                <div key={spot.id || idx} style={{ position: 'relative' }}>
                  {/* SPOT CARD */}
                  <div
                    onClick={() => onOpenDetail && onOpenDetail(spot)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      padding: '0.8rem 0.95rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1.5px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#9333ea';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(147, 51, 234, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#9333ea',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 900
                        }}>
                          {idx + 1}
                        </div>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>
                          {title}
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                        {idx === 0 ? '🌅 오전' : (idx === 1 ? '☀️ 오후' : '🌙 저녁/야경')}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span>{spot.location || spot.addr1 || '상세 주소 제공'}</span>
                    </div>

                    {/* CARD BUTTONS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenDetail && onOpenDetail(spot)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '0.4rem 0.5rem',
                          backgroundColor: '#9333ea',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Sparkles size={11} />
                        <span>{getSpotDetailButtonLabel(lang, false)}</span>
                      </button>

                      <a
                        href={mapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '0.4rem 0.5rem',
                          backgroundColor: '#f0f9ff',
                          color: '#0284c7',
                          border: '1px solid #bae6fd',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <MapPin size={11} />
                        <span>지도 길찾기</span>
                      </a>
                    </div>
                  </div>

                  {/* TIMELINE CONNECTOR BETWEEN SPOTS */}
                  {!isLast && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.55rem 0 0.55rem 1.6rem',
                      color: '#9333ea',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      <div style={{
                        width: '2px',
                        height: '22px',
                        backgroundColor: '#d8b4fe',
                        marginLeft: '-16px',
                        marginRight: '10px'
                      }} />
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#f3e8ff',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '12px'
                      }}>
                        {idx === 0 ? <Footprints size={12} /> : <Bus size={12} />}
                        <span>{idx === 0 ? '🚶 도보 약 15분 (800m)' : '🚌 대중교통 약 10~15분'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: INTERACTIVE LEAFLET MAP VIEW */}
          <div style={{
            flex: isDesktop ? '1 1 50%' : '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f1f5f9',
            minHeight: isDesktop ? '340px' : '260px',
            position: 'relative'
          }}>
            {/* MAP FLOATING CONTROLS */}
            <div style={{
              position: 'absolute',
              top: '0.65rem',
              left: '0.65rem',
              right: '0.65rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isDesktop ? 'flex-end' : 'space-between',
              gap: '0.5rem',
              pointerEvents: 'none'
            }}>
              {/* Map Lock/Unlock Button (MOBILE ONLY) */}
              {!isDesktop && (
                <button
                  onClick={() => setIsMapUnlocked(!isMapUnlocked)}
                  style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '10px',
                    border: isMapUnlocked ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                    backgroundColor: isMapUnlocked ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    color: isMapUnlocked ? '#166534' : '#334155',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  {isMapUnlocked ? <Unlock size={13} color="#16a34a" /> : <Lock size={13} color="#64748b" />}
                  <span>{isMapUnlocked ? '지도 조작 가능 ⇄' : '터치 스크롤 고정 🔒'}</span>
                </button>
              )}

              {/* Google Maps Multi-Stop Link */}
              <a
                href={buildGoogleMapsMultiStopUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Navigation size={13} />
                <span>구글맵 전체 경로 ↗</span>
              </a>
            </div>

            {/* LEAFLET MAP CONTAINER */}
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '100%',
                minHeight: isDesktop ? '340px' : '260px',
                backgroundColor: '#e2e8f0'
              }}
            />
          </div>

        </div>

        {/* BOTTOM FULL-WIDTH CLOSE BUTTON (Option C: Light Outline Border Style) */}
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '0.7rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1.5px solid #cbd5e1',
              borderRadius: '14px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <X size={18} strokeWidth={2.5} />
            <span>{getCloseButtonLabel(lang)}</span>
          </button>
        </div>

      </div>
    </div>
  );

  // Use Portal to mount directly to document.body so sticky Header never covers it
  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
