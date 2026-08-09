import React from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedTheme } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';

export default function TourSpotGrid({
  spots = [],
  page = 1,
  setPage,
  totalPages = 1,
  lang = 'ko',
  themeMode = 'dark',
  onSelectSpot,
  onOpenItinerary,
  filters,
  selectedCourseSpotIds = [],
  onToggleCourseSpot
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span>{t.tourTitle}</span>
          <span style={{
            background: 'var(--bg-secondary)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            padding: '0.15rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}>
            {(t.totalSpots || '총 {count}개').replace('{count}', spots.length)}
          </span>
        </h3>
      </div>

      {/* Symmetrical Grid of 6 Cards (3 Columns x 2 Rows) */}
      {spots.length > 0 ? (
        <>
          <div className="spot-grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            {spots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="spot-card"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail Container */}
                <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden' }}>
                  <TravelImageWithFallback
                    src={spot.image}
                    spotTitle={spot.title}
                    lang={lang}
                    style={{ transition: 'transform var(--transition-normal)' }}
                  />
                  {/* Region Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    zIndex: 3
                  }}>
                    {getTranslatedAddress(spot.region, lang)}
                  </span>

                  {/* Course Pick Button */}
                  {onToggleCourseSpot && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCourseSpot(spot.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        right: '0.85rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        background: selectedCourseSpotIds.includes(spot.id) ? 'var(--accent-gradient)' : 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: selectedCourseSpotIds.includes(spot.id) ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: selectedCourseSpotIds.includes(spot.id) ? '0 2px 10px rgba(56, 189, 248, 0.6)' : 'none',
                        transition: 'all 0.2s ease',
                        zIndex: 10
                      }}
                    >
                      <span>{selectedCourseSpotIds.includes(spot.id) ? '✓ 코스 담김' : '+ 코스 담기'}</span>
                    </button>
                  )}
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--accent-primary)',
                        background: 'rgba(56, 189, 248, 0.12)',
                        padding: '0.18rem 0.6rem',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {getTranslatedTheme(spot.category || spot.theme, lang) || (t.defaultCategory || (lang === 'ko' ? '관광명소' : 'Tourist Spot'))}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                        <Star size={14} fill="#f59e0b" />
                        <span>{spot.rating}</span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                      {getTranslatedTitle(spot.title, lang)}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                    <MapPin size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getTranslatedAddress(spot.location, lang)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {t.noSpots}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', opacity: page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: pNum === page ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                color: pNum === page ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {pNum}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', opacity: page === totalPages ? 0.5 : 1 }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
