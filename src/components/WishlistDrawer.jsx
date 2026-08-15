import React, { useState } from 'react';
import { X, Heart, Trash2, Share2, Copy, Check, ExternalLink, MapPin, Sparkles, Compass } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';
import { useModalHistory } from '../hooks/useModalHistory';

export default function WishlistDrawer({ isOpen, onClose, wishlistSpots = [], onRemoveWishlist, onSelectSpot, lang = 'ko' }) {
  useModalHistory(isOpen, onClose, 'wishlist-drawer');

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const handleShareLink = () => {
    const spotIds = (wishlistSpots || []).map(s => s.id || s.contentId || s.title).join(',');
    const shareUrl = `${window.location.origin}/?wishlist=${encodeURIComponent(spotIds)}`;

    if (navigator.share) {
      navigator.share({
        title: 'Vora AI - 내 찜한 여행 코스',
        text: `대한민국 맞춤 여행지 ${wishlistSpots.length}곳 코스를 공유합니다!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderLeft: '1.5px solid #e2e8f0',
          width: '100%',
          maxWidth: 'min(460px, 100vw)',
          height: '100dvh',
          overflowY: 'auto',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.12)',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Soft Lavender Gradient */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.1rem',
          borderBottom: '1.5px solid #f1f5f9',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.5rem',
              borderRadius: '12px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.15)'
            }}>
              <Heart size={22} fill="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                내 찜한 여행지 목록
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                총 <strong style={{ color: '#7c3aed' }}>{wishlistSpots.length}</strong>곳의 명소 저장됨
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.closeBtn || '닫기'}
            style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Share Action Header */}
        {wishlistSpots.length > 0 && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            border: '1.5px solid #e2e8f0',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
              카톡/SNS로 찜 코스 공유하기
            </span>
            <button
              onClick={handleShareLink}
              style={{
                background: copied ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? '링크 복사완료!' : '1클릭 공유'}</span>
            </button>
          </div>
        )}

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {wishlistSpots.length > 0 ? (
            wishlistSpots.map((spot, idx) => (
              <div 
                key={spot.id || spot.contentId || idx}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
                onClick={() => onSelectSpot && onSelectSpot(spot)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#d8b4fe';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                  <TravelImageWithFallback 
                    src={spot.image} 
                    spotTitle={spot.title}
                    lang={lang}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                      {spot.region || '추천'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>
                      ★ {spot.rating || 4.9}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    margin: '0.1rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {spot.title}
                  </h4>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {spot.location || spot.addr1 || '대한민국 관광 명소'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveWishlist) {
                      onRemoveWishlist(spot.id || spot.contentId || spot.title);
                    }
                  }}
                  title={t.deleteBtn || '삭제'}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.45rem',
                    borderRadius: '10px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = '#fecaca';
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <div style={{
                backgroundColor: '#f1f5f9',
                padding: '1.25rem',
                borderRadius: '50%',
                color: '#94a3b8'
              }}>
                <Compass size={38} strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                아직 찜한 여행지가 없습니다
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '280px', lineHeight: 1.6, margin: 0 }}>
                명소 상세창에서 <strong>[즐겨찾기 저장]</strong> 버튼을 누르면 나만의 특별한 여행 코스로 담깁니다!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
