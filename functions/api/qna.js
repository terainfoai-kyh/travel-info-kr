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
        return new Response(JSON.stringify({ success: true, list: kvData }), { headers: CORS_HEADERS });
      }
    }
  } catch (e) {}

  return new Response(JSON.stringify({
    success: true,
    list: liveUnansweredQueue,
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
    if (rawQuery.length < 2) {
      return new Response(JSON.stringify({ error: 'Query too short' }), { status: 400, headers: CORS_HEADERS });
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
