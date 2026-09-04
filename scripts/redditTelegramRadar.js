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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8862336937:AAGjolvwXh3BEBrLa1PMWFHLDu2ipcf90D0';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8955008233';
const SEEN_POSTS_FILE = path.join(__dirname, '.seen_reddit_posts.json');

// Localized sample itineraries for instant fallback generation
const CITY_SAMPLE_ROUTES = {
  seoul: {
    name: 'Seoul',
    routes: [
      'Day 1: Gyeongbokgung Palace ➔ Bukchon Hanok Village ➔ Insadong Art Street',
      'Day 2: Seongsu-dong Cafe Street ➔ Seoul Forest ➔ Dongdaemun Design Plaza (DDP)',
      'Day 3: Gwangjang Market (K-Street Food) ➔ N-Seoul Tower Sunset & Night View',
      'Day 4: Hongdae Youth Street ➔ Yeouido Hangang Park (Ramen & Sunset River Walk)',
      'Day 5: Gangnam Starfield COEX Library ➔ Bongeunsa Temple ➔ Lotte World Tower'
    ],
    transitTip: 'Grab a Climate Card (기후동행카드) or T-money card at any convenience store for unlimited subway & bus rides.',
    foodTip: 'Do not miss warm Bindaetteok & Kimbap at Gwangjang Market or authentic Hanok brunch near Anguk station.'
  },
  busan: {
    name: 'Busan',
    routes: [
      'Day 1: Haeundae Blueline Park Sky Capsule ➔ Cheongsapo Skywalk ➔ Gwangalli Beach Drone Show',
      'Day 2: Huinnyeoul Culture Village ➔ Jagalchi Fish Market ➔ Busan Tower & Nampo BIFF Square',
      'Day 3: Haedong Yonggungsa Seaside Temple ➔ Gijang Crab Market ➔ Osiria Coastal Walk'
    ],
    transitTip: 'Take Metro Line 2 for Haeundae and Gwangalli, or taxi along the Gwangan Bridge for panoramic ocean views.',
    foodTip: 'Try authentic Pork Soup (Dwaeji Gukbap) near Seomyeon and fresh sashimi at Jagalchi Market.'
  },
  jeju: {
    name: 'Jeju Island',
    routes: [
      'Day 1: Seongsan Ilchulbong (Sunrise Peak) ➔ Seopjikoji Coast ➔ Hamdeok Beach',
      'Day 2: Hallasan Eoseungsaengak Trail ➔ Jeongbang Waterfall ➔ Seogwipo Olle Market',
      'Day 3: Aewol Handam Coastal Trail ➔ Hyeopjae Beach ➔ Osulloc Green Tea Plantation'
    ],
    transitTip: 'Renting a car or hiring an English-speaking taxi tour is the most convenient way to explore eastern & western coasts.',
    foodTip: 'Black Pork BBQ (Heukdwaeji) and fresh Abalone Porridge are absolute must-tries in Jeju.'
  },
  gyeongju: {
    name: 'Gyeongju',
    routes: [
      'Day 1: Bulguksa Temple ➔ Seokguram Grotto ➔ Daereungwon Ancient Tombs Complex',
      'Day 2: Cheomseongdae Observatory ➔ Hwangridan-gil Trendy Cafes ➔ Donggung Palace & Wolji Pond (Night View)'
    ],
    transitTip: 'Take KTX to Singyeongju Station, then express bus 700 directly into the historic city center.',
    foodTip: 'Stroll Hwangridan-gil for modern K-pastries and try historic 10-Won Coin Cheese bread.'
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

function generateReplyDraft(cityKey, days, postTitle) {
  const cityInfo = CITY_SAMPLE_ROUTES[cityKey] || CITY_SAMPLE_ROUTES.seoul;
  const daysToUse = Math.min(days, cityInfo.routes.length);
  const selectedRoutes = cityInfo.routes.slice(0, daysToUse);

  let reply = `Hey there! Welcome to Korea! 🇰🇷✨\n\n`;
  reply += `For your ${days}-day trip in ${cityInfo.name}, here is a spatial-optimized route with minimal transit waste:\n\n`;

  selectedRoutes.forEach(r => {
    reply += `• ${r}\n`;
  });

  reply += `\n💡 **Transit Tip**: ${cityInfo.transitTip}\n`;
  reply += `🍲 **Foodie Secret**: ${cityInfo.foodTip}\n\n`;
  reply += `I've put together a full interactive 4K route map with live weather & outfit suggestions here:\n`;
  reply += `👉 https://koreatravel.cc/?city=${cityKey}&days=${days}\n\n`;
  reply += `Have a wonderful adventure in Korea! Let me know if you need any neighborhood recommendations.`;

  return reply;
}

async function sendTelegramNotification(post, cityKey, days, replyDraft) {
  const redditUrl = `https://reddit.com${post.permalink}`;
  const voraUrl = `https://koreatravel.cc/?city=${cityKey}&days=${days}`;

  const messageText = `📢 [r/koreatravel 새 여행 질문 감지!]\n\n` +
    `📍 대상 도시: ${cityKey.toUpperCase()} (${days}일 코스)\n` +
    `📌 제목: ${post.title}\n` +
    `👤 작성자: u/${post.author}\n\n` +
    `💬 [추천 답변 초안 (복사하여 댓글에 붙여넣기)]:\n\n` +
    `${replyDraft}\n\n` +
    `👇 아래 버튼을 누르면 레딧 질문 글로 바로 이동합니다!`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🚀 레딧 질문글 열고 댓글 달기', url: redditUrl },
        { text: '🗺️ VORA 4K 코스 열기', url: voraUrl }
      ]
    ]
  };

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: messageText,
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

export async function runRadarOnce() {
  console.log('📡 Scanning r/koreatravel for recent trip queries...');
  const seenPosts = loadSeenPosts();

  try {
    const res = await fetch('https://www.reddit.com/r/koreatravel/new.json?limit=15', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 VoraBot/1.0'
      }
    });

    if (!res.ok) {
      console.warn('Reddit fetch status:', res.status);
      return;
    }

    const data = await res.json();
    const children = data?.data?.children || [];
    let dispatchedCount = 0;

    for (const item of children) {
      const post = item.data;
      if (!post || seenPosts.has(post.id)) continue;

      const combinedText = `${post.title} ${post.selftext || ''}`;
      const isQuestion = /(itinerary|days?|trip|route|plan|recommend|help|places|spots|advice|first time|seoul|busan|jeju)/i.test(combinedText);

      if (isQuestion) {
        const cityKey = extractCity(combinedText);
        const days = extractDays(combinedText);
        const replyDraft = generateReplyDraft(cityKey, days, post.title);

        console.log(`🎯 Found matching query: [${post.title}] by u/${post.author}`);
        const success = await sendTelegramNotification(post, cityKey, days, replyDraft);

        if (success) {
          console.log(`✅ Dispatched alert to Telegram (Post ID: ${post.id})`);
          seenPosts.add(post.id);
          dispatchedCount++;
        }
      } else {
        seenPosts.add(post.id);
      }
    }

    saveSeenPosts(seenPosts);
    console.log(`✨ Scan complete. Dispatched ${dispatchedCount} new query alert(s).`);
  } catch (err) {
    console.error('Error during Reddit scan:', err);
  }
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('redditTelegramRadar.js')) {
  runRadarOnce();
}
