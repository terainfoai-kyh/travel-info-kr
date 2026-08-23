import React from 'react';
import { Sparkles, MapPin, Umbrella, Flame, Heart, Camera } from 'lucide-react';

/**
 * ==============================================================================
 * QuickIntentChips.jsx - 원클릭 퀵 시작 인텐트 칩 (One-Click Intent Chips)
 * 
 * 1. 서울 3일 핫플 감성 (Seoul 3-Day Hotspot)
 * 2. 부산 2일 오션뷰 힐링 (Busan 2-Day Ocean View)
 * 3. 제주 3일 드라이브 & 맛집 (Jeju 3-Day Scenic Drive)
 * 4. ☔ 비 오는 날 안심 실내 코스 (Rainy Day Indoor Course)
 * 5. K-POP & 성수 패션 쇼룸 (Seongsu K-Fashion & Trends)
 * 6. 경주 2일 역사 & 야경 (Gyeongju Heritage & Nightscape)
 * ==============================================================================
 */

export default function QuickIntentChips({ onSelectIntent, lang = 'ko' }) {
  const CHIPS_DATA = {
    ko: [
      { id: 'seoul-3d', label: '🇰🇷 서울 3일 핫플 감성', query: '서울 3일 핫플 감성 투어', icon: Flame, color: '#f59e0b' },
      { id: 'busan-2d', label: '🌊 부산 2일 오션뷰', query: '부산 2일 해운대 광안리 오션뷰 코스', icon: MapPin, color: '#38bdf8' },
      { id: 'jeju-3d', label: '🌴 제주 3일 힐링 드라이브', query: '제주 3일 힐링 드라이브 및 감성 카페 코스', icon: Heart, color: '#10b981' },
      { id: 'rain-mode', label: '☔ 비 오는 날 실내 코스', query: '서울 비 오는 날 실내 미술관 박물관 몰 투어', icon: Umbrella, color: '#818cf8' },
      { id: 'seongsu-kpop', label: '📸 성수 K-패션 & 쇼룸', query: '성수동 K-패션 쇼룸 및 팝업스토어 데이트', icon: Camera, color: '#ec4899' },
      { id: 'gyeongju-2d', label: '🏯 경주 2일 역사 & 야경', query: '경주 2일 황리단길 첨성대 동궁과월지 야경 코스', icon: Sparkles, color: '#a855f7' }
    ],
    en: [
      { id: 'seoul-3d', label: '🇰🇷 Seoul 3-Day Hotspots', query: 'Seoul 3-day hotspot and trendy cafe tour', icon: Flame, color: '#f59e0b' },
      { id: 'busan-2d', label: '🌊 Busan 2-Day Ocean View', query: 'Busan 2-day Haeundae and Gwangalli ocean view itinerary', icon: MapPin, color: '#38bdf8' },
      { id: 'jeju-3d', label: '🌴 Jeju 3-Day Scenic Drive', query: 'Jeju 3-day scenic nature drive and relaxation', icon: Heart, color: '#10b981' },
      { id: 'rain-mode', label: '☔ Rainy Day Indoor Tour', query: 'Seoul rainy day indoor museums galleries and shopping mall tour', icon: Umbrella, color: '#818cf8' },
      { id: 'seongsu-kpop', label: '📸 Seongsu K-Fashion & Cafes', query: 'Seongsu-dong K-fashion pop-up stores and aesthetic cafe tour', icon: Camera, color: '#ec4899' },
      { id: 'gyeongju-2d', label: '🏯 Gyeongju 2-Day Heritage', query: 'Gyeongju 2-day historical landmarks and night views', icon: Sparkles, color: '#a855f7' }
    ],
    ja: [
      { id: 'seoul-3d', label: '🇰🇷 ソウル3日間 トレンド満喫', query: 'ソウル3日間 トレンドスポット＆おしゃれカフェツアー', icon: Flame, color: '#f59e0b' },
      { id: 'busan-2d', label: '🌊 釜山2日間 オーシャンビュー', query: '釜山2日間 海雲台・広安里オーシャンビューコース', icon: MapPin, color: '#38bdf8' },
      { id: 'jeju-3d', label: '🌴 済州3日間 ドライブ＆癒やし', query: '済州島3日間 自然満喫ドライブ＆ヒーリングコース', icon: Heart, color: '#10b981' },
      { id: 'rain-mode', label: '☔ 雨の日 屋内安心コース', query: 'ソウル 雨の日 屋内美術館・博物館・ショッピングモールツアー', icon: Umbrella, color: '#818cf8' },
      { id: 'seongsu-kpop', label: '📸 聖水 K-ファッション巡り', query: '聖水洞 K-ファッションショールーム＆ポップアップ巡り', icon: Camera, color: '#ec4899' },
      { id: 'gyeongju-2d', label: '🏯 慶州2日間 歴史＆夜景', query: '慶州2日間 歴史遺産と夜景満喫ツアー', icon: Sparkles, color: '#a855f7' }
    ],
    zh: [
      { id: 'seoul-3d', label: '🇰🇷 首尔3天 潮流打卡之旅', query: '首尔3天2晚 潮流网红打卡与特色咖啡馆路线', icon: Flame, color: '#f59e0b' },
      { id: 'busan-2d', label: '🌊 釜山2天 海景度假之旅', query: '釜山2天1晚 海云台与广安里海景休闲路线', icon: MapPin, color: '#38bdf8' },
      { id: 'jeju-3d', label: '🌴 济州岛3天 自驾疗愈游', query: '济州岛3天2晚 自然风光自驾与治愈之旅', icon: Heart, color: '#10b981' },
      { id: 'rain-mode', label: '☔ 雨天 室内精选路线', query: '首尔雨天 室内美术馆博物馆与购物中心舒适游', icon: Umbrella, color: '#818cf8' },
      { id: 'seongsu-kpop', label: '📸 圣水洞 K-时尚打卡', query: '圣水洞 K-Fashion潮流快闪店与时尚打卡路线', icon: Camera, color: '#ec4899' },
      { id: 'gyeongju-2d', label: '🏯 庆州2天 历史与夜景', query: '庆州2天1晚 古都历史遗迹与浪漫夜景之旅', icon: Sparkles, color: '#a855f7' }
    ]
  };

  const chips = CHIPS_DATA[lang] || CHIPS_DATA.en;

  return (
    <div style={{ width: '100%', margin: '0.75rem 0 0 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.35rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => onSelectIntent(chip.query)}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                padding: '0.42rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icon size={14} style={{ color: chip.color }} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
