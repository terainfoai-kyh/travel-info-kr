import React, { useEffect } from 'react';
import { ExternalLink, Sparkles, Hotel, Ticket, Wifi } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, romanizeHangul } from '../i18n/translations';
import { buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';

export default function AdBanner({ type = 'leaderboard', lang = 'ko', spotTitle = '', region = '', themeMode = 'dark', startDate, endDate, filters }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const isLight = themeMode === 'light';

  const checkIn = startDate || filters?.startDate;
  const checkOut = endDate || filters?.endDate;
  const targetRegion = region || filters?.region || '서울';

  let displaySpotTitle = spotTitle ? getTranslatedTitle(spotTitle, lang) : '';
  if (lang !== 'ko' && displaySpotTitle && /[\uAC00-\uD7A3]/.test(displaySpotTitle)) {
    displaySpotTitle = displaySpotTitle.replace(/\s*\([\s\S]*?[\uAC00-\uD7A3]+[\s\S]*?\)/g, '').trim();
    if (/[\uAC00-\uD7A3]/.test(displaySpotTitle)) {
      displaySpotTitle = romanizeHangul(displaySpotTitle);
    }
  }

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense script loading catch
    }
  }, []);

  // Leaderboard / Banner Mode
  if (type === 'leaderboard') {
    return (
      <div style={{
        margin: '1rem 0 1.5rem 0',
        padding: '1rem 1.25rem',
        background: isLight
          ? 'linear-gradient(135deg, #e0f2fe, #bae6fd)'
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        border: isLight
          ? '1px solid rgba(2, 132, 199, 0.3)'
          : '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isLight
          ? '0 8px 24px rgba(2, 132, 199, 0.12)'
          : '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Sponsored Tag */}
        <span style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.75rem',
          background: isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.15)',
          color: isLight ? '#0284c7' : 'var(--accent-primary)',
          fontSize: '0.65rem',
          fontWeight: 800,
          padding: '0.15rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {t.adSponsoredTag || 'SPONSORED'}
        </span>

        {/* Left Side Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '260px' }}>
          <div style={{
            background: isLight ? 'rgba(2, 132, 199, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            color: isLight ? '#0284c7' : 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wifi size={24} />
          </div>

          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: isLight ? '#0f172a' : '#ffffff',
              margin: '0 0 0.2rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              {t.esimBannerTitle} <Sparkles size={14} color="#f59e0b" />
            </h4>
            <p style={{
              fontSize: '0.82rem',
              color: isLight ? '#334155' : '#94a3b8',
              margin: 0,
              fontWeight: isLight ? 600 : 400
            }}>
              {t.esimBannerSub}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={buildKlookDeepLink('Korea eSIM', checkIn, checkOut)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Ticket size={14} color="#ffffff" />
            <span>{t.klookEsimBtn || 'Klook eSIM / 패스 ↗'}</span>
          </a>
          <a
            href={buildKKdayDeepLink('Korea', checkIn, checkOut)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={14} color="#ffffff" />
            <span>{t.kkdayActivityBtn || 'KKday 액티비티 ↗'}</span>
          </a>
          <a
            href={buildAgodaDeepLink(targetRegion, checkIn, checkOut)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Hotel size={14} color="#ffffff" />
            <span>{t.agodaHotelBtn || '아고다 숙소 ↗'}</span>
          </a>
        </div>
      </div>
    );
  }

  // In-Feed Horizontal Card Mode
  if (type === 'infeed') {
    return (
      <div style={{
        background: isLight
          ? 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.96))',
        border: isLight
          ? '1px solid rgba(2, 132, 199, 0.25)'
          : '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.25rem',
        marginTop: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isLight
          ? '0 6px 20px rgba(2, 132, 199, 0.08)'
          : '0 6px 20px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Sponsored Tag */}
        <span style={{
          position: 'absolute',
          top: '0.6rem',
          right: '0.75rem',
          background: isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.15)',
          color: isLight ? '#0284c7' : 'var(--accent-primary)',
          fontSize: '0.65rem',
          fontWeight: 800,
          padding: '0.15rem 0.55rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {t.adSponsoredTag || 'SPONSORED'}
        </span>

        {/* Top Title Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: isLight ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.2)',
            color: isLight ? '#c2410c' : '#f97316',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-full)'
          }}>
            <Sparkles size={12} />
            <span>SPECIAL OFFER</span>
          </div>

          <h4 style={{
            fontSize: '0.98rem',
            fontWeight: 800,
            color: isLight ? '#0f172a' : '#ffffff',
            margin: 0
          }}>
            {displaySpotTitle ? `${displaySpotTitle} ${t.agodaHotelBtn}` : t.esimBannerTitle}
          </h4>

          <span style={{
            fontSize: '0.78rem',
            color: isLight ? '#334155' : '#94a3b8',
            fontWeight: isLight ? 600 : 400
          }}>
            {t.esimBannerSub}
          </span>
        </div>

        {/* 1-Row Horizontal Buttons Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.65rem',
          alignItems: 'center'
        }}>
          <a
            href={buildAgodaDeepLink(targetRegion, checkIn, checkOut)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifyContent: 'center',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#ffffff',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Hotel size={15} color="#ffffff" />
            <span>{t.agodaHotelBtn}</span>
            <ExternalLink size={13} color="#ffffff" />
          </a>

          <a
            href={buildKlookDeepLink(targetRegion, checkIn, checkOut)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifyContent: 'center',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#ffffff',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 10px rgba(249, 115, 22, 0.3)'
            }}
          >
            <Ticket size={15} color="#ffffff" />
            <span>{t.klookTicketBtn}</span>
            <ExternalLink size={13} color="#ffffff" />
          </a>

          <a
            href={buildKKdayDeepLink(region || spotTitle || 'Korea')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifyContent: 'center',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#ffffff',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 10px rgba(13, 148, 136, 0.3)'
            }}
          >
            <Sparkles size={15} color="#ffffff" />
            <span>{t.kkdayTicketBtn || 'KKday 액티비티 예약'}</span>
            <ExternalLink size={13} color="#ffffff" />
          </a>
        </div>
      </div>
    );
  }

  return null;
}
