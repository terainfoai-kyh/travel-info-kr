import React from 'react';
import { X, Train, CreditCard, Wifi, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function TravelEssentialsModal({
  isOpen = false,
  onClose,
  lang = 'ko'
}) {
  if (!isOpen) return null;

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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
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
            <ShieldCheck size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              한국 여행 필수 가이드 & 툴킷
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

        {/* Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Subway Section */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Train size={20} style={{ color: '#2563eb' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                1. 지하철 및 대중교통 이용 팁
              </h4>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              서울 지하철은 1호선부터 9호선 및 신분당선, 수인분당선까지 전 노선이 촘촘하게 연결되어 있습니다. 영문 및 다국어 안내방송과 번호 표지판이 완비되어 있어 초행자도 쉽게 이동할 수 있습니다.
            </p>
            <a
              href="http://www.seoulmetro.co.kr/kr/cyberStation.do"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                textDecoration: 'none'
              }}
            >
              <span>서울교통공사 실시간 노선도 ↗</span>
            </a>
          </div>

          {/* Transit Card Section */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CreditCard size={20} style={{ color: '#10b981' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                2. 기후동행카드(단기권) & T-Money 카드
              </h4>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              • <strong>기후동행카드 단기권:</strong> 1일권(5,000원), 2일권(8,000원), 3일권(10,000원), 5일권(15,000원)으로 서울 시내 대중교통 무제한 탑승 가능.<br />
              • <strong>구매처:</strong> 서울역, 명동역, 홍대입구역 등 주요 역사 고객안전실 또는 편의점.
            </p>
          </div>

          {/* Emergency Helpline Section */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PhoneCall size={20} style={{ color: '#ef4444' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#b91c1c' }}>
                3. 1330 한국관광통역안내전화 (24시간 무료)
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              여행 중 길을 잃었거나 식당/택시에서 의사소통이 어려울 때, 분실물이나 응급상황 발생 시 언제든지 <strong>국번 없이 1330</strong>으로 전화하시면 전문 상담사가 3자 통역을 무료로 지원합니다.
            </p>
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
