import React, { useState, useEffect } from 'react';
import { Landmark, Sparkles, ImageOff } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function TravelImageWithFallback({
  src,
  alt = '',
  spotTitle = '',
  lang = 'ko',
  style = {},
  className = '',
  onClick
}) {
  const [imgSrc, setImgSrc] = useState(src || '/default-spot.png');
  const [hasError, setHasError] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  useEffect(() => {
    const isBad = !src || src === '/default-spot.png' || src.includes('default-spot') || src.toLowerCase().includes('toilet') || src.toLowerCase().includes('화장실');
    setImgSrc(isBad ? '/default-spot.png' : src);
    setHasError(isBad);
  }, [src]);

  const handleError = () => {
    setImgSrc('/default-spot.png');
    setHasError(true);
  };

  const isFallback = hasError || !imgSrc || imgSrc === '/default-spot.png' || imgSrc.includes('default-spot');

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      <img
        src={imgSrc}
        alt={alt || spotTitle}
        referrerPolicy="no-referrer"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={handleError}
      />

      {/* Glassmorphism Branding Card Overlay on Fallback Scenery */}
      {isFallback && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <div style={{
            background: 'rgba(23, 31, 48, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '20px',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55)',
            transform: 'translateY(-6px)'
          }}>
            {/* Brand Title */}
            <div style={{
              fontSize: '0.98rem',
              fontWeight: 800,
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              letterSpacing: '0.01em',
              textShadow: '0 1px 4px rgba(0,0,0,0.7)'
            }}>
              <Sparkles size={16} color="#38bdf8" />
              <span>{t.travelKorea || '대한민국 여행 정보'}</span>
            </div>

            {/* Status Subtitle Badge - Clean & Premium */}
            {spotTitle && (
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#f8fafc',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span>{spotTitle}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
