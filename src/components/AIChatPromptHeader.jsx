import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, ArrowRight, Camera } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * Natural language query parser to extract region, days, and clean keywords
 */
export function parseNaturalPrompt(text) {
  if (!text) return { region: '전국', days: 3, keyword: '', raw: '' };

  const raw = text.trim();
  let region = '전국';

  // Region & Major City Map (Includes 17 administrative regions & major cities)
  const regionMap = [
    { name: '서울', keys: ['서울', 'seoul', '강남', '홍대', '성수', '명동', '종로', '잠실', '이태원', '신촌', '여의도'] },
    { name: '경기', keys: ['경기', 'gyeonggi', '수원', '용인', '성남', '분당', '파주', '가평', '고양', '일산', '부천', '안양', '화성', '동탄', '남양주', '평택', '의정부', '시흥', '김포', '안산', '광명', '행궁동', '화성행궁'] },
    { name: '제주', keys: ['제주', 'jeju', '서귀포', '애월', '성산', '중문', '우도', '한라산'] },
    { name: '부산', keys: ['부산', 'busan', '해운대', '광안리', '서면', '영도', '기장', '태종대', '자갈치'] },
    { name: '인천', keys: ['인천', 'incheon', '송도', '영종도', '강화도', '차이나타운'] },
    { name: '강원', keys: ['강원', 'gangwon', '속초', '강릉', '춘천', '평창', '양양', '동해', '삼척', '원주', '설악산', '경포대'] },
    { name: '경북', keys: ['경북', 'gyeongbuk', '경주', '포항', '안동', '구미', '영주', '울릉도', '독도', '보문단지'] },
    { name: '경남', keys: ['경남', 'gyeongnam', '창원', '거제', '통영', '남해', '진주', '양산', '외도'] },
    { name: '전북', keys: ['전북', 'jeonbuk', '전주', '군산', '익산', '남원', '무주', '한옥마을'] },
    { name: '전남', keys: ['전남', 'jeonnam', '여수', '순천', '목포', '담양', '보성', '향일암'] },
    { name: '충북', keys: ['충북', 'chungbuk', '청주', '충주', '제천', '단양', '청남대'] },
    { name: '충남', keys: ['충남', 'chungnam', '천안', '아산', '공주', '부여', '보령', '태안', '대천'] },
    { name: '대구', keys: ['대구', 'daegu', '동성로', '팔공산'] },
    { name: '대전', keys: ['대전', 'daejeon', '유성', '성심당'] },
    { name: '광주', keys: ['광주', 'gwangju', '무등산'] },
    { name: '울산', keys: ['울산', 'ulsan', '간절곶', '태화강'] },
    { name: '세종', keys: ['세종', 'sejong'] }
  ];

  for (const item of regionMap) {
    if (item.keys.some(k => raw.toLowerCase().includes(k))) {
      region = item.name;
      break;
    }
  }

  // Extract clean keyword by removing common prompt stopwords
  let cleanKeyword = raw
    .replace(/(에서|으로|로|에|의|가볼만한|가볼|만한|곳|좀|추천해줘|추천|알려줘|코스|일정|여행|맛집|포함|보여줘|만들어줘|플랜|동선)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Days detection
  let days = 3;
  if (raw.includes('1박') || raw.includes('하루') || raw.includes('당일') || raw.includes('1d') || raw.includes('1-day')) days = 1;
  else if (raw.includes('2박') || raw.includes('1박 2일') || raw.includes('1박2일') || raw.includes('2d') || raw.includes('2-day')) days = 2;
  else if (raw.includes('3박') || raw.includes('2박 3일') || raw.includes('2박3일') || raw.includes('3d') || raw.includes('3-day')) days = 3;
  else if (raw.includes('4박') || raw.includes('3박 4일') || raw.includes('3박4일') || raw.includes('4d') || raw.includes('4-day')) days = 4;

  return { region, days, keyword: cleanKeyword || raw, raw };
}

export default function AIChatPromptHeader({ lang = 'ko', onGenerateItinerary }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : lang === 'zh' || lang === 'zht' ? 'zh-CN' : 'ko-KR';

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
    <div style={{
      width: '100%',
      marginBottom: '1.5rem',
      borderRadius: '24px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      padding: '1.75rem 1.25rem',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
      color: '#0f172a',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 0.4rem 0',
          letterSpacing: '-0.02em',
          lineHeight: 1.25
        }}>
          {t.heroTitle || '어디로 떠나시나요? 🚀'}
        </h1>
        <p style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#64748b',
          margin: 0
        }}>
          {t.heroSubtitle || '3초 만에 AI가 찾아주는 나만의 1:1 맞춤 한국 여행 동선'}
        </p>
      </div>

      {/* Mobile-Optimized Sleek Pill Search Bar */}
      <form onSubmit={handleSubmit} style={{
        maxWidth: '680px',
        margin: '0 auto 1.25rem auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: isListening ? '2px solid #ef4444' : '1.5px solid #2563eb',
          borderRadius: '9999px',
          padding: '0.35rem 0.4rem 0.35rem 1rem',
          boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.25)' : '0 6px 20px rgba(37, 99, 235, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          <Sparkles style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginRight: '0.4rem' }} />

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
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '0.5rem 0'
            }}
          />

          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title={t.voiceBtnTooltip || '음성 인식 시작 🎙️'}
              style={{
                width: '38px',
                height: '38px',
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
              {isListening ? <MicOff style={{ width: '18px', height: '18px' }} /> : <Mic style={{ width: '18px', height: '18px' }} />}
            </button>
          )}

          <button
            type="submit"
            title={t.aiCourseBtn || 'AI 코스 생성'}
            style={{
              width: '40px',
              height: '40px',
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
            <ArrowRight style={{ width: '18px', height: '18px' }} />
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
        gap: '0.4rem'
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
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.4rem 0.85rem',
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
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Camera style={{ width: '13px', height: '13px' }} />
          <span>{t.instaHashtagLabel || '📸 인스타 핫플 ↗'}</span>
        </a>
      </div>
    </div>
  );
}
