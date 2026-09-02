import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Calendar, 
  CloudSun, 
  CreditCard, 
  Train, 
  Wifi, 
  PhoneCall, 
  Heart 
} from 'lucide-react';
import { buildKlookDeepLink } from '../services/apiConfig';

export default function DesktopNavSidebar({
  lang = 'ko',
  activeNavTab = 'home',
  onNavigateTab,
  onOpenWeather,
  onOpenEssentials,
  onOpenSubwayModal,
  onOpenHelplineModal,
  onOpenWishlist,
  wishlistCount = 0,
  targetCity = '서울'
}) {
  return (
    <aside 
      className="desktop-nav-sidebar hide-mobile"
      style={{
        width: '64px',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 0',
        boxSizing: 'border-box',
        zIndex: 100,
        flexShrink: 0,
        boxShadow: '2px 0 10px rgba(0,0,0,0.02)',
        position: 'sticky',
        top: 0
      }}
    >
      {/* Top Icon Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
        {/* 1. Home / Map Explorer */}
        <button 
          onClick={() => onNavigateTab && onNavigateTab('home')}
          title={lang === 'en' ? 'Home & Map' : lang === 'ja' ? 'ホーム・地図' : (lang === 'zh' || lang === 'zht') ? '首页与地图' : '홈 & 지도'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: activeNavTab === 'home' ? '#eff6ff' : 'transparent',
            color: activeNavTab === 'home' ? '#2563eb' : '#64748b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <Compass size={20} />
          <span style={{ fontSize: '9px', fontWeight: 800 }}>{lang === 'en' ? 'Map' : lang === 'ja' ? '地図' : (lang === 'zh' || lang === 'zht') ? '地图' : '지도'}</span>
        </button>

        {/* 2. AI Planner */}
        <button 
          onClick={() => onNavigateTab && onNavigateTab('ai')}
          title={lang === 'en' ? 'AI Planner' : lang === 'ja' ? 'AIプランナー' : (lang === 'zh' || lang === 'zht') ? 'AI行程规划' : 'AI 플래너'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: activeNavTab === 'ai' ? '#f3e8ff' : 'transparent',
            color: activeNavTab === 'ai' ? '#7c3aed' : '#64748b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <Sparkles size={20} />
          <span style={{ fontSize: '9px', fontWeight: 800 }}>AI</span>
        </button>

        {/* 3. My Trips (Itinerary) */}
        <button 
          onClick={() => onNavigateTab && onNavigateTab('mytrip')}
          title={lang === 'en' ? 'My Trips' : lang === 'ja' ? 'マイトリップ' : (lang === 'zh' || lang === 'zht') ? '我的行程' : '내 일정'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: activeNavTab === 'mytrip' ? '#dbeafe' : 'transparent',
            color: activeNavTab === 'mytrip' ? '#2563eb' : '#64748b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <Calendar size={20} />
          <span style={{ fontSize: '9px', fontWeight: 800 }}>{lang === 'en' ? 'Plan' : lang === 'ja' ? '日程' : (lang === 'zh' || lang === 'zht') ? '行程' : '일정'}</span>
        </button>

        <div style={{ width: '32px', height: '1px', backgroundColor: '#e2e8f0', margin: '0.2rem 0' }} />

        {/* 4. Weather & Outfit */}
        <button 
          onClick={() => onOpenWeather && onOpenWeather(targetCity)}
          title={lang === 'en' ? 'Weather & Outfit' : lang === 'ja' ? '天気・服装コーデ' : (lang === 'zh' || lang === 'zht') ? '天气与穿搭' : '실시간 날씨 & 코디'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#f59e0b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <CloudSun size={20} />
          <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Weather' : lang === 'ja' ? '天気' : (lang === 'zh' || lang === 'zht') ? '天气' : '날씨'}</span>
        </button>

        {/* 5. Climate Card */}
        <button 
          onClick={() => onOpenEssentials && onOpenEssentials()}
          title={lang === 'en' ? 'Climate Card' : lang === 'ja' ? '気候同行カード' : (lang === 'zh' || lang === 'zht') ? '气候同行卡' : '기후동행카드'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#059669',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <CreditCard size={20} />
          <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Pass' : lang === 'ja' ? 'パス' : (lang === 'zh' || lang === 'zht') ? '交通卡' : '패스'}</span>
        </button>

        {/* 6. Metro Map */}
        <button 
          onClick={() => onOpenSubwayModal && onOpenSubwayModal()}
          title={lang === 'en' ? 'Metro Map' : lang === 'ja' ? '地下鉄路線図' : (lang === 'zh' || lang === 'zht') ? '地铁路线图' : '지하철 노선도'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#0284c7',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <Train size={20} />
          <span style={{ fontSize: '9px', fontWeight: 700 }}>{lang === 'en' ? 'Metro' : lang === 'ja' ? '地下鉄' : (lang === 'zh' || lang === 'zht') ? '地铁' : '지하철'}</span>
        </button>

        {/* 7. eSIM (Klook) */}
        <button 
          onClick={() => {
            const esimQuery = lang === 'en' ? 'Korea eSIM Unlimited' : lang === 'ja' ? '韓国 無制限 eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国 无限流量 eSIM' : '한국 무제한 eSIM';
            window.open(buildKlookDeepLink(esimQuery), '_blank', 'noopener,noreferrer');
          }}
          title={lang === 'en' ? 'Korea eSIM' : lang === 'ja' ? '韓国eSIM' : (lang === 'zh' || lang === 'zht') ? '韩国eSIM' : '무제한 eSIM'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#8b5cf6',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <Wifi size={20} />
          <span style={{ fontSize: '9px', fontWeight: 700 }}>eSIM</span>
        </button>

        {/* 8. 1330 Hotline */}
        <button 
          onClick={() => onOpenHelplineModal && onOpenHelplineModal()}
          title={lang === 'en' ? '1330 Helpline' : lang === 'ja' ? '1330 通訳案内' : (lang === 'zh' || lang === 'zht') ? '1330 旅游翻译热线' : '1330 긴급통역'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            gap: '2px'
          }}
        >
          <PhoneCall size={20} />
          <span style={{ fontSize: '9px', fontWeight: 700 }}>1330</span>
        </button>
      </div>

      {/* Bottom Icon: Wishlist */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <button 
          onClick={() => onOpenWishlist && onOpenWishlist()}
          title={lang === 'en' ? 'Wishlist' : lang === 'ja' ? 'お気に入り' : (lang === 'zh' || lang === 'zht') ? '收藏夹' : '찜 목록'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: wishlistCount > 0 ? '#fef2f2' : 'transparent',
            color: wishlistCount > 0 ? '#ef4444' : '#94a3b8',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Heart size={18} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 900,
              borderRadius: '9999px',
              padding: '1px 4px'
            }}>
              {wishlistCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
