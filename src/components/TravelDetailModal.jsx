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
  Ticket,
  Hourglass,
  RefreshCw,
  Coffee,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 실시간 모바일 여행 OS 완성형
 * 
 * 1. 4K 고화질 히어로 사진 (210px) + 단일 명소명 & 별점
 * 2. 답답한 박스 없는 1문장 스토리 & 1줄 플랫 여행 정보
 * 3. ⚡ 실시간 현장 액션 바:
 *    - [ 🔄 다른 장소로 교체 ] ➔ 인근 대안 명소 3개 원클릭 교체 (일정 & 지도 0초 갱신)
 *    - [ ☕ 주변 맛집/카페 ]   ➔ 도보 5분 내 로컬 핫플 퀵뷰
 * 4. 하단 [ 🗺️ Google Maps 실시간 길찾기 ↗ ]
 * ==============================================================================
 */

export default function TravelDetailModal({ spot, onClose, onReplaceSpot, lang = 'ko' }) {
  if (!spot) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 단일 명소명 정제 (& 또는 / 제거)
  const rawTitle = spot.title || spot.name || '추천 여행 명소';
  const cleanTitle = rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();

  // 인터랙티브 상태 (교체 패널 / 주변 맛집 패널 열림 여부)
  const [activePanel, setActivePanel] = useState(null); // 'replace' | 'nearby' | null
  const [replaceSuccessMsg, setReplaceSuccessMsg] = useState('');

  // 명소별 스마트 인근 대안 명소 목록
  const getAlternativeSpots = () => {
    if (cleanTitle.includes('경복궁')) {
      return [
        { id: 'alt-1', title: '창덕궁 & 후원', category: '역사문화', rating: 4.8, location: '서울특별시 종로구 율곡로 99', subway: '3호선 안국역 3번 출구 (도보 5분)', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '자연과 궁궐의 완벽한 조화를 이룬 유네스코 세계문화유산입니다.' },
        { id: 'alt-2', title: '국립현대미술관 서울', category: '전시·미술', rating: 4.7, location: '서울특별시 종로구 삼청로 30', subway: '3호선 안국역 1번 출구 (도보 7분)', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '도심 속에서 한국 현대 미술과 도심 정취를 함께 즐기는 힐링 명소입니다.' },
        { id: 'alt-3', title: '서촌 세종마을', category: '감성골목', rating: 4.6, location: '서울특별시 종로구 자하문로 일대', subway: '3호선 경복궁역 2번 출구 (도보 3분)', image: 'https://tong.visitkorea.or.kr/cms/resource/74/2613174_image2_1.jpg', description: '예술가들의 정취가 살아있는 아기자기한 한옥 골목과 감성 카페 거리입니다.' }
      ];
    }
    if (cleanTitle.includes('해운대') || cleanTitle.includes('블루라인')) {
      return [
        { id: 'alt-h1', title: '해동용궁사', category: '사찰·바다', rating: 4.7, location: '부산광역시 기장군 용궁길 86', subway: '오시리아역 버스 10분', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '동해 푸른 바다 절벽 위에 세워진 가장 아름다운 해변 사찰입니다.' },
        { id: 'alt-h2', title: '달맞이길 전망대', category: '전망·카페', rating: 4.6, location: '부산광역시 해운대구 달맞이길 일대', subway: '중동역 도보 15분', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '해운대 바다가 한눈에 내려다보이는 감성 드라이브 & 오션뷰 카페 거리입니다.' },
        { id: 'alt-h3', title: '부산 엑스더스카이', category: '전망대', rating: 4.8, location: '부산광역시 해운대구 달맞이길 30', subway: '중동역 7번 출구 (도보 10분)', image: 'https://tong.visitkorea.or.kr/cms/resource/74/2613174_image2_1.jpg', description: '100층 높이에서 부산의 스카이라인과 바다를 360도로 조망하는 전망대입니다.' }
      ];
    }
    return [
      { id: 'alt-gen1', title: `${cleanTitle} 인근 핫플레이스`, category: '추천명소', rating: 4.7, location: '인근 도보 5분 거리', subway: '도보 5분', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '현재 위치에서 가장 가깝고 현지인들이 사랑하는 대표 추천 명소입니다.' },
      { id: 'alt-gen2', title: `${cleanTitle} 감성 문화거리`, category: '문화거리', rating: 4.6, location: '인근 도보 10분 거리', subway: '도보 10분', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '여유롭게 산책하며 감성적인 사진을 남기기 좋은 로컬 거리입니다.' }
    ];
  };

  // 명소별 도보 5분 내 로컬 맛집 & 감성 카페 목록
  const getNearbyFoodCafes = () => {
    if (cleanTitle.includes('경복궁') || cleanTitle.includes('인사동') || cleanTitle.includes('북촌')) {
      return [
        { name: '토속촌 삼계탕', type: '미식 🍲', distance: '도보 5분', desc: '대통령도 찾던 진한 견과류 국물의 서울 대표 삼계탕', rating: 4.8 },
        { name: '어니언 안국 (Cafe Onion)', type: '한옥카페 ☕', distance: '도보 6분', desc: '고즈넉한 전통 한옥 중정에서 즐기는 베이커리 & 스페셜티 커피', rating: 4.9 },
        { name: '삼청동 수제비', type: '미식 🍜', distance: '도보 8분', desc: '미쉐린 빕구르망에 선정된 시원하고 깊은 멸치 육수 수제비', rating: 4.7 }
      ];
    }
    if (cleanTitle.includes('해운대') || cleanTitle.includes('광안리')) {
      return [
        { name: '해운대 소문난 암소갈비', type: '미식 🥩', distance: '도보 7분', desc: '감자사리가 일품인 부산 최고의 전통 한우 갈비 명가', rating: 4.9 },
        { name: '랑데자뷰 해운대', type: '오션뷰카페 ☕', distance: '도보 4분', desc: '제주 감성과 탁 트인 해운대 바다를 한눈에 담는 오션뷰 카페', rating: 4.8 },
        { name: '금수복국 본점', type: '로컬맛집 🍲', distance: '도보 5분', desc: '뚝배기 가득 시원한 국물로 속을 풀어주는 50년 전통 복국', rating: 4.7 }
      ];
    }
    return [
      { name: '로컬 시그니처 대표 맛집', type: '미식 🍲', distance: '도보 3분', desc: '현지인들이 줄 서서 먹는 대표 시그니처 로컬 식당', rating: 4.8 },
      { name: '감성 루프탑 & 베이커리 카페', type: '카페 ☕', distance: '도보 5분', desc: '아늑한 분위기에서 여유롭게 커피를 즐기는 감성 공간', rating: 4.7 }
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
    (lang === 'en' ? 'Seoul, Republic of Korea' : lang === 'ja' ? '韓国・ソウル' : '대한민국 서울 일대')
  );

  const subwayTransit = spot.subway || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Line 3 Gyeongbokgung Stn. Exit 5 (3 min walk)' : lang === 'ja' ? '3号線 景福宮駅 5番出口 (徒歩3分)' : '3호선 경복궁역 5번 출구 (도보 3분)') :
    cleanTitle.includes('인사동') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 6 (2 min walk)' : lang === 'ja' ? '3号線 安国駅 6番出口 (徒歩2分)' : '3호선 안국역 6번 출구 (도보 2분)') :
    cleanTitle.includes('북촌') ? (lang === 'en' ? 'Line 3 Anguk Stn. Exit 2 (5 min walk)' : lang === 'ja' ? '3号線 安国駅 2番出口 (徒歩5分)' : '3호선 안국역 2번 출구 (도보 5분)') :
    cleanTitle.includes('해운대') ? (lang === 'en' ? 'Line 2 Haeundae Stn. Exit 5 (Bus 10 mins)' : lang === 'ja' ? '2号線 海雲台駅 5番出口 (バス10分)' : '2호선 해운대역 5번 출구 (버스 10분)') :
    cleanTitle.includes('광안리') ? (lang === 'en' ? 'Line 2 Gwangan Stn. Exit 3 (10 min walk)' : lang === 'ja' ? '2号線 広安駅 3番出口 (徒歩10分)' : '2호선 광안역 3번 출구 (도보 10분)') :
    (lang === 'en' ? 'Nearby Subway or City Bus' : lang === 'ja' ? '地下鉄または市内バス' : '인근 지하철역 또는 시내버스')
  );

  const operatingHours = spot.operatingHours || spot.usetime || (
    cleanTitle.includes('경복궁') ? '09:00 ~ 18:00 (입장마감 17:00)' :
    cleanTitle.includes('인사동') ? '10:30 ~ 20:30 (매장별 상이)' :
    '09:00 ~ 18:00 (상시 운영)'
  );

  const closedDays = spot.closedDays || spot.restdate || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Closed Tuesdays' : lang === 'ja' ? '火曜定休' : '화요일 휴관') :
    (lang === 'en' ? 'Open Year-Round' : lang === 'ja' ? '年中無休' : '연중무휴')
  );

  const admissionFee = spot.fee || spot.usefee || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Adult ₩3,000 (Free in Hanbok!)' : lang === 'ja' ? '大人 3,000ウォン (韓服着用で無料)' : '성인 3,000원 (한복 착용 시 무료)') :
    (lang === 'en' ? 'Free Admission' : lang === 'ja' ? '入場無料' : '무료 관람')
  );

  const duration = spot.duration || (
    cleanTitle.includes('경복궁') ? (lang === 'en' ? 'Approx. 1.5 - 2h' : lang === 'ja' ? '約 1.5〜2時間' : '약 1.5 ~ 2시간') :
    (lang === 'en' ? 'Approx. 1 - 2h' : lang === 'ja' ? '約 1〜2時間' : '약 1 ~ 2시간')
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

  // 원클릭 장소 교체 실행
  const handleExecuteReplace = (newSpot) => {
    if (onReplaceSpot) {
      onReplaceSpot(spot, newSpot);
      setReplaceSuccessMsg(lang === 'en' ? `Replaced with ${newSpot.title}!` : lang === 'ja' ? `${newSpot.title}に変更しました！` : `${newSpot.title}(으)로 일정이 교체되었습니다! ✨`);
      setTimeout(() => {
        setReplaceSuccessMsg('');
        setActivePanel(null);
      }, 1200);
    }
  };

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
          maxHeight: '90vh',
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

        {/* 2. Modal Body (답답한 박스 없는 플랫 리스트 + 현장형 실시간 액션) */}
        <div 
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '0.85rem 1.1rem 1.25rem 1.1rem',
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
            opacity: 0.95
          }}>
            {description}
          </p>

          {/* 무박스 1줄 플랫 정보 리스트 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            padding: '0.4rem 0',
            borderTop: '1px solid rgba(226, 232, 240, 0.6)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
            fontSize: '0.78rem'
          }}>
            {/* 1. 찾아가는 법 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#059669', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '65px', fontWeight: 700 }}>
                <Navigation size={12} />
                <span>{lang === 'en' ? 'Transit' : '교통'}</span>
              </span>
              <span style={{ color: '#059669', fontWeight: 700 }}>: {subwayTransit}</span>
            </div>

            {/* 2. 관람 시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#0284c7', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '65px', fontWeight: 700 }}>
                <Clock size={12} />
                <span>{lang === 'en' ? 'Hours' : '시간'}</span>
              </span>
              <span style={{ color: 'var(--text-main)' }}>
                : {operatingHours} <strong style={{ color: '#ef4444', marginLeft: '0.25rem' }}>({closedDays})</strong>
              </span>
            </div>

            {/* 3. 추천 소요시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#d97706', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '65px', fontWeight: 700 }}>
                <Hourglass size={12} />
                <span>{lang === 'en' ? 'Duration' : '소요'}</span>
              </span>
              <span style={{ color: 'var(--text-main)' }}>: {duration}</span>
            </div>

            {/* 4. 입장 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: '#8b5cf6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', width: '65px', fontWeight: 700 }}>
                <Ticket size={12} />
                <span>{lang === 'en' ? 'Fee' : '요금'}</span>
              </span>
              <span style={{ color: '#8b5cf6', fontWeight: 700 }}>: {admissionFee}</span>
            </div>
          </div>

          {/* ⚡ 3. 실시간 모바일 현장 액션 탭 (원터치 교체 & 주변 맛집) */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.1rem' }}>
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'replace' ? null : 'replace')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activePanel === 'replace' ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
                color: activePanel === 'replace' ? '#ffffff' : '#2563eb',
                fontSize: '0.74rem',
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
              <span>{lang === 'en' ? 'Swap Place 🔄' : lang === 'ja' ? '別の場所に変更' : '다른 장소로 교체 🔄'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'nearby' ? null : 'nearby')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activePanel === 'nearby' ? '#d97706' : 'rgba(217, 119, 6, 0.08)',
                color: activePanel === 'nearby' ? '#ffffff' : '#d97706',
                fontSize: '0.74rem',
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
              <span>{lang === 'en' ? 'Nearby Food/Cafe ☕' : lang === 'ja' ? '周辺グルメ・カフェ' : '주변 맛집/카페 ☕'}</span>
            </button>
          </div>

          {/* 성공 토스트 메시지 */}
          {replaceSuccessMsg && (
            <div style={{
              padding: '0.45rem 0.75rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              animation: 'fadeIn 0.2s ease'
            }}>
              <CheckCircle2 size={14} />
              <span>{replaceSuccessMsg}</span>
            </div>
          )}

          {/* 🔄 패널 1: 인근 대안 명소 3개 원터치 교체 리스트 */}
          {activePanel === 'replace' && (
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              borderRadius: '12px',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb' }}>
                {lang === 'en' ? '📍 Select alternative spot to replace in itinerary:' : '📍 클릭 즉시 내 일정과 지도의 코스가 교체됩니다:'}
              </div>
              {getAlternativeSpots().map((alt) => (
                <div 
                  key={alt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.5rem',
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
                    onClick={() => handleExecuteReplace(alt)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {lang === 'en' ? 'Select' : '교체'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ☕ 패널 2: 도보 5분 내 로컬 맛집 & 감성 카페 퀵뷰 */}
          {activePanel === 'nearby' && (
            <div style={{
              backgroundColor: 'rgba(217, 119, 6, 0.04)',
              border: '1px solid rgba(217, 119, 6, 0.15)',
              borderRadius: '12px',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706' }}>
                {lang === 'en' ? '☕ Hand-picked spots within 5 mins walk:' : '☕ 도보 5분 내 VORA 엄선 로컬 맛집 & 카페:'}
              </div>
              {getNearbyFoodCafes().map((food, idx) => (
                <div 
                  key={`nearby-food-${idx}`}
                  style={{
                    padding: '0.4rem 0.5rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {food.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#d97706', backgroundColor: 'rgba(217,119,6,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      {food.type} · {food.distance}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {food.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. 하단 원클릭 구글맵 길찾기 & 특가 예약 */}
          <div style={{
            marginTop: '0.15rem',
            display: 'grid',
            gridTemplateColumns: affiliateDeal ? '1.5fr 1fr' : '1fr',
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
                padding: '0.55rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>{lang === 'en' ? 'Google Maps Route ↗' : lang === 'ja' ? 'Googleマップでナビ ↗' : '구글맵 실시간 길찾기 ↗'}</span>
              <ExternalLink size={12} />
            </a>

            {/* 2. 티켓/한복 예약 (제휴 시) */}
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
                  padding: '0.55rem 0.65rem',
                  fontSize: '0.78rem',
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
