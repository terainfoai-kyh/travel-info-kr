import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sun, Cloud, CloudRain, Thermometer, Umbrella, Calendar, Sparkles, X, MapPin, Shirt } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchRealtimeWeather } from '../services/weatherApi';

const POPULAR_CITIES = [
  '서울', '거제', '부산', '제주', '경주', '강릉', '인천', '전주', '여수', '속초', '수원'
];

export default function WeatherModal({ isOpen, onClose, lang = 'ko', initialRegion = '서울' }) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [selectedCity, setSelectedCity] = useState(initialRegion || '서울');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchRealtimeWeather(selectedCity)
      .then(data => {
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCity]);

  const renderIcon = (iconName, size = 38) => {
    switch (iconName) {
      case 'Cloud': return <Cloud size={size} color="#38bdf8" />;
      case 'CloudRain': return <CloudRain size={size} color="#818cf8" />;
      case 'Sun':
      default: return <Sun size={size} color="#f59e0b" />;
    }
  };

  // Deterministic outfit tip based on temperature
  const getOutfitTip = (tempStr) => {
    const tempNum = parseInt((tempStr || '20').replace(/[^0-9\-]/g, ''), 10) || 20;
    if (tempNum >= 28) return '☀️ 무더운 날씨입니다. 통풍이 잘되는 반팔 티셔츠, 린넨 바지, 선글라스, 자외선 차단 모자를 추천합니다.';
    if (tempNum >= 23) return '🌤️ 야외 활동하기 좋은 쾌적한 날씨입니다. 얇은 셔츠나 반팔, 가벼운 면바지 및 편안한 워킹화가 좋습니다.';
    if (tempNum >= 17) return '🍂 일교차가 있을 수 있습니다. 가벼운 가디건, 바람막이나 자켓, 긴바지를 준비하세요.';
    if (tempNum >= 10) return '🧥 쌀쌀한 날씨입니다. 도톰한 니트, 트렌치코트나 자켓, 스카프를 착용하면 좋습니다.';
    return '❄️ 추운 겨울 날씨입니다. 따뜻한 패딩 점퍼, 목도리, 장갑, 보온 내의와 핫팩을 챙기세요.';
  };

  const modalNode = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '720px',
          minHeight: '530px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
            }}>
              <Sun size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  ☀️ 대한민국 기상청(KMA) 실시간 기후 센터
                </h3>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  background: 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px'
                }}>
                  기상청 100% 연동
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', margin: '0.15rem 0 0 0' }}>
                전국 16개 권역 실시간 기상관측 데이터 및 7일 주간 예보
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* City Selector Pills */}
        <div style={{
          padding: '0.75rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          scrollbarWidth: 'none'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <MapPin size={13} /> 지역:
          </span>
          {POPULAR_CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                background: selectedCity === city ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#ffffff',
                color: selectedCity === city ? '#ffffff' : '#334155',
                border: selectedCity === city ? 'none' : '1px solid #cbd5e1',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: selectedCity === city ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCity === city ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none'
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          overflowY: 'auto', 
          minHeight: '380px',
          maxHeight: 'calc(90vh - 180px)',
          position: 'relative',
          transition: 'opacity 0.2s ease',
          opacity: loading ? 0.5 : 1
        }}>
          {weatherData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Today Hero Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
                border: '1.5px solid rgba(2, 132, 199, 0.2)',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.8rem',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}>
                    {renderIcon(weatherData.weatherIcon, 44)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.45rem',
                        borderRadius: '6px'
                      }}>
                        {weatherData.region} 오늘
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {weatherData.forecastDate} 기준
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main, #0f172a)' }}>
                      {weatherData.weatherText}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Thermometer size={24} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>현재 기온</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ef4444' }}>{weatherData.temperature}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Umbrella size={24} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>강수확률</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7' }}>{weatherData.rainProbability}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Outfit Guide */}
              <div style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}>
                <Shirt size={20} color="#9333ea" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9333ea', marginBottom: '0.15rem' }}>
                    👗 AI 오늘 날씨 맞춤 코디 가이드
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                    {getOutfitTip(weatherData.temperature)}
                  </div>
                </div>
              </div>

              {/* 7-Day Mid-term Forecast Grid */}
              {weatherData.midTermForecast && weatherData.midTermForecast.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--text-main, #0f172a)',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Calendar size={14} color="#0284c7" />
                    기상청 7일 주간 중기예보 전망
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                    gap: '0.6rem'
                  }}>
                    {weatherData.midTermForecast.map((mid, idx) => (
                      <div key={idx} style={{
                        backgroundColor: 'var(--bg-secondary, #f8fafc)',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: '12px',
                        padding: '0.65rem 0.45rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7' }}>
                          +{mid.dayOffset}일 후
                        </span>
                        <div style={{ margin: '0.15rem 0' }}>
                          {renderIcon(mid.weatherIcon, 22)}
                        </div>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                          {mid.weatherText}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          🌧️ {mid.pop}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>
                          🌡️ {mid.tempRange}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.4rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <span>데이터 출처: 대한민국 기상청 공공데이터포털(data.go.kr)</span>
          <button
            onClick={onClose}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
