import React from 'react';
import { Compass, Globe, Sparkles, Sun, Moon, Heart } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Header({ currentLang, setLang, filters, themeMode, setThemeMode, wishlistCount = 0, onOpenWishlist, onOpenItinerary }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  // Helper function to translate badges safely inside header
  const getBadgeI18n = (type, value) => {
    if (!value) return '';
    const curLang = currentLang || 'ko';
    if (type === 'region') return TRANSLATIONS[curLang]?.regions?.[value] || value;
    if (type === 'theme') return TRANSLATIONS[curLang]?.themes?.[value] || value;
    if (type === 'gender') return TRANSLATIONS[curLang]?.genders?.[value] || value;
    if (type === 'age') return TRANSLATIONS[curLang]?.ages?.[value] || value;
    if (type === 'apiService') return TRANSLATIONS[curLang]?.apiServices?.[value] || value;
    return value;
  };

  return (
    <header className="glass-panel app-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Brand Title */}
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="header-logo" style={{
          width: '52px',
          height: '52px',
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
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }} className="gradient-text header-title">
            {t.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <p className="header-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0, marginRight: '0.25rem' }}>
              {t.subtitle}
            </p>
            {filters && (
              <div className="desktop-only-badges" style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  📍 {getBadgeI18n('region', filters.region || '전국')}
                </span>
                <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontWeight: 600 }}>
                  🏖️ {getBadgeI18n('theme', filters.theme || '전체')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: AI Itinerary & Wishlist & Theme & Language */}
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* AI Itinerary Button */}
        <button
          onClick={onOpenItinerary}
          style={{
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            border: 'none',
            padding: '0.42rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          title="AI 스마트 1일~3일 코스 추천"
        >
          <Sparkles size={15} />
          <span className="desktop-btn-text">AI 코스 추천</span>
        </button>

        {/* Wishlist Drawer Button */}
        <button
          onClick={onOpenWishlist}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '0.42rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            position: 'relative',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          title="찜한 여행지 목록 보기"
        >
          <Heart size={16} fill={wishlistCount > 0 ? "#ef4444" : "none"} color={wishlistCount > 0 ? "#ef4444" : "currentColor"} />
          <span className="desktop-btn-text">찜목록</span>
          {wishlistCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          className="header-theme-btn"
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            flexShrink: 0
          }}
          title={themeMode === 'dark' ? (currentLang === 'en' ? 'Switch to Light Mode' : '라이트 모드로 변경') : (currentLang === 'en' ? 'Switch to Dark Mode' : '다크 모드로 변경')}
        >
          {themeMode === 'dark' ? (
            <Sun size={17} color="#f59e0b" />
          ) : (
            <Moon size={17} color="#38bdf8" />
          )}
        </button>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={18} color="var(--accent-primary)" />
          <select
            className="header-lang-select"
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
            <option value="de">{t.langDe}</option>
            <option value="fr">{t.langFr}</option>
            <option value="es">{t.langEs}</option>
            <option value="ru">{t.langRu}</option>
          </select>
        </div>
      </div>
    </header>
  );
}
