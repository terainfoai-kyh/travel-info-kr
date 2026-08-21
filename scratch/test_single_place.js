const apiKey = 'AIzaSyCZCfdgYBXPMDbB7N2EhiEY-7DmaCrPh0k';

async function testSingle(query) {
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.photos'
    },
    body: JSON.stringify({
      textQuery: `${query} 대한민국`,
      languageCode: 'ko',
      maxResultCount: 1
    })
  });
  const data = await res.json();
  const place = data?.places?.[0];
  const photoName = place?.photos?.[0]?.name;
  if (photoName) {
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=1200&key=${apiKey}`;
    const check = await fetch(url);
    console.log(`[${check.status}] ${query} -> ${url}`);
    return url;
  } else {
    console.log(`[NO PHOTO] ${query}`);
    return null;
  }
}

async function run() {
  await testSingle('순천만국가정원');
  await testSingle('낙안읍성');
}

run();
