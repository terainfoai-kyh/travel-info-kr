import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CloudSun, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Navigation,
  Compass,
  Shirt,
  Utensils,
  Moon,
  Clock,
  Play
} from 'lucide-react';

export default function InteractiveQuickTour({ 
  isOpen = false, 
  onClose, 
  lang = 'ko',
  onStartExploring 
}) {
  const [currentStep, setCurrentStep] = useState(0);

  // Interactive Demo States for Step 1 (Map Simulation)
  const [demoCity, setDemoCity] = useState('busan');

  // Interactive Demo States for Step 2 (Plan Simulation)
  const [demoDays, setDemoDays] = useState(3);
  const [demoGenerated, setDemoGenerated] = useState(false);

  // Interactive Demo States for Step 4 (Chat Simulation)
  const [demoChatOption, setDemoChatOption] = useState('cafe');

  if (!isOpen) return null;

  const CITIES_DATA = {
    seoul: {
      name: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' },
      photo: '/images/themes/theme-gyeongbokgung.jpg',
      tag: { ko: '경복궁 & 성수동 카페거리', en: 'Gyeongbokgung & Seongsu Cafes', ja: '景福宮＆聖水洞カフェ', zh: '景福宫与圣水洞咖啡街' },
      food: { ko: '광장시장 마약김밥 & 빈대떡', en: 'Gwangjang Market Kimbap & Bindaetteok', ja: '広蔵市場キンパ＆チヂミ', zh: '广藏市场紫菜包饭与绿豆煎饼' }
    },
    busan: {
      name: { ko: '부산', en: 'Busan', ja: '釜山', zh: '釜山' },
      photo: '/images/themes/theme-busan.jpg',
      tag: { ko: '해운대 블루라인파크 & 광안대교', en: 'Haeundae Blueline & Gwangandaegyo', ja: '海雲台ブルーライン＆広安大橋', zh: '海云台蓝线公园与广安大桥' },
      food: { ko: '자갈치시장 활어회 & 돼지국밥', en: 'Jagalchi Sashimi & Pork Soup', ja: 'チャガルチ刺身＆テジクッパ', zh: '札嘎其生鱼片与猪肉汤饭' }
    },
    jeju: {
      name: { ko: '제주', en: 'Jeju', ja: '済州', zh: '济州' },
      photo: '/images/themes/theme-jeju.jpg',
      tag: { ko: '성산일출봉 & 애월 한담해변', en: 'Seongsan Peak & Aewol Coast', ja: '城山日出峰＆涯月海岸', zh: '城山日出峰与涯月海岸' },
      food: { ko: '제주 흑돼지 & 고기국수', en: 'Black Pork BBQ & Gogi Guksu', ja: '済州黒豚焼肉＆肉うどん', zh: '济州黑猪肉与猪肉汤面' }
    },
    gangneung: {
      name: { ko: '강릉', en: 'Gangneung', ja: '江陵', zh: '江陵' },
      photo: '/images/themes/theme-gangneung.jpg',
      tag: { ko: '안목해변 커피거리 & BTS 정류장', en: 'Anmok Coffee Street & BTS Stop', ja: '安木カフェ通り＆BTSバス停', zh: '安木咖啡街与BTS车站' },
      food: { ko: '초당 순두부 & 닭강정', en: 'Chodang Soft Tofu & Dakgangjeong', ja: '草堂スンドゥブ＆チキン', zh: '草堂嫩豆腐与炸鸡块' }
    }
  };

  const currentCityData = CITIES_DATA[demoCity] || CITIES_DATA.busan;

  const TOUR_STEPS = [
    {
      stepNumber: 1,
      badge: { ko: '1단계 · 지도 탐색', en: 'Step 1 · Map Explorer', ja: 'ステップ1 · 地図探索', zh: '第1步 · 地图探索' },
      title: { 
        ko: '지도를 콕 찍어 전국 226개 시·군 4K 명소를 한눈에!', 
        en: 'Click any city on the map to explore 226 regions in 4K!', 
        ja: '地図をクリックして全国226都市の4K絶景を一目で確認！', 
        zh: '点击地图任意城市，一览韩国226个市郡的4K风光！' 
      },
      desc: {
        ko: '원하는 도시(서울, 부산, 제주, 강릉 등)를 클릭하면 한국관광공사 정품 4K 사진, 대표 랜드마크, 로컬 맛집 비밀이 실시간으로 펼쳐집니다.',
        en: 'Click any destination to instantly reveal official 4K photos, top attractions, and hidden foodie secrets from the Korea Tourism Organization.',
        ja: '都市をクリックすると、韓国観光公社公認の4K写真、代表名所、地元民おすすめのグルメ情報が瞬時に表示されます。',
        zh: '点击任意目的地，即可实时查看韩国旅游发展局官方4K高清图片、代表景点及地道美食秘籍。'
      }
    },
    {
      stepNumber: 2,
      badge: { ko: '2단계 · 원클릭 코스', en: 'Step 2 · 1-Click Itinerary', ja: 'ステップ2 · 秒速コース生成', zh: '第2步 · 一键生成路线' },
      title: { 
        ko: '일수(1~5일)를 고르고 버튼을 누르면 3초 만에 일정 완성!', 
        en: 'Select days (1-5D) and click the button for an instant route in 3s!', 
        ja: '日程（1〜5日）を選んでボタンを押すだけで秒速ルート完成！', 
        zh: '选择天数（1-5天）并点击按钮，3秒自动生成专属行程！' 
      },
      desc: {
        ko: '지도 우측 상단의 [Days]와 [🪄 플랜 생성] 버튼을 누르면, 이동 시간을 최소화한 최적의 일자별 동선이 자동으로 조립됩니다.',
        en: 'Use the [Days] selector and click [🪄 Create Plan] to generate a day-by-day spatial-optimized itinerary with zero wasted transit.',
        ja: '画面右上の[日程]を選び[🪄 プラン作成]を押すと、移動ロスを最小限に抑えた日別モデルコースが自動生成されます。',
        zh: '在右上角选择[天数]并点击[🪄 生成行程]，即可自动生成空间动线最优、不走回头路的日程安排。'
      }
    },
    {
      stepNumber: 3,
      badge: { ko: '3단계 · 날씨 & 코디', en: 'Step 3 · Weather & Outfits', ja: 'ステップ3 · 天気とコーデ', zh: '第3步 · 实时天气与穿搭' },
      title: { 
        ko: '실시간 날씨와 핀터레스트 감성 K-패션 코디 가이드!', 
        en: 'Live weather, feels-like temp & K-fashion outfit lookbooks!', 
        ja: '現地のリアルタイム気温とトレンド韓国ファッションコーデ！', 
        zh: '实时气温、体感温度与韩系潮流穿搭指南！' 
      },
      desc: {
        ko: '현재 기온, 미세먼지, 자외선 지수는 물론 기온별 맞춤 의상(상의, 하의, 아우터)을 감성 룩북과 함께 미리 확인하고 짐을 쌀 수 있습니다.',
        en: 'Check real-time temperature, fine dust, UV index, and exact clothing lookbooks (tops, bottoms, outerwear) tailored to Korean weather.',
        ja: '現地の気温、PM2.5、紫外線指数に加え、気温に合わせたおすすめ韓国コーデ（アウター、トップス、ボトムス）を事前確認できます。',
        zh: '不仅可查看实时气温与空气质量，还能参考适合韩国当前天气的韩系穿搭建议，轻松打包行李。'
      }
    },
    {
      stepNumber: 4,
      badge: { ko: '4단계 · 1:1 AI 컨시어지', en: 'Step 4 · AI Concierge', ja: 'ステップ4 · AIコンシェルジュ', zh: '第4步 · 1:1 AI专属向导' },
      title: { 
        ko: '궁금한 점은 언제든 AI 보라에게 물어보세요!', 
        en: 'Ask VORA AI anything about transit, luggage, and cafes!', 
        ja: '交通や穴場カフェなど、気になることはAI VORAに何でも質問！', 
        zh: '交通乘车、行李寄存、特色咖啡厅，随时向AI宝拉提问！' 
      },
      desc: {
        ko: '"비 올 때 가기 좋은 곳은?", "KTX 예매 팁 알려줘" 등 여행 중 생기는 모든 질문을 실시간 1:1로 해결해 드립니다.',
        en: 'Ask questions like "Where to go on a rainy day?" or "How to book KTX?" to get instant smart answers tailored for travelers.',
        ja: '「雨の日の観光スポットは？」「KTXの予約方法は？」など、旅行中の疑問をリアルタイムで1:1サポートします。',
        zh: '随时提问“下雨天去哪里好？”、“如何乘坐KTX？”等旅行疑问，获得实时智能解答。'
      }
    }
  ];

  const currentStepData = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (onStartExploring) onStartExploring();
      if (onClose) onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '92vh',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        border: '1.5px solid rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.90rem', fontWeight: 900, color: '#0f172a' }}>
                {lang === 'en' ? 'VORA AI Quick Interactive Guide' :
                 lang === 'ja' ? 'VORA AI 30秒インタラクティブガイド' :
                 (lang === 'zh' || lang === 'zht') ? 'VORA AI 30秒交互式使用指南' :
                 'VORA AI 30초 인터랙티브 사용법'}
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#7c3aed',
                backgroundColor: '#f5f3ff',
                padding: '2px 8px',
                borderRadius: '9999px',
                marginLeft: '8px',
                border: '1px solid #ddd6fe'
              }}>
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Step Badge & Title */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: 900,
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '3px 10px',
              borderRadius: '9999px',
              marginBottom: '6px',
              border: '1px solid #bfdbfe'
            }}>
              {currentStepData.badge[lang] || currentStepData.badge.ko}
            </span>
            <h3 style={{
              fontSize: '1.20rem',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 6px 0',
              lineHeight: 1.35
            }}>
              {currentStepData.title[lang] || currentStepData.title.ko}
            </h3>
            <p style={{
              fontSize: '0.84rem',
              color: '#475569',
              lineHeight: 1.5,
              margin: 0
            }}>
              {currentStepData.desc[lang] || currentStepData.desc.ko}
            </p>
          </div>

          {/* =========================================================================
              🎮 LIVE INTERACTIVE SANDBOX DEMO (클릭하면서 직접 체험하는 생생한 미리보기)
              ========================================================================= */}
          <div style={{
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
          }}>
            {/* ── STEP 1 INTERACTIVE DEMO: Realistic Search Bar + Interactive Map + 4K Photo Mockup ── */}
            {currentStep === 0 && (
              <div>
                {/* 🔍 Top Search Bar Mockup (실제 메인화면 상단 검색창 완벽 미러링) */}
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#0f172a',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #334155'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '480px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '9999px',
                    padding: '4px 6px 4px 14px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    border: '1.5px solid rgba(255, 255, 255, 0.6)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <Compass size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lang === 'en' ? 'Where are you traveling? (e.g. Jeju 4-day foodie)' :
                         lang === 'ja' ? '韓国のどこへ旅行しますか？（例：済州島 4日間）' :
                         (lang === 'zh' || lang === 'zht') ? '想去韩国哪里旅行？（例：济州岛 4日美食游）' :
                         '어디로 여행을 떠나시나요? (예: 제주 4일 미식 코스)'}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      color: '#ffffff',
                      fontSize: '0.70rem',
                      fontWeight: 900,
                      flexShrink: 0
                    }}>
                      <Sparkles size={11} />
                      <span>{lang === 'en' ? 'AI Plan' : 'AI 플랜'}</span>
                    </div>
                  </div>
                </div>

                {/* City Picker Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  overflowX: 'auto'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {lang === 'en' ? '👉 Select City:' : lang === 'ja' ? '👉 都市を選択:' : (lang === 'zh' || lang === 'zht') ? '👉 点击城市:' : '👉 도시를 클릭해 보세요:'}
                  </span>
                  {Object.keys(CITIES_DATA).map((cKey) => {
                    const cInfo = CITIES_DATA[cKey];
                    const isSelected = demoCity === cKey;
                    return (
                      <button
                        key={cKey}
                        onClick={() => setDemoCity(cKey)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>{cKey === 'seoul' ? '📍' : cKey === 'busan' ? '🌊' : cKey === 'jeju' ? '🌴' : '☕'}</span>
                        <span>{cInfo.name[lang] || cInfo.name.ko}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Split Mockup: Left Mini Interactive Map + Right 4K TourAPI Photo Banner */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.3fr',
                  minHeight: '170px',
                  backgroundColor: '#f1f5f9'
                }}>
                  {/* Left: Mini Map Canvas Mockup */}
                  <div style={{
                    position: 'relative',
                    backgroundColor: '#e0f2fe',
                    background: 'radial-gradient(circle at 50% 50%, #bae6fd 0%, #7dd3fc 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRight: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}>
                    {/* Simulated Map Contour Roads */}
                    <div style={{
                      position: 'absolute',
                      width: '120px',
                      height: '140px',
                      border: '2px dashed rgba(37,99,235,0.3)',
                      borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                      pointerEvents: 'none'
                    }} />

                    {/* Animated Pulsing Location Pin */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      animation: 'bounce 1.5s infinite',
                      zIndex: 2
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.70rem',
                        fontWeight: 900,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.45)',
                        border: '1.5px solid #ffffff'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                        <span>{currentCityData.name[lang] || currentCityData.name.ko}</span>
                      </div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'rgba(37,99,235,0.4)',
                        borderRadius: '50%',
                        marginTop: '4px',
                        boxShadow: '0 0 10px #2563eb'
                      }} />
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '8px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#0369a1',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      🗺️ {lang === 'en' ? 'Live GPS Map' : '실시간 위경도 지도'}
                    </div>
                  </div>

                  {/* Right: Simulated 4K Photo & Info Banner */}
                  <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '170px', overflow: 'hidden' }}>
                    <img
                      src={currentCityData.photo}
                      alt="city demo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.88) 100%)'
                    }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', color: '#ffffff' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        marginBottom: '3px',
                        border: '1px solid rgba(56, 189, 248, 0.4)'
                      }}>
                        <CheckCircle2 size={9} />
                        <span>TourAPI 4.0 Certified</span>
                      </div>
                      <div style={{ fontSize: '1.10rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {currentCityData.name[lang] || currentCityData.name.ko}
                      </div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.95, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={11} color="#38bdf8" />
                        <span>{currentCityData.tag[lang] || currentCityData.tag.ko}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secret Foodie Tip */}
                <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Utensils size={13} color="#ea580c" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#9a3412' }}>
                    {currentCityData.food[lang] || currentCityData.food.ko}
                  </span>
                </div>
              </div>
            )}

            {/* ── STEP 2 INTERACTIVE DEMO: 1-Click Plan Generation ── */}
            {currentStep === 1 && (
              <div style={{ padding: '16px' }}>
                {/* Simulated Generator Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1.5px solid #fed7aa',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b' }}>
                      {lang === 'en' ? 'Days:' : lang === 'ja' ? '日程:' : (lang === 'zh' || lang === 'zht') ? '天数:' : '일정:'}
                    </span>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDemoDays(d);
                          setDemoGenerated(true);
                        }}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: demoDays === d ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: demoDays === d ? '#2563eb' : '#ffffff',
                          color: demoDays === d ? '#ffffff' : '#475569'
                        }}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setDemoGenerated(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #e11d48, #7c3aed)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>
                      {lang === 'en' ? `🪄 Busan ${demoDays}D Plan 🚀` :
                       lang === 'ja' ? `🪄 釜山 ${demoDays}日間プラン 🚀` :
                       (lang === 'zh' || lang === 'zht') ? `🪄 釜山 ${demoDays}日游路线 🚀` :
                       `🪄 부산 ${demoDays}일 코스 생성 🚀`}
                    </span>
                  </button>
                </div>

                {/* Simulated Generated Route Timeline */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#2563eb', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} />
                    <span>
                      {lang === 'en' ? `Day 1 ~ Day ${demoDays} Spatial Route (Auto-Calculated)` :
                       lang === 'ja' ? `1日目 〜 ${demoDays}日目 最適ルート（自動計算済み）` :
                       (lang === 'zh' || lang === 'zht') ? `第1天 ~ 第${demoDays}天 最佳动线（已自动计算）` :
                       `1일차 ~ ${demoDays}일차 권역별 최적 동선 (자동 완성)`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.70rem' }}>1</span>
                      <span style={{ fontWeight: 800 }}>
                        {lang === 'en' ? 'Haeundae Blueline Park (Sky Capsule)' :
                         lang === 'ja' ? '海雲台ブルーラインパーク（スカイカプセル）' :
                         (lang === 'zh' || lang === 'zht') ? '海云台蓝线公园（空中胶囊列车）' :
                         '해운대 블루라인파크 (스카이캡슐)'}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>➔ 12m</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.70rem' }}>2</span>
                      <span style={{ fontWeight: 800 }}>
                        {lang === 'en' ? 'Cheongsapo Daritdol Skywalk & Ocean Cafe' :
                         lang === 'ja' ? '青沙浦タリットル展望台＆オーシャンビューカフェ' :
                         (lang === 'zh' || lang === 'zht') ? '青沙浦踏石观景台与海景咖啡街' :
                         '청사포 다릿돌전망대 & 오션뷰 카페'}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>➔ 25m</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.70rem' }}>3</span>
                      <span style={{ fontWeight: 800 }}>
                        {lang === 'en' ? 'Gwangalli Beach Drone Show & Promenade' :
                         lang === 'ja' ? '広安里ビーチ ドローンショー＆散策路' :
                         (lang === 'zh' || lang === 'zht') ? '广安里海水浴场无人机秀与海滨步道' :
                         '광안리 해변 드론쇼 & 해변 산책로'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 INTERACTIVE DEMO: Weather & Outfit Lookbook ── */}
            {currentStep === 2 && (
              <div style={{ padding: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  {/* Temp Card */}
                  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #fed7aa', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.70rem', color: '#ea580c', fontWeight: 800 }}>
                      {lang === 'en' ? 'Live Temp / Feels' : lang === 'ja' ? '現在気温 / 体感' : (lang === 'zh' || lang === 'zht') ? '当前气温 / 体感' : '현재 기온 / 체감'}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c2410c', marginTop: '2px' }}>
                      23°C <span style={{ fontSize: '0.82rem', color: '#ea580c' }}>
                        {lang === 'en' ? '(Feels 25°C)' : lang === 'ja' ? '(体感 25°C)' : (lang === 'zh' || lang === 'zht') ? '(体感 25°C)' : '(체감 25°C)'}
                      </span>
                    </div>
                  </div>

                  {/* Dust / UV Card */}
                  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.70rem', color: '#2563eb', fontWeight: 800 }}>
                      {lang === 'en' ? 'Air Quality / UV' : lang === 'ja' ? '大気質 / 紫外線' : (lang === 'zh' || lang === 'zht') ? '空气质量 / 紫外线' : '미세먼지 / 자외선'}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1d4ed8', marginTop: '4px' }}>
                      {lang === 'en' ? '🌿 Good · Moderate UV' :
                       lang === 'ja' ? '🌿 良好・紫外線 普通' :
                       (lang === 'zh' || lang === 'zht') ? '🌿 优·紫外线 中等' :
                       '🌿 좋음 · 자외선 보통'}
                    </div>
                  </div>
                </div>

                {/* Outfit Suggestion Pill */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#7c3aed', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Shirt size={14} />
                    <span>
                      {lang === 'en' ? 'Recommended K-Style Outfit:' :
                       lang === 'ja' ? '本日のおすすめ韓国コーデ:' :
                       (lang === 'zh' || lang === 'zht') ? '今日推荐韩系穿搭指南:' :
                       '오늘의 추천 K-패션 코디:'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                    <span style={{ backgroundColor: '#f5f3ff', padding: '3px 9px', borderRadius: '9999px', border: '1px solid #ddd6fe' }}>
                      {lang === 'en' ? '👕 Linen Shirt / Short Sleeve' :
                       lang === 'ja' ? '👕 リネンシャツ／薄手の半袖' :
                       (lang === 'zh' || lang === 'zht') ? '👕 亚麻衬衫/轻薄短袖' :
                       '👕 린넨 셔츠 / 얇은 반팔'}
                    </span>
                    <span style={{ backgroundColor: '#f5f3ff', padding: '3px 9px', borderRadius: '9999px', border: '1px solid #ddd6fe' }}>
                      {lang === 'en' ? '👖 Cotton Pants / Wide Slacks' :
                       lang === 'ja' ? '👖 コットンパンツ／ワイドスラックス' :
                       (lang === 'zh' || lang === 'zht') ? '👖 纯棉长裤/宽松阔腿裤' :
                       '👖 코튼 팬츠 / 와이드 슬랙스'}
                    </span>
                    <span style={{ backgroundColor: '#f5f3ff', padding: '3px 9px', borderRadius: '9999px', border: '1px solid #ddd6fe' }}>
                      {lang === 'en' ? '🧥 Light Cardigan (For AC/Night)' :
                       lang === 'ja' ? '🧥 薄手カーディガン（冷房・夜間対策）' :
                       (lang === 'zh' || lang === 'zht') ? '🧥 轻薄开衫（应对空调/早晚温差）' :
                       '🧥 얇은 가디건 (에어컨/저녁 대비)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 INTERACTIVE DEMO: AI Concierge Chat ── */}
            {currentStep === 3 && (
              <div style={{ padding: '16px' }}>
                {/* Interactive Question Chips */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setDemoChatOption('cafe')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: demoChatOption === 'cafe' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: demoChatOption === 'cafe' ? '#eff6ff' : '#ffffff',
                      color: demoChatOption === 'cafe' ? '#2563eb' : '#475569'
                    }}
                  >
                    ☕ {lang === 'en' ? 'Best Hanok Cafes?' :
                        lang === 'ja' ? '北村の韓屋カフェ推薦' :
                        (lang === 'zh' || lang === 'zht') ? '北村韩屋咖啡厅推荐' :
                        '북촌 한옥카페 추천'}
                  </button>
                  <button
                    onClick={() => setDemoChatOption('transit')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: demoChatOption === 'transit' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: demoChatOption === 'transit' ? '#eff6ff' : '#ffffff',
                      color: demoChatOption === 'transit' ? '#2563eb' : '#475569'
                    }}
                  >
                    🚆 {lang === 'en' ? 'Climate Card vs T-Money?' :
                        lang === 'ja' ? '気候同行カード vs T-money' :
                        (lang === 'zh' || lang === 'zht') ? '气候同行卡 vs T-money' :
                        '기후동행카드 vs T-money'}
                  </button>
                </div>

                {/* Simulated Chat Dialogue */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* User Bubble */}
                  <div style={{ alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#ffffff', padding: '6px 12px', borderRadius: '12px 12px 2px 12px', fontSize: '0.76rem', fontWeight: 700 }}>
                    {demoChatOption === 'cafe'
                      ? (lang === 'en' ? 'Where are the most aesthetic Hanok cafes in Bukchon?' :
                         lang === 'ja' ? '北村で静かで写真映えするおすすめの韓屋カフェを教えて！' :
                         (lang === 'zh' || lang === 'zht') ? '请推荐北村安静又有氛围、拍照出片的韩屋咖啡厅！' :
                         '북촌에서 고즈넉하고 사진 잘 나오는 한옥 카페 알려줘!')
                      : (lang === 'en' ? 'Is it worth buying the Seoul Climate Card for international travelers?' :
                         lang === 'ja' ? '外国人観光客ですが、気候同行カードを買った方がお得ですか？' :
                         (lang === 'zh' || lang === 'zht') ? '外国游客购买首尔“气候同行卡”划算吗？' :
                         '외국인 관광객인데 기후동행카드 사는 게 이득이야?')}
                  </div>

                  {/* AI Bubble */}
                  <div style={{ alignSelf: 'flex-start', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', padding: '8px 12px', borderRadius: '12px 12px 12px 2px', fontSize: '0.76rem', lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 900, color: '#7c3aed', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} />
                      <span>VORA AI</span>
                    </div>
                    {demoChatOption === 'cafe' 
                      ? (lang === 'en' ? '✨ I recommend **Onion Anguk** and **Green Mile Coffee Bukchon** near Anguk Station! The panoramic tiled Hanok roof views are breathtaking.' :
                         lang === 'ja' ? '✨ 安国駅近くの**Onion 安国（オニオン）**と**グリーンマイルコーヒー北村店**がおすすめ！伝統的な瓦屋根の絶景が楽しめます。' :
                         (lang === 'zh' || lang === 'zht') ? '✨ 强烈推荐安国站附近的 **Onion Anguk（洋葱咖啡）** 与 **Green Mile Coffee 北村店**！透过落地窗欣赏传统韩屋瓦顶全景非常惊艳。' :
                         '✨ 안국역 인근 **어니언 안국(Onion Anguk)**과 **그린마일커피 북촌점**을 추천해요! 통창 너머 한옥 기와 뷰가 환상적입니다.')
                      : (lang === 'en' ? '💡 If you take Seoul subways and buses 4+ times a day, the **Climate Card Tourist Pass (3-Day ₩10,000)** is much more economical!' :
                         lang === 'ja' ? '💡 ソウル市内の地下鉄やバスを1日4回以上利用するなら、**気候同行カード観光パス（3日券 10,000ウォン）**が断然お得です！' :
                         (lang === 'zh' || lang === 'zht') ? '💡 如果您一天乘坐首尔地铁和巴士4次以上，购买**气候同行卡短期旅游券（3日券 10,000韩元）**会划算很多！' :
                         '💡 서울 시내 지하철과 버스를 하루 4회 이상 탑승하신다면 **기후동행카드 관광권(3일권 10,000원)**이 훨씬 경제적입니다!')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa'
        }}>
          {/* Step Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {TOUR_STEPS.map((_, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setCurrentStep(sIdx)}
                style={{
                  width: currentStep === sIdx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: currentStep === sIdx ? '#2563eb' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronLeft size={15} />
                <span>{lang === 'en' ? 'Back' : lang === 'ja' ? '戻る' : (lang === 'zh' || lang === 'zht') ? '上一步' : '이전'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 18px',
                borderRadius: '12px',
                border: 'none',
                background: currentStep === TOUR_STEPS.length - 1
                  ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                  : '#2563eb',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>
                {currentStep === TOUR_STEPS.length - 1
                  ? (lang === 'en' ? '🚀 Start Exploring Now!' : lang === 'ja' ? '🚀 今すぐ旅を始める！' : (lang === 'zh' || lang === 'zht') ? '🚀 立即开始探索！' : '🚀 지금 바로 여행 시작하기!')
                  : (lang === 'en' ? 'Next' : lang === 'ja' ? '次へ' : (lang === 'zh' || lang === 'zht') ? '下一步' : '다음')}
              </span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
