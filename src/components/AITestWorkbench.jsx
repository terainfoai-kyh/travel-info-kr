import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic, Send, Zap, PlusCircle, UserCheck, Crown, MessageSquare, Trash2 } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword, isGreetingQuery, isMetaHelpQuery, geminiGenerateFullItinerary } from '../services/geminiNlpService';
import { fetchTourSpots } from '../services/tourApi';
import { getAgodaHotelSearchUrl, getKlookActivitySearchUrl } from '../services/affiliateService';

export default function AITestWorkbench({ lang = 'ko' }) {
  // 1. Quota & Dev Bypass Hook State
  const { usedCount, remainingQuota, dailyLimit, canProceed, isDevBypass, toggleDevBypass, incrementQuota } = useQuotaLimit(5);

  // 2. Dev Test Simulator States
  const [virtualTier, setVirtualTier] = useState('dev'); // 'guest', 'user', 'vip', 'depleted', 'dev'
  const [virtualQuotaLimit, setVirtualQuotaLimit] = useState(5);
  const [extraRechargeCount, setExtraRechargeCount] = useState(0);
  const [isVirtualGoogleLogin, setIsVirtualGoogleLogin] = useState(false);

  // 3. Chat History Stream State
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome-1',
      sender: 'vora',
      text: '안녕하세요! 여행 조력자 보라입니다. 😊 대한민국 구석구석 떠나고 싶은 여행지를 자유롭게 말씀해 주세요!\n\n아래 추천 키워드를 누르시거나 궁금하신 점을 물어보세요!',
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

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
    alert('⚡ [테스트 충전] +5회 무료 티켓이 가상으로 즉시 충전되었습니다!');
  };

  // Dev Simulator: Virtual Google Login Toggle
  const handleToggleVirtualGoogleLogin = () => {
    const nextState = !isVirtualGoogleLogin;
    setIsVirtualGoogleLogin(nextState);
    if (nextState) {
      setVirtualQuotaLimit(15);
      setVirtualTier('user');
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

  // Execute Conversational AI Pipeline
  const handleSendMessage = async (customText = null) => {
    const query = (customText || inputPrompt).trim();
    if (!query || isLoading) return;

    // Add User Message to Chat Stream
    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
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
    const currentLimit = virtualQuotaLimit + extraRechargeCount;
    if (!isDevBypass && usedCount >= currentLimit) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: `안녕하세요! 여행 조력자 보라입니다.\n\n⚠️ 선배님! 오늘 제공된 AI 티켓 (${currentLimit}회)을 모두 소비하셨습니다.`,
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
    const targetCity = extractLocationKeyword(query);
    let days = 3;
    if (/(2일|2박|2d)/i.test(query)) days = 2;
    if (/(1일|1박|당일)/i.test(query)) days = 1;
    if (/(4일|4박|4d)/i.test(query)) days = 4;

    // Execute Gemini AI
    const aiBriefing = await geminiGenerateFullItinerary(query, lang);

    // Fetch Official TourAPI Spots ONLY if query is NOT a meta help query
    try {
      let spotsToRender = [];
      let agodaUrl = null;
      let klookUrl = null;

      if (!isMeta && targetCity && targetCity !== '전국') {
        const rawSpots = await fetchTourSpots({ region: targetCity, lang });
        const cityLower = targetCity.toLowerCase();
        const matchedCitySpots = rawSpots.filter(s => {
          const locStr = `${s.location || ''} ${s.title || ''} ${s.addr1 || ''}`.toLowerCase();
          return locStr.includes(cityLower);
        });
        const filteredSpots = matchedCitySpots.length >= 2 ? matchedCitySpots : rawSpots;
        spotsToRender = filteredSpots.slice(0, 5);
        agodaUrl = getAgodaHotelSearchUrl(targetCity);
        klookUrl = getKlookActivitySearchUrl(targetCity);
      }

      const voraResponse = {
        id: `vora-${Date.now()}`,
        sender: 'vora',
        text: aiBriefing?.aiRecommendationSummary || `안녕하세요! 여행 조력자 보라입니다. 😊`,
        timestamp: new Date().toLocaleTimeString(),
        targetCity,
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
          text: `안녕하세요! 여행 조력자 보라입니다. 😊 '${targetCity}' 추천 정보를 준비했습니다.`,
          timestamp: new Date().toLocaleTimeString(),
          targetCity,
          days
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
        padding: '0.85rem 1rem',
        borderRadius: '18px',
        border: '1px solid #cbd5e1',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} style={{ color: '#7e22ce' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
            🛠️ 선배님 전용 AI 쿼터 & 회원 등급 테스트 제어판:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          {/* Button 1: Toggle Dev Bypass */}
          <button
            onClick={() => toggleDevBypass()}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: '10px',
              fontSize: '0.75rem',
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
            {isDevBypass ? <Zap size={14} /> : <ShieldAlert size={14} />}
            {isDevBypass ? '무제한 모드 ON' : '유저 제한 모드'}
          </button>

          {/* Button 2: Virtual Recharge +5 */}
          <button
            onClick={handleRechargeExtra}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: '10px',
              fontSize: '0.75rem',
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
            <PlusCircle size={14} />
            +5회 즉시 충전 {extraRechargeCount > 0 && `(+${extraRechargeCount})`}
          </button>

          {/* Button 3: Virtual Google Login Toggle */}
          <button
            onClick={handleToggleVirtualGoogleLogin}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: '10px',
              fontSize: '0.75rem',
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
            <UserCheck size={14} />
            {isVirtualGoogleLogin ? '🔑 구글 로그인 상태 (15회)' : '🔒 비회원 상태 (5회)'}
          </button>

          {/* Button 4: Cycle Virtual Tier */}
          <button
            onClick={handleCycleVirtualTier}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: '10px',
              fontSize: '0.75rem',
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
            <Crown size={14} />
            가상 등급: <strong style={{ color: '#6b21a8' }}>{virtualTier.toUpperCase()}</strong> (클릭하여 전환)
          </button>
        </div>
      </div>

      {/* CHAT CONTAINER HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.85rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#9333ea', color: '#ffffff', borderRadius: '12px', display: 'flex' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Vora AI 1:1 대화형 여행 컨시어지
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              선(先) AI 답변 100% 노출 ➔ 후(後) 맞춤 숙소/티켓/가입 혜택 연결
            </span>
          </div>
        </div>

        {/* Realtime Quota Info Badge */}
        <div style={{
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: isDevBypass ? '#d1fae5' : '#dbeafe',
          color: isDevBypass ? '#065f46' : '#1e40af',
          border: isDevBypass ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          {isDevBypass ? (
            <>⚡ 선배님 무제한 패스 (UNLIMITED)</>
          ) : (
            <>🎟️ 오늘 남은 AI 티켓: <span style={{ color: '#b45309' }}>{Math.max(0, (virtualQuotaLimit + extraRechargeCount) - usedCount)}</span> / {virtualQuotaLimit + extraRechargeCount}회</>
          )}
        </div>
      </div>

      {/* CHAT MESSAGES STREAM CONTAINER */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '18px',
        padding: '1.25rem',
        minHeight: '380px',
        maxHeight: '520px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid #cbd5e1',
        marginBottom: '1rem'
      }}>
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.4rem'
            }}
          >
            {/* Sender Label & Timestamp */}
            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{msg.sender === 'user' ? '👤 선배님' : '🤖 Vora AI'}</span>
              <span>• {msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '85%',
              padding: '0.9rem 1.1rem',
              borderRadius: msg.sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'
            }}>
              {msg.text}

              {/* Guard Warning Highlight */}
              {msg.isGuardWarning && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', color: '#dc2626', fontSize: '0.78rem' }}>
                  💡 대한민국 관공서/관광 명소 및 미식 질문을 입력해 주시면 감사하겠습니다!
                </div>
              )}

              {/* Quota Exceeded Action Card */}
              {msg.isQuotaExceededNotice && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={handleRechargeExtra}
                    style={{ padding: '0.5rem 0.85rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'center' }}
                  >
                    🎬 15초 짧은 광고 시청하고 오늘 +3회 즉시 충전하기
                  </button>
                  <button
                    onClick={handleToggleVirtualGoogleLogin}
                    style={{ padding: '0.5rem 0.85rem', backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'center' }}
                  >
                    🔴 Google 3초 로그인하고 매일 15회로 확장하기
                  </button>
                </div>
              )}

              {/* Value-First Parsed Geo-Coordinates & Spot Cards */}
              {msg.spots && msg.spots.length > 0 && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    🗺️ {msg.targetCity} 정품 명소 및 지도 GPS 좌표 ({msg.spots.length}건):
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {msg.spots.map((spot, idx) => (
                      <div key={spot.id || idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{idx + 1}. {spot.title}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>📍 {spot.location || spot.addr1 || '중심가'}</span>
                        </div>
                        <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '0.68rem', color: '#2563eb' }}>
                          <div>lat: {spot.lat || spot.mapy || '37.5665'}</div>
                          <div>lng: {spot.lng || spot.mapx || '126.9780'}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Value-First Call To Action Affiliate Chips */}
                  {msg.agodaUrl && msg.klookUrl && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', pt: '0.4rem', marginTop: '0.4rem' }}>
                      <a href={msg.agodaUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.35rem 0.65rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', border: '1px solid #bfdbfe', textDecoration: 'none', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        🏨 아고다 {msg.targetCity} 할인 숙소 <ExternalLink size={12} />
                      </a>
                      <a href={msg.klookUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.35rem 0.65rem', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '8px', border: '1px solid #ffedd5', textDecoration: 'none', fontSize: '0.72rem', display: 'flex', items: 'center', gap: '0.2rem' }}>
                        🎟️ 클룩 {msg.targetCity} 액티비티 <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {msg.chips && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                {msg.chips.map((chipText, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendMessage(chipText)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
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
            gap: '0.6rem',
            padding: '0.8rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            color: '#7e22ce',
            fontSize: '0.82rem',
            fontWeight: 600,
            maxWidth: '85%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <RefreshCw size={16} className="animate-spin" style={{ color: '#9333ea' }} />
            <span>🔮 보라 AI가 구글 AI 분석 및 한국관광공사 DB를 0.4초 만에 추출하고 있습니다...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT FORM CONTAINER */}
      <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="어디로 떠나고 싶으신가요? (예: 수원 2박3일 맛집 코스, 여기서는 뭘 할 수 있지?)"
          style={{
            flex: 1,
            padding: '0.85rem 1rem',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            color: '#0f172a',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />

        {/* Mic STT Button */}
        <button
          onClick={handleStartVoiceSTT}
          style={{
            padding: '0 0.85rem',
            backgroundColor: isListening ? '#ef4444' : '#f1f5f9',
            color: isListening ? '#ffffff' : '#334155',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="음성 인식"
        >
          <Mic size={18} />
        </button>

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputPrompt.trim()}
          style={{
            padding: '0 1.25rem',
            background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: (isLoading || !inputPrompt.trim()) ? 0.5 : 1
          }}
        >
          <Send size={16} />
          <span>전송</span>
        </button>
      </div>

    </div>
  );
}
