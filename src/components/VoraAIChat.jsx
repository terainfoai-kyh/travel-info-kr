import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Share2, CornerDownRight, Utensils, Navigation, User, Bot, Loader2, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { getActiveContextChips } from '../services/travelContextEngine';

// 🌟 마크다운 볼드(**굵게**), 줄바꿈, 이모지를 미려하게 파싱하는 헬퍼
function renderFormattedMessage(text = '') {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const renderedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldContent = part.slice(2, -2);
        return (
          <strong key={partIdx} style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
            {boldContent}
          </strong>
        );
      }
      return <span key={partIdx}>{part}</span>;
    });

    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {renderedLine}
      </React.Fragment>
    );
  });
}

export default function VoraAIChat({
  lang = 'ko',
  chatMessages = [],
  isLoading = false,
  onSendMessage,
  activeDay = 1,
  onSelectDay,
  currentUser = null,
  onViewTimeline,
  onConfirmItinerary,
  onAddPoiToItinerary,
  sessionContext = {},
  onRemoveContextChip,
  onToggleContextChip,
  onResetChat,
  onUpdateTimeSlot
}) {
  const handleTimelineClick = onConfirmItinerary || onViewTimeline;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
  const [dayTimeSlots, setDayTimeSlots] = useState({});
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
        
        // 🌟 항상 새로 도착한 메시지(어시스턴트 답변)로 화면을 온전히 스크롤하여 답변이 바로 보이게 처리!
        const targetElement = lastMsg?.id ? messageRefs.current[lastMsg.id] : null;

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 80);

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
        padding: '0.32rem 0.65rem',
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
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#059669',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            padding: '0.08rem 0.35rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>{t.chatStatusLive || (lang === 'en' ? 'Live Chat' : '실시간 1:1 대화중')}</span>
          </span>

          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              title={lang === 'en' ? 'Reset Conversation' : '대화 초기화 및 새 대화 시작'}
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#64748b',
                backgroundColor: 'rgba(241, 245, 249, 0.95)',
                border: '1px solid #cbd5e1',
                padding: '0.08rem 0.38rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.95)'; e.currentTarget.style.color = '#64748b'; }}
            >
              <span>🔄</span>
              <span>{lang === 'en' ? 'Reset' : '새 대화'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 📍 Active Context Chips Bar (현재 여행 조건 미니 캡슐 & 조건 추가 토글) */}
      {(() => {
        const activeChips = getActiveContextChips(sessionContext, lang);
        const allToggleOptions = [
          { id: 'kids', label: lang === 'en' ? '👨‍👩‍👧 Kids' : '👨‍👩‍👧 아이 동반' },
          { id: 'elder', label: lang === 'en' ? '🌿 Parents' : '🌿 부모님' },
          { id: 'rain', label: lang === 'en' ? '☔ Rain/Indoor' : '☔ 비/실내' },
          { id: 'minimal_walking', label: lang === 'en' ? '🚶 Minimal Walking' : '🚶 걷기 적게' },
          { id: 'cafe', label: lang === 'en' ? '☕ Cafe' : '☕ 감성 카페' },
          { id: 'foodie', label: lang === 'en' ? '🍴 Foodie' : '🍴 로컬 맛집' },
          { id: 'photo', label: lang === 'en' ? '📸 Photo' : '📸 인생샷' }
        ];

        return (
          <div style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderBottom: '1px solid rgba(37, 99, 235, 0.12)',
            zIndex: 10
          }}>
            <div style={{
              padding: '0.25rem 0.55rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.35rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  flexShrink: 0
                }}>
                  📍 {lang === 'en' ? 'Trip Filters:' : '현재 여행 조건:'}
                </span>

                {activeChips.length === 0 ? (
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    {lang === 'en' ? 'None (General Tour)' : '기본 (일반 관광)'}
                  </span>
                ) : (
                  activeChips.map(chip => (
                    <span
                      key={chip.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.12rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: `${chip.color}15`,
                        color: chip.color,
                        border: `1px solid ${chip.color}35`,
                        flexShrink: 0
                      }}
                    >
                      <span>{chip.label}</span>
                      {onRemoveContextChip && (
                        <button
                          onClick={() => onRemoveContextChip(chip.id)}
                          title={lang === 'en' ? 'Remove filter' : '조건 해제'}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: chip.color,
                            opacity: 0.8
                          }}
                        >
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {/* [ ＋ 조건 추가 ] 퀵 토글 버튼 */}
              <button
                type="button"
                onClick={() => setIsContextDropdownOpen(prev => !prev)}
                style={{
                  flexShrink: 0,
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.12rem 0.45rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>＋ {lang === 'en' ? 'Add' : '조건 추가'}</span>
              </button>
            </div>

            {/* 퀵 조건 추가 드롭다운/토글 바 */}
            {isContextDropdownOpen && (
              <div style={{
                padding: '0.4rem 0.65rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px dashed rgba(37, 99, 235, 0.15)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.35rem'
              }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginRight: '0.2rem' }}>
                  {lang === 'en' ? 'Quick Toggle:' : '원터치 추가:'}
                </span>
                {allToggleOptions.map(opt => {
                  const isChecked = activeChips.some(c => c.id === opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (onToggleContextChip) onToggleContextChip(opt.id);
                      }}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: isChecked ? 800 : 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        border: isChecked ? '1px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: isChecked ? '#2563eb' : '#ffffff',
                        color: isChecked ? '#ffffff' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isChecked ? `✓ ${opt.label}` : `＋ ${opt.label}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

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
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  borderRadius: '16px 16px 4px 16px',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          }

          // Assistant Message Bubble (좌측 중복 아바타 완전 삭제 -> 시원한 100% 풀와이드!)
          return (
            <div
              key={msg.id}
              ref={el => { if (el) messageRefs.current[msg.id] = el; }}
              style={{
                display: 'flex',
                marginBottom: '0.3rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflow: 'hidden' }}>
                {/* Assistant Text Bubble */}
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '18px',
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
                  {/* 🌟 Vora 인라인 1줄 슬림 뱃지: ⚡ Vora (N.N초) • HH:MM:SS */}
                  {(msg.generationTime || msg.itinerary?.generationTime || msg.replyTime || msg.timestamp) && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '8px',
                      marginBottom: '0.55rem'
                    }}>
                      <span style={{ fontWeight: 800 }}>
                        ⚡ Vora ({msg.generationTime || msg.itinerary?.generationTime || '0.9'}s)
                      </span>
                      {(msg.replyTime || msg.timestamp) && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.66rem' }}>
                          • {msg.replyTime || msg.timestamp}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.86rem' }}>
                    {renderFormattedMessage(msg.text)}
                  </div>

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
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              fontSize: '0.8rem',
                              color: 'var(--text-main)',
                              padding: '0.15rem 0'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                              <span style={{
                                fontWeight: 800,
                                color: '#2563eb',
                                flexShrink: 0
                              }}>
                                📍 {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                              </span>
                              {cleanTheme && (
                                <span style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                                  {cleanTheme}
                                </span>
                              )}
                            </div>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <select
                                value={dayTimeSlots[ds.day] || (ds.day === 1 && msg.itinerary?.arrivalTime && msg.itinerary.arrivalTime >= '13:00' ? `${msg.itinerary.arrivalTime} ~ 20:00` : (msg.itinerary?.dayTimeSlots?.[ds.day] || '09:00 ~ 18:00'))}
                                onChange={(e) => {
                                  const newTime = e.target.value;
                                  setDayTimeSlots(prev => ({ ...prev, [ds.day]: newTime }));
                                  if (msg.itinerary) {
                                    msg.itinerary.dayTimeSlots = { ...(msg.itinerary.dayTimeSlots || {}), [ds.day]: newTime };
                                    if (Number(ds.day) === 1) {
                                      msg.itinerary.arrivalTime = newTime.split('~')[0].trim();
                                    }
                                  }
                                  if (onUpdateTimeSlot) {
                                    onUpdateTimeSlot(ds.day, newTime, msg.itinerary);
                                  }
                                }}
                                style={{
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: '#2563eb',
                                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                  border: '1px solid rgba(37, 99, 235, 0.25)',
                                  padding: '0.16rem 1rem 0.16rem 0.35rem',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  outline: 'none',
                                  textAlign: 'center',
                                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 0.12rem center',
                                  backgroundSize: '10px'
                                }}
                              >
                                <option value="09:00 ~ 18:00">⏰ 09:00 ~ 18:00</option>
                                <option value="10:00 ~ 18:00">⏰ 10:00 ~ 18:00</option>
                                <option value="13:00 ~ 20:00">⏰ 13:00 ~ 20:00</option>
                                <option value="14:00 ~ 21:00">⏰ 14:00 ~ 21:00</option>
                                <option value="09:00 ~ 15:00">⏰ 09:00 ~ 15:00</option>
                                <option value="09:00 ~ 21:00">⏰ 09:00 ~ 21:00</option>
                              </select>
                            </div>
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

      {/* 🌟 단일화된 최신 맥락 전용 1줄 퀵 액션 바 (Unified Contextual Floating Bar) */}
      {!isLoading && (() => {
        const lastAssistantMsg = [...chatMessages].reverse().find(m => m.role === 'assistant');
        const isCurrentMsgItineraryCard = Boolean(lastAssistantMsg?.itinerary && lastAssistantMsg.itinerary.dailySchedules?.length > 0);
        const activeQuickSuggestions = lastAssistantMsg?.quickSuggestions || [];
        const hasSuggestions = activeQuickSuggestions.length > 0;
        let sourceChips = hasSuggestions ? [...activeQuickSuggestions] : [...(t.chatQuickModifications || [])];

        const defaultCreateLabel = lang === 'en' ? '🚀 Create Plan' : lang === 'ja' ? '🚀 日程生成' : (lang === 'zh' || lang === 'zht') ? '🚀 生成行程' : '🚀 바로 일정 만들기';

        // 🛡️ 중복 제거: 먼저 '바로 일정 만들기' 계열을 전부 걸러낸 순수 서브 칩 목록 추출
        const cleanSubChips = sourceChips.filter(c => 
          !c.includes('바로 일정') && 
          !c.includes('일정 생성') && 
          !c.includes('일정표 만들기') && 
          !c.includes('일정 짜줘') && 
          !c.includes('Create Plan') && 
          !c.includes('Generate Itinerary')
        );

        let finalChips = [];

        if (isCurrentMsgItineraryCard) {
          // 🌟 이미 일정이 완성된 상태: 헷갈리지 않게 순수 일정 수정 칩만 최대 3개 노출
          finalChips = cleanSubChips.length > 0 ? cleanSubChips.slice(0, 3) : [...(t.chatQuickModifications || [])].slice(0, 3);
        } else {
          // 🌟 온보딩/탐색 단계: 맨 앞(Index 0)에 [🚀 바로 일정 만들기]를 단 하나만 딱 배치하고, 뒤에 서브 칩 3개 연결 (중복 100% 원천 차단!)
          finalChips = [defaultCreateLabel, ...cleanSubChips.slice(0, 3)];
        }

        return (
          <div
            className="no-scrollbar"
            style={{
              padding: '0.3rem 0.55rem',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(37, 99, 235, 0.15)',
              display: 'flex',
              alignItems: 'center',
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
            {finalChips.map((chip, idx) => {
              const isBuildBtn = chip.includes('일정 생성') || chip.includes('바로 일정') || chip.includes('일정표 만들기') || chip.includes('일정 짜줘') || chip.includes('Create Plan') || chip.includes('Generate Itinerary');
              const displayLabel = isBuildBtn
                ? defaultCreateLabel
                : (hasSuggestions ? (chip.startsWith('✨') || chip.startsWith('🚀') || chip.startsWith('⚙️') || chip.startsWith('👑') || chip.startsWith('🌊') || chip.startsWith('🌴') || chip.startsWith('🏖️') || chip.startsWith('☀️') || chip.startsWith('🌤️') || chip.startsWith('🌙') || chip.startsWith('🗓️') || chip.startsWith('📍') || chip.startsWith('🌸') || chip.startsWith('🍁') || chip.startsWith('🏔️') || chip.startsWith('🌾') || chip.startsWith('🏮') ? chip : `✨ ${chip}`) : `＋ ${chip}`);

              return (
                <button
                  key={idx}
                  onClick={() => handleQuickChip(chip)}
                  style={{
                    flexShrink: 0,
                    background: isBuildBtn
                      ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                      : '#ffffff',
                    color: isBuildBtn ? '#ffffff' : 'var(--accent-primary)',
                    border: isBuildBtn ? 'none' : '1px solid rgba(37, 99, 235, 0.22)',
                    borderRadius: 'var(--radius-full)',
                    padding: isBuildBtn ? '0.24rem 0.65rem' : '0.2rem 0.55rem',
                    fontSize: isBuildBtn ? '0.74rem' : '0.7rem',
                    fontWeight: isBuildBtn ? 900 : 700,
                    cursor: 'pointer',
                    boxShadow: isBuildBtn ? '0 2px 8px rgba(37, 99, 235, 0.35)' : '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all var(--transition-fast)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isBuildBtn) {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isBuildBtn) {
                      e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.22)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        );
      })()}

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
            maxLength={300}
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

          {inputText.length > 200 && (
            <span style={{ fontSize: '0.68rem', color: inputText.length >= 300 ? '#ef4444' : '#94a3b8', marginRight: '0.35rem', fontWeight: 700 }}>
              {inputText.length}/300
            </span>
          )}

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
