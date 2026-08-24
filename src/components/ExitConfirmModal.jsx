import React from 'react';
import { Sparkles, MapPin, Bookmark, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ExitConfirmModal
 * AI 플래너에서 미저장 상태로 이탈하려 할 때 1회성으로 명쾌하게 물어보는 스마트 모달
 * - [ 💾 저장하고 이동 ] -> 쿼터 1회 차감 & [내 여행] 저장 후 이동
 * - [ 🚪 그냥 나가기 ] -> 쿼터 차감 없이 즉시 이동
 * - [ ✕ 계속 작성하기 ] -> 취소
 */
export default function ExitConfirmModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onJustExit,
  itineraryData,
  lang = 'ko',
  remainingQuota = 3
}) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const targetCity = itineraryData?.targetCity || '서울';
  const tripTitle = itineraryData?.tripTitle || `${targetCity} 여행 일정`;
  const spotsCount = itineraryData?.spots?.length || (itineraryData?.dailySchedules?.reduce((acc, d) => acc + (d.spots?.length || 0), 0)) || 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
          position: 'relative',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 X 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.1rem',
            right: '1.1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* 헤더 뱃지 & 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)'
          }}>
            <Bookmark size={24} />
          </div>

          <h3 style={{
            margin: '0.35rem 0 0 0',
            fontSize: '1.18rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)'
          }}>
            {t.exitModalTitle || '작성 중인 여행 일정이 있습니다'}
          </h3>

          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.45,
            wordBreak: 'keep-all'
          }}>
            {t.exitModalDesc || '지금 나가시면 작성 중인 일정이 사라질 수 있습니다. [내 여행]에 저장하고 이동하시겠습니까?'}
          </p>
        </div>

        {/* 작성 중인 여행 요약 미니 카드 */}
        <div style={{
          backgroundColor: 'var(--bg-glass, #f8fafc)',
          borderRadius: '16px',
          padding: '0.85rem 1rem',
          border: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#dbeafe',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tripTitle}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '0.15rem' }}>
              📍 {targetCity} • {spotsCount > 0 ? `${spotsCount}개 추천 스팟` : '맞춤 AI 동선'}
            </div>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.35rem' }}>
          {/* 1. 저장하고 이동 (주요 CTA) */}
          <button
            onClick={onSaveAndExit}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Sparkles size={16} />
            <span>{t.exitModalSaveAndExit || '💾 저장하고 이동 (1회 차감)'}</span>
          </button>

          {/* 2. 그냥 나가기 (서브 버튼) */}
          <button
            onClick={onJustExit}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              backgroundColor: 'transparent',
              color: 'var(--text-main, #334155)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'background-color 0.15s ease'
            }}
          >
            <span>{t.exitModalJustExit || '🚪 그냥 나가기'}</span>
          </button>

          {/* 3. 취소 (계속 작성) */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.45rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '0.2rem'
            }}
          >
            {t.exitModalCancel || '✕ 계속 작성하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
