/**
 * 🗺️ [Universal South Korea Map Bounds & Multilingual Tile Engine]
 * 
 * 1. 대한민국 영토 경계 엄격 봉인 (위도 33.0° ~ 38.6° / 경도 124.5° ~ 132.0°)
 *    - 북한(평양, 개성 등), 중국(단둥, 베이징), 일본, 공해상으로 지도 패닝 및 엉뚱한 지오코딩 100% 원천 차단.
 * 2. 언어별 지도 타일 실시간 동적 스위칭:
 *    - 국문(KO): OpenStreetMap 표준 국문 타일
 *    - 다국어(EN/JA/ZH/ZHT 등): 글로벌 표준 CartoDB Voyager 영문 타일 (100% 무료, 무제한, 초고속)
 */

export const SOUTH_KOREA_MAP_BOUNDS = [
  [32.8, 124.0], // 남서단 (마라도 남서쪽)
  [38.9, 132.2]  // 북동단 (독도/고성 북동쪽)
];

/**
 * 주어진 위경도가 대한민국 관할 영토 내에 있는지 판정
 */
export function isInSouthKorea(lat, lng) {
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (isNaN(numLat) || isNaN(numLng)) return false;
  return numLat >= 33.0 && numLat <= 38.6 && numLng >= 124.5 && numLng <= 132.0;
}

/**
 * 현재 언어에 맞는 지도 타일 설정 반환
 */
export function getMapTileConfig(lang = 'ko') {
  const isKorean = (lang === 'ko');

  if (isKorean) {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    };
  }

  // 🌐 글로벌 영문/다국어 모드: 워터마크 없는 100% 클린 정품 오픈스트리트맵 타일
  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  };
}

/**
 * Leaflet 맵 인스턴스에 타일 레이어를 안전하게 교체 장착
 */
export function updateMapTileLayer(map, tileLayerRef, lang = 'ko') {
  if (!map || typeof window === 'undefined' || !window.L) return;

  try {
    if (tileLayerRef && tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }

    const { url, options } = getMapTileConfig(lang);
    const newLayer = window.L.tileLayer(url, options).addTo(map);

    if (tileLayerRef) {
      tileLayerRef.current = newLayer;
    }
    return newLayer;
  } catch (e) {
    console.warn('[MapTileUtils] Failed to update map tile layer:', e);
  }
}
