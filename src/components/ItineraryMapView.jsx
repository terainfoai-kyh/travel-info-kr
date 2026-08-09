import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Car, Map, Sparkles, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';

export default function ItineraryMapView({ itinerary = [], activeDay = 1, onChangeDay, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];
  const schedule = currentDayData?.schedule || [];

  const [activeSpotIdx, setActiveSpotIdx] = useState(0);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

  const NUMBER_ICONS = ['❶', '❷', '❸', '❹', '❺'];

  // Dynamically load Leaflet CSS & JS
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (window.L) {
        if (isMounted) setIsLeafletReady(true);
        return;
      }

      // Check if Leaflet CSS exists
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Check if Leaflet JS exists
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          if (isMounted) setIsLeafletReady(true);
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.L) {
            clearInterval(checkInterval);
            if (isMounted) setIsLeafletReady(true);
          }
        }, 100);
      }
    };

    loadLeaflet();
    return () => { isMounted = false; };
  }, []);

  // Initialize and update Leaflet map with fitBounds + polyline route
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;
    if (!schedule || schedule.length === 0) return;

    const L = window.L;

    // Clean up previous map instance if exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const latLngs = schedule.map(s => [parseFloat(s.lat) || 37.5665, parseFloat(s.lng) || 126.9780]);

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    });

    leafletMapRef.current = map;

    // Add Dark/Light Tile Layer (CartoDB Positron / Dark Matter or OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Add Custom Zoom Control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add Numbered Markers for each spot
    schedule.forEach((spot, idx) => {
      const spotLat = parseFloat(spot.lat) || 37.5665;
      const spotLng = parseFloat(spot.lng) || 126.9780;
      const numIcon = NUMBER_ICONS[idx] || (idx + 1);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #0284c7, #38bdf8);
            color: #ffffff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
          ">
            ${numIcon}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([spotLat, spotLng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; font-weight: 700; color: #0f172a; padding: 4px;">
          <div style="color: #0284c7; font-size: 11px;">${spot.time || ''}</div>
          <div>${numIcon} ${spot.title}</div>
        </div>
      `);

      marker.on('click', () => {
        setActiveSpotIdx(idx);
      });
    });

    // Draw Connecting Polyline Path between 1 -> 2 -> 3 -> 4
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(map);

      // CRITICAL: Auto-Fit Bounding Box so ALL 4 spots are framed together zoomed out!
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 14);
    }

  }, [isLeafletReady, schedule, activeDay]);

  if (!schedule || schedule.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        일정 데이터가 없습니다.
      </div>
    );
  }

  const selectedSpot = schedule[activeSpotIdx] || schedule[0];
  const lat = selectedSpot.lat || 37.5665;
  const lng = selectedSpot.lng || 126.9780;

  // Build Multi-Waypoint External Map Navigation URL
  const buildMultiPointMapUrl = () => {
    const validSpots = schedule.filter(s => s.lat && s.lng);
    if (validSpots.length === 0) return '#';

    if (lang === 'ko') {
      const query = encodeURIComponent(validSpots.map(s => s.title).join(' '));
      return `https://map.kakao.com/link/search/${query}`;
    } else {
      const origin = `${validSpots[0].lat},${validSpots[0].lng}`;
      const destination = `${validSpots[validSpots.length - 1].lat},${validSpots[validSpots.length - 1].lng}`;
      const waypoints = validSpots.slice(1, -1).map(s => `${s.lat},${s.lng}`).join('|');
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Day Selector Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Map size={16} color="var(--accent-primary)" />
          {t.selectDayLabel || '일차 선택:'}
        </span>
        {itinerary.map(d => (
          <button
            key={d.day}
            onClick={() => {
              onChangeDay(d.day);
              setActiveSpotIdx(0);
            }}
            style={{
              background: activeDay === d.day ? 'var(--accent-gradient)' : 'var(--bg-primary)',
              color: activeDay === d.day ? '#ffffff' : 'var(--text-main)',
              border: activeDay === d.day ? 'none' : '1px solid var(--border-color)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {d.day}일차 {d.schedule[0] ? `(${d.dayTitle.split('(')[1] || ''}` : ''}
          </button>
        ))}
      </div>

      {/* Interactive Main Map & Route Card */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-highlight)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow)'
      }}>
        {/* Map Header Action Bar */}
        <div style={{
          padding: '0.85rem 1.1rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={18} color="var(--accent-primary)" />
              <span>{currentDayData?.dayTitle || `${activeDay}일차 동선 지도`}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              🎯 1번부터 4번까지 전체 명소 및 이동 경로가 자동 줌아웃 표시됩니다.
            </div>
          </div>

          <a
            href={buildMultiPointMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Navigation size={15} />
            <span>{lang === 'ko' ? '🚗 전체 경로 내비 연결' : '🚗 Open Full Route Navigation'}</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Dynamic Leaflet Map with Bounding Path & Fallback */}
        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#0f172a' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Leaflet Loading Fallback iFrame */}
          {!isLeafletReady && (
            <iframe
              title="Itinerary Route Map Fallback"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', inset: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=11&output=embed`}
            />
          )}

          {/* Floating Selected Spot Card Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '0.85rem',
            left: '0.85rem',
            right: '0.85rem',
            zIndex: 500,
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                color: 'var(--accent-primary)',
                lineHeight: 1
              }}>
                {NUMBER_ICONS[activeSpotIdx] || '❶'}
              </span>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                  {getTranslatedTitle(selectedSpot.title, lang)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                  <MapPin size={12} color="var(--accent-primary)" />
                  <span>{getTranslatedAddress(selectedSpot.location, lang)}</span>
                </div>
              </div>
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              background: 'rgba(56, 189, 248, 0.2)',
              color: 'var(--accent-primary)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              {selectedSpot.time || '10:00'}
            </span>
          </div>
        </div>

        {/* Sequential Route Timeline Cards Bar (1 ➔ 2 ➔ 3 ➔ 4) */}
        <div style={{
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          {schedule.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveSpotIdx(idx);
                if (leafletMapRef.current && item.lat && item.lng) {
                  leafletMapRef.current.setView([parseFloat(item.lat), parseFloat(item.lng)], 14);
                }
              }}
              style={{
                background: activeSpotIdx === idx ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-primary)',
                border: activeSpotIdx === idx ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: activeSpotIdx === idx ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {NUMBER_ICONS[idx] || (idx + 1)}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {item.time}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {getTranslatedTitle(item.title, lang)}
                </div>
              </div>

              {item.nextTravel && (
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Car size={12} />
                  <span>{item.nextTravel.longDistanceNote || `차량 ${item.nextTravel.carMin}분 (${item.nextTravel.distKm}km)`}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
