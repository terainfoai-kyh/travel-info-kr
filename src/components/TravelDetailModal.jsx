import React, { useState } from 'react';
import { 
  X, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Hourglass,
  RefreshCw,
  Coffee,
  AlertCircle
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 확인창 ➔ 즉시 교체 ➔ 모달 닫기 완벽 UX
 * ==============================================================================
 */

export default function TravelDetailModal({ spot, onClose, onReplaceSpot, lang = 'ko' }) {
  if (!spot) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 단일 명소명 정제 (& 또는 / 제거)
  const rawTitle = spot.title || spot.name || '추천 여행 명소';
  const cleanTitle = rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();

  // 인터랙티브 상태 (교체 패널 / 주변 맛집 패널 / 확인 다이얼로그)
  const [activePanel, setActivePanel] = useState(null); // 'replace' | 'nearby' | null
  const [confirmTargetSpot, setConfirmTargetSpot] = useState(null); // 교체 확인 대상 명소

  // 명소별 스마트 인근 대안 명소 목록
  const getAlternativeSpots = () => {
    if (cleanTitle.includes('경복궁')) {
      return [
        { id: 'alt-1', title: '창덕궁 & 후원', category: '역사문화', rating: 4.8, location: '서울특별시 종로구 율곡로 99', subway: '3호선 안국역 3번 출구 (도보 5분)', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '자연과 궁궐의 완벽한 조화를 이룬 유네스코 세계문화유산입니다.' },
        { id: 'alt-2', title: '국립현대미술관 서울', category: '전시·미술', rating: 4.7, location: '서울특별시 종로구 삼청로 30', subway: '3호선 안국역 1번 출구 (도보 7분)', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '도심 속에서 한국 현대 미술과 도심 정취를 함께 즐기는 힐링 명소입니다.' },
        { id: 'alt-3', title: '서촌 세종마을', category: '감성골목', rating: 4.6, location: '서울특별시 종로구 자하문로 일대', subway: '3호선 경복궁역 2번 출구 (도보 3분)', image: 'https://tong.visitkorea.or.kr/cms/resource/74/2613174_image2_1.jpg', description: '예술가들의 정취가 살아있는 아기자기한 한옥 골목과 감성 카페 거리입니다.' }
      ];
    }
    if (cleanTitle.includes('해운대') || cleanTitle.includes('블루라인') || cleanTitle.includes('엑스더스카이') || cleanTitle.includes('동백섬')) {
      return [
        { id: 'alt-h1', title: '해동용궁사', category: '사찰·바다', rating: 4.7, location: '부산광역시 기장군 용궁길 86', subway: '오시리아역 버스 10분', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '동해 푸른 바다 절벽 위에 세워진 가장 아름다운 해변 사찰입니다.' },
        { id: 'alt-h2', title: '달맞이길 전망대', category: '전망·카페', rating: 4.6, location: '부산광역시 해운대구 달맞이길 일대', subway: '중동역 도보 15분', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '해운대 바다가 한눈에 내려다보이는 감성 드라이브 & 오션뷰 카페 거리입니다.' },
        { id: 'alt-h3', title: '부산 엑스더스카이', category: '전망대', rating: 4.8, location: '부산광역시 해운대구 달맞이길 30', subway: '중동역 7번 출구 (도보 10분)', image: 'https://tong.visitkorea.or.kr/cms/resource/74/2613174_image2_1.jpg', description: '100층 높이에서 부산의 스카이라인과 바다를 360도로 조망하는 전망대입니다.' }
      ];
    }
    return [
      { id: 'alt-gen1', title: `${cleanTitle} 인근 추천지`, category: '추천명소', rating: 4.7, location: '인근 도보 5분', subway: '도보 5분', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '현재 위치에서 가장 가깝고 현지인들이 사랑하는 대표 명소입니다.' },
      { id: 'alt-gen2', title: `${cleanTitle} 감성 거리`, category: '문화거리', rating: 4.6, location: '인근 도보 10분', subway: '도보 10분', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '여유롭게 산책하며 감성적인 사진을 남기기 좋은 로컬 거리입니다.' }
    ];
  };

  // 명소별 도보 5분 내 로컬 맛집 & 감성 카페 목록
  const getNearbyFoodCafes = () => {
    if (cleanTitle.includes('경복궁') || cleanTitle.includes('인사동') || cleanTitle.includes('북촌')) {
      return [
        { name: '토속촌 삼계탕', type: '미식 🍲', distance: '도보 5분', desc: '진한 국물의 서울 대표 전통 삼계탕' },
        { name: '어니언 안국 (Cafe Onion)', type: '한옥카페 ☕', distance: '도보 6분', desc: '고즈넉한 한옥 중정에서 즐기는 스페셜티 베이커리 카페' },
        { name: '삼청동 수제비', type: '미식 🍜', distance: '도보 8분', desc: '미쉐린 가이드에 선정된 깔끔한 멸치 육수 수제비' }
      ];
    }
    if (cleanTitle.includes('해운대') || cleanTitle.includes('광안리') || cleanTitle.includes('블루라인') || cleanTitle.includes('엑스더스카이')) {
      return [
        { name: '해운대 소문난 암소갈비', type: '미식 🥩', distance: '도보 7분', desc: '감자사리가 일품인 부산 최고의 한우 갈비 명가' },
        { name: '랑데자뷰 해운대', type: '오션뷰카페 ☕', distance: '도보 4분', desc: '탁 트인 해운대 바다를 한눈에 담는 오션뷰 카페' },
        { name: '금수복국 본점', type: '로컬맛집 🍲', distance: '도보 5분', desc: '시원한 국물로 속을 풀어주는 50년 전통 복국' }
      ];
    }
    return [
      { name: '로컬 시그니처 대표 맛집', type: '미식 🍲', distance: '도보 3분', desc: '현지인들이 즐겨 찾는 대표 로컬 식당' },
      { name: '감성 베이커리 카페', type: '카페 ☕', distance: '도보 5분', desc: '아늑한 분위기에서 즐기는 스페셜티 커피와 디저트' }
    ];
  };

  // 정확한 위치 및 대중교통
  const location = spot.addr1 || spot.address || spot.location || (
    cleanTitle.includes('경복궁') ? '서울특별시 종로구 사직로 161' :
    cleanTitle.includes('인사동') ? '서울특별시 종로구 인사동길 44' :
    cleanTitle.includes('북촌') ? '서울특별시 종로구 계동길 37' :
    cleanTitle.includes('해운대') ? '부산광역시 해운대구 달맞이길62번길 13' :
    cleanTitle.includes('광안리') ? '부산광역시 수영구 광안해변로 219' :
    cleanTitle.includes('성산') ? '제주특별자치도 서귀포시 성산읍 일출로 284-12' :
    '대한민국 서울 일대'
  );

  const subwayTransit = spot.subway || (
    cleanTitle.includes('경복궁') ? '3호선 경복궁역 5번 출구 (도보 3분)' :
    cleanTitle.includes('인사동') ? '3호선 안국역 6번 출구 (도보 2분)' :
    cleanTitle.includes('북촌') ? '3호선 안국역 2번 출구 (도보 5분)' :
    cleanTitle.includes('해운대') ? '2호선 해운대역 5번 출구 (버스 10분)' :
    cleanTitle.includes('광안리') ? '2호선 광안역 3번 출구 (도보 10분)' :
    '인근 지하철역 또는 시내버스'
  );

  const operatingHours = spot.operatingHours || spot.usetime || (
    cleanTitle.includes('경복궁') ? '09:00 ~ 18:00 (입장마감 17:00)' :
    cleanTitle.includes('인사동') ? '10:30 ~ 20:30 (매장별 상이)' :
    '09:00 ~ 18:00 (상시 운영)'
  );

  const closedDays = spot.closedDays || spot.restdate || (
    cleanTitle.includes('경복궁') ? '화요일 휴관' : '연중무휴'
  );

  const admissionFee = spot.fee || spot.usefee || (
    cleanTitle.includes('경복궁') ? '성인 3,000원 (한복 착용 시 무료)' : '무료 관람'
  );

  const duration = spot.duration || (
    cleanTitle.includes('경복궁') ? '약 1.5 ~ 2시간' : '약 1 ~ 2시간'
  );

  const description = spot.description || spot.overview || (
    cleanTitle.includes('경복궁') 
      ? '조선 왕조 제일의 법궁으로, 웅장한 근정전과 연못 위에 세워진 경회루의 수려한 처마선이 한국 전통 건축미의 정점을 보여줍니다.'
      : cleanTitle.includes('인사동')
      ? '전통과 현대가 어우러진 거리로, 골목마다 자리한 전통 찻집과 나선형 쌈지길에서 한국의 감성을 만끽할 수 있습니다.'
      : 'VORA AI가 엄선한 한국의 대표적인 핫플레이스로 편리한 동선과 아름다운 경관을 자랑합니다.'
  );

  const rating = spot.rating || 4.8;
  const affiliateDeal = spot.affiliateDeal ? getSpotAffiliateDeal(cleanTitle, spot.region || spot.city || '서울', lang) : null;

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

  // 1단계: 교체 버튼 클릭 시 확인 다이얼로그 띄우기
  const handleRequestReplace = (altSpot) => {
    setConfirmTargetSpot(altSpot);
  };

  // 2단계: 확인창에서 '변경하기' 클릭 시 진짜 교체 실행 후 모달 닫기
  const handleConfirmReplace = () => {
    if (confirmTargetSpot) {
      if (onReplaceSpot) {
        onReplaceSpot(spot, confirmTargetSpot);
      }
      setConfirmTargetSpot(null);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 0.75rem 4rem 0.75rem' // 하단 탭 바 60px 안전 여백
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* ⚠️ 교체 확인 모달 다이얼로그 (선배님 요청 흐름 완벽 구현) */}
        {confirmTargetSpot && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.25rem',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AlertCircle size={32} style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Change Itinerary?' : '일정을 변경하시겠습니까?'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-main)' }}>'{cleanTitle}'</strong>
                  <span style={{ margin: '0 0.3rem' }}>➔</span>
                  <strong style={{ color: '#2563eb' }}>'{confirmTargetSpot.title}'</strong>
                  <br />
                  {lang === 'en' ? 'Update your trip & map route now.' : '내 일정과 지도 경로가 즉시 업데이트됩니다.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                <button
                  type="button"
                  onClick={() => setConfirmTargetSpot(null)}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'en' ? 'Cancel' : '취소'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReplace}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {lang === 'en' ? 'Confirm' : '변경하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. 4K High-Res Hero Photo (200px 슬림 뷰) */}
        <div style={{ position: 'relative', width: '100%', height: '200px', minHeight: '200px', flexShrink: 0, backgroundColor: '#0f172a', overflow: 'hidden' }}>
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
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                padding: '0.12rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.66rem',
                fontWeight: 800
              }}>
                {spot.category || spot.theme || '추천명소'}
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

        {/* 2. Modal Body (차분한 모노톤 & 안전 여백) */}
        <div 
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '0.85rem 1.1rem 2rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          {/* 1문장 스토리 소개 */}
          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            lineHeight: 1.55,
            color: 'var(--text-main)',
            opacity: 0.9
          }}>
            {description}
          </p>

          {/* 차분한 모노톤 1줄 플랫 정보 리스트 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            padding: '0.45rem 0',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.78rem'
          }}>
            {/* 1. 찾아가는 법 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '55px', fontWeight: 700 }}>
                • 교통
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {subwayTransit}</span>
            </div>

            {/* 2. 관람 시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '55px', fontWeight: 700 }}>
                • 시간
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                : {operatingHours} <span style={{ color: '#ef4444', marginLeft: '0.2rem', fontWeight: 700 }}>({closedDays})</span>
              </span>
            </div>

            {/* 3. 추천 소요시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '55px', fontWeight: 700 }}>
                • 소요
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {duration}</span>
            </div>

            {/* 4. 입장 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '55px', fontWeight: 700 }}>
                • 요금
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {admissionFee}</span>
            </div>
          </div>

          {/* ⚡ 3. 실시간 모바일 현장 액션 탭 (둘러보기 모드일 땐 교체 버튼 숨김!) */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.1rem' }}>
            {!spot.isExploreOnly && (
              <button
                type="button"
                onClick={() => setActivePanel(activePanel === 'replace' ? null : 'replace')}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  border: activePanel === 'replace' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: activePanel === 'replace' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                  color: activePanel === 'replace' ? 'var(--accent-primary)' : 'var(--text-main)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <RefreshCw size={12} />
                <span>{lang === 'en' ? 'Swap Place' : '다른 장소로 교체'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'nearby' ? null : 'nearby')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '10px',
                border: activePanel === 'nearby' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: activePanel === 'nearby' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                color: activePanel === 'nearby' ? 'var(--accent-primary)' : 'var(--text-main)',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Coffee size={12} />
              <span>{lang === 'en' ? 'Nearby Food/Cafe' : '주변 맛집/카페'}</span>
            </button>
          </div>

          {/* 🔄 패널 1: 인근 대안 명소 교체 리스트 */}
          {activePanel === 'replace' && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                {lang === 'en' ? '📍 Tap [Swap] to substitute spot:' : '📍 [교체] 클릭 시 확인 후 즉시 일정이 변경됩니다:'}
              </div>
              {getAlternativeSpots().map((alt) => (
                <div 
                  key={alt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.55rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {alt.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {alt.category} · {alt.subway}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRequestReplace(alt)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {lang === 'en' ? 'Swap' : '교체'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ☕ 패널 2: 도보 5분 내 로컬 맛집/카페 + 🗺️ 구글맵 실시간 길찾기 원클릭 연동 */}
          {activePanel === 'nearby' && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                {lang === 'en' ? '☕ Hand-picked spots within 5 mins walk (Tap map to navigate):' : '☕ 도보 5분 내 엄선 로컬 맛집 (길찾기 클릭 시 구글맵 연결):'}
              </div>
              {getNearbyFoodCafes().map((food, idx) => {
                const foodMapUrl = getGooglePlaceSearchUrl(food.name, location);
                return (
                  <div 
                    key={`nearby-food-${idx}`}
                    style={{
                      padding: '0.45rem 0.55rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.45rem'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {food.name}
                        </span>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          ({food.distance})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {food.desc}
                      </div>
                    </div>

                    {/* 🗺️ 맛집으로 바로 가는 구글맵 원클릭 길찾기 링크 */}
                    <a
                      href={foodMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-primary)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        flexShrink: 0
                      }}
                    >
                      <span>{lang === 'en' ? 'Map' : '길찾기'}</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. 하단 클린 모던 블루 액션 버튼 (잘림 0% 완전 노출) */}
          <div style={{
            marginTop: '0.35rem',
            display: 'grid',
            gridTemplateColumns: affiliateDeal ? '1.4fr 1fr' : '1fr',
            gap: '0.45rem'
          }}>
            {/* 1. 구글맵 길찾기 */}
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '10px',
                padding: '0.6rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>{lang === 'en' ? 'Google Maps ↗' : '구글맵 ↗'}</span>
              <ExternalLink size={12} />
            </a>

            {/* 2. 티켓/한복 예약 */}
            {affiliateDeal && (
              <a
                href={affiliateDeal.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
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
