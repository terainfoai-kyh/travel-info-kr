import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Camera, 
  Sparkles, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { getGooglePlaceSearchUrl, getKakaoMapSearchUrl } from '../services/geminiNlpService';

export default function TravelDetailModal({ spot, onClose }) {
  if (!spot) return null;

  const title = spot.title || spot.name || '추천 여행 명소';
  const location = spot.location || spot.address || spot.addr1 || '대한민국 서울 일대';
  const description = spot.description || spot.overview || spot.theme || 'VORA AI가 엄선한 한국의 대표적인 핫플레이스입니다.';
  const rating = spot.rating || 4.9;

  const photoList = (spot.images && spot.images.length > 0) 
    ? spot.images 
    : [spot.image || 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const currentPhoto = photoList[activePhotoIdx] || photoList[0];

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev === photoList.length - 1 ? 0 : prev + 1));
  };

  const googleMapUrl = getGooglePlaceSearchUrl(title, location);
  const kakaoMapUrl = getKakaoMapSearchUrl(title, location);
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(title + ' ' + location)}`;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden'
        }}
      >
        {/* Bright Hero Photo Container */}
        <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
          <img
            src={currentPhoto}
            alt={`${title} 사진 ${activePhotoIdx + 1}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.25s ease-in-out'
            }}
            onError={(e) => { e.currentTarget.src = 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'; }}
          />

          {/* Light Bottom Gradient (Keeps photos bright & sunny!) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 60%)'
          }} />

          {/* Top Left: Multi-Photo Counter Badge */}
          {photoList.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <ImageIcon size={12} />
              <span>{activePhotoIdx + 1} / {photoList.length}</span>
            </div>
          )}

          {/* Top Right: Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <X size={18} />
          </button>

          {/* Navigation Arrows for Multi-Photos */}
          {photoList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Bottom Title & Category Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            left: '16px',
            right: '16px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <span style={{
                backgroundColor: 'var(--accent-primary)',
                padding: '0.18rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {spot.category || spot.theme || '추천 명소'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800 }}>
                <Star size={13} fill="#f59e0b" />
                <span>{rating}</span>
              </div>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
            }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.2rem 1.4rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Multi-Photo Thumbnails Row */}
          {photoList.length > 1 && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Camera size={13} style={{ color: 'var(--accent-primary)' }} />
                <span>한국관광공사 공식 갤러리 ({photoList.length}장의 사진)</span>
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.3rem'
              }}>
                {photoList.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      border: idx === activePhotoIdx ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      padding: 0,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      width: '64px',
                      height: '48px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      opacity: idx === activePhotoIdx ? 1 : 0.65,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <img
                      src={p}
                      alt={`${title} 썸네일 ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location & Transit Info Bar */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
              <MapPin size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{location}</span>
            </div>
            {spot.transitTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                <Navigation size={14} style={{ flexShrink: 0 }} />
                <span>{spot.transitTime}</span>
              </div>
            )}
            {spot.bestTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>
                <Clock size={14} style={{ flexShrink: 0 }} />
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
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {spot.photoTip && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Camera size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {spot.photoTip}
                  </span>
                </div>
              )}
              {spot.signatureItem && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Sparkles size={15} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {spot.signatureItem}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Magazine Editor Overview */}
          <div>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ✨ 에디터 상세 가이드
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.86rem',
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
              padding: '0.85rem 1rem',
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
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
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
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
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
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🗺️ 길찾기 & 실시간 지도 연동
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 0.7rem',
                  fontSize: '0.78rem',
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
                  padding: '0.6rem 0.7rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>카카오맵</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#03c75a',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 0.7rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>네이버지도</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
