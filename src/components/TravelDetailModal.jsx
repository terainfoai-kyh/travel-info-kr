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
  Check,
  Ticket,
  Car,
  Hourglass,
  Info
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 지피티 3.0 프리미엄 실용 카드 (썸네일 제거 & 완벽한 모바일 스크롤)
 * 
 * 1. 4K 고화질 히어로 사진 슬라이더 (1/8) + 단일 명소명 & 카테고리 & 별점
 * 2. 썸네일 줄 완전 제거로 시원한 뷰포트 확보
 * 3. 5대 핵심 실용 여행 정보: [📍 도로명 주소] [🚇 지하철/도보] [🕒 관람시간·휴무일] [⏳ 소요시간] [🎟️ 입장료]
 * 4. ✨ 2대 시그니처 꿀팁 & 포토존 뱃지
 * 5. 📖 에디터 프리미엄 스토리 가이드 (풍성한 해설)
 * 6. 하단 3대 원클릭 액션 바: [ 🗺️ 구글맵 길찾기 ] + [ 🚕 택시 주소 복사 ] + [ 🎟️ 특가 예약 ]
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
    cleanTitle.includes('해운대') ? '부산광역시 해운대구 달맞이길62번길 13' :
    cleanTitle.includes('광안리') ? '부산광역시 수영구 광안해변로 219' :
    cleanTitle.includes('성산') ? '제주특별자치도 서귀포시 성산읍 일출로 284-12' :
    (lang === 'en' ? 'Seoul, Republic of Korea' : lang === 'ja' ? '韓国・ソウル' : (lang === 'zh' || lang === 'zht') ? '韩国 首尔' : '대한민국 서울 일대')
  );

  // 찾아가는 대중교통 안내
  const subwayTransit = spot.subway || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Line 3 Gyeongbokgung Stn. Exit 5 (3 min walk)' : lang === 'ja' ? '3号線 景福宮駅 5番出口 (徒歩3分)' : '3호선 경복궁역 5번 출구 (도보 3분)') :
    cleanTitle.includes('인사동') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 6 (2 min walk)' : lang === 'ja' ? '3号線 安国駅 6番出口 (徒歩2分)' : '3호선 안국역 6번 출구 (도보 2분)') :
    cleanTitle.includes('북촌') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 2 (5 min walk)' : lang === 'ja' ? '3号線 安国駅 2番出口 (徒歩5分)' : '3호선 안국역 2번 출구 (도보 5분)') :
    cleanTitle.includes('해운대') ? (lang === 'en' ? 'Line 2 Haeundae Stn. Exit 5 (Bus 10 mins)' : lang === 'ja' ? '2号線 海雲台駅 5番出口 (バス10分)' : '2호선 해운대역 5번 출구 (버스 10분)') :
    cleanTitle.includes('광안리') ? (lang === 'en' ? 'Line 2 Gwangan Stn. Exit 3 (10 min walk)' : lang === 'ja' ? '2号線 広安駅 3番出口 (徒歩10分)' : '2호선 광안역 3번 출구 (도보 10분)') :
    (lang === 'en' ? 'Accessible by nearby Subway or City Bus' : lang === 'ja' ? '最寄りの地下鉄または市内バスでアクセス便利' : '인근 지하철역 또는 시내버스로 편리하게 이동')
  );

  // 관람 시간 & 휴무일
  const operatingHours = spot.operatingHours || spot.usetime || (
    cleanTitle.includes('경복궁') ? '09:00 ~ 18:00 (입장마감 17:00)' :
    cleanTitle.includes('인사동') ? '10:30 ~ 20:30 (매장별 상이)' :
    cleanTitle.includes('북촌') ? '10:00 ~ 17:00 (거주지 정숙 시간)' :
    '09:00 ~ 18:00 (연중 상시 운영)'
  );

  const closedDays = spot.closedDays || spot.restdate || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Closed Tuesdays' : lang === 'ja' ? '火曜定休' : '매주 화요일 휴관') :
    (lang === 'en' ? 'Open Year-Round' : lang === 'ja' ? '年中無休' : '연중무휴')
  );

  // 입장료 / 요금
  const admissionFee = spot.fee || spot.usefee || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Adult ₩3,000 (Free in Hanbok!)' : lang === 'ja' ? '大人 3,000ウォン (韓服着用で無料!)' : '성인 3,000원 (한복 착용 시 100% 무료 입장!)') :
    (lang === 'en' ? 'Free Admission (Special programs may vary)' : lang === 'ja' ? '入場無料 (一部体験は有料)' : '무료 관람 (체험 프로그램 별도)')
  );

  // 추천 소요시간
  const duration = spot.duration || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Approx. 1.5 - 2 Hours' : lang === 'ja' ? '約 1.5〜2時間' : '약 1.5시간 ~ 2시간') :
    cleanTitle.includes('인사동') ? (lang === 'en' ? 'Approx. 1 - 1.5 Hours' : lang === 'ja' ? '約 1〜1.5時間' : '약 1시간 ~ 1.5시간') :
    (lang === 'en' ? 'Approx. 1 - 2 Hours' : lang === 'ja' ? '約 1〜2時間' : '약 1시간 ~ 2시간')
  );

  // 에디터 상세 가이드 해설
  const description = spot.description || spot.overview || (
    cleanTitle.includes('경복궁') 
      ? '조선 왕조 제일의 법궁으로, 1395년 태조 이성계에 의해 창건되었습니다. 웅장한 근정전과 연못 위에 그림처럼 세워진 경회루, 고즈넉한 향원정의 수려한 처마선이 한국 전통 궁궐 건축미의 정수를 보여줍니다. 특히 궁궐 내 수문장 교대의식은 놓쳐서는 안 될 최고의 볼거리입니다.'
      : cleanTitle.includes('인사동')
      ? '전통과 현대가 어우러진 서울의 대표 문화 거리입니다. 골목마다 자리한 전통 찻집, 도자기 공방, 한국 공예품 갤러리 및 나선형 복합 쇼핑몰 쌈지길에서 감성적인 한국의 미를 만끽할 수 있습니다.'
      : cleanTitle.includes('북촌')
      ? '경복궁과 창덕궁 사이에 자리한 전통 한옥 주거지로, 조선 시대 고관대작들의 거주지였습니다. 기와지붕이 파도처럼 이어지는 북촌 8경 골목길을 거닐며 한국의 옛 정취를 사진에 담기 가장 좋은 명소입니다.'
      : 'VORA AI가 엄선한 한국의 대표적인 핫플레이스입니다. 아름다운 풍경과 로컬 감성, 편리한 여행 동선이 완벽하게 조화를 이루어 잊지 못할 한국 여행의 추억을 선사합니다.'
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
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* 1. 4K High-Res Hero Photo Container (Fixed Top) */}
        <div style={{ position: 'relative', width: '100%', height: '230px', minHeight: '230px', flexShrink: 0, backgroundColor: '#0f172a', overflow: 'hidden' }}>
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
              backdropFilter: 'blur(6px)',
              zIndex: 10
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
                  cursor: 'pointer',
                  zIndex: 10
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
                  cursor: 'pointer',
                  zIndex: 10
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

        {/* 2. Modal Body (100% Smooth Mobile & Wheel Scroll) */}
        <div 
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '1.1rem 1.25rem 2.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.95rem'
          }}
        >
          {/* 5대 핵심 실용 여행 정보 카드 */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            fontSize: '0.82rem'
          }}>
            {/* 1. 도로명 주소 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={15} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Address: ' : lang === 'ja' ? '住所: ' : (lang === 'zh' || lang === 'zht') ? '地址: ' : '도로명 주소: '}
                </strong>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{location}</span>
              </div>
            </div>

            {/* 2. 찾아가는 법 (지하철/도보) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Navigation size={15} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Transit: ' : lang === 'ja' ? 'アクセス: ' : (lang === 'zh' || lang === 'zht') ? '交通指南: ' : '찾아가는 길: '}
                </strong>
                <span style={{ color: '#059669', fontWeight: 700 }}>{subwayTransit}</span>
              </div>
            </div>

            {/* 3. 관람 시간 & 휴무일 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={15} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Hours: ' : lang === 'ja' ? '営業時間: ' : (lang === 'zh' || lang === 'zht') ? '营业时间: ' : '관람 시간: '}
                </strong>
                <span style={{ color: 'var(--text-main)' }}>{operatingHours}</span>
                <span style={{ marginLeft: '0.4rem', color: '#ef4444', fontWeight: 800 }}>({closedDays})</span>
              </div>
            </div>

            {/* 4. 추천 관람 소요시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Hourglass size={15} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Duration: ' : lang === 'ja' ? '所要時間: ' : (lang === 'zh' || lang === 'zht') ? '建议用时: ' : '추천 소요시간: '}
                </strong>
                <span style={{ color: 'var(--text-main)' }}>{duration}</span>
              </div>
            </div>

            {/* 5. 입장 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Ticket size={15} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Admission: ' : lang === 'ja' ? '入場料: ' : (lang === 'zh' || lang === 'zht') ? '门票: ' : '입장 요금: '}
                </strong>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{admissionFee}</span>
              </div>
            </div>
          </div>

          {/* ✨ 2대 시그니처 꿀팁 & 포토존 뱃지 */}
          <div style={{
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '16px',
            padding: '0.8rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            {/* 포토존 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 800, color: '#2563eb' }}>
              <Camera size={15} style={{ flexShrink: 0 }} />
              <span>
                {cleanTitle.includes('경복궁') ? (lang === 'en' ? '📸 Photo Spot: Hyangwonjeong pond reflection & Gyeonghoeru Pavilion' : lang === 'ja' ? '📸 フォトスポット: 香遠亭の池の反射ショット＆慶会楼' : '📸 [포토존] 향원정 연못 반영 샷 & 경회루 누각 앞') :
                 cleanTitle.includes('인사동') ? (lang === 'en' ? '📸 Photo Spot: Spiral walkway of Ssamzigil & traditional tea houses' : '📸 [포토존] 쌈지길 나선형 옥상정원 & 골목 한옥 찻집') :
                 (lang === 'en' ? '📸 Photo Spot: Main entrance landmark photo' : '📸 [포토존] 메인 랜드마크 인생샷 명당')}
              </span>
            </div>

            {/* 하이라이트 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 800, color: '#d97706' }}>
              <Sparkles size={15} style={{ flexShrink: 0 }} />
              <span>
                {cleanTitle.includes('경복궁') ? (lang === 'en' ? '👑 Highlight: Royal Guard Changing Ceremony (10:00, 14:00)' : lang === 'ja' ? '👑 見どころ: 守門将交代儀式（10:00、14:00 1日2回）' : '👑 [하이라이트] 수문장 교대의식 (10:00, 14:00 1일 2회 관람)') :
                 cleanTitle.includes('인사동') ? (lang === 'en' ? '🍵 Highlight: Handmade craft workshops & royal street snacks' : '🍵 [하이라이트] 장인 도자기 공방 & 전통 꿀타래 체험') :
                 (lang === 'en' ? '✨ Highlight: Essential experience recommended by VORA AI' : '✨ [하이라이트] VORA AI가 추천하는 필수 체험')}
              </span>
            </div>
          </div>

          {/* 📖 에디터 프리미엄 스토리 가이드 */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '0.9rem 1rem'
          }}>
            <h4 style={{ margin: '0 0 0.45rem 0', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={15} style={{ color: '#2563eb' }} />
              <span>{lang === 'en' ? '✨ Editor’s Story Guide' : lang === 'ja' ? '✨ エディター詳細ストーリー' : (lang === 'zh' || lang === 'zht') ? '✨ 深度故事指南' : '✨ 에디터 상세 스토리 가이드'}</span>
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.84rem',
              lineHeight: 1.7,
              color: 'var(--text-main)',
              whiteSpace: 'pre-line'
            }}>
              {description}
            </p>
          </div>

          {/* 3대 원클릭 액션 버튼 바 (하단 고정 및 스크롤 완벽 노출) */}
          <div style={{
            marginTop: '0.35rem',
            display: 'grid',
            gridTemplateColumns: affiliateDeal ? '1.2fr 1fr 1fr' : '1.2fr 1fr',
            gap: '0.5rem'
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
                borderRadius: '12px',
                padding: '0.7rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <span>{lang === 'en' ? 'Google Maps' : lang === 'ja' ? 'Googleマップ' : (lang === 'zh' || lang === 'zht') ? 'Google地图' : '구글맵 길찾기'}</span>
              <ExternalLink size={13} />
            </a>

            {/* 2. 택시 기사님께 보여주기용 주소 복사 */}
            <button
              type="button"
              onClick={handleCopyKoreanAddress}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.7rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              {isCopied ? <Check size={14} style={{ color: '#10b981' }} /> : <Car size={14} style={{ color: '#f59e0b' }} />}
              <span>{isCopied ? (lang === 'en' ? 'Copied!' : '복사완료!') : (lang === 'en' ? 'Taxi Address' : lang === 'ja' ? 'タクシー用' : '택시용 주소')}</span>
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
                  borderRadius: '12px',
                  padding: '0.7rem 0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 12px rgba(255, 91, 0, 0.3)'
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
