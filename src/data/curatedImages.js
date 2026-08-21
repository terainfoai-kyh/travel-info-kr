import { resolveSpotPhotoSync, CATEGORY_FALLBACK_PHOTOS } from '../services/photoPipeline.js';

export const PINPOINT_PHOTOS = {
  palace: [CATEGORY_FALLBACK_PHOTOS.culture.primary],
  hanok: [CATEGORY_FALLBACK_PHOTOS.culture.primary],
  tower: [CATEGORY_FALLBACK_PHOTOS.night.primary],
  ocean: CATEGORY_FALLBACK_PHOTOS.ocean.images,
  blueline: [CATEGORY_FALLBACK_PHOTOS.activity.primary],
  gamcheon: [CATEGORY_FALLBACK_PHOTOS.culture.primary],
  cafe: [CATEGORY_FALLBACK_PHOTOS.cafe.primary],
  food: [CATEGORY_FALLBACK_PHOTOS.food.primary],
  nature: [CATEGORY_FALLBACK_PHOTOS.nature.primary],
  night: [CATEGORY_FALLBACK_PHOTOS.night.primary]
};

export function getPinpointSpotImage(spotTitle = '', city = '서울') {
  const resolved = resolveSpotPhotoSync(spotTitle, city);
  return resolved?.primaryImage || PINPOINT_PHOTOS.palace[0];
}
