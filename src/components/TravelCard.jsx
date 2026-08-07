import React from 'react';
import { Star, MapPin, Bookmark, Heart, ChevronRight } from 'lucide-react';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedTheme } from '../i18n/translations';

export default function TravelCard({ spot, onSelect, isBookmarked, onToggleBookmark, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  return (
    <div 
      className="animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => onSelect(spot)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
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
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
        <img 
          src={spot.image} 
          alt={spot.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)'
          }}
        />
        {/* Region Badge */}
        <span style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {t.regions?.[spot.region] || spot.region}
        </span>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(spot.id);
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: isBookmarked ? '#ef4444' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform var(--transition-fast)'
          }}
          title={isBookmarked ? t.savedBookmark : t.saveBookmark}
        >
          <Heart size={18} fill={isBookmarked ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>
            <Star size={16} fill="#f59e0b" />
            <span>{spot.rating}</span>
            <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.8rem' }}>
              ({(spot.reviewsCount || 1280).toLocaleString()})
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {getTranslatedTitle(spot.title, lang)}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}>
          {spot.description}
        </p>

        {/* Location & Tags */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <MapPin size={14} color="var(--accent-primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getTranslatedAddress(spot.location, lang)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {spot.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  #{getTranslatedTheme(tag, lang)}
                </span>
              ))}
            </div>

            <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
              {t.detailTitle} <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
