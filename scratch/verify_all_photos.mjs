import { PREWARMED_PLACES_CATALOG } from '../src/services/photoPipeline.js';

async function checkUrl(url, name) {
  if (!url) {
    console.log(`[FAIL] ${name} -> No URL`);
    return false;
  }
  try {
    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
    const isOk = res.ok;
    const contentType = res.headers.get('content-type') || 'unknown';
    console.log(`[${res.status} ${isOk ? 'OK' : 'FAIL'}] ${name} -> ${contentType}`);
    return isOk;
  } catch (e) {
    console.log(`[ERR] ${name} -> ${e.message}`);
    return false;
  }
}

async function run() {
  console.log('--- Verifying All Prewarmed Places Catalog Photos ---');
  let passCount = 0;
  let totalCount = 0;

  for (const [key, item] of Object.entries(PREWARMED_PLACES_CATALOG)) {
    totalCount++;
    const ok = await checkUrl(item.primary, key);
    if (ok) passCount++;
  }

  console.log(`\nResult: ${passCount} / ${totalCount} URLs Valid (HTTP 200/300)`);
}

run();
