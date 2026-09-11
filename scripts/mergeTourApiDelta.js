/**
 * ⚡ VORA AI - TourAPI 4.0 Public Data Regular Delta Sync & Merge Pipeline
 * 
 * Synchronizes new, updated, and deleted tourism spots from Korea Tourism Organization (TourAPI 4.0).
 * Implements the 3 Core Principles:
 *  1. INSERT: Validated spots are enriched via Gemini AI (7 metadata fields) and registered.
 *  2. UPDATE: Selective partial patch only (preserves landmark tier, score, and signature tags).
 *  3. DELETE: Deactivates/removes hidden or closed spots (showflag = 0).
 * 
 * Usage:
 *  node scripts/mergeTourApiDelta.js [--days=1] [--dryRun] [--force]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enrichSpotsWithGemini } from './enrichGeminiKnowledge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Load environment variables
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

const DEFAULT_SERVICE_KEY = 'VAK23UX%2Bt67b9c5S67sgJm5o12DUbkAB5rnysV4bpaoUSIcPj%2FdGlqRQoFRQyrVX8yWZSuW2TqSEBRMqqLzrVQ%3D%3D';

const TOUR_API_KEY = (
  process.env.KOREA_TOUR_API_KEY ||
  process.env.VITE_KOREA_TOUR_API_KEY ||
  DEFAULT_SERVICE_KEY
).trim();

// CLI Arguments
const args = process.argv.slice(2);
let lookbackDays = 1; // Default: 1 day (yesterday to now)
let dryRun = false;
let forceSync = false;

for (const arg of args) {
  if (arg.startsWith('--days=')) lookbackDays = parseInt(arg.split('=')[1], 10) || 1;
  if (arg === '--dryRun' || arg === '--dry-run') dryRun = true;
  if (arg === '--force') forceSync = true;
}

// File Paths
const PATH_TOUR_SPOTS = path.join(DATA_DIR, 'korea_tour_spots.json');
const PATH_DETAILS = path.join(DATA_DIR, 'korea_spots_details.json');
const PATH_ENRICHED = path.join(DATA_DIR, 'korea_enriched_landmarks.json');
const PATH_FESTIVALS = path.join(DATA_DIR, 'korea_festival_spots.json');
const PATH_FOOD = path.join(DATA_DIR, 'korea_food_spots.json');
const PATH_STAYS = path.join(DATA_DIR, 'korea_stay_spots.json');

/**
 * Get Korean Standard Time (KST, UTC+9) Date formatted as YYYYMMDDHHMMSS
 */
function getKstDateString(daysAgo = 1) {
  const now = new Date();
  // Adjust to KST (+9 hours)
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000) - (daysAgo * 24 * 60 * 60 * 1000));
  
  const y = kstTime.getUTCFullYear();
  const m = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kstTime.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}000000`;
}

function getKstTodayYmd() {
  const now = new Date();
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const y = kstTime.getUTCFullYear();
  const m = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kstTime.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Fetch delta sync items from TourAPI 4.0 areaBasedSyncList2
 */
async function fetchSyncList(contentTypeId, modifiedTime, showFlag = 1, numOfRows = 100) {
  if (!TOUR_API_KEY) {
    console.warn('⚠️ [TourAPI Delta] No TOUR_API_KEY configured. Skipping remote fetch.');
    return [];
  }

  // Handle pre-encoded vs raw service keys to avoid double encoding
  const finalKey = TOUR_API_KEY.includes('%') ? TOUR_API_KEY : encodeURIComponent(TOUR_API_KEY);
  const endpoint = `https://apis.data.go.kr/B551011/KorService2/areaBasedSyncList2`;
  const url = `${endpoint}?serviceKey=${finalKey}&numOfRows=${numOfRows}&pageNo=1&MobileOS=ETC&MobileApp=TravelKorea&_type=json&modifiedtime=${modifiedTime}&showflag=${showFlag}${contentTypeId ? `&contentTypeId=${contentTypeId}` : ''}`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TravelKorea-DeltaSync/1.0' } });
    if (!res.ok) {
      console.warn(`⚠️ [TourAPI Delta] HTTP ${res.status} for contentTypeId=${contentTypeId || 'all'}, showflag=${showFlag}`);
      return [];
    }
    const data = await res.json();
    const items = data?.response?.body?.items?.item;
    if (Array.isArray(items)) return items;
    if (items && typeof items === 'object') return [items];
    return [];
  } catch (e) {
    console.warn(`⚠️ [TourAPI Delta] Network error: ${e.message}`);
    return [];
  }
}

/**
 * Validate coordinates for South Korea mainland & islands
 */
function isValidKoreaCoord(lat, lng) {
  const fLat = parseFloat(lat);
  const fLng = parseFloat(lng);
  if (isNaN(fLat) || isNaN(fLng)) return false;
  return fLat >= 33.0 && fLat <= 39.0 && fLng >= 124.0 && fLng <= 132.0;
}

/**
 * Filter out dummy or non-tourist spots (restrooms, parking, etc.)
 */
function isGenuineTouristSpot(title = '') {
  const t = (title || '').trim();
  if (!t || t.length < 2) return false;
  const bannedKeywords = ['화장실', '주차장', '관리사무소', '임시', '테스트', '분리수거', '공중화장실'];
  return !bannedKeywords.some(bk => t.includes(bk));
}

async function runDeltaSync() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 [TourAPI 4.0] Daily Delta Merge & Sync Pipeline Starting');
  console.log(`📅 Lookback Window: Last ${lookbackDays} Day(s) (From KST: ${getKstDateString(lookbackDays)})`);
  console.log(`🔒 Dry Run Mode: ${dryRun ? 'ON (No files modified)' : 'OFF (Live Sync)'}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Load existing datasets
  let tourSpots = fs.existsSync(PATH_TOUR_SPOTS) ? JSON.parse(fs.readFileSync(PATH_TOUR_SPOTS, 'utf8')) : [];
  let detailsMap = fs.existsSync(PATH_DETAILS) ? JSON.parse(fs.readFileSync(PATH_DETAILS, 'utf8')) : {};
  let enrichedMap = fs.existsSync(PATH_ENRICHED) ? JSON.parse(fs.readFileSync(PATH_ENRICHED, 'utf8')) : {};
  let festivalSpots = fs.existsSync(PATH_FESTIVALS) ? JSON.parse(fs.readFileSync(PATH_FESTIVALS, 'utf8')) : [];
  let foodSpots = fs.existsSync(PATH_FOOD) ? JSON.parse(fs.readFileSync(PATH_FOOD, 'utf8')) : [];
  let staySpots = fs.existsSync(PATH_STAYS) ? JSON.parse(fs.readFileSync(PATH_STAYS, 'utf8')) : [];

  console.log(`📊 Current DB Stats:`);
  console.log(`   - Tour Spots (12, 14, 28) : ${tourSpots.length.toLocaleString()} spots`);
  console.log(`   - Spots Details          : ${Object.keys(detailsMap).length.toLocaleString()} details`);
  console.log(`   - Enriched Landmarks     : ${Object.keys(enrichedMap).length.toLocaleString()} records`);
  console.log(`   - Festivals (15)         : ${festivalSpots.length.toLocaleString()} festivals`);
  console.log(`   - Nearby Food (39)       : ${foodSpots.length.toLocaleString()} restaurants`);
  console.log(`   - Nearby Stays (32)      : ${staySpots.length.toLocaleString()} stays\n`);

  const kstThreshold = getKstDateString(lookbackDays);
  const kstToday = getKstTodayYmd();

  // Create fast lookup maps by contentId
  const tourSpotsMap = new Map(tourSpots.map(s => [String(s.contentId), s]));
  const festivalSpotsMap = new Map(festivalSpots.map(f => [String(f.contentId || f.contentid), f]));
  const foodSpotsMap = new Map(foodSpots.map(f => [String(f.contentId || f.contentid), f]));
  const staySpotsMap = new Map(staySpots.map(s => [String(s.contentId || s.contentid), s]));

  const summary = {
    tourSpots: { inserted: 0, updated: 0, deleted: 0 },
    festivals: { inserted: 0, updated: 0, expired: 0, deleted: 0 },
    food: { inserted: 0, updated: 0, deleted: 0 },
    stays: { inserted: 0, updated: 0, deleted: 0 }
  };

  // 1. Fetch Sync Updates for Main Tour Categories (12: Sightseeing, 14: Culture, 28: Leports)
  console.log('📡 [Step 1] Fetching Delta Updates for Tour Spots (12, 14, 28)...');
  const targetCategories = ['12', '14', '28'];
  const newSpotsToEnrich = [];

  for (const catId of targetCategories) {
    // 1A. Modified & New spots (showflag=1)
    const activeDeltas = await fetchSyncList(catId, kstThreshold, 1, 100);
    console.log(`   🔍 Category ${catId}: Received ${activeDeltas.length} active change records.`);

    for (const item of activeDeltas) {
      const cId = String(item.contentid);
      const lat = parseFloat(item.mapy);
      const lng = parseFloat(item.mapx);

      if (!isValidKoreaCoord(lat, lng) || !isGenuineTouristSpot(item.title)) {
        continue;
      }

      if (tourSpotsMap.has(cId)) {
        // [UPDATE] Selective Partial Patch: Preserve tier, landmarkKey, customTags
        const existing = tourSpotsMap.get(cId);
        existing.title = item.title || existing.title;
        existing.address = item.addr1 || existing.address;
        existing.addr1 = item.addr1 || existing.addr1;
        existing.addr2 = item.addr2 || existing.addr2;
        if (item.firstimage) existing.image = item.firstimage;
        if (item.tel) existing.tel = item.tel;
        existing.modifiedTime = item.modifiedtime || existing.modifiedTime;
        existing.lat = lat;
        existing.lng = lng;
        summary.tourSpots.updated++;
      } else {
        // [INSERT] New Spot
        const newSpot = {
          contentId: cId,
          title: item.title,
          category: catId === '14' ? '문화시설' : (catId === '28' ? '레포츠' : '관광명소'),
          contentTypeId: catId,
          theme: item.cat3 || 'A02010100',
          region: (item.addr1 || '').split(' ')[0] || '기타',
          areaCode: parseInt(item.areacode, 10) || 1,
          sigunguCode: parseInt(item.sigungucode, 10) || 1,
          lat: lat,
          lng: lng,
          address: item.addr1 || '',
          addr1: item.addr1 || '',
          addr2: item.addr2 || '',
          image: item.firstimage || item.firstimage2 || '',
          tel: item.tel || '',
          modifiedTime: item.modifiedtime || kstThreshold,
          rating: 4.8,
          duration: catId === '14' ? 90 : 80,
          dataSource: 'TOUR_API_DELTA_SYNC'
        };

        tourSpotsMap.set(cId, newSpot);
        summary.tourSpots.inserted++;

        // Add basic detail record
        if (!detailsMap[cId]) {
          detailsMap[cId] = {
            contentId: cId,
            title: item.title,
            overview: `${item.title}의 대표적인 관광 명소입니다.`,
            useTime: '상시 개방',
            restDate: '연중무휴',
            parking: '가능',
            homepage: null
          };
        }

        // Queue for Gemini AI Enrichment if it has image
        if (newSpot.image) {
          newSpotsToEnrich.push({
            contentId: cId,
            title_ko: item.title,
            region: newSpot.region,
            address: newSpot.address,
            category: newSpot.category
          });
        }
      }
    }

    // 1B. Deleted spots (showflag=0)
    const deletedDeltas = await fetchSyncList(catId, kstThreshold, 0, 50);
    if (deletedDeltas.length > 0) {
      console.log(`   🗑️ Category ${catId}: Found ${deletedDeltas.length} deletion/closed records.`);
      for (const item of deletedDeltas) {
        const cId = String(item.contentid);
        if (tourSpotsMap.has(cId)) {
          tourSpotsMap.delete(cId);
          delete detailsMap[cId];
          delete enrichedMap[cId];
          summary.tourSpots.deleted++;
        }
      }
    }
  }

  // 2. Gemini AI Enrichment for New Spots (7 Smart Columns)
  if (newSpotsToEnrich.length > 0) {
    console.log(`\n🤖 [Step 2] Enriching ${newSpotsToEnrich.length} New Spots with Gemini AI...`);
    try {
      const enrichedBatch = await enrichSpotsWithGemini(newSpotsToEnrich);
      for (const enr of enrichedBatch) {
        if (enr && enr.contentId) {
          enrichedMap[String(enr.contentId)] = enr;
          console.log(`   ✨ Enriched: [${enr.contentId}] ${enr.title_en}`);
        }
      }
    } catch (e) {
      console.warn(`⚠️ [Gemini Enrichment] Encountered error: ${e.message}. Safe fallbacks retained.`);
    }
  }

  // 3. Fetch Festival Updates (15) & Auto-Clean Expired
  console.log('\n🎪 [Step 3] Syncing Festivals (15) & Cleaning Expired Events...');
  const activeFestivals = await fetchSyncList('15', kstThreshold, 1, 50);
  for (const item of activeFestivals) {
    const cId = String(item.contentid);
    const lat = parseFloat(item.mapy);
    const lng = parseFloat(item.mapx);
    if (!isValidKoreaCoord(lat, lng)) continue;

    const festItem = {
      contentId: cId,
      contentid: cId,
      title: item.title,
      category: '축제/공연',
      contentTypeId: '15',
      eventstartdate: item.eventstartdate || '',
      eventenddate: item.eventenddate || '',
      address: item.addr1 || '',
      addr1: item.addr1 || '',
      image: item.firstimage || item.firstimage2 || '',
      lat: lat,
      lng: lng,
      tel: item.tel || '',
      modifiedTime: item.modifiedtime || kstThreshold
    };

    if (festivalSpotsMap.has(cId)) {
      Object.assign(festivalSpotsMap.get(cId), festItem);
      summary.festivals.updated++;
    } else {
      festivalSpotsMap.set(cId, festItem);
      summary.festivals.inserted++;
    }
  }

  // Clean expired festivals (eventenddate < today)
  for (const [id, f] of festivalSpotsMap.entries()) {
    if (f.eventenddate && f.eventenddate < kstToday) {
      festivalSpotsMap.delete(id);
      summary.festivals.expired++;
    }
  }

  // 4. Fetch Nearby Food Updates (39) - Quality filter with mandatory photos
  console.log('\n🍜 [Step 4] Syncing Nearby Food Spots (39) with Photo Filter...');
  const activeFoods = await fetchSyncList('39', kstThreshold, 1, 50);
  for (const item of activeFoods) {
    const cId = String(item.contentid);
    const lat = parseFloat(item.mapy);
    const lng = parseFloat(item.mapx);
    // Quality rule: Must have image and valid coordinates
    if (!isValidKoreaCoord(lat, lng) || !item.firstimage) continue;

    const foodItem = {
      contentId: cId,
      contentid: cId,
      title: item.title,
      category: '음식점',
      contentTypeId: '39',
      address: item.addr1 || '',
      addr1: item.addr1 || '',
      image: item.firstimage,
      lat: lat,
      lng: lng,
      tel: item.tel || '',
      modifiedTime: item.modifiedtime || kstThreshold
    };

    if (foodSpotsMap.has(cId)) {
      Object.assign(foodSpotsMap.get(cId), foodItem);
      summary.food.updated++;
    } else {
      foodSpotsMap.set(cId, foodItem);
      summary.food.inserted++;
    }
  }

  // 5. Fetch Nearby Stays Updates (32)
  console.log('\n🏨 [Step 5] Syncing Nearby Stays (32)...');
  const activeStays = await fetchSyncList('32', kstThreshold, 1, 50);
  for (const item of activeStays) {
    const cId = String(item.contentid);
    const lat = parseFloat(item.mapy);
    const lng = parseFloat(item.mapx);
    if (!isValidKoreaCoord(lat, lng)) continue;

    const stayItem = {
      contentId: cId,
      contentid: cId,
      title: item.title,
      category: '숙박',
      contentTypeId: '32',
      address: item.addr1 || '',
      addr1: item.addr1 || '',
      image: item.firstimage || item.firstimage2 || '',
      lat: lat,
      lng: lng,
      tel: item.tel || '',
      modifiedTime: item.modifiedtime || kstThreshold
    };

    if (staySpotsMap.has(cId)) {
      Object.assign(staySpotsMap.get(cId), stayItem);
      summary.stays.updated++;
    } else {
      staySpotsMap.set(cId, stayItem);
      summary.stays.inserted++;
    }
  }

  // Calculate total changes
  const totalTourChanges = summary.tourSpots.inserted + summary.tourSpots.updated + summary.tourSpots.deleted;
  const totalFestChanges = summary.festivals.inserted + summary.festivals.updated + summary.festivals.expired;
  const totalFoodChanges = summary.food.inserted + summary.food.updated + summary.food.deleted;
  const totalStayChanges = summary.stays.inserted + summary.stays.updated + summary.stays.deleted;
  const grandTotalChanges = totalTourChanges + totalFestChanges + totalFoodChanges + totalStayChanges;

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📈 [Delta Merge Summary]');
  console.log(`   - Tour Spots : +${summary.tourSpots.inserted} new, ~${summary.tourSpots.updated} updated, -${summary.tourSpots.deleted} deleted`);
  console.log(`   - Festivals  : +${summary.festivals.inserted} new, ~${summary.festivals.updated} updated, -${summary.festivals.expired} expired`);
  console.log(`   - Food Spots : +${summary.food.inserted} new, ~${summary.food.updated} updated, -${summary.food.deleted} deleted`);
  console.log(`   - Stays      : +${summary.stays.inserted} new, ~${summary.stays.updated} updated, -${summary.stays.deleted} deleted`);
  console.log(`   👉 Total Net Changes: ${grandTotalChanges}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (grandTotalChanges === 0 && !forceSync) {
    console.log('✅ [Zero-Change Skip] No new changes detected in the lookback window. All datasets are up to date!');
    return;
  }

  if (dryRun) {
    console.log('ℹ️ [Dry Run] Changes simulated successfully. No disk writes performed.');
    return;
  }

  // Save all modified datasets
  console.log('💾 [Step 6] Saving updated datasets to data/ directory...');
  fs.writeFileSync(PATH_TOUR_SPOTS, JSON.stringify(Array.from(tourSpotsMap.values()), null, 2), 'utf8');
  fs.writeFileSync(PATH_DETAILS, JSON.stringify(detailsMap, null, 2), 'utf8');
  fs.writeFileSync(PATH_ENRICHED, JSON.stringify(enrichedMap, null, 2), 'utf8');
  fs.writeFileSync(PATH_FESTIVALS, JSON.stringify(Array.from(festivalSpotsMap.values()), null, 2), 'utf8');
  fs.writeFileSync(PATH_FOOD, JSON.stringify(Array.from(foodSpotsMap.values()), null, 2), 'utf8');
  fs.writeFileSync(PATH_STAYS, JSON.stringify(Array.from(staySpotsMap.values()), null, 2), 'utf8');

  // Trigger public sync & encryption pipeline
  console.log('\n🔒 [Step 7] Automatically triggering syncDatasetsToPublic.js for .enc encryption...');
  try {
    const { execSync } = await import('child_process');
    execSync('node scripts/syncDatasetsToPublic.js', { stdio: 'inherit', cwd: ROOT_DIR });
    console.log('✨ [Success] All 6 datasets encrypted to .enc and public index refreshed!');
  } catch (e) {
    console.error('❌ Failed to trigger syncDatasetsToPublic:', e.message);
    process.exit(1);
  }
}

runDeltaSync().catch(err => {
  console.error('💥 Fatal error in mergeTourApiDelta pipeline:', err);
  process.exit(1);
});
