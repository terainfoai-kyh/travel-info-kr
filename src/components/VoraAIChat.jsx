import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Share2, CornerDownRight, Utensils, Navigation, User, Bot } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function VoraAIChat({
  lang = 'ko',
  chatMessages = [],
  isLoading = false,
  onSendMessage,
  activeDay = 1,
  onSelectDay,
  questionQuota = { remaining: 5, total: 5 },
  onOpenRewardedAd,
  onOpenGoogleAuth,
  onResetQuotaForDev,
  currentUser = null
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
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '0.65rem 0.85rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <img
            src="/logo.png"
            alt="VORA"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '0.66rem',
          fontWeight: 700,
          color: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          padding: '0.12rem 0.4rem',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
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
                        <span>{copiedId === msg.id ? (lang === 'en' ? 'Copied' : lang === 'ja' ? 'コピー完了' : (lang === 'zh' || lang === 'zht') ? '已复制' : '복사됨') : (lang === 'en' ? 'Copy Itinerary' : lang === 'ja' ? '日程をコピー' : (lang === 'zh' || lang === 'zht') ? '复制行程' : '일정 복사')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sleek One-Touch Day Chips & Confirm Action inside Chat */}
                {msg.itinerary && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    width: '100%',
                    boxSizing: 'border-box',
                    marginTop: '0.45rem'
                  }}>
                    {msg.itinerary.dailySchedules && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {msg.itinerary.dailySchedules.map((ds) => {
                          const isCurrentActive = Number(activeDay) === Number(ds.day);
                          return (
                            <button
                              key={ds.day}
                              type="button"
                              onClick={() => onSelectDay && onSelectDay(ds.day)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                backgroundColor: isCurrentActive ? '#2563eb' : 'var(--bg-primary)',
                                color: isCurrentActive ? '#ffffff' : 'var(--text-main)',
                                border: isCurrentActive ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-full)',
                                padding: '0.28rem 0.65rem',
                                fontSize: '0.74rem',
                                fontWeight: isCurrentActive ? 800 : 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <span style={{ fontWeight: 900 }}>{t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}</span>
                              <span style={{ opacity: isCurrentActive ? 0.95 : 0.7, fontSize: '0.7rem' }}>{ds.theme ? `• ${ds.theme}` : ''}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 🌟 2단계 핵심: 챗봇 말풍선 바로 밑 일정 확정 CTA 버튼 */}
                    {onConfirmItinerary && (
                      <button
                        type="button"
                        onClick={onConfirmItinerary}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.85rem',
                          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                          transition: 'all 0.2s ease',
                          marginTop: '0.2rem'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>{lang === 'en' ? 'Confirm This Course & Go to My Trip ➔' : lang === 'ja' ? 'このコースで日程を確定する ➔' : (lang === 'zh' || lang === 'zht') ? '以此路线确认行程 ➔' : '✨ 이 코스로 일정 확정 & 내 여행에 담기 ➔'}</span>
                      </button>
                    )}
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
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 0.85rem',
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            borderRadius: '16px',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            width: 'fit-content'
          }}>
            <Loader2 size={15} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
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

      {/* Follow-up Quick Modification Chips */}
      {!isLoading && (
        <div
          className="no-scrollbar"
          style={{
            padding: '0.4rem 0.65rem',
            backgroundColor: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.35rem',
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
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              + {chip}
            </button>
          ))}
        </div>
      )}

      {/* Daily Free Question Quota Badge with Quick Actions */}
      <div style={{
        padding: '0.35rem 0.65rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.35rem',
        fontSize: '0.72rem',
        fontWeight: 700,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>⚡</span>
          <span>
            {lang === 'en' ? 'Daily Free Itineraries: ' : lang === 'ja' ? '本日の無料AI作成: ' : (lang === 'zh' || lang === 'zht') ? '今日免费生成: ' : '오늘 무료 AI 일정: '}
            <strong style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>{questionQuota?.remaining ?? 3}</strong> / {questionQuota?.total ?? 3}{lang === 'en' ? '' : lang === 'ja' ? '回' : (lang === 'zh' || lang === 'zht') ? '次' : '회'}
          </span>
        </div>

        {/* Quick Mini Recharge Actions (동의하에 충전) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={onOpenRewardedAd}
            title={lang === 'en' ? 'Watch 15s video for +3 free itineraries' : '15초 스폰서 영상 보고 +3회 충전'}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              padding: '0.15rem 0.45rem',
              fontSize: '0.68rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {lang === 'en' ? '🎬 +3 Charge' : lang === 'ja' ? '🎬 +3回チャージ' : (lang === 'zh' || lang === 'zht') ? '🎬 +3次充能' : '🎬 +3회 충전'}
          </button>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.2rem' }}>
            {lang === 'en' ? 'Resets at 00:00' : lang === 'ja' ? '00:00 リセット' : (lang === 'zh' || lang === 'zht') ? '00:00 重置' : '자정(00:00) 리셋'}
          </span>
        </div>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '0.55rem 0.65rem calc(0.55rem + env(safe-area-inset-bottom, 0px)) 0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--bg-card)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            id="vora-chat-input-field"
            type="text"
            className="vora-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={lang === 'ko' 
              ? "추가 질문이나 일정 수정을 적어주세요 (예: 2일차 카페 변경)..." 
              : lang === 'ja'
              ? "ご質問やプランの変更を入力してください (例: 2日目のカフェ変更)..."
              : (lang === 'zh' || lang === 'zht')
              ? "请输入补充提问或行程调整 (例如: 修改第2天咖啡厅)..."
              : "Ask adjustments or questions..."}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1rem',
              fontSize: '0.84rem',
              fontWeight: 500,
              color: 'var(--text-main)',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
              transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          style={{
            backgroundColor: inputText.trim() && !isLoading ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.1)',
            color: inputText.trim() && !isLoading ? '#ffffff' : 'var(--accent-primary)',
            border: inputText.trim() && !isLoading ? 'none' : '1px solid rgba(37, 99, 235, 0.2)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
            boxShadow: inputText.trim() && !isLoading ? 'var(--shadow-glow)' : 'none',
            flexShrink: 0,
            opacity: inputText.trim() && !isLoading ? 1 : 0.65,
            transition: 'all var(--transition-fast)'
          }}
          title={lang === 'ko' ? '메시지 전송' : lang === 'ja' ? '送信' : (lang === 'zh' || lang === 'zht') ? '发送' : 'Send message'}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
