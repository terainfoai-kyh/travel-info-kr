import React from 'react';
import { Sparkles, Mic, MessageSquare, Compass } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function FloatingAIDock({
  lang = 'ko',
  onOpenChat,
  onStartVoice,
  isChatExpanded = false
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <div
      className="floating-ai-dock-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.5rem 0.75rem 0.5rem 1.1rem',
        borderRadius: '9999px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '92vw',
        width: 'fit-content'
      }}
    >
      {/* Live AI Pulse Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }} onClick={onOpenChat}>
        <div style={{
          position: 'relative',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)'
        }}>
          <Sparkles size={14} color="#ffffff" style={{ animation: 'spin 3s linear infinite' }} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            border: '2px solid #0f172a'
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{t.floatingAiDockBtn || 'K-Travel AI 대화하기'}</span>
            <Compass size={13} color="#93c5fd" />
          </span>
          <span style={{
            color: '#94a3b8',
            fontSize: '0.65rem',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            {t.floatingAiDockSub || '언제든 말이나 글로 1:1 대화'}
          </span>
        </div>
      </div>

      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 0.1rem' }} />

      {/* Voice Mic Button */}
      <button
        onClick={onStartVoice}
        title={t.voiceBtnTooltip || '말하여 질문하기 🎙️'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          transition: 'transform 0.2s ease',
          flexShrink: 0
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Mic size={16} />
      </button>

      {/* Quick Chat Open Button */}
      <button
        onClick={onOpenChat}
        title={t.openChatTooltip || 'AI 대화창 열기 💬'}
        style={{
          padding: '0.4rem 0.8rem',
          borderRadius: '9999px',
          border: 'none',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
      >
        <MessageSquare size={14} />
        <span>{isChatExpanded ? '대화 중' : '대화 열기'}</span>
      </button>
    </div>
  );
}
