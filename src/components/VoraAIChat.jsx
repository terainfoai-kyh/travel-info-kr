import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, Share2, Send, Utensils, Navigation, Info, RefreshCw } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function VoraAIChat({
  lang = 'ko',
  itineraryData = null,
  isLoading = false,
  onSendMessage
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  const handleCopy = () => {
    if (!itineraryData) return;
    const textToCopy = `${itineraryData.tripTitle || 'VORA AI 여행 코스'}\n\n${itineraryData.summary || ''}\n\n` +
      (itineraryData.dailySchedules || []).map(ds => 
        `[${ds.day}일차] ${ds.theme}\n- 코스: ${(ds.spots || []).map(s => s.title).join(' ➔ ')}\n- 미식: ${ds.foodRecommendation?.dishName || '추천 맛집'}\n- 팁: ${ds.transitTip || ''}`
      ).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
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
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.chatTitle || 'Vora AI 컨시어지 대화'}
            </h3>
          </div>
        </div>

        {itineraryData && (
          <button
            onClick={handleCopy}
            title={t.chatCopyItinerary || 'Copy'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copied ? (t.chatCopied || '복사됨') : (t.chatCopyItinerary || '일정 복사')}</span>
          </button>
        )}
      </div>

      {/* Chat Messages Body */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        minHeight: '380px',
        maxHeight: '620px'
      }}>
        {/* Welcome Message if no itinerary yet */}
        {!itineraryData && !isLoading && (
          <div style={{
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '18px',
            padding: '1.25rem',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            <p style={{ margin: 0, whiteSpace: 'pre-line', fontWeight: 600 }}>
              {t.chatWelcome || '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA입니다. 😊\n가고 싶은 도시나 원하는 여행 스타일을 편하게 말씀해주세요!'}
            </p>
          </div>
        )}

        {/* Live Loading Indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            borderRadius: '16px',
            border: '1px solid var(--border-highlight)'
          }}>
            <RefreshCw size={18} className="spin-animation" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {t.chatThinking || '최적의 동선과 핫플레이스를 분석 중입니다...'}
            </span>
          </div>
        )}

        {/* Formatted Itinerary Result Message */}
        {itineraryData && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Trip Title & AI Narrative Summary */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span>✨</span>
                <span>{itineraryData.tripTitle}</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                whiteSpace: 'pre-line',
                fontWeight: 500
              }}>
                {itineraryData.summary}
              </p>
            </div>

            {/* Daily Schedule Highlight Cards */}
            {(itineraryData.dailySchedules || []).map((ds) => (
              <div
                key={ds.day}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {ds.theme}
                  </span>
                </div>

                {/* Spot Flow Badges */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-main)'
                }}>
                  {(ds.spots || []).map((s, idx) => (
                    <React.Fragment key={s.id || idx}>
                      <span style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '8px'
                      }}>
                        {idx + 1}. {s.title}
                      </span>
                      {idx < (ds.spots || []).length - 1 && (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Daily Food Recommendation Badge */}
                {ds.foodRecommendation && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    color: '#b45309',
                    fontWeight: 700
                  }}>
                    <Utensils size={14} style={{ color: '#d97706', flexShrink: 0 }} />
                    <span><strong>{ds.foodRecommendation.dishName}</strong>: {ds.foodRecommendation.description}</span>
                  </div>
                )}

                {/* Transit Tip */}
                {ds.transitTip && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}>
                    <Navigation size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{ds.transitTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Modification Chips & Follow-Up Input */}
      <div style={{
        padding: '0.85rem 1.15rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)'
      }}>
        {/* Quick Modification Suggestion Chips */}
        {itineraryData && !isLoading && (
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.4rem',
            paddingBottom: '0.65rem',
            scrollbarWidth: 'none'
          }}>
            {(t.chatQuickModifications || []).map((modText, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(modText)}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                + {modText}
              </button>
            ))}
          </div>
        )}

        {/* Follow-Up Chat Input */}
        <form onSubmit={handleFollowUpSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={itineraryData ? '추가 질문이나 일정 수정 요청을 적어주세요...' : (t.searchPlaceholder || '여행 질문을 입력하세요...')}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading || !inputVal.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputVal.trim() ? 0.5 : 1
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
