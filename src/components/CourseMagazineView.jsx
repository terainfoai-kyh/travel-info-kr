import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, ExternalLink, Info, Navigation, Star, Sparkles } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';
import { getSpotAffiliateDeal } from '../services/affiliateService';

export default function CourseMagazineView({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  bookmarks = [],
  onToggleBookmark
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const schedules = itineraryData?.dailySchedules || [];
  const targetCity = itineraryData?.targetCity || '서울';

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const activeSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));

  // Transit localization helper (Ultra-compact & high readability)
  const getLocalizedTransit = (transitStr) => {
    if (!transitStr) return lang === 'en' ? 'Walk 10m' : lang === 'ja' ? '徒歩10分' : (lang === 'zh' || lang === 'zht') ? '步行10分' : '도보 10분';
    if (lang === 'ko') return transitStr;
    const tt = transitStr;
    if (tt.includes('제주') || tt.includes('급행') || tt.includes('해안도로')) {
      if (lang === 'en') return 'Jeju Bus ~15m';
      if (lang === 'ja') return '済州バス 約15分';
      return '济州公交 约15分';
    }
    if (tt.includes('지하철') || tt.includes('도보')) {
      if (lang === 'en') return 'Subway/Walk ~10m';
      if (lang === 'ja') return '地下鉄·徒歩 約10分';
      return '地铁·步行 约10分';
    }
    if (tt.includes('버스') || tt.includes('택시')) {
      if (lang === 'en') return 'Bus/Taxi ~15m';
      if (lang === 'ja') return 'バス·タクシー 約15分';
      return '公交·出租车 约15分';
    }
    return tt;
  };

  // 🎯 Interactive Spot Focus State across Map & Timeline List
  const [focusedSpotIndex, setFocusedSpotIndex] = useState(null);

  // Reset spot focus whenever the user switches active day
  useEffect(() => {
    setFocusedSpotIndex(null);
  }, [activeDay]);

  const isSpotBookmarked = (spot) => {
    if (!spot) return false;
    const spotId = spot.contentId || spot.id || spot.title;
    return bookmarks.some(b => 
      (typeof b === 'object' && ((b.contentId && b.contentId === spotId) || (b.id && b.id === spotId) || (b.title && b.title === spot.title))) ||
      (typeof b === 'string' && (b === spotId || b === spot.title))
    );
  };

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      {/* Magazine Header & Day Tabs */}
      <div style={{
        padding: '0.6rem 0.85rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem'
      }}>
        {/* Row 1: Title & Speed Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
            <Calendar size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.courseTimelineTitle || '스마트 여행 코스 타임라인'}
            </h3>
          </div>
          {itineraryData?.generationTime && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0
            }}>
              ⚡ {itineraryData.generationTime}{lang === 'en' ? 's' : lang === 'ja' ? '秒' : (lang === 'zh' || lang === 'zht') ? '秒' : '초'}
            </span>
          )}
        </div>

        {/* Row 2: Full-Width Day Selector Tabs (Guaranteed 100% visible on all mobile screens) */}
        {displaySchedules.length > 1 && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-primary)',
            padding: '0.2rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            gap: '0.25rem',
            width: '100%',
            boxSizing: 'border-box',
            justifyContent: 'space-between'
          }}>
            {displaySchedules.map((ds) => {
              const isSelected = Number(activeDay) === Number(ds.day);
              return (
                <button
                  key={ds.day}
                  onClick={() => onSelectDay && onSelectDay(ds.day)}
                  style={{
                    flex: 1,
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.4rem',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Body */}
      {!itineraryData ? (
        <div style={{
          flex: 1,
          padding: '3rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            marginBottom: '0.85rem'
          }}>
            <MapPin size={28} />
          </div>
          <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {lang === 'en' 
              ? 'Your customized travel itinerary will appear here' 
              : lang === 'ja' 
              ? 'カスタム旅程がここに表示されます' 
              : (lang === 'zh' || lang === 'zht') 
              ? (lang === 'zht' ? '您的專屬客製化旅遊行程將在此顯示' : '您的专属定制旅游路线将在此显示') 
              : '맞춤 여행 코스가 여기에 표시됩니다'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.82rem', maxWidth: '360px', lineHeight: 1.5 }}>
            {t.noSpotsYet || 'AI에게 여행 계획을 물어보시면 맞춤형 코스 타임라인과 구글 지도가 이곳에 펼쳐집니다.'}
          </p>
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* ==========================================================================
             🗺️ 1. 상단 영구 고정 지도 영역 (Permanent Top Map)
             - 지도 높이 210px + 상단바 슬림 패딩으로 하단 목록 공간을 100px 이상 극대화
             - 1일차/2일차/3일차 동선 및 마커가 1초의 잘림 없이 100% 표시됨
             ========================================================================== */}
          <div style={{ padding: '0.45rem 0.9rem 0.15rem 0.9rem', flexShrink: 0 }}>
            <GoogleMapView
              spots={activeSpots}
              activeDay={activeDay}
              targetCity={targetCity}
              lang={lang}
              focusedSpotIndex={focusedSpotIndex}
              onSelectSpotIndex={setFocusedSpotIndex}
            />
          </div>

          {/* ==========================================================================
             📋 2. 하단 독립 스크롤 타임라인 목록 (Scrollable Spot List)
             - 불필요한 중복 테마 배너를 제거하여 하단 공간 +45px 추가 확보!
             - 1번, 2번 스팟 카드가 100% 온전하게 시원한 크기로 표시됨
             ========================================================================== */}
          <div
            className="thin-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.25rem 0.9rem 1rem 0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem'
            }}
          >
            {/* 🎯 스팟 타임라인 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {activeSpots.map((spot, idx) => {
                const bookmarked = isSpotBookmarked(spot);
                const isFocused = focusedSpotIndex === idx;
                return (
                  <div
                    key={spot.id || idx}
                    onClick={() => setFocusedSpotIndex(idx)}
                    title={lang === 'en' ? `Pan to ${spot.title} on map (Click)` : lang === 'ja' ? `${spot.title}の位置へ移動（クリック）` : (lang === 'zh' || lang === 'zht') ? `在地图上查看 ${spot.title}（点击）` : `${spot.title} 지도 위치로 이동 (클릭)`}
                    style={{
                      backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.04)' : 'var(--bg-card)',
                      border: isFocused ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: isFocused ? '0 8px 24px rgba(37, 99, 235, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: '0.85rem',
                      padding: '0.75rem 0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isFocused) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'var(--border-highlight)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFocused) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.04)';
                      }
                    }}
                  >
                    {/* Left: HD Photo Thumbnail with Pin Badge */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDetail) onOpenDetail(spot);
                      }}
                      title={lang === 'en' ? 'Click to view HD photos & details' : lang === 'ja' ? 'クリックして詳細情報と高画質写真を見る' : (lang === 'zh' || lang === 'zht') ? '点击查看高清实景图与详情' : '클릭하여 상세 정보 및 고화질 실사진 보기'}
                      style={{
                        position: 'relative',
                        width: '96px',
                        minWidth: '96px',
                        height: '88px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img
                        src={spot.image || '/default-spot.png'}
                        alt={spot.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      />
                      {/* Numbered Pin Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: isFocused ? '#1d4ed8' : '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.35)'
                      }}>
                        {idx + 1}
                      </div>
                    </div>

                    {/* Right: Spot Content & Modern Action Buttons */}
                    <div style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.35rem'
                    }}>
                      {/* Title & Bookmark */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            color: isFocused ? 'var(--accent-primary)' : 'var(--text-main)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {spot.title}
                          </h4>
                          <p style={{
                            margin: '0.15rem 0 0 0',
                            fontSize: '0.74rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {spot.location || (lang === 'en' ? `${targetCity}, Korea` : lang === 'ja' ? `韓国 ${targetCity}` : `韩国 ${targetCity}`)}
                          </p>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleBookmark) onToggleBookmark(spot);
                          }}
                          aria-label={bookmarked ? t.savedToWishlist : t.saveToWishlist}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: bookmarked ? '#ef4444' : 'var(--text-muted)',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Heart size={16} fill={bookmarked ? '#ef4444' : 'none'} />
                        </button>
                      </div>

                      {/* Transit & Photo Tip Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#2563eb',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap'
                        }}>
                          <Navigation size={9} />
                          <span>{getLocalizedTransit(spot.transitTime)}</span>
                        </div>

                        {spot.photoTip && (
                          <div style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#d97706',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px'
                          }}>
                            ✨ {spot.photoTip}
                          </div>
                        )}
                      </div>

                      {/* Modern Clean Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                        {/* 🔍 Details & Photos */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenDetail) onOpenDetail(spot);
                          }}
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Info size={11} style={{ color: 'var(--accent-primary)' }} />
                          <span>{lang === 'en' ? 'Photos & Details' : lang === 'ja' ? '写真・詳細' : (lang === 'zh' || lang === 'zht') ? '实景·详情' : '사진·상세보기'}</span>
                        </button>

                        {/* 🗺️ Google Place / Route Link */}
                        <a
                          href={getGooglePlaceSearchUrl(spot.title, spot.location || targetCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            border: '1px solid rgba(37, 99, 235, 0.25)',
                            color: '#2563eb',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ExternalLink size={11} />
                          <span>{lang === 'en' ? 'Google Map' : lang === 'ja' ? 'Googleマップ' : (lang === 'zh' || lang === 'zht') ? 'Google地图' : '구글맵 길찾기'}</span>
                        </a>

                        {/* Optional Klook Deal */}
                        {(() => {
                          const deal = getSpotAffiliateDeal(spot.title, targetCity, lang);
                          if (!deal) return null;
                          return (
                            <a
                              href={deal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                background: 'linear-gradient(135deg, #ff5722, #f44336)',
                                color: '#ffffff',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                boxShadow: '0 2px 6px rgba(255, 87, 34, 0.25)'
                              }}
                            >
                              <span>{deal.label}</span>
                              <ExternalLink size={10} />
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
