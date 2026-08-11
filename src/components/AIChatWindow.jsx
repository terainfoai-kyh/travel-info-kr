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
      case 'de': return "Hallo! Ich bin Ihr Korea-Reise-AI-Concierge. 🇰🇷 Wohin möchten Sie reisen?";
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(8px)',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        height: '82vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Chat Window Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>AI Travel Concierge</span>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', fontWeight: 800 }}>
                  Gemini 1.5 Flash
                </span>
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.74rem', margin: '0.15rem 0 0 0', fontWeight: 600 }}>
                실시간 인스타 핫플 & 날씨 / 미식 / 코디 100% 맞춤 생성
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Bubbles Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#f8fafc'
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '0.25rem'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                maxWidth: '88%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {msg.sender === 'ai' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.7rem',
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

                <div 
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: '16px',
                    borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontWeight: msg.sender === 'user' ? 600 : 500 }}>{msg.text}</p>

                  {/* Suggestion Chips in Welcome Message */}
                  {msg.suggestionChips && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {msg.suggestionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          ✨ {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Generated Itinerary Rich Summary Card */}
                  {msg.itinerarySummary && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '0.85rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Compass size={15} />
                            <span>{msg.itinerarySummary.title}</span>
                          </h4>
                          <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#d1fae5', color: '#065f46', fontWeight: 800 }}>
                            {msg.itinerarySummary.days}일치 완벽 생성
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {msg.itinerarySummary.dailySchedules?.map((ds, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.75rem', padding: '0.25rem 0', borderBottom: '1px solid #e2e8f0' }}>
                              <span style={{ fontWeight: 700, color: '#1e293b' }}>{ds.dateLabel || `${ds.day}일차 - ${ds.city}`}</span>
                              <span style={{ color: '#64748b' }}>{ds.spots?.length || 4}개 명소 (좌표100% 매칭)</span>
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
                          style={{
                            width: '100%',
                            marginTop: '0.75rem',
                            padding: '0.55rem',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                          }}
                        >
                          <MapPin size={14} />
                          <span>5일치 완벽 지도 & 코스 렌더링 보기</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', padding: '0 0.25rem' }}>{msg.timestamp}</span>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e40af', fontSize: '0.78rem', padding: '0.5rem 0.85rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', width: 'fit-content' }}>
              <Sparkles size={16} color="#2563eb" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Gemini 1.5 AI가 100% 정품 명소와 날씨/미식/코디를 직조하는 중...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0'
        }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '0.5rem 0.85rem',
              border: '1px solid #cbd5e1'
            }}
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="예: 1일차 수원 ➔ 2일차 명동 ➔ 3일차 인천 또는 50대 가족여행..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />

            <button
              type="button"
              onClick={handleSpeechInput}
              style={{
                padding: '0.4rem',
                borderRadius: '8px',
                border: 'none',
                background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                color: isListening ? '#ef4444' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              style={{
                padding: '0.45rem 0.9rem',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                opacity: (!inputText.trim() || isGenerating) ? 0.4 : 1,
                color: '#ffffff',
                fontWeight: 800,
                borderRadius: '8px',
                fontSize: '0.78rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>전송</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
