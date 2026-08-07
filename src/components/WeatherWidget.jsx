import React from 'react';
import { Sun, Cloud, CloudRain, Thermometer, Umbrella, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function WeatherWidget({ weatherData, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  if (!weatherData) return null;

  const renderIcon = () => {
    switch (weatherData.weatherIcon) {
      case 'Cloud': return <Cloud size={40} color="#38bdf8" />;
      case 'CloudRain': return <CloudRain size={40} color="#818cf8" />;
      case 'Sun':
      default: return <Sun size={40} color="#f59e0b" />;
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-highlight)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-glow)'
    }}>
      {/* Short-Term Weather Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        paddingBottom: weatherData.midTermForecast?.length > 0 ? '1.25rem' : '0',
        borderBottom: weatherData.midTermForecast?.length > 0 ? '1px solid var(--border-color)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)'
          }}>
            {renderIcon()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                {t.regions?.[weatherData.region] || weatherData.region}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.weatherTitle} ({weatherData.forecastDate})
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.weatherMap?.[weatherData.weatherText] || weatherData.weatherText}
            </h3>
          </div>
        </div>

        {/* Short-Term Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Thermometer size={24} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t.weatherTempLabel || '현재/단기 기온'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{weatherData.temperature}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Umbrella size={24} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t.weatherPopLabel || '강수확률'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{weatherData.rainProbability}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mid-Term Weather Forecast Section (기상청 중기예보: 3일~7일차) */}
      {weatherData.midTermForecast && weatherData.midTermForecast.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--accent-primary)" />
            {t.midTermTitle || '기상청 중기예보 전망 (3일 ~ 7일차 주간 기후 & 최고/최저 기온)'}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}>
            {weatherData.midTermForecast.map((mid, idx) => {
              const getIcon = (ic) => {
                if (ic === 'CloudRain') return <CloudRain size={20} color="#818cf8" />;
                if (ic === 'Cloud') return <Cloud size={20} color="#38bdf8" />;
                return <Sun size={20} color="#f59e0b" />;
              };

              return (
                <div key={idx} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    +{mid.dayOffset}{t.dayOffsetLabel || '일후 예보'}
                  </span>
                  <div style={{ margin: '0.2rem 0' }}>{getIcon(mid.weatherIcon)}</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.weatherMap?.[mid.weatherText] || mid.weatherText}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    🌧️ {mid.pop} | 🌡️ {mid.tempRange}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
