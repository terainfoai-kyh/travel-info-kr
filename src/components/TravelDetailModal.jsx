import React from 'react';
import { X, MapPin, Phone, Clock, ExternalLink, Star, Heart, Navigation } from 'lucide-react';
import { getGooglePlaceSearchUrl, getKakaoMapSearchUrl } from '../services/geminiNlpService';
import { getCloseButtonLabel } from '../i18n/translations';

export default function TravelDetailModal({
  spot = null,
  onClose,
  lang = 'ko',
  isBookmarked = false,
  onToggleBookmark
}) {
  if (!spot) return null;

  const title = spot.title || '추천 여행지';
  const location = spot.location || spot.addr1 || '상세 주소 정보';
  const image = spot.image || spot.firstimage || '/default-spot.png';
  const rating = spot.rating || 4.9;
  const overview = spot.overview || spot.theme || `${spot.region || '한국'}의 대표적인 핫플레이스입니다.`;

  const googleMapUrl = getGooglePlaceSearchUrl(title, spot.region || '');
  const kakaoMapUrl = getKakaoMapSearchUrl(title, spot.region || '');
  const tmapUrl = `tmap://search?name=${encodeURIComponent(title)}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        maxWidth: '640px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {/* Header Photo Container */}
        <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = '/default-spot.png'; }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={18} />
          </button>

          {/* Bottom Title Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <span style={{
                backgroundColor: 'var(--accent-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {spot.category || spot.theme || '추천 명소'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800 }}>
                <Star size={13} fill="#f59e0b" />
                <span>{rating}</span>
              </div>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Location & Contact Info */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{location}</span>
            </div>
            {spot.tel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Phone size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>{spot.tel}</span>
              </div>
            )}
            {spot.transitTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                <Navigation size={15} style={{ flexShrink: 0 }} />
                <span>{spot.transitTime}</span>
              </div>
            )}
          </div>

          {/* Photo Tip & Signature Item Box */}
          {(spot.photoTip || spot.signatureItem) && (
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '16px',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              {spot.photoTip && (
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {spot.photoTip}
                </div>
              )}
              {spot.signatureItem && (
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {spot.signatureItem}
                </div>
              )}
            </div>
          )}

          {/* Overview */}
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              장소 소개 및 매력 포인트
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              whiteSpace: 'pre-line'
            }}>
              {overview}
            </p>
          </div>

          {/* Navigation & Map Direct Buttons */}
          <div>
            <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🗺️ 길찾기 & 지도 앱 연동
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>Google 지도</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#fee500',
                  color: '#191919',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>카카오맵 길찾기</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={tmapUrl}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>티맵 (T-Map)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => onToggleBookmark(spot)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: isBookmarked ? '#ef4444' : 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 1rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Heart size={16} fill={isBookmarked ? '#ef4444' : 'none'} />
            <span>{isBookmarked ? '위시리스트 저장됨 ❤️' : '위시리스트 추가'}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {getCloseButtonLabel(lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
