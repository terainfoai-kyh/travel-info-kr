import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Share2, CornerDownRight, Utensils, Navigation, User, Bot } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function VoraAIChat({
  lang = 'ko',
  chatMessages = [],
  isLoading = false,
  onSendMessage,
  activeDay = 1,
  onSelectDay
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll ONLY inside inner chat container without moving the outer page window!
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopyItinerary = (itineraryData, msgId) => {
    if (!itineraryData) return;
    let textToCopy = `✨ [VORA AI 3.0] ${itineraryData.tripTitle || '맞춤 한국 여행 일정'}\n\n`;
    textToCopy += `${itineraryData.summary}\n\n`;
    
    (itineraryData.dailySchedules || []).forEach(ds => {
      textToCopy += `📍 [${ds.day}일차] ${ds.theme}\n`;
      (ds.spots || []).forEach((s, idx) => {
        textToCopy += `  ${idx + 1}. ${s.title} (${s.transitTime || '이동'})\n`;
      });
      if (ds.foodRecommendation) {
        textToCopy += `  🍴 미식 추천: ${ds.foodRecommendation.dishName} - ${ds.foodRecommendation.description}\n`;
      }
      if (ds.transitTip) {
        textToCopy += `  🚇 이동 팁: ${ds.transitTip}\n`;
      }
      textToCopy += `\n`;
    });

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickChip = (chipText) => {
    if (isLoading) return;
    onSendMessage(chipText);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '0.65rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/logo.png"
            alt="VORA"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          padding: '0.15rem 0.45rem',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>실시간 1:1 대화중</span>
        </span>
      </div>

      {/* Chat Message Stream */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          padding: '0.85rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginBottom: '0.3rem',
                  gap: '0.15rem'
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '16px 16px 4px 16px',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', paddingRight: '0.3rem' }}>
                    문의 시간 {msg.timestamp}
                  </span>
                )}
              </div>
            );
          }

          // Assistant Message Bubble
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
                marginBottom: '0.3rem'
              }}
            >
              {/* Bot Avatar */}
              <img
                src="/logo.png"
                alt="VORA AI"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              />

              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Assistant Text Bubble */}
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px 16px 16px 16px',
                  padding: '0.75rem 0.95rem',
                  fontSize: '0.83rem',
                  lineHeight: 1.55,
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Generation Speed & Timestamp Badge */}
                  {(msg.generationTime || msg.itinerary?.generationTime || msg.timestamp) && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.18)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      marginBottom: '0.45rem'
                    }}>
                      <span style={{ fontWeight: 800 }}>⚡ AI 응답 ({msg.generationTime || msg.itinerary?.generationTime}초)</span>
                      {msg.queryTime && msg.replyTime && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          | 문의 {msg.queryTime} ➔ 답변 {msg.replyTime}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {/* Quick Suggestions Chips for Conversational Mode */}
                  {msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginTop: '0.65rem'
                    }}>
                      {msg.quickSuggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => onSendMessage && onSendMessage(suggestion)}
                          style={{
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--border-highlight)',
                            borderRadius: 'var(--radius-full)',
                            padding: '0.3rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          ✨ {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Copy Button if message has itinerary data */}
                  {msg.itinerary && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleCopyItinerary(msg.itinerary, msg.id)}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-main)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === msg.id ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} />}
                        <span>{copiedId === msg.id ? '복사됨' : '일정 복사'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Daily Schedule Interactive Cards inside Chat */}
                {msg.itinerary && msg.itinerary.dailySchedules && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {msg.itinerary.dailySchedules.map((ds) => {
                      const isCurrentActive = Number(activeDay) === Number(ds.day);
                      return (
                        <div
                          key={ds.day}
                          onClick={() => onSelectDay && onSelectDay(ds.day)}
                          style={{
                            backgroundColor: isCurrentActive ? 'rgba(37, 99, 235, 0.06)' : 'var(--bg-card)',
                            border: isCurrentActive ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '0.65rem 0.85rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 900,
                              backgroundColor: isCurrentActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                              color: '#ffffff',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-full)'
                            }}>
                              {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {ds.theme}
                            </span>
                          </div>

                          {/* Spot Flow Badges */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.25rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--text-main)'
                          }}>
                            {(ds.spots || []).map((s, idx) => (
                              <React.Fragment key={s.id || idx}>
                                <span style={{
                                  backgroundColor: 'var(--bg-primary)',
                                  border: '1px solid var(--border-color)',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '5px'
                                }}>
                                  {idx + 1}. {s.title}
                                </span>
                                {idx < (ds.spots || []).length - 1 && (
                                  <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>➔</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          {/* Daily Food Recommendation Badge */}
                          {ds.foodRecommendation && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: 'rgba(245, 158, 11, 0.07)',
                              border: '1px solid rgba(245, 158, 11, 0.15)',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              color: '#b45309',
                              fontWeight: 700
                            }}>
                              <Utensils size={11} style={{ color: '#d97706', flexShrink: 0 }} />
                              <span><strong>{ds.foodRecommendation.dishName}</strong>: {ds.foodRecommendation.description}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Typing / Thinking Indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '4px 16px 16px 16px',
            padding: '0.65rem 0.95rem',
            width: 'fit-content'
          }}>
            <div className="spin-animation" style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid var(--accent-primary)',
              borderTopColor: 'transparent'
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              VORA AI가 맞춤 동선을 설계하고 있습니다...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Follow-up Quick Modification Chips */}
      {!isLoading && (
        <div style={{
          padding: '0.35rem 0.75rem',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.3rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {(t.chatQuickModifications || []).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all var(--transition-fast)'
              }}
            >
              + {chip}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '0.55rem 0.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--bg-glass)'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'ko' ? "추가 질문이나 일정 수정을 적어주세요 (예: 2일차 카페 변경)..." : "Ask adjustments or questions..."}
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          style={{
            backgroundColor: inputText.trim() && !isLoading ? 'var(--accent-primary)' : 'var(--border-color)',
            color: '#ffffff',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
            boxShadow: inputText.trim() && !isLoading ? 'var(--shadow-glow)' : 'none',
            flexShrink: 0,
            transition: 'all var(--transition-fast)'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
