import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Utensils, Shirt, Sparkles, X, MapPin, ExternalLink, ChevronRight, MessageSquare, Flame, Check } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

const POPULAR_CITIES = [
  '서울', '거제', '부산', '제주', '경주', '강릉', '전주', '여수', '속초', '수원'
];

// Curated Regional Signature Food Data
const REGIONAL_FOOD_DATA = {
  서울: [
    { name: '종로·광장시장 마약김밥 & 빈대떡', tag: 'K-스트리트푸드', desc: '바삭한 녹두빈대떡과 겨자소스에 찍어먹는 원조 마약김밥', place: '종로 광장시장' },
    { name: '명동 명품 설렁탕 & 칼국수', tag: '정통 한식', desc: '진한 사골 육수에 부드러운 양지와 겉절이 김치의 환상 조합', place: '명동 음식문화거리' },
    { name: '신당동 원조 즉석 떡볶이', tag: 'K-분식', desc: '고추장과 춘장 베이스의 감칠맛 넘치는 추억의 즉석 떡볶이', place: '신당동 떡볶이 타운' }
  ],
  거제: [
    { name: '거제 굴구이 & 굴코스 요리', tag: '겨울·봄 바다별미', desc: '청정 거제 바다에서 갓 채취한 싱싱한 굴을 통째로 쪄먹는 별미', place: '거제도 거제면·칠천도' },
    { name: '거제 멍게·성게 비빔밥', tag: '해산물 로컬푸드', desc: '향긋한 바다 내음 가득한 성게알과 멍게를 참기름과 쓱쓱 비벼먹는 별미', place: '포로수용소 인근 및 지세포항' },
    { name: '바람의 핫도그 & 몽돌 해물라면', tag: '인기 관광 디저트', desc: '바람의 언덕 명물 핫도그와 통문어가 들어간 해물 라면', place: '도장포 마을 & 바람의 언덕' }
  ],
  부산: [
    { name: '부산 원조 돼지국밥', tag: '부산 소울푸드', desc: '뽀얗고 진한 돼지 사골 국물에 부추무침과 다대기를 듬뿍 넣어 먹는 든든한 한끼', place: '서면 국밥골목 & 해운대' },
    { name: '해운대·초량 부산 밀면', tag: '시원한 면요리', desc: '살얼음 동동 띄운 한방 육수에 쫄깃한 면발과 매콤달콤 양념장', place: '초량 및 해운대 전통시장' },
    { name: '남포동 씨앗호떡 & 비빔당면', tag: '길거리 먹거리', desc: '견과류가 듬뿍 들어간 고소한 찹쌀호떡과 매콤한 비빔당면', place: '남포동 BIFF 광장' }
  ],
  제주: [
    { name: '제주 흑돼지 근고기 구이', tag: '제주 대표 미식', desc: '두툼한 제주산 흑돼지를 참숯에 구워 멜젓(멸치젓)에 콕 찍어먹는 풍미', place: '중문관광단지 & 흑돼지거리' },
    { name: '통갈치 조림 & 갈치구이', tag: '제주 은갈치', desc: '길쭉한 전용 냄비에 전복, 문어와 함께 매콤하게 조려낸 통갈치', place: '성산일출봉 인근' },
    { name: '제주 고기국수 & 돔베고기', tag: '전통 향토음식', desc: '담백한 고기 육수에 중면과 야들야들 삶아낸 돔베고기 수육', place: '제주시 고기국수 거리' }
  ],
  경주: [
    { name: '경주 한우 물회 & 육회비빔밥', tag: '경주 별미', desc: '시원하고 매콤달콤한 살얼음 육수에 신선한 한우 육회가 듬뿍', place: '보문관광단지' },
    { name: '황리단길 십원빵 & 황남빵', tag: 'K-디저트', desc: '모짜렐라 치즈가 길게 늘어나는 십원빵과 전통 팥 앙금 황남빵', place: '황리단길' },
    { name: '경주 맷돌 순두부찌개', tag: '전통 두부요리', desc: '국내산 콩으로 매일 새벽 직접 맷돌로 갈아 만든 고소한 순두부', place: '보문 순두부 골목' }
  ],
  강릉: [
    { name: '강릉 초당 순두부 짬뽕 (짬뽕순두부)', tag: '전국 3대 짬뽕', desc: '얼큰한 불맛 짬뽕 국물에 몽글몽글 고소한 초당 순두부의 퓨전', place: '강릉 초당두부마을' },
    { name: '안목해변 카페거리 스페셜티 커피', tag: '커피 메카', desc: '푸른 동해 바다를 바라보며 즐기는 대한민국 1세대 바리스타 커피', place: '안목해변 커피거리' }
  ],
  전주: [
    { name: '전주 전통 육회 비빔밥', tag: '유네스코 미식도시', desc: '사골 밥에 놋그릇, 10여 가지 제철 나물과 신선한 육회의 품격', place: '전주 한옥마을' },
    { name: '전주 콩나물국밥 & 모주', tag: '해장 1번지', desc: '개운하고 시원한 콩나물국에 수란과 달콤한 계피향 한방 모주', place: '남부시장 콩나물국밥 골목' }
  ]
};

export default function FoodOutfitModal({ isOpen, onClose, lang = 'ko', initialCity = '서울' }) {
  if (!isOpen) return null;

  const [selectedCity, setSelectedCity] = useState(initialCity || '서울');
  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'outfit'
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 640 : false;

  const foods = REGIONAL_FOOD_DATA[selectedCity] || REGIONAL_FOOD_DATA.서울;

  const handleAskGemini = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('vora-trigger-quick-prompt', {
      detail: { prompt: `${selectedCity} 현지인 추천 진짜 맛집과 감성 카페, 날씨 맞춤 코디 알려줘` }
    }));
    const inputEl = document.querySelector('textarea') || document.querySelector('input[type="text"]');
    if (inputEl) {
      inputEl.focus();
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
          maxWidth: '740px',
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
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: isMobile ? '34px' : '38px',
              height: isMobile ? '34px' : '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)',
              flexShrink: 0
            }}>
              <Utensils size={isMobile ? 18 : 20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: isMobile ? '0.98rem' : '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  🍴 AI 대표 맛집 & K-컬처 코디 가이드
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#ea580c',
                  background: 'rgba(234, 88, 12, 0.1)',
                  border: '1px solid rgba(234, 88, 12, 0.25)',
                  padding: '0.08rem 0.4rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  Gemini AI 분석
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', margin: '0.1rem 0 0 0' }}>
                대한민국 16개 권역 대표 향토 미식과 사진 잘 나오는 K-패션 스타일링
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
            <MapPin size={13} /> 지역:
          </span>
          {POPULAR_CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                background: selectedCity === city ? 'linear-gradient(135deg, #ea580c, #9333ea)' : '#ffffff',
                color: selectedCity === city ? '#ffffff' : '#334155',
                border: selectedCity === city ? 'none' : '1px solid #cbd5e1',
                padding: isMobile ? '0.2rem 0.55rem' : '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: isMobile ? '0.72rem' : '0.76rem',
                fontWeight: selectedCity === city ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCity === city ? '0 2px 6px rgba(234, 88, 12, 0.3)' : 'none',
                flexShrink: 0
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Tab switcher: 맛집 vs 코디 */}
        <div style={{
          padding: '0.5rem 1.4rem',
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderBottom: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '10px',
              border: activeTab === 'food' ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
              background: activeTab === 'food' ? 'rgba(234, 88, 12, 0.08)' : '#ffffff',
              color: activeTab === 'food' ? '#ea580c' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Utensils size={14} />
            <span>[{selectedCity}] 대표 시그니처 미식 (3선)</span>
          </button>

          <button
            onClick={() => setActiveTab('outfit')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '10px',
              border: activeTab === 'outfit' ? '1.5px solid #9333ea' : '1px solid #e2e8f0',
              background: activeTab === 'outfit' ? 'rgba(147, 51, 234, 0.08)' : '#ffffff',
              color: activeTab === 'outfit' ? '#9333ea' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Shirt size={14} />
            <span>[{selectedCity}] 여행 K-패션 코디 팁</span>
          </button>
        </div>

        {/* Body Cards Content */}
        <div style={{
          padding: isMobile ? '1rem' : '1.25rem 1.4rem',
          overflowY: 'auto',
          maxHeight: isMobile ? 'calc(92vh - 220px)' : 'calc(90vh - 230px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {activeTab === 'food' ? (
            foods.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-color, #e2e8f0)',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#ea580c',
                    background: 'rgba(234, 88, 12, 0.1)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {item.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPin size={12} color="#ea580c" />
                    {item.place}
                  </span>
                </div>

                <div style={{ fontSize: '1.02rem', fontWeight: 900, color: 'var(--text-main, #0f172a)' }}>
                  {item.name}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #475569)', lineHeight: 1.45 }}>
                  {item.desc}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#9333ea', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shirt size={18} />
                  <span>{selectedCity} 도심 & 자연 관광 인생샷 K-스타일링</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  📸 <strong>촬영 꿀팁</strong>: 명소의 푸른 바다/전통 기와 배경과 대비되는 밝은 아이보리, 파스텔 톤 또는 모던 캐주얼 셋업을 추천합니다.
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  👟 <strong>발 편한 여행 슈즈</strong>: 하루 평균 1만 보 이상 걷는 관광 코스 특성상 푹신한 쿠셔닝 스니커즈나 워킹화가 필수입니다.
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                borderRadius: '16px',
                border: '1.5px dashed rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                fontSize: '0.78rem',
                color: '#6b21a8',
                lineHeight: 1.45
              }}>
                ✨ <strong>한복 체험 팁</strong>: 경복궁(서울), 한옥마을(전주), 황리단길(경주) 등 전통 명소에서는 한복 대여 착용 시 고궁 무료입장 혜택이 적용됩니다!
              </div>
            </div>
          )}
        </div>

        {/* Footer: Gemini 1:1 Prompt Trigger Button */}
        <div style={{
          padding: '0.85rem 1.4rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          backgroundColor: 'var(--bg-secondary, #f8fafc)'
        }}>
          <button
            onClick={handleAskGemini}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
            }}
          >
            <Sparkles size={16} />
            <span>🤖 제미나이에게 [{selectedCity}] 1:1 맛집·코디 질문하기 ➔</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
