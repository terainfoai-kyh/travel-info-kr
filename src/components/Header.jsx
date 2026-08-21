import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Globe, 
  Sun, 
  Moon, 
  Heart, 
  CloudSun, 
  Compass, 
  Download, 
  Share2, 
  Check, 
  Info, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { TRANSLATIONS, CITY_TRANSLATIONS } from '../i18n/translations';

// City Temperature Mapping for Dynamic Weather Capsule
const CITY_TEMPS = {
  '서울': '22°C',
  '부산': '24°C',
  '제주': '25°C',
  '수원': '21°C',
  '강릉': '21°C',
  '경주': '23°C',
  '전주': '23°C',
  '여수': '24°C',
  '창원': '23°C',
  '속초': '20°C',
  '인천': '22°C',
  '대구': '26°C'
};

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
  onLogout,
  targetCity = '서울',
  onOpenAbout,
  onOpenPrivacy,
  onOpenTerms
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const langMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mainMenuRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const LANGUAGES = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const currentTemp = CITY_TEMPS[targetCity] || '22°C';

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(e.target)) {
        setIsMainMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShareTrip = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
      setIsMainMenuOpen(false);
    }
  };

  const handleOpenPWA = () => {
    setIsMainMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
  };

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
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        {/* Left: Brand Logo & Tagline */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <img
            src="/logo.png"
            alt="VORA Logo"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-glow)',
              border: '1px solid var(--border-color)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                VORA
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.12rem 0.4rem',
                borderRadius: '5px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-highlight)'
              }}>
                AI 3.0
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }} className="hide-mobile">
              {t.brandTagline || 'Korea AI Travel Concierge'}
            </p>
          </div>
        </div>

        {/* Center / Navigation Links: Dynamic Weather Capsule & Essentials Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* ☀️ Smart Live Weather & Outfit Guide Capsule */}
          <button
            onClick={() => onOpenWeather && onOpenWeather(targetCity)}
            title="실시간 날씨 & 맞춤 여행 코디 가이드"
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid var(--border-highlight)',
              color: 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              padding: '0.42rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <CloudSun size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{(CITY_TRANSLATIONS[lang]?.[targetCity] || targetCity)} {currentTemp} · {lang === 'en' ? 'Style 👗' : '코디 👗'}</span>
          </button>

          {/* 🧭 Travel Essentials Header Shortcut */}
          <button
            onClick={() => {
              const el = document.getElementById('travel-essentials-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else if (onOpenEssentials) {
                onOpenEssentials();
              }
            }}
            title={t.navEssentials || '여행 필수정보'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.42rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            className="hide-mobile"
          >
            <Compass size={15} style={{ color: '#10b981' }} />
            <span>{t.navEssentials || '여행 필수정보'}</span>
          </button>
        </div>

        {/* Right: Key Controls & Hamburger Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Wishlist Button with Counter Badge */}
          <button
            onClick={onOpenWishlist}
            title={t.navWishlist || 'Wishlist'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Heart size={15} style={{ color: wishlistCount > 0 ? '#ef4444' : 'var(--text-dim)', fill: wishlistCount > 0 ? '#ef4444' : 'none' }} />
            <span className="hide-mobile">{t.navWishlist || '위시리스트'}</span>
            {wishlistCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 900,
                borderRadius: '10px',
                padding: '0.05rem 0.35rem',
                marginLeft: '0.15rem'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 4-Language Universal Switcher Dropdown */}
          <div ref={langMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>{currentLangObj.flag}</span>
              <span className="hide-mobile">{currentLangObj.label}</span>
              <ChevronDown size={12} style={{ opacity: 0.6 }} />
            </button>

            {isLangOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                padding: '0.4rem',
                minWidth: '130px',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setIsLangOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.45rem 0.7rem',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: lang === l.code ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: lang === l.code ? 'var(--accent-primary)' : 'var(--text-main)',
                      fontWeight: lang === l.code ? 800 : 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Google Login / VIP Profile Badge */}
          {currentUser?.isGoogleLoggedIn ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.12))',
                  border: '1px solid var(--border-highlight)',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem'
                  }}>
                    👑
                  </span>
                )}
                <span className="hide-mobile">{currentUser.name || (lang === 'en' ? 'VIP Member' : 'VIP 회원')}</span>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  padding: '0.08rem 0.35rem',
                  borderRadius: '4px'
                }}>
                  {lang === 'en' ? '15 Pro' : '15회'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.75rem',
                  minWidth: '200px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ padding: '0.2rem 0.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{
                      marginTop: '0.4rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.7rem',
                      color: 'var(--accent-primary)',
                      fontWeight: 800
                    }}>
                      <Sparkles size={11} />
                      <span>{lang === 'en' ? 'Google VIP Member (15 Daily)' : 'Google VIP 회원 (매일 15회)'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={13} />
                    <span>{lang === 'en' ? 'Log out' : '로그아웃'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              title={lang === 'en' ? 'Sign in with Google & get 15 free daily prompts' : 'Google 로그인하고 매일 15회 받기'}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hide-mobile">{lang === 'en' ? 'Sign in' : '로그인'}</span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                padding: '0.08rem 0.35rem',
                borderRadius: '4px'
              }}>
                {lang === 'en' ? '15 Free' : '15회'}
              </span>
            </button>
          )}

          {/* ☰ Sleek Universal Hamburger Menu Dropdown */}
          <div ref={mainMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
              title="전체 메뉴"
              style={{
                background: isMainMenuOpen ? 'var(--accent-primary)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: isMainMenuOpen ? '#ffffff' : 'var(--text-main)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {isMainMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {isMainMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                padding: '0.6rem',
                minWidth: '220px',
                zIndex: 250,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}>
                {/* 1. Live Weather & Styling Modal */}
                <button
                  onClick={() => {
                    setIsMainMenuOpen(false);
                    if (onOpenWeather) onOpenWeather(targetCity);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <CloudSun size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>{t.drawerWeatherGuide || '👗 실시간 날씨 & 여행 코디 가이드'}</span>
                </button>

                {/* 2. Travel Essentials Modal */}
                <button
                  onClick={() => {
                    setIsMainMenuOpen(false);
                    if (onOpenEssentials) onOpenEssentials();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Compass size={16} style={{ color: '#10b981' }} />
                  <span>{t.essentialsTitle || '외국인 여행 필수 툴킷'}</span>
                </button>

                {/* 3. Install PWA App */}
                <button
                  onClick={handleOpenPWA}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(37, 99, 235, 0.06)',
                    color: 'var(--accent-primary)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Download size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>{lang === 'en' ? 'Install Mobile App' : '모바일 홈화면 앱 설치'}</span>
                </button>

                {/* 4. Share Trip URL */}
                <button
                  onClick={handleShareTrip}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Share2 size={16} style={{ color: '#8b5cf6' }} />
                  <span>{lang === 'en' ? 'Share Travel Itinerary' : '내 여행 일정 공유하기'}</span>
                </button>

                {/* 5. Theme Toggle */}
                <button
                  onClick={() => {
                    if (onToggleTheme) onToggleTheme();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {themeMode === 'light' ? (
                      <Moon size={16} style={{ color: '#64748b' }} />
                    ) : (
                      <Sun size={16} style={{ color: '#f59e0b' }} />
                    )}
                    <span>{lang === 'en' ? (themeMode === 'light' ? 'Dark Mode' : 'Light Mode') : (themeMode === 'light' ? '다크 모드' : '라이트 모드')}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                    {themeMode === 'light' ? 'OFF' : 'ON'}
                  </span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.2rem 0' }} />

                {/* 6. About VORA */}
                <button
                  onClick={() => {
                    setIsMainMenuOpen(false);
                    if (onOpenAbout) onOpenAbout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Info size={14} />
                  <span>{t.aboutUs || '회사 및 서비스 소개'}</span>
                </button>

                {/* 7. Terms & Privacy Policy */}
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.2rem 0.75rem' }}>
                  <button
                    onClick={() => {
                      setIsMainMenuOpen(false);
                      if (onOpenPrivacy) onOpenPrivacy();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t.privacyPolicy || '개인정보처리방침'}
                  </button>
                  <span style={{ color: 'var(--border-color)', fontSize: '0.72rem' }}>|</span>
                  <button
                    onClick={() => {
                      setIsMainMenuOpen(false);
                      if (onOpenTerms) onOpenTerms();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t.termsOfService || '이용약관'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Share Toast Notification */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          border: '1px solid var(--accent-primary)',
          padding: '0.55rem 1.2rem',
          borderRadius: '999px',
          boxShadow: 'var(--shadow-glow)',
          zIndex: 10000,
          fontSize: '0.82rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}>
          <Check size={16} style={{ color: '#10b981' }} />
          <span>여행 공유 링크가 클립보드에 복사되었습니다! ✨</span>
        </div>
      )}
    </header>
  );
}
