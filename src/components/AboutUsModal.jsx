import React from 'react';
import { X, Sparkles, Target, Compass, Award } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function AboutUsModal({ isOpen, onClose, lang = 'ko' }) {
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
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'About VORA AI' : 'VORA AI 서비스 소개 (About VORA)'}
            </h2>
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

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {lang === 'en' ? (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  "Experience South Korea Like a Local, Powered by Next-Gen AI"
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI (koreatravel.cc) is a next-generation conversational AI travel concierge dedicated to international visitors exploring South Korea.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>Our Mission</span>
                </h4>
                <p style={{ margin: 0 }}>
                  Moving beyond generic and rigid package tours, we empower global travelers to discover Korea's vibrant culture — from <strong>Seongsu-dong pop-up stores, hidden alley cafes, K-drama pilgrimage spots, to romantic night views</strong> — all tailored through a single natural conversation.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>Core Technologies & Partnerships</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>Google Gemini 3.0 AI</strong>: Advanced natural language itinerary orchestration<br />
                  • <strong>Google Places Platform</strong>: Official global places, verified ratings & HD photos<br />
                  • <strong>Google Maps Platform</strong>: Seamless global navigation and deep-linked routes<br />
                  • Complete 4-language support: Korean, English, Japanese, and Chinese
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  "대한민국 여행의 모든 것, AI와 함께 가장 트렌디하게"
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI(koreatravel.cc)는 대한민국을 찾는 전 세계 여행객을 위해 탄생한 차세대 대화형 스마트 여행 컨시어지 플랫폼입니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>우리의 미션 (Our Mission)</span>
                </h4>
                <p style={{ margin: 0 }}>
                  기존의 뻔하고 딱딱한 패키지 여행 코스에서 벗어나, 외국인과 MZ세대가 진정으로 원하는 <strong>'성수동 팝업스토어, 골목길 감성 카페, K-드라마 성지, 로컬 야경 명소'</strong> 등 살아있는 대한민국 문화를 자연어 대화 한 줄로 완벽하게 설계해 드립니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>핵심 기술 및 파트너십</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>Google Gemini 3.0 AI</strong> 최신 자연어 여행 설계 지능 탑재<br />
                  • <strong>Google Places Platform</strong> 글로벌 공식 위치 및 고화질 사진 연동<br />
                  • <strong>Google Maps Platform</strong> 글로벌 표준 지도 및 길찾기 딥링크 연동<br />
                  • 한국어, 영어, 일본어, 중국어 4대 언어 완벽 지원
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Close */}
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
