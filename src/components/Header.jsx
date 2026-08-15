import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Globe, Sparkles, Sun, Moon, Heart, 
  MapPin, Utensils, Luggage, Share2, Check, BookOpen, 
  ChevronDown, ChevronUp, Menu, X, Download, Monitor,
  Cloud, CloudRain, Thermometer
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchRealtimeWeather } from '../services/weatherApi';

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어 (KO)', short: 'KO' },
  { value: 'en', label: 'English (EN)', short: 'EN' },
  { value: 'ja', label: '日本語 (JA)', short: 'JA' },
  { value: 'zh', label: '简体中文 (ZH)', short: 'ZH' },
  { value: 'zht', label: '繁體中文 (TW)', short: 'TW' },
  { value: 'de', label: 'Deutsch (DE)', short: 'DE' },
  { value: 'fr', label: 'Français (FR)', short: 'FR' },
  { value: 'es', label: 'Español (ES)', short: 'ES' },
  { value: 'ru', label: 'Русский (RU)', short: 'RU' }
];

export default function Header({ 
  currentLang, 
  lang,
  setLang,
  onLanguageChange,
  filters, 
  themeMode = 'light', 
  setThemeMode, 
  onToggleTheme,
  wishlistCount = 0, 
  onOpenWishlist, 
  onOpenItinerary, 
  onOpenGuidePR,
  onOpenWeather,
  onOpenEssentials
}) {
  const activeLang = currentLang || lang || 'ko';
  const handleLangChange = onLanguageChange || setLang;
  const toggleTheme = onToggleTheme || (() => setThemeMode && setThemeMode(prev => prev === 'dark' ? 'light' : 'dark'));

  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.ko;
  const [activeSection, setActiveSection] = useState('tour-spots');
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 840 : false);
  const menuDropdownRef = useRef(null);

  // ☀️ Live Weather state from Korea Meteorological Administration (기상청)
  const [liveWeather, setLiveWeather] = useState({
    temp: '19°C',
    text: '맑음',
    icon: 'Sun',
    city: '서울'
  });

  useEffect(() => {
    let isMounted = true;
    fetchRealtimeWeather('서울')
      .then(data => {
        if (isMounted && data && data.temperature) {
          setLiveWeather({
            temp: data.temperature,
            text: data.weatherText || '맑음',
            icon: data.weatherIcon || 'Sun',
            city: data.region || '서울'
          });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 840);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close floating dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleShare = async () => {
    try {
      const queryString = window.location.search || '';
      const shareUrl = `${window.location.origin}${window.location.pathname}${queryString}`;
      const shareTitle = `Vora AI | 대한민국 스마트 AI 여행 컨시어지`;
      const shareText = `✈️ AI 맞춤 여행 가이드! ☀️ 실시간 날씨 & 한국관광공사 정품 추천 코스:\n${shareUrl}`;

      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice && navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
          setIsMenuOpen(false);
          return;
        } catch (shareErr) {}
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setShowToast(true);
        setIsMenuOpen(false);
        setTimeout(() => setShowToast(false), 2800);
      }
    } catch (e) {}
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    if (id === 'ai-prompt-hero' || id === 'tour-spots') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -70;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'Cloud': return <Cloud size={14} color="#38bdf8" />;
      case 'CloudRain': return <CloudRain size={14} color="#818cf8" />;
      case 'Sun':
      default: return <Sun size={14} color="#f59e0b" />;
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      padding: isMobile ? '0.45rem 0.75rem' : '0.55rem 1.25rem',
      boxSizing: 'border-box',
      borderBottom: themeMode === 'light' ? '1.5px solid #cbd5e1' : '1px solid var(--border-color)',
      background: themeMode === 'light' ? 'rgba(241, 245, 249, 0.92)' : 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.65rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* LEFT: BRAND LOGO + LIVE AI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0, cursor: 'pointer' }} onClick={() => scrollToSection('ai-prompt-hero')}>
          <div style={{
            width: isMobile ? '34px' : '38px',
            height: isMobile ? '34px' : '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(147, 51, 234, 0.35)',
            border: '1.5px solid rgba(192, 132, 252, 0.4)',
            background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
            flexShrink: 0
          }}>
            <Sparkles size={isMobile ? 17 : 20} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: themeMode === 'light' ? '#0f172a' : '#f8fafc',
              textTransform: 'uppercase'
            }}>
              Vora
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 900,
              padding: '0.1rem 0.4rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(147, 51, 234, 0.3)',
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
              padding: '0.15rem 0.45rem',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              marginLeft: '0.15rem'
            }}>
              <span className="live-ai-pulse-dot" />
              LIVE
            </span>
          )}

          {/* Mobile Live Weather Pill Badge (Click to open WeatherModal) */}
          {isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenWeather && onOpenWeather();
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(2, 132, 199, 0.12))',
                color: themeMode === 'light' ? '#0f172a' : '#ffffff',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '0.2rem 0.45rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.1)'
              }}
              title="실시간 날씨 상세 보기"
            >
              {renderWeatherIcon(liveWeather.icon)}
              <span>{liveWeather.city} {liveWeather.temp}</span>
            </button>
          )}
        </div>

        {/* CENTER: DESKTOP SLIM NAVIGATION & LIVE WEATHER CAPSULE BAR */}
        {!isMobile && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: themeMode === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(30, 41, 59, 0.65)',
            padding: '0.25rem 0.35rem',
            borderRadius: '9999px',
            border: themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
          }}>
            {/* 1. AI 대화 */}
            <button
              type="button"
              onClick={() => scrollToSection('ai-prompt-hero')}
              style={{
                background: 'transparent',
                color: themeMode === 'light' ? '#334155' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#9333ea';
                e.currentTarget.style.backgroundColor = themeMode === 'light' ? 'rgba(147, 51, 234, 0.08)' : 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = themeMode === 'light' ? '#334155' : '#cbd5e1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Sparkles size={14} color="#9333ea" />
              <span>AI 대화</span>
            </button>

            {/* 2. ☀️ KMA Live Weather Pill Badge (Click to open full WeatherModal) */}
            <button
              type="button"
              onClick={() => onOpenWeather && onOpenWeather()}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(2, 132, 199, 0.12))',
                color: themeMode === 'light' ? '#0f172a' : '#ffffff',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.15)'
              }}
              title="대한민국 기상청(KMA) 100% 실시간 연동 기후 정보 보기"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {renderWeatherIcon(liveWeather.icon)}
              <span>{liveWeather.city} {liveWeather.temp} · {liveWeather.text}</span>
              <ChevronDown size={12} color="#64748b" />
            </button>

            {/* 3. 🧳 여행 필수템 (Affiliate Monetization Modal Trigger) */}
            <button
              type="button"
              onClick={() => onOpenEssentials && onOpenEssentials()}
              style={{
                background: 'transparent',
                color: themeMode === 'light' ? '#334155' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0284c7';
                e.currentTarget.style.backgroundColor = themeMode === 'light' ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = themeMode === 'light' ? '#334155' : '#cbd5e1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Luggage size={14} color="#0284c7" />
              <span>여행 필수템</span>
            </button>

            {/* 4. 🍲 AI 맛집 & 코디 */}
            <button
              type="button"
              onClick={() => scrollToSection('ai-prompt-hero')}
              style={{
                background: 'transparent',
                color: themeMode === 'light' ? '#334155' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ea580c';
                e.currentTarget.style.backgroundColor = themeMode === 'light' ? 'rgba(234, 88, 12, 0.08)' : 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = themeMode === 'light' ? '#334155' : '#cbd5e1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Utensils size={14} color="#ea580c" />
              <span>AI 맛집 & 코디</span>
            </button>
          </nav>
        )}

        {/* RIGHT: CONTROLS & FLOATING MENU TRIGGER */}
        <div ref={menuDropdownRef} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.35rem' : '0.45rem', position: 'relative' }}>
          
          {/* Language Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            <Globe size={14} style={{ color: themeMode === 'light' ? '#64748b' : '#94a3b8' }} />
            <select 
              value={activeLang} 
              onChange={(e) => handleLangChange && handleLangChange(e.target.value)} 
              className="header-lang-select" 
              style={{ 
                background: themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)', 
                color: themeMode === 'light' ? '#0f172a' : '#ffffff', 
                border: themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.2)', 
                padding: '0.32rem 0.45rem', 
                borderRadius: '10px', 
                fontSize: '0.76rem', 
                fontWeight: 800, 
                cursor: 'pointer', 
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                maxWidth: isMobile ? '78px' : '135px'
              }}
            >
              {LANGUAGE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: themeMode === 'light' ? '#ffffff' : '#1e293b', color: themeMode === 'light' ? '#0f172a' : '#ffffff' }}>
                  {isMobile ? opt.short : opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={onOpenWishlist}
            style={{
              background: wishlistCount > 0 
                ? (themeMode === 'light' ? '#fef2f2' : 'rgba(239, 68, 68, 0.15)') 
                : (themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)'),
              color: wishlistCount > 0 ? '#ef4444' : (themeMode === 'light' ? '#0f172a' : '#ffffff'),
              border: wishlistCount > 0 
                ? '1.5px solid #fecaca' 
                : (themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.2)'),
              padding: isMobile ? '0.32rem 0.5rem' : '0.32rem 0.65rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: wishlistCount > 0 ? '0 2px 8px rgba(239, 68, 68, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title={t.wishlistBtn || '찜목록'}
          >
            <Heart size={14} fill={wishlistCount > 0 ? '#ef4444' : 'none'} color="#ef4444" />
            {!isMobile && <span>{t.wishlistBtn || '찜목록'}</span>}
            {wishlistCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.05rem 0.35rem',
                borderRadius: '999px'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Menu Dropdown Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            style={{
              background: isMenuOpen 
                ? 'linear-gradient(135deg, #9333ea, #2563eb)' 
                : (themeMode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.95)'),
              color: isMenuOpen ? '#ffffff' : (themeMode === 'light' ? '#0f172a' : '#ffffff'),
              border: isMenuOpen 
                ? 'none' 
                : (themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.2)'),
              padding: isMobile ? '0.32rem 0.45rem' : '0.32rem 0.65rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: isMenuOpen ? '0 4px 12px rgba(147, 51, 234, 0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title="메뉴"
          >
            {isMobile ? (isMenuOpen ? <X size={16} /> : <Menu size={16} />) : (
              <>
                <Menu size={14} />
                <span>메뉴</span>
                {isMenuOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </>
            )}
          </button>

          {/* 🌟 FLOATING DROPDOWN MENU CARD */}
          {isMenuOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: isMobile ? '240px' : '260px',
                backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e293b',
                borderRadius: '16px',
                border: themeMode === 'light' ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                padding: '0.65rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                zIndex: 10000
              }}
            >
              {/* Mobile Quick Links */}
              {isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.45rem', borderBottom: themeMode === 'light' ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                    바로가기
                  </div>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenWeather && onOpenWeather();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Sun size={15} color="#f59e0b" />
                    <span>실시간 날씨 ({liveWeather.city} {liveWeather.temp})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenEssentials && onOpenEssentials();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: themeMode === 'light' ? '#334155' : '#e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Luggage size={15} color="#0284c7" />
                    <span>여행 필수템 & 제휴 할인</span>
                  </button>
                </div>
              )}

              {/* Utility Actions */}
              <button
                onClick={toggleTheme}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: themeMode === 'light' ? '#334155' : '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'light' ? '#f8fafc' : '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {themeMode === 'light' ? <Moon size={14} color="#64748b" /> : <Sun size={14} color="#f59e0b" />}
                  <span>{themeMode === 'light' ? '다크 모드' : '라이트 모드'}</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {themeMode === 'light' ? 'OFF' : 'ON'}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenGuidePR && onOpenGuidePR();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: themeMode === 'light' ? '#334155' : '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'light' ? '#f8fafc' : '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <BookOpen size={14} color="#3b82f6" />
                <span>{t.guidePrBtn || '이용가이드 & 홍보관'}</span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: themeMode === 'light' ? '#334155' : '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'light' ? '#f8fafc' : '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Share2 size={14} color="#10b981" />
                <span>{t.shareBtn || '여행 링크 공유'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: themeMode === 'light' ? '#0284c7' : '#38bdf8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeMode === 'light' ? '#f0f9ff' : '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download size={14} color="#0284c7" />
                <span>{t.installAppBtn || '앱 설치 (PWA)'}</span>
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          border: '1px solid #38bdf8',
          padding: '0.55rem 1.2rem',
          borderRadius: '999px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
          zIndex: 10000,
          fontSize: '0.82rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}>
          <Check size={15} color="#10b981" />
          <span>{t.shareSuccessToast || '여행 조건 공유 링크가 클립보드에 복사되었습니다!'}</span>
        </div>
      )}
    </header>
  );
}
