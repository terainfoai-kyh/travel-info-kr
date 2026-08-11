import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function SplashScreen({ onFinish, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1400);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 200);
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
        background: 'linear-gradient(135deg, #fafafc 0%, #ffffff 50%, #eff6ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Soft Airy Pastel Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(186, 230, 253, 0.4) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Main Content Box */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Official 3D K-Taegeuk Emblem Logo */}
        <div style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          animation: 'splashLogoFloat 3s ease-in-out infinite'
        }}>
          <img
            src="/logo.png"
            alt="K-Travel AI Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '22px',
              boxShadow: '0 12px 30px rgba(37, 99, 235, 0.3)'
            }}
          />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0'
        }}>
          K-Travel AI
        </h1>

        <p style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#64748b',
          margin: '0 0 2rem 0'
        }}>
          {t.splashSub || '대한민국 스마트 여행 가이드'}
        </p>

        {/* Minimal Progress Bar */}
        <div style={{
          width: '140px',
          height: '4px',
          background: 'rgba(226, 232, 240, 0.8)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
            borderRadius: '9999px',
            animation: 'splashBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes splashBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @keyframes splashLogoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
