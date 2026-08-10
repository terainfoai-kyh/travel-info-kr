import React from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Compass, RefreshCw } from 'lucide-react';
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
  onToggleCourseSpot,
  onResetFilters
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
                className="spot-card glass-panel"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onClick={() => onSelectSpot(spot)}
              >
                {/* Image Container with Fallback */}
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                  <TravelImageWithFallback
                    src={spot.image}
                    alt={spot.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {getTranslatedTheme(spot.theme, lang)}
                  </div>

                  {/* Rating Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#fbbf24',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}>
                    <Star size={12} fill="#fbbf24" />
                    <span>{spot.rating}</span>
                  </div>

                  {/* Selection Checkbox Pill for Custom Course */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCourseSpot(spot.id);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      background: selectedCourseSpotIds.includes(spot.id) ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.8)',
                      color: '#ffffff',
                      border: selectedCourseSpotIds.includes(spot.id) ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{selectedCourseSpotIds.includes(spot.id) ? '✓ 담김' : '+ 코스담기'}</span>
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      marginBottom: '0.4rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.3
                    }}>
                      {getTranslatedTitle(spot.title, lang)}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      marginBottom: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.5em'
                    }}>
                      {spot.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 500
                  }}>
                    <MapPin size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
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
