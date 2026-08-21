import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

export default function GoogleMapView({
  spots = [],
  activeDay = 1,
  targetCity = '서울',
  lang = 'ko'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const spotsToDisplay = Array.isArray(spots) ? spots : [];
  const fullRouteUrl = generateGoogleMapsRouteUrl(spotsToDisplay);

  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const activeBoundsRef = useRef(null);

  // Dynamically ensure Leaflet CSS and JS are loaded
  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined' && window.L) {
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
      script.onload = () => {
        if (isMounted) setIsLeafletReady(true);
      };
      document.body.appendChild(script);
    } else {
      const existingScript = document.getElementById('leaflet-js');
      existingScript.addEventListener('load', () => {
        if (isMounted) setIsLeafletReady(true);
      });
    }

    return () => { isMounted = false; };
  }, []);

  // Initialize and update Leaflet Map with Method C (Real Road Route via OSRM) + Full Road Auto-Zoom & User Interactive Controls
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;
    if (spotsToDisplay.length === 0) return;

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

    // Compute center and initial bounds to avoid default Seoul bounce
    const bounds = L.latLngBounds(latLngs);
    const center = bounds.getCenter();

    // Enable smooth user interaction with fractional zoom precision
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 13,
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

    // Safe fit function ensuring all spot markers and road curves fit with comfortable padding
    const applySafeFit = (pts) => {
      if (!leafletMapRef.current || !pts || pts.length === 0) return;
      const m = leafletMapRef.current;
      const b = L.latLngBounds(pts);
      if (b && b.isValid()) {
        const padded = b.pad(0.55);
        m.fitBounds(padded, { animate: false });
      }
    };

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
          <div style="color: #2563eb; font-size: 10px; margin-bottom: 2px;">${idx + 1}번째 코스</div>
          <div>${spot.title}</div>
          ${spot.location ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${spot.location}</div>` : ''}
        </div>
      `);
    });

    // Zero-Bounce instant fit strictly anchored to tourist spots (latLngs) so 1번 and 2번 are always in the center
    if (latLngs.length > 1) {
      activeBoundsRef.current = latLngs;
      applySafeFit(latLngs);

      // Outer glow line for high visibility
      const outerGlow = L.polyline(latLngs, {
        color: '#93c5fd',
        weight: 8,
        opacity: 0.5
      }).addTo(map);

      // Main vibrant route line with elegant dashed pattern
      const mainRoute = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 4.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = L.featureGroup([outerGlow, mainRoute]);

      // Optional: Fetch real road curve if available, but ALWAYS keep bounds anchored to latLngs
      const coordsString = latLngs.map(([lat, lng]) => `${lng},${lat}`).join(';');
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

      let isCurrent = true;
      fetch(osrmUrl)
        .then(res => res.json())
        .then(data => {
          if (!isCurrent || !leafletMapRef.current) return;
          if (data && data.code === 'Ok' && data.routes && data.routes[0]?.geometry?.coordinates) {
            const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            if (roadPoints.length > 1) {
              if (routeLayerRef.current) {
                map.removeLayer(routeLayerRef.current);
              }
              const roadGlow = L.polyline(roadPoints, {
                color: '#93c5fd',
                weight: 8,
                opacity: 0.45
              }).addTo(map);
              const roadPolyline = L.polyline(roadPoints, {
                color: '#2563eb',
                weight: 4.5,
                opacity: 0.95
              }).addTo(map);
              routeLayerRef.current = L.featureGroup([roadGlow, roadPolyline]);

              // 🎯 Keep bounds STRICTLY anchored to tourist spots (latLngs) so 1번 and 2번 markers NEVER shift out of view!
              applySafeFit(latLngs);
            }
          }
        })
        .catch(() => {
          // Keep the stylish dashed route line
        });

      return () => {
        isCurrent = false;
      };
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 14, { animate: false });
    }

    // Force map invalidateSize after initial container render and re-fit bounds accurately
    const timer = setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
        if (activeBoundsRef.current) {
          applySafeFit(activeBoundsRef.current);
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };

  }, [isLeafletReady, spotsToDisplay, activeDay, lang]);

  return (
    <div style={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      marginBottom: '0.75rem'
    }}>
      {/* Top Map Action Banner */}
      <div style={{
        padding: '0.65rem 0.9rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {activeDay}일차 실시간 Google 동선
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent-primary)',
            padding: '0.1rem 0.45rem',
            borderRadius: '6px'
          }}>
            {spotsToDisplay.length}개 스팟
          </span>
        </div>

        {/* 🗺️ Open Full Route in Google Maps Button */}
        <a
          href={fullRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: 'var(--shadow-glow)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <span>구글맵 전체 길찾기 ↗</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Embedded Leaflet Real-Road Route Map Container */}
      <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: 'var(--bg-primary)' }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
        />
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
            <span>지도를 불러오는 중...</span>
          </div>
        )}
      </div>

      {/* Bottom Sequential Route Chips */}
      {spotsToDisplay.length > 0 && (
        <div
          className="no-scrollbar"
          style={{
            padding: '0.45rem 0.75rem',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {spotsToDisplay.map((spot, idx) => (
            <React.Fragment key={spot.id || idx}>
              <a
                href={getGooglePlaceSearchUrl(spot.title, spot.region || targetCity)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
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
              </a>
              {idx < spotsToDisplay.length - 1 && (
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800 }}>➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
