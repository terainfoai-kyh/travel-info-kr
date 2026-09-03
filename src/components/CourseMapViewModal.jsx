import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, MapPin, Sparkles, Navigation, Calendar, 
  ChevronRight, Compass, Car, Bus, Footprints, ExternalLink,
  Lock, Unlock, Map as MapIcon, Share2, Check
} from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getSpotDetailButtonLabel, getCloseButtonLabel } from '../i18n/translations';
import { useModalHistory } from '../hooks/useModalHistory';
import { SOUTH_KOREA_MAP_BOUNDS, updateMapTileLayer } from '../utils/mapTileUtils';

const COURSE_MAP_I18N = {
  ko: {
    subtitle: '한국관광공사 TourAPI 4.0 정품 GPS 연동',
    copyCourse: '코스 복사',
    copied: '복사됨!',
    close: '닫기',
    dayTab: '{day}일차',
    spotsCount: '{count}곳',
    dayItineraryTitle: '📍 {day}일차 추천 일정 ({count}개 명소)',
    recommendedOrder: '① ➔ ② ➔ ③ 순서대로 추천',
    morning: '🌅 오전',
    afternoon: '☀️ 오후',
    evening: '🌙 저녁/야경',
    locationProvided: '상세 주소 제공',
    googleMap: '지도 길찾기',
    walkTransit: '🚶 도보 약 15분 (800m)',
    busTransit: '🚌 대중교통 약 10~15분',
    mapUnlocked: '조작 가능 ⇄',
    mapLocked: '스크롤 고정 🔒',
    googleMultiStop: '구글맵 전체 경로 ↗'
  },
  en: {
    subtitle: 'Official GPS Synchronization via TourAPI 4.0',
    copyCourse: 'Copy Course',
    copied: 'Copied!',
    close: 'Close',
    dayTab: 'Day {day}',
    spotsCount: '{count} spots',
    dayItineraryTitle: '📍 Day {day} Itinerary ({count} spots)',
    recommendedOrder: 'Recommended: ① ➔ ② ➔ ③',
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌙 Evening / Night',
    locationProvided: 'Location details available',
    googleMap: 'Google Maps',
    walkTransit: '🚶 Walk ~15 min (800m)',
    busTransit: '🚌 Transit ~10-15 min',
    mapUnlocked: 'Interactive ⇄',
    mapLocked: 'Scroll Locked 🔒',
    googleMultiStop: 'Open Full Google Route ↗'
  },
  ja: {
    subtitle: '韓国観光公社 TourAPI 4.0 公式GPS連動',
    copyCourse: 'コースコピー',
    copied: 'コピー完了!',
    close: '閉じる',
    dayTab: '{day}日目',
    spotsCount: '{count}ヶ所',
    dayItineraryTitle: '📍 {day}日目のおすすめ日程 ({count}スポット)',
    recommendedOrder: '巡回順: ① ➔ ② ➔ ③',
    morning: '🌅 午前',
    afternoon: '☀️ 午後',
    evening: '🌙 夕方・夜景',
    locationProvided: '詳細位置情報',
    googleMap: '地図',
    walkTransit: '🚶 徒歩約15分 (800m)',
    busTransit: '🚌 公共交通約10~15分',
    mapUnlocked: '操作可能 ⇄',
    mapLocked: 'スクロール固定 🔒',
    googleMultiStop: 'Googleマップ全体ルート ↗'
  },
  zh: {
    subtitle: '韩国观光公社 TourAPI 4.0 官方认证GPS',
    copyCourse: '复制路线',
    copied: '已复制!',
    close: '关闭',
    dayTab: '第{day}天',
    spotsCount: '{count}处',
    dayItineraryTitle: '📍 第{day}天推荐行程 ({count}个景点)',
    recommendedOrder: '推荐顺序: ① ➔ ② ➔ ③',
    morning: '🌅 上午',
    afternoon: '☀️ 下午',
    evening: '🌙 傍晚/夜景',
    locationProvided: '提供详细位置',
    googleMap: '谷歌地图',
    walkTransit: '🚶 步行约15分钟 (800m)',
    busTransit: '🚌 公交/地铁约10~15分钟',
    mapUnlocked: '可滑动 ⇄',
    mapLocked: '页面锁定 🔒',
    googleMultiStop: '谷歌地图完整路线 ↗'
  },
  zht: {
    subtitle: '韓國觀光公社 TourAPI 4.0 官方認證GPS',
    copyCourse: '複製路線',
    copied: '已複製!',
    close: '關閉',
    dayTab: '第{day}天',
    spotsCount: '{count}處',
    dayItineraryTitle: '📍 第{day}天推薦行程 ({count}個景點)',
    recommendedOrder: '推薦順序: ① ➔ ② ➔ ③',
    morning: '🌅 上午',
    afternoon: '☀️ 下午',
    evening: '🌙 傍晚/夜景',
    locationProvided: '提供詳細位置',
    googleMap: '谷歌地圖',
    walkTransit: '🚶 步行約15分鐘 (800m)',
    busTransit: '🚌 公交/地鐵約10~15分鐘',
    mapUnlocked: '可滑動 ⇄',
    mapLocked: '頁面鎖定 🔒',
    googleMultiStop: '谷歌地圖完整路線 ↗'
  },
  de: {
    subtitle: 'Offizielle GPS-Synchronisation via TourAPI 4.0',
    copyCourse: 'Route kopieren',
    copied: 'Kopiert!',
    close: 'Schließen',
    dayTab: 'Tag {day}',
    spotsCount: '{count} Orte',
    dayItineraryTitle: '📍 Tag {day} Reiseroute ({count} Orte)',
    recommendedOrder: 'Empfohlene Reihenfolge: ① ➔ ② ➔ ③',
    morning: '🌅 Vormittag',
    afternoon: '☀️ Nachmittag',
    evening: '🌙 Abend / Nachtsicht',
    locationProvided: 'Standortdetails verfügbar',
    googleMap: 'Google Maps',
    walkTransit: '🚶 Zu Fuß ca. 15 Min. (800m)',
    busTransit: '🚌 ÖPNV ca. 10~15 Min.',
    mapUnlocked: 'Interaktiv ⇄',
    mapLocked: 'Scroll fixiert 🔒',
    googleMultiStop: 'Gesamte Route in Google Maps ↗'
  },
  fr: {
    subtitle: 'Synchronisation GPS officielle via TourAPI 4.0',
    copyCourse: 'Copier l\'itinéraire',
    copied: 'Copié !',
    close: 'Fermer',
    dayTab: 'Jour {day}',
    spotsCount: '{count} lieux',
    dayItineraryTitle: '📍 Itinéraire du Jour {day} ({count} lieux)',
    recommendedOrder: 'Ordre conseillé : ① ➔ ② ➔ ③',
    morning: '🌅 Matin',
    afternoon: '☀️ Après-midi',
    evening: '🌙 Soirée / Vue Nocturne',
    locationProvided: 'Adresse détaillée disponible',
    googleMap: 'Google Maps',
    walkTransit: '🚶 Marche ~15 min (800m)',
    busTransit: '🚌 Transports ~10-15 min',
    mapUnlocked: 'Interactif ⇄',
    mapLocked: 'Défilement bloqué 🔒',
    googleMultiStop: 'Itinéraire complet sur Google Maps ↗'
  },
  es: {
    subtitle: 'Sincronización GPS oficial mediante TourAPI 4.0',
    copyCourse: 'Copiar ruta',
    copied: '¡Copiado!',
    close: 'Cerrar',
    dayTab: 'Día {day}',
    spotsCount: '{count} lugares',
    dayItineraryTitle: '📍 Itinerario del Día {day} ({count} lugares)',
    recommendedOrder: 'Orden recomendado: ① ➔ ② ➔ ③',
    morning: '🌅 Mañana',
    afternoon: '☀️ Tarde',
    evening: '🌙 Noche / Vista Nocturna',
    locationProvided: 'Ubicación detallada disponible',
    googleMap: 'Google Maps',
    walkTransit: '🚶 A pie ~15 min (800m)',
    busTransit: '🚌 Transporte público ~10-15 min',
    mapUnlocked: 'Interactivo ⇄',
    mapLocked: 'Desplazamiento bloqueado 🔒',
    googleMultiStop: 'Ver ruta completa en Google Maps ↗'
  },
  ru: {
    subtitle: 'Официальная GPS-синхронизация через TourAPI 4.0',
    copyCourse: 'Копировать маршрут',
    copied: 'Скопировано!',
    close: 'Закрыть',
    dayTab: 'День {day}',
    spotsCount: '{count} мест',
    dayItineraryTitle: '📍 Маршрут на {day}-й день ({count} мест)',
    recommendedOrder: 'Рекомендуемый порядок: ① ➔ ② ➔ ③',
    morning: '🌅 Утро',
    afternoon: '☀️ День',
    evening: '🌙 Вечер / Ночной вид',
    locationProvided: 'Точный адрес доступен',
    googleMap: 'Google Карты',
    walkTransit: '🚶 Пешком ~15 мин (800м)',
    busTransit: '🚌 Транспорт ~10-15 мин',
    mapUnlocked: 'Управление картой ⇄',
    mapLocked: 'Скролл заблокирован 🔒',
    googleMultiStop: 'Полный маршрут на Google Картах ↗'
  }
};

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
  '통영': [34.8544, 128.4332],
  '남해': [34.8377, 127.8924],
  '평창': [37.3708, 128.3902],
  '가평': [37.8313, 127.5097],
  '양양': [38.0754, 128.6189],
  '안동': [36.5684, 128.7294],
  '포항': [36.0190, 129.3435],
  '춘천': [37.8813, 127.7298],
  'default': [37.5665, 126.9780]
};

function getApproxCoords(spot, regionName, idx) {
  let lat = parseFloat(spot?.mapy || spot?.lat);
  let lng = parseFloat(spot?.mapx || spot?.lng);

  const matchedRegion = Object.keys(REGION_COORDS).find(r => regionName && regionName.includes(r)) || 'default';
  const base = REGION_COORDS[matchedRegion] || REGION_COORDS['default'];

  if (!isNaN(lat) && !isNaN(lng) && lat > 30 && lat < 45 && lng > 120 && lng < 135) {
    // If targeted region is NOT Seoul, but coordinates are near default Seoul (37.5665), replace with region!
    if (matchedRegion !== '서울' && matchedRegion !== 'default') {
      const distFromBase = Math.sqrt(Math.pow(lat - base[0], 2) + Math.pow(lng - base[1], 2));
      if (distFromBase > 1.2) {
        const offsetLat = ((idx % 3) - 1) * 0.012 + (Math.sin(idx + 1) * 0.005);
        const offsetLng = (((idx + 1) % 3) - 1) * 0.015 + (Math.cos(idx + 1) * 0.005);
        return [base[0] + offsetLat, base[1] + offsetLng];
      }
    }
    return [lat, lng];
  }

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
  const cmi = COURSE_MAP_I18N[lang] || COURSE_MAP_I18N.en;
  const displayRegion = (regionName && regionName !== '추천' && regionName !== '한국')
    ? (t.regions?.[regionName] || getTranslatedAddress(regionName, lang))
    : ({
        ko: '추천',
        en: 'Recommended',
        ja: 'おすすめ',
        zh: '推荐',
        zht: '推薦',
        de: 'Empfohlen',
        fr: 'Recommandé',
        es: 'Recomendado',
        ru: 'Рекомендованный'
      }[lang] || 'Recommended');
  const [activeDay, setActiveDay] = useState(1);
  const [isMapUnlocked, setIsMapUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);

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
    const day = spot.assignedDay ? (parseInt(String(spot.assignedDay).replace(/[^0-9]/g, ''), 10) || 1) : 1;
    if (!daysGroup[day]) {
      daysGroup[day] = [];
    }
    daysGroup[day].push({ ...spot, assignedDay: day, _originalIndex: index });
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

    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    // Add Leaflet CSS
    const existingLink = document.getElementById('leaflet-css');
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Add Leaflet JS
    const existingScript = document.getElementById('leaflet-js');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setIsLeafletReady(true);
      };
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setIsLeafletReady(true));
    }
  }, [isOpen]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !isLeafletReady || !mapContainerRef.current || !window.L) return;

    const L = window.L;
    const SOUTH_KOREA_MAP_BOUNDS = [[33.0, 124.0], [39.0, 131.0]];

    // Destroy previous map instance cleanly
    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.remove();
      } catch (e) {}
      leafletMapRef.current = null;
    }

    if (currentDaySpots.length === 0) return;

    // Get approximate coords for all spots in the active day
    const coordsList = currentDaySpots.map((spot, idx) => getApproxCoords(spot, regionName, idx));

    // Calculate center
    const avgLat = coordsList.reduce((sum, c) => sum + c[0], 0) / coordsList.length;
    const avgLng = coordsList.reduce((sum, c) => sum + c[1], 0) / coordsList.length;

    const southKoreaBounds = L.latLngBounds(SOUTH_KOREA_MAP_BOUNDS);
    const map = L.map(mapContainerRef.current, {
      center: [avgLat, avgLng],
      zoom: 12,
      minZoom: 6.5,
      maxZoom: 18,
      maxBounds: southKoreaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      dragging: isDesktop || isMapUnlocked,
      touchZoom: isDesktop || isMapUnlocked,
      scrollWheelZoom: isDesktop || isMapUnlocked
    });

    // 🗺️ 언어별 지도 타일 동적 장착
    updateMapTileLayer(map, tileLayerRef, lang);

    leafletMapRef.current = map;

    // Numbered Badge Icon Generator
    const createNumberedIcon = (num, color = '#9333ea') => {
      return L.divIcon({
        className: 'custom-map-marker',
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
            ${num}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    };

    const markers = [];
    const latLngs = [];

    currentDaySpots.forEach((spot, idx) => {
      const [lat, lng] = coordsList[idx];
      latLngs.push([lat, lng]);

      const marker = L.marker([lat, lng], {
        icon: createNumberedIcon(idx + 1, idx === 0 ? '#10b981' : (idx === currentDaySpots.length - 1 ? '#ef4444' : '#9333ea'))
      }).addTo(map);

      const title = getTranslatedTitle(spot.title, lang);
      const addr = getTranslatedAddress(spot.addr1 || spot.location || '', lang);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px 2px; min-width: 170px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a; word-break: break-all;">${title}</strong>
          </div>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.3;">${addr}</p>
          <div style="display: flex; gap: 6px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' ' + addr)}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #2563eb; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 6px; border-radius: 6px; text-decoration: none;">
              ${lang === 'en' ? 'Google Maps ↗' : (lang === 'ja' ? 'Googleマップ ↗' : ((lang === 'zh' || lang === 'zht') ? '谷歌地图 ↗' : '구글 길찾기 ↗'))}
            </a>
          </div>
        </div>
      `);

      markers.push(marker);
    });

    // Draw route polyline between spots if >= 2 spots
    if (latLngs.length >= 2) {
      L.polyline(latLngs, {
        color: '#9333ea',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Fit map bounds to encompass all markers nicely
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    // Invalidate size after layout stabilization
    const timer = setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen, isLeafletReady, currentDay, isMapUnlocked, spots]);

  // 🗺️ 언어 변경 시 지도 타일 실시간 동적 스위칭
  useEffect(() => {
    if (leafletMapRef.current) {
      updateMapTileLayer(leafletMapRef.current, tileLayerRef, lang);
    }
  }, [lang]);

  if (!isOpen) return null;

  const handleCopyCourse = () => {
    try {
      const lines = [
        `🗺️ [Vora AI] ${regionName} ${availableDays.length > 1 ? `${availableDays.length}일 코스` : '당일 코스'} 추천 일정`,
        ''
      ];

      availableDays.forEach(dayNum => {
        lines.push(`📌 [${dayNum}일차]`);
        const daySpots = daysGroup[dayNum] || [];
        daySpots.forEach((s, idx) => {
          lines.push(`  ${idx + 1}. ${getTranslatedTitle(s.title, lang)} (${getTranslatedAddress(s.addr1 || s.location, lang)})`);
        });
        lines.push('');
      });

      lines.push(`👉 Vora AI 실시간 여행 컨시어지: ${window.location.origin}`);
      const textToCopy = lines.join('\n');

      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const buildGoogleMapsMultiStopUrl = () => {
    if (currentDaySpots.length === 0) return 'https://www.google.com/maps';
    if (currentDaySpots.length === 1) {
      const spot = currentDaySpots[0];
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' ' + (spot.location || spot.addr1 || ''))}`;
    }
    const origin = encodeURIComponent(currentDaySpots[0].title + ' ' + (currentDaySpots[0].location || currentDaySpots[0].addr1 || ''));
    const destination = encodeURIComponent(currentDaySpots[currentDaySpots.length - 1].title + ' ' + (currentDaySpots[currentDaySpots.length - 1].location || currentDaySpots[currentDaySpots.length - 1].addr1 || ''));
    
    if (currentDaySpots.length === 2) {
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }

    const waypoints = currentDaySpots.slice(1, -1).map(s => encodeURIComponent(s.title + ' ' + (s.location || s.addr1 || ''))).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  };

  const dayIcons = ['🏰', '🌿', '☕', '🌅', '🌌'];

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
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '1.5rem' : '0',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box'
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
          borderRadius: isDesktop ? '24px' : '20px 20px 0 0',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          maxWidth: '1040px',
          width: '100%',
          maxHeight: isDesktop ? 'calc(100vh - 4.5rem)' : '92vh',
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
          padding: isDesktop ? '1.1rem 1.4rem' : '0.75rem 0.95rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.45rem',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: isDesktop ? '36px' : '30px',
              height: isDesktop ? '36px' : '30px',
              borderRadius: isDesktop ? '12px' : '9px',
              backgroundColor: '#9333ea',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
              flexShrink: 0
            }}>
              <Compass size={isDesktop ? 18 : 16} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{
                fontSize: isDesktop ? '1.1rem' : '0.92rem',
                fontWeight: 900,
                margin: 0,
                color: '#0f172a',
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                🗺️ {displayRegion} {availableDays.length > 1 ?
                  ({
                    ko: `${availableDays.length}일 코스 스마트 동선`,
                    en: `${availableDays.length}-Day Smart Route`,
                    ja: `${availableDays.length}日間スマートコース`,
                    zh: `${availableDays.length}日游智慧路线`,
                    zht: `${availableDays.length}日遊智慧路線`,
                    de: `${availableDays.length}-Tage Smart-Route`,
                    fr: `Itinéraire Intelligent ${availableDays.length} Jours`,
                    es: `Ruta Inteligente de ${availableDays.length} Días`,
                    ru: `${availableDays.length}-дневный смарт-маршрут`
                  }[lang] || `${availableDays.length}-Day Smart Route`) :
                  ({
                    ko: '당일 코스 스마트 동선',
                    en: '1-Day Smart Route',
                    ja: '日帰りスマートコース',
                    zh: '一日游智慧路线',
                    zht: '一日遊智慧路線',
                    de: '1-Tag Smart-Route',
                    fr: 'Itinéraire 1 Jour',
                    es: 'Ruta de 1 Día',
                    ru: 'Однодневный смарт-маршрут'
                  }[lang] || '1-Day Smart Route')}
              </h3>
              <p style={{
                fontSize: isDesktop ? '0.72rem' : '0.66rem',
                color: '#64748b',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {cmi.subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <button
              onClick={handleCopyCourse}
              style={{
                padding: isDesktop ? '0.4rem 0.65rem' : '0.32rem 0.5rem',
                backgroundColor: copied ? '#dcfce7' : '#f1f5f9',
                color: copied ? '#15803d' : '#334155',
                border: copied ? '1px solid #86efac' : '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: isDesktop ? '0.74rem' : '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={12} /> : <Share2 size={12} />}
              <span>{copied ? cmi.copied : cmi.copyCourse}</span>
            </button>

            <button
              onClick={onClose}
              aria-label={cmi.close}
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                width: isDesktop ? '34px' : '28px',
                height: isDesktop ? '34px' : '28px',
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
              <X size={isDesktop ? 16 : 14} />
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
                  <span>{icon} {cmi.dayTab.replace('{day}', dNum)}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px'
                  }}>
                    {cmi.spotsCount.replace('{count}', count)}
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
                {cmi.dayItineraryTitle.replace('{day}', currentDay).replace('{count}', currentDaySpots.length)}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#9333ea', fontWeight: 700, backgroundColor: '#f3e8ff', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                {cmi.recommendedOrder}
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
                    onClick={() => onOpenDetail && onOpenDetail({ ...spot, assignedDay: spot.assignedDay || activeDay })}
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
                        {idx === 0 ? cmi.morning : (idx === 1 ? cmi.afternoon : cmi.evening)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span>{getTranslatedAddress(spot.location || spot.addr1, lang) || cmi.locationProvided}</span>
                    </div>

                    {/* CARD BUTTONS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenDetail && onOpenDetail({ ...spot, assignedDay: spot.assignedDay || activeDay })}
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
                        <span>{cmi.googleMap}</span>
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
                        <span>{idx === 0 ? cmi.walkTransit : cmi.busTransit}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: INTERACTIVE LEAFLET MAP VIEW */}
          <div style={{
            flex: isDesktop ? '1 1 50%' : '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f1f5f9',
            height: isDesktop ? '100%' : '165px',
            minHeight: isDesktop ? '340px' : '165px',
            position: 'relative'
          }}>
            {/* MAP FLOATING CONTROLS */}
            <div style={{
              position: 'absolute',
              top: '0.45rem',
              left: '0.45rem',
              right: '0.45rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isDesktop ? 'flex-end' : 'space-between',
              gap: '0.35rem',
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
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '8px',
                    border: isMapUnlocked ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                    backgroundColor: isMapUnlocked ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    color: isMapUnlocked ? '#166534' : '#334155',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  {isMapUnlocked ? <Unlock size={12} color="#16a34a" /> : <Lock size={12} color="#64748b" />}
                  <span>{isMapUnlocked ? cmi.mapUnlocked : cmi.mapLocked}</span>
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
                  gap: '0.25rem',
                  padding: isDesktop ? '0.4rem 0.8rem' : '0.25rem 0.55rem',
                  borderRadius: isDesktop ? '12px' : '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: isDesktop ? '0.74rem' : '0.68rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Navigation size={12} />
                <span>{cmi.googleMultiStop}</span>
              </a>
            </div>

            {/* LEAFLET MAP CONTAINER */}
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: isDesktop ? '100%' : '165px',
                minHeight: isDesktop ? '340px' : '165px',
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
