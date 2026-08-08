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
    const isDefault = !src || src === '/default-spot.png' || src.includes('default-spot');
    setImgSrc(isDefault ? '/default-spot.png' : src);
    setHasError(isDefault);
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
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.55) 100%)',
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
            background: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '16px',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            transform: 'translateY(-12px)'
          }}>
            {/* Brand Title */}
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              letterSpacing: '0.02em',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)'
            }}>
              <Sparkles size={14} />
              {t.travelKorea || '대한민국 여행 정보'}
            </div>

            {/* Status Subtitle */}
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#f8fafc',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '0.2rem 0.7rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <ImageOff size={11} />
              {t.imagePreparing || '이미지 준비 중'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
