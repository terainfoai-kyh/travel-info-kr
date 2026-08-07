import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIFloatingButton({ onOpenItinerary }) {
  return (
    <div className="ai-floating-btn-container" style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '0.4rem'
    }}>
      {/* Tooltip Badge */}
      <div className="ai-floating-badge" style={{
        background: 'rgba(15, 23, 42, 0.88)',
        color: '#38bdf8',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        backdropFilter: 'blur(8px)',
        padding: '0.3rem 0.7rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.73rem',
        fontWeight: 800,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        animation: 'bounce 2s infinite'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
        <span>3초 만에 1:1 맞춤 코스 완성!</span>
      </div>

      {/* Main Floating Action Button */}
      <button
        onClick={onOpenItinerary}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #818cf8 50%, #c084fc 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '0.85rem 1.35rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.9rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          boxShadow: '0 6px 24px rgba(129, 140, 248, 0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(129, 140, 248, 0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(129, 140, 248, 0.5)';
        }}
        title="AI 여행 코스 플래너 열기"
      >
        <Sparkles size={18} className="animate-spin" style={{ animationDuration: '4s' }} />
        <span>✨ AI 코스 추천</span>
      </button>
    </div>
  );
}
