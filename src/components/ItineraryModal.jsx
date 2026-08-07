import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Sparkles, Navigation, Share2, Copy, Check } from 'lucide-react';
import { generateSmartItinerary } from '../services/recommendationEngine';
import { TRANSLATIONS } from '../i18n/translations';

export default function ItineraryModal({ isOpen, onClose, filters, spots, lang, onSelectSpot }) {
  const [selectedDays, setSelectedDays] = useState(2);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const region = filters?.region || '서울';
  const theme = filters?.theme || '전체';

  const itinerary = generateSmartItinerary({
    region,
    theme,
    days: selectedDays,
    spots
  });

  const handleCopyItinerary = () => {
    let summaryText = `[K-Travel Explorer] ${region} ${selectedDays}박 ${selectedDays + 1}일 추천 코스\n\n`;
    itinerary.forEach(day => {
      summaryText += `📌 ${day.dayTitle}\n`;
      day.schedule.forEach(s => {
        summaryText += `  • [${s.time}] ${s.title} (${s.location})\n`;
      });
      summaryText += `\n`;
    });
    summaryText += `🔗 전체 코스 보기: https://koreatravel.cc/?region=${encodeURIComponent(region)}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getMapLink = (spotTitle, location) => {
    const query = encodeURIComponent(`${spotTitle} ${location}`);
    if (lang === 'ko') {
      return `https://map.kakao.com/link/search/${query}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in glass-panel"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative',
          padding: '1.5rem 1.75rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.2)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-primary)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }} className="gradient-text">
              AI 스마트 여행 코스 추천
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {region} · {theme} 맞춤 시간대별 최적 추천 동선
            </p>
          </div>
        </div>

        {/* Days Selector Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          margin: '1.25rem 0',
          padding: '0.85rem 1rem',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>여행 기간 선택:</span>
            {[1, 2, 3].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDays(d)}
                style={{
                  background: selectedDays === d ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                  color: selectedDays === d ? '#ffffff' : 'var(--text-muted)',
                  border: selectedDays === d ? 'none' : '1px solid var(--border-color)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {d === 1 ? '당일치기 (1 Day)' : `${d - 1}박 ${d}일 (${d} Days)`}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyItinerary}
            style={{
              background: copied ? '#22c55e' : 'var(--bg-secondary)',
              border: '1px solid var(--border-highlight)',
              color: '#ffffff',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '코스 텍스트 복사완료!' : '코스 텍스트 복사하기'}</span>
          </button>
        </div>

        {/* Timeline Itinerary Days Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {itinerary.map(day => (
            <div key={day.day} style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--accent-primary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.6rem'
              }}>
                <span>🗓️</span>
                <span>{day.dayTitle}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {day.schedule.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color)',
                    flexWrap: 'wrap'
                  }}>
                    {/* Time Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-primary)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0
                    }}>
                      <Clock size={14} />
                      <span>{item.time}</span>
                    </div>

                    {/* Spot Image */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '1px solid var(--border-color)'
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {item.slotName}
                      </div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.1rem 0' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        <MapPin size={13} color="var(--accent-primary)" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Map Link Action */}
                    <a
                      href={getMapLink(item.title, item.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-highlight)',
                        color: 'var(--accent-primary)',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <Navigation size={13} />
                      <span>지도 경로</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
