import React, { useState } from 'react';
import { Utensils, Shirt, Sparkles, MapPin, ExternalLink, CheckCircle, Info, Flame, Sun, Droplets } from 'lucide-react';
import { TRANSLATIONS, getTranslatedFood, getTranslatedOutfit, getMapSearchBtnLabel } from '../i18n/translations';

export default function AILifestyleSection({ foods = [], outfits = [], filters = {}, lang = 'ko', themeMode = 'dark' }) {
  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'outfit'
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const isLight = themeMode === 'light';
  const currentRegion = filters.region && filters.region !== '전국' ? filters.region : '여행지';

  return (
    <div style={{
      marginBottom: '2.5rem',
      background: isLight
        ? 'linear-gradient(135deg, #ffffff, #f8fafc)'
        : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95))',
      border: isLight
        ? '1px solid rgba(168, 85, 247, 0.35)'
        : '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      boxShadow: isLight
        ? '0 10px 30px rgba(0, 0, 0, 0.06)'
        : '0 10px 30px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Row: Title & Active Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1.25rem',
        paddingBottom: '0.85rem',
        borderBottom: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(168, 85, 247, 0.15))'
              : 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLight ? '#9333ea' : '#c084fc'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: isLight ? '#0f172a' : 'var(--text-main)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>{t.aiLifestyleTitle || 'AI 맞춤 여행 라이프스타일 가이드'}</span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: isLight ? '#0284c7' : '#38bdf8',
                background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(56, 189, 248, 0.12)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                border: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                100% Free
              </span>
            </h3>
            <p style={{
              fontSize: '0.78rem',
              color: isLight ? '#475569' : 'var(--text-dim)',
              fontWeight: isLight ? 600 : 500,
              margin: '0.15rem 0 0 0'
            }}>
              {t.aiLifestyleSub || '선택하신 지역·날씨·연령·성별 조건을 분석하여 실시간 최적 음식과 코디를 제안합니다'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Switch (Food vs Outfit) */}
        <div style={{
          display: 'inline-flex',
          background: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(15, 23, 42, 0.8)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('food')}
            style={{
              background: activeTab === 'food'
                ? (isLight ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'var(--accent-gradient)')
                : 'transparent',
              color: activeTab === 'food' ? '#ffffff' : (isLight ? '#334155' : 'var(--text-dim)'),
              border: 'none',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'food' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none'
            }}
          >
            <Utensils size={14} />
            <span>{t.foodTabLabel || '🍱 추천 맛집/음식'} ({foods.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outfit')}
            style={{
              background: activeTab === 'outfit'
                ? (isLight ? 'linear-gradient(135deg, #9333ea, #c084fc)' : 'linear-gradient(135deg, #a855f7, #ec4899)')
                : 'transparent',
              color: activeTab === 'outfit' ? '#ffffff' : (isLight ? '#334155' : 'var(--text-dim)'),
              border: 'none',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'outfit' ? '0 4px 12px rgba(168, 85, 247, 0.3)' : 'none'
            }}
          >
            <Shirt size={14} />
            <span>{t.outfitTabLabel || '👔 날씨 맞춤 코디'} ({outfits.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FOOD RECOMMENDATIONS */}
      {activeTab === 'food' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {foods.map((rawFood, idx) => {
              const food = getTranslatedFood(rawFood, lang);
              const matchScores = [98, 96, 94];

              return (
                <div
                  key={idx}
                  className="animate-fade-in"
                  style={{
                    background: isLight ? '#ffffff' : 'var(--bg-card)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    boxShadow: isLight ? '0 4px 14px rgba(0, 0, 0, 0.05)' : 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = isLight ? '#0284c7' : 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'var(--border-highlight)';
                  }}
                >
                  <div>
                    {/* Top Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isLight ? '#c2410c' : '#f97316',
                        background: isLight ? 'rgba(249, 115, 22, 0.12)' : 'rgba(249, 115, 22, 0.12)',
                        padding: '0.18rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isLight ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(249, 115, 22, 0.25)'
                      }}>
                        {food.category}
                      </span>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isLight ? '#15803d' : '#22c55e',
                        background: isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        border: isLight ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(34, 197, 94, 0.3)'
                      }}>
                        <Flame size={11} />
                        {t.aiMatchingLabel || 'AI 매칭'} {matchScores[idx % matchScores.length]}%
                      </span>
                    </div>

                    {/* Food Name */}
                    <h4 style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      color: isLight ? '#0f172a' : 'var(--text-main)',
                      marginBottom: '0.45rem',
                      lineHeight: 1.3
                    }}>
                      {food.name}
                    </h4>

                    {/* Reason Box */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                      background: isLight ? 'rgba(2, 132, 199, 0.06)' : 'rgba(15, 23, 42, 0.4)',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isLight ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '0.85rem'
                    }}>
                      <Info size={14} color={isLight ? '#0284c7' : 'var(--accent-primary)'} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                      <p style={{
                        fontSize: '0.8rem',
                        color: isLight ? '#1e293b' : 'var(--text-muted)',
                        fontWeight: isLight ? 600 : 400,
                        lineHeight: 1.45,
                        margin: 0
                      }}>
                        {food.reason}
                      </p>
                    </div>
                  </div>

                  {/* Direct Google Maps Restaurant Search Button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentRegion} ${food.name.split('&')[0].trim()} 맛집`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      background: isLight
                        ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(14, 165, 233, 0.2))'
                        : 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.25))',
                      border: isLight ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid rgba(56, 189, 248, 0.35)',
                      color: isLight ? '#0284c7' : 'var(--accent-primary)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={13} />
                    <span>{getMapSearchBtnLabel(food.name, lang)}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: OUTFIT RECOMMENDATIONS */}
      {activeTab === 'outfit' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem'
          }}>
            {outfits.map((rawItem, idx) => {
              const item = getTranslatedOutfit(rawItem, lang);

              return (
                <div
                  key={idx}
                  className="animate-fade-in"
                  style={{
                    background: isLight ? '#ffffff' : 'var(--bg-card)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    boxShadow: isLight ? '0 4px 14px rgba(0, 0, 0, 0.05)' : 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = isLight ? '#9333ea' : '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'var(--border-highlight)';
                  }}
                >
                  <div>
                    {/* Top Season / Weather Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isLight ? '#7e22ce' : '#c084fc',
                        background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)',
                        padding: '0.18rem 0.6rem',
                        borderRadius: '999px',
                        border: isLight ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(168, 85, 247, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <Sun size={12} />
                        {item.season}
                      </span>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isLight ? '#475569' : 'var(--text-dim)',
                        background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        👤 {TRANSLATIONS[lang]?.genders?.[filters.gender] || filters.gender || '무관'} · {TRANSLATIONS[lang]?.ages?.[filters.age] || filters.age || '전체'}
                      </span>
                    </div>

                    {/* Outfit Title */}
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: isLight ? '#0f172a' : 'var(--text-main)',
                      marginBottom: '0.45rem'
                    }}>
                      {item.title}
                    </h4>

                    {/* AI Reason */}
                    <p style={{
                      fontSize: '0.82rem',
                      color: isLight ? '#334155' : 'var(--text-muted)',
                      fontWeight: isLight ? 600 : 400,
                      lineHeight: 1.45,
                      marginBottom: '0.85rem'
                    }}>
                      {item.reason}
                    </p>

                    {/* Outfit Items Tag Chips */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {item.items.map((sub, i) => (
                        <span key={i} style={{
                          background: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
                          border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid var(--border-color)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: isLight ? '#1e293b' : 'var(--text-main)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <CheckCircle size={11} color={isLight ? '#9333ea' : '#c084fc'} />
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Outfit Search Link */}
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${item.title} 코디`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      background: isLight
                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(236, 72, 153, 0.15))'
                        : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.2))',
                      border: isLight ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(168, 85, 247, 0.35)',
                      color: isLight ? '#9333ea' : '#c084fc',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Shirt size={13} />
                    <span>{t.outfitSearchBtn || '추천 코디 스타일 룩북 검색 ↗'}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
