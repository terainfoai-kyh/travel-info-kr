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

import React, { useState, useEffect, useRef } from 'react';
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
import AdminBatchModal from './components/AdminBatchModal';
import BottomNav from './components/BottomNav';
import FullMapTab from './components/FullMapTab';
import MoreTabSection from './components/MoreTabSection';
import AIPlannerTab from './components/AIPlannerTab';
import MyTripTab from './components/MyTripTab';
import LiveTripTab from './components/LiveTripTab';
import DesktopMapExplorer from './components/DesktopMapExplorer';
import DesktopNavSidebar from './components/DesktopNavSidebar';
import DockedMapStation from './components/DockedMapStation';
import SubwayMapModal from './components/SubwayMapModal';
import HelplineModal from './components/HelplineModal';
import Footer from './components/Footer';

import { detectBrowserLanguage, TRANSLATIONS, getLocalizedCityName } from './i18n/translations';
import { geminiGenerateFullItinerary, generateLocalFallbackItinerary, enrichItineraryPhotosAsync, extractLocationKeyword, extractDaysFromPrompt } from './services/geminiNlpService';
import { recalculateItineraryTimeSlots } from './services/localItineraryGenerator';
import { sanitizeInput, inspectSecurityGuardrails } from './services/securityGuardService';
import { findRecommendedPois } from './data/koreaTravelPoiDatabase';
import { fetchCityTourApiSpots, fetchDynamicRealtimeSpots } from './services/tourApi';
import { getDynamicGatewayChips, CITY_LOCAL_KNOWLEDGE, resolveTikitakaResponse } from './data/voraDialogKnowledge';
import { matchVoraQna, logUnansweredQuestion } from './services/voraQnaMatcher';
import { buildTravelContext, generateContextualAdvice, patchTravelState, removeContextChip, toggleContextChip, classifyUserIntent, getActiveContextChips, INITIAL_TRAVEL_STATE } from './services/travelContextEngine';
import { fetchCloudTrips, pushTripsToCloud, overwriteTripsToCloud, deleteTripFromCloud, parseTripFromUrl } from './services/tripSyncService';

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

  const getInitialWelcomeMessages = (currentLang, currentItinerary = null) => {
    const messages = [];

    if (currentItinerary) {
      messages.push({
        id: `featured-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${currentItinerary.tripTitle || currentItinerary.title}**\n${currentItinerary.summary || ''}`,
        itinerary: currentItinerary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generationTime: currentItinerary.generationTime || '0.9'
      });
      return messages;
    }

    // 🌟 일정이 없을 때 보라 AI의 정품 첫인사 웰컴 메시지 100% 표출!
    const greetings = {
      ko: '👋 안녕하세요! 대한민국 AI 여행 컨시어지 **보라(VORA)**입니다.\n어디로 떠나고 싶으신가요? 가고 싶은 도시나 여행 테마를 말씀해 주시면 맞춤형 3D 코스를 바로 만들어 드릴게요! ✨',
      en: '👋 Hello! I am **Vora**, your AI travel concierge for South Korea.\nWhere would you like to travel? Tell me your destination or preferred theme, and I will craft an optimized itinerary for you! ✨',
      ja: '👋 こんにちは！韓国旅行AIコンシェルジュの**ボラ(VORA)**です。\nどちらへ旅行したいですか？希望の都市やテーマをお知らせいただければ、最適な旅行コースをすぐにご提案します！✨',
      zh: '👋 您好！我是您的韩国旅行AI专属向导 **宝拉(VORA)**。\n您想去哪里旅行呢？告诉我您心仪的城市或旅行主题，我将为您即时定制专属行程！✨'
    };

    messages.push({
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      text: greetings[currentLang] || greetings.ko,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return messages;
  };

  const handleLanguageChange = async (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('vora_lang', newLang);
    } catch (e) {}

    // 🌟 [방안 A] 만약 현재 활성화된 일정이 있다면, 새 언어로 즉시 동기화 재구성!
    if (itineraryData) {
      const targetCity = itineraryData.targetCity || extractLocationKeyword(itineraryData.tripTitle || '') || '서울';
      const days = itineraryData.days || itineraryData.dailySchedules?.length || 3;

      try {
        const localizedPlan = await generateLocalFallbackItinerary(
          `${targetCity} ${days}일 여행`,
          targetCity,
          days,
          newLang
        );
        if (localizedPlan) {
          setItineraryData(localizedPlan);
          setChatMessages(getInitialWelcomeMessages(newLang, localizedPlan));
          return;
        }
      } catch (err) {
        console.warn('Failed to re-localize itinerary on language change:', err);
      }
    }

    // 일정이 없는 경우: 정품 다국어 첫인사 웰컴 메시지로 세팅
    setChatMessages(getInitialWelcomeMessages(newLang, null));
    setActiveDay(1);
    setSelectedSpot(null);
  };

  const handleResetChat = () => {
    setChatMessages(getInitialWelcomeMessages(lang, null));
    setSessionContext(INITIAL_TRAVEL_STATE);
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

  // 저장된 여행 목록 (내 여행 탭 연동 & URL 즉시 복원)
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const fromUrl = parseTripFromUrl();
      const saved = localStorage.getItem('vora_saved_trips');
      const list = saved ? JSON.parse(saved) : [];
      if (fromUrl) {
        const filtered = list.filter(t => (t.savedId || t.tripTitle) !== fromUrl.savedId && t.tripTitle !== fromUrl.tripTitle);
        const updated = [fromUrl, ...filtered];
        try { localStorage.setItem('vora_saved_trips', JSON.stringify(updated)); } catch (e) {}
        return updated;
      }
      return list;
    } catch (e) {
      return [];
    }
  });

  // 🧠 3-Tier Stateful Travel Context Manager (Trip Memory + Current Context)
  const [sessionContext, setSessionContext] = useState(INITIAL_TRAVEL_STATE);

  // Itinerary State - URL에서 온 일정이 있으면 최우선 로딩
  const [itineraryData, setItineraryData] = useState(() => {
    try {
      const fromUrl = parseTripFromUrl();
      if (fromUrl) return fromUrl;
      const saved = localStorage.getItem('vora_saved_trips');
      const list = saved ? JSON.parse(saved) : [];
      return list.length > 0 ? list[0] : null;
    } catch (e) {
      return null;
    }
  });

  // Selected Trip ID for MyTripTab
  const [selectedTripId, setSelectedTripId] = useState(() => {
    try {
      const fromUrl = parseTripFromUrl();
      if (fromUrl) return fromUrl.savedId;
      const saved = localStorage.getItem('vora_saved_trips');
      const list = saved ? JSON.parse(saved) : [];
      return list.length > 0 ? (list[0].savedId || list[0].id || list[0].tripTitle) : null;
    } catch (e) {
      return null;
    }
  });

  // Background live photo enrichment via TourAPI 4.0 & Wikimedia
  useEffect(() => {
    let isMounted = true;
    if (itineraryData) {
      enrichItineraryPhotosAsync(itineraryData).then(enriched => {
        if (isMounted && enriched) {
          setItineraryData(prev => (prev?.tripTitle === itineraryData.tripTitle ? enriched : prev));
        }
      });
    }
    return () => { isMounted = false; };
  }, [itineraryData?.tripTitle]);

  // 📱 [모바일 QR / 1초 링크 진입 감지] URL에 tripData가 있으면 즉시 복원하여 화면에 표시 및 자동 보관!
  useEffect(() => {
    const tripFromUrl = parseTripFromUrl();
    if (tripFromUrl) {
      setItineraryData(tripFromUrl);
      setSelectedTripId(tripFromUrl.savedId);
      setHasActiveUnsavedDraft(false);
      setActiveNavTab('mytrip');
      setSavedTrips(prev => {
        const filtered = prev.filter(t => (t.savedId || t.tripTitle) !== tripFromUrl.savedId && t.tripTitle !== tripFromUrl.tripTitle);
        const updated = [tripFromUrl, ...filtered];
        try {
          localStorage.setItem('vora_saved_trips', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}
    }
  }, []);

  const [chatMessages, setChatMessages] = useState(() => getInitialWelcomeMessages(lang, null));
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
  const [activeNavTab, setActiveNavTab] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('tripData')) {
        return 'mytrip';
      }
    } catch (e) {}
    return 'home';
  });

  // 🗺️ 좌측 도킹 & 슬라이드 접이식 스마트 지도 스테이션 상태 (AI 대화 / 내 여행 탭 연동)
  const [isDockedMapOpen, setIsDockedMapOpen] = useState(true);

  // Modals & Drawers Open State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isSubwayMapOpen, setIsSubwayMapOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isAdminBatchOpen, setIsAdminBatchOpen] = useState(false);
  const [weatherCity, setWeatherCity] = useState('서울');

  // User Profile State (Google Logged In vs Guest)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // ☁️ [클라우드 일정 실시간 동기화] 구글 로그인 시 서버와 양방향 병합
  useEffect(() => {
    if (!currentUser || !currentUser.email) return;
    let isMounted = true;
    fetchCloudTrips(currentUser.email).then(cloudList => {
      if (!isMounted || !Array.isArray(cloudList) || cloudList.length === 0) return;
      setSavedTrips(prev => {
        const map = new Map();
        for (const t of cloudList) {
          const k = t.savedId || t.tripTitle || t.id;
          if (k) map.set(k, t);
        }
        for (const t of prev) {
          const k = t.savedId || t.tripTitle || t.id;
          if (k) map.set(k, t);
        }
        const merged = Array.from(map.values());
        try {
          localStorage.setItem('vora_saved_trips', JSON.stringify(merged));
        } catch (e) {}
        return merged;
      });
    }).catch(err => console.warn('[CloudSync Init Error]', err));
    return () => { isMounted = false; };
  }, [currentUser?.email]);

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

  // 💡 작성 중(미저장) AI 일정 상태 관리
  const [hasActiveUnsavedDraft, setHasActiveUnsavedDraft] = useState(false);

  // 🌟 [일정 확정 및 내 여행 저장] 코어 핸들러 (쿼터 1회 차감 & 저장 & 클라우드 실시간 푸시)
  const handleSaveCurrentItinerary = (targetNextTab = 'mytrip', bypassQuotaCheck = false) => {
    if (!itineraryData) {
      setActiveNavTab(targetNextTab);
      return;
    }

    // 1. 남은 저장 횟수 확인 (광고 시청 직후 bypass인 경우 즉시 통과!)
    const currentRemaining = questionQuota?.remaining || 0;
    if (!bypassQuotaCheck && currentRemaining <= 0) {
      // 🔒 횟수 소진 시 보상형 광고 모달 띄우기!
      setIsRewardedAdOpen(true);
      return;
    }

    // 2. 저장 횟수 1회 차감 (bypass가 아닐 때만 차감)
    if (!bypassQuotaCheck) {
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
    }

    // 3. [내 여행]에 온전히 보관 (고유 savedId 부여)
    const newSaved = {
      ...itineraryData,
      savedAt: new Date().toISOString(),
      savedId: itineraryData.savedId || `trip-${Date.now()}`
    };

    setSavedTrips(prev => {
      // 🌟 동일한 savedId를 가진 항목만 교체하고, 새로 생성된 다른 일정은 보관함에 온전히 신규 추가!
      const filtered = prev.filter(p => p.savedId !== newSaved.savedId);
      const updated = [newSaved, ...filtered];
      try {
        localStorage.setItem('vora_saved_trips', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 4. ☁️ 로그인 사용자라면 Cloudflare 중앙 클라우드로 즉시 동기화 백업!
    if (currentUser?.email) {
      pushTripsToCloud(currentUser.email, [newSaved]).catch(e => console.warn('[Cloud Push Error]', e));
    }

    setItineraryData(newSaved);
    setSelectedTripId(newSaved.savedId);
    setHasActiveUnsavedDraft(false);
    if (targetNextTab) {
      setActiveNavTab(targetNextTab);
    }
  };

  // 탭 네비게이션 핸들러 (방해 팝업 없이 즉시 자연스럽게 이동)
  const handleTabNavigate = (targetTab) => {
    setActiveNavTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🚨 브라우저 새로고침 및 모바일 뒤로가기/제스처 이탈 완벽 방어 (토큰 손실 100% 방지)
  useEffect(() => {
    if (!hasActiveUnsavedDraft) return;

    // 1. PC 브라우저 새로고침 / 탭 닫기 방어
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // 2. 모바일 브라우저 뒤로가기 버튼 & 제스처 가로채기 (popstate)
    window.history.pushState({ voraGuard: true }, '', window.location.href);
    const handlePopState = (e) => {
      if (hasActiveUnsavedDraft) {
        // 뒤로가기 스택 유지하고 모달 팝업!
        window.history.pushState({ voraGuard: true }, '', window.location.href);
        setIsExitModalOpen(true);
      }
    };

    // 3. 만약의 새로고침 대비 임시 로컬스토리지 백업
    if (itineraryData) {
      try {
        localStorage.setItem('vora_temp_active_draft', JSON.stringify(itineraryData));
      } catch (err) {}
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasActiveUnsavedDraft, itineraryData]);

  // Grant Reward (+3 saves on watching 15s ad) - NO 6: 대화창에 시스템 문구 삽입 없이 뱃지만 깔끔 갱신!
  const handleRewardGranted = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setQuestionQuota(prev => {
      const newRemaining = (prev?.remaining || 0) + 2; // +3회 지급 후 현재 일정 저장에 1회 소모하므로 +2
      const updated = { date: todayStr, remaining: newRemaining, total: prev?.total || DAILY_FREE_ITINERARY_LIMIT };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 🌟 저장 대기 중인 일정이 있었다면 광고 중복 호출 없이(bypassQuotaCheck=true) 즉시 저장 완료 후 [내 여행]으로 이동!
    if (itineraryData) {
      setTimeout(() => {
        handleSaveCurrentItinerary('mytrip', true);
      }, 50);
    }
  };

  // 🏷️ KoreaTravel 정품 POI를 현재 활성 일정(Day N)에 원터치 추가하는 핸들러 (0토큰 실시간 연동)
  const handleAddPoiToItinerary = (poi, targetDay = 1) => {
    if (!poi) return;
    
    // 1. 현재 일정이 있는 경우: 해당 Day 타임라인에 장소 추가
    if (itineraryData && itineraryData.dailyPlan) {
      const updatedDays = itineraryData.dailyPlan.map(dayObj => {
        if (dayObj.day === targetDay) {
          const newSpot = {
            id: poi.id || `spot-${Date.now()}`,
            name: poi.title,
            title: poi.title,
            time: '15:00',
            category: poi.category || '명소',
            tag: poi.theme || '추천명소',
            desc: poi.summary || `${poi.title} 탐방 및 힐링`,
            duration: `${poi.duration || 90}분`,
            image: poi.image,
            location: poi.city || poi.region,
            lat: poi.lat,
            lng: poi.lng
          };
          return {
            ...dayObj,
            spots: [...(dayObj.spots || []), newSpot]
          };
        }
        return dayObj;
      });

      const updatedItinerary = {
        ...itineraryData,
        dailyPlan: updatedDays
      };

      setItineraryData(updatedItinerary);
      setHasActiveUnsavedDraft(true);
      try {
        localStorage.setItem('vora_temp_active_draft', JSON.stringify(updatedItinerary));
      } catch (e) {}

      // 성공 봇 메시지 피드백
      const successMsg = {
        id: `bot-add-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${poi.title}**을(를) ${targetDay}일차 일정에 성공적으로 추가했어요! 🗺️\n아래 버튼을 눌러 업데이트된 일정표를 확인해 보세요!`,
        quickSuggestions: [
          (lang === 'en' ? '📋 View Updated Itinerary' : '📋 완성된 일정표 보기 (내 여행)'),
          (lang === 'en' ? '💬 Ask More Questions' : '💬 추가 질문하기')
        ],
        generationTime: '0.01',
        queryTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        replyTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      };
      setChatMessages(prev => [...prev, successMsg]);
    } else {
      // 2. 일정이 아직 없는 경우: 해당 POI가 포함된 기본 일정을 생성하여 세팅
      const location = poi.city || poi.region || '강원';
      const newPlan = generateLocalFallbackItinerary(`${location} 2박3일 여행`, location, 3, lang);
      setItineraryData(newPlan);
      setHasActiveUnsavedDraft(true);
      
      const successMsg = {
        id: `bot-add-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${poi.title}**을(를) 포함하여 **【 ${location} 3일 여행 코스 】**를 새로 구성했어요! 🗺️`,
        itinerary: newPlan,
        generationTime: '0.01',
        queryTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        replyTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      };
      setChatMessages(prev => [...prev, successMsg]);
    }
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

  // 🚀 AI 여행 일정 생성 코어 핸들러 (1단계 & 2단계 공용 - 무제한 자유 대화 조율 + 보안 가드레일)
  const handleGenerateItinerary = async (rawPromptQuery, isDirectAction = false, isExternalEntry = false) => {
    if (!rawPromptQuery || typeof rawPromptQuery !== 'string' || !rawPromptQuery.trim()) return;
    if (isLoading) return;

    // 🛡️ 1. XSS 살균 및 최대 글자수(300자) 가드
    const promptQuery = sanitizeInput(rawPromptQuery);
    if (!promptQuery) return;

    const startTime = Date.now();
    const queryTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    // 외부 진입이 아닐 때만(채팅창 내부 대화 중) 유저 메시지를 대화창에 추가
    if (!isExternalEntry) {
      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: promptQuery,
        queryTime,
        timestamp: queryTime
      };
      setChatMessages(prev => [...prev, userMsg]);
    }

    // 🛡️ 2. 보안 인젝션, 해킹, 유해어, 비관광 잡담 0-토큰 사전 차단
    const securityCheck = inspectSecurityGuardrails(promptQuery, lang);
    if (securityCheck.isBlocked) {
      setTimeout(() => {
        const botMsg = {
          id: `bot-guard-${Date.now()}`,
          role: 'assistant',
          text: securityCheck.replyText,
          quickSuggestions: securityCheck.quickSuggestions || ['👑 서울 인기 코스', '🌊 부산 오션뷰 코스'],
          generationTime: '0.01',
          queryTime,
          replyTime: queryTime,
          timestamp: queryTime
        };
        setChatMessages(prev => [...prev, botMsg]);
      }, 100);
      return;
    }

    // 🌟 3. 폼 초기 진입, 추천 칩 진입, 1번 검색창 도시 진입 확인 (isExternalEntry 일 때만 초기화 브리핑 실행!)
    const isQuestionAskingRecommendation = /(어디|뭐|언제|누구|어느|어떤|왜|무슨|몇)\s*(가|이|는|은|에)?\s*(좋아|좋을까|나을까|어때)/i.test(promptQuery);
    const isDayChangeQuery = /(\d+)\s*(일|박)\s*(으로|로)?\s*(바꿔|줄여|늘려|해줘|짜줘|변경|수정|해)/i.test(promptQuery) || /(하루\s*줄여|하루\s*더|이틀\s*더|하루\s*추가|이틀\s*추가)/i.test(promptQuery);
    const isDirectGenerateAction = isDirectAction || isDayChangeQuery || (!isQuestionAskingRecommendation && (
      /(이대로 바로 일정 만들기|이 조건으로 일정|일정 만들어줘|일정 만들어|일정 생성|일정 짜줘|일정 세워줘|일정표 만들기|업데이트된 일정표 보기|완성해줘|만들어줘|만들어|짜줘|짜주세요|맞춰줘|맞춰주세요|챙겨줘|챙겨주세요|담아줘|담아주세요|조율해줘|조율해주세요|잡아줘|잡아주세요|잡아봐|잡아|설계해줘|설계해주세요|계획해줘|계획해주세요|정해줘|정해주세요|준비해줘|준비해주세요|보여줘|보여주세요|안내해줘|안내해주세요|추천해줘|코스 추천|일정 추천|이걸로 해줘|알아서 해줘|알아서|뽑아줘|부탁해|부탁해요|해봐|가자|가보자|그냥 짜줘|그냥 추천해줘|그냥 추천|이대로|시작해|시작|일정 뽑아줘|코스 짜줘|일정 완성해줘|코스 만들기|여행 코스|코스|일정)/i.test(promptQuery) ||
      /^(좋아|좋아요|굿|오케이|ok|응|어|네|예|콜|그래|yes|yep|sure|please)($|[!.~])/i.test(promptQuery.trim())
    ));
    const isFormNavigateAction = /(조건 직접 변경하기|조건 변경)/i.test(promptQuery);

    if (isFormNavigateAction) {
      setPlannerInitialMode('form');
      return;
    }

    if (isExternalEntry && !isDirectGenerateAction) {
      // 3대 진입로 공통: 보라가 조건 브리핑 (도시 미지정 시 도시 선택 질문)
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const rawDays = extractDaysFromPrompt(promptQuery);
      const requestedDays = rawDays || 3;
      const targetCity = extractLocationKeyword(promptQuery, false);

      const detectedCity = targetCity;
      const updatedState = patchTravelState(sessionContext, promptQuery, detectedCity, rawDays);
      setSessionContext(updatedState);

      const seasonalChips = (lang === 'en')
        ? ['☀️ Departing This Week', '🍁 Oct Autumn Foliage', '❄️ Dec Winter Trip']
        : ['☀️ 이번 주 출발', '🍁 10월 가을 단풍', '❄️ 12월 겨울 여행'];

      let briefingText = '';
      let quickSuggestions = [];

      // 🌟 1. Check if external query matches Signature Course or Tiki-Taka Knowledge first (e.g. "부산 3일", "제주 3일", "넌 누구니?")
      const tikitakaMatch = resolveTikitakaResponse(promptQuery, targetCity);
      const externalQnaMatch = matchVoraQna(promptQuery, targetCity, { tripMemory: updatedState.tripMemory }, lang);

      if (tikitakaMatch) {
        briefingText = tikitakaMatch.followUp 
          ? `${tikitakaMatch.reply}\n\n👉 **${tikitakaMatch.followUp}**`
          : tikitakaMatch.reply;
        quickSuggestions = [
          (lang === 'en' ? '🚀 Create Itinerary Now' : '🚀 바로 일정 만들기'),
          (lang === 'en' ? `🍴 ${targetCity || 'Local'} Foodies` : `🍴 ${targetCity || '현지'} 대표 맛집`),
          (lang === 'en' ? `📸 ${targetCity || 'Best'} Photo Spots` : `📸 ${targetCity || '인생샷'} 핫플`)
        ];
      } else if (externalQnaMatch) {
        briefingText = externalQnaMatch.followUp 
          ? `${externalQnaMatch.reply}\n\n👉 **${externalQnaMatch.followUp}**`
          : externalQnaMatch.reply;
        quickSuggestions = externalQnaMatch.suggestedChips || [];
      } else if (!targetCity) {
        // 💡 도시 미지정 시: 선택된 조건(기간, 동행, 테마)을 멋지게 요약하고 도시만 깔끔하게 대화로 질문!
        const companionMatch = promptQuery.match(/(커플|혼자|가족|친구|아이와 함께|아이|부모님|어르신|시니어)/);
        const companionText = companionMatch ? companionMatch[1] : '';
        const themeMatch = promptQuery.match(/테마:\s*([^,]+(?:,\s*[^,]+)*?)(?=, 요구사항:|$)/);
        const themeText = themeMatch ? themeMatch[1].trim() : '';

        const daysPrefix = rawDays ? (rawDays === 1 ? '당일치기' : `${rawDays - 1}박 ${rawDays}일`) : '';
        let tagParts = [];
        if (daysPrefix) tagParts.push(daysPrefix);
        if (companionText) tagParts.push(`${companionText} 여행`);
        if (themeText) tagParts.push(themeText);

        const summaryTag = tagParts.length > 0 ? tagParts.join(' · ') : (lang === 'en' ? 'Korea Custom Travel' : '대한민국 맞춤 여행');

        if (tagParts.length > 0) {
          briefingText = (lang === 'en')
            ? `✨ **[ ✈️ ${summaryTag} ]**\nI've prepared your preferences for **${summaryTag}**! 💕\n\n👉 **Which city or region would you like to visit?**\n*(Tell me freely like Jeju, Busan, Gangneung, Seoul, Wonju, Gyeongju, etc.! 😊)*`
            : `✨ **[ ✈️ ${summaryTag} ]**\n선택하신 **${summaryTag}**에 맞춘 황금 동선을 준비하고 있어요! 💕\n\n👉 **어느 도시나 지역으로 떠나고 싶으신가요?**\n*(제주, 부산, 강릉, 원주, 경주 등 가고 싶은 곳을 편하게 말씀해 주세요! 😊)*`;
        } else {
          briefingText = (lang === 'en')
            ? `💡 Feel free to ask anything, or tell me where you want to go!\n\n**[ ✈️ Korea Custom Travel ]**\nWhich city or region in Korea would you like to visit? 😊 (e.g. Jeju, Busan, Seoul, Gangneung, Wonju)`
            : `💡 편하게 물어보시고, 가고 싶은 곳을 말씀해 주세요!\n\n**[ ✈️ 대한민국 맞춤 여행 ]**\n어느 도시나 지역으로 떠나고 싶으신가요? 😊 (제주, 부산, 강릉, 서울, 원주 등 편하게 말씀해 주세요!)`;
        }

        quickSuggestions = [];
      } else {
        // 💡 도시 지정 시: 해당 도시 맞춤 브리핑 & 관문 칩 제공
        const localizedDest = getLocalizedCityName(targetCity, lang);
        const companionMatch = promptQuery.match(/(커플|혼자|가족|친구|아이와 함께|아이|부모님|어르신|시니어|Couple|Solo|Family|Friends|カップル|一人旅|家族|友達|情侣|独自一人|家庭|朋友)/i);
        const companionText = companionMatch ? companionMatch[1] : '';
        const themeMatch = promptQuery.match(/테마:\s*([^,]+(?:,\s*[^,]+)*?)(?=, 요구사항:|$)/);
        const themeText = themeMatch ? themeMatch[1].trim() : '';
        const reqMatch = promptQuery.match(/요구사항:\s*(.+)$/);
        const reqText = reqMatch ? reqMatch[1].trim() : '';

        const daysLabel = rawDays 
          ? (lang === 'en' ? `${rawDays} Days` : lang === 'ja' ? `${rawDays}日間` : (lang === 'zh' || lang === 'zht') ? `${rawDays}日游` : `${rawDays}일`)
          : (lang === 'en' ? 'Custom Trip' : lang === 'ja' ? 'オーダーメイド旅' : (lang === 'zh' || lang === 'zht') ? '定制旅行' : '맞춤 여행');
        let tagLabel = `📍 ${localizedDest} ${daysLabel}`;
        if (companionText) tagLabel += ` • 👫 ${companionText}`;
        if (themeText) tagLabel += ` • 🍴 ${themeText}`;
        if (reqText) tagLabel += ` • ✍️ ${reqText}`;

        const cityKnowledge = CITY_LOCAL_KNOWLEDGE[targetCity];
        const specificSpotMatch = promptQuery.match(/(사량도|욕지도|독도|우도|청산도|남이섬|금오도|퍼플섬|외도|소매물도|비진도|지심도|경복궁|N서울타워|남산타워|북촌한옥마을|동피랑|해운대|광안리|성산일출봉|수원화성|행궁동)/i);
        let highlightText = '';
        if (specificSpotMatch && specificSpotMatch[1]) {
          const mentioned = specificSpotMatch[1];
          const otherHighlight = cityKnowledge?.signatureHighlights?.find(h => !h.includes(mentioned));
          highlightText = otherHighlight ? `${mentioned}, ${otherHighlight} ` : `${mentioned} `;
        } else if (cityKnowledge?.signatureHighlights) {
          highlightText = `${cityKnowledge.signatureHighlights.slice(0, 2).join(', ')} `;
        }

        const durationChips = [
          (lang === 'en' ? '🗓️ 1 Day (Day Trip)' : lang === 'ja' ? '🗓️ 日帰り' : (lang === 'zh' || lang === 'zht') ? '🗓️ 1日游 (当天往返)' : '🗓️ 당일치기'),
          (lang === 'en' ? '🗓️ 2 Days (1N2D)' : lang === 'ja' ? '🗓️ 1泊2日' : (lang === 'zh' || lang === 'zht') ? '🗓️ 2天1晚' : '🗓️ 1박 2일'),
          (lang === 'en' ? '🗓️ 3 Days (2N3D)' : lang === 'ja' ? '🗓️ 2泊3日' : (lang === 'zh' || lang === 'zht') ? '🗓️ 3天2晚' : '🗓️ 2박 3일'),
          (lang === 'en' ? '🗓️ 4 Days (3N4D)' : lang === 'ja' ? '🗓️ 3泊4日' : (lang === 'zh' || lang === 'zht') ? '🗓️ 4天3晚' : '🗓️ 3박 4일')
        ];

        if (!rawDays) {
          briefingText = (lang === 'en')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `Featuring iconic spots like ${highlightText}, ` : ''}${localizedDest} is best experienced with a **3-Day (2N3D) Highlight Course**! ✨ (Default: 09:00~18:00)\n\n💡 **Tap your desired trip duration below:**\n*(You can easily customize companions and themes in **[ + Add Conditions ]** at the top! 😊)*`
            : (lang === 'ja')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `${highlightText}などの人気スポットを中心に ` : ''}**[ 3日間 (2泊3日) おすすめコース ]**を準備しましょうか？✨ (基本 09:00〜18:00)\n\n💡 **ご希望の旅行期間を下記から選択してください:**\n*(同行者やテーマは上部の **\`[ + 条件追加 ]\`** からいつでも自由に変更できます！😊)*`
            : (lang === 'zh' || lang === 'zht')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `包含 ${highlightText}等核心名胜，` : ''}为您准备 **[ 3天2晚 精选推荐行程 ]** 如何？✨ (默认时间 09:00~18:00)\n\n💡 **请在下方选择您计划出游的天数：**\n*(同行同伴或旅行主题可在顶部 **\`[ + 添加条件 ]\`** 随时灵活修改！😊)*`
            : `**[ ${tagLabel} ]**\n${highlightText ? `${highlightText}대표 명소를 알차게 담아 ` : ''}**[ 3일(2박 3일) 추천 코스 ]**로 준비해 드릴까요? ✨ (기본 09:00~18:00)\n\n💡 **원하시는 여행 기간을 아래에서 톡 눌러주세요:**\n*(동행이나 테마 같은 다른 조건은 상단 **\`[ + 조건 추가 ]\`**에서 언제든 편하게 바꾸실 수 있어요! 😊)*`;
        } else {
          briefingText = (lang === 'en')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `Featuring iconic spots like ${highlightText}, ` : ''}Shall I prepare your tailored **[ ${localizedDest} ${rawDays}-Day Course ]** right away? ✨ (Default: 09:00~18:00)\n\n*(You can easily customize companions and themes in **[ + Add Conditions ]** at the top! 😊)*`
            : (lang === 'ja')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `${highlightText}などの代表スポットを含め、` : ''}ご指定の条件に合わせて **[ ${localizedDest} ${rawDays}日間 カスタムコース ]** をすぐに作成しましょうか？✨ (基本 09:00〜18:00)\n\n*(同行者やテーマは上部の **\`[ + 条件追加 ]\`** からいつでも自由に変更できます！😊)*`
            : (lang === 'zh' || lang === 'zht')
            ? `**[ ${tagLabel} ]**\n${highlightText ? `精选 ${highlightText}等代表性名所，` : ''}是否立即为您生成专属定制的 **[ ${localizedDest} ${rawDays}日游路线 ]**？✨ (默认时间 09:00~18:00)\n\n*(同行同伴或旅行主题可在顶部 **\`[ + 添加条件 ]\`** 随时灵活修改！😊)*`
            : `**[ ${tagLabel} ]**\n${highlightText ? `${highlightText}대표 명소를 담아 ` : ''}선택하신 조건에 맞춰 **[ ${targetCity} ${rawDays}일 맞춤 코스 ]**로 바로 잡아드릴까요? ✨ (기본 09:00~18:00)\n\n*(동행이나 테마 같은 다른 조건은 상단 **\`[ + 조건 추가 ]\`**에서 언제든 편하게 바꾸실 수 있어요! 😊)*`;
        }

        quickSuggestions = [
          (lang === 'en' ? `🚀 Create ${localizedDest} ${rawDays || 3}D Plan` : lang === 'ja' ? `🚀 ${localizedDest} ${rawDays || 3}日コースを作成` : (lang === 'zh' || lang === 'zht') ? `🚀 制作${localizedDest} ${rawDays || 3}日行程` : `🚀 추천 ${targetCity} ${rawDays || 3}일 코스 만들기`),
          ...durationChips,
          (lang === 'en' ? `🍴 ${localizedDest} Foodies` : lang === 'ja' ? `🍴 ${localizedDest} ご当地グルメ` : (lang === 'zh' || lang === 'zht') ? `🍴 ${localizedDest} 必吃美食` : `🍴 ${targetCity} 대표 맛집 & 카페`),
          (lang === 'en' ? `📸 ${localizedDest} Photo Spots` : lang === 'ja' ? `📸 ${localizedDest} 映えスポット` : (lang === 'zh' || lang === 'zht') ? `📸 ${localizedDest} 拍照打卡` : `📸 ${targetCity} 인생샷 명소`),
          (lang === 'en' ? `🏨 ${localizedDest} Top Hotels` : lang === 'ja' ? `🏨 ${localizedDest} おすすめ宿泊` : (lang === 'zh' || lang === 'zht') ? `🏨 ${localizedDest} 热门酒店` : `🏨 ${targetCity} 인기 숙소 추천`)
        ];
      }

      setTimeout(() => {
        const userMsg = {
          id: `user-init-${Date.now()}`,
          role: 'user',
          text: promptQuery,
          queryTime,
          timestamp: queryTime
        };
        const botMsg = {
          id: `bot-briefing-${Date.now()}`,
          role: 'assistant',
          text: briefingText,
          quickSuggestions,
          generationTime: '0.1',
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages([userMsg, botMsg]);
      }, 80);
      return;
    }

    // 🌟 4. 사용자가 대화창에서 질문/조건을 던졌을 때 -> 0.01초 광속 자립 컨시어지 실행!
    setIsLoading(true);

    const dayMatch = promptQuery.match(/([1-5])일차/);
    if (dayMatch && dayMatch[1]) {
      setActiveDay(Number(dayMatch[1]));
    } else {
      setActiveDay(1);
    }

    try {
      const elapsedSeconds = Math.max(0.08, ((Date.now() - startTime) / 1000)).toFixed(2);
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      // 🧠 1단계: 사용자 입력 패치 (User Input > Previous Memory, 도시/동행/선호 Patch Update)
      const detectedCity = extractLocationKeyword(promptQuery, false);
      const parsedDays = extractDaysFromPrompt(promptQuery);
      const updatedState = patchTravelState(sessionContext, promptQuery, detectedCity, parsedDays);
      setSessionContext(updatedState);

      const targetCity = updatedState.tripMemory.destination || null;
      const displayCity = targetCity || (lang === 'en' ? 'Korea' : '대한민국');
      const requestedDays = updatedState.tripMemory.days || 3;
      const userIntent = updatedState.lastIntent;

      // 🧠 [대화 문맥 지능형 명소 기억 및 도시 전환 시 즉시 초기화]
      const prevCity = sessionContext.tripMemory?.destination;
      if (detectedCity && prevCity && detectedCity !== prevCity) {
        updatedState.tripMemory.focusedSpot = null;
      }
      const landmarkSpotMatch = promptQuery.match(/(사량도|욕지도|독도|우도|청산도|남이섬|금오도|퍼플섬|외도|소매물도|비진도|지심도|경복궁|N서울타워|남산타워|북촌한옥마을|동피랑|해운대|광안리|성산일출봉|수원화성|행궁동|불국사|석굴암|첨성대|동궁과\s*월지|황리단길|대릉원|병산서원|도산서원|월영교|만대루|하회마을|[가-힣]{2,8}(?:서원|사찰|궁|타워|마을|해수욕장|해변|전망대|공원|폭포|산|도))/i);
      if (landmarkSpotMatch && landmarkSpotMatch[1]) {
        updatedState.tripMemory.focusedSpot = landmarkSpotMatch[1].trim();
      }

      // "~추가해줘", "~넣어줘", "~포함해줘" 명시적 장소 추가/수정 지시어 지능형 감지
      const isAddOrModifyQuery = /(?:추가|넣어|포함|반영|가고\s*싶|가볼래)/i.test(promptQuery);
      const addSpotExtract = promptQuery.match(/([가-힣a-zA-Z0-9\s]{2,12})\s*(?:추가|넣어|포함|반영|가고\s*싶|가볼래)/i);
      if (addSpotExtract && addSpotExtract[1]) {
        const cleanAddSpot = addSpotExtract[1].replace(/(?:일정에|코스에|안동에|서울에|부산에|제주에|도|에)/g, '').trim();
        if (cleanAddSpot.length >= 2) {
          updatedState.tripMemory.focusedSpot = cleanAddSpot;
        }
      }

      // 🌟 [핵심 티키타카 & Intent 라우팅]
      // 1. 명시적 전체 일정 생성 요청(REGENERATE_ITINERARY or 🚀 확정 버튼 or ~추가해줘)이 아닌 경우 ➔ 0.01초 광속 컨시어지 답변 & POI 추천
      const shouldRegenerateDirectly = isDirectGenerateAction || userIntent === 'REGENERATE_ITINERARY' || (isAddOrModifyQuery && Boolean(updatedState.tripMemory.focusedSpot));
      if (!shouldRegenerateDirectly) {
        const isAddDayQuery = /(하루 더|1일 더|1일 추가|늘려|연장|하루 추가|이틀 더|2일 더|더 있을래)/i.test(promptQuery);
        let dynamicSuggestDays = requestedDays;
        const currentDays = itineraryData?.days || requestedDays || 1;

        // 🎯 2단계 모드 판별: 순수 일상 대화(1단계) vs 본격 일정 기획/장소 탐색(2단계)
        const hasExplicitLocation = Boolean(detectedCity) || /(경복궁|성수|해운대|광안리|애월|한담|초당|황리단|남포동|동성로|오션|바다|산책|카페|맛집|코스|일정|여행|호텔|숙소|투어|박|일차)/i.test(promptQuery);
        const hasActiveItinerary = Boolean(itineraryData && itineraryData.dailySchedules && itineraryData.dailySchedules.length > 0);
        const isPlanningMode = hasExplicitLocation || hasActiveItinerary || userIntent === 'ADD_OR_PATCH_CONDITION' || userIntent === 'UPDATE_DESTINATION' || userIntent === 'MULTI_CITY_PLAN';

        const tripContext = buildTravelContext({
          targetCity,
          activeDay,
          currentItinerary: itineraryData,
          userPrompt: promptQuery,
          sessionState: updatedState
        });

        const isGatewaySelectPrompt = /(공항|ktx|터미널|숙소|호텔)/i.test(promptQuery) && (updatedState.tripMemory?.gateway || updatedState.tripMemory?.hotelArea);
        const isArrivalTimePrompt = /(오전|오후|저녁|밤|도착)/i.test(promptQuery) && (updatedState.tripMemory?.arrivalTime || /(오전|오후|저녁|밤)/i.test(promptQuery));
        const isSeasonPrompt = /(겨울|가을|봄|여름|[0-9]+월)/.test(promptQuery) && !isGatewaySelectPrompt && !isArrivalTimePrompt;

        // 1단계(순수 대화 & 온보딩 질문 중): POI 카드 숨김 / 2단계(본격 일정/명소 탐색): 100% 한국관광공사 TourAPI 4.0 실시간 정품 POI 카드 직결!
        const qnaDirectMatch = matchVoraQna(promptQuery, targetCity, tripContext, lang);
        if (qnaDirectMatch) {
          if (qnaDirectMatch.title) {
            const cleanTitle = qnaDirectMatch.title.replace(/\s*\(.*?\)/g, '').trim();
            updatedState.tripMemory.focusedSpot = cleanTitle;
          }
          if (qnaDirectMatch.targetCity && qnaDirectMatch.targetCity !== 'all') {
            updatedState.tripMemory.destination = qnaDirectMatch.targetCity;
          }
          // 🌟 [핵심] Q&A 매칭으로 발견된 관심 명소 및 목적지를 sessionContext에 즉시 영구 저장!
          setSessionContext({ ...updatedState });
        }
        let matchedPois = [];
        if (!qnaDirectMatch && isPlanningMode && userIntent !== 'OFF_TOPIC' && !isGatewaySelectPrompt && !isArrivalTimePrompt) {
          try {
            const liveCitySpots = await fetchCityTourApiSpots(targetCity || '서울', lang).catch(() => []);
            if (liveCitySpots && liveCitySpots.length > 0) {
              matchedPois = liveCitySpots.slice(0, 3).map(s => ({
                id: s.id || s.contentId,
                title: (s.title || s.name || '').replace(/대한민국|일대|주변/g, '').trim(),
                image: s.image || s.firstimage || 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg',
                rating: s.rating || 4.8,
                duration: s.duration || 90,
                category: s.category || (lang === 'en' ? 'Sightseeing' : '명소'),
                theme: s.theme || (lang === 'en' ? 'TourAPI Live' : '한국관광공사 정품'),
                summary: s.summary || s.description || s.overview || (lang === 'en' ? 'Korea Tourism Organization genuine registered landmark' : '한국관광공사 정품 실시간 등록 관광명소'),
                tags: s.tags || [lang === 'en' ? 'TourAPI' : '한국관광공사', lang === 'en' ? 'Live' : '실시간명소']
              }));
            } else {
              matchedPois = findRecommendedPois(promptQuery, targetCity, 3);
            }
          } catch {
            matchedPois = findRecommendedPois(promptQuery, targetCity, 3);
          }
        }
        const contextualIntro = generateContextualAdvice(tripContext, lang);
        let chatText = qnaDirectMatch 
          ? (qnaDirectMatch.followUp ? `${qnaDirectMatch.reply}\n\n👉 **${qnaDirectMatch.followUp}**` : qnaDirectMatch.reply)
          : contextualIntro;

        const defaultActionChip = (lang === 'en' ? `🚀 Build ${displayCity} Plan Now` : `🚀 바로 일정 만들기`);
        let rawButtons = [];

        if (qnaDirectMatch && qnaDirectMatch.suggestedChips && qnaDirectMatch.suggestedChips.length > 0) {
          rawButtons = [defaultActionChip, ...qnaDirectMatch.suggestedChips.filter(c => c !== defaultActionChip)];
        } else if (!isPlanningMode) {
          rawButtons = [
            (lang === 'en' ? '👑 Seoul Tour' : '👑 서울 투어'),
            (lang === 'en' ? '🌊 Busan Ocean' : '🌊 부산 바다'),
            (lang === 'en' ? '🌴 Jeju Healing' : '🌴 제주 힐링'),
            (lang === 'en' ? '🏖️ Gangneung / Sokcho' : '🏖️ 강릉/속초')
          ];
        } else {
          rawButtons = [
            defaultActionChip,
            (lang === 'en' ? `🍴 ${displayCity} Foodies` : `🍴 ${displayCity} 대표 맛집`),
            (lang === 'en' ? `🌃 ${displayCity} Night Views` : `🌃 ${displayCity} 낭만 야경`),
            (lang === 'en' ? `🏨 ${displayCity} Top Hotels` : `🏨 ${displayCity} 인기 숙소`)
          ];
        }

        // 🛡️ [중복 100% 원천 차단 & 최대 4개 캡]
        let quickButtons = Array.from(new Set(rawButtons)).slice(0, 4);

        // 🛡️ [특수 지시어 처리: 호텔은 빼줘 / ~제외해줘]
        const isExclusionDirective = /(호텔|숙소|카페|박물관|쇼핑|맛집)\s*(은|는|이|가|도)?\s*(빼줘|빼주세요|제외해줘|제외|없애줘|삭제해줘|빼|지워줘)/i.test(promptQuery);
        if (isExclusionDirective) {
          const matchEx = promptQuery.match(/(호텔|숙소|카페|박물관|쇼핑|맛집)/i);
          const exItem = matchEx ? matchEx[1] : '해당 항목';
          if (exItem === '호텔' || exItem === '숙소') {
            updatedState.tripMemory.hotelArea = null;
            updatedState.tripMemory.isHotelExcluded = true;
          }

          const dayLabel = currentDays === 1 
            ? (lang === 'en' ? 'Day Trip' : '당일치기 코스')
            : (lang === 'en' ? `${currentDays}-Day Trip` : `${currentDays}일 알찬 핵심 코스`);

          chatText = (lang === 'en')
            ? `✨ Got it! I have excluded **[${exItem}]** and optimized your **【 ${displayCity} ${dayLabel} 】**! 👉 **Shall we generate the updated plan? 🚀**`
            : `✨ 알겠습니다! 요청하신 **[${exItem}]** 항목을 깔끔하게 제외하고 **【 ${displayCity} ${dayLabel} 】**로 스마트하게 재조율해 드릴게요! 👉 **이 조건으로 일정을 바로 뽑아드릴까요? 🚀**`;
          quickButtons = [
            (lang === 'en' ? '🚀 일정 생성' : '🚀 일정 생성'),
            (lang === 'en' ? '🍴 Local Food Trails' : '🍴 현지인 맛집 코스'),
            (lang === 'en' ? '🌊 Scenic View Spots' : '🌊 오션뷰/전망 명소')
          ];
        }

        if (userIntent === 'OFF_TOPIC') {
          chatText = lang === 'en'
            ? `I am VORA, your dedicated AI Travel Concierge for South Korea! 🇰🇷✨ Please ask me about travel destinations, itineraries, delicious local food, or stays!`
            : `저는 대한민국 여행 전문 AI 컨시어지 Vora예요! 🇰🇷✨ 가고 싶으신 지역이나 여행 일정, 맛집, 숙소에 대해 물어봐 주시면 가장 멋진 맞춤 코스로 안내해 드릴게요! 😊`;
        } else if (!qnaDirectMatch && !hasExplicitLocation && !hasActiveItinerary) {
          // 🌟 대안 A: 대답을 못 찾거나 모호한 경우 뜬금없는 서울 3일 강제 생성 중단 & 정중한 지능형 재질문
          chatText = lang === 'en'
            ? `I didn't quite catch that 🥺 Please tell me a bit more about the city (Seoul, Busan, Jeju, Geoje, Changwon, etc.), local foodie spots, or travel theme you are looking for! 🌸✨`
            : `말씀해 주신 내용을 완벽하게 이해하지 못했어요 🥺 가고 싶으신 지역(서울, 부산, 제주, 창원, 거제 등)이나 맛집, 여행 일정에 대해 조금만 더 자세히 알려주시면 딱 맞춰 안내해 드릴게요! 🌸✨`;
        } else if (isAddDayQuery) {
          const addedDays = /(이틀|2일)/.test(promptQuery) ? 2 : 1;
          dynamicSuggestDays = Math.min(5, currentDays + addedDays);
          const city = displayCity;
          chatText = (lang === 'en')
            ? `Of course! Shall I extend your ${city} itinerary from ${currentDays} days to **${dynamicSuggestDays} days** for a more relaxed trip? 😊\n\nI will add scenic local gems and must-visit spots for the extra day!`
            : `물론이죠! 기존 ${currentDays}일 코스에서 하루를 더해 **【 ${city} ${dynamicSuggestDays}일 알찬 코스 】**로 여유롭게 확장해 드릴까요? 😊\n\n추가된 하루에는 감성 오션뷰 핫플과 여유로운 로컬 명소를 더해 알차게 조율해 드릴게요! ✨`;
          quickButtons = [
            (lang === 'en' ? `🚀 Extend to ${dynamicSuggestDays}-Day Itinerary` : `🚀 ${dynamicSuggestDays}일 일정으로 확장하기`),
            (lang === 'en' ? '⚙️ Change Conditions (Form)' : '⚙️ 조건 직접 변경하기 (폼)')
          ];
        } else if (userIntent === 'UPDATE_DESTINATION') {
          chatText = lang === 'en'
            ? `Switched destination to **${displayCity}**! ✨ Here are the best spots for Day ${activeDay}.`
            : `여행지를 **${displayCity}**로 변경했어요! ✨ 말씀해 주신 조건에 맞춰 ${displayCity} ${activeDay}일차에 어울리는 추천 명소를 준비했습니다.`;
        }

        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: chatText,
          recommendedPois: matchedPois,
          quickSuggestions: quickButtons,
          generationTime: elapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
      } else {
        // 2. 명시적 전체 일정 빌드 요청 (REGENERATE_ITINERARY or 🚀 확정 버튼 or 자연어 수락/지시어)
        const buildCity = targetCity || '서울';

        // 🌟 [자가 학습 플라이휠 연동] 공식 지식베이스에 아직 미등록된 도시인 경우 관리자 큐로 자동 수집!
        if (buildCity && !CITY_LOCAL_KNOWLEDGE[buildCity] && buildCity !== '서울') {
          logUnansweredQuestion(`[신규 지역 지식 필요: ${buildCity}] ${buildCity} ${requestedDays}일 추천 여행 코스 및 맛집`, buildCity);
        }

        // 🌟 현재 세션에 선택/누적된 모든 조건(동행/테마/선호/교통)을 100% 반영하여 조합 프롬프트 생성!
        const mem = updatedState.tripMemory || {};
        const comp = mem.companion || {};
        const prefs = mem.preferences || {};

        const compList = [];
        if (typeof comp === 'string' && comp.trim()) compList.push(comp);
        else {
          if (comp.isKids) compList.push('아이 동반');
          if (comp.isElder) compList.push('부모님 동반');
          if (comp.isCouple) compList.push('커플');
          if (comp.isSolo) compList.push('혼자');
        }

        const prefList = [];
        if (prefs.isCafe) prefList.push('감성 카페');
        if (prefs.isFoodie) prefList.push('로컬 맛집');
        if (prefs.isPhoto) prefList.push('인생샷 명소');
        if (prefs.isMinimalWalking) prefList.push('걷기 적은 편안한 동선');
        if (mem.isRainPreferred) prefList.push('실내/비오는날 코스');
        if (mem.gateway) prefList.push(`도착 거점: ${mem.gateway}`);
        if (mem.hotelArea) prefList.push(`숙소 위치: ${mem.hotelArea}`);
        if (mem.arrivalTime) prefList.push(`도착 시간: ${mem.arrivalTime}`);

        const compositePrompt = `${buildCity} ${requestedDays}일 ${compList.join('/')} 여행${prefList.length > 0 ? `, 테마: ${prefList.join(', ')}` : ''}, ${promptQuery}`;

        // 🧠 [대화 히스토리 역추적 명소 추출] 현재 도시(buildCity)와 일치하는 명소만 안전하게 역추적!
        let focusedSpot = updatedState.tripMemory?.focusedSpot || null;
        
        // 🛡️ 도시 불일치 검증: 만약 focusedSpot이 타 도시 명소(예: 제주인데 경복궁)라면 즉시 무효화!
        const CITY_KNOWN_SPOTS = {
          '서울': ['경복궁', 'N서울타워', '남산타워', '북촌한옥마을', '성수동', 'DDP', '명동', '익선동', '인사동', '한강공원', '홍대'],
          '부산': ['해운대', '광안리', '해동용궁사', '용궁사', '블루라인파크', '흰여울문화마을', '감천문화마을', '자갈치시장', '태종대'],
          '제주': ['성산일출봉', '우도', '협재', '협재해수욕장', '함덕', '카멜리아힐', '섭지코지', '한라산', '애월', '중문', '천지연폭포'],
          '경주': ['불국사', '석굴암', '첨성대', '동궁과 월지', '동궁과월지', '황리단길', '대릉원', '보문단지'],
          '안동': ['하회마을', '병산서원', '월영교', '도산서원', '부용대', '만대루', '봉정사', '낙동강'],
          '강릉': ['안목해변', '경포대', '정동진', '커피거리', '강문해변', 'BTS 정류장'],
          '속초': ['설악산', '권금성', '속초관광수산시장', '아바이마을', '영금정', '속초해수욕장'],
          '수원': ['수원화성', '화성행궁', '행궁동', '방화수류정', '연무대'],
          '전주': ['전주한옥마을', '경기전', '전동성당', '오목대', '자만벽화마을'],
          '여수': ['오동도', '향일암', '돌산대교', '낭만포차', '해상케이블카', '아쿠아플라넷'],
          '순천': ['순천만', '순천만국가정원', '국가정원', '낙안읍성', '선암사', '드라마촬영장', '와온해변', '조계산'],
          '통영': ['동피랑', '사량도', '욕지도', '디피랑', '이순신공원', '케이블카'],
          '거제': ['바람의언덕', '매미성', '외도', '지심도', '학동몽돌', '정글돔'],
          '남해': ['독일마을', '다랭이마을', '보리암', '금산산장', '상주은모래'],
          '포항': ['스페이스워크', '호미곶', '이가리닻', '구룡포', '영일대'],
          '단양': ['도담삼봉', '만천하스카이워크', '고수동굴', '카페산'],
          '부여': ['궁남지', '정림사지', '부소산성', '백제문화단지', '낙화암'],
          '공주': ['공산성', '무령왕릉', '공주한옥마을'],
          '군산': ['선유도', '철길마을', '이성당', '초원사진관', '근대역사박물관'],
          '목포': ['유달산', '해상케이블카', '평화광장', '갓바위', '시화골목'],
          '대구': ['서문시장', '동성로', '김광석다시그리기길', '앞산전망대', '수성못'],
          '울산': ['태화강', '십리대숲', '대왕암', '출렁다리', '장생포', '고래문화마을', '슬도'],
          '울주': ['간절곶', '소망우체통', '영남알프스', '간월재', '신불산', '반구대', '암각화', '자수정동굴나라', '외고산', '옹기마을', '언양불고기'],
          '진주': ['진주성', '촉석루', '남강유등', '진주냉면'],
          '김천': ['직지사', '사명대사공원', '연화지', '직지문화공원', '평화의탑', '지례흑돼지'],
          '거창': ['수승대', '창포원', '감악산', '우두산', '출렁다리', '항노화힐링랜드', '월성계곡'],
          '춘천': ['남이섬', '소양강스카이워크', '레고랜드', '삼악산'],
          '가평': ['아침고요수목원', '쁘띠프랑스', '자라섬'],
          '인천': ['송도센트럴파크', '차이나타운', '월미도', '개항장', '을왕리']
        };

        const currentCityKnown = CITY_KNOWN_SPOTS[buildCity] || [];
        if (focusedSpot && currentCityKnown.length > 0) {
          const isBelongToCity = currentCityKnown.some(sp => focusedSpot.includes(sp) || sp.includes(focusedSpot));
          // 타 도시 대표명소일 때만 파기하고, 모르는 명소이거나 해당 도시 명소면 100% 보존!
          const isOtherKnownCitySpot = Object.entries(CITY_KNOWN_SPOTS).some(([cName, spots]) => cName !== buildCity && spots.some(s => s === focusedSpot));
          if (isOtherKnownCitySpot && !isBelongToCity) {
            focusedSpot = null;
          }
        }

        if (!focusedSpot && chatMessages.length > 0) {
          const recentUserMsgs = chatMessages.filter(m => m.role === 'user').slice(-3).reverse();
          for (const uMsg of recentUserMsgs) {
            const uText = uMsg.text || '';
            const match = matchVoraQna(uText, buildCity, {}, lang);
            if (match && match.title) {
              const spotTitle = match.title.replace(/\s*\(.*?\)/g, '').trim();
              focusedSpot = spotTitle;
              break;
            }
            if (currentCityKnown.length > 0) {
              const matchedSpot = currentCityKnown.find(sp => uText.includes(sp));
              if (matchedSpot) {
                focusedSpot = matchedSpot;
                break;
              }
            }
          }
        }

        const rawResult = await generateLocalFallbackItinerary(compositePrompt, buildCity, requestedDays, lang, null, false, focusedSpot);
        const buildElapsedSeconds = Math.max(0.12, ((Date.now() - startTime) / 1000)).toFixed(2);
        const finalResult = {
          ...rawResult,
          targetCity: buildCity,
          generationTime: buildElapsedSeconds,
          draftId: `draft-${Date.now()}`,
          savedId: null
        };
        
        setItineraryData(finalResult);
        setHasActiveUnsavedDraft(true);
        setActiveDay(1);
        try {
          localStorage.setItem('vora_temp_active_draft', JSON.stringify(finalResult));
        } catch (e) {}

        // 📸 2-Tier Photo Enrichment: Background Google Places live photo enhancement
        enrichItineraryPhotosAsync(finalResult).then(enriched => {
          if (enriched && enriched.dailySchedules) {
            setItineraryData(prev => ({
              ...prev,
              dailySchedules: enriched.dailySchedules,
              spots: enriched.spots
            }));
          }
        }).catch(err => console.warn('[Photo Enricher Error]', err));
        
        const replySummary = isDayChangeQuery
          ? (lang === 'en'
            ? `✨ **${finalResult.tripTitle}**\nUpdated your ${buildCity} itinerary to **${requestedDays} days** as requested! ✨`
            : `✨ **${finalResult.tripTitle}**\n요청해 주신 대로 ${buildCity} 여행을 **${requestedDays}일 코스**로 최적화하여 새롭게 재구성했습니다! 🔄✨`)
          : `✨ **${finalResult.tripTitle}**\n${finalResult.summary}`;

        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: replySummary,
          itinerary: finalResult,
          generationTime: buildElapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.warn('[VORA AI Error]', err);
      const elapsedSeconds = '0.01';
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const requestedDays = extractDaysFromPrompt(promptQuery) || 3;
      const targetCity = extractLocationKeyword(promptQuery, false) || '서울';
      const rawFallback = await generateLocalFallbackItinerary(promptQuery, targetCity, requestedDays, lang);
      const fallback = {
        ...rawFallback,
        targetCity,
        generationTime: elapsedSeconds,
        draftId: `draft-${Date.now()}`
      };
      setItineraryData(fallback);
      setHasActiveUnsavedDraft(true);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${fallback.tripTitle || `${targetCity} ${requestedDays}일 여행 코스`}**\n${fallback.summary || '한국관광공사 정품 실시간 코스입니다.'}`,
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

  // ⏰ 일차별 시간 변경 즉시 실시간 동기화 및 타임라인 물리 시뮬레이션 재계산 핸들러
  const handleUpdateTimeSlot = (day, newTimeSlot, currentMsgPlan) => {
    setItineraryData(prev => {
      const base = prev || currentMsgPlan;
      if (!base) return prev;
      const updated = recalculateItineraryTimeSlots(base, day, newTimeSlot, lang);
      if (Number(day) === 1) {
        updated.arrivalTime = newTimeSlot.split('~')[0].trim();
      }
      try {
        localStorage.setItem('vora_temp_active_draft', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setHasActiveUnsavedDraft(true);
  };

  const chipDebounceRef = useRef(null);

  // 🧠 Context Chip 개별 해제 핸들러
  const handleRemoveContextChip = (chipId) => {
    setSessionContext(prev => {
      const next = removeContextChip(prev, chipId);
      triggerSynthesizedChipFeedback(next);
      return next;
    });
  };

  // 🧠 Context Chip 원터치 토글 핸들러 (조용한 실시간 토글 + 0.6초 뒤 1회 종합 티키타카 제안)
  const handleToggleContextChip = (chipId) => {
    setSessionContext(prev => {
      const next = toggleContextChip(prev, chipId);
      triggerSynthesizedChipFeedback(next);
      return next;
    });
  };

  // 🌟 조건 칩 변경 시 0.65초 뒤 모든 활성 조건을 종합하여 1회의 생생한 티키타카 제안 브리핑 생성
  const triggerSynthesizedChipFeedback = (currentState) => {
    if (chipDebounceRef.current) {
      clearTimeout(chipDebounceRef.current);
    }

    chipDebounceRef.current = setTimeout(() => {
      const activeList = getActiveContextChips(currentState, lang);
      const targetCity = currentState.tripMemory?.destination || (lang === 'en' ? 'Korea' : '대한민국');
      const targetDays = currentState.tripMemory?.days || 3;

      if (activeList.length === 0) {
        const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const botMsg = {
          id: `bot-chip-${Date.now()}`,
          role: 'assistant',
          text: lang === 'en'
            ? `Reset extra conditions for **${targetCity} ${targetDays}-Day** trip! ✨\nReady to tailor a fresh itinerary for you.`
            : `**${targetCity} ${targetDays}일 여행**의 추가 조건을 기본으로 정돈했어요! ✨\n원하시는 새 테마를 언제든 편하게 골라주세요.`,
          quickSuggestions: [
            (lang === 'en' ? '🚀 Create Plan' : '🚀 일정 생성'),
            (lang === 'en' ? '✨ Build Plan Now' : '✨ 바로 짜줘'),
            (lang === 'en' ? '☀️ Morning Arrival' : '☀️ 오전 도착')
          ],
          generationTime: '0.01',
          queryTime: replyTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
        return;
      }

      const activeLabels = activeList.map(c => c.label.replace(/^[✓＋+]\s*/, '')).join(', ');
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      const replyText = lang === 'en'
        ? `✨ **[${targetCity} ${targetDays}-Day Trip]** with **${activeLabels}**!\nI will tailor a seamless, optimal route incorporating all your chosen preferences 🌊🏰☕\n\n👉 **Shall I generate this customized itinerary for you right now? 🚀**`
        : `✨ **[${targetCity} ${targetDays}일 여행]**에 **${activeLabels}** 조건을 모두 담아 최적의 동선으로 **딱 맞춰드릴게요!** 🌊🏰☕\n\n👉 **이 조건으로 완벽한 맞춤 일정을 바로 뽑아드릴까요? 🚀**`;

      const botMsg = {
        id: `bot-chip-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        quickSuggestions: [
          (lang === 'en' ? '🚀 Create Plan' : '🚀 일정 생성'),
          (lang === 'en' ? '✨ Build Plan Now' : '✨ 바로 짜줘'),
          (lang === 'en' ? '☀️ Morning Arrival' : '☀️ 오전 도착')
        ],
        generationTime: '0.01',
        queryTime: replyTime,
        replyTime,
        timestamp: replyTime
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 650);
  };

  // 🔄 대화 초기화 및 새 대화 시작 핸들러
  const handleResetChat = () => {
    setChatMessages(getInitialWelcomeMessages(lang, null));
    setSessionContext(INITIAL_TRAVEL_STATE);
    showToast(lang === 'en' ? 'Starting a fresh new conversation ✨' : '새로운 대화를 시작합니다 ✨');
  };

  // 저장된 여행 삭제 핸들러 (100% 클라우드 단일 진실 원천 미러링 & 로컬 캐시 찌꺼기 원천 차단)
  const handleDeleteSavedTrip = (tripId) => {
    setSavedTrips(prev => {
      const updated = prev.filter(t => (t.savedId || t.tripTitle || t.id) !== tripId);
      try {
        localStorage.setItem('vora_saved_trips', JSON.stringify(updated));
      } catch (e) {}

      // ☁️ 클라우드에서도 단일 진실 원천으로 완전 덮어쓰기 & 삭제
      if (currentUser?.email) {
        deleteTripFromCloud(currentUser.email, tripId).catch(e => console.warn('[Cloud Delete Error]', e));
        overwriteTripsToCloud(currentUser.email, updated).catch(e => console.warn('[Cloud Overwrite Error]', e));
      }

      // 🛡️ 현재 보고 있는 일정이 '작성 중인 새 미저장 일정'이라면 절대 날리지 않고 그대로 유지!
      if (!hasActiveUnsavedDraft) {
        const isCurrentActiveDeleted = itineraryData && (itineraryData.savedId === tripId || itineraryData.tripTitle === tripId || itineraryData.id === tripId);
        if (isCurrentActiveDeleted) {
          if (updated.length > 0) {
            setItineraryData(updated[0]);
            setSelectedTripId(updated[0].savedId || updated[0].tripTitle);
          } else {
            setItineraryData(null);
            setSelectedTripId(null);
          }
        }
      }
      return updated;
    });
  };

  // 🌟 구글 로그인 성공 핸들러 (클라우드 단일 진실 원천 미러링 & 즉시 동기화)
  const handleLoginSuccess = async (userProfile) => {
    setCurrentUser(userProfile);
    if (userProfile?.email) {
      try {
        const cloudList = await fetchCloudTrips(userProfile.email);
        if (Array.isArray(cloudList)) {
          setSavedTrips(cloudList);
          try { 
            localStorage.setItem('vora_saved_trips', JSON.stringify(cloudList)); 
          } catch (e) {}
          
          if (cloudList.length > 0) {
            setItineraryData(cloudList[0]);
            setSelectedTripId(cloudList[0].savedId || cloudList[0].tripTitle);
          } else if (!hasActiveUnsavedDraft) {
            setItineraryData(null);
            setSelectedTripId(null);
          }
        }
      } catch (e) {
        console.warn('[handleLoginSuccess Sync Error]', e);
      }
    }
  };

  // 🔄 클라우드 일정 수동/원터치 실시간 동기화 핸들러 (Single Source of Truth Mirroring)
  const handleSyncTrips = async () => {
    if (!currentUser?.email) {
      setIsGoogleAuthOpen(true);
      return false;
    }
    try {
      const cloudList = await fetchCloudTrips(currentUser.email);
      if (Array.isArray(cloudList)) {
        // 🏛️ 헌법 제19조: 클라우드 서버의 최신 목록을 그대로 단일 진실 원천으로 완벽 미러링
        setSavedTrips(cloudList);
        try { 
          localStorage.setItem('vora_saved_trips', JSON.stringify(cloudList)); 
        } catch (e) {}

        if (cloudList.length > 0) {
          if (!itineraryData || !cloudList.some(t => (t.savedId || t.tripTitle) === (itineraryData.savedId || itineraryData.tripTitle))) {
            setItineraryData(cloudList[0]);
            setSelectedTripId(cloudList[0].savedId || cloudList[0].tripTitle);
          }
        } else if (!hasActiveUnsavedDraft) {
          setItineraryData(null);
          setSelectedTripId(null);
        }
        return true;
      }
    } catch (e) {
      console.warn('[handleSyncTrips Error]', e);
    }
    return false;
  };

  // 🚪 로그아웃 핸들러
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vora_user_profile');
      localStorage.removeItem('vora_admin_mode');
    } catch (e) {}
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
        onOpenAdminBatch={() => setIsAdminBatchOpen(true)}
        activeNavTab={activeNavTab}
        onNavigateTab={handleTabNavigate}
        savedTripsCount={savedTrips.length}
      />

      {/* Main Container (모바일 5대 탭 전환 & PC 3단계 통합 모핑 워크스페이스) */}
      <main className="app-main-container" style={{ width: '100%' }}>
        {/* ==============================================================================
           💻 [PC / 데스크톱 전용]: 상단 4K 와이드 히어로 배너 (풀스크린 100% 정중앙) + 하단 3단계 일체형 워크스페이스
           ============================================================================== */}
        <div className="hide-mobile tab-content-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 👑 상단: 찬란한 4K 와이드 히어로 배너 & 스마트 검색창 & 5개 테마 칩 (상시 유지!) */}
          <PortalHomePrototype
            lang={lang}
            onSearchSubmit={(promptText) => {
              setPlannerInitialMode('chat');
              setActiveNavTab('ai');
              handleGenerateItinerary(promptText, false, true);
            }}
            onSelectTheme={(promptText, city) => {
              setPlannerInitialMode('chat');
              setActiveNavTab('ai');
              handleGenerateItinerary(promptText, false, true);
            }}
            onOpenWeather={(city) => {
              setWeatherCity(city || itineraryData?.targetCity || '서울');
              setIsWeatherOpen(true);
            }}
            onOpenEssentials={() => setIsEssentialsOpen(true)}
            onOpenPlanner={() => {
              setPlannerInitialMode('chat');
              setActiveNavTab('ai');
            }}
            targetCity={itineraryData?.targetCity || '서울'}
          />

            {/* 🗺️ 하단 (PC/웹 전용): 네이버 지도 스타일 일체형 2-Column 인터랙티브 3단계 모핑 워크스페이스 */}
            <DesktopMapExplorer
              lang={lang}
              activeStage={activeNavTab === 'home' ? 'explore' : activeNavTab === 'ai' ? 'chat' : activeNavTab === 'mytrip' ? 'itinerary' : 'explore'}
              onNavigateStage={(stage) => setActiveNavTab(stage === 'explore' ? 'home' : stage === 'chat' ? 'ai' : 'mytrip')}
              onSelectCityPlan={(cityName, days) => {
                setPlannerInitialMode('chat');
                setActiveNavTab('ai');
                const locCity = getLocalizedCityName(cityName, lang);
                const promptText = lang === 'en'
                  ? `Create ${locCity} ${days}-Day Travel Itinerary`
                  : lang === 'ja'
                  ? `${locCity} ${days}日間の旅行コースを作成`
                  : (lang === 'zh' || lang === 'zht')
                  ? `制作${locCity} ${days}日游旅行路线`
                  : `${cityName} ${days}일 여행 코스 만들기`;
                handleGenerateItinerary(promptText, true, false);
              }}
              onOpenWeather={(city) => {
                setWeatherCity(city || itineraryData?.targetCity || '서울');
                setIsWeatherOpen(true);
              }}
              onOpenEssentials={() => setIsEssentialsOpen(true)}
              // Chat Props (Stage 2 & Stage 3 Left)
              chatMessages={chatMessages}
              isLoading={isLoading}
              onSendMessage={(msgText) => handleGenerateItinerary(msgText, false, false)}
              onConfirmItinerary={(updatedPlan) => {
                if (updatedPlan) {
                  setItineraryData(updatedPlan);
                  setHasActiveUnsavedDraft(true);
                  try {
                    localStorage.setItem('vora_temp_active_draft', JSON.stringify(updatedPlan));
                  } catch (e) {}
                }
                setActiveNavTab('mytrip');
              }}
              onAddPoiToItinerary={handleAddPoiToItinerary}
              sessionContext={sessionContext}
              onRemoveContextChip={handleRemoveContextChip}
              onToggleContextChip={handleToggleContextChip}
              onResetChat={handleResetChat}
              onUpdateTimeSlot={handleUpdateTimeSlot}
              // Itinerary Props (Stage 3 Right)
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              savedTrips={savedTrips}
              onSelectTrip={(trip) => {
                setItineraryData(trip);
                setSelectedTripId(trip.savedId || trip.id || trip.tripTitle);
                setActiveDay(1);
              }}
              onDeleteTrip={handleDeleteSavedTrip}
              onCreateNewTrip={() => {
                setPlannerInitialMode('chat');
                setActiveNavTab('ai');
              }}
              onSaveCurrentTrip={() => handleSaveCurrentItinerary()}
              questionQuota={questionQuota}
              currentUser={currentUser}
              onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
              onSyncTrips={handleSyncTrips}
              onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
            />
        </div>

        {/* ==============================================================================
           📱 [모바일 전용]: 5대 바텀 내비게이션 탭 전환 시스템 (모바일 원본 100% 안전 보존)
           ============================================================================== */}
        <div className="show-mobile-only" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* TAB 1. 🏠 홈 (Home) */}
          {activeNavTab === 'home' && (
            <div className="tab-content-fade-in" style={{ width: '100%' }}>
              <PortalHomePrototype
                lang={lang}
                onSearchSubmit={(promptText) => {
                  setPlannerInitialMode('chat');
                  setActiveNavTab('ai');
                  handleGenerateItinerary(promptText, false, true);
                }}
                onSelectTheme={(promptText, city) => {
                  setPlannerInitialMode('chat');
                  setActiveNavTab('ai');
                  handleGenerateItinerary(promptText, false, true);
                }}
                onOpenWeather={(city) => {
                  setWeatherCity(city || itineraryData?.targetCity || '서울');
                  setIsWeatherOpen(true);
                }}
                onOpenEssentials={() => setIsEssentialsOpen(true)}
                onOpenPlanner={() => {
                  setPlannerInitialMode('form');
                  setActiveNavTab('ai');
                }}
                targetCity={itineraryData?.targetCity || '서울'}
              />
            </div>
          )}

          {/* TAB 2. ✨ AI 플래너 (AI Concierge) */}
          {activeNavTab === 'ai' && (
            <div className="tab-content-fade-in" style={{ width: '100%', maxWidth: '880px', margin: '0 auto' }}>
              <AIPlannerTab
                lang={lang}
                onGenerateItinerary={handleGenerateItinerary}
                onConfirmItinerary={(updatedPlan) => {
                  if (updatedPlan) {
                    setItineraryData(updatedPlan);
                    setHasActiveUnsavedDraft(true);
                    try {
                      localStorage.setItem('vora_temp_active_draft', JSON.stringify(updatedPlan));
                    } catch (e) {}
                  }
                  setActiveNavTab('mytrip');
                }}
                isLoading={isLoading}
                questionQuota={questionQuota}
                onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
                chatMessages={chatMessages}
                activeDay={activeDay}
                onSelectDay={(day) => setActiveDay(day)}
                itineraryData={itineraryData}
                initialMode={plannerInitialMode}
                onAddPoiToItinerary={handleAddPoiToItinerary}
                sessionContext={sessionContext}
                onRemoveContextChip={handleRemoveContextChip}
                onToggleContextChip={handleToggleContextChip}
                onResetChat={handleResetChat}
                onUpdateTimeSlot={handleUpdateTimeSlot}
              />
            </div>
          )}

          {/* TAB 3. 🧳 내 여행 (My Trip) */}
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
                  setPlannerInitialMode('chat');
                  setActiveNavTab('ai');
                }}
                onOpenRewardedAd={() => setIsRewardedAdOpen(true)}
                savedTrips={savedTrips}
                onSelectTrip={(trip) => {
                  setItineraryData(trip);
                  setSelectedTripId(trip.savedId || trip.id || trip.tripTitle);
                  setActiveDay(1);
                }}
                onDeleteTrip={handleDeleteSavedTrip}
                onCreateNewTrip={() => {
                  setPlannerInitialMode('form');
                  setActiveNavTab('ai');
                }}
                onSaveCurrentTrip={() => handleSaveCurrentItinerary()}
                questionQuota={questionQuota}
                currentUser={currentUser}
                onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
                onSyncTrips={handleSyncTrips}
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
        </div>
      </main>

      {/* 📱 Mobile Fixed 5-Tab Navigation Bar */}
      <BottomNav
        activeTab={activeNavTab}
        onTabChange={(tabId) => {
          handleTabNavigate(tabId);
        }}
        lang={lang}
      />

      {/* 🏛️ Global Modern Slim Footer (Desktop & Home/More tabs) */}
      {(activeNavTab === 'home' || activeNavTab === 'more') && (
        <Footer
          lang={lang}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSubway={() => setIsSubwayMapOpen(true)}
          onOpenHelpline={() => setIsHelplineModalOpen(true)}
          onOpenEssentials={() => setIsEssentialsOpen(true)}
        />
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

      {/* 🔒 Super Admin Batch Knowledge Center Modal */}
      <AdminBatchModal
        isOpen={isAdminBatchOpen}
        onClose={() => setIsAdminBatchOpen(false)}
        currentUser={currentUser}
        lang={lang}
      />

      {/* 🚇 전국 지하철 노선도 모달 */}
      <SubwayMapModal
        isOpen={isSubwayMapOpen}
        onClose={() => setIsSubwayMapOpen(false)}
        lang={lang}
      />

      {/* 📞 1330 스마트 헬프라인 모달 */}
      <HelplineModal
        isOpen={isHelplineModalOpen}
        onClose={() => setIsHelplineModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
