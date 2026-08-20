import React from 'react';
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
      <div style={{
        flex: 1,
        padding: '0.9rem 1.1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* If no itinerary data yet */}
        {!itineraryData && (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
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
        )}

        {/* Itinerary Active Day Content */}
        {itineraryData && (
          <>
            {/* 1. Integrated Interactive Google Map on Top */}
            <GoogleMapView
              spots={activeSpots}
              activeDay={activeDay}
              targetCity={targetCity}
              lang={lang}
            />

            {/* 2. Timeline Day Theme Banner */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '12px',
              padding: '0.55rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {activeDay}일차 테마
                </span>
                <div style={{
                  fontSize: '0.85rem',
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
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                flexShrink: 0
              }}>
                총 {activeSpots.length}개 장소
              </span>
            </div>

            {/* 3. Spot Timeline Cards (Compact Horizontal List) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activeSpots.map((spot, idx) => {
                const bookmarked = isSpotBookmarked(spot);
                return (
                  <div
                    key={spot.id || idx}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: '0.75rem',
                      padding: '0.55rem',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {/* Left: Thumbnail with Numbered Pin */}
                    <div style={{
                      position: 'relative',
                      width: '100px',
                      minWidth: '100px',
                      height: '95px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img
                        src={spot.image || '/default-spot.png'}
                        alt={spot.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Numbered Pin Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {idx + 1}
                      </div>
                      {/* Category Pill */}
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        padding: '0.1rem 0.35rem',
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
                      gap: '0.3rem'
                    }}>
                      {/* Title & Bookmark */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            color: 'var(--text-main)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {spot.title}
                          </h4>
                          <p style={{
                            margin: '0.1rem 0 0 0',
                            fontSize: '0.72rem',
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
                          onClick={() => onToggleBookmark && onToggleBookmark(spot)}
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

                      {/* Photo Tip & Transit Time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                          backgroundColor: 'rgba(37, 99, 235, 0.07)',
                          padding: '0.12rem 0.4rem',
                          borderRadius: '5px'
                        }}>
                          <Navigation size={10} />
                          <span>{spot.transitTime || '도보/지하철 10분'}</span>
                        </div>

                        {spot.photoTip && (
                          <div style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#b45309',
                            backgroundColor: 'rgba(245, 158, 11, 0.08)',
                            padding: '0.12rem 0.45rem',
                            borderRadius: '5px',
                            lineHeight: 1.3
                          }}>
                            {spot.photoTip}
                          </div>
                        )}
                      </div>

                      {/* Action Links (Detail Modal & Google Map Search) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                        <button
                          onClick={() => onOpenDetail && onOpenDetail(spot)}
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <Info size={11} style={{ color: 'var(--accent-primary)' }} />
                          <span>사진·상세</span>
                        </button>

                        <a
                          href={getGooglePlaceSearchUrl(spot.title, targetCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            border: '1px solid var(--border-highlight)',
                            color: 'var(--accent-primary)',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <span>Google 지도</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
