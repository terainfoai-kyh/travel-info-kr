import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { generateGoogleMapsRouteUrl, getGooglePlaceSearchUrl } from '../services/geminiNlpService';

export default function GoogleMapView({
  spots = [],
  activeDay = 1,
  targetCity = '서울'
}) {
  const daySpots = (spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));
  const spotsToDisplay = daySpots.length > 0 ? daySpots : (spots || []);

  const fullRouteUrl = generateGoogleMapsRouteUrl(spotsToDisplay);

  // Center point calculation for smooth, non-bouncing view
  const firstSpot = spotsToDisplay[0];
  const centerLat = Number(firstSpot?.lat) || 37.5665;
  const centerLng = Number(firstSpot?.lng) || 126.9780;

  // Google Maps Embed Static or Interactive Search URL
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
      position: 'relative'
    }}>
      {/* Top Map Action Banner */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {activeDay}일차 Google 지도 코스
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent-primary)',
            padding: '0.15rem 0.45rem',
            borderRadius: '6px'
          }}>
            {spotsToDisplay.length}개 스팟 연동
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
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-glow)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <span>구글맵 전체 길찾기 열기</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Embedded Map Frame (Smooth and stable pan/zoom) */}
      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
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

        {/* Floating Numbered Waypoint Badges Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          padding: '0.35rem',
          borderRadius: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10
        }}>
          {spotsToDisplay.map((s, idx) => (
            <a
              key={s.id || idx}
              href={getGooglePlaceSearchUrl(s.title, s.region || targetCity)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 900
              }}>
                {idx + 1}
              </span>
              <span>{s.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
