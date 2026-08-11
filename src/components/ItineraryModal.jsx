import React, { useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Calendar, Clock, MapPin, Sparkles, Navigation, Copy, Check, Filter, ShieldCheck, CloudRain, RefreshCw, Car, Bus, Utensils, Compass } from 'lucide-react';
import { generateSmartItinerary, generateCustomPickedItinerary, calculateTravelEstimate } from '../services/recommendationEngine';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';
import { getI18nTravelNote } from '../i18n/travelChipI18n';
import { buildAgodaDeepLink, buildKlookDeepLink } from '../services/apiConfig';
import ItineraryMapView, { getDayBtnText } from './ItineraryMapView';
import { useModalHistory } from '../hooks/useModalHistory';

function getI18nDayHeaderTitle(dayObj, region, lang = 'ko') {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const dNum = dayObj.day;
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

export default function ItineraryModal({ isOpen, onClose, filters, spots, lang, onSelectSpot, customPickedSpots = [] }) {
  useModalHistory(isOpen, onClose, 'itinerary-modal');

  const getInitialDays = () => {
    if (customPickedSpots && customPickedSpots.length > 0) {
      return Math.min(Math.max(Math.ceil(customPickedSpots.length / 4), 1), 5);
    }
    if (!filters?.startDate || !filters?.endDate) return 2;
    try {
      const s = new Date(filters.startDate);
      const e = new Date(filters.endDate);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(diffDays) || diffDays <= 0) return 1;
      return Math.min(Math.max(diffDays, 1), 5);
    } catch (e) {
      return 2;
    }
  };

  // All state declarations placed at top of component to prevent TDZ ReferenceError
  const [selectedDays, setSelectedDays] = useState(getInitialDays);
  const [customStartDate, setCustomStartDate] = useState(() => {
    return filters?.startDate || new Date().toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('20:00');
  const [dayTimes, setDayTimes] = useState({});
  const [daySeeds, setDaySeeds] = useState({});
  const [rainyMode, setRainyMode] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [swappedSpots, setSwappedSpots] = useState({});
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [activeMapDay, setActiveMapDay] = useState(1);
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const datePickerRef = useRef(null);

  // useEffect hooks placed after all state variables are fully initialized
  useEffect(() => {
    if (isOpen) {
      setSelectedDays(getInitialDays());
      if (filters?.startDate) {
        setCustomStartDate(filters.startDate);
      }
    }
  }, [isOpen, filters?.startDate, filters?.endDate, customPickedSpots?.length]);

  // Auto-reset activeMapDay to 1 and clear spot swaps whenever ANY condition filter changes
  useEffect(() => {
    setActiveMapDay(1);
    setSwappedSpots({});
  }, [selectedDays, customStartDate, rainyMode, startTime, endTime, refreshSeed]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const region = filters?.region || '서울';
  const theme = filters?.theme || '전체';

  const startDateObj = customStartDate ? new Date(customStartDate) : new Date();

  const formatDateStr = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getBadgeI18n = (type, value) => {
    if (!value) return '';
    const curLang = lang || 'ko';
    if (type === 'region') return TRANSLATIONS[curLang]?.regions?.[value] || value;
    if (type === 'theme') return TRANSLATIONS[curLang]?.themes?.[value] || value;
    if (type === 'gender') return TRANSLATIONS[curLang]?.genders?.[value] || value;
    if (type === 'age') return TRANSLATIONS[curLang]?.ages?.[value] || value;
    if (type === 'apiService') return TRANSLATIONS[curLang]?.apiServices?.[value] || value;
    return value;
  };

  const isCustomMode = customPickedSpots && customPickedSpots.length > 0;

  const baseItinerary = isCustomMode
    ? generateCustomPickedItinerary({
        pickedSpots: customPickedSpots,
        days: selectedDays,
        startDate: customStartDate,
        startTime,
        endTime,
        rainyMode,
        allSpots: spots
      })
    : generateSmartItinerary({
        region,
        theme,
        days: selectedDays,
        startDate: customStartDate,
        startTime,
        endTime,
        dayTimes,
        daySeeds,
        rainyMode,
        refreshSeed,
        spots
      });

  // Apply spot swaps AND dynamically recalculate nextTravel between consecutive items
  const itinerary = baseItinerary.map((day, dIdx) => {
    const updatedSchedule = day.schedule.map((item, sIdx) => {
      const swapKey = `${dIdx}-${sIdx}`;
      if (swappedSpots[swapKey]) {
        return {
          ...item,
          ...swappedSpots[swapKey]
        };
      }
      return item;
    });

    // Recalculate travel estimates dynamically after swap
    for (let i = 0; i < updatedSchedule.length - 1; i++) {
      updatedSchedule[i].nextTravel = calculateTravelEstimate(updatedSchedule[i], updatedSchedule[i + 1]);
    }

    return {
      ...day,
      schedule: updatedSchedule
    };
  });

  const handleSwapSpot = (dIdx, sIdx, dayPool) => {
    const swapKey = `${dIdx}-${sIdx}`;
    if (!dayPool || dayPool.length === 0) return;
    
    // Pick a random alternative spot from pool
    const randomIdx = Math.floor(Math.random() * dayPool.length);
    const newSpot = dayPool[randomIdx];
    
    setSwappedSpots(prev => ({
      ...prev,
      [swapKey]: {
        title: newSpot.title,
        location: newSpot.location || newSpot.addr1 || `${region} 도심`,
        image: newSpot.image || '/default-spot.png',
        rating: newSpot.rating || 4.8,
        lat: newSpot.lat,
        lng: newSpot.lng
      }
    }));
  };

  const handleCopyItinerary = () => {
    let summaryText = `[K-Travel Explorer] ${region} ${selectedDays}박 ${selectedDays + 1}일 추천 코스 (${customStartDate} 출발)\n`;
    if (rainyMode) summaryText += `🌧️ 비 오는 날 실내 전용 코스 적용\n`;
    summaryText += `📍 상세 조건: 지역(${region}) · 테마(${theme}) · 성별(${filters?.gender || '무관'}) · 연령대(${filters?.age || '전체'})\n\n`;
    
    itinerary.forEach(day => {
      summaryText += `📌 ${day.dayTitle}\n`;
      day.schedule.forEach(s => {
        summaryText += `  • [${s.time}] ${s.title} (${s.location})\n`;
      });
      summaryText += `\n`;
    });
    summaryText += `🔗 전체 코스 보기: https://koreatravel.cc/?region=${encodeURIComponent(region)}&startDate=${customStartDate}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getMapLink = (spotTitle, location) => {
    const query = encodeURIComponent(`${spotTitle} ${location}`);
    if (lang === 'ko') {
      return `https://map.kakao.com/link/search/${query}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div 
      className="modal-overlay-backdrop"
      style={{
        overscrollBehaviorY: 'contain',
        overscrollBehaviorX: 'none',
        touchAction: 'pan-x pan-y'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in glass-panel modal-responsive-card"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glow)',
          padding: '1.25rem 1.25rem',
          overscrollBehaviorY: 'contain',
          overscrollBehaviorX: 'none',
          touchAction: 'pan-x pan-y'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek 2-Row Sticky Header with Integrated Day Tabs & Options Panel (Scroll-Proof) */}
        <div style={{
          position: 'sticky',
          top: '-1.25rem',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '1.25rem 0.85rem 0.65rem 0.85rem',
          margin: '-1.25rem -1.25rem 0.85rem -1.25rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Row 1: Title, Badges & Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.2)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} className="gradient-text">
                {t.aiItineraryMainTitle || 'AI 코스 추천'}
              </h2>

              <span 
                title={t.aiTrustBadgeDesc || '한국관광공사 Official DB 100% 연동 인증 코스'}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={12} color="#10b981" />
                <span>{t.aiTrustBadgeTitleShort || '공식 DB 연동'}</span>
              </span>

              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                background: 'var(--bg-card)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-highlight)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                flexShrink: 0
              }}>
                📍 {getBadgeI18n('region', region)} · {selectedDays === 1 ? (t.dayTrip1Day || '당일치기') : `${selectedDays}${t.daysCountUnit || '일간'}`}
              </span>
            </div>

            {/* Top-Right Sticky Close Button (Guaranteed Padding to Prevent Mobile Overflow Clipping) */}
            <button
              onClick={onClose}
              aria-label="닫기"
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                marginRight: '0.2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Row 2: Pinned Left Controls (View Toggle + Condition Filter) & Swipeable Right Day Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '0.45rem',
            paddingTop: '0.3rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            {/* Left Fixed Container (100% Pinned with Embossed Card Background & Right Drop Shadow) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              flexShrink: 0,
              padding: '0.2rem 0.5rem 0.2rem 0.25rem',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-highlight)',
              boxShadow: '4px 0 10px rgba(0, 0, 0, 0.18)',
              zIndex: 10
            }}>
              {/* Item 1 (Far Left Pinned): Compact Single Toggle Button for View Switcher (Map ⇄ List) */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'var(--accent-gradient)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}
                title={viewMode === 'map' ? (t.switchToListView || '일정 목록으로 보기') : (t.switchToMapView || '지도 화면으로 보기')}
              >
                {viewMode === 'map' ? <Calendar size={13} /> : <Compass size={13} />}
                <span>
                  {viewMode === 'map' 
                    ? (t.listViewShortToggle || (lang === 'en' ? '📋 List ⇄' : '📋 일정 ⇄')) 
                    : (t.mapViewShortToggle || (lang === 'en' ? '🗺️ Map ⇄' : '🗺️ 지도 ⇄'))
                  }
                </span>
              </button>

              {/* Item 2 (Second Pinned): Options Toggle Button (Condition Change) */}
              <button
                type="button"
                onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
                style={{
                  background: isOptionsExpanded ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
                  color: isOptionsExpanded ? 'var(--accent-primary)' : 'var(--text-main)',
                  border: isOptionsExpanded ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <span>{isOptionsExpanded ? (t.toggleOptionsCollapse || (lang === 'en' ? '▲ Hide' : '▲ 접기')) : (t.toggleOptionsExpand || (lang === 'en' ? '⚙️ Filter ▼' : '⚙️ 조건 변경 ▼'))}</span>
              </button>
            </div>

            {/* Right Independent Swipeable Container (Day Selector Tabs & Quick Actions) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.45rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {/* Item 3: Day Selector Buttons (Horizontal Swipeable Bar) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '0.1rem', flexShrink: 0 }}>
                  {t.selectDayLabel || '일차:'}
                </span>
                {itinerary.map(d => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => {
                      setActiveMapDay(d.day);
                    }}
                    style={{
                      background: activeMapDay === d.day ? 'var(--accent-gradient)' : 'var(--bg-card)',
                      color: activeMapDay === d.day ? '#ffffff' : 'var(--text-main)',
                      border: activeMapDay === d.day ? 'none' : '1px solid var(--border-color)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {getDayBtnText(d, lang)}
                  </button>
                ))}
              </div>

              {/* Item 4 (Far Right): Action Buttons (AI Regenerate & Copy Course) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                {/* AI Regenerate Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSwappedSpots({});
                    setRefreshSeed(prev => prev + 1);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    boxShadow: '0 2px 6px rgba(192, 132, 252, 0.3)',
                    flexShrink: 0
                  }}
                  title="AI 코스 다시 추천"
                >
                  <Sparkles size={12} />
                  <span>{t.reRecommendAiBtnShort || (lang === 'ko' ? '🔄 다시추천' : '🔄 Re-AI')}</span>
                </button>

                {/* Copy Course Button */}
                <button
                  type="button"
                  onClick={handleCopyItinerary}
                  style={{
                    background: copied ? '#22c55e' : 'var(--accent-gradient)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    flexShrink: 0
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? (t.copiedToast || '복사완료!') : (t.copyCourseBtn || '복사')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Integrated Collapsible Options Panel Inside Sticky Header (Scroll-Proof) */}
          {isOptionsExpanded && (
            <div style={{
              padding: '0.75rem 0.85rem',
              marginTop: '0.35rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)'
            }}>
              {/* Days buttons (Up to 5 Days) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{t.tripDurationTitle || '여행 기간:'}</span>
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    style={{
                      background: selectedDays === d ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                      color: selectedDays === d ? '#ffffff' : 'var(--text-muted)',
                      border: selectedDays === d ? 'none' : '1px solid var(--border-color)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {d === 1 ? (t.dayTrip1Day || '당일치기 (1 Day)') : `${d - 1}${t.nightsLabel || '박'} ${d}${t.daysLabel || '일'} (${d} Days)`}
                  </button>
                ))}
              </div>

              {/* Interactive Controls (Start Date, Rainy Mode Toggle, Time Selector) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Rainy Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setRainyMode(!rainyMode)}
                  style={{
                    background: rainyMode ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'var(--bg-secondary)',
                    border: rainyMode ? 'none' : '1px solid var(--border-color)',
                    color: rainyMode ? '#ffffff' : 'var(--text-main)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CloudRain size={13} color={rainyMode ? '#ffffff' : '#38bdf8'} />
                  <span>{t.rainyModeLabel || '비 오는 날 (실내 코스)'}</span>
                </button>

                {/* Date Picker Input */}
                <div style={{ position: 'relative', width: '150px' }}>
                  <DatePicker
                    ref={datePickerRef}
                    selected={startDateObj}
                    onChange={(d) => setCustomStartDate(formatDateStr(d))}
                    locale={lang === 'zht' ? 'zh' : (lang || 'ko')}
                    dateFormat="yyyy-MM-dd"
                    className="custom-datepicker-input"
                    portalId="root"
                    popperPlacement="bottom-start"
                    showIcon
                    icon={
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="datepicker-custom-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          datePickerRef.current?.setOpen(true);
                        }}
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/>
                        <line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                    }
                  />
                </div>

                {/* Daily Start ~ End Time Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.3rem 0.55rem', borderRadius: 'var(--radius-md)' }}>
                  <Clock size={13} color="var(--accent-primary)" />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="06:00">06:00 {t.departTimeLabel || '출발'}</option>
                    <option value="07:00">07:00 {t.departTimeLabel || '출발'}</option>
                    <option value="08:00">08:00 {t.departTimeLabel || '출발'}</option>
                    <option value="09:00">09:00 {t.departTimeLabel || '출발'}</option>
                    <option value="09:30">09:30 {t.departTimeLabel || '출발'}</option>
                    <option value="10:00">10:00 {t.departTimeLabel || '출발'}</option>
                    <option value="11:00">11:00 {t.departTimeLabel || '출발'}</option>
                    <option value="12:00">12:00 {t.departTimeLabel || '출발'}</option>
                    <option value="13:00">13:00 {t.departTimeLabel || '출발'}</option>
                  </select>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>~</span>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="18:00">18:00 {t.arriveTimeLabel || '종료'}</option>
                    <option value="19:00">19:00 {t.arriveTimeLabel || '종료'}</option>
                    <option value="20:00">20:00 {t.arriveTimeLabel || '종료'}</option>
                    <option value="21:00">21:00 {t.arriveTimeLabel || '종료'}</option>
                    <option value="22:00">22:00 {t.arriveTimeLabel || '종료'}</option>
                    <option value="23:00">23:00 {t.arriveTimeLabel || '종료'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conditional View Rendering: Map View vs Timeline List View */}
        {viewMode === 'map' ? (
          <ItineraryMapView
            itinerary={itinerary}
            activeDay={activeMapDay}
            onChangeDay={setActiveMapDay}
            lang={lang}
            onSwitchToList={() => setViewMode('list')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {itinerary.map((day, dIdx) => {
              const curDayStart = dayTimes[day.day]?.start || startTime;
              const curDayEnd = dayTimes[day.day]?.end || endTime;

            return (
              <div key={day.day} style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Premium Day Header Banner (Distinct Pastel Gradient + Left Brand Accent Bar) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                  padding: '0.75rem 0.85rem',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderLeft: '5px solid var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  {/* Left: DAY Pill Badge & Full Date/Region Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--accent-gradient)',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 6px rgba(14, 165, 233, 0.3)'
                    }}>
                      DAY {day.day}
                    </span>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      margin: 0
                    }}>
                      <span>{getI18nDayHeaderTitle(day, region, lang)}</span>
                    </h3>
                  </div>

                  {/* Right: Day-specific Time Controls & Regeneration Button in Compact 1-Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      padding: '0.2rem 0.45rem',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <Clock size={13} color="var(--accent-primary)" />
                      <select
                        value={curDayStart}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          setDayTimes(prev => ({
                            ...prev,
                            [day.day]: { start: newStart, end: prev[day.day]?.end || curDayEnd }
                          }));
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="06:00">06:00 {t.departTimeLabel || '출발'}</option>
                        <option value="07:00">07:00 {t.departTimeLabel || '출발'}</option>
                        <option value="08:00">08:00 {t.departTimeLabel || '출발'}</option>
                        <option value="09:00">09:00 {t.departTimeLabel || '출발'}</option>
                        <option value="09:30">09:30 {t.departTimeLabel || '출발'}</option>
                        <option value="10:00">10:00 {t.departTimeLabel || '출발'}</option>
                        <option value="11:00">11:00 {t.departTimeLabel || '출발'}</option>
                        <option value="12:00">12:00 {t.departTimeLabel || '출발'}</option>
                        <option value="13:00">13:00 {t.departTimeLabel || '출발'}</option>
                      </select>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>~</span>
                      <select
                        value={curDayEnd}
                        onChange={(e) => {
                          const newEnd = e.target.value;
                          setDayTimes(prev => ({
                            ...prev,
                            [day.day]: { start: prev[day.day]?.start || curDayStart, end: newEnd }
                          }));
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="18:00">18:00 {t.arriveTimeLabel || '종료'}</option>
                        <option value="19:00">19:00 {t.arriveTimeLabel || '종료'}</option>
                        <option value="20:00">20:00 {t.arriveTimeLabel || '종료'}</option>
                        <option value="21:00">21:00 {t.arriveTimeLabel || '종료'}</option>
                        <option value="22:00">22:00 {t.arriveTimeLabel || '종료'}</option>
                        <option value="23:00">23:00 {t.arriveTimeLabel || '종료'}</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDaySeeds(prev => ({
                          ...prev,
                          [day.day]: (prev[day.day] || 0) + 1
                        }));
                      }}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-highlight)',
                        color: 'var(--accent-primary)',
                        padding: '0.25rem 0.55rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                      title={`${day.day}${t.dayUnit || '일차'} ${t.changeCourseBtn || '코스 변경'}`}
                    >
                      <RefreshCw size={12} />
                      <span>{day.day}{t.dayUnit || '일차'} {t.changeCourseBtn || '코스 변경 🔄'}</span>
                    </button>
                  </div>
                </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {day.schedule.map((item, sIdx) => {
                  let slotI18n = item.slotName;
                  if (item.slotName.includes('오전')) slotI18n = t.slotMorning || item.slotName;
                  else if (item.slotName.includes('낮')) slotI18n = t.slotAfternoon || item.slotName;
                  else if (item.slotName.includes('오후')) slotI18n = t.slotEvening || item.slotName;
                  else if (item.slotName.includes('밤')) slotI18n = t.slotNight || item.slotName;

                  const itemDisplayTitle = getTranslatedTitle(item.title, lang);
                  const itemDisplayAddr = getTranslatedAddress(item.location, lang);
                  const nextSpot = day.schedule[sIdx + 1];
                  const nextDisplayTitle = nextSpot ? getTranslatedTitle(nextSpot.title, lang) : '';

                  return (
                  <React.Fragment key={sIdx}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--border-color)',
                      flexWrap: 'wrap'
                    }}>
                      {/* Time Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: 'var(--accent-primary)',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0
                      }}>
                        <Clock size={14} />
                        <span>{item.time}</span>
                      </div>

                      {/* Spot Image */}
                      <img 
                        src={item.image} 
                        alt={itemDisplayTitle} 
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: 'var(--radius-md)',
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid var(--border-color)'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SPOT_IMAGES.attraction;
                        }}
                      />

                      {/* Info Container */}
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                          {slotI18n}
                        </div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>
                          {itemDisplayTitle}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} color="var(--accent-primary)" />
                          <span>{itemDisplayAddr}</span>
                        </div>
                      </div>

                      {/* Action Buttons: Swap Spot, Route Map, Nearby Food */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleSwapSpot(day.day, sIdx)}
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.4rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title={t.swapSpotBtn || '교체 🔄'}
                        >
                          <RefreshCw size={13} />
                          <span>{t.swapSpotBtn || '교체 🔄'}</span>
                        </button>

                        <a
                          href={getMapLink(item.title, item.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-highlight)',
                            color: 'var(--accent-primary)',
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                        >
                          <Navigation size={13} />
                          <span>{t.mapRouteBtn || '지도 경로'}</span>
                        </a>

                        <a
                          href={`https://map.kakao.com/?q=${encodeURIComponent(item.title + ' 맛집')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid #f97316',
                            color: '#f97316',
                            padding: '0.4rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                          title={`${itemDisplayTitle} 주변 맛집 검색`}
                        >
                          <Utensils size={13} color="#f97316" />
                          <span>{t.nearbyFoodBtn || '주변 맛집 🍽️'}</span>
                        </a>
                      </div>
                    </div>

                    {/* Inter-Spot Travel Time & Distance Indicator (100% 9-Language i18n Chip) */}
                    {item.nextTravel && nextSpot && (() => {
                      const travelI18n = getI18nTravelNote(item.nextTravel, lang);
                      return (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.2rem 0',
                          margin: '-0.15rem 0'
                        }}>
                          <div style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-highlight)',
                            padding: '0.3rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                          }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                              📍 {itemDisplayTitle.length > 8 ? itemDisplayTitle.substring(0, 8) + '...' : itemDisplayTitle} ➔ {nextDisplayTitle.length > 8 ? nextDisplayTitle.substring(0, 8) + '...' : nextDisplayTitle}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>|</span>
                            {travelI18n.isLongDistance ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontWeight: 800 }}>
                                {travelI18n.longNote}
                              </span>
                            ) : (
                              <>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0284c7', fontWeight: 800 }}>
                                  {travelI18n.driveNote}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>·</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#818cf8', fontWeight: 800 }}>
                                  {travelI18n.transitNote}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Contextual Affiliate & Discount Coupon Banner */}
        {(() => {
          let checkInStr = '';
          let checkOutStr = '';
          try {
            const startDate = customStartDate ? new Date(customStartDate) : new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (selectedDays || 2));
            const y1 = startDate.getFullYear();
            const m1 = String(startDate.getMonth() + 1).padStart(2, '0');
            const d1 = String(startDate.getDate()).padStart(2, '0');
            const y2 = endDate.getFullYear();
            const m2 = String(endDate.getMonth() + 1).padStart(2, '0');
            const d2 = String(endDate.getDate()).padStart(2, '0');
            checkInStr = `${y1}-${m1}-${d1}`;
            checkOutStr = `${y2}-${m2}-${d2}`;
          } catch (e) {
            checkInStr = new Date().toISOString().split('T')[0];
          }

          const agodaDeepUrl = buildAgodaDeepLink(region, checkInStr, checkOutStr);
          const klookDeepUrl = buildKlookDeepLink(region, checkInStr, checkOutStr);

          return (
            <div style={{
              marginTop: '1.75rem',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(129, 140, 248, 0.12))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="var(--accent-primary)" />
                  <span>{t.partnerDealsTitle || '✨ 🎁 전국 코스 맞춤 제휴 혜택 & 최저가 숙소/입장권'}</span>
                </h4>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {checkInStr} ~ {checkOutStr}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                <a
                  href={agodaDeepUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 0.85rem',
                    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span>🏨 {getBadgeI18n('region', region)} {t.agodaHotelBtn || '최저가 숙소 (Agoda)'}</span>
                </a>

                <a
                  href={klookDeepUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 0.85rem',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span>🎫 {getBadgeI18n('region', region)} {t.klookActivityBtn || '티켓/패스 (Klook)'}</span>
                </a>
              </div>
            </div>
            );
          })()}
        </div>
        )}
      </div>
    </div>
  );
}
