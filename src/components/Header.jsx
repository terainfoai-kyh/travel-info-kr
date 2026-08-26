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
  ChevronDown,
  Thermometer
} from 'lucide-react';
import { TRANSLATIONS, CITY_TRANSLATIONS, getLocalizedCityName } from '../i18n/translations';
import { fetchRealtimeWeather } from '../services/weatherApi';

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
  onOpenTerms,
  onOpenAdminBatch
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [liveTemp, setLiveTemp] = useState('');
  const [liveFeelsLike, setLiveFeelsLike] = useState('');
  const [tickerStep, setTickerStep] = useState(0); // 0 = actual temp, 1 = feels-like temp

  const langMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mainMenuRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const LANGUAGES = [
    { code: 'ko', label: '한국어', short: 'KO', flag: '🇰🇷' },
    { code: 'en', label: 'English', short: 'EN', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', short: 'JA', flag: '🇯🇵' },
    { code: 'zh', label: '中文', short: 'ZH', flag: '🇨🇳' }
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // Live temperature & Feels-like sync
  useEffect(() => {
    let isMounted = true;
    if (targetCity) {
      fetchRealtimeWeather(targetCity)
        .then((data) => {
          if (isMounted) {
            const tVal = data?.temp || data?.temperature;
            const fVal = data?.feelsLike;
            if (tVal) setLiveTemp(tVal);
            if (fVal) setLiveFeelsLike(fVal);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [targetCity]);

  // Rolling 3.5s Ticker for Actual Temp <-> Feels-like Temp
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerStep(prev => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const currentTemp = liveTemp || CITY_TEMPS[targetCity] || '25°C';
  const currentFeelsLike = liveFeelsLike || `${(parseInt(currentTemp) || 25) + 3}°C`;
  const feelsLabel = lang === 'en' ? 'Feels' : lang === 'ja' ? '体感' : (lang === 'zh' || lang === 'zht') ? '体感' : '체감';
  const styleLabel = lang === 'en' ? 'Style 👗' : lang === 'ja' ? 'コーデ 👗' : (lang === 'zh' || lang === 'zht') ? '穿搭 👗' : '코디 👗';

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
      zIndex: 1000,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="header-inner-container">
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
          {/* ☀️ Smart Live Weather & Outfit Guide Capsule (3.5s Rolling Ticker) */}
          <button
            onClick={() => onOpenWeather && onOpenWeather(targetCity)}
            title="실시간 날씨 & 맞춤 여행 코디 가이드"
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid var(--border-highlight)',
              color: 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              padding: '0.32rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              overflow: 'hidden',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div key={tickerStep} className="header-weather-ticker-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {tickerStep === 0 ? (
                <>
                  <CloudSun size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span className="hide-mobile" style={{ whiteSpace: 'nowrap' }}>{getLocalizedCityName(targetCity, lang)} {currentTemp} · {styleLabel}</span>
                  <span className="show-mobile-only" style={{ whiteSpace: 'nowrap', fontWeight: 800 }}>{currentTemp} 👗</span>
                </>
              ) : (
                <>
                  <Thermometer size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span className="hide-mobile" style={{ whiteSpace: 'nowrap' }}>{getLocalizedCityName(targetCity, lang)} {feelsLabel} {currentFeelsLike} · {styleLabel}</span>
                  <span className="show-mobile-only" style={{ whiteSpace: 'nowrap', fontWeight: 800, color: 'var(--accent-primary)' }}>{feelsLabel} {currentFeelsLike} 👗</span>
                </>
              )}
            </div>
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

          {/* 📲 PWA App Install Header Shortcut (Desktop) */}
          <button
            onClick={handleOpenPWA}
            title={lang === 'en' ? 'Install App (PC & Mobile)' : lang === 'ja' ? 'アプリをインストール' : (lang === 'zh' || lang === 'zht') ? '安装应用程序' : '앱 설치하기'}
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
            className="hide-mobile"
          >
            <Download size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Install App' : lang === 'ja' ? 'アプリインストール' : (lang === 'zh' || lang === 'zht') ? '安装应用' : '앱 설치'}</span>
          </button>
        </div>

        {/* Right: Key Controls & Hamburger Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Wishlist Button with Counter Badge (Desktop Only, on Mobile it's in Hamburger) */}
          <button
            onClick={onOpenWishlist}
            title={t.navWishlist || 'Wishlist'}
            className="hide-mobile"
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
            <span>{t.navWishlist || '위시리스트'}</span>
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

          {/* 4-Language Universal Switcher Dropdown (Desktop) */}
          <div ref={langMenuRef} className="hide-mobile" style={{ position: 'relative' }}>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLangOpen(false);
                      onLanguageChange(l.code);
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

          {/* Google Login / VIP Profile Badge (Desktop Only) */}
          {currentUser?.isGoogleLoggedIn ? (
            <div ref={userMenuRef} className="hide-mobile" style={{ position: 'relative' }}>
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
                <span className="hide-mobile">{currentUser.name || (lang === 'en' ? 'VIP Member' : lang === 'ja' ? 'VIP会員' : (lang === 'zh' || lang === 'zht') ? 'VIP会员' : 'VIP 회원')}</span>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  padding: '0.08rem 0.35rem',
                  borderRadius: '4px'
                }}>
                  {lang === 'en' ? '15 Pro' : lang === 'ja' ? '15回' : (lang === 'zh' || lang === 'zht') ? '15次' : '15회'}
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
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  padding: '0.6rem',
                  minWidth: '200px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
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
                      <span>{lang === 'en' ? 'Google VIP Member (15 Daily)' : lang === 'ja' ? 'Google VIP会員 (毎日15回)' : (lang === 'zh' || lang === 'zht') ? 'Google VIP会员 (每日15次)' : 'Google VIP 회원 (매일 15회)'}</span>
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
                    <span>{lang === 'en' ? 'Log out' : lang === 'ja' ? 'ログアウト' : (lang === 'zh' || lang === 'zht') ? '退出登录' : '로그아웃'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              title={lang === 'en' ? 'Sign in with Google & get 15 free daily prompts' : lang === 'ja' ? 'Googleでログインして毎日15回無料' : (lang === 'zh' || lang === 'zht') ? '使用Google登录每天获取15次' : 'Google 로그인하고 매일 15회 받기'}
              className="hide-mobile"
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
              <span>{lang === 'en' ? 'Sign in' : lang === 'ja' ? 'ログイン' : (lang === 'zh' || lang === 'zht') ? '登录' : '로그인'}</span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                padding: '0.08rem 0.35rem',
                borderRadius: '4px'
              }}>
                {lang === 'en' ? '15 Free' : lang === 'ja' ? '15回無料' : (lang === 'zh' || lang === 'zht') ? '15次免费' : '15회'}
              </span>
            </button>
          )}

          {/* ☰ Sleek Universal Hamburger Menu Dropdown (ALWAYS visible on Mobile) */}
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
                position: 'relative',
                transition: 'all var(--transition-fast)'
              }}
            >
              {isMainMenuOpen ? <X size={17} /> : <Menu size={17} />}
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '2px solid var(--bg-card)'
                }} />
              )}
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
                padding: '0.65rem',
                minWidth: '240px',
                zIndex: 250,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                {/* 🌐 0. Mobile-Only ISO Language Switcher (KO, EN, JA, ZH) */}
                <div className="show-mobile-only" style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '0.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '0.2rem',
                  gap: '0.25rem',
                  boxSizing: 'border-box'
                }}>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setIsMainMenuOpen(false);
                        if (onLanguageChange) onLanguageChange(l.code);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0',
                        fontSize: '0.76rem',
                        fontWeight: lang === l.code ? 900 : 700,
                        backgroundColor: lang === l.code ? 'var(--accent-primary)' : 'transparent',
                        color: lang === l.code ? '#ffffff' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{l.short}</span>
                    </button>
                  ))}
                </div>

                {/* ❤️ 1. Wishlist Modal Item (Mobile Only) */}
                <button
                  className="show-mobile-only"
                  onClick={() => {
                    setIsMainMenuOpen(false);
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: wishlistCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Heart size={16} style={{ color: '#ef4444', fill: wishlistCount > 0 ? '#ef4444' : 'none' }} />
                    <span>{t.navWishlist || '내 여행 위시리스트'}</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px'
                    }}>
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* 🔑 2. Google Login or User Account Card (Mobile Only) */}
                {currentUser?.isGoogleLoggedIn ? (
                  <div className="show-mobile-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(37, 99, 235, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="user" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      ) : (
                        <span>👑</span>
                      )}
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>{currentUser.name || 'Google VIP'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMainMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {lang === 'en' ? 'Logout' : '로그아웃'}
                    </button>
                  </div>
                ) : (
                  <button
                    className="show-mobile-only"
                    onClick={() => {
                      setIsMainMenuOpen(false);
                      if (onOpenGoogleAuth) onOpenGoogleAuth();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      border: '1px solid rgba(66, 133, 244, 0.3)',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>{lang === 'en' ? 'Sign in with Google' : lang === 'ja' ? 'Googleでログイン' : (lang === 'zh' || lang === 'zht') ? 'Google登录' : 'Google 계정 로그인'}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', backgroundColor: '#2563eb', color: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {lang === 'en' ? '15/day' : lang === 'ja' ? '15回' : (lang === 'zh' || lang === 'zht') ? '15次' : '15회'}
                    </span>
                  </button>
                )}

                {/* 3. Live Weather & Styling Modal */}
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
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    color: 'var(--accent-primary)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Download size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>{lang === 'en' ? 'Install VORA App' : lang === 'ja' ? 'VORA アプリをインストール' : (lang === 'zh' || lang === 'zht') ? '安装 VORA 应用' : 'VORA 전용 앱 설치하기'}</span>
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '6px',
                    fontWeight: 900
                  }}>
                    NEW
                  </span>
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
                  <span>{lang === 'en' ? 'Share Travel Itinerary' : lang === 'ja' ? '旅行プランを共有' : (lang === 'zh' || lang === 'zht') ? '分享旅行行程' : '내 여행 일정 공유하기'}</span>
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
                    <span>
                      {themeMode === 'light' 
                        ? (lang === 'en' ? 'Dark Mode' : lang === 'ja' ? 'ダークモード' : (lang === 'zh' || lang === 'zht') ? '深色模式' : '다크 모드')
                        : (lang === 'en' ? 'Light Mode' : lang === 'ja' ? 'ライトモード' : (lang === 'zh' || lang === 'zht') ? '浅色模式' : '라이트 모드')}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                    {themeMode === 'light' ? 'OFF' : 'ON'}
                  </span>
                </button>

                {/* 🔒 99. SUPER ADMIN ONLY: Batch Knowledge Center */}
                {(currentUser?.email === 'titkyh@gmail.com' || currentUser?.email === 'terainfoai@gmail.com' || currentUser?.isAdmin || (typeof window !== 'undefined' && localStorage.getItem('vora_admin_mode') === 'true')) && (
                  <button
                    onClick={() => {
                      setIsMainMenuOpen(false);
                      if (onOpenAdminBatch) onOpenAdminBatch();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1))',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                      <span>⚡ VORA AI 배치 지식 학습</span>
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '6px',
                      fontWeight: 900
                    }}>
                      ADMIN
                    </span>
                  </button>
                )}

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
                  <span>{t.aboutUs || (lang === 'en' ? 'About VORA AI' : lang === 'ja' ? 'VORA AIについて' : (lang === 'zh' || lang === 'zht') ? '关于 VORA AI' : '회사 및 서비스 소개')}</span>
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
                    {t.privacyPolicy || (lang === 'en' ? 'Privacy Policy' : lang === 'ja' ? 'プライバシーポリシー' : (lang === 'zh' || lang === 'zht') ? '隐私政策' : '개인정보처리방침')}
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
                    {t.termsOfService || (lang === 'en' ? 'Terms of Service' : lang === 'ja' ? '利用規約' : (lang === 'zh' || lang === 'zht') ? '服务条款' : '이용약관')}
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
          <span>{lang === 'en' ? 'Travel share link copied to clipboard! ✨' : lang === 'ja' ? '旅行の共有リンクがコピーされました！✨' : (lang === 'zh' || lang === 'zht') ? '行程分享链接已复制到剪贴板！✨' : '여행 공유 링크가 클립보드에 복사되었습니다! ✨'}</span>
        </div>
      )}
    </header>
  );
}
