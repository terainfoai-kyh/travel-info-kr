/**
 * affiliateService.js
 * Agoda & Klook Partner Referral Link Generator
 */

const AGODA_CID = import.meta.env.VITE_AGODA_CID || '1234567'; // 아고다 제휴 CID
const KLOOK_AID = import.meta.env.VITE_KLOOK_AID || '890123';  // 클룩 제휴 AID

export function getAgodaHotelSearchUrl(city = 'Seoul') {
  const encodedCity = encodeURIComponent(city.trim());
  return `https://www.agoda.com/search?text=${encodedCity}&cid=${AGODA_CID}&tag=travelkorea`;
}

export function getKlookActivitySearchUrl(city = 'Seoul') {
  const encodedCity = encodeURIComponent(city.trim());
  return `https://www.klook.com/ko/search/?query=${encodedCity}&aid=${KLOOK_AID}&utm_medium=affiliate`;
}
