import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Ticket,
  Car,
  Hourglass
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 무박스(Borderless) 초슬림 플랫 상세 카드
 * 
 * 1. 상단: 4K 고화질 히어로 사진 슬라이더 (210px) + 단일 명소명 & 별점
 * 2. 중단: 답답한 네모 박스 없는 자연스러운 1문장 스토리 & 1줄 플랫 정보 리스트
 * 3. 하단: 크기를 절반으로 줄인 세련된 슬림 미니 액션 버튼 바 [ 🗺️ 구글맵 ] [ 🚕 택시주소 ] [ 🎟️ 특가예약 ]
 * ==============================================================================
 */

export default function TravelDetailModal({ spot, onClose, lang = 'ko' }) {
  if (!spot) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 단일 명소명 정제 (& 또는 / 제거)
  const rawTitle = spot.title || spot.name || '추천 여행 명소';
  const cleanTitle = rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();

  // 정확한 위치 및 기본 주소
  const location = spot.addr1 || spot.address || spot.location || (
    cleanTitle.includes('경복궁') ? '서울특별시 종로구 사직로 161' :
    cleanTitle.includes('인사동') ? '서울특별시 종로구 인사동길 44' :
    cleanTitle.includes('북촌') ? '서울특별시 종로구 계동길 37' :
    cleanTitle.includes('성수동') ? '서울특별시 성동구 연무장길 일대' :
    cleanTitle.includes('해운대') ? '부산광역시 해운대구 달맞이길62번길 13' :
    cleanTitle.includes('광안리') ? '부산광역시 수영구 광안해변로 219' :
    cleanTitle.includes('성산') ? '제주특별자치도 서귀포시 성산읍 일출로 284-12' :
    (lang === 'en' ? 'Seoul, Republic of Korea' : lang === 'ja' ? '韓国・ソウル' : '대한민국 서울 일대')
  );

  // 대중교통 안내
  const subwayTransit = spot.subway || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Line 3 Gyeongbokgung Stn. Exit 5 (3 min walk)' : lang === 'ja' ? '3号線 景福宮駅 5番出口 (徒歩3分)' : '3호선 경복궁역 5번 출구 (도보 3분)') :
    cleanTitle.includes('인사동') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 6 (2 min walk)' : lang === 'ja' ? '3号線 安国駅 6番出口 (徒歩2分)' : '3호선 안국역 6번 출구 (도보 2분)') :
    cleanTitle.includes('북촌') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 2 (5 min walk)' : lang === 'ja' ? '3号線 安国駅 2番出口 (徒歩5分)' : '3호선 안국역 2번 출구 (도보 5분)') :
    cleanTitle.includes('성수동') ? (lang === 'en' ? 'Line 2 Seongsu Stn. Exit 3 (3 min walk)' : lang === 'ja' ? '2号線 聖水駅 3番出口 (徒歩3分)' : '2호선 성수역 3번 출구 (도보 3분)') :
    cleanTitle.includes('해운대') ? (lang === 'en' ? 'Line 2 Haeundae Stn. Exit 5 (Bus 10 mins)' : lang === 'ja' ? '2号線 海雲台駅 5番出口 (バス10分)' : '2호선 해운대역 5번 출구 (버스 10분)') :
    cleanTitle.includes('광안리') ? (lang === 'en' ? 'Line 2 Gwangan Stn. Exit 3 (10 min walk)' : lang === 'ja' ? '2号線 広安駅 3番出口 (徒歩10分)' : '2호선 광안역 3번 출구 (도보 10분)') :
    (lang === 'en' ? 'Nearby Subway or City Bus' : lang === 'ja' ? '地下鉄または市内バス' : '인근 지하철역 또는 시내버스')
  );

  // 관람 시간 & 휴무일
  const operatingHours = spot.operatingHours || spot.usetime || (
    cleanTitle.includes('경복궁') ? '09:00 ~ 18:00 (입장마감 17:00)' :
    cleanTitle.includes('인사동') ? '10:30 ~ 20:30 (매장별 상이)' :
    cleanTitle.includes('북촌') ? '10:00 ~ 17:00 (거주지 정숙)' :
    cleanTitle.includes('성수동') ? '11:00 ~ 22:00 (카페별 상이)' :
    '09:00 ~ 18:00 (상시 운영)'
  );

  const closedDays = spot.closedDays || spot.restdate || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Closed Tuesdays' : lang === 'ja' ? '火曜定休' : '화요일 휴관') :
    (lang === 'en' ? 'Open Year-Round' : lang === 'ja' ? '年中無休' : '연중무휴')
  );

  // 입장료 / 요금
  const admissionFee = spot.fee || spot.usefee || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Adult ₩3,000 (Free in Hanbok!)' : lang === 'ja' ? '大人 3,000ウォン (韓服着用で無料)' : '성인 3,000원 (한복 착용 시 무료)') :
    (lang === 'en' ? 'Free Admission' : lang === 'ja' ? '入場無料' : '무료 관람')
  );

  // 추천 소요시간
  const duration = spot.duration || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Approx. 1.5 - 2h' : lang === 'ja' ? '約 1.5〜2時間' : '약 1.5 ~ 2시간') :
    (lang === 'en' ? 'Approx. 1 - 2h' : lang === 'ja' ? '約 1〜2時間' : '약 1 ~ 2시간')
  );

  // 추천 꿀팁
  const tipText = spot.photoTip || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Royal Guard Changing Ceremony (10:00, 14:00)' : lang === 'ja' ? '守門将交代儀式（10:00、14:00）' : '수문장 교대의식 (10:00, 14:00)') :
    cleanTitle.includes('인사동') ? (lang === 'en' ? 'Traditional tea house & handmade craft shops' : '전통 찻집과 골목 도자기 공방') :
    cleanTitle.includes('성수동') ? (lang === 'en' ? 'Trendy pop-up stores & bakery cafes' : '트렌디한 팝업스토어와 베이커리 카페') :
    (lang === 'en' ? 'Popular hotspot curated by VORA AI' : 'VORA AI가 엄선한 대표 핫플레이스')
  );

  // 1문장 스토리 소개
  const description = spot.description || spot.overview || (
    cleanTitle.includes('경복궁') 
      ? '조선 왕조 제일의 법궁으로, 웅장한 근정전과 연못 위에 세워진 경회루의 수려한 처마선이 한국 전통 건축미의 정점을 보여줍니다.'
      : cleanTitle.includes('인사동')
      ? '전통과 현대가 어우러진 거리로, 골목마다 자리한 전통 찻집과 나선형 쌈지길에서 한국의 감성을 만끽할 수 있습니다.'
      : cleanTitle.includes('북촌')
      ? '경복궁과 창덕궁 사이에 자리한 전통 한옥 마을로, 기와지붕이 이어지는 골목길에서 한국의 옛 정취를 느낄 수 있습니다.'
      : cleanTitle.includes('성수동')
      ? '붉은 벽돌 공장을 개조한 트렌디한 카페와 팝업스토어가 가득한 서울의 대표적인 핫플레이스입니다.'
      : 'VORA AI가 엄선한 한국의 대표적인 핫플레이스로 편리한 동선과 아름다운 경관을 자랑합니다.'
  );

  const rating = spot.rating || 4.8;
  const [isCopied, setIsCopied] = useState(false);

  // 택시 기사님께 보여주기용 한글 주소 복사
  const handleCopyKoreanAddress = () => {
    const addressToCopy = `${cleanTitle} (${location})`;
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
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* 1. 4K High-Res Hero Photo (210px 슬림 뷰) */}
        <div style={{ position: 'relative', width: '100%', height: '210px', minHeight: '210px', flexShrink: 0, backgroundColor: '#0f172a', overflow: 'hidden' }}>
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

          {/* Dark Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.15) 45%, transparent 70%)'
          }} />

          {/* Top Left: Photo Counter Badge */}
          {photoList.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              padding: '0.15rem 0.45rem',
              borderRadius: '12px',
              fontSize: '0.68rem',
              fontWeight: 800
            }}>
              📷 {activePhotoIdx + 1}/{photoList.length}
            </div>
          )}

          {/* Top Right: Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              zIndex: 10
            }}
          >
            <X size={16} />
          </button>

          {/* Photo Navigation Arrows */}
          {photoList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Bottom Title & Star Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '14px',
            right: '14px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <span style={{
                backgroundColor: '#2563eb',
                padding: '0.12rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                {spot.category || spot.theme || (lang === 'en' ? 'Attraction' : '추천명소')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: '#f59e0b', fontSize: '0.74rem', fontWeight: 900 }}>
                <Star size={12} fill="#f59e0b" />
                <span>{rating}</span>
              </div>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
            }}>
              {cleanTitle}
            </h2>
          </div>
        </div>

        {/* 2. Modal Body (답답한 박스 100% 제거 & 플랫 정보 리스트) */}
        <div 
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '0.9rem 1.1rem 1.25rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {/* 1문장 스토리 소개 */}
          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            lineHeight: 1.55,
            color: 'var(--text-main)',
            opacity: 0.95
          }}>
            {description}
          </p>

          {/* 무박스 1줄 플랫 정보 리스트 (지피티 원본 스타일) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            padding: '0.45rem 0',
            borderTop: '1px solid rgba(226, 232, 240, 0.6)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
            fontSize: '0.8rem'
          }}>
            {/* 1. 도로명 주소 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#2563eb', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <MapPin size={13} />
                <span>{lang === 'en' ? 'Address' : '주소'}</span>
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {location}</span>
            </div>

            {/* 2. 찾아가는 법 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#059669', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <Navigation size={13} />
                <span>{lang === 'en' ? 'Transit' : '교통'}</span>
              </span>
              <span style={{ color: '#059669', fontWeight: 700 }}>: {subwayTransit}</span>
            </div>

            {/* 3. 관람 시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#0284c7', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <Clock size={13} />
                <span>{lang === 'en' ? 'Hours' : '시간'}</span>
              </span>
              <span style={{ color: 'var(--text-main)' }}>
                : {operatingHours} <strong style={{ color: '#ef4444', marginLeft: '0.25rem' }}>({closedDays})</strong>
              </span>
            </div>

            {/* 4. 추천 소요시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#d97706', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <Hourglass size={13} />
                <span>{lang === 'en' ? 'Duration' : '소요'}</span>
              </span>
              <span style={{ color: 'var(--text-main)' }}>: {duration}</span>
            </div>

            {/* 5. 입장 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#8b5cf6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <Ticket size={13} />
                <span>{lang === 'en' ? 'Fee' : '요금'}</span>
              </span>
              <span style={{ color: '#8b5cf6', fontWeight: 700 }}>: {admissionFee}</span>
            </div>

            {/* 6. 추천 꿀팁 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#ea580c', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '70px', fontWeight: 700 }}>
                <Sparkles size={13} />
                <span>{lang === 'en' ? 'Tip' : '꿀팁'}</span>
              </span>
              <span style={{ color: '#ea580c', fontWeight: 700 }}>: {tipText}</span>
            </div>
          </div>

          {/* 3. 하단 슬림 미니 액션 버튼 바 (크기 다이어트 완료!) */}
          <div style={{
            marginTop: '0.2rem',
            display: 'grid',
            gridTemplateColumns: affiliateDeal ? '1.2fr 1fr 1fr' : '1.2fr 1fr',
            gap: '0.4rem'
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
                borderRadius: '8px',
                padding: '0.45rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>{lang === 'en' ? 'Google Maps' : lang === 'ja' ? 'Googleマップ' : '구글맵 길찾기'}</span>
              <ExternalLink size={11} />
            </a>

            {/* 2. 택시 기사님께 보여주기용 주소 복사 */}
            <button
              type="button"
              onClick={handleCopyKoreanAddress}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.45rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              {isCopied ? <Check size={12} style={{ color: '#10b981' }} /> : <Car size={12} style={{ color: '#f59e0b' }} />}
              <span>{isCopied ? (lang === 'en' ? 'Copied!' : '복사완료!') : (lang === 'en' ? 'Taxi' : '택시용 주소')}</span>
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
                  borderRadius: '8px',
                  padding: '0.45rem 0.55rem',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>{lang === 'en' ? 'Deals ↗' : '특가 예약 ↗'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
