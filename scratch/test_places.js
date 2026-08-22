const apiKey = 'AIzaSyCZCfdgYBXPMDbB7N2EhiEY-7DmaCrPh0k';

async function testPlace(query) {
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.photos'
      },
      body: JSON.stringify({
        textQuery: `${query} 대한민국`,
        languageCode: 'ko',
        maxResultCount: 1
      })
    });
    const data = await res.json();
    const place = data?.places?.[0];
    if (place) {
      const photoName = place.photos?.[0]?.name;
      const photoUrl = photoName ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=1200&key=${apiKey}` : 'No photo';
      console.log(`[OK] ${query} -> ${place.displayName?.text} | Rating: ${place.rating} | Photo: ${photoUrl.substring(0, 70)}...`);
      return { success: true, name: place.displayName?.text, photoUrl };
    } else {
      console.log(`[FAIL] ${query} -> No place found`);
      return { success: false };
    }
  } catch (e) {
    console.error(`[ERR] ${query} ->`, e.message);
    return { success: false, err: e.message };
  }
}

async function run() {
  console.log('Testing Google Places API...');
  await testPlace('인사동 쌈지길');
  await testPlace('경복궁');
  await testPlace('순천만국가정원');
  await testPlace('순천만습지');
  await testPlace('N서울타워');
  await testPlace('더현대 서울');
  await testPlace('수원 화성행궁');
  await testPlace('해운대 해수욕장');
  await testPlace('제주 성산일출봉');
}

run();
