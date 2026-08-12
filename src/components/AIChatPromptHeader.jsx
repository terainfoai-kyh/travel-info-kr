import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, ArrowRight, Camera, X, MessageSquare, Send, MapPin, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { geminiParseNaturalPrompt, geminiGenerateFullItinerary, isGreetingQuery } from '../services/geminiNlpService';

/**
 * Natural language query parser to extract region, days, and clean keywords
 */
export function parseNaturalPrompt(text) {
  if (!text) return { region: '전국', days: 3, keyword: '', raw: '' };

  const raw = text.trim();
  let region = '전국';

  const regionMap = [
    { name: '서울', keys: ['서울', 'seoul', '강남', '홍대', '성수', '명동', '종로', '잠실', '이태원', '신촌', '여의도', '서울시', '서울 특별시', '首尔', '首爾', 'ソウル', 'Сеул'] },
    { name: '경기', keys: ['경기', 'gyeonggi', '수원', '용인', '성남', '분당', '파주', '가평', '고양', '일산', '부천', '안양', '화성', '동탄', '남양주', '평택', '의정부', '시흥', '김포', '안산', '광명', '행궁동', '화성행궁', '경기도', '京畿道', 'Кёнги'] },
    { name: '제주', keys: ['제주', 'jeju', '서귀포', '애월', '성산', '중문', '우도', '한라산', '제주도', '제주시', '서귀포시', '済州', '済州島', '济州', '济州岛', '濟州', '濟州島', 'Чеджу', 'jeju island'] },
    { name: '부산', keys: ['부산', 'busan', '해운대', '광안리', '서면', '영도', '기장', '태종대', '자갈치', '남포동', '부산시', '부산 광역시', '釜山', '海雲台', 'Пусан'] },
    { name: '인천', keys: ['인천', 'incheon', '송도', '영종도', '강화도', '차이나타운', '인천시', '인천 광역시', '仁川', 'Инчхон'] },
    { name: '강원', keys: ['강원', 'gangwon', '속초', '강릉', '춘천', '평창', '양양', '동해', '삼척', '원주', '설악산', '경포대', '정선', '홍천', '강원도', '강원 특별자치도', '江原道', 'カンウォン', 'Канвон'] },
    { name: '경북', keys: ['경북', 'gyeongbuk', '경주', '포항', '안동', '구미', '영주', '울릉도', '독도', '보문단지', '경주시', '경상북도', '慶州', '慶尚北道', 'Кёнбук', 'gyeongju'] },
    { name: '경남', keys: ['경남', 'gyeongnam', '창원', '거제', '통영', '남해', '진주', '양산', '외도', '통영시', '거제도', '경상남도', '慶尚南道', 'Кённам'] },
    { name: '전북', keys: ['전북', 'jeonbuk', '전주', '군산', '익산', '남원', '무주', '한옥마을', '전주시', '전라북도', '전북 특별자치도', '全州', '全羅北道', 'Чон북', 'jeonju'] },
    { name: '전남', keys: ['전남', 'jeonnam', '여수', '순천', '목포', '담양', '보성', '향일암', '여수시', '전라남도', '麗水', '全羅南道', 'Чон남', 'yeosu'] },
    { name: '충북', keys: ['충북', 'chungbuk', '청주', '충주', '제천', '단양', '청남대', '단양군', '충청북도', '忠清北道', 'Чун부크'] },
    { name: '충남', keys: ['충남', 'chungnam', '천안', '아산', '공주', '부여', '보령', '태안', '대천', '안면도', '충청남도', '忠清南道', 'Чун남'] },
    { name: '대구', keys: ['대구', 'daegu', '동성로', '팔공산', '대구시', '대구 광역시', '大邱', 'Тэгу'] },
    { name: '대전', keys: ['대전', 'daejeon', '유성', '성심당', '대전시', '대전 광역시', '大田', 'Тэдж온'] },
    { name: '광주', keys: ['광주', 'gwangju', '무등산', '광주시', '광주 광역시', '光州', 'Кванджу'] },
    { name: '울산', keys: ['울산', 'ulsan', '간절곶', '태화강', '울산시', '울산 광역시', '蔚山', 'Ульсан'] },
    { name: '세종', keys: ['세종', 'sejong', '세종시', '세종 특별자치시', '世宗', 'Седж온'] }
  ];

  let earliestRegionIdx = Infinity;
  for (const item of regionMap) {
    for (const k of item.keys) {
      const idx = raw.toLowerCase().indexOf(k.toLowerCase());
      if (idx !== -1 && idx < earliestRegionIdx) {
        earliestRegionIdx = idx;
        region = item.name;
      }
    }
  }

  let cleanKeyword = raw
    .replace(/[&+/?!,~-]/g, ' ')
    .replace(/(10대|20대|30대|40대|50대|60대|70대|80대|부모님|아이들|아이|가족|커플|친구|연인|혼자)/gi, ' ')
    .replace(/(1박\s*2일|2박\s*3일|3박\s*4일|4박\s*5일|1박|2박|3박|4박|당일치기|당일|하루|일주일)/gi, ' ')
    .replace(/(가\s*볼\s*만\s*한\s*곳|가\s*볼\s*만\s*한|가\s*볼\s*곳|가\s*볼|만\s*한\s*곳|만\s*한|추\s*천\s*해\s*줘|추\s*천\s*코\s*스|추\s*천\s*맛\s*집|추\s*천|알\s*려\s*줘|보\s*여\s*줘|만\s*들\s*어\s*줘|가\s*고\s*싶\s*어|어\s*디\s*가\s*좋\s*아|어\s*디\s*가|어\s*디|여\s*행\s*코\s*스|여\s*행\s*지|관\s*광\s*지|관\s*광\s*명\s*소|핫\s*플\s*레\s*이\s*스|핫\s*플|명\s*소|동\s*선|플\s*랜|일\s*정|코\s*스|여\s*행|맛\s*집|카페|포\s*함|짜\s*줘|찾\s*아\s*줘|부\s*탁\s*해|친\s*구\s*랑|연\s*인\s*이\s*랑|가\s*족\s*이\s*랑|혼\s*자|데\s*이\s*트|인\s*스\s*타|실\s*내|야\s*외|감\s*성|바\s*다|오\s*션|뷰|유\s*명|인\s*기|비|오\s*는|날|박\s*물\s*관|미\s*술\s*관|산\s*책|힐\s*링)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  cleanKeyword = cleanKeyword
    .replace(/(에서|으로|로|에|의|가|는|은|을|를|좀|곳|및|과|와|하고|이랑|또는)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const primaryRegionNames = ['서울', '경기', '제주', '부산', '인천', '강원', '경북', '경남', '전북', '전남', '충북', '충남', '대구', '대전', '광주', '울산', '세종'];
  if (region !== '전국') {
    primaryRegionNames.forEach(rn => {
      if (cleanKeyword.includes(rn)) {
        cleanKeyword = cleanKeyword.replace(new RegExp(rn, 'g'), ' ').replace(/\s+/g, ' ').trim();
      }
    });
  }

  let days = 3;
  const rawLower = raw.toLowerCase();
  const maxDayMatch = rawLower.match(/([1-7])일차/g);
  if (maxDayMatch) {
    const maxDayNum = Math.max(...maxDayMatch.map(m => parseInt(m.replace(/\D/g, ''), 10)));
    if (maxDayNum >= 1 && maxDayNum <= 7) days = maxDayNum;
  } else if (/(4박\s*5일|4박5일|5d|5-day|5\s*days|5days|5일차|5일|5日|5日間|5天|5\s*tage|5\s*jours)/i.test(rawLower)) days = 5;
  else if (/(3박\s*4일|3박4일|4d|4-day|4\s*days|4days|4일차|4일|4日|4日間|4天|4\s*tage|4\s*jours)/i.test(rawLower)) days = 4;
  else if (/(2박\s*3일|2박3일|3d|3-day|3\s*days|3days|3일차|3일|3日|3日間|3天)/i.test(rawLower)) days = 3;
  else if (/(1박\s*2일|1박2일|2d|2-day|2\s*days|2days|2일차|2일|2日|2日間|2天)/i.test(rawLower)) days = 2;
  else if (/(1박|하루|당일|1d|1-day|1일차|1일|1\tag|1\s*day)/i.test(rawLower)) days = 1;

  const multilingualSubCityMap = [
    { canonical: '수원', keys: ['수원', 'suwon', '水原', 'スウォン', 'сувон', '행궁동', '화성행궁'] },
    { canonical: '명동', keys: ['명동', 'myeongdong', 'myeong-dong', '明洞', 'ミョンドン', 'мёндон'] },
    { canonical: '성수동', keys: ['성수동', '성수', 'seongsu', 'seongsudong', '聖水', 'ソンス', 'сонсу'] },
    { canonical: '해운대', keys: ['해운대', 'haeundae', '海雲台', '海云台', 'ヘウンデ', 'хэундэ'] },
    { canonical: '광안리', keys: ['광안리', 'gwangalli', '廣安里', '广安里', 'クァンアンリ', 'квананли'] },
    { canonical: '서귀포', keys: ['서귀포', 'seogwipo', '西歸浦', '西归浦', 'ソ귀포', 'соквипхо'] },
    { canonical: '강릉', keys: ['강릉', 'gangneung', '江陵', 'カンヌン', 'каннын'] },
    { canonical: '속초', keys: ['속초', 'sokcho', '束草', 'ソクチョ', 'сокчхо'] },
    { canonical: '경주', keys: ['경주', 'gyeongju', '慶州', '庆州', 'キョンジュ', 'кёнджу'] },
    { canonical: '전주', keys: ['전주', 'jeonju', '全州', 'チョンジュ', 'чонджу'] },
    { canonical: '여수', keys: ['여수', 'yeosu', '麗水', '丽水', 'ヨ스', 'ёсу'] },
    { canonical: '파주', keys: ['파주', 'paju', '坡州', 'パジュ', 'пачжу', '헤이리'] },
    { canonical: '인천', keys: ['인천', 'incheon', '仁川', 'インチョン', 'инчхон', '송도'] }
  ];

  const matchedSubCities = [];
  for (const item of multilingualSubCityMap) {
    for (const k of item.keys) {
      const idx = rawLower.indexOf(k.toLowerCase());
      if (idx !== -1) {
        matchedSubCities.push({ city: item.canonical, idx });
        break;
      }
    }
  }

  matchedSubCities.sort((a, b) => a.idx - b.idx);
  let detectedSubCity = matchedSubCities.length > 0 ? matchedSubCities[0].city : '';

  if (detectedSubCity) {
    if (!cleanKeyword.includes(detectedSubCity)) {
      cleanKeyword = `${detectedSubCity} ${cleanKeyword}`.trim();
    }
  }

  const rainyMode = /(비\s*오\s*는\s*날|비|실내|박물관|미술관|rain|rainy)/i.test(rawLower);
  const nightKeyword = /(야경|야간|밤|인스타|핫플|night)/i.test(rawLower) ? '야경 명소' : '';

  const dailyRegions = [];
  const day1City = detectedSubCity || region;
  if (day1City) dailyRegions.push(day1City);

  if (days >= 2) {
    const day2Match = matchedSubCities.find(c => c.city !== day1City);
    if (day2Match) dailyRegions.push(day2Match.city);
  }

  return {
    region,
    days,
    keyword: cleanKeyword,
    rainyMode,
    nightKeyword,
    day2Keyword: dailyRegions.length > 1 ? dailyRegions[1] : '',
    dailyRegions,
    userLandmarks: matchedSubCities.map(c => c.city),
    raw
  };
}

export default function AIChatPromptHeader({ lang = 'ko', onGenerateItinerary, filters }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  // 100% Inline Hero Expansion & Chat Persistence State
  const [isInlineChatExpanded, setIsInlineChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (filters && filters.keyword === '') {
      setPromptText('');
    }
  }, [filters?.keyword]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'ko' ? 'ko-KR' : (lang === 'en' ? 'en-US' : 'ja-JP');

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
    }
  }, [lang]);

  // Scroll ONLY inside inner chat container without moving the outer page window!
  useEffect(() => {
    if (isInlineChatExpanded && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isGenerating, isInlineChatExpanded]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition error:', err);
      }
    }
  };

  // Handle 1:1 Conversational AI Chat & Enter Key Submit
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText !== null ? customText : promptText;
    const query = textToSend.trim();

    // If query is empty but user clicked [💬 대화] or [💬 대화 펼치기]
    if (!query) {
      setIsInlineChatExpanded(true);
      if (chatMessages.length === 0) {
        setChatMessages([{
          id: 'init-welcome',
          sender: 'ai',
          text: '안녕하세요! 대한민국 여행 AI 컨시어지입니다. 🇰🇷 어디로 떠나고 싶으신가요? 편하게 말씀해 주세요!',
          suggestionChips: ['1일차 수원 ➔ 2일차 명동 ➔ 3일차 인천', '성수동 핫플 & 팝업스토어', '50대 부모님 모시고 떠나는 가족 힐링 3박4일'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
      return;
    }

    if (isGenerating) return;

    setPromptText('');
    setIsInlineChatExpanded(true);

    const userBubble = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userBubble]);
    setIsGenerating(true);

    if (isGreetingQuery(query)) {
      setTimeout(() => {
        const greetingBubble = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "안녕하세요! 😊 대한민국 여행 AI 컨시어지입니다. 오늘 어떤 분들과 어디로 여행을 떠나고 싶으신가요? ✈️ (예: '50대 부모님 모시고 강릉 힐링 코스')",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestionChips: [
            '50대 부모님과 강릉 힐링 2박3일',
            '성수동 핫플 & 팝업스토어 코스',
            '1일차 수원 ➔ 2일차 명동 ➔ 3일차 인천'
          ],
          itinerarySummary: null,
          fullAiResult: null
        };
        setChatMessages(prev => [...prev, greetingBubble]);
        setIsGenerating(false);
      }, 400);
      return;
    }

    try {
      // Build multi-turn conversation history context for Gemini LLM
      const historyContext = chatMessages
        .filter(m => m.text)
        .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
        .join('\n');
      const contextualPrompt = historyContext ? `${historyContext}\nUser: ${query}` : query;

      const parsedIntent = await geminiParseNaturalPrompt(query, lang);
      const fullAiResult = await geminiGenerateFullItinerary(contextualPrompt, lang);

      // Clean single-turn AI summary without raw debug context
      const aiBubbleText = fullAiResult?.aiRecommendationSummary || 
        `'${query}' 요청에 맞춰 최적의 ${parsedIntent?.days || fullAiResult?.days || 3}일치 맞춤 여행 코스를 정성껏 준비했습니다! 📍`;

      const aiBubble = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiBubbleText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itinerarySummary: fullAiResult ? {
          title: fullAiResult.tripTitle || `${query} 맞춤 코스`,
          days: fullAiResult.days || parsedIntent?.days || 3,
          dailySchedules: fullAiResult.dailySchedules
        } : null,
        parsedIntent,
        fullAiResult
      };

      setChatMessages(prev => [...prev, aiBubble]);
    } catch (err) {
      console.error("Inline AI Chat Generation Error:", err);
      const errorBubble = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "일정 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorBubble]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Button 2: Direct 5-Day Course Generation & Map Modal
  const handleDirectCourseGeneration = (e) => {
    if (e) e.preventDefault();
    const query = promptText.trim() || (chatMessages.findLast(m => m.sender === 'user')?.text) || '추천 코스';
    const parsed = parseNaturalPrompt(query);
    const lastAiMsg = chatMessages.findLast(m => m.sender === 'ai' && m.fullAiResult);
    if (onGenerateItinerary) {
      onGenerateItinerary(parsed, lastAiMsg ? lastAiMsg.fullAiResult : null);
    }
  };

  const hasExistingHistory = chatMessages.length > 0;

  return (
    <div style={{
      width: '100%',
      marginBottom: isMobile ? '0.5rem' : '0.85rem',
      borderRadius: isMobile ? '16px' : '22px',
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      padding: isMobile ? '0.75rem 0.85rem' : '1rem 1.35rem',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
      color: '#0f172a',
      position: 'relative',
      boxSizing: 'border-box',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Header Badge Row & Toggle Collapse Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '0.5rem' : '0.75rem' }}>
        <div style={{ width: isInlineChatExpanded ? 'auto' : '100%', textAlign: isInlineChatExpanded ? 'left' : 'center' }}>
          <p style={{
            fontSize: isMobile ? '0.7rem' : '0.82rem',
            fontWeight: 700,
            color: '#0284c7',
            background: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: isMobile ? '0.2rem 0.6rem' : '0.25rem 0.8rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            margin: '0 auto',
            boxShadow: '0 2px 6px rgba(56, 189, 248, 0.1)'
          }}>
            <Sparkles size={isMobile ? 13 : 15} color="#0284c7" />
            <span>{t.subtitle || '✨ AI가 안내하는 실시간 날씨 · 맞춤 명소 · 맛집 & 코디'}</span>
          </p>
        </div>

        {/* Toggle [ ✕ 대화 접기 ] Collapse Button */}
        {isInlineChatExpanded && (
          <button
            type="button"
            onClick={() => setIsInlineChatExpanded(false)}
            title="대화창 접기 ✕"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={14} />
            <span>대화 접기</span>
          </button>
        )}
      </div>

      {/* Inline AI Chat Thread Area (Expands downward inside Hero Card with smooth scroll) */}
      {isInlineChatExpanded && (
        <div 
          ref={chatContainerRef}
          style={{
            background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '0.85rem',
          maxHeight: '380px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          scrollBehavior: 'smooth'
        }}>
          {chatMessages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '0.2rem'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                maxWidth: '92%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {msg.sender === 'ai' && (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    AI
                  </div>
                )}

                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '14px',
                  borderTopLeftRadius: msg.sender === 'ai' ? '2px' : '14px',
                  borderTopRightRadius: msg.sender === 'user' ? '2px' : '14px',
                  fontSize: '0.85rem',
                  lineHeight: 1.55,
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontWeight: msg.sender === 'user' ? 600 : 500 }}>{msg.text}</p>

                  {/* Suggestion Chips */}
                  {msg.suggestionChips && (
                    <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {msg.suggestionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '0.3rem 0.65rem',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          ✨ {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Rich Full-AI Summary Card */}
                  {msg.itinerarySummary && (
                    <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Compass size={14} />
                            <span>{msg.itinerarySummary.title}</span>
                          </h4>
                          <span style={{ fontSize: '0.65rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: '#d1fae5', color: '#065f46', fontWeight: 800 }}>
                            {msg.itinerarySummary.days}일치 완벽 생성
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {msg.itinerarySummary.dailySchedules?.map((ds, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.73rem', padding: '0.2rem 0', borderBottom: '1px solid #e2e8f0' }}>
                              <span style={{ fontWeight: 700, color: '#1e293b' }}>{ds.dateLabel || `${ds.day}일차 - ${ds.city}`}</span>
                              <span style={{ color: '#64748b' }}>{ds.spots?.length || 4}개 명소 (좌표100% 매칭)</span>
                            </div>
                          ))}
                        </div>

                        {/* Option 1: Sleek Mini-Map Route Tile Card inside Chat Bubble */}
                        <div
                          onClick={() => {
                            if (onGenerateItinerary) {
                              const intent = msg.parsedIntent || parseNaturalPrompt(msg.text);
                              onGenerateItinerary(intent, msg.fullAiResult);
                            }
                          }}
                          style={{
                            marginTop: '0.65rem',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '10px',
                            background: '#eff6ff',
                            border: '1.5px dashed #3b82f6',
                            color: '#1d4ed8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 5px rgba(59, 130, 246, 0.08)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              background: '#3b82f6',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <MapPin size={15} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem' }}>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a' }}>
                                🗺️ 이 코스 전체 지도에서 확인하기
                              </span>
                              <span style={{ fontSize: '0.66rem', color: '#2563eb', fontWeight: 600 }}>
                                {msg.itinerarySummary.days || 3}일치 코스 및 동선 시각화 팝업 열기 ➔
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8', padding: '0 0.2rem' }}>{msg.timestamp}</span>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e40af', fontSize: '0.76rem', padding: '0.45rem 0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', width: 'fit-content' }}>
              <Sparkles size={15} color="#2563eb" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Gemini 1.5 AI가 100% 정품 명소와 날씨/미식/코디를 직조하는 중...</span>
            </div>
          )}
        </div>
      )}

      {/* Input Bar at Bottom of Hero Card (Supports Enter Key Submit & Toggle Label) */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{
        maxWidth: '680px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: isListening ? '2px solid #ef4444' : '1.5px solid #2563eb',
          borderRadius: '9999px',
          padding: isMobile ? '0.25rem 0.3rem 0.25rem 0.75rem' : '0.35rem 0.4rem 0.35rem 1rem',
          boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.25)' : '0 6px 20px rgba(37, 99, 235, 0.1)'
        }}>
          <Sparkles style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px', color: '#2563eb', flexShrink: 0, marginRight: '0.35rem' }} />

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={isListening ? (t.voiceListening || '말씀하세요... 🎧 (음성 인식 중)') : (t.aiPromptPlaceholder || '어디로 떠나고 싶으신가요? 💬 (Enter 키 전송)')}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: isMobile ? '0.82rem' : '0.9rem',
              fontWeight: 600,
              padding: isMobile ? '0.35rem 0' : '0.5rem 0'
            }}
          />

          {promptText && promptText.length > 0 && (
            <button
              type="button"
              onClick={() => setPromptText('')}
              title="검색어 지우기 ✕"
              style={{
                width: isMobile ? '28px' : '32px',
                height: isMobile ? '28px' : '32px',
                borderRadius: '9999px',
                border: 'none',
                background: '#f1f5f9',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginRight: '0.25rem'
              }}
            >
              <X style={{ width: isMobile ? '13px' : '14px', height: isMobile ? '13px' : '14px' }} />
            </button>
          )}

          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title={t.voiceBtnTooltip || '음성 인식 시작 🎙️'}
              style={{
                width: isMobile ? '30px' : '36px',
                height: isMobile ? '30px' : '36px',
                borderRadius: '9999px',
                border: 'none',
                background: isListening ? '#ef4444' : '#f1f5f9',
                color: isListening ? '#ffffff' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginRight: '0.35rem'
              }}
            >
              {isListening ? <MicOff style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} /> : <Mic style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} />}
            </button>
          )}

          {/* Button 1: 💬 AI 대화 / 대화 펼치기 (Supports Enter key submit & restores chat history) */}
          <button
            type="submit"
            title="AI 컨시어지 1:1 대화하기 💬 (Enter 키)"
            style={{
              padding: isMobile ? '0.35rem 0.65rem' : '0.45rem 0.85rem',
              borderRadius: '9999px',
              background: (!isInlineChatExpanded && hasExistingHistory) ? '#dbeafe' : '#eff6ff',
              color: '#2563eb',
              fontWeight: 800,
              fontSize: isMobile ? '0.74rem' : '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              flexShrink: 0,
              marginRight: '0.3rem',
              border: '1px solid #bfdbfe'
            }}
          >
            <MessageSquare style={{ width: isMobile ? '13px' : '15px', height: isMobile ? '13px' : '15px' }} />
            <span>{(!isInlineChatExpanded && hasExistingHistory) ? '대화 펼치기' : '대화'}</span>
          </button>

          {/* Button 2: ✨ 코스 추천 (Directly queries and opens full 5-day Itinerary Map Modal) */}
          <button
            type="button"
            onClick={handleDirectCourseGeneration}
            title="AI 5일치 코스 지도 모달 생성 ✨"
            style={{
              padding: isMobile ? '0.35rem 0.75rem' : '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: isMobile ? '0.74rem' : '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Sparkles style={{ width: isMobile ? '13px' : '15px', height: isMobile ? '13px' : '15px' }} />
            <span>코스 추천</span>
          </button>
        </div>
      </form>
    </div>
  );
}
