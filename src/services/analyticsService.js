/**
 * Vora AI Admin Analytics & Cost Tracker Service
 * Tracks Daily Visitors, Chats, Recommendations, Video Ad Views, Google Logins,
 * Token Usage, and Estimated API Costs ($ / ￦).
 */

const STORAGE_KEY = 'travelkorea_analytics_daily_v1';

export function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadAnalyticsData() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Failed to load analytics data:', e);
    return {};
  }
}

export function saveAnalyticsData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save analytics data:', e);
  }
}

export function getTodayStats() {
  const data = loadAnalyticsData();
  const today = getTodayDateKey();
  
  if (!data[today]) {
    data[today] = {
      date: today,
      visitorsCount: 1,
      chatsCount: 0,
      recommendationsCount: 0,
      videoAdsWatchedCount: 0,
      googleLoginsCount: 0,
      guestUsersCount: 1,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      estimatedCostUSD: 0,
      estimatedCostKRW: 0
    };
    saveAnalyticsData(data);
  }

  return data[today];
}

export function logAnalyticsEvent(eventType, payload = {}) {
  const data = loadAnalyticsData();
  const today = getTodayDateKey();
  const current = data[today] || getTodayStats();

  if (eventType === 'VISIT') {
    current.visitorsCount += 1;
    if (payload.isGoogleUser) {
      current.googleLoginsCount += 1;
    } else {
      current.guestUsersCount += 1;
    }
  } else if (eventType === 'CHAT') {
    current.chatsCount += 1;
    const inTokens = payload.inputTokens || 120;
    const outTokens = payload.outputTokens || 320;
    current.totalInputTokens += inTokens;
    current.totalOutputTokens += outTokens;
    current.recommendationsCount += 1;

    // Calculate Estimated Cost (Gemini Flash: $0.075/1M in, $0.30/1M out)
    const usdCost = ((current.totalInputTokens / 1000000) * 0.075) + ((current.totalOutputTokens / 1000000) * 0.30);
    current.estimatedCostUSD = Number(usdCost.toFixed(4));
    current.estimatedCostKRW = Math.round(usdCost * 1380); // USD/KRW ~ 1380
  } else if (eventType === 'VIDEO_AD') {
    current.videoAdsWatchedCount += 1;
  } else if (eventType === 'LOGIN') {
    current.googleLoginsCount += 1;
  }

  data[today] = current;
  saveAnalyticsData(data);
  return current;
}
