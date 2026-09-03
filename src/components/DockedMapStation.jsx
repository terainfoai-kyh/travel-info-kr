import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Navigation, 
  Clock, 
  ExternalLink, 
  Sparkles,
  Maximize2,
  Calendar,
  Layers
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { SOUTH_KOREA_MAP_BOUNDS, updateMapTileLayer } from '../utils/mapTileUtils';

// 🎯 Organic Curved Route Generator for smooth travel paths
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

export default function DockedMapStation({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  isOpen = true,
  onToggleOpen
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [selectedSpotPreview, setSelectedSpotPreview] = useState(null);
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);
  const activeBoundsRef = useRef([]);

  const targetCity = itineraryData?.targetCity || '서울';
  const totalDays = itineraryData?.days || itineraryData?.dailySchedules?.length || 3;

  // Current day spots
  const currentDaySpots = React.useMemo(() => {
    if (!itineraryData?.dailySchedules) {
      return itineraryData?.spots || [];
    }
    const daySchedule = itineraryData.dailySchedules.find(s => s.day === activeDay);
    return daySchedule?.spots || itineraryData.spots || [];
  }, [itineraryData, activeDay]);

  // 1. Leaflet Ready Check
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
    }
  }, []);

  // 2. Map Instance Clean Lifecycle & Resize Observer
  useEffect(() => {
    if (!isOpen) {
      // 🛡️ 지도가 접힐 때 기존 지도 인스턴스 100% 완전 파기 (메모리 릭 및 줌 누적 원천 차단)
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
      markersRef.current = [];
      routeLayerRef.current = null;
      return;
    }

    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;

    // Clean up stale instance before initializing fresh
    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.remove();
      } catch (e) {}
      leafletMapRef.current = null;
    }

    const southKoreaBounds = window.L.latLngBounds(SOUTH_KOREA_MAP_BOUNDS);
    const map = window.L.map(mapContainerRef.current, {
      center: [37.5665, 126.9780],
      zoom: 12,
      minZoom: 6.5,
      maxZoom: 18,
      maxBounds: southKoreaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false
    });

    // 🗺️ 언어별 지도 타일 동적 장착 (KO: OSM 국문, EN/JA/ZH: CartoDB Voyager 글로벌 영문)
    updateMapTileLayer(map, tileLayerRef, lang);

    leafletMapRef.current = map;

    // 🎯 ResizeObserver: 사이드바가 320px 이상으로 완전히 펼쳐졌을 때만 단 1회 정밀 핏팅
    let ro = null;
    let debounceTimer = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // 펼쳐지는 중간 너비(50px~200px)에서의 조기 피팅 간섭 원천 차단
          if (entry.contentRect.width >= 300 && entry.contentRect.height > 100 && leafletMapRef.current) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              if (activeBoundsRef.current && activeBoundsRef.current.length > 0 && window.L && leafletMapRef.current) {
                const b = window.L.latLngBounds(activeBoundsRef.current);
                if (b && b.isValid()) {
                  try {
                    leafletMapRef.current.invalidateSize({ pan: false });
                    leafletMapRef.current.fitBounds(b.pad(0.14), { padding: [25, 25], maxZoom: 14.5, animate: false });
                  } catch (e) {}
                }
              }
            }, 100);
          }
        }
      });
      ro.observe(mapContainerRef.current);
    }

    const initialTimer = setTimeout(() => {
      if (leafletMapRef.current && activeBoundsRef.current && activeBoundsRef.current.length > 0 && window.L) {
        try {
          leafletMapRef.current.invalidateSize({ pan: false });
          const b = window.L.latLngBounds(activeBoundsRef.current);
          if (b && b.isValid()) {
            leafletMapRef.current.fitBounds(b.pad(0.14), { padding: [25, 25], maxZoom: 14.5, animate: false });
          }
        } catch (e) {}
      }
    }, 200);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(debounceTimer);
      if (ro) ro.disconnect();
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };
  }, [isOpen, isLeafletReady]);

  // 3. Render Spots & Routes on Map
  useEffect(() => {
    if (!isOpen || !leafletMapRef.current || !window.L) return;
    const map = leafletMapRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const isValidLatLng = (lat, lng) => {
      const nLat = Number(lat);
      const nLng = Number(lng);
      return !isNaN(nLat) && !isNaN(nLng) && isFinite(nLat) && isFinite(nLng) && nLat > 30 && nLat < 45 && nLng > 120 && nLng < 135;
    };

    const safeFlyTo = (targetLatLng, targetZoom = 15, options = { duration: 0.5 }) => {
      if (!leafletMapRef.current || !window.L) return;
      const map = leafletMapRef.current;
      const lat = Array.isArray(targetLatLng) ? Number(targetLatLng[0]) : Number(targetLatLng?.lat);
      const lng = Array.isArray(targetLatLng) ? Number(targetLatLng[1]) : Number(targetLatLng?.lng);
      if (!isValidLatLng(lat, lng)) return;
      const zoom = (typeof targetZoom === 'number' && !isNaN(targetZoom) && isFinite(targetZoom)) ? targetZoom : 15;
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

    const validSpots = currentDaySpots.filter(sp => {
      const lat = Number(sp.lat || sp.mapy || sp.latitude);
      const lng = Number(sp.lng || sp.mapx || sp.longitude);
      return isValidLatLng(lat, lng);
    });

    if (validSpots.length === 0) {
      map.setView([37.5665, 126.9780], 11);
      return;
    }

    const latLngs = [];

    validSpots.forEach((spot, idx) => {
      const lat = Number(spot.lat || spot.mapy || spot.latitude);
      const lng = Number(spot.lng || spot.mapx || spot.longitude);
      const spotPos = [lat, lng];
      latLngs.push(spotPos);

      const markerHtml = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
          border: 2px solid #ffffff;
          cursor: pointer;
          transition: transform 0.15s ease;
        ">
          ${idx + 1}
        </div>
      `;

      const icon = window.L.divIcon({
        html: markerHtml,
        className: 'docked-map-pin-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = window.L.marker(spotPos, { icon }).addTo(map);
      marker.on('click', () => {
        setSelectedSpotPreview(spot);
        if (isValidLatLng(spotPos[0], spotPos[1])) {
          safeFlyTo(spotPos, 15, { duration: 0.5 });
        }
      });

      markersRef.current.push(marker);
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

    activeBoundsRef.current = latLngs;

    // 🎯 1번~마지막 마커 100% 정중앙 핏팅 함수
    const applySpotFit = (coords) => {
      if (!coords || coords.length === 0 || !window.L || !leafletMapRef.current) return;
      const b = window.L.latLngBounds(coords);
      if (b && b.isValid()) {
        try {
          leafletMapRef.current.invalidateSize({ pan: false });
          leafletMapRef.current.fitBounds(b.pad(0.14), { padding: [25, 25], maxZoom: 14.5, animate: false });
        } catch (e) {}
      }
    };

    applySpotFit(latLngs);
    setTimeout(() => applySpotFit(latLngs), 80);
    setTimeout(() => applySpotFit(latLngs), 250);
  }, [isOpen, currentDaySpots, activeDay]);

  // If collapsed: show slim vertical docking pill
  if (!isOpen) {
    return (
      <div 
        className="hide-mobile"
        style={{
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 110px)',
          width: '46px',
          marginRight: '0.85rem',
          flexShrink: 0,
          zIndex: 90
        }}
      >
        <button
          type="button"
          onClick={onToggleOpen}
          title="스마트 지도 스테이션 열기"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            padding: '1rem 0.2rem',
            transition: 'all 0.2s ease',
            color: '#1e293b'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateX(2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <ChevronRight size={18} />
          </div>
          <span style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#475569'
          }}>
            🗺️ {lang === 'en' ? 'OPEN MAP' : '지도 보기'}
          </span>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '0.15rem 0.35rem',
            borderRadius: '6px',
            backgroundColor: '#f1f5f9',
            color: '#2563eb'
          }}>
            {targetCity}
          </div>
        </button>
      </div>
    );
  }

  // Expanded Left Docked Station (Width: 360px ~ 380px)
  return (
    <aside 
      className="docked-map-station-container hide-mobile"
      style={{
        position: 'sticky',
        top: '80px',
        width: '370px',
        height: 'calc(100vh - 110px)',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginRight: '1.25rem',
        flexShrink: 0,
        zIndex: 90,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* 1. Header Toolbar */}
      <div style={{
        padding: '0.75rem 0.95rem',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}>
            <MapPin size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
              {targetCity}
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>
              {lang === 'en' ? 'Live Route Radar' : lang === 'ja' ? 'リアルタイム動線レーダー' : (lang === 'zh' || lang === 'zht') ? '实时路线雷达' : '실시간 스마트 동선 레이더'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={onToggleOpen}
            title={lang === 'en' ? 'Fold map to left' : lang === 'ja' ? '地図を折りたたむ' : (lang === 'zh' || lang === 'zht') ? '折叠地图' : '좌측으로 지도 접기'}
            style={{
              padding: '0.3rem 0.55rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#64748b'; }}
          >
            <ChevronLeft size={14} />
            <span>{lang === 'en' ? 'Fold' : lang === 'ja' ? '閉じる' : (lang === 'zh' || lang === 'zht') ? '折叠' : '접기'}</span>
          </button>
        </div>
      </div>

      {/* 2. Day Switcher Pills */}
      {totalDays > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.5rem 0.85rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelectDay && onSelectDay(d)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                border: activeDay === d ? '1px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: activeDay === d ? '#2563eb' : '#f8fafc',
                color: activeDay === d ? '#ffffff' : '#64748b',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              Day {d}
            </button>
          ))}
        </div>
      )}

      {/* 3. Interactive Leaflet Map Viewport */}
      <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
        <div 
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9' }}
        />

        {/* Spot Preview Floating Overlay (when a pin is clicked) */}
        {selectedSpotPreview && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '0.65rem 0.85rem',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
            border: '1px solid #e2e8f0',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem'
          }}>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedSpotPreview.title || selectedSpotPreview.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedSpotPreview.address || selectedSpotPreview.location || '대한민국 관광지'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {onOpenDetail && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(selectedSpotPreview)}
                  style={{
                    padding: '0.3rem 0.55rem',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'en' ? 'Details' : lang === 'ja' ? '詳細' : (lang === 'zh' || lang === 'zht') ? '详情' : '상세'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedSpotPreview(null)}
                style={{
                  padding: '0.3rem 0.45rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  fontSize: '0.7rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Spot Sequence Strip */}
      <div style={{
        padding: '0.65rem 0.85rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
            {lang === 'en' ? `Day ${activeDay} Spots` : lang === 'ja' ? `${activeDay}日目 コース` : (lang === 'zh' || lang === 'zht') ? `第${activeDay}天 景点` : `${activeDay}일차 방문 코스`} ({currentDaySpots.length})
          </span>
          {currentDaySpots.length > 1 && (
            <a
              href={generateGoogleMapsRouteUrl(currentDaySpots)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#2563eb',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <Navigation size={11} />
              <span>{lang === 'en' ? 'Google Route ↗' : '구글 동선 ↗'}</span>
            </a>
          )}
        </div>

        {/* Micro Spot Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '120px', overflowY: 'auto' }}>
          {currentDaySpots.map((spot, sIdx) => (
            <div
              key={sIdx}
              onClick={() => {
                setSelectedSpotPreview(spot);
                const sLat = Number(spot.lat || spot.mapy || spot.latitude);
                const sLng = Number(spot.lng || spot.mapx || spot.longitude);
                if (leafletMapRef.current && !isNaN(sLat) && !isNaN(sLng) && sLat > 30 && sLat < 45 && sLng > 120 && sLng < 135) {
                  try {
                    const map = leafletMapRef.current;
                    const size = map?.getSize?.();
                    if (size && size.x > 0 && size.y > 0) {
                      map.flyTo([sLat, sLng], 15, { duration: 0.5 });
                    } else {
                      map.setView([sLat, sLng], 15, { animate: false });
                    }
                  } catch (e) {}
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.28rem 0.45rem',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.62rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {sIdx + 1}
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {spot.title || spot.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
