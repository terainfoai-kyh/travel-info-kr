import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Compass, ShieldCheck, ChevronRight, MapPin, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// 🗺️ 8대 핵심 대표 도시 정품 비주얼 & 리얼 좌표 데이터
const EXPLORER_CITIES = [
  {
    id: 'seoul',
    nameKo: '서울',
    nameEn: 'Seoul',
    badgeKo: 'K-컬처 & 트렌드의 수도',
    badgeEn: 'Capital of K-Culture & Trends',
    lat: 37.5665,
    lng: 126.9780,
    zoom: 11,
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
    lat: 37.7519,
    lng: 128.8761,
    zoom: 11,
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
    lat: 37.2836,
    lng: 127.0186,
    zoom: 12,
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
    lat: 36.5683,
    lng: 128.7294,
    zoom: 11,
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
    lat: 35.8242,
    lng: 127.1480,
    zoom: 12,
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
    lat: 35.8562,
    lng: 129.2247,
    zoom: 11,
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
    lat: 35.1796,
    lng: 129.0756,
    zoom: 11,
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
    lat: 33.3896,
    lng: 126.5312,
    zoom: 10,
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
  const [isLeafletReady, setIsLeafletReady] = useState(Boolean(typeof window !== 'undefined' && window.L));
  
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});

  const currentCity = EXPLORER_CITIES.find(c => c.id === selectedCityId) || EXPLORER_CITIES[0];

  // 1. Dynamic Leaflet Asset Loader
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    }
  }, []);

  // 2. Initialize Real High-Resolution OpenStreetMap Canvas
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Create Leaflet Map Instance centered on South Korea
      const map = window.L.map(mapContainerRef.current, {
        center: [35.8, 127.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false // Keep page scroll smooth
      });

      // CartoDB Voyager / OpenStreetMap Clean High-DPI Tiles
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      leafletMapRef.current = map;

      // Add Custom Glowing Marker Pins for All 8 Cities
      EXPLORER_CITIES.forEach((city) => {
        const isSelected = city.id === selectedCityId;
        const iconHtml = `
          <div class="custom-map-explorer-pin ${isSelected ? 'pin-selected' : ''}" style="
            display: flex;
            align-items: center;
            gap: 5px;
            background: ${isSelected ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#ffffff'};
            color: ${isSelected ? '#ffffff' : '#0f172a'};
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.18);
            border: 2px solid ${isSelected ? '#ffffff' : '#cbd5e1'};
            cursor: pointer;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
          ">
            <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${isSelected ? '#38bdf8' : '#2563eb'};"></span>
            <span>${lang === 'en' ? city.nameEn : city.nameKo}</span>
          </div>
        `;

        const customIcon = window.L.divIcon({
          html: iconHtml,
          className: 'vora-explorer-div-icon',
          iconSize: [0, 0]
        });

        const marker = window.L.marker([city.lat, city.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedCityId(city.id);
          setSelectedDays(city.defaultDays);
        });

        markersRef.current[city.id] = marker;
      });
    }

    return () => {
      // Map stays alive during tab session
    };
  }, [isLeafletReady]);

  // 3. Pan / FlyTo on City Selection Change
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    const city = EXPLORER_CITIES.find(c => c.id === selectedCityId);
    if (city) {
      leafletMapRef.current.flyTo([city.lat, city.lng], city.zoom || 10, {
        duration: 0.9,
        easeLinearity: 0.25
      });
    }

    // Refresh all markers to update selected highlight
    EXPLORER_CITIES.forEach((c) => {
      const isSelected = c.id === selectedCityId;
      const marker = markersRef.current[c.id];
      if (marker) {
        const iconHtml = `
          <div class="custom-map-explorer-pin ${isSelected ? 'pin-selected' : ''}" style="
            display: flex;
            align-items: center;
            gap: 5px;
            background: ${isSelected ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#ffffff'};
            color: ${isSelected ? '#ffffff' : '#0f172a'};
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: ${isSelected ? '0 8px 22px rgba(37,99,235,0.45), 0 0 0 3px rgba(37,99,235,0.25)' : '0 4px 12px rgba(0,0,0,0.14)'};
            border: 2px solid ${isSelected ? '#ffffff' : '#cbd5e1'};
            cursor: pointer;
            transform: translate(-50%, -50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: all 0.2s ease;
            z-index: ${isSelected ? 1000 : 1};
          ">
            <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${isSelected ? '#38bdf8' : '#2563eb'};"></span>
            <span>${lang === 'en' ? c.nameEn : c.nameKo}</span>
          </div>
        `;
        marker.setIcon(window.L.divIcon({
          html: iconHtml,
          className: 'vora-explorer-div-icon',
          iconSize: [0, 0]
        }));
      }
    });
  }, [selectedCityId, lang]);

  const handleCityClick = (city) => {
    setSelectedCityId(city.id);
    setSelectedDays(city.defaultDays);
  };

  const handleResetView = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([35.8, 127.8], 7, { duration: 0.8 });
    }
  };

  const handleStartPlan = () => {
    if (onSelectCityPlan) {
      onSelectCityPlan(currentCity.nameKo, selectedDays);
    }
  };

  return (
    <div className="desktop-map-explorer-container hide-mobile" style={{
      width: '100%',
      maxWidth: '1260px',
      margin: '0.8rem auto 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(226, 232, 240, 0.9)',
      boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.1)',
      overflow: 'hidden',
      padding: '1.4rem 1.6rem'
    }}>
      {/* 🌟 Header Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.8rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Compass size={18} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {lang === 'en' ? 'Where do you want to explore in Korea?' : '지명을 몰라도 괜찮아요! 지도에서 가고 싶은 곳을 콕 찍어보세요'}
            </h2>
            <p style={{
              fontSize: '0.76rem',
              color: '#64748b',
              margin: '0.1rem 0 0',
              fontWeight: 500
            }}>
              {lang === 'en' 
                ? 'Click any genuine city marker on the live map to explore 4K landmarks & build instant AI itinerary' 
                : '실제 대한민국 지도에서 원하는 지역 핀을 누르면 대표 사진과 꿀팁을 확인하고, 0.2초 만에 AI 맞춤 일정을 완성합니다.'}
            </p>
          </div>
        </div>

        {/* City Quick Pills Strip */}
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          {EXPLORER_CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCityClick(c)}
              style={{
                border: selectedCityId === c.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: selectedCityId === c.id ? '#2563eb' : '#ffffff',
                color: selectedCityId === c.id ? '#ffffff' : '#475569',
                borderRadius: '9999px',
                padding: '0.22rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'en' ? c.nameEn : c.nameKo}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 2-Column Split: [Left: Real Leaflet Map] + [Right: City Preview Card] */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1.05fr',
        gap: '1.4rem',
        alignItems: 'stretch',
        minHeight: '380px'
      }}>
        
        {/* 🗺️ LEFT: Real OpenStreetMap Leaflet Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '380px',
          height: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
        }}>
          {/* Leaflet Mount Node */}
          <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '100%', minHeight: '380px' }} 
          />

          {/* Map Controls Floating Overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 400
          }}>
            <button
              onClick={() => leafletMapRef.current && leafletMapRef.current.zoomIn()}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
              title="Zoom In"
            >
              <ZoomIn size={14} color="#0f172a" />
            </button>
            <button
              onClick={() => leafletMapRef.current && leafletMapRef.current.zoomOut()}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={14} color="#0f172a" />
            </button>
            <button
              onClick={handleResetView}
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
              title="전국 전도 리셋"
            >
              <RefreshCw size={12} color="#0f172a" />
            </button>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#64748b',
            zIndex: 400,
            pointerEvents: 'none'
          }}>
            🗺️ OpenStreetMap Korea Live
          </div>
        </div>

        {/* 🏰 RIGHT: Selected City Rich Confirmation & Preview Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px'
        }}>
          {/* Card Top: Photo + Badge */}
          <div>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '140px',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '0.8rem'
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '10px',
                color: '#ffffff'
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8' }}>
                  {lang === 'en' ? currentCity.badgeEn : currentCity.badgeKo}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1.2 }}>
                  {lang === 'en' ? currentCity.nameEn : currentCity.nameKo}
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                {lang === 'en' ? '✨ Must-Visit Highlights' : '✨ 핵심 랜드마크 & 명소'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {(lang === 'en' ? currentCity.highlightsEn : currentCity.highlightsKo).map((hl, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    color: '#1e293b',
                    fontWeight: 600
                  }}>
                    <ShieldCheck size={13} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Foodie Secret */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: '1px solid #f1f5f9',
              fontSize: '0.74rem',
              color: '#475569',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.85rem' }}>🍴</span>
              <span><strong>{lang === 'en' ? 'Food: ' : '대표 미식: '}</strong>{lang === 'en' ? currentCity.foodEn : currentCity.foodKo}</span>
            </div>
          </div>

          {/* Card Bottom: Duration Picker + CTA Button */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b' }}>
                {lang === 'en' ? '⏱️ Trip Duration:' : '⏱️ 여행 기간 선택:'}
              </span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    style={{
                      border: selectedDays === d ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: selectedDays === d ? 'rgba(37, 99, 235, 0.1)' : '#ffffff',
                      color: selectedDays === d ? '#2563eb' : '#64748b',
                      borderRadius: '6px',
                      padding: '0.18rem 0.45rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
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
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.28)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Sparkles size={15} />
              <span>
                {lang === 'en' 
                  ? `Create ${currentCity.nameEn} ${selectedDays}-Day Plan Now 🚀` 
                  : `✨ ${currentCity.nameKo} ${selectedDays}일 AI 맞춤 일정 만들기 🚀`}
              </span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
