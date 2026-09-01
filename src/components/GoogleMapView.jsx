import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

// 🎯 Smart Organic Curved Route Generator (Guarantees zero straight lines even during network outages)
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
    
    // Alternating natural gentle arc so segments flow organically like travel curves
    const sign = (i % 2 === 0) ? 1 : -1;
    const curveIntensity = 0.12 * sign;
    const ctrlLat = midLat - dLng * curveIntensity;
    const ctrlLng = midLng + dLat * curveIntensity;
    
    const steps = 12;
    for (let step = 0; step < (i === points.length - 2 ? steps + 1 : steps); step++) {
      const t = step / steps;
      const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * ctrlLat + t * t * p2[0];
      const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * ctrlLng + t * t * p2[1];
      curved.push([lat, lng]);
    }
  }
  
  return curved.length > 1 ? curved : points;
}

export default function GoogleMapView({
  spots = [],
  activeDay = 1,
  targetCity = '서울',
  lang = 'ko',
  focusedSpotIndex = null,
  onSelectSpotIndex = null,
  hideHeader = false,
  mapHeight = '260px'
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

  // 🛡️ Bulletproof LatLng Validator
  const isValidLatLng = (pos) => {
    if (!pos) return false;
    const lat = Array.isArray(pos) ? Number(pos[0]) : Number(pos.lat);
    const lng = Array.isArray(pos) ? Number(pos[1]) : Number(pos.lng);
    return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && lat > 30 && lat < 45 && lng > 120 && lng < 135;
  };

  // 🎯 Interactive Smooth FlyTo & Popup Trigger when user clicks spot in timeline list
  useEffect(() => {
    if (!leafletMapRef.current || spotsToDisplay.length === 0) return;
    if (focusedSpotIndex !== null && typeof focusedSpotIndex === 'number' && markersRef.current[focusedSpotIndex]) {
      const marker = markersRef.current[focusedSpotIndex];
      const latLng = marker?.getLatLng?.();
      if (latLng && isValidLatLng(latLng)) {
        try {
          leafletMapRef.current.flyTo(latLng, 16, { duration: 0.8 });
          marker.openPopup();
        } catch (e) {}
      }
    } else if (focusedSpotIndex === null && leafletMapRef.current && activeBoundsRef.current) {
      const validCoords = activeBoundsRef.current.filter(isValidLatLng);
      if (validCoords.length > 0 && window.L) {
        const b = window.L.latLngBounds(validCoords);
        if (b && b.isValid()) {
          try {
            leafletMapRef.current.fitBounds(b.pad(0.18), { padding: [28, 28], maxZoom: 14.5, animate: true });
          } catch (e) {}
        }
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

      // Extract spot coordinates with fallback chain
      const firstValidSpot = spotsToDisplay.find(s => {
        const lat = Number(s?.lat || s?.mapy || s?.latitude);
        const lng = Number(s?.lng || s?.mapx || s?.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat > 30 && lat < 45 && lng > 120 && lng < 135;
      });

      const baseLat = firstValidSpot ? Number(firstValidSpot.lat || firstValidSpot.mapy || firstValidSpot.latitude) : 37.5665;
      const baseLng = firstValidSpot ? Number(firstValidSpot.lng || firstValidSpot.mapx || firstValidSpot.longitude) : 126.9780;

      const latLngs = spotsToDisplay.map((s, idx) => {
        let lat = Number(s?.lat || s?.mapy || s?.latitude);
        let lng = Number(s?.lng || s?.mapx || s?.longitude);
        if (isNaN(lat) || !isFinite(lat) || lat < 30 || lat > 45) lat = baseLat;
        if (isNaN(lng) || !isFinite(lng) || lng < 120 || lng > 135) lng = baseLng;
        // Micro offset if exact same coordinates to prevent total overlap
        if (idx > 0 && Math.abs(lat - baseLat) < 0.0001 && Math.abs(lng - baseLng) < 0.0001) {
          lat += idx * 0.003;
          lng += idx * 0.004;
        }
        return [lat, lng];
      });

      // 🎯 Perfect Course Balance View
      const initialBounds = L.latLngBounds(latLngs);
      const computedCenter = initialBounds.isValid() ? initialBounds.getCenter() : null;
      const initialCenter = (computedCenter && isValidLatLng(computedCenter)) ? computedCenter : [baseLat, baseLng];
      activeBoundsRef.current = latLngs;

      // 💡 안전한 뷰포트 자동 피팅 함수 (1번~마지막 마커 100% 안착)
      const applySpotFit = (coords) => {
        if (!leafletMapRef.current || !coords || coords.length === 0) return;
        const m = leafletMapRef.current;
        const validC = coords.filter(isValidLatLng);
        if (validC.length === 0) return;
        const b = L.latLngBounds(validC);
        if (b && b.isValid()) {
          try {
            m.invalidateSize({ pan: false });
            m.fitBounds(b.pad(0.18), { padding: [28, 28], maxZoom: 14.5, animate: false });
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

      // Render connecting lines & fetch real road curves (100% zero straight lines)
      if (latLngs.length > 1) {
        // 🎯 1. Instant Organic Curved Path (Zero latency, flawless travel curve)
        routeGroup.clearLayers();
        const initialCurvedPoints = generateSmoothCurvedRoute(latLngs);
        
        const glowLine = L.polyline(initialCurvedPoints, {
          color: '#93c5fd',
          weight: 7,
          opacity: 0.45
        });
        const solidLine = L.polyline(initialCurvedPoints, {
          color: '#2563eb',
          weight: 4.5,
          opacity: 0.95
        });
        routeGroup.addLayer(glowLine);
        routeGroup.addLayer(solidLine);

        applySpotFit(latLngs);

        // 🎯 2. Asynchronous Street-Level Road Curves from Multi-tier Routing Endpoints
        const coordsString = latLngs.map(([lat, lng]) => `${lng},${lat}`).join(';');
        const routingEndpoints = [
          `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`,
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
        ];

        const tryFetchRoadGeometry = async () => {
          for (const url of routingEndpoints) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2500);
              const res = await fetch(url, { signal: controller.signal });
              clearTimeout(timeoutId);
              if (!res.ok) continue;
              const data = await res.json();
              if (data && data.code === 'Ok' && data.routes && data.routes[0]?.geometry?.coordinates) {
                const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                if (roadPoints.length > 1 && isMounted && leafletMapRef.current) {
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
                  applySpotFit(latLngs);
                  return; // Real street geometry applied
                }
              }
            } catch (err) {
              // Smooth organic curve is already active, safely fallback
            }
          }
        };

        tryFetchRoadGeometry();
      } else if (latLngs.length === 1) {
        map.setView(latLngs[0], 14, { animate: false });
      }

      // 🎯 Native ResizeObserver: 컨테이너 크기 감지 시 마커 100% 정중앙 자동 핏팅
      let ro = null;
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        ro = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.contentRect.height > 50 && leafletMapRef.current) {
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
            leafletMapRef.current.invalidateSize({ pan: false });
            applySpotFit(activeBoundsRef.current);
          } catch (e) {}
        }
        window.dispatchEvent(new Event('resize'));
      };

      setTimeout(forceResize, 50);
      setTimeout(forceResize, 150);
      setTimeout(forceResize, 350);
      setTimeout(forceResize, 600);
    };

    // Frame-aligned initialization with height guard
    let animId = null;
    const checkAndInit = () => {
      if (!isMounted || !mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      if (rect.height < 50) {
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

}, [isLeafletReady, spotsToDisplay, activeDay, lang, mapHeight]);


  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderRadius: hideHeader ? '0' : '16px',
      overflow: 'hidden',
      border: hideHeader ? 'none' : '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: hideHeader ? 'none' : 'var(--shadow-sm)',
      position: 'relative',
      marginBottom: hideHeader ? '0' : '0.75rem'
    }}>

      {/* Top Smart Route Header */}
      {!hideHeader && (
        <div style={{
          padding: '0.45rem 0.75rem',
          backgroundColor: 'var(--bg-glass)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.35rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem' }}>📍</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {targetCity} {activeDay}{lang === 'en' ? ' Day Route' : lang === 'ja' ? '日目ルート' : (lang === 'zh' || lang === 'zht') ? '日路线' : '일차 실시간 Google 동선'}
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
      )}

      {/* 🗺️ Embedded Leaflet Real-Road Route Map Container */}
      <div style={{ position: 'relative', width: '100%', height: mapHeight, minHeight: mapHeight, backgroundColor: 'var(--bg-primary)' }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: mapHeight, minHeight: mapHeight, zIndex: 1 }}
        />


        {/* 🔍 Floating "전체 코스 보기" Button Inside Map (Only when not embedded in FullMapTab) */}
        {!hideHeader && (
          <button
            type="button"
            onClick={() => {
              if (onSelectSpotIndex) onSelectSpotIndex(null);
              if (leafletMapRef.current && activeBoundsRef.current) {
                const b = window.L?.latLngBounds(activeBoundsRef.current);
                if (b && b.isValid()) {
                  leafletMapRef.current.fitBounds(b.pad(0.18), { padding: [28, 28], maxZoom: 14.5, animate: true });
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
        )}

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

      {/* Bottom Sequential Route Chips (Only when not embedded in FullMapTab) */}
      {!hideHeader && spotsToDisplay.length > 0 && (
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
