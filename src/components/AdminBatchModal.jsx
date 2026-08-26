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

  useEffect(() => {
    if (isOpen) {
      // Load saved key
      const savedKey = localStorage.getItem('vora_gemini_api_key') || '';
      setApiKey(savedKey);
      if (savedKey) setIsKeySaved(true);

      // Load unanswered questions from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
        setUnansweredList(stored);
      } catch (e) {
        setUnansweredList([]);
      }
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

    for (let i = 0; i < unansweredList.length; i++) {
      const q = unansweredList[i];
      setBatchLogs(prev => [...prev, `⏳ [${i + 1}/${unansweredList.length}] "${q.rawQuery}" 지식 증류 중...`]);
      setBatchProgress(Math.round(((i + 1) / unansweredList.length) * 80));

      const promptText = `당신은 대한민국 여행 전문 AI 'VORA(보라)'의 최고 수석 지식 설계자입니다.
사용자가 방금 질문한 여행 질의: "${q.rawQuery}" (목적지: ${q.targetCity || '전국'})

다음 요구사항에 맞춰 100% 완벽한 JSON 포맷으로만 응답해 주세요:
1. questionVariations: 원본 질문 및 모바일에서 발생할 수 있는 오타/자모탈락/줄임말/변형 5개 이상 (예: 거재도, 부싼, 맛짚, 일쩡 등)
2. intentKeywords: 핵심 키워드 4개 이상
3. geminiAnswer: 한국어(ko), 영어(en), 일본어(ja), 중국어(zh) 정품 답변 (친절하고 신뢰도 높은 어조, 2~3문장 이내)
4. followUp: 다음 단계 제안 문구
5. suggestedChips: 사용자가 누를 수 있는 3~4개의 퀵 버튼 라벨

JSON 형식 예시:
{
  "id": "qna_auto_${Date.now()}_${i}",
  "category": "DYNAMIC_KNOWLEDGE",
  "targetCity": "${q.targetCity || 'all'}",
  "season": "all",
  "questionVariations": ["${q.rawQuery}"],
  "intentKeywords": ["키워드1", "키워드2"],
  "geminiAnswer": {
    "ko": "한국어 답변",
    "en": "English answer",
    "ja": "日本語",
    "zh": "中文"
  },
  "followUp": "다음 제안 질문?",
  "suggestedChips": ["버튼1", "버튼2"]
}`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          newDistilled.push(parsed);
          setBatchLogs(prev => [...prev, `✅ "${q.rawQuery}" ➔ 황금 Q&A 생성 완료!`]);
        }
      } catch (err) {
        setBatchLogs(prev => [...prev, `❌ "${q.rawQuery}" 생성 오류: ${err.message}`]);
      }
    }

    setDistilledResults(newDistilled);
    setBatchProgress(100);
    setIsRunningBatch(false);
    setBatchLogs(prev => [...prev, `🎉 총 ${newDistilled.length}개 신규 지식 학습이 완료되었습니다!`]);
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
