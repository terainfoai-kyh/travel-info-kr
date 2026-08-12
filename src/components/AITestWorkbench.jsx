import React, { useState } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword } from '../services/geminiNlpService';
import { fetchTourSpots } from '../services/tourApi';
import { getAgodaHotelSearchUrl, getKlookActivitySearchUrl } from '../services/affiliateService';

export default function AITestWorkbench({ lang = 'ko' }) {
  const { usedCount, remainingQuota, canProceed, isDevBypass, toggleDevBypass, incrementQuota } = useQuotaLimit(5);
  
  const [prompt, setPrompt] = useState('거제도 2박3일 오션뷰 감성 카페 맛집 코스 짜줘');
  const [isLoading, setIsLoading] = useState(false);
  const [guardStatus, setGuardStatus] = useState(null);
  
  // Parsed Output Results State
  const [parsedMeta, setParsedMeta] = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [fetchedSpots, setFetchedSpots] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // STT Voice Test
  const handleStartVoiceSTT = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식(STT)을 지원하지 않습니다.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : (lang === 'ja' ? 'ja-JP' : (lang === 'zh' ? 'zh-CN' : 'ko-KR'));
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
      };
      recognition.start();
    } catch (e) {
      console.warn('STT Error:', e);
      setIsListening(false);
    }
  };

  // Run AI Test Pipeline
  const handleRunPipeline = async () => {
    setIsLoading(true);
    setGuardStatus(null);

    // 1. 1차 로컬 입력 방어 검증 (useInputGuard)
    const guardCheck = validateTravelQuery(prompt, lang);
    setGuardStatus(guardCheck);

    if (!guardCheck.isValid) {
      setIsLoading(false);
      return;
    }

    // 2. 일일 횟수 차감 (개발자 모드 시 차감 무제한 패스)
    if (!canProceed) {
      alert('일일 무료 AI 제공 횟수(5회)가 소진되었습니다. 개발자 무제한 모드를 켜주세요!');
      setIsLoading(false);
      return;
    }
    incrementQuota();

    // 3. AI 파싱 & 기초 지형/명소 데이터 추출
    const targetCity = extractLocationKeyword(prompt);
    let extractedDays = 3;
    if (/(1일|1박|당일)/i.test(prompt)) extractedDays = 1;
    if (/(2일|2박)/i.test(prompt)) extractedDays = 2;
    if (/(4일|4박)/i.test(prompt)) extractedDays = 4;

    const meta = {
      targetCity,
      days: extractedDays,
      theme: prompt.includes('맛집') ? '미식' : (prompt.includes('카페') ? '카페/힐링' : '자연/관광'),
      timestamp: new Date().toLocaleTimeString(),
      agodaUrl: getAgodaHotelSearchUrl(targetCity),
      klookUrl: getKlookActivitySearchUrl(targetCity)
    };
    setParsedMeta(meta);

    // 4. 한국관광공사 TourAPI 4.0 정품 데이터 수신 테스트
    try {
      const apiSpots = await fetchTourSpots({ region: targetCity, lang });
      setFetchedSpots(apiSpots.slice(0, 5));
      setRawJson({
        inputPrompt: prompt,
        guardCheck,
        extractedMeta: meta,
        tourApiSpotCount: apiSpots.length,
        sampleSpots: apiSpots.slice(0, 3)
      });
    } catch (err) {
      console.warn('TourAPI fetch error:', err);
      setFetchedSpots([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      borderRadius: '24px',
      padding: '1.5rem',
      margin: '1.5rem 0',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.6rem',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            borderRadius: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Vora AI 독립형 테스트 워크벤치
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', borderRadius: '9999px', border: '1px solid rgba(168, 85, 247, 0.4)', fontWeight: 600 }}>
                Developer Sandbox
              </span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              자연어 파싱, 1차 방어 가드, 지도용 위도/경도 기초 데이터 정합성을 직접 검증합니다.
            </p>
          </div>
        </div>

        {/* Developer Bypass Toggle Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: '#1e293b',
          padding: '0.5rem 1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>
            선배님 전용 무제한 치트키:
          </span>
          <button
            onClick={() => toggleDevBypass()}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              backgroundColor: isDevBypass ? '#10b981' : 'rgba(244, 63, 94, 0.2)',
              color: isDevBypass ? '#022c22' : '#fca5a5',
              boxShadow: isDevBypass ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {isDevBypass ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            {isDevBypass ? '무제한 모드 ON (99,999회)' : '일일 5회 제한 모드'}
          </button>
        </div>
      </div>

      {/* Grid 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Panel: Test Prompt & Controls */}
        <div style={{
          backgroundColor: '#020617',
          padding: '1.25rem',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
              💬 [1] 자연어 프롬프트 & STT 음성 테스트
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              남은 티켓: <strong style={{ color: '#34d399', fontFamily: 'monospace' }}>{isDevBypass ? '무제한' : `${remainingQuota}회`}</strong>
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="자연어 질문을 입력하세요 (예: 거제도 2박3일 오션뷰 카페 코스 짜줘)"
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '14px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            {/* Voice STT Button */}
            <button
              onClick={handleStartVoiceSTT}
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                right: '0.75rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: isListening ? '#ef4444' : '#1e293b',
                color: '#ffffff'
              }}
            >
              <Mic size={14} />
              {isListening ? '듣는 중...' : '음성 입력'}
            </button>
          </div>

          {/* Action Run Button */}
          <button
            onClick={handleRunPipeline}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: '14px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} fill="#ffffff" />}
            {isLoading ? 'AI 분석 & 기초 데이터 파싱 중...' : '🚀 AI 파이프라인 실행 및 기초 데이터 추출'}
          </button>

          {/* Guard Check Status Notice */}
          {guardStatus && (
            <div style={{
              padding: '0.85rem',
              borderRadius: '14px',
              fontSize: '0.75rem',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              backgroundColor: guardStatus.isValid ? 'rgba(6, 78, 59, 0.4)' : 'rgba(136, 19, 55, 0.4)',
              border: guardStatus.isValid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
              color: guardStatus.isValid ? '#6ee7b7' : '#fca5a5'
            }}>
              {guardStatus.isValid ? <CheckCircle2 size={16} style={{ color: '#34d399', shrink: 0 }} /> : <ShieldAlert size={16} style={{ color: '#f87171', shrink: 0 }} />}
              <div>
                <strong>[1차 로컬 방어 가드 결과]:</strong> {guardStatus.isValid ? '정상 승인 (Pass)' : guardStatus.message}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Map Geo-Coordinates & Raw Data Inspector */}
        <div style={{
          backgroundColor: '#020617',
          padding: '1.25rem',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
            📊 [2] 기초 데이터 & 지도 좌표 정합성 검증
          </h3>

          {parsedMeta ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Metadata Card */}
              <div style={{
                padding: '0.85rem',
                backgroundColor: '#0f172a',
                borderRadius: '14px',
                border: '1px solid #1e293b',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>추출 타겟 지역</span>
                  <strong style={{ color: '#c084fc', fontSize: '0.9rem', fontWeight: 700 }}>{parsedMeta.targetCity}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>여행 기간</span>
                  <strong style={{ color: '#60a5fa', fontSize: '0.9rem', fontWeight: 700 }}>{parsedMeta.days}일 코스</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>추출 테마</span>
                  <strong style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 700 }}>{parsedMeta.theme}</strong>
                </div>
              </div>

              {/* Map Geo-Coordinates Table */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>🗺️ 지도 렌더링용 기초 명소 좌표 데이터 ({fetchedSpots.length}건)</span>
                  <span style={{ fontSize: '0.65rem', color: '#c084fc', backgroundColor: 'rgba(168, 85, 247, 0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>TourAPI 4.0 정품</span>
                </div>

                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1e293b' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <thead style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                      <tr>
                        <th style={{ padding: '0.6rem 0.75rem' }}>명소 이름</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>위도 (lat)</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>경도 (lng)</th>
                        <th style={{ padding: '0.6rem 0.75rem' }}>대표 주소</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchedSpots.length > 0 ? (
                        fetchedSpots.map((spot, idx) => (
                          <tr key={spot.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>{spot.title}</td>
                            <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: '#d8b4fe' }}>{spot.lat || spot.mapy || '37.5665'}</td>
                            <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: '#93c5fd' }}>{spot.lng || spot.mapx || '126.9780'}</td>
                            <td style={{ padding: '0.6rem 0.75rem', color: '#94a3b8', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spot.location || spot.addr1 || '중심가'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                            수신된 명소 데이터가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Affiliate Partner URLs Preview */}
              <div style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '0.75rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem', fontSize: '0.7rem' }}>🛍️ 제휴 파트너 URL 자동 생성 뷰:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <a href={parsedMeta.agodaUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(30, 58, 138, 0.4)', color: '#93c5fd', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', textDecoration: 'none', display: 'flex', items: 'center', gap: '0.3rem' }}>
                    🏨 아고다 {parsedMeta.targetCity} 숙소 <ExternalLink size={12} />
                  </a>
                  <a href={parsedMeta.klookUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(124, 45, 18, 0.4)', color: '#fdba74', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.3)', textDecoration: 'none', display: 'flex', items: 'center', gap: '0.3rem' }}>
                    🎟️ 클룩 {parsedMeta.targetCity} 액티비티 <ExternalLink size={12} />
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', border: '1px dashed #1e293b', borderRadius: '14px' }}>
              왼쪽 대화 입력창에서 [🚀 AI 파이프라인 실행] 버튼을 누르시면 기초 데이터 및 위도/경도 좌표가 이곳에 표시됩니다.
            </div>
          )}

          {/* Raw JSON Debugger */}
          {rawJson && (
            <details style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              <summary style={{ cursor: 'pointer', color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Code size={14} /> Raw JSON 파싱 구조체 디버그 보기
              </summary>
              <pre style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#000000', borderRadius: '12px', color: '#34d399', fontSize: '0.7rem', fontFamily: 'monospace', overflowX: 'auto', maxHeight: '180px', border: '1px solid #1e293b' }}>
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </details>
          )}

        </div>

      </div>

    </div>
  );
}
