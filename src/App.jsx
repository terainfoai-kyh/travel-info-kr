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

  // 📱 작성 중(hasActiveUnsavedDraft) 상태에서 브라우저 종료/새로고침 시 방어선
  useEffect(() => {
    if (!hasActiveUnsavedDraft) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveUnsavedDraft]);

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

    // 🌟 1. 폼 초기 진입 또는 추천 칩 진입 확인 -> 토큰 낭비 없이 조건 브리핑 & 승인 유도!
    const isDirectGenerateAction = /(이대로 바로 일정 만들기|이 조건으로 일정|일정 만들어줘|일정 만들어|일정 생성|일정 짜줘|일정표 만들기|OK|ok|응|네|좋아|진행해)/i.test(promptQuery);
    const isFormNavigateAction = /(조건 직접 변경하기|조건 변경)/i.test(promptQuery);

    if (isFormNavigateAction) {
      setPlannerInitialMode('form');
      return;
    }

    const isInitialFormSubmit = promptQuery.includes('여행') && (promptQuery.includes('테마:') || promptQuery.includes('박'));
    const isRecommendationChipSubmit = /(경복궁|성수|광안리|서귀포|행궁동|K-헤리티지|오션|힐링|힙플)/i.test(promptQuery);

    if ((isInitialFormSubmit || isRecommendationChipSubmit) && !isDirectGenerateAction) {
      // 폼/추천 칩 제출 직후: 보라가 모든 조건(테마 전체, 추가요청 포함)을 완벽하게 1줄 캡슐로 브리핑!
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const requestedDays = extractDaysFromPrompt(promptQuery) || (isRecommendationChipSubmit ? 1 : 3);
      const targetCity = extractLocationKeyword(promptQuery) || '서울';

      // 테마, 동행자, 추가요청 전체 정밀 추출
      const companionMatch = promptQuery.match(/(커플|혼자|가족|친구|아이와 함께|아이|부모님|어르신|시니어)/);
      const companionText = companionMatch ? companionMatch[1] : '';
      
      const themeMatch = promptQuery.match(/테마:\s*([^,]+(?:,\s*[^,]+)*?)(?=, 요구사항:|$)/);
      const themeText = themeMatch ? themeMatch[1].trim() : '';

      const reqMatch = promptQuery.match(/요구사항:\s*(.+)$/);
      const reqText = reqMatch ? reqMatch[1].trim() : '';

      let tagLabel = `📍 ${targetCity} ${requestedDays}일`;
      if (companionText) tagLabel += ` • 👫 ${companionText}`;
      if (themeText) tagLabel += ` • 🍴 ${themeText}`;
      if (reqText) tagLabel += ` • ✍️ ${reqText}`;
      if (isRecommendationChipSubmit) {
        tagLabel = `👑 ${promptQuery.slice(0, 24)}`;
      }

      const briefingText = (lang === 'en')
        ? `**[ ${tagLabel} ]**\nAny extra requirements (indoor spots, rental car, etc.)? 😊\nIf not, I will create your tailored itinerary right away!`
        : (lang === 'ja')
        ? `**[ ${tagLabel} ]**\n追加のご要望（屋内スポット、レンタカーなど）はございますか？😊\n特になければ、すぐに最高のカスタム旅程を作成いたします！`
        : (lang === 'zh' || lang === 'zht')
        ? `**[ ${tagLabel} ]**\n是否有其他补充需求（室内优先、租车自驾等）？😊\n如果没有，立即为您生成专属定制行程！`
        : `**[ ${tagLabel} ]**\n추가로 더 필요한 조건(실내 위주, 렌트카, 숙소 등)이 있으신가요? 😊\n없으시면 바로 나만의 맞춤 일정을 만들어 드릴게요!`;

      setTimeout(() => {
        const botMsg = {
          id: `bot-briefing-${Date.now()}`,
          role: 'assistant',
          text: briefingText,
          quickSuggestions: [
            (lang === 'en' ? '🚀 Generate Itinerary Now' : '🚀 이대로 바로 일정 만들기'),
            (lang === 'en' ? '⚙️ Change Conditions (Form)' : '⚙️ 조건 직접 변경하기 (폼)')
          ],
          generationTime: '0.1',
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages([botMsg]);
      }, 80);
      return;
    }

    // 🌟 2. 사용자가 대화창에서 질문/조건을 던졌을 때 -> 티키타카 대화 또는 풀코스 생성!
    setIsLoading(true);

    const dayMatch = promptQuery.match(/([1-5])일차/);
    if (dayMatch && dayMatch[1]) {
      setActiveDay(Number(dayMatch[1]));
    } else {
      setActiveDay(1);
    }

    try {
      // 🌟 이전 대화 컨텍스트가 있다면 초기 조건과 현재 사용자 질문을 합성하여 전달!
      let fullPromptContext = promptQuery;
      const initialBotMsg = chatMessages.find(m => m.text && m.text.includes('**['));
      if (initialBotMsg && !promptQuery.includes('여행') && !promptQuery.includes('일정')) {
        fullPromptContext = `${initialBotMsg.text}\n추가 요청: ${promptQuery}`;
      }

      const result = await geminiGenerateFullItinerary(fullPromptContext, lang, itineraryData);
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
      const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      // 🌟 [핵심 티키타카] "이대로 일정 만들어줘" 버튼을 누른 게 아니거나, 대화형 질문인 경우 티키타카로 응답!
      const isConversationalQuery = !isDirectGenerateAction && /(노인|어르신|부모님|아이|키즈|비|실내|카페|맛집|추천|어때|수정|변경|추가|가볼만)/i.test(promptQuery);

      if (isConversationalQuery) {
        let conversationalReply = '';
        if (/(노인|어르신|부모님|시니어|효도)/i.test(promptQuery)) {
          conversationalReply = (lang === 'en')
            ? `Noted for traveling with parents & seniors! 😊\nI will adjust the route with gentle walking paths, scenic resting spots, and wholesome local dining.\n\nShall I apply this to your complete itinerary?`
            : `어르신·부모님과 함께하시는 여행이군요! 😊\n계단과 무리한 도보를 줄이고, 편안한 쉼터와 정갈한 보양 한식 명소 위주로 일정을 맞춰드릴게요.\n\n이 조건으로 나만의 맞춤 일정표를 완성할까요?`;
        } else if (/(아이|어린이|유아|키즈)/i.test(promptQuery)) {
          conversationalReply = (lang === 'en')
            ? `Noted for traveling with kids! 🎈\nI will focus on stroller-friendly paths, fun interactive spots, and family-friendly cafes.\n\nShall I create the tailored itinerary now?`
            : `아이와 함께하는 신나는 가족 여행이군요! 🎈\n유모차 이동이 편하고 아이들이 좋아할 체험 명소와 키즈 프렌들리 맛집 위주로 조율해 드릴게요.\n\n이 조건으로 나만의 맞춤 일정표를 완성할까요?`;
        } else if (/(실내|비|우천)/i.test(promptQuery)) {
          conversationalReply = `비가 와도 쾌적하게 즐길 수 있는 대형 복합문화공간, 아쿠아리움, 감성 실내 핫플 위주로 재구성해 드릴게요! ☔✨\n\n이 조건으로 일정표를 업데이트할까요?`;
        } else {
          conversationalReply = `말씀해주신 조건(**${promptQuery}**)을 꼼꼼하게 반영하여 최적의 동선으로 조율해 드릴게요! 😊\n\n이 조건으로 완벽한 맞춤 일정표를 완성할까요?`;
        }

        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: conversationalReply,
          quickSuggestions: [
            (lang === 'en' ? '🚀 Generate Itinerary with this' : '🚀 이 조건으로 일정표 만들기'),
            (lang === 'en' ? '⚙️ Change Conditions (Form)' : '⚙️ 조건 직접 변경하기 (폼)')
          ],
          generationTime: elapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
      } else if (result && result.responseType === 'chat') {
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: result.message,
          quickSuggestions: result.quickSuggestions && result.quickSuggestions.length > 0 
            ? result.quickSuggestions 
            : [(lang === 'en' ? '🚀 Generate Itinerary Now' : '🚀 이 조건으로 일정 만들어줘'), (lang === 'en' ? '⚙️ Change Conditions' : '⚙️ 조건 변경 (폼)')],
          generationTime: result.generationTime || elapsedSeconds,
          queryTime,
          replyTime,
          timestamp: replyTime
        };
        setChatMessages(prev => [...prev, botMsg]);
      } else {
        const requestedDays = extractDaysFromPrompt(fullPromptContext) || 3;
        const finalResult = {
          ...(result || generateLocalFallbackItinerary(fullPromptContext, extractLocationKeyword(fullPromptContext), requestedDays, lang)),
          generationTime: elapsedSeconds,
          draftId: `draft-${Date.now()}`
        };
        
        setItineraryData(finalResult);
        setHasActiveUnsavedDraft(true);
        
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
    </div>
  );
}
