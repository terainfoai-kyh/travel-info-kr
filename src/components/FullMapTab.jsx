import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Layers, ExternalLink } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * FullMapTab.jsx - 전체화면 스마트 여행 동선 지도 탭 (Full-Screen Smart Map Tab)
 * 
 * 1. 1~N일차 Day 필터 칩 (독립 스위칭)
 * 2. 번호 매겨진 동선 핀 (① 경복궁 ➔ ② 북촌 ➔ ③ 인사동)
 * 3. 터치 간섭 없는 시원한 풀스크린 지도 뷰
 * 4. 지도 하단 선택 장소 요약 카드 (클릭 시 세부 정보 연결)
 * ==============================================================================
 */

export default function FullMapTab({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'calc(100vh - 120px)',
      minHeight: '520px',
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Floating Day Switcher Header */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {targetCity} {activeDay}{lang === 'en' ? ' Day Route' : lang === 'ja' ? '日目ルート' : (lang === 'zh' || lang === 'zht') ? '日路线' : '일차 스마트 동선'}
          </h3>
        </div>

        {/* Day Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {displaySchedules.map((sch) => {
            const dayNum = Number(sch.day);
            const isActive = Number(activeDay) === dayNum;
            return (
              <button
                key={`map-day-${dayNum}`}
                onClick={() => {
                  onSelectDay(dayNum);
                  setFocusedSpotIndex(0);
                }}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '20px',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                Day {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full-Screen Map Container */}
      <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: '300px' }}>
        <GoogleMapView
          spots={activeSpots}
          targetCity={targetCity}
          activeDay={activeDay}
          focusedSpotIndex={focusedSpotIndex}
          onSelectSpotMarker={(idx) => setFocusedSpotIndex(idx)}
        />

        {/* Bottom Floating Spot Summary Card */}
        {activeSpots && activeSpots.length > 0 && activeSpots[focusedSpotIndex || 0] && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            zIndex: 1000,
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {(focusedSpotIndex || 0) + 1}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {activeSpots[focusedSpotIndex || 0]?.title}
                </h4>
                <p style={{
                  margin: '0.15rem 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {activeSpots[focusedSpotIndex || 0]?.addr1 || activeSpots[focusedSpotIndex || 0]?.description || targetCity}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenDetail(activeSpots[focusedSpotIndex || 0])}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{lang === 'en' ? 'Detail' : lang === 'ja' ? '詳細' : (lang === 'zh' || lang === 'zht') ? '详情' : '상세보기'}</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
