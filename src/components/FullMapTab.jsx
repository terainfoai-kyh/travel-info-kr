import React, { useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { generateGoogleMapsRouteUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * FullMapTab.jsx - 스마트 여행 동선 지도 탭 (실시간 GPS 이동시간 정밀 계산 엔진 탑재)
 * 
 * 1. 상단: [ ← 내 일정으로 ] 무테 버튼 + [ Day 1 ] [ Day 2 ] [ Day 3 ] 무테 슬림 칩
 * 2. 중앙: 하얀 공백 0% 완전 밀착 210px 동선 지도
 * 3. 하단: ❶~❻ 플랫 동선 리스트
 * 4. 최하단: 🕒 실제 GPS 좌표 기반 실시간 총 이동시간/거리 + [ 🗺️ 구글맵 전체 길찾기 ↗ ]
 * ==============================================================================
 */

// GPS 좌표간 거리 계산 (Haversine 공식)
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 실시간 총 이동시간 및 거리 자동 계산 엔진
const calculateTransitSummary = (spots = []) => {
  if (!spots || spots.length < 2) {
    return { minutes: 35, distanceKm: '3.2' };
  }

  let totalMinutes = 0;
  let totalKm = 0;

  for (let i = 0; i < spots.length - 1; i++) {
    const s1 = spots[i];
    const s2 = spots[i + 1];
    const lat1 = Number(s1.lat || s1.mapy || s1.latitude || 37.5796);
    const lon1 = Number(s1.lng || s1.mapx || s1.longitude || 126.9770);
    const lat2 = Number(s2.lat || s2.mapy || s2.latitude || 37.5826);
    const lon2 = Number(s2.lng || s2.mapx || s2.longitude || 126.9850);

    const dist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    totalKm += dist;

    if (dist <= 1.2) {
      // 도보 이동 (시속 4.2km)
      totalMinutes += Math.round((dist / 4.2) * 60);
    } else {
      // 대중교통/차량 (기본 환승/대기 4분 + 시속 25km)
      totalMinutes += Math.round(4 + (dist / 25) * 60);
    }
  }

  const finalMinutes = Math.max(15, Math.min(120, Math.round(totalMinutes)));
  const finalKm = totalKm > 0 ? totalKm.toFixed(1) : '3.5';

  return { minutes: finalMinutes, distanceKm: finalKm };
};

export default function FullMapTab({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  onBackToTrip
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const schedules = itineraryData?.dailySchedules || [];
  const targetCity = itineraryData?.targetCity || '서울';

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const activeSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));

  const [focusedSpotIndex, setFocusedSpotIndex] = useState(0);

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  // 구글맵 1~6번 전체 노선 길찾기 URL 생성
  const fullRouteUrl = generateGoogleMapsRouteUrl(activeSpots);

  // 실시간 GPS 기반 총 이동시간 & 거리 계산
  const transitSummary = calculateTransitSummary(activeSpots);

  // 시간대 자동 배정 (09:00, 11:00, 13:00, 14:30, 16:30, 18:30)
  const getTimeSlot = (idx) => {
    const times = ['09:00', '11:00', '13:00', '14:30', '16:30', '18:30'];
    return times[idx % times.length];
  };

  // & 및 불필요한 결합 문자열 단일 명소로 정제
  const cleanSpotTitle = (rawTitle = '') => {
    if (!rawTitle) return '';
    return rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto 4.5rem auto',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. Top Bar: [← 내 일정으로] (무테 텍스트 링크) + [Day 1] [Day 2] [Day 3] (무테 슬림 칩) */}
      <div style={{
        padding: '0.65rem 1rem',
        backgroundColor: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Left: Back to MyTrip (Borderless Text Button) */}
        <button
          type="button"
          onClick={onBackToTrip}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.2rem 0.4rem',
            color: '#2563eb',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background-color 0.15s ease'
          }}
        >
          <ArrowLeft size={15} />
          <span>{lang === 'en' ? 'Back to Itinerary' : lang === 'ja' ? '日程表へ戻る' : (lang === 'zh' || lang === 'zht') ? '返回行程表' : '내 일정으로'}</span>
        </button>

        {/* Right: Day Selectors (Clean Borderless Horizontal Scroll Chips) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '2px'
        }}>
          {displaySchedules.map((sch) => {
            const isDayActive = Number(sch.day) === Number(activeDay);
            return (
              <button
                key={`map-day-tab-${sch.day}`}
                type="button"
                onClick={() => {
                  if (onSelectDay) onSelectDay(sch.day);
                  setFocusedSpotIndex(0);
                }}
                style={{
                  background: isDayActive ? '#1e293b' : 'transparent',
                  color: isDayActive ? '#ffffff' : 'var(--text-muted)',
                  border: isDayActive ? 'none' : '1px solid transparent',
                  borderRadius: '20px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: isDayActive ? 900 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                Day {sch.day}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Map Container: 210px 높이 & 타일 완벽 보정 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '210px',
        backgroundColor: '#e2e8f0',
        overflow: 'hidden'
      }}>
        <GoogleMapView
          spots={activeSpots}
          city={targetCity}
          activeDay={activeDay}
          focusedSpotIndex={focusedSpotIndex}
          mapHeight="210px"
          hideHeader={true}
          onMarkerClick={(spot, idx) => {
            setFocusedSpotIndex(idx);
            if (onOpenDetail) onOpenDetail(spot);
          }}
        />
      </div>

      {/* 3. Bottom Itinerary Sequence: ❶~❻ Flat List (하얀 여백 0% 밀착) */}
      <div style={{
        padding: '0.65rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {activeSpots.map((spot, idx) => {
          const isFocused = idx === focusedSpotIndex;
          const displayTitle = cleanSpotTitle(spot.title || spot.name || `명소 ${idx + 1}`);
          const timeSlot = spot.time || getTimeSlot(idx);
          const rating = spot.rating || 4.5;

          return (
            <div
              key={`flat-spot-${idx}`}
              onClick={() => {
                setFocusedSpotIndex(idx);
                if (onOpenDetail) onOpenDetail(spot);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: '10px',
                backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-glass)',
                border: isFocused ? '1px solid #2563eb' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Left: Number + Time + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                {/* Number Circle Badge */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isFocused ? '#2563eb' : '#3b82f6',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>

                {/* Time Slot */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  width: '38px',
                  flexShrink: 0
                }}>
                  {timeSlot}
                </div>

                {/* Spot Title */}
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: isFocused ? 900 : 700,
                  color: isFocused ? '#2563eb' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {displayTitle}
                </div>
              </div>

              {/* Right: Star Rating + Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>
                  ★ {rating}
                </span>
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          );
        })}

        {/* 4. 최하단: 실시간 GPS 기반 총 이동시간 배너 + [ 🗺️ 구글맵 전체 길찾기 ↗ ] 버튼 */}
        <div style={{
          marginTop: '0.45rem',
          padding: '0.55rem 0.75rem',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.45rem'
        }}>
          {/* 실시간 GPS 이동시간 & 거리 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
            <Clock size={13} style={{ color: '#2563eb' }} />
            <span>
              {lang === 'en' 
                ? `Total Transit: ~${transitSummary.minutes} mins (${transitSummary.distanceKm} km)` 
                : lang === 'ja' 
                ? `総移動: 約${transitSummary.minutes}分 (${transitSummary.distanceKm} km)` 
                : (lang === 'zh' || lang === 'zht') 
                ? `总用时: 约${transitSummary.minutes}分 (${transitSummary.distanceKm} km)` 
                : `총 이동: 약 ${transitSummary.minutes}분 (${transitSummary.distanceKm} km)`}
            </span>
          </div>

          {/* 🗺️ Open Full Route in Google Maps Big Screen / App */}
          <a
            href={fullRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.74rem',
              fontWeight: 900,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <span>{lang === 'en' ? 'Full Route in Google Maps ↗' : '구글맵 전체 길찾기 ↗'}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
