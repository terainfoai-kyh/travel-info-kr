import React from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Compass, RefreshCw, Lightbulb, Mic, Search } from 'lucide-react';
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
        /* Ultra-Compact Slim Option 1 Zero-State Card */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '1.1rem 0.9rem',
          textAlign: 'center',
          margin: '0.65rem 0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem'
        }}>
          {/* Inline Compact Title Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            color: '#d97706',
            fontSize: '0.83rem',
            fontWeight: 800
          }}>
            <Lightbulb size={15} />
            <span>
              {filters?.keyword
                ? (t.noSpotsResult ? t.noSpotsResult.replace('{keyword}', filters.keyword) : `'${filters.keyword}' 검색 결과가 없습니다`)
                : (t.noSpots || '조회 조건에 해당하는 명소가 없습니다')}
            </span>
          </div>

          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            margin: 0,
            maxWidth: '480px'
          }}>
            {t.noSpotsDesc || '원하시는 장소가 없으신가요? 아래 추천 팁이나 음성 검색을 활용해 보세요.'}
          </p>

          {/* Compact 1-Row Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '560px'
          }}>
            <span style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              color: 'var(--text-main)',
              fontWeight: 600
            }}>
              {t.tipRegionTheme || "💡 '지역명 + 테마' (예: 성수동 카페, 해운대 맛집)"}
            </span>
            <span style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              color: '#a855f7',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Mic size={12} />
              {t.tipVoiceSearch || 'AI 음성 검색'}
            </span>
          </div>

          {/* Compact Reset Action Button */}
          <button
            onClick={() => onResetFilters && onResetFilters({ region: '전국', keyword: '', theme: '전체' })}
            style={{
              marginTop: '0.2rem',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={14} />
            <span>{t.resetFilterBtn || '전체 관광 명소 목록으로 초기화'}</span>
          </button>
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
