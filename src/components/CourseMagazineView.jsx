import React, { useState } from 'react';
import { Calendar, MapPin, Heart, ExternalLink, Info, Navigation, Star } from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { TRANSLATIONS } from '../i18n/translations';

export default function CourseMagazineView({
  lang = 'ko',
  itineraryData = null,
  onOpenDetail,
  bookmarks = [],
  onToggleBookmark
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [activeDay, setActiveDay] = useState(1);

  const schedules = itineraryData?.dailySchedules || [];
  const daysCount = itineraryData?.days || schedules.length || 3;
  const targetCity = itineraryData?.targetCity || '서울';

  const currentSchedule = schedules.find(s => s.day === activeDay) || schedules[0];
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
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.courseTimelineTitle || '스마트 여행 코스 타임라인'}
          </h3>
        </div>

        {/* Day Selector Tabs */}
        {itineraryData && schedules.length > 1 && (
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-primary)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            gap: '0.25rem'
          }}>
            {schedules.map((ds) => (
              <button
                key={ds.day}
                onClick={() => setActiveDay(ds.day)}
                style={{
                  backgroundColor: activeDay === ds.day ? 'var(--accent-primary)' : 'transparent',
                  color: activeDay === ds.day ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: activeDay === ds.day ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t.dayBadge ? t.dayBadge(ds.day) : `${ds.day}일차`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Body */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        minHeight: '380px',
        maxHeight: '620px'
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
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              marginBottom: '1rem'
            }}>
              <MapPin size={30} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              맞춤 여행 코스가 여기에 표시됩니다
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '380px', lineHeight: 1.5 }}>
              {t.noSpotsYet || 'AI에게 여행 계획을 물어보시면 맞춤형 코스 타임라인과 구글 지도가 이곳에 펼쳐집니다.'}
            </p>
          </div>
        )}

        {/* Itinerary Active Day Content */}
        {itineraryData && (
          <>
            {/* Top Interactive Google Map for Active Day */}
            <GoogleMapView
              spots={activeSpots}
              activeDay={activeDay}
              targetCity={targetCity}
            />

            {/* Timeline Day Theme Banner */}
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {activeDay}일차 테마
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  {currentSchedule?.theme || `${targetCity} 인기 코스`}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                총 {activeSpots.length}개 장소
              </span>
            </div>

            {/* Spot Timeline Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeSpots.map((spot, idx) => {
                const bookmarked = isSpotBookmarked(spot);
                return (
                  <div
                    key={spot.id || idx}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                    }}
                  >
                    {/* Spot Card Image & Quick Badges */}
                    <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
                      <img
                        src={spot.image || '/default-spot.png'}
                        alt={spot.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform var(--transition-normal)'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/default-spot.png';
                        }}
                      />

                      {/* Numbered Sequence Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        {idx + 1}
                      </div>

                      {/* Category Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '46px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {spot.category || spot.theme || '관광명소'}
                      </div>

                      {/* Bookmark Toggle Heart Button */}
                      <button
                        onClick={() => onToggleBookmark(spot)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                      >
                        <Heart
                          size={16}
                          style={{
                            color: bookmarked ? '#ef4444' : '#64748b',
                            fill: bookmarked ? '#ef4444' : 'none'
                          }}
                        />
                      </button>
                    </div>

                    {/* Spot Card Information Body */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {spot.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800 }}>
                          <Star size={13} fill="#f59e0b" />
                          <span>{spot.rating || 4.9}</span>
                        </div>
                      </div>

                      {/* Location Text */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <MapPin size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {spot.location}
                        </span>
                      </div>

                      {/* Transit Time Highlight */}
                      {spot.transitTime && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#059669',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          <Navigation size={12} style={{ flexShrink: 0 }} />
                          <span>{spot.transitTime}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        marginTop: '0.4rem',
                        paddingTop: '0.6rem',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <button
                          onClick={() => onOpenDetail(spot)}
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            borderRadius: '8px',
                            padding: '0.45rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Info size={13} style={{ color: 'var(--accent-primary)' }} />
                          <span>{t.photosAndDetails || '상세보기'}</span>
                        </button>

                        <a
                          href={getGooglePlaceSearchUrl(spot.title, spot.region || targetCity)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            border: '1px solid var(--border-highlight)',
                            color: 'var(--accent-primary)',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            padding: '0.45rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <span>Google 지도</span>
                          <ExternalLink size={12} />
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
