import { resolveSpotPhotoDynamic } from '../src/services/photoPipeline.js';

async function testSpot(spotTitle, city) {
  const res = await resolveSpotPhotoDynamic(spotTitle, city);
  console.log(`[RESOLVED] "${spotTitle}" (${city}) -> Primary: ${res.primaryImage.substring(0, 65)}... | Rating: ${res.rating} | Images: ${res.images.length}`);
}

async function run() {
  console.log('--- Testing Dynamic Spot Photo Resolver ---');
  await testSpot('인사동 쌈지길 & 전통찻집', '서울');
  await testSpot('N서울타워 & 남산 야경', '서울');
  await testSpot('순천만국가정원', '순천');
  await testSpot('순천만습지', '순천');
  await testSpot('신창 풍차해안도로 & 선셋', '제주');
  await testSpot('더현대 서울 & 사운즈 포레스트', '서울');
  await testSpot('방화수류정 & 용연 야경', '수원');
  await testSpot('해운대 해수욕장 & 엘시티', '부산');
}

run();
