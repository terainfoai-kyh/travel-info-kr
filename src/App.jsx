import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import VoraAIChat from './components/VoraAIChat';
import CourseMagazineView from './components/CourseMagazineView';
import TravelEssentialsSection from './components/TravelEssentialsSection';
import AdSenseArticlesSection from './components/AdSenseArticlesSection';
import AdSenseBanner from './components/AdSenseBanner';
import TravelDetailModal from './components/TravelDetailModal';
import WishlistDrawer from './components/WishlistDrawer';
import WeatherModal from './components/WeatherModal';
import TravelEssentialsModal from './components/TravelEssentialsModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import AboutUsModal from './components/AboutUsModal';
import ContactUsModal from './components/ContactUsModal';
import PWAInstallBanner from './components/PWAInstallBanner';
import RewardedAdModal from './components/RewardedAdModal';
import GoogleAuthModal from './components/GoogleAuthModal';

import { MapPin, MessageSquare } from 'lucide-react';
import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { geminiGenerateFullItinerary, generateLocalFallbackItinerary, enrichItineraryPhotosAsync } from './services/geminiNlpService';

export default function App() {
  // 4-Language State (ko, en, ja, zh)
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_lang');
      if (saved) return saved;
    } catch (e) {}
    return detectBrowserLanguage();
  });

  const getInitialWelcomeMessages = (currentLang, currentItinerary) => {
    if (currentLang === 'en') {
      return [
        {
          id: 'welcome-1',
          role: 'assistant',
          text: 'Hello! I am VORA, your dedicated AI travel concierge for South Korea. 😊\nTell me where you want to visit or your desired travel style!'
        },
        {
          id: 'featured-1',
          role: 'assistant',
          text: '✨ We have prepared [Seoul 3-Day Hotspot Trend Magazine Tour] as your recommended itinerary.\nFeel free to ask anytime if you want adjustments or want to explore other cities!',
          itinerary: currentItinerary
        }
      ];
    }
    if (currentLang === 'ja') {
      return [
        {
          id: 'welcome-1',
          role: 'assistant',
          text: 'こんにちは！専属の韓国旅行AIコンシェルジュ、VORA（ボラ）です。😊\n訪れてみたい都市や旅のスタイルを気軽にお知らせください！'
        },
        {
          id: 'featured-1',
          role: 'assistant',
          text: '✨ おすすめプランとして「ソウル3日間 トレンド満喫ツアー」をご用意しました。\nプランの変更や他都市の追加など、いつでもご質問ください！',
          itinerary: currentItinerary
        }
      ];
    }
    if (currentLang === 'zh' || currentLang === 'zht') {
      const isZht = currentLang === 'zht';
      return [
        {
          id: 'welcome-1',
          role: 'assistant',
          text: isZht 
            ? '您好！我是您的專屬韓國旅遊AI智能向導 VORA。😊\n請告訴我您想去的城市或旅行風格，我將為您客製專屬行程！'
            : '您好！我是您的专属韩国旅游AI智能向导 VORA。😊\n请告诉我您想去的城市或旅行风格，我将为您定制专属行程！'
        },
        {
          id: 'featured-1',
          role: 'assistant',
          text: isZht
            ? '✨ 已為您準備精選推薦路線【首爾3天2晚 潮流打卡之旅】。\n如需調整行程或探索其他城市，請隨時向我提問！'
            : '✨ 已为您准备精选推荐路线【首尔3天2晚 潮流打卡之旅】。\n如需调整行程或探索其他城市，请随时向我提问！',
          itinerary: currentItinerary
        }
      ];
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        text: '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA(보라)입니다. 😊\n어떤 여행을 꿈꾸시나요? 가고 싶은 도시나 스타일을 편하게 말씀해 주세요!'
      },
      {
        id: 'featured-1',
        role: 'assistant',
        text: '✨ [서울 3일 핫플 감성 투어]를 추천 코스로 준비해 두었습니다.\n수정을 원하시거나 새로운 지역을 가고 싶으시면 언제든 질문해 주세요!',
        itinerary: currentItinerary
      }
    ];
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('vora_lang', newLang);
    } catch (e) {}

    // Automatically reset and re-query the itinerary and chat messages in the newly selected language
    const newItinerary = generateLocalFallbackItinerary('서울 3일 핫플 감성 투어', '서울', 3, newLang);
    setItineraryData(newItinerary);
    setChatMessages(getInitialWelcomeMessages(newLang, newItinerary));
    setActiveDay(1);
    setSelectedSpot(null);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Dark / Light Theme Mode
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('vora_theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    try {
      localStorage.setItem('vora_theme', themeMode);
    } catch (e) {}
  }, [themeMode]);

  useEffect(() => {
    const langMap = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', zht: 'zh-TW' };
    document.documentElement.lang = langMap[lang] || 'ko-KR';
  }, [lang]);

  // Itinerary & Chat State - Pre-populated with rich 3-day Seoul tour on initial load
  const initialItinerary = React.useMemo(() => {
    try {
      return generateLocalFallbackItinerary('서울 3일 핫플 감성 투어', '서울', 3, lang);
    } catch (e) {
      return null;
    }
  }, [lang]);

  const [itineraryData, setItineraryData] = useState(initialItinerary);

  // Background live photo enrichment via TourAPI 4.0 & Wikimedia (Zero hardcoding)
  useEffect(() => {
    let isMounted = true;
    if (initialItinerary) {
      enrichItineraryPhotosAsync(initialItinerary).then(enriched => {
        if (isMounted && enriched) {
          setItineraryData(prev => (prev?.tripTitle === initialItinerary.tripTitle ? enriched : prev));
        }
      });
    }
    return () => { isMounted = false; };
  }, [initialItinerary]);

  const [chatMessages, setChatMessages] = useState(() => getInitialWelcomeMessages(lang, initialItinerary));
  const [activeDay, setActiveDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [mobileHubTab, setMobileHubTab] = useState('magazine'); // 'magazine' | 'chat'

  // Persistent Bookmarks / Wishlist
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleToggleBookmark = (spotToToggle) => {
    if (!spotToToggle) return;
    setBookmarks(prev => {
      const spotId = spotToToggle.contentId || spotToToggle.id || spotToToggle.title;
      const spotTitle = spotToToggle.title;
      
      const exists = prev.some(b => 
        (typeof b === 'object' && ((b.contentId && b.contentId === spotId) || (b.id && b.id === spotId) || (b.title && b.title === spotTitle))) ||
        (typeof b === 'string' && (b === spotId || b === spotTitle))
      );
      
      let updated;
      if (exists) {
        updated = prev.filter(b => 
          typeof b === 'object' 
            ? ((b.contentId && b.contentId !== spotId) && (b.id && b.id !== spotId) && (!spotTitle || b.title !== spotTitle))
            : b !== spotId
        );
      } else {
        const spotObj = typeof spotToToggle === 'object' ? {
          id: spotToToggle.id || spotId,
          contentId: spotToToggle.contentId || null,
          title: spotToToggle.title || '추천 관광지',
          location: spotToToggle.location || spotToToggle.addr1 || '상세 위치 제공',
          image: spotToToggle.image || '/default-spot.png',
          rating: spotToToggle.rating || 4.9,
          region: spotToToggle.region || '한국',
          category: spotToToggle.category || spotToToggle.theme || '명소'
        } : { id: spotId, title: spotId, location: '상세 위치 제공', image: '/default-spot.png', rating: 4.9 };
        updated = [spotObj, ...prev];
      }
      try {
        localStorage.setItem('vora_bookmarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Modals & Drawers Open State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [weatherCity, setWeatherCity] = useState('서울');

  // User Profile State (Google Logged In vs Guest)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Daily Question Quota Management (Guest: 5 chats, Google User: 15 chats)
  const [questionQuota, setQuestionQuota] = useState(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const isGoogle = !!localStorage.getItem('vora_user_profile');
    const totalLimit = isGoogle ? 15 : 5;

    try {
      const saved = localStorage.getItem('vora_daily_quota');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          return { ...parsed, total: totalLimit };
        }
      }
    } catch (e) {}
    const defaultQuota = { date: todayStr, remaining: totalLimit, total: totalLimit };
    try {
      localStorage.setItem('vora_daily_quota', JSON.stringify(defaultQuota));
    } catch (e) {}
    return defaultQuota;
  });

  // Grant Reward (+3 chats on watching 15s ad)
  const handleRewardGranted = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setQuestionQuota(prev => {
      const newRemaining = (prev?.remaining || 0) + 3;
      const updated = { date: todayStr, remaining: newRemaining, total: prev?.total || 5 };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const queryTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setChatMessages(prev => [
      ...prev,
      {
        id: `reward-${Date.now()}`,
        role: 'assistant',
        text: (lang === 'ko')
          ? '🎉 **스폰서 광고 시청 완료! 무료 AI 질문 +3회가 즉시 충전되었습니다.** ✨\n원하시는 여행 코스나 수정 사항을 자유롭게 물어보세요!'
          : '🎉 **Sponsor ad completed! +3 free AI questions have been granted.** ✨\nFeel free to ask more travel itineraries!',
        queryTime,
        replyTime: queryTime,
        timestamp: queryTime
      }
    ]);
  };

  // Google Login Success Handler
  const handleLoginSuccess = (profile) => {
    setCurrentUser(profile);
    const todayStr = new Date().toISOString().slice(0, 10);
    setQuestionQuota(prev => {
      const updated = { date: todayStr, remaining: Math.max(prev?.remaining || 0, 15), total: 15 };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const queryTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setChatMessages(prev => [
      ...prev,
      {
        id: `login-success-${Date.now()}`,
        role: 'assistant',
        text: (lang === 'ko')
          ? `👑 **환영합니다, ${profile.name}님!**\nGoogle VIP 회원 혜택이 적용되어 **매일 15회 무료 질문**과 여행 일정 자동 보관이 활성화되었습니다! ✨`
          : `👑 **Welcome, ${profile.name}!**\nGoogle VIP tier activated with **15 free daily chats** and automatic itinerary cloud backup! ✨`,
        queryTime,
        replyTime: queryTime,
        timestamp: queryTime
      }
    ]);
  };

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('vora_user_profile');
    } catch (e) {}
    setCurrentUser(null);
    const todayStr = new Date().toISOString().slice(0, 10);
    setQuestionQuota(prev => {
      const updated = { date: todayStr, remaining: Math.min(prev?.remaining || 5, 5), total: 5 };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Reset Quota for Testing / Dev
  const handleResetQuotaForDev = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const totalLimit = currentUser?.isGoogleLoggedIn ? 15 : 5;
    const reset = { date: todayStr, remaining: totalLimit, total: totalLimit };
    setQuestionQuota(reset);
    try {
      localStorage.setItem('vora_daily_quota', JSON.stringify(reset));
    } catch (e) {}
  };

  // Trigger Master Itinerary Planning with Conversational Memory & Ultra-Fast Parallel Engine
  const handleGenerateItinerary = async (promptQuery) => {
    if (!promptQuery || isLoading) return;

    // 📱 Mobile UX: Immediately switch to 'chat' tab so user sees query sending and quota status
    setMobileHubTab('chat');

    const queryTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptQuery,
      timestamp: queryTime
    };

    // Check Daily Question Quota
    const todayStr = new Date().toISOString().slice(0, 10);
    const maxQuota = currentUser?.isGoogleLoggedIn ? 15 : 5;
    let currentRemaining = questionQuota.remaining;
    if (questionQuota.date !== todayStr) {
      currentRemaining = maxQuota;
    }

    if (currentRemaining <= 0) {
      setChatMessages(prev => [
        ...prev,
        userMsg,
        {
          id: `bot-exhausted-${Date.now()}`,
          role: 'assistant',
          isQuotaExhausted: true,
          text: (lang === 'ko')
            ? `⚠️ **오늘 제공된 무료 AI 질문(${maxQuota}/${maxQuota}회)을 모두 사용하셨습니다.**\n\n매일 자정(00:00)에 ${maxQuota}회가 자동으로 충전됩니다! ✨\n아래 버튼을 눌러 **15초 광고 시청(+3회 즉시 충전)** 또는 **Google 로그인(매일 15회 확장)**을 이용하실 수 있습니다.`
            : `⚠️ **You have used all ${maxQuota} free AI questions for today.**\n\nYour ${maxQuota} free quota will automatically recharge at midnight (00:00)! ✨\nWatch a 15s ad for +3 chats or sign in with Google for 15 chats daily!`,
          generationTime: '0.0',
          queryTime,
          replyTime: queryTime,
          timestamp: queryTime
        }
      ]);
      return;
    }

    // Decrement quota
    const updatedQuota = { date: todayStr, remaining: currentRemaining - 1, total: maxQuota };
    setQuestionQuota(updatedQuota);
    try {
      localStorage.setItem('vora_daily_quota', JSON.stringify(updatedQuota));
    } catch (e) {}

    const startTime = Date.now();
    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // If query mentions a specific day (e.g. "2일차", "3일차"), auto focus on that day. Otherwise always reset to Day 1!
    const dayMatch = promptQuery.match(/([1-5])일차/);
    if (dayMatch && dayMatch[1]) {
      setActiveDay(Number(dayMatch[1]));
    } else {
      setActiveDay(1);
    }

    try {
      const result = await geminiGenerateFullItinerary(promptQuery, lang, itineraryData);
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      if (result && result.responseType === 'chat') {
        // 💬 Conversational & Clarifying Mode: Keep existing itinerary screen intact!
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: result.message,
          quickSuggestions: result.quickSuggestions || [],
          generationTime: result.generationTime || elapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
        setMobileHubTab('chat');
      } else {
        // 📍 Full Itinerary Mode: Render full course and sync map
        const finalResult = {
          ...(result || generateLocalFallbackItinerary(promptQuery, extractLocationKeyword(promptQuery), 2, lang)),
          generationTime: elapsedSeconds
        };
        
        setItineraryData(finalResult);
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: `✨ **${finalResult.tripTitle}**\n${finalResult.summary}`,
          itinerary: finalResult,
          generationTime: elapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
        setMobileHubTab('magazine');
      }
    } catch (err) {
      console.warn('[VORA AI Error]', err);
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const fallback = {
        ...generateLocalFallbackItinerary(promptQuery, extractLocationKeyword(promptQuery), 2, lang),
        generationTime: elapsedSeconds
      };
      setItineraryData(fallback);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${fallback.tripTitle}**\n${fallback.summary}`,
        itinerary: fallback,
        generationTime: elapsedSeconds,
        queryTime,
        replyTime,
        timestamp: replyTime
      };
      setChatMessages(prev => [...prev, botMsg]);
      setMobileHubTab('magazine');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-main)',
      position: 'relative'
    }}>
      {/* PWA Home Screen Installation Guide Banner */}
      <PWAInstallBanner lang={lang} />

      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        wishlistCount={bookmarks.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenWeather={(city) => {
          setWeatherCity(city || itineraryData?.targetCity || '서울');
          setIsWeatherOpen(true);
        }}
        onOpenEssentials={() => setIsEssentialsOpen(true)}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onLogout={handleLogout}
        targetCity={itineraryData?.targetCity || '서울'}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1320px',
        width: '100%',
        margin: '0 auto',
        padding: '0 0.85rem 1.5rem 0.85rem',
        boxSizing: 'border-box',
        flex: 1
      }}>
        {/* 1. Ultra-Compact Modern Hero Section with Smart Prompt Bar */}
        <HeroSection
          lang={lang}
          onSearch={handleGenerateItinerary}
          isLoading={isLoading}
          questionQuota={questionQuota}
        />

        {/* 📱 Mobile Segmented Tab Switcher (Visible on Mobile only: 1-Tap Toggle between Map & Chat) */}
        <div className="mobile-hub-tabs-wrapper">
          <button
            type="button"
            className={`mobile-hub-tab-btn ${mobileHubTab === 'magazine' ? 'active' : 'inactive'}`}
            onClick={() => setMobileHubTab('magazine')}
          >
            <MapPin size={15} />
            <span>{lang === 'en' ? 'Course & Map' : lang === 'ja' ? 'コース＆地図' : (lang === 'zh' || lang === 'zht') ? '路线与地图' : '코스 & 지도'}</span>
          </button>
          <button
            type="button"
            className={`mobile-hub-tab-btn ${mobileHubTab === 'chat' ? 'active' : 'inactive'}`}
            onClick={() => setMobileHubTab('chat')}
          >
            <MessageSquare size={15} />
            <span>{lang === 'en' ? 'AI Chat' : lang === 'ja' ? 'AI チャット' : (lang === 'zh' || lang === 'zht') ? 'AI 对话' : 'AI 대화'}</span>
          </button>
        </div>

        {/* 2. PC 2-Column Split Hub (Dashboard view: Chat on Left / Timeline & Map on Right) */}
        <section id="itinerary-hub" className="itinerary-hub-container">
          {/* Left Column: Vora AI Conversational Chat Stream */}
          <div className={`itinerary-hub-column ${mobileHubTab !== 'chat' ? 'mobile-hidden' : ''}`}>
            <VoraAIChat
              lang={lang}
              chatMessages={chatMessages}
              isLoading={isLoading}
              onSendMessage={handleGenerateItinerary}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              questionQuota={questionQuota}
              onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
              onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
              onResetQuotaForDev={handleResetQuotaForDev}
              currentUser={currentUser}
            />
          </div>

          {/* Right Column: Course Magazine View & Google Map */}
          <div className={`itinerary-hub-column ${mobileHubTab !== 'magazine' ? 'mobile-hidden' : ''}`}>
            <CourseMagazineView
              lang={lang}
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        </section>

        {/* 3. Mid-page Google AdSense Unit */}
        <AdSenseBanner slot="7890123456" />

        {/* 4. Travel Essentials Section (Weather & Styling, Subway, Climate card, eSIM, 1330) */}
        <div id="travel-essentials-section">
          <TravelEssentialsSection
            lang={lang}
            targetCity={itineraryData?.targetCity || '서울'}
            onOpenWeather={(city) => {
              setWeatherCity(city || itineraryData?.targetCity || '서울');
              setIsWeatherOpen(true);
            }}
          />
        </div>

        {/* 5. Mid-page Google AdSense Unit */}
        <AdSenseBanner slot="8901234567" />

        {/* 6. AdSense Editorial Travel Articles & FAQ Section (High Content Authority) */}
        <AdSenseArticlesSection lang={lang} />
      </main>

      {/* Footer with Google AdSense Required Policy Links */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* AdSense Policy Links */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '1.25rem',
            fontWeight: 700
          }}>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.privacyPolicy || '개인정보처리방침'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTermsOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.termsOfService || '이용약관'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.aboutUs || '서비스 소개'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.contactUs || '제휴 및 문의'}
            </button>
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            {t.footerCopyright || '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.'}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {t.footerTourApiNotice || 'Google Gemini 3.0 AI & Google Maps Platform 연동'} | Official Contact: terainfoai@gmail.com
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedSpot && (
        <TravelDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          lang={lang}
          isBookmarked={bookmarks.some(b => 
            (typeof b === 'object' && ((b.contentId && b.contentId === (selectedSpot.contentId || selectedSpot.id)) || (b.id && b.id === selectedSpot.id) || (b.title && b.title === selectedSpot.title))) ||
            (typeof b === 'string' && (b === selectedSpot.id || b === selectedSpot.contentId || b === selectedSpot.title))
          )}
          onToggleBookmark={(spot) => handleToggleBookmark(spot || selectedSpot)}
        />
      )}

      {isWishlistOpen && (
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistSpots={bookmarks}
          onRemoveWishlist={(id) => handleToggleBookmark({ id })}
          onSelectSpot={(spot) => {
            setIsWishlistOpen(false);
            setSelectedSpot(spot);
          }}
          lang={lang}
        />
      )}

      {isWeatherOpen && (
        <WeatherModal
          isOpen={isWeatherOpen}
          onClose={() => setIsWeatherOpen(false)}
          lang={lang}
          initialRegion={weatherCity || itineraryData?.targetCity || '서울'}
        />
      )}

      {isEssentialsOpen && (
        <TravelEssentialsModal
          isOpen={isEssentialsOpen}
          onClose={() => setIsEssentialsOpen(false)}
          lang={lang}
        />
      )}

      {isPrivacyOpen && (
        <PrivacyPolicyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          lang={lang}
        />
      )}

      {isTermsOpen && (
        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          lang={lang}
        />
      )}

      {isAboutOpen && (
        <AboutUsModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          lang={lang}
        />
      )}

      {isContactOpen && (
        <ContactUsModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          lang={lang}
        />
      )}

      {/* Rewarded Ad Modal (15-second sponsor ad for +3 questions) */}
      <RewardedAdModal
        isOpen={isRewardedAdOpen}
        onClose={() => setIsRewardedAdOpen(false)}
        onRewardGranted={handleRewardGranted}
        lang={lang}
      />

      {/* Google Sign-in Auth Modal (15 questions per day + cloud storage) */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        lang={lang}
      />

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <TravelDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
