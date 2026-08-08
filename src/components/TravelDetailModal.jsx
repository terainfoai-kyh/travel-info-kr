import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Clock, Phone, SunMedium, CheckCircle, Heart, Globe, Loader2, Hotel, Ticket, ExternalLink, Sparkles } from 'lucide-react';
import { fetchSpotDetailCommon, fetchSpotDetailImages } from '../services/tourApi';
import { PUBLIC_API_CONFIG } from '../services/apiConfig';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedTheme, getTranslatedReview, getTranslatedOverview, getTranslatedDetailText } from '../i18n/translations';
import AdBanner from './AdBanner';
import TravelImageWithFallback from './TravelImageWithFallback';

export default function TravelDetailModal({ spot, onClose, isBookmarked, onToggleBookmark, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [detailData, setDetailData] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [mockReviews, setMockReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayTitle = getTranslatedTitle(spot?.title, lang);
  const displayRegion = spot?.region && spot.region !== '전국' && spot.region !== '한국'
    ? (t.regions?.[spot.region] || spot.region)
    : (t.countryBadge || '대한민국');

  useEffect(() => {
    if (spot && spot.id) {
      // Load saved reviews for this specific spot or initialize defaults
      try {
        const saved = localStorage.getItem(`ktravel_reviews_${spot.id}`);
        if (saved) {
          setMockReviews(JSON.parse(saved));
        } else {
          setMockReviews([
            {
              id: 1,
              author: '김민준',
              ageGroup: '20대',
              gender: '남성',
              rating: 5,
              date: '2026-08-04',
              content: '날씨 좋을 때 방문하니 경관이 정말 훌륭했습니다! 포토스팟도 많고 강력 추천합니다.'
            },
            {
              id: 2,
              author: '이서연',
              ageGroup: '30대',
              gender: '여성',
              rating: 5,
              date: '2026-08-02',
              content: '주변 로컬 맛집 코스가 잘 되어 있네요. 주차 공간도 여유로워서 무척 편했습니다.'
            },
            {
              id: 3,
              author: '박지훈',
              ageGroup: '40대',
              gender: '남성',
              rating: 4,
              date: '2026-07-28',
              content: '가족과 함께 오기 좋은 곳입니다. 편의시설이 깔끔하게 잘 정비되어 있습니다.'
            },
            {
              id: 4,
              author: '최유진',
              ageGroup: '20대',
              gender: '여성',
              rating: 5,
              date: '2026-07-25',
              content: '인생샷 사진 찍기 최고입니다! 대중교통 접근성도 좋고 주변 둘레길 산책 코스도 무척 좋습니다.'
            },
            {
              id: 5,
              author: '정명훈',
              ageGroup: '50대이상',
              gender: '남성',
              rating: 5,
              date: '2026-07-20',
              content: '가족들과 주말 나들이로 다녀왔는데 경치가 너무 고즈넉하고 힐링되었습니다.'
            }
          ]);
        }
      } catch (e) { console.error(e); }

      setLoadingDetail(true);
      setGalleryImages([]);

      if (String(spot.id).startsWith('t-')) {
        // Search real contentId by title for mock spots
        const searchUrl = `${PUBLIC_API_CONFIG.SEARCH_KEYWORD_URL}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=1&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&keyword=${encodeURIComponent(spot.title.split('&')[0].trim())}`;
        fetch(searchUrl)
          .then(res => res.json())
          .then(data => {
            const realItem = data.response?.body?.items?.item?.[0];
            if (realItem && realItem.contentid) {
              return Promise.all([
                fetchSpotDetailCommon(realItem.contentid, lang),
                fetchSpotDetailImages(realItem.contentid, lang)
              ]);
            }
            return [null, []];
          })
          .then(([commonRes, imagesRes]) => {
            setDetailData(commonRes);
            if (imagesRes && imagesRes.length > 0) {
              setGalleryImages(imagesRes);
            }
            setLoadingDetail(false);
          })
          .catch(() => {
            setDetailData(null);
            setLoadingDetail(false);
          });
      } else {
        Promise.all([
          fetchSpotDetailCommon(spot.id, lang),
          fetchSpotDetailImages(spot.id, lang)
        ]).then(([commonRes, imagesRes]) => {
          setDetailData(commonRes);
          if (imagesRes && imagesRes.length > 0) {
            setGalleryImages(imagesRes);
          }
          setLoadingDetail(false);
        });
      }
    }
  }, [spot, lang]);

  if (!spot) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }} onClick={onClose}>
      <div 
        className="animate-fade-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'sticky',
            top: '1rem',
            left: 'calc(100% - 3rem)',
            float: 'right',
            marginRight: '1rem',
            marginTop: '1rem',
            marginBottom: '-3.25rem',
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.88)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.88)';
          }}
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div style={{ position: 'relative', width: '100%', height: '320px' }}>
          <TravelImageWithFallback 
            src={(() => {
              const apiFirstImg = detailData?.firstimage || '';
              const isBadImg = apiFirstImg.includes('794101_image2_1.jpg') || apiFirstImg.toLowerCase().includes('toilet') || apiFirstImg.toLowerCase().includes('restroom') || apiFirstImg.toLowerCase().includes('화장실');
              if (!isBadImg && apiFirstImg) return apiFirstImg;
              return spot.image;
            })()} 
            spotTitle={displayTitle || spot.title}
            lang={lang}
            showTitle={false}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%)'
          }} />

          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                {displayRegion}
              </span>
              {spot.tags.map((tagItem, i) => {
                const translatedTag = t.themes?.[tagItem] || t.regions?.[tagItem] || (tagItem === '관광공사추천' ? t.koreaRecommendedTag : tagItem);
                return (
                  <span key={i} style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    #{translatedTag}
                  </span>
                );
              })}
            </div>

            <h2 style={{
              fontSize: '1.9rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.85)',
              margin: 0
            }}>
              {displayTitle}
            </h2>
          </div>
        </div>

        <div style={{ padding: '1.5rem 1.5rem 2rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{spot.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({(spot.reviewsCount || 1280).toLocaleString()}{t.reviewsUnit})
              </span>
            </div>

            <button
              onClick={() => onToggleBookmark(spot.id)}
              className="btn-secondary"
              style={{
                borderColor: isBookmarked ? '#ef4444' : 'var(--border-color)',
                color: isBookmarked ? '#ef4444' : 'var(--text-main)'
              }}
            >
              <Heart size={18} fill={isBookmarked ? '#ef4444' : 'none'} />
              <span>{isBookmarked ? t.savedBookmark : t.saveBookmark}</span>
            </button>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {loadingDetail ? (
              <span style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Loader2 size={16} className="animate-spin" /> {t.overviewLoading}
              </span>
            ) : (
              getTranslatedOverview(detailData?.overview || spot.description || t.defaultOverview, spot?.title, lang)
            )}
          </p>

          {/* Prominent Official Website Button Banner */}
          <div style={{ marginBottom: '2rem' }}>
            {(() => {
              // Exact FULL NAME & Location-based website mapping dictionary
              const SITE_MAP_LIST = [
                {
                  title: '경복궁',
                  regionFilter: ['서울', '종로'],
                  url: 'https://royal.khs.go.kr/ROYAL/main/index.do'
                },
                {
                  title: '창덕궁',
                  regionFilter: ['서울', '종로'],
                  url: 'https://cdg.khs.go.kr'
                },
                {
                  title: '덕수궁',
                  regionFilter: ['서울', '중구'],
                  url: 'https://deoksugung.khs.go.kr'
                },
                {
                  title: '창경궁',
                  regionFilter: ['서울', '종로'],
                  url: 'https://cgg.khs.go.kr'
                },
                {
                  title: '종묘',
                  regionFilter: ['서울', '종로'],
                  url: 'https://jm.khs.go.kr'
                },
                {
                  title: '광화문',
                  regionFilter: ['서울', '종로'],
                  url: 'https://royal.khs.go.kr/ROYAL/main/index.do'
                },
                {
                  title: '성산일출봉',
                  regionFilter: ['제주', '서귀포'],
                  url: 'https://www.visitjeju.net'
                },
                {
                  title: '해운대',
                  regionFilter: ['부산', '해운대'],
                  url: 'https://www.bluelinepark.com'
                },
                {
                  title: '설악산',
                  regionFilter: ['강원', '속초', '인제', '양양'],
                  url: 'https://www.knps.or.kr/seoraksan'
                },
                {
                  title: '동궁과 월지',
                  regionFilter: ['경북', '경주'],
                  url: 'https://www.gyeongju.go.kr/tour'
                },
                {
                  title: '안압지',
                  regionFilter: ['경북', '경주'],
                  url: 'https://www.gyeongju.go.kr/tour'
                },
                {
                  title: '한옥마을',
                  regionFilter: ['전북', '전주'],
                  url: 'https://hanok.jeonju.go.kr'
                },
                {
                  title: '경기전',
                  regionFilter: ['전북', '전주'],
                  url: 'https://hanok.jeonju.go.kr'
                },
                {
                  title: 'N서울타워',
                  regionFilter: ['서울', '용산'],
                  url: 'https://www.seoultower.co.kr'
                },
                {
                  title: '송도 센트럴파크',
                  regionFilter: ['인천', '연수구'],
                  url: 'https://www.ifez.go.kr'
                },
                {
                  title: '수원 화성',
                  regionFilter: ['경기', '수원'],
                  url: 'https://www.swcf.or.kr'
                }
              ];

              // 1. First priority: Real API parsed homepage URL from TourAPI (/detailCommon2)
              let activeUrl = detailData?.homepage;

              // 2. Second priority: If TourAPI returned raw HTML link string
              if (!activeUrl && detailData?.homepageRaw) {
                const match = detailData.homepageRaw.match(/https?:\/\/[^\s"'<>]+/);
                if (match) activeUrl = match[0];
              }

              // 3. Third priority: Location & Title Verified Dictionary Match (Prevent mapping non-palace stores like '울산 경복궁')
              if (!activeUrl && spot && spot.title) {
                const spotTitleClean = String(spot.title).trim();
                const spotAddrClean = String(spot.location || detailData?.addr1 || '').trim();
                const spotRegionClean = String(spot.region || '').trim();

                for (const entry of SITE_MAP_LIST) {
                  const isTitleMatch = spotTitleClean.includes(entry.title);
                  const isLocationValid = entry.regionFilter.some(reg => spotRegionClean.includes(reg) || spotAddrClean.includes(reg));

                  if (isTitleMatch && isLocationValid) {
                    activeUrl = entry.url;
                    break;
                  }
                }
              }

              if (loadingDetail) {
                return <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>웹사이트 연결 정보 확인 중...</div>;
              }

              if (activeUrl) {
                return (
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.85rem 1.4rem',
                      background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Globe size={20} />
                    <span>🌐 {t.officialWebsite || '공식 홈페이지 바로가기 (새창 팝업)'} ↗</span>
                  </a>
                );
              }

              return (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-dim)',
                  fontSize: '0.88rem'
                }}>
                  <Globe size={18} />
                  <span>ℹ️ {t.noOfficialWebsite} ({t.telInquiry}: {detailData?.tel || spot.details?.contact || '1330'})</span>
                </div>
              );
            })()}
          </div>

          {/* Partner Offers & Affiliate Links Block */}
          <div style={{
            marginBottom: '2rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="var(--accent-primary)" />
                <span>{t.affiliateTitle || '파트너 혜택 및 주변 서비스'}</span>
              </h4>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(56, 189, 248, 0.15)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                {t.adSponsoredTag || 'PARTNER OFFERS'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <a
                href={`https://www.agoda.com/partners/partnersearch.aspx?cid=1972217&text=${encodeURIComponent(spot?.title || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)'
                }}
              >
                <Hotel size={16} />
                <span>{t.agodaHotelBtn}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={`https://www.klook.com/ko/search/?query=${encodeURIComponent(spot?.title || '')}&aid=130249`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)'
                }}
              >
                <Ticket size={16} />
                <span>{t.klookTicketBtn}</span>
                <ExternalLink size={14} />
              </a>
              <a
                href={`https://www.kkday.com/ko/product/productlist?keyword=${encodeURIComponent(spot?.title || '')}&cid=26248`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)'
                }}
              >
                <Sparkles size={16} />
                <span>KKday 투어/입장권</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* TourAPI 4.0 Sub-Image Gallery (/detailImage2) */}
          {galleryImages && galleryImages.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📸 {t.galleryTitle} ({galleryImages.length}{t.photosUnit})
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '0.75rem'
              }}>
                {galleryImages.map((imgUrl, i) => (
                  <div key={i} style={{
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    <img 
                      src={imgUrl} 
                      alt={`Gallery-${i}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Embedded Google Maps inside Modal */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-primary)" />
              {t.mapSearchTitle}
            </h4>
            <div style={{
              width: '100%',
              height: '240px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <iframe
                title={`Map-${spot.title}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${spot.lat || 37.5665},${spot.lng || 126.9780}&hl=${lang}&z=15&output=embed`}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${spot.lat || 37.5665},${spot.lng || 126.9780}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none'
                }}
              >
                <Globe size={14} /> {t.googleMapRoute}
              </a>
            </div>
          </div>

          {/* Key Info Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-primary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.addressLabel}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {getTranslatedAddress(detailData?.addr1 || spot.location, lang)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.hoursLabel}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {getTranslatedDetailText(spot.details?.hours || t.hoursDefault, lang)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Phone size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.contactLabel}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {getTranslatedDetailText(detailData?.tel || spot.details?.contact || t.contactDefault, lang)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Globe size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.websiteLabel}</div>
                {loadingDetail ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.websiteLoading}</div>
                ) : detailData?.homepage ? (
                  <a
                    href={detailData.homepage}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--accent-primary)',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      wordBreak: 'break-all',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    🔗 {t.visitOfficialWebsite} ↗
                  </a>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    ℹ️ {t.noOfficialWebsite}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <SunMedium size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.seasonLabel}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {getTranslatedDetailText(spot.details?.bestSeason || t.seasonDefault, lang)}
                </div>
              </div>
            </div>
          </div>

          {/* Highlights & Additional Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} color="var(--accent-primary)" />
              {t.highlightsTitle}
            </h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {(spot.details?.highlights || t.highlightsBullets).map((h, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  {getTranslatedDetailText(h, lang)}
                </li>
              ))}
            </ul>
          </div>

          {/* Real Visitor Reviews Section */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                {t.visitorReviewsTitle} ({mockReviews.length}{t.reviewsUnit})
              </span>
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                ★ {spot.rating || '4.9'} / 5.0
              </span>
            </h4>

            {/* Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              {(showAllReviews ? mockReviews : mockReviews.slice(0, 2)).map((rawRev) => {
                const rev = getTranslatedReview(rawRev, lang);
                return (
                  <div key={rev.id} style={{
                    background: 'var(--bg-primary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{rev.author}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                          {rev.ageGroup} / {rev.gender}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', marginBottom: '0.4rem' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {rev.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Toggle View All Reviews Button */}
            {mockReviews.length > 2 && (
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAllReviews(prev => !prev)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-highlight)',
                    color: 'var(--accent-primary)',
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {showAllReviews 
                    ? t.hideReviews 
                    : `${t.showAllReviews} (${mockReviews.length}${t.reviewsUnit})`}
                </button>
              </div>
            )}

            {/* Write Review Input */}
            <div style={{
              background: 'var(--bg-card)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-highlight)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ✍️ {t.writeReviewLabel}
                </span>
                
                {/* Interactive Star Rating Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.3rem' }}>{t.ratingLabel}:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= newRating ? "#f59e0b" : "none"}
                      color={star <= newRating ? "#f59e0b" : "var(--text-dim)"}
                      style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginLeft: '0.3rem' }}>
                    {newRating}{t.scoreSuffix}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder={t.reviewPlaceholder}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newReviewText.trim()) {
                      const newReviewItem = {
                        id: Date.now(),
                        author: '나의 리뷰',
                        ageGroup: '방문객',
                        gender: '일반',
                        rating: newRating,
                        date: new Date().toISOString().split('T')[0],
                        content: newReviewText.trim()
                      };
                      const updated = [newReviewItem, ...mockReviews];
                      setMockReviews(updated);
                      setNewReviewText('');
                      try {
                        localStorage.setItem(`ktravel_reviews_${spot.id}`, JSON.stringify(updated));
                      } catch (err) { console.error(err); }
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newReviewText.trim()) {
                      const newReviewItem = {
                        id: Date.now(),
                        author: '나의 리뷰',
                        ageGroup: '방문객',
                        gender: '일반',
                        rating: newRating,
                        date: new Date().toISOString().split('T')[0],
                        content: newReviewText.trim()
                      };
                      const updated = [newReviewItem, ...mockReviews];
                      setMockReviews(updated);
                      setNewReviewText('');
                      try {
                        localStorage.setItem(`ktravel_reviews_${spot.id}`, JSON.stringify(updated));
                      } catch (err) { console.error(err); }
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', whiteSpace: 'nowrap', fontWeight: 700 }}
                >
                  리뷰 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
