import React, { useState } from 'react';
import { Sparkles, Globe, Sun, Moon, Heart, CloudSun, Compass, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Header({
  lang = 'ko',
  onLanguageChange,
  themeMode = 'light',
  onToggleTheme,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenWeather,
  onOpenEssentials
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const LANGUAGES = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            color: '#ffffff'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                VORA
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-highlight)'
              }}>
                AI 3.0
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.brandTagline || 'Korea AI Travel Concierge'}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Weather Quick Shortcut */}
          <button
            onClick={onOpenWeather}
            title={t.navWeather || 'Weather'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <CloudSun size={17} style={{ color: 'var(--accent-primary)' }} />
            <span className="hide-mobile">{t.navWeather || '날씨'}</span>
          </button>

          {/* Travel Essentials Shortcut */}
          <button
            onClick={onOpenEssentials}
            title={t.navEssentials || 'Essentials'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Compass size={17} style={{ color: '#10b981' }} />
            <span className="hide-mobile">{t.navEssentials || '여행필수'}</span>
          </button>

          {/* Wishlist Button with Dynamic Counter Badge */}
          <button
            onClick={onOpenWishlist}
            title={t.navWishlist || 'Wishlist'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Heart size={17} style={{ color: wishlistCount > 0 ? '#ef4444' : 'var(--text-dim)', fill: wishlistCount > 0 ? '#ef4444' : 'none' }} />
            <span className="hide-mobile">{t.navWishlist || '위시리스트'}</span>
            {wishlistCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 900,
                borderRadius: '10px',
                padding: '0.1rem 0.4rem',
                marginLeft: '0.2rem'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 4-Language Universal Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>{currentLangObj.flag}</span>
              <span className="hide-mobile">{currentLangObj.label}</span>
              <Globe size={15} style={{ color: 'var(--text-dim)' }} />
            </button>

            {isLangOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.4rem',
                  minWidth: '130px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setIsLangOpen(false);
                    }}
                    style={{
                      background: lang === l.code ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: lang === l.code ? 'var(--accent-primary)' : 'var(--text-main)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.82rem',
                      fontWeight: lang === l.code ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={t.themeToggle || 'Toggle Theme'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {themeMode === 'dark' ? (
              <Sun size={18} style={{ color: '#f59e0b' }} />
            ) : (
              <Moon size={18} style={{ color: '#6366f1' }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
