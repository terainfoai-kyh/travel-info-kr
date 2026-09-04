import { generateLocalFallbackItinerary } from '../src/services/localItineraryGenerator.js';

async function sendTestTelegram() {
  console.log('🚀 Generating 100% genuine live itinerary from VORA engine...');

  const samplePost = {
    id: 'test_' + Date.now().toString(36),
    title: 'First time in Seoul for 3 days - need food & night view spots!',
    author: 'RedditTraveler2026',
    permalink: '/r/koreatravel/comments/sample_test_query/',
    selftext: 'Visiting Seoul next week for 3 days. Looking for authentic markets, nice Hanok vibe, and good evening views.'
  };

  // 🌟 Direct call to real app engine
  const realAppResult = await generateLocalFallbackItinerary('Create Seoul 3-day plan', '서울', 3, 'en');
  let realRoutes = [];
  if (realAppResult && realAppResult.dailySchedules) {
    realRoutes = realAppResult.dailySchedules.map(ds => {
      const spotNames = (ds.spots || []).map(s => (s.title || s.name || '').trim()).filter(Boolean);
      return `Day ${ds.day}: ${spotNames.join(' ➔ ')}`;
    });
  }

  const sampleReply = `Hey there! Welcome to Korea! 🇰🇷✨\n\n` +
    `For your 3-day trip in Seoul, here is the exact spatial-optimized route that matches our live 4K itinerary map:\n\n` +
    realRoutes.map(r => `• ${r}`).join('\n') +
    `\n\n💡 Tip: Grab a Climate Card at any convenience store for unlimited subway & bus rides!\n` +
    `🍲 Foodie Secret: Don't miss warm Bindaetteok & Kimbap at Gwangjang Market!`;

  const TELEGRAM_BOT_TOKEN = '8862336937:AAGjolvwXh3BEBrLa1PMWFHLDu2ipcf90D0';
  const TELEGRAM_CHAT_ID = '8955008233';
  const voraUrl = 'https://travelkorea-dev.pages.dev/?city=seoul&days=3&lang=en';

  const messageText = `🗺️ [VORA 4K COURSE & REDDIT RADAR]\n\n` +
    `📍 대상: SEOUL (3일 코스)\n` +
    `📌 질문: ${samplePost.title}\n` +
    `👤 작성자: u/${samplePost.author}\n` +
    `🔗 원문: https://reddit.com${samplePost.permalink}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `💬 [VORA 엔진 100% 직결 실시간 맞춤 답변 초안]:\n\n` +
    `${sampleReply}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `👇 [등록 승인]을 누르시면 3~5분 텀 후 레딧에 자동 게시됩니다!`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🚀 이 답변 등록 승인 (3분 텀)', callback_data: `approve_${samplePost.id}` },
        { text: '🗺️ VORA 4K 코스 보기', url: voraUrl }
      ]
    ]
  };

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: messageText,
    reply_markup: inlineKeyboard,
    disable_web_page_preview: true
  };

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  console.log('Telegram API response:', json.ok ? 'SUCCESS ✅' : json);
}

sendTestTelegram();
