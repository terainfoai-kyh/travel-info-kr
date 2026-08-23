import React, { useState } from 'react';
import { Sun, CloudRain, Navigation, MapPin, Coffee, Utensils, Umbrella, Camera, ExternalLink, Info, Sparkles, Clock } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';

/**
 * ==============================================================================
 * LiveTripTab.jsx - 화면 5: 여행 중 모바일 실시간 모드 ("지금 뭐하지?")
 * 
 * 1. 실시간 현지 날씨 & 기온 카드 (오늘의 날씨)
 * 2. '다음 일정' 안내 카드 (예: 성수동 카페거리 - 도보 8분, [길찾기] [자세히])
 * 3. '지금 뭐하지?' 실시간 주변 퀵 추천 버튼 (주변 카페, 인기 맛집, 실내 핫플)
 * ==============================================================================
 */

export default function LiveTripTab({
  lang = 'ko',
  targetCity = '서울',
  currentSpot = null,
  nextSpot = null,
  onOpenDetail,
  onQuickNearbySearch
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const activeNext = nextSpot || {
    title: `${targetCity} 성수동 카페거리`,
    addr1: `${targetCity} 성동구 성수동`,
    description: '트렌디한 카페와 감성적인 팝업스토어가 가득한 서울의 대표 핫플레이스',
    rating: 4.8,
    transitTime: '도보 8분'
  };

  const NEARBY_ACTIONS = [
    { id: 'cafe', label: lang === 'en' ? 'Nearby Cafes' : lang === 'ja' ? '周辺カフェ' : (lang === 'zh' || lang === 'zht') ? '周边特色咖啡' : '☕ 주변 감성 카페', query: `${targetCity} 주변 감성 카페`, icon: Coffee, color: '#f59e0b' },
    { id: 'food', label: lang === 'en' ? 'Popular Food' : lang === 'ja' ? '人気グルメ' : (lang === 'zh' || lang === 'zht') ? '热门必吃美食' : '🍣 현지인 인기 맛집', query: `${targetCity} 현지인 맛집`, icon: Utensils, color: '#ef4444' },
    { id: 'rain', label: lang === 'en' ? 'Indoor Spots' : lang === 'ja' ? '屋内スポット' : (lang === 'zh' || lang === 'zht') ? '室内精选景点' : '☔ 비 올 때 실내 핫플', query: `${targetCity} 실내 미술관 박물관 몰`, icon: Umbrella, color: '#818cf8' },
    { id: 'photo', label: lang === 'en' ? 'Photo Spots' : lang === 'ja' ? 'フォトスポット' : (lang === 'zh' || lang === 'zht') ? '绝美拍照打卡点' : '📸 인생샷 포토존', query: `${targetCity} 인생샷 포토존 야경`, icon: Camera, color: '#ec4899' }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      paddingBottom: '2rem'
    }}>
      {/* 1. Realtime Weather & Status Header */}
      <div style={{
        backgroundColor: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
        borderRadius: '24px',
        padding: '1.25rem 1.4rem',
        color: '#ffffff',
        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '0.35rem'
          }}>
            📍 {targetCity} • Live Concierge
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
            {lang === 'en' ? 'Enjoying Your Trip?' : '즐거운 한국 여행 중이신가요? 😊'}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
            맑음 24°C • 나들이하기 아주 좋은 날씨
          </p>
        </div>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sun size={28} style={{ color: '#fef08a' }} />
        </div>
      </div>

      {/* 2. 'Next Destination' Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1.5px solid var(--border-highlight)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Navigation size={12} />
            <span>{lang === 'en' ? 'Next Destination' : '다음 일정'}</span>
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
            🕒 {activeNext.transitTime || '도보 8분'}
          </span>
        </div>

        <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
          {activeNext.title}
        </h4>
        <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {activeNext.description || activeNext.addr1}
        </p>

        {/* Dual Actions: [🗺️ 길찾기] & [ℹ️ 자세히] */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <a
            href={getGooglePlaceSearchUrl(activeNext.title, targetCity)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.6rem',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Navigation size={14} />
            <span>{lang === 'en' ? 'Get Directions' : '길찾기'}</span>
          </a>

          <button
            onClick={() => onOpenDetail && onOpenDetail(activeNext)}
            style={{
              padding: '0.6rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Info size={14} style={{ color: '#2563eb' }} />
            <span>{lang === 'en' ? 'Spot Details' : '상세보기'}</span>
          </button>
        </div>
      </div>

      {/* 3. 'What to do right now?' (지금 뭐하지?) Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Sparkles size={16} style={{ color: '#2563eb' }} />
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {lang === 'en' ? 'What to do right now?' : '지금 뭐하지? (주변 실시간 탐색)'}
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
          {NEARBY_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onQuickNearbySearch && onQuickNearbySearch(action.query)}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Icon size={16} style={{ color: action.color, flexShrink: 0 }} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
