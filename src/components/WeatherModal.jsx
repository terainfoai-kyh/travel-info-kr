import React, { useState } from 'react';
import { X, CloudSun, Sun, CloudRain, Wind, Thermometer, MapPin } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function WeatherModal({
  isOpen = false,
  onClose,
  lang = 'ko',
  initialRegion = '서울'
}) {
  const [selectedCity, setSelectedCity] = useState(initialRegion || '서울');

  if (!isOpen) return null;

  const CITIES = ['서울', '부산', '제주', '강릉', '경주', '전주', '여수', '속초', '인천', '대구'];

  const WEATHER_DATA = {
    '서울': { temp: '22°C', weather: '맑음 ☀️', rain: '10%', dust: '좋음', outfit: '가벼운 셔츠, 슬랙스, 자켓' },
    '부산': { temp: '24°C', weather: '구름조금 ⛅', rain: '20%', dust: '보통', outfit: '반팔 티셔츠, 얇은 가디건' },
    '제주': { temp: '25°C', weather: '화창함 ☀️', rain: '0%', dust: '좋음', outfit: '린넨 셔츠, 반바지, 선글라스' },
    '강릉': { temp: '21°C', weather: '시원한 바람 🌤️', rain: '15%', dust: '좋음', outfit: '긴팔 티셔츠, 바람막이' },
    '경주': { temp: '23°C', weather: '맑음 ☀️', rain: '10%', dust: '보통', outfit: '편안한 운동화, 면바지' },
    '전주': { temp: '23°C', weather: '맑음 ☀️', rain: '5%', dust: '좋음', outfit: '단정한 셔츠, 한복 체험 추천' },
    '여수': { temp: '24°C', weather: '바다바람 🌤️', rain: '20%', dust: '좋음', outfit: '캐주얼 룩, 얇은 겉옷' },
    '속초': { temp: '20°C', weather: '쾌적함 ☀️', rain: '10%', dust: '좋음', outfit: '활동성 좋은 트래킹 룩' },
    '인천': { temp: '22°C', weather: '맑음 ☀️', rain: '10%', dust: '보통', outfit: '가벼운 캐주얼 자켓' },
    '대구': { temp: '26°C', weather: '화창함 ☀️', rain: '0%', dust: '보통', outfit: '시원한 반팔 및 모자' }
  };

  const current = WEATHER_DATA[selectedCity] || WEATHER_DATA['서울'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CloudSun size={24} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              대한민국 실시간 날씨 & 옷차림 가이드
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* City Selection Chips */}
        <div style={{
          padding: '1rem 1.5rem 0.5rem 1.5rem',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              style={{
                backgroundColor: selectedCity === c ? 'var(--accent-primary)' : 'var(--bg-primary)',
                color: selectedCity === c ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: selectedCity === c ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Weather Main Card */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <MapPin size={16} />
              <span>{selectedCity} 현재 기상 현황</span>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: '0.5rem 0' }}>
              {current.temp}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              {current.weather}
            </div>

            {/* Sub Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>강수 확률</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                  {current.rain}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>미세먼지 지수</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981', marginTop: '0.2rem' }}>
                  {current.dust}
                </div>
              </div>
            </div>
          </div>

          {/* Outfit Recommendation */}
          <div style={{
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Thermometer size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                추천 여행 옷차림 (Outfit)
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {current.outfit}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {getCloseButtonLabel(lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
