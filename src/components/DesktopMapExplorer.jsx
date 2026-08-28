import React, { useState } from 'react';
import { MapPin, Sparkles, Navigation, Calendar, ChevronRight, Compass, ShieldCheck, Heart } from 'lucide-react';

// 🗺️ 8대 핵심 대표 도시 정품 비주얼 데이터
const EXPLORER_CITIES = [
  {
    id: 'seoul',
    nameKo: '서울',
    nameEn: 'Seoul',
    badgeKo: 'K-컬처 & 트렌드의 수도',
    badgeEn: 'Capital of K-Culture & Trends',
    mapX: 29, // SVG X % (좌표 위치)
    mapY: 20, // SVG Y %
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['600년 조선 왕실의 심장 경복궁 & 창덕궁', 'MZ세대 글로벌 핫플 성수동 & 한남동', 'N서울타워 환상적인 360도 도심 야경'],
    highlightsEn: ['600-yr Royal Gyeongbokgung & Changdeokgung', 'Global MZ Trend Hubs: Seongsu & Hannam', 'N Seoul Tower panoramic 360° night view'],
    foodKo: '광장시장 마약김밥·빈대떡, 성수동 감성 브런치',
    foodEn: 'Gwangjang Market street food & Seongsu brunch',
    defaultDays: 3
  },
  {
    id: 'gangneung',
    nameKo: '강릉·속초',
    nameEn: 'Gangneung & Sokcho',
    badgeKo: '동해바다 & BTS 성지',
    badgeEn: 'East Sea Coast & BTS Landmark',
    mapX: 72,
    mapY: 18,
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['안목해변 솔향 가득한 커피거리 오션뷰', 'BTS 봄날 앨범 자켓 촬영지 주문진 정류장', '설악산 권금성 케이블카 웅장한 비경'],
    highlightsEn: ['Anmok Beach oceanfront coffee street', 'BTS "Spring Day" bus stop in Jumunjin', 'Seoraksan mountain cable car panoramic view'],
    foodKo: '초당 순두부 젤라또, 장칼국수, 속초 닭강정',
    foodEn: 'Chodang soft tofu gelato & spicy noodles',
    defaultDays: 2
  },
  {
    id: 'suwon',
    nameKo: '수원',
    nameEn: 'Suwon',
    badgeKo: '세계유산 화성과 행리단길',
    badgeEn: 'UNESCO Fortress & Trendy Alley',
    mapX: 31,
    mapY: 28,
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['유네스코 세계문화유산 웅장한 수원화성 & 방화수류정', '인스타 감성 카페 가득한 행궁동 행리단길', '플라잉 수원 열기구 상공 파노라마 뷰'],
    highlightsEn: ['UNESCO World Heritage Suwon Hwaseong', 'Trendy Haengnidan-gil cafes & boutique shops', 'Flying Suwon helium balloon scenic view'],
    foodKo: '원조 수원 왕갈비, 통닭거리 가마솥 치킨',
    foodEn: 'Original Suwon Royal Galbi & Fried Chicken',
    defaultDays: 1
  },
  {
    id: 'andong',
    nameKo: '안동',
    nameEn: 'Andong',
    badgeKo: '유네스코 하회마을 & 서원의 품격',
    badgeEn: 'UNESCO Hahoe Village & Confucian Heritage',
    mapX: 68,
    mapY: 42,
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['한국 서원 건축의 백미 유네스코 병산서원 만대루', '600년 조선의 숨결 안동 하회마을 & 부용대', '국내 최장 목책교 월영교 분수 야경 & 문보트'],
    highlightsEn: ['UNESCO Masterpiece Byeongsan Seowon Mandaeru', '600-year traditional Hahoe Folk Village', 'Woryeonggyo Bridge illuminated fountain & boat'],
    foodKo: '원조 안동 찜닭, 맘모스베이커리 크림치즈빵, 헛제사밥',
    foodEn: 'Original Andong Jjimdak & Mammoth Cream Bread',
    defaultDays: 2
  },
  {
    id: 'jeonju',
    nameKo: '전주',
    nameEn: 'Jeonju',
    badgeKo: '유네스코 미식과 고즈넉한 한옥',
    badgeEn: 'UNESCO Gastronomy & Hanok Village',
    mapX: 33,
    mapY: 53,
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['700여 채 전통 한옥이 모인 전주 한옥마을', '조선 태조 어진을 모신 경기전 & 대나무 숲길', '전동성당 로마네스크 양식 인생샷 명소'],
    highlightsEn: ['700+ Traditional Hanok Village alleys', 'Gyeonggijeon Shrine & tranquil bamboo grove', 'Historic Jeondong Catholic Cathedral'],
    foodKo: '원조 전주 비빔밥, 콩나물국밥, 수제 초코파이',
    foodEn: 'Authentic Jeonju Bibimbap & Choco Pie',
    defaultDays: 2
  },
  {
    id: 'gyeongju',
    nameKo: '경주',
    nameEn: 'Gyeongju',
    badgeKo: '천년고도 신라와 황리단길',
    badgeEn: 'Ancient Millennium Capital & Hanok Cafes',
    mapX: 78,
    mapY: 60,
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['천년의 신비 동궁과 월지 & 첨성대 황홀한 야경', '유네스코 세계문화유산 불국사 & 석굴암', '신구의 조화 한옥 카페거리 황리단길'],
    highlightsEn: ['Donggung Palace & Wolji Pond night lights', 'UNESCO Bulguksa Temple & Seokguram Grotto', 'Hwangnidan-gil trendy Hanok street'],
    foodKo: '경주 십원빵, 교리김밥, 맷돌순두부',
    foodEn: 'Gyeongju 10-Won Coin Bread & Gyori Gimbap',
    defaultDays: 2
  },
  {
    id: 'busan',
    nameKo: '부산·통영',
    nameEn: 'Busan & Tongyeong',
    badgeKo: '다이내믹 해양 도시 & 해운대',
    badgeEn: 'Dynamic Ocean City & Haeundae',
    mapX: 73,
    mapY: 74,
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['해운대 블루라인파크 해변열차 & 스카이캡슐', '광안대교 다이아몬드 브릿지 파노라마 오션뷰', '바다 위 절벽 사찰 해동용궁사'],
    highlightsEn: ['Haeundae Blueline Park coastal Sky Capsule', 'Gwangalli Diamond Bridge oceanfront view', 'Haedong Yonggungsa cliffside seaside temple'],
    foodKo: '부산 돼지국밥, 씨앗호떡, 자갈치 싱싱한 회',
    foodEn: 'Busan Pork Soup, Seed Hotteok & Fresh Sashimi',
    defaultDays: 3
  },
  {
    id: 'jeju',
    nameKo: '제주도',
    nameEn: 'Jeju Island',
    badgeKo: '에메랄드빛 청정 힐링 섬',
    badgeEn: 'Emerald Island & UNESCO Wonders',
    mapX: 25,
    mapY: 90,
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
    highlightsKo: ['바다 위로 솟은 유네스코 세계자연유산 성산일출봉', '에메랄드빛 바다 협재 & 함덕 해수욕장', '동백꽃과 곶자왈 원시림 카멜리아힐'],
    highlightsEn: ['UNESCO World Natural Heritage Seongsan Sunrise Peak', 'Crystal clear turquoise Hyeopjae & Hamdeok beaches', 'Camellia Hill botanical garden & Gotjawal forest'],
    foodKo: '제주 흑돼지 구이, 갈치조림, 오메기떡',
    foodEn: 'Jeju Black Pork BBQ & Silver Hairtail Stew',
    defaultDays: 3
  }
];

export default function DesktopMapExplorer({ lang = 'ko', onSelectCityPlan }) {
  const [selectedCityId, setSelectedCityId] = useState('andong');
  const [selectedDays, setSelectedDays] = useState(2);

  const currentCity = EXPLORER_CITIES.find(c => c.id === selectedCityId) || EXPLORER_CITIES[0];

  const handleCityClick = (city) => {
    setSelectedCityId(city.id);
    setSelectedDays(city.defaultDays);
  };

  const handleStartPlan = () => {
    if (onSelectCityPlan) {
      onSelectCityPlan(currentCity.nameKo, selectedDays);
    }
  };

  return (
    <div className="desktop-map-explorer-container hide-mobile" style={{
      width: '100%',
      maxWidth: '1160px',
      margin: '1.2rem auto 2.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(226, 232, 240, 0.9)',
      boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.1)',
      overflow: 'hidden',
      padding: '1.8rem 2rem'
    }}>
      {/* 🌟 Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          color: '#2563eb',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 800,
          marginBottom: '0.5rem'
        }}>
          <Compass size={14} />
          <span>{lang === 'en' ? 'Visual Korea Discovery' : '외국인을 위한 대한민국 인터랙티브 비주얼 탐색'}</span>
        </div>
        <h2 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          {lang === 'en' ? 'Where do you want to explore in Korea?' : '지명을 몰라도 괜찮아요! 가고 싶은 곳을 지도에서 콕 찍어보세요'}
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748b',
          margin: '0.35rem 0 0',
          fontWeight: 500
        }}>
          {lang === 'en' 
            ? 'Click any city on the interactive map to preview genuine landmarks & create instant AI itinerary' 
            : '지도에서 원하는 지역 핀을 누르면 대표 사진과 꿀팁을 확인하고, 0.2초 만에 AI 맞춤 일정을 완성할 수 있습니다.'}
        </p>
      </div>

      {/* 🌟 2-Column Split: [Left: SVG Map] + [Right: City Preview Card] */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.35fr',
        gap: '2rem',
        alignItems: 'center',
        minHeight: '440px'
      }}>
        
        {/* 🗺️ LEFT: Interactive Korea Vector Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '440px',
          backgroundColor: '#f1f5f9',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Subtle Sea / Peninsula Contour Silhouette Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: 0.45
          }} />

          {/* East Sea / West Sea Subtle Ocean Markers */}
          <span style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>동해 (East Sea) 🌊</span>
          <span style={{ position: 'absolute', top: '40px', left: '15px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>서해 (West Sea)</span>
          <span style={{ position: 'absolute', bottom: '15px', right: '30px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>남해 (South Sea)</span>

          {/* Simplified Decorative Korea Mainland Vector Silhouette */}
          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              width: '88%',
              height: '88%',
              filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.08))'
            }}
          >
            {/* Korea Peninsula Silhouette */}
            <path
              d="M 28 8 C 36 6, 68 10, 75 16 C 82 24, 85 45, 80 58 C 76 68, 76 75, 68 76 C 58 78, 40 76, 32 65 C 24 55, 22 35, 26 22 Z"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            {/* Jeju Island */}
            <ellipse cx="25" cy="90" rx="9" ry="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            {/* Ulleungdo & Dokdo */}
            <circle cx="88" cy="28" r="2.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="94" cy="31" r="1.4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          </svg>

          {/* 📍 Interactive City Pins on Canvas */}
          {EXPLORER_CITIES.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                style={{
                  position: 'absolute',
                  left: `${city.mapX}%`,
                  top: `${city.mapY}%`,
                  transform: 'translate(-50%, -50%)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' 
                    : '#ffffff',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  border: isSelected ? '2px solid #ffffff' : '1.5px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.28rem 0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isSelected 
                    ? '0 8px 20px rgba(37, 99, 235, 0.45), 0 0 0 3px rgba(37, 99, 235, 0.2)' 
                    : '0 4px 10px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isSelected ? 10 : 3,
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    e.currentTarget.style.borderColor = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#38bdf8' : '#2563eb'
                }} />
                <span>{lang === 'en' ? city.nameEn : city.nameKo}</span>
              </button>
            );
          })}
        </div>

        {/* 🏰 RIGHT: Selected City Rich Confirmation & Preview Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '1.4rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '440px'
        }}>
          {/* Card Top: Photo + Badge */}
          <div>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              borderRadius: '14px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <img
                src={currentCity.image}
                alt={currentCity.nameKo}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                color: '#ffffff'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                  {lang === 'en' ? currentCity.badgeEn : currentCity.badgeKo}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, lineHeight: 1.2 }}>
                  {lang === 'en' ? currentCity.nameEn : currentCity.nameKo}
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                {lang === 'en' ? '✨ Must-Visit Highlights' : '✨ 핵심 랜드마크 & 명소'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(lang === 'en' ? currentCity.highlightsEn : currentCity.highlightsKo).map((hl, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    color: '#1e293b',
                    fontWeight: 600
                  }}>
                    <ShieldCheck size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Foodie Secret */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '0.55rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid #f1f5f9',
              fontSize: '0.78rem',
              color: '#475569',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span style={{ fontSize: '0.9rem' }}>🍴</span>
              <span><strong>{lang === 'en' ? 'Famous Foods: ' : '대표 미식: '}</strong>{lang === 'en' ? currentCity.foodEn : currentCity.foodKo}</span>
            </div>
          </div>

          {/* Card Bottom: Duration Picker + CTA Button */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>
                {lang === 'en' ? '⏱️ Trip Duration:' : '⏱️ 여행 기간 선택:'}
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    style={{
                      border: selectedDays === d ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: selectedDays === d ? 'rgba(37, 99, 235, 0.1)' : '#ffffff',
                      color: selectedDays === d ? '#2563eb' : '#64748b',
                      borderRadius: '8px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {lang === 'en' ? `${d}D` : `${d}일`}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartPlan}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Sparkles size={16} />
              <span>
                {lang === 'en' 
                  ? `Create ${currentCity.nameEn} ${selectedDays}-Day Plan Now 🚀` 
                  : `✨ ${currentCity.nameKo} ${selectedDays}일 AI 맞춤 일정 만들기 🚀`}
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
