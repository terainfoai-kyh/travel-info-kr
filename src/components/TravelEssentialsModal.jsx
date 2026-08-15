import React from 'react';
import ReactDOM from 'react-dom';
import { Wifi, CreditCard, Hotel, DollarSign, ExternalLink, Sparkles, ShieldCheck, X, Check, Tag } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';

export default function TravelEssentialsModal({ isOpen, onClose, lang = 'ko', targetRegion = '서울' }) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const ESSENTIALS = [
    {
      id: 'esim',
      icon: <Wifi size={24} color="#0284c7" />,
      title: t.esimTitle || '무제한 4G/5G 데이터 eSIM & USIM',
      tag: 'Klook 15% 단독할인',
      badgeBg: 'rgba(2, 132, 199, 0.1)',
      badgeColor: '#0284c7',
      desc: t.esimDesc || '인천/김포/김해공항 도착 즉시 QR코드로 간편 개통되는 한국 무제한 고속 데이터 패스',
      features: ['실시간 통신망 100% 보장', 'QR코드 즉시 발급', '핫스팟 테더링 지원'],
      link: buildKlookDeepLink('한국 eSIM'),
      btnText: 'eSIM 15% 할인가로 예약하기'
    },
    {
      id: 'transit',
      icon: <CreditCard size={24} color="#7c3aed" />,
      title: t.transitTitle || '공항철도 AREX 직통열차 & 교통카드',
      tag: 'KKday 공식 제휴',
      badgeBg: 'rgba(124, 58, 237, 0.1)',
      badgeColor: '#7c3aed',
      desc: t.transitDesc || '인천공항 ➔ 서울역 43분 쾌속 직통열차 및 전국 지하철/버스/편의점 통합 T-Money 패스',
      features: ['공항철도 AREX 직통 승차권', '전국 대중교통 자유 탑승', 'WOWPASS 올인원 지원'],
      link: buildKKdayDeepLink('한국 교통카드'),
      btnText: '교통패스 특가 예약하기'
    },
    {
      id: 'hotel',
      icon: <Hotel size={24} color="#ea580c" />,
      title: `[${targetRegion}] 추천 호텔 & 감성 숙소`,
      tag: 'Agoda 최저가 보장',
      badgeBg: 'rgba(234, 88, 12, 0.1)',
      badgeColor: '#ea580c',
      desc: `${targetRegion} 주요 관광지 및 지하철역 인근 인기 호텔, 리조트, 한옥 스테이 최대 75% 특별 제휴가`,
      features: ['최저가 보상제 적용', '무료 취소 가능 객실 다수', '외국인 선호 평점 9.0+ 숙소'],
      link: buildAgodaDeepLink(targetRegion),
      btnText: `${targetRegion} 숙소 특가 확인하기`
    },
    {
      id: 'taxfree',
      icon: <DollarSign size={24} color="#059669" />,
      title: t.taxfreeTitle || '택스 리펀(Tax Refund) & 쇼핑 패스',
      tag: '쇼핑 혜택 가이드',
      badgeBg: 'rgba(5, 150, 105, 0.1)',
      badgeColor: '#059669',
      desc: '올리브영, 주요 백화점, 마트 즉시 면세 환급 꿀팁 및 한국 대표 쇼핑몰/액티비티 할인 쿠폰',
      features: ['여권 제시 즉시 환급 방법 안내', 'K-뷰티/패션 쇼핑 쿠폰북', '공항 환급 창구 위치 안내'],
      link: buildKlookDeepLink('한국 쇼핑 면세'),
      btnText: '쇼핑 할인 쿠폰 받기'
    }
  ];

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
          maxWidth: '820px',
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
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  ✈️ 한국 여행 필수템 & 공식 제휴 혜택관
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px'
                }}>
                  공식 파트너 인증
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', margin: '0.2rem 0 0 0' }}>
                eSIM · 공항철도 AREX · 대중교통카드 · 최저가 호텔까지 원스톱 제휴 특가로 준비하세요
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Cards Grid */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          maxHeight: 'calc(90vh - 150px)'
        }}>
          {ESSENTIALS.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: item.badgeBg,
                    color: item.badgeColor
                  }}>
                    {item.tag}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-main, #0f172a)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem' }}>
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
                      <Check size={13} color="#059669" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'opacity 0.2s'
                }}
              >
                <span>{item.btnText}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #94a3b8)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#059669" />
            본 제휴 링크는 한국관광공사 및 Klook/Agoda 공식 제휴 규정을 준수합니다.
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem 0.9rem',
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
