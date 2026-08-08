import React, { useState } from 'react';
import { X, Heart, Trash2, Share2, Copy, Check, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';

export default function WishlistDrawer({ isOpen, onClose, wishlistSpots, onRemoveWishlist, onSelectSpot, lang }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const handleShareLink = () => {
    const spotIds = wishlistSpots.map(s => s.id).join(',');
    const shareUrl = `${window.location.origin}/?wishlist=${encodeURIComponent(spotIds)}`;

    if (navigator.share) {
      navigator.share({
        title: 'K-Travel Explorer - 내 찜한 여행 코스',
        text: `대한민국 추천 여행지 ${wishlistSpots.length}곳 코스를 공유합니다!`,
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
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in glass-panel"
        style={{
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-highlight)',
          width: '100%',
          maxWidth: 'min(460px, 100vw)',
          height: '100dvh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444'
            }}>
              <Heart size={22} fill="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                찜한 여행지 목록
              </h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                총 {wishlistSpots.length}개의 명소 담김
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="닫기"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Action Header */}
        {wishlistSpots.length > 0 && (
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              카톡/SNS로 코스 공유하기
            </span>
            <button
              onClick={handleShareLink}
              style={{
                background: copied ? '#22c55e' : 'var(--accent-gradient)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? '링크 복사완료!' : '코스 1클릭 공유'}</span>
            </button>
          </div>
        )}

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {wishlistSpots.length > 0 ? (
            wishlistSpots.map(spot => (
              <div 
                key={spot.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectSpot(spot)}
              >
                <div style={{ width: '68px', height: '68px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  <TravelImageWithFallback 
                    src={spot.image} 
                    spotTitle={spot.title}
                    lang={lang}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {spot.region || '한국'}
                  </span>
                  <h4 style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    margin: '0.1rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {spot.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} color="var(--accent-primary)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {spot.location || spot.addr1 || '대한민국'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWishlist(spot.id);
                  }}
                  title="삭제"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Heart size={48} color="var(--text-dim)" opacity={0.4} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                아직 찜한 여행지가 없습니다.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '280px' }}>
                관광지 카드의 하트(❤️) 버튼을 눌러 나만의 특별한 한국 여행 코스를 완성해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
