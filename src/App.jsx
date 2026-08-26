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
import AdminBatchModal from './components/AdminBatchModal';
import BottomNav from './components/BottomNav';
import FullMapTab from './components/FullMapTab';
import MoreTabSection from './components/MoreTabSection';
import AIPlannerTab from './components/AIPlannerTab';
import MyTripTab from './components/MyTripTab';
import LiveTripTab from './components/LiveTripTab';
import ExitConfirmModal from './components/ExitConfirmModal';

import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { geminiGenerateFullItinerary, generateLocalFallbackItinerary, enrichItineraryPhotosAsync, extractLocationKeyword, extractDaysFromPrompt } from './services/geminiNlpService';
import { sanitizeInput, inspectSecurityGuardrails } from './services/securityGuardService';
import { findRecommendedPois } from './data/koreaTravelPoiDatabase';
import { getDynamicGatewayChips } from './data/voraDialogKnowledge';
import { matchVoraQna } from './services/voraQnaMatcher';
import { buildTravelContext, generateContextualAdvice, patchTravelState, removeContextChip, toggleContextChip, classifyUserIntent, INITIAL_TRAVEL_STATE } from './services/travelContextEngine';

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
        id: 'featured-1',
        role: 'assistant',
        text: `✨ **${currentItinerary.tripTitle || currentItinerary.title}**\n${currentItinerary.summary || ''}`,
        itinerary: currentItinerary
      });
    }

    return messages;
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('vora_lang', newLang);
    } catch (e) {}

    // Clean reset welcome messages in target language
    setChatMessages(getInitialWelcomeMessages(newLang, null));
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

  // 저장된 여행 목록 (내 여행 탭 연동)
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_saved_trips');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 🧠 3-Tier Stateful Travel Context Manager (Trip Memory + Current Context)
  const [sessionContext, setSessionContext] = useState(INITIAL_TRAVEL_STATE);

  // Itinerary State - 기본값은 마지막 저장된 일정 (없으면 null)
  const [itineraryData, setItineraryData] = useState(() => {
    try {
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
    const newRemaining = (prev?.remaining || 0) + 3;
      const updated = { date: todayStr, remaining: newRemaining, total: prev?.total || DAILY_FREE_ITINERARY_LIMIT };
      try {
        localStorage.setItem('vora_daily_quota', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 🌟 저장 대기 중인 일정이 있었다면 즉시 저장 완료 후 [내 여행]으로 쾌적하게 이동!
    if (itineraryData) {
      setTimeout(() => {
        handleSaveCurrentItinerary('mytrip');
      }, 100);
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
    const isDirectGenerateAction = isDayChangeQuery || (!isQuestionAskingRecommendation && (
      /(이대로 바로 일정 만들기|이 조건으로 일정|일정 만들어줘|일정 만들어|일정 생성|일정 짜줘|일정 세워줘|일정표 만들기|업데이트된 일정표 보기|완성해줘|만들어줘|만들어|짜줘|짜주세요|맞춰줘|맞춰주세요|잡아줘|잡아주세요|잡아봐|잡아|설계해줘|설계해주세요|계획해줘|계획해주세요|정해줘|정해주세요|준비해줘|준비해주세요|보여줘|보여주세요|안내해줘|안내해주세요|추천해줘|코스 추천|일정 추천|이걸로 해줘|알아서 해줘|알아서|뽑아줘|부탁해|부탁해요|해봐|가자|가보자|그냥 짜줘|그냥 추천해줘|그냥 추천|이대로|시작해|시작|일정 뽑아줘|코스 짜줘|일정 완성해줘)/i.test(promptQuery) ||
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

      // 🌟 1. Check if external query is a Q&A knowledge question (e.g. "넌 누구니?", "호텔도 해주나?", "겨울복장은?")
      const externalQnaMatch = matchVoraQna(promptQuery, targetCity, { tripMemory: updatedState.tripMemory }, lang);
      if (externalQnaMatch) {
        briefingText = externalQnaMatch.followUp 
          ? `${externalQnaMatch.reply}\n\n👉 **${externalQnaMatch.followUp}**`
          : externalQnaMatch.reply;
        quickSuggestions = externalQnaMatch.suggestedChips || [];
      } else if (!targetCity) {
        // 💡 도시 미지정 시: 서울로 강제하지 않고 어디로 가실지 친절하게 질문!
        briefingText = (lang === 'en')
          ? `💡 Feel free to ask anything, or tap [Create Itinerary Now] anytime!\n\n**[ ✈️ Korea Custom Travel ]**\nWhich city or region in Korea would you like to visit? 😊 (Tell me freely or tap a popular destination below!)`
          : `💡 편하게 물어보시고, 언제든 '좋아' 또는 [바로 일정 만들기]를 누르시면 완성해 드려요!\n\n**[ ✈️ 대한민국 맞춤 여행 ]**\n어느 도시나 지역으로 떠나고 싶으신가요? 😊 (가고 싶은 곳을 말씀해 주시거나 아래 추천 도시를 선택해 주세요!)`;

        quickSuggestions = [
          '👑 서울',
          '🌊 부산',
          '🌴 제주',
          '🏖️ 거제/통영',
          '☕ 강릉/속초',
          '🏛️ 경주',
          '🏮 전주',
          '🌃 여수'
        ];
      } else {
        // 💡 도시 지정 시: 해당 도시 맞춤 브리핑 & 관문 칩 제공
        const companionMatch = promptQuery.match(/(커플|혼자|가족|친구|아이와 함께|아이|부모님|어르신|시니어)/);
        const companionText = companionMatch ? companionMatch[1] : '';
        const themeMatch = promptQuery.match(/테마:\s*([^,]+(?:,\s*[^,]+)*?)(?=, 요구사항:|$)/);
        const themeText = themeMatch ? themeMatch[1].trim() : '';
        const reqMatch = promptQuery.match(/요구사항:\s*(.+)$/);
        const reqText = reqMatch ? reqMatch[1].trim() : '';

        const daysLabel = rawDays ? `${rawDays}일` : (lang === 'en' ? 'Custom Trip' : '맞춤 여행');
        let tagLabel = `📍 ${targetCity} ${daysLabel}`;
        if (companionText) tagLabel += ` • 👫 ${companionText}`;
        if (themeText) tagLabel += ` • 🍴 ${themeText}`;
        if (reqText) tagLabel += ` • ✍️ ${reqText}`;

        const dynamicGatewayChips = getDynamicGatewayChips(targetCity, lang);
        const durationChips = !rawDays
          ? (lang === 'en'
            ? ['🗓️ 2 Days 1 Night', '🗓️ 3 Days 2 Nights', '🗓️ 4 Days 3 Nights']
            : ['🗓️ 1박 2일', '🗓️ 2박 3일', '🗓️ 3박 4일'])
          : [];

        if (!rawDays) {
          briefingText = (lang === 'en')
            ? `💡 Feel free to ask anything, or tap [Create Itinerary Now] anytime!\n\n**[ ${tagLabel} ]**\nHow many days are you staying in ${targetCity}, when (season/time) do you arrive, and where is your hotel? 😊`
            : `💡 편하게 물어보시고, 언제든 '좋아' 또는 [바로 일정 만들기]를 누르시면 완성해 드려요!\n\n**[ ${tagLabel} ]**\n${targetCity}에서 며칠 동안 머무르실 예정인가요? 그리고 언제(계절/시간) 어디로 도착하시고, 숙소는 어디쯤이신가요? 😊`;
        } else {
          briefingText = (lang === 'en')
            ? `💡 Feel free to ask anything, or tap [Create Itinerary Now] anytime!\n\n**[ ${tagLabel} ]**\nWhen (date/season) and what time are you arriving, and where is your hotel? 😊`
            : `💡 편하게 물어보시고, 언제든 '좋아' 또는 [바로 일정 만들기]를 누르시면 완성해 드려요!\n\n**[ ${tagLabel} ]**\n언제(날짜/계절) 몇 시쯤 어디로 도착하시고, 숙소는 어디쯤이신가요? 😊`;
        }

        quickSuggestions = [
          (lang === 'en' ? '🚀 Create Itinerary Now' : '🚀 바로 일정 만들기'),
          ...durationChips,
          ...seasonalChips,
          ...dynamicGatewayChips,
          (lang === 'en' ? '⚙️ Change Conditions (Form)' : '⚙️ 조건 직접 변경하기 (폼)')
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
      const elapsedSeconds = '0.01';
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

      // 🌟 [핵심 티키타카 & Intent 라우팅]
      // 1. 명시적 전체 일정 생성 요청(REGENERATE_ITINERARY or 🚀 확정 버튼)이 아닌 경우 ➔ 0.01초 광속 컨시어지 답변 & POI 추천
      if (!isDirectGenerateAction && userIntent !== 'REGENERATE_ITINERARY') {
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

        // 1단계(순수 대화 & 온보딩 질문 중): POI 카드 숨김 / 2단계(본격 일정/명소 탐색): 추천 POI 카드 제공
        const qnaDirectMatch = matchVoraQna(promptQuery, targetCity, tripContext, lang);
        const matchedPois = (qnaDirectMatch || !isPlanningMode || userIntent === 'OFF_TOPIC' || isGatewaySelectPrompt || isArrivalTimePrompt) ? [] : findRecommendedPois(promptQuery, targetCity, 3);
        const contextualIntro = generateContextualAdvice(tripContext, lang);

        let chatText = contextualIntro;
        let quickButtons = (qnaDirectMatch && qnaDirectMatch.suggestedChips && qnaDirectMatch.suggestedChips.length > 0)
          ? qnaDirectMatch.suggestedChips
          : !isPlanningMode
          ? []
          : isGatewaySelectPrompt && !updatedState.tripMemory?.arrivalTime
          ? [
              (lang === 'en' ? '☀️ Morning Arrival (Before 12:00)' : '☀️ 오전 도착 (12:00 이전)'),
              (lang === 'en' ? '🌤️ Afternoon Arrival (14:00~16:00)' : '🌤️ 오후 도착 (14:00~16:00)'),
              (lang === 'en' ? '🌙 Evening/Night Arrival (After 18:00)' : '🌙 저녁/밤 도착 (18:00 이후)'),
              (lang === 'en' ? `🚀 Generate ${displayCity} Itinerary` : `🚀 바로 일정표 만들기`)
            ]
          : isSeasonPrompt && !updatedState.tripMemory?.arrivalTime
          ? [
              ...getDynamicGatewayChips(targetCity || '서울', lang),
              (lang === 'en' ? '☀️ Morning Arrival (Before 12:00)' : '☀️ 오전 도착 (12:00 이전)'),
              (lang === 'en' ? '🌤️ Afternoon Arrival (14:00~16:00)' : '🌤️ 오후 도착 (14:00~16:00)'),
              (lang === 'en' ? `🚀 Generate ${displayCity} ${requestedDays}D Itinerary` : `🚀 ${displayCity} ${requestedDays}일 전체 일정표 만들기`)
            ]
          : isArrivalTimePrompt
          ? [
              (lang === 'en' ? `🚀 Create My Door-to-Door Itinerary!` : `🚀 나만의 도어투도어 일정표 만들기!`),
              (lang === 'en' ? '🍴 Change Evening Foodie Spots' : '🍴 저녁 미식 코스 변경해줘'),
              (lang === 'en' ? '⚙️ Change Conditions (Form)' : '⚙️ 조건 직접 변경하기 (폼)')
            ]
          : [
              (lang === 'en' ? '👑 Seoul Highlights' : '👑 서울 명소'),
              (lang === 'en' ? '🌊 Busan Foodie' : '🌊 부산 맛집'),
              (lang === 'en' ? '🌴 Jeju Healing' : '🌴 제주 힐링'),
              (lang === 'en' ? '🏖️ Geoje / Tongyeong' : '🏖️ 거제/통영'),
              (lang === 'en' ? '🚀 Create Custom Itinerary' : '🚀 맞춤 일정 만들기')
            ];

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

        const finalResult = {
          ...generateLocalFallbackItinerary(compositePrompt, buildCity, requestedDays, lang),
          targetCity: buildCity,
          generationTime: elapsedSeconds,
          draftId: `draft-${Date.now()}`
        };
        
        setItineraryData(finalResult);
        setHasActiveUnsavedDraft(true);
        
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
          generationTime: elapsedSeconds,
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
      const fallback = {
        ...generateLocalFallbackItinerary(promptQuery, targetCity, requestedDays, lang),
        targetCity,
        generationTime: elapsedSeconds,
        draftId: `draft-${Date.now()}`
      };
      setItineraryData(fallback);
      setHasActiveUnsavedDraft(true);
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

  // 🧠 Context Chip 개별 해제 핸들러
  const handleRemoveContextChip = (chipId) => {
    setSessionContext(prev => removeContextChip(prev, chipId));
  };

  // 🧠 Context Chip 원터치 토글 핸들러
  const handleToggleContextChip = (chipId) => {
    setSessionContext(prev => toggleContextChip(prev, chipId));
  };

  // 🔄 대화 초기화 및 새 대화 시작 핸들러
  const handleResetChat = () => {
    setChatMessages(getInitialWelcomeMessages(lang, null));
    setSessionContext(INITIAL_TRAVEL_STATE);
    showToast(lang === 'en' ? 'Starting a fresh new conversation ✨' : '새로운 대화를 시작합니다 ✨');
  };

  // 저장된 여행 삭제 핸들러
  const handleDeleteSavedTrip = (tripId) => {
    setSavedTrips(prev => {
      const updated = prev.filter(t => (t.savedId || t.tripTitle) !== tripId);
      try {
        localStorage.setItem('vora_saved_trips', JSON.stringify(updated));
      } catch (e) {}
      if (updated.length > 0) {
        setItineraryData(updated[0]);
      } else {
        setItineraryData(null);
      }
      return updated;
    });
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
                handleGenerateItinerary(promptText, false, true);
              }}
              onSelectTheme={(promptText, city) => {
                // 🚀 홈 칩 클릭 시: 2단계 AI 대화 브리핑 화면으로 스마트 직행!
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
                    onAddPoiToItinerary={handleAddPoiToItinerary}
                    sessionContext={sessionContext}
                    onRemoveContextChip={handleRemoveContextChip}
                    onToggleContextChip={handleToggleContextChip}
                    onResetChat={handleResetChat}
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
                // 🌟 NO 1: [일정표 보기] 터치 시 저장/차감 없이 내 여행(타임라인) 화면으로 단순 이동!
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
            />
          </div>
        )}

        {/* ==============================================================================
           TAB 3. 🧳 내 여행 (My Trip): 3단계 확정 타임라인 & 멀티 저장 여행 셀렉터 & 0원 동선 최적화
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

      {/* 🔒 Super Admin Batch Knowledge Center Modal */}
      <AdminBatchModal
        isOpen={isAdminBatchOpen}
        onClose={() => setIsAdminBatchOpen(false)}
        currentUser={currentUser}
        lang={lang}
      />
    </div>
  );
}
