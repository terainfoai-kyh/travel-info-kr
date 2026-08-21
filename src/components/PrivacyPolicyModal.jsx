import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function PrivacyPolicyModal({ isOpen, onClose, lang = 'ko' }) {
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
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'Privacy Policy' : '개인정보처리방침 (Privacy Policy)'}
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
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. General Provisions & Information Collected
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI (koreatravel.cc) values user privacy and complies with applicable international privacy standards. As a free travel intelligence platform usable without account registration, we do not collect, store, or sell any sensitive personal identification data.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. Cookies & Google AdSense Advertising Policies
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  This website utilizes browser local storage (localStorage) and standard cookies to remember user preferences (such as selected language, wishlist bookmarks, and dark mode).
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google AdSense & Third-Party Cookies Policy:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google Analytics
                </h4>
                <p style={{ margin: 0 }}>
                  We use Google Analytics to monitor traffic and aggregate usage metrics in order to improve user experience. All collected data is anonymized and cannot identify individual users.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. Privacy Officer & Inquiries
                </h4>
                <p style={{ margin: 0 }}>
                  For inquiries or suggestions regarding our privacy practices, please contact us at:<br />
                  • Email: <strong>terainfoai@gmail.com</strong>
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. 총칙 및 수집하는 정보
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI(koreatravel.cc)는 이용자의 개인정보를 중요시하며, '개인정보 보호법' 및 관련 법령을 준수합니다. 본 서비스는 회원가입 없이 이용 가능한 무료 여행 정보 플랫폼으로, 이용자의 민감한 개인 식별 정보를 일체 저장하거나 요구하지 않습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. 쿠키(Cookie) 및 Google AdSense 광고 정책 준수
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  본 웹사이트는 이용자 편의(언어 설정, 위시리스트 저장, 다크모드 설정)를 위해 브라우저 로컬 저장소(localStorage) 및 쿠키를 활용합니다.
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google 애드센스 및 제3자 쿠키 정책:</strong> Google을 포함한 타사 공급업체는 쿠키를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 광고를 게재합니다. Google의 DART 쿠키 사용을 통해 Google 및 파트너는 사용자의 인터넷 사이트 방문을 기반으로 적절한 맞춤 광고를 게재할 수 있습니다. 사용자는 Google 광고 설정(https://www.google.com/settings/ads)을 방문하여 맞춤설정 광고를 선택 해제할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google Analytics (웹로그 분석)
                </h4>
                <p style={{ margin: 0 }}>
                  본 서비스는 방문자의 트래픽 및 사용 통계를 분석하여 서비스 품질을 개선하기 위해 Google Analytics를 사용합니다. 수집되는 데이터는 익명화 처리되며 개인을 식별할 수 없습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. 개인정보 보호책임자 및 문의처
                </h4>
                <p style={{ margin: 0 }}>
                  서비스 이용 중 개인정보와 관련된 문의사항이나 정책에 대한 의견은 아래 공식 연락처로 문의해 주시기 바랍니다.<br />
                  • 이메일: <strong>terainfoai@gmail.com</strong>
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
