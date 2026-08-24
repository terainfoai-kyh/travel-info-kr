import React, { useState } from 'react';
import { Calendar, Share2, Check, MapPin, Sparkles, Navigation, Info, ExternalLink, Clock, CheckCircle2, Trash2, PlusCircle, Bookmark, Printer, Download, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * ==============================================================================
 * MyTripTab.jsx - 내 여행 스마트 타임라인 & 멀티 저장 여행 셀렉터
 * 
 * 1. 상단: 🧳 내 저장 여행 (N개) 스마트 가로 스크롤 카드 셀렉터 & [＋ 새 여행] & [⚡ 잔여 저장 N/3회]
 * 2. 저장 상태별 최적화:
 *    - 미저장(Draft): [ 📝 작성 중 ] + [ 💾 이 일정 저장하기 (1회 차감) ] 노출 (공유 숨김)
 *    - 저장완료(Saved): [ ✅ 저장됨 ] + [ 🔗 친구 공유 ] + [ 📄 PDF / 인쇄 ]
 * 3. 09:00~18:30 풀코스 1줄 타임라인 (0초 스크롤 뷰)
 * 4. 하단 듀얼 액션 바: [🗺️ 지도 보기] & [💬 AI 대화로 수정]
 * ==============================================================================
 */

export default function MyTripTab({
  lang = 'ko',
  itineraryData = null,
  activeDay = 1,
  onSelectDay,
  onOpenDetail,
  onGoToMap,
  onGoToModify,
  onOpenRewardedAd,
  savedTrips = [],
  onSelectTrip,
  onDeleteTrip,
  onCreateNewTrip,
  onSaveCurrentTrip,
  questionQuota = null
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [copied, setCopied] = useState(false);

  // 저장된 여행도 없고 현재 활성 일정도 없을 때의 엠프티 뷰
  if (!itineraryData && (!savedTrips || savedTrips.length === 0)) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto 4.5rem auto',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Bookmark size={32} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {lang === 'en' ? 'No Saved Itineraries Yet' : lang === 'ja' ? '保存された旅行プランがありません' : (lang === 'zh' || lang === 'zht') ? '暂无已保存的旅行行程' : '아직 저장된 여행 일정이 없습니다'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {lang === 'en'
              ? 'Plan your personalized Korea trip with VORA AI and save it here to view anytime!'
              : lang === 'ja'
              ? 'VORA AIで韓国旅行プランを作成し、ここに保存していつでも確認しましょう！'
              : (lang === 'zh' || lang === 'zht')
              ? '使用 VORA AI 定制专属韩国之旅并保存，随时随地查看！'
              : 'VORA AI와 함께 나만의 한국 맞춤 코스를 만들고 저장해 두시면 언제든 꺼내보실 수 있습니다!'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNewTrip || onGoToModify}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <span>{lang === 'en' ? '✨ Create My First AI Trip' : lang === 'ja' ? '✨ 初めてのAIプランを作成' : (lang === 'zh' || lang === 'zht') ? '✨ 开始定制我的首个AI行程' : '✨ AI 플래너로 첫 여행 코스 만들기'}</span>
        </button>
      </div>
    );
  }

  // 현재 일정이 실제로 savedTrips에 저장되어 있는지 판별
  const isCurrentTripSaved = savedTrips.some(t => 
    (itineraryData?.savedId && t.savedId === itineraryData.savedId) || 
    (t.tripTitle === (itineraryData?.tripTitle || itineraryData?.title))
  );

  const schedules = itineraryData?.dailySchedules || [];
  const targetCity = itineraryData?.targetCity || '서울';
  const tripTitle = itineraryData?.tripTitle || itineraryData?.title || `${targetCity} ${itineraryData?.days || 3}일 여행 일정`;

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const activeSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  // 🔗 일정 공유 링크 복사
  const handleShareTrip = () => {
    try {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 📄 PDF / 인쇄 기능
  const handlePrintPDF = () => {
    window.print();
  };

  // 6개 표준 시간대 (09:00, 11:00, 13:00, 14:30, 16:30, 18:30)
  const getTimeSlot = (idx) => {
    const times = ['09:00', '11:00', '13:00', '14:30', '16:30', '18:30'];
    return times[idx % times.length];
  };

  // & 및 불필요한 결합 문자열 단일 명소로 정제
  const cleanSpotTitle = (rawTitle = '') => {
    if (!rawTitle) return '';
    return rawTitle.split('&')[0].split('/')[0].split('+')[0].trim();
  };

  // 서브 타이틀에서 "1일차:", "2일차:" 같은 중복 접두사 제거
  const cleanDayTheme = (rawTheme = '') => {
    if (!rawTheme) return `${targetCity}의 하루`;
    return rawTheme.replace(/^\d+일차[:\s—-]*/, '').trim() || `${targetCity}의 하루`;
  };

  const remainingQuota = questionQuota?.remaining ?? 3;
  const totalQuota = questionQuota?.total ?? 3;

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto 4.5rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>
      {/* 🌟 0. 상단 멀티 저장 여행 셀렉터 & 잔여 저장 횟수 뱃지 */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '0.75rem 1rem',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bookmark size={14} style={{ color: '#2563eb' }} />
              <span>{lang === 'en' ? `Saved Trips (${savedTrips.length})` : lang === 'ja' ? `保存済みプラン (${savedTrips.length})` : (lang === 'zh' || lang === 'zht') ? `已保存行程 (${savedTrips.length})` : `내 저장 여행 (${savedTrips.length}개)`}</span>
            </div>

            {/* ⚡ NO 5: 잔여 횟수 뱃지 (2/3회) + 터치 시 즉시 충전 */}
            <div
              onClick={onOpenRewardedAd}
              title={lang === 'en' ? 'Click to recharge +3 saves' : '클릭하여 +3회 무료 충전하기'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                backgroundColor: remainingQuota > 0 ? 'rgba(37, 99, 235, 0.08)' : 'rgba(239, 68, 68, 0.1)',
                color: remainingQuota > 0 ? '#2563eb' : '#ef4444',
                border: `1px solid ${remainingQuota > 0 ? 'rgba(37, 99, 235, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                borderRadius: '8px',
                padding: '0.2rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={11} />
              <span>{lang === 'en' ? `Saves: ${remainingQuota}/${totalQuota}` : `잔여 저장: ${remainingQuota}/${totalQuota}회`}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateNewTrip || onGoToModify}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={13} />
            <span>{lang === 'en' ? '＋ New Trip' : lang === 'ja' ? '＋ 新規プラン' : (lang === 'zh' || lang === 'zht') ? '＋ 新建行程' : '＋ 새 여행 만들기'}</span>
          </button>
        </div>

        {/* 저장된 여행 목록 가로 스크롤 카드 */}
        {savedTrips && savedTrips.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {savedTrips.map((trip, idx) => {
              const isSelected = (trip.savedId && trip.savedId === itineraryData?.savedId) || (trip.tripTitle === itineraryData?.tripTitle);
              return (
                <div
                  key={trip.savedId || idx}
                  onClick={() => onSelectTrip && onSelectTrip(trip)}
                  style={{
                    flexShrink: 0,
                    padding: '0.45rem 0.75rem',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <MapPin size={13} style={{ color: isSelected ? '#2563eb' : 'var(--text-muted)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#2563eb' : 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      {trip.targetCity || '서울'} {trip.days || 3}일 {isSelected && '👑'}
                    </span>
                  </div>
                  {onDeleteTrip && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(lang === 'en' ? 'Delete this saved trip?' : '이 저장된 일정을 삭제하시겠습니까?')) {
                          onDeleteTrip(trip.savedId || trip.tripTitle);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.1rem',
                        marginLeft: '0.2rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      aria-label="Delete trip"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🌟 1. Main Timeline Card */}
      <div id="printable-trip-timeline" style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 1. Top Header: Back to Chat, Title & Save / Share / PDF Actions */}
        <div style={{
          padding: '0.75rem 1rem 0.65rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* 🌟 일정 ➔ 채팅 복귀 버튼 */}
            <button
              type="button"
              onClick={onGoToModify}
              className="no-print"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={13} />
              <span>{lang === 'en' ? '← Back to AI Chat' : lang === 'ja' ? '← AIチャットで修正' : (lang === 'zh' || lang === 'zht') ? '← 返回AI对话修改' : '← AI 대화로 수정'}</span>
            </button>

            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span>{tripTitle}</span>
              </h2>
            </div>
          </div>

          {/* 🌟 우측 액션: 저장 상태(Saved) vs 미저장(Draft) 분기 처리 */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {isCurrentTripSaved ? (
              // 🌟 NO 6: 저장된 진짜 일정 ➔ [✅ 저장됨] + [🔗 공유] + [📄 PDF]
              <>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  padding: '0.25rem 0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <CheckCircle2 size={12} />
                  <span>{lang === 'en' ? 'Saved' : '저장됨'}</span>
                </span>

                <button
                  type="button"
                  onClick={handleShareTrip}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '8px',
                    padding: '0.32rem 0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={12} />
                  <span>{copied ? (lang === 'en' ? 'Copied!' : '복사됨!') : (lang === 'en' ? 'Share' : '공유')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintPDF}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '8px',
                    padding: '0.32rem 0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={12} />
                  <span>{lang === 'en' ? 'PDF' : 'PDF'}</span>
                </button>
              </>
            ) : (
              // 🌟 NO 7: 작성 중(미저장) 일정 ➔ 공유 숨김 & [ 💾 이 일정 저장하기 (1회 차감) ] 강조 버튼
              <button
                type="button"
                onClick={onSaveCurrentTrip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Bookmark size={13} />
                <span>{lang === 'en' ? `💾 Save Trip (${remainingQuota} Left)` : `💾 이 일정 저장하기 (1회 차감)`}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. DAY 1 / DAY 2 / DAY 3 Segmented Control Tab Bar */}
        <div className="no-print" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.5rem 0.85rem',
          backgroundColor: 'var(--bg-glass)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {displaySchedules.map((sch) => {
            const isSelected = Number(activeDay) === Number(sch.day);
            return (
              <button
                key={sch.day}
                type="button"
                onClick={() => onSelectDay && onSelectDay(sch.day)}
                style={{
                  flex: '0 0 auto',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? '#2563eb' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 900 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
                }}
              >
                <span>{lang === 'en' ? `Day ${sch.day}` : `${sch.day}일차`}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Subheader: DAY 1 — 테마 타이틀 */}
        <div style={{
          padding: '0.55rem 1rem',
          backgroundColor: 'rgba(37, 99, 235, 0.04)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Calendar size={13} />
            <span>DAY {activeDay} — {cleanDayTheme(currentSchedule?.theme)}</span>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {activeSpots.length}개 추천 코스
          </span>
        </div>

        {/* 4. Timeline Spot Rows (0초 스크롤 1줄 뷰) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0.25rem 0.75rem'
        }}>
          {activeSpots.map((spot, idx) => {
            const timeStr = spot.time || getTimeSlot(idx);
            const cleanTitle = cleanSpotTitle(spot.title || spot.name);
            const isLast = idx === activeSpots.length - 1;

            return (
              <div key={spot.id || idx} style={{ position: 'relative' }}>
                <div
                  onClick={() => onOpenDetail && onOpenDetail(spot)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.55rem 0.35rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    gap: '0.65rem',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-glass)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* 시간 뱃지 */}
                  <div style={{
                    width: '42px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#2563eb',
                    flexShrink: 0
                  }}>
                    {timeStr}
                  </div>

                  {/* 타임라인 원형 노드 (넘버링) */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    flexShrink: 0,
                    boxShadow: '0 2px 5px rgba(37, 99, 235, 0.35)'
                  }}>
                    {idx + 1}
                  </div>

                  {/* 스팟 명소 타이틀 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {cleanTitle}
                    </div>
                  </div>

                  {/* 카테고리 칩 */}
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-glass)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    {spot.category || spot.theme || '명소'}
                  </div>
                </div>

                {/* 연결 점선 (마지막 요소 제외) */}
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    left: '58px',
                    top: '28px',
                    bottom: '-4px',
                    width: '2px',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    zIndex: 0
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* 5. Bottom Dual Actions: [🗺️ 지도 보기] & [💬 AI 대화로 수정] */}
        <div className="no-print" style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            onClick={onGoToMap}
            style={{
              padding: '0.65rem 0.4rem',
              borderRadius: '12px',
              border: '1.5px solid #2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease'
            }}
          >
            <MapPin size={14} />
            <span>{lang === 'en' ? 'View on Map' : lang === 'ja' ? '地図で確認' : (lang === 'zh' || lang === 'zht') ? '在地图中查看' : '🗺️ 지도 보기'}</span>
          </button>

          <button
            type="button"
            onClick={onGoToModify}
            style={{
              padding: '0.65rem 0.4rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Modify via AI Chat' : lang === 'ja' ? 'AIチャットで修正' : (lang === 'zh' || lang === 'zht') ? 'AI对话微调' : '💬 AI 대화로 수정'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
