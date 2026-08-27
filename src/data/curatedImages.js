import { resolveSpotPhotoSync } from '../services/photoPipeline.js';

export const PINPOINT_PHOTOS = {
  palace: ['https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'],
  ocean: ['https://tong.visitkorea.or.kr/cms/resource/13/2678613_image2_1.jpg']
};

export function getPinpointSpotImage(spotTitle = '', city = '서울') {
  const resolved = resolveSpotPhotoSync(spotTitle, city);
  return resolved?.primaryImage || PINPOINT_PHOTOS.palace[0];
}
