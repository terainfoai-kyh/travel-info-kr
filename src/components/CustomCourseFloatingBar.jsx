import React from 'react';
import { MapPin, Sparkles, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function CustomCourseFloatingBar({ selectedCount = 0, onBuildRoute, onClear, lang = 'ko' }) {
  if (selectedCount <= 0) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const textCount = lang === 'ko' ? `📍 ${selectedCount}개 장소 선택됨` :
                    lang === 'ja' ? `📍 ${selectedCount}ヶ所選択中` :
                    lang === 'zh' ? `📍 已选择 ${selectedCount} 个景点` :
                    lang === 'zht' ? `📍 已選擇 ${selectedCount} 個景點` :
                    `📍 ${selectedCount} spots selected`;

  const textBuild = lang === 'ko' ? '✨ 최적 동선 코스 만들기' :
                    lang === 'ja' ? '✨ 最適ルートを作成' :
                    lang === 'zh' ? '✨ 生成最佳路线' :
                    lang === 'zht' ? '✨ 生成最佳路線' :
                    '✨ Generate Optimal Route';

  const textClear = lang === 'ko' ? '선택 취소' :
                    lang === 'ja' ? '解除' :
                    lang === 'zh' ? '取消' :
                    lang === 'zht' ? '取消' :
                    'Clear';

  return (
    <div 
      className="animate-slide-up"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 990,
        width: 'calc(100% - 2.5rem)',
        maxWidth: '560px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 'var(--radius-full)',
        padding: '0.6rem 1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
          {textCount}
        </span>
        <button
          onClick={onClear}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '0.72rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}
        >
          <X size={12} />
          <span>{textClear}</span>
        </button>
      </div>

      <button
        onClick={onBuildRoute}
        style={{
          background: 'var(--accent-gradient)',
          border: 'none',
          color: '#ffffff',
          fontSize: '0.88rem',
          fontWeight: 800,
          padding: '0.5rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
          whiteSpace: 'nowrap',
          transition: 'transform 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Sparkles size={16} />
        <span>{textBuild}</span>
      </button>
    </div>
  );
}
