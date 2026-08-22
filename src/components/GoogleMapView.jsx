import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

export default function GoogleMapView({
  spots = [],
  activeDay = 1,
  targetCity = '서울',
  lang = 'ko',
  focusedSpotIndex = null,
  onSelectSpotIndex = null
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const spotsToDisplay = Array.isArray(spots) ? spots : [];
  const fullRouteUrl = generateGoogleMapsRouteUrl(spotsToDisplay);

  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const activeBoundsRef = useRef(null);
  const markersRef = useRef([]);

  // Ensure Leaflet readiness from index.html preload
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletReady(true);
      return;
    }
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.L) {
        setIsLeafletReady(true);
        clearInterval(checkInterval);
      }
    }, 50);
    return () => clearInterval(checkInterval);
  }, []);

  // 🎯 Interactive Smooth FlyTo & Popup Trigger when user clicks spot in timeline list
  useEffect(() => {
    if (!leafletMapRef.current || spotsToDisplay.length === 0) return;
    if (focusedSpotIndex !== null && typeof focusedSpotIndex === 'number' && markersRef.current[focusedSpotIndex]) {
      const marker = markersRef.current[focusedSpotIndex];
      const latLng = marker.getLatLng();
      leafletMapRef.current.flyTo(latLng, 16, { duration: 0.8 });
      marker.openPopup();
    } else if (focusedSpotIndex === null && leafletMapRef.current && activeBoundsRef.current) {
      const b = window.L?.latLngBounds(activeBoundsRef.current);
      if (b && b.isValid()) {
        leafletMapRef.current.fitBounds(b.pad(0.35), { padding: [40, 40], maxZoom: 14, animate: true });
      }
    }
  }, [focusedSpotIndex, spotsToDisplay]);

  // Initialize and update Leaflet Map with Synchronous Preloaded CSS & JS + Spot Focused Routing
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;
    if (spotsToDisplay.length === 0) return;

    let isMounted = true;
    markersRef.current = [];

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current) return;

      const L = window.L;

      // Clean up previous map instance
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
      if (mapContainerRef.current) {
        mapContainerRef.current._leaflet_id = null;
      }

      // Extract spot coordinates
      const baseLat = parseFloat(spotsToDisplay[0]?.lat) || 37.5665;
      const baseLng = parseFloat(spotsToDisplay[0]?.lng) || 126.9780;

      const latLngs = spotsToDisplay.map((s, idx) => {
        let lat = parseFloat(s.lat) || baseLat;
        let lng = parseFloat(s.lng) || baseLng;
        // Micro offset if exact same coordinates to prevent total overlap
        if (idx > 0 && Math.abs(lat - baseLat) < 0.0001 && Math.abs(lng - baseLng) < 0.0001) {
          lat += idx * 0.003;
          lng += idx * 0.004;
        }
        return [lat, lng];
      });

      // 🎯 Perfect Course Balance View (2번 사진 황금 비율 뷰)
      // 경복궁(1번)과 북촌(2번) 사이의 동선 전체를 210px 뷰포트 정중앙에 대칭으로 배치
      const initialBounds = L.latLngBounds(latLngs);
      const initialCenter = initialBounds.getCenter();
      activeBoundsRef.current = latLngs;

      // 💡 안전한 뷰포트 자동 피팅 함수: 210px 높이에 맞춰 패딩 30px, maxZoom 14로 고정하여 마커 잘림 100% 방지
      const applySpotFit = (coords) => {
        if (!leafletMapRef.current || !coords || coords.length === 0) return;
        const m = leafletMapRef.current;
        const b = L.latLngBounds(coords);
        if (b && b.isValid()) {
          try {
            m.invalidateSize({ pan: true });
            m.fitBounds(b.pad(0.35), { padding: [30, 30], maxZoom: 14, animate: false });
          } catch (e) {}
        }
      };

      // Enable smooth user interaction with fractional zoom precision
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: false
      });

      leafletMapRef.current = map;

      // Initialize single dedicated route layer group to prevent ghost or overlapping lines
      const routeGroup = L.featureGroup().addTo(map);
      routeLayerRef.current = routeGroup;

      // High quality Voyager / OSM tile layer
      const tileUrl = (lang === 'ko')
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: (lang === 'ko') ? 'abc' : 'abcd'
      }).addTo(map);

      // Zoom control at top-right for easy user zoom adjustment
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Render Numbered Markers (1, 2, 3...)
      spotsToDisplay.forEach((spot, idx) => {
        const spotLat = latLngs[idx][0];
        const spotLng = latLngs[idx][1];
        const num = idx + 1;

        const customIcon = L.divIcon({
          className: 'vora-map-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: #ffffff;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 13px;
              border: 2px solid #ffffff;
              box-shadow: 0 3px 10px rgba(0,0,0,0.35);
              cursor: pointer;
            ">
              ${num}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([spotLat, spotLng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; font-weight: 700; color: #0f172a; padding: 2px;">
            <div style="color: #2563eb; font-size: 10px; margin-bottom: 2px;">${lang === 'en' ? `Stop ${idx + 1}` : lang === 'ja' ? `第${idx + 1}スポット` : (lang === 'zh' || lang === 'zht') ? `第${idx + 1}站` : `${idx + 1}번째 코스`}</div>
            <div>${spot.title}</div>
            ${spot.location ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${spot.location}</div>` : ''}
          </div>
        `, { autoPan: false });

        // Click marker on map also syncs focused spot
        marker.on('click', () => {
          if (onSelectSpotIndex) onSelectSpotIndex(idx);
        });

        markersRef.current[idx] = marker;
      });

      // Render connecting lines & fetch real road curves
      if (latLngs.length > 1) {
        // Initial clean direct line
        routeGroup.clearLayers();
        const glowLine = L.polyline(latLngs, {
          color: '#93c5fd',
          weight: 7,
          opacity: 0.45
        });
        const solidLine = L.polyline(latLngs, {
          color: '#2563eb',
          weight: 4.5,
          opacity: 0.95
        });
        routeGroup.addLayer(glowLine);
        routeGroup.addLayer(solidLine);

        applySpotFit(latLngs);

        // Fetch real road curve if available, keeping camera strictly locked on tourist spots
        const coordsString = latLngs.map(([lat, lng]) => `${lng},${lat}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
          .then(res => res.json())
          .then(data => {
            if (!isMounted || !leafletMapRef.current) return;
            if (data && data.code === 'Ok' && data.routes && data.routes[0]?.geometry?.coordinates) {
              const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
              if (roadPoints.length > 1) {
                routeGroup.clearLayers();
                const roadGlow = L.polyline(roadPoints, {
                  color: '#93c5fd',
                  weight: 7,
                  opacity: 0.45
                });
                const roadSolid = L.polyline(roadPoints, {
                  color: '#2563eb',
                  weight: 4.5,
                  opacity: 0.95
                });
                routeGroup.addLayer(roadGlow);
                routeGroup.addLayer(roadSolid);

                // 🎯 Retain the perfect 2nd photo balanced view
                applySpotFit(latLngs);
              }
            }
          })
          .catch(() => {
            // Keep the initial clean line
          });
      } else if (latLngs.length === 1) {
        map.setView(latLngs[0], 14, { animate: false });
      }

      // Ensure map dimensions & Spot fit are applied cleanly on ready
      map.whenReady(() => {
        applySpotFit(activeBoundsRef.current);
      });

      // 🎯 Native ResizeObserver: The exact millisecond browser paints 260px, auto-apply the perfect balanced view
      let ro = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        ro = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.contentRect.height >= 200 && leafletMapRef.current) {
              applySpotFit(activeBoundsRef.current);
            }
          }
        });
        ro.observe(mapContainerRef.current);
      }

      const forceResize = () => {
        if (!isMounted) return;
        if (leafletMapRef.current) {
          try {
            leafletMapRef.current.invalidateSize({ pan: true, debounceMoveend: false });
            applySpotFit(activeBoundsRef.current);
          } catch (e) {}
        }
        if (mapContainerRef.current) {
          try {
            const rect = mapContainerRef.current.getBoundingClientRect();
            const clickEvt = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2
            });
            mapContainerRef.current.dispatchEvent(clickEvt);
          } catch (e) {}
        }
        window.dispatchEvent(new Event('resize'));
      };

      setTimeout(forceResize, 80);
      setTimeout(forceResize, 250);
      setTimeout(forceResize, 600);
    };

    // Frame-aligned initialization with height guard
    let animId = null;
    const checkAndInit = () => {
      if (!isMounted || !mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      if (rect.height < 150) {
        animId = requestAnimationFrame(checkAndInit);
        return;
      }
      initMap();
    };

    animId = requestAnimationFrame(checkAndInit);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };

  }, [isLeafletReady, spotsToDisplay, activeDay, lang]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      marginBottom: '0.75rem'
    }}>
      {/* Top Map Action Banner (슬림 패딩으로 상단 공간 최적화) */}
      <div style={{
        padding: '0.45rem 0.8rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {lang === 'en' 
              ? `Day ${activeDay} Live Google Route` 
              : lang === 'ja' 
              ? `${activeDay}日目 リアルタイムGoogleルート` 
              : (lang === 'zh' || lang === 'zht') 
              ? (lang === 'zht' ? `第${activeDay}天 即時Google路線` : `第${activeDay}天 实时Google路线`) 
              : `${activeDay}일차 실시간 Google 동선`}
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent-primary)',
            padding: '0.08rem 0.4rem',
            borderRadius: '6px'
          }}>
            {lang === 'en' 
              ? `${spotsToDisplay.length} Spots` 
              : lang === 'ja' 
              ? `${spotsToDisplay.length}箇所` 
              : (lang === 'zh' || lang === 'zht') 
              ? `${spotsToDisplay.length}个景点` 
              : `${spotsToDisplay.length}개 스팟`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* 🔍 Reset to Full Course View Button */}
          {focusedSpotIndex !== null && (
            <button
              onClick={() => onSelectSpotIndex && onSelectSpotIndex(null)}
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                padding: '0.22rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>
                {lang === 'en' 
                  ? '🔍 View Full Course' 
                  : lang === 'ja' 
                  ? '🔍 全体コース' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? (lang === 'zht' ? '🔍 完整路線' : '🔍 完整路线') 
                  : '🔍 전체 코스'}
              </span>
            </button>
          )}

          {/* 🗺️ Open Full Route in Google Maps Button */}
          <a
            href={fullRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '0.24rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all var(--transition-fast)',
              flexShrink: 0
            }}
          >
            <span className="hide-mobile">
              {lang === 'en' 
                ? 'Google Maps Route' 
                : lang === 'ja' 
                ? 'Googleマップ' 
                : (lang === 'zh' || lang === 'zht') 
                ? (lang === 'zht' ? 'Google地圖路線' : 'Google地图路线') 
                : '구글맵 길찾기'}
            </span>
            <span className="show-mobile-only">
              {lang === 'en' 
                ? 'Google' 
                : lang === 'ja' 
                ? 'マップ' 
                : (lang === 'zh' || lang === 'zht') 
                ? '地图' 
                : '길찾기'}
            </span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* 🗺️ Embedded Leaflet Real-Road Route Map Container (황금 비율 185px 고정) */}
      <div style={{ position: 'relative', width: '100%', height: '185px', minHeight: '185px', backgroundColor: 'var(--bg-primary)' }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '185px', minHeight: '185px', zIndex: 1 }}
        />

        {/* 🔍 Always Visible Floating "전체 코스 보기" Button Inside Map */}
        <button
          type="button"
          onClick={() => {
            if (onSelectSpotIndex) onSelectSpotIndex(null);
            if (leafletMapRef.current && activeBoundsRef.current) {
              const b = window.L?.latLngBounds(activeBoundsRef.current);
              if (b && b.isValid()) {
                leafletMapRef.current.fitBounds(b.pad(0.35), { padding: [30, 30], maxZoom: 14, animate: true });
              }
            }
          }}
          title={lang === 'en' ? 'Click to view full course' : lang === 'ja' ? 'クリックしてコース全体を表示' : (lang === 'zh' || lang === 'zht') ? '点击查看完整路线' : '클릭하여 전체 코스 한눈에 보기'}
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            padding: '0.28rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.7rem',
            fontWeight: 800,
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span>
            {lang === 'en' 
              ? '🔍 View Full Course' 
              : lang === 'ja' 
              ? '🔍 全体コース' 
              : (lang === 'zh' || lang === 'zht') 
              ? (lang === 'zht' ? '🔍 完整路線' : '🔍 完整路线') 
              : '🔍 전체 코스 보기'}
          </span>
        </button>

        {!isLeafletReady && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            gap: '0.5rem',
            zIndex: 2
          }}>
            <div className="spin-animation" style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid var(--accent-primary)',
              borderTopColor: 'transparent'
            }} />
            <span>
              {lang === 'en' 
                ? 'Loading map...' 
                : lang === 'ja' 
                ? '地図を読み込み中...' 
                : (lang === 'zh' || lang === 'zht') 
                ? '正在加载地图...' 
                : '지도를 불러오는 중...'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Sequential Route Chips (슬림 패딩 & 가로 넘침 완벽 격리) */}
      {spotsToDisplay.length > 0 && (
        <div
          className="no-scrollbar"
          style={{
            padding: '0.35rem 0.65rem',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {spotsToDisplay.map((spot, idx) => {
            const isFocused = focusedSpotIndex === idx;
            return (
              <React.Fragment key={spot.id || idx}>
                <button
                  type="button"
                  onClick={() => onSelectSpotIndex && onSelectSpotIndex(idx)}
                  title={lang === 'en' ? `Pan to ${spot.title}` : lang === 'ja' ? `${spot.title}の位置へ移動` : (lang === 'zh' || lang === 'zht') ? `移动至 ${spot.title}` : `${spot.title} 지도 위치로 이동`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    fontWeight: isFocused ? 900 : 700,
                    color: isFocused ? 'var(--accent-primary)' : 'var(--text-main)',
                    backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-primary)',
                    border: isFocused ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isFocused ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {spot.title}
                  </span>
                </button>
                {idx < spotsToDisplay.length - 1 && (
                  <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800 }}>➔</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
