import React, { useState, useEffect } from 'react';
import { 
  X, Star, MapPin, Clock, Phone, SunMedium, CheckCircle, Heart, 
  Globe, Loader2, Hotel, Ticket, ExternalLink, Sparkles, ChevronLeft, 
  ChevronRight, Car, Ban, Baby, Dog, Navigation, Camera
} from 'lucide-react';
import { fetchSpotDetailCommon, fetchSpotDetailImages, fetchSpotDetailIntro } from '../services/tourApi';
import { PUBLIC_API_CONFIG, buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedReview, getTranslatedOverview, getTranslatedDetailText } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';
import { useModalHistory } from '../hooks/useModalHistory';

export default function TravelDetailModal({ spot, onClose, isBookmarked, onToggleBookmark, lang = 'ko' }) {
  useModalHistory(!!spot, onClose, 'travel-detail');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [detailData, setDetailData] = useState(null);
  const [introData, setIntroData] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [mockReviews, setMockReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setLocalBookmarked(isBookmarked);
  }, [isBookmarked]);
  const displayRegion = spot?.region && spot.region !== '전국' && spot.region !== '한국'
    ? (t.regions?.[spot.region] || spot.region)
    : (t.countryBadge || '대한민국');

  useEffect(() => {
    if (spot) {
      setLoadingDetail(true);
      setActiveImgIndex(0);
      setGalleryImages([]);
      setIntroData(null);
      setDetailData({
        title: spot.title,
        overview: spot.description || `${spot.title}은(는) 아름다운 경관과 다양한 즐길 거리가 있는 대한민국 대표 관광 명소입니다.`,
        addr1: spot.location || spot.addr1 || '상세 주소 정보 제공',
        firstimage: spot.image || '',
        homepage: spot.homepage || null,
        tel: spot.tel || ''
      });

      // Load saved reviews for this specific spot
      try {
        const spotIdKey = spot.contentId || spot.id || 'default';
        const saved = localStorage.getItem(`ktravel_reviews_${spotIdKey}`);
        if (saved) {
          setMockReviews(JSON.parse(saved));
        } else {
          setMockReviews([
            {
              id: 1,
              author: 'Minjun Kim',
              ageGroup: '20대',
              gender: t.authorMale || '남성',
              rating: 5,
              date: '2026-08-10',
              content: '실제로 가보니 경치가 너무 아름답고 사진 찍기 정말 좋았습니다! 추천합니다.'
            },
            {
              id: 2,
              author: 'Seoyeon Lee',
              ageGroup: '30대',
              gender: t.authorFemale || '여성',
              rating: 5,
              date: '2026-08-08',
              content: '주변 카페와 맛집 동선이 편리하고 주차도 수월해서 가족들과 힐링하고 왔습니다.'
            },
            {
              id: 3,
              author: 'James Wilson',
              ageGroup: '20대',
              gender: t.authorMale || '남성',
              rating: 5,
              date: '2026-08-02',
              content: 'One of the most memorable spots in Korea! Stunning scenery and easy to navigate.'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }

      // Fetch authentic TourAPI data using PK (contentId)
      const targetContentId = spot.contentId || (isNaN(Number(spot.id)) ? null : spot.id);
      const cType = spot.contentTypeId || '12';

      if (targetContentId) {
        Promise.all([
          fetchSpotDetailCommon(targetContentId, lang).catch(() => null),
          fetchSpotDetailImages(targetContentId, lang).catch(() => []),
          fetchSpotDetailIntro(targetContentId, cType, lang).catch(() => null)
        ]).then(([commonRes, imagesRes, introRes]) => {
          if (commonRes) {
            setDetailData(prev => ({
              ...prev,
              title: commonRes.title || prev.title,
              overview: commonRes.overview || prev.overview,
              addr1: commonRes.addr1 || prev.addr1,
              firstimage: commonRes.firstimage || prev.firstimage,
              homepage: commonRes.homepage || prev.homepage,
              tel: commonRes.tel || prev.tel
            }));
          }
          setIntroData(introRes);

          // Build gallery: include spot's main photo + all TourAPI gallery photos
          const allImgs = [];
          const mainImg = commonRes?.firstimage || spot.image;
          if (mainImg && !mainImg.includes('default-spot')) {
            allImgs.push(mainImg.replace(/^http:\/\//i, 'https://'));
          }
          if (Array.isArray(imagesRes) && imagesRes.length > 0) {
            imagesRes.forEach(img => {
              const cleanImg = img.replace(/^http:\/\//i, 'https://');
              if (!allImgs.includes(cleanImg)) {
                allImgs.push(cleanImg);
              }
            });
          }
          setGalleryImages(allImgs);
          setLoadingDetail(false);
        }).catch(() => {
          setLoadingDetail(false);
        });
      } else {
        setLoadingDetail(false);
      }
    }
  }, [spot, lang]);

  if (!spot) return null;

  const currentHeroImage = galleryImages.length > 0 && galleryImages[activeImgIndex]
    ? galleryImages[activeImgIndex]
    : (detailData?.firstimage || spot.image || '/default-spot.png');

  // Handle adding new user review
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev = {
      id: Date.now(),
      author: '여행자',
      ageGroup: '30대',
      gender: '무관',
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      content: newReviewText.trim()
    };
    const updated = [newRev, ...mockReviews];
    setMockReviews(updated);
    setNewReviewText('');
    try {
      const spotIdKey = spot.contentId || spot.id || 'default';
      localStorage.setItem(`ktravel_reviews_${spotIdKey}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to extract clean homepage URL
  const extractCleanUrl = (rawHomepage) => {
    if (!rawHomepage) return null;
    const match = rawHomepage.match(/href=["'](https?:\/\/[^"']+)["']/i) || rawHomepage.match(/(https?:\/\/[^\s<>"']+)/i);
    return match ? match[1] : (rawHomepage.startsWith('http') ? rawHomepage : null);
  };
  const cleanHomepageUrl = extractCleanUrl(detailData?.homepage || spot.homepage);

  // Fallback info helpers
  const hoursText = introData?.usetime || introData?.usetimeculture || introData?.usetimeleports || introData?.opentime || spot.details?.hours || '상세 이용시간 정보 제공 (연중무휴 권장)';
  const restDateText = introData?.restdate || introData?.restdateculture || introData?.restdateleports || '연중무휴 (공휴일 정상 운영)';
  const parkingText = introData?.parking || introData?.parkingculture || introData?.parkingfee || '주차 가능 (인근 공영/전용 주차장 구비)';
  const feeText = introData?.usefee || introData?.usefeeleports || introData?.ticket || '무료 관람 (일부 유료 시설 제외)';
  const petText = introData?.chkpet || introData?.chkpetculture || '동반 가능 (목줄 및 케이지 착용 권장)';
  const babyText = introData?.chkbabycarriage || introData?.chkbabycarriageculture || '유모차 및 휠체어 이동 가능';
  const contactText = introData?.infocenter || detailData?.tel || spot.tel || spot.details?.contact || '1330 (관광안내)';

  return (
    <div 
      className="modal-overlay-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP RIGHT STICKY FIXED CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'sticky',
            top: '1rem',
            float: 'right',
            marginRight: '1rem',
            marginTop: '1rem',
            marginBottom: '-46px',
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.75)',
            color: '#ffffff',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* 📸 HERO MULTI-PHOTO GALLERY SLIDER (BRIGHT & NATURAL LOOK) */}
        <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
          <TravelImageWithFallback 
            src={currentHeroImage}
            spotTitle={displayTitle || spot.title}
            lang={lang}
            showTitle={false}
          />

          {/* Soft Bottom-Only Gradient for Text Readability without Darkening the Photo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.25) 35%, rgba(0, 0, 0, 0) 65%)'
          }} />

          {/* Left / Right Navigation Arrows if multiple photos */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                }}
                aria-label="이전 사진"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1e293b',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                }}
                aria-label="다음 사진"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1e293b',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronRight size={22} />
              </button>

              {/* Photo Index Indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                padding: '0.25rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(6px)'
              }}>
                📷 {activeImgIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          {/* Hero Bottom Title & Badges */}
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.4)'
              }}>
                {spot.assignedDay ? `${spot.assignedDay}일차 명소` : displayRegion}
              </span>

              {spot.tags && spot.tags.slice(0, 3).map((tagItem, i) => (
                <span key={i} style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '8px',
                  backdropFilter: 'blur(6px)'
                }}>
                  #{tagItem.replace(/^#/, '')}
                </span>
              ))}
            </div>

            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.85)',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* 🎞️ MULTI-IMAGE THUMBNAIL STRIP */}
        {galleryImages.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '0.55rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            scrollbarWidth: 'thin'
          }}>
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                style={{
                  width: '64px',
                  height: '48px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: 0,
                  border: activeImgIndex === idx ? '2.5px solid #7c3aed' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  opacity: activeImgIndex === idx ? 1 : 0.65,
                  transform: activeImgIndex === idx ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img 
                  src={imgUrl} 
                  alt={`Thumbnail ${idx + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            ))}
          </div>
        )}

        {/* MODAL MAIN CONTENT BODY */}
        <div style={{ padding: '1.5rem' }}>

          {/* Rating, Bookmark & Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{spot.rating || 4.9}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                • 한국관광공사 정품 인증 관광지
              </span>
            </div>

            <button
              onClick={() => {
                setLocalBookmarked(prev => !prev);
                if (onToggleBookmark) {
                  onToggleBookmark(spot);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.95rem',
                borderRadius: '10px',
                border: localBookmarked ? '1.5px solid #fecaca' : '1px solid #cbd5e1',
                backgroundColor: localBookmarked ? '#fef2f2' : '#ffffff',
                color: localBookmarked ? '#ef4444' : '#475569',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: localBookmarked ? '0 2px 8px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={16} fill={localBookmarked ? '#ef4444' : 'none'} color={localBookmarked ? '#ef4444' : '#64748b'} />
              <span>{localBookmarked ? '즐겨찾기 저장됨 ❤️' : '즐겨찾기 저장'}</span>
            </button>
          </div>

          {/* 🗺️ SOPHISTICATED 3-MAP NAVIGATION BAR (REFINED PASTEL PILLS) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            padding: '0.85rem',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            {/* Kakao Map Navigation */}
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#fefce8',
                border: '1.5px solid #fef08a',
                color: '#854d0e',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Navigation size={15} color="#ca8a04" />
              <span>카카오맵 길찾기 ↗</span>
            </a>

            {/* Naver Map Navigation */}
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                color: '#166534',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Navigation size={15} color="#16a34a" />
              <span>네이버지도 길찾기 ↗</span>
            </a>

            {/* Google Map (GPS) Navigation */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                color: '#1e40af',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <MapPin size={15} color="#2563eb" />
              <span>구글지도 (GPS) ↗</span>
            </a>
          </div>

          {/* 📖 OVERVIEW DESCRIPTION */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#7c3aed" />
              <span>관광지 상세 개요</span>
            </h4>
            <p style={{
              color: '#334155',
              fontSize: '0.92rem',
              lineHeight: 1.75,
              margin: 0,
              wordBreak: 'keep-all'
            }}>
              {loadingDetail ? (
                <span style={{ color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={16} className="animate-spin" /> 한국관광공사 정품 상세정보 수신 중...
                </span>
              ) : (
                getTranslatedOverview(detailData?.overview || spot.description || t.defaultOverview, spot?.title, lang)
              )}
            </p>
          </div>

          {/* 📊 8 CORE PUBLIC DATA INFO CARDS (관광공사 정품 세부 안내) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>공공데이터 정품 이용 안내</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem'
            }}>
              {/* 1. Address */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <MapPin size={14} />
                  <span>위치 및 주소</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedAddress(detailData?.addr1 || spot.location, lang)}
                </div>
              </div>

              {/* 2. Operating Hours */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Clock size={14} />
                  <span>이용 및 관람 시간</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(hoursText, lang)}
                </div>
              </div>

              {/* 3. Rest Date */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Ban size={14} />
                  <span>쉬는날 (휴무일)</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(restDateText, lang)}
                </div>
              </div>

              {/* 4. Parking */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Car size={14} />
                  <span>주차 시설 및 요금</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(parkingText, lang)}
                </div>
              </div>

              {/* 5. Admission Fee */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Ticket size={14} />
                  <span>입장료 및 이용요금</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(feeText, lang)}
                </div>
              </div>

              {/* 6. Pet Friendly */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ea580c', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Dog size={14} />
                  <span>반려동물 동반 정보</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(petText, lang)}
                </div>
              </div>

              {/* 7. Stroller / Accessibility */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0891b2', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Baby size={14} />
                  <span>유모차 및 보행 편의</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(babyText, lang)}
                </div>
              </div>

              {/* 8. Contact & Phone */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Phone size={14} />
                  <span>문의 및 안내 전화</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                  <a href={`tel:${contactText.replace(/[^0-9\-]/g, '')}`} style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 700 }}>
                    📞 {getTranslatedDetailText(contactText, lang)}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 🌐 OFFICIAL WEBSITE BANNER (IF AVAILABLE) */}
          {cleanHomepageUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href={cleanHomepageUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#f5f3ff',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '14px',
                  color: '#6d28d9',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={18} color="#7c3aed" />
                  <span>{displayTitle} 공식 웹사이트 바로가기</span>
                </div>
                <span>방문하기 ↗</span>
              </a>
            </div>
          )}

          {/* 📸 INSTAGRAM & GOOGLE LIVE EXPLORE BANNER (REFINED SOFT GLASS DESIGN) */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1.15rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #faf5ff 0%, #fdf4ff 50%, #f8fafc 100%)',
            border: '1.5px solid #f3e8ff',
            boxShadow: '0 2px 8px rgba(168, 85, 247, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={16} color="#9333ea" />
                <span>실시간 SNS 트렌드 & 포토존 갤러리</span>
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                #인생샷명소
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <a
                href={`https://www.instagram.com/explore/tags/${encodeURIComponent((displayTitle || spot.title).replace(/\s+/g, ''))}/`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem',
                  background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(217, 70, 239, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>인스타 실시간 피드 ↗</span>
              </a>

              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent((displayTitle || spot.title) + ' ' + (spot.location || ''))}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>구글 실시간 갤러리 ↗</span>
              </a>
            </div>
          </div>

          {/* 🏨 PARTNER OFFERS (ELEGANT SOFT SLATE CARD - NO HARSH BLACK) */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1.15rem',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#6366f1" />
                <span>주변 추천 숙소 및 액티비티 예약</span>
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4338ca', backgroundColor: '#e0e7ff', padding: '0.2rem 0.55rem', borderRadius: '8px' }}>
                OFFICIAL PARTNER
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
              <a
                href={buildAgodaDeepLink(spot.title, '2026-08-20', '2026-08-22')}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Hotel size={16} />
                <span>아고다 특가 숙소 ↗</span>
              </a>

              <a
                href={buildKlookDeepLink(spot.title, '2026-08-20', '2026-08-22')}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Ticket size={16} />
                <span>클룩 투어 & 티켓 ↗</span>
              </a>
            </div>
          </div>

          {/* 💬 REAL TRAVELER REVIEWS & FEEDBACK */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                💬 여행자 방문 리뷰 ({mockReviews.length})
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                평균 만족도 ★ {spot.rating || 4.9}
              </span>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="이 명소에 대한 생생한 후기를 남겨보세요..."
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.1rem',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                등록
              </button>
            </form>

            {/* Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {mockReviews.slice(0, showAllReviews ? mockReviews.length : 3).map((rev) => (
                <div key={rev.id} style={{
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>{rev.author}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({rev.ageGroup})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                    {getTranslatedReview(rev.content, lang)}
                  </p>
                </div>
              ))}
            </div>

            {mockReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                style={{
                  width: '100%',
                  marginTop: '0.65rem',
                  padding: '0.5rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {showAllReviews ? '리뷰 접기 ▲' : `리뷰 더보기 (${mockReviews.length - 3}개) ▼`}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
