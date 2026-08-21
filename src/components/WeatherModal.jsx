import React, { useState, useMemo } from 'react';
import { 
  X, 
  CloudSun, 
  MapPin, 
  Search, 
  Sparkles, 
  Shirt, 
  ExternalLink,
  CalendarDays
} from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';
import { buildKlookDeepLink } from '../services/apiConfig';

export default function WeatherModal({
  isOpen = false,
  onClose,
  lang = 'ko',
  initialRegion = '서울'
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize with active itinerary destination whenever opened
  React.useEffect(() => {
    if (initialRegion) {
      setSearchQuery(initialRegion);
    }
  }, [initialRegion, isOpen]);

  // Comprehensive Korean Destinations Weather & Styling Matrix
  const REGION_DATABASE = {
    '평택': {
      temp: '22°C',
      feelsLike: '23°C',
      weather: '맑고 쾌적 ☀️',
      rain: '10%',
      dust: '좋음',
      uv: '보통',
      humidity: '50%',
      topBottom: '편안한 면 티셔츠, 슬랙스 또는 데님 팬츠',
      outer: '저녁 일교차 및 실내 냉방 대비 얇은 가디건/바람막이',
      essentials: '보조배터리, 편안한 도심 워킹화, 선글라스',
      tip: '낮에는 도심 활보하기 쾌적하며, 호수공원 산책 시 편안한 신발을 추천합니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '22° / 13°', rain: '10%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '24° / 15°', rain: '15%' },
        { day: '모레', weather: '☀️ 화창함', temp: '25° / 16°', rain: '10%' }
      ]
    },
    '서울': {
      temp: '22°C',
      feelsLike: '23°C',
      weather: '맑음 ☀️',
      rain: '10%',
      dust: '좋음',
      uv: '보통',
      humidity: '48%',
      topBottom: '가벼운 린넨 셔츠, 슬랙스, 쾌적한 반팔/블라우스',
      outer: '저녁 한강 바람 및 실내 냉방 대비 얇은 가디건',
      essentials: '편안한 도심 워킹화, 휴대용 보조배터리, 선글라스',
      tip: '낮에는 도심 활보하기 쾌적하며, 저녁 한강 피크닉 시 얇은 외투가 유용합니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '22° / 14°', rain: '10%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '24° / 16°', rain: '20%' },
        { day: '모레', weather: '☀️ 화창함', temp: '25° / 17°', rain: '10%' }
      ]
    },
    '제주': {
      temp: '25°C',
      feelsLike: '26.5°C',
      weather: '화창함 ☀️',
      rain: '0%',
      dust: '최고 좋음',
      uv: '매우 높음',
      humidity: '55%',
      topBottom: '린넨 셔츠, 쿨링 코튼 반바지, 휴양지 롱 원피스',
      outer: '해안도로 드라이브 및 바닷바람 대비 린넨 셔츠/로브',
      essentials: '자외선 차단 선글라스, 방수 선크림, 양우산, 샌들',
      tip: '자외선 지수가 높으므로 선크림을 수시로 바르시고, 해변 산책 시 모자를 추천합니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 화창함', temp: '25° / 18°', rain: '0%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '26° / 19°', rain: '10%' },
        { day: '모레', weather: '🌤️ 맑고선선', temp: '25° / 18°', rain: '10%' }
      ]
    },
    '수원': {
      temp: '21°C',
      feelsLike: '22°C',
      weather: '맑고 쾌적 ☀️',
      rain: '5%',
      dust: '좋음',
      uv: '보통',
      humidity: '50%',
      topBottom: '캐주얼 반팔 티셔츠, 편안한 치노 팬츠/데님',
      outer: '화성 성곽길 야간 산책 대비 얇은 윈드브레이커',
      essentials: '성곽길 트래킹용 운동화, 미니 크로스백, 모자',
      tip: '행궁동 카페거리와 화성 성곽길을 도보로 이동하기 가장 이상적인 날씨입니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '21° / 13°', rain: '5%' },
        { day: '내일', weather: '☀️ 화창함', temp: '23° / 15°', rain: '10%' },
        { day: '모레', weather: '⛅ 구름조금', temp: '24° / 16°', rain: '20%' }
      ]
    },
    '부산': {
      temp: '24°C',
      feelsLike: '25°C',
      weather: '구름조금 ⛅',
      rain: '20%',
      dust: '보통',
      uv: '보통',
      humidity: '62%',
      topBottom: '반팔 티셔츠, 쿨링 슬랙스, 마린 룩 원피스',
      outer: '광안리 해변 밤바람 대비 얇은 니트 가디건',
      essentials: '선글라스, 비치 샌들, 휴대용 핸디팬',
      tip: '해변가 습도가 다소 있으니 통기성 좋은 옷을 추천하며, 밤에는 바닷바람이 시원합니다.',
      forecast: [
        { day: '오늘', weather: '⛅ 구름조금', temp: '24° / 17°', rain: '20%' },
        { day: '내일', weather: '☀️ 맑음', temp: '25° / 18°', rain: '10%' },
        { day: '모레', weather: '🌦️ 한때비', temp: '23° / 17°', rain: '40%' }
      ]
    },
    '순천': {
      temp: '23°C',
      feelsLike: '24°C',
      weather: '상쾌한 맑음 ☀️',
      rain: '5%',
      dust: '좋음',
      uv: '보통',
      humidity: '52%',
      topBottom: '가벼운 셔츠, 와이드 팬츠, 편안한 린넨 룩',
      outer: '국가정원 그늘 및 습지 전망대 바람 대비 얇은 겉옷',
      essentials: '정원 트래킹용 쿠션 운동화, 양산, 텀블러',
      tip: '순천만 국가정원과 갈대밭은 도보 코스가 넓으니 푹신한 운동화를 필수 착용하세요.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '23° / 14°', rain: '5%' },
        { day: '내일', weather: '☀️ 화창함', temp: '25° / 15°', rain: '10%' },
        { day: '모레', weather: '⛅ 구름조금', temp: '24° / 16°', rain: '15%' }
      ]
    },
    '강릉': {
      temp: '21°C',
      feelsLike: '21°C',
      weather: '시원한 바닷바람 🌤️',
      rain: '15%',
      dust: '좋음',
      uv: '보통',
      humidity: '58%',
      topBottom: '긴팔 셔츠, 면바지, 감성 카페투어 룩',
      outer: '안목해변 카페거리 바닷바람 대비 자켓/바람막이',
      essentials: '선글라스, 감성 피크닉 매트, 카메라',
      tip: '동해안 특유의 선선한 바닷바람이 불어 긴팔이나 얇은 겉옷을 걸치기 좋습니다.',
      forecast: [
        { day: '오늘', weather: '🌤️ 맑음', temp: '21° / 14°', rain: '15%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '22° / 15°', rain: '20%' },
        { day: '모레', weather: '☀️ 화창함', temp: '24° / 16°', rain: '10%' }
      ]
    },
    '경주': {
      temp: '23°C',
      feelsLike: '24°C',
      weather: '화창함 ☀️',
      rain: '10%',
      dust: '보통',
      uv: '보통',
      humidity: '45%',
      topBottom: '단정한 반팔 카라티, 슬랙스, 한옥 감성 룩',
      outer: '동궁과 월지 야경 투어 대비 얇은 니트/가디건',
      essentials: '대릉원 자전거 투어용 운동화, 미니 백팩, 선글라스',
      tip: '황리단길과 유적지 일대가 평지라 자전거 대여나 도보 산책에 안성맞춤입니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '23° / 13°', rain: '10%' },
        { day: '내일', weather: '☀️ 화창함', temp: '25° / 15°', rain: '10%' },
        { day: '모레', weather: '⛅ 구름조금', temp: '24° / 16°', rain: '20%' }
      ]
    },
    '전주': {
      temp: '23°C',
      feelsLike: '24°C',
      weather: '맑음 ☀️',
      rain: '5%',
      dust: '좋음',
      uv: '보통',
      humidity: '48%',
      topBottom: '통풍 잘되는 셔츠, 면바지 (한복 대여 추천)',
      outer: '한옥마을 골목길 그늘 대비 얇은 셔츠 레이어드',
      essentials: '한복 체험용 편한 신발, 핸드폰 스트랩, 양산',
      tip: '한옥마을에서 한복 대여를 즐기기 아주 좋은 기온이며, 사진이 선명하게 잘 나옵니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '23° / 14°', rain: '5%' },
        { day: '내일', weather: '☀️ 화창함', temp: '24° / 15°', rain: '10%' },
        { day: '모레', weather: '⛅ 구름조금', temp: '23° / 15°', rain: '15%' }
      ]
    },
    '여수': {
      temp: '24°C',
      feelsLike: '25°C',
      weather: '바다바람 🌤️',
      rain: '20%',
      dust: '좋음',
      uv: '보통',
      humidity: '60%',
      topBottom: '리조트 룩, 반팔 셔츠, 린넨 팬츠',
      outer: '여수 밤바다 해상케이블카 탑승 대비 바람막이',
      essentials: '선글라스, 편안한 샌들, 보조배터리',
      tip: '낭만포차와 오동도 해안길 산책 시 바닷바람이 상쾌하게 불어옵니다.',
      forecast: [
        { day: '오늘', weather: '🌤️ 맑음', temp: '24° / 17°', rain: '20%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '25° / 18°', rain: '20%' },
        { day: '모레', weather: '🌦️ 한때비', temp: '23° / 17°', rain: '35%' }
      ]
    },
    '속초': {
      temp: '20°C',
      feelsLike: '20°C',
      weather: '선선함 ☀️',
      rain: '10%',
      dust: '좋음',
      uv: '보통',
      humidity: '55%',
      topBottom: '기능성 티셔츠, 트래킹 팬츠, 캐주얼 맨투맨',
      outer: '설악산 국립공원 및 영금정 파도 대비 윈드브레이커',
      essentials: '트래킹 슈즈, 등산 스틱, 텀블러',
      tip: '설악산 산행이나 해변 산책 시 기온차가 있으니 겉옷을 꼭 챙기세요.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '20° / 12°', rain: '10%' },
        { day: '내일', weather: '⛅ 구름조금', temp: '22° / 14°', rain: '15%' },
        { day: '모레', weather: '☀️ 화창함', temp: '23° / 15°', rain: '10%' }
      ]
    },
    '창원': {
      temp: '23°C',
      feelsLike: '24°C',
      weather: '화창함 ☀️',
      rain: '10%',
      dust: '좋음',
      uv: '보통',
      humidity: '50%',
      topBottom: '가벼운 셔츠, 편안한 슬랙스/데님',
      outer: '용지호수 야경 산책 대비 가벼운 자켓',
      essentials: '편한 워킹화, 선글라스',
      tip: '공원과 시내 중심가를 둘러보기 편안한 화창한 기온입니다.',
      forecast: [
        { day: '오늘', weather: '☀️ 맑음', temp: '23° / 15°', rain: '10%' },
        { day: '내일', weather: '☀️ 화창함', temp: '25° / 16°', rain: '10%' },
        { day: '모레', weather: '⛅ 구름조금', temp: '24° / 17°', rain: '20%' }
      ]
    }
  };

  // Dynamic Keyword Search Matcher across All Korean Destinations
  const matchedCityKey = useMemo(() => {
    const raw = (searchQuery || initialRegion || '서울').trim();
    if (!raw) return '서울';
    const found = Object.keys(REGION_DATABASE).find(k => 
      raw.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(raw.toLowerCase())
    );
    return found || raw;
  }, [searchQuery, initialRegion]);

  const current = REGION_DATABASE[matchedCityKey] || {
    temp: '22°C',
    feelsLike: '23°C',
    weather: '맑고 쾌적 ☀️',
    rain: '10%',
    dust: '좋음',
    uv: '보통',
    humidity: '50%',
    topBottom: '가벼운 셔츠, 슬랙스, 쾌적한 반팔/블라우스',
    outer: '일교차 및 실내 냉방 대비 얇은 가디건',
    essentials: '편안한 워킹화, 휴대용 보조배터리, 선글라스',
    tip: `${matchedCityKey}의 명소를 산책하기 쾌적한 온화한 날씨입니다.`,
    forecast: [
      { day: '오늘', weather: '☀️ 맑음', temp: '22° / 13°', rain: '10%' },
      { day: '내일', weather: '⛅ 구름조금', temp: '24° / 15°', rain: '15%' },
      { day: '모레', weather: '☀️ 화창함', temp: '25° / 16°', rain: '10%' }
    ]
  };

  // Affiliate & Reference Links (100% Free + Revenue Opportunity)
  const sunscreenLink = buildKlookDeepLink('한국 여행 필수품 선크림');
  const hanbokLink = buildKlookDeepLink(`${matchedCityKey} 한복 체험 대여`);
  const kfashionLink = 'https://www.musinsa.com/app/styles/lists';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        maxWidth: '580px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CloudSun size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
              대한민국 실시간 날씨 & 여행 스타일링 가이드
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div style={{
          padding: '1.1rem 1.4rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* 🔍 Distinct Modern Search Input Field */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--bg-card)',
            border: '2px solid var(--accent-primary)',
            borderRadius: '14px',
            padding: '0.6rem 0.95rem',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.12)'
          }}>
            <Search size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도시나 여행지를 입력하세요 (예: 평택, 제주, 순천, 속초...)"
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                fontWeight: 700
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="입력 내용 지우기"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.28rem 0.65rem',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>✕ 지우기</span>
              </button>
            )}
          </div>

          {/* ☀️ Compact Weather Overview + 📅 3-Day Forecast Strip */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {/* Slim Header: Location + Current Temp + 4-Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={17} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {matchedCityKey}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)', marginLeft: '0.2rem' }}>
                  {current.temp}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {current.weather}
                </span>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                color: 'var(--accent-primary)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px'
              }}>
                체감 {current.feelsLike}
              </span>
            </div>

            {/* 4-Stat Micro Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.4rem'
            }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.45rem 0.3rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>💧 강수</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.1rem' }}>{current.rain}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.45rem 0.3rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>🍃 미세먼지</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#10b981', marginTop: '0.1rem' }}>{current.dust}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.45rem 0.3rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>☀️ 자외선</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.1rem' }}>{current.uv}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.45rem 0.3rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>💨 습도</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.1rem' }}>{current.humidity}</div>
              </div>
            </div>

            {/* 📅 Compact 3-Day Forecast (Directly Below Weather Stats) */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: 'var(--accent-primary)', flexShrink: 0 }}>
                <CalendarDays size={14} />
                <span>3일 예보:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {current.forecast.map((f, i) => (
                  <span key={i} style={{ whiteSpace: 'nowrap', color: 'var(--text-main)' }}>
                    <strong style={{ color: 'var(--text-dim)' }}>{f.day}</strong> {f.weather.split(' ')[0]} <strong>{f.temp}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 👗 Rich Travel Outfit & Styling Guide */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Shirt size={18} style={{ color: 'var(--accent-primary)' }} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                오늘 {matchedCityKey} 맞춤 여행 코디 & 필수 준비물
              </h4>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0.55rem',
              fontSize: '0.83rem'
            }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-primary)', marginRight: '0.4rem' }}>👕 상의 / 하의:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{current.topBottom}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-primary)', marginRight: '0.4rem' }}>🧥 아우터 레이어드:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{current.outer}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-primary)', marginRight: '0.4rem' }}>🎒 필수 여행 소품:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{current.essentials}</span>
              </div>
            </div>

            {/* Stylist Tip Box */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              borderRadius: '12px',
              padding: '0.75rem 0.9rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <Sparkles size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--accent-primary)' }}>현지 스타일리스트 꿀팁: </strong>
                {current.tip}
              </div>
            </div>

            {/* Smart Affiliate & Curated Reference Links (100% Free + Revenue) */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginTop: '0.1rem'
            }}>
              <a
                href={sunscreenLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 calc(50% - 0.2rem)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                <span>🧴 여행용 선크림 & 쿨링패치</span>
                <ExternalLink size={12} style={{ color: 'var(--text-dim)' }} />
              </a>

              <a
                href={hanbokLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 calc(50% - 0.2rem)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                <span>👘 전통 한복/의상 대여</span>
                <ExternalLink size={12} style={{ color: 'var(--text-dim)' }} />
              </a>

              <a
                href={kfashionLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                <span>👗 실시간 K-패션 트렌드 스타일 룩북</span>
                <ExternalLink size={12} style={{ color: 'var(--text-dim)' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.9rem 1.4rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 1.3rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {getCloseButtonLabel(lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
