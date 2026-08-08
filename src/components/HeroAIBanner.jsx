import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';

export default function HeroAIBanner({ onOpenItinerary, filters }) {
  const region = filters?.region || '전국';
  const theme = filters?.theme || '전체';

  const DYNAMIC_HEADLINES = [
    { target: '제주 힐링', emoji: '🏝️', desc: '해안도로 & 오션뷰 최적 동선' },
    { target: '서울 K-컬처', emoji: '🏯', desc: '고궁 & 핫플 카페 동선' },
    { target: '부산 해변 데이트', emoji: '🌊', desc: '해운대 & 야경 최적 동선' },
    { target: '경주 한옥 감성', emoji: '🍂', desc: '황리단길 & 야경 동선' },
    { target: '강원 힐링 산책', emoji: '🌲', desc: '속초·강릉 로컬 맛집 동선' }
  ];

  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (region !== '전국') return;
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % DYNAMIC_HEADLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [region]);

  const curHeadline = DYNAMIC_HEADLINES[headlineIndex];

  let displayTitle = '';
  if (region !== '전국' || theme !== '전체') {
    displayTitle = `'${region !== '전국' ? region : ''} ${theme !== '전체' ? theme : ''}' 맞춤 AI 코스`;
  } else {
    displayTitle = `'${curHeadline.target}' AI 추천 코스 ${curHeadline.emoji}`;
  }

  return (
    <div
      className="hero-ai-banner-container"
      style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(168, 85, 247, 0.14) 50%, rgba(236, 72, 153, 0.1) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1.25rem',
        margin: '0.75rem 0 1rem 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(168, 85, 247, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}
    >
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Left Content Area (Compact Inline Layout) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', flex: 1, minWidth: '260px' }}>
        {/* AI Engine Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          color: '#c084fc',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 800,
          whiteSpace: 'nowrap'
        }}>
          <Sparkles size={12} color="#c084fc" />
          <span>AI Travel Engine</span>
        </div>

        {/* Dynamic Title */}
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          whiteSpace: 'nowrap'
        }}>
          <span>✨ 3초 맞춤 설계:</span>
          <span key={headlineIndex} className="animate-fade-in" style={{ color: '#38bdf8', fontWeight: 900 }}>
            {displayTitle}
          </span>
        </div>

        {/* Quick Feature Chip */}
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
          background: 'rgba(15, 23, 42, 0.4)',
          padding: '0.15rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255,255,255,0.08)',
          whiteSpace: 'nowrap'
        }}>
          📍 동선/거리 100% 자동 계산
        </div>
      </div>

      {/* Right Action CTA Button */}
      <div style={{ flexShrink: 0 }}>
        <button
          className="hero-ai-cta-btn"
          onClick={onOpenItinerary}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #818cf8 50%, #c084fc 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 16px rgba(129, 140, 248, 0.35)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(129, 140, 248, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(129, 140, 248, 0.35)';
          }}
        >
          <Sparkles size={14} />
          <span>AI 코스 바로 생성하기</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
