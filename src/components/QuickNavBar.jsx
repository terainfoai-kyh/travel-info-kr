import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Sun, Utensils, Luggage } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function QuickNavBar({ lang = 'ko' }) {
  const [activeSection, setActiveSection] = useState('tour-spots');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const NAV_ITEMS = [
    { id: 'tour-spots', label: t.navSpots || '추천 명소', icon: Compass },
    { id: 'travel-essentials', label: t.navEssentials || '여행 필수템', icon: Luggage },
    { id: 'weather-info', label: t.navWeather || '실시간 날씨', icon: Sun },
    { id: 'ai-lifestyle', label: t.navLifestyle || 'AI 맛집 & 코디', icon: Utensils },
    { id: 'google-map', label: t.navMap || '구글 지도', icon: MapPin }
  ];

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
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -80; // Offset for fixed top navbar
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        margin: '0 -1.5rem 1.25rem -1.5rem',
        padding: '0.45rem 1.5rem',
        transition: 'all 0.25s ease'
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: '0.5rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
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
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.25))'
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-dim)',
                border: isActive
                  ? '1px solid rgba(168, 85, 247, 0.45)'
                  : '1px solid transparent',
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 10px rgba(168, 85, 247, 0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-dim)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-dim)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
