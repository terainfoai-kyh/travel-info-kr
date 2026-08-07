import React from 'react';
import { Wifi, CreditCard, Hotel, DollarSign, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function TravelEssentialsSection({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const ESSENTIALS = [
    {
      id: 'esim',
      icon: <Wifi size={24} color="#38bdf8" />,
      title: '무제한 데이터 eSIM / SIM',
      tag: 'Klook 15% 할인',
      desc: '한국 도착 즉시 개통되는 무제한 4G/5G 고속 데이터 SIM/eSIM',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeColor: '#38bdf8',
      link: 'https://www.klook.com/ko/search/result/?query=%ED%95%9C%EA%B5%AD%20eSIM&af_wid=31000'
    },
    {
      id: 'transit',
      icon: <CreditCard size={24} color="#818cf8" />,
      title: 'K-PASS & 공항철도 AREX',
      tag: '교통 필수 패스',
      desc: '인천공항 직통열차 & 대한민국 전역 지하철/버스 통합 교통권',
      badgeBg: 'rgba(129, 140, 248, 0.15)',
      badgeColor: '#818cf8',
      link: 'https://www.kkday.com/ko/product/search?keyword=%ED%95%9C%EA%B5%AD%20%EA%B5%90%ED%86%B5%EC%B9%B4%EB%93%9C&cid=17000'
    },
    {
      id: 'hotel',
      icon: <Hotel size={24} color="#f59e0b" />,
      title: '인기 지역 최고급 호텔 & 숙소',
      tag: 'Agoda 최저가 보장',
      desc: '서울, 제주, 부산, 경주 한옥 등 인근 숙소 최대 75% 특별 할인가',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#f59e0b',
      link: 'https://www.agoda.com/ko-kr/search?city=14690&cid=189000'
    },
    {
      id: 'taxfree',
      icon: <DollarSign size={24} color="#10b981" />,
      title: '택스 리펀 & 면세 쇼핑 팁',
      tag: '환급 혜택 가이드',
      desc: '주요 백화점, 마트, 올리브영 즉시 면세(Tax Refund) 환급 방법',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10b981',
      link: 'https://www.klook.com/ko/blog/korea-tax-refund-guide/'
    }
  ];

  return (
    <section style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-highlight)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      margin: '2rem 0',
      boxShadow: 'var(--shadow-glow)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            color: '#ffffff'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              ✈️ 한국 여행 필수 가이드 & 제휴 혜택
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              eSIM, 교통패스, 최저가 호텔 예약까지 원스톱으로 준비하세요
            </p>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.78rem',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700
        }}>
          <ShieldCheck size={14} />
          <span>공식 공식 제휴 할인가 적용</span>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.1rem'
      }}>
        {ESSENTIALS.map(item => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textDecoration: 'none',
              color: 'var(--text-main)',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)'
                }}>
                  {item.icon}
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: item.badgeBg,
                  color: item.badgeColor
                }}>
                  {item.tag}
                </span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem' }}>
                {item.desc}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.6rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--accent-primary)'
            }}>
              <span>혜택 상세 & 예약하기</span>
              <ExternalLink size={14} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
