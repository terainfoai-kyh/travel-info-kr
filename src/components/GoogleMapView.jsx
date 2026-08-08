import React from 'react';
import { Map, MapPin } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';

export default function GoogleMapView({ selectedSpot, allSpots, lang, themeMode = 'dark' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const isLight = themeMode === 'light';

  const activeSpot = selectedSpot || (allSpots && allSpots[0]);
  const lat = activeSpot ? activeSpot.lat : 37.5665;
  const lng = activeSpot ? activeSpot.lng : 126.9780;
  const title = activeSpot ? activeSpot.title : '대한민국';

  return (
    <div style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
        <Map size={20} color="var(--accent-primary)" />
        <span>{t.mapTitle}</span>
      </h3>

      <div style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        {/* Interactive Google Map Embed */}
        <iframe
          title="Google Map View"
          width="100%"
          height="380"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=14&output=embed`}
        />

        {activeSpot && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid var(--border-color)',
            boxShadow: isLight ? '0 6px 20px rgba(0, 0, 0, 0.08)' : '0 6px 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                  {getTranslatedTitle(title, lang)}
                </div>
                <div style={{ fontSize: '0.8rem', color: isLight ? '#334155' : 'var(--text-muted)', fontWeight: isLight ? 600 : 400 }}>
                  {getTranslatedAddress(activeSpot.location, lang)}
                </div>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 800 }}
            >
              {t.viewOnGoogleMaps || 'Google 지도에서 크게 보기'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
