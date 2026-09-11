/**
 * VORA AI - Nationwide Landmarks Gemini Enrichment Pipeline
 * Synthesizes multilingual titles, photo tips, local pro tips, vibe tags,
 * and transit access for core Korean landmarks using Google Gemini AI.
 * 
 * Usage: node scripts/enrichGeminiKnowledge.js [--limit=100] [--batchSize=5]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables if not already set
const envPath = path.join(ROOT_DIR, '.env');
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8');
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = val;
      }
    }
  }
}

const GEMINI_API_KEY = (
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  ''
).trim();

if (!GEMINI_API_KEY) {
  console.warn('⚠️ [WARN] GEMINI_API_KEY is not set. Enrichment will use safe fallbacks.');
}

const DETAILS_PATH = path.join(ROOT_DIR, 'data', 'korea_spots_details.json');
const SPOTS_PATH = path.join(ROOT_DIR, 'data', 'korea_tour_spots.json');
const ENRICHED_OUT_PATH = path.join(ROOT_DIR, 'data', 'korea_enriched_landmarks.json');

// Parse CLI flags
const args = process.argv.slice(2);
let limit = 150; // Top landmarks to enrich by default
let batchSize = 4;

for (const arg of args) {
  if (arg.startsWith('--limit=')) limit = parseInt(arg.split('=')[1], 10) || 150;
  if (arg.startsWith('--batchSize=')) batchSize = parseInt(arg.split('=')[1], 10) || 4;
}

// Active verified Gemini models
const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-pro-latest'
];

async function callGemini(prompt, retryCount = 0) {
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText);
        }
      } else if (res.status === 429 || res.status === 503) {
        console.warn(`⚠️ [Gemini ${model}] Busy (HTTP ${res.status}), waiting 6s...`);
        await new Promise(r => setTimeout(r, 6000));
        if (retryCount < 3) {
          return callGemini(prompt, retryCount + 1);
        }
      } else {
        const err = await res.text();
        console.warn(`⚠️ [Gemini ${model}] HTTP ${res.status}:`, err.slice(0, 150));
      }
    } catch (e) {
      console.warn(`⚠️ [Gemini ${model}] Error: ${e.message}, trying next...`);
    }
  }
  return null;
}

async function main() {
  console.log('🚀 [Gemini Knowledge Enrichment Pipeline] Starting...');
  console.log(`📁 Loading core landmark details from: ${DETAILS_PATH}`);

  if (!fs.existsSync(DETAILS_PATH) || !fs.existsSync(SPOTS_PATH)) {
    console.error('❌ Required data files do not exist. Please run harvest first.');
    process.exit(1);
  }

  const detailsMap = JSON.parse(fs.readFileSync(DETAILS_PATH, 'utf8'));
  const spotsList = JSON.parse(fs.readFileSync(SPOTS_PATH, 'utf8'));

  // Map spots by contentId for quick metadata access (region, address, lat, lng)
  const spotsById = new Map();
  for (const s of spotsList) {
    spotsById.set(String(s.contentId), s);
  }

  // Load existing enriched records for incremental update / resume
  let enrichedMap = {};
  if (fs.existsSync(ENRICHED_OUT_PATH)) {
    try {
      enrichedMap = JSON.parse(fs.readFileSync(ENRICHED_OUT_PATH, 'utf8'));
      console.log(`ℹ️ Loaded existing ${Object.keys(enrichedMap).length} enriched landmarks.`);
    } catch (e) {
      enrichedMap = {};
    }
  }

  // Pick target landmarks: prioritised by spots that have details and valid images
  const targetIds = Object.keys(detailsMap).filter(id => {
    const s = spotsById.get(id);
    return s && s.image && s.image.startsWith('http');
  });

  const queue = targetIds.filter(id => !enrichedMap[id]).slice(0, limit);

  console.log(`🎯 Total candidates: ${targetIds.length} | To enrich in this run: ${queue.length}`);

  if (queue.length === 0) {
    console.log('✅ All targeted landmarks are already enriched! Nothing to do.');
    return;
  }

  let successCount = 0;

  for (let i = 0; i < queue.length; i += batchSize) {
    const chunk = queue.slice(i, i + batchSize);
    console.log(`\n⏳ Processing Batch [${Math.floor(i / batchSize) + 1}/${Math.ceil(queue.length / batchSize)}] (Items ${i + 1}~${Math.min(i + batchSize, queue.length)})...`);

    const itemsForPrompt = chunk.map(id => {
      const d = detailsMap[id];
      const s = spotsById.get(id);
      return {
        contentId: id,
        title_ko: d.title || s?.title,
        region: s?.region || '',
        address: s?.address || s?.addr1 || '',
        category: s?.category || '관광명소'
      };
    });

    const prompt = `You are Vora, Korea's top AI travel expert for international visitors.
Given the following list of Korean tourism landmarks, produce high-value tourist metadata formatted as a JSON array of objects.

Input Landmarks:
${JSON.stringify(itemsForPrompt, null, 2)}

Return a strict JSON array where each object has:
- "contentId": (string) matching the input contentId
- "title_en": (string) Accurate English landmark name
- "title_ja": (string) Natural Japanese landmark name
- "title_zh": (string) Simplified Chinese landmark name
- "photoTip_en": (string) 1-2 practical tips in English on the best camera angle, timing/lighting, or photogenic spots
- "localProTip_en": (string) 1-2 insider local tips in English (e.g. hanbok discounts, quietest hours, must-see ceremonies, ticketing hacks)
- "vibeTags": (array of 3-4 strings) English hashtag labels (e.g. ["#HistoricPalace", "#HanbokExperience", "#MustVisit"])
- "transitAccess_en": (string) Concise public transit directions in English (e.g. "Subway Line 3 Anguk Stn Exit 3, 5 min walk" or "Direct bus from Seoul Stn")

Provide authentic, accurate, and practical information.`;

    const result = await callGemini(prompt);

    if (Array.isArray(result)) {
      for (const item of result) {
        if (item.contentId) {
          enrichedMap[String(item.contentId)] = {
            ...item,
            enrichedAt: new Date().toISOString()
          };
          successCount++;
        }
      }
      // Save progress incrementally after every batch
      fs.writeFileSync(ENRICHED_OUT_PATH, JSON.stringify(enrichedMap, null, 2), 'utf8');
    } else {
      console.warn(`  ⚠️ Batch returned invalid format, skipping chunk.`);
    }

    // Gentle throttle to respect free tier quota
    await new Promise(r => setTimeout(r, 3500));
  }

  console.log(`\n🎉 [Enrichment Complete] Successfully enriched ${successCount} landmarks!`);
  console.log(`💾 Saved to: ${ENRICHED_OUT_PATH} (Total enriched records: ${Object.keys(enrichedMap).length})`);
}

/**
 * ⚡ Public Export: Enrich a small batch of spots on demand (e.g. from delta sync)
 */
export async function enrichSpotsWithGemini(items = []) {
  if (!items || items.length === 0) return [];
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ [Gemini Enrichment] GEMINI_API_KEY is not set. Generating safe fallbacks.');
    return items.map(createSafeFallback);
  }

  const prompt = `You are Vora, Korea's top AI travel expert for international visitors.
Given the following list of Korean tourism landmarks, produce high-value tourist metadata formatted as a JSON array of objects.

Input Landmarks:
${JSON.stringify(items, null, 2)}

Return a strict JSON array where each object has:
- "contentId": (string) matching the input contentId
- "title_en": (string) Accurate English landmark name
- "title_ja": (string) Natural Japanese landmark name
- "title_zh": (string) Simplified Chinese landmark name
- "photoTip_en": (string) 1-2 practical tips in English on the best camera angle, timing/lighting, or photogenic spots
- "localProTip_en": (string) 1-2 insider local tips in English (e.g. hanbok discounts, quietest hours, must-see ceremonies, ticketing hacks)
- "vibeTags": (array of 3-4 strings) English hashtag labels (e.g. ["#HistoricPalace", "#HanbokExperience", "#MustVisit"])
- "transitAccess_en": (string) Concise public transit directions in English (e.g. "Subway Line 3 Anguk Stn Exit 3, 5 min walk" or "Direct bus from Seoul Stn")

Provide authentic, accurate, and practical information.`;

  try {
    const result = await callGemini(prompt);
    if (Array.isArray(result) && result.length > 0) {
      return result.map(resItem => {
        const orig = items.find(x => String(x.contentId) === String(resItem.contentId)) || {};
        return {
          contentId: String(resItem.contentId || orig.contentId),
          title_en: resItem.title_en || orig.title_ko || '',
          title_ja: resItem.title_ja || orig.title_ko || '',
          title_zh: resItem.title_zh || orig.title_ko || '',
          photoTip_en: resItem.photoTip_en || 'Capture great landscape memories during golden hour before sunset.',
          localProTip_en: resItem.localProTip_en || 'Morning visits offer quiet ambiance and unobstructed photo opportunities.',
          vibeTags: Array.isArray(resItem.vibeTags) && resItem.vibeTags.length > 0 ? resItem.vibeTags : ['#Scenic', '#KoreaTravel', '#MustVisit'],
          transitAccess_en: resItem.transitAccess_en || 'Easily accessible via local subway and public bus transit.',
          enrichedAt: new Date().toISOString()
        };
      });
    }
  } catch (err) {
    console.warn(`⚠️ [Gemini Enrichment] Failed to call Gemini: ${err.message}. Using fallbacks.`);
  }

  return items.map(createSafeFallback);
}

function createSafeFallback(item) {
  return {
    contentId: String(item.contentId),
    title_en: item.title_ko || 'Scenic Landmark',
    title_ja: item.title_ko || '名所',
    title_zh: item.title_ko || '名胜',
    photoTip_en: 'Capture great landscape memories during golden hour before sunset.',
    localProTip_en: 'Morning visits offer quiet ambiance and unobstructed photo opportunities.',
    vibeTags: ['#Scenic', '#KoreaTravel', '#MustVisit'],
    transitAccess_en: 'Easily accessible via local subway and public bus transit.',
    enrichedAt: new Date().toISOString()
  };
}

// Run main if called directly from CLI
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  main().catch(err => {
    console.error('💥 Fatal error in enrichment script:', err);
    process.exit(1);
  });
}

