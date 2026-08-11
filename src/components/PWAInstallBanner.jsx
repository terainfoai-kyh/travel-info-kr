import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';

const PWA_I18N = {
  ko: {
    bannerTitle: '📱 스마트폰 홈 화면 바로가기',
    bannerDesc: '바탕화면에 추가하고 터치 한 번으로 빠르게 접속하세요!',
    badgeNew: 'NEW',
    installBtn: '바로가기 추가',
    guideModalTitle: '핸드폰 홈 화면에 추가하는 방법',
    guideModalSub: '카카오톡이나 브라우저를 매번 열 필요 없이, 스마트폰 홈 화면(바탕화면)에 1초 만에 바로가기 앱을 추가해 보세요!',
    step1Title: '1. 브라우저 메뉴 열기',
    step1DescKakao: '카카오톡 우측 하단 (⋮ 또는 ⚙️) ➔ "다른 브라우저로 열기" 선택 후',
    step1DescGeneral: '하단/상단 브라우저 공유 또는 설정 메뉴 터치',
    step2Title: '2. "홈 화면에 추가" (Add to Home Screen) 선택',
    step2DescIOS: '아이폰: 사파리 하단 공유(📤) 버튼 ➔ "홈 화면에 추가(➕)"',
    step2DescAndroid: '안드로이드: 더보기(⋮) 메뉴 ➔ "앱 설치" 또는 "홈 화면에 추가"',
    confirmBtn: '확인'
  },
  en: {
    bannerTitle: '📱 Add to Home Screen',
    bannerDesc: 'Add shortcut to home screen for 1-tap fast access!',
    badgeNew: 'NEW',
    installBtn: 'Add Shortcut',
    guideModalTitle: 'How to Add to Home Screen',
    guideModalSub: 'Access K-Travel instantly from your smartphone home screen without opening browser links every time!',
    step1Title: '1. Open Browser Menu',
    step1DescKakao: 'In KakaoTalk, select (⋮) ➔ "Open in External Browser"',
    step1DescGeneral: 'Tap Share or Menu icon in your mobile browser',
    step2Title: '2. Select "Add to Home Screen"',
    step2DescIOS: 'iPhone: Tap Share (📤) ➔ "Add to Home Screen (➕)"',
    step2DescAndroid: 'Android: Tap Menu (⋮) ➔ "Install App" or "Add to Home Screen"',
    confirmBtn: 'Got it'
  },
  ja: {
    bannerTitle: '📱 ホーム画面に追加',
    bannerDesc: 'ホーム画面に追加してワンタップで即アクセス！',
    badgeNew: 'NEW',
    installBtn: '追加する',
    guideModalTitle: 'ホーム画面への追加方法',
    guideModalSub: '毎回ブラウザを開く必要なく、スマホのホーム画面から1タップでアクセスできます！',
    step1Title: '1. ブラウザメニューを開く',
    step1DescKakao: 'カカ오トーク右下 (⋮) ➔ "他のブラウザで開く" を選択',
    step1DescGeneral: 'ブラウザの共有または menu アイコンをタップ',
    step2Title: '2. "ホーム画面に追加" を選択',
    step2DescIOS: 'iPhone: 共有 (📤) ➔ "ホーム画面に追加 (➕)"',
    step2DescAndroid: 'Android: メニュー (⋮) ➔ "アプリをインストール" または "ホーム画面に追加"',
    confirmBtn: 'OK'
  },
  zh: {
    bannerTitle: '📱 添加至手机主屏幕',
    bannerDesc: '添加快捷方式，主屏幕一键快速访问！',
    badgeNew: 'NEW',
    installBtn: '添加快捷方式',
    guideModalTitle: '如何添加至手机主屏幕',
    guideModalSub: '无需每次打开浏览器，主屏幕一键直达 Korea Travel 快捷应用！',
    step1Title: '1. 打开浏览器菜单',
    step1DescKakao: 'KakaoTalk 右下角 (⋮) ➔ 选择"用其他浏览器打开"',
    step1DescGeneral: '点击浏览器下方或右上角分享/菜单图标',
    step2Title: '2. 选择 "添加至主屏幕"',
    step2DescIOS: 'iPhone: 点击分享 (📤) ➔ "添加至主屏幕 (➕)"',
    step2DescAndroid: 'Android: 点击菜单 (⋮) ➔ "安装应用" 或 "添加至主屏幕"',
    confirmBtn: '我知道了'
  },
  zht: {
    bannerTitle: '📱 新增至手機主畫面',
    bannerDesc: '新增快捷方式，主畫面一鍵快速訪問！',
    badgeNew: 'NEW',
    installBtn: '新增快捷方式',
    guideModalTitle: '如何新增至手機主畫面',
    guideModalSub: '無需每次打開瀏覽器，主畫面一鍵直達 Korea Travel 快捷應用！',
    step1Title: '1. 打開瀏覽器菜單',
    step1DescKakao: 'KakaoTalk 右下角 (⋮) ➔ 選擇"用其他瀏覽器打開"',
    step1DescGeneral: '點擊瀏覽器下方或右上角分享/菜單圖標',
    step2Title: '2. 選擇 "新增至主畫面"',
    step2DescIOS: 'iPhone: 點擊分享 (📤) ➔ "新增至主畫面 (➕)"',
    step2DescAndroid: 'Android: 點擊菜單 (⋮) ➔ "安裝應用" 或 "新增至主畫面"',
    confirmBtn: '我知道了'
  },
  de: {
    bannerTitle: '📱 Zum Startbildschirm hinzufügen',
    bannerDesc: 'Mit 1-Klick direkt vom Startbildschirm zugreifen!',
    badgeNew: 'NEU',
    installBtn: 'Hinzufügen',
    guideModalTitle: 'Zum Startbildschirm hinzufügen',
    guideModalSub: 'Greifen Sie mit 1 Klick direkt von Ihrem Smartphone-Startbildschirm zu!',
    step1Title: '1. Browser-Menü öffnen',
    step1DescKakao: 'In KakaoTalk (⋮) ➔ "In externem Browser öffnen"',
    step1DescGeneral: 'Tippen Sie im Browser auf Teilen/Menü',
    step2Title: '2. "Zum Startbildschirm" wählen',
    step2DescIOS: 'iPhone: Teilen (📤) ➔ "Zum Startbildschirm (➕)"',
    step2DescAndroid: 'Android: Menü (⋮) ➔ "App installieren"',
    confirmBtn: 'Verstanden'
  },
  fr: {
    bannerTitle: '📱 Ajouter à l\'écran d\'accueil',
    bannerDesc: 'Ajoutez un raccourci pour un accès rapide en 1 clic !',
    badgeNew: 'NOUVEAU',
    installBtn: 'Ajouter',
    guideModalTitle: 'Ajouter à l\'écran d\'accueil',
    guideModalSub: 'Accédez instantanément à K-Travel depuis votre écran d\'accueil !',
    step1Title: '1. Ouvrir le menu du navigateur',
    step1DescKakao: 'Dans KakaoTalk (⋮) ➔ "Ouvrir dans le navigateur"',
    step1DescGeneral: 'Appuyez sur Partager ou Menu dans votre navigateur',
    step2Title: '2. Sélectionner "Sur l\'écran d\'accueil"',
    step2DescIOS: 'iPhone : Partager (📤) ➔ "Sur l\'écran d\'accueil (➕)"',
    step2DescAndroid: 'Android : Menu (⋮) ➔ "Installer l\'application"',
    confirmBtn: 'D\'accord'
  },
  es: {
    bannerTitle: '📱 Añadir a la pantalla de inicio',
    bannerDesc: '¡Añade un acceso directo para acceder en 1 toque!',
    badgeNew: 'NUEVO',
    installBtn: 'Añadir',
    guideModalTitle: 'Añadir a la pantalla de inicio',
    guideModalSub: 'Accede al instante a K-Travel desde la pantalla de inicio de tu smartphone.',
    step1Title: '1. Abrir menú del navegador',
    step1DescKakao: 'En KakaoTalk (⋮) ➔ "Abrir en navegador externo"',
    step1DescGeneral: 'Toca Compartir o Menú en tu navegador',
    step2Title: '2. Seleccionar "Añadir a inicio"',
    step2DescIOS: 'iPhone: Compartir (📤) ➔ "Añadir a inicio (➕)"',
    step2DescAndroid: 'Android: Menú (⋮) ➔ "Instalar aplicación"',
    confirmBtn: 'Entendido'
  },
  ru: {
    bannerTitle: '📱 Добавить на экран «Домой»',
    bannerDesc: 'Быстрый доступ в 1 касание с главного экрана!',
    badgeNew: 'NEW',
    installBtn: 'Добавить',
    guideModalTitle: 'Как добавить на экран «Домой»',
    guideModalSub: 'Мгновенный доступ к K-Travel прямо с экрана смартфона без поиска ссылок!',
    step1Title: '1. Откройте меню браузера',
    step1DescKakao: 'В KakaoTalk (⋮) ➔ "Открыть в браузере"',
    step1DescGeneral: 'Нажмите иконку Поделиться или Меню',
    step2Title: '2. Выберите "На экран «Домой»"',
    step2DescIOS: 'iPhone: Поделиться (📤) ➔ "На экран «Домой» (➕)"',
    step2DescAndroid: 'Android: Меню (⋮) ➔ "Установить приложение"',
    confirmBtn: 'Понятно'
  }
};

export default function PWAInstallBanner({ lang = 'ko' }) {
  const t = PWA_I18N[lang] || PWA_I18N.ko;
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if user is already running in Standalone PWA Mode (opened from Home Screen App Icon)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone === true 
      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // 2. Check if user dismissed the banner recently
    const isDismissed = localStorage.getItem('ktravel_pwa_banner_dismissed');
    if (isDismissed) return;

    const ua = (navigator.userAgent || '').toLowerCase();
    const kakao = ua.includes('kakaotalk');
    const ios = ua.includes('iphone') || ua.includes('ipad') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsKakaoInApp(kakao);
    setIsIOS(ios);

    // 3. Listen for Chrome/Android/Samsung PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // 4. Listen for appinstalled event (Hide banner immediately when install completes)
    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
      localStorage.setItem('ktravel_pwa_banner_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // If in mobile view, show banner to guide home screen shortcut
    if (kakao || ios || window.innerWidth <= 768) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
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
      {/* Floating PWA Shortcut Banner - Compact 320px+ Responsive Layout */}
      <div 
        className="animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '1.15rem',
          left: '0.75rem',
          right: '0.75rem',
          maxWidth: '480px',
          margin: '0 auto',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.45rem',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: 1, minWidth: 0 }}>
          <img 
            src="/pwa-192x192.png" 
            alt="Travel Korea Icon" 
            style={{ width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.bannerTitle}
              </span>
              <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.6rem', fontWeight: 900, padding: '0.05rem 0.3rem', borderRadius: '3px', flexShrink: 0 }}>
                {t.badgeNew}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.bannerDesc}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          <button
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Download size={13} />
            <span>{t.installBtn}</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="닫기"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* iOS / Mobile Home Screen Shortcut Guide Modal */}
      {showIOSGuide && (
        <div className="modal-overlay-backdrop" onClick={() => setShowIOSGuide(false)} style={{ zIndex: 10000 }}>
          <div 
            className="animate-fade-in glass-panel"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.35rem',
              maxWidth: '440px',
              width: 'calc(100% - 2rem)',
              boxShadow: 'var(--shadow-xl)',
              color: 'var(--text-main)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <img src="/pwa-192x192.png" alt="Travel Korea" style={{ width: '30px', height: '30px', borderRadius: '8px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{t.guideModalTitle}</h3>
              </div>
              <button onClick={() => setShowIOSGuide(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.15rem' }}>
              {t.guideModalSub}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', background: 'var(--bg-primary)', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{t.step1Title}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {isKakaoInApp ? t.step1DescKakao : t.step1DescGeneral}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', background: 'var(--bg-primary)', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{t.step2Title}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.step2DescIOS}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.step2DescAndroid}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 800 }}
            >
              {t.confirmBtn}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
