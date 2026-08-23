import React from 'react';
import { Sun, Shield, FileText, Info, Mail, Download, Globe, Moon, Sparkles } from 'lucide-react';
import TravelEssentialsSection from './TravelEssentialsSection';
import AdSenseArticlesSection from './AdSenseArticlesSection';
import AdSenseBanner from './AdSenseBanner';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * MoreTabSection.jsx - 더보기(More) 탭 전용 컴포넌트
 * 
 * 1. 실시간 날씨 및 교통/결제/eSIM 여행 필수 정보 (Travel Essentials)
 * 2. 다국어 설정 및 다크/라이트 테마 제어
 * 3. PWA 홈 화면 앱 설치 안내
 * 4. 정책(이용약관, 개인정보처리방침) 및 공식 제휴 문의
 * 5. 조용한 구글 애드센스 배너 1개 배치
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
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

      {/* 4. Service Policies & Official Contact Links */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)' }}>
          {lang === 'en' ? 'Customer Support & Policies' : lang === 'ja' ? 'カスタマーサポート＆規約' : (lang === 'zh' || lang === 'zht') ? '客户支持与政策' : '고객 지원 및 정책'}
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <button
            onClick={onOpenPrivacy}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Shield size={16} style={{ color: '#38bdf8' }} />
            <span>{t.privacyPolicy || '개인정보처리방침'}</span>
          </button>

          <button
            onClick={onOpenTerms}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} style={{ color: '#38bdf8' }} />
            <span>{t.termsOfService || '이용약관'}</span>
          </button>

          <button
            onClick={onOpenAbout}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Info size={16} style={{ color: '#38bdf8' }} />
            <span>{t.aboutUs || '서비스 소개'}</span>
          </button>

          <button
            onClick={onOpenContact}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Mail size={16} style={{ color: '#38bdf8' }} />
            <span>{t.contactUs || '제휴 및 문의'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
