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
        /* Compact, Theme-Adaptive Option 3: Smart Search Tip & Helper Hero Card */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '1.75rem 1.25rem',
          textAlign: 'center',
          margin: '1rem 0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          position: 'relative'
        }}>
          {/* Glowing Lightbulb Badge */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Lightbulb size={26} />
          </div>

          {/* Main Title */}
          <div style={{ maxWidth: '520px' }}>
            <h4 style={{
              fontSize: '1.08rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '0.3rem',
              letterSpacing: '-0.01em'
            }}>
              {filters?.keyword
                ? `'${filters.keyword}'(으)로 검색된 결과가 없습니다`
                : (t.noSpots || '조회 조건에 해당하는 관광 명소가 없습니다')}
            </h4>
            <p style={{
              fontSize: '0.83rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              margin: 0
            }}>
              원하시는 장소가 검색되지 않았나요? 아래 <strong>스마트 검색 팁</strong>을 참고해 보세요!
            </p>
          </div>

          {/* Smart Search Tips Helper Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '620px',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--accent-primary)',
                borderRadius: '8px',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Search size={16} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                  💡 지역명 + 테마 조합 검색
                </h5>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  예: <strong style={{ color: 'var(--accent-primary)' }}>'성수동 카페'</strong>, <strong style={{ color: 'var(--accent-primary)' }}>'해운대 맛집'</strong>, <strong style={{ color: 'var(--accent-primary)' }}>'속초 힐링'</strong>
                </p>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.12)',
                color: '#a855f7',
                borderRadius: '8px',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mic size={16} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                  🎙️ AI 음성 검색 활용
                </h5>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                  상단 검색창의 <strong style={{ color: '#a855f7' }}>마이크 버튼(🎙️)</strong>을 누르고 말로 질문해 보세요.
                </p>
              </div>
            </div>
          </div>

          {/* Reset Action Button */}
          <button
            onClick={() => onResetFilters && onResetFilters({ region: '전국', keyword: '', theme: '전체' })}
            style={{
              marginTop: '0.25rem',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.65rem 1.35rem',
              fontSize: '0.83rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <RefreshCw size={15} />
            <span>전체 관광 명소 목록으로 초기화</span>
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
