/**
 * ==============================================================================
 * VORA AI 3.0 - 1차 공식 오픈 버전 (Phase 1 Official Launch Release)
 * 대한민국 대표 AI 여행 컨시어지 & 실시간 날씨 코디 플래너 (koreatravel.cc)
 * 
 * 1. AI 여행 코스 엔진: Gemini 3.5 Flash-Lite Multi-Tier 초고속 생성 (< 1.2s)
 * 2. 실시간 날씨 & 체감온도: 전국 동단위 지오코딩 + 기온/체감 듀얼 표기 + 3일 예보
 * 3. 정품 포토 엔진: 한국관광공사 TourAPI 4.0 CDN + Google Places 실시간 병렬 매칭
 * 4. 글로벌 대중교통: Google Maps 3D + 카카오/네이버 연동 + 무낭비 동선 클러스터링
 * 5. 다국어 지원: 한국어, 영어, 일본어, 중국어 3중 스마트 자동 감지
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PortalHomePrototype from './components/PortalHomePrototype';
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
import BottomNav from './components/BottomNav';
import FullMapTab from './components/FullMapTab';
import MoreTabSection from './components/MoreTabSection';
import AIPlannerTab from './components/AIPlannerTab';
import MyTripTab from './components/MyTripTab';
import LiveTripTab from './components/LiveTripTab';
import ExitConfirmModal from './components/ExitConfirmModal';

import { MapPin, MessageSquare } from 'lucide-react';
import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { geminiGenerateFullItinerary, generateLocalFallbackItinerary, enrichItineraryPhotosAsync, extractLocationKeyword, extractDaysFromPrompt } from './services/geminiNlpService';

export default function App() {
  // 4-Language State (ko, en, ja, zh) with 3-Tier Intelligent Auto-Detection
  const [lang, setLang] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['ko', 'en', 'ja', 'zh', 'zht'].includes(urlLang.toLowerCase())) {
          return urlLang.toLowerCase() === 'zht' ? 'zh' : urlLang.toLowerCase();
        }
      }
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

  // 5-Tab Screen Navigation State ('home' | 'ai' | 'mytrip' | 'map' | 'more')
  const [activeNavTab, setActiveNavTab] = useState('home');

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

  // ==============================================================================
  // 🌟 VORA AI Global Configuration (선배님 설정: 기본 3회 무료 생성)
  // ==============================================================================
  const DAILY_FREE_ITINERARY_LIMIT = 3;

  // Daily Question Quota Management (모든 사용자 공평하게 기본 3회 제공)
  const [questionQuota, setQuestionQuota] = useState(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const totalLimit = DAILY_FREE_ITINERARY_LIMIT;

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

  // AI Planner 1단계(form) vs 2단계(chat) 진입 모드 관리
  const [plannerInitialMode, setPlannerInitialMode] = useState('form');

  // 💡 스마트 이탈 방지 모달 상태
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [pendingNavTab, setPendingNavTab] = useState('home');
  const [isCurrentItinerarySaved, setIsCurrentItinerarySaved] = useState(false);

  // 저장된 여행 목록 (내 여행 탭 연동)
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_saved_trips');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 🌟 [일정 확정 및 내 여행 저장] 코어 핸들러 (쿼터 1회 차감 & 저장)
  const handleSaveCurrentItinerary = (targetNextTab = 'mytrip') => {
    if (!itineraryData) {
      setActiveNavTab(targetNextTab);
      return;
    }

    // 1. 남은 저장 횟수 확인
    const currentRemaining = questionQuota?.remaining || 0;
    if (currentRemaining <= 0) {
      // 🔒 횟수 소진 시 보상형 광고 모달 띄우기!
      setIsExitModalOpen(false);
      setIsRewardedAdOpen(true);
      return;
    }

    // 2. 저장 횟수 1회 차감
    setQuestionQuota(prev => {
      const updated = {
        ...prev,
        remaining: Math.max(0, (prev?.remaining || 1) - 1)
      };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 3. [내 여행]에 온전히 보관
    const newSaved = {
      ...itineraryData,
      savedAt: new Date().toISOString(),
      savedId: `trip-${Date.now()}`
    };

    setSavedTrips(prev => {
      const filtered = prev.filter(p => p.tripTitle !== newSaved.tripTitle);
      const updated = [newSaved, ...filtered];
      try {
        localStorage.setItem('vora_saved_trips', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setIsCurrentItinerarySaved(true);
    setIsExitModalOpen(false);
    setActiveNavTab(targetNextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🚪 그냥 나가기 (차감 없이 즉시 이동)
  const handleExitWithoutSaving = () => {
    setIsExitModalOpen(false);
    setActiveNavTab(pendingNavTab || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 탭 네비게이션 가로채기 핸들러
  const handleTabNavigate = (targetTab) => {
    if (activeNavTab === 'ai' && targetTab !== 'ai' && itineraryData && !isCurrentItinerarySaved) {
      setPendingNavTab(targetTab);
      setIsExitModalOpen(true);
      return;
    }
    setActiveNavTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 📱 모바일 하드웨어/제스처 뒤로가기(popstate) & 새로고침(beforeunload) 2중 방어 시스템
  useEffect(() => {
    const shouldIntercept = (activeNavTab === 'ai' && !isCurrentItinerarySaved && !!itineraryData);

    if (shouldIntercept) {
      // 1. 브라우저 히스토리 스택에 가상 티켓 주입
      try {
        window.history.pushState({ voraTab: 'ai', timestamp: Date.now() }, '');
      } catch (e) {}

      // 2. 모바일 뒤로가기 가로채기
      const handlePopState = (e) => {
        // 뒤로가기 신호를 받으면 브라우저가 빠져나가지 못하도록 즉시 스택을 다시 채워 고정!
        try {
          window.history.pushState({ voraTab: 'ai', timestamp: Date.now() }, '');
        } catch (err) {}
        setPendingNavTab('home');
        setIsExitModalOpen(true);
      };

      // 3. 브라우저 새로고침(F5) / 탭 닫기(X) 시스템 경고창
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [activeNavTab, isCurrentItinerarySaved, itineraryData]);

  // Grant Reward (+3 chats on watching 15s ad)
  const handleRewardGranted = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setQuestionQuota(prev => {
      const newRemaining = (prev?.remaining || 0) + 3;
      const updated = { date: todayStr, remaining: newRemaining, total: prev?.total || DAILY_FREE_ITINERARY_LIMIT };
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
          ? '🎉 **스폰서 영상 시청 완료! 무료 AI 여행 생성 +3회가 즉시 충전되었습니다.** ✨\n원하시는 여행 코스를 자유롭게 설계해 보세요!'
          : '🎉 **Sponsor video completed! +3 free AI itineraries have been granted.** ✨\nFeel free to plan more trips!',
        queryTime,
        replyTime: queryTime,
        timestamp: queryTime
      }
    ]);
  };

  // Google Login Success Handler
  const handleLoginSuccess = (profile) => {
    setCurrentUser(profile);
  };

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('vora_user_profile');
    } catch (e) {}
    setCurrentUser(null);
  };

  // Reset Quota for Testing / Dev
  const handleResetQuotaForDev = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const reset = { date: todayStr, remaining: DAILY_FREE_ITINERARY_LIMIT, total: DAILY_FREE_ITINERARY_LIMIT };
    setQuestionQuota(reset);
    try {
      localStorage.setItem('vora_daily_quota', JSON.stringify(reset));
    } catch (e) {}
  };

  // 🚀 AI 여행 일정 생성 코어 핸들러 (1단계 & 2단계 공용 - 무제한 자유 대화 조율)
  const handleGenerateItinerary = async (promptQuery) => {
    if (!promptQuery || typeof promptQuery !== 'string' || !promptQuery.trim()) return;
    if (isLoading) return;

    const startTime = Date.now();
    const queryTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    // Add user message to stream
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptQuery,
      queryTime,
      timestamp: queryTime
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

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
      } else {
        const requestedDays = extractDaysFromPrompt(promptQuery) || 3;
        const finalResult = {
          ...(result || generateLocalFallbackItinerary(promptQuery, extractLocationKeyword(promptQuery), requestedDays, lang)),
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
      }
    } catch (err) {
      console.warn('[VORA AI Error]', err);
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const requestedDays = extractDaysFromPrompt(promptQuery) || 3;
      const fallback = {
        ...generateLocalFallbackItinerary(promptQuery, extractLocationKeyword(promptQuery), requestedDays, lang),
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

      {/* Main Container (모바일 5대 탭 전환 & PC 와이드 뷰 최적화) */}
      <main className="app-main-container" style={{ paddingBottom: '4.5rem' }}>
        {/* ==============================================================================
           TAB 1. 🏠 홈 (Home): 시원한 Hero, 퀵 인텐트 칩 & 6대 테마 탐색
           ============================================================================== */}
        {activeNavTab === 'home' && (
          <div className="tab-content-fade-in" style={{ width: '100%' }}>
            <PortalHomePrototype
              lang={lang}
              onSearchSubmit={(promptText) => {
                // 🚀 홈 검색 시: 2단계 AI 대화 브리핑 화면으로 스마트 직행!
                setPlannerInitialMode('chat');
                setActiveNavTab('ai');
                handleGenerateItinerary(promptText);
              }}
              onSelectTheme={(promptText, city) => {
                // 🚀 홈 칩 클릭 시: 2단계 AI 대화 브리핑 화면으로 스마트 직행!
                setPlannerInitialMode('chat');
                setActiveNavTab('ai');
                handleGenerateItinerary(promptText);
              }}
              onOpenWeather={(city) => {
                setWeatherCity(city || itineraryData?.targetCity || '서울');
                setIsWeatherOpen(true);
              }}
              onOpenEssentials={() => setIsEssentialsOpen(true)}
              onOpenPlanner={() => {
                // 🚀 퀵 카드 클릭 시: 1단계 AI Studio 조건 폼으로 이동!
                setPlannerInitialMode('form');
                setActiveNavTab('ai');
              }}
              targetCity={itineraryData?.targetCity || '서울'}
            />

            {/* PC 와이드 화면일 때 홈 하단에 2단 대시보드 함께 표시 */}
            <div className="desktop-only-hub" style={{ marginTop: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                padding: '0 0.25rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '22px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '4px'
                }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                  {t.portalLivePlannerTitle || '실시간 맞춤 AI 여행 일정 & 스마트 동선 플래너'}
                </h2>
              </div>

              <section id="itinerary-hub" className="itinerary-hub-container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                <div className="itinerary-hub-column" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <VoraAIChat
                    lang={lang}
                    chatMessages={chatMessages}
                    isLoading={isLoading}
                    onSendMessage={handleGenerateItinerary}
                    activeDay={activeDay}
                    onSelectDay={(day) => setActiveDay(day)}
                    questionQuota={questionQuota}
                    onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
                    onConfirmItinerary={() => setActiveNavTab('mytrip')}
                  />
                </div>
                <div className="itinerary-hub-column" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
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
            </div>
          </div>
        )}

        {/* ==============================================================================
           TAB 2. ✨ AI 플래너 (AI Concierge): 1단계 Studio 폼 ➔ 2단계 대화 조율 & 확정
           ============================================================================== */}
        {activeNavTab === 'ai' && (
          <div className="tab-content-fade-in" style={{ width: '100%', maxWidth: '880px', margin: '0 auto' }}>
            <AIPlannerTab
              lang={lang}
              onGenerateItinerary={handleGenerateItinerary}
              onConfirmItinerary={() => {
                // 🌟 2단계에서 [일정 확정] 터치 시 ➔ 쿼터 1회 차감 & [내 여행]으로 쏙 이동!
                handleSaveCurrentItinerary('mytrip');
              }}
              isLoading={isLoading}
              questionQuota={questionQuota}
              onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
              chatMessages={chatMessages}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              itineraryData={itineraryData}
              initialMode={plannerInitialMode}
            />
          </div>
        )}

        {/* ==============================================================================
           TAB 3. 🧳 내 여행 (My Trip): 3단계 확정 타임라인 & 0원 동선 최적화 & PDF/공유
           ============================================================================== */}
        {activeNavTab === 'mytrip' && (
          <div className="tab-content-fade-in" style={{ width: '100%', maxWidth: '880px', margin: '0 auto' }}>
            <MyTripTab
              lang={lang}
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              onGoToMap={() => setActiveNavTab('map')}
              onGoToModify={() => {
                // 🌟 3단계에서 [AI와 대화로 수정하기] 터치 시 ➔ 2단계 대화창으로 자연스러운 복귀!
                setPlannerInitialMode('chat');
                setActiveNavTab('ai');
              }}
              onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
            />
          </div>
        )}

        {/* ==============================================================================
           TAB 4. 🗺️ 지도 (Map): 이동 경로 번호 핀 및 전체화면 스마트 지도
           ============================================================================== */}
        {activeNavTab === 'map' && (
          <div className="tab-content-fade-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <FullMapTab
              lang={lang}
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              onBackToTrip={() => setActiveNavTab('mytrip')}
            />

          </div>
        )}

        {/* ==============================================================================
           TAB 5. ☰ 더보기 (More): 여행 중 모드 ("지금 뭐하지?") + 실시간 날씨 & 필수 정보
           ============================================================================== */}
        {activeNavTab === 'more' && (
          <div className="tab-content-fade-in" style={{ width: '100%', maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 🌟 1. 여행 중 모바일 실시간 모드 ("지금 뭐하지?") */}
            <LiveTripTab
              lang={lang}
              targetCity={itineraryData?.targetCity || '서울'}
              nextSpot={itineraryData?.spots?.[1] || null}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              onOpenWeather={(city) => {
                setWeatherCity(city || itineraryData?.targetCity || '서울');
                setIsWeatherOpen(true);
              }}
            />

            {/* 📚 2. 필수 여행 정보 및 정책 */}
            <MoreTabSection
              lang={lang}
              targetCity={itineraryData?.targetCity || '서울'}
              onOpenWeather={(city) => {
                setWeatherCity(city || itineraryData?.targetCity || '서울');
                setIsWeatherOpen(true);
              }}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
              onOpenTerms={() => setIsTermsOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenEssentials={() => setIsEssentialsOpen(true)}
            />
          </div>
        )}
      </main>

      {/* 📱 Mobile Fixed 5-Tab Navigation Bar */}
      <BottomNav
        activeTab={activeNavTab}
        onTabChange={(tabId) => {
          handleTabNavigate(tabId);
        }}
        lang={lang}
      />

      {/* Footer with Google AdSense Required Policy Links (Visible only on Home and More tabs) */}
      {(activeNavTab === 'home' || activeNavTab === 'more') && (
        <footer style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-color)',
          padding: '1.75rem 1rem 5.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontWeight: 600 }}>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
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
      )}


      {/* Modals & Drawers */}
      {selectedSpot && (
        <TravelDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          lang={lang}
          onReplaceSpot={(targetSpot, newSpot) => {
            if (!itineraryData || !targetSpot || !newSpot) return;
            const targetClean = (targetSpot.title || targetSpot.name || '').split('&')[0].split('/')[0].trim();

            const updatedSchedules = (itineraryData.dailySchedules || []).map(sch => ({
              ...sch,
              spots: (sch.spots || []).map(s => {
                const sClean = (s.title || s.name || '').split('&')[0].split('/')[0].trim();
                if (s.id === targetSpot.id || sClean === targetClean || s.title === targetSpot.title) {
                  return { ...s, ...newSpot, id: s.id || `spot-${Date.now()}`, assignedDay: sch.day };
                }
                return s;
              })
            }));

            const updatedSpots = (itineraryData.spots || []).map(s => {
              const sClean = (s.title || s.name || '').split('&')[0].split('/')[0].trim();
              if (s.id === targetSpot.id || sClean === targetClean || s.title === targetSpot.title) {
                return { ...s, ...newSpot, id: s.id || `spot-${Date.now()}`, assignedDay: s.assignedDay };
              }
              return s;
            });

            const updatedItinerary = {
              ...itineraryData,
              dailySchedules: updatedSchedules,
              spots: updatedSpots
            };

            setItineraryData(updatedItinerary);
            try {
              localStorage.setItem('vora_last_itinerary', JSON.stringify(updatedItinerary));
            } catch (e) {}

            setSelectedSpot(null); // 모달 자동 닫기!
            setActiveNavTab('mytrip'); // 내 일정 화면으로 즉시 복귀하여 변경사항 확인!
          }}

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

      {/* 💡 Smart Exit Interception Modal (저장하고 나가기 vs 그냥 나가기) */}
      <ExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onSaveAndExit={() => handleSaveCurrentItinerary(pendingNavTab || 'home')}
        onJustExit={handleExitWithoutSaving}
        itineraryData={itineraryData}
        lang={lang}
        remainingQuota={questionQuota?.remaining || 0}
      />
    </div>
  );
}
