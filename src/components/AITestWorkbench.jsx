import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic, Send, Zap, PlusCircle, UserCheck, Crown, MessageSquare, Trash2, BarChart3, ChevronDown, ChevronUp, Map, Compass } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword, isGreetingQuery, isMetaHelpQuery, geminiGenerateFullItinerary } from '../services/geminiNlpService';
import { fetchTourSpots, fetchPinpointLandmarkSpots } from '../services/tourApi';
import { getAgodaHotelSearchUrl, getKlookActivitySearchUrl } from '../services/affiliateService';
import { logAnalyticsEvent } from '../services/analyticsService';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';

export default function AITestWorkbench({ lang = 'ko' }) {
  // 1. Quota & Dev Bypass Hook State
  const { usedCount, remainingQuota, dailyLimit, canProceed, isDevBypass, toggleDevBypass, incrementQuota } = useQuotaLimit(5);

  // 2. Dev Test Simulator & Admin Dashboard States
  const [virtualTier, setVirtualTier] = useState('dev');
  const [virtualQuotaLimit, setVirtualQuotaLimit] = useState(5);
  const [extraRechargeCount, setExtraRechargeCount] = useState(0);
  const [isVirtualGoogleLogin, setIsVirtualGoogleLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // 3. Responsive Window Width Detection (Desktop >= 768px)
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Mobile Accordion Toggle States & PC Selected Message State
  const [expandedMobileMsgs, setExpandedMobileMsgs] = useState({});
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  const toggleMobileAccordion = (msgId) => {
    setExpandedMobileMsgs(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // 5. Dynamic High-Visibility Animated Loading Dots & Status Step State
  const [loadingDots, setLoadingDots] = useState('●');
  const [loadingStepText, setLoadingStepText] = useState('한국관광공사 정품 DB에서 추천 명소 탐색 중');

  // 6. Chat History Stream State
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome-1',
      sender: 'vora',
      text: '안녕하세요! 여행 컨시어지 보라입니다. 😊\n\n매일 무료로 제공되는 5회의 AI 대화로 나만의 대한민국 맞춤 여행 코스(1일~5일)를 받아보세요!\n\n떠나고 싶은 지역이나 여행 스타일(예: 거제도 2박3일 오션뷰 카페, 수원 화성행궁 야경)을 자유롭게 물어보세요!',
      timestamp: new Date().toLocaleTimeString(),
      chips: ['거제도 2박3일 오션뷰 카페', '수원 화성행궁 야경 힐링', '제주도 3박4일 맛집 탐방', '여기서 뭘 할 수 있지?']
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // Get Currently Selected AI Spot Message for PC Right Fixed Panel (Strict 1:1 Message Sync)
  const activeSpotMessage = chatHistory.find(m => m.id === selectedMsgId && m.sender === 'vora') ||
    chatHistory.slice().reverse().find(m => m.sender === 'vora');

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatHistory, isLoading, loadingDots]);

  // High-Visibility Animated Wave Dots & Rotating Status Step Text
  useEffect(() => {
    let timerDots;
    let timerStep;
    if (isLoading) {
      setLoadingDots('●');
      setLoadingStepText('한국관광공사 정품 DB에서 추천 명소 탐색 중');

      timerDots = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '●') return '● ●';
          if (prev === '● ●') return '● ● ●';
          if (prev === '● ● ●') return '● ● ● ●';
          return '●';
        });
      }, 350);

      let stepCount = 0;
      const steps = [
        '한국관광공사 정품 DB에서 추천 명소 탐색 중',
        'GPS 지도 좌표 및 위치 데이터 1:1 동기화 중',
        '100% 맞춤 여행 일정을 정돈하고 있습니다'
      ];

      timerStep = setInterval(() => {
        stepCount = (stepCount + 1) % steps.length;
        setLoadingStepText(steps[stepCount]);
      }, 900);
    } else {
      setLoadingDots('●');
    }
    return () => {
      clearInterval(timerDots);
      clearInterval(timerStep);
    };
  }, [isLoading]);

  const handleCycleVirtualTier = () => {
    if (virtualTier === 'dev') {
      setVirtualTier('guest');
      setVirtualQuotaLimit(5);
      toggleDevBypass(false);
    } else if (virtualTier === 'guest') {
      setVirtualTier('user');
      setVirtualQuotaLimit(15);
      setIsVirtualGoogleLogin(true);
      toggleDevBypass(false);
    } else if (virtualTier === 'user') {
      setVirtualTier('vip');
      setVirtualQuotaLimit(9999);
      toggleDevBypass(true);
    } else if (virtualTier === 'vip') {
      setVirtualTier('depleted');
      setVirtualQuotaLimit(5);
      toggleDevBypass(false);
    } else {
      setVirtualTier('dev');
      setVirtualQuotaLimit(5);
      toggleDevBypass(true);
    }
  };

  const handleRechargeExtra = () => {
    setExtraRechargeCount(prev => prev + 5);
    logAnalyticsEvent('VIDEO_AD');
    alert('⚡ [테스트 충전] +5회 무료 대화가 가상으로 즉시 충전되었습니다!');
  };

  const handleToggleVirtualGoogleLogin = () => {
    const nextState = !isVirtualGoogleLogin;
    setIsVirtualGoogleLogin(nextState);
    if (nextState) {
      setVirtualQuotaLimit(15);
      setVirtualTier('user');
      logAnalyticsEvent('LOGIN');
      alert('🔑 [가상 구글 로그인 완료] 일일 한도가 15회로 확장되었습니다!');
    } else {
      setVirtualQuotaLimit(5);
      setVirtualTier('guest');
      alert('🔒 [로그아웃] 일일 한도가 비회원 5회로 변경되었습니다.');
    }
  };

  const handleStartVoiceSTT = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식(STT)을 지원하지 않습니다.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : (lang === 'ja' ? 'ja-JP' : (lang === 'zh' ? 'zh-CN' : 'ko-KR'));
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
      };
      recognition.start();
    } catch (e) {
      console.warn('STT Error:', e);
      setIsListening(false);
    }
  };

  const getDayBadgeStyle = (dayIndex) => {
    const colors = [
      { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
      { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
      { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
      { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
      { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }
    ];
    return colors[(dayIndex - 1) % colors.length];
  };

  const handleSendMessage = async (customText = null) => {
    const query = (customText || inputPrompt).trim();
    if (!query || isLoading) return;

    const totalLimit = virtualQuotaLimit + extraRechargeCount;
    const nextAskIndex = Math.min(totalLimit, usedCount + 1);
    const quotaTag = isDevBypass ? '[ ⚡ 무제한 ]' : `[ 오늘 대화 ${nextAskIndex}/${totalLimit}회 ]`;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      quotaTag: quotaTag,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setSelectedMsgId(null);
    setIsLoading(true);

    if (isGreetingQuery(query)) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: '안녕하세요! 여행 컨시어지 보라입니다. 😊 오늘 어떤 멋진 여행을 함께 계획해 볼까요?',
            timestamp: new Date().toLocaleTimeString(),
            chips: ['수원 화성행궁 야경 힐링', '거제도 2박3일 카페 투어', '제주도 오션뷰 맛집']
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    const isMeta = isMetaHelpQuery(query);
    if (!isMeta) {
      const guardResult = validateTravelQuery(query, lang);
      if (!guardResult.isValid) {
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            {
              id: `vora-${Date.now()}`,
              sender: 'vora',
              text: guardResult.reason,
              timestamp: new Date().toLocaleTimeString(),
              isGuardWarning: true,
              chips: ['서울 경복궁 맛집 코스', '부산 해운대 1박2일', '제주도 카페 탐방']
            }
          ]);
          setIsLoading(false);
        }, 300);
        return;
      }
    }

    if (!isDevBypass && usedCount >= totalLimit) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: `안녕하세요! 여행 컨시어지 보라입니다.\n\n⚠️ 오늘 제공된 무료 대화 (${totalLimit}회)를 모두 소비하셨습니다.`,
            timestamp: new Date().toLocaleTimeString(),
            isQuotaExceededNotice: true
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    incrementQuota();
    let initialCity = extractLocationKeyword(query);
    
    let days = 3;
    if (/(5일|4박\s*5일|5박|5d)/i.test(query)) days = 5;
    else if (/(4일|3박\s*4일|4박|4d)/i.test(query)) days = 4;
    else if (/(3일|2박\s*3일|3박|3d)/i.test(query)) days = 3;
    else if (/(2일|1박\s*2일|2박|2d)/i.test(query)) days = 2;
    else if (/(1일|당일|1박)/i.test(query)) days = 1;

    try {
      const [aiBriefing, rawSpotsInitial] = await Promise.all([
        geminiGenerateFullItinerary(query, lang).catch(() => ({
          targetCity: initialCity,
          aiRecommendationSummary: `안녕하세요! 여행 컨시어지 보라입니다. 😊 '${initialCity}' 힐링 맞춤 여행 코스를 추천해 드립니다!\n\n1일차: ${initialCity} 대표 명소를 구경하고 여유로운 산책을 즐깁니다.\n2일차: ${initialCity} 힐링 명소 및 지역 대표 맛집 코스를 탐방합니다.\n3일차: ${initialCity} 전망대에서 일몰을 감상하며 여행을 마무리합니다.`,
          dailyPlaces: [
            { day: 1, places: [`${initialCity} 명소`] },
            { day: 2, places: [`${initialCity} 힐링 코스`] },
            { day: 3, places: [`${initialCity} 전망대`] }
          ],
          isUnknownPlace: false
        })),
        (initialCity && initialCity !== '전국')
          ? fetchTourSpots({ region: initialCity, lang }).catch(() => [])
          : Promise.resolve([])
      ]);

      logAnalyticsEvent('CHAT', { inputTokens: 120, outputTokens: 350 });

      let spotsToRender = [];
      let agodaUrl = null;
      let klookUrl = null;
      let displayCity = aiBriefing?.targetCity || initialCity;
      const isUnknownPlace = aiBriefing?.isUnknownPlace || false;

      if (!isMeta && !isUnknownPlace) {
        const summaryText = aiBriefing?.aiRecommendationSummary || '';

        if (displayCity === '전국') {
          const inferredCity = extractLocationKeyword(summaryText);
          if (inferredCity && inferredCity !== '전국') {
            displayCity = inferredCity;
          } else {
            displayCity = '추천';
          }
        }

        let rawSpots = rawSpotsInitial || [];
        if (rawSpots.length === 0 && displayCity !== '전국' && displayCity !== '추천') {
          rawSpots = await fetchTourSpots({ region: displayCity, lang }).catch(() => []);
        }

        const dayExtractedMap = new Map();
        const allLandmarkNames = new Set();
        for (let d = 1; d <= days; d++) dayExtractedMap.set(d, []);

        const dailyPlaces = aiBriefing?.dailyPlaces || [];
        if (dailyPlaces && dailyPlaces.length > 0) {
          for (const item of dailyPlaces) {
            const dayNum = Math.min(days, Math.max(1, item.day || 1));
            const places = item.places || [];
            const currentList = dayExtractedMap.get(dayNum) || [];

            for (let placeName of places) {
              if (typeof placeName === 'string') {
                placeName = placeName.trim();
                placeName = placeName.replace(/^(수원|창원|경남|부산|서울|인천|강원|제주|전남|전북|충남|충북)\s+/, '').trim();
                if (placeName.length >= 2 && !allLandmarkNames.has(placeName)) {
                  allLandmarkNames.add(placeName);
                  currentList.push({ name: placeName });
                }
              }
            }
            dayExtractedMap.set(dayNum, currentList);
          }
        }

        const landmarkNamesList = Array.from(allLandmarkNames);
        const pinpointResults = await fetchPinpointLandmarkSpots(landmarkNamesList, lang).catch(() => []);
        const pinpointMap = new Map();
        for (const pSpot of pinpointResults) {
          if (pSpot && pSpot.title) {
            pinpointMap.set(pSpot.title.toLowerCase(), pSpot);
            for (const lmName of landmarkNamesList) {
              const cleanLm = lmName.replace(/\s+/g, '').toLowerCase();
              const cleanTitle = (pSpot.title || '').replace(/\s+/g, '').toLowerCase();
              if (cleanTitle && (cleanTitle.includes(cleanLm) || cleanLm.includes(cleanTitle))) {
                pinpointMap.set(lmName.toLowerCase(), pSpot);
              }
            }
          }
        }

        let sequentialSpots = [];
        const addedTitles = new Set();

        for (let d = 1; d <= days; d++) {
          const itemsForDay = dayExtractedMap.get(d) || [];
          for (const item of itemsForDay) {
            const nameLower = item.name.toLowerCase();
            let matchedSpot = pinpointMap.get(nameLower);

            if (!matchedSpot) {
              const cleanItemName = nameLower.replace(/\s+/g, '');
              matchedSpot = rawSpots.find(s => {
                const sClean = (s?.title || '').replace(/\s+/g, '').toLowerCase();
                return sClean && (sClean.includes(cleanItemName) || cleanItemName.includes(sClean));
              });
            }

            if (matchedSpot) {
              if (matchedSpot.title && !addedTitles.has(matchedSpot.title)) {
                addedTitles.add(matchedSpot.title);
                sequentialSpots.push({
                  ...matchedSpot,
                  assignedDay: d
                });
              }
            } else {
              if (!addedTitles.has(item.name)) {
                addedTitles.add(item.name);
                sequentialSpots.push({
                  id: `syn-${Date.now()}-${item.name}`,
                  title: item.name,
                  location: `${displayCity} 추천 장소`,
                  addr1: `${displayCity} ${d}일차 명소`,
                  assignedDay: d,
                  isQuoted: true
                });
              }
            }
          }
        }

        if (isUnknownPlace) {
          spotsToRender = [];
        } else {
          // Rule: NEVER overwrite Gemini extracted spots with TourAPI default '가' spots!
          if (sequentialSpots.length > 0) {
            spotsToRender = sequentialSpots;
          } else {
            spotsToRender = rawSpots.slice(0, Math.max(days, 5)).map((s, idx) => ({
              ...s,
              assignedDay: Math.min(days, Math.floor(idx / 2) + 1)
            }));
          }
        }

        agodaUrl = isUnknownPlace ? null : getAgodaHotelSearchUrl(displayCity);
        klookUrl = isUnknownPlace ? null : getKlookActivitySearchUrl(displayCity);
      }

      const voraMsgId = `vora-${Date.now()}`;
      const voraResponse = {
        id: voraMsgId,
        sender: 'vora',
        text: aiBriefing?.aiRecommendationSummary || `안녕하세요! 여행 조력자 보라입니다. 😊 '${displayCity}' 여행 코스를 준비했습니다.`,
        timestamp: new Date().toLocaleTimeString(),
        targetCity: isUnknownPlace ? null : displayCity,
        days,
        spots: isUnknownPlace ? [] : spotsToRender,
        agodaUrl,
        klookUrl
      };

      setChatHistory(prev => [...prev, voraResponse]);
      setSelectedMsgId(voraMsgId);

      if (voraMsgId && spotsToRender.length > 0) {
        setExpandedMobileMsgs(prev => ({ ...prev, [voraMsgId]: true }));
      }

    } catch (err) {
      console.warn('Pipeline execution error fallback:', err);
      const fallbackCity = initialCity && initialCity !== '전국' ? initialCity : '추천';
      const fallbackSpots = await fetchTourSpots({ region: fallbackCity, lang }).catch(() => []);
      const voraMsgId = `vora-${Date.now()}`;

      let fallbackSummaryText = `안녕하세요! 여행 조력자 보라입니다. 😊 '${fallbackCity}' 힐링 맞춤 여행 코스를 추천해 드립니다!\n\n1일차: ${fallbackCity} 대표 명소를 구경하고 여유로운 산책을 즐깁니다.\n2일차: ${fallbackCity} 힐링 명소 및 지역 대표 맛집을 탐방합니다.\n3일차: ${fallbackCity} 아름다운 전망대에서 일몰을 감상하며 여행을 마무리합니다.`;
      if (fallbackCity.includes('거제')) {
        fallbackSummaryText = `안녕하세요! 여행 조력자 보라입니다. 😊 거제도 3일 힐링 코스를 추천해 드립니다!\n\n1일차: 바람의 언덕에서 시원한 오션뷰를 조망하고 신선대를 둘러봅니다.\n2일차: 외도 보타니아 아열대 식물원을 구경하고 매미성 포토존을 탐방합니다.\n3일차: 학동 흑진주 몽돌해변 파도 소리를 들으며 여행을 마무리합니다.`;
      } else if (fallbackCity.includes('수원')) {
        fallbackSummaryText = `안녕하세요! 여행 조력자 보라입니다. 😊 수원 화성 3일 힐링 코스를 추천해 드립니다!\n\n1일차: 수원 화성행궁 역사적 의미를 기리고 행리단길 분위기를 즐깁니다.\n2일차: 수원 화성 성곽길을 따라 걸으며 방화수류정 야경을 감상합니다.\n3일차: 광교호수공원 산책을 즐기며 편안하게 여행을 마무리합니다.`;
      }

      const voraResponse = {
        id: voraMsgId,
        sender: 'vora',
        text: fallbackSummaryText,
        timestamp: new Date().toLocaleTimeString(),
        targetCity: fallbackCity,
        days,
        spots: fallbackSpots.slice(0, 5).map((s, idx) => ({ ...s, assignedDay: Math.floor(idx / 2) + 1 })),
        agodaUrl: getAgodaHotelSearchUrl(fallbackCity),
        klookUrl: getKlookActivitySearchUrl(fallbackCity)
      };

      setChatHistory(prev => [...prev, voraResponse]);
      setSelectedMsgId(voraMsgId);
      if (voraMsgId) setExpandedMobileMsgs(prev => ({ ...prev, [voraMsgId]: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const userLabel = lang === 'en' ? '👤 You' : (lang === 'ja' ? '👤 あなた' : (lang === 'zh' ? '👤 me' : '👤 나'));

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      borderRadius: '24px',
      padding: '1.25rem',
      margin: '1rem 0',
      border: '1px solid #cbd5e1',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* 🛠️ TOP CONTROL BAR */}
      <div style={{
        backgroundColor: '#f1f5f9',
        padding: '0.75rem 1rem',
        borderRadius: '16px',
        border: '1px solid #cbd5e1',
        marginBottom: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} style={{ color: '#7e22ce' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
            🛠️ AI 쿼터 & 회원 등급 제어판:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setShowAdminDashboard(prev => !prev)}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: showAdminDashboard ? '#7e22ce' : '#f3e8ff',
              color: showAdminDashboard ? '#ffffff' : '#7e22ce'
            }}
          >
            <BarChart3 size={13} />
            {showAdminDashboard ? '👑 관리자 통계 닫기' : '👑 선배님 관리자 통계 대시보드'}
          </button>

          <button
            onClick={() => toggleDevBypass()}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: isDevBypass ? '#10b981' : '#ffe4e6',
              color: isDevBypass ? '#ffffff' : '#be123c'
            }}
          >
            {isDevBypass ? <Zap size={13} /> : <ShieldAlert size={13} />}
            {isDevBypass ? '무제한 모드 ON' : '유저 제한 모드'}
          </button>

          <button
            onClick={handleRechargeExtra}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: '#2563eb',
              color: '#ffffff'
            }}
          >
            <PlusCircle size={13} />
            +5회 즉시 충전 {extraRechargeCount > 0 && `(+${extraRechargeCount})`}
          </button>

          <button
            onClick={handleToggleVirtualGoogleLogin}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: isVirtualGoogleLogin ? '#ea580c' : '#64748b',
              color: '#ffffff'
            }}
          >
            <UserCheck size={13} />
            {isVirtualGoogleLogin ? '🔑 구글 로그인 상태' : '🔒 비회원 상태'}
          </button>

          <button
            onClick={handleCycleVirtualTier}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              color: '#7e22ce',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Crown size={13} />
            등급: <strong style={{ color: '#6b21a8' }}>{virtualTier.toUpperCase()}</strong>
          </button>
        </div>
      </div>

      {showAdminDashboard && <AdminAnalyticsDashboard />}

      {/* CHAT CONTAINER HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.65rem',
        marginBottom: '0.85rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ padding: '0.4rem', backgroundColor: '#9333ea', color: '#ffffff', borderRadius: '10px', display: 'flex' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Vora AI 1:1 대화형 여행 컨시어지
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              맞춤 여행 일정 (1~5일) ➔ 한국관광공사 정품 명소 & 지도 GPS 연동
            </span>
          </div>
        </div>

        <div style={{
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: isDevBypass ? '#d1fae5' : '#dbeafe',
          color: isDevBypass ? '#065f46' : '#1e40af',
          border: isDevBypass ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          {isDevBypass ? (
            <>⚡ 무제한 패스 (UNLIMITED)</>
          ) : (
            <>🎟️ 오늘 남은 무료 대화: <span style={{ color: '#b45309' }}>{Math.max(0, (virtualQuotaLimit + extraRechargeCount) - usedCount)}</span> / {virtualQuotaLimit + extraRechargeCount}회</>
          )}
        </div>
      </div>

      {/* 🔥 RESPONSIVE HYBRID UX LAYOUT CONTAINER (PC: Left Rich Text Only | Right Fixed Cards Only) */}
      <div style={{
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        gap: '1.25rem',
        alignItems: 'flex-start'
      }}>

        {/* LEFT COLUMN: CHAT STREAM & INPUT (PC: 60% Width | Mobile: 100% Width) */}
        <div style={{
          flex: isDesktop ? '1 1 58%' : '1 1 100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>

          {/* CHAT MESSAGES STREAM CONTAINER */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '1rem 1rem 2.5rem 1rem',
            minHeight: '380px',
            maxHeight: '560px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            border: '1px solid #cbd5e1',
            marginBottom: '0.85rem',
            scrollBehavior: 'smooth'
          }}>
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                onClick={() => msg.spots && msg.spots.length > 0 && setSelectedMsgId(msg.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.15rem',
                  cursor: (msg.spots && msg.spots.length > 0) ? 'pointer' : 'default'
                }}
              >
                {/* Sender Label & Timestamp */}
                <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.1rem' }}>
                  <span>{msg.sender === 'user' ? userLabel : '🤖 Vora AI'}</span>
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div style={{
                  maxWidth: '92%',
                  padding: '0.65rem 0.95rem',
                  borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.84rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.sender === 'user' ? '0 3px 8px rgba(37, 99, 235, 0.18)' : '0 3px 8px rgba(0, 0, 0, 0.04)',
                  border: (isDesktop && activeSpotMessage?.id === msg.id) ? '2px solid #9333ea' : (msg.sender === 'user' ? 'none' : '1px solid #e2e8f0')
                }}>
                  {msg.sender === 'user' && msg.quotaTag && (
                    <span style={{ fontSize: '0.68rem', opacity: 0.85, marginRight: '0.4rem', fontWeight: 600 }}>
                      {msg.quotaTag}
                    </span>
                  )}

                  {/* 🌟 RICH AI ITINERARY TEXT BRIEFING */}
                  {msg.text}

                  {msg.isGuardWarning && (
                    <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9', color: '#dc2626', fontSize: '0.75rem' }}>
                      💡 대한민국 관공서/관광 명소 및 미식 질문을 입력해 주시면 감사하겠습니다!
                    </div>
                  )}

                  {msg.isQuotaExceededNotice && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={handleRechargeExtra}
                        style={{ padding: '0.45rem 0.75rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'center' }}
                      >
                        🎬 15초 짧은 광고 시청하고 오늘 +3회 즉시 충전하기
                      </button>
                      <button
                        onClick={handleToggleVirtualGoogleLogin}
                        style={{ padding: '0.45rem 0.75rem', backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'center' }}
                      >
                        🔴 Google 3초 로그인하고 매일 15회로 확장하기
                      </button>
                    </div>
                  )}

                  {/* 📱 MOBILE VIEW ONLY: ACCORDION TOGGLE & CARDS (PC HAS ZERO INLINE CARDS ON LEFT!) */}
                  {!isDesktop && msg.spots && msg.spots.length > 0 && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMobileAccordion(msg.id);
                          setSelectedMsgId(msg.id);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          backgroundColor: '#f3e8ff',
                          color: '#7e22ce',
                          border: '1px solid #e9d5ff',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          🗺️ {msg.targetCity || '추천'} 1:1 명소 코스 ({msg.spots.length}건)
                        </span>
                        {expandedMobileMsgs[msg.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {expandedMobileMsgs[msg.id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
                          {msg.spots.map((spot, idx) => {
                            const dayNum = spot.assignedDay || 1;
                            const badgeStyle = getDayBadgeStyle(dayNum);
                            const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' ' + (spot.location || spot.addr1 || ''))}`;

                            return (
                              <div key={spot.id || idx} style={{ padding: '0.5rem 0.65rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.15rem' }}>
                                    <span style={{ padding: '0.1rem 0.4rem', borderRadius: '6px', fontSize: '0.63rem', fontWeight: 700, backgroundColor: badgeStyle.bg, color: badgeStyle.text, border: `1px solid ${badgeStyle.border}` }}>
                                      {dayNum}일차 명소
                                    </span>
                                    <strong style={{ color: '#0f172a', fontSize: '0.76rem' }}>{idx + 1}. {spot.title}</strong>
                                  </div>
                                  <span style={{ color: '#64748b', fontSize: '0.66rem', display: 'block' }}>
                                    📍 {spot.location || spot.addr1 || '중심가'}
                                  </span>
                                </div>

                                <a
                                  href={mapSearchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ffffff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', textDecoration: 'none', fontSize: '0.66rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}
                                >
                                  <MapPin size={11} /> 지도
                                </a>
                              </div>
                            );
                          })}

                          {msg.agodaUrl && msg.klookUrl && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                              <a href={msg.agodaUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', border: '1px solid #bfdbfe', textDecoration: 'none', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                🏨 아고다 {msg.targetCity} 할인 숙소 <ExternalLink size={10} />
                              </a>
                              <a href={msg.klookUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '6px', border: '1px solid #ffedd5', textDecoration: 'none', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                🎟️ 클룩 {msg.targetCity} 액티비티 <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                {msg.chips && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                    {msg.chips.map((chipText, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chipText)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                        }}
                      >
                        📍 {chipText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1.1rem',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #d8b4fe',
                color: '#7e22ce',
                fontSize: '0.82rem',
                fontWeight: 700,
                maxWidth: '88%',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.08)'
              }}>
                <RefreshCw size={17} className="animate-spin" style={{ color: '#9333ea' }} />
                <span>{loadingStepText} <strong style={{ color: '#7e22ce', fontSize: '0.95rem' }}>{loadingDots}</strong></span>
              </div>
            )}

            <div ref={chatEndRef} style={{ height: '10px' }} />
          </div>

          {/* INPUT FORM CONTAINER */}
          <div style={{ display: 'flex', gap: '0.4rem', position: 'relative' }}>
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="어디로 떠나고 싶으신가요? (예: 수원 2박3일 맛집 코스, 거제도 4박5일 힐링)"
              style={{
                flex: 1,
                padding: '0.75rem 0.9rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />

            <button
              onClick={handleStartVoiceSTT}
              style={{
                padding: '0 0.75rem',
                backgroundColor: isListening ? '#ef4444' : '#f1f5f9',
                color: isListening ? '#ffffff' : '#334155',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="음성 인식"
            >
              <Mic size={17} />
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              style={{
                padding: '0 1.1rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: (isLoading || !inputPrompt.trim()) ? 0.5 : 1
              }}
            >
              <Send size={15} />
              <span>전송</span>
            </button>
          </div>

        </div>

        {/* 🖥️ PC DESKTOP ONLY: 2-COLUMN RIGHT FIXED PANEL (DEDICATED EXCLUSIVE CARD LIST) */}
        {isDesktop && (
          <div style={{
            flex: '1 1 42%',
            width: '100%',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            position: 'sticky',
            top: '1rem',
            maxHeight: '620px',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.65rem',
              marginBottom: '0.85rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={18} style={{ color: '#7e22ce' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {activeSpotMessage ? `🗺️ ${activeSpotMessage.targetCity || '추천'} 1:1 명소 코스` : '🗺️ 추천 여행 코스 전용 패널'}
                </h4>
              </div>
              {activeSpotMessage?.spots && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce', backgroundColor: '#f3e8ff', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                  {activeSpotMessage.spots.length}건 동기화
                </span>
              )}
            </div>

            {/* Desktop Spot Cards List */}
            {isLoading ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#7e22ce', fontSize: '0.84rem', fontWeight: 700 }}>
                <RefreshCw size={30} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', display: 'block', color: '#9333ea' }} />
                <span>{loadingStepText}</span>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 500 }}>
                  새로운 여행 질문에 맞춰 1:1 명소 코스를 실시간 동기화 중입니다...
                </div>
              </div>
            ) : activeSpotMessage?.spots && activeSpotMessage.spots.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeSpotMessage.spots.map((spot, idx) => {
                  const dayNum = spot.assignedDay || 1;
                  const badgeStyle = getDayBadgeStyle(dayNum);
                  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' ' + (spot.location || spot.addr1 || ''))}`;

                  return (
                    <div key={spot.id || idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, backgroundColor: badgeStyle.bg, color: badgeStyle.text, border: `1px solid ${badgeStyle.border}` }}>
                            {dayNum}일차 명소
                          </span>
                          <strong style={{ color: '#0f172a', fontSize: '0.8rem' }}>{idx + 1}. {spot.title}</strong>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                          📍 {spot.location || spot.addr1 || '중심가'}
                        </span>
                      </div>

                      <a
                        href={mapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.3rem 0.55rem',
                          backgroundColor: '#f8fafc',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <MapPin size={12} /> 지도 위치
                      </a>
                    </div>
                  );
                })}

                {/* PC Affiliate Buttons */}
                {activeSpotMessage.agodaUrl && activeSpotMessage.klookUrl && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0' }}>
                    <a href={activeSpotMessage.agodaUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.45rem 0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', border: '1px solid #bfdbfe', textDecoration: 'none', fontSize: '0.74rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>🏨 아고다 {activeSpotMessage.targetCity} 할인 숙소 예약</span>
                      <ExternalLink size={13} />
                    </a>
                    <a href={activeSpotMessage.klookUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.45rem 0.75rem', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '8px', border: '1px solid #ffedd5', textDecoration: 'none', fontSize: '0.74rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>🎟️ 클룩 {activeSpotMessage.targetCity} 액티비티 예약</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                <Map size={32} style={{ margin: '0 auto 0.5rem auto', color: '#cbd5e1', display: 'block' }} />
                <span>왼쪽 Vora AI 대화창에서 원하시는 여행지나 일정을 물어보시면, 정품 명소 지도 코스가 이 우측 패널에 자동으로 동기화됩니다!</span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
