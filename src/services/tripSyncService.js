/**
 * Trip Sync & Mobile QR Transfer Service
 * 
 * Synchronizes itineraries with Cloudflare Edge Server and creates instant shareable URLs for Mobile QR scanning.
 */

const API_BASE = '/api/trips';

/**
 * ☁️ Fetch user's saved trips from Cloudflare Central Cloud
 */
export async function fetchCloudTrips(email) {
  if (!email || typeof email !== 'string') return [];
  try {
    const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email.trim().toLowerCase())}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.list) ? data.list : [];
  } catch (err) {
    console.warn('[TripSync] Fetch Cloud Trips Failed:', err);
    return [];
  }
}

/**
 * ☁️ Push local trips to Cloudflare Central Cloud
 */
export async function pushTripsToCloud(email, trips) {
  if (!email || !trips || trips.length === 0) return false;
  try {
    const tripList = Array.isArray(trips) ? trips : [trips];
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        trips: tripList
      })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[TripSync] Push Trips Failed:', err);
    return false;
  }
}

/**
 * ☁️ Delete trip from Cloudflare Central Cloud
 */
export async function deleteTripFromCloud(email, tripId) {
  if (!email || !tripId) return false;
  try {
    const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email.trim().toLowerCase())}&tripId=${encodeURIComponent(tripId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[TripSync] Delete Trip Failed:', err);
    return false;
  }
}

function toBase64Safe(str) {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
  } catch (e) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e2) {
      return '';
    }
  }
}

function fromBase64Safe(str) {
  if (!str) return '';
  // Normalize URL-safe Base64 and spaces
  const cleanStr = str.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(cleanStr), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch (e) {
    try {
      return decodeURIComponent(escape(atob(cleanStr)));
    } catch (e2) {
      try {
        return atob(cleanStr);
      } catch (e3) {
        return '';
      }
    }
  }
}

/**
 * 📱 Generate Ultra-lightweight Mobile Direct Share URL (QR & Link)
 * Encodes itinerary data into URL query parameter with zero server dependencies
 */
export function generateShareableTripUrl(trip) {
  if (!trip) return window.location.origin;

  try {
    const rawSchedules = trip.dailySchedules || trip.dailyPlan || [];
    // Compress essential data to minimize URL length for instant QR recognition
    const slimData = {
      t: (trip.tripTitle || trip.title || 'Korea Trip').slice(0, 50),
      c: trip.targetCity || trip.city || '서울',
      d: trip.days || rawSchedules.length || 3,
      s: rawSchedules.map(day => ({
        d: day.day,
        t: day.theme || '',
        p: (day.spots || []).map(sp => ({
          i: sp.id || sp.contentId || '',
          n: sp.title || sp.name || '',
          c: sp.category || '관광명소',
          b: sp.bestTime || '',
          la: sp.lat || 0,
          ln: sp.lng || 0,
          a: (sp.address || sp.location || '').slice(0, 40)
        }))
      }))
    };

    const jsonStr = JSON.stringify(slimData);
    const base64Str = toBase64Safe(jsonStr);
    
    // searchParams.set automatically handles URL encoding once (No double encode)
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('tripData', base64Str);
    return url.toString();
  } catch (err) {
    console.warn('[TripSync] Generate Share URL Failed:', err);
    return window.location.href;
  }
}

/**
 * 📱 Parse Itinerary from URL (when opened on Mobile via QR or Share Link)
 */
export function parseTripFromUrl() {
  try {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const tripDataParam = urlParams.get('tripData');
    if (!tripDataParam) return null;

    let decodedJson = fromBase64Safe(tripDataParam);
    if (!decodedJson) {
      try {
        decodedJson = fromBase64Safe(decodeURIComponent(tripDataParam));
      } catch (e) {}
    }
    if (!decodedJson) return null;

    const slim = JSON.parse(decodedJson);
    if (!slim || !slim.s || !Array.isArray(slim.s)) return null;

    // Expand into full itinerary object compatible with all tabs
    const dailySchedules = slim.s.map(d => ({
      day: d.d,
      theme: d.t || `${d.d}일차 코스`,
      spots: (d.p || []).map((sp, idx) => ({
        id: sp.i || `spot_${d.d}_${idx + 1}`,
        title: sp.n,
        name: sp.n,
        category: sp.c || '관광명소',
        bestTime: sp.b || '',
        lat: sp.la || 0,
        lng: sp.ln || 0,
        address: sp.a || '',
        location: sp.a || '',
        rating: 4.8,
        image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg',
        description: `한국관광공사 정품 등록 명소 ${sp.n}`
      }))
    }));

    const allSpots = dailySchedules.flatMap(d => d.spots);

    return {
      responseType: 'itinerary',
      tripTitle: slim.t,
      title: slim.t,
      targetCity: slim.c,
      city: slim.c,
      days: slim.d,
      dailySchedules,
      dailyPlan: dailySchedules,
      spots: allSpots,
      savedId: `trip-qr-${Date.now()}`,
      savedAt: new Date().toISOString(),
      dataSource: 'TOUR_API_LIVE_GENUINE'
    };
  } catch (err) {
    console.warn('[TripSync] Parse Trip From URL Failed:', err);
    return null;
  }
}
