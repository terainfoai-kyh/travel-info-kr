/**
 * Sync Datasets from data/ to public/data/
 * Generates lightweight city indices and ensures frontend edge accessibility.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enrichSpots } from './enrichMasterTourSpots.js';

import { encryptData } from '../src/utils/voraCrypto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Ensure top master landmarks are guaranteed in korea_tour_spots.json
try {
  enrichSpots();
} catch (e) {
  console.warn('⚠️ [Sync Datasets] enrichSpots warning:', e.message);
}

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

console.log('🔒 [Sync Datasets] Encrypting and synchronizing datasets to public/data/...');

let totalBytes = 0;

for (const fileName of FILES_TO_SYNC) {
  const src = path.join(SRC_DATA_DIR, fileName);
  const baseName = fileName.replace(/\.json$/, '');
  const encDest = path.join(PUB_DATA_DIR, `${baseName}.enc`);

  if (fs.existsSync(src)) {
    const rawContent = fs.readFileSync(src, 'utf8');
    const encrypted = encryptData(rawContent);
    fs.writeFileSync(encDest, encrypted, 'utf8');
    const stat = fs.statSync(encDest);
    totalBytes += stat.size;
    console.log(`  🔒 Encrypted: ${baseName}.enc (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    const emptyEnc = encryptData(fileName.includes('spots') ? '[]' : '{}');
    fs.writeFileSync(encDest, emptyEnc, 'utf8');
    console.log(`  ℹ️ Initialized empty encrypted: ${baseName}.enc`);
  }

  // 🛡️ Remove exposed plain JSON from public/data/ to prevent scraper access
  const plainDest = path.join(PUB_DATA_DIR, fileName);
  if (fs.existsSync(plainDest)) {
    fs.unlinkSync(plainDest);
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
