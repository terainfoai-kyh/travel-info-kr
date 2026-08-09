import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function SplashScreen({ onFinish, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 250);
  };

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        background: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* High-Resolution Bright Radiant Palace Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/korea-splash-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(1.05) contrast(1.05) saturate(1.1)',
        transform: 'scale(1)',
        animation: 'kenBurnsZoom 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none'
      }} />

      {/* Ultra-Light Soft Gradient Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.3) 0%, rgba(9, 13, 22, 0.05) 50%, rgba(9, 13, 22, 0.4) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Top Right Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(15, 23, 42, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          padding: '0.4rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      >
        <span>{t.splashSkip || 'Skip ➔'}</span>
        <ArrowRight size={13} color="#38bdf8" />
      </button>

      {/* See-Through Ultra-Transparent Glass Card (Background Fully Visible!) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.85rem',
        zIndex: 2,
        maxWidth: '320px',
        width: '88%',
        padding: '1.5rem 1.2rem',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.38)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Sleek Modern Compact Logo */}
        <div style={{
          width: '62px',
          height: '62px',
          borderRadius: '18px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          animation: 'splashPulse 1.8s infinite ease-in-out'
        }}>
          <img src="/logo.png" alt="K-Travel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {t.splashTitle || '🇰🇷 K-Travel AI'}
          </h1>

          <p style={{
            fontSize: '0.88rem',
            color: 'rgba(255, 255, 255, 0.92)',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.35,
            textShadow: '0 1px 6px rgba(0,0,0,0.6)'
          }}>
            {t.splashSub || '대한민국 스마트 여행 가이드'}
          </p>
        </div>

        {/* Concise i18n Loading Tag */}
        <div style={{
          marginTop: '0.4rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '0.38rem 0.85rem',
          borderRadius: '9999px',
          color: '#ffffff',
          fontSize: '0.76rem',
          fontWeight: 700,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}>
          <Sparkles size={13} color="#38bdf8" className="animate-spin" />
          <span>{t.splashLoading || '데이터 준비 중...'}</span>
        </div>
      </div>

      <style>{`
        @keyframes kenBurnsZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes splashPulse {
          0% { transform: scale(0.96); boxShadow: 0 0 0 0 rgba(56, 189, 248, 0.3); }
          50% { transform: scale(1.04); boxShadow: 0 0 20px 6px rgba(56, 189, 248, 0.5); }
          100% { transform: scale(0.96); boxShadow: 0 0 0 0 rgba(56, 189, 248, 0.3); }
        }
      `}</style>
    </div>
  );
}
