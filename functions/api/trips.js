/**
 * Cloudflare Pages Functions: VORA Cloud Trip Sync Live Serverless API (/api/trips)
 * 
 * Production-grade Edge Backend for TravelKorea.
 * Seamlessly syncs saved travel itineraries between PC (Web) and Mobile devices in real-time.
 * Supports:
 * 1. GET /api/trips?email=... : Fetch user's saved itineraries
 * 2. POST /api/trips : Save/Update itineraries for a user email
 * 3. DELETE /api/trips?email=...&tripId=... : Delete an itinerary
 */

// Edge In-Memory Storage Fallback (per Edge node runtime)
const inMemoryUserTrips = new Map();

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
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();

  if (!email) {
    return new Response(JSON.stringify({ success: false, message: 'Email parameter required' }), {
      status: 400,
      headers: CORS_HEADERS
    });
  }

  try {
    // 1. Try Cloudflare KV Storage first
    if (env && env.VORA_KV) {
      const kvKey = `user_trips_${email}`;
      const kvData = await env.VORA_KV.get(kvKey, { type: 'json' });
      if (Array.isArray(kvData)) {
        return new Response(JSON.stringify({ success: true, list: kvData, source: 'KV' }), {
          headers: CORS_HEADERS
        });
      }
    }
  } catch (e) {
    console.warn('[Trips API KV Read Error]', e);
  }

  // 2. In-Memory fallback
  const memList = inMemoryUserTrips.get(email) || [];
  return new Response(JSON.stringify({ success: true, list: memList, source: 'MEMORY' }), {
    headers: CORS_HEADERS
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const trips = Array.isArray(body.trips) ? body.trips : (body.trip ? [body.trip] : null);

    if (!email || !trips) {
      return new Response(JSON.stringify({ success: false, message: 'Email and trips required' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    const isOverwrite = Boolean(body.overwrite);

    // 1. Try Cloudflare KV Storage
    if (env && env.VORA_KV) {
      const kvKey = `user_trips_${email}`;
      let finalTrips = trips;

      if (!isOverwrite) {
        let existing = [];
        try {
          const kvExisting = await env.VORA_KV.get(kvKey, { type: 'json' });
          if (Array.isArray(kvExisting)) existing = kvExisting;
        } catch (e) {}

        // Merge new trips with existing
        const tripMap = new Map();
        for (const t of existing) {
          const k = t.savedId || t.tripTitle || t.id;
          if (k) tripMap.set(k, t);
        }
        for (const t of trips) {
          const k = t.savedId || t.tripTitle || t.id;
          if (k) tripMap.set(k, t);
        }
        finalTrips = Array.from(tripMap.values());
      }

      await env.VORA_KV.put(kvKey, JSON.stringify(finalTrips), {
        expirationTtl: 60 * 60 * 24 * 90 // 90 days retention
      });

      inMemoryUserTrips.set(email, finalTrips);
      return new Response(JSON.stringify({ success: true, count: finalTrips.length, source: 'KV' }), {
        headers: CORS_HEADERS
      });
    }

    // 2. In-Memory fallback
    let finalMemTrips = trips;
    if (!isOverwrite) {
      let existingMem = inMemoryUserTrips.get(email) || [];
      const tripMap = new Map();
      for (const t of existingMem) {
        const k = t.savedId || t.tripTitle || t.id;
        if (k) tripMap.set(k, t);
      }
      for (const t of trips) {
        const k = t.savedId || t.tripTitle || t.id;
        if (k) tripMap.set(k, t);
      }
      finalMemTrips = Array.from(tripMap.values());
    }
    inMemoryUserTrips.set(email, finalMemTrips);

    return new Response(JSON.stringify({ success: true, count: finalMemTrips.length, source: 'MEMORY' }), {
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  const tripId = url.searchParams.get('tripId') || '';

  if (!email || !tripId) {
    return new Response(JSON.stringify({ success: false, message: 'Email and tripId required' }), {
      status: 400,
      headers: CORS_HEADERS
    });
  }

  try {
    // 1. KV Storage Delete
    if (env && env.VORA_KV) {
      const kvKey = `user_trips_${email}`;
      const kvExisting = await env.VORA_KV.get(kvKey, { type: 'json' });
      if (Array.isArray(kvExisting)) {
        const filtered = kvExisting.filter(t => (t.savedId || t.tripTitle || t.id) !== tripId);
        await env.VORA_KV.put(kvKey, JSON.stringify(filtered));
        inMemoryUserTrips.set(email, filtered);
        return new Response(JSON.stringify({ success: true, remainingCount: filtered.length }), {
          headers: CORS_HEADERS
        });
      }
    }
  } catch (e) {}

  // 2. In-Memory Delete
  const memExisting = inMemoryUserTrips.get(email) || [];
  const filteredMem = memExisting.filter(t => (t.savedId || t.tripTitle || t.id) !== tripId);
  inMemoryUserTrips.set(email, filteredMem);

  return new Response(JSON.stringify({ success: true, remainingCount: filteredMem.length }), {
    headers: CORS_HEADERS
  });
}
