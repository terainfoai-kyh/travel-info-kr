import React from 'react';
import { X, MapPin, Phone, Clock, ExternalLink, Star, Heart, Navigation, Sparkles, Coffee, Camera } from 'lucide-react';
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
  const location = spot.location || spot.addr1 || '상세 위치 정보 제공';
  const image = spot.image || '/default-spot.png';
  const rating = spot.rating || 4.9;
  const description = spot.description || spot.overview || spot.theme || `${title}은 ${spot.region || '한국'}에서 가장 트렌디하고 매력적인 감성을 느낄 수 있는 대표 명소입니다.`;

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
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
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
          {/* Deep Gradient for Crystal Clear Text Readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <X size={18} />
          </button>

          {/* Bottom Title & Category Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{
                backgroundColor: 'var(--accent-primary)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800
              }}>
                {spot.category || spot.theme || '추천 명소'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 800 }}>
                <Star size={14} fill="#f59e0b" />
                <span>{rating}</span>
              </div>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
            }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Location & Transit Info Bar */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{location}</span>
            </div>
            {spot.transitTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                <Navigation size={15} style={{ flexShrink: 0 }} />
                <span>{spot.transitTime}</span>
              </div>
            )}
            {spot.bestTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#b45309', fontWeight: 700 }}>
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>추천 방문: {spot.bestTime}</span>
              </div>
            )}
          </div>

          {/* Photo Tip & Signature Highlights Card */}
          {(spot.photoTip || spot.signatureItem) && (
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem'
            }}>
              {spot.photoTip && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Camera size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {spot.photoTip}
                  </span>
                </div>
              )}
              {spot.signatureItem && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Sparkles size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {spot.signatureItem}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Magazine Editor Overview */}
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ✨ 에디터 상세 가이드
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              lineHeight: 1.65,
              color: 'var(--text-main)',
              whiteSpace: 'pre-line'
            }}>
              {description}
            </p>
          </div>

          {/* Smart Affiliate Deal Card */}
          {spot.affiliateDeal && (
            <div style={{
              backgroundColor: 'rgba(255, 91, 0, 0.08)',
              border: '1px solid rgba(255, 91, 0, 0.3)',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.8rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{
                  backgroundColor: '#ff5b00',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}>
                  {spot.affiliateDeal.dealBadge}
                </span>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {spot.affiliateDeal.dealTitle}
                </div>
              </div>

              <a
                href={spot.affiliateDeal.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ff5b00',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 2px 6px rgba(255, 91, 0, 0.3)'
                }}
              >
                <span>최저가 예약 ↗</span>
              </a>
            </div>
          )}

          {/* Navigation & Map Direct Buttons */}
          <div>
            <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🗺️ 길찾기 & 실시간 지도 연동
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-glow)'
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

        {/* Modal Footer Actions */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <button
            onClick={() => onToggleBookmark && onToggleBookmark(spot)}
            style={{
              backgroundColor: isBookmarked ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
              border: `1px solid ${isBookmarked ? '#ef4444' : 'var(--border-color)'}`,
              color: isBookmarked ? '#ef4444' : 'var(--text-main)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Heart size={16} fill={isBookmarked ? '#ef4444' : 'none'} />
            <span>{isBookmarked ? '위시리스트 저장됨' : '위시리스트 추가'}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.4rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {getCloseButtonLabel(lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
