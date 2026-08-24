import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, Compass, Users, Heart, Coffee, Utensils, ShoppingBag, Trees, PartyPopper, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import VoraAIChat from './VoraAIChat';

/**
 * ==============================================================================
 * AIPlannerTab.jsx - 1단계 Studio 폼 & 2단계 대화형 조율 파이프라인
 * 
 * 1단계: 여행지, 기간(1~5일), 테마, 동행자 선택 폼
 * 2단계: Vora AI 실시간 대화창 (요약 브리핑 & 피드백 조율) + [ 📋 일정 확정 ] 버튼
 * ==============================================================================
 */

export default function AIPlannerTab({
  lang = 'ko',
  onGenerateItinerary,
  onConfirmItinerary,
  isLoading = false,
  questionQuota = { remaining: 3, total: 3 },
  onOpenRewardedAd,
  chatMessages = [],
  activeDay = 1,
  onSelectDay,
  initialMode = 'form' // 'form' | 'chat'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 1단계 (폼) vs 2단계 (대화) 전환 모드
  const [plannerMode, setPlannerMode] = useState(initialMode);

  useEffect(() => {
    if (initialMode) {
      setPlannerMode(initialMode);
    }
  }, [initialMode]);

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

    // 자연어 프롬프트 조합 생성
    const combinedQuery = `${destination} ${selectedDays}박${selectedDays}일 ${selectedCompanion} 여행, 테마: ${selectedThemes.join(', ')}${customNote.trim() ? `, 요구사항: ${customNote.trim()}` : ''}`;
    
    // 2단계 대화 모드로 전환하고 일정 생성 요청
    setPlannerMode('chat');
    if (onGenerateItinerary) {
      onGenerateItinerary(combinedQuery);
    }
  };

  // ==============================================================================
  // 2단계 : AI 대화 & 코스 조율 모드 (VoraAIChat + 일정 확정 버튼)
  // ==============================================================================
  if (plannerMode === 'chat') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {/* Top Control Bar: [ ← 조건 다시 선택 ] & [ 📋 일정 확정 ] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 0.65rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            onClick={() => setPlannerMode('form')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={14} />
            <span>{lang === 'en' ? 'Edit Studio Form' : lang === 'ja' ? '条件設定に戻る' : (lang === 'zh' || lang === 'zht') ? '返回条件设置' : '조건 다시 선택'}</span>
          </button>

          {/* 🌟 2단계 핵심: 일정 확정 버튼 */}
          <button
            type="button"
            onClick={onConfirmItinerary}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.42rem 0.95rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={14} />
            <span>{lang === 'en' ? 'Confirm Itinerary ➔' : lang === 'ja' ? '日程を確定する ➔' : (lang === 'zh' || lang === 'zht') ? '确认行程并查看 ➔' : '일정 확정 & 내 여행에 담기 ➔'}</span>
          </button>
        </div>

        {/* 2단계 실시간 대화창 (VoraAIChat) */}
        <div style={{ height: 'calc(100vh - 240px)', minHeight: '480px' }}>
          <VoraAIChat
            lang={lang}
            chatMessages={chatMessages}
            isLoading={isLoading}
            onSendMessage={onGenerateItinerary}
            activeDay={activeDay}
            onSelectDay={onSelectDay}
            questionQuota={questionQuota}
            onOpenRewardedAd={onOpenRewardedAd}
            onConfirmItinerary={onConfirmItinerary}
          />
        </div>
      </div>
    );
  }

  // ==============================================================================
  // 1단계 : AI Studio 조건 선택 폼
  // ==============================================================================
  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      padding: '0.9rem 1rem 1.15rem 1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
          {lang === 'en' ? 'AI Travel Planner' : 'AI 여행 스튜디오'}
        </h2>
      </div>

      <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Step 1: 여행지 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
            <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Destination' : '여행지'}</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}
          />
          <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', marginTop: '0.4rem' }}>
            {CITIES.map((city) => (
              <button key={city.id} type="button" onClick={() => setDestination(city.val)} style={{ padding: '0.2rem 0.5rem', borderRadius: '99px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>{city.name}</button>
            ))}
          </div>
        </div>

        {/* Step 2: 기간 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
            <Calendar size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Duration' : '여행 기간'}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
            {DAYS_OPTIONS.map((d) => (
              <button key={d} type="button" onClick={() => setSelectedDays(d)} style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: selectedDays === d ? '#2563eb' : 'var(--bg-glass)', color: selectedDays === d ? '#fff' : 'var(--text-main)', fontWeight: 800 }}>{d}일</button>
            ))}
          </div>
        </div>

        {/* Step 3: 테마 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
            <Compass size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Themes' : '여행 테마'}</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleToggleTheme(theme.val)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '9px',
                    border: selectedThemes.includes(theme.val) ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: selectedThemes.includes(theme.val) ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-glass)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Icon size={12} />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: 동행자 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
            <Users size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Companions' : lang === 'ja' ? '同行者' : (lang === 'zh' || lang === 'zht') ? '同伴' : '동행자'}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
            {COMPANION_OPTIONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedCompanion(comp.val)}
                style={{
                  padding: '0.45rem 0.2rem',
                  borderRadius: '10px',
                  border: selectedCompanion === comp.val ? '2px solid #2563eb' : '1px solid var(--border-color)',
                  backgroundColor: selectedCompanion === comp.val ? '#2563eb' : 'var(--bg-glass)',
                  color: selectedCompanion === comp.val ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: 자유 요청사항 */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
            {lang === 'en' ? 'Special Requests (Optional)' : '추가 요청 (선택): 예: 비 올 때 실내 위주, 핫플 카페 꼭 포함'}
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={lang === 'en' ? 'e.g. Indoor spots on rainy day, romantic sunset dinner' : '원하는 조건을 편하게 적어주세요'}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-glass)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '0.3rem',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#ffffff',
            fontSize: '0.98rem',
            fontWeight: 900,
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Sparkles size={16} />
          <span>
            {isLoading
              ? (lang === 'en' ? 'Designing Itinerary...' : 'AI 맞춤 일정 생성 중...')
              : (lang === 'en' ? '✨ Generate AI Travel Itinerary' : '✨ AI 여행 일정 만들기')}
          </span>
          {!isLoading && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}

