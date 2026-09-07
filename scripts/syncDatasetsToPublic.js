/**
 * Sync Datasets from data/ to public/data/
 * Generates lightweight city indices and ensures frontend edge accessibility.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DATA_DIR = path.join(ROOT_DIR, 'data');
const PUB_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');

if (!fs.existsSync(PUB_DATA_DIR)) {
  fs.mkdirSync(PUB_DATA_DIR, { recursive: true });
}

const FILES_TO_SYNC = [
  'korea_tour_spots.json',
  'korea_spots_details.json',
  'korea_food_spots.json',
  'korea_festival_spots.json',
  'korea_stay_spots.json',
  'korea_enriched_landmarks.json'
];

console.log('📦 [Sync Datasets] Synchronizing harvested datasets to public/data/...');

let totalBytes = 0;

for (const fileName of FILES_TO_SYNC) {
  const src = path.join(SRC_DATA_DIR, fileName);
  const dest = path.join(PUB_DATA_DIR, fileName);

  if (fs.existsSync(src)) {
    const stat = fs.statSync(src);
    fs.copyFileSync(src, dest);
    totalBytes += stat.size;
    console.log(`  ✅ Synced: ${fileName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    // If not exists yet (e.g. enriched landmarks before run), write empty object to avoid 404
    fs.writeFileSync(dest, '{}', 'utf8');
    console.log(`  ℹ️ Initialized empty: ${fileName}`);
  }
}

// Generate City Index for instant search and quick stats
const tourSpotsPath = path.join(SRC_DATA_DIR, 'korea_tour_spots.json');
if (fs.existsSync(tourSpotsPath)) {
  const spots = JSON.parse(fs.readFileSync(tourSpotsPath, 'utf8'));
  const cityIndex = {};

  for (const s of spots) {
    const region = s.region || '기타';
    if (!cityIndex[region]) {
      cityIndex[region] = {
        name: region,
        count: 0,
        sampleSpots: []
      };
    }
    cityIndex[region].count++;
    if (cityIndex[region].sampleSpots.length < 5) {
      cityIndex[region].sampleSpots.push({
        contentId: s.contentId,
        title: s.title,
        image: s.image,
        lat: s.lat,
        lng: s.lng
      });
    }
  }

  const indexPath = path.join(PUB_DATA_DIR, 'city_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(cityIndex, null, 2), 'utf8');
  console.log(`  🎯 Created city index with ${Object.keys(cityIndex).length} regions: city_index.json`);
}

console.log(`🎉 [Sync Datasets Complete] Total synced: ${(totalBytes / 1024 / 1024).toFixed(2)} MB to public/data/`);
