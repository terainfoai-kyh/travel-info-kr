/**
 * VORA AI Central Cloud Knowledge Vault Service (보라 중앙 클라우드 실시간 지식 파이프라인)
 * 
 * 🌐 100% Genuine Cloud-Connected Pipeline:
 * 1. Real-time REST fetch to Cloudflare Pages Serverless Edge API (/api/qna).
 * 2. Multi-device live sync for tourists worldwide and Super Admin dashboard.
 * 3. Graceful offline fallback to LocalStorage for zero-failure resilience.
 */

import { isSystemActionOrCourseDirective } from '../utils/qnaFilter.js';

const CLOUD_API_ENDPOINT = '/api/qna';

function normKey(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_?!.~,()[\]]/g, '');
}

/**
 * 📥 미답변 질문을 [중앙 클라우드 DB (/api/qna)]에서 실시간 수신
 */
export async function fetchQuestionsFromCloud() {
  try {
    const res = await fetch(`${CLOUD_API_ENDPOINT}?type=queue`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.list)) {
        const filteredList = data.list.filter(item => !isSystemActionOrCourseDirective(item.rawQuery || item.question));
        try {
          localStorage.setItem('vora_unanswered_qna', JSON.stringify(filteredList));
        } catch (e) {}
        return filteredList;
      }
    }
  } catch (err) {
    console.info('[VoraCloudQna] Cloud API offline, using local fallback:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
    return Array.isArray(local) 
      ? local.filter(item => !isSystemActionOrCourseDirective(item.rawQuery || item.question)) 
      : [];
  } catch (e) {
    return [];
  }
}

/**
 * 📥 새로 학습된 커스텀 지식을 [중앙 클라우드 DB (/api/qna?type=custom_vault)]에서 실시간 수신
 */
export async function fetchCustomVaultFromCloud() {
  try {
    const res = await fetch(`${CLOUD_API_ENDPOINT}?type=custom_vault`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.list)) {
        return data.list;
      }
    }
  } catch (err) {
    console.info('[VoraCloudQna] Fetch custom vault offline:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
    return Array.isArray(local) ? local : [];
  } catch (e) {
    return [];
  }
}

/**
 * 📤 새로 학습된 커스텀 지식 목록을 [중앙 클라우드 DB]로 실시간 업로드 & 보관
 */
export async function pushCustomVaultToCloud(vaultList) {
  if (!Array.isArray(vaultList)) return;

  try {
    await fetch(CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_custom_vault',
        vault: vaultList
      })
    });
  } catch (err) {
    console.warn('[VoraCloudQna] Failed to push custom vault to cloud:', err.message);
  }
}

/**
 * 🌐 사용자의 미답변 질문을 [중앙 클라우드 DB (/api/qna)]로 실시간 전송 & 적재
 */
export async function pushQuestionToCloud(entry) {
  if (!entry || !entry.rawQuery) return;
  const rawQuery = entry.rawQuery.trim();
  if (rawQuery.length < 2 || isSystemActionOrCourseDirective(rawQuery)) return;

  const payload = {
    id: entry.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    rawQuery,
    targetCity: entry.targetCity || '전국',
    context: entry.context || {},
    count: entry.count || 1,
    timestamp: entry.timestamp || new Date().toISOString()
  };

  try {
    fetch(CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}

  try {
    const k = normKey(rawQuery);
    const local = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
    const existingIdx = local.findIndex(item => normKey(item.rawQuery || item.question) === k);

    if (existingIdx >= 0) {
      local[existingIdx].count = (local[existingIdx].count || 1) + 1;
      local[existingIdx].timestamp = new Date().toISOString();
      local[existingIdx].targetCity = entry.targetCity || local[existingIdx].targetCity || '전국';
    } else {
      local.unshift(payload);
      if (local.length > 300) local.pop();
    }

    localStorage.setItem('vora_unanswered_qna', JSON.stringify(local));
  } catch (err) {}
}

/**
 * 🧹 중앙 클라우드 대기 큐 완전 초기화
 */
export async function clearQuestionsFromCloud() {
  try {
    await fetch(`${CLOUD_API_ENDPOINT}?type=queue`, {
      method: 'DELETE'
    });
  } catch (err) {}
}

/**
 * 🗑️ 특정 질문을 중앙 클라우드 큐에서 삭제
 */
export async function deleteQuestionFromCloud(rawQuery) {
  if (!rawQuery) return;
  try {
    await fetch(`${CLOUD_API_ENDPOINT}?type=single_queue&query=${encodeURIComponent(rawQuery)}`, {
      method: 'DELETE'
    });
  } catch (err) {}
}

/**
 * 🗑️ 커스텀 지식을 중앙 클라우드에서 영구 삭제
 */
export async function deleteCustomKnowledgeFromCloud(knowledgeIdOrTitle) {
  if (!knowledgeIdOrTitle) return;
  try {
    await fetch(`${CLOUD_API_ENDPOINT}?type=custom_vault&id=${encodeURIComponent(knowledgeIdOrTitle)}`, {
      method: 'DELETE'
    });
  } catch (err) {}
}

// Backward-compatibility alias
export const publishKnowledgeToCloudMaster = pushCustomVaultToCloud;

