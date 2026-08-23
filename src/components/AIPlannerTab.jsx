import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Compass, Users, Heart, Coffee, Utensils, ShoppingBag, Trees, PartyPopper, Smile, ArrowRight, Flame } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * AIPlannerTab.jsx - 화면 1: 탭 선택형 AI 여행 일정 생성 화면
 * 
 * 1. 여행지 입력 & 빠른 도시 칩 (서울, 부산, 제주, 경주, 강릉 등)
 * 2. 여행 기간 선택 칩 (1일, 2일, 3일, 4일, 5일)
 * 3. 여행 테마 선택 칩 (맛집, 카페, 관광지, 쇼핑, 자연, 축제, 힐링)
 * 4. 동행자 선택 칩 (혼자, 커플, 가족, 친구)
 * 5. '✨ AI 여행 일정 만들기' 원클릭 생성 버튼
 * ==============================================================================
 */

export default function AIPlannerTab({
  lang = 'ko',
  onGenerateItinerary,
  isLoading = false,
  questionQuota = { remaining: 5, total: 5 },
  onOpenRewardedAd,
  onOpenGoogleAuth
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 1. 여행지 State
  const [destination, setDestination] = useState('서울');

  // 2. 여행 기간 State (기본 3일)
  const [selectedDays, setSelectedDays] = useState(3);

  // 3. 여행 테마 State (복수 선택 가능)
  const [selectedThemes, setSelectedThemes] = useState(['맛집', '카페', '관광지']);

  // 4. 동행자 State
  const [selectedCompanion, setSelectedCompanion] = useState('커플');

  // 5. 자유 요구사항 텍스트
  const [customNote, setCustomNote] = useState('');

  // 다국어 칩 정의
  const CITIES = [
    { id: 'seoul', name: lang === 'en' ? 'Seoul' : lang === 'ja' ? 'ソウル' : (lang === 'zh' || lang === 'zht') ? '首尔' : '서울', val: '서울' },
    { id: 'busan', name: lang === 'en' ? 'Busan' : lang === 'ja' ? '釜山' : (lang === 'zh' || lang === 'zht') ? '釜山' : '부산', val: '부산' },
    { id: 'jeju', name: lang === 'en' ? 'Jeju' : lang === 'ja' ? '済州' : (lang === 'zh' || lang === 'zht') ? '济州' : '제주', val: '제주' },
    { id: 'gyeongju', name: lang === 'en' ? 'Gyeongju' : lang === 'ja' ? '慶州' : (lang === 'zh' || lang === 'zht') ? '庆州' : '경주', val: '경주' },
    { id: 'gangneung', name: lang === 'en' ? 'Gangneung' : lang === 'ja' ? '江陵' : (lang === 'zh' || lang === 'zht') ? '江陵' : '강릉', val: '강릉' },
    { id: 'suwon', name: lang === 'en' ? 'Suwon' : lang === 'ja' ? '水原' : (lang === 'zh' || lang === 'zht') ? '水原' : '수원', val: '수원' }
  ];

  const DAYS_OPTIONS = [1, 2, 3, 4, 5];

  const THEME_OPTIONS = [
    { id: 'food', label: lang === 'en' ? 'Foodie' : lang === 'ja' ? 'グルメ' : (lang === 'zh' || lang === 'zht') ? '美食' : '맛집', icon: Utensils, val: '맛집' },
    { id: 'cafe', label: lang === 'en' ? 'Cafe & Trend' : lang === 'ja' ? 'カフェ' : (lang === 'zh' || lang === 'zht') ? '咖啡馆' : '카페', icon: Coffee, val: '카페' },
    { id: 'spot', label: lang === 'en' ? 'Landmarks' : lang === 'ja' ? '名所' : (lang === 'zh' || lang === 'zht') ? '景点' : '관광지', icon: MapPin, val: '관광지' },
    { id: 'shop', label: lang === 'en' ? 'Shopping' : lang === 'ja' ? 'ショッピング' : (lang === 'zh' || lang === 'zht') ? '购物' : '쇼핑', icon: ShoppingBag, val: '쇼핑' },
    { id: 'nature', label: lang === 'en' ? 'Nature' : lang === 'ja' ? '自然' : (lang === 'zh' || lang === 'zht') ? '自然风光' : '자연', icon: Trees, val: '자연' },
    { id: 'night', label: lang === 'en' ? 'Night View' : lang === 'ja' ? '夜景' : (lang === 'zh' || lang === 'zht') ? '浪漫夜景' : '야경/축제', icon: PartyPopper, val: '야경' },
    { id: 'healing', label: lang === 'en' ? 'Healing' : lang === 'ja' ? '癒やし' : (lang === 'zh' || lang === 'zht') ? '疗愈休闲' : '힐링', icon: Heart, val: '힐링' }
  ];

  const COMPANION_OPTIONS = [
    { id: 'solo', label: lang === 'en' ? 'Solo' : lang === 'ja' ? '一人旅' : (lang === 'zh' || lang === 'zht') ? '独自一人' : '혼자', val: '혼자' },
    { id: 'couple', label: lang === 'en' ? 'Couple' : lang === 'ja' ? 'カップル' : (lang === 'zh' || lang === 'zht') ? '情侣/夫妻' : '커플', val: '커플' },
    { id: 'family', label: lang === 'en' ? 'Family' : lang === 'ja' ? '家族' : (lang === 'zh' || lang === 'zht') ? '家庭亲子' : '가족', val: '가족' },
    { id: 'friends', label: lang === 'en' ? 'Friends' : lang === 'ja' ? '友達' : (lang === 'zh' || lang === 'zht') ? '朋友结伴' : '친구', val: '친구' }
  ];

  const handleToggleTheme = (val) => {
    if (selectedThemes.includes(val)) {
      if (selectedThemes.length > 1) {
        setSelectedThemes(selectedThemes.filter(t => t !== val));
      }
    } else {
      setSelectedThemes([...selectedThemes, val]);
    }
  };

  const handleCreateSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    // 질문 잔여량 확인
    if (questionQuota && questionQuota.remaining <= 0) {
      if (onOpenRewardedAd) onOpenRewardedAd();
      return;
    }

    // 자연어 프롬프트 조합 생성
    const combinedQuery = `${destination} ${selectedDays}박${selectedDays}일 ${selectedCompanion} 여행, 테마: ${selectedThemes.join(', ')}${customNote.trim() ? `, 요구사항: ${customNote.trim()}` : ''}`;
    onGenerateItinerary(combinedQuery);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      padding: '1.25rem 1.15rem 1.5rem 1.15rem',
      boxSizing: 'border-box'
    }}>
      {/* 1. Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--accent-primary)',
          padding: '0.3rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 800,
          marginBottom: '0.4rem'
        }}>
          <Sparkles size={14} />
          <span>VORA AI Travel Studio</span>
        </div>
        <h2 style={{
          margin: 0,
          fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
          fontWeight: 900,
          color: 'var(--text-main)'
        }}>
          {lang === 'en' ? 'What kind of trip are you planning?' : lang === 'ja' ? 'どのような旅を計画していますか？' : (lang === 'zh' || lang === 'zht') ? '您想计划怎样的韩国之旅？' : '어떤 여행을 계획할까요?'}
        </h2>
      </div>

      <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Step 1: 여행지 선택 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Destination' : lang === 'ja' ? '目的地' : (lang === 'zh' || lang === 'zht') ? '目的地' : '여행지'}</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-glass)',
            border: '1.5px solid var(--border-highlight)',
            borderRadius: '14px',
            padding: '0.55rem 0.85rem',
            marginBottom: '0.5rem'
          }}>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Seoul, Busan, Jeju...' : '예: 서울, 부산, 제주, 수원 행궁동...'}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            />
          </div>

          {/* Quick City Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none' }}>
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setDestination(city.val)}
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: '9999px',
                  border: destination === city.val ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: destination === city.val ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-card)',
                  color: destination === city.val ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: destination === city.val ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: 여행 기간 (1일~5일 칩) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <Calendar size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Trip Duration' : lang === 'ja' ? '旅行期間' : (lang === 'zh' || lang === 'zht') ? '旅行天数' : '여행 기간'}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
            {DAYS_OPTIONS.map((d) => {
              const isSelected = selectedDays === d;
              return (
                <button
                  key={`day-opt-${d}`}
                  type="button"
                  onClick={() => setSelectedDays(d)}
                  style={{
                    padding: '0.65rem 0.2rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? '#2563eb' : 'var(--bg-glass)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                  }}
                >
                  {d}{lang === 'en' ? ' Day' : lang === 'ja' ? '日間' : (lang === 'zh' || lang === 'zht') ? '天' : '일'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: 여행 테마 (복수 선택) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <Compass size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Travel Themes (Select all you like)' : lang === 'ja' ? '旅行テーマ（複数選択可）' : (lang === 'zh' || lang === 'zht') ? '旅行主题（可多选）' : '여행 테마 (다중 선택)'}</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {THEME_OPTIONS.map((theme) => {
              const isSelected = selectedThemes.includes(theme.val);
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleToggleTheme(theme.val)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '10px',
                    border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-glass)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: 동행자 선택 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <Users size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Who is Traveling?' : lang === 'ja' ? '同行者' : (lang === 'zh' || lang === 'zht') ? '同行同伴' : '동행자'}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {COMPANION_OPTIONS.map((comp) => {
              const isSelected = selectedCompanion === comp.val;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedCompanion(comp.val)}
                  style={{
                    padding: '0.55rem 0.2rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? '#2563eb' : 'var(--bg-glass)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {comp.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: 자유 요청사항 (선택) */}
        <div>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={lang === 'en' ? 'Optional: e.g. strictly indoor places, halal food, budget-friendly' : '추가 요청 (선택): 예: 비 오는 날 실내 위주, 핫플 카페 2곳 포함, 부모님 동반'}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.6rem 0.85rem',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Step 6: '✨ AI 여행 일정 만들기' CTA 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '0.95rem 1rem',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontSize: '1.02rem',
            fontWeight: 900,
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={18} />
          <span>
            {isLoading
              ? (lang === 'en' ? 'Designing Perfect Itinerary...' : lang === 'ja' ? '最適プランを設計中...' : (lang === 'zh' || lang === 'zht') ? '正在生成定制路线...' : 'AI 맞춤 일정 생성 중...')
              : (lang === 'en' ? '✨ Generate AI Travel Itinerary' : lang === 'ja' ? '✨ AI旅行プランを作成' : (lang === 'zh' || lang === 'zht') ? '✨ 生成AI专属旅游路线' : '✨ AI 여행 일정 만들기')}
          </span>
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
}
