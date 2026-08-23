import React from 'react';
import { Home, Sparkles, Luggage, Map, Menu } from 'lucide-react';

/**
 * ==============================================================================
 * BottomNav.jsx - 모바일 전용 5대 고정 탭 네비게이터 (Mobile 5-Tab Navigation Bar)
 * 
 * 1. 홈 (Home): 스크롤 없는 컴팩트한 첫 화면 & 퀵 인텐트 칩
 * 2. AI (AI Concierge): 1:1 대화형 Vora AI 여행 설계
 * 3. 내 여행 (My Trip): 1~N일차 타임라인 & 0원 동선 최적화 (Reality Check)
 * 4. 지도 (Map): 이동 경로 번호 핀 및 전체화면 스마트 지도
 * 5. 더보기 (More): 필수 여행 정보, 날씨, 다국어 설정, 앱 설치
 * ==============================================================================
 */

export default function BottomNav({ activeTab, onTabChange, lang = 'ko', unreadCount = 0 }) {
  // 다국어 탭 라벨 (Tab Labels)
  const tabLabels = {
    ko: {
      home: '홈',
      ai: 'AI 플래너',
      mytrip: '내 여행',
      map: '지도',
      more: '더보기'
    },
    en: {
      home: 'Home',
      ai: 'AI Planner',
      mytrip: 'My Trip',
      map: 'Map',
      more: 'More'
    },
    ja: {
      home: 'ホーム',
      ai: 'AIプラン',
      mytrip: 'マイトリップ',
      map: '地図',
      more: 'その他'
    },
    zh: {
      home: '首页',
      ai: 'AI规划',
      mytrip: '我的行程',
      map: '地图',
      more: '更多'
    }
  };

  const currentLabels = tabLabels[lang] || tabLabels.en;

  const navItems = [
    { id: 'home', label: currentLabels.home, icon: Home },
    { id: 'ai', label: currentLabels.ai, icon: Sparkles, highlight: true },
    { id: 'mytrip', label: currentLabels.mytrip, icon: Luggage },
    { id: 'map', label: currentLabels.map, icon: Map },
    { id: 'more', label: currentLabels.more, icon: Menu }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom, 0px)) 0.5rem',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
      className="mobile-bottom-nav-bar"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              background: 'none',
              border: 'none',
              padding: '0.35rem 0.2rem',
              cursor: 'pointer',
              color: isActive ? '#38bdf8' : '#94a3b8',
              transition: 'all 0.2s ease-in-out',
              position: 'relative'
            }}
          >
            {/* AI 탭 하이라이트 배지 효과 */}
            {item.highlight && (
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isActive 
                    ? 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)' 
                    : 'none',
                  pointerEvents: 'none'
                }}
              />
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.2s ease-out'
            }}>
              <Icon
                size={item.highlight ? 22 : 20}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? (item.highlight ? '#38bdf8' : '#60a5fa') : '#94a3b8'}
              />
            </div>

            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '-0.01em',
                color: isActive ? '#ffffff' : '#94a3b8'
              }}
            >
              {item.label}
            </span>

            {/* 활성 탭 인디케이터 도트 */}
            {isActive && (
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  marginTop: '1px',
                  boxShadow: '0 0 6px #38bdf8'
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
