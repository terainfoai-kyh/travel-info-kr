import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sun, 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  CloudRain, 
  Camera, 
  Navigation, 
  ExternalLink, 
  Info,
  X,
  MapPin,
  Star
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';

/**
 * ==============================================================================
 * LiveTripTab.jsx - 여행 중 모바일 실시간 모드 ("지금 뭐하지?")
 * 
 * 1. 상단 배너: 실시간 날씨 & 컨시어지 ➔ 클릭 시 날씨/코디 팝업 즉시 연결
 * 2. 다음 일정 카드: 인사동 쌈지길 등 둘러보기
 * 3. '지금 뭐하지?': 클릭 시 일정으로 튕기지 않고 주변 핫플 4선 팝업 즉시 노출
 * ==============================================================================
 */

export default function LiveTripTab({
  lang = 'ko',
  targetCity = '서울',
  nextSpot = null,
  onOpenDetail,
  onOpenWeather
}) {
  // '지금 뭐하지?' 선택된 카테고리 모달 상태
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);

  // 기본 다음 목적지 (없을 시 기본 서울 핫플)
  const defaultNextSpot = {
    id: 'live-default-next',
    title: '인사동 쌈지길 & 전통찻집',
    name: '인사동 쌈지길 & 전통찻집',
    addr1: '서울특별시 종로구 인사동길 44',
    description: '나선형 계단을 따라 아기자기한 공예품점과 전통 찻집이 늘어선 서울의 대표적인 전통 문화 예술 거리입니다.',
    transitTime: '지하철 또는 도보로 편리하게 이동'
  };

  const activeNext = nextSpot || defaultNextSpot;

  const NEARBY_ACTIONS = [
    {
      id: 'cafe',
      label: lang === 'en' ? 'Trendy Local Cafes' : '주변 감성 카페',
      icon: Coffee,
      color: '#d97706',
      items: [
        { name: '어니언 안국 (Cafe Onion)', desc: '고즈넉한 한옥 중정 베이커리 카페', dist: '도보 4분', rating: 4.8 },
        { name: '대림창고 갤러리', desc: '인더스트리얼 감성 대형 아트 카페', dist: '도보 6분', rating: 4.7 },
        { name: '테일러커피', desc: '크림모카가 유명한 스페셜티 로스터리', dist: '도보 5분', rating: 4.8 },
        { name: '프릳츠 커피 컴퍼니', desc: '빈티지 레트로 감성의 빵과 커피 명소', dist: '도보 8분', rating: 4.6 }
      ]
    },
    {
      id: 'food',
      label: lang === 'en' ? 'Authentic Local Food' : '현지인 인기 맛집',
      icon: UtensilsCrossed,
      color: '#ef4444',
      items: [
        { name: '토속촌 삼계탕', desc: '진한 견과류 육수의 서울 대표 삼계탕', dist: '도보 5분', rating: 4.8 },
        { name: '삼청동 수제비', desc: '미쉐린 가이드 선정 시원한 멸치 육수', dist: '도보 7분', rating: 4.6 },
        { name: '명동교자 본점', desc: '미쉐린 빕구르망 칼국수 & 마늘김치', dist: '도보 10분', rating: 4.7 },
        { name: '광장시장 순희네 빈대떡', desc: '바삭하고 고소한 녹두 빈대떡 & 육회', dist: '지하철 5분', rating: 4.7 }
      ]
    },
    {
      id: 'rain',
      label: lang === 'en' ? 'Rainy Day Indoor Spots' : '비 올 때 실내 핫플',
      icon: CloudRain,
      color: '#3b82f6',
      items: [
        { name: '국립현대미술관 서울', desc: '비 오는 날 운치 있는 도심 속 현대 미술관', dist: '도보 6분', rating: 4.8 },
        { name: '코엑스 별마당 도서관', desc: '13m 높이의 거대한 책장 실내 랜드마크', dist: '지하철 15분', rating: 4.9 },
        { name: '동대문 DDP 디자인랩', desc: '미래지향적 건축물과 복합 문화 디자인 전시', dist: '지하철 8분', rating: 4.7 },
        { name: '더현대 서울 (사운즈 포레스트)', desc: '실내 정원과 트렌디한 글로벌 팝업스토어', dist: '지하철 18분', rating: 4.8 }
      ]
    },
    {
      id: 'photo',
      label: lang === 'en' ? 'Best Photo Spots' : '인생샷 포토존',
      icon: Camera,
      color: '#ec4899',
      items: [
        { name: '북촌 한옥마을 8경', desc: '한옥 처마선 사이로 남산타워가 보이는 뷰', dist: '도보 5분', rating: 4.8 },
        { name: '창경궁 대온실', desc: '한국 최초의 서양식 유리 온실 포토스팟', dist: '도보 10분', rating: 4.7 },
        { name: '익선동 한옥 골목길', desc: '아기자기한 꽃집과 감성 조명 골목', dist: '도보 7분', rating: 4.6 },
        { name: '성수동 연무장길 벽화거리', desc: '트렌디한 그래피티와 팝업 포토존', dist: '지하철 15분', rating: 4.7 }
      ]
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* 1. Realtime Weather & Status Header (클릭 시 실시간 날씨/코디 팝업 즉시 오픈!) */}
      <div 
        onClick={() => onOpenWeather && onOpenWeather(targetCity)}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
          borderRadius: '24px',
          padding: '1.25rem 1.4rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(2, 132, 199, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(2, 132, 199, 0.25)';
        }}
      >
        <div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '0.35rem'
          }}>
            📍 {targetCity} • Live Concierge (탭하여 날씨/코디 보기)
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
            {lang === 'en' ? 'Enjoying Your Trip?' : '즐거운 한국 여행 중이신가요? 😊'}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
            맑음 24°C • 나들이하기 아주 좋은 날씨 ➔
          </p>
        </div>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sun size={28} style={{ color: '#fef08a' }} />
        </div>
      </div>

      {/* 2. 'Next Destination' Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1.5px solid var(--border-highlight)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Navigation size={12} />
            <span>{lang === 'en' ? 'Next Destination' : '다음 일정'}</span>
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
            🕒 {activeNext.transitTime || '지하철 또는 도보로 이동'}
          </span>
        </div>

        <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
          {activeNext.title}
        </h4>
        <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {activeNext.description || activeNext.addr1}
        </p>

        {/* Dual Actions: [🗺️ 길찾기] & [ℹ️ 상세보기] */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <a
            href={getGooglePlaceSearchUrl(activeNext.title, targetCity)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.55rem',
              borderRadius: '10px',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Navigation size={13} />
            <span>{lang === 'en' ? 'Google Maps ↗' : '길찾기 ↗'}</span>
          </a>

          <button
            onClick={() => onOpenDetail && onOpenDetail({ ...activeNext, isExploreOnly: true })}
            style={{
              padding: '0.55rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Info size={13} style={{ color: '#2563eb' }} />
            <span>{lang === 'en' ? 'Details' : '상세보기'}</span>
          </button>
        </div>
      </div>

      {/* 3. '지금 뭐하지?' (주변 실시간 탐색) Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Sparkles size={16} style={{ color: '#2563eb' }} />
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {lang === 'en' ? 'What to do right now?' : '지금 뭐하지? (주변 실시간 탐색)'}
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
          {NEARBY_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setSelectedQuickCategory(action)}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Icon size={16} style={{ color: action.color, flexShrink: 0 }} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 4. '지금 뭐하지?' 주변 핫플 4선 퀵 리스트 모달 (createPortal로 화면 정중앙 100% 고정 렌더링!) */}
      {selectedQuickCategory && typeof document !== 'undefined' && createPortal(
        (() => {
          const QuickIcon = selectedQuickCategory.icon;
          return (
            <div 
              onClick={() => setSelectedQuickCategory(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100dvh',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box'
              }}
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '24px',
                  maxWidth: '440px',
                  width: '100%',
                  maxHeight: 'min(82vh, 82dvh)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {QuickIcon && <QuickIcon size={18} style={{ color: selectedQuickCategory.color }} />}
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {targetCity} {selectedQuickCategory.label}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedQuickCategory(null)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* List Body */}
                <div style={{
                  padding: '0.85rem 1rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {selectedQuickCategory.items.map((item, idx) => {
                    const itemMapUrl = getGooglePlaceSearchUrl(item.name, targetCity);
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0.65rem 0.8rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>
                              ★ {item.rating}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              ({item.dist})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {item.desc}
                          </div>
                        </div>

                        <a
                          href={itemMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.3rem 0.55rem',
                            backgroundColor: '#1e293b',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            flexShrink: 0
                          }}
                        >
                          <span>{lang === 'en' ? 'Map ↗' : '구글맵 ↗'}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}
