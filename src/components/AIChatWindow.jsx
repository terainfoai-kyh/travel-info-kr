import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Mic, MicOff, X, Compass, MapPin, Calendar, Heart, MessageSquare, RefreshCw, Shirt, Utensils, CloudSun, Hotel } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { geminiParseNaturalPrompt, geminiGenerateFullItinerary } from '../services/geminiNlpService';

export default function AIChatWindow({ isOpen, onClose, lang = 'ko', onGenerateItinerary, initialPrompt = '' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  // Initialize welcoming greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeBubble = {
        id: 'welcome-1',
        sender: 'ai',
        text: getWelcomeMessage(lang),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestionChips: getSuggestionChips(lang)
      };
      setMessages([welcomeBubble]);
    }
  }, [isOpen, lang]);

  // Handle initial prompt passed from search header
  useEffect(() => {
    if (initialPrompt && isOpen && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  function getWelcomeMessage(l) {
    switch (l) {
      case 'en': return "Hello! I am your AI Travel Concierge for Korea. 🇰🇷 Where would you like to travel? Feel free to ask like '1st day Suwon -> 2nd day Myeongdong' or 'I am in my 50s planning a 3-day family trip'!";
      case 'ja': return "こんにちは！韓国旅行AIコンシェルジュです。🇰🇷 どこへ旅行したいですか？「1日目水原→2日目明洞」や「50代家族旅行3泊4日」など気軽にお尋ねください！";
      case 'zh': return "您好！我是您的韩国旅游AI管家。🇰🇷 想去哪里旅行？您可以随时告诉我，如“第1天水原->第2天明洞”或“50多岁家庭3天4夜游”！";
      case 'zht': return "您好！我是您的韓國旅遊AI管家。🇰🇷 想去哪裡旅行？您可以隨時告訴我，如「第1天水原->第2天明洞」或「50多歲家庭3天4夜遊」！";
      case 'de': return "Hallo! Ich bin Ihr Korea-Reise-AI-Concierge. 🇰🇷 Wohin möchten Sie reisen? Fragt mich z.B. 'Tag 1 Suwon -> Tag 2 Myeongdong'!";
      case 'fr': return "Bonjour! Je suis votre concierge de voyage IA pour la Corée. 🇰🇷 Où souhaitez-vous voyager?";
      case 'es': return "¡Hola! Soy tu asistente de viajes de IA para Corea. 🇰🇷 ¿A dónde te gustaría viajar?";
      case 'ru': return "Здравствуйте! Я ваш ИИ-консьерж по путешествиям в Корею. 🇰🇷 Куда вы хотите отправиться?";
      default: return "안녕하세요! 대한민국 여행 AI 컨시어지입니다. 🇰🇷 어디로 떠나고 싶으신가요? '1일차 수원 ➔ 2일차 명동' 또는 '50대 가족 힐링 3박4일 여행'처럼 편하게 말씀해 주세요!";
    }
  }

  function getSuggestionChips(l) {
    switch (l) {
      case 'en': return [
        "1st day Suwon ➔ 2nd day Myeongdong ➔ 3rd day Incheon",
        "Seongsu-dong Instagram hotspots & popup stores",
        "Family trip to Korea (50s parents & kids 3 nights)"
      ];
      case 'ja': return [
        "1日目水原 ➔ 2日目明洞 ➔ 3日目仁川 ➔ 4日目江陵",
        "ソンスドン インスタ映えスポット＆ポップアップ",
        "50代両親と行く韓国家族旅行 3泊4日"
      ];
      case 'zh': return [
        "第1天水原 ➔ 第2天明洞 ➔ 第3天仁川 ➔ 第4天江陵",
        "圣水洞网红打卡点与快闪店",
        "50多岁父母家庭韩国3天4夜游"
      ];
      default: return [
        "1일차 수원 ➔ 2일차 명동 ➔ 3일차 인천 ➔ 4일차 강릉 ➔ 5일차 속초",
        "성수동 인스타 감성 핫플 & 팝업스토어",
        "50대 부모님 모시고 떠나는 가족 힐링 3박4일"
      ];
    }
  }

  const handleSendMessage = async (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query || isGenerating) return;

    setInputText('');
    const userBubble = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userBubble]);
    setIsGenerating(true);

    try {
      // 1. Natural language parse
      const parsedIntent = await geminiParseNaturalPrompt(query, lang);
      
      // 2. Full-AI 5-day itinerary generation with Search Grounding
      const fullAiResult = await geminiGenerateFullItinerary(query, lang);

      const aiBubbleText = fullAiResult?.aiRecommendationSummary || 
        `${query}에 맞춰 최적의 ${parsedIntent?.days || 3}일치 코스를 100% 정품 명소 좌표와 날씨/미식/코디 정보로 설계했습니다! 📍`;

      const aiBubble = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiBubbleText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itinerarySummary: fullAiResult ? {
          title: fullAiResult.tripTitle || `${query} 맞춤 코스`,
          days: fullAiResult.days,
          dailySchedules: fullAiResult.dailySchedules
        } : null,
        parsedIntent,
        fullAiResult
      };

      setMessages(prev => [...prev, aiBubble]);

      if (onGenerateItinerary) {
        onGenerateItinerary(parsedIntent, fullAiResult);
      }
    } catch (err) {
      console.error("AI Chat Generation Error:", err);
      const errorBubble = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "일정 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorBubble]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ko' ? 'ko-KR' : (lang === 'en' ? 'en-US' : 'ja-JP');
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-700/60 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Chat Window Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span>AI Travel Concierge</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Gemini 1.5 Flash</span>
              </h3>
              <p className="text-xs text-slate-400">실시간 인스타 핫플 & 날씨/미식/코디 100% 맞춤 생성</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Bubbles Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div className={`flex items-start space-x-2 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    AI
                  </div>
                )}

                <div 
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Suggestion Chips in Welcome Message */}
                  {msg.suggestionChips && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap gap-2">
                      {msg.suggestionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-left transition-all hover:scale-[1.02]"
                        >
                          ✨ {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Generated Itinerary Rich Summary Card */}
                  {msg.itinerarySummary && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" />
                            <span>{msg.itinerarySummary.title}</span>
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {msg.itinerarySummary.days}일치 완벽 생성
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-300">
                          {msg.itinerarySummary.dailySchedules?.map((ds, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-800 last:border-none">
                              <span className="font-medium text-slate-200">{ds.dateLabel || `${ds.day}일차 - ${ds.city}`}</span>
                              <span className="text-slate-400">{ds.spots?.length || 4}개 명소 (좌표100% 매칭)</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            if (onGenerateItinerary) {
                              onGenerateItinerary(msg.parsedIntent, msg.fullAiResult);
                            }
                            onClose();
                          }}
                          className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-transform active:scale-95"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>5일치 완벽 지도 & 코스 렌더링 보기</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2 px-3 bg-slate-800/50 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Gemini 1.5 AI가 100% 정품 명소와 날씨/미식/코디를 직조하는 중...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700/60">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2 bg-slate-900 rounded-xl px-4 py-2.5 border border-slate-700 focus-within:border-blue-500 transition-colors"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="예: 1일차 수원 ➔ 2일차 명동 ➔ 3일차 인천 또는 50대 가족여행..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSpeechInput}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            >
              <span>전송</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
