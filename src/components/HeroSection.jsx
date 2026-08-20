import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function HeroSection({
  lang = 'ko',
  onSearch,
  isLoading = false
}) {
  const [query, setQuery] = useState('');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const handleChipClick = (promptText) => {
    setQuery(promptText);
    onSearch(promptText);
  };

  return (
    <section style={{
      padding: '1.5rem 1rem 1.1rem 1rem',
      textAlign: 'center',
      position: 'relative',
      maxWidth: '920px',
      margin: '0 auto'
    }}>
      {/* Top Value Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        border: '1px solid var(--border-highlight)',
        color: 'var(--accent-primary)',
        fontSize: '0.8rem',
        fontWeight: 800,
        marginBottom: '0.85rem'
      }}>
        <Sparkles size={15} />
        <span>{t.heroBadge || '✨ 2026 AI-Powered Korea Travel Concierge'}</span>
      </div>

      {/* Main Hero Heading */}
      <h1 style={{
        fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
        fontWeight: 900,
        lineHeight: 1.25,
        letterSpacing: '-0.03em',
        margin: '0 0 0.6rem 0',
        color: 'var(--text-main)'
      }}>
        {t.heroTitle || '질문 하나로 완성되는 나만의 한국 여행'}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        margin: '0 auto 1.25rem auto',
        maxWidth: '680px',
        fontWeight: 500
      }}>
        {t.heroSubtitle || '한국관광공사 Official DB와 Gemini AI가 설계하는 초개인화 맞춤 코스 & 실시간 구글맵 연동'}
      </p>

      {/* Smart Prompt Input Box */}
      <form onSubmit={handleSubmit} style={{
        position: 'relative',
        maxWidth: '740px',
        margin: '0 auto 1.5rem auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--border-highlight)',
          borderRadius: 'var(--radius-full)',
          padding: '0.45rem 0.6rem 0.45rem 1.4rem',
          boxShadow: 'var(--shadow-md)',
          transition: 'border-color var(--transition-fast)'
        }}>
          <Compass size={22} style={{ color: 'var(--accent-primary)', marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder || '어떤 여행을 꿈꾸시나요? (예: 성수동 핫플 카페 2박3일, 제주도 바다뷰 힐링)'}
            disabled={isLoading}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-main)'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.7rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !query.trim() ? 0.6 : 1,
              transition: 'all var(--transition-fast)',
              flexShrink: 0
            }}
          >
            <span>{isLoading ? '...' : (t.searchBtn || 'AI 코스 생성')}</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </form>

      {/* Popular Quick Prompt Chips */}
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          marginBottom: '0.6rem'
        }}>
          <Flame size={15} style={{ color: '#f59e0b' }} />
          <span>{t.promptChipsTitle || '🔥 인기 추천 프롬프트'}</span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {(t.promptChips || []).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.prompt)}
              disabled={isLoading}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
