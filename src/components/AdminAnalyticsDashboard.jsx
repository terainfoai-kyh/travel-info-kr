import React, { useState, useEffect } from 'react';
import { BarChart3, Users, MessageSquare, Video, ShieldCheck, Coins, DollarSign, Calendar, TrendingUp, RefreshCw, Sparkles, Cpu, Eye, Lock, Zap } from 'lucide-react';
import { loadAnalyticsData, getTodayStats } from '../services/analyticsService';

export default function AdminAnalyticsDashboard() {
  const [stats, setStats] = useState(getTodayStats());
  const [allHistory, setAllHistory] = useState(loadAnalyticsData());
  const [selectedDate, setSelectedDate] = useState(stats.date);

  const refreshData = () => {
    const freshData = loadAnalyticsData();
    setAllHistory(freshData);
    setStats(freshData[selectedDate] || getTodayStats());
  };

  useEffect(() => {
    refreshData();
  }, [selectedDate]);

  const activeStats = allHistory[selectedDate] || stats;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      borderRadius: '24px',
      padding: '1.5rem',
      margin: '1.5rem 0',
      border: '1px solid #334155',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      fontFamily: 'var(--font-family)'
    }}>
      {/* HEADER BAR */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid #1e293b',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#9333ea', color: '#ffffff', borderRadius: '12px', display: 'flex' }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                👑 선배님 전용 실시간 통계 & 토큰 비용 관리자 대시보드
              </h2>
              <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', backgroundColor: '#059669', color: '#ecfdf5', borderRadius: '6px', fontWeight: 700 }}>
                PRIVATE ADMIN
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              일일 방문자, AI 대화, 광고 시청, 구글 로그인, 토큰 소비량 및 실시간 추정 API 비용(￦) 통합 분석
            </span>
          </div>
        </div>

        {/* Date Selector & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid #334155', fontSize: '0.78rem' }}>
            <Calendar size={15} style={{ color: '#38bdf8' }} />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ backgroundColor: 'transparent', color: '#f8fafc', border: 'none', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              {Object.keys(allHistory).map(dKey => (
                <option key={dKey} value={dKey} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  📅 {dKey} {dKey === stats.date && '(오늘)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={refreshData}
            style={{
              padding: '0.4rem 0.75rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <RefreshCw size={13} />
            새로고침
          </button>
        </div>
      </div>

      {/* 📊 7대 핵심 KPI CARDS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1: 일일 방문자 수 */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>👥 일일 방문자 (DAU)</span>
            <Users size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
            {activeStats.visitorsCount.toLocaleString()} 명
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>유니크 세션 기준</span>
        </div>

        {/* KPI 2: AI 대화 건수 */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>💬 총 AI 대화 건수</span>
            <MessageSquare size={18} style={{ color: '#c084fc' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>
            {activeStats.chatsCount.toLocaleString()} 회
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>1:1 추천 생성 횟수</span>
        </div>

        {/* KPI 3: 동영상 광고 시청 수 */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>🎬 15초 광고 시청 수</span>
            <Video size={18} style={{ color: '#4ade80' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>
            {activeStats.videoAdsWatchedCount.toLocaleString()} 회
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>쿼터 충전 광고 보상</span>
        </div>

        {/* KPI 4: 구글 로그인 vs 비회원 */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>🔑 구글 로그인 유저</span>
            <ShieldCheck size={18} style={{ color: '#fb923c' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb923c' }}>
            {activeStats.googleLoginsCount.toLocaleString()} 명
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>비회원: {activeStats.guestUsersCount}명</span>
        </div>

        {/* KPI 5: 사용 토큰량 */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>🎟️ 총 소비 토큰량</span>
            <Coins size={18} style={{ color: '#facc15' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>
            {(activeStats.totalInputTokens + activeStats.totalOutputTokens).toLocaleString()} 토큰
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>입력: {activeStats.totalInputTokens} / 출력: {activeStats.totalOutputTokens}</span>
        </div>

        {/* KPI 6: 일자별 추정 API 비용 (￦ KRW) */}
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>💵 일자별 추정 비용</span>
            <DollarSign size={18} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
            ￦ {activeStats.estimatedCostKRW.toLocaleString()} 원
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>(${activeStats.estimatedCostUSD} USD / Gemini Flash 단가 기준)</span>
        </div>
      </div>

      {/* FOOTER AUDIT SUMMARY */}
      <div style={{
        padding: '0.85rem 1rem',
        backgroundColor: '#1e293b',
        borderRadius: '14px',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={15} style={{ color: '#a855f7' }} />
          <span>구글 Gemini API 일일 무료 쿼터: <strong>1,500회/일</strong> (현재 사용률: <strong>{Math.round((activeStats.chatsCount / 1500) * 100)}%</strong>)</span>
        </div>

        <span style={{ color: '#34d399', fontWeight: 700 }}>
          STATUS: ACTIVE & MONITORED
        </span>
      </div>

    </div>
  );
}
