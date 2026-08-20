import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

export default function GoogleMapView({
  spots = [],
  activeDay = 1,
  targetCity = '서울',
  lang = 'ko'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const spotsToDisplay = Array.isArray(spots) ? spots : [];

  const fullRouteUrl = generateGoogleMapsRouteUrl(spotsToDisplay);

  // Center point calculation for smooth, non-bouncing view
  const firstSpot = spotsToDisplay[0];
  const centerLat = Number(firstSpot?.lat) || 37.5665;
  const centerLng = Number(firstSpot?.lng) || 126.9780;

  // Google Maps Embed URL
  const embedMapUrl = spotsToDisplay.length > 0 
    ? `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=14&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(targetCity + ' South Korea')}&z=12&output=embed`;

  return (
    <div style={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      marginBottom: '0.75rem'
    }}>
      {/* Top Map Action Banner */}
      <div style={{
        padding: '0.65rem 0.9rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {activeDay}일차 실시간 Google 동선
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent-primary)',
            padding: '0.1rem 0.45rem',
            borderRadius: '6px'
          }}>
            {spotsToDisplay.length}개 스팟
          </span>
        </div>

        {/* 🗺️ Open Full Route in Google Maps Button */}
        <a
          href={fullRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: 'var(--shadow-glow)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <span>구글맵 전체 길찾기 ↗</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Embedded Map Frame */}
      <div style={{ position: 'relative', width: '100%', height: '170px' }}>
        <iframe
          title="Google Map Route View"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedMapUrl}
        />
      </div>

      {/* Bottom Sequential Route Chips */}
      {spotsToDisplay.length > 0 && (
        <div style={{
          padding: '0.45rem 0.75rem',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {spotsToDisplay.map((spot, idx) => (
            <React.Fragment key={spot.id || idx}>
              <a
                href={getGooglePlaceSearchUrl(spot.title, spot.region || targetCity)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0
                }}
              >
                <span style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  {idx + 1}
                </span>
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {spot.title}
                </span>
              </a>
              {idx < spotsToDisplay.length - 1 && (
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800 }}>➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
