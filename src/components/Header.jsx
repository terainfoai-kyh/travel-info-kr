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
  onOpenEssentials,
  currentUser = null,
  onOpenGoogleAuth,
  onLogout
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
          <img
            src="/logo.png"
            alt="VORA Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-glow)',
              border: '1px solid var(--border-color)'
            }}
          />
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

          {/* Google Login / VIP User Profile */}
          {currentUser?.isGoogleLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid #f59e0b',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.75rem 0.35rem 0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
                }}
              >
                <img
                  src={currentUser.picture || '/default-spot.png'}
                  alt={currentUser.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="hide-mobile" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: '#f59e0b',
                  color: '#000000',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  fontWeight: 900
                }}>
                  VIP 15회
                </span>
              </button>

              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.6rem',
                  minWidth: '160px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.7rem' }}>{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    로그아웃 (비회원 전환)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hide-mobile">로그인</span>
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px'
              }}>
                15회
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
