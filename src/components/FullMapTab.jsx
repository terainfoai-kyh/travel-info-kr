import React, { useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { generateGoogleMapsRouteUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * FullMapTab.jsx - 스마트 여행 동선 지도 탭 (155px 슬림 밀착 & [구글맵 ↗] 1줄 핏)
 * 
 * 1. 상단: [ ← 내 일정으로 ] 무테 버튼 + [ Day 1 ] [ Day 2 ] [ Day 3 ] 무테 슬림 칩
 * 2. 중앙: 하얀 공백 0% 완전 밀착 155px 슬림 동선 지도 (타일 로딩 100% 보정)
 * 3. 하단: ❶~❻ 플랫 동선 리스트 (지피티 4번 설계도 완벽 일치)
 * 4. 최하단: 🕒 총 이동시간 (GPS 실시간) + [ 구글맵 ↗ ] 슬림 1줄 나란히 배치
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

  const HOTEL_COORDS_MAP = {
    '해운대': { lat: 35.1587, lng: 129.1604 },
    '광안리': { lat: 35.1532, lng: 129.1186 },
    '서면': { lat: 35.1578, lng: 129.0594 },
    '남포동': { lat: 35.0975, lng: 129.0306 },
    '부산': { lat: 35.1587, lng: 129.1604 },
    '제주시내': { lat: 33.5060, lng: 126.5200 },
    '서귀포': { lat: 33.2480, lng: 126.4120 },
    '중문': { lat: 33.2480, lng: 126.4120 },
    '애월': { lat: 33.4650, lng: 126.3200 },
    '제주': { lat: 33.5060, lng: 126.5200 },
    '속초': { lat: 38.1920, lng: 128.6010 },
    '속초해변': { lat: 38.1920, lng: 128.6010 },
    '조양동': { lat: 38.1920, lng: 128.6010 },
    '양양': { lat: 38.0750, lng: 128.6250 },
    '홍대': { lat: 37.5563, lng: 126.9230 },
    '강남': { lat: 37.4979, lng: 127.0276 },
    '동대문': { lat: 37.5665, lng: 127.0092 },
    '명동': { lat: 37.5636, lng: 126.9827 },
    '서울': { lat: 37.5636, lng: 126.9827 },
    '경포대': { lat: 37.7950, lng: 128.8960 },
    '안목': { lat: 37.7715, lng: 128.9480 },
    '강릉': { lat: 37.7950, lng: 128.8960 },
    '황리단길': { lat: 35.8380, lng: 129.2100 },
    '경주': { lat: 35.8380, lng: 129.2100 },
    '행궁동': { lat: 37.2842, lng: 127.0142 },
    '수원': { lat: 37.2842, lng: 127.0142 },
    '여수': { lat: 34.7440, lng: 127.7370 },
    '돌산': { lat: 34.7200, lng: 127.7600 },
    '돌산/해양공원': { lat: 34.7350, lng: 127.7400 },
    '전주': { lat: 35.8150, lng: 127.1530 },
    '한옥마을': { lat: 35.8150, lng: 127.1530 },
    '거제': { lat: 34.8800, lng: 128.6200 },
    '바람의언덕': { lat: 34.7600, lng: 128.6600 },
    '통영': { lat: 34.8450, lng: 128.4250 },
    '포항': { lat: 36.0190, lng: 129.3430 },
    '영일대': { lat: 36.0550, lng: 129.3780 },
    '안동': { lat: 36.5680, lng: 128.7290 },
    '춘천': { lat: 37.8810, lng: 127.7290 },
    '가평': { lat: 37.8310, lng: 127.5090 },
    '대구': { lat: 35.8714, lng: 128.6014 },
    '대전': { lat: 36.3504, lng: 127.3845 },
    '광주': { lat: 35.1595, lng: 126.8526 },
    '인천': { lat: 37.4563, lng: 126.7052 },
    '송도': { lat: 37.3940, lng: 126.6390 }
  };

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const rawActiveSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));
  const activeSpots = rawActiveSpots.map(s => {
    if (s.category === '숙소/짐보관' || s.category === 'Hotel & Stay' || (s.title || s.name || '').includes('호텔')) {
      const matchKey = Object.keys(HOTEL_COORDS_MAP).find(k => (s.title || s.name || '').includes(k)) || targetCity;
      if (matchKey && HOTEL_COORDS_MAP[matchKey]) {
        return {
          ...s,
          lat: HOTEL_COORDS_MAP[matchKey].lat,
          lng: HOTEL_COORDS_MAP[matchKey].lng
        };
      }
    }
    return s;
  });

  const [focusedSpotIndex, setFocusedSpotIndex] = useState(0);

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  // 구글맵 1~6번 전체 노선 길찾기 URL 생성
  const fullRouteUrl = generateGoogleMapsRouteUrl(activeSpots);

  // 실시간 GPS 기반 총 이동시간 & 거리 계산
  const transitSummary = calculateTransitSummary(activeSpots);

  // 동적 시간대 배정 (스팟 개수, 체류 시간, 도착 시간에 따라 아침/오후/밤까지 자연스러운 스케일링)
  const getTimeSlot = (idx, totalCount = 5, dayNum = 1) => {
    const customSlot = itineraryData?.dayTimeSlots?.[dayNum];
    let startHour = 9;
    let endHour = 18;

    if (customSlot) {
      const match = customSlot.match(/(\d{1,2}):\d{2}\s*~\s*(\d{1,2}):\d{2}/);
      if (match) {
        startHour = parseInt(match[1], 10);
        endHour = parseInt(match[2], 10);
      }
    } else if (Number(dayNum) === 1 && itineraryData?.arrivalTime) {
      const match = itineraryData.arrivalTime.match(/^(\d{1,2})/);
      if (match) {
        startHour = parseInt(match[1], 10);
        endHour = startHour >= 13 ? 21 : 18;
      }
    }

    if (totalCount <= 1) return `${String(startHour).padStart(2, '0')}:00`;

    // 스팟 수에 맞춰 startHour부터 endHour까지 균등 배분 (10분 단위 라운딩)
    const totalMinutes = Math.max(60, (endHour - startHour) * 60);
    const intervalMinutes = Math.floor(totalMinutes / Math.max(1, totalCount - 1));
    const currentMinutes = startHour * 60 + idx * intervalMinutes;
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const roundedMinute = Math.round(minute / 10) * 10;
    const finalHour = roundedMinute === 60 ? hour + 1 : hour;
    const finalMinute = roundedMinute === 60 ? 0 : roundedMinute;

    return `${String(finalHour).padStart(2, '0')}:${String(finalMinute).padStart(2, '0')}`;
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

      {/* 2. Map Container: 260px 시원하고 여유로운 황금 비율 높이 (1번~마지막 마커 100% 안착) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '260px',
        minHeight: '260px',
        backgroundColor: '#e2e8f0',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        <GoogleMapView
          spots={activeSpots}
          city={targetCity}
          activeDay={activeDay}
          focusedSpotIndex={focusedSpotIndex}
          mapHeight="260px"
          hideHeader={true}
          onMarkerClick={(spot, idx) => {
            setFocusedSpotIndex(idx);
            if (onOpenDetail) onOpenDetail(spot);
          }}
        />
      </div>

      {/* 3. Bottom Itinerary Sequence: ❶~❻ Flat List (하얀 여백 0% 밀착) */}
      <div style={{
        padding: '0.45rem 0.85rem 0.65rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {activeSpots.map((spot, idx) => {
          const isFocused = idx === focusedSpotIndex;
          const displayTitle = cleanSpotTitle(spot.title || spot.name || `명소 ${idx + 1}`);
          const timeSlot = getTimeSlot(idx, activeSpots.length, activeDay);
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

        {/* 4. 최하단: 🗺️ [ 구글맵에서 오늘 코스 전체 길찾기 ↗ ] 와이드 풀버튼 */}
        <div style={{
          marginTop: '0.4rem'
        }}>
          <a
            href={fullRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              width: '100%',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 900,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>
              {lang === 'en' 
                ? '🗺️ Open Full Route in Google Maps ↗' 
                : lang === 'ja' 
                ? '🗺️ Googleマップで本日の全ルート案内 ↗' 
                : (lang === 'zh' || lang === 'zht') 
                ? '🗺️ 在Google地图中查看今日完整路线 ↗' 
                : '🗺️ 구글맵에서 오늘 코스 전체 길찾기 ↗'}
            </span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
