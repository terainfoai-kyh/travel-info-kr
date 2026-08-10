import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, ArrowRight, Camera, Flame } from 'lucide-react';
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
    { label: '🗼 서울 성수동 핫플 1박2일', text: '친구랑 서울 성수동 카페 & 맛집 포함 1박 2일 코스' },
    { label: '🏝️ 제주 감성 데이트 2박3일', text: '비 오는 날 제주도 실내 박물관 & 감성 데이트 2박 3일' },
    { label: '🌊 부산 해운대 바다뷰 2박3일', text: '부산 해운대 바다 뷰 카페 및 유명 맛집 2박 3일' }
  ];

  return (
    <div className="w-full mb-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 md:p-10 shadow-xl shadow-slate-200/50 text-slate-900 relative overflow-hidden">
      {/* Ambient Soft Pastel Glow Background Circles */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Title */}
      <div className="max-w-3xl mx-auto text-center mb-6 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          어디로 떠나시나요? 🚀
        </h1>
        <p className="text-base md:text-lg text-slate-500 font-medium">
          3초 만에 AI가 찾아주는 나만의 1:1 맞춤 한국 여행 동선
        </p>
      </div>

      {/* Ultra-Clean Pill-Shaped Smart Search Bar */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative z-10 mb-6">
        <div className={`flex items-center bg-slate-50/90 border transition-all duration-300 rounded-full p-2 shadow-lg shadow-blue-500/5 ${
          isListening 
            ? 'border-red-500 ring-4 ring-red-500/20' 
            : 'border-slate-300/80 hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15'
        }`}>
          <div className="pl-4 text-blue-600">
            <Sparkles className="w-6 h-6" />
          </div>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={isListening ? '말씀하세요... 🎧 (실시간 음성 인식 중)' : '예: "서울 성수동 카페 & 맛집 포함 1박 2일 코스" 💬'}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm md:text-base focus:outline-none px-3 font-medium"
          />

          {/* Voice Input Icon Button */}
          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              title="음성 인식 시작 🎙️"
              className={`p-3 rounded-full transition-all duration-200 mr-2 flex items-center justify-center ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-full font-bold text-sm shadow-md shadow-blue-600/30 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <span>AI 코스 생성</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Minimal Sample Chips & Instagram Deep Link */}
      <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 relative z-10">
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.text)}
            className="text-xs bg-slate-100/80 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 px-4 py-2 rounded-full transition-all duration-150 active:scale-95 font-medium"
          >
            {chip.label}
          </button>
        ))}

        <a
          href="https://www.instagram.com/explore/tags/%EC%84%B1%EC%88%98%EB%8F%99%ED%95%AB%ED%94%8C/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 px-4 py-2 rounded-full transition-all duration-150 flex items-center gap-1.5 font-semibold"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>📸 인스타 핫플 인생샷 ↗</span>
        </a>
      </div>
    </div>
  );
}
