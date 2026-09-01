/**
 * Cloudflare Pages Functions: VORA Central Cloud Q&A Live Serverless API (/api/qna)
 * 
 * Production-grade Edge Backend for TravelKorea.
 * Connects all global mobile tourist devices and Admin PC in real-time.
 * Supports:
 * 1. Live Unanswered Question Queue Sync (/api/qna)
 * 2. Live Custom Learned Knowledge Vault Sync (/api/qna?type=custom_vault)
 */

// Edge In-Memory Live Stores (Shared across Edge Node runtime)
let liveUnansweredQueue = [];
let liveCustomVault = [];

function normKey(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_?!.~,()[\]]/g, '');
}

function isSystemActionOrCourseDirective(rawStr) {
  if (!rawStr || typeof rawStr !== 'string') return true;
  const clean = rawStr.trim();
  if (clean.length < 2) return true;
  const isCourseAction = /(코스\s*(만들기|짜줘|생성|설계|추천|보기|완성|잡아줘|세워줘|짜|뽑아줘)|일정\s*(만들기|짜줘|생성|설계|추천|보기|완성|세워줘|뽑아줘|변경|수정|조율)|일정표\s*(만들기|보기|완성)?|여행\s*(코스|일정|계획)|루트\s*(짜줘|추천|만들기)|create.*plan|build.*itinerary|make.*course|generate.*itinerary|start.*plan|plan.*trip|コース作成|日程作成|行程)/i.test(clean);
  const isCityDaysPattern = /^[가-힣a-zA-Z\s]+\s*\d+\s*(일|박|박\s*\d+일|days?|d)?\s*(코스|일정|여행|투어|plan|course)?\s*(만들기|짜줘|생성|추천|시작|가자|해줘|잡아줘)?$/i.test(clean);
  const isButtonChip = /^(📷|📍|✨|🚀|🍴|☔|🚶|👨‍👩‍👧|☕|🌅|🏙️|🏮|🏨|🌊|🏖️|🏢|👑|💡|🗓️)/.test(clean) || /(코스\s*만들기|일정\s*만들기)/i.test(clean);
  const isSimpleCityOnly = /^(서울|부산|제주|경주|강릉|수원|인천|전주|여수|대구|대전|광주|포항|통영|거제|춘천|속초|안동|한국|korea|seoul|busan|jeju)(\s*로|\s*에|\s*가자|\s*갈래|\s*여행)?$/i.test(clean);
  const isSimpleDuration = /^(\d+\s*일|\d+\s*박\s*\d+\s*일|\d+\s*박|당일치기|하루|이틀|사흘|\d+\s*days?)$/i.test(clean);
  const isSimpleCompanion = /^(혼자|커플|가족|친구|아이|부모님|아이\s*동반|부모님\s*동반|아이랑|부모님이랑|친구랑|연인이랑)$/i.test(clean);
  const isSimpleActionOrAccept = /^(짜줘|맞춰줘|해줘|잡아줘|추천해줘|추천|만들어줘|일정\s*생성|생성해줘|설계해줘|준비해줘|정해줘|응|어|네|예|좋아|좋아요|오케이|ok|콜|그래|부탁해|이대로|시작|가자|가보자|바로\s*일정\s*만들기|바로\s*짜줘|일정표\s*만들기)$/i.test(clean);
  const isSimpleThemeOnly = /^(맛집|카페|관광지|쇼핑|자연|야경|힐링|인생샷|핫플레이스|핫플|덜\s*걷기|걷기\s*적게|비\/실내|실내|비오는날|아이\s*동반|로컬\s*맛집|야경\s*맛집(\s*추천)?|감성\s*카페(\s*투어)?|인생샷\s*핫플레이스|대표\s*맛집\s*&\s*카페|인기\s*호텔\/숙소|전통\s*한옥\s*스테이|가성비\s*인기\s*호텔|오션뷰\s*감성\s*펜션)$/i.test(clean);
  const isArrivalTimeDirective = /(\d{1,2}:\d{2}|오전\s*도착|오후\s*도착|도착\s*\()/i.test(clean);
  const isExclusionDirective = /(빼줘|빼주세요|제외해줘|제외|없애줘|삭제해줘|빼|지워줘)/i.test(clean);
  return isCourseAction || isCityDaysPattern || isButtonChip || isSimpleCityOnly || isSimpleDuration || isSimpleCompanion || isSimpleActionOrAccept || isSimpleThemeOnly || isArrivalTimeDirective || isExclusionDirective;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8'
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'queue';

  // 1. Custom Knowledge Vault Sync
  if (type === 'custom_vault') {
    try {
      if (env && env.VORA_KV) {
        const kvVault = await env.VORA_KV.get('custom_knowledge_vault', { type: 'json' });
        if (Array.isArray(kvVault)) {
          return new Response(JSON.stringify({ success: true, list: kvVault }), { headers: CORS_HEADERS });
        }
      }
    } catch (e) {}

    return new Response(JSON.stringify({
      success: true,
      list: liveCustomVault,
      timestamp: new Date().toISOString()
    }), { headers: CORS_HEADERS });
  }

  // 2. Unanswered Queue Sync
  try {
    if (env && env.VORA_KV) {
      const kvData = await env.VORA_KV.get('unanswered_qna', { type: 'json' });
      if (Array.isArray(kvData)) {
        const filteredKv = kvData.filter(item => !isSystemActionOrCourseDirective(item.rawQuery || item.question));
        return new Response(JSON.stringify({ success: true, list: filteredKv }), { headers: CORS_HEADERS });
      }
    }
  } catch (e) {}

  const filteredQueue = liveUnansweredQueue.filter(item => !isSystemActionOrCourseDirective(item.rawQuery || item.question));
  return new Response(JSON.stringify({
    success: true,
    list: filteredQueue,
    timestamp: new Date().toISOString()
  }), {
    headers: CORS_HEADERS
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!body) {
      return new Response(JSON.stringify({ error: 'Missing body' }), { status: 400, headers: CORS_HEADERS });
    }

    // 1. Action: Save/Merge Custom Knowledge Vault from Mobile or PC
    if (body.action === 'save_custom_vault' && Array.isArray(body.vault)) {
      const mergedMap = new Map();
      liveCustomVault.forEach(item => {
        const key = normKey(item.title || item.questionVariations?.[0] || item.id);
        if (key) mergedMap.set(key, item);
      });
      body.vault.forEach(item => {
        const key = normKey(item.title || item.questionVariations?.[0] || item.id);
        if (key) mergedMap.set(key, item);
      });

      liveCustomVault = Array.from(mergedMap.values());
      if (liveCustomVault.length > 500) liveCustomVault = liveCustomVault.slice(0, 500);

      try {
        if (env && env.VORA_KV) {
          await env.VORA_KV.put('custom_knowledge_vault', JSON.stringify(liveCustomVault));
        }
      } catch (e) {}

      return new Response(JSON.stringify({
        success: true,
        message: 'Custom vault synced to cloud successfully',
        totalCount: liveCustomVault.length,
        list: liveCustomVault
      }), { headers: CORS_HEADERS });
    }

    // 2. Push Unanswered Question to Queue
    if (!body.rawQuery) {
      return new Response(JSON.stringify({ error: 'Missing rawQuery' }), { status: 400, headers: CORS_HEADERS });
    }

    const rawQuery = body.rawQuery.trim();
    if (rawQuery.length < 2 || isSystemActionOrCourseDirective(rawQuery)) {
      return new Response(JSON.stringify({ success: true, filtered: true, message: 'Action directive filtered' }), { headers: CORS_HEADERS });
    }

    const k = normKey(rawQuery);
    const targetCity = body.targetCity || '전국';
    const context = body.context || {};
    const count = parseInt(body.count || '1', 10);

    const existingIdx = liveUnansweredQueue.findIndex(item => normKey(item.rawQuery) === k);

    let updatedItem = null;
    if (existingIdx >= 0) {
      liveUnansweredQueue[existingIdx].count += count;
      liveUnansweredQueue[existingIdx].timestamp = new Date().toISOString();
      if (Object.keys(context).length > 0) {
        liveUnansweredQueue[existingIdx].context = context;
      }
      updatedItem = liveUnansweredQueue[existingIdx];
    } else {
      updatedItem = {
        id: body.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        rawQuery,
        targetCity,
        context,
        count: count,
        timestamp: new Date().toISOString()
      };
      liveUnansweredQueue.unshift(updatedItem);
      if (liveUnansweredQueue.length > 300) {
        liveUnansweredQueue.pop();
      }
    }

    try {
      if (env && env.VORA_KV) {
        await env.VORA_KV.put('unanswered_qna', JSON.stringify(liveUnansweredQueue));
      }
    } catch (e) {}

    return new Response(JSON.stringify({
      success: true,
      item: updatedItem,
      totalCount: liveUnansweredQueue.length
    }), {
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
  }
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'queue';
  const targetId = url.searchParams.get('id');

  if (type === 'custom_vault' && targetId) {
    // Delete single custom knowledge item
    const k = normKey(targetId);
    liveCustomVault = liveCustomVault.filter(item => normKey(item.title || item.questionVariations?.[0] || item.id) !== k);
    try {
      if (env && env.VORA_KV) {
        await env.VORA_KV.put('custom_knowledge_vault', JSON.stringify(liveCustomVault));
      }
    } catch (e) {}
    return new Response(JSON.stringify({ success: true, message: 'Item deleted from cloud vault' }), {
      headers: CORS_HEADERS
    });
  }

  // Clear Unanswered Queue
  liveUnansweredQueue = [];
  try {
    if (env && env.VORA_KV) {
      await env.VORA_KV.delete('unanswered_qna');
    }
  } catch (e) {}

  return new Response(JSON.stringify({ success: true, message: 'Queue cleared' }), {
    headers: CORS_HEADERS
  });
}
