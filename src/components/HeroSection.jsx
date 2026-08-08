import React from 'react';
import { MapPin, Sparkles, Navigation } from 'lucide-react';

export default function HeroSection({ onSelectRegion }) {
  const popularKeywords = ['제주 성산일출봉', '서울 야경', '부산 해운대', '강원도 단풍', '전주 맛집'];

  return (
    <section style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      margin: '1.5rem 0',
      background: 'linear-gradient(130deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.85) 100%), url("/default-spot.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '4rem 2rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 1rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(56, 189, 248, 0.15)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: 'var(--accent-primary)',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '1rem'
      }}>
        <Sparkles size={16} />
        <span>2026 대한민국 핫플레이스 추천</span>
      </div>

      <h2 style={{
        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
        fontWeight: 800,
        lineHeight: 1.25,
        marginBottom: '1rem',
        maxWidth: '800px'
      }}>
        떠나보세요, <span className="gradient-text">당신만의 특별한 한국 여행</span>으로
      </h2>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1.05rem',
        maxWidth: '600px',
        marginBottom: '2rem'
      }}>
        전국 각지의 숨은 명소부터 최신 핫플레이스, 오션뷰 산책로와 전통 미식까지 모든 정보를 한곳에서 만나보세요.
      </p>

      {/* Recommended Keywords */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>인기 검색:</span>
        {popularKeywords.map((kw, i) => (
          <button
            key={i}
            onClick={() => onSelectRegion(kw)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.85rem',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            #{kw}
          </button>
        ))}
      </div>
    </section>
  );
}
