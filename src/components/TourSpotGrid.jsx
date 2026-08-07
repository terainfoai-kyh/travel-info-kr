import React from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedTheme } from '../i18n/translations';
import AdBanner from './AdBanner';

export default function TourSpotGrid({ spots, page, setPage, totalPages, lang, onSelectSpot, onOpenItinerary }) {
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

        {/* AI Quick Trigger Button in Grid Header */}
        <button
          type="button"
          onClick={onOpenItinerary}
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(192, 132, 252, 0.2))',
            border: '1px solid rgba(192, 132, 252, 0.4)',
            color: 'var(--text-main)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Sparkles size={14} color="#c084fc" />
          <span>✨ AI 맞춤 코스 짜기</span>
        </button>
      </div>

      {/* Mini AI Recommendation Preview Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span><strong>어디로 갈지 고민이신가요?</strong> 한국관광공사 Official DB 연동 1:1 맞춤 여행 코스를 1초 만에 확인해보세요!</span>
        </div>
        <button
          type="button"
          onClick={onOpenItinerary}
          style={{
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            border: 'none',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>AI 코스 생성하기</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Grid of 6 Cards */}
      {spots.length > 0 ? (
        <div className="spot-grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="animate-fade-in"
              onClick={() => onSelectSpot(spot)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ position: 'relative', height: '200px' }}>
                <img
                  src={spot.image}
                  alt={getTranslatedTitle(spot.title, lang)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '0.8rem',
                  left: '0.8rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {spot.region && spot.region !== '전국' && spot.region !== '한국'
                    ? (t.regions?.[spot.region] || spot.region)
                    : (t.countryBadge || '한국')}
                </span>
              </div>

              <div style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {getTranslatedTheme(spot.theme || '관광', lang)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={14} fill="#f59e0b" />
                    <span>{spot.rating}</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {getTranslatedTitle(spot.title, lang)}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  <MapPin size={14} color="var(--accent-primary)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getTranslatedAddress(spot.location, lang)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* In-Feed Sponsor Ad Card */}
          <AdBanner type="infeed" lang={lang} spotTitle={spots[0]?.title} region={spots[0]?.region} />
        </div>
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
