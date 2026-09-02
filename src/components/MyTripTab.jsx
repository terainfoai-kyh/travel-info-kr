import React, { useState } from 'react';
import { Calendar, Share2, Check, MapPin, Sparkles, Navigation, Info, ExternalLink, Clock, CheckCircle2, Trash2, PlusCircle, Bookmark, Printer, Download, Zap, Smartphone, RotateCw, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import QRCodeModal from './QRCodeModal';

/**
 * ==============================================================================
 * MyTripTab.jsx - 내 여행 스마트 타임라인 & 멀티 저장 여행 셀렉터
 * 
 * 1. 상단: 🧳 내 저장 여행 (N개) 스마트 가로 스크롤 카드 셀렉터 & [＋ 새 여행] & [⚡ 잔여 저장 N/3회] & [🔄 동기화]
 * 2. 비회원 유입 고객 ➔ 구글 계정 영구 보관 & 15회 혜택 스마트 넛지(Nudge) 배너
 * 3. 저장 상태별 최적화:
 *    - 미저장(Draft): [ 📝 작성 중 ] + [ 💾 이 일정 저장하기 (1회 차감) ] 노출 (공유 숨김)
 *    - 저장완료(Saved): [ ✅ 저장됨 ] + [ 📱 모바일 QR ] + [ 🔗 친구 공유 ] + [ 📄 PDF / 인쇄 ]
 * 4. 09:00~18:30 풀코스 1줄 타임라인 (0초 스크롤 뷰)
 * 5. 하단 듀얼 액션 바: [🗺️ 지도 보기] & [💬 AI 대화로 수정]
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
  questionQuota = null,
  currentUser = null,
  onOpenGoogleAuth = null,
  onSyncTrips = null,
  isDesktop = false,
  isMapOpen = false
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isNudgeDismissed, setIsNudgeDismissed] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  // 🔄 원터치 수동 클라우드 동기화 핸들러
  const handleTriggerSync = async () => {
    if (isSyncing) return;
    if (!currentUser?.isGoogleLoggedIn) {
      if (onOpenGoogleAuth) onOpenGoogleAuth();
      return;
    }
    setIsSyncing(true);
    try {
      if (onSyncTrips) {
        await onSyncTrips();
      }
      setSyncFeedback(lang === 'en' ? 'Synced with Cloud ✨' : '클라우드 동기화 완료 ✨');
      setTimeout(() => setSyncFeedback(''), 2500);
    } catch (e) {
      console.warn('[Sync Error]', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 400);
    }
  };

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
            {currentUser?.isGoogleLoggedIn
              ? (lang === 'en'
                ? 'Sync your cloud itineraries from PC, or create a brand new personalized Korea trip!'
                : 'PC에서 저장한 클라우드 일정을 동기화하여 불러오거나, AI 플래너로 새 여행을 만들어보세요!')
              : (lang === 'en'
                ? 'Plan your personalized Korea trip with VORA AI or log in with Google to sync your PC itineraries!'
                : 'VORA AI로 나만의 맞춤 코스를 만들거나, 구글 로그인으로 PC에서 짠 일정을 동기화해보세요!')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}>
          {/* 1. 로그인 상태인 경우: 원터치 클라우드 동기화 버튼 */}
          {currentUser?.isGoogleLoggedIn ? (
            <button
              type="button"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              style={{
                width: '100%',
                padding: '0.75rem 1.2rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--accent-primary)',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                color: 'var(--accent-primary)',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: isSyncing ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCw size={15} style={{ transform: isSyncing ? 'rotate(360deg)' : 'none', transition: isSyncing ? 'transform 0.6s linear' : 'none' }} />
              <span>{isSyncing ? (lang === 'en' ? 'Syncing...' : '동기화 중...') : (syncFeedback || (lang === 'en' ? '🔄 Sync Cloud Trips from PC' : '🔄 클라우드 일정 불러오기 (동기화)'))}</span>
            </button>
          ) : (
            /* 2. 미로그인 상태인 경우: 구글 로그인 동기화 버튼 */
            onOpenGoogleAuth && (
              <button
                type="button"
                onClick={onOpenGoogleAuth}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.2rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-highlight)',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{lang === 'en' ? 'Sign in with Google to Sync' : '구글 로그인하고 PC 일정 동기화'}</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={onCreateNewTrip || onGoToModify}
            style={{
              width: '100%',
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
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>{lang === 'en' ? 'Create First Trip Plan' : 'AI 플래너로 첫 여행 코스 만들기'}</span>
          </button>
        </div>
      </div>
    );
  }

  // 현재 일정이 실제로 savedTrips에 저장되어 있는지 판별 (새로 생성된 draftId 일정은 미저장 상태로 정확히 인식!)
  const isCurrentTripSaved = Boolean(
    itineraryData?.savedId && 
    savedTrips.some(t => t.savedId === itineraryData.savedId)
  );

  const schedules = itineraryData?.dailySchedules || [];
  const targetCity = itineraryData?.targetCity || itineraryData?.city || (itineraryData?.tripTitle && itineraryData.tripTitle.includes('제주') ? '제주' : (itineraryData?.tripTitle && itineraryData.tripTitle.includes('부산') ? '부산' : (itineraryData?.tripTitle && itineraryData.tripTitle.includes('강릉') ? '강릉' : '서울')));
  const tripTitle = itineraryData?.tripTitle || itineraryData?.title || `${targetCity} ${itineraryData?.days || schedules.length || 3}일 여행 일정`;

  const currentSchedule = schedules.find(s => Number(s.day) === Number(activeDay)) || schedules[0];
  const activeSpots = currentSchedule?.spots || (itineraryData?.spots || []).filter(s => Number(s.assignedDay) === Number(activeDay));

  const displaySchedules = (schedules && schedules.length > 0)
    ? schedules
    : Array.from({ length: Number(itineraryData?.days) || 3 }, (_, i) => ({ day: i + 1 }));

  // 🔗 스마트 일정 공유 (타이틀 + 코스 요약 + 링크 복사 및 Web Share API 지원)
  const handleShareTrip = async () => {
    try {
      const shareUrl = window.location.origin;
      let shareText = `✨ [VORA AI Travel] ${tripTitle}\n`;
      if (itineraryData?.summary) {
        shareText += `📝 ${itineraryData.summary}\n\n`;
      }
      
      (displaySchedules || []).forEach(ds => {
        const dayTheme = cleanDayTheme(ds.theme);
        const daySpots = (ds.spots || []).map(s => cleanSpotTitle(s.title || s.name)).filter(Boolean);
        shareText += `📍 DAY ${ds.day} (${dayTheme}):\n`;
        if (daySpots.length > 0) {
          shareText += `   ${daySpots.join(' ➔ ')}\n`;
        }
      });
      
      shareText += `\n🔗 여행 코스 전체 보기: ${shareUrl}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: tripTitle,
            text: shareText,
            url: shareUrl
          });
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
          return;
        } catch (err) {
          // 사용자 취소 시 클립보드로 fallback
        }
      }

      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 📄 PDF / 인쇄 기능
  const handlePrintPDF = () => {
    window.print();
  };

  // 동적 시간대 배정 (스팟 개수, 체류 시간, 도착 시간에 따라 아침/오후/밤까지 자연스러운 스케일링)
  const getTimeSlot = (idx, totalCount = 5, dayNum = 1) => {
    const customSlot = itineraryData?.dayTimeSlots?.[dayNum];
    let startHour = 9;
    let endHour = 18;

    if (customSlot) {
      const match = customSlot.match(/(\d{1,2}):\d{2}\s*~\s*(\d{1,2}):\d{2}/);
      if (match) {
        startHour = parseInt(match[1], 10);
        endHour = parseInt(match[2], 10);
      }
    } else if (Number(dayNum) === 1 && itineraryData?.arrivalTime) {
      const match = itineraryData.arrivalTime.match(/^(\d{1,2})/);
      if (match) {
        startHour = parseInt(match[1], 10);
        endHour = startHour >= 13 ? 21 : 18;
      }
    }

    if (totalCount <= 1) return `${String(startHour).padStart(2, '0')}:00`;

    // 스팟 수에 맞춰 startHour부터 endHour까지 균등 배분 (10분 단위 라운딩)
    const totalMinutes = Math.max(60, (endHour - startHour) * 60);
    const intervalMinutes = Math.floor(totalMinutes / Math.max(1, totalCount - 1));
    const currentMinutes = startHour * 60 + idx * intervalMinutes;
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const roundedMinute = Math.round(minute / 10) * 10;
    const finalHour = roundedMinute === 60 ? hour + 1 : hour;
    const finalMinute = roundedMinute === 60 ? 0 : roundedMinute;

    return `${String(finalHour).padStart(2, '0')}:${String(finalMinute).padStart(2, '0')}`;
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
      margin: isDesktop ? '0 auto' : '0 auto 4.5rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: isDesktop ? '0.45rem' : '0.85rem'
    }}>
      {/* 🚀 0. 잠재 고객 확보용 구글 로그인 스마트 넛지 (Nudge) 배너 (비로그인 사용자 전용) */}
      {!currentUser?.isGoogleLoggedIn && !isNudgeDismissed && onOpenGoogleAuth && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: isDesktop ? '14px' : '16px',
          padding: isDesktop ? '0.45rem 0.85rem' : '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {lang === 'en' ? 'Sync & Save with Google Account' : '구글 로그인하고 전 기기 평생 보관'}
              </div>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Get 15 daily AI prompts + automatic cloud sync' : '매일 AI 15회 무료 + PC-모바일 실시간 동기화'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={onOpenGoogleAuth}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              {lang === 'en' ? 'Sign in' : '1초 로그인'}
            </button>
            <button
              type="button"
              onClick={() => setIsNudgeDismissed(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="닫기"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 🌟 1. 상단 멀티 저장 여행 셀렉터 & 잔여 저장 횟수 뱃지 & 원터치 동기화 */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: isDesktop ? '16px' : '20px',
        padding: isDesktop ? '0.55rem 0.85rem' : '0.75rem 1rem',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: isDesktop ? '0.35rem' : '0.55rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bookmark size={14} style={{ color: '#2563eb' }} />
              <span>{lang === 'en' ? `Saved Trips (${savedTrips.length})` : lang === 'ja' ? `保存済みプラン (${savedTrips.length})` : (lang === 'zh' || lang === 'zht') ? `已保存行程 (${savedTrips.length})` : `내 저장 여행 (${savedTrips.length}개)`}</span>
            </div>

            {/* ⚡ 잔여 저장 횟수 상태 뱃지 */}
            <div
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
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              <Zap size={11} />
              <span>
                {remainingQuota > totalQuota
                  ? (lang === 'en' ? `Saves: ${remainingQuota} Left` : `잔여 저장: ${remainingQuota}회 (충전됨)`)
                  : (lang === 'en' ? `Saves: ${remainingQuota}/${totalQuota}` : `잔여 저장: ${remainingQuota}/${totalQuota}회`)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* 🔄 원터치 클라우드 동기화 버튼 */}
            <button
              type="button"
              onClick={handleTriggerSync}
              title="클라우드 최신 일정 동기화"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'none',
                border: 'none',
                color: isSyncing ? '#2563eb' : 'var(--text-muted)',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCw size={13} style={{ transform: isSyncing ? 'rotate(360deg)' : 'none', transition: isSyncing ? 'transform 0.6s linear' : 'none' }} />
              <span>{syncFeedback || (lang === 'en' ? 'Sync' : '동기화')}</span>
            </button>

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
                  onClick={() => setIsQrModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    borderRadius: '8px',
                    padding: '0.32rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.12)'
                  }}
                  title={lang === 'en' ? 'Open on Mobile with QR' : '스마트폰으로 1초 만에 보기'}
                >
                  <Smartphone size={13} />
                  <span>{lang === 'en' ? '📱 Mobile' : '📱 폰으로 보기'}</span>
                </button>

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
            const timeStr = getTimeSlot(idx, activeSpots.length, activeDay);
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

        {/* 5. Bottom Actions: [🗺️ 지도 보기/닫기 토글 (데스크톱)] vs [듀얼 액션 바 (모바일 유지)] */}
        <div className="no-print" style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: isDesktop ? 'block' : 'grid',
          gridTemplateColumns: isDesktop ? 'none' : '1fr 1fr',
          gap: '0.5rem'
        }}>
          {isDesktop ? (
            <button
              type="button"
              onClick={onGoToMap}
              style={{
                width: '100%',
                padding: '0.72rem 1rem',
                borderRadius: '12px',
                border: isMapOpen ? '1.5px solid #7c3aed' : '1.5px solid #2563eb',
                backgroundColor: isMapOpen ? 'rgba(124, 58, 237, 0.08)' : 'rgba(37, 99, 235, 0.06)',
                color: isMapOpen ? '#7c3aed' : '#2563eb',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
                boxShadow: isMapOpen ? '0 2px 8px rgba(124, 58, 237, 0.12)' : '0 2px 8px rgba(37, 99, 235, 0.08)'
              }}
            >
              <MapPin size={16} />
              <span>
                {isMapOpen
                  ? (lang === 'en' ? '🗺️ Close Map' : lang === 'ja' ? '🗺️ 地図を閉じる' : (lang === 'zh' || lang === 'zht') ? '🗺️ 关闭地图' : '🗺️ 지도 닫기')
                  : (lang === 'en' ? '🗺️ View on Map' : lang === 'ja' ? '🗺️ 地図で確認' : (lang === 'zh' || lang === 'zht') ? '🗺️ 在地图中查看' : '🗺️ 지도 보기')}
              </span>
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* 📱 Mobile 1-Sec Instant QR Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        trip={itineraryData}
        lang={lang}
      />
    </div>
  );
}
