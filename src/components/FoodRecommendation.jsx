import React from 'react';
import { Utensils, Info } from 'lucide-react';
import { TRANSLATIONS, getTranslatedFood } from '../i18n/translations';

export default function FoodRecommendation({ foods, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  if (!foods || foods.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Utensils size={20} color="var(--accent-primary)" />
        <span>{t.foodTitle}</span>
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {foods.map((rawFood, idx) => {
          const food = getTranslatedFood(rawFood, lang);
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
              <div style={{ position: 'relative', height: '180px' }}>
                <img
                  src={food.image}
                  alt={food.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '0.8rem',
                  left: '0.8rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: 'var(--accent-primary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {food.category}
                </span>
              </div>

              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {food.name}
                </h4>
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.4rem',
                  background: 'rgba(56, 189, 248, 0.05)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(56, 189, 248, 0.15)'
                }}>
                  <Info size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                    {food.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
