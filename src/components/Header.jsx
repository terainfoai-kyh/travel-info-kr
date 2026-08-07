import React from 'react';
import { Compass, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Header({ currentLang, setLang, filters, themeMode, setThemeMode }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '58px',
          height: '58px',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(56, 189, 248, 0.4)',
          border: '2px solid rgba(56, 189, 248, 0.6)',
          background: '#ffffff',
          flexShrink: 0,
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}>
          <img src="/logo.png" alt="K-Travel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.1 }} className="gradient-text">
            {t.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
              {t.subtitle}
            </p>
            {filters && (
              <span style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: 'var(--accent-primary)',
                fontSize: '0.72rem',
                padding: '0.15rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Sparkles size={12} />
                [{t.filterSummary}: {filters.startDate} ~ {filters.endDate || filters.startDate} | {t.regions?.[filters.region] || filters.region} | {t.themes?.[filters.theme] || filters.theme} | {t.genders?.[filters.gender] || filters.gender} | {t.ages?.[filters.age] || filters.age}{filters.keyword ? ` | ${t.keywordLabel}: ${filters.keyword}` : ''}]
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Theme Toggle & Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          title={themeMode === 'dark' ? (currentLang === 'en' ? 'Switch to Light Mode' : '라이트 모드로 변경') : (currentLang === 'en' ? 'Switch to Dark Mode' : '다크 모드로 변경')}
        >
          {themeMode === 'dark' ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Moon size={18} color="#38bdf8" />
          )}
        </button>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={18} color="var(--accent-primary)" />
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.45rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ko">{t.langKo}</option>
            <option value="en">{t.langEn}</option>
            <option value="ja">{t.langJa}</option>
            <option value="zh">{t.langZh}</option>
            <option value="zht">{t.langZht}</option>
            <option value="de">{t.langDe || 'Deutsch (DE)'}</option>
            <option value="fr">{t.langFr || 'Français (FR)'}</option>
            <option value="es">{t.langEs || 'Español (ES)'}</option>
            <option value="ru">{t.langRu || 'Русский (RU)'}</option>
          </select>
        </div>
      </div>
    </header>
  );
}
