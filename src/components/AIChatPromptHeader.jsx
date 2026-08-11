import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, ArrowRight, Camera, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * Natural language query parser to extract region, days, and clean keywords
 */
export function parseNaturalPrompt(text) {
  if (!text) return { region: '전국', days: 3, keyword: '', raw: '' };

  const raw = text.trim();
  let region = '전국';

  // Region & Major City Map (Includes 17 administrative regions & 50+ major cities, multilingual endonyms, and spoken suffixes)
  const regionMap = [
    { name: '서울', keys: ['서울', 'seoul', '강남', '홍대', '성수', '명동', '종로', '잠실', '이태원', '신촌', '여의도', '서울시', '서울 특별시', '首尔', '首爾', 'ソウル', 'Сеул'] },
    { name: '경기', keys: ['경기', 'gyeonggi', '수원', '용인', '성남', '분당', '파주', '가평', '고양', '일산', '부천', '안양', '화성', '동탄', '남양주', '평택', '의정부', '시흥', '김포', '안산', '광명', '행궁동', '화성행궁', '경기도', '京畿道', 'Кёнги'] },
    { name: '제주', keys: ['제주', 'jeju', '서귀포', '애월', '성산', '중문', '우도', '한라산', '제주도', '제주시', '서귀포시', '済州', '済州島', '济州', '济州岛', '濟州', '濟州島', 'Чеджу', 'jeju island'] },
    { name: '부산', keys: ['부산', 'busan', '해운대', '광안리', '서면', '영도', '기장', '태종대', '자갈치', '남포동', '부산시', '부산 광역시', '釜山', '海雲台', 'Пусан'] },
    { name: '인천', keys: ['인천', 'incheon', '송도', '영종도', '강화도', '차이나타운', '인천시', '인천 광역시', '仁川', 'Инчхон'] },
    { name: '강원', keys: ['강원', 'gangwon', '속초', '강릉', '춘천', '평창', '양양', '동해', '삼척', '원주', '설악산', '경포대', '정선', '홍천', '강원도', '강원 특별자치도', '江原道', 'カンウォン', 'Канвон'] },
    { name: '경북', keys: ['경북', 'gyeongbuk', '경주', '포항', '안동', '구미', '영주', '울릉도', '독도', '보문단지', '경주시', '경상북도', '慶州', '慶尚北道', 'Кёнбук', 'gyeongju'] },
    { name: '경남', keys: ['경남', 'gyeongnam', '창원', '거제', '통영', '남해', '진주', '양산', '외도', '통영시', '거제도', '경상남도', '慶尚南道', 'Кённам'] },
    { name: '전북', keys: ['전북', 'jeonbuk', '전주', '군산', '익산', '남원', '무주', '한옥마을', '전주시', '전라북도', '전북 특별자치도', '全州', '全羅北道', 'Чонбук', 'jeonju'] },
    { name: '전남', keys: ['전남', 'jeonnam', '여수', '순천', '목포', '담양', '보성', '향일암', '여수시', '전라남도', '麗水', '全羅南道', 'Чон남', 'yeosu'] },
    { name: '충북', keys: ['충북', 'chungbuk', '청주', '충주', '제천', '단양', '청남대', '단양군', '충청북도', '忠清北道', 'Чунбу크'] },
    { name: '충남', keys: ['충남', 'chungnam', '천안', '아산', '공주', '부여', '보령', '태안', '대천', '안면도', '충청남도', '忠清南道', 'Чуннам'] },
    { name: '대구', keys: ['대구', 'daegu', '동성로', '팔공산', '대구시', '대구 광역시', '大邱', 'Тэгу'] },
    { name: '대전', keys: ['대전', 'daejeon', '유성', '성심당', '대전시', '대전 광역시', '大田', 'Тэдж온'] },
    { name: '광주', keys: ['광주', 'gwangju', '무등산', '광주시', '광주 광역시', '光州', 'Кванджу'] },
    { name: '울산', keys: ['울산', 'ulsan', '간절곶', '태화강', '울산시', '울산 광역시', '蔚山', 'Ульсан'] },
    { name: '세종', keys: ['세종', 'sejong', '세종시', '세종 특별자치시', '世宗', 'Седжон'] }
  ];

  // Region & Major City Map (Find earliest appearing region in user's prompt text)
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

  // Phase 1: Extract clean keyword by removing common intent phrases, trip durations, weather fluff, and companion fillers
  let cleanKeyword = raw
    .replace(/[&+/?!,~-]/g, ' ')
    .replace(/(1박\s*2일|2박\s*3일|3박\s*4일|4박\s*5일|1박|2박|3박|4박|당일치기|당일|하루|일주일)/gi, ' ')
    .replace(/(가\s*볼\s*만\s*한\s*곳|가\s*볼\s*만\s*한|가\s*볼\s*곳|가\s*볼|만\s*한\s*곳|만\s*한|추\s*천\s*해\s*줘|추\s*천\s*코\s*스|추\s*천\s*맛\s*집|추\s*천|알\s*려\s*줘|보\s*여\s*줘|만\s*들\s*어\s*줘|가\s*고\s*싶\s*어|어\s*디\s*가\s*좋\s*아|어\s*디\s*가|어\s*디|여\s*행\s*코\s*스|여\s*행\s*지|관\s*광\s*지|관\s*광\s*명\s*소|핫\s*플\s*레\s*이\s*스|핫\s*플|명\s*소|동\s*선|플\s*랜|일\s*정|코\s*스|여\s*행|맛\s*집|카페|포\s*함|짜\s*줘|찾\s*아\s*줘|부\s*탁\s*해|친\s*구\s*랑|연\s*인\s*이\s*랑|가\s*족\s*이\s*랑|혼\s*자|데\s*이\s*트|인\s*스\s*타|실\s*내|야\s*외|감\s*성|바\s*다|오\s*션|뷰|유\s*명|인\s*기|비|오\s*는|날|박\s*물\s*관|미\s*술\s*관|산\s*책|힐\s*링)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Phase 2: Strip particle suffixes and conjunctions
  cleanKeyword = cleanKeyword
    .replace(/(에서|으로|로|에|의|가|는|은|을|를|좀|곳|및|과|와|하고|이랑|또는)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Phase 3: Only strip primary region names (e.g. "서울", "제주"), NEVER sub-cities ("성수동", "해운대")
  const primaryRegionNames = ['서울', '경기', '제주', '부산', '인천', '강원', '경북', '경남', '전북', '전남', '충북', '충남', '대구', '대전', '광주', '울산', '세종'];
  if (region !== '전국') {
    primaryRegionNames.forEach(rn => {
      if (cleanKeyword.includes(rn)) {
        cleanKeyword = cleanKeyword.replace(new RegExp(rn, 'g'), ' ').replace(/\s+/g, ' ').trim();
      }
    });
  }

  // Detect sub-city keyword sorted by EARLIEST appearance index in user's prompt text
  const subCities = [
    '성수동', '성수', '강남', '홍대', '명동', '이태원', '잠실', '종로', '익선동', '연남동', '압구정', '청담',
    '수원', '용인', '성남', '분당', '파주', '가평', '고양', '일산', '부천', '안양', '화성', '동탄', '남양주', '평택', '의정부', '시흥', '김포', '안산', '광명', '행궁동',
    '서귀포', '애월', '성산', '중문', '우도', '한라산',
    '해운대', '광안리', '서면', '영도', '기장', '태종대', '자갈치', '남포동',
    '송도', '영종도', '강화도', '차이나타운',
    '속초', '강릉', '춘천', '평창', '양양', '동해', '삼척', '원주', '설악산', '경포대', '정선', '홍천',
    '경주', '포항', '안동', '구미', '영주', '울릉도', '독도', '보문단지',
    '창원', '거제', '통영', '남해', '진주', '양산', '외도',
    '전주', '군산', '익산', '남원', '무주', '한옥마을',
    '여수', '순천', '목포', '담양', '보성', '향일암',
    '청주', '충주', '제천', '단양', '청남대',
    '천안', '아산', '공주', '부여', '보령', '태안', '대천', '안면도'
  ];

  const matchedSubCities = [];
  for (const city of subCities) {
    const idx = raw.toLowerCase().indexOf(city.toLowerCase());
    if (idx !== -1) {
      matchedSubCities.push({ city, idx });
    }
  }

  // Sort by appearance position in raw string
  matchedSubCities.sort((a, b) => a.idx - b.idx);

  let detectedSubCity = matchedSubCities.length > 0 ? matchedSubCities[0].city : '';

  // Priority for earliest detected sub-city over junk fragments or conjunctions
  if (detectedSubCity) {
    cleanKeyword = detectedSubCity;
  } else {
    // Phase 4: Final fragment check. If remaining keyword is a meaningless fragment or junk intent, clear to ""
    const junkFragments = ['가', '볼', '가볼', '곳', '만한', '에', '로', '좀', '추천', '가 볼', '가 볼 만한', '볼 만한', '포함', '코스', '여행', '및', '과', '와'];
    if (junkFragments.includes(cleanKeyword) || cleanKeyword.length <= 1 || /^[\s가볼곳만한에로좀추천포함코스여행및과와]+$/i.test(cleanKeyword)) {
      cleanKeyword = '';
    }
  }

  // Days detection
  let days = 3;
  if (raw.includes('1박') || raw.includes('하루') || raw.includes('당일') || raw.includes('1d') || raw.includes('1-day')) days = 1;
  else if (raw.includes('2박') || raw.includes('1박 2일') || raw.includes('1박2일') || raw.includes('2d') || raw.includes('2-day')) days = 2;
  else if (raw.includes('3박') || raw.includes('2박 3일') || raw.includes('2박3일') || raw.includes('3d') || raw.includes('3-day')) days = 3;
  else if (raw.includes('4박') || raw.includes('3박 4일') || raw.includes('3박4일') || raw.includes('4d') || raw.includes('4-day')) days = 4;

  // Multi-clause intent detection (Rainy mode, Night/Hotel area intent)
  const rainyModeIntent = /(비\s*오|비오|실내|우천|비가)/i.test(raw);
  let nightKeywordIntent = '';
  if (/(저녁|밤|야간|숙소|호텔)/i.test(raw)) {
    const nightAreas = ['명동', '해운대', '광안리', '홍대', '성수', '서귀포', '이태원', '강남', '종로', '송도', '속초', '여수', '경주', '전주'];
    for (const area of nightAreas) {
      if (raw.includes(area)) {
        nightKeywordIntent = area;
        break;
      }
    }
  }

  return {
    region,
    days,
    keyword: cleanKeyword,
    raw,
    rainyMode: rainyModeIntent,
    nightKeyword: nightKeywordIntent
  };
}

export default function AIChatPromptHeader({ lang = 'ko', filters, onGenerateItinerary }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerBottom, setHeaderBottom] = useState(132);
  const recognitionRef = useRef(null);

  // Sync promptText ONLY when filters.keyword is explicitly reset to empty string
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
    const updateHeaderBottom = () => {
      const headerEl = document.querySelector('header') || document.querySelector('.app-header');
      if (headerEl) {
        const rect = headerEl.getBoundingClientRect();
        setHeaderBottom(rect.bottom);
      }
    };
    updateHeaderBottom();

    const handleScrollOrResize = () => {
      updateHeaderBottom();
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const speechLangMap = {
        ko: 'ko-KR',
        en: 'en-US',
        ja: 'ja-JP',
        zh: 'zh-CN',
        zht: 'zh-TW',
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        ru: 'ru-RU'
      };
      recognition.lang = speechLangMap[lang] || 'ko-KR';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
        setIsListening(false);
        if (onGenerateItinerary && transcript.trim()) {
          onGenerateItinerary(parseNaturalPrompt(transcript));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
    }
  }, [lang, onGenerateItinerary]);

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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    if (onGenerateItinerary) {
      onGenerateItinerary(parseNaturalPrompt(promptText));
    }
  };

  const handleChipClick = (sampleText) => {
    setPromptText(sampleText);
    if (onGenerateItinerary) {
      onGenerateItinerary(parseNaturalPrompt(sampleText));
    }
  };

  const sampleChips = [
    { label: t.chipSeongsu || '🗼 서울 성수동 핫플 1박2일', text: '친구랑 서울 성수동 카페 & 맛집 포함 1박 2일 코스' },
    { label: t.chipJeju || '🏝️ 제주 감성 데이트 2박3일', text: '비 오는 날 제주도 실내 박물관 & 감성 데이트 2박 3일' },
    { label: t.chipBusan || '🌊 부산 해운대 바다뷰 2박3일', text: '부산 해운대 바다 뷰 카페 및 유명 맛집 2박 3일' }
  ];

  return (
    <>
      {/* Sticky Floating Slim Mini AI Search Bar on Scroll (Option 1: Perplexity/Airbnb style) */}
      {isScrolled && (
        <div style={{
          position: 'fixed',
          top: `${Math.max(headerBottom + 12, isMobile ? 96 : 132)}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '95%' : '92%',
          maxWidth: '680px',
          zIndex: 9999,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <form onSubmit={handleSubmit} style={{ margin: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: isListening ? '2px solid #ef4444' : '1.5px solid #2563eb',
              borderRadius: '9999px',
              padding: '0.35rem 0.4rem 0.35rem 1rem',
              boxShadow: '0 12px 35px rgba(37, 99, 235, 0.28)'
            }}>
              <Sparkles style={{ width: '18px', height: '18px', color: '#2563eb', flexShrink: 0, marginRight: '0.4rem' }} />

              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={isListening ? (t.voiceListening || '말씀하세요... 🎧 (음성 인식 중)') : (t.aiPromptPlaceholder || '어디로 떠나고 싶으신가요? 💬')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.45rem 0'
                }}
              />

              {promptText && promptText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPromptText('')}
                  title="검색어 지우기 ✕"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f1f5f9',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginRight: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              )}

              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  title={t.voiceBtnTooltip || '음성 인식 시작 🎙️'}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: isListening ? '#ef4444' : '#f1f5f9',
                    color: isListening ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginRight: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isListening ? <MicOff style={{ width: '16px', height: '16px' }} /> : <Mic style={{ width: '16px', height: '16px' }} />}
                </button>
              )}

              <button
                type="submit"
                title={t.aiCourseBtn || 'AI 코스 생성'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Top Hero Card (Slimmed Vertical Height) */}
      <div style={{
        width: '100%',
        marginBottom: isMobile ? '0.5rem' : '0.85rem',
        borderRadius: isMobile ? '14px' : '20px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: isMobile ? '0.65rem 0.75rem' : '0.95rem 1.25rem',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
        color: '#0f172a',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Title Header (Slim & Compact with 1-Line Fixed Subtitle Badge) */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '0.5rem' : '0.75rem' }}>
          <p style={{
            fontSize: isMobile ? '0.68rem' : '0.84rem',
            fontWeight: 700,
            color: '#0284c7',
            background: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: isMobile ? '0.2rem 0.55rem' : '0.25rem 0.75rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            margin: isMobile ? '0.1rem 0 0.35rem 0' : '0.15rem 0 0.45rem 0',
            boxShadow: '0 2px 6px rgba(56, 189, 248, 0.1)',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <Sparkles size={isMobile ? 12 : 14} color="#0284c7" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {t.subtitle || '✨ AI가 안내하는 실시간 날씨 · 맞춤 명소 · 맛집 & 코디'}
            </span>
          </p>

          <h1 style={{
            fontSize: isMobile ? '1.2rem' : '1.6rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            {t.heroTitle || '어디로 떠나시나요? 🚀'}
          </h1>
        </div>

        {/* Mobile-Optimized Sleek Pill Search Bar */}
        <form onSubmit={handleSubmit} style={{
          maxWidth: '680px',
          margin: isMobile ? '0 auto 0.45rem auto' : '0 auto 0.65rem auto',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: isListening ? '2px solid #ef4444' : '1.5px solid #2563eb',
            borderRadius: '9999px',
            padding: isMobile ? '0.25rem 0.3rem 0.25rem 0.75rem' : '0.35rem 0.4rem 0.35rem 1rem',
            boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.25)' : '0 6px 20px rgba(37, 99, 235, 0.1)',
            transition: 'all 0.2s ease'
          }}>
            <Sparkles style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px', color: '#2563eb', flexShrink: 0, marginRight: '0.35rem' }} />

            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={isListening ? (t.voiceListening || '말씀하세요... 🎧 (음성 인식 중)') : (t.aiPromptPlaceholder || '어디로 떠나고 싶으신가요? 💬')}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0f172a',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
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
                  width: isMobile ? '30px' : '34px',
                  height: isMobile ? '30px' : '34px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginRight: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <X style={{ width: isMobile ? '13px' : '15px', height: isMobile ? '13px' : '15px' }} />
              </button>
            )}

            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={t.voiceBtnTooltip || '음성 인식 시작 🎙️'}
                style={{
                  width: isMobile ? '32px' : '38px',
                  height: isMobile ? '32px' : '38px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isListening ? '#ef4444' : '#f1f5f9',
                  color: isListening ? '#ffffff' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginRight: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {isListening ? <MicOff style={{ width: isMobile ? '14px' : '18px', height: isMobile ? '14px' : '18px' }} /> : <Mic style={{ width: isMobile ? '14px' : '18px', height: isMobile ? '14px' : '18px' }} />}
              </button>
            )}

            <button
              type="submit"
              title={t.aiCourseBtn || 'AI 코스 생성'}
              style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                borderRadius: '9999px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowRight style={{ width: isMobile ? '14px' : '18px', height: isMobile ? '14px' : '18px' }} />
            </button>
          </div>
        </form>

        {/* Chips */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '0.3rem' : '0.4rem'
        }}>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.text)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                fontWeight: 600,
                padding: isMobile ? '0.25rem 0.6rem' : '0.4rem 0.85rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {chip.label}
            </button>
          ))}

          <a
            href="https://www.instagram.com/explore/tags/%EC%84%B1%EC%88%98%EB%8F%99%ED%95%AB%ED%94%8C/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fdf2f8',
              border: '1px solid #fbcfe8',
              color: '#db2777',
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              fontWeight: 700,
              padding: isMobile ? '0.25rem 0.6rem' : '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Camera style={{ width: isMobile ? '12px' : '13px', height: isMobile ? '12px' : '13px' }} />
            <span>{t.instaHashtagLabel || '📸 인스타 핫플 ↗'}</span>
          </a>
        </div>
      </div>
    </>
  );
}
