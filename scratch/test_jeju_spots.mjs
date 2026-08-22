import { resolveSpotPhotoSync, resolveSpotPhotoDynamic } from '../src/services/photoPipeline.js';

async function run() {
  console.log('--- Testing Jeju Spots Resolution ---');
  const sync1 = resolveSpotPhotoSync('성산일출봉 & 광치기해변', '제주');
  console.log('Sync 성산일출봉:', sync1.primaryImage);
  const sync2 = resolveSpotPhotoSync('비자림 & 천년 비자나무 숲길', '제주');
  console.log('Sync 비자림:', sync2.primaryImage);

  const dyn1 = await resolveSpotPhotoDynamic('성산일출봉 & 광치기해변', '제주');
  console.log('Dyn 성산일출봉:', dyn1.primaryImage);
  const dyn2 = await resolveSpotPhotoDynamic('비자림 & 천년 비자나무 숲길', '제주');
  console.log('Dyn 비자림:', dyn2.primaryImage);
}

run();
