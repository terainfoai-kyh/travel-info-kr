import fs from 'fs';
import path from 'path';
import { TRANSLATIONS, getCloseButtonLabel, getSpotDetailButtonLabel, getSpotMapButtonLabel } from '../src/i18n/translations.js';

console.log('🔍 Running English Localization (다국어 영어) Comprehensive Test Suite...\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    fail++;
  }
}

// 1. Check '다국어 영어 시작' comment exists in translations.js
const translationsCode = fs.readFileSync(path.resolve('./src/i18n/translations.js'), 'utf8');
assert(translationsCode.includes('다국어 영어 시작'), 'translations.js includes comment "// 다국어 영어 시작"');

// 2. Check helper functions for English
assert(getCloseButtonLabel('en') === 'Close', 'getCloseButtonLabel("en") returns "Close"');
assert(getSpotDetailButtonLabel('en') === '🔍 Photos & Details', 'getSpotDetailButtonLabel("en") returns "🔍 Photos & Details"');
assert(getSpotMapButtonLabel('en') === 'Google Map', 'getSpotMapButtonLabel("en") returns "Google Map"');

// 3. Check English translation object keys
const en = TRANSLATIONS.en;
assert(en.brandName === 'VORA', 'en.brandName is VORA');
assert(en.navWeather === 'Weather', 'en.navWeather is Weather');
assert(en.navEssentials === 'Travel Essentials', 'en.navEssentials is Travel Essentials');
assert(en.navWishlist === 'Wishlist', 'en.navWishlist is Wishlist');

// Hero Section
assert(en.heroTitle.includes('Discover Korea'), 'en.heroTitle is localized in English');
assert(en.searchBtn === 'Generate Itinerary', 'en.searchBtn is "Generate Itinerary"');
assert(en.promptChips.length >= 5, 'en.promptChips has 5+ localized prompts');

// Weather & Styling Guide
assert(en.weatherModalTitle === 'Korea Live Weather & Travel Outfit Guide', 'en.weatherModalTitle is localized');
assert(en.weatherClearBtn === '✕ Clear', 'en.weatherClearBtn is "✕ Clear"');
assert(en.weatherFeelsLike === 'Feels like ', 'en.weatherFeelsLike is "Feels like "');
assert(en.weatherTopBottom === '👕 Top / Bottom:', 'en.weatherTopBottom is localized');
assert(en.weatherOuter === '🧥 Outer Layer:', 'en.weatherOuter is localized');
assert(en.weatherEssentials === '🎒 Travel Essentials:', 'en.weatherEssentials is localized');
assert(en.weatherStylistTip === 'Local Stylist Tip:', 'en.weatherStylistTip is localized');

// Travel Essentials
assert(en.weatherOutfitTitle === 'Live Weather & Travel Outfit Guide', 'en.weatherOutfitTitle is localized');
assert(en.badgeTransport === 'Transit', 'en.badgeTransport is "Transit"');
assert(en.badgeCostSaving === 'Cost Saving', 'en.badgeCostSaving is "Cost Saving"');
assert(en.badgeData === 'Unlimited Data', 'en.badgeData is "Unlimited Data"');
assert(en.badgeSupport24h === '24/7 Support', 'en.badgeSupport24h is "24/7 Support"');
assert(en.subwayMapTitle === 'Subway Map & Transit Guide', 'en.subwayMapTitle is localized');
assert(en.climateCardTitle === 'Climate Card & T-Money', 'en.climateCardTitle is localized');
assert(en.esimTitle === 'eSIM & Pocket WiFi', 'en.esimTitle is localized');
assert(en.helplineTitle === '1330 Korea Travel Helpline', 'en.helplineTitle is localized');

// Detail Modal
assert(en.detailGalleryTitle(5).includes('5 Photos'), 'en.detailGalleryTitle outputs English photo count');
assert(en.detailDragHint === 'Scroll or swipe to explore ↔', 'en.detailDragHint is localized');
assert(en.detailDirectionsTitle === '🗺️ Directions & Live Maps', 'en.detailDirectionsTitle is localized');
assert(en.detailLowestPriceBtn === 'Book Lowest Price ↗', 'en.detailLowestPriceBtn is localized');

// Timeline & AI
assert(en.dayBadge(1) === 'Day 1', 'en.dayBadge(1) outputs "Day 1"');
assert(en.openGoogleMapsRoute.includes('Google Maps'), 'en.openGoogleMapsRoute is localized');
assert(en.photosAndDetails === '🔍 Photos & Details', 'en.photosAndDetails is localized');

console.log(`\n========================================`);
console.log(`📊 English Localization Results: ${pass} Passed, ${fail} Failed`);
console.log(`========================================\n`);

if (fail > 0) process.exit(1);
else process.exit(0);
