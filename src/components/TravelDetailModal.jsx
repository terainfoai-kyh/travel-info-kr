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
  Copy,
  Check,
  Ticket,
  Car
} from 'lucide-react';
import { getGooglePlaceSearchUrl, getKakaoMapSearchUrl, getNaverMapSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 지피티 3.0 프리미엄 실용 카드 완성형
 * 
 * 1. 4K 고화질 사진 갤러리 슬라이더 (1/8) + 단일 명소명 & 별점
 * 2. 3대 핵심 실용 정보: [🕒 운영시간·휴무일] [💰 입장료] [📍 주소 & 지하철]
 * 3. ✨ 에디터 꿀팁 & 감성 포토존
 * 4. 하단 3대 액션 바: [ 🗺️ 구글맵 길찾기 ] + [ 🎟️ 한복/티켓 예약 ] + [ 🚕 택시 주소 복사 ]
 * ==============================================================================
 */

export default function TravelDetailModal({ spot, onClose, lang = 'ko' }) {
  if (!spot) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 단일 명소명 정제 (& 또는 / 제거)
  const rawTitle = spot.title || spot.name || '추천 여행 명소';
  const cleanTitle = rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();

  const location = spot.location || spot.address || spot.addr1 || (lang === 'en' ? 'Seoul, Republic of Korea' : lang === 'ja' ? '韓国・ソウル' : (lang === 'zh' || lang === 'zht') ? '韩国 首尔' : '대한민국 서울 일대');
  const description = spot.description || spot.overview || spot.theme || (lang === 'en' ? 'Carefully curated popular Korean hotspot by VORA AI.' : lang === 'ja' ? 'VORA AIが厳選した韓国の人気スポットです。' : (lang === 'zh' || lang === 'zht') ? 'VORA AI为您精心推荐的韩国精选热门打卡地。' : 'VORA AI가 엄선한 한국의 대표적인 핫플레이스입니다.');
  const rating = spot.rating || 4.8;

  const [isCopied, setIsCopied] = useState(false);

  // 택시 기사님께 보여주기용 한글 주소 복사
  const handleCopyKoreanAddress = () => {
    const addressToCopy = spot.addr1 || spot.address || `${cleanTitle}, ${location}`;
    navigator.clipboard?.writeText(addressToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const affiliateDeal = spot.affiliateDeal
    ? getSpotAffiliateDeal(cleanTitle, spot.region || spot.city || '서울', lang)
    : null;

  // 고화질 사진 리스트
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

  const googleMapUrl = getGooglePlaceSearchUrl(cleanTitle, location);

  // 운영시간 & 요금 기본값
  const operatingHours = spot.operatingHours || spot.usetime || '09:00 ~ 18:00 (입장마감 17:00)';
  const closedDays = spot.closedDays || spot.restdate || (lang === 'en' ? 'Open Year-Round' : lang === 'ja' ? '年中無休' : (lang === 'zh' || lang === 'zht') ? '全年无休' : '연중무휴');
  const admissionFee = spot.fee || spot.usefee || (lang === 'en' ? 'Free Admission (Special programs may vary)' : lang === 'ja' ? '入場無料 (特別体験は別途)' : (lang === 'zh' || lang === 'zht') ? '免费参观 (特别体验另计)' : '무료 관람 (특별 체험 별도)');

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* 1. 4K High-Res Hero Photo Container */}
        <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
          <img
            src={currentPhoto}
            alt={`${cleanTitle} ${activePhotoIdx + 1}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.2s ease'
            }}
            onError={(e) => { e.currentTarget.src = 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'; }}
          />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)'
          }} />

          {/* Top Left: Photo Counter Badge */}
          {photoList.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '0.2rem 0.55rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              📷 {activePhotoIdx + 1} / {photoList.length}
            </div>
          )}

          {/* Top Right: Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)'
            }}
          >
            <X size={17} />
          </button>

          {/* Photo Navigation Arrows */}
          {photoList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Bottom Title & Category Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span style={{
                backgroundColor: '#2563eb',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 900
              }}>
                {spot.category || spot.theme || (lang === 'en' ? 'Top Attraction' : lang === 'ja' ? '人気スポット' : '精选景点')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 900 }}>
                <Star size={13} fill="#f59e0b" />
                <span>{rating}</span>
              </div>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
            }}>
              {cleanTitle}
            </h2>
          </div>
        </div>

        {/* 2. Modal Body (스크롤 최적화) */}
        <div style={{
          padding: '1rem 1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {/* 3대 핵심 실용 정보 카드 */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '0.75rem 0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            fontSize: '0.82rem'
          }}>
            {/* 운영시간 및 휴무일 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <Clock size={15} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Hours: ' : lang === 'ja' ? '営業時間: ' : (lang === 'zh' || lang === 'zht') ? '营业时间: ' : '운영시간: '}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{operatingHours}</span>
                <span style={{ marginLeft: '0.4rem', color: '#ef4444', fontWeight: 700 }}>({closedDays})</span>
              </div>
            </div>

            {/* 입장료 / 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <Ticket size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Admission: ' : lang === 'ja' ? '入場料: ' : (lang === 'zh' || lang === 'zht') ? '门票: ' : '입장료: '}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{admissionFee}</span>
              </div>
            </div>

            {/* 정확한 위치 및 대중교통 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <MapPin size={15} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Address: ' : lang === 'ja' ? '住所: ' : (lang === 'zh' || lang === 'zht') ? '地址: ' : '주소: '}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{location}</span>
              </div>
            </div>
          </div>

          {/* ✨ 1줄 에디터 꿀팁 & 포토존 뱃지 */}
          <div style={{
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: '14px',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#2563eb'
          }}>
            <Sparkles size={15} style={{ flexShrink: 0 }} />
            <span>
              {spot.photoTip || (lang === 'en' ? 'Best Photo Spot: Traditional Hanbok snaps around the main courtyard' : lang === 'ja' ? 'おすすめフォトスポット: 韓服を着てメイン広場での記念撮影' : '추천 꿀팁: 메인 포토존에서의 한복 인생샷 촬영 추천')}
            </span>
          </div>

          {/* 에디터 간결 가이드 */}
          <div>
            <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {lang === 'en' ? '✨ Overview' : lang === 'ja' ? '✨ スポット概要' : (lang === 'zh' || lang === 'zht') ? '✨ 景点简介' : '✨ 에디터 상세 가이드'}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.82rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              whiteSpace: 'pre-line'
            }}>
              {description}
            </p>
          </div>

          {/* 3대 원클릭 액션 버튼 바 */}
          <div style={{
            marginTop: '0.35rem',
            display: 'grid',
            gridTemplateColumns: affiliateDeal ? '1fr 1fr 1fr' : '1fr 1fr',
            gap: '0.45rem'
          }}>
            {/* 1. 구글맵 길찾기 */}
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '10px',
                padding: '0.6rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>{lang === 'en' ? 'Google Maps' : lang === 'ja' ? 'Googleマップ' : (lang === 'zh' || lang === 'zht') ? 'Google地图' : '구글맵 길찾기'}</span>
              <ExternalLink size={12} />
            </a>

            {/* 2. 택시 기사님께 보여주기용 주소 복사 */}
            <button
              type="button"
              onClick={handleCopyKoreanAddress}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.6rem 0.5rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                cursor: 'pointer'
              }}
            >
              {isCopied ? <Check size={13} style={{ color: '#10b981' }} /> : <Car size={13} style={{ color: '#f59e0b' }} />}
              <span>{isCopied ? (lang === 'en' ? 'Copied!' : '복사완료!') : (lang === 'en' ? 'Taxi Address' : lang === 'ja' ? 'タクシー用住所' : '택시용 주소')}</span>
            </button>

            {/* 3. 티켓/한복 예약 (제휴 시) */}
            {affiliateDeal && (
              <a
                href={affiliateDeal.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ff5b00',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{lang === 'en' ? 'Book Deals ↗' : lang === 'ja' ? '予約 ↗' : '특가 예약 ↗'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
