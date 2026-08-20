import React from 'react';
import { X, Heart, Trash2, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { generateGoogleMapsRouteUrl } from '../services/geminiNlpService';

export default function WishlistDrawer({
  isOpen = false,
  onClose,
  wishlistSpots = [],
  onRemoveWishlist,
  onSelectSpot,
  lang = 'ko'
}) {
  if (!isOpen) return null;

  const fullRouteUrl = generateGoogleMapsRouteUrl(wishlistSpots);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        borderLeft: '1px solid var(--border-color)',
        animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} style={{ color: '#ef4444', fill: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
              저장한 여행지 ({wishlistSpots.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer List Body */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {wishlistSpots.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '2rem'
            }}>
              <Heart size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>
                아직 저장된 여행지가 없습니다.
              </p>
              <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                관광지 카드의 하트(❤️) 버튼을 눌러 나만의 위시리스트를 모아보세요!
              </p>
            </div>
          ) : (
            wishlistSpots.map((spot, idx) => (
              <div
                key={spot.id || idx}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={spot.image || '/default-spot.png'}
                  alt={spot.title}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                  onError={(e) => { e.currentTarget.src = '/default-spot.png'; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    onClick={() => {
                      onClose();
                      onSelectSpot(spot);
                    }}
                    style={{
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {spot.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {spot.location || spot.region || '한국'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveWishlist(spot.id || spot.contentId || spot.title)}
                  title="삭제"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    borderRadius: '6px'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {wishlistSpots.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-glass)'
          }}>
            <a
              href={fullRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '12px',
                padding: '0.75rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Navigation size={16} />
              <span>구글맵에서 위시리스트 전체 코스 길찾기</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
