import { resolveSpotPhotoSync } from '../services/photoPipeline.js';

export const PINPOINT_PHOTOS = {
  palace: ['https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=85'],
  ocean: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85']
};

export function getPinpointSpotImage(spotTitle = '', city = '서울') {
  const resolved = resolveSpotPhotoSync(spotTitle, city);
  return resolved?.primaryImage || PINPOINT_PHOTOS.palace[0];
}
