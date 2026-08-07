import React from 'react';
import { Shirt, CheckCircle } from 'lucide-react';
import { TRANSLATIONS, getTranslatedOutfit } from '../i18n/translations';

export default function OutfitRecommendation({ outfits, filters, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  if (!outfits || outfits.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shirt size={20} color="var(--accent-primary)" />
          <span>{t.outfitTitle}</span>
        </h3>

        {/* Active Search Condition Badge */}
        {filters && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            background: 'var(--bg-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>[{t.customConditionLabel || '맞춤 조건'}]</span>
            {filters.region !== '전국' && <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>📍 {t.regions?.[filters.region] || filters.region}</span>}
            {filters.gender !== '무관' && <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>👤 {t.genders?.[filters.gender] || filters.gender}</span>}
            {filters.age !== '전체' && <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>🎂 {t.ages?.[filters.age] || filters.age}</span>}
            {filters.theme !== '전체' && <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>🎨 {t.themes?.[filters.theme] || filters.theme}</span>}
            {filters.startDate && filters.endDate && (
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>📅 {filters.startDate} ~ {filters.endDate}</span>
            )}
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {outfits.map((rawItem, idx) => {
          const item = getTranslatedOutfit(rawItem, lang);
          return (
            <div
              key={idx}
              className="animate-fade-in"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '220px' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '0.8rem',
                  left: '0.8rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {item.season}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {item.reason}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.items.map((sub, i) => (
                    <span key={i} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--text-main)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <CheckCircle size={12} color="var(--accent-primary)" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
