import React from 'react';
import { Train, CreditCard, Wifi, PhoneCall, ShieldCheck, ExternalLink, Hotel } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function TravelEssentialsSection({ lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const ESSENTIAL_CARDS = [
    {
      icon: <Train size={24} style={{ color: '#2563eb' }} />,
      title: t.subwayMapTitle || '지하철 노선도 & 길찾기',
      desc: t.subwayMapDesc || '서울, 부산 등 전국 지하철 실시간 노선도 및 환승 가이드',
      badge: '교통 필수',
      linkText: '지하철 노선도 보기 ↗',
      linkUrl: 'http://www.seoulmetro.co.kr/kr/cyberStation.do'
    },
    {
      icon: <CreditCard size={24} style={{ color: '#10b981' }} />,
      title: t.climateCardTitle || '기후동행카드 & T-Money',
      desc: t.climateCardDesc || '외국인 단기권 구매처 및 대중교통 무제한 이용 팁',
      badge: '비용 절약',
      linkText: '기후동행카드 안내 ↗',
      linkUrl: 'https://news.seoul.go.kr/traffic/archives/510740'
    },
    {
      icon: <Wifi size={24} style={{ color: '#8b5cf6' }} />,
      title: t.esimTitle || 'eSIM & 포켓 와이파이',
      desc: t.esimDesc || '인천공항 수령 및 즉시 사용 가능한 데이터 플랜',
      badge: '데이터 무제한',
      linkText: 'Klook eSIM 예약 ↗',
      linkUrl: 'https://www.klook.com/ko/search?query=%ED%95%9C%EA%B5%AD%20eSIM'
    },
    {
      icon: <PhoneCall size={24} style={{ color: '#ef4444' }} />,
      title: t.helplineTitle || '1330 관광 안내 & 통역',
      desc: t.helplineDesc || '24시간 연중무휴 무료 4개 국어 긴급 통역 및 여행 지원',
      badge: '24시간 지원',
      linkText: '1330 공식 안내 ↗',
      linkUrl: 'https://korean.visitkorea.or.kr/main/1330.do'
    }
  ];

  return (
    <section style={{
      padding: '1.25rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--accent-primary)',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '0.5rem'
        }}>
          <ShieldCheck size={15} />
          <span>Travel Essentials</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          {t.essentialsTitle || '외국인 관광객 필수 툴킷'}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
          {t.essentialsSubtitle || '안전하고 편리한 한국 여행을 위한 핵심 서비스'}
        </p>
      </div>

      {/* 4-Grid Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {ESSENTIAL_CARDS.map((card, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  color: 'var(--accent-primary)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px'
                }}>
                  {card.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                {card.desc}
              </p>
            </div>

            <a
              href={card.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                textDecoration: 'none'
              }}
            >
              <span>{card.linkText}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
