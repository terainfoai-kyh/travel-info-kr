import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Download, X, Share, Monitor, Sparkles } from 'lucide-react';

const PWA_I18N = {
  ko: {
    installFailTipTitle: '앱 다운로드/설치가 잘 안 되시나요?',
    installFailTipDesc: '카카오톡/네이버 등 메신저 내부에서 접속하셨다면 우측 상단 [⋮] 버튼 ➔ [다른 브라우저로 열기]를 눌러 크롬/사파리에서 접속하시면 1초 만에 설치됩니다!',
    bannerTitle: '📱 스마트폰 홈 화면 바로가기',
    bannerDesc: '바탕화면에 추가하고 터치 한 번으로 빠르게 접속하세요!',
    badgeNew: 'NEW',
    installBtn: '바로가기 추가',
    desktopTitle: '💻 PC 데스크톱 전용 앱 설치',
    desktopDesc: '주소창 없이 독립 창으로 1초 만에 깔끔하게 실행하세요!',
    desktopInstallBtn: '앱 설치하기',
    guideModalTitle: '홈 화면에 추가하는 방법',
    guideModalSub: '스마트폰 홈 화면(바탕화면)에 1초 만에 바로가기 앱을 추가해 보세요!',
    desktopGuideModalTitle: 'PC 데스크톱 앱 설치 방법',
    desktopGuideModalSub: '브라우저 주소창 우측의 [앱 설치] 아이콘(💻)을 클릭하시거나 아래 지침을 따라 설치하시면 독립 창으로 바로 실행됩니다!',
    step1Title: '1. 브라우저 메뉴 열기',
    step1DescKakao: '카카오톡 우측 하단 (⋮ 또는 ⚙️) ➔ "다른 브라우저로 열기" 선택 후',
    step1DescGeneral: '하단/상단 브라우저 공유 또는 설정 메뉴 터치',
    step2Title: '2. "홈 화면에 추가" (Add to Home Screen) 선택',
    step2DescIOS: '아이폰: 사파리 하단 공유(📤) 버튼 ➔ "홈 화면에 추가(➕)"',
    step2DescAndroid: '안드로이드: 더보기(⋮) 메뉴 ➔ "앱 설치" 또는 "홈 화면에 추가"',
    confirmBtn: '확인'
  },
  en: {
    installFailTipTitle: 'Having trouble installing the app?',
    installFailTipDesc: 'If opened inside KakaoTalk, Naver, or Social Apps, tap [⋮] at top right ➔ "Open in External Browser" and use Chrome or Safari for 1-tap fast install!',
    bannerTitle: '📱 Add to Home Screen',
    bannerDesc: 'Add shortcut to home screen for 1-tap fast access!',
    badgeNew: 'NEW',
    installBtn: 'Add Shortcut',
    desktopTitle: '💻 Install Desktop App',
    desktopDesc: 'Run in standalone desktop window with 1-click!',
    desktopInstallBtn: 'Install App',
    guideModalTitle: 'How to Add to Home Screen',
    guideModalSub: 'Access K-Travel instantly from your smartphone home screen!',
    desktopGuideModalTitle: 'How to Install Desktop App',
    desktopGuideModalSub: 'Click the install icon in your browser address bar or click Install to run in standalone desktop window!',
    step1Title: '1. Open Browser Menu',
    step1DescKakao: 'In KakaoTalk, select (⋮) ➔ "Open in External Browser"',
    step1DescGeneral: 'Tap Share or Menu icon in your mobile browser',
    step2Title: '2. Select "Add to Home Screen"',
    step2DescIOS: 'iPhone: Tap Share (📤) ➔ "Add to Home Screen (➕)"',
    step2DescAndroid: 'Android: Tap Menu (⋮) ➔ "Install App" or "Add to Home Screen"',
    confirmBtn: 'Got it'
  },
  ja: {
    installFailTipTitle: 'アプリの追加がうまくいきませんか？',
    installFailTipDesc: 'LINEやカカオトーク等のアプリ内ブラウザから閲覧中の場合は、右上 [⋮] ➔ 「他のブラウザで開く」を選択し、ChromeやSafariでアクセスすると即座に追加できます！',
    bannerTitle: '📱 ホーム画面に追加',
    bannerDesc: 'ホーム画面に追加してワンタップで即アクセス！',
    badgeNew: 'NEW',
    installBtn: '追加する',
    desktopTitle: '💻 PCデスクトップアプリをインストール',
    desktopDesc: 'アドレスバーなしの専用ウィンドウで1秒起動！',
    desktopInstallBtn: 'アプリをインストール',
    guideModalTitle: 'ホーム画面への追加方法',
    guideModalSub: 'スマホのホーム画面から1タップでアクセスできます！',
    desktopGuideModalTitle: 'PCアプリのインストール方法',
    desktopGuideModalSub: 'アドレスバー右側のインストールアイコンをクリックして専用ウィンドウで起動できます！',
    step1Title: '1. ブラウザメニューを開く',
    step1DescKakao: 'カカオトーク右下 (⋮) ➔ "他のブラウザで開く" を選択',
    step1DescGeneral: 'ブラウザの共有または menu アイコンをタップ',
    step2Title: '2. "ホーム画面に追加" を選択',
    step2DescIOS: 'iPhone: 共有 (📤) ➔ "ホーム画面に追加 (➕)"',
    step2DescAndroid: 'Android: メニュー (⋮) ➔ "アプリをインストール" または "ホーム画面に追加"',
    confirmBtn: 'OK'
  },
  zh: {
    installFailTipTitle: '无法下载或添加快捷应用？',
    installFailTipDesc: '如果是在微信/Kakao等应用内置浏览器中打开，请点击右上角 [⋮] ➔ 选择"用其他浏览器打开"，使用 Chrome 或 Safari 即可一键完成添加！',
    bannerTitle: '📱 添加至手机主屏幕',
    bannerDesc: '添加快捷方式，主屏幕一键快速访问！',
    badgeNew: 'NEW',
    installBtn: '添加快捷方式',
    desktopTitle: '💻 安装 PC 桌面应用',
    desktopDesc: '无地址栏独立窗口，一键快速运行！',
    desktopInstallBtn: '安装应用',
    guideModalTitle: '如何添加至手机主屏幕',
    guideModalSub: '主屏幕一键直达 Korea Travel 快捷应用！',
    desktopGuideModalTitle: '如何安装 PC 桌面应用',
    desktopGuideModalSub: '点击浏览器地址栏右侧的安装图标，即可作为独立桌面应用运行！',
    step1Title: '1. 打开浏览器菜单',
    step1DescKakao: 'KakaoTalk 右下角 (⋮) ➔ 选择"用其他浏览器打开"',
    step1DescGeneral: '点击浏览器下方或右上角分享/菜单图标',
    step2Title: '2. 选择 "添加至主屏幕"',
    step2DescIOS: 'iPhone: 点击分享 (📤) ➔ "添加至主屏幕 (➕)"',
    step2DescAndroid: 'Android: 点击菜单 (⋮) ➔ "安装应用" 或 "添加至主屏幕"',
    confirmBtn: '我知道了'
  },
  zht: {
    installFailTipTitle: '無法下載或新增快捷應用？',
    installFailTipDesc: '如果是在LINE/Kakao等應用內置瀏覽器中打開，請點擊右上角 [⋮] ➔ 選擇"用其他瀏覽器打開"，使用 Chrome 或 Safari 即可一鍵完成新增！',
    bannerTitle: '📱 新增至手機主畫面',
    bannerDesc: '新增快捷方式，主畫面一鍵快速訪問！',
    badgeNew: 'NEW',
    installBtn: '新增快捷方式',
    desktopTitle: '💻 安裝 PC 桌面應用',
    desktopDesc: '無地址欄獨立視窗，一鍵快速運行！',
    desktopInstallBtn: '安裝應用',
    guideModalTitle: '如何新增至手機主畫面',
    guideModalSub: '主畫面一鍵直達 Korea Travel 快捷應用！',
    desktopGuideModalTitle: '如何安裝 PC 桌面應用',
    desktopGuideModalSub: '點擊瀏覽器地址欄右側的安裝圖標，即可作為獨立桌面應用運行！',
    step1Title: '1. 打開瀏覽器菜單',
    step1DescKakao: 'KakaoTalk 右下角 (⋮) ➔ 選擇"用其他瀏覽器打開"',
    step1DescGeneral: '點擊瀏覽器下方或右上角分享/菜單圖標',
    step2Title: '2. 選擇 "新增至主畫面"',
    step2DescIOS: 'iPhone: 點擊分享 (📤) ➔ "新增至主畫面 (➕)"',
    step2DescAndroid: 'Android: 點擊菜單 (⋮) ➔ "安裝應用" 或 "新增至主畫面"',
    confirmBtn: '我知道了'
  },
  de: {
    installFailTipTitle: 'Probleme bei der App-Installation?',
    installFailTipDesc: 'Falls in KakaoTalk/In-App-Browser geöffnet, tippen Sie oben rechts auf [⋮] ➔ "In externem Browser öffnen" und nutzen Sie Chrome oder Safari für die 1-Klick-Installation!',
    bannerTitle: '📱 Zum Startbildschirm hinzufügen',
    bannerDesc: 'Mit 1-Klick direkt vom Startbildschirm zugreifen!',
    badgeNew: 'NEU',
    installBtn: 'Hinzufügen',
    desktopTitle: '💻 Desktop-App installieren',
    desktopDesc: 'Im eigenen Fenster ohne Adressleiste ausführen!',
    desktopInstallBtn: 'App installieren',
    guideModalTitle: 'Zum Startbildschirm hinzufügen',
    guideModalSub: 'Greifen Sie mit 1 Klick direkt von Ihrem Startbildschirm zu!',
    desktopGuideModalTitle: 'Desktop-App installieren',
    desktopGuideModalSub: 'Klicken Sie auf das Installationssymbol in der Adressleiste!',
    step1Title: '1. Browser-Menü öffnen',
    step1DescKakao: 'In KakaoTalk (⋮) ➔ "In externem Browser öffnen"',
    step1DescGeneral: 'Tippen Sie im Browser auf Teilen/Menü',
    step2Title: '2. "Zum Startbildschirm" wählen',
    step2DescIOS: 'iPhone: Teilen (📤) ➔ "Zum Startbildschirm (➕)"',
    step2DescAndroid: 'Android: Menü (⋮) ➔ "App installieren"',
    confirmBtn: 'Verstanden'
  },
  fr: {
    installFailTipTitle: 'Problème lors de l\'installation ?',
    installFailTipDesc: 'Si ouvert dans un navigateur in-app, appuyez sur [⋮] en haut à droite ➔ "Ouvrir dans le navigateur" pour installer via Chrome ou Safari !',
    bannerTitle: '📱 Ajouter à l\'écran d\'accueil',
    bannerDesc: 'Ajoutez un raccourci pour un accès rapide en 1 clic !',
    badgeNew: 'NOUVEAU',
    installBtn: 'Ajouter',
    desktopTitle: '💻 Installer l\'application Desktop',
    desktopDesc: 'Exécutez dans une fenêtre dédiée sans barre d\'adresse !',
    desktopInstallBtn: 'Installer l\'application',
    guideModalTitle: 'Ajouter à l\'écran d\'accueil',
    guideModalSub: 'Accédez instantanément à K-Travel depuis votre écran d\'accueil !',
    desktopGuideModalTitle: 'Installer l\'application Desktop',
    desktopGuideModalSub: 'Cliquez sur l\'icône d\'installation dans la barre d\'adresse !',
    step1Title: '1. Ouvrir le menu du navigateur',
    step1DescKakao: 'Dans KakaoTalk (⋮) ➔ "Ouvrir dans le navigateur"',
    step1DescGeneral: 'Appuyez sur Partager ou Menu dans votre navigateur',
    step2Title: '2. Sélectionner "Sur l\'écran d\'accueil"',
    step2DescIOS: 'iPhone : Partager (📤) ➔ "Sur l\'écran d\'accueil (➕)"',
    step2DescAndroid: 'Android : Menu (⋮) ➔ "Installer l\'application"',
    confirmBtn: 'D\'accord'
  },
  es: {
    installFailTipTitle: '¿Problemas para instalar la aplicación?',
    installFailTipDesc: 'Si abriste desde KakaoTalk/navegador in-app, toca [⋮] arriba a la derecha ➔ "Abrir en navegador externo" e instala en 1 toque desde Chrome o Safari.',
    bannerTitle: '📱 Añadir a la pantalla de inicio',
    bannerDesc: '¡Añade un acceso directo para acceder en 1 toque!',
    badgeNew: 'NUEVO',
    installBtn: 'Añadir',
    desktopTitle: '💻 Instalar aplicación de escritorio',
    desktopDesc: '¡Ejecútala en una ventana dedicada sin barra de direcciones!',
    desktopInstallBtn: 'Instalar aplicación',
    guideModalTitle: 'Añadir a la pantalla de inicio',
    guideModalSub: 'Accede al instante a K-Travel desde la pantalla de inicio.',
    desktopGuideModalTitle: 'Instalar aplicación de escritorio',
    desktopGuideModalSub: '¡Haz clic en el icono de instalación de la barra de direcciones!',
    step1Title: '1. Abrir menú del navegador',
    step1DescKakao: 'En KakaoTalk (⋮) ➔ "Abrir en navegador externo"',
    step1DescGeneral: 'Toca Compartir o Menú en tu navegador',
    step2Title: '2. Seleccionar "Añadir a inicio"',
    step2DescIOS: 'iPhone: Compartir (📤) ➔ "Añadir a inicio (➕)"',
    step2DescAndroid: 'Android: Menú (⋮) ➔ "Instalar aplicación"',
    confirmBtn: 'Entendido'
  },
  ru: {
    installFailTipTitle: 'Не получается установить приложение?',
    installFailTipDesc: 'Если вы открыли ссылку внутри мессенджера, нажмите [⋮] вверху справа ➔ «Открыть в браузере» и используйте Chrome или Safari для установки!',
    bannerTitle: '📱 Добавить на экран «Домой»',
    bannerDesc: 'Быстрый доступ в 1 касание с главного экрана!',
    badgeNew: 'NEW',
    installBtn: 'Добавить',
    desktopTitle: '💻 Установить приложение для ПК',
    desktopDesc: 'Запуск в отдельном окне без адресной строки!',
    desktopInstallBtn: 'Установить',
    guideModalTitle: 'Как добавить на экран «Домой»',
    guideModalSub: 'Мгновенный доступ к K-Travel прямо с экрана смартфона!',
    desktopGuideModalTitle: 'Как установить приложение для ПК',
    desktopGuideModalSub: 'Нажмите иконку установки в адресной строке браузера!',
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
  const deferredPromptRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // 1. Check if user is already running in Standalone PWA Mode (opened from Home Screen / Desktop App Icon)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone === true 
      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    const ua = (navigator.userAgent || '').toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|kakaotalk/i.test(ua) || window.innerWidth <= 1024;
    const kakao = ua.includes('kakaotalk');

    setIsKakaoInApp(kakao);
    setIsDesktop(!isMobileDevice);

    // 2. Check dismissal with 24-hour expiration check (Supports ?pwa=reset to force reset)
    if (window.location.search.includes('pwa=reset')) {
      localStorage.removeItem('ktravel_pwa_banner_dismissed_at');
    } else {
      const dismissedTimestamp = localStorage.getItem('ktravel_pwa_banner_dismissed_at');
      if (dismissedTimestamp) {
        const pastHours = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60);
        if (pastHours < 24 && !window.location.search.includes('pwa=')) {
          // Banner auto-popup disabled if dismissed within 24h, but Header click still opens modal!
          setShowBanner(false);
        } else {
          setShowBanner(true);
        }
      } else {
        setShowBanner(true);
      }
    }

    // 3. Listen for Chrome/Android/Samsung/Edge PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      window.__ktravel_deferred_prompt = e;
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // 4. Listen for appinstalled event (Hide banner immediately when install completes)
    const handleAppInstalled = () => {
      setShowBanner(false);
      setShowGuideModal(false);
      deferredPromptRef.current = null;
      window.__ktravel_deferred_prompt = null;
      setDeferredPrompt(null);
      localStorage.setItem('ktravel_pwa_banner_dismissed_at', String(Date.now()));
    };

    // 5. Listen for custom header button click event (Prioritize 1-click Chrome native prompt)
    const handleOpenInstallModal = async () => {
      const activePrompt = deferredPromptRef.current || window.__ktravel_deferred_prompt || deferredPrompt;
      if (activePrompt) {
        try {
          activePrompt.prompt();
          const { outcome } = await activePrompt.userChoice;
          if (outcome === 'accepted') {
            setShowBanner(false);
            setShowGuideModal(false);
            deferredPromptRef.current = null;
            window.__ktravel_deferred_prompt = null;
            setDeferredPrompt(null);
            return;
          }
        } catch (err) {
          console.log('Native prompt execution error:', err);
        }
      }
      // If native prompt unavailable, fallback to guide modal
      setShowGuideModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('open-pwa-install-modal', handleOpenInstallModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install-modal', handleOpenInstallModal);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    // KakaoTalk in-app browser detection
    if (isKakaoInApp) {
      const ua = (navigator.userAgent || '').toLowerCase();
      if (ua.includes('android')) {
        const targetUrl = window.location.href.replace(/^https?:\/\//i, '');
        const chromeIntent = `intent://${targetUrl}#Intent;scheme=https;package=com.android.chrome;end;`;
        window.location.href = chromeIntent;
        return;
      }
      setShowGuideModal(true);
      return;
    }

    const activePrompt = deferredPromptRef.current || window.__ktravel_deferred_prompt || deferredPrompt;
    if (activePrompt) {
      try {
        activePrompt.prompt();
        const { outcome } = await activePrompt.userChoice;
        if (outcome === 'accepted') {
          setShowBanner(false);
          setShowGuideModal(false);
        }
        deferredPromptRef.current = null;
        window.__ktravel_deferred_prompt = null;
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('ktravel_pwa_banner_dismissed_at', String(Date.now()));
  };

  // If neither banner nor guide modal is active, return null
  if (!showBanner && !showGuideModal) return null;

  const currentTitle = isDesktop ? t.desktopTitle : t.bannerTitle;
  const currentDesc = isDesktop ? t.desktopDesc : t.bannerDesc;
  const currentBtnLabel = isKakaoInApp 
    ? (lang === 'ko' ? '크롬/삼성인터넷 열기' : t.installBtn)
    : (isDesktop ? t.desktopInstallBtn : t.installBtn);

  return (
    <>
      {/* Floating Smart PWA Shortcut Banner - PC & Mobile Dual Support */}
      {showBanner && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '1.15rem',
            left: '0.75rem',
            right: '0.75rem',
            maxWidth: '520px',
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
                  {currentTitle}
                </span>
                <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.6rem', fontWeight: 900, padding: '0.05rem 0.3rem', borderRadius: '3px', flexShrink: 0 }}>
                  {t.badgeNew}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentDesc}
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
              {isDesktop ? <Monitor size={13} /> : <Download size={13} />}
              <span>{currentBtnLabel}</span>
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
      )}

      {/* PC Desktop & Mobile PWA Guide Modal */}
      {showGuideModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowGuideModal(false)} style={{ zIndex: 10000 }}>
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
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  {isDesktop ? t.desktopGuideModalTitle : t.guideModalTitle}
                </h3>
              </div>
              <button onClick={() => setShowGuideModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
              {isDesktop ? t.desktopGuideModalSub : t.guideModalSub}
            </p>

            {/* Solution A Tip Box: In-App Browser & Install Troubleshooting Tip */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.76rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.45rem',
              marginBottom: '1.15rem'
            }}>
              <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.15rem' }}>
                  💡 {t.installFailTipTitle || '앱 다운로드/설치가 잘 안 되시나요?'}
                </div>
                <div>
                  {t.installFailTipDesc || '카카오톡/네이버 등 메신저 내부에서 접속하셨다면 우측 상단 [⋮] 버튼 ➔ [다른 브라우저로 열기]를 눌러 크롬/사파리에서 접속하시면 1초 만에 설치됩니다!'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', background: 'var(--bg-primary)', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{t.step1Title}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {isDesktop ? '크롬/엣지 주소창 우측 상단 [앱 설치 (💻)] 아이콘 터치' : (isKakaoInApp ? t.step1DescKakao : t.step1DescGeneral)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', background: 'var(--bg-primary)', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{t.step2Title}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {isDesktop ? '설치 클릭 ➔ 데스크톱 바탕화면 및 작업표시줄 단독 앱 생성' : t.step2DescIOS}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
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
