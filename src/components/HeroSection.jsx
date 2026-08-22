import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function HeroSection({
  lang = 'ko',
  onSearch,
  isLoading = false,
  questionQuota = { remaining: 5, total: 5 }
}) {
  const [query, setQuery] = useState('');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
    setQuery('');
  };

  const handleChipClick = (promptText) => {
    onSearch(promptText);
  };

  return (
    <section style={{
      padding: '1rem 0.5rem 0.6rem 0.5rem',
      textAlign: 'center',
      position: 'relative',
      width: '100%',
      maxWidth: '880px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      margin: '0 auto'
    }}>
      {/* Sleek Compact Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
        <h1 style={{
          fontSize: 'clamp(1.25rem, 2.8vw, 1.75rem)',
          fontWeight: 900,
          margin: 0,
          color: 'var(--text-main)',
          letterSpacing: '-0.02em'
        }}>
          {t.heroTitle || '질문 하나로 완성되는 나만의 한국 여행'}
        </h1>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          margin: 0,
          fontWeight: 500
        }}>
          {t.heroSubtitle || 'Google Gemini 3.0 AI와 Google Places가 설계하는 초개인화 맞춤 코스 & 실시간 구글맵 연동'}
        </p>
      </div>

      {/* Free Question Quota Capsule Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.85rem'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          fontWeight: 800,
          padding: '0.2rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          backgroundColor: questionQuota?.remaining > 2 
            ? 'rgba(16, 185, 129, 0.1)' 
            : questionQuota?.remaining > 0 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
          color: questionQuota?.remaining > 2 
            ? '#059669' 
            : questionQuota?.remaining > 0 
              ? '#d97706' 
              : '#dc2626'
        }}>
          ⚡ {questionQuota?.remaining ?? 5}/{questionQuota?.total ?? 5}
        </span>
      </div>

      {/* Smart Prompt Input Box */}
      <form onSubmit={handleSubmit} style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        boxSizing: 'border-box',
        margin: '0 auto 0.6rem auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid var(--border-highlight)',
          borderRadius: 'var(--radius-full)',
          padding: '0.35rem 0.5rem 0.35rem 1.1rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'border-color var(--transition-fast)'
        }}>
          <Compass size={18} style={{ color: 'var(--accent-primary)', marginRight: '0.5rem', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder || '어떤 여행을 꿈꾸시나요? (예: 성수동 핫플 카페 2박3일, 제주도 바다뷰 힐링)'}
            disabled={isLoading}
            style={{
              minWidth: 0,
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.88rem',
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
              padding: '0.5rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: isLoading || !query.trim() ? 'default' : 'pointer',
              opacity: isLoading || !query.trim() ? 0.65 : 1,
              boxShadow: 'var(--shadow-glow)',
              transition: 'all var(--transition-fast)',
              flexShrink: 0
            }}
          >
            <span>{isLoading ? (lang === 'en' ? 'Designing...' : lang === 'ja' ? 'プラン作成中...' : (lang === 'zh' || lang === 'zht') ? '规划中...' : '설계중...') : (t.searchBtn || 'AI 코스 생성')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* Quick Prompt Recommendation Chips */}
      <div className="hero-chips-container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {(t.promptChips || []).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip.prompt)}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'all var(--transition-fast)',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}
