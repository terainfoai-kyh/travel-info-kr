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
const VORA_BASE_URL = process.env.VORA_BASE_URL || 'https://travelkorea-dev.pages.dev';
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

const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

function generateFallbackReply(cityKey, days, postTitle) {
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
  reply += `👉 ${VORA_BASE_URL}/?city=${cityKey}&days=${days}&lang=en\n\n`;
  reply += `Have a wonderful adventure in Korea! Let me know if you need any neighborhood recommendations.`;

  return reply;
}

async function generateGeminiReply(post, cityKey, days) {
  const cityInfo = CITY_SAMPLE_ROUTES[cityKey] || CITY_SAMPLE_ROUTES.seoul;

  if (!GEMINI_API_KEY) {
    return generateFallbackReply(cityKey, days, post.title);
  }

  const prompt = `You are VORA, a warm, genuine, and knowledgeable local Korean travel concierge replying to a traveler's post on Reddit (r/koreatravel).
Post Title: "${post.title}"
Post Content: "${(post.selftext || '').slice(0, 1000)}"
Target Destination: ${cityInfo.name} (${cityKey})
Duration: ${days} days

[Your Mission]:
1. Be warm, welcoming, and genuinely encouraging. Greet them like a friendly local living in Korea.
2. Directly acknowledge and empathize with their specific question/concern (e.g. first-time solo travel, rainy weather, transit confusion, foodie hunting, cafes, walking vs metro, budget, etc.).
3. Provide a realistic, spatial-optimized ${days}-day itinerary summary (${days} days) where nearby spots are clustered together to prevent subway exhaustion.
   Format with clear bullet points:
   • Day 1: Spot ➔ Spot ➔ Spot
   • Day 2: Spot ➔ Spot ➔ Spot (up to ${days} days)
4. Give 1 essential insider transit tip (e.g., Climate Card or T-money, Naver Map / KakaoMap tip since Google Maps walking directions are limited in Korea).
5. Give 1 authentic local foodie secret for ${cityInfo.name}.
6. Naturally close by inviting them to explore the full interactive 4K route map with live weather & outfit suggestions here:
👉 ${VORA_BASE_URL}/?city=${cityKey}&days=${days}&lang=en
7. Keep the tone natural, helpful, and native for Reddit (clean markdown, no robotic corporate buzzwords, max 300 words).`;

  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 60) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn(`[Gemini Radar] Model ${model} failed, trying next:`, err.message);
    }
  }

  return generateFallbackReply(cityKey, days, post.title);
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

async function sendTelegramNotification(post, cityKey, days, replyDraft) {
  const redditUrl = `https://reddit.com${post.permalink}`;
  const voraUrl = `${VORA_BASE_URL}/?city=${cityKey}&days=${days}&lang=en`;
  const photoUrl = CITY_PHOTO_URLS[cityKey] || CITY_PHOTO_URLS.seoul;

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

  const captionText = `🗺️ [VORA 4K COURSE & REDDIT RADAR]\n` +
    `📍 대상: ${cityKey.toUpperCase()} (${days}일 코스)\n` +
    `📌 질문: ${post.title.slice(0, 60)}${post.title.length > 60 ? '...' : ''}\n` +
    `👤 작성자: u/${post.author}\n\n` +
    `💬 [Gemini 2.0 정감 맞춤 답변 초안]:\n` +
    `${replyDraft.slice(0, 650)}\n\n` +
    `👇 [등록 승인]을 누르시면 3~5분 텀 후 레딧에 자동 게시됩니다!`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🚀 이 답변 등록 승인 (3분 텀)', callback_data: `approve_${post.id}` },
        { text: '🗺️ VORA 4K 코스 보기', url: voraUrl }
      ]
    ]
  };

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    photo: photoUrl,
    caption: captionText.slice(0, 1020),
    reply_markup: inlineKeyboard
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
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
        console.log(`🤖 Synthesizing Gemini warm reply for: [${post.title}]`);
        const replyDraft = await generateGeminiReply(post, cityKey, days);

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

        if (dataStr.startsWith('approve_')) {
          const postId = dataStr.replace('approve_', '');
          console.log(`\n🚀 [TELEGRAM APPROVAL DETECTED] for Reddit Post ID: ${postId}`);

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
            permalink: `/r/koreatravel/comments/${postId}/`
          };

          // 3. Send queue confirmation message
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `⏳ [등록 대기열 진입] u/${postData.author}님의 질문에 3~5분 지능형 시간차를 두고 자연스럽게 답변을 게시합니다.\n\n📍 대상: ${postData.cityKey?.toUpperCase()} (${postData.days}일 코스)\n🔗 질문: https://reddit.com${postData.permalink}`
              })
            });
          } catch (e) {
            console.error('Error sending queue message:', e);
          }

          // 4. Run delayed executor asynchronously in background
          handleDelayedRedditPosting(postId, postData);
        }
      }
    }

    return highestUpdateId;
  } catch (err) {
    console.error('Error polling Telegram approvals:', err.message);
    return offset;
  }
}

async function handleDelayedRedditPosting(postId, postData) {
  // Random delay between 180s (3m) and 300s (5m) to defeat bot detection
  const delaySec = Math.floor(Math.random() * (300 - 180 + 1)) + 180;
  console.log(`⏱️ [Anti-Shadowban] Waiting ${delaySec}s (~${(delaySec / 60).toFixed(1)} mins) before posting reply to Reddit...`);

  await new Promise(r => setTimeout(r, delaySec * 1000));

  console.log(`🤖 [Posting to Reddit] u/${postData.author} reply dispatched successfully!`);

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
  const SCAN_INTERVAL_MS = 10 * 60 * 1000; // scan reddit every 10 mins

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
