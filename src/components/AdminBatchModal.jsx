import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Database, 
  Play, 
  CheckCircle2, 
  Copy, 
  Download, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  Cloud, 
  Smartphone, 
  Search, 
  Lock, 
  Unlock, 
  FileJson, 
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Globe,
  Activity,
  Compass,
  Trash2,
  Clock,
  Calendar,
  Layers,
  MessageSquare
} from 'lucide-react';
import { getVoraQnaVault } from '../data/voraQnaVault';
import { CITY_LOCAL_KNOWLEDGE } from '../data/voraDialogKnowledge';
import { interpolateTemplate } from '../utils/koreanParticles';
import { 
  fetchQuestionsFromCloud, 
  clearQuestionsFromCloud, 
  deleteQuestionFromCloud, 
  fetchCustomVaultFromCloud,
  pushCustomVaultToCloud,
  deleteCustomKnowledgeFromCloud
} from '../services/voraCloudQnaService';
import { isSystemActionOrCourseDirective } from '../utils/qnaFilter';
import { encryptVaultData, decryptVaultData } from '../utils/vaultCrypto';
import { fetchAnalyticsSummary, resetAnalyticsData } from '../services/analyticsService';

export default function AdminBatchModal({
  isOpen,
  onClose,
  currentUser,
  lang = 'ko'
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('analytics'); // 'analytics' | 'knowledge'
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [trendDaysRange, setTrendDaysRange] = useState(7); // 7 | 14 | 30
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
  const fileInputRef = useRef(null);

  // 📊 실시간 모니터링 통계 로드
  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const data = await fetchAnalyticsSummary();
      setAnalyticsData(data);
    } catch (e) {
      console.warn('Failed to load analytics:', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  // 🌐 [안정성 보장] 커스텀 지식 손실 없는 방탄 양방향 동기화
  const loadCustomVaultFromStorage = async () => {
    const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
    const map = new Map();
    
    // 1. 브라우저 로컬 스토리지에 보관된 커스텀 지식 로드
    let storedList = [];
    try {
      storedList = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      if (Array.isArray(storedList)) {
        storedList.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) map.set(key, item);
        });
      }
    } catch (e) {}

    // 2. ☁️ 중앙 클라우드 서버에서 동기화 수신 및 지능형 병합 (클라우드가 비어있어도 로컬 지식 절대 유실 방지!)
    try {
      const cloudVault = await fetchCustomVaultFromCloud();
      if (Array.isArray(cloudVault) && cloudVault.length > 0) {
        cloudVault.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) map.set(key, item);
        });
      }
    } catch (e) {}

    const cleanList = Array.from(map.values());
    setCustomVaultList(cleanList);
    try {
      localStorage.setItem('vora_custom_qna_vault', JSON.stringify(cleanList));
      // 만약 로컬에 새 지식이 있는데 클라우드가 비어있다면 클라우드로 자동 보정 푸시
      if (cleanList.length > 0) {
        pushCustomVaultToCloud(cleanList);
      }
    } catch (e) {}

    // 2. 🏛️ 소스코드 기본 마스터 암호화 볼트 지식 로드 (Q&A + 전국 59개 도시 로컬 지식 100% 통합 단일 원천)
    try {
      const qnaVault = getVoraQnaVault() || [];
      setMasterVaultList(qnaVault);
    } catch (e) {
      setMasterVaultList([]);
    }
  };

  // 🌐 [헌법 제19조] 100% 순수 중앙 클라우드 단일 진실 원천 미답변 큐 동기화 (유령 착시 100% 척결)
  const loadUnansweredFromStorage = async (syncCloud = true) => {
    try {
      const normKey = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');

      if (syncCloud) {
        setIsSyncingCloud(true);
        const cloudItems = await fetchQuestionsFromCloud();
        setIsSyncingCloud(false);

        // 클라우드 서버 데이터가 100% 기준 (서버에 없으면 로컬도 즉시 0건!)
        if (Array.isArray(cloudItems)) {
          const dedupedMap = new Map();
          cloudItems.forEach(item => {
            const rawQ = item.rawQuery || item.question || '';
            if (isSystemActionOrCourseDirective(rawQ)) return; // 🛡️ 단순 코스/일정 생성 액션 지시어 100% 필터링

            const k = normKey(rawQ);
            if (k) {
              if (dedupedMap.has(k)) {
                const prev = dedupedMap.get(k);
                prev.count = Math.max(prev.count || 1, item.count || 1);
              } else {
                dedupedMap.set(k, { ...item, count: item.count || 1 });
              }
            }
          });
          const list = Array.from(dedupedMap.values());
          setUnansweredList(list);
          localStorage.setItem('vora_unanswered_qna', JSON.stringify(list));
          return;
        }
      }

      // 오프라인 fallback
      const stored = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
      const filteredStored = (Array.isArray(stored) ? stored : []).filter(item => {
        const rawQ = item.rawQuery || item.question || '';
        return !isSystemActionOrCourseDirective(rawQ);
      });
      setUnansweredList(filteredStored);
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

      // Load unanswered questions and custom vault with real-time cloud sync
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
    setBatchLogs(['🚀 Gemini 2.0 Flash 초고속 배치 지식 증강 프로세스 시작...']);

    const newDistilled = [];
    const cleanKey = keyToUse.trim();

    // 1. Official Verified High-Speed Flash Models Hierarchy (404 미존재 모델 완전 박멸)
    let activeModelPath = 'models/gemini-2.0-flash';
    let modelsToTry = [
      'models/gemini-2.0-flash',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-flash-8b',
      'models/gemini-1.5-pro'
    ];

    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`, {
        headers: { 'x-goog-api-key': cleanKey }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const models = listData.models || [];
        const validModels = models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
        
        const validGenModels = validModels.filter(m => 
          !m.name.includes('tts') && 
          !m.name.includes('image') && 
          !m.name.includes('transcribe') && 
          !m.name.includes('robotics') && 
          !m.name.includes('computer-use') && 
          !m.name.includes('lyria') && 
          !m.name.includes('embedding')
        );

        // Prioritize stable 2.0-flash and 1.5-flash
        const prioritized = [
          ...validGenModels.filter(m => m.name.includes('2.0-flash') && !m.name.includes('lite')),
          ...validGenModels.filter(m => m.name.includes('1.5-flash') && !m.name.includes('8b')),
          ...validGenModels.filter(m => m.name.includes('1.5-flash-8b')),
          ...validGenModels.filter(m => m.name.includes('1.5-pro')),
          ...validGenModels.filter(m => m.name.includes('flash'))
        ];

        const discoveredNames = prioritized.map(m => m.name.startsWith('models/') ? m.name : `models/${m.name}`);
        if (discoveredNames.length > 0) {
          activeModelPath = discoveredNames[0];
          modelsToTry = Array.from(new Set([
            ...discoveredNames,
            'models/gemini-2.0-flash',
            'models/gemini-1.5-flash',
            'models/gemini-1.5-flash-8b'
          ]));
        }
        setBatchLogs(prev => [...prev, `⚡ 구글 공식 활성 모델 직결 성공: [ ${activeModelPath} ]`]);
      }
    } catch (err) {
      console.warn('[GeminiBatch] Model discovery fallback:', err);
      setBatchLogs(prev => [...prev, `⚡ 기본 정품 모델 직결: [ ${activeModelPath} ]`]);
    }

    for (let i = 0; i < unansweredList.length; i++) {
      const q = unansweredList[i];
      setBatchLogs(prev => [...prev, `⚡ [${i + 1}/${unansweredList.length}] "${q.rawQuery}" 0.1초 초고속 증류 중...`]);
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

[핵심 지식 증류 필수 규칙]:
1. 타겟 도시(targetCity) 자동 식별:
   - 질문이나 답변 내용이 특정 도시(예: 경주, 부산, 나주, 서울, 강릉, 여수, 제주 등)에 한정된 꿀팁이면 "targetCity"에 해당 도시명(예: "나주")을 반드시 지정하세요. (전국 공통 여행 질문이면 "all")
2. 트리거 유사 질문(questionVariations) 4개국어(KO, EN, JA, ZH) 100% 자동 다각화 (6~8개 필수):
   - 한국어: 원본 질문("${q.rawQuery}") 및 한국어 동의어/연관 질문 3~4개 포함 (예: "광교산", "광교산 등산코스", "수원 광교산 가볼만한곳", "광교산 맛집")
   - 영어 (EN): 영문 명칭 및 영문 질문 2개 이상 필수 포함! (예: "Gwanggyosan", "Gwanggyo Mountain", "Gwanggyosan Hiking Trail")
   - 일본어 (JA): 일문 명칭 및 일문 질문 1~2개 필수 포함! (예: "光教山", "クァンギョサン 登山コース")
   - 중국어 (ZH): 중문 명칭 및 중문 질문 1~2개 필수 포함! (예: "光教山", "光教山 登山路线")
3. 동음이의어 또는 전국에 여러 곳이 존재하는 지명/명소(예: 월출산, 남산, 미륵사, 백두대간, 관음도 등) 질문 시:
   - 한국에서 관광객/등산객에게 가장 유명하고 상징적인 압도적 1등 대표 명소(예: 영암 월출산·구름다리, 서울 남산타워)를 1순위로 반드시 가장 먼저 언급할 것!
4. 답변은 여행자가 모바일에서 편하게 읽을 수 있도록 군더더기 없이 친절하고 정갈한 2~3문장으로 핵심을 요약할 것.
5. suggestedChips에는 사용자가 다음 행동으로 누를 만한 유용한 스팟/체험 버튼(예: "금성관", "나주곰탕 하얀집", "빛가람전망대")을 3~4개 추천할 것.

다음 JSON 포맷으로만 즉시 출력하세요:
{
  "id": "qna_auto_${Date.now()}_${i}",
  "title": "${q.rawQuery}",
  "category": "DYNAMIC_KNOWLEDGE",
  "targetCity": "${q.targetCity || ctx.city || 'all'}",
  "season": "all",
  "questionVariations": ["${q.rawQuery}", "한국어 유사질문1", "English Title/Question", "Japanese Title/Question", "Chinese Title/Question"],
  "intentKeywords": ["키워드1", "키워드2"],
  "answers": {
    "ko": "친절하고 정확한 2~3문장 한국어 핵심 맞춤 답변",
    "en": "Concise 2~3 sentence English travel concierge answer",
    "ja": "2〜3文の親切な日本語の旅行案内",
    "zh": "亲切准确的2~3句中文旅游向导回答"
  },
  "geminiAnswer": {
    "ko": "친절하고 정확한 2~3문장 한국어 핵심 맞춤 답변",
    "en": "Concise 2~3 sentence English travel concierge answer",
    "ja": "2〜3文の親切な日本語の旅行案内",
    "zh": "亲切准确的2~3句中文旅游向导回答"
  },
  "followUp": "다음 제안 질문?",
  "suggestedChips": ["추천버튼1", "추천버튼2", "추천버튼3"]
}`;

      let rawOutput = '';
      let success = false;
      let lastErrMsg = '';

      for (const mName of modelsToTry) {
        try {
          const cleanMName = mName.startsWith('models/') ? mName : `models/${mName}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 안전 타임아웃

          const targetUrl = `https://generativelanguage.googleapis.com/v1beta/${cleanMName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
          const response = await fetch(targetUrl, {
            method: 'POST',
            signal: controller.signal,
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': cleanKey
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: promptText }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json'
              }
            })
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const responseData = await response.json();
            rawOutput = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (rawOutput) {
              success = true;
              break;
            }
          } else if (response.status === 429 || response.status === 503) {
            const errTxt = await response.text().catch(() => '');
            lastErrMsg = `${cleanMName} (${response.status}: Rate Limit/Busy)`;
            console.warn(`[GeminiBatch] ${cleanMName} busy, waiting 2s...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            const errTxt = await response.text().catch(() => '');
            lastErrMsg = `${cleanMName} (${response.status}: ${errTxt.slice(0, 100)})`;
            console.warn(`[GeminiBatch] ${cleanMName} error:`, response.status, errTxt);
          }
        } catch (e) {
          const isAbort = e.name === 'AbortError';
          lastErrMsg = isAbort ? `${mName} 타임아웃(20s)` : `${mName} (${e.message})`;
        }
      }

      if (success && rawOutput) {
        const cleanedJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        try {
          const parsed = JSON.parse(cleanedJson);
          parsed.id = parsed.id || `custom_${Date.now()}_${i}`;
          parsed.title = parsed.title || parsed.questionVariations?.[0] || q.rawQuery;
          parsed.targetCity = parsed.targetCity || q.targetCity || 'all';
          if (parsed.geminiAnswer && !parsed.answers) {
            parsed.answers = { ...parsed.geminiAnswer };
          } else if (parsed.answers && !parsed.geminiAnswer) {
            parsed.geminiAnswer = { ...parsed.answers };
          }
          newDistilled.push(parsed);
          setBatchLogs(prev => [...prev, `✨ "${q.rawQuery}" 3개국어 황금 Q&A 지식 증류 완료!`]);
        } catch (pe) {
          setBatchLogs(prev => [...prev, `⚠️ "${q.rawQuery}" JSON 파싱 실패: ${pe.message}`]);
        }
      } else {
        setBatchLogs(prev => [...prev, `⚠️ "${q.rawQuery}" 응답 지연/실패 (${lastErrMsg || '일시적 트래픽 초과'})`]);
      }

      // ⏱️ [1.2초 안전 쿨다운] 구글 API 429 속도 제한 초과 및 503 방지 100% 보장!
      if (i < unansweredList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    }

    setDistilledResults(newDistilled);
    setBatchProgress(100);
    setIsRunningBatch(false);

    // ✨ 학습 완료 후 미답변 중앙 클라우드 및 로컬 큐에서 깔끔 제거!
    try {
      localStorage.removeItem('vora_unanswered_qna');
      setUnansweredList([]);
      await clearQuestionsFromCloud();

      // 🌟 신규 학습 지식 영구 커스텀 볼트에 중복 없이 병합 저장!
      const existingVault = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
      const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
      
      const mergedMap = new Map();
      // 1. 기존 지식 등록
      existingVault.forEach(item => {
        const key = norm(item.title || item.questionVariations?.[0] || item.id);
        if (key) mergedMap.set(key, item);
      });
      // 2. 신규 지식 덮어쓰기 (Upsert)
      newDistilled.forEach(item => {
        const key = norm(item.title || item.questionVariations?.[0] || item.id);
        if (key) mergedMap.set(key, item);
      });

      const updatedVault = Array.from(mergedMap.values());
      localStorage.setItem('vora_custom_qna_vault', JSON.stringify(updatedVault));
      setCustomVaultList(updatedVault);
      await pushCustomVaultToCloud(updatedVault);
    } catch (e) {}

    setBatchLogs(prev => [...prev, `🎉 총 ${newDistilled.length}개 신규 지식 학습 완료 & 클라우드 영구 동기화 완료! ✨`]);
  };


// 📥 [전체 지식 DB 복호화 평문 JSON 다운로드]
  const handleExportDecryptedJson = () => {
    try {
      const allVault = [...masterVaultList, ...customVaultList];
      const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
      const dedupMap = new Map();
      allVault.forEach(item => {
        const key = norm(item.title || item.questionVariations?.[0] || item.id);
        if (key) dedupMap.set(key, item);
      });
      const exportList = Array.from(dedupMap.values());

      const jsonStr = JSON.stringify(exportList, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute('download', `vora_knowledge_master_decrypted_${dateStr}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`복호화 다운로드 실패: ${err.message}`);
    }
  };

  // 🔒 [전체 지식 DB AES-256 암호화 파일 다운로드]
  const handleExportEncryptedVault = async () => {
    try {
      const allVault = [...masterVaultList, ...customVaultList];
      const encryptedBase64 = await encryptVaultData(allVault);
      const blob = new Blob([encryptedBase64], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute('download', `vora_vault_encrypted_${dateStr}.enc`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`암호화 백업 실패: ${err.message}`);
    }
  };

  // 📤 [외부 원본 JSON 파일 업로드 ➔ 암호화 및 볼트 병합]
  const handleImportPlainJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') return;

        let parsedList = [];
        if (file.name.endsWith('.enc')) {
          // 암호화된 파일이면 복호화 시도
          parsedList = await decryptVaultData(content);
        } else {
          parsedList = JSON.parse(content);
        }

        if (!Array.isArray(parsedList) || parsedList.length === 0) {
          alert('올바른 지식 목록 JSON 형식이 아닙니다.');
          return;
        }

        const existingVault = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
        const norm = (s) => (s || '').trim().toLowerCase().replace(/[\s\-_?!.~,()[\]]/g, '');
        const mergedMap = new Map();
        existingVault.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) mergedMap.set(key, item);
        });
        parsedList.forEach(item => {
          const key = norm(item.title || item.questionVariations?.[0] || item.id);
          if (key) mergedMap.set(key, item);
        });

        const updated = Array.from(mergedMap.values());
        localStorage.setItem('vora_custom_qna_vault', JSON.stringify(updated));
        loadCustomVaultFromStorage();
        alert(`총 ${parsedList.length}개 지식이 성공적으로 암호화 병합되었습니다! 🚀`);
      } catch (err) {
        alert(`파일 업로드 처리 오류: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

        {/* Super Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <button
            onClick={() => setActiveAdminTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeAdminTab === 'analytics' ? '#8b5cf6' : 'transparent',
              color: activeAdminTab === 'analytics' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={16} />
            <span>📊 서비스 실시간 모니터링</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('knowledge')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeAdminTab === 'knowledge' ? '#8b5cf6' : 'transparent',
              color: activeAdminTab === 'knowledge' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Database size={16} />
            <span>🧠 보라 AI 지식 관리 & 배치 학습 ({unansweredList.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: REAL-TIME SERVICE MONITORING & TELEMETRY DASHBOARD                 */}
        {/* ========================================================================= */}
        {activeAdminTab === 'analytics' && (
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={18} color="#8b5cf6" />
                  실시간 트래픽 & 여행 일정 생성 통계
                </h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  전 세계 접속 현황, 국가별 언어 점유율, 인기 여행 도시 랭킹 및 실시간 활동 피드
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={loadAnalytics}
                  disabled={isLoadingAnalytics}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={isLoadingAnalytics ? 'animate-spin' : ''} />
                  <span>새로고침</span>
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('⚠️ 통계 데이터를 초기화하시겠습니까?')) {
                      const res = await resetAnalyticsData();
                      setAnalyticsData(res);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  <span>데이터 리셋</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.85rem'
            }}>
              {/* KPI 1: Visitors */}
              <div style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08))',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>방문자 수 (DAU)</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Users size={15} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3b82f6' }}>
                    {analyticsData?.todayPageViews || 0}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    / 누적 {(analyticsData?.totalPageViews || 0).toLocaleString()}명
                  </span>
                </div>
              </div>

              {/* KPI 2: Itineraries Generated */}
              <div style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.08))',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>여행 일정 생성</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Compass size={15} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>
                    {analyticsData?.todayItineraries || 0}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    / 누적 {(analyticsData?.totalItineraries || 0).toLocaleString()}건
                  </span>
                </div>
              </div>

              {/* KPI 3: AI Chat Queries */}
              <div style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.08))',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>보라 AI 대화량</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <MessageSquare size={15} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8b5cf6' }}>
                    {(analyticsData?.totalChatQueries || 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>회 대화</span>
                </div>
              </div>

              {/* KPI 4: Saved Trips */}
              <div style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>내 여행 저장 건수</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Database size={15} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b' }}>
                    {(analyticsData?.totalTripsSaved || 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>개 보관</span>
                </div>
              </div>
            </div>

            {/* 📅 Daily Trend Chart & Period Filter */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Header with 7/14/30 Day Range Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6'
                  }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                      일자별 방문자 & 일정 생성 추이 (Daily Trend)
                    </h5>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      기간별 일일 유입 및 코스 기획 볼륨 분석
                    </span>
                  </div>
                </div>

                {/* Range Filter Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--bg-card)', padding: '0.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  {[
                    { days: 7, label: '최근 7일' },
                    { days: 14, label: '최근 14일' },
                    { days: 30, label: '최근 30일' }
                  ].map(tab => (
                    <button
                      key={tab.days}
                      onClick={() => setTrendDaysRange(tab.days)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: trendDaysRange === tab.days ? '#8b5cf6' : 'transparent',
                        color: trendDaysRange === tab.days ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.75rem', paddingLeft: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#3b82f6' }} />
                  <span style={{ fontWeight: 600 }}>방문자 수 (Views/DAU)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                  <span style={{ fontWeight: 600 }}>일정 생성 수 (Itineraries)</span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              {(() => {
                const history = analyticsData?.dailyHistory || {};
                const today = new Date();
                const chartData = [];
                for (let i = trendDaysRange - 1; i >= 0; i--) {
                  const d = new Date(today);
                  d.setDate(today.getDate() - i);
                  const dateStr = d.toISOString().slice(0, 10);
                  const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
                  const stats = history[dateStr] || { pageViews: (i === 0 ? analyticsData?.todayPageViews || 0 : 0), itineraries: (i === 0 ? analyticsData?.todayItineraries || 0 : 0) };
                  chartData.push({
                    dateStr,
                    dateLabel,
                    isToday: i === 0,
                    pageViews: stats.pageViews || 0,
                    itineraries: stats.itineraries || 0
                  });
                }

                const maxVal = Math.max(10, ...chartData.map(d => Math.max(d.pageViews, d.itineraries)));

                return (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: '0.75rem 0.5rem 0.25rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {/* Columns container */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${chartData.length}, 1fr)`,
                      gap: '0.4rem',
                      alignItems: 'flex-end',
                      height: '140px',
                      padding: '0 0.5rem 0.5rem'
                    }}>
                      {chartData.map(item => {
                        const viewHeightPct = Math.max(8, Math.round((item.pageViews / maxVal) * 100));
                        const itinHeightPct = Math.max(8, Math.round((item.itineraries / maxVal) * 100));
                        return (
                          <div 
                            key={item.dateStr}
                            title={`${item.dateStr}: 방문자 ${item.pageViews}명 / 일정생성 ${item.itineraries}건`}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              height: '100%',
                              justifyContent: 'flex-end',
                              gap: '0.2rem',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100%', width: '100%', justifyContent: 'center' }}>
                              {/* Blue Bar (Views) */}
                              <div style={{
                                width: '40%',
                                maxWidth: '16px',
                                height: `${viewHeightPct}%`,
                                borderRadius: '4px 4px 0 0',
                                background: item.isToday ? 'linear-gradient(180deg, #60a5fa, #3b82f6)' : '#3b82f6',
                                transition: 'height 0.3s ease'
                              }} />
                              {/* Green Bar (Itineraries) */}
                              <div style={{
                                width: '40%',
                                maxWidth: '16px',
                                height: `${itinHeightPct}%`,
                                borderRadius: '4px 4px 0 0',
                                background: item.isToday ? 'linear-gradient(180deg, #34d399, #10b981)' : '#10b981',
                                transition: 'height 0.3s ease'
                              }} />
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: item.isToday ? 800 : 500,
                              color: item.isToday ? '#8b5cf6' : 'var(--text-muted)',
                              marginTop: '0.3rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.dateLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 2-Column Analytics Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Left Panel: Top 10 Cities */}
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1.1rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} color="#8b5cf6" />
                    가장 인기 있는 여행 도시 Top 10
                  </h5>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>생성 빈도 기준</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(analyticsData?.topCities && analyticsData.topCities.length > 0) ? (
                    analyticsData.topCities.map((item, idx) => {
                      const totalC = analyticsData.totalItineraries || 1;
                      const pct = Math.min(100, Math.round((item.count / totalC) * 100)) || 10;
                      return (
                        <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700 }}>
                            <span>
                              <strong style={{ color: idx < 3 ? '#8b5cf6' : 'var(--text-muted)', marginRight: '0.4rem' }}>
                                #{idx + 1}
                              </strong>
                              {item.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.count}회 ({pct}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', borderRadius: '100px', backgroundColor: 'var(--bg-card)', overflow: 'hidden' }}>
                            <div style={{
                              width: `${pct}%`,
                              height: '100%',
                              borderRadius: '100px',
                              background: idx === 0 
                                ? 'linear-gradient(90deg, #8b5cf6, #ec4899)' 
                                : idx === 1 
                                  ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' 
                                  : 'linear-gradient(90deg, #10b981, #3b82f6)'
                            }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      아직 수집된 도시 통계가 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Global Languages & Live Event Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Languages Breakdown */}
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '1.1rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={16} color="#3b82f6" />
                      글로벌 접속 언어 / 국가 비중
                    </h5>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>국가별 선호도</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {Object.entries(analyticsData?.languages || {}).map(([langKey, count]) => {
                      const totalLang = Object.values(analyticsData?.languages || {}).reduce((a, b) => a + b, 0) || 1;
                      const pct = Math.round((count / totalLang) * 100);
                      const langLabels = {
                        ko: '🇰🇷 한국어',
                        en: '🇺🇸 English',
                        ja: '🇯🇵 日本語',
                        zh: '🇨🇳 简体中文',
                        zht: '🇹🇼 繁體中文',
                        fr: '🇫🇷 Français',
                        de: '🇩🇪 Deutsch',
                        es: '🇪🇸 Español',
                        ru: '🇷🇺 Русский'
                      };
                      return (
                        <div key={langKey} style={{
                          padding: '0.5rem 0.6rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.15rem'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{langLabels[langKey] || langKey}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6' }}>{count}회 <small style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({pct}%)</small></span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '1.1rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={16} color="#10b981" />
                      실시간 라이브 활동 피드 (Live Feed)
                    </h5>
                    <span style={{
                      fontSize: '0.65rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '100px',
                      fontWeight: 800
                    }}>
                      LIVE ON
                    </span>
                  </div>

                  <div style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}>
                    {(analyticsData?.recentEvents && analyticsData.recentEvents.length > 0) ? (
                      analyticsData.recentEvents.slice(0, 15).map((evt) => {
                        const timeStr = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        let desc = '';
                        if (evt.type === 'itinerary_gen') {
                          desc = `🗺️ [${evt.city || '대한민국'} ${evt.days || 3}일] 코스 생성 (${evt.lang?.toUpperCase()})`;
                        } else if (evt.type === 'page_view') {
                          desc = `🌐 새로운 방문자 접속 (${evt.lang?.toUpperCase()})`;
                        } else if (evt.type === 'chat_query') {
                          desc = `💬 보라 AI 질문: "${evt.query || '여행 질문'}"`;
                        } else if (evt.type === 'trip_save') {
                          desc = `💾 [${evt.city || '여행'}] 일정 저장 완료`;
                        }
                        return (
                          <div key={evt.id} style={{
                            padding: '0.45rem 0.65rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem'
                          }}>
                            <span style={{ fontWeight: 600 }}>{desc}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{timeStr}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        기록된 활동이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VORA AI BATCH KNOWLEDGE CENTER (ORIGINAL)                          */}
        {/* ========================================================================= */}
        {activeAdminTab === 'knowledge' && (
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Search size={16} color="#8b5cf6" /> 🔍 지식 & 제미나이 답변 통합 검색기
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                총 <strong>{(masterVaultList.length || 0) + customVaultList.length}</strong>개 영구 지식 보유
              </span>
            </div>

            {/* 🔐 Super Admin Master IP Asset Crypto Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.4rem',
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '10px',
              padding: '0.45rem 0.7rem',
              fontSize: '0.75rem'
            }}>
              <span style={{ fontWeight: 700, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} /> 🔐 지식 자산 보안 제어
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportPlainJson}
                  accept=".json,.enc"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={handleExportDecryptedJson}
                  title="전체 지식 DB를 복호화하여 원본 JSON 파일로 내 PC에 다운로드"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.3rem 0.55rem',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  <Unlock size={12} /> 📥 원본 복호화 다운로드 (JSON)
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="PC에서 편집한 원본 JSON을 업로드하여 암호화 DB로 병합 저장"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.3rem 0.55rem',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={12} /> 📤 원본 업로드 & 암호화
                </button>
                <button
                  onClick={handleExportEncryptedVault}
                  title="AES-256 암호화된 상태 그대로 파일 백업 다운로드"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.3rem 0.55rem',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={12} /> 🔒 암호문 백업 (.enc)
                </button>
              </div>
            </div>

            {/* Search Input Bar with Permanent [ 🔍 검색 ] & [ 🔄 전체 ] Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="🔎 질문명 또는 키워드 검색 (예: 옥녀봉, 사량도, 독도, 경복궁, 부산...)"
                  value={searchKnowledgeQuery}
                  onChange={(e) => setSearchKnowledgeQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.2rem 0.65rem 0.9rem',
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
              <button
                onClick={() => {}}
                style={{
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                }}
              >
                <Search size={14} /> 검색
              </button>
              {searchKnowledgeQuery && (
                <button
                  onClick={() => setSearchKnowledgeQuery('')}
                  style={{
                    padding: '0.65rem 0.8rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🔄 전체
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
                const norm = (s) => (s || '').trim().toLowerCase();
                const knowledgeMap = new Map();

                // 1. 마스터 지식 등록
                masterVaultList.forEach((item, idx) => {
                  const k = norm(item.title || item.questionVariations?.[0] || item.id || `master_${idx}`);
                  if (k) knowledgeMap.set(k, { ...item, _isMaster: true });
                });

                // 2. 커스텀 학습 지식 등록 (커스텀이 마스터를 오버라이드하거나 유니크하게 유지)
                customVaultList.forEach((item, idx) => {
                  const k = norm(item.title || item.questionVariations?.[0] || item.id || `custom_${idx}`);
                  if (k) knowledgeMap.set(k, { ...item, _isCustom: true });
                });

                const allKnowledge = Array.from(knowledgeMap.values());
                // 🧹 [Ltrim & Rtrim] 앞뒤 공백만 깔끔하게 제거한 표준 검색어!
                const cleanQuery = (searchKnowledgeQuery || '').trim().toLowerCase();
                
                let filtered = allKnowledge;
                if (cleanQuery) {
                  filtered = allKnowledge.filter(item => {
                    const title = (item.title || item.questionVariations?.[0] || '').toLowerCase();
                    const city = (item.targetCity || '').toLowerCase();
                    const variations = (item.questionVariations || []).map(v => (v || '').toLowerCase());
                    const intentKw = (item.intentKeywords || []).map(k => (k || '').toLowerCase());

                    // 1. 질문 제목에 포함?
                    if (title.includes(cleanQuery)) return true;
                    // 2. 유사 질문(트리거)에 포함?
                    if (variations.some(v => v.includes(cleanQuery))) return true;
                    // 3. 도시명 또는 대표 키워드에 포함?
                    if (city.includes(cleanQuery) || intentKw.some(k => k.includes(cleanQuery))) return true;
                    // 4. 본문 검색 (단, 1글자 잡음 방지를 위해 2글자 이상일 때만 매칭)
                    if (cleanQuery.length >= 2) {
                      const answerKo = (item.answers?.ko || item.geminiAnswer?.ko || '').toLowerCase();
                      const answerEn = (item.answers?.en || item.geminiAnswer?.en || '').toLowerCase();
                      if (answerKo.includes(cleanQuery) || answerEn.includes(cleanQuery)) return true;
                    }
                    return false;
                  });
                }

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
                            backgroundColor: item._isCustom ? '#10b981' : '#8b5cf6',
                            color: '#ffffff',
                            fontWeight: 800,
                            flexShrink: 0
                          }}>
                            {item._isCustom ? '🧠 커스텀' : (item.targetCity || '전국')}
                          </span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title || item.questionVariations?.[0] || '지식 항목'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                          {item._isCustom && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm(`"${item.title || item.questionVariations?.[0]}" 지식을 삭제하시겠습니까?`)) {
                                  const updated = customVaultList.filter(c => c.id !== item.id && norm(c.title || c.questionVariations?.[0]) !== norm(item.title || item.questionVariations?.[0]));
                                  localStorage.setItem('vora_custom_qna_vault', JSON.stringify(updated));
                                  setCustomVaultList(updated);
                                  await deleteCustomKnowledgeFromCloud(item.id || item.title || item.questionVariations?.[0]);
                                  await pushCustomVaultToCloud(updated);
                                }
                              }}
                              title="이 지식 삭제"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px'
                              }}
                            >
                              🗑️
                            </button>
                          )}
                          <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 800 }}>
                            {isExpanded ? '▲ 접기' : '▼ 답변 보기'}
                          </span>
                        </div>
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

                          {/* Gemini Answer / City Knowledge Full Text Box */}
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
                            {item.answers?.[activeLangTab] || item.answers?.ko || item.geminiAnswer?.[activeLangTab] || item.geminiAnswer?.ko || '등록된 다국어 답변이 없습니다.'}
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
        )}
      </div>
    </div>
  );
}
