import React from 'react';
import { CATEGORIES, REGIONS } from '../data/travelData';
import { Sparkles, Trees, Landmark, Utensils, Calendar } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Trees: Trees,
  Landmark: Landmark,
  Utensils: Utensils,
  Calendar: Calendar
};

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '2rem 0' }}>
      {/* Category Icons Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <IconComponent size={18} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Region Filter Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        background: 'var(--bg-glass)',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, marginRight: '0.5rem' }}>
          지역 선택:
        </span>
        {REGIONS.map((region) => {
          const isActive = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? '#0f172a' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 400,
                fontSize: '0.85rem',
                border: isActive ? 'none' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {region}
            </button>
          );
        })}
      </div>
    </div>
  );
}
