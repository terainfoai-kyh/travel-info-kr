import React from 'react';
import { Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function AIFloatingButton({ onOpenItinerary, lang = 'ko', themeMode = 'dark', hasCustomBar = false }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const isLight = themeMode === 'light';

  return (
    <div
      className={`ai-floating-btn-container ${hasCustomBar ? 'has-custom-bar' : ''}`}
      style={{
        position: 'fixed',
        bottom: hasCustomBar ? '5.5rem' : '2rem',
        right: '2rem',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.4rem',
        transition: 'bottom 0.3s ease'
      }}
    >
      {/* Tooltip Badge */}
      <div className="ai-floating-badge" style={{
        background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.92)',
        color: isLight ? '#0284c7' : '#38bdf8',
        border: isLight ? '1px solid rgba(2, 132, 199, 0.35)' : '1px solid rgba(56, 189, 248, 0.4)',
        backdropFilter: 'blur(10px)',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.73rem',
        fontWeight: 800,
        boxShadow: isLight ? '0 4px 16px rgba(2, 132, 199, 0.18)' : '0 4px 16px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        animation: 'bounce 2s infinite'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isLight ? '#0284c7' : '#38bdf8',
          display: 'inline-block'
        }} />
        <span>{t.aiFloatBadge || '3초 만에 1:1 맞춤 코스 완성!'}</span>
      </div>

      {/* Main Floating Action Button */}
      <button
        onClick={onOpenItinerary}
        className="ai-floating-main-btn"
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #818cf8 50%, #c084fc 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '0.85rem 1.35rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.9rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: isLight ? '0 6px 20px rgba(2, 132, 199, 0.35)' : '0 6px 24px rgba(129, 140, 248, 0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
          e.currentTarget.style.boxShadow = isLight ? '0 10px 26px rgba(2, 132, 199, 0.45)' : '0 10px 28px rgba(129, 140, 248, 0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = isLight ? '0 6px 20px rgba(2, 132, 199, 0.35)' : '0 6px 24px rgba(129, 140, 248, 0.5)';
        }}
        title="AI 여행 코스 플래너 열기"
      >
        <Sparkles size={18} className="animate-spin" style={{ animationDuration: '4s' }} />
        <span>{t.aiFloatBtn || 'AI 코스 추천'}</span>
      </button>
    </div>
  );
}
