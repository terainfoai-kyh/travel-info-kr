import React, { useState } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword, isCasualChatQuery, isGreetingQuery } from '../services/geminiNlpService';
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 my-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Vora AI 독립형 테스트 워크벤치 <span className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full font-semibold border border-purple-500/30">Developer Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              자연어 파싱, 1차 방어 가드, 지도용 위도/경도 기초 데이터 정합성을 직접 검증합니다.
            </p>
          </div>
        </div>

        {/* Developer Bypass Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
          <span className="text-xs font-semibold text-slate-300">
            선배님 전용 무제한 치트키:
          </span>
          <button
            onClick={() => toggleDevBypass()}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDevBypass 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isDevBypass ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {isDevBypass ? '무제한 모드 ON (99,999회)' : '일일 5회 제한 모드'}
          </button>
        </div>
      </div>

      {/* Grid 2 Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Panel: Test Prompt & Controls */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              💬 [1] 자연어 프롬프트 & STT 음성 테스트
            </h3>
            <span className="text-xs text-slate-400">
              남은 티켓: <strong className="text-emerald-400 font-mono text-sm">{isDevBypass ? '무제한' : `${remainingQuota}회`}</strong>
            </span>
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="자연어 질문을 입력하세요 (예: 거제도 2박3일 오션뷰 카페 코스 짜줘)"
              className="w-full p-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
            
            {/* Voice STT Button */}
            <button
              onClick={handleStartVoiceSTT}
              className={`absolute bottom-3 right-3 p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="다국어 음성 인식 테스트"
            >
              <Mic className="w-4 h-4" />
              {isListening ? '듣는 중...' : '음성 입력'}
            </button>
          </div>

          {/* Action Run Button */}
          <button
            onClick={handleRunPipeline}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-5-0 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            {isLoading ? 'AI 분석 & 기초 데이터 파싱 중...' : '🚀 AI 파이프라인 실행 및 기초 데이터 추출'}
          </button>

          {/* Guard Check Status Notice */}
          {guardStatus && (
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              guardStatus.isValid 
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}>
              {guardStatus.isValid ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
              <div>
                <strong>[1차 로컬 방어 가드 결과]:</strong> {guardStatus.isValid ? '정상 승인 (Pass)' : guardStatus.message}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Map Geo-Coordinates & Raw Data Inspector */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            📊 [2] 기초 데이터 & 지도 좌표 정합성 검증
          </h3>

          {parsedMeta ? (
            <div className="space-y-4">
              
              {/* Metadata Card */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">추출 타겟 지역</span>
                  <strong className="text-purple-400 text-sm font-bold">{parsedMeta.targetCity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">여행 기간</span>
                  <strong className="text-blue-400 text-sm font-bold">{parsedMeta.days}일 코스</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">추출 테마</span>
                  <strong className="text-emerald-400 text-sm font-bold">{parsedMeta.theme}</strong>
                </div>
              </div>

              {/* Map Geo-Coordinates Table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>🗺️ 지도 렌더링용 기초 명소 좌표 데이터 ({fetchedSpots.length}건)</span>
                  <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">TourAPI 4.0 정품</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">명소 이름</th>
                        <th className="p-2.5">위도 (lat)</th>
                        <th className="p-2.5">경도 (lng)</th>
                        <th className="p-2.5">대표 주소</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {fetchedSpots.length > 0 ? (
                        fetchedSpots.map((spot, idx) => (
                          <tr key={spot.id || idx} className="hover:bg-slate-900/50">
                            <td className="p-2.5 font-medium text-white">{spot.title}</td>
                            <td className="p-2.5 font-mono text-purple-300">{spot.lat || spot.mapy || '37.5665'}</td>
                            <td className="p-2.5 font-mono text-blue-300">{spot.lng || spot.mapx || '126.9780'}</td>
                            <td className="p-2.5 text-slate-400 truncate max-w-[140px]">{spot.location || spot.addr1 || '중심가'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500">
                            수신된 명소 데이터가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Affiliate Partner URLs Preview */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <span className="text-slate-400 font-semibold block text-[11px]">🛍️ 제휴 파트너 URL 자동 생성 뷰:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={parsedMeta.agodaUrl} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 rounded-lg border border-blue-800/60 flex items-center gap-1">
                    🏨 아고다 {parsedMeta.targetCity} 숙소 <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href={parsedMeta.klookUrl} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 rounded-lg border border-orange-800/60 flex items-center gap-1">
                    🎟️ 클룩 {parsedMeta.targetCity} 액티비티 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              왼쪽 대화 입력창에서 [🚀 AI 파이프라인 실행] 버튼을 누르시면 기초 데이터 및 위도/경도 좌표가 이곳에 표시됩니다.
            </div>
          )}

          {/* Raw JSON Debugger */}
          {rawJson && (
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> Raw JSON 파싱 구조체 디버그 보기
              </summary>
              <pre className="mt-2 p-3 bg-black/60 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </details>
          )}

        </div>

      </div>

    </div>
  );
}
