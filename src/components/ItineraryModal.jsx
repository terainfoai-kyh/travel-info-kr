import React, { useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Calendar, Clock, MapPin, Sparkles, Navigation, Copy, Check, Filter, ShieldCheck, CloudRain, RefreshCw, Car, Bus, Utensils } from 'lucide-react';
import { generateSmartItinerary, generateCustomPickedItinerary, calculateTravelEstimate } from '../services/recommendationEngine';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';
import { buildAgodaDeepLink, buildKlookDeepLink } from '../services/apiConfig';
import ItineraryMapView from './ItineraryMapView';

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

  const [selectedDays, setSelectedDays] = useState(getInitialDays);
  const [customStartDate, setCustomStartDate] = useState(() => {
    return filters?.startDate || new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedDays(getInitialDays());
      if (filters?.startDate) {
        setCustomStartDate(filters.startDate);
      }
    }
  }, [isOpen, filters?.startDate, filters?.endDate, customPickedSpots?.length]);

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
  const datePickerRef = useRef(null);

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
      onClick={onClose}
    >
      <div 
        className="animate-fade-in glass-panel modal-responsive-card"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glow)',
          padding: '1.25rem 1.25rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Always Visible Sticky Close Button */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'sticky',
            top: '1rem',
            float: 'right',
            marginRight: '0.5rem',
            marginTop: '0.5rem',
            marginBottom: '-3rem',
            zIndex: 200,
            background: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
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
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.2)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-primary)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }} className="gradient-text">
                {t.aiItineraryMainTitle || 'AI 스마트 여행 코스 추천'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {t.aiItineraryMainSub || '지정한 시작일자 및 상세 검색 조건 기반 맞춤 동선 추천'}
              </p>
            </div>
          </div>

          {/* Trust Guarantee Badge Card */}
          <div style={{
            margin: '0.75rem 0 0.5rem 0',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.1))',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <ShieldCheck size={20} color="#10b981" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                {t.aiTrustBadgeTitle || '🔒 K-Travel AI 플래너의 약속'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>
                {t.aiTrustBadgeDesc || '본 코스는 한국관광공사 Official DB를 기반으로 생성되며, 허위 정보 없이 카카오맵/구글맵 실제 경로와 100% 연동됩니다.'}
              </div>
            </div>
          </div>

          {/* Active Search Conditions Badges Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginTop: '0.6rem',
            padding: '0.6rem 0.85rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Filter size={13} color="var(--accent-primary)" /> {t.appliedFiltersLabel || '적용된 조회 조건:'}
            </span>

            {/* 1. 여행 시작일 ~ 종료일 */}
            <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontWeight: 700 }}>
              📅 {filters?.endDate && filters.endDate !== customStartDate ? `${customStartDate} ~ ${filters.endDate}` : `${customStartDate} ${t.fromStartLabel || '부터'}`} ({selectedDays}{t.daysCountUnit || '일 코스 추천'})
            </span>

            {/* 2. 지역 */}
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontWeight: 700 }}>
              📍 {getBadgeI18n('region', region)}
            </span>

            {/* 3. 테마 */}
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontWeight: 600 }}>
              🏖️ {getBadgeI18n('theme', theme)}
            </span>

            {/* 4. 성별 */}
            {filters?.gender && filters.gender !== '무관' && (
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                🚻 {getBadgeI18n('gender', filters.gender)}
              </span>
            )}

            {/* 5. 연령대 */}
            {filters?.age && filters.age !== '전체' && (
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                👤 {getBadgeI18n('age', filters.age)}
              </span>
            )}

            {/* 6. 검색 키워드 */}
            {filters?.keyword && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', color: '#f97316', fontWeight: 700 }}>
                🔍 {filters.keyword}
              </span>
            )}
          </div>
        </div>

        {/* Controls Bar (Days, Start Date, Rainy Mode Toggle, Copy) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          margin: '1rem 0 1.5rem 0',
          padding: '0.85rem 1rem',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-highlight)'
        }}>
          {/* Days buttons (Up to 5 Days) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{t.tripDurationTitle || '여행 기간:'}</span>
            {[1, 2, 3, 4, 5].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDays(d)}
                style={{
                  background: selectedDays === d ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                  color: selectedDays === d ? '#ffffff' : 'var(--text-muted)',
                  border: selectedDays === d ? 'none' : '1px solid var(--border-color)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {d === 1 ? (t.dayTrip1Day || '당일치기 (1 Day)') : `${d - 1}${t.nightsLabel || '박'} ${d}${t.daysLabel || '일'} (${d} Days)`}
              </button>
            ))}
          </div>

          {/* Interactive Controls (Start Date, Rainy Mode Toggle, Copy) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Rainy Mode Toggle */}
            <button
              type="button"
              onClick={() => setRainyMode(!rainyMode)}
              style={{
                background: rainyMode ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'var(--bg-secondary)',
                border: rainyMode ? 'none' : '1px solid var(--border-color)',
                color: rainyMode ? '#ffffff' : 'var(--text-main)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease'
              }}
            >
              <CloudRain size={14} color={rainyMode ? '#ffffff' : '#38bdf8'} />
              <span>{t.rainyModeLabel || '비 오는 날 (실내 코스)'}</span>
            </button>

            {/* Date Picker Input */}
            <div style={{ position: 'relative', width: '155px' }}>
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
                    width="15" 
                    height="15" 
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
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
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>~</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
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

            {/* View Mode Toggle (Map vs List) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                style={{
                  background: viewMode === 'map' ? 'var(--accent-gradient)' : 'transparent',
                  color: viewMode === 'map' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🗺️ {t.mapViewLabel || '전체 동선 지도'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--accent-gradient)' : 'transparent',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📋 {t.listViewLabel || '일정 목록'}
              </button>
            </div>

            {/* AI Regenerate / Re-recommend Button */}
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
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(192, 132, 252, 0.35)'
              }}
              title="시간/날짜 조건에 맞춰 AI 추천 코스 갱신하기"
            >
              <Sparkles size={15} />
              <span>{t.reRecommendAiBtn || 'AI 코스 다시 추천 🔄'}</span>
            </button>

            <button
              onClick={handleCopyItinerary}
              style={{
                background: copied ? '#22c55e' : 'var(--accent-gradient)',
                border: 'none',
                color: '#ffffff',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)'
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? (t.copiedToast || '복사완료!') : (t.copyCourseBtn || '코스 복사')}</span>
            </button>
          </div>
        </div>

        {/* Conditional View Rendering: Map View vs Timeline List View */}
        {viewMode === 'map' ? (
          <ItineraryMapView
            itinerary={itinerary}
            activeDay={activeMapDay}
            onChangeDay={setActiveMapDay}
            lang={lang}
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
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.6rem'
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0
                  }}>
                    <Calendar size={18} />
                    <span>{getI18nDayHeaderTitle(day, region, lang)}</span>
                  </h3>

                  {/* Day-specific Time Controls & Regeneration */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      padding: '0.25rem 0.55rem',
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
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-highlight)',
                        color: 'var(--accent-primary)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
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
                      />

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {slotI18n}
                        </div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.1rem 0' }}>
                          {itemDisplayTitle}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          <MapPin size={13} color="var(--accent-primary)" />
                          <span>{itemDisplayAddr}</span>
                        </div>
                      </div>

                      {/* Actions (Spot Swap & Map Link) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSwapSpot(dIdx, sIdx, day.pool)}
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
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

                    {/* Inter-Spot Travel Time & Distance Indicator */}
                    {item.nextTravel && nextSpot && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.8rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                        padding: '0.3rem 0',
                        margin: '-0.2rem 0'
                      }}>
                        <span style={{ height: '14px', width: '1px', background: 'var(--border-color)' }} />
                        <span style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          padding: '0.2rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.73rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            📍 {itemDisplayTitle.length > 8 ? itemDisplayTitle.substring(0, 8) + '...' : itemDisplayTitle} ➔ {nextDisplayTitle.length > 8 ? nextDisplayTitle.substring(0, 8) + '...' : nextDisplayTitle}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>:</span>
                          {item.nextTravel.isLongDistance ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#eab308', fontWeight: 700 }}>
                              {item.nextTravel.longDistanceNote || '✈️ KTX / 항공 / 시외버스 이동 (장거리)'}
                            </span>
                          ) : (
                            <>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#0284c7', fontWeight: 700 }}>
                                <Car size={12} /> {t.drivePrefix || '차량 약'} {item.nextTravel.carMin}{t.minuteUnit || '분'} ({item.nextTravel.distKm}km)
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>|</span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#818cf8', fontWeight: 700 }}>
                                <Bus size={12} /> {t.transitPrefix || '대중교통 약'} {item.nextTravel.transitMin}{t.minuteUnit || '분'}
                              </span>
                            </>
                          )}
                        </span>
                        <span style={{ height: '14px', width: '1px', background: 'var(--border-color)' }} />
                      </div>
                    )}
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
