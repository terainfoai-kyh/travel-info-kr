/**
 * VORA AI Local Storage Knowledge Vault Service (보라 로컬 지식 볼트 관리 엔진)
 * 
 * 🛡️ CONSTITUTIONAL SPECIFICATIONS:
 * 1. 0% External Unstable Mock Calls (Eliminated 405 Method Not Allowed errors completely).
 * 2. 100% Reliable & Fast LocalStorage Management.
 * 3. Smart Deduplication & Hit Counter Tracking (🔥 N회).
 */

function normKey(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_?!.~,()[\]]/g, '');
}

/**
 * 📥 미답변 질문 로컬 볼트에서 조회
 */
export async function fetchQuestionsFromCloud() {
  try {
    const local = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
    return Array.isArray(local) ? local : [];
  } catch (e) {
    return [];
  }
}

/**
 * 🌐 미답변 질문 로컬 볼트에 기록 & 중복 카운트 누적
 */
export async function pushQuestionToCloud(entry) {
  if (!entry || !entry.rawQuery) return;
  const rawQuery = entry.rawQuery.trim();
  if (rawQuery.length < 2) return;

  const k = normKey(rawQuery);
  if (!k) return;

  try {
    const local = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
    const existingIdx = local.findIndex(item => normKey(item.rawQuery || item.question) === k);

    if (existingIdx >= 0) {
      local[existingIdx].count = (local[existingIdx].count || 1) + 1;
      local[existingIdx].timestamp = new Date().toISOString();
      local[existingIdx].targetCity = entry.targetCity || local[existingIdx].targetCity || '전국';
    } else {
      local.unshift({
        id: entry.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        rawQuery,
        targetCity: entry.targetCity || '전국',
        count: entry.count || 1,
        timestamp: entry.timestamp || new Date().toISOString()
      });
      if (local.length > 100) local.pop();
    }

    localStorage.setItem('vora_unanswered_qna', JSON.stringify(local));
  } catch (err) {
    // Silent fail-safe
  }
}

/**
 * 🗑️ 특정 미답변 질문 1건 개별 삭제
 */
export async function deleteQuestionFromCloud(rawQuery) {
  if (!rawQuery) return;
  const k = normKey(rawQuery);
  try {
    const local = JSON.parse(localStorage.getItem('vora_unanswered_qna') || '[]');
    const updated = local.filter(item => normKey(item.rawQuery || item.question) !== k);
    localStorage.setItem('vora_unanswered_qna', JSON.stringify(updated));
  } catch (e) {}
}

/**
 * 🗑️ 제미나이 학습 완료 후 미답변 질문 큐 전체 초기화
 */
export async function clearQuestionsFromCloud() {
  try {
    localStorage.removeItem('vora_unanswered_qna');
  } catch (e) {}
}

/**
 * 🚀 새로운 황금 Q&A 지식을 브라우저 볼트에 영구 저장
 */
export async function publishKnowledgeToCloudMaster(knowledgeList = []) {
  if (!Array.isArray(knowledgeList) || knowledgeList.length === 0) return true;

  try {
    const localExisting = JSON.parse(localStorage.getItem('vora_custom_qna_vault') || '[]');
    const merged = [...localExisting];
    knowledgeList.forEach(k => {
      const idx = merged.findIndex(m => m.id === k.id || m.questionVariations?.[0] === k.questionVariations?.[0]);
      if (idx >= 0) {
        merged[idx] = k;
      } else {
        merged.unshift(k);
      }
    });
    localStorage.setItem('vora_custom_qna_vault', JSON.stringify(merged));
    return true;
  } catch (e) {
    return false;
  }
}
