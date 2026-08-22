const apiKey = 'AIzaSyCZCfdgYBXPMDbB7N2EhiEY-7DmaCrPh0k';

async function testDownload(photoName, placeName) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=1200&key=${apiKey}`;
  try {
    const res = await fetch(url);
    console.log(`[HTTP ${res.status}] ${placeName} -> Content-Type: ${res.headers.get('content-type')}, Size: ${res.headers.get('content-length') || 'stream'}`);
    return res.ok;
  } catch (e) {
    console.error(`[ERR] ${placeName} ->`, e.message);
    return false;
  }
}

async function run() {
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.photos'
    },
    body: JSON.stringify({
      textQuery: '인사동 쌈지길 대한민국',
      languageCode: 'ko',
      maxResultCount: 1
    })
  });
  const data = await res.json();
  const photoName = data?.places?.[0]?.photos?.[0]?.name;
  if (photoName) {
    await testDownload(photoName, '인사동 쌈지길');
  }
}

run();
