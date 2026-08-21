import { fetchGooglePlacesPhotos, resolveSpotPhotoDynamic } from '../src/services/photoPipeline.js';

const testList = [
  { title: '섭지코지 & 붉은오름 등대', city: '제주' },
  { title: '성산일출봉 & 광치기해변', city: '제주' },
  { title: '비자림 & 천년 비자나무 숲길', city: '제주' },
  { title: '인사동 쌈지길 & 전통찻집', city: '서울' },
  { title: 'N서울타워 & 남산 야경', city: '서울' },
  { title: '더현대 서울 & 사운즈 포레스트', city: '서울' },
  { title: '순천만국가정원', city: '순천' },
  { title: '순천만습지', city: '순천' },
  { title: '수원 화성행궁', city: '수원' },
  { title: '해운대 해수욕장', city: '부산' }
];

async function run() {
  console.log('=== 100% Pure Google Places API (New) Verification Test ===\n');

  for (const item of testList) {
    const res = await resolveSpotPhotoDynamic(item.title, item.city);
    console.log(`[Google Match] "${item.title}" (${item.city})`);
    console.log(`  -> Display Name : ${res.displayName}`);
    console.log(`  -> Rating       : ${res.rating}`);
    console.log(`  -> Photos Count : ${res.images?.length || 1}`);
    console.log(`  -> Primary Photo: ${res.primaryImage.substring(0, 80)}...\n`);
  }
}

run();
