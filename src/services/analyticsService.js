/**
 * analyticsService.js - VORA Telemetry & Super Admin Analytics Client
 * 
 * Non-blocking, privacy-preserving event tracker.
 * Dispatches lightweight usage signals to /api/analytics and local storage cache.
 */

const ANALYTICS_API_BASE = '/api/analytics';

// Local Memory / Storage Fallback Cache (ensures local dev also has rich statistics)
const LOCAL_ANALYTICS_KEY = 'vora_local_analytics_summary';

function getEmptyDailyHistory() {
  const history = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    history[dateStr] = { pageViews: 0, itineraries: 0, chats: 0, saves: 0 };
  }
  return history;
}

function getLocalSummary() {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.dailyHistory) {
        parsed.dailyHistory = getEmptyDailyHistory();
      }
      return parsed;
    }
  } catch (e) {}

  return {
    totalPageViews: 0,
    todayPageViews: 0,
    totalItineraries: 0,
    todayItineraries: 0,
    totalChatQueries: 0,
    totalTripsSaved: 0,
    cities: {},
    languages: { ko: 0, en: 0, ja: 0, zh: 0, zht: 0, fr: 0, de: 0, es: 0, ru: 0 },
    daysDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6+': 0 },
    themes: {},
    dailyHistory: getEmptyDailyHistory(),
    recentEvents: []
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
  const now = new Date();
  const currentDate = now.toISOString().slice(0, 10);
  const fullEvent = {
    ...eventData,
    timestamp: now.toISOString()
  };

  // 1. Update Local Fallback Storage
  const local = getLocalSummary();
  if (!local.dailyHistory) local.dailyHistory = generateSampleDailyHistory();
  if (!local.dailyHistory[currentDate]) {
    local.dailyHistory[currentDate] = { pageViews: 0, itineraries: 0, chats: 0, saves: 0 };
  }
  const dayStats = local.dailyHistory[currentDate];

  if (eventData.type === 'page_view') {
    local.totalPageViews = (local.totalPageViews || 0) + 1;
    local.todayPageViews = (local.todayPageViews || 0) + 1;
    dayStats.pageViews += 1;
    if (eventData.lang) {
      local.languages[eventData.lang] = (local.languages[eventData.lang] || 0) + 1;
    }
  } else if (eventData.type === 'itinerary_gen') {
    local.totalItineraries = (local.totalItineraries || 0) + 1;
    local.todayItineraries = (local.todayItineraries || 0) + 1;
    dayStats.itineraries += 1;
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
    dayStats.chats += 1;
  } else if (eventData.type === 'trip_save') {
    local.totalTripsSaved = (local.totalTripsSaved || 0) + 1;
    dayStats.saves += 1;
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
        const local = getLocalSummary();
        return {
          ...local,
          ...json.data,
          dailyHistory: (json.data.dailyHistory && Object.keys(json.data.dailyHistory).length > 0) 
            ? json.data.dailyHistory 
            : local.dailyHistory,
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
