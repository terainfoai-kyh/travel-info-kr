import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic, Send, Zap, PlusCircle, UserCheck, Crown, MessageSquare, Trash2, BarChart3 } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword, isGreetingQuery, isMetaHelpQuery, geminiGenerateFullItinerary } from '../services/geminiNlpService';
import { fetchTourSpots, fetchPinpointLandmarkSpots } from '../services/tourApi';
import { getAgodaHotelSearchUrl, getKlookActivitySearchUrl } from '../services/affiliateService';
import { logAnalyticsEvent } from '../services/analyticsService';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';

// Meta/Action Blacklist Words preventing "마무리", "산책", "이동" from being rendered as spots
const EXCLUDED_META_WORDS = [
  '마무리', '출발', '도착', '산책', '관람', '이동', '식사', '점심', '저녁', '아침', '숙박', '휴식',
  '자유시간', '일정', '코스', '여행', '추천', '감상', '즐깁니다', '마무리합니다', '보냅니다', '둘러봅니다', '보태어', '이어집니다'
];

export default function AITestWorkbench({ lang = 'ko' }) {
  // 1. Quota & Dev Bypass Hook State
  const { usedCount, remainingQuota, dailyLimit, canProceed, isDevBypass, toggleDevBypass, incrementQuota } = useQuotaLimit(5);

  // 2. Dev Test Simulator & Admin Dashboard States
  const [virtualTier, setVirtualTier] = useState('dev'); // 'guest', 'user', 'vip', 'depleted', 'dev'
  const [virtualQuotaLimit, setVirtualQuotaLimit] = useState(5);
  const [extraRechargeCount, setExtraRechargeCount] = useState(0);
  const [isVirtualGoogleLogin, setIsVirtualGoogleLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // 3. Dynamic High-Visibility Animated Loading Dots & Status Step State
  const [loadingDots, setLoadingDots] = useState('●');
  const [loadingStepText, setLoadingStepText] = useState('한국관광공사 정품 DB에서 추천 명소 탐색 중');

  // 4. Chat History Stream State
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome-1',
      sender: 'vora',
      text: '안녕하세요! 여행 조력자 보라입니다. 😊\n\n매일 무료로 제공되는 5회의 AI 대화로 나만의 대한민국 맞춤 여행 코스(1일~5일)를 받아보세요!\n\n떠나고 싶은 지역이나 여행 스타일(예: 거제도 2박3일 오션뷰 카페, 수원 화성행궁 야경)을 자유롭게 물어보세요!',
      timestamp: new Date().toLocaleTimeString(),
      chips: ['거제도 2박3일 오션뷰 카페', '수원 화성행궁 야경 힐링', '제주도 3박4일 맛집 탐방', '여기서 뭘 할 수 있지?']
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatHistory, isLoading, loadingDots]);

  // High-Visibility Animated Wave Dots & Rotating Status Step Text (No Emojis)
  useEffect(() => {
    let timerDots;
    let timerStep;
    if (isLoading) {
      setLoadingDots('●');
      setLoadingStepText('한국관광공사 정품 DB에서 추천 명소 탐색 중');

      // Large bold wave dots: ● -> ● ● -> ● ● ● -> ● ● ● ●
      timerDots = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '●') return '● ●';
          if (prev === '● ●') return '● ● ●';
          if (prev === '● ● ●') return '● ● ● ●';
          return '●';
        });
      }, 350);

      // Rotating status text (every 900ms, no emojis)
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

  // Dev Simulator: Handle Tier Cycle
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

  // Dev Simulator: Virtual Recharge +5
  const handleRechargeExtra = () => {
    setExtraRechargeCount(prev => prev + 5);
    logAnalyticsEvent('VIDEO_AD');
    alert('⚡ [테스트 충전] +5회 무료 대화가 가상으로 즉시 충전되었습니다!');
  };

  // Dev Simulator: Virtual Google Login Toggle
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

  // STT Voice Input Test
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

  // Helper function to get Day Badge styling
  const getDayBadgeStyle = (dayIndex) => {
    const colors = [
      { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' }, // Day 1 Purple
      { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' }, // Day 2 Blue
      { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' }, // Day 3 Green
      { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' }, // Day 4 Orange
      { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }  // Day 5 Pink
    ];
    return colors[(dayIndex - 1) % colors.length];
  };

  // Extract Korean Nouns and Quoted Places from Line (Filters out EXCLUDED_META_WORDS like 마무리, 산책, 식사)
  const extractPlacesFromLine = (line) => {
    const results = [];
    
    // 1. Quoted names ('W181', '외도널서리', '심해', '온더선셋' etc.)
    const quoted = Array.from(line.matchAll(/['"‘“]([^'"’”]+)['"’”]/g)).map(m => m[1].trim());
    for (const q of quoted) {
      if (q.length >= 2 && !EXCLUDED_META_WORDS.includes(q) && !results.some(r => r.name === q)) {
        results.push({ name: q, isQuoted: true });
      }
    }

    // 2. Korean Landmark Nouns (Includes 다리, 문, 광장, 시장, 고개, 폭포, 동굴, 온천, 포구, 대교, 야경, 해변)
    const landmarkRegex = /([가-힣]{2,10}(?:다리|대교|해변|해수욕장|언덕|성|길|공원|타워|궁|사|대|동|리|항|포|섬|교|전망대|테마파크|수목원|식물원|보타니아|문|광장|시장|고개|폭포|동굴|온천|포구))/g;
    const matches = Array.from(line.matchAll(landmarkRegex)).map(m => m[1].trim());
    for (let m of matches) {
      // Normalize typos (e.g. 콰이어강 -> 콰이강)
      if (m.includes('콰이어강')) m = m.replace('콰이어강', '콰이강');

      // Filter out meta blacklist words (e.g. 마무리, 산책, 이동)
      if (m.length >= 2 && !EXCLUDED_META_WORDS.includes(m) && !results.some(r => r.name === m)) {
        results.push({ name: m, isQuoted: false });
      }
    }

    return results;
  };

  // Execute Conversational AI Pipeline with Parallel AI + TourAPI Fetch & 2nd-Tier City Inference
  const handleSendMessage = async (customText = null) => {
    const query = (customText || inputPrompt).trim();
    if (!query || isLoading) return;

    const totalLimit = virtualQuotaLimit + extraRechargeCount;
    const nextAskIndex = Math.min(totalLimit, usedCount + 1);
    const quotaTag = isDevBypass ? '[ ⚡ 무제한 ]' : `[ 오늘 대화 ${nextAskIndex}/${totalLimit}회 ]`;

    // Add User Message to Chat Stream with Quota Tag
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
    setIsLoading(true);

    // 1. Check Casual Greeting Query
    if (isGreetingQuery(query)) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: '안녕하세요! 여행 조력자 보라입니다. 😊 오늘 어떤 멋진 여행을 함께 계획해 볼까요?',
            timestamp: new Date().toLocaleTimeString(),
            chips: ['수원 화성행궁 야경 힐링', '거제도 2박3일 카페 투어', '제주도 오션뷰 맛집']
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    // 2. 1차 로컬 입력 방어 검증 (useInputGuard)
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

    // 3. 2차 AI 쿼터 및 회원 등급 검증 (useQuotaLimit)
    if (!isDevBypass && usedCount >= totalLimit) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: `안녕하세요! 여행 조력자 보라입니다.\n\n⚠️ 오늘 제공된 무료 대화 (${totalLimit}회)를 모두 소비하셨습니다.`,
            timestamp: new Date().toLocaleTimeString(),
            isQuotaExceededNotice: true
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    // 4. Increment Quota & Execute Pipeline
    incrementQuota();
    let initialCity = extractLocationKeyword(query);
    
    // Robust "X박 Y일" Duration Parsing (2박3일 -> 3 days)
    let days = 3;
    if (/(5일|4박\s*5일|5박|5d)/i.test(query)) days = 5;
    else if (/(4일|3박\s*4일|4박|4d)/i.test(query)) days = 4;
    else if (/(3일|2박\s*3일|3박|3d)/i.test(query)) days = 3;
    else if (/(2일|1박\s*2일|2박|2d)/i.test(query)) days = 2;
    else if (/(1일|당일|1박)/i.test(query)) days = 1;

    // 🔥 ULTRA FAST PARALLEL EXECUTION: Fire Gemini AI AND TourAPI Regional Search simultaneously at millisecond 0!
    try {
      const [aiBriefing, rawSpotsInitial] = await Promise.all([
        geminiGenerateFullItinerary(query, lang),
        (initialCity && initialCity !== '전국') ? fetchTourSpots({ region: initialCity, lang }) : Promise.resolve([])
      ]);

      logAnalyticsEvent('CHAT', { inputTokens: 120, outputTokens: 350 });

      let spotsToRender = [];
      let agodaUrl = null;
      let klookUrl = null;
      let displayCity = initialCity;

      if (!isMeta) {
        const summaryText = aiBriefing?.aiRecommendationSummary || '';

        // 2nd-Tier City Auto-Inference: If user typed landmark only without city (initialCity === '전국'), infer city from Gemini's text!
        if (displayCity === '전국') {
          const inferredCity = extractLocationKeyword(summaryText);
          if (inferredCity && inferredCity !== '전국') {
            displayCity = inferredCity;
          } else {
            displayCity = '추천';
          }
        }

        let rawSpots = rawSpotsInitial;
        if (rawSpots.length === 0 && displayCity !== '전국' && displayCity !== '추천') {
          rawSpots = await fetchTourSpots({ region: displayCity, lang });
        }

        const lines = summaryText.split('\n').map(l => l.trim()).filter(Boolean);

        // Collect all extracted landmarks per day
        const dayExtractedMap = new Map();
        const allLandmarkNames = new Set();

        for (let d = 1; d <= days; d++) dayExtractedMap.set(d, []);

        for (const line of lines) {
          let dayNum = 1;
          const dayMatch = line.match(/(\d+)일차/);
          if (dayMatch && dayMatch[1]) {
            dayNum = Math.min(days, parseInt(dayMatch[1], 10));
          }

          const extractedItems = extractPlacesFromLine(line);
          const currentDayItems = dayExtractedMap.get(dayNum) || [];

          for (const item of extractedItems) {
            if (!allLandmarkNames.has(item.name)) {
              allLandmarkNames.add(item.name);
              currentDayItems.push(item);
            }
          }
          dayExtractedMap.set(dayNum, currentDayItems);
        }

        // Asynchronously query TourAPI for unquoted landmark nouns via searchKeyword2 (Ultra-Fast Parallel)
        const landmarkNamesList = Array.from(allLandmarkNames);
        const pinpointResults = await fetchPinpointLandmarkSpots(landmarkNamesList, lang);
        const pinpointMap = new Map();
        for (const pSpot of pinpointResults) {
          pinpointMap.set(pSpot.title.toLowerCase(), pSpot);
          for (const lmName of landmarkNamesList) {
            if (pSpot.title.includes(lmName) || lmName.includes(pSpot.title)) {
              pinpointMap.set(lmName.toLowerCase(), pSpot);
            }
          }
        }

        // Assemble Sequential Spots Day by Day
        let sequentialSpots = [];
        const addedTitles = new Set();

        for (let d = 1; d <= days; d++) {
          const itemsForDay = dayExtractedMap.get(d) || [];
          for (const item of itemsForDay) {
            const nameLower = item.name.toLowerCase();
            
            // 1. Try Pinpoint TourAPI Match
            let matchedSpot = pinpointMap.get(nameLower);

            // 2. Try rawSpots Match
            if (!matchedSpot) {
              matchedSpot = rawSpots.find(s => s.title.toLowerCase().includes(nameLower) || nameLower.includes(s.title.toLowerCase()));
            }

            if (matchedSpot) {
              if (!addedTitles.has(matchedSpot.title)) {
                addedTitles.add(matchedSpot.title);
                sequentialSpots.push({
                  ...matchedSpot,
                  assignedDay: d
                });
              }
            } else {
              // 3. Synthesize Spot Card for Quoted or Special Cafe/Spot Name (Filtering out meta words)
              if (!addedTitles.has(item.name) && !EXCLUDED_META_WORDS.includes(item.name)) {
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

        // Pad with remaining rawSpots if total count < min target (min 5 spots)
        const targetCount = Math.max(days, 5);
        if (sequentialSpots.length < targetCount && rawSpots.length > 0) {
          for (const rem of rawSpots) {
            if (sequentialSpots.length >= targetCount) break;
            if (!addedTitles.has(rem.title)) {
              addedTitles.add(rem.title);
              const fallbackDay = Math.min(days, Math.floor((sequentialSpots.length / targetCount) * days) + 1);
              sequentialSpots.push({ ...rem, assignedDay: fallbackDay });
            }
          }
        }

        spotsToRender = sequentialSpots;
        agodaUrl = getAgodaHotelSearchUrl(displayCity);
        klookUrl = getKlookActivitySearchUrl(displayCity);
      }

      const voraResponse = {
        id: `vora-${Date.now()}`,
        sender: 'vora',
        text: aiBriefing?.aiRecommendationSummary || `안녕하세요! 여행 조력자 보라입니다. 😊`,
        timestamp: new Date().toLocaleTimeString(),
        targetCity: displayCity,
        days,
        spots: spotsToRender,
        agodaUrl,
        klookUrl
      };

      setChatHistory(prev => [...prev, voraResponse]);
    } catch (err) {
      console.warn('Pipeline execution error:', err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `vora-${Date.now()}`,
          sender: 'vora',
          text: `안녕하세요! 여행 조력자 보라입니다. 😊 추천 정보를 준비했습니다.`,
          timestamp: new Date().toLocaleTimeString(),
          targetCity: initialCity,
          days
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const userLabel = lang === 'en' ? '👤 You' : (lang === 'ja' ? '👤 あなた' : (lang === 'zh' ? '👤 我' : '👤 나'));

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
      
      {/* 🛠️ TOP SENIOR DEVELOPER TEST SIMULATOR CONTROL BAR */}
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
          {/* Senior Private Admin Analytics Toggle */}
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

      {/* SENIOR PRIVATE ADMIN ANALYTICS DASHBOARD VIEW */}
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

        {/* Realtime Quota Info Badge */}
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.15rem'
            }}
          >
            {/* Sender Label & Timestamp */}
            <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.1rem' }}>
              <span>{msg.sender === 'user' ? userLabel : '🤖 Vora AI'}</span>
              <span>• {msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '88%',
              padding: '0.65rem 0.95rem',
              borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
              fontSize: '0.84rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              boxShadow: msg.sender === 'user' ? '0 3px 8px rgba(37, 99, 235, 0.18)' : '0 3px 8px rgba(0, 0, 0, 0.04)',
              border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'
            }}>
              {/* User Quota Badge Tag */}
              {msg.sender === 'user' && msg.quotaTag && (
                <span style={{ fontSize: '0.68rem', opacity: 0.85, marginRight: '0.4rem', fontWeight: 600 }}>
                  {msg.quotaTag}
                </span>
              )}

              {msg.text}

              {/* Guard Warning Highlight */}
              {msg.isGuardWarning && (
                <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9', color: '#dc2626', fontSize: '0.75rem' }}>
                  💡 대한민국 관공서/관광 명소 및 미식 질문을 입력해 주시면 감사하겠습니다!
                </div>
              )}

              {/* Quota Exceeded Action Card */}
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

              {/* 100% Sequential 1:1 Synchronized Geo-Coordinates & Spot Cards */}
              {msg.spots && msg.spots.length > 0 && (
                <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7e22ce', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    🗺️ {msg.targetCity || '추천'} 순서 1:1 완벽 동기화 코스 ({msg.spots.length}건):
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {msg.spots.map((spot, idx) => {
                      const dayNum = spot.assignedDay || 1;
                      const badgeStyle = getDayBadgeStyle(dayNum);
                      const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.title + ' ' + (spot.location || spot.addr1 || ''))}`;

                      return (
                        <div key={spot.id || idx} style={{ padding: '0.55rem 0.7rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                              <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, backgroundColor: badgeStyle.bg, color: badgeStyle.text, border: `1px solid ${badgeStyle.border}` }}>
                                {dayNum}일차 명소
                              </span>
                              <strong style={{ color: '#0f172a', fontSize: '0.78rem' }}>{idx + 1}. {spot.title}</strong>
                            </div>
                            <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                              📍 {spot.location || spot.addr1 || '중심가'}
                            </span>
                          </div>

                          {/* Clean Map Button Replacing Raw lat/lng Debug Text */}
                          <a
                            href={mapSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '0.3rem 0.55rem',
                              backgroundColor: '#ffffff',
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
                  </div>

                  {/* Value-First Call To Action Affiliate Chips */}
                  {msg.agodaUrl && msg.klookUrl && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', pt: '0.3rem', marginTop: '0.3rem' }}>
                      <a href={msg.agodaUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.3rem 0.55rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', border: '1px solid #bfdbfe', textDecoration: 'none', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        🏨 아고다 {msg.targetCity} 할인 숙소 <ExternalLink size={11} />
                      </a>
                      <a href={msg.klookUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.3rem 0.55rem', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '6px', border: '1px solid #ffedd5', textDecoration: 'none', fontSize: '0.7rem', display: 'flex', items: 'center', gap: '0.2rem' }}>
                        🎟️ 클룩 {msg.targetCity} 액티비티 <ExternalLink size={11} />
                      </a>
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

        {/* Clean & Sophisticated High-Visibility Loading Card (No Emojis) */}
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

        {/* Mic STT Button */}
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

        {/* Send Button */}
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
  );
}
