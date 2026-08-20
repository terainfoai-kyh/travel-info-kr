/**
 * VORA AI 6.0 - 100% Authentic Korean Tourism Organization (KTO CDN) Photo Library
 */

export const PINPOINT_PHOTOS = {
  palace: ['https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'],
  hanok: ['https://tong.visitkorea.or.kr/cms/resource/04/3304404_image2_1.jpg'],
  tower: ['https://tong.visitkorea.or.kr/cms/resource/21/4022521_image2_1.jpg'],
  ocean: ['https://tong.visitkorea.or.kr/cms/resource/66/3096066_image2_1.jpg', 'https://tong.visitkorea.or.kr/cms/resource/14/4019314_image2_1.jpg'],
  blueline: ['https://tong.visitkorea.or.kr/cms/resource/99/3546099_image2_1.jpg'],
  gamcheon: ['https://tong.visitkorea.or.kr/cms/resource/78/4039278_image2_1.jpg'],
  cafe: ['https://tong.visitkorea.or.kr/cms/resource/88/4095788_image2_1.jpg'],
  food: ['https://tong.visitkorea.or.kr/cms/resource/66/3546866_image2_1.jpg'],
  nature: ['https://tong.visitkorea.or.kr/cms/resource/18/4072718_image2_1.jpg'],
  night: ['https://tong.visitkorea.or.kr/cms/resource/45/3311245_image2_1.jpg']
};

export function getPinpointSpotImage(spotTitle = '', city = '서울') {
  const t = (spotTitle || '').toLowerCase();
  if (t.includes('경복') || t.includes('향원') || t.includes('궁') || t.includes('창덕')) return PINPOINT_PHOTOS.palace[0];
  if (t.includes('북촌') || t.includes('한옥') || t.includes('익선') || t.includes('전주')) return PINPOINT_PHOTOS.hanok[0];
  if (t.includes('타워') || t.includes('남산')) return PINPOINT_PHOTOS.tower[0];
  if (t.includes('블루라인') || t.includes('스카이캡슐')) return PINPOINT_PHOTOS.blueline[0];
  if (t.includes('감천') || t.includes('문화마을')) return PINPOINT_PHOTOS.gamcheon[0];
  if (t.includes('시장') || t.includes('올레') || t.includes('미식')) return PINPOINT_PHOTOS.food[0];
  if (t.includes('바다') || t.includes('해변') || t.includes('협재') || t.includes('애월')) return PINPOINT_PHOTOS.ocean[0];
  return PINPOINT_PHOTOS.palace[0];
}
