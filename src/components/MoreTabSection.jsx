import React from 'react';
import { Sun, Sparkles } from 'lucide-react';
import TravelEssentialsSection from './TravelEssentialsSection';
import AdSenseArticlesSection from './AdSenseArticlesSection';
import AdSenseBanner from './AdSenseBanner';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * MoreTabSection.jsx - 더보기(More) 탭 전용 컴포넌트
 * 
 * 1. 실시간 날씨 및 교통/결제/eSIM 여행 필수 정보 (Travel Essentials)
 * 2. 여행자 필수 에디토리얼 가이드 & FAQ
 * 3. 조용한 구글 애드센스 배너
 * (중복 박스 제거 완료 ➔ 정책 링크는 하단 글로벌 푸터로 단정하게 1줄 통합)
 * ==============================================================================
 */

export default function MoreTabSection({
  lang = 'ko',
  targetCity = '서울',
  onOpenWeather,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
  onOpenContact,
  onOpenEssentials
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', paddingBottom: '0.5rem' }}>
      {/* 1. Travel Essentials Section (Weather & Styling, Subway, Climate card, eSIM, 1330) */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sun size={20} style={{ color: '#f59e0b' }} />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.travelEssentialsTitle || '대한민국 여행 필수 안내 & 스마트 팁'}
          </h3>
        </div>

        <TravelEssentialsSection
          lang={lang}
          targetCity={targetCity}
          onOpenWeather={onOpenWeather}
        />
      </div>

      {/* 2. Google AdSense Quiet Unit */}
      <AdSenseBanner slot="7890123456" />

      {/* 3. Helpful Editorial Articles & FAQ */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <AdSenseArticlesSection lang={lang} />
      </div>
    </div>
  );
}
