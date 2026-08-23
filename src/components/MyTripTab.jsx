import React, { useState } from 'react';
import { Calendar, Share2, Check, MapPin, Sparkles, Navigation, Info, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * MyTripTab.jsx - 화면 2: 내 여행 초간결 1줄 타임라인 (지피티 1번 사진 100% 일치)
 * 
 * 1. 상단: 여행 제목 (예: 서울 3일 여행 일정), [💾 저장], [🔗 공유]
 * 2. DAY 1 / DAY 2 / DAY 3 탭 바
 * 3. DAY 1 — 서울의 하루 (1줄 파란색 헤더)
 * 4. 09:00~18:30 6개 풀코스 1줄 타임라인 (테두리 박스 없는 0초 스크롤 뷰)
 * 5. 하단 듀얼 액션 바: [🗺️ 지도 보기] & [✨ 일정 수정]
 * ==============================================================================
 */

export default function MyTripTab({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  onGoToMap,
  onGoToModify
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [copied, setCopied] = useState(false);

  const schedules = itineraryData?.dailySchedules || [];
  const targetCity = itineraryData?.targetCity || '서울';
  const tripTitle = itineraryData?.title || `${targetCity} ${itineraryData?.days || 3}일 여행 일정`;

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const activeSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  // 🔗 일정 공유 링크 복사
  const handleShareTrip = () => {
    try {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 6개 표준 시간대 (09:00, 11:00, 13:00, 14:30, 16:30, 18:30)
  const getTimeSlot = (idx) => {
    const times = ['09:00', '11:00', '13:00', '14:30', '16:30', '18:30'];
    return times[idx % times.length];
  };

  // & 및 불필요한 결합 문자열 단일 명소로 정제
  const cleanSpotTitle = (rawTitle = '') => {
    if (!rawTitle) return '';
    return rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();
  };

  // 서브 타이틀에서 "1일차:", "2일차:" 같은 중복 접두사 제거
  const cleanDayTheme = (rawTheme = '') => {
    if (!rawTheme) return `${targetCity}의 하루`;
    return rawTheme.replace(/^\d+일차[:\s—-]*/, '').trim() || `${targetCity}의 하루`;
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
      {/* 1. Top Header: Title & Auto-Save / Share */}
      <div style={{
        padding: '0.75rem 1rem 0.65rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.4rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.15rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              padding: '0.1rem 0.45rem',
              borderRadius: '5px'
            }}>
              <CheckCircle2 size={11} />
              <span>{lang === 'en' ? 'Auto-Saved' : lang === 'ja' ? '自動保存済み' : (lang === 'zh' || lang === 'zht') ? '已自动保存' : '자동 저장됨'}</span>
            </span>
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            letterSpacing: '-0.01em'
          }}>
            {tripTitle}
          </h2>
        </div>

        {/* Action Button: [🔗 일정 공유] */}
        <button
          onClick={handleShareTrip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: copied ? '#10b981' : 'var(--bg-card)',
            color: copied ? '#ffffff' : 'var(--text-main)',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {copied ? <Check size={13} /> : <Share2 size={13} />}
          <span>
            {copied 
              ? (lang === 'en' ? 'Copied!' : lang === 'ja' ? 'コピー完了！' : (lang === 'zh' || lang === 'zht') ? '已复制！' : '링크 복사됨!')
              : (lang === 'en' ? 'Share' : lang === 'ja' ? '共有' : (lang === 'zh' || lang === 'zht') ? '分享' : '일정 공유')}
          </span>
        </button>
      </div>

      {/* 2. DAY 1 / DAY 2 / DAY 3 탭 바 */}
      <div style={{
        padding: '0.45rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {displaySchedules.map((ds) => {
          const dayNum = Number(ds.day);
          const isActive = Number(activeDay) === dayNum;
          return (
            <button
              key={`mytrip-day-${dayNum}`}
              onClick={() => onSelectDay(dayNum)}
              style={{
                flex: '0 0 auto',
                padding: '0.35rem 0.8rem',
                borderRadius: '9px',
                border: isActive ? '2px solid #2563eb' : '1px solid var(--border-color)',
                backgroundColor: isActive ? '#2563eb' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 3px 8px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              DAY {dayNum}
            </button>
          );
        })}
      </div>

      {/* 3. Day Subtitle (지피티 1번 사진 100% 일치: DAY 1 — 서울의 하루) */}
      <div style={{
        padding: '0.65rem 1.15rem 0.35rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '0.94rem',
          fontWeight: 900,
          color: '#2563eb',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          DAY {activeDay} — {cleanDayTheme(currentSchedule?.theme)}
        </h3>
      </div>

      {/* 4. 지피티 1번 사진 100% 일치: 6개 풀코스 1줄 타임라인 리스트 */}
      <div style={{
        padding: '0.2rem 1.15rem 0.65rem 1.15rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {activeSpots.slice(0, 6).map((spot, idx) => {
          const timeSlot = getTimeSlot(idx);
          const cleanTitle = cleanSpotTitle(spot.title);

          return (
            <div
              key={`flat-spot-${idx}`}
              onClick={() => onOpenDetail && onOpenDetail(spot)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.35rem',
                borderBottom: idx === Math.min(activeSpots.length, 6) - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Left: Time & Landmark Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                <span style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                  width: '45px',
                  flexShrink: 0
                }}>
                  {timeSlot}
                </span>

                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {cleanTitle}
                </span>
              </div>

              {/* Right: Star Rating */}
              {spot.rating && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#f59e0b',
                  flexShrink: 0
                }}>
                  ★ {spot.rating}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Dual Action Bar: [🗺️ 지도 보기] & [✨ 일정 수정] (지피티 1번 사진과 100% 일치) */}
      <div style={{
        padding: '0.75rem 1rem 1rem 1rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.55rem'
      }}>
        <button
          onClick={onGoToMap}
          style={{
            padding: '0.75rem 0.4rem',
            borderRadius: '12px',
            border: '1.5px solid #2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            fontSize: '0.86rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            transition: 'all 0.15s ease'
          }}
        >
          <MapPin size={15} />
          <span>{lang === 'en' ? 'View on Map' : lang === 'ja' ? '地図で確認' : (lang === 'zh' || lang === 'zht') ? '在地图中查看' : '지도 보기'}</span>
        </button>

        <button
          onClick={onGoToModify}
          style={{
            padding: '0.75rem 0.4rem',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={15} />
          <span>{lang === 'en' ? 'Modify Itinerary' : lang === 'ja' ? '日程を修正' : (lang === 'zh' || lang === 'zht') ? '调整修改行程' : '일정 수정'}</span>
        </button>
      </div>
    </div>
  );
}
