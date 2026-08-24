import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Share2, CornerDownRight, Utensils, Navigation, User, Bot, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function VoraAIChat({
  lang = 'ko',
  chatMessages = [],
  isLoading = false,
  onSendMessage,
  activeDay = 1,
  onSelectDay,
  currentUser = null,
  onViewTimeline
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const messageRefs = useRef({});
  const prevMessagesLengthRef = useRef(chatMessages.length);
  const prevLoadingRef = useRef(isLoading);

  // Smoothly scroll and focus on the latest conversation turn (User Question & AI Response top)
  useEffect(() => {
    if (!chatContainerRef.current) return;

    const isNewMessageAdded = chatMessages.length > prevMessagesLengthRef.current;
    const wasLoading = prevLoadingRef.current && !isLoading;

    if (isNewMessageAdded || wasLoading) {
      const timer = setTimeout(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const lastMsg = chatMessages[chatMessages.length - 1];
        const lastUserMsg = [...chatMessages].reverse().find(m => m.role === 'user');

        // Focus on the User query of this turn if available, else the message itself
        const targetMsgId = (lastMsg?.role === 'assistant' && lastUserMsg) ? lastUserMsg.id : lastMsg?.id;
        const targetElement = targetMsgId ? messageRefs.current[targetMsgId] : null;

        if (targetElement) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = targetElement.getBoundingClientRect();
          const relativeTop = elementRect.top - containerRect.top + container.scrollTop;

          container.scrollTo({
            top: Math.max(0, relativeTop - 12),
            behavior: 'smooth'
          });
        } else if (isLoading) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 60);

      return () => clearTimeout(timer);
    }

    prevMessagesLengthRef.current = chatMessages.length;
    prevLoadingRef.current = isLoading;
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
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, #f0f7ff 0%, #e8f4fd 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(37, 99, 235, 0.22)',
      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
      overflow: 'hidden'
    }}>
      {/* Chat Header (슬림 컴팩트) */}
      <div style={{
        padding: '0.45rem 0.75rem',
        borderBottom: '1px solid rgba(37, 99, 235, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img
            src="/logo.png"
            alt="VORA"
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '0.64rem',
          fontWeight: 700,
          color: '#059669',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          padding: '0.1rem 0.38rem',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>{t.chatStatusLive || (lang === 'en' ? 'Live Chat' : '실시간 1:1 대화중')}</span>
        </span>
      </div>

      {/* Chat Message Stream */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          padding: '0.75rem 0.65rem',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div
                key={msg.id}
                ref={el => { if (el) messageRefs.current[msg.id] = el; }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.25rem',
                  marginBottom: '0.5rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  borderRadius: '18px 18px 4px 18px',
                  padding: '0.7rem 0.95rem',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                }}>
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', paddingRight: '0.4rem', fontWeight: 500 }}>
                    {lang === 'en' ? `Inquiry ${msg.timestamp}` : lang === 'ja' ? `送信時刻 ${msg.timestamp}` : (lang === 'zh' || lang === 'zht') ? `提问时间 ${msg.timestamp}` : `문의 시간 ${msg.timestamp}`}
                  </span>
                )}
              </div>
            );
          }

          // Assistant Message Bubble
          return (
            <div
              key={msg.id}
              ref={el => { if (el) messageRefs.current[msg.id] = el; }}
              style={{
                display: 'flex',
                gap: '0.45rem',
                alignItems: 'flex-start',
                marginBottom: '0.3rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Bot Avatar */}
              <img
                src="/logo.png"
                alt="VORA AI"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              />

              <div style={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflow: 'hidden' }}>
                {/* Assistant Text Bubble */}
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px 18px 18px 18px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  boxSizing: 'border-box',
                  width: '100%',
                  maxWidth: '100%'
                }}>
                  {/* Generation Speed & Timestamp Badge */}
                  {(msg.generationTime || msg.itinerary?.generationTime || msg.timestamp) && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '8px',
                      marginBottom: '0.55rem'
                    }}>
                      <span style={{ fontWeight: 800 }}>
                        {lang === 'en' 
                          ? `⚡ AI Response (${msg.generationTime || msg.itinerary?.generationTime || '0.9'}s)` 
                          : lang === 'ja'
                          ? `⚡ AI 応答 (${msg.generationTime || msg.itinerary?.generationTime || '0.9'}秒)`
                          : (lang === 'zh' || lang === 'zht')
                          ? `⚡ AI 响应 (${msg.generationTime || msg.itinerary?.generationTime || '0.9'}秒)`
                          : `⚡ AI 응답 (${msg.generationTime || msg.itinerary?.generationTime || '0.9'}초)`}
                      </span>
                      {msg.queryTime && msg.replyTime && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          {lang === 'en' 
                            ? `| Asked ${msg.queryTime} ➔ Replied ${msg.replyTime}` 
                            : lang === 'ja'
                            ? `| 質問 ${msg.queryTime} ➔ 応答 ${msg.replyTime}`
                            : (lang === 'zh' || lang === 'zht')
                            ? `| 提问 ${msg.queryTime} ➔ 回复 ${msg.replyTime}`
                            : `| 문의 ${msg.queryTime} ➔ 답변 ${msg.replyTime}`}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.86rem' }}>{msg.text}</div>

                  {/* Quota Exhausted Call to Action Cards (Rewarded Ad & Google Login) */}
                  {(msg.isQuotaExhausted || (msg.text && (msg.text.includes('무료 AI 질문') || msg.text.includes('free AI questions')))) && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '0.85rem',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{lang === 'en' ? '🎁 Instant Recharge & Extra Benefits' : lang === 'ja' ? '🎁 質問回数即時チャージ＆特典' : (lang === 'zh' || lang === 'zht') ? '🎁 立即充能与专享权益' : '🎁 질문 즉시 충전 & 확장 혜택'}</span>
                      </div>

                      {/* Action 1: 15s Rewarded Ad */}
                      <button
                        onClick={onOpenRewardedAd}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <span>{lang === 'en' ? '🎬 Watch 15s Ad for +3 Instant Prompts' : lang === 'ja' ? '🎬 15秒広告を視聴して+3回即時チャージ' : (lang === 'zh' || lang === 'zht') ? '🎬 观看15秒广告立得+3次提问' : '🎬 15초 스폰서 광고 보고 +3회 즉시 충전'}</span>
                      </button>

                      {/* Action 2: 3-sec Google Login (if guest) */}
                      {!currentUser?.isGoogleLoggedIn && (
                        <button
                          onClick={onOpenGoogleAuth}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #dadce0',
                            backgroundColor: '#ffffff',
                            color: '#3c4043',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span>{lang === 'en' ? 'Sign in with Google for 15 Daily Prompts + Save Trips' : lang === 'ja' ? 'Googleでログインして毎日15回＋日程保存' : (lang === 'zh' || lang === 'zht') ? '使用Google登录尊享每日15次＋行程保存' : '3초 구글 로그인하고 매일 15회 + 일정 저장'}</span>
                        </button>
                      )}
                    </div>
                  )}

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

                  {/* Sleek Daily Schedule Mini Briefing Card */}
                  {msg.itinerary && msg.itinerary.dailySchedules && msg.itinerary.dailySchedules.length > 0 && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      borderRadius: '12px',
                      border: '1px solid rgba(37, 99, 235, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      {msg.itinerary.dailySchedules.map((ds) => {
                        const cleanTheme = ds.theme ? ds.theme.replace(/^\d+일차[:\s—-]*/, '').trim() : '';
                        return (
                          <div
                            key={ds.day}
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '0.4rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-main)',
                              lineHeight: 1.45
                            }}
                          >
                            <span style={{
                              fontWeight: 800,
                              color: '#2563eb',
                              flexShrink: 0
                            }}>
                              📍 {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                            </span>
                            {cleanTheme && (
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                {cleanTheme}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing / Thinking Indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.75rem',
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            borderRadius: '12px',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            width: 'fit-content'
          }}>
            <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {lang === 'en' 
                ? 'VORA AI is crafting your tailored itinerary...' 
                : lang === 'ja'
                ? 'VORA AIが最適な旅行ルートを作成しています...'
                : (lang === 'zh' || lang === 'zht')
                ? 'VORA AI 正在为您定制专属旅行路线...'
                : 'VORA AI가 맞춤 동선을 설계하고 있습니다...'}
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Follow-up Quick Modification Chips (슬림 1줄) */}
      {!isLoading && (
        <div
          className="no-scrollbar"
          style={{
            padding: '0.3rem 0.6rem',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderTop: '1px solid rgba(37, 99, 235, 0.12)',
            display: 'flex',
            gap: '0.3rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {(t.chatQuickModifications || []).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              + {chip}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar (홈 검색창과 100% 일치하는 프리미엄 웜 앰버 골드 캡슐) */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '0.45rem 0.65rem calc(0.45rem + env(safe-area-inset-bottom, 0px)) 0.65rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(245, 158, 11, 0.18)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fffdf5',
          border: '2px solid #f59e0b',
          borderRadius: '9999px',
          padding: '0.18rem 0.25rem 0.18rem 0.85rem',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.15)',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}>
          <Sparkles size={15} style={{ color: '#d97706', flexShrink: 0, marginRight: '0.45rem' }} />
          <input
            id="vora-chat-input-field"
            type="text"
            className="vora-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={lang === 'ko' 
              ? "추가 질문이나 일정 수정을 적어주세요..." 
              : lang === 'ja'
              ? "プランの変更を入力してください..."
              : (lang === 'zh' || lang === 'zht')
              ? "请输入补充提问或行程调整..."
              : "Ask adjustments or questions..."}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.45rem 0',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#0f172a',
              outline: 'none',
              minWidth: 0
            }}
          />

          {/* 일체형 웜 앰버 골드 전송 버튼 */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            style={{
              background: inputText.trim() && !isLoading
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'rgba(245, 158, 11, 0.18)',
              color: inputText.trim() && !isLoading ? '#ffffff' : '#b45309',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.76rem',
              fontWeight: 900,
              cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
              boxShadow: inputText.trim() && !isLoading ? '0 2px 8px rgba(245, 158, 11, 0.35)' : 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title={lang === 'ko' ? '메시지 전송' : lang === 'ja' ? '送信' : (lang === 'zh' || lang === 'zht') ? '发送' : 'Send'}
          >
            <span>{lang === 'en' ? 'Send' : lang === 'ja' ? '送信' : (lang === 'zh' || lang === 'zht') ? '发送' : '전송'}</span>
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}
