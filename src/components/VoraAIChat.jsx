import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, Share2, CornerDownRight, Utensils, Navigation } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function VoraAIChat({
  lang = 'ko',
  itineraryData = null,
  isLoading = false,
  onSendMessage,
  activeDay = 1,
  onSelectDay
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopyItinerary = () => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        padding: '0.75rem 1.1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src="/logo.png"
            alt="VORA"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        {itineraryData && (
          <button
            onClick={handleCopyItinerary}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            <span>{copied ? (t.chatCopied || '복사됨') : (t.chatCopyItinerary || '전체 일정 복사')}</span>
          </button>
        )}
      </div>

      {/* Chat Message Stream */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Welcome Intro Message */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            flexShrink: 0
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.55, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
              {t.chatWelcome || '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA입니다.'}
            </p>
          </div>
        </div>

        {/* Live Loading Skeleton while AI generates */}
        {isLoading && (
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            animation: 'pulse 1.8s infinite'
          }}>
            <div className="spin-animation" style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '3px solid var(--accent-primary)',
              borderTopColor: 'transparent'
            }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {t.chatThinking || 'AI가 동선과 핫플레이스를 분석하여 최적의 일정을 설계 중입니다...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                한국관광공사 Official API & Google Maps 좌표 실시간 동기화 중
              </div>
            </div>
          </div>
        )}

        {/* Master AI Generated Itinerary Response */}
        {itineraryData && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Overview Summary Box */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>✨</span>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  {itineraryData.tripTitle}
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.55, color: 'var(--text-main)' }}>
                {itineraryData.summary}
              </p>
            </div>

            {/* Daily Schedule Highlight Cards (Click to sync right-hand map & timeline) */}
            {(itineraryData.dailySchedules || []).map((ds) => {
              const isCurrentActive = Number(activeDay) === Number(ds.day);
              return (
                <div
                  key={ds.day}
                  onClick={() => onSelectDay && onSelectDay(ds.day)}
                  style={{
                    backgroundColor: isCurrentActive ? 'rgba(37, 99, 235, 0.04)' : 'var(--bg-primary)',
                    border: isCurrentActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isCurrentActive ? '0 4px 12px rgba(37,99,235,0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      backgroundColor: isCurrentActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      color: '#ffffff',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                    </span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {ds.theme}
                    </span>
                  </div>

                  {/* Spot Flow Badges */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-main)'
                  }}>
                    {(ds.spots || []).map((s, idx) => (
                      <React.Fragment key={s.id || idx}>
                        <span style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {idx + 1}. {s.title}
                        </span>
                        {idx < (ds.spots || []).length - 1 && (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Daily Food Recommendation Badge */}
                  {ds.foodRecommendation && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      color: '#b45309',
                      fontWeight: 700
                    }}>
                      <Utensils size={13} style={{ color: '#d97706', flexShrink: 0 }} />
                      <span><strong>{ds.foodRecommendation.dishName}</strong>: {ds.foodRecommendation.description}</span>
                    </div>
                  )}

                  {/* Transit Tip */}
                  {ds.transitTip && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      <Navigation size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span>{ds.transitTip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Follow-up Quick Modification Chips */}
      {itineraryData && !isLoading && (
        <div style={{
          padding: '0.45rem 0.9rem',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.35rem',
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
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
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
          padding: '0.75rem 0.9rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-glass)'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'ko' ? "추가 질문이나 일정 수정 요청을 적어주세요..." : "Type adjustments or follow-up questions..."}
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '0.55rem 1rem',
            fontSize: '0.84rem',
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
            width: '36px',
            height: '36px',
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
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
