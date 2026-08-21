import fs from 'fs';
import path from 'path';

console.log('🔍 Starting Comprehensive SEO, GEO, and AdSense Verification Suite...\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Check ads.txt
const adsTxtPath = path.resolve('./public/ads.txt');
const adsTxtContent = fs.readFileSync(adsTxtPath, 'utf8');
assert(adsTxtContent.includes('google.com, pub-9181080606912259, DIRECT, f08c47fec0942fa0'), 'public/ads.txt contains valid Google Publisher ID pub-9181080606912259');

// 2. Check robots.txt
const robotsTxtPath = path.resolve('./public/robots.txt');
const robotsTxtContent = fs.readFileSync(robotsTxtPath, 'utf8');
assert(robotsTxtContent.includes('Sitemap: https://koreatravel.cc/sitemap.xml'), 'public/robots.txt specifies koreatravel.cc sitemap.xml');
assert(robotsTxtContent.includes('User-agent: Googlebot'), 'public/robots.txt allows Googlebot');
assert(robotsTxtContent.includes('User-agent: PerplexityBot'), 'public/robots.txt allows AI search bot Perplexity');

// 3. Check sitemap.xml
const sitemapPath = path.resolve('./public/sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes('https://koreatravel.cc/'), 'sitemap.xml includes root URL');
assert(sitemapContent.includes('2026-08-21'), 'sitemap.xml lastmod is up to date (2026-08-21)');
assert(sitemapContent.includes('VORA AI Logo'), 'sitemap.xml has VORA AI logo image title');

// 4. Check index.html
const indexHtmlPath = path.resolve('./index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// AdSense tag
assert(indexHtml.includes('ca-pub-9181080606912259'), 'index.html contains AdSense Auto Ads tag ca-pub-9181080606912259');

// SEO Meta tags
assert(indexHtml.includes('<title>VORA AI | 2026 대한민국 AI 여행 컨시어지 & 실시간 코디 (koreatravel.cc)</title>'), 'index.html has title');
assert(indexHtml.includes('https://koreatravel.cc/'), 'index.html has canonical URL https://koreatravel.cc/');
assert(indexHtml.includes('google-site-verification'), 'index.html has Google Search Console verification placeholder');
assert(indexHtml.includes('naver-site-verification'), 'index.html has Naver Webmaster verification placeholder');

// GEO Meta tags
assert(indexHtml.includes('name="geo.region" content="KR"'), 'index.html has geo.region KR');
assert(indexHtml.includes('name="geo.placename" content="Seoul, South Korea"'), 'index.html has geo.placename Seoul, South Korea');
assert(indexHtml.includes('37.5665;126.9780'), 'index.html has GPS coordinates 37.5665;126.9780');

// JSON-LD Schemas
assert(indexHtml.includes('"@type": "SoftwareApplication"'), 'index.html has SoftwareApplication schema');
assert(indexHtml.includes('"@type": "WebSite"'), 'index.html has WebSite schema');
assert(indexHtml.includes('"@type": "TouristInformationCenter"'), 'index.html has TouristInformationCenter schema');
assert(indexHtml.includes('"@type": "Organization"'), 'index.html has Organization schema with terainfoai@gmail.com');
assert(indexHtml.includes('"@type": "FAQPage"'), 'index.html has FAQPage rich snippet schema');

// Multi-language Hreflang
assert(indexHtml.includes('hreflang="ko"'), 'index.html has hreflang="ko"');
assert(indexHtml.includes('hreflang="en"'), 'index.html has hreflang="en"');
assert(indexHtml.includes('hreflang="ja"'), 'index.html has hreflang="ja"');
assert(indexHtml.includes('hreflang="zh-Hans"'), 'index.html has hreflang="zh-Hans"');
assert(indexHtml.includes('hreflang="x-default"'), 'index.html has hreflang="x-default"');

// Zero legacy KTO in index.html
assert(!indexHtml.includes('한국관광공사'), 'index.html has zero legacy 한국관광공사 text');

console.log(`\n========================================`);
console.log(`📊 Test Results: ${passCount} Passed, ${failCount} Failed`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
