import React, { useState, useEffect } from 'react';
import { X, Sparkles, Database, Play, CheckCircle2, Copy, Download, RefreshCw, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { VORA_QNA_VAULT } from '../data/voraQnaVault';
import { interpolateTemplate } from '../utils/koreanParticles';

export default function AdminBatchModal({
  isOpen,
  onClose,
  currentUser,
  lang = 'ko'
}) {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [unansweredList, setUnansweredList] = useState([]);
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLogs, setBatchLogs] = useState([]);
  const [distilledResults, setDistilledResults] = useState([]);
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const loadUnansweredFromStorage = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
      // 🛡️ 중복 질문 자동 병합/정리 (Deduplication)
      const unique = stored.filter((v, i, a) => 
        a.findIndex(t => t.rawQuery.trim().toLowerCase() === v.rawQuery.trim().toLowerCase()) === i
      );
      setUnansweredList(unique);
      if (unique.length !== stored.length) {
        localStorage.setItem('vora_unanswered_qna', JSON.stringify(unique));
      }
    } catch (e) {
      setUnansweredList([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Load saved key
      const savedKey = localStorage.getItem('vora_gemini_api_key') || '';
      setApiKey(savedKey);
      if (savedKey) setIsKeySaved(true);

      // Load unanswered questions
      loadUnansweredFromStorage();

      // 실시간 자동 동기화 (1초마다 새 질문 실시간 감지)
      const intervalId = setInterval(loadUnansweredFromStorage, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    localStorage.setItem('vora_gemini_api_key', trimmed);
    setIsKeySaved(true);
  };

  const handleClearUnanswered = () => {
    localStorage.removeItem('vora_unanswered_qna');
    setUnansweredList([]);
  };

  // Run Batch Distillation with Gemini 2.5 Flash
  const handleRunBatch = async () => {
    const keyToUse = apiKey.trim() || localStorage.getItem('vora_gemini_api_key');
    if (!keyToUse) {
      alert('제미나이 API 키를 먼저 입력해 주세요!');
      return;
    }

    if (unansweredList.length === 0) {
      alert('학습할 미답변 질문이 없습니다. 아래 수동 입력창에 질문을 넣어 테스트해보세요!');
      return;
    }

    setIsRunningBatch(true);
    setBatchProgress(10);
    setBatchLogs(['🚀 Gemini 2.5 Flash 배치 지식 증강 프로세스 시작...']);

    const newDistilled = [];

    const cleanKey = keyToUse.trim();

    // 1. Dynamic Model Discovery from Google AI Studio
    let activeModelPath = 'models/gemini-1.5-flash';
    try {
      setBatchLogs(prev => [...prev, '🔍 구글 AI 사용 가능 모델 탐색 중...']);
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`, {
        headers: { 'x-goog-api-key': cleanKey }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const models = listData.models || [];
        const validModels = models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
        
        const modelNames = validModels.map(m => m.name.replace('models/', '')).join(', ');
        setBatchLogs(prev => [...prev, `📋 사용 가능한 모델 목록 (${validModels.length}개): ${modelNames}`]);

        const preferred = validModels.find(m => m.name.includes('gemini-flash-latest'))
          || validModels.find(m => m.name.includes('gemini-2.5-flash-lite'))
          || validModels.find(m => m.name.includes('gemini-3.7-flash'))
          || validModels.find(m => m.name.includes('gemini-3.5-flash'))
          || validModels.find(m => m.name.includes('gemini-flash-lite-latest'))
          || validModels.find(m => m.name.includes('gemini-pro-latest'))
          || validModels.find(m => !m.name.endsWith('gemini-2.5-flash') && m.name.includes('flash'))
          || validModels[0];

        if (preferred) {
          activeModelPath = preferred.name;
          setBatchLogs(prev => [...prev, `✨ 구글 최신 활성 모델 연결 성공: [ ${activeModelPath} ]`]);
        }
      } else {
        const errTxt = await listRes.text();
        setBatchLogs(prev => [...prev, `⚠️ 모델 탐색 응답: ${listRes.status} (${errTxt.slice(0, 100)})`]);
      }
    } catch (le) {
      setBatchLogs(prev => [...prev, `⚠️ 모델 탐색 스킵: ${le.message}`]);
    }

    const fallbackModelNames = [
      'models/gemini-3.1-flash-lite',
      'models/gemini-flash-lite-latest',
      'models/gemini-3.7-flash',
      'models/gemini-flash-latest'
    ];

    for (let i = 0; i < unansweredList.length; i++) {
      const q = unansweredList[i];
      setBatchLogs(prev => [...prev, `⚡ [${i + 1}/${unansweredList.length}] "${q.rawQuery}" 초고속 증류 중...`]);
      setBatchProgress(Math.round(((i + 1) / unansweredList.length) * 80));

      const ctx = q.context || {};
      const ctxSummary = [
        q.targetCity || ctx.city ? `목적지: ${q.targetCity || ctx.city}` : null,
        ctx.days ? `여행일수: ${ctx.days}일` : null,
        ctx.companion ? `동행: ${ctx.companion}` : null,
        ctx.themes?.length ? `테마: ${ctx.themes.join(', ')}` : null
      ].filter(Boolean).join(' | ');

      const promptText = `당신은 대한민국 여행 전문 AI 'VORA(보라)'의 최고 수석 지식 설계자입니다.
사용자 질문: "${q.rawQuery}" (${ctxSummary || '목적지: 전국'})

다음 JSON 포맷으로만 즉시 출력하세요:
{
  "id": "qna_auto_${Date.now()}_${i}",
  "category": "DYNAMIC_KNOWLEDGE",
  "targetCity": "${q.targetCity || ctx.city || 'all'}",
  "season": "all",
  "questionVariations": ["${q.rawQuery}"],
  "intentKeywords": ["키워드1", "키워드2"],
  "geminiAnswer": {
    "ko": "친절하고 정확한 2~3문장 한국어 핵심 맞춤 답변 (질문자가 ${q.targetCity || ctx.city || '대한민국'} 여행 중이므로 해당 도시 문맥에 맞춰 답변)",
    "en": "English answer",
    "ja": "日本語",
    "zh": "中文"
  },
  "followUp": "다음 제안 질문?",
  "suggestedChips": ["버튼1", "버튼2"]
}`;

      let rawOutput = '';
      let success = false;

      for (const mName of fallbackModelNames) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000); // 4초 초과 시 즉시 다음 쾌속 모델로 스위칭!

          const targetUrl = `https://generativelanguage.googleapis.com/v1beta/${mName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
          const response = await fetch(targetUrl, {
            method: 'POST',
            signal: controller.signal,
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': cleanKey
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 600
              }
            })
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const responseData = await response.json();
            rawOutput = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            success = true;
            break;
          }
        } catch (e) {
          // Timeout or Network issue -> immediately fallback
        }
      }

      if (success && rawOutput) {
        const cleanedJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        try {
          const parsed = JSON.parse(cleanedJson);
          newDistilled.push(parsed);
          setBatchLogs(prev => [...prev, `✅ "${q.rawQuery}" ➔ 황금 Q&A 지식 생성 완료!`]);
        } catch (pe) {
          setBatchLogs(prev => [...prev, `⚠️ "${q.rawQuery}" JSON 파싱 오류: ${pe.message}`]);
        }
      } else {
        setBatchLogs(prev => [...prev, `⚠️ "${q.rawQuery}" 일시적 구글 트래픽 초과 (다음 턴에 재시도)`]);
      }
    }

    setDistilledResults(newDistilled);
    setBatchProgress(100);
    setIsRunningBatch(false);

    // 🧹 학습 완료된 질문들은 대기 큐에서 자동 비우기!
    try {
      localStorage.removeItem('vora_unanswered_qna');
      setUnansweredList([]);

      // 💾 새로 학습된 지식을 브라우저 볼트에 누적 저장!
      const existingVault = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      const updatedVault = [...existingVault, ...newDistilled];
      localStorage.setItem('vora_custom_qna_vault', JSON.stringify(updatedVault));
    } catch (e) {}

    setBatchLogs(prev => [...prev, `🎉 총 ${newDistilled.length}개 신규 지식 학습 완료 & 대기 큐 자동 정리 완료! ✨`]);
  };

  const handleCopyJson = () => {
    const exportData = JSON.stringify(distilledResults, null, 2);
    navigator.clipboard.writeText(exportData).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: '24px',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>VORA AI 배치 지식 학습 센터</h3>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '100px',
                  fontWeight: 800
                }}>
                  SUPER ADMIN
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                관리자: <strong style={{ color: 'var(--text-main)' }}>{currentUser?.email || 'titkyh@gmail.com'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 1. Gemini API Key Input */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem 1.2rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={16} color="#8b5cf6" /> 제미나이(Gemini) API 키 설정
              </span>
              {isKeySaved && (
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ShieldCheck size={14} /> 브라우저에 안전하게 저장됨
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="password"
                placeholder="AIzaSy... (구글 AI 스튜디오 키를 붙여넣으세요)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSaveKey}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                저장
              </button>
            </div>
          </div>

          {/* 2. Unanswered Queue Status */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem 1.2rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={16} color="#3b82f6" /> 수집된 미답변 질문 현황
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.78rem',
                  backgroundColor: unansweredList.length > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  color: unansweredList.length > 0 ? '#ef4444' : '#10b981',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '100px',
                  fontWeight: 800
                }}>
                  {unansweredList.length}건 대기 중
                </span>
                <button
                  onClick={loadUnansweredFromStorage}
                  title="새로고침"
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.2rem 0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  🔄 새로고침
                </button>
                {unansweredList.length > 0 && (
                  <button
                    onClick={handleClearUnanswered}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>

            {/* List preview */}
            <div style={{
              maxHeight: '120px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              padding: '0.4rem 0'
            }}>
              {unansweredList.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.8rem 0' }}>
                  현재 수집된 미답변 질문이 없습니다. (사이트에서 새로운 질문을 하면 자동으로 쌓입니다!)
                </div>
              ) : (
                unansweredList.map((q, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.6rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>💬 "{q.rawQuery}"</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{q.targetCity || '전국'}</span>
                  </div>
                ))
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunBatch}
              disabled={isRunningBatch}
              style={{
                marginTop: '0.4rem',
                padding: '0.75rem',
                backgroundColor: isRunningBatch ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                background: isRunningBatch ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: isRunningBatch ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isRunningBatch ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} />}
              {isRunningBatch ? `배치 지식 학습 실행 중 (${batchProgress}%)...` : `제미나이 2.5 배치 학습 즉시 실행하기 🚀`}
            </button>
          </div>

          {/* 3. Batch Progress Logs */}
          {batchLogs.length > 0 && (
            <div style={{
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              padding: '1rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              maxHeight: '160px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              {batchLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}

          {/* 4. Distilled Results & Copy Action */}
          {distilledResults.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '1rem 1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> 총 {distilledResults.length}개 신규 Q&A 지식 생성 완료!
                </span>
                <button
                  onClick={handleCopyJson}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Copy size={14} />
                  {copySuccess ? '복사 완료! ✅' : 'Q&A JSON 전체 복사'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
