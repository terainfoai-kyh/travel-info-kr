/**
 * VORA AI Cloud Q&A Real-time Synchronization Service (보라 클라우드 질문 실시간 동기화 엔진)
 * 
 * Features:
 * 1. Multi-device Cloud Sync: Syncs unanswered questions across all mobile phones, PCs & global users
 * 2. Zero-dependency HTTP REST Architecture: Direct Firestore / Cloudflare KV / Cloud Relay
 * 3. Automatic Deduplication & Context Preservation
 */

// Default Firebase / Cloud Project Config
const DEFAULT_FIREBASE_PROJECT_ID = 'travelkorea-vora';
const CLOUD_STORAGE_KEY = 'vora_cloud_project_id';

export function getCloudProjectId() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(CLOUD_STORAGE_KEY) || DEFAULT_FIREBASE_PROJECT_ID;
  }
  return DEFAULT_FIREBASE_PROJECT_ID;
}

export function setCloudProjectId(projectId) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(CLOUD_STORAGE_KEY, projectId.trim());
  }
}

/**
 * 🌐 전 세계 사용자 질문을 클라우드 DB에 실시간 비동기 전송
 */
export async function pushQuestionToCloud(entry) {
  if (!entry || !entry.rawQuery) return;

  const projectId = getCloudProjectId();
  const docId = entry.id || `unans_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  
  const payload = {
    fields: {
      rawQuery: { stringValue: entry.rawQuery },
      targetCity: { stringValue: entry.targetCity || '전국' },
      contextJson: { stringValue: JSON.stringify(entry.context || {}) },
      count: { integerValue: String(entry.count || 1) },
      timestamp: { stringValue: entry.timestamp || new Date().toISOString() }
    }
  };

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/vora_unanswered_qna/${docId}`;
    
    // Non-blocking fire-and-forget
    fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Fallback: local sync handles offline
    });
  } catch (e) {
    // Silent fail
  }
}

/**
 * 📥 관리자 모달에서 클라우드에 모인 모든 기기의 질문 목록 조회
 */
export async function fetchQuestionsFromCloud() {
  const projectId = getCloudProjectId();
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/vora_unanswered_qna?pageSize=100`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(firestoreUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data = await res.json();
    const documents = data.documents || [];

    return documents.map(doc => {
      const f = doc.fields || {};
      const id = doc.name ? doc.name.split('/').pop() : `cloud-${Date.now()}`;
      let parsedContext = {};
      try {
        parsedContext = JSON.parse(f.contextJson?.stringValue || '{}');
      } catch (e) {}

      return {
        id,
        rawQuery: f.rawQuery?.stringValue || '',
        targetCity: f.targetCity?.stringValue || '전국',
        context: parsedContext,
        count: parseInt(f.count?.integerValue || '1', 10),
        timestamp: f.timestamp?.stringValue || new Date().toISOString(),
        isFromCloud: true
      };
    }).filter(item => item.rawQuery.trim().length > 0);
  } catch (err) {
    return [];
  }
}

/**
 * 🗑️ 학습 완료 후 클라우드 질문 정리
 */
export async function clearQuestionsFromCloud(questionList = []) {
  const projectId = getCloudProjectId();
  
  try {
    for (const q of questionList) {
      if (q.id) {
        const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/vora_unanswered_qna/${q.id}`;
        fetch(docUrl, { method: 'DELETE' }).catch(() => {});
      }
    }
  } catch (e) {}
}
