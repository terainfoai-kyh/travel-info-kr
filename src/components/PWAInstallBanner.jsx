import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Sparkles, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function PWAInstallBanner({ lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    const isDismissed = localStorage.getItem('ktravel_pwa_banner_dismissed');
    if (isDismissed) return;

    const ua = (navigator.userAgent || '').toLowerCase();
    const kakao = ua.includes('kakaotalk');
    const ios = ua.includes('iphone') || ua.includes('ipad') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsKakaoInApp(kakao);
    setIsIOS(ios);

    // Listen for Chrome/Android/Samsung PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If in KakaoTalk or iOS, show banner to guide home screen shortcut
    if (kakao || ios) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else if (isKakaoInApp) {
      // Guide user or attempt external browser launch
      setShowIOSGuide(true);
    } else {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('ktravel_pwa_banner_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Floating PWA Shortcut Banner */}
      <div 
        className="animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2.5rem)',
          maxWidth: '520px',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
          <img 
            src="/pwa-192x192.png" 
            alt="Travel Korea Icon" 
            style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
                {isKakaoInApp ? '📲 카카오톡 바로가기 앱' : '📱 핸드폰 바로가기 추가'}
              </span>
              <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 900, padding: '0.08rem 0.35rem', borderRadius: '4px' }}>
                NEW
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isKakaoInApp 
                ? '카카오톡 없이 홈 화면에서 바로 터치하여 접속하세요!'
                : '스마트폰 바탕화면에 앱으로 등록하여 빠르게 들어오세요!'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <button
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Download size={14} />
            <span>바로가기 추가</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="닫기"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS / Kakao Home Screen Shortcut Guide Modal */}
      {showIOSGuide && (
        <div className="modal-overlay-backdrop" onClick={() => setShowIOSGuide(false)} style={{ zIndex: 10000 }}>
          <div 
            className="animate-fade-in glass-panel"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              maxWidth: '440px',
              width: 'calc(100% - 2rem)',
              boxShadow: 'var(--shadow-xl)',
              color: 'var(--text-main)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/pwa-192x192.png" alt="Travel Korea" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>핸드폰 홈 화면에 추가하는 방법</h3>
              </div>
              <button onClick={() => setShowIOSGuide(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              카카오톡이나 브라우저를 매번 열 필요 없이, 아래 순서대로 **스마트폰 홈 화면(바탕화면)**에 1초 만에 바로가기 앱을 추가해 보세요!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'var(--bg-primary)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>크롬/사파리 등 브라우저 메뉴 열기</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {isKakaoInApp ? '우측 하단 (⋮ 또는 ⚙️) ➔ "다른 브라우저로 열기" 선택 후' : '하단/상단 브라우저 공유/설정 아이콘 터치'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'var(--bg-primary)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>"홈 화면에 추가" (Add to Home Screen) 선택</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>아이폰: 공유(📤) 버튼 ➔ "홈 화면에 추가(➕)"</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>안드로이드: 더보기(⋮) ➔ "앱 설치" 또는 "홈 화면에 추가"</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 800 }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
