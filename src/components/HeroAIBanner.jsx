import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MapPin, Calendar, Compass, ShieldCheck, Flame } from 'lucide-react';

export default function HeroAIBanner({ onOpenItinerary, filters }) {
  const region = filters?.region || '전국';
  const theme = filters?.theme || '전체';

  // Animated headline cycling logic
  const DYNAMIC_HEADLINES = [
    { target: '제주 힐링', emoji: '🏝️', desc: '에메랄드빛 바다와 드라이브 해안도로 동선' },
    { target: '서울 K-컬처', emoji: '🏯', desc: '고궁 한복 체험부터 핫플 카페거리 동선' },
    { target: '부산 해변 데이트', emoji: '🌊', desc: '해운대 블루라인파크 & 광안대교 야경 동선' },
    { target: '경주 한옥 감성', emoji: '🍂', desc: '황리단길 감성 카페 & 동궁과 월지 야경 동선' },
    { target: '강원 힐링 산책', emoji: '🌲', desc: '속초·강릉 바다산책 & 로컬 맛집 동선' }
  ];

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(1842);

  // Cycle dynamic headline every 2.8 seconds if region is '전국'
  useEffect(() => {
    if (region !== '전국') return;
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % DYNAMIC_HEADLINES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [region]);

  // Subtle live counter bump effect
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setGeneratedCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 7000);
    return () => clearInterval(counterInterval);
  }, []);

  const curHeadline = DYNAMIC_HEADLINES[headlineIndex];

  // Title string logic
  let displayTitle = '';
  let displayEmoji = '🔮';
  let displaySubText = '한국관광공사 Official DB 및 실제 위도/경도 기반 거리 연동! 출발 시간대, 여행 일수(1~3일), 비 오는 날 실내 코스까지 맞춤 반영됩니다.';

  if (region !== '전국' || theme !== '전체') {
    displayTitle = `✨ AI가 3초 만에 설계하는 '${region !== '전국' ? region : ''} ${theme !== '전체' ? theme : ''}' 맞춤 코스`;
    displayEmoji = '✨';
  } else {
    displayTitle = `✨ AI가 3초 만에 설계하는 '${curHeadline.target}' 추천 코스 ${curHeadline.emoji}`;
    displaySubText = `${curHeadline.desc} · 한국관광공사 Official DB 최적 동선 자동 연동!`;
  }

  return (
    <div className="hero-ai-banner-container" style={{
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.14) 0%, rgba(168, 85, 247, 0.16) 45%, rgba(236, 72, 153, 0.12) 100%)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(168, 85, 247, 0.35)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.4rem 1.75rem',
      margin: '1.25rem 0 1.75rem 0',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 36px rgba(168, 85, 247, 0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.25rem',
      transition: 'all 0.3s ease-in-out'
    }}>
      {/* Dynamic Animated Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(10px)',
        animation: 'pulse 4s ease-in-out infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '20%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(12px)'
      }} />

      {/* Content Area */}
      <div style={{ flex: 1, minWidth: '280px', zIndex: 1 }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25))',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            color: 'var(--text-main)',
            padding: '0.2rem 0.7rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            fontWeight: 800
          }}>
            <Sparkles size={13} color="#c084fc" className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>Official AI Travel Engine</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#22c55e',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span>오늘 생성된 AI 코스: {generatedCount.toLocaleString()}건</span>
          </div>
        </div>

        {/* Dynamic Title */}
        <h2 key={headlineIndex} className="animate-fade-in" style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          margin: '0.25rem 0 0.45rem 0',
          lineHeight: 1.3,
          letterSpacing: '-0.02em'
        }}>
          {displayTitle}
        </h2>

        {/* Dynamic Subtext */}
        <p style={{
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          margin: '0 0 0.75rem 0',
          lineHeight: 1.5,
          maxWidth: '680px'
        }}>
          {displaySubText}
        </p>

        {/* Dynamic Interactive Tag Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--bg-secondary)',
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-highlight)',
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <MapPin size={11} /> {region !== '전국' ? region : '전국 17개 시도 지원'}
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-md)'
          }}>
            📅 1~3일 맞춤 일수
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-md)'
          }}>
            🌧️ 비 오면 실내 전환
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-md)'
          }}>
            🚗 이동시간/거리 100% 계산
          </span>
        </div>
      </div>

      {/* Action CTA Button */}
      <div style={{ zIndex: 1, flexShrink: 0, width: '100%' }}>
        <button
          className="hero-ai-cta-btn"
          onClick={onOpenItinerary}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #818cf8 50%, #c084fc 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.85rem 1.45rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 6px 24px rgba(129, 140, 248, 0.45)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(129, 140, 248, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(129, 140, 248, 0.45)';
          }}
        >
          <Sparkles size={18} className="animate-spin" style={{ animationDuration: '5s' }} />
          <span>🪄 AI 코스 지금 생성하기</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
