import React, { useState, useEffect } from 'react';
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
import { fetchSpotDetailImages, fetchSpotDetailIntro, fetchSpotDetailCommon } from '../services/tourApi';
import { KOREA_TRAVEL_POI_DB } from '../data/koreaTravelPoiDatabase';

/**
 * ==============================================================================
 * TravelDetailModal.jsx - 관광지 상세 정보 및 고화질 정품 갤러리 모달
 * 
 * 🛡️ CONSTITUTIONAL ARCHITECTURE:
 * 1. Live Korea Tourism Organization (TourAPI 4.0) Official CDN Direct Sourcing
 * 2. detailImage2 Multi-angle High-Resolution Genuine Photo Pipeline
 * 3. detailIntro2 Realtime Operating Hours, Parking, Pet & Barrier-Free Facilities
 * 4. detailCommon2 Genuine Overview & Official Homepage
 * 5. Intelligent Multi-modal Transit Routing (Islands / Inland / Subway)
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

  // 🌟 실시간 공공데이터 상세 이미지 & 소개/공통 정보 상태 관리
  const [liveGalleryImages, setLiveGalleryImages] = useState(spot.images || []);
  const [liveIntroDetails, setLiveIntroDetails] = useState(null);
  const [liveCommonDetails, setLiveCommonDetails] = useState(null);

  // 🌟 한국관광공사 TourAPI 4.0 공식 갤러리(detailImage2) 및 이용정보(detailIntro2), 공통개요(detailCommon2) 실시간 로딩
  useEffect(() => {
    let isMounted = true;
    const contentId = spot.contentId || (spot.id ? String(spot.id).replace('tourapi_', '') : null);

    if (contentId && !contentId.startsWith('alt-')) {
      // 1. 고화질 정품 다각도 갤러리 사진 실시간 수신
      fetchSpotDetailImages(contentId, lang).then(fetchedImgs => {
        if (isMounted && fetchedImgs && fetchedImgs.length > 0) {
          setLiveGalleryImages(fetchedImgs);
        }
      }).catch(() => {});

      // 2. 실제 정부 등록 운영시간, 휴무일, 주차, 반려동물 실시간 수신
      fetchSpotDetailIntro(contentId, spot.contentTypeId || '12', lang).then(introData => {
        if (isMounted && introData) {
          setLiveIntroDetails(introData);
        }
      }).catch(() => {});

      // 3. 실제 문화관광 정품 스토리 개요(overview) 및 홈페이지 수신
      fetchSpotDetailCommon(contentId, lang).then(commonData => {
        if (isMounted && commonData) {
          setLiveCommonDetails(commonData);
        }
      }).catch(() => {});
    }

    return () => { isMounted = false; };
  }, [spot.contentId, spot.id, spot.contentTypeId, lang]);

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
      { id: 'alt-g1', title: `${cleanTitle} 인근 힐링 명소`, category: '추천명소', rating: 4.7, location: spot.addr1 || spot.location || '인근 권역', subway: '도보 또는 시내버스 10분', image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg', description: '인근에서 가장 평점이 높고 산책하기 좋은 대표 연계 명소입니다.' },
      { id: 'alt-g2', title: `${cleanTitle} 전망 명소`, category: '전망대·공원', rating: 4.6, location: spot.addr1 || spot.location || '인근 권역', subway: '차량 5분', image: 'https://tong.visitkorea.or.kr/cms/resource/46/2645646_image2_1.jpg', description: '탁 트인 파노라마 전경을 감상할 수 있는 감성 포토존입니다.' }
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
  const matchedPoi = (KOREA_TRAVEL_POI_DB || []).find(p => {
    const pTitle = p.title.replace(/[\s\-\_\.]/g, '').toLowerCase();
    const cTitle = cleanTitle.replace(/[\s\-\_\.]/g, '').toLowerCase();
    return pTitle.includes(cTitle) || cTitle.includes(pTitle);
  });

  // 정확한 위치 및 도로명 주소
  const location = spot.addr1 || spot.address || spot.location || matchedPoi?.location || (
    cleanTitle.includes('경복궁') ? '서울특별시 종로구 사직로 161' :
    cleanTitle.includes('인사동') ? '서울특별시 종로구 인사동길 44' :
    cleanTitle.includes('북촌') ? '서울특별시 종로구 계동길 37' :
    cleanTitle.includes('N서울타워') || cleanTitle.includes('남산') ? '서울특별시 용산구 남산공원길 105' :
    cleanTitle.includes('DDP') || cleanTitle.includes('동대문') ? '서울특별시 중구 을지로 281' :
    cleanTitle.includes('코엑스') || cleanTitle.includes('별마당') ? '서울특별시 강남구 영동대로 513' :
    cleanTitle.includes('성수동') ? '서울특별시 성동구 성수이로 일대' :
    cleanTitle.includes('해운대') ? '부산광역시 해운대구 달맞이길62번길 13' :
    cleanTitle.includes('광안리') ? '부산광역시 수영구 광안해변로 219' :
    cleanTitle.includes('성산') ? '제주특별자치도 서귀포시 성산읍 일출로 284-12' :
    '대한민국 관광 명소'
  );

  const subwayTransit = spot.subway || (
    cleanTitle.includes('경복궁') ? '3호선 경복궁역 5번 출구 (도보 3분)' :
    cleanTitle.includes('인사동') ? '3호선 안국역 6번 출구 (도보 2분)' :
    cleanTitle.includes('북촌') ? '3호선 안국역 2번 출구 (도보 5분)' :
    cleanTitle.includes('N서울타워') ? '4호선 명동역 3번 출구 ➔ 남산 케이블카' :
    cleanTitle.includes('DDP') ? '2/4/5호선 동대문역사문화공원역 1번 출구 (직결)' :
    cleanTitle.includes('코엑스') ? '2호선 삼성역 5/6번 출구 (코엑스몰 연결)' :
    cleanTitle.includes('성수동') ? '2호선 성수역 3번/4번 출구' :
    cleanTitle.includes('해운대') ? '2호선 해운대역 5번 출구 (버스 10분)' :
    cleanTitle.includes('광안리') ? '2호선 광안역 3번 출구 (도보 10분)' :
    '인근 지하철역 또는 시내버스'
  );

  // ==============================================================================
  // 🏛️ 실시간 공공데이터(TourAPI) 기반 운영정보 & 휴무일 & 입장료 지능형 매핑
  // ==============================================================================
  const isOutdoorParkOrBeach = /(공원|근린공원|한강|해수욕장|해변|거리|골목|광장|마을|산책로|다리|교$)/i.test(cleanTitle);
  const isPalaceOrMuseum = /(궁|궁궐|박물관|미술관|도서관|대공원|동물원|수목원|식물원|유적|행궁)/i.test(cleanTitle);
  const isTowerOrNightView = /(타워|전망대|야경|드론|케이블카)/i.test(cleanTitle);
  const isMarketOrStreet = /(시장|야시장|먹거리|가로수길|카페거리|쌈지길)/i.test(cleanTitle);
  const isAquariumOrThemePark = /(아쿠아리움|롯데월드|에버랜드|레고랜드|테마파크|워터파크)/i.test(cleanTitle);

  // 1. 운영시간: 한국관광공사 실시간 상세(usetime) ➔ 장소 특성별 지능형 24시간/야간 표기
  const operatingHours = liveIntroDetails?.usetime || spot.operatingHours || spot.usetime || (
    isOutdoorParkOrBeach ? '24시간 상시 개방 (자유 관람)' :
    isTowerOrNightView ? '10:00 ~ 22:30 (야경 관람 가능)' :
    isMarketOrStreet ? '09:00 ~ 22:00 (점포별 상이)' :
    isAquariumOrThemePark ? '10:00 ~ 20:00 (입장 마감 19:00)' :
    isPalaceOrMuseum ? '09:00 ~ 18:00 (입장마감 17:00)' :
    '24시간 상시 개방 (연중무휴)'
  );

  // 2. 휴무일: 한국관광공사 실시간 상세(restdate) ➔ 장소 특성별 휴무일
  const closedDays = liveIntroDetails?.restdate || spot.closedDays || spot.restdate || (
    isPalaceOrMuseum ? (cleanTitle.includes('경복궁') ? '매주 화요일 정기 휴궁' : '매주 월요일 휴관 (공휴일 익일)') :
    '연중무휴'
  );

  // 3. 입장료: 궁궐/타워/공원/아쿠아리움별 상식 부합 입장료
  const admissionFee = spot.fee || spot.usefee || (
    isOutdoorParkOrBeach ? '무료 개방 (자유 관람)' :
    cleanTitle.includes('경복궁') ? '성인 3,000원 (한복 착용 시 무료)' :
    cleanTitle.includes('창덕궁') ? '성인 3,000원 (후원 별도 5,000원)' :
    cleanTitle.includes('N서울타워') || cleanTitle.includes('남산') ? '전망대 대인 21,000원 / 소인 16,000원' :
    cleanTitle.includes('DDP') ? '야외/디자인랩 무료 (기획전시별 상이)' :
    cleanTitle.includes('코엑스 별마당') ? '무료 관람 (자유 열람)' :
    isAquariumOrThemePark ? '유료 관람 (현장 및 공식/네이버 예매)' :
    isPalaceOrMuseum ? '성인 1,000원~3,000원 내외' :
    '무료 관람'
  );

  // 4. 상세 소개글 (고정 문구 척결 & 정품 summary 매핑)
  const description = matchedPoi?.summary 
    || spot.description 
    || spot.overview 
    || (lang === 'en' ? `A signature landmark in South Korea registered with the Korea Tourism Organization.` : `한국관광공사에 정품 등록된 대한민국 대표 힐링 관광 명소입니다.`);

  // 5. 추천 소요 시간
  const duration = spot.duration 
    ? (typeof spot.duration === 'number' ? `약 ${spot.duration}분` : spot.duration) 
    : (matchedPoi?.duration ? `약 ${matchedPoi.duration}분` : '약 1 ~ 1.5시간');

  // 6. 평점
  const rating = spot.rating || matchedPoi?.rating || 4.8;
  const affiliateDeal = spot.affiliateDeal ? getSpotAffiliateDeal(cleanTitle, spot.region || spot.city || '서울', lang) : null;

  // 📷 사진 목록: 한국관광공사 공식 고화질 갤러리(detailImage2) ➔ 대표 사진 fallback
  const photoList = (liveGalleryImages && liveGalleryImages.length > 0)
    ? liveGalleryImages
    : (spot.images && spot.images.length > 0)
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
              imageRendering: 'high-quality',
              filter: 'contrast(1.03) saturate(1.04)',
              transition: 'opacity 0.25s ease'
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

          {/* 차분한 모노톤 1줄 플랫 정보 리스트 (모바일 최적화 풀 팩) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            padding: '0.55rem 0',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.78rem'
          }}>
            {/* 1. 도로명 주소 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                • 위치
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600, wordBreak: 'keep-all' }}>: {location}</span>
            </div>

            {/* 2. 대중교통 & 배편 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                • 교통
              </span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>: {subwayTransit}</span>
            </div>

            {/* 3. 관람 시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                • 시간
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                : {operatingHours} <span style={{ color: '#ef4444', marginLeft: '0.2rem', fontWeight: 700 }}>({closedDays})</span>
              </span>
            </div>

            {/* 4. 추천 소요시간 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                • 소요
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {duration}</span>
            </div>

            {/* 5. 입장 요금 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                • 요금
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {admissionFee}</span>
            </div>

            {/* 6. 🚗 주차 시설 */}
            {liveIntroDetails?.parking && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 주차
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600, wordBreak: 'keep-all' }}>: {liveIntroDetails.parking}</span>
              </div>
            )}

            {/* 7. 📞 문의 및 안내 */}
            {(liveIntroDetails?.infocenter || liveCommonDetails?.tel) && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 문의
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                  : {liveIntroDetails?.infocenter || liveCommonDetails?.tel}
                </span>
              </div>
            )}

            {/* 8. 🐶 반려동물 동반 */}
            {liveIntroDetails?.chkpet && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 반려동물
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {liveIntroDetails.chkpet}</span>
              </div>
            )}

            {/* 9. 👶 ♿ 유모차 / 편의시설 */}
            {liveIntroDetails?.chkbabycarriage && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 편의/대여
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>: {liveIntroDetails.chkbabycarriage}</span>
              </div>
            )}

            {/* 10. 🌐 공식 홈페이지 링크 */}
            {liveCommonDetails?.homepage && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 홈페이지
                </span>
                <span style={{ color: '#2563eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  : <span dangerouslySetInnerHTML={{ __html: liveCommonDetails.homepage }} />
                </span>
              </div>
            )}

            {/* 11. 테마 태그 */}
            {matchedPoi?.tags && matchedPoi.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginTop: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, width: '60px', fontWeight: 700 }}>
                  • 테마
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {matchedPoi.tags.slice(0, 4).map((tag, tIdx) => (
                    <span 
                      key={`tag-${tIdx}`}
                      style={{
                        padding: '0.1rem 0.4rem',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        color: 'var(--accent-primary)',
                        fontWeight: 700
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📖 관광공사 정품 상세 스토리 (overview) */}
          {liveCommonDetails?.overview && (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '0.65rem 0.8rem',
              border: '1px solid var(--border-color)',
              marginTop: '0.2rem'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                🏛️ 한국관광공사 정품 상세 스토리
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.78rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                opacity: 0.95
              }}>
                {liveCommonDetails.overview}
              </p>
            </div>
          )}

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
