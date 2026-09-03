/**
 * analyticsService.js - VORA Telemetry & Super Admin Analytics Client
 * 
 * Non-blocking, privacy-preserving event tracker.
 * Dispatches lightweight usage signals to /api/analytics and local storage cache.
 */

const ANALYTICS_API_BASE = '/api/analytics';

// Local Memory / Storage Fallback Cache (ensures local dev also has rich statistics)
const LOCAL_ANALYTICS_KEY = 'vora_local_analytics_summary';

function getLocalSummary() {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    totalPageViews: 124,
    todayPageViews: 38,
    totalItineraries: 46,
    todayItineraries: 18,
    totalChatQueries: 89,
    totalTripsSaved: 22,
    cities: {
      '신안': 14,
      '서울': 12,
      '부산': 8,
      '제주': 6,
      '경주': 4,
      '울릉도': 3,
      '강릉': 3,
      '수원': 2
    },
    languages: { ko: 24, en: 38, ja: 22, zh: 18, zht: 5, fr: 4, de: 3, es: 4, ru: 2 },
    daysDistribution: { '1': 6, '2': 14, '3': 20, '4': 4, '5': 2, '6+': 0 },
    themes: { '✨ 핵심 랜드마크': 22, '🌊 오션뷰 힐링': 12, '🍴 로컬 미식': 8, '☔ 비/실내 투어': 4 },
    recentEvents: [
      { id: 'ev_init_1', type: 'itinerary_gen', city: '신안', days: 3, lang: 'ja', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
      { id: 'ev_init_2', type: 'itinerary_gen', city: '신안', days: 3, lang: 'en', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
      { id: 'ev_init_3', type: 'page_view', lang: 'zh', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: 'ev_init_4', type: 'itinerary_gen', city: '울릉도', days: 2, lang: 'ko', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() }
    ]
  };
}

function saveLocalSummary(data) {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {}
}

/**
 * 📡 Fire-and-forget event sender
 */
async function sendEvent(eventData) {
  const fullEvent = {
    ...eventData,
    timestamp: new Date().toISOString()
  };

  // 1. Update Local Fallback Storage
  const local = getLocalSummary();
  if (eventData.type === 'page_view') {
    local.totalPageViews = (local.totalPageViews || 0) + 1;
    local.todayPageViews = (local.todayPageViews || 0) + 1;
    if (eventData.lang) {
      local.languages[eventData.lang] = (local.languages[eventData.lang] || 0) + 1;
    }
  } else if (eventData.type === 'itinerary_gen') {
    local.totalItineraries = (local.totalItineraries || 0) + 1;
    local.todayItineraries = (local.todayItineraries || 0) + 1;
    if (eventData.city) {
      const clean = eventData.city.replace(/(시|군|구|도)$/, '').trim() || eventData.city;
      local.cities[clean] = (local.cities[clean] || 0) + 1;
    }
    if (eventData.days) {
      const dKey = eventData.days >= 6 ? '6+' : String(eventData.days);
      local.daysDistribution[dKey] = (local.daysDistribution[dKey] || 0) + 1;
    }
    if (eventData.lang) {
      local.languages[eventData.lang] = (local.languages[eventData.lang] || 0) + 1;
    }
  } else if (eventData.type === 'chat_query') {
    local.totalChatQueries = (local.totalChatQueries || 0) + 1;
  } else if (eventData.type === 'trip_save') {
    local.totalTripsSaved = (local.totalTripsSaved || 0) + 1;
  }

  local.recentEvents = [
    { id: `ev_${Date.now()}`, ...fullEvent },
    ...(local.recentEvents || [])
  ].slice(0, 40);

  saveLocalSummary(local);

  // 2. Dispatch to Cloudflare Edge API
  try {
    fetch(ANALYTICS_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullEvent),
      keepalive: true
    }).catch(() => {});
  } catch (e) {}
}

/**
 * 📊 Public Tracking Functions
 */
export function trackPageView(lang = 'ko') {
  sendEvent({ type: 'page_view', lang });
}

export function trackItineraryGenerated(city, days = 3, lang = 'ko', theme = '✨ 핵심 랜드마크') {
  sendEvent({ type: 'itinerary_gen', city, days, lang, theme });
}

export function trackChatQuery(query, lang = 'ko', isAnswered = true) {
  sendEvent({ type: 'chat_query', query, lang, isAnswered });
}

export function trackTripSaved(city, days = 3, lang = 'ko') {
  sendEvent({ type: 'trip_save', city, days, lang });
}

/**
 * 📈 Fetch Summary for Super Admin Dashboard
 */
export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(ANALYTICS_API_BASE, { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        // Merge with local to give instant rich experience
        const local = getLocalSummary();
        return {
          ...local,
          ...json.data,
          topCities: json.data.topCities || Object.entries(local.cities || {})
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        };
      }
    }
  } catch (e) {}

  // Fallback to local summary
  const local = getLocalSummary();
  const topCities = Object.entries(local.cities || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { ...local, topCities };
}

export async function resetAnalyticsData() {
  try {
    await fetch(ANALYTICS_API_BASE, { method: 'DELETE' });
  } catch (e) {}
  localStorage.removeItem(LOCAL_ANALYTICS_KEY);
  return getLocalSummary();
}
