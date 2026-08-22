const apiKey = 'AIzaSyCZCfdgYBXPMDbB7N2EhiEY-7DmaCrPh0k';

const destinations = [
  { key: '성산일출봉', query: '성산일출봉 제주' },
  { key: '비자림', query: '비자림 제주' },
  { key: '한담해변', query: '한담해안산책로 제주' },
  { key: '협재해변', query: '협재해수욕장 제주' },
  { key: '신창풍차해안도로', query: '신창풍차해안도로 제주' },
  { key: '오설록', query: '오설록 티뮤지엄 제주' },
  { key: '천지연폭포', query: '천지연폭포 서귀포' },
  { key: '올레시장', query: '서귀포매일올레시장' },
  { key: '섭지코지', query: '섭지코지 제주' },
  { key: '수원화성', query: '수원화성 수원' },
  { key: '화성행궁', query: '화성행궁 수원' },
  { key: '방화수류정', query: '방화수류정 수원' },
  { key: '불국사', query: '불국사 경주' },
  { key: '동궁과월지', query: '동궁과 월지 경주' },
  { key: '첨성대', query: '첨성대 경주' }
];

async function getPlacePhoto(item) {
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.photos,places.rating'
      },
      body: JSON.stringify({
        textQuery: `${item.query} 대한민국`,
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
      console.log(`[${check.status}] ${item.key} (${place.displayName?.text}) -> Rating: ${place.rating}`);
      return { key: item.key, name: place.displayName?.text, rating: place.rating, url };
    } else {
      console.log(`[NO PHOTO] ${item.key}`);
      return null;
    }
  } catch (e) {
    console.error(`[ERR] ${item.key}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('--- Fetching All Verified Google Places Photos ---');
  const results = {};
  for (const d of destinations) {
    const p = await getPlacePhoto(d);
    if (p) results[p.key] = p;
  }
  console.log('\n--- JSON Results ---');
  console.log(JSON.stringify(results, null, 2));
}

run();
