import React, { useEffect } from 'react';
import { ExternalLink, Sparkles, Hotel, Ticket, Wifi } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function AdBanner({ type = 'leaderboard', lang = 'ko', spotTitle = '', region = '' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

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
        margin: '2rem 0',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'rgba(56, 189, 248, 0.15)',
          color: 'var(--accent-primary)',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '0.2rem 0.6rem',
          borderBottomLeftRadius: 'var(--radius-sm)'
        }}>
          {t.adSponsoredTag || 'SPONSORED'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Wifi size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{t.esimBannerTitle}</span>
              <Sparkles size={14} color="#f59e0b" />
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
              {t.esimBannerSub}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href="https://www.klook.com/ko/search/?query=Korea%20eSIM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none'
            }}
          >
            <Ticket size={16} color="#ffffff" />
            <span>eSIM / K-Pass 혜택 ↗</span>
          </a>
          <a
            href="https://www.agoda.com/partners/partnersearch.aspx?cid=1972217&text=Korea"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: 'none'
            }}
          >
            <Hotel size={16} color="#ffffff" />
            <span>{t.agodaHotelBtn || '숙소 검색 ↗'}</span>
          </a>
        </div>
      </div>
    );
  }

  // In-Feed Card Mode
  if (type === 'infeed') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        <span style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'rgba(56, 189, 248, 0.2)',
          color: 'var(--accent-primary)',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {t.adSponsoredTag || 'SPONSORED'}
        </span>

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(249, 115, 22, 0.2)',
            color: '#f97316',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} />
            <span>SPECIAL OFFER</span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            {spotTitle ? `${spotTitle} ${t.agodaHotelBtn}` : t.esimBannerTitle}
          </h3>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {t.esimBannerSub}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <a
            href={`https://www.agoda.com/partners/partnersearch.aspx?cid=1972217&text=${encodeURIComponent(spotTitle || region || 'Korea')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifyContent: 'center',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none'
            }}
          >
            <Hotel size={16} color="#ffffff" />
            <span>{t.agodaHotelBtn}</span>
            <ExternalLink size={14} color="#ffffff" />
          </a>
          <a
            href={`https://www.klook.com/ko/search/?query=${encodeURIComponent(spotTitle || region || 'Korea')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              justifyContent: 'center',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none'
            }}
          >
            <Ticket size={16} color="#ffffff" />
            <span>{t.klookTicketBtn}</span>
            <ExternalLink size={14} color="#ffffff" />
          </a>
        </div>
      </div>
    );
  }

  return null;
}
