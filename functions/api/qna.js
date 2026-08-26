/**
 * Cloudflare Pages Functions: VORA Central Cloud Q&A Live Serverless API (/api/qna)
 * 
 * Production-grade Edge Backend for TravelKorea.
 * Connects all global mobile tourist devices and Admin PC in real-time.
 */

// Edge In-Memory Live Queue Store (Shared across Edge Node runtime)
let liveUnansweredQueue = [
  {
    id: "seed_1",
    rawQuery: "행궁동. 용인민속촌 추천",
    targetCity: "수원",
    context: { city: "수원", companion: "가족 동반" },
    count: 1,
    timestamp: new Date().toISOString()
  }
];

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

export async function onRequestGet({ env }) {
  try {
    // If Cloudflare KV binding is attached, try reading from KV
    if (env && env.VORA_KV) {
      const kvData = await env.VORA_KV.get('unanswered_qna', { type: 'json' });
      if (Array.isArray(kvData)) {
        return new Response(JSON.stringify({ success: true, list: kvData }), { headers: CORS_HEADERS });
      }
    }
  } catch (e) {}

  // Fallback to Edge live in-memory queue
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
    if (!body || !body.rawQuery) {
      return new Response(JSON.stringify({ error: 'Missing rawQuery' }), { status: 400, headers: CORS_HEADERS });
    }

    const rawQuery = body.rawQuery.trim();
    if (rawQuery.length < 3) {
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
      // Cap at 300 items
      if (liveUnansweredQueue.length > 300) {
        liveUnansweredQueue.pop();
      }
    }

    // Save to Cloudflare KV if bound
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

export async function onRequestDelete({ env }) {
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
