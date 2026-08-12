import React, { useState, useEffect } from 'react';
import { Compass, Globe, Sparkles, Sun, Moon, Heart, MapPin, Utensils, Luggage, Share2, Check, BookOpen, ChevronDown, ChevronUp, SlidersHorizontal, Download } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어 (KO)' },
  { value: 'en', label: 'English (EN)' },
  { value: 'ja', label: '日本語 (JA)' },
  { value: 'zh', label: '简体中文 (ZH-CN)' },
  { value: 'zht', label: '繁體中文 (ZH-TW)' },
  { value: 'de', label: 'Deutsch (DE)' },
  { value: 'fr', label: 'Français (FR)' },
  { value: 'es', label: 'Español (ES)' },
  { value: 'ru', label: 'Русский (RU)' }
];

export default function Header({ currentLang, setLang, filters, themeMode, setThemeMode, wishlistCount = 0, onOpenWishlist, onOpenItinerary, onOpenGuidePR }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;
  const [activeSection, setActiveSection] = useState('tour-spots');
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShare = async () => {
    try {
      const params = new URLSearchParams();
      if (filters?.region) params.set('region', filters.region);
      if (filters?.theme) params.set('theme', filters.theme);
      if (filters?.gender && filters.gender !== '무관') params.set('gender', filters.gender);
      if (filters?.age && filters.age !== '전체') params.set('age', filters.age);
      if (filters?.keyword) params.set('keyword', filters.keyword);

      const queryString = params.toString();
      const shareUrl = queryString 
        ? `${window.location.origin}${window.location.pathname}?${queryString}`
        : `${window.location.origin}${window.location.pathname}`;
      
      const regionName = getBadgeI18n('region', filters?.region || '서울');
      const themeName = getBadgeI18n('theme', filters?.theme || '전체');
      const shareTitle = `K-Travel AI | 대한민국 스마트 여행 가이드`;
      const shareText = `✈️ AI 맞춤 [${regionName} / ${themeName}] 여행 가이드! ☀️ 실시간 날씨 & 추천 코스:`;

      // Try Native Web Share API ONLY on mobile devices (prevents Windows Desktop Chrome hangs)
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice && navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: `${shareText}\n${shareUrl}`,
            url: shareUrl
          });
          return;
        } catch (shareErr) {
          // If share sheet closed by user, fall through to clipboard fallback
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2800);
        }).catch(() => fallbackCopyText(`${shareText}\n${shareUrl}`));
      } else {
        fallbackCopyText(`${shareText}\n${shareUrl}`);
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2800);
    } catch (err) {
      alert(text);
    }
    document.body.removeChild(textArea);
  };

  const NAV_ITEMS = [
    { id: 'tour-spots', label: t.navSpots || '추천 명소', icon: Compass },
    { id: 'travel-essentials', label: t.navEssentials || '여행 필수템', icon: Luggage },
    { id: 'weather-info', label: t.navWeather || '실시간 날씨', icon: Sun },
    { id: 'ai-lifestyle', label: t.navLifestyle || 'AI 맛집 & 코디', icon: Utensils },
    { id: 'google-map', label: t.navMap || '구글 지도', icon: MapPin }
  ];

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

  // Scrollspy logic to highlight current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const elem = document.getElementById(NAV_ITEMS[i].id);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [NAV_ITEMS]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    if (id === 'tour-spots') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const headerEl = document.querySelector('header') || document.querySelector('.app-header');
      const hHeight = headerEl ? headerEl.getBoundingClientRect().height : (window.innerWidth <= 768 ? 90 : 140);
      const yOffset = -(hHeight + 85);
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      padding: isMobile ? '0.45rem 0.6rem' : '0.65rem 1rem',
      boxSizing: 'border-box',
      borderBottom: themeMode === 'light' ? '1.5px solid #cbd5e1' : '1px solid var(--border-color)',
      background: themeMode === 'light' ? '#e2e8f0' : 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0.3rem' : '0.45rem',
        boxSizing: 'border-box'
      }}>
        {/* Row 1: Brand Logo + Title + LIVE AI (Left) & Menu Toggle Button (Far Right Only) */}
        <div className="header-brand-row" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'nowrap',
          width: '100%'
        }}>
          {/* Left Brand Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 1, minWidth: 0, whiteSpace: 'nowrap' }}>
            <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
              width: isMobile ? '34px' : '40px',
              height: isMobile ? '34px' : '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
              border: '1.5px solid rgba(147, 197, 253, 0.4)',
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              flexShrink: 0,
              cursor: 'pointer'
            }}>
              <Sparkles size={isMobile ? 18 : 22} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span style={{
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: themeMode === 'light' ? '#0f172a' : '#f8fafc',
                textTransform: 'uppercase'
              }}>
                TripK
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.12rem 0.45rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                color: '#ffffff',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                flexShrink: 0
              }}>
                AI
              </span>
            </div>
              {!isMobile && (
                <span style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}>
                  <span className="live-ai-pulse-dot" />
                  LIVE AI
                </span>
              )}
            </div>

          {/* Right Container: Compact Language Selector & Menu Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, zIndex: 10 }}>
            {/* Desktop-Only App Install Badge Button (Hidden on Mobile to Prevent Overlapping) */}
            {!isMobile && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
                }}
                style={{
                  background: themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)',
                  color: themeMode === 'light' ? '#0284c7' : '#38bdf8',
                  border: themeMode === 'light' ? '1.5px solid #0284c7' : '1.5px solid rgba(56, 189, 248, 0.5)',
                  padding: '0.3rem 0.55rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 1px 4px rgba(56, 189, 248, 0.2)',
                  whiteSpace: 'nowrap'
                }}
                title={t.installAppBtn || '💻 앱 설치'}
              >
                <Download size={13} />
                <span>{t.installAppBtn || '💻 앱 설치'}</span>
              </button>
            )}

            {/* 100% Always-Visible Language Selector in Row 1 Header */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', position: 'relative' }}>
              <Globe size={14} style={{ color: themeMode === 'light' ? '#0284c7' : '#38bdf8', flexShrink: 0 }} />
              <select 
                value={currentLang} 
                onChange={(e) => setLang(e.target.value)} 
                className="header-lang-select" 
                style={{ 
                  background: themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)', 
                  color: themeMode === 'light' ? '#0f172a' : '#ffffff', 
                  border: themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.25)', 
                  padding: '0.3rem 0.45rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.76rem', 
                  fontWeight: 800, 
                  cursor: 'pointer', 
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  maxWidth: isMobile ? '85px' : '140px'
                }}
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: themeMode === 'light' ? '#ffffff' : '#1e293b', color: themeMode === 'light' ? '#0f172a' : '#ffffff' }}>
                    {isMobile ? opt.value.toUpperCase() : opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              style={{
                background: isMenuOpen 
                  ? 'var(--accent-gradient)' 
                  : (themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)'),
                color: isMenuOpen ? '#ffffff' : (themeMode === 'light' ? '#0f172a' : '#ffffff'),
                border: isMenuOpen 
                  ? 'none' 
                  : (themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.25)'),
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: isMenuOpen ? '0 2px 8px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              title={isMenuOpen ? (t.closeMenu || '메뉴 닫기') : (t.openMenu || '메뉴')}
            >
              <SlidersHorizontal size={14} />
              <span>{isMenuOpen ? (t.closeMenu || '메뉴 닫기') : (t.openMenu || '메뉴')}</span>
              {isMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Row 2: Collapsible Menu Bar (Guide, Share, Wishlist, DarkMode inside) */}
        <div style={{
          maxHeight: isMenuOpen ? '250px' : '0px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isMenuOpen ? 1 : 0,
          margin: isMenuOpen ? '0.25rem 0 0 0' : '0',
          paddingBottom: isMenuOpen ? '0.25rem' : '0'
        }}>
          <div className="header-controls" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '0.5rem',
            flexWrap: 'wrap',
            width: '100%',
            padding: '0.45rem 0.65rem',
            background: themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            borderRadius: 'var(--radius-md)',
            border: themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)',
            boxSizing: 'border-box'
          }}>
            {/* Mobile-Only App Install Button in Slide Menu (Prevents Desktop Menu Duplication) */}
            {isMobile && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
                  setIsMenuOpen(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                }}
              >
                <Download size={14} color="#ffffff" />
                <span>{t.installAppBtnShort || '앱 설치'}</span>
              </button>
            )}
            <button onClick={onOpenGuidePR} style={{ background: themeMode === 'light' ? 'var(--bg-secondary)' : 'rgba(30, 41, 59, 0.95)', border: themeMode === 'light' ? '1px solid var(--border-highlight)' : '1px solid rgba(56, 189, 248, 0.5)', color: themeMode === 'light' ? 'var(--text-main)' : '#ffffff', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s ease' }}>
              <BookOpen size={14} color={themeMode === 'light' ? 'var(--accent-primary)' : '#38bdf8'} />
              <span>{t.userGuideBtn || '이용가이드 & 홍보관'}</span>
            </button>

            <button onClick={handleShare} style={{ background: themeMode === 'light' ? 'var(--bg-secondary)' : 'rgba(30, 41, 59, 0.95)', border: themeMode === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.25)', color: themeMode === 'light' ? 'var(--text-main)' : '#ffffff', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {showToast ? <Check size={14} color="#10b981" /> : <Share2 size={14} color={themeMode === 'light' ? 'var(--accent-primary)' : '#38bdf8'} />}
              <span>{showToast ? (t.copiedToast || '복사 완료!') : (t.shareBtn || '여행 조건 공유')}</span>
            </button>

            <button onClick={onOpenWishlist} style={{ background: themeMode === 'light' ? 'var(--bg-secondary)' : 'rgba(30, 41, 59, 0.95)', border: themeMode === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.25)', color: themeMode === 'light' ? 'var(--text-main)' : '#ffffff', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', position: 'relative' }}>
              <Heart size={15} fill={wishlistCount > 0 ? "#ef4444" : "none"} color={wishlistCount > 0 ? "#ef4444" : (themeMode === 'light' ? 'currentColor' : '#ffffff')} />
              <span>{t.wishlistBtn || '찜목록'}</span>
              {wishlistCount > 0 && (
                <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.08rem 0.35rem', borderRadius: '999px' }}>{wishlistCount}</span>
              )}
            </button>

            <button onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')} style={{ background: themeMode === 'dark' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, #0f172a, #1e1b4b)', border: 'none', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }} title={themeMode === 'dark' ? '밝은 화면(라이트 모드)으로 변경' : '어두운 화면(다크 모드)으로 변경'}>
              {themeMode === 'dark' ? (
                <>
                  <Sun size={15} style={{ color: '#ffffff' }} />
                  <span>{t.lightMode || '라이트 모드'}</span>
                </>
              ) : (
                <>
                  <Moon size={15} style={{ color: '#38bdf8' }} />
                  <span>{t.darkMode || '다크 모드'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 3: Sticky Quick Navigation Tabs Bar (58px Left-Indented Alignment) */}
        <div className="header-nav-tabs" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '0.45rem',
          overflowX: 'auto',
          paddingTop: '0.4rem',
          borderTop: themeMode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          width: '100%',
          paddingLeft: isMobile ? 0 : '58px',
          boxSizing: 'border-box'
        }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: isActive
                    ? (themeMode === 'light' ? 'linear-gradient(135deg, #0284c7, #4f46e5)' : 'linear-gradient(135deg, #0284c7, #7c3aed)')
                    : (themeMode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.12)'),
                  color: isActive
                    ? '#ffffff'
                    : (themeMode === 'light' ? '#1e293b' : '#f8fafc'),
                  border: isActive
                    ? (themeMode === 'light' ? '1px solid #0284c7' : '1px solid #38bdf8')
                    : (themeMode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.18)'),
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 10px rgba(2, 132, 199, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeMode === 'light' ? '#0284c7' : '#38bdf8';
                    e.currentTarget.style.background = themeMode === 'light' ? 'rgba(2, 132, 199, 0.1)' : 'rgba(255, 255, 255, 0.18)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = themeMode === 'light' ? '#1e293b' : '#f8fafc';
                    e.currentTarget.style.background = themeMode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.12)';
                  }
                }}
              >
                <Icon size={14} style={{ color: isActive ? '#ffffff' : (themeMode === 'light' ? '#0284c7' : '#38bdf8') }} />
                <span style={{ color: isActive ? '#ffffff' : (themeMode === 'light' ? '#1e293b' : '#f8fafc') }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          border: '1px solid #38bdf8',
          padding: '0.6rem 1.25rem',
          borderRadius: '999px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          zIndex: 10000,
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} color="#10b981" />
          <span>{t.shareSuccessToast || '여행 조건 공유 링크가 클립보드에 복사되었습니다!'}</span>
        </div>
      )}
    </header>
  );
}
