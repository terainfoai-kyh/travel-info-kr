import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Car, Bus, Map, Sparkles, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';

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

function getDayBtnText(d, lang) {
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
  const carMin = travel.carMin || 15;
  const distKm = travel.distKm || 5.0;
  const transitMin = travel.transitMin || 25;

  if (travel.longDistanceNote) {
    return { car: travel.longDistanceNote, transit: '' };
  }

  switch (lang) {
    case 'en': return { car: `Drive ${carMin} min (${distKm} km)`, transit: `Transit ~${transitMin} min` };
    case 'ja': return { car: `車 ${carMin}分 (${distKm}km)`, transit: `公共交通 約${transitMin}分` };
    case 'zh': return { car: `驾车 ${carMin}分钟 (${distKm}公里)`, transit: `公共交通 约${transitMin}分钟` };
    case 'zht': return { car: `駕車 ${carMin}分鐘 (${distKm}公里)`, transit: `公共交通 約${transitMin}分鐘` };
    case 'de': return { car: `Auto ${carMin} Min. (${distKm} km)`, transit: `ÖPNV ca. ${transitMin} Min.` };
    case 'fr': return { car: `Voiture ${carMin} min (${distKm} km)`, transit: `Transports ~${transitMin} min` };
    case 'es': return { car: `Coche ${carMin} min (${distKm} km)`, transit: `Transporte ~${transitMin} min` };
    case 'ru': return { car: `Авто ${carMin} мин (${distKm} км)`, transit: `Транспорт ~${transitMin} мин` };
    default: return { car: `차량 ${carMin}분 (${distKm}km)`, transit: `대중교통 약 ${transitMin}분` };
  }
}

export default function ItineraryMapView({ itinerary = [], activeDay = 1, onChangeDay, lang = 'ko', onSwitchToList }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];
  const schedule = currentDayData?.schedule || [];

  const [activeSpotIdx, setActiveSpotIdx] = useState(0);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

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

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
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
            {getDayBtnText(d, lang)}
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
              <span>{getI18nDayHeaderTitle(currentDayData, currentDayData?.region, lang)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>

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
