import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, Send, ArrowRight, Compass, Camera, Flame, Heart, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * Natural language query parser to extract region and travel parameters
 */
export function parseNaturalPrompt(text) {
  if (!text) return { region: '전국', days: 3, keyword: '' };
  
  let region = '전국';
  if (text.includes('서울')) region = '서울';
  else if (text.includes('제주')) region = '제주';
  else if (text.includes('부산')) region = '부산';
  else if (text.includes('인천')) region = '인천';
  else if (text.includes('경주')) region = '경주';
  else if (text.includes('강릉') || text.includes('속초')) region = '강원';
  else if (text.includes('전주')) region = '전북';
  
  let days = 3;
  if (text.includes('1박') || text.includes('하루') || text.includes('당일')) days = 1;
  else if (text.includes('2박') || text.includes('1박 2일') || text.includes('1박2일')) days = 2;
  else if (text.includes('3박') || text.includes('2박 3일') || text.includes('2박3일')) days = 3;
  else if (text.includes('4박') || text.includes('3박 4일') || text.includes('3박4일')) days = 4;

  return { region, days, keyword: text };
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
      recognition.lang = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'ko-KR';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
        setIsListening(false);
        if (onGenerateItinerary && transcript.trim()) {
          const parsed = parseNaturalPrompt(transcript);
          onGenerateItinerary(parsed);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    const parsed = parseNaturalPrompt(promptText);
    if (onGenerateItinerary) {
      onGenerateItinerary(parsed);
    }
  };

  const handleChipClick = (sampleText) => {
    setPromptText(sampleText);
    const parsed = parseNaturalPrompt(sampleText);
    if (onGenerateItinerary) {
      onGenerateItinerary(parsed);
    }
  };

  const sampleChips = [
    { label: '💬 서울 성수동 핫플 & 카페 1박 2일', text: '친구랑 서울 성수동 카페 & 맛집 포함 1박 2일 코스' },
    { label: '💬 비 오는 날 제주도 실내 데이트 2박 3일', text: '비 오는 날 제주도 실내 박물관 & 감성 데이트 2박 3일' },
    { label: '💬 부산 해운대 바다뷰 & 맛집 2박 3일', text: '부산 해운대 바다 뷰 카페 및 유명 맛집 2박 3일' },
    { label: '💬 외국인 친구와 가는 서울 야경 K-컬처', text: '외국인 친구와 함께 가는 서울 야경 & 전통시장 K-컬처' }
  ];

  const instaChips = [
    { label: '📸 #성수동핫플 인생샷 ↗', tag: '성수동핫플' },
    { label: '📸 #경복궁한복 릴스 ↗', tag: '경복궁한복' },
    { label: '📸 #해운대바다뷰 ↗', tag: '해운대바다뷰' },
    { label: '📸 #제주인생샷 ↗', tag: '제주인생샷' }
  ];

  return (
    <div className="w-full mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 md:p-8 shadow-2xl text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          🤖 K-TRAVEL NATIVE AI ENGINE
        </div>
        <span className="text-xs text-indigo-300/80 font-medium">
          ⚡ 100% Realtime TourAPI 4.0 & Weather Fusion
        </span>
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 mb-2 leading-tight">
        {t.heroTitle || '3초 만에 AI가 완성하는 1:1 맞춤 한국 여행 🚀'}
      </h1>
      <p className="text-sm md:text-base text-indigo-200/90 mb-5 font-normal">
        {t.heroSubtitle || '자유롭게 대화하거나 말로 적어주시면 AI가 최적의 동선을 만들어 드립니다 🎙️'}
      </p>

      {/* Main Conversational AI Prompt Box */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className={`relative flex items-center bg-slate-800/90 border transition-all duration-300 rounded-2xl p-1.5 shadow-inner ${isListening ? 'border-red-500 ring-4 ring-red-500/30' : 'border-indigo-500/50 hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/50'}`}>
          <div className="pl-3.5 pr-2 text-indigo-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={isListening ? (t.voiceListening || '말씀하세요... 🎧 (실시간 음성 인식 중)') : (t.aiPromptPlaceholder || "예: '친구랑 서울 성수동 카페 & 맛집 포함 1박 2일 코스 알려줘' 💬")}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm md:text-base focus:outline-none py-2 px-1"
          />

          {/* Voice Input Button */}
          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title={t.voiceBtnTooltip || '음성 인식 시작 🎙️'}
              className={`p-2.5 rounded-xl transition-all duration-200 mr-1.5 flex items-center gap-1.5 text-xs font-semibold ${
                isListening
                  ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/50'
                  : 'bg-indigo-950/80 text-indigo-300 hover:bg-indigo-800 hover:text-white border border-indigo-700/50'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-300" />}
              <span className="hidden sm:inline">{isListening ? '음성 중지' : '음성 입력'}</span>
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <span>AI 코스 생성</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Natural Prompt Sample Chips */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs text-indigo-300/80 font-medium">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>인기 추천 프롬프트 (터치 시 1초 생성)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.text)}
              className="text-xs bg-slate-800/80 hover:bg-indigo-900/80 text-indigo-100 border border-indigo-500/30 hover:border-indigo-400/80 px-3 py-1.5 rounded-full transition-all duration-150 active:scale-95 text-left"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Instagram Hotspots Deep Links (Zero-Cost Fusion) */}
      <div className="mt-4 pt-3 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-pink-300/90 font-semibold">
          <Camera className="w-3.5 h-3.5 text-pink-400" />
          <span>실시간 인스타그램 인생샷 릴스 (무료 연동)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {instaChips.map((item, i) => (
            <a
              key={i}
              href={`https://www.instagram.com/explore/tags/${encodeURIComponent(item.tag)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] bg-pink-950/40 hover:bg-pink-900/60 text-pink-200 border border-pink-500/30 px-2.5 py-1 rounded-full transition-all duration-150 flex items-center gap-1"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
