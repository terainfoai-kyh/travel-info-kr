import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, ExternalLink, Info, Navigation, Star, Sparkles } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

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
        padding: '0.75rem 1.1rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.courseTimelineTitle || '스마트 여행 코스 타임라인'}
          </h3>
          {itineraryData?.generationTime && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              ⚡ {itineraryData.generationTime}초 생성
            </span>
          )}
        </div>

        {/* Day Selector Tabs (Syncs bidirectionally with Chat) */}
        {itineraryData && schedules.length > 1 && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-primary)',
            padding: '0.2rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            gap: '0.2rem'
          }}>
            {schedules.map((ds) => {
              const isSelected = Number(activeDay) === Number(ds.day);
              return (
                <button
                  key={ds.day}
                  onClick={() => onSelectDay && onSelectDay(ds.day)}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
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
            맞춤 여행 코스가 여기에 표시됩니다
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
             - thin-scrollbar 적용으로 아래로 스크롤 가능함을 직관적으로 표시
             - 컴팩트 카드 설계로 1번, 2번 스팟 카드가 잘림 없이 한눈에 들어옴
             ========================================================================== */}
          <div
            className="thin-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.35rem 0.9rem 1rem 0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem'
            }}
          >
            {/* 💡 1일차/2일차 테마 슬림 배너 */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '10px',
              padding: '0.4rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.4rem'
            }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {activeDay}일차 테마
                </span>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {currentSchedule?.theme || `${targetCity} 인기 코스`}
                </div>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                flexShrink: 0
              }}>
                총 {activeSpots.length}개 장소
              </span>
            </div>

            {/* 🎯 컴팩트 스팟 타임라인 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {activeSpots.map((spot, idx) => {
                const bookmarked = isSpotBookmarked(spot);
                const isFocused = focusedSpotIndex === idx;
                return (
                  <div
                    key={spot.id || idx}
                    onClick={() => setFocusedSpotIndex(idx)}
                    title={`${spot.title} 지도 위치로 이동 (클릭)`}
                    style={{
                      backgroundColor: isFocused ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-primary)',
                      border: isFocused ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.18)' : 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: '0.65rem',
                      padding: '0.45rem 0.55rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {/* Left: Thumbnail with Numbered Pin */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDetail) onOpenDetail(spot);
                      }}
                      title="클릭하여 상세 정보 및 고화질 실사진 보기"
                      style={{
                        position: 'relative',
                        width: '84px',
                        minWidth: '84px',
                        height: '78px',
                        borderRadius: '9px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        cursor: 'pointer'
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
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      {/* Numbered Pin Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isFocused ? '#1d4ed8' : 'var(--accent-primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {idx + 1}
                      </div>
                      {/* Category Pill */}
                      <span style={{
                        position: 'absolute',
                        bottom: '3px',
                        left: '3px',
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        padding: '0.08rem 0.3rem',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {spot.category || '명소'}
                      </span>
                    </div>

                    {/* Right: Spot Content & Action Buttons */}
                    <div style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.2rem'
                    }}>
                      {/* Title & Bookmark */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.35rem' }}>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            color: isFocused ? 'var(--accent-primary)' : 'var(--text-main)',
                            lineHeight: 1.25,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {spot.title}
                          </h4>
                          <p style={{
                            margin: '0.05rem 0 0 0',
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {spot.location || `대한민국 ${targetCity}`}
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
                            padding: '0.15rem',
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Heart size={15} fill={bookmarked ? '#ef4444' : 'none'} />
                        </button>
                      </div>

                      {/* Photo Tip & Transit Time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                          backgroundColor: 'rgba(37, 99, 235, 0.07)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '5px'
                        }}>
                          <Navigation size={9} />
                          <span>{spot.transitTime || '도보 10분'}</span>
                        </div>

                        {spot.photoTip && (
                          <div style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#b45309',
                            backgroundColor: 'rgba(245, 158, 11, 0.08)',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '5px',
                            lineHeight: 1.2
                          }}>
                            {spot.photoTip}
                          </div>
                        )}
                      </div>

                      {/* Action Links (Focus Map, Detail Modal & Google Map Search) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.05rem', flexWrap: 'wrap' }}>
                        {/* 🗺️ Direct Map Focus Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusedSpotIndex(idx);
                          }}
                          style={{
                            backgroundColor: isFocused ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.08)',
                            border: '1px solid var(--border-highlight)',
                            color: isFocused ? '#ffffff' : 'var(--accent-primary)',
                            padding: '0.18rem 0.48rem',
                            borderRadius: '7px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <Navigation size={9} />
                          <span>지도 위치</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenDetail) onOpenDetail(spot);
                          }}
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.18rem 0.48rem',
                            borderRadius: '7px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <Info size={10} style={{ color: 'var(--accent-primary)' }} />
                          <span>사진·상세</span>
                        </button>

                        <a
                          href={getGooglePlaceSearchUrl(spot.title, targetCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            padding: '0.18rem 0.48rem',
                            borderRadius: '7px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <MapPin size={10} />
                          <span>Google맵</span>
                        </a>

                        {spot.affiliateDeal && (
                          <a
                            href={spot.affiliateDeal.dealUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: '#ff5b00',
                              color: '#ffffff',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              boxShadow: '0 2px 4px rgba(255, 91, 0, 0.25)'
                            }}
                          >
                            <span>{spot.affiliateDeal.dealBadge} ↗</span>
                          </a>
                        )}
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
