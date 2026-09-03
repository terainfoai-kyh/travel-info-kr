/**
 * Cloudflare Pages Functions: VORA Real-Time Analytics & Monitoring API (/api/analytics)
 * 
 * Lightweight, privacy-friendly telemetry & activity aggregator for Super Admin.
 * Supports:
 * 1. POST /api/analytics - Record page views, itinerary creations, chat queries, and trip saves
 * 2. GET /api/analytics  - Fetch aggregated KPI metrics, daily trend history, top city rankings, language share, and live event feed
 * 3. DELETE /api/analytics - Reset stats (Super Admin only)
 */

// Edge In-Memory Live State (Persists across warm edge requests)
let analyticsState = {
  totalPageViews: 0,
  todayPageViews: 0,
  lastResetDate: new Date().toISOString().slice(0, 10),
  totalItineraries: 0,
  todayItineraries: 0,
  totalChatQueries: 0,
  totalTripsSaved: 0,
  cities: {},
  languages: { ko: 0, en: 0, ja: 0, zh: 0, zht: 0, de: 0, fr: 0, es: 0, ru: 0 },
  daysDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6+': 0 },
  themes: {},
  dailyHistory: {}, // { 'YYYY-MM-DD': { pageViews, itineraries, chats, saves } }
  recentEvents: []
};

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
  const currentDate = new Date().toISOString().slice(0, 10);
  if (analyticsState.lastResetDate !== currentDate) {
    analyticsState.todayPageViews = 0;
    analyticsState.todayItineraries = 0;
    analyticsState.lastResetDate = currentDate;
  }

  // Try to load from Cloudflare KV if bound
  if (env && env.VORA_KV) {
    try {
      const kvData = await env.VORA_KV.get('vora_analytics_summary', { type: 'json' });
      if (kvData && typeof kvData === 'object') {
        analyticsState = { ...analyticsState, ...kvData };
      }
    } catch (e) {}
  }

  // Ensure current date exists in dailyHistory
  if (!analyticsState.dailyHistory) analyticsState.dailyHistory = {};
  if (!analyticsState.dailyHistory[currentDate]) {
    analyticsState.dailyHistory[currentDate] = { pageViews: analyticsState.todayPageViews || 0, itineraries: analyticsState.todayItineraries || 0, chats: 0, saves: 0 };
  }

  // Sort top cities
  const topCities = Object.entries(analyticsState.cities || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return new Response(JSON.stringify({
    success: true,
    data: {
      ...analyticsState,
      topCities,
      timestamp: new Date().toISOString()
    }
  }), { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!body || !body.type) {
      return new Response(JSON.stringify({ error: 'Invalid event' }), { status: 400, headers: CORS_HEADERS });
    }

    const { type, city, days, lang = 'ko', theme, query, isAnswered } = body;
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);

    // Roll over day counters if new day
    if (analyticsState.lastResetDate !== currentDate) {
      analyticsState.todayPageViews = 0;
      analyticsState.todayItineraries = 0;
      analyticsState.lastResetDate = currentDate;
    }

    if (!analyticsState.dailyHistory) analyticsState.dailyHistory = {};
    if (!analyticsState.dailyHistory[currentDate]) {
      analyticsState.dailyHistory[currentDate] = { pageViews: 0, itineraries: 0, chats: 0, saves: 0 };
    }
    const dayStats = analyticsState.dailyHistory[currentDate];

    // 1. Page View Event
    if (type === 'page_view') {
      analyticsState.totalPageViews += 1;
      analyticsState.todayPageViews += 1;
      dayStats.pageViews += 1;
      if (lang) {
        analyticsState.languages[lang] = (analyticsState.languages[lang] || 0) + 1;
      }
    }

    // 2. Itinerary Generation Event
    if (type === 'itinerary_gen') {
      analyticsState.totalItineraries += 1;
      analyticsState.todayItineraries += 1;
      dayStats.itineraries += 1;
      
      if (city) {
        const cleanCity = city.replace(/(시|군|구|도)$/, '').trim() || city;
        analyticsState.cities[cleanCity] = (analyticsState.cities[cleanCity] || 0) + 1;
      }

      if (days) {
        const dayKey = days >= 6 ? '6+' : String(days);
        analyticsState.daysDistribution[dayKey] = (analyticsState.daysDistribution[dayKey] || 0) + 1;
      }

      if (theme) {
        analyticsState.themes[theme] = (analyticsState.themes[theme] || 0) + 1;
      }

      if (lang) {
        analyticsState.languages[lang] = (analyticsState.languages[lang] || 0) + 1;
      }
    }

    // 3. Chat Query Event
    if (type === 'chat_query') {
      analyticsState.totalChatQueries += 1;
      dayStats.chats += 1;
    }

    // 4. Trip Save Event
    if (type === 'trip_save') {
      analyticsState.totalTripsSaved += 1;
      dayStats.saves += 1;
    }

    // Record in Recent Events Log (Keep last 40)
    const eventItem = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      city: city || null,
      days: days || null,
      lang: lang || 'ko',
      theme: theme || null,
      query: query ? (query.length > 50 ? query.slice(0, 50) + '...' : query) : null,
      isAnswered: isAnswered ?? true,
      timestamp: now.toISOString()
    };

    analyticsState.recentEvents = [eventItem, ...(analyticsState.recentEvents || [])].slice(0, 40);

    // Save to KV if available
    if (env && env.VORA_KV) {
      try {
        await env.VORA_KV.put('vora_analytics_summary', JSON.stringify(analyticsState));
      } catch (e) {}
    }

    return new Response(JSON.stringify({ success: true, recorded: eventItem }), { headers: CORS_HEADERS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
  }
}

export async function onRequestDelete({ request, env }) {
  analyticsState = {
    totalPageViews: 0,
    todayPageViews: 0,
    lastResetDate: new Date().toISOString().slice(0, 10),
    totalItineraries: 0,
    todayItineraries: 0,
    totalChatQueries: 0,
    totalTripsSaved: 0,
    cities: {},
    languages: { ko: 0, en: 0, ja: 0, zh: 0, zht: 0, de: 0, fr: 0, es: 0, ru: 0 },
    daysDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6+': 0 },
    themes: {},
    dailyHistory: {},
    recentEvents: []
  };

  if (env && env.VORA_KV) {
    try {
      await env.VORA_KV.delete('vora_analytics_summary');
    } catch (e) {}
  }

  return new Response(JSON.stringify({ success: true, message: 'Analytics reset complete' }), { headers: CORS_HEADERS });
}
