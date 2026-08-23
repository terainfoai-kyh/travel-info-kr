import React, { useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { generateGoogleMapsRouteUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * FullMapTab.jsx - 화면 4: 스마트 여행 동선 지도 탭 (하단 공백 0% & 구글맵 전체 길찾기 복원)
 * 
 * 1. 상단: [ ← 내 일정으로 ] 무테 버튼 + [ Day 1 ] [ Day 2 ] [ Day 3 ] 무테 슬림 칩
 * 2. 중앙: 하얀 공백 0% 완전 밀착 210px 동선 지도 (타일 로딩 100% 보정)
 * 3. 하단: ❶~❻ 플랫 동선 리스트 (지피티 4번 설계도 완벽 일치)
 * 4. 최하단: 🕒 총 이동시간: 약 40분 + [ 🗺️ 구글맵 전체 길찾기 ↗ ]
 * ==============================================================================
 */

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
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Back to Itinerary Button */}
        <button
          onClick={onBackToTrip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            fontSize: '0.82rem',
            fontWeight: 900,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} />
          <span>{lang === 'en' ? 'Back to Itinerary' : lang === 'ja' ? '日程に戻る' : (lang === 'zh' || lang === 'zht') ? '返回行程' : '내 일정으로'}</span>
        </button>

        {/* Day Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {displaySchedules.map((sch) => {
            const dayNum = Number(sch.day);
            const isActive = Number(activeDay) === dayNum;
            return (
              <button
                key={`fullmap-day-${dayNum}`}
                onClick={() => {
                  onSelectDay(dayNum);
                  setFocusedSpotIndex(0);
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#2563eb' : 'rgba(0, 0, 0, 0.05)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Day {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main High-Res Map View (하얀 공백 0% 완전 밀착 210px 지도) */}
      <div style={{ width: '100%', height: '210px', minHeight: '210px', position: 'relative', overflow: 'hidden' }}>
        <GoogleMapView
          spots={activeSpots}
          targetCity={targetCity}
          activeDay={activeDay}
          focusedSpotIndex={focusedSpotIndex}
          onSelectSpotIndex={(idx) => setFocusedSpotIndex(idx)}
          hideHeader={true}
          mapHeight="210px"
        />
      </div>

      {/* 3. 지피티 4번 사진 100% 일치: 테두리 없는 ❶~❻ 플랫 동선 리스트 */}
      <div style={{
        padding: '0.45rem 1rem 0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem'
      }}>
        {activeSpots.slice(0, 6).map((spot, idx) => {
          const timeSlot = getTimeSlot(idx);
          const cleanTitle = cleanSpotTitle(spot.title);
          const isFocused = focusedSpotIndex === idx;

          return (
            <div
              key={`map-spot-item-${idx}`}
              onClick={() => {
                setFocusedSpotIndex(idx);
                if (onOpenDetail) onOpenDetail(spot);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.45rem',
                borderRadius: '8px',
                backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                borderBottom: idx === Math.min(activeSpots.length, 6) - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.45)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isFocused) e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isFocused) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Left: Number Badge + Time + Landmark Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>

                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                  width: '42px',
                  flexShrink: 0
                }}>
                  {timeSlot}
                </span>

                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {cleanTitle}
                </span>
              </div>

              {/* Right: Star Rating & Chevron */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                {spot.rating && (
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b' }}>
                    ★ {spot.rating}
                  </span>
                )}
                <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
              </div>
            </div>
          );
        })}

        {/* 4. 최하단: 총 이동시간 배너 + [ 🗺️ 구글맵 전체 길찾기 ↗ ] 버튼 복원 */}
        <div style={{
          marginTop: '0.45rem',
          padding: '0.55rem 0.75rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
            <Clock size={13} style={{ color: '#0284c7' }} />
            <span>{lang === 'en' ? 'Total: ~40 mins' : lang === 'ja' ? '総移動: 約40分' : (lang === 'zh' || lang === 'zht') ? '总用时: 约40分' : '총 이동: 약 40분'}</span>
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
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.74rem',
              fontWeight: 900,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{lang === 'en' ? 'Google Maps Route' : lang === 'ja' ? 'Googleマップで開く' : (lang === 'zh' || lang === 'zht') ? '在Google地图中打开' : '구글맵 전체 길찾기'}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
