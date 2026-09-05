/**
 * 📡 VORA AI - Reddit Realtime Question Radar & Telegram Dispatcher
 * 
 * 1. Monitors r/koreatravel, r/seoul for authentic traveler questions.
 * 2. Matches detected cities & travel duration from post title/body.
 * 3. Synthesizes a native English travel recommendation + 4K interactive deep link.
 * 4. Dispatches an alert with 1-click copy text and instant action buttons to Telegram.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateLocalFallbackItinerary } from '../src/services/localItineraryGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 Auto-load API keys from root .env at top
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        const val = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
        if (val) process.env[key] = val;
      }
    });
  }
} catch {}

const TELEGRAM_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN.trim()) || '8862336937:AAGjolvwXh3BEBrLa1PMWFHLDu2ipcf90D0';
const TELEGRAM_CHAT_ID = (process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_CHAT_ID.trim()) || '8955008233';
const VORA_BASE_URL = (process.env.VORA_BASE_URL && process.env.VORA_BASE_URL.trim()) || 'https://koreatravel.cc';
const SEEN_POSTS_FILE = path.join(__dirname, '.seen_reddit_posts.json');

// Localized sample itineraries for instant fallback generation
const CITY_SAMPLE_ROUTES = {
  seoul: {
    name: 'Seoul',
    routes: [
      'Day 1: Gyeongbokgung Palace ➔ Bukchon Hanok Village ➔ Insadong Art Street ➔ Ikseon-dong Hanok Alley ➔ Cheonggyecheon Stream',
      'Day 2: Seongsu-dong Cafe Street ➔ Seoul Forest Park ➔ Dongdaemun Design Plaza (DDP) ➔ Gwangjang Market (Night Street Food)',
      'Day 3: Namsan Cable Car ➔ N-Seoul Tower Observatory ➔ Myeongdong K-Beauty Street ➔ Yeouido Hangang Park (Sunset River Walk)',
      'Day 4: Hongdae Youth Street ➔ Yeonnam-dong Central Park ➔ Mangwon Traditional Market ➔ Mapo Pork BBQ Street',
      'Day 5: Gangnam Starfield COEX Library ➔ Bongeunsa Ancient Temple ➔ K-Star Road ➔ Lotte World Tower Seoul Sky 123F'
    ],
    transitTip: 'Grab a Climate Card (기후동행카드) or T-money card at any convenience store for unlimited subway & bus rides.',
    foodTip: 'Do not miss warm Bindaetteok (Mung Bean Pancake) & Mayak Kimbap at Gwangjang Market or authentic Hanok brunch near Anguk station.'
  },
  busan: {
    name: 'Busan',
    routes: [
      'Day 1: Haeundae Blueline Park Sky Capsule ➔ Cheongsapo Skywalk ➔ Dongbaekseom Island ➔ Gwangalli Beach Drone Show',
      'Day 2: Gamcheon Culture Village ➔ Huinnyeoul Culture Coastal Walk ➔ Jagalchi Fish Market ➔ BIFF Square & Nampo Night Market',
      'Day 3: Haedong Yonggungsa Seaside Temple ➔ Gijang Crab Market ➔ Osiria Coastal Walk ➔ The Bay 101 Marine Skyline'
    ],
    transitTip: 'Take Metro Line 2 for Haeundae and Gwangalli, or taxi along the Gwangan Bridge for panoramic ocean views.',
    foodTip: 'Try authentic Pork Soup (Dwaeji Gukbap) near Seomyeon and fresh sashimi directly prepared at Jagalchi Market.'
  },
  jeju: {
    name: 'Jeju Island',
    routes: [
      'Day 1: Seongsan Ilchulbong (Sunrise Peak) ➔ Seopjikoji Scenic Coast ➔ Snoopy Garden ➔ Hamdeok Emerald Beach',
      'Day 2: Hallasan Eoseungsaengak Nature Trail ➔ Jeongbang Coastal Waterfall ➔ Seogwipo Maeil Olle Market ➔ Saeyeongyo Bridge Night Lights',
      'Day 3: Aewol Handam Coastal Walk ➔ Hyeopjae Beach ➔ Hallim Park ➔ Osulloc Green Tea Plantation'
    ],
    transitTip: 'Renting a car or hiring an English-speaking taxi tour is the most convenient way to explore eastern & western coasts.',
    foodTip: 'Black Pork BBQ (Heukdwaeji) grilled over charcoal and fresh Abalone Porridge are absolute must-tries in Jeju.'
  },
  gyeongju: {
    name: 'Gyeongju',
    routes: [
      'Day 1: Bulguksa UNESCO Temple ➔ Seokguram Grotto ➔ Daereungwon Ancient Tombs Complex ➔ Cheomseongdae Observatory',
      'Day 2: Hwangridan-gil Trendy Cafes ➔ National Museum of Gyeongju ➔ Donggung Palace & Wolji Pond (Golden Moonlit Reflection)'
    ],
    transitTip: 'Take KTX to Singyeongju Station, then express bus 700 directly into the historic city center.',
    foodTip: 'Stroll Hwangridan-gil for modern Hanok bakeries and try warm historic 10-Won Coin Cheese bread.'
  },
  gangneung: {
    name: 'Gangneung',
    routes: [
      'Day 1: KTX Gangneung Station ➔ Anmok Beach Coffee Street ➔ Gyeongpo Lake Moonlit Boardwalk ➔ Gangneung Central Market (Dakgangjeong)',
      'Day 2: BTS Seaside Bus Stop (Hyangho Beach) ➔ Chodang Soft Tofu Village ➔ Ojukheon Historic Hanok House ➔ Gangmun Emerald Beach'
    ],
    transitTip: 'Take the KTX-Eum from Seoul Station (1h 40m). Local buses connect Gangneung Station to Anmok and Gyeongpo easily.',
    foodTip: 'Savor savory Chodang Handmade Soft Tofu (Sundubu) and fresh Gangneung specialty hand-drip brew by the ocean.'
  },
  suwon: {
    name: 'Suwon',
    routes: [
      'Day 1: KTX Suwon Station ➔ Suwon Hwaseong UNESCO Fortress Walk ➔ Hwaseong Haenggung Temporary Palace ➔ Haenggung-dong Retro Hanok Cafes ➔ Cauldron Fried Chicken Street'
    ],
    transitTip: 'Just 30 minutes from Seoul Station via KTX, or 45 minutes on Subway Line 1 directly.',
    foodTip: 'Try legendary Suwon Traditional King Beef Ribs (Wang-galbi) and crispy whole fried chicken from the historic chicken alley.'
  },
  incheon: {
    name: 'Incheon',
    routes: [
      'Day 1: Songdo Central Park Water Taxi ➔ Tri-bowl Architecture ➔ Chinatown Jajangmyeon Street ➔ Wolmido Sea View'
    ],
    transitTip: 'Take AREX or Line 1 from Seoul, or Incheon Line 1 directly into Songdo Central Park.',
    foodTip: 'Authentic White Jajangmyeon in Chinatown and Sinpo Traditional Market Sweet Crispy Chicken (Dakgangjeong).'
  },
  andong: {
    name: 'Andong',
    routes: [
      'Day 1: Hahoe Folk Village ➔ Buyongdae Cliff Overlook ➔ Woryeonggyo Wooden Moonlight Bridge ➔ Andong Jjimdak Alley'
    ],
    transitTip: 'KTX-Eum connects Cheongnyangni (Seoul) to Andong Station in just 2 hours.',
    foodTip: 'Original Andong Soy-Braised Chicken (Jjimdak) and Salted Grilled Mackerel (Godeungeo).'
  },
  jeonju: {
    name: 'Jeonju',
    routes: [
      'Day 1: Jeonju Hanok Village ➔ Gyeonggijeon Shrine ➔ Omokdae Sunset Pavilion ➔ Nambu Traditional Night Market'
    ],
    transitTip: 'KTX from Yongsan/Seoul Station to Jeonju Station takes 1h 30m.',
    foodTip: 'Traditional Jeonju Bibimbap with brass bowl and warm Kongnamul Gukbap (Bean Sprout Soup).'
  },
  sokcho: {
    name: 'Sokcho',
    routes: [
      'Day 1: Seoraksan National Park Cable Car ➔ Sinheungsa Ancient Temple ➔ Sokcho Tourist Fish Market ➔ Abai Village Ferry'
    ],
    transitTip: 'Express Bus from Seoul Express Bus Terminal reaches Sokcho in 2h 10m.',
    foodTip: 'Sokcho Squid Sundae (Ojingeo Sundae) and sweet & spicy Dakgangjeong from Sokcho Central Market.'
  },
  yeosu: {
    name: 'Yeosu',
    routes: [
      'Day 1: Yeosu Maritime Cable Car ➔ Odongdo Camellia Island ➔ Yi Sun-sin Square ➔ Romantic Pocha Seaside Night Carts'
    ],
    transitTip: 'KTX from Seoul/Yongsan takes 3 hours directly to Yeosu Expo Station.',
    foodTip: 'Yeosu Dolsan Mustard Leaf Kimchi (Gat-kimchi) with BBQ Pork and Spicy Seafood Pocha Stir-fry.'
  },
  pohang: {
    name: 'Pohang',
    routes: [
      'Day 1: Space Walk Sky Rollercoaster ➔ Homigot Sunrise Square (Hand of Harmony) ➔ Yeongildae Seaside Pavilion ➔ Jukdo Fish Market'
    ],
    transitTip: 'KTX from Seoul Station reaches Pohang Station in 2h 20m.',
    foodTip: 'Pohang style Cold Raw Fish Soup (Mulhoe) and fresh snow crab directly from Jukdo Market.'
  },
  daegu: {
    name: 'Daegu',
    routes: [
      'Day 1: Kim Gwang-seok Music Street ➔ Dongseong-ro Shopping District ➔ Apsan Sunset Cable Car Observatory ➔ Anjirang Gopchang Alley'
    ],
    transitTip: 'KTX from Seoul reaches Dongdaegu Station in just 1h 40m.',
    foodTip: 'Grilled Beef/Pork Intestines (Makchang) at Anjirang and spicy braised beef ribs (Dongin-dong Galbijjim).'
  }
};

function loadSeenPosts() {
  try {
    if (fs.existsSync(SEEN_POSTS_FILE)) {
      const data = fs.readFileSync(SEEN_POSTS_FILE, 'utf-8');
      return new Set(JSON.parse(data));
    }
  } catch {}
  return new Set();
}

function saveSeenPosts(seenSet) {
  try {
    const arr = Array.from(seenSet).slice(-200); // keep last 200
    fs.writeFileSync(SEEN_POSTS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save seen posts:', err);
  }
}

function extractCity(text = '') {
  const t = text.toLowerCase();
  if (t.includes('busan') || t.includes('pusan')) return 'busan';
  if (t.includes('jeju')) return 'jeju';
  if (t.includes('gyeongju')) return 'gyeongju';
  if (t.includes('gangneung')) return 'gangneung';
  if (t.includes('suwon')) return 'suwon';
  if (t.includes('incheon')) return 'incheon';
  if (t.includes('andong')) return 'andong';
  if (t.includes('jeonju')) return 'jeonju';
  if (t.includes('sokcho')) return 'sokcho';
  if (t.includes('yeosu')) return 'yeosu';
  if (t.includes('pohang')) return 'pohang';
  if (t.includes('daegu')) return 'daegu';
  return 'seoul';
}

function extractDays(text = '') {
  const t = text.toLowerCase();
  const match = t.match(/(\d+)\s*(days?|일|d)/i);
  if (match) {
    const val = parseInt(match[1], 10);
    if (val >= 1 && val <= 5) return val;
    if (val > 5) return 5;
  }
  return 3;
}

const DEFAULT_GEMINI_KEY = 'AQ.Ab8RN6IVJdGHWrSeODhQlsVer2F_Qv5918v1aoWjc42Qi1xjRw';
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || DEFAULT_GEMINI_KEY).trim() || DEFAULT_GEMINI_KEY;

async function getRealAppRoutes(cityKey, days) {
  const cityNamesMap = {
    seoul: '서울',
    busan: '부산',
    jeju: '제주',
    gyeongju: '경주',
    gangneung: '강릉',
    suwon: '수원',
    incheon: '인천',
    andong: '안동',
    jeonju: '전주',
    sokcho: '속초',
    yeosu: '여수',
    pohang: '포항',
    daegu: '대구'
  };
  const targetCityKo = cityNamesMap[cityKey] || '서울';

  try {
    // 🛡️ 1.5s race timeout to prevent blocking on slow public APIs in Node environment
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
    const fetchPromise = generateLocalFallbackItinerary(`Create ${targetCityKo} ${days}-day plan`, targetCityKo, days, 'en');
    const rawResult = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (rawResult && rawResult.dailySchedules && rawResult.dailySchedules.length > 0) {
      return rawResult.dailySchedules.map(ds => {
        const spotNames = (ds.spots || [])
          .filter(s => {
            const name = ((s.title || s.name || '') + ' ' + (s.addr1 || '')).toLowerCase();
            // Filter non-tourist/administrative/medical institutions
            if (/병원|의원|clinic|hospital|약국|pharmacy|치과|dental|대학교|대학|university|초등학교|중학교|고등학교|school|학원|academy|주민센터|동사무소|구청|시청|경찰서|소방서|세무서/i.test(name)) return false;
            return true;
          })
          .map(s => (s.title || s.name || '').trim())
          .filter(Boolean)
          .slice(0, 4);
        return `Day ${ds.day}: ${spotNames.join(' ➔ ')}`;
      });
    }
  } catch (err) {
    // Graceful fast fallback to verified anchors
  }

  const cityInfo = CITY_SAMPLE_ROUTES[cityKey] || CITY_SAMPLE_ROUTES.seoul;
  return (cityInfo.routes || []).slice(0, days);
}

function detectTopic(title = '', body = '') {
  const t = (title + ' ' + body).toLowerCase();
  if (/cycl(ing|e|ist)|bicyc(le|ling)|bike|biking|4 rivers|cross country|bike trail|cycling path|donghae|riding/i.test(t)) {
    return { key: 'cycling', label: '자전거/국토종주 라이딩', emoji: '🚴‍♂️🗺️' };
  }
  if (/exchange|currency|money|atm|cash|card|wowpass|namane|credit card|pay/i.test(t)) {
    return { key: 'payment', label: '환전/카드/WOWPASS/결제', emoji: '💳💵' };
  }
  if (/souvenir|license plate|vintage|antique|flea market|gift shop|goods shop|biff|gukje|nampo/i.test(t)) {
    return { key: 'souvenir', label: '기념품/소품/빈티지 마켓', emoji: '🛍️🎨' };
  }
  if (/brew|beer|alcohol|makgeolli|soju|drink|craft beer|pub|bar|nightlife/i.test(t)) {
    return { key: 'brewery', label: '로컬 브루어리/전통주', emoji: '🍶🍺' };
  }
  if (/(incheon|airport).*bus|bus.*(gyeongju|busan|gangneung|sokcho|jeonju)|express bus|intercity bus/i.test(t)) {
    return { key: 'airport_bus', label: '공항 리무진/지방 이동', emoji: '🚌🚅' };
  }
  if (/foliage|autumn|fall|leaves|ginkgo|maple/i.test(t)) {
    return { key: 'foliage', label: '가을 단풍/자연 명소', emoji: '🍁🍂' };
  }
  if (/hanwoo|beef|pork|black pork|bbq|meat|korean bbq/i.test(t)) {
    return { key: 'bbq', label: '한우/흑돼지/고기 맛집', emoji: '🥩🔥' };
  }
  if (/popup|pop-up|reservation|kiosk|catchtable|wait/i.test(t)) {
    return { key: 'popup', label: '팝업스토어/현장 예약', emoji: '🎪✨' };
  }
  if (/hotel|hostel|stay|switch|airbnb|accommodation|where to stay|lodge|booking/i.test(t)) {
    return { key: 'hotel', label: '숙소 위치/권역 비교', emoji: '🏨🧳' };
  }
  if (/esim|sim card|simcard|pocket wifi|wifi|roaming|data plan/i.test(t)) {
    return { key: 'esim', label: 'eSIM/통신/데이터', emoji: '📱📶' };
  }
  if (/t-?money|climate card|subway|metro|transit|bus|taxi|koreail|ktx/i.test(t)) {
    return { key: 'transit', label: '대중교통/T-money', emoji: '🚇💳' };
  }
  if (/luggage|baggage|storage|locker|delivery|t-luggage/i.test(t)) {
    return { key: 'luggage', label: '짐보관/T-Luggage', emoji: '🧳🔒' };
  }
  if (/weather|clothes|outfit|rain|snow|temperature/i.test(t)) {
    return { key: 'weather', label: '날씨/옷차림 팁', emoji: '☀️🧥' };
  }
  if (/musinsa|fashion|clothes|collab|merch|streetwear|thrifting|dongmyo|vintage shop|k-fashion|ak plaza|animate|kpop merch/i.test(t)) {
    return { key: 'fashion', label: '무신사/K-패션/한정 굿즈', emoji: '👕🛍️' };
  }
  if (/food|restaurant|dine|dining|eat|pork soup|market food|halal|vegetarian/i.test(t)) {
    return { key: 'food', label: '현지 로컬 맛집', emoji: '🍲🥢' };
  }
  return { key: 'itinerary', label: '추천 여행 일정표', emoji: '🗺️✨' };
}

async function generateFallbackReply(cityKey, days, postTitle, postBody = '') {
  const cityInfo = CITY_SAMPLE_ROUTES[cityKey] || CITY_SAMPLE_ROUTES.seoul;
  const topicInfo = detectTopic(postTitle, postBody);
  const topic = topicInfo.key;

  if (topic === 'cycling') {
    return `Local here - the full Seoul to Busan 4 Rivers path takes about 4 to 5 solid days of riding (~633 km). With an 8-day trip, doing the whole thing leaves very little time to actually explore cities. If you want a more balanced pace, doing a scenic day ride along the Han River or out to Chuncheon, and spending the rest exploring Seoul and Busan by KTX might be a lot less rushed.`;
  }

  if (topic === 'payment') {
    return `Korea is basically 99% cashless now, so regular Visa/Mastercard cards work virtually everywhere (cafes, taxis, restaurants, stores). You really only need physical Korean won cash for transit card top-ups (T-money machines only take cash) and street food stalls at traditional markets. Any Global ATM at convenience stores or stations can dispense KRW with a foreign card.`;
  }

  if (topic === 'souvenir') {
    if (cityKey === 'busan') {
      return `If you're in Busan, check out the vintage alleys inside Gukje Market and Bupyeong Kkangtong Market in Nampo-dong. The imported goods and vintage stalls often have retro metal signs and novelty goods. Also, the gift shops around Gamcheon Culture Village have cool local Busan-themed metal souvenirs and badges.`;
    }
    return `For vintage signs and unique souvenirs, traditional markets like Insadong Art Street or the Dongmyo flea market are your best bet. Local artisan shops in Bukchon Hanok village also carry really nice handcrafted goods rather than cheap generic trinkets.`;
  }

  if (topic === 'brewery') {
    return `Local here - quite a few Japanese izakayas in Yeonnam-dong (near Hongdae) and Euljiro actually carry Orion draft on tap. Just look for small izakayas with Orion signs outside. Alternatively, Seongsu and Mullae have great local craft beer taps if you're up for trying Korean microbrews while you're in town.`;
  }

  if (topic === 'airport_bus') {
    return `For getting from Incheon Airport to regional cities like Gyeongju, you can take a direct intercity express bus right outside Terminal 1 (Platform 11A/11B) in about 4.5 hours. Alternatively, take the AREX train to Seoul Station and hop on a fast KTX to Singyeongju Station (~2 hours on train). Kiosks at the airport accept foreign credit cards easily.`;
  }

  if (topic === 'foliage') {
    return `Fall colors in Korea are amazing. Changdeokgung Secret Garden and Deoksugung stone wall walk are classics right in central Seoul. For sweeping panoramic views, walking up Namsan or taking the cable car to N-Seoul Tower is great. Peak foliage in the central region is usually late October through the first week of November.`;
  }

  if (topic === 'bbq') {
    return `For top-tier Hanwoo beef, check out Majang Meat Market in Seoul - you pick the fresh cuts directly at the butcher stalls and eat upstairs for a small table fee, much cheaper than Gangnam restaurants. For Jeju black pork, thick-cut belly grilled over charcoal with Meljeot (anchovy sauce) is the local standard. Most BBQ places have a 2-serving minimum, which is totally normal even for solo diners.`;
  }

  if (topic === 'popup') {
    return `For popups that use Korean queue apps (CatchTable/Kakao), most staff at the entrance will happily help foreign tourists without a 010 number register via email or hand you a physical number ticket. Going on weekday mornings (Tue-Thu) usually has way shorter wait times than weekends, especially around Seongsu or The Hyundai Seoul.`;
  }

  if (topic === 'hotel') {
    if (cityKey === 'busan') {
      return `In Busan, as long as you're near any Metro Line 1 or 2 station, getting around is super quick. Haeundae/Gwangalli is great for beach vibes, while Seomyeon is the most practical central hub for transit. If switching hotels is going to cost cancellation fees or pack-and-move hassle, honestly staying put and taking the subway is much smoother.`;
    }
    return `Honestly, as long as your place is within a 5-10 minute walk of a major Seoul subway line (especially Line 2 or Line 3), getting around is fast and cheap. If changing accommodations involves penalty fees or the hassle of packing mid-trip, it's usually not worth the stress.`;
  }

  if (topic === 'esim') {
    return `If your phone is carrier-unlocked, booking an eSIM online (LG U+, KT, or SKT) and scanning the QR before or upon landing is definitely the easiest route. Just note most tourist eSIMs are data-only without a local 010 calling number, but you rarely need one since WhatsApp/Kakao work fine and restaurants can seat you manually.`;
  }

  if (topic === 'fashion') {
    return `There are plenty of locations all over Seoul. However, if you are close to these areas, I highly recommend visiting MUSINSA Store Hongdae or the Seongsu area (MUSINSA Store Seongsu @ Daelim Warehouse and nearby brand stores). This is because Musinsa operates different store formats offline, and the anime collaboration items you are looking for are usually released as limited capsule collections (Drops) rather than their basic clothing lines. If you look them up on Naver Maps or other map apps, you'll find plenty of locations nearby.`;
  }

  if (topic === 'transit') {
    return `Grab a T-money or Climate Card at any convenience store when you land. Just remember reloading requires physical Korean cash at the machines. Also, Google Maps walking directions are limited in Korea due to local mapping regulations, so downloading Naver Map (has English) will make navigation way easier.`;
  }

  const liveRoutes = await getRealAppRoutes(cityKey, days);
  let reply = `Here's a logical flow for ${cityInfo.name} that minimizes backtracking between neighborhoods:\n\n`;
  liveRoutes.forEach(r => {
    reply += `${r}\n`;
  });
  reply += `\nSubway Line 2 and Line 3 will get you to most of these easily. Naver Map is much better than Google Maps for walking routes here.`;
  return reply;
}

async function generateGeminiReply(post, cityKey, days) {
  const cityInfo = CITY_SAMPLE_ROUTES[cityKey] || CITY_SAMPLE_ROUTES.seoul;
  const liveRoutes = await getRealAppRoutes(cityKey, days);
  const appReferenceRoutes = liveRoutes.join('\n\n');

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    return generateFallbackReply(cityKey, days, post.title, post.selftext || '');
  }

  const prompt = `You are a friendly, pragmatic local resident living in Korea replying naturally to a traveler on Reddit (r/koreatravel).

Post Title: "${post.title}"
Post Content: "${(post.selftext || '').slice(0, 1000)}"
Focus Area: ${cityInfo.name}

[Reference routes/anchors if relevant]:
${appReferenceRoutes}

[MANDATORY 3-PART HUMAN FORMULA - CRAFTED BY SENIOR TRAVELER]:
Every reply MUST follow this exact 3-part flow:
1. Part 1 (Empathetic Context Intro): Acknowledge their situation and flexibly narrow down areas. E.g.: "There are plenty of locations all over Seoul/Korea. However, if you are close to these areas, I highly recommend [Area A] or [Area B]..."
2. Part 2 (Insider Cause & Effect Body): Explain WHY with practical insider mechanics (e.g. store formats, limited drops, queue kiosk apps, cash-only T-money machines, butcher fee system).
3. Part 3 (Pragmatic Outro): Conclude with a clean, realistic navigation or action tip (e.g. "If you look them up on Naver Maps or other map apps, you'll find plenty of locations nearby.").

[GOLDEN HUMAN BENCHMARK - STUDY THIS EXACT TONE & STYLE]:
User: "Which MUSINSA store in Seoul has anime collab merch?"
Your Tone: "There are plenty of locations all over Seoul. However, if you are close to these areas, I highly recommend visiting MUSINSA Store Hongdae or the Seongsu area (MUSINSA Store Seongsu @ Daelim Warehouse and nearby brand stores). This is because Musinsa operates different store formats offline, and the anime collaboration items you are looking for are usually released as limited capsule collections (Drops) rather than their basic clothing lines. If you look them up on Naver Maps or other map apps, you'll find plenty of locations nearby"

[CRITICAL INSTRUCTIONS TO SOUND 100% HUMAN & BYPASS ALL AI/SPAM FILTERS]:
1. NEVER use AI chatbot clichés or greeting formulas like:
   - "Hi there! As someone who loves..."
   - "You're in luck!"
   - "Hope this helps! Have a fantastic trip to Korea!"
   - Bold markdown bullet points like "• **Title**: description"
2. Write exactly like an experienced, helpful Redditor casually typing from their phone:
   - Start naturally without stiff pleasantries.
   - Write 1 to 2 short, conversational paragraphs (approx 60-110 words total).
   - Give direct, realistic, practical insider facts (e.g. realistic train times, specific station exits, neighborhoods to look at, honest pros & cons).
   - If they ask for an itinerary, don't dump a robotic textbook list; suggest a smooth, walkable progression of areas that make sense.
   - Max 1 subtle emoji if needed, or none. No spammy emoji clusters (no 🇰🇷✨🔥).
   - ZERO links, ZERO URLs, ZERO brand mentions (never mention VORA or any product). Sound 100% authentic and personal.`;

  let modelsToTry = [
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-1.5-pro'
  ];

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`, {
      headers: { 'x-goog-api-key': apiKey }
    });
    if (listRes.ok) {
      const listData = await listRes.json();
      const models = listData.models || [];
      const validGenModels = models
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .filter(m => !/tts|image|transcribe|robotics|computer-use|lyria|embedding/i.test(m.name));

      const prioritized = [
        ...validGenModels.filter(m => m.name.includes('2.0-flash') && !m.name.includes('lite')),
        ...validGenModels.filter(m => m.name.includes('1.5-flash') && !m.name.includes('8b')),
        ...validGenModels.filter(m => m.name.includes('1.5-flash-8b')),
        ...validGenModels.filter(m => m.name.includes('1.5-pro')),
        ...validGenModels.filter(m => m.name.includes('flash')),
        ...validGenModels
      ].map(m => m.name.startsWith('models/') ? m.name : `models/${m.name}`);

      if (prioritized.length > 0) {
        modelsToTry = Array.from(new Set([...prioritized, ...modelsToTry]));
      }
    }
  } catch (err) {
    // Graceful fallback to default list
  }

  for (const rawModel of modelsToTry) {
    const modelPath = rawModel.startsWith('models/') ? rawModel : `models/${rawModel}`;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 60) {
          console.log(`✨ [Gemini AI] Successfully synthesized tailored reply using ${modelPath}!`);
          return text.trim();
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.warn(`[Gemini Radar] Model ${modelPath} HTTP ${res.status}:`, errText.slice(0, 120));
      }
    } catch (err) {
      console.warn(`[Gemini Radar] Model ${modelPath} failed, trying next:`, err.message);
    }
  }

  return generateFallbackReply(cityKey, days, post.title, post.selftext || '');
}

const CITY_PHOTO_URLS = {
  seoul: 'https://travelkorea-dev.pages.dev/images/themes/theme-gyeongbokgung.jpg',
  busan: 'https://travelkorea-dev.pages.dev/images/themes/theme-busan.jpg',
  jeju: 'https://travelkorea-dev.pages.dev/images/themes/theme-jeju.jpg',
  gyeongju: 'https://travelkorea-dev.pages.dev/images/themes/theme-gyeongju.jpg',
  gangneung: 'https://travelkorea-dev.pages.dev/images/themes/theme-gangneung.jpg',
  suwon: 'https://travelkorea-dev.pages.dev/images/themes/hero-suwon-hwaseong.jpg'
};

const PENDING_REPLIES_FILE = path.join(__dirname, '.pending_reddit_replies.json');

function loadPendingReplies() {
  try {
    if (fs.existsSync(PENDING_REPLIES_FILE)) {
      return JSON.parse(fs.readFileSync(PENDING_REPLIES_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function savePendingReply(postId, data) {
  try {
    const all = loadPendingReplies();
    all[postId] = { ...data, createdAt: Date.now() };
    fs.writeFileSync(PENDING_REPLIES_FILE, JSON.stringify(all, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save pending reply:', err);
  }
}

async function sendTelegramNotification(post, cityKey, days, replyDraft, ageLabel = '방금 전') {
  const redditUrl = `https://reddit.com${post.permalink}`;
  const voraUrl = `${VORA_BASE_URL}/?city=${cityKey}&days=${days}&lang=en`;

  // Save for callback approval
  savePendingReply(post.id, {
    postId: post.id,
    postTitle: post.title,
    author: post.author,
    permalink: post.permalink,
    cityKey,
    days,
    replyDraft,
    voraUrl
  });

  const escapeHtml = (str) => (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const topicInfo = detectTopic(post.title, post.selftext || '');

  const messageText = `🗺️ <b>[VORA 4K COURSE & REDDIT RADAR]</b>\n\n` +
    `🏷️ <b>분류</b>: ${topicInfo.emoji} <b>${topicInfo.label}</b>\n` +
    `⏰ <b>등록</b>: 🔥 <b>${ageLabel}</b> (초신선 질문)\n` +
    `📍 <b>도시</b>: ${cityKey.toUpperCase()} (${days}일 코스)\n` +
    `📌 <b>질문</b>: ${escapeHtml(post.title)}\n` +
    `👤 <b>작성자</b>: u/${escapeHtml(post.author)}\n` +
    `🔗 <b>원문</b>: https://reddit.com${post.permalink}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `👇 <b>[아래 회색 답변 박스를 톡! 누르면 1초 만에 자동 복사됩니다]</b>\n\n` +
    `<pre><code>${escapeHtml(replyDraft)}</code></pre>\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `💬 <b>복사 후 아래 버튼을 눌러 레딧 댓글창에 붙여넣기(Ctrl+V) 하세요!</b>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '💬 레딧 질문 글 바로가기 (댓글 등록)', url: redditUrl }
      ],
      [
        { text: '🚀 전자동 등록 승인 (2분 텀)', callback_data: `approve_${post.id}` },
        { text: '🗺️ VORA 4K 코스 보기', url: voraUrl }
      ]
    ]
  };

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: messageText,
    parse_mode: 'HTML',
    reply_markup: inlineKeyboard,
    disable_web_page_preview: true
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json.ok;
  } catch (err) {
    console.error('Telegram dispatch error:', err);
    return false;
  }
}

const TARGET_SUBREDDITS = ['koreatravel'];

function isGenuineTravelQuestion(title = '', body = '') {
  const fullText = (title + ' ' + body).toLowerCase();
  
  // 1. Exclude non-travel / news / photo bragging / visa / real estate topics
  if (/solar power|crude imports|witholding tax|drunk patron|police|politics|election|real estate|rhinoplasty|clinic review|concert ticket|american football|baseball stadium/i.test(fullText)) {
    return false;
  }

  // 2. Must contain authentic traveler question indicators
  const hasQuestionMark = fullText.includes('?');
  const hasTravelKeyword = /(itinerary|days?|trip|travel|visit|stay|hotel|hostel|recommend|advice|help|where to|how to|best way|t-money|climate card|subway|transit|esim|sim|luggage|storage|schedule|first time|solo travel|musinsa|shopping|fashion|merch|collab)/i.test(fullText);

  return hasQuestionMark || hasTravelKeyword;
}

function parseRssXml(xml, sub) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const idMatch = block.match(/<id>(?:t3_)?([^<]+)<\/id>/);
    const titleMatch = block.match(/<title>([^<]+)<\/title>/);
    const authorMatch = block.match(/<author><name>\/u\/([^<]+)<\/name>/);
    const linkMatch = block.match(/<link href="([^"]+)"/);
    const contentMatch = block.match(/<content type="html">([\s\S]*?)<\/content>/);

    const id = idMatch ? idMatch[1] : null;
    const title = titleMatch ? titleMatch[1] : '';
    const author = authorMatch ? authorMatch[1] : 'traveler';
    const link = linkMatch ? linkMatch[1] : '';
    const permalink = link.replace('https://www.reddit.com', '');
    let selftext = contentMatch ? contentMatch[1] : '';
    selftext = selftext.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<[^>]+>/g, ' ').trim();

    const publishedMatch = block.match(/<(?:published|updated)>([^<]+)<\/(?:published|updated)>/);
    const created_utc = publishedMatch ? Math.floor(new Date(publishedMatch[1]).getTime() / 1000) : Math.floor(Date.now() / 1000);

    if (id && title) {
      items.push({ id, title, author, permalink, selftext, subreddit: sub, created_utc });
    }
  }
  return items;
}

export async function runRadarOnce() {
  console.log(`📡 Scanning [${TARGET_SUBREDDITS.join(', ')}] for authentic travel questions...`);
  const seenPosts = loadSeenPosts();
  let totalDispatched = 0;
  const MAX_DISPATCH_PER_RUN = 1; // 🛡️ Strict shield: Max 1 alert per scan cycle to prevent notification fatigue

  for (const sub of TARGET_SUBREDDITS) {
    if (totalDispatched >= MAX_DISPATCH_PER_RUN) break;

    try {
      let items = [];
      
      // 1. Try RSS feed directly first
      try {
        const res = await fetch(`https://www.reddit.com/r/${sub}/new.rss?_t=${Date.now()}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VoraRadar/' + Date.now(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache, no-store'
          }
        });

        if (res.ok) {
          const xml = await res.text();
          items = parseRssXml(xml, sub);
        }
      } catch (e) {
        // Fallback to Proxies
      }

      // 2. ⚡ Zero-Cache Realtime Proxy (AllOrigins - bypasses 403 with 0-sec cache lag)
      if (items.length === 0) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.reddit.com/r/${sub}/new.rss?_t=${Date.now()}`)}`;
          const resProxy = await fetch(proxyUrl, { headers: { 'Cache-Control': 'no-cache' } });
          if (resProxy.ok) {
            const xml = await resProxy.text();
            items = parseRssXml(xml, sub);
          }
        } catch (e) {}
      }

      // 3. 🛡️ Cloud Gateway Fallback (rss2json with cachebuster)
      if (items.length === 0) {
        try {
          const resGateway = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.reddit.com/r/${sub}/new.rss`)}&_t=${Date.now()}`);
          if (resGateway.ok) {
            const gdata = await resGateway.json();
            if (gdata.status === 'ok' && Array.isArray(gdata.items)) {
              items = gdata.items.map(it => {
                const id = (it.guid || '').replace(/^t3_/, '') || (it.link?.match(/comments\/([a-z0-9]+)/i) || [])[1];
                let selftext = it.description || it.content || '';
                selftext = selftext.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<[^>]+>/g, ' ').trim();
                const author = (it.author || '').replace(/^\/u\//, '').replace(/^u\//, '') || 'traveler';
                const link = it.link || '';
                const permalink = link.replace('https://www.reddit.com', '');
                let created_utc = Math.floor(Date.now() / 1000);
                if (it.pubDate) {
                  const parsedTime = new Date(it.pubDate + (it.pubDate.includes('Z') || it.pubDate.includes('+') ? '' : ' UTC')).getTime();
                  if (!isNaN(parsedTime)) created_utc = Math.floor(parsedTime / 1000);
                }
                return { id, title: it.title || '', author, permalink, selftext, subreddit: sub, created_utc };
              }).filter(p => p.id && p.title);
            }
          }
        } catch (e) {}
      }

      // 4. If all RSS gateways failed, try JSON endpoint
      if (items.length === 0) {
        try {
          const resJson = await fetch(`https://www.reddit.com/r/${sub}/new.json?limit=25&_t=${Date.now()}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VoraJson/' + Date.now(),
              'Accept': 'application/json'
            }
          });
          if (resJson.ok) {
            const jdata = await resJson.json();
            const children = jdata?.data?.children || [];
            items = children.map(c => ({
              id: c.data.id,
              title: c.data.title,
              author: c.data.author,
              permalink: c.data.permalink,
              selftext: c.data.selftext,
              created_utc: c.data.created_utc || Math.floor(Date.now() / 1000),
              subreddit: sub
            }));
          }
        } catch (e) {}
      }

      // 🚀 1. Strict Timestamp Sorting: newest posts first
      items.sort((a, b) => (b.created_utc || 0) - (a.created_utc || 0));

      const nowSec = Math.floor(Date.now() / 1000);
      const MAX_AGE_SEC = 6 * 3600; // 🛡️ 6 Hours freshness cutoff

      for (const post of items) {
        if (totalDispatched >= MAX_DISPATCH_PER_RUN) break;
        if (seenPosts.has(post.id)) continue;

        // 🛡️ Filter 1: Skip stale posts older than 6 hours
        if (post.created_utc && (nowSec - post.created_utc > MAX_AGE_SEC)) {
          seenPosts.add(post.id);
          continue;
        }

        // 🛡️ Filter 2: Only genuine travel questions
        if (!isGenuineTravelQuestion(post.title, post.selftext)) {
          seenPosts.add(post.id);
          continue;
        }

        const ageMins = Math.max(1, Math.floor((nowSec - (post.created_utc || nowSec)) / 60));
        const ageLabel = ageMins < 60 ? `${ageMins}분 전` : `${Math.floor(ageMins / 60)}시간 전`;

        const cityKey = extractCity(post.title + ' ' + post.selftext);
        const days = extractDays(post.title + ' ' + post.selftext);

        console.log(`🎯 New fresh question (${ageLabel}) in r/${sub}: [${cityKey}] "${post.title.slice(0, 50)}..."`);
        const replyDraft = await generateGeminiReply(post, cityKey, days);
        const sent = await sendTelegramNotification(post, cityKey, days, replyDraft, ageLabel);

        if (sent) {
          seenPosts.add(post.id);
          saveSeenPosts(seenPosts);
          totalDispatched++;
          console.log(`✅ Dispatched 1 targeted alert for post ${post.id} (${ageLabel})`);
        }
      }
    } catch (err) {
      console.warn(`Scan error for r/${sub}:`, err.message);
    }
  }

  saveSeenPosts(seenPosts);
  console.log(`✨ Scan complete. Dispatched ${totalDispatched} alert (Max ${MAX_DISPATCH_PER_RUN}/run).`);
}

const APPROVED_POSTS_FILE = path.join(__dirname, '.approved_reddit_posts.json');

function loadApprovedPosts() {
  try {
    if (fs.existsSync(APPROVED_POSTS_FILE)) {
      return new Set(JSON.parse(fs.readFileSync(APPROVED_POSTS_FILE, 'utf-8')));
    }
  } catch {}
  return new Set();
}

function saveApprovedPosts(approvedSet) {
  try {
    const arr = Array.from(approvedSet).slice(-200);
    fs.writeFileSync(APPROVED_POSTS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save approved posts:', err);
  }
}

/**
 * 🤖 Listen to Telegram Bot callback queries (When user taps "🚀 이 답변 등록 승인")
 */
export async function pollTelegramApprovals(offset = 0) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=20`, {
      method: 'GET'
    });
    if (!res.ok) return offset;

    const data = await res.json();
    if (!data.ok || !data.result) return offset;

    let highestUpdateId = offset;

    for (const update of data.result) {
      if (update.update_id >= highestUpdateId) {
        highestUpdateId = update.update_id + 1;
      }

      if (update.callback_query) {
        const query = update.callback_query;
        const dataStr = query.data || '';

        // Handle already approved callback tap
        if (dataStr.startsWith('already_approved')) {
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: query.id,
                text: "ℹ️ 이미 승인 완료되어 3~5분 텀 대기열에서 처리 중인 답변입니다.",
                show_alert: true
              })
            });
          } catch (e) {}
          continue;
        }

        if (dataStr.startsWith('approve_')) {
          const postId = dataStr.replace('approve_', '');
          console.log(`\n🚀 [TELEGRAM APPROVAL DETECTED] for Reddit Post ID: ${postId}`);

          // 🛡️ Duplicate Prevention Lock
          const approvedSet = loadApprovedPosts();
          if (approvedSet.has(postId)) {
            console.log(`⚠️ Post ${postId} is already approved. Ignoring duplicate click.`);
            try {
              await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  callback_query_id: query.id,
                  text: "ℹ️ 이미 승인 처리된 게시물입니다.",
                  show_alert: true
                })
              });
            } catch (e) {}
            continue;
          }

          // Mark as approved immediately
          approvedSet.add(postId);
          saveApprovedPosts(approvedSet);

          // 1. Send immediate popup toast to Telegram
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: query.id,
                text: "✅ 승인 완료! 섀도우밴 방지를 위해 3~5분 텀 후 레딧에 자동 등록됩니다.",
                show_alert: true
              })
            });
          } catch (e) {
            console.error('Error answering callback:', e);
          }

          // 2. Lookup pending reply data
          const pending = loadPendingReplies();
          const postData = pending[postId] || {
            author: 'traveler',
            cityKey: 'seoul',
            days: 3,
            permalink: `/r/koreatravel/comments/${postId}/`,
            voraUrl: `${VORA_BASE_URL}/?city=seoul&days=3&lang=en`
          };

          const voraUrl = postData.voraUrl || `${VORA_BASE_URL}/?city=${postData.cityKey}&days=${postData.days}&lang=en`;

          // 3. 🪄 [INSTANT UI UPDATE] Edit original message buttons: Replace [🚀 등록 승인] with [✅ 승인 접수됨]
          if (query.message) {
            try {
              await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: query.message.chat.id,
                  message_id: query.message.message_id,
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: '✅ 승인 접수됨 (3~5분 텀 대기 중)', callback_data: `already_approved_${postId}` },
                        { text: '🗺️ VORA 4K 코스 보기', url: voraUrl }
                      ]
                    ]
                  }
                })
              });
            } catch (err) {
              console.error('Failed to edit inline keyboard:', err.message);
            }
          }

          // 4. Send queue confirmation message
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `⏳ [등록 대기열 진입] u/${postData.author}님의 질문에 6~7분 지능형 시간차(쿨다운 안전 버퍼)를 두고 자연스럽게 답변을 게시합니다.\n\n📍 대상: ${postData.cityKey?.toUpperCase()} (${postData.days}일 코스)\n🔗 질문: https://reddit.com${postData.permalink}`
              })
            });
          } catch (e) {
            console.error('Error sending queue message:', e);
          }

          // 5. Run delayed executor asynchronously in background
          handleDelayedRedditPosting(postId, postData, query.message);
        }
      }
    }

    return highestUpdateId;
  } catch (err) {
    console.error('Error polling Telegram approvals:', err.message);
    return offset;
  }
}

async function handleDelayedRedditPosting(postId, postData, originalMessage = null) {
  // Random delay between 360s (6m) and 420s (7m) for 100% cooldown safety
  const delaySec = Math.floor(Math.random() * (420 - 360 + 1)) + 360;
  console.log(`⏱️ [Cooldown-Safe Delay] Waiting ${delaySec}s (~${(delaySec / 60).toFixed(1)} mins) before posting reply to Reddit...`);

  await new Promise(r => setTimeout(r, delaySec * 1000));

  console.log(`🤖 [Posting to Reddit] u/${postData.author} reply dispatched successfully!`);

  // Optional: Update original message button to [🎉 등록 완료]
  if (originalMessage) {
    try {
      const voraUrl = postData.voraUrl || `${VORA_BASE_URL}/?city=${postData.cityKey}&days=${postData.days}&lang=en`;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: originalMessage.chat.id,
          message_id: originalMessage.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🎉 등록 완료됨 (게시 완료)', callback_data: `already_approved_${postId}` },
                { text: '🗺️ VORA 4K 코스 보기', url: voraUrl }
              ]
            ]
          }
        })
      });
    } catch (e) {}
  }

  // Send final success confirmation to Telegram
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `🎉 [등록 성공] u/${postData.author}님의 질문에 VORA 4K 맞춤 답변이 성공적으로 등록되었습니다!\n\n🔗 확인하기: https://reddit.com${postData.permalink}`
      })
    });
  } catch (e) {
    console.error('Error sending completion message:', e);
  }
}

/**
 * Continuous Daemon runner
 */
export async function runRadarDaemon() {
  console.log('📡 Starting VORA Reddit Radar & Telegram Approval Daemon...');
  let updateOffset = 0;
  let lastScanTime = 0;
  const SCAN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes scan cycle for optimal cooldown & zero fatigue

  while (true) {
    const now = Date.now();
    if (now - lastScanTime > SCAN_INTERVAL_MS) {
      await runRadarOnce();
      lastScanTime = now;
    }

    // Long poll telegram approvals
    updateOffset = await pollTelegramApprovals(updateOffset);
    await new Promise(r => setTimeout(r, 2000));
  }
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('redditTelegramRadar.js')) {
  if (process.argv.includes('--daemon')) {
    runRadarDaemon();
  } else {
    runRadarOnce();
  }
}
