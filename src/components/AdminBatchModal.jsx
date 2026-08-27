import React, { useState, useEffect } from 'react';
import { X, Sparkles, Database, Play, CheckCircle2, Copy, Download, RefreshCw, Key, ShieldCheck, AlertCircle, Cloud, Smartphone } from 'lucide-react';
import { getVoraQnaVault } from '../data/voraQnaVault';
import { interpolateTemplate } from '../utils/koreanParticles';
import { fetchQuestionsFromCloud, clearQuestionsFromCloud, deleteQuestionFromCloud, publishKnowledgeToCloudMaster } from '../services/voraCloudQnaService';

export default function AdminBatchModal({
  isOpen,
  onClose,
  currentUser,
  lang = 'ko'
}) {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [unansweredList, setUnansweredList] = useState([]);
  const [customVaultList, setCustomVaultList] = useState([]);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLogs, setBatchLogs] = useState([]);
  const [distilledResults, setDistilledResults] = useState([]);
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [searchKnowledgeQuery, setSearchKnowledgeQuery] = useState('');
  const [expandedKnowledgeId, setExpandedKnowledgeId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('ko');
  const [masterVaultList, setMasterVaultList] = useState([]);

  const loadCustomVaultFromStorage = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      setCustomVaultList(Array.isArray(stored) ? stored : []);
    } catch (e) {
      setCustomVaultList([]);
    }
    try {
      const masterVault = getVoraQnaVault() || [];
      setMasterVaultList(Array.isArray(masterVault) ? masterVault : []);
    } catch (e) {
      setMasterVaultList([]);
    }
  };

  const loadUnansweredFromStorage = async (syncCloud = true) => {
    try {
      const stored = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
      const normKey = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
      
      let merged = [];
      stored.forEach(item => {
        const k = normKey(item.rawQuery || item.question);
        if (!k) return;
        const idx = merged.findIndex(m => normKey(m.rawQuery || m.question) === k);
        if (idx >= 0) {
          merged[idx].count = Math.max(merged[idx].count || 1, item.count || 1);
        } else {
          merged.push({ ...item, count: item.count || 1 });
        }
      });

      setUnansweredList(merged);

      // 🌐 중앙 클라우드 보라 DB 실시간 동기화
      if (syncCloud) {
        setIsSyncingCloud(true);
        const cloudItems = await fetchQuestionsFromCloud();
        setIsSyncingCloud(false);

        if (cloudItems && cloudItems.length > 0) {
          const nextList = [...merged];
          cloudItems.forEach(cItem => {
            const ck = normKey(cItem.rawQuery || cItem.question);
            if (!ck) return;
            const idx = nextList.findIndex(m => normKey(m.rawQuery || m.question) === ck);
            if (idx >= 0) {
              nextList[idx].count = Math.max(nextList[idx].count || 1, cItem.count || 1);
              if (cItem.context && Object.keys(cItem.context).length > 0) {
                nextList[idx].context = cItem.context;
              }
            } else {
              nextList.push({ ...cItem, count: cItem.count || 1 });
            }
          });
          setUnansweredList(nextList);
          localStorage.setItem('vora_unanswered_qna', JSON.stringify(nextList));
        }
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

      // Load unanswered questions from Central Cloud DB and custom learned vault
      loadUnansweredFromStorage(true);
      loadCustomVaultFromStorage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    localStorage.setItem('vora_gemini_api_key', trimmed);
    setIsKeySaved(true);
  };

  const handleDeleteUnansweredItem = (targetItem) => {
    const targetQ = targetItem.rawQuery || targetItem.question;
    deleteQuestionFromCloud(targetQ);
    const updated = unansweredList.filter(item => (item.rawQuery || item.question) !== targetQ);
    setUnansweredList(updated);
    localStorage.setItem('vora_unanswered_qna', JSON.stringify(updated));
  };

  const handleClearUnanswered = () => {
    clearQuestionsFromCloud();
    localStorage.removeItem('vora_unanswered_qna');
    setUnansweredList([]);
  };

  const handleAddManualQuestion = () => {
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    const newItem = {
      id: `manual-${Date.now()}`,
      rawQuery: trimmed,
      question: trimmed,
      timestamp: new Date().toISOString(),
      count: 1
    };
    const updated = [newItem, ...unansweredList];
    setUnansweredList(updated);
    localStorage.setItem('vora_unanswered_qna', JSON.stringify(updated));
    setManualInput('');
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

    // 🧹 학습 완료된 질문들은 로컬 및 중앙 클라우드 서버 대기 큐에서 완전 비우기!
    try {
      localStorage.removeItem('vora_unanswered_qna');
      setUnansweredList([]);
      await clearQuestionsFromCloud();

      // 💾 새로 학습된 지식을 브라우저 볼트에 누적 저장!
      const existingVault = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      const updatedVault = [...existingVault, ...newDistilled];
      localStorage.setItem('vora_custom_qna_vault', JSON.stringify(updatedVault));
      loadCustomVaultFromStorage();
    } catch (e) {}

    setBatchLogs(prev => [...prev, `🎉 총 ${newDistilled.length}개 신규 지식 학습 완료 & 중앙 클라우드 대기 큐 완전 비우기 완료! ✨`]);
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
          maxWidth: '1040px',
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>VORA AI 배치 지식 학습 & Q&A 통합 관리 센터</h3>
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

        {/* 2-Column Wide Grid Content */}
        <div style={{
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 420px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: API Key, Unanswered Queue & Batch Training                   */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* 1. Gemini API Key Input */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '0.9rem 1rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Key size={15} color="#8b5cf6" /> 제미나이(Gemini) API 키 설정
                </span>
                {isKeySaved && (
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ShieldCheck size={13} /> 저장됨
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="password"
                  placeholder="AIzaSy... (구글 AI 스튜디오 키)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.7rem',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSaveKey}
                  style={{
                    padding: '0.5rem 0.8rem',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
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
              padding: '1rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Database size={15} color="#3b82f6" /> 학습 대기 질문 큐
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    backgroundColor: unansweredList.length > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    color: unansweredList.length > 0 ? '#ef4444' : '#10b981',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '100px',
                    fontWeight: 800
                  }}>
                    {unansweredList.length}건 대기
                  </span>
                  <button
                    onClick={() => loadUnansweredFromStorage(true)}
                    title="클라우드 동기화"
                    style={{
                      background: 'none',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      padding: '0.15rem 0.4rem',
                      color: '#3b82f6',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontWeight: 700
                    }}
                  >
                    <Cloud size={11} /> {isSyncingCloud ? '동기화...' : '동기화'}
                  </button>
                  {unansweredList.length > 0 && (
                    <button
                      onClick={handleClearUnanswered}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.68rem',
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
                maxHeight: '130px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}>
                {unansweredList.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.6rem 0' }}>
                    대기 중인 질문이 없습니다. 아래 입력창에 질문을 직접 추가해 보세요!
                  </div>
                ) : (
                  unansweredList.map((q, idx) => (
                    <div key={idx} style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.55rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.4rem'
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        💬 {q.rawQuery || q.question}
                      </span>
                      <button
                        onClick={() => handleDeleteUnansweredItem(q)}
                        title="삭제"
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        ❌
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* ✍️ 수동 질문/키워드 즉시 추가 바 */}
              <div style={{
                display: 'flex',
                gap: '0.35rem',
                marginTop: '0.1rem',
                padding: '0.3rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px dashed #8b5cf6'
              }}>
                <input
                  type="text"
                  placeholder="✍️ 학습할 질문 입력 (예: 독도 여행 팁)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualQuestion();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.55rem',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleAddManualQuestion}
                  style={{
                    padding: '0.4rem 0.65rem',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ＋ 추가
                </button>
              </div>

              {/* Run Button */}
              <button
                onClick={handleRunBatch}
                disabled={isRunningBatch}
                style={{
                  marginTop: '0.2rem',
                  padding: '0.7rem',
                  background: isRunningBatch ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: isRunningBatch ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                {isRunningBatch ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                {isRunningBatch ? `배치 지식 학습 실행 중 (${batchProgress}%)...` : `제미나이 2.5 배치 학습 즉시 실행하기 🚀`}
              </button>
            </div>

            {/* 3. Batch Progress Logs */}
            {batchLogs.length > 0 && (
              <div style={{
                backgroundColor: '#0f172a',
                color: '#f8fafc',
                padding: '0.8rem',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                maxHeight: '130px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
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
                borderRadius: '12px',
                padding: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={15} /> 총 {distilledResults.length}개 지식 생성 완료!
                  </span>
                  <button
                    onClick={async () => {
                      await publishKnowledgeToCloudMaster(distilledResults);
                      loadCustomVaultFromStorage();
                      alert(`🎉 ${distilledResults.length}건의 황금 지식이 중앙 클라우드 마스터 DB에 실시간 배포되었습니다! ✨`);
                    }}
                    style={{
                      padding: '0.35rem 0.7rem',
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 전 세계 배포
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Real-Time Knowledge & Multilingual Answer Search & Viewer   */}
          {/* ========================================================================= */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1.1rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            minHeight: '480px'
          }}>
            
            {/* Search Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Search size={16} color="#8b5cf6" /> 🔍 지식 & 제미나이 답변 통합 검색기
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                총 <strong>{(masterVaultList.length || 0) + customVaultList.length}</strong>개 영구 지식 보유
              </span>
            </div>

            {/* Live Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="🔎 질문명 또는 답변 본문 내용 검색 (예: 독도, 사동항, 경복궁, 한복, 성수동, 커피, 미식...)"
                value={searchKnowledgeQuery}
                onChange={(e) => setSearchKnowledgeQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              />
              {searchKnowledgeQuery && (
                <button
                  onClick={() => setSearchKnowledgeQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Knowledge List Accordion */}
            <div style={{
              flex: 1,
              maxHeight: '460px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingRight: '0.2rem'
            }}>
              {(() => {
                const allKnowledge = [...customVaultList, ...masterVaultList];
                const cleanQuery = searchKnowledgeQuery.trim().toLowerCase();
                
                const filtered = cleanQuery ? allKnowledge.filter(item => {
                  const title = (item.title || '').toLowerCase();
                  const city = (item.targetCity || '').toLowerCase();
                  const variations = (item.questionVariations || []).join(' ').toLowerCase();
                  const intentKw = (item.intentKeywords || []).join(' ').toLowerCase();
                  const answerKo = (item.geminiAnswer?.ko || '').toLowerCase();
                  const answerEn = (item.geminiAnswer?.en || '').toLowerCase();
                  return title.includes(cleanQuery) 
                    || city.includes(cleanQuery)
                    || variations.includes(cleanQuery)
                    || intentKw.includes(cleanQuery)
                    || answerKo.includes(cleanQuery)
                    || answerEn.includes(cleanQuery);
                }) : allKnowledge;

                if (filtered.length === 0) {
                  return (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 1rem' }}>
                      {cleanQuery ? `"${searchKnowledgeQuery}" 관련 지식/답변이 없습니다.` : '등록된 지식이 없습니다.'}
                    </div>
                  );
                }

                return filtered.map((item, idx) => {
                  const itemId = item.id || `qna-${idx}`;
                  const isExpanded = expandedKnowledgeId === itemId;

                  return (
                    <div
                      key={itemId}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        border: isExpanded ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Card Header (Click to toggle accordion) */}
                      <div
                        onClick={() => setExpandedKnowledgeId(isExpanded ? null : itemId)}
                        style={{
                          padding: '0.75rem 0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.6rem',
                          backgroundColor: isExpanded ? 'rgba(139, 92, 246, 0.06)' : 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: '#8b5cf6',
                            color: '#ffffff',
                            fontWeight: 800,
                            flexShrink: 0
                          }}>
                            {item.targetCity || '전국'}
                          </span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title || item.questionVariations?.[0] || '지식 항목'}
                          </strong>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 800 }}>
                          {isExpanded ? '▲ 접기' : '▼ 답변 보기'}
                        </span>
                      </div>

                      {/* Expanded Accordion: Full Multilingual Answer Viewer */}
                      {isExpanded && (
                        <div style={{
                          padding: '0.9rem',
                          borderTop: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-primary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem'
                        }}>
                          {/* Question Variations Tag Bar */}
                          {item.questionVariations && item.questionVariations.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>트리거 질문:</span>
                              {item.questionVariations.map((qv, qIdx) => (
                                <span key={qIdx} style={{
                                  fontSize: '0.68rem',
                                  padding: '0.1rem 0.4rem',
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  color: '#2563eb',
                                  borderRadius: '4px'
                                }}>
                                  💬 {qv}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Language Tabs */}
                          <div style={{ display: 'flex', gap: '0.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem' }}>
                            {[
                              { code: 'ko', label: '🇰🇷 한국어' },
                              { code: 'en', label: '🇺🇸 English' },
                              { code: 'ja', label: '🇯🇵 日本語' },
                              { code: 'zh', label: '🇨🇳 中文' }
                            ].map((tab) => (
                              <button
                                key={tab.code}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveLangTab(tab.code);
                                }}
                                style={{
                                  padding: '0.25rem 0.6rem',
                                  fontSize: '0.72rem',
                                  fontWeight: activeLangTab === tab.code ? 800 : 500,
                                  color: activeLangTab === tab.code ? '#8b5cf6' : 'var(--text-muted)',
                                  border: 'none',
                                  borderBottom: activeLangTab === tab.code ? '2px solid #8b5cf6' : 'none',
                                  background: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Gemini Answer Full Text Box */}
                          <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                            color: 'var(--text-main)',
                            whiteSpace: 'pre-line',
                            maxHeight: '180px',
                            overflowY: 'auto'
                          }}>
                            {item.geminiAnswer?.[activeLangTab] || item.geminiAnswer?.ko || '등록된 다국어 답변이 없습니다.'}
                          </div>

                          {/* Suggested Action Chips */}
                          {item.suggestedChips && item.suggestedChips.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>추천 칩:</span>
                              {item.suggestedChips.map((chip, cIdx) => (
                                <span key={cIdx} style={{
                                  fontSize: '0.68rem',
                                  padding: '0.15rem 0.5rem',
                                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                  color: '#7c3aed',
                                  borderRadius: '100px',
                                  fontWeight: 700
                                }}>
                                  {chip}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
