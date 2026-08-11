import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Car, Bus, Map, Sparkles, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';
import { getI18nTravelNote } from '../i18n/travelChipI18n';

function getI18nDayHeaderTitle(dayObj, region, lang = 'ko') {
  if (!dayObj) return '';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const dNum = dayObj.day || 1;
  const rawDate = dayObj.dateStr;
  
  let dateFormatted = rawDate || '';
  if (rawDate) {
    try {
      const dt = new Date(rawDate);
      if (!isNaN(dt.getTime())) {
        const daysOfWeek = {
          ko: ['일', '월', '화', '수', '목', '금', '토'],
          en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          ja: ['日', '月', '火', '水', '木', '金', '土'],
          zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          zht: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
          de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        };
        const dowList = daysOfWeek[lang] || daysOfWeek.en;
        const dowStr = dowList[dt.getDay()];
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        dateFormatted = `${y}.${m}.${d} (${dowStr})`;
      }
    } catch (e) {}
  }

  const regionName = region && region !== '전국' && region !== '한국' ? (t.regions?.[region] || region) : (t.regions?.['전국'] || '전국');

  switch (lang) {
    case 'en': return `Day ${dNum} Course · ${dateFormatted} (${regionName} Route)`;
    case 'ja': return `${dNum}日目コース · ${dateFormatted} (${regionName} ルート)`;
    case 'zh': return `第 ${dNum} 天行程 · ${dateFormatted} (${regionName} 路线)`;
    case 'zht': return `第 ${dNum} 天行程 · ${dateFormatted} (${regionName} 路線)`;
    case 'de': return `Tag ${dNum} Route · ${dateFormatted} (${regionName} Route)`;
    case 'fr': return `Jour ${dNum} Parcours · ${dateFormatted} (Itinéraire ${regionName})`;
    case 'es': return `Día ${dNum} Ruta · ${dateFormatted} (Ruta ${regionName})`;
    case 'ru': return `День ${dNum} Маршрут · ${dateFormatted} (Маршрут ${regionName})`;
    default: return `${dNum}일차 코스 · ${dateFormatted} (${regionName} 동선)`;
  }
}

export function getDayBtnText(d, lang) {
  const dNum = d.day || 1;
  let dowStr = '';
  if (d.dateStr) {
    try {
      const dt = new Date(d.dateStr);
      if (!isNaN(dt.getTime())) {
        const daysOfWeek = {
          ko: ['일', '월', '화', '수', '목', '금', '토'],
          en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          ja: ['日', '月', '火', '水', '木', '金', '土'],
          zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          zht: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
          de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        };
        const dowList = daysOfWeek[lang] || daysOfWeek.en;
        dowStr = dowList[dt.getDay()];
      }
    } catch (e) {}
  }

  const dowPart = dowStr ? `(${dowStr})` : '';

  switch (lang) {
    case 'en': return `Day ${dNum} ${dowPart}`;
    case 'ja': return `${dNum}日目 ${dowPart}`;
    case 'zh': return `第 ${dNum} 天 ${dowPart}`;
    case 'zht': return `第 ${dNum} 天 ${dowPart}`;
    case 'de': return `Tag ${dNum} ${dowPart}`;
    case 'fr': return `Jour ${dNum} ${dowPart}`;
    case 'es': return `Día ${dNum} ${dowPart}`;
    case 'ru': return `День ${dNum} ${dowPart}`;
    default: return `${dNum}일차 ${dowPart}`;
  }
}

function getMapZoomOutGuide(lang) {
  switch (lang) {
    case 'en': return '🎯 All spots from 1 to 4 and the connecting path line are automatically framed together.';
    case 'ja': return '🎯 1番から4番までの全スポットと移動経路が自動ズームアウト表示されます。';
    case 'zh': return '🎯 1号至4号所有景点及路线已自动适应屏幕居中显示。';
    case 'zht': return '🎯 1號至4號所有景點及路線已自動適應螢幕居中顯示。';
    case 'de': return '🎯 Alle Orte von 1 bis 4 und die Verbindungsroute werden automatisch zentriert.';
    case 'fr': return '🎯 Tous les lieux de 1 à 4 et l\'itinéraire sont automatiquement cadrés.';
    case 'es': return '🎯 Todos los lugares del 1 al 4 y la ruta se ajustan automáticamente en el mapa.';
    case 'ru': return '🎯 Все места с 1 по 4 и маршрут автоматически выровнены на карте.';
    default: return '🎯 1번부터 4번까지 전체 명소 및 이동 경로가 자동 줌아웃 표시됩니다.';
  }
}

function formatTravelNote(travel, lang) {
  if (!travel) return { car: '', transit: '' };
  const res = getI18nTravelNote(travel, lang);
  if (res.isLongDistance) {
    return { car: res.longNote, transit: '' };
  }
  return { car: res.driveNote, transit: res.transitNote };
}

export default function ItineraryMapView({ itinerary = [], activeDay = 1, onChangeDay, lang = 'ko', onSwitchToList }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];
  const schedule = currentDayData?.schedule || [];

  const [activeSpotIdx, setActiveSpotIdx] = useState(0);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isMapUnlocked, setIsMapUnlocked] = useState(false);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Reset active spot selection whenever activeDay or itinerary changes
  useEffect(() => {
    setActiveSpotIdx(0);
  }, [activeDay, itinerary]);

  // Synchronize Leaflet interactive touch & drag handlers based on isMapUnlocked state
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;
    if (isMapUnlocked) {
      map.dragging.enable();
      if (map.touchZoom) map.touchZoom.enable();
      if (map.doubleClickZoom) map.doubleClickZoom.enable();
      if (map.scrollWheelZoom) map.scrollWheelZoom.enable();
      if (map.boxZoom) map.boxZoom.enable();
      if (map.keyboard) map.keyboard.enable();
    } else {
      map.dragging.disable();
      if (map.touchZoom) map.touchZoom.disable();
      if (map.doubleClickZoom) map.doubleClickZoom.disable();
      if (map.scrollWheelZoom) map.scrollWheelZoom.disable();
      if (map.boxZoom) map.boxZoom.disable();
      if (map.keyboard) map.keyboard.disable();
    }
  }, [isMapUnlocked]);

  const NUMBER_ICONS = ['❶', '❷', '❸', '❹', '❺'];

  // Select tile layer based on language (OpenStreetMap Standard for Korean, Esri World Street Map for Multilingual)
  const tileUrl = (lang === 'ko')
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';


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

    // Calculate latLngs with micro-spread if coordinates are identical
    const baseLat = parseFloat(schedule[0]?.lat) || 37.5665;
    const baseLng = parseFloat(schedule[0]?.lng) || 126.9780;
    const latLngs = schedule.map((s, idx) => {
      let lat = parseFloat(s.lat) || 37.5665;
      let lng = parseFloat(s.lng) || 126.9780;
      if (idx > 0 && Math.abs(lat - baseLat) < 0.0001 && Math.abs(lng - baseLng) < 0.0001) {
        lat += idx * 0.003;
        lng += idx * 0.004;
      }
      return [lat, lng];
    });

    // Create Leaflet Map Instance (Default locked for 1-finger page scrolling)
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false
    });

    leafletMapRef.current = map;

    // Select tile layer based on language (OpenStreetMap Standard for 100% Korean place names, CartoDB Voyager for International languages)
    const tileUrl = (lang === 'ko')
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: (lang === 'ko') ? 'abc' : 'abcd'
    }).addTo(map);

    // Add Custom Zoom Control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add Numbered Markers for each spot
    schedule.forEach((spot, idx) => {
      const spotLat = latLngs[idx][0];
      const spotLng = latLngs[idx][1];
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

      // Auto-Fit Bounding Box so ALL spots are framed together cleanly
      const bounds = polyline.getBounds();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.setView(latLngs[0], 13);
      }
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 13);
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

  // Clean spot title (strips building floor numbers like 4F, address suffixes, parentheses)
  const cleanTitle = (rawTitle) => {
    if (!rawTitle) return '';
    return rawTitle
      .split('(')[0]
      .replace(/\s*\d+F|\s*\d+층|\s*지하\d+층/gi, '')
      .replace(/부산광역시|서울특별시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도/gi, '')
      .trim();
  };

  // Build Google Maps Direct Route URL (Origin ➔ Destination for 100% Driving Route Line Drawing)
  const buildGoogleRouteUrl = () => {
    const validSpots = schedule.filter(s => s && s.title);
    if (validSpots.length === 0) return '#';

    const originTitle = encodeURIComponent(cleanTitle(validSpots[0].title));
    const destTitle = encodeURIComponent(cleanTitle(validSpots[validSpots.length - 1].title));

    return `https://www.google.com/maps/dir/?api=1&origin=${originTitle}&destination=${destTitle}&travelmode=driving`;
  };

  // Build KakaoMap Official Directions Link URL (Pre-fills BOTH Origin & Destination via /to/dest/from/origin Scheme)
  const buildKakaoRouteUrl = () => {
    const validSpots = schedule.filter(s => s && s.title);
    if (validSpots.length === 0) return '#';

    const originSpot = validSpots[0];
    const destSpot = validSpots[validSpots.length - 1];

    const originTitle = encodeURIComponent(cleanTitle(originSpot.title));
    const destTitle = encodeURIComponent(cleanTitle(destSpot.title));

    if (validSpots.length >= 2 && originSpot.lat && originSpot.lng && destSpot.lat && destSpot.lng) {
      return `https://map.kakao.com/link/to/${destTitle},${destSpot.lat},${destSpot.lng}/from/${originTitle},${originSpot.lat},${originSpot.lng}`;
    }
    if (destSpot.lat && destSpot.lng) {
      return `https://map.kakao.com/link/to/${destTitle},${destSpot.lat},${destSpot.lng}`;
    }
    return `https://map.kakao.com/link/search/${destTitle}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          padding: '0.75rem 0.95rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.55rem'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={17} color="var(--accent-primary)" />
              <span>{getI18nDayHeaderTitle(currentDayData, currentDayData?.region, lang)}</span>
            </div>
          </div>

          {/* Map Navigation Buttons: Google Maps Route & KakaoMap Directions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', width: '100%', maxWidth: '380px' }}>
            <a
              href={buildGoogleRouteUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                padding: '0.38rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                flex: '1 1 0%',
                whiteSpace: 'nowrap'
              }}
              title="Google Maps Route Navigation"
            >
              <Navigation size={13} />
              <span>{t.openGoogleRouteShort || (lang === 'ko' ? '🗺️ 구글지도' : '🗺️ Google Maps')}</span>
              <ExternalLink size={11} />
            </a>

            <a
              href={buildKakaoRouteUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.38rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                borderRadius: 'var(--radius-full)',
                background: '#fee500',
                color: '#191919',
                border: '1px solid #e5d000',
                boxShadow: '0 2px 8px rgba(254, 229, 0, 0.4)',
                flex: '1 1 0%',
                whiteSpace: 'nowrap'
              }}
              title="카카오맵 길찾기 (KakaoMap Directions)"
            >
              <Navigation size={13} color="#191919" />
              <span>{t.openKakaoRouteShort || (lang === 'ko' ? '💛 카카오맵' : '💛 KakaoMap')}</span>
              <ExternalLink size={11} color="#191919" />
            </a>
          </div>
        </div>

        {/* Dynamic Leaflet Map with Bounding Path & Smart Touch Control Overlay */}
        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#0f172a' }}>
          {/* Floating Map Touch Lock / Unlock Control Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 1000,
            pointerEvents: 'auto'
          }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMapUnlocked(!isMapUnlocked);
              }}
              style={{
                background: isMapUnlocked 
                  ? 'linear-gradient(135deg, #0284c7, #38bdf8)' 
                  : 'rgba(15, 23, 42, 0.92)',
                color: '#ffffff',
                border: isMapUnlocked ? 'none' : '1px solid rgba(56, 189, 248, 0.5)',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: isMapUnlocked ? '0 4px 14px rgba(2, 132, 199, 0.45)' : '0 4px 14px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              title={isMapUnlocked ? '클릭 시 스크롤 모드로 복귀' : '클릭 시 지도 줌인/이동 활성화'}
            >
              <span>
                {isMapUnlocked 
                  ? (t.mapUnlockTouchShort || '🔓 지도 조작 ⇄')
                  : (t.mapLockScrollShort || '🔒 스크롤 우선')
                }
              </span>
            </button>
          </div>

          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1, pointerEvents: isMapUnlocked ? 'auto' : 'none' }} />

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

              {item.nextTravel && (() => {
                const noteObj = formatTravelNote(item.nextTravel, lang);
                return (
                  <div style={{ fontSize: '0.72rem', marginTop: '0.5rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#0284c7' }}>
                      <Car size={11} />
                      <span>{noteObj.car}</span>
                    </div>
                    {!item.nextTravel.isLongDistance && noteObj.transit && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#818cf8' }}>
                        <Bus size={11} />
                        <span>{noteObj.transit}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
