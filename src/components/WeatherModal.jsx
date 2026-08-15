import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sun, Cloud, CloudRain, Thermometer, Umbrella, Calendar, Sparkles, X, MapPin, Shirt } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchRealtimeWeather } from '../services/weatherApi';

const POPULAR_CITIES = [
  '서울', '거제', '부산', '제주', '경주', '강릉', '인천', '전주', '여수', '속초', '수원'
];

const CITY_I18N = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾' },
  '거제': { en: 'Geoje', ja: '巨済', zh: '巨济', zht: '巨濟' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州' },
  '경주': { en: 'Gyeongju', ja: '慶州', zh: '庆州', zht: '慶州' },
  '강릉': { en: 'Gangneung', ja: '江陵', zh: '江陵', zht: '江陵' },
  '인천': { en: 'Incheon', ja: '仁川', zh: '仁川', zht: '仁川' },
  '전주': { en: 'Jeonju', ja: '全州', zh: '全州', zht: '全州' },
  '여수': { en: 'Yeosu', ja: '麗水', zh: '丽水', zht: '麗水' },
  '속초': { en: 'Sokcho', ja: '束草', zh: '束草', zht: '束草' },
  '수원': { en: 'Suwon', ja: '水原', zh: '水原', zht: '水原' }
};

export function getCityName(city, lang = 'ko') {
  if (CITY_I18N[city] && CITY_I18N[city][lang]) {
    return CITY_I18N[city][lang];
  }
  return city;
}

export function getTranslatedWeatherText(text, lang = 'ko') {
  if (!text) return '';
  if (lang === 'en') {
    if (text.includes('맑음')) return 'Sunny';
    if (text.includes('구름')) return 'Partly Cloudy';
    if (text.includes('흐림')) return 'Overcast';
    if (text.includes('비')) return 'Rainy';
    if (text.includes('눈')) return 'Snowy';
  } else if (lang === 'ja') {
    if (text.includes('맑음')) return '晴れ';
    if (text.includes('구름')) return '曇りがち';
    if (text.includes('흐림')) return '曇り';
    if (text.includes('비')) return '雨';
    if (text.includes('눈')) return '雪';
  } else if (lang === 'zh') {
    if (text.includes('맑음')) return '晴朗';
    if (text.includes('구름')) return '多云';
    if (text.includes('흐림')) return '阴天';
    if (text.includes('비')) return '有雨';
    if (text.includes('눈')) return '有雪';
  } else if (lang === 'zht') {
    if (text.includes('맑음')) return '晴朗';
    if (text.includes('구름')) return '多雲';
    if (text.includes('흐림')) return '陰天';
    if (text.includes('비')) return '有雨';
    if (text.includes('눈')) return '有雪';
  }
  return text;
}

export function getMultilingualOutfitTip(tempStr, lang = 'ko') {
  const tempNum = parseInt((tempStr || '20').replace(/[^0-9\-]/g, ''), 10) || 20;
  if (tempNum >= 28) {
    switch (lang) {
      case 'en': return '☀️ Hot summer weather. Breathable t-shirts, linen shorts/pants, sunglasses, and UV protection hats recommended.';
      case 'ja': return '☀️ 暑い夏日です。通気性の良い半袖Tシャツ、リネンパンツ、サングラス、日よけ帽子をおすすめします。';
      case 'zh': return '☀️ 天气炎热。建议穿着透气短袖、亚麻长裤，佩戴太阳镜及遮阳帽。';
      case 'zht': return '☀️ 天氣炎熱。建議穿著透氣短袖、亞麻長褲，配戴太陽眼鏡及遮陽帽。';
      default: return '☀️ 무더운 날씨입니다. 통풍이 잘되는 반팔 티셔츠, 린넨 바지, 선글라스, 자외선 차단 모자를 추천합니다.';
    }
  }
  if (tempNum >= 23) {
    switch (lang) {
      case 'en': return '🌤️ Pleasant weather for outdoor activities. Light shirts, cotton pants, and comfortable walking shoes recommended.';
      case 'ja': return '🌤️ 屋外観光に最適な快適な気候です。薄手のシャツや半袖、綿パンツ、歩きやすい靴がおすすめです。';
      case 'zh': return '🌤️ 适合户外游览的舒适天气。推荐薄衬衫、短袖、棉质长裤和舒适步行鞋。';
      case 'zht': return '🌤️ 適合戶外遊覽的舒適天氣。推薦薄襯衫、短袖、棉質長褲和舒適步行鞋。';
      default: return '🌤️ 야외 활동하기 좋은 쾌적한 날씨입니다. 얇은 셔츠나 반팔, 가벼운 면바지 및 편안한 워킹화가 좋습니다.';
    }
  }
  if (tempNum >= 17) {
    switch (lang) {
      case 'en': return '🍂 Temperature fluctuates between day & night. Bring a light cardigan, windbreaker jacket, and pants.';
      case 'ja': return '🍂 昼夜の寒暖差があります。軽いカーディガン、ウインドブレーカーやジャケット、長ズボンをご用意ください。';
      case 'zh': return '🍂 昼夜温差较大。建议准备轻便开衫、防风外套或夹克以及长裤。';
      case 'zht': return '🍂 晝夜溫差較大。建議準備輕便開衫、防風外套或夾克以及長褲。';
      default: return '🍂 일교차가 있을 수 있습니다. 가벼운 가디건, 바람막이나 자켓, 긴바지를 준비하세요.';
    }
  }
  if (tempNum >= 10) {
    switch (lang) {
      case 'en': return '🧥 Chilly weather. Thick knit sweaters, trench coat or jacket, and scarf recommended.';
      case 'ja': return '🧥 肌寒い天気です。厚手のニット、トレンチコートやジャケット、スカーフの着用をおすすめします。';
      case 'zh': return '🧥 天气微凉。建议穿着厚针织衫、风衣或夹克，佩戴围巾。';
      case 'zht': return '🧥 天氣微涼。建議穿著厚針織衫、風衣或夾克，配戴圍巾。';
      default: return '🧥 쌀쌀한 날씨입니다. 도톰한 니트, 트렌치코트나 자켓, 스카프를 착용하면 좋습니다.';
    }
  }
  switch (lang) {
    case 'en': return '❄️ Cold winter weather. Warm padded down jacket, scarf, gloves, thermal innerwear, and hot packs recommended.';
    case 'ja': return '❄️ 寒い冬の天気です。暖かいダウンジャケット、マフラー、手袋、保温インナー、カイロをお持ちください。';
    case 'zh': return '❄️ 寒冷冬日。请准备保暖羽绒服、围巾、手套、保暖内衣及暖宝宝。';
    case 'zht': return '❄️ 寒冷冬日。請準備保暖羽絨服、圍巾、手套、保暖內衣及暖暖包。';
    default: return '❄️ 추운 겨울 날씨입니다. 따뜻한 패딩 점퍼, 목도리, 장갑, 보온 내의와 핫팩을 챙기세요.';
  }
}

export default function WeatherModal({ isOpen, onClose, lang = 'ko', initialRegion = '서울' }) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [selectedCity, setSelectedCity] = useState(initialRegion || '서울');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 640 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchRealtimeWeather(selectedCity)
      .then(data => {
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCity]);

  const renderIcon = (iconName, size = 38) => {
    switch (iconName) {
      case 'Cloud': return <Cloud size={size} color="#38bdf8" />;
      case 'CloudRain': return <CloudRain size={size} color="#818cf8" />;
      case 'Sun':
      default: return <Sun size={size} color="#f59e0b" />;
    }
  };

  const modalNode = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000000,
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: isMobile ? '0' : '1rem',
      boxSizing: 'border-box'
    }}>
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '720px',
          minHeight: isMobile ? 'auto' : '530px',
          maxHeight: isMobile ? '92vh' : '90vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderRadius: isMobile ? '24px 24px 0 0' : '24px',
          border: '1.5px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: isMobile ? '0.85rem 1rem' : '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: isMobile ? '34px' : '38px',
              height: isMobile ? '34px' : '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
              flexShrink: 0
            }}>
              <Sun size={isMobile ? 18 : 20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: isMobile ? '0.98rem' : '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)', whiteSpace: 'nowrap' }}>
                  ☀️ {t.navWeather || '실시간 기후 센터'} ({getCityName(selectedCity, lang)})
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  background: 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  padding: '0.08rem 0.4rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  KMA 100%
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', margin: '0.1rem 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lang === 'en' ? 'Korea Meteorological Administration Realtime & 7-Day Forecast' :
                 lang === 'ja' ? '韓国気象庁(KMA) リアルタイム気象＆7日間週間予報' :
                 lang === 'zh' || lang === 'zht' ? '韩国气象厅 实时气象数据及7日预报' :
                 '전국 16개 권역 실시간 기상관측 데이터 & 7일 예보'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* City Selector Pills */}
        <div style={{
          padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          scrollbarWidth: 'none'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
            <MapPin size={13} /> {lang === 'en' ? 'City:' : lang === 'ja' ? '地域:' : lang === 'zh' || lang === 'zht' ? '地区:' : '지역:'}
          </span>
          {POPULAR_CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                background: selectedCity === city ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#ffffff',
                color: selectedCity === city ? '#ffffff' : '#334155',
                border: selectedCity === city ? 'none' : '1px solid #cbd5e1',
                padding: isMobile ? '0.2rem 0.55rem' : '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: isMobile ? '0.72rem' : '0.76rem',
                fontWeight: selectedCity === city ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCity === city ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
                flexShrink: 0
              }}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div style={{ 
          padding: isMobile ? '1rem' : '1.25rem 1.4rem', 
          overflowY: 'auto', 
          minHeight: isMobile ? 'auto' : '380px',
          maxHeight: isMobile ? 'calc(92vh - 170px)' : 'calc(90vh - 180px)',
          position: 'relative',
          transition: 'opacity 0.2s ease',
          opacity: loading ? 0.5 : 1
        }}>
          {weatherData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.85rem' : '1.1rem' }}>
              {/* Today Hero Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
                border: '1.5px solid rgba(2, 132, 199, 0.2)',
                borderRadius: '18px',
                padding: isMobile ? '0.9rem' : '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    padding: isMobile ? '0.6rem' : '0.8rem',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    flexShrink: 0
                  }}>
                    {renderIcon(weatherData.weatherIcon, isMobile ? 36 : 44)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                      <span style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}>
                        {getCityName(weatherData.region, lang)} {lang === 'en' ? 'Today' : lang === 'ja' ? '本日' : lang === 'zh' || lang === 'zht' ? '今日' : '오늘'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {weatherData.forecastDate}
                      </span>
                    </div>
                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 900, color: 'var(--text-main, #0f172a)' }}>
                      {getTranslatedWeatherText(weatherData.weatherText, lang)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1.2rem' : '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Thermometer size={isMobile ? 20 : 24} color="#ef4444" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {lang === 'en' ? 'Current' : lang === 'ja' ? '現在気温' : lang === 'zh' || lang === 'zht' ? '当前气温' : '현재 기온'}
                      </div>
                      <div style={{ fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: 900, color: '#ef4444' }}>{weatherData.temperature}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Umbrella size={isMobile ? 20 : 24} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {lang === 'en' ? 'Precipitation' : lang === 'ja' ? '降水確率' : lang === 'zh' || lang === 'zht' ? '降水概率' : '강수확률'}
                      </div>
                      <div style={{ fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: 900, color: '#0284c7' }}>{weatherData.rainProbability}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Outfit Guide */}
              <div style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.55rem'
              }}>
                <Shirt size={18} color="#9333ea" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9333ea', marginBottom: '0.15rem' }}>
                    👗 {lang === 'en' ? 'AI Weather Outfit Styling Guide' :
                        lang === 'ja' ? 'AI 天気別おすすめコーディネート' :
                        lang === 'zh' || lang === 'zht' ? 'AI 天气穿搭造型建议' :
                        '👗 AI 오늘 날씨 맞춤 코디 가이드'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.45 }}>
                    {getMultilingualOutfitTip(weatherData.temperature, lang)}
                  </div>
                </div>
              </div>

              {/* 7-Day Mid-term Forecast Grid */}
              {weatherData.midTermForecast && weatherData.midTermForecast.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-main, #0f172a)',
                    marginBottom: '0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Calendar size={14} color="#0284c7" />
                    {lang === 'en' ? '7-Day Mid-term Weather Forecast' :
                     lang === 'ja' ? '気象庁 7日間週間天気予報' :
                     lang === 'zh' || lang === 'zht' ? '韩国气象厅 7日周预报' :
                     '기상청 7일 주간 중기예보 전망'}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(115px, 1fr))',
                    gap: isMobile ? '0.5rem' : '0.6rem'
                  }}>
                    {weatherData.midTermForecast.map((mid, idx) => (
                      <div key={idx} style={{
                        backgroundColor: 'var(--bg-secondary, #f8fafc)',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: '12px',
                        padding: '0.6rem 0.4rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7' }}>
                          {lang === 'en' ? `+${mid.dayOffset} Days` :
                           lang === 'ja' ? `+${mid.dayOffset}日後` :
                           lang === 'zh' || lang === 'zht' ? `+${mid.dayOffset}天后` :
                           `+${mid.dayOffset}일 후`}
                        </span>
                        <div style={{ margin: '0.1rem 0' }}>
                          {renderIcon(mid.weatherIcon, 22)}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                          {getTranslatedWeatherText(mid.weatherText, lang)}
                        </span>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          🌧️ {mid.pop}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>
                          🌡️ {mid.tempRange}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.65rem 1rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          fontSize: '0.72rem',
          color: '#94a3b8'
        }}>
          <span>{lang === 'en' ? 'Data: Korea Meteorological Administration' :
                 lang === 'ja' ? 'データ提供: 大韓民国気象庁' :
                 lang === 'zh' || lang === 'zht' ? '数据来源: 大韩民国气象厅' :
                 '데이터 출처: 대한민국 기상청'}</span>
          <button
            onClick={onClose}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {lang === 'en' ? 'Close' : lang === 'ja' ? '閉じる' : lang === 'zh' || lang === 'zht' ? '关闭' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
