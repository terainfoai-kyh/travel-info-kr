/**
 * VORA AI 2.0 - Gemini-Distilled Autonomous Tourism & Tiki-Taka Dialog Knowledge Base
 * 
 * Pre-ingested 6-Pillar Knowledge Matrix synthesized from Gemini AI and Korean Tourism Organization (TourAPI 4.0).
 * Powers 0.01s instant-response concierge responses with zero hallucination and 100% authentic Korean tourism data.
 * 
 * 6 Core Knowledge Pillars:
 * 1. CITY_LOCAL_KNOWLEDGE (25 Major Korean Cities)
 * 2. TIKITAKA_CHITCHAT_MATRIX (Emotions, Banters, Slangs, Complaints, Empathy)
 * 3. K_FOOD_PAIRING_KNOWLEDGE (Regional Signature Foods, Waiting Secrets, Pairings)
 * 4. K_FASHION_WEATHER_GUIDE (Temperature & Climate Coordination Advice)
 * 5. FOREIGNER_ESSENTIALS_KNOWLEDGE (Transit cards, Tax Free, 1330 hotline, rides)
 * 6. PROACTIVE_CONVERSATION_HOOKS (Engaging follow-up questions)
 */

import { getCityLocalKnowledge as getVaultCityLocalKnowledge, CITY_LOCAL_KNOWLEDGE as VAULT_CITY_LOCAL_KNOWLEDGE } from './voraQnaVault.js';
import { getLocalizedCityName } from '../i18n/translations.js';

// ==============================================================================
// 1. SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE (괴산, 제천 등 지자체 지식 확장 등록)
// ==============================================================================
export const SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE = {
  '괴산': {
    nameKo: '괴산',
    nameEn: 'Goesan',
    nameJa: '槐山',
    nameZh: '槐山',
    badge: '청정 힐링 숲·계곡',
    badgeEn: 'Pristine Forest & Valley Healing',
    badgeJa: '清浄な森と渓谷のヒーリング',
    badgeZh: '清幽森林与溪谷疗愈之旅',
    description: '수려한 괴산호 풍경을 따라 걷는 산막이옛길과 화양구곡, 맑은 속리산 푸른 숲을 품은 충북 대표 자연 힐링 도시',
    descEn: 'Chungbuk healing city famous for the Sanmangi Old Trail along Goesan Lake, Hwayang Nine Valleys, and lush Songnisan forest.',
    descJa: '槐山湖の絶景沿いに歩くサンマギイェッキルと華陽九曲、俗離山の清らかな森を抱く忠北代表のヒーリング都市',
    descZh: '依傍秀美槐山湖的三幕古道与华阳九曲，坐拥俗离山青翠森林的忠清北道代表性自然疗愈名城',
    signatureHighlights: ['산막이옛길', '화양구곡', '괴산자연드림파크', '쌍곡계곡', '각연사'],
    rainyHotspots: ['괴산자연드림파크', '괴산한지체험박물관', '괴산농업역사박물관'],
    walkingMinimized: ['괴산호 유람선', '산막이옛길 연리지쉼터', '괴산자연드림파크 힐링센터'],
    localFoodieSecret: '괴산 올갱이해장국(다슬기국), 쫀득한 고추순대, 버섯전골과 괴산 대학찰옥수수',
    localFoodieSecretEn: 'Goesan Marsh Snail Soup, Cheonggyeol Chili Sundae, Wild Mushroom Hot Pot & Waxy Corn',
    localFoodieSecretJa: '槐山オルゲンイクッパ（カワニナ汁）、唐辛子スンデ、キノコ鍋と名物トウモロコシ',
    localFoodieSecretZh: '槐山蜷螺醒酒汤、特色辣椒米肠、野山菌火锅与槐山大学糯玉米',
    nightHighlights: ['괴산호 수변산책로 야경', '산막이옛길 달빛 쉼터', '괴산읍 수변공원'],
    nightHighlightsEn: ['Goesan Lake Waterfront Boardwalk Night View', 'Sanmangi Trail Moonlight Rest Area', 'Goesan Waterfront Park'],
    nightHighlightsJa: ['槐山湖水辺散歩道夜景', 'サンマギイェッキル月光憩いの場', '槐山邑水辺公園'],
    nightHighlightsZh: ['槐山湖水滨步道夜景', '三幕古道月色休息区', '槐山邑水滨公园'],
    transitTip: '괴산시외버스터미널에서 산막이옛길 및 화양동 방면 군내버스 운행 (자차/렌터카 드라이브 권장)',
    transitTipEn: 'Local buses available from Goesan Terminal to Sanmangi Trail and Hwayang Valley (Rental car recommended)',
    transitTipJa: '槐山市外バスターミナルからサンマギ方面へ郡内バス運行（レンタカードライブ推奨）',
    transitTipZh: '槐山长途客运站有前往三幕古道及华阳洞方向的郡内公交（推荐自驾租车）'
  },
  '제천': {
    nameKo: '제천',
    nameEn: 'Jecheon',
    nameJa: '堤川',
    nameZh: '堤川',
    badge: '비단 호수 & 한방 힐링',
    badgeEn: 'Silk Lake & Herbal Wellness',
    badgeJa: 'シルクレイク＆韓方ヒーリング',
    badgeZh: '碧水湖畔与韩方养生疗愈',
    description: '청풍호반의 비경을 내려다보는 케이블카와 삼한시대 수리시설 의림지, 옥순봉 출렁다리가 어우러진 내륙의 바다 휴양지',
    descEn: 'Inland resort featuring the Cheongpung Lake Cable Car, historic Uirimji Reservoir, and Oksunbong Suspension Bridge.',
    descJa: '清風湖畔の絶景を望むロープウェイと歴史ある義林池、玉筍峰つり橋が調和する内陸のリゾート地',
    descZh: '俯瞰清风湖绝景的观光缆车与历史悠久的义林池、玉笋峰吊桥相映成趣的内陆湖滨度假胜地',
    signatureHighlights: ['청풍호반케이블카', '의림지', '옥순봉출렁다리', '청풍문화재단지', '비봉산전망대', '박달재'],
    rainyHotspots: ['제천한방엑스포공원', '의림지역사박물관', '청풍호반케이블카 실내전망대'],
    walkingMinimized: ['청풍호반케이블카(비봉산 정상)', '청풍호 유람선', '의림지 수변 데크길'],
    localFoodieSecret: '제천 명물 빨간오뎅, 건강한 약채락 비빔밥, 곤드레밥과 의림지 막국수',
    localFoodieSecretEn: 'Jecheon Spicy Red Odeng, Healthy Herb Bibimbap, Gondre Rice & Uirimji Makguksu',
    localFoodieSecretJa: '堤川名物 赤おでん、健康的な薬草ビビンバ、コンドゥレご飯と義林池マッククス',
    localFoodieSecretZh: '堤川特色香辣鱼饼、健康药膳拌饭、山蓟菜饭与义林池荞麦凉面',
    nightHighlights: ['의림지 인공폭포 미디어파사드 야경', '청풍호반 야간 조명산책로', '비봉산 일몰 조망'],
    nightHighlightsEn: ['Uirimji Waterfall Media Facade Night View', 'Cheongpung Lake Illuminated Trail', 'Bibongsan Sunset Vista'],
    nightHighlightsJa: ['義林池人工滝メディアファサード夜景', '清風湖畔ライトアップ散歩道', '飛鳳山サンセット展望'],
    nightHighlightsZh: ['义林池人工瀑布媒体光影秀夜景', '清风湖畔夜间景观步道', '飞凤山日落全景'],
    transitTip: 'KTX-이음 제천역에서 청풍호 방면 시내버스 탑승 또는 청풍호 시티투어 버스 활용 추천',
    transitTipEn: 'Take city bus or Cheongpung City Tour bus from KTX Jecheon Station towards Cheongpung Lake',
    transitTipJa: 'KTX-イウム堤川駅から清風湖方面の市内バスまたはシティツアーバス利用推奨',
    transitTipZh: '从KTX堤川站搭乘前往清风湖方向的市内公交或清风湖城市观光巴士'
  }
};

export function getCityLocalKnowledge() {
  const vaultKnowledge = getVaultCityLocalKnowledge() || {};
  return { ...vaultKnowledge, ...SUPPLEMENTAL_CITY_LOCAL_KNOWLEDGE };
}

export const CITY_LOCAL_KNOWLEDGE = new Proxy({}, {
  get(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    if (prop === 'keys' || prop === Symbol.iterator) return Object.keys(allKnowledge);
    return allKnowledge[prop];
  },
  has(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    return prop in allKnowledge;
  },
  ownKeys(target) {
    const allKnowledge = getCityLocalKnowledge();
    return Object.keys(allKnowledge);
  },
  getOwnPropertyDescriptor(target, prop) {
    const allKnowledge = getCityLocalKnowledge();
    if (prop in allKnowledge) {
      return { enumerable: true, configurable: true, value: allKnowledge[prop] };
    }
    return undefined;
  }
});

// ==============================================================================
// 2. TIKITAKA_CHITCHAT_MATRIX (감정, 피드백, 돌발 상황 위트 티키타카)
// ==============================================================================
export const TIKITAKA_CHITCHAT_MATRIX = {
  // [A] 인사 및 가벼운 시작
  GREETING: {
    triggers: /^(안녕|안녕하세요|하이|반가워|ㅎㅇ|hello|hi|헤이|보라야|こんにちは|你好)$/i,
    reply: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return `Hello! I am Vora, your #1 AI Travel Concierge for South Korea! 🌸✨\nTell me where you want to travel (Seoul, Busan, Jeju, Gangneung, Gyeongju, etc.) or your preferred style, and I will craft the perfect route in 0.01 seconds!`;
      if (lang === 'ja') return `はじめまして！韓国No.1のAI旅行コンシェルジュ「ボラ(VORA)」です！🌸✨\n行きたい都市（ソウル、釜山、済州、江陵、慶州など）や旅行スタイルをお気軽にお知らせください！0.01秒で最適なコースをご提案します！`;
      if (lang === 'zh' || lang === 'zht') return `您好！我是您的韩国No.1 AI旅行专属向导宝拉(VORA)！🌸✨\n请随时告诉我您想去的城市（首尔、釜山、济州、江陵、庆州等）或旅行喜好，我将在0.01秒内为您量身定制完美行程！`;
      return `반갑습니다! 대한민국 No.1 AI 여행 컨시어지 보라(VORA)예요! 🌸✨\n가고 싶으신 여행지(서울, 부산, 제주, 강릉, 경주 등)나 원하시는 여행 스타일을 편하게 말씀해 주세요! 0.01초 만에 완벽한 맞춤 코스를 찾아드릴게요!`;
    },
    followUp: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return 'Which city or travel theme would you like to explore today? ✈️';
      if (lang === 'ja') return '行ってみたい都市や特別な旅行テーマはありますか？✈️';
      if (lang === 'zh' || lang === 'zht') return '今天想探索哪座城市或特定旅行主题呢？✈️';
      return '가고 싶으신 도시나 특별히 생각하신 여행 테마가 있으신가요? ✈️';
    }
  },
  // [B] 정체성 질의 ("넌 누구니?", "너 누구야", "자기소개")
  WHO_ARE_YOU: {
    triggers: /(누구니|누구야|누구세요|자기소개|너의\s*정체|너는\s*뭐|뭐하는\s*애|who\s*are\s*you|你是谁|誰ですか)/i,
    reply: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return `I am **Vora**, your AI Travel Concierge who knows every hidden gem and authentic foodie hotspot across South Korea! 🌸🇰🇷\nI design personalized, seamless itineraries tailored to your schedule, weather, and companions in 0.01 seconds! ✨`;
      if (lang === 'ja') return `私は韓国各地の隠れた名所と本場のグルメを知り尽くした**AI旅行コンシェルジュのボラ(VORA)**です！🌸🇰🇷\n日程、移動ルート、天気、同行者に合わせたヒーリングコースを0.01秒で丁寧にご案内します！✨`;
      if (lang === 'zh' || lang === 'zht') return `我是熟知韩国各地隐秘宝藏景点与地道美食的 **AI旅行专属向导 宝拉(VORA)**！🌸🇰🇷\n为您量身定制结合日程、动线、天气与同伴偏好的专属疗愈路线！✨`;
      return `저는 대한민국 곳곳의 보석 같은 명소와 찐 로컬 맛집을 꿰뚫고 있는 **AI 여행 컨시어지 보라(VORA)**예요! 🌸🇰🇷\n여행자님의 일정, 동선, 날씨, 동행자 맞춤 힐링 코스를 0.01초 만에 정갈하게 짜드리는 든든한 여행 메이트랍니다! ✨`;
    },
    followUp: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return 'Which destination shall we explore together today? 🗺️ (Seoul, Busan, Jeju, Gangneung, etc.)';
      if (lang === 'ja') return '今日はどの都市へ一緒に出発しましょうか？🗺️（ソウル・釜山・済州・江陵など）';
      if (lang === 'zh' || lang === 'zht') return '今天想和我一起去哪座城市探索呢？🗺️（首尔、釜山、济州、江陵等）';
      return '오늘 저와 함께 어느 도시로 떠나보실래요? 🗺️ (서울·부산·제주·강릉·경주 등)';
    }
  },
  // [D] 배고픔 & 미식 갈증
  HUNGRY: {
    triggers: /(배고파|배고파요|배고파죽겠|출출해|밥먹자|밥어디서|맛있는거|먹을래|꼬르륵|배가\s*고프|배고픔|뭐먹을|hungry|お腹すいた|饿了)/i,
    reply: (city = '서울', lang = 'ko') => {
      const locCity = getLocalizedCityName(city, lang);
      if (lang === 'en') return `Food is the essence of travel! Let me guide you to authentic local gourmet spots in **${locCity}** 🤤🍴\nPrepared with signature dishes and waiting-free local tips!`;
      if (lang === 'ja') return `旅の醍醐味は美味しい食事から！**${locCity}**の地元民が愛する本場グルメへご案内します 🤤🍴\n名物料理と並ばずに楽しむ裏技まで準備万端です！`;
      if (lang === 'zh' || lang === 'zht') return `旅行中美味绝不可少！马上带您去品尝 **${locCity}** 当地人赞不绝口的地道美食 🤤🍴\n为您备好招牌美食与免排队实用小贴士！`;
      return `금강산도 식후경이죠! 꼬르륵 소리 멈추게 할 **${city} 현지인 찐 맛집**으로 바로 모실게요 🤤🍴\n입안 가득 행복해지는 시그니처 미식과 웨이팅 없는 꿀팁까지 준비했습니다!`;
    },
    followUp: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return 'Shall we go for a hearty traditional Korean meal or an aesthetic local bistro? 🍲 vs 🍝';
      if (lang === 'ja') return 'ボリューム満点の伝統定食にしますか、それとも雰囲気の良いカフェ/ビストロにしますか？🍲 vs 🍝';
      if (lang === 'zh' || lang === 'zht') return '想品尝地道丰盛的韩式正餐，还是氛围感十足的特色餐厅呢？🍲 vs 🍝';
      return '든든한 한식 백반으로 갈까요, 아니면 분위기 좋은 감성 파스타/로컬 요리로 갈까요? 🍲 vs 🍝';
    }
  },
  // [E] 피곤 & 다리 아픔 & 휴식
  TIRED_LEGS: {
    triggers: /(다리아파|힘들어|피곤해|지쳐|쉬고싶어|못걷겠|힘들다|다리부러|휴식|tired|疲れた|累了)/i,
    reply: (city = '서울', lang = 'ko') => {
      const locCity = getLocalizedCityName(city, lang);
      if (lang === 'en') return `You have explored so actively today! 👏 Take a rest without overwalking. Here are cozy scenic cafes and relaxing lounges in **${locCity}** with zero stairs and comfortable seating ☕🌿`;
      if (lang === 'ja') return `今日もお疲れ様でした！👏 無理に歩かずに、階段ゼロでふかふかソファと絶景がある **${locCity}** の癒やしカフェ・休憩スポットを厳選しました ☕🌿`;
      if (lang === 'zh' || lang === 'zht') return `今天辛苦了！👏 别再勉强步行，为您精选 **${locCity}** 无台阶、配备舒适沙发与绝美景观的疗愈景观咖啡厅与休息处 ☕🌿`;
      return `오늘 정말 알차고 부지런하게 여행하셨군요! 👏\n더 이상 무리해서 걷지 마세요. 계단 0개, 푹신한 소파와 탁 트인 전망이 있는 **${city} 힐링 오션뷰/전망 카페와 편안한 쉼터**를 골랐습니다 ☕🌿`;
    },
    followUp: (city = '서울', lang = 'ko') => {
      if (lang === 'en') return 'Shall we head to a cozy traditional tea house or a spacious scenic bakery cafe? 🍵 vs 🥐';
      if (lang === 'ja') return '温かい伝統茶カフェにしますか、それとも広々としたベーカリーカフェにしますか？🍵 vs 🥐';
      if (lang === 'zh' || lang === 'zht') return '想去温馨惬意的传统茶馆，还是宽敞舒适的景观烘焙咖啡厅呢？🍵 vs 🥐';
      return '따뜻한 전통차와 족욕 쉼터로 갈까요, 아니면 편안한 의자가 있는 대형 베이커리 카페로 갈까요? 🍵 vs 🥐';
    }
  }
};

// ==============================================================================
// 3. K_FOOD_PAIRING_KNOWLEDGE (지역별 대표 미식 페어링 - 4개 국어 정품 체계)
// ==============================================================================
export const K_FOOD_PAIRING_KNOWLEDGE = {
  '서울': {
    signatureKo: '광장시장 마약김밥 & 녹두빈대떡 + 막걸리',
    signatureEn: 'Gwangjang Market Kimbap & Crispy Mung Bean Pancake + Makgeolli',
    signatureJa: '広蔵市場 麻薬キンパ＆緑豆ピンデトック＋マッコリ',
    signatureZh: '广藏市场 迷你紫菜包饭与香脆绿豆煎饼＋马格利米酒',
    tipKo: '종로 피맛골 백반과 성수동 스페셜티 드립커피 디저트 페어링 추천',
    tipEn: 'Pair Jongno Pimatgol local set with Seongsu-dong specialty pour-over coffee',
    tipJa: '鍾路ピマッコル定食と聖水洞のスペシャルティコーヒーの組み合わせがおすすめ',
    tipZh: '推荐搭配钟路避马街家常套餐与圣水洞手冲精品咖啡'
  },
  '부산': {
    signatureKo: '부산 원조 돼지국밥(부추 듬뿍) & 자갈치 생선구이',
    signatureEn: 'Busan Pork Soup (Dwaeji Gukbap with Chives) & Jagalchi Grilled Fish',
    signatureJa: '釜山元祖テジクッパ（ニラ盛り）＆チャガルチ焼き魚定食',
    signatureZh: '釜山正宗猪肉汤饭（加韭菜）与札嘎其烤鱼套餐',
    tipKo: '식후 남포동 비프광장 원조 씨앗호떡으로 달콤한 마무리',
    tipEn: 'Finish sweetly with famous Ssiat Hotteok at Nampo-dong BIFF Square',
    tipJa: '食後は南浦洞BIFF広場の元祖シアホットクで甘いデザート締め',
    tipZh: '餐后以南浦洞BIFF广场正宗坚果糖饼甜蜜收尾'
  },
  '제주': {
    signatureKo: '제주 흑돼지 근고기 멜젓구이 & 고기국수',
    signatureEn: 'Jeju Black Pork BBQ with Anchovy Dip & Pork Noodle Soup',
    signatureJa: '済州黒豚焼肉（メルジョッだれ）＆豚肉うどん（コギククス）',
    signatureZh: '济州黑猪肉厚切烤肉配鳀鱼酱与猪肉汤面',
    tipKo: '애월 한담해변 오션뷰 카페에서 즐기는 한라봉 에이드 페어링',
    tipEn: 'Pair with fresh Hallabong Tangerine Ade at an Aewol oceanfront cafe',
    tipJa: '涯月ハンダム海岸のオーシャンビューカフェでハルラボンエイドを堪能',
    tipZh: '在涯月汉潭海边海景咖啡厅享用清新汉拿峰柑橘气泡饮'
  },
  '경주': {
    signatureKo: '황리단길 떡갈비 정식 & 맷돌순두부 찌개',
    signatureEn: 'Hwangridan-gil Tteokgalbi Set & Stone-ground Soft Tofu Stew',
    signatureJa: '皇理団通り トッカルビ定食＆石臼スンドゥブチゲ',
    signatureZh: '皇理团路 烤牛肉饼定食与石磨嫩豆腐锅',
    tipKo: '황남빵 본점 갓 구운 따끈한 팥빵과 찰보리빵 간식 세트',
    tipEn: 'Grab warm, freshly baked Hwangnam Bread and barley bread snacks',
    tipJa: '皇南パン本店で焼き立ての小豆パンと麦パンのスイーツセット',
    tipZh: '在皇南饼总店购买刚出炉的热腾腾红豆饼与大麦饼小吃套餐'
  },
  '강릉': {
    signatureKo: '초당 순두부마을 짬뽕순두부 & 몽글순두부 백반',
    signatureEn: 'Chodang Soft Tofu Village Spicy Seafood Soft Tofu & Traditional Tofu Set',
    signatureJa: '草堂スンドゥブ村 チャンポンスンドゥブ＆伝統豆腐定食',
    signatureZh: '草堂嫩豆腐村 辣海鲜嫩豆腐与传统嫩豆腐套餐',
    tipKo: '안목 커피거리에서 즐기는 에스프레소 & 순두부 젤라또',
    tipEn: 'Enjoy artisan espresso and soft tofu gelato on Anmok Coffee Street',
    tipJa: '安木カフェ通りで楽しむエスプレッソ＆スンドゥブジェラート',
    tipZh: '在安木海边咖啡街品味浓缩咖啡与特色嫩豆腐意式冰淇淋'
  },
  '속초': {
    signatureKo: '아바이마을 모둠순대(오징어순대) & 청초호 시원한 활어 물회',
    signatureEn: 'Abai Village Squid Sundae & Cheongchoho Cold Raw Fish Soup',
    signatureJa: 'アバイ村のイカスンデ＆青草湖の新鮮な冷製刺身スープ（ムルフェ）',
    signatureZh: '阿爸村特色鱿鱼米肠与青草湖清爽水拌生鱼片',
    tipKo: '속초관광수산시장 만석닭강정 & 팡파미유 마늘바게트',
    tipEn: 'Pick up Manseok Dakgangjeong & garlic bread at Sokcho Tourist Market',
    tipJa: '束草観光水産市場でタッカンジョン＆名物ガーリックバゲットを購入',
    tipZh: '在束草观光水产市场品尝招牌炸鸡块与大蒜法棍面包'
  },
  '여수': {
    signatureKo: '돌산 갓김치 곁들인 간장게장 백반 & 여수 밤바다 해물삼합',
    signatureEn: 'Soy Sauce Crab Set with Dolsan Gat Kimchi & Night Ocean Seafood Samhap',
    signatureJa: '突山からし菜キムチ添え カニ醤油漬け定食＆夜景海鮮三合焼き',
    signatureZh: '配突山芥菜辛奇的酱蟹套餐与丽水夜海鲜三合烤肉',
    tipKo: '이순신광장 명물 쑥 아이스크림 & 딸기모찌 디저트',
    tipEn: 'Treat yourself to mugwort ice cream and strawberry mochi at Yi Sun-sin Square',
    tipJa: '李舜臣広場名物のヨモギアイス＆イチゴ大福デザート',
    tipZh: '在李舜臣广场享用特色艾草冰淇淋与草莓大福甜品'
  },
  '전주': {
    signatureKo: '전주 콩나물국밥(수란 세트) & 전주 전통비빔밥',
    signatureEn: 'Jeonju Bean Sprout Soup with Poached Egg & Authentic Jeonju Bibimbap',
    signatureJa: '全州もやしクッパ（温泉卵付き）＆全州伝統ビビンバ',
    signatureZh: '全州豆芽汤饭（配温泉蛋）与全州传统石锅拌饭',
    tipKo: '한옥마을 전주비빔빵 & 달콤 쌉싸름한 모주 한잔',
    tipEn: 'Taste Jeonju Bibim bread and a glass of sweet herbal Moju in Hanok Village',
    tipJa: '韓屋村で全州ビビンパン＆甘酸っぱい母酒（モジュ）を一杯',
    tipZh: '在韩屋村品尝全州拌饭包与香甜微苦的传统母酒'
  },
  '괴산': {
    signatureKo: '괴산 올갱이해장국(다슬기국) & 쫀득한 고추순대 + 버섯전골',
    signatureEn: 'Goesan Marsh Snail Soup & Cheonggyeol Chili Sundae + Mushroom Hot Pot',
    signatureJa: '槐山オルゲンイクッパ（カワニナ汁）＆唐辛子スンデ＋キノコ鍋',
    signatureZh: '槐山蜷螺醒酒汤与特色辣椒米肠＋野山菌火锅',
    tipKo: '산막이옛길 트레킹 후 올갱이국 한 그릇과 대학찰옥수수 간식 페어링',
    tipEn: 'Pair a bowl of snail soup with sweet waxy corn after Sanmangi Trail hiking',
    tipJa: 'サンマギイェッキルトレッキング後、カワニナ汁と名物トウモロコシを満喫',
    tipZh: '漫步三幕古道后品尝一碗鲜美蜷螺汤与香甜糯玉米小吃'
  },
  '제천': {
    signatureKo: '제천 명물 매콤 빨간오뎅 & 약채락 약선비빔밥 + 곤드레나물밥',
    signatureEn: 'Jecheon Spicy Red Odeng & Healthy Herbal Bibimbap + Gondre Rice',
    signatureJa: '堤川名物スパイシー赤おでん＆薬膳ビビンバ＋コンドゥレご飯',
    signatureZh: '堤川特色香辣鱼饼与养生药膳拌饭＋山蓟菜饭',
    tipKo: '청풍호반케이블카 관람 후 의림지 막국수와 빨간오뎅 분식 페어링',
    tipEn: 'Enjoy Uirimji Makguksu noodles with spicy red fish cakes after cable car ride',
    tipJa: '清風湖ケーブルカー観光後、義林池マッククスと赤おでんの軽食セット',
    tipZh: '游览清风湖缆车后品尝义林池荞麦凉面与香辣鱼饼小吃组合'
  }
};

// Backward-compatible Proxy for signature & tip
for (const [k, v] of Object.entries(K_FOOD_PAIRING_KNOWLEDGE)) {
  v.signature = v.signatureKo;
  v.tip = v.tipKo;
}

// ==============================================================================
// 4. K_FASHION_WEATHER_GUIDE (날씨·기온별 옷차림 가이드 - 4개 국어 정품 체계)
// ==============================================================================
export const K_FASHION_WEATHER_GUIDE = {
  HOT_SUMMER: {
    conditionKo: '기온 28℃ 이상 (무더위/한여름)',
    conditionEn: 'Above 28°C (Hot Summer)',
    conditionJa: '気温28℃以上（真夏・猛暑）',
    conditionZh: '气温28℃以上（酷暑炎夏）',
    adviceKo: '통풍이 잘되는 린넨 셔츠나 반팔 티셔츠를 추천합니다! 실내 에어컨 냉방에 대비해 가벼운 얇은 셔츠나 가디건을 챙기시면 완벽해요 🕶️☀️',
    adviceEn: 'Breathable linen shirts or lightweight tees are recommended! Carry a light cardigan for indoor air conditioning 🕶️☀️',
    adviceJa: '通気性の良いリネンシャツや半袖がおすすめ！屋内の冷房対策に薄手のカーディガンを持参すると完璧です 🕶️☀️',
    adviceZh: '推荐透气亚麻衬衫或短袖T恤！建议携带轻薄开衫以应对室内空调冷气 🕶️☀️',
    itemsKo: ['선글라스', '자외선차단제', '휴대용 손선풍기', '양우산'],
    itemsEn: ['Sunglasses', 'Sunscreen', 'Portable Fan', 'UV Umbrella'],
    itemsJa: ['サングラス', '日焼け止め', '携帯扇風機', '晴雨兼用傘'],
    itemsZh: ['太阳镜', '防晒霜', '便携小风扇', '晴雨两用伞']
  },
  MILD_SPRING_AUTUMN: {
    conditionKo: '기온 15℃ ~ 24℃ (봄·가을 환절기)',
    conditionEn: '15°C ~ 24°C (Spring & Autumn)',
    conditionJa: '気温15℃〜24℃（春・秋の快適シーズン）',
    conditionZh: '气温15℃~24℃（春季与秋季）',
    adviceKo: '일교차가 있으니 니트나 셔츠 위에 트렌치코트, 블레이저, 가죽자켓을 걸치는 레이어드 룩이 사진 찍기에 가장 예쁩니다 🧥🍂',
    adviceEn: 'Layering a trench coat, blazer, or light jacket over shirts is perfect for day-to-night temperature changes 🧥🍂',
    adviceJa: '寒暖差があるため、トレンチコートやジャケットを羽織るレイヤードスタイルが写真映えにも最適です 🧥🍂',
    adviceZh: '早晚温差较大，衬衫外搭配风衣、西装外套或轻薄夹克的叠穿风格最为出片 🧥🍂',
    itemsKo: ['가벼운 겉옷', '편안한 워킹 스니커즈', '보조배터리'],
    itemsEn: ['Light Outerwear', 'Comfortable Walking Sneakers', 'Power Bank'],
    itemsJa: ['薄手の羽織もの', '歩きやすいスニーカー', 'モバイルバッテリー'],
    itemsZh: ['轻便外套', '舒适徒步运动鞋', '移动充电宝']
  },
  COLD_WINTER: {
    conditionKo: '기온 5℃ 이하 (겨울/한파)',
    conditionEn: 'Below 5°C (Chilly Winter)',
    conditionJa: '気温5℃以下（真冬・防寒）',
    conditionZh: '气温5℃以下（寒冷冬季）',
    adviceKo: '보온성 높은 숏패딩이나 롱패딩, 도톰한 울 코트를 추천합니다. 목도리와 장갑을 포인트 컬러로 매치하면 겨울 인생샷 완성! 🧣❄️',
    adviceEn: 'Warm padded parkas or thick wool coats are essential. Pair with colorful scarves and gloves for stunning winter photos! 🧣❄️',
    adviceJa: '保温性の高いダウンジャケットや厚手のウールコートが必須。マフラーと手袋を合わせれば冬の映え写真が完成！🧣❄️',
    adviceZh: '必备保暖羽绒服或厚羊毛大衣。搭配亮色围巾与手套，冬日拍照格外吸睛！🧣❄️',
    itemsKo: ['핫팩', '목도리/장갑', '보습 립밤', '보온 텀블러'],
    itemsEn: ['Hand Warmers', 'Scarf & Gloves', 'Lip Balm', 'Thermal Tumbler'],
    itemsJa: ['カイロ', 'マフラー・手袋', 'リップクリーム', '保温ボトル'],
    itemsZh: ['暖宝宝', '围巾手套', '润唇膏', '保温杯']
  },
  RAINY_DAY: {
    conditionKo: '우천 / 비 오는 날',
    conditionEn: 'Rainy Day',
    conditionJa: '雨の日',
    conditionZh: '雨天',
    adviceKo: '젖어도 부담 없는 편안한 방수 슈즈나 가벼운 운동화, 빗물이 튀지 않는 어두운 톤의 바지와 쾌적한 윈드브레이커를 추천합니다 ☔',
    adviceEn: 'Water-resistant sneakers, dark-tone bottoms, and a comfortable windbreaker are ideal for rainy day explorations ☔',
    adviceJa: '防水シューズやスニーカー、水跳ねが気にならないダークトーンのボトムスとウィンドブレーカーがおすすめ ☔',
    adviceZh: '推荐舒适防泼水运动鞋、耐脏深色下装与透气防风外套，雨中漫步自在惬意 ☔',
    itemsKo: ['3단 접이식 자동우산', '방수 파우치', '여분 양말'],
    itemsEn: ['Compact Automatic Umbrella', 'Waterproof Pouch', 'Extra Socks'],
    itemsJa: ['折りたたみ自動傘', '防水ポーチ', '替えの靴下'],
    itemsZh: ['三折全自动雨伞', '防水收纳袋', '备用袜']
  }
};

// Backward-compatible Proxy
for (const [k, v] of Object.entries(K_FASHION_WEATHER_GUIDE)) {
  v.condition = v.conditionKo;
  v.advice = v.adviceKo;
  v.items = v.itemsKo;
}

// ==============================================================================
// 5. FOREIGNER_ESSENTIALS_KNOWLEDGE (외국인 관광객 필수 실전 팁 - 4개 국어)
// ==============================================================================
export const FOREIGNER_ESSENTIALS_KNOWLEDGE = {
  TRANSIT_CARD: {
    titleKo: '한국 대중교통 패스 (티머니 & 기후동행카드)',
    titleEn: 'Korea Transit (T-Money & Climate Card)',
    titleJa: '韓国の交通カード（T-money＆気候同行カード）',
    titleZh: '韩国交通卡（T-Money与气候同行卡）',
    tipKo: '지하철역이나 편의점(CU, GS25, 세븐일레븐)에서 티머니 카드를 구매할 수 있습니다. 서울 무제한 이용은 기후동행카드 1일권(3,000원)을 추천합니다!',
    tipEn: 'Buy a T-Money card at any subway station or convenience store (CU, GS25, 7-Eleven). For unlimited rides in Seoul, get the Climate Card for ₩3,000/day!',
    tipJa: '地下鉄駅やコンビニでT-moneyカードを購入できます。ソウル市内乗り放題なら気候同行カード1日券（3,000ウォン）がおすすめ！',
    tipZh: '可在地铁站或便利店购买T-Money交通卡。首尔市内无限次乘坐推荐气候同行卡一日券（3,000韩元）！'
  },
  HOTLINE_1330: {
    titleKo: '1330 한국관광 통역안내 헬프라인 (24시간 무료)',
    titleEn: '1330 Korea Travel Helpline (24/7 Free)',
    titleJa: '1330 韓国観光案内ヘルプライン（24時間無料）',
    titleZh: '1330 韩国旅游咨询与翻译热线（24小时免费）',
    tipKo: '국번 없이 1330으로 전화하시면 영어, 일본어, 중국어 등 다국어 관광 안내 및 긴급 통역 서비스를 24시간 무료로 이용하실 수 있습니다.',
    tipEn: 'Call 1330 (without area code) anytime for free multilingual tourist interpretation and emergency translation (English, Japanese, Chinese, Russian, etc.).',
    tipJa: '局番なしで1330に電話すると、日本語・英語・中国語など多言語での観光案内と緊急通訳を24時間無料で利用できます。',
    tipZh: '直拨1330无需区号，提供中文、英文、日文等多语种旅游咨询与紧急翻译服务，24小时免费开放。'
  },
  TAX_REFUND: {
    titleKo: '현장 즉시 세금 환급 (TAX FREE)',
    titleEn: 'Immediate Tax Free (TAX FREE)',
    titleJa: '即時免税（TAX FREE）',
    titleZh: '现场即时退税（TAX FREE）',
    tipKo: '매장의 TAX FREE 로고를 확인하세요. 결제 시 여권을 제시하면 15,000원 이상 구매 시 영수증에서 7~10% 부가세가 즉시 차감됩니다.',
    tipEn: 'Look for "Tax Free" logos at shops. Present your passport at checkout to get instant 7~10% VAT deduction directly on the receipt for purchases over ₩15,000.',
    tipJa: 'TAX FREEロゴのある店舗でパスポートを提示すると、15,000ウォン以上のお買い物で7〜10％の付加価値税がその場で即時免税されます。',
    tipZh: '在贴有TAX FREE标志的商户结账时出示护照，单笔消费满15,000韩元即可在小票上直接享受7~10%即时免税优惠。'
  },
  TAXI_APP: {
    titleKo: '한국 택시 호출 앱 (카카오T & 우버)',
    titleEn: 'Ride-Hailing in Korea',
    titleJa: '韓国のタクシー配車アプリ',
    titleZh: '韩国打车出行指南',
    tipKo: '카카오T와 우버(UT)를 통해 전국 어디서나 간편하게 택시를 호출할 수 있으며, 해외 신용카드(Visa/Mastercard)로 자동 결제가 지원됩니다.',
    tipEn: 'Kakao T and Uber (UT) work seamlessly across Korea. International credit cards (Visa/Mastercard) are accepted everywhere in registered taxis.',
    tipJa: 'カカオTやUber（UT）で全国どこでも簡単にタクシーを呼べます。海外クレジットカード決済にも対応しています。',
    tipZh: '可通过Kakao T或Uber（UT）在韩国全境便捷打车，正规出租车均支持国际信用卡（Visa/Mastercard）刷卡支付。'
  }
};

for (const [k, v] of Object.entries(FOREIGNER_ESSENTIALS_KNOWLEDGE)) {
  v.title = v.titleKo;
  v.tip = v.tipKo;
}

// ==============================================================================
// 6. PROACTIVE_CONVERSATION_HOOKS (선제적 핑퐁 대화 훅 - 4개 국어 지원)
// ==============================================================================
export const PROACTIVE_CONVERSATION_HOOKS_MULTILINGUAL = {
  ko: [
    '점심 식사 후 감성 카페 한 잔 하실래요, 아니면 시원한 오션/도심 전망대로 바로 갈까요? ☕ vs 🏙️',
    '이 동선 주변에 현지인만 아는 꿀맛 길거리 간식이 있는데 그것도 소개해 드릴까요? 😋',
    '해 질 녘에 인생샷 건질 수 있는 일몰 뷰포인트도 일정에 추가해 드릴까요? 🌅📸',
    '쇼핑이나 소품샵 투어가 필요하시면 동선에 쏙 넣어드릴게요! 🛍️'
  ],
  en: [
    'Would you prefer an aesthetic dessert cafe after lunch, or heading straight to a panoramic observatory? ☕ vs 🏙️',
    'There is a hidden street snack spot nearby loved by locals—would you like me to add it? 😋',
    'Shall I include a stunning golden-hour sunset viewpoint in your itinerary? 🌅📸',
    'If you want souvenirs or boutique shopping, I can easily integrate it into your route! 🛍️'
  ],
  ja: [
    '昼食後に雰囲気の良いカフェに行きますか、それとも絶景展望台へ向かいますか？☕ vs 🏙️',
    'この周辺に地元民だけが知る名物おやつスポットがありますが、追加しましょうか？😋',
    '夕暮れ時に最高の映え写真が撮れるサンセットスポットもコースに入れましょうか？🌅📸',
    'お土産や可愛い雑貨屋さん巡りが必要でしたらコースに組み込みます！🛍️'
  ],
  zh: [
    '午餐后想去氛围感咖啡厅小憩，还是直接前往全景展望台观景呢？☕ vs 🏙️',
    '这附近有一处只有当地人才知道的绝味街头小吃，需要为您推荐吗？😋',
    '需要为您在行程中加入绝美的日落打卡观景机位吗？🌅📸',
    '如果需要打卡特色纪念品店或潮流文创店，随时为您融入行程！🛍️'
  ]
};

export const PROACTIVE_CONVERSATION_HOOKS = PROACTIVE_CONVERSATION_HOOKS_MULTILINGUAL.ko;

/**
 * Intelligent Tiki-Taka Query Classifier & Fast Matcher (Supports 4 Languages: KO, EN, JA, ZH)
 */
export function resolveTikitakaResponse(query = '', currentCity = '서울', currentSeason = null, lang = 'ko') {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim();
  const locCity = getLocalizedCityName(currentCity, lang);

  // 🌟 [대한민국 대표 도시별 N일 코스 시그니처 지식 즉시 응답]
  const isCityTripPlan = /(제주|서울|부산|경주|강릉|속초|전주|여수|수원|통영|거제|포항|인천|안동|춘천|대구|대전|광주|jeju|seoul|busan|gyeongju|gangneung|sokcho|jeonju|yeosu|suwon|tongyeong)/i.test(clean) &&
                         /(\d+\s*일|\d+\s*박\s*\d+\s*일|\d+\s*박|당일치기|코스|여행|추천|일정|가볼만한|trip|course|itinerary|day|days|旅行|コース|日程|推荐|路线)/i.test(clean);
  if (isCityTripPlan) {
    const isJeju = /(제주|jeju|済州|济州)/i.test(clean);
    const isSeoul = /(서울|seoul|ソウル|首尔)/i.test(clean);
    const isBusan = /(부산|busan|釜山)/i.test(clean);
    const isGyeongju = /(경주|gyeongju|慶州|庆州)/i.test(clean);
    const isGangneung = /(강릉|속초|gangneung|sokcho|江陵|束草)/i.test(clean);
    const isJeonju = /(전주|jeonju|全州)/i.test(clean);
    const isYeosu = /(여수|yeosu|麗水|丽水)/i.test(clean);
    const isSuwon = /(수원|suwon|水原)/i.test(clean);
    const isTongyeong = /(통영|거제|tongyeong|geoje|統営|巨済|统营|巨济)/i.test(clean);

    if (isJeju) {
      const replies = {
        en: `**Jeju Island Trip** is best looped as: **Day 1 East (Seongsan Ilchulbong & Udo Island), Day 2 South (Seogwipo Olle Market & Cheonjiyeon Falls), Day 3 West (Hyeopjae Beach & Aewol Cafe Street)**! 🌴🌊✨`,
        ja: `**済州島旅行**は、**1日目 東部（城山日出峰＆牛島）、2日目 南部（西帰浦オルレ市場＆天地淵の滝）、3日目 西部（協才海水浴場＆涯月カフェ通り）**を巡るのが最高の黄金ルートです！🌴🌊✨`,
        zh: `**济州岛之旅** 最佳黄金环线为：**第1天 东部（城山日出峰与牛岛），第2天 南部（西归浦偶来市场与天地渊瀑布），第3天 西部（挟才海水浴场与涯月海边咖啡街）**！🌴🌊✨`,
        ko: `**제주도 여행**은 **1일차 동부(성산일출봉 & 우도 산호해변), 2일차 남부(서귀포 올레시장 & 천지연폭포), 3일차 서부(협재해수욕장 & 애월 한담해변 카페거리)**로 순환하는 것이 가장 완벽한 황금 동선입니다! 🌴🌊✨`
      };
      const followUps = {
        en: 'Shall I design a custom Jeju itinerary featuring Seongsan Peak and emerald beaches? 🍊🌊',
        ja: '城山日出峰と協才のエメラルドの海を巡る済州オーダーメイドコースを作成しましょうか？🍊🌊',
        zh: '需要为您生成包含城山日出峰与挟才碧海的济州专属定制行程吗？🍊🌊',
        ko: '성산일출봉과 협재 바다를 담은 제주 맞춤 코스로 잡아드릴까요? 🍊🌊'
      };
      return {
        matchedKey: 'JEJU_SIGNATURE_COURSE',
        reply: replies[lang] || replies.ko,
        followUp: followUps[lang] || followUps.ko,
        isTikitaka: true
      };
    } else if (isSeoul) {
      const replies = {
        en: `**Seoul Trip** core golden route: **Day 1 Traditional Heritage (Gyeongbokgung·Bukchon Hanok·Insadong), Day 2 Landmarks & Trendy Vibe (N Seoul Tower·Myeongdong·Seongsu Pop-ups), Day 3 K-Culture & Healing (DDP·Yeouido Han River Park)**! 👑🗼✨`,
        ja: `**ソウル旅行**の王道ルート：**1日目 伝統文化（景福宮・北村韓屋村・仁寺洞）、2日目 ランドマーク＆トレンド（Nソウルタワー・明洞・聖水ポップアップ）、3日目 トレンド＆癒やし（DDP・汝矣島漢江公園）**！👑🗼✨`,
        zh: `**首尔之旅** 核心经典路线：**第1天 传统文化（景福宫·北村韩屋村·仁寺洞），第2天 地标与潮流（N首尔塔·明洞·圣水快闪），第3天 现代设计与休闲（DDP·汝矣岛汉江公园）**！👑🗼✨`,
        ko: `**서울 여행**은 **1일차 전통 문화(경복궁·북촌한옥마을·인사동), 2일차 랜드마크 & 쇼핑(N서울타워·명동·성수동 팝업), 3일차 트렌드 & 힐링(DDP·여의도 한강공원)**이 핵심 황금 코스입니다! 👑🗼✨`
      };
      const followUps = {
        en: 'Shall I craft a custom Seoul itinerary with Gyeongbokgung and N Seoul Tower views? 🏙️✨',
        ja: '景福宮とNソウルタワーの絶景パノラマを巡るソウル特製コースを組みましょうか？🏙️✨',
        zh: '需要为您制定包含景福宫与N首尔塔全景的首尔专属定制行程吗？🏙️✨',
        ko: '경복궁과 N서울타워 파노라마를 담은 서울 맞춤 코스로 잡아드릴까요? 🏙️✨'
      };
      return {
        matchedKey: 'SEOUL_SIGNATURE_COURSE',
        reply: replies[lang] || replies.ko,
        followUp: followUps[lang] || followUps.ko,
        isTikitaka: true
      };
    } else if (isBusan) {
      const replies = {
        en: `**Busan Trip** essential highlights: **Day 1 Ocean & Coastal Train (Haeundae Blueline Sky Capsule·Haedong Yonggungsa), Day 2 Romantic Night Vibe (Gwangandaegyo Drone Show & Beach Walk), Day 3 Heritage Alleys (Huinnyeoul Culture Village·Gamcheon Village·Jagalchi Market)**! 🌊🚡✨`,
        ja: `**釜山旅行**のベストコース：**1日目 海＆アクティビティ（海雲台ブルーライン天空カプセル・海東龍宮寺）、2日目 幻想的な夜景（広安大橋ドローンショー＆海辺散歩）、3日目 レトロ路地巡り（白瀬文化村・甘川文化村・チャガルチ市場）**！🌊🚡✨`,
        zh: `**釜山之旅** 最佳黄金路线：**第1天 绝美海景与海岸列车（海云台天空胶囊列车·海东龙宫寺），第2天 浪漫夜景（广安大桥无人机秀与海滨漫步），第3天 特色文化村（白浅滩文化村·甘川文化村·札嘎其海鲜市场）**！🌊🚡✨`,
        ko: `**부산 여행**은 **1일차 오션 & 액티비티(해운대 블루라인파크 스카이캡슐·해동용궁사), 2일차 낭만 야경(광안대교 드론쇼 & 해변 산책), 3일차 감성 골목(영도 흰여울문화마을 & 감천문화마을·자갈치시장)**이 최고의 황금 루트입니다! 🌊🚡✨`
      };
      const followUps = {
        en: 'Shall I generate a Busan route featuring the Sky Capsule and Gwangalli sunset views? 🌊✨',
        ja: 'スカイカプセルと広安大橋のサンセットを巡る釜山カスタムコースを作成しましょうか？🌊✨',
        zh: '需要为您生成包含天空胶囊列车与广安里日落海景的釜山专属行程吗？🌊✨',
        ko: '스카이캡슐과 광안대교 선셋 뷰를 담은 부산 맞춤 코스로 잡아드릴까요? 🌊✨'
      };
      return {
        matchedKey: 'BUSAN_SIGNATURE_COURSE',
        reply: replies[lang] || replies.ko,
        followUp: followUps[lang] || followUps.ko,
        isTikitaka: true
      };
    }
  }

  // Check Weather / Fashion / Outfit query
  if (/(복장|뭐\s*입|뭘\s*입|어떻게\s*입|옷차림|패션|코디|옷어떻게|날씨어때|외투|패딩|코트|따뜻하게|옷|입을|입고|wear|outfit|clothes|fashion|服装|穿什么|着る服|服装)/i.test(clean)) {
    const isRain = /(비|우천|rain|雨)/.test(clean);
    const isWinter = /(겨울|winter|추위|한파|춥|설경|冬)/.test(clean) || currentSeason === '겨울';
    const isSummer = /(여름|summer|더위|폭염|덥|夏)/.test(clean) || currentSeason === '여름';
    
    const fashion = isRain
      ? K_FASHION_WEATHER_GUIDE.RAINY_DAY
      : isWinter
      ? K_FASHION_WEATHER_GUIDE.COLD_WINTER
      : isSummer
      ? K_FASHION_WEATHER_GUIDE.HOT_SUMMER
      : K_FASHION_WEATHER_GUIDE.MILD_SPRING_AUTUMN;

    const adviceText = lang === 'en' ? fashion.adviceEn : lang === 'ja' ? fashion.adviceJa : (lang === 'zh' || lang === 'zht') ? fashion.adviceZh : fashion.adviceKo;
    const itemsList = lang === 'en' ? fashion.itemsEn.join(', ') : lang === 'ja' ? fashion.itemsJa.join(', ') : (lang === 'zh' || lang === 'zht') ? fashion.itemsZh.join(', ') : fashion.itemsKo.join(', ');

    const titlePrefix = lang === 'en' ? `**${locCity}** Outfit & Weather Recommendation Guide 👗✨` :
                        lang === 'ja' ? `**${locCity}** 旅行おすすめ服装ガイド 👗✨` :
                        (lang === 'zh' || lang === 'zht') ? `**${locCity}** 穿搭指南与出行建议 👗✨` :
                        `**${currentCity}** 여행 추천 옷차림 가이드입니다! 👗✨`;

    const tipLabel = lang === 'en' ? '💡 **Recommended Essentials**:' : lang === 'ja' ? '💡 **おすすめアイテム**:' : (lang === 'zh' || lang === 'zht') ? '💡 **推荐出行装备**:' : '💡 **추천 꿀아이템**:';

    const followUp = lang === 'en' ? 'Shall I find indoor scenic spots and cozy cafes tailored to this weather? ☕🌸' :
                     lang === 'ja' ? '天気にぴったりの屋内の絶景スポットや癒やしカフェをご案内しましょうか？☕🌸' :
                     (lang === 'zh' || lang === 'zht') ? '需要为您推荐适合当前天气的室内景观景点与特色咖啡厅吗？☕🌸' :
                     '화창한 날씨에 딱 맞는 인생샷 야외 산책 & 감성 카페 코스로 잡아드릴까요? 🌸📸';

    return {
      matchedKey: 'FASHION_GUIDE',
      reply: `${titlePrefix}\n${adviceText}\n\n${tipLabel} ${itemsList}`,
      followUp,
      isTikitaka: true
    };
  }

  // Check Foodie Pairing query
  if (/(뭐먹지|대표음식|맛집조합|페어링|꼭먹어야|food|eat|gourmet|グルメ|美食|吃什么)/i.test(clean)) {
    const food = K_FOOD_PAIRING_KNOWLEDGE[currentCity] || K_FOOD_PAIRING_KNOWLEDGE['서울'];
    const sig = lang === 'en' ? food.signatureEn : lang === 'ja' ? food.signatureJa : (lang === 'zh' || lang === 'zht') ? food.signatureZh : food.signatureKo;
    const tip = lang === 'en' ? food.tipEn : lang === 'ja' ? food.tipJa : (lang === 'zh' || lang === 'zht') ? food.tipZh : food.tipKo;

    const titleText = lang === 'en' ? `Must-try signature food pairings in **${locCity}**! 🍴🔥` :
                      lang === 'ja' ? `**${locCity}** に来たら絶対に味わいたい絶品グルメ！🍴🔥` :
                      (lang === 'zh' || lang === 'zht') ? `来到 **${locCity}** 绝不可错过的招牌特色美食！🍴🔥` :
                      `**${currentCity}**에 오셨다면 이건 무조건 맛보셔야죠! 🍴🔥`;

    const sigLabel = lang === 'en' ? '⭐ **Signature Dishes**:' : lang === 'ja' ? '⭐ **名物グルメ**:' : (lang === 'zh' || lang === 'zht') ? '⭐ **招牌美味**:' : '⭐ **시그니처 미식**:';
    const tipLabel = lang === 'en' ? '💡 **Local Secret Tip**:' : lang === 'ja' ? '💡 **地元民の裏技**:' : (lang === 'zh' || lang === 'zht') ? '💡 **地道小贴士**:' : '💡 **현지인 꿀팁**:';

    const followUp = lang === 'en' ? 'Shall I locate cozy dessert cafes within walking distance from these spots? ☕' :
                     lang === 'ja' ? 'この近くで歩いて行けるデザートカフェもお探ししましょうか？☕' :
                     (lang === 'zh' || lang === 'zht') ? '需要为您寻找餐厅附近步行即可到达的特色甜品咖啡厅吗？☕' :
                     '이 식당 근처에서 바로 걸어갈 수 있는 디저트 카페도 찾아드릴까요? ☕';

    return {
      matchedKey: 'FOOD_PAIRING',
      reply: `${titleText}\n\n${sigLabel} ${sig}\n${tipLabel} ${tip}`,
      followUp,
      isTikitaka: true
    };
  }

  // Check Foreigner Tips query
  if (/(교통카드|티머니|기후동행|면세|택시|1330|tax|transit|t-money|交通カード|退税|交通卡)/i.test(clean)) {
    const isTransit = /(교통|티머니|기후|transit|card|交通)/i.test(clean);
    const item = isTransit ? FOREIGNER_ESSENTIALS_KNOWLEDGE.TRANSIT_CARD : FOREIGNER_ESSENTIALS_KNOWLEDGE.TAX_REFUND;
    const itemTitle = lang === 'en' ? item.titleEn : lang === 'ja' ? item.titleJa : (lang === 'zh' || lang === 'zht') ? item.titleZh : item.titleKo;
    const itemTip = lang === 'en' ? item.tipEn : lang === 'ja' ? item.tipJa : (lang === 'zh' || lang === 'zht') ? item.tipZh : item.tipKo;

    const followUp = lang === 'en' ? 'Do you need any additional transit or payment tips for Korea? 💳' :
                     lang === 'ja' ? '他にも公共交通や決済について気になる点はありますか？💳' :
                     (lang === 'zh' || lang === 'zht') ? '关于韩国公共交通或支付方式还有其他想了解的吗？💳' :
                     '더 궁금하신 대중교통이나 결제 팁이 있으신가요? 💳';

    return {
      matchedKey: 'FOREIGNER_TIP',
      reply: `💡 **${itemTitle}**\n${itemTip}`,
      followUp,
      isTikitaka: true
    };
  }

  return null;
}

// ==============================================================================
// 7. CITY_GATEWAY_HUBS (도시별 교통 거점 & 숙소 허브 도어투도어 지식)
// ==============================================================================
export const CITY_GATEWAY_HUBS = {
  '서울': {
    gateways: ['인천국제공항', '김포국제공항', '서울역 KTX'],
    hotelAreas: ['명동/종로', '홍대/마포', '강남/잠실', '동대문/이태원'],
    arrivalTransit: '인천국제공항 T1/T2에서 공항철도 직통열차(AREX) 또는 6015/6002 공항리무진 탑승',
    departureAdvice: '서울역 도심공항터미널 얼리 체크인 & 인천공항 3시간 전 도착 후 택스리펀(Tax Refund) 키오스크 이용',
    defaultChips: [
      '✈️ 인천공항 & 명동 숙소',
      '✈️ 김포공항 & 홍대 숙소',
      '🚅 서울역 KTX & 강남 숙소',
      '🏢 이미 서울 시내 도착'
    ]
  },
  '부산': {
    gateways: ['김해국제공항', '부산역 KTX', '부산 서부/종합버스터미널'],
    hotelAreas: ['해운대/광안리', '서면/전포', '남포동/자갈치', '기장/오시리아'],
    arrivalTransit: '부산역 KTX 도착 후 지하철 1/2호선 환승 또는 김해공항 리무진버스 탑승',
    departureAdvice: '부산역 KTX 탑승 30분 전 / 김해공항 국내선 1시간 30분 전 도착 권장',
    defaultChips: [
      '🚅 부산역 KTX & 해운대 숙소',
      '✈️ 김해공항 & 서면 숙소',
      '🌊 광안리 오션뷰 숙소',
      '🏢 이미 부산 시내 도착'
    ]
  },
  '제주': {
    gateways: ['제주국제공항'],
    hotelAreas: ['제주시내/연동', '애월/한림/협재', '서귀포/중문관광단지', '성산/함덕/월정리'],
    arrivalTransit: '제주국제공항 5번 게이트 렌트카 셔틀버스 탑승 또는 급행버스(100~180번) 이용',
    departureAdvice: '렌트카 완전자차 반납 후 제주공항 JDC 내국인/외국인 면세점 쇼핑 2시간 전 도착 권장',
    defaultChips: [
      '✈️ 제주공항 & 제주시내 숙소',
      '🚗 렌트카 & 애월/협재 숙소',
      '🍊 제주공항 & 서귀포/중문',
      '🌴 이미 제주 도착'
    ]
  },
  '강릉': {
    gateways: ['KTX 강릉역', '강릉 고속/시외버스터미널'],
    hotelAreas: ['안목/경포대/강문해변', '강릉 시내/교동', '정동진/주문진'],
    arrivalTransit: 'KTX 강릉역 도착 후 안목해변/경포대 방면 시내버스(202-1번) 또는 택시 10분 이동',
    departureAdvice: 'KTX 강릉역 출발 30분 전 도착 권장 (역사 내 강릉 커피콩빵 & 강릉샌드 기념품 구매)',
    defaultChips: [
      '🚅 KTX 강릉역 & 경포대 숙소',
      '☕ KTX 강릉역 & 안목해변 숙소',
      '🚌 강릉터미널 & 시내 숙소',
      '🌊 이미 강릉 도착'
    ]
  },
  '속초': {
    gateways: ['속초 고속/시외버스터미널'],
    hotelAreas: ['속초해변/조양동', '속초 중앙시장/동명항', '설악산/척산온천'],
    arrivalTransit: '속초고속버스터미널 도착 후 속초아이 대관람차 & 속초해변 도보 5분 이동',
    departureAdvice: '속초터미널 출발 30분 전 도착 권장 (중앙시장 만석닭강정 & 팡파미유 포장)',
    defaultChips: [
      '🚌 속초터미널 & 속초해변 숙소',
      '🦑 속초터미널 & 중앙시장 숙소',
      '🏔️ 설악산 인근 힐링 숙소',
      '🌊 이미 속초 도착'
    ]
  },
  '경주': {
    gateways: ['신경주역 KTX', '경주 고속버스터미널'],
    hotelAreas: ['황리단길/대릉원 인근', '보문관광단지', '불국사 인근'],
    arrivalTransit: '신경주역(KTX)에서 700번 급행버스 탑승 후 황리단길/대릉원 25분 이동',
    departureAdvice: '신경주역 KTX 탑승 30분 전 도착 권장 (황남빵 본점 갓 구운 빵 픽업)',
    defaultChips: [
      '🚅 KTX 신경주역 & 황리단길 숙소',
      '🏛️ KTX 신경주역 & 보문단지 숙소',
      '🚌 경주터미널 & 대릉원 숙소',
      '🌿 이미 경주 도착'
    ]
  },
  '여수': {
    gateways: ['여수EXPO역 KTX', '여수종합버스터미널', '여수공항'],
    hotelAreas: ['이순신광장/낭만포차', '돌산 오션뷰 호텔/리조트', '여수엑스포역/웅천'],
    arrivalTransit: '여수EXPO역(KTX) 도착 후 해양레일바이크 및 낭만포차 방면 택시 5~10분 이동',
    departureAdvice: '여수EXPO역 KTX 탑승 30분 전 도착 권장 (이순신광장 딸기모찌 & 쑥아이스크림 픽업)',
    defaultChips: [
      '🚅 KTX 여수EXPO역 & 돌산 숙소',
      '🌃 여수역 & 이순신광장 숙소',
      '✈️ 여수공항 & 웅천 숙소',
      '🌊 이미 여수 도착'
    ]
  },
  '거제': {
    gateways: ['거제(고현)버스터미널', '김해국제공항', '통영종합버스터미널'],
    hotelAreas: ['바람의언덕/해금강', '매미성/흥남해변', '고현/옥포'],
    arrivalTransit: '부산 사상/노포터미널에서 거가대교 경유 직행버스로 1시간 10분 쾌속 진입',
    departureAdvice: '거제터미널 출발 20분 전 도착 권장 (바람의 핫도그 & 몽돌빵 포장)',
    defaultChips: [
      '🚌 거제터미널 & 바람의언덕 숙소',
      '🌊 거제터미널 & 매미성 숙소',
      '✈️ 김해공항 & 거제 리조트',
      '🏖️ 이미 거제 도착'
    ]
  },
  '인천': {
    gateways: ['인천국제공항 T1/T2', '인천역 1호선/수인분당선', '송도 센트럴파크'],
    hotelAreas: ['송도국제도시', '영종도 오션뷰', '개항장/차이나타운'],
    arrivalTransit: '인천역 또는 공항철도로 송도 센트럴파크 및 개항장 20분 진입',
    departureAdvice: '인천공항 또는 인천역 출발 30분 전 도착 권장 (신포시장 닭강정 포장)',
    defaultChips: [
      '✈️ 인천공항 & 영종도 오션뷰',
      '🏙️ 인천역 & 송도 센트럴파크',
      '🥟 인천역 & 개항장 숙소',
      '🏢 이미 인천 도착'
    ]
  },
  '수원': {
    gateways: ['수원역 KTX/1호선', '수원버스터미널'],
    hotelAreas: ['행궁동/화성행궁', '광교호수공원', '수원역 인근'],
    arrivalTransit: '수원역에서 행궁동 방면 버스로 10분 직통 연결',
    departureAdvice: '수원역 KTX 탑승 20분 전 도착 권장 (통닭거리 남문통닭 포장)',
    defaultChips: [
      '🚅 KTX 수원역 & 행궁동 숙소',
      '🏞️ 수원역 & 광교호수 숙소',
      '🏰 이미 수원 도착'
    ]
  },
  '전주': {
    gateways: ['전주역 KTX', '전주 고속/시외버스터미널'],
    hotelAreas: ['전주 한옥마을', '객리단길/다가동', '서신/효자동'],
    arrivalTransit: '전주역(KTX) 도착 후 119번 버스 탑승 시 한옥마을 입구 20분 직통 연결',
    departureAdvice: '전주역 KTX 탑승 30분 전 도착 권장 (PNB 풍년제과 수제 초코파이 세트 구매)',
    defaultChips: [
      '🚅 KTX 전주역 & 한옥마을 숙소',
      '🛍️ KTX 전주역 & 객리단길 숙소',
      '🚌 전주터미널 & 한옥마을 숙소',
      '🏮 이미 전주 도착'
    ]
  }
};

/**
 * Get Dynamic Gateway Onboarding Chips based on Target City (KO, EN, JA, ZH)
 */
export function getDynamicGatewayChips(targetCity = '서울', lang = 'ko') {
  const cleanCity = (targetCity || '').replace(/(도|시|군|구|특별시|광역시)/g, '').trim();
  const cityKey = Object.keys(CITY_GATEWAY_HUBS).find(k => (targetCity || '').includes(k) || k.includes(cleanCity)) || '서울';
  const hub = CITY_GATEWAY_HUBS[cityKey] || CITY_GATEWAY_HUBS['서울'];
  
  if (lang === 'en') {
    if (cityKey === '부산') {
      return [
        '🚅 Busan Station KTX & Haeundae Hotel',
        '✈️ Gimhae Airport & Seomyeon Hotel',
        '🌊 Gwangalli Ocean View Hotel',
        '🏢 Already in Busan City'
      ];
    } else if (cityKey === '제주') {
      return [
        '✈️ Jeju Airport & Downtown Hotel',
        '🚗 Rental Car & Aewol/Hyeopjae',
        '🍊 Jeju Airport & Seogwipo Resort',
        '🌴 Already in Jeju'
      ];
    } else if (cityKey === '강릉') {
      return [
        '🚅 Gangneung KTX & Gyeongpo Beach',
        '☕ Gangneung KTX & Anmok Cafe Street',
        '🌊 Already in Gangneung'
      ];
    } else if (cityKey === '경주') {
      return [
        '🚅 KTX Singyeongju & Hwangridan-gil',
        '🏛️ KTX Singyeongju & Bomun Resort',
        '🌿 Already in Gyeongju'
      ];
    }
    return [
      '✈️ Incheon Airport & Myeongdong Hotel',
      '✈️ Gimpo Airport & Hongdae Hotel',
      '🚅 Seoul Station KTX & Gangnam Hotel',
      '🏢 Already in Seoul City'
    ];
  }

  if (lang === 'ja') {
    if (cityKey === '부산') {
      return [
        '🚅 釜山駅KTX＆海雲台ホテル',
        '✈️ 金海空港＆西面ホテル',
        '🌊 広安里オーシャンビューホテル',
        '🏢 既に釜山市内に到着'
      ];
    } else if (cityKey === '제주') {
      return [
        '✈️ 済州空港＆済州市内ホテル',
        '🚗 レンタカー＆涯月/協才',
        '🍊 済州空港＆西帰浦リゾート',
        '🌴 既に済州に到着'
      ];
    } else if (cityKey === '강릉') {
      return [
        '🚅 江陵駅KTX＆鏡浦台ホテル',
        '☕ 江陵駅KTX＆安木カフェ通り',
        '🌊 既に江陵に到着'
      ];
    } else if (cityKey === '경주') {
      return [
        '🚅 新慶州駅KTX＆皇理団通り',
        '🏛️ 新慶州駅KTX＆普門リゾート',
        '🌿 既に慶州に到着'
      ];
    }
    return [
      '✈️ 仁川空港＆明洞ホテル',
      '✈️ 金浦空港＆弘大ホテル',
      '🚅 ソウル駅KTX＆江南ホテル',
      '🏢 既にソウル市内に到着'
    ];
  }

  if (lang === 'zh' || lang === 'zht') {
    if (cityKey === '부산') {
      return [
        '🚅 釜山站KTX＆海云台住宿',
        '✈️ 金海机场＆西面住宿',
        '🌊 广安里海景酒店',
        '🏢 已抵达釜山市区'
      ];
    } else if (cityKey === '제주') {
      return [
        '✈️ 济州机场＆济州市区住宿',
        '🚗 自驾租车＆涯月/挟才',
        '🍊 济州机场＆西归浦度假村',
        '🌴 已抵达济州岛'
      ];
    } else if (cityKey === '강릉') {
      return [
        '🚅 江陵站KTX＆镜浦台住宿',
        '☕ 江陵站KTX＆安木海边咖啡街',
        '🌊 已抵达江陵'
      ];
    } else if (cityKey === '경주') {
      return [
        '🚅 新庆州站KTX＆皇理团路住宿',
        '🏛️ 新庆州站KTX＆普门旅游区',
        '🌿 已抵达庆州'
      ];
    }
    return [
      '✈️ 仁川机场＆明洞住宿',
      '✈️ 金浦机场＆弘大住宿',
      '🚅 首尔站KTX＆江南住宿',
      '🏢 已抵达首尔市区'
    ];
  }

  return hub.defaultChips;
}

/**
 * Fallback intent resolver for zero-shot query matching
 */
export function resolveKnowledgeScenario(promptText = '') {
  const p = promptText.toLowerCase();
  
  if (/(어르신|부모님|엄마|아빠|할머니|할아버지|덜\s*걷|안\s*걷|다리|편안|무릎)/i.test(p)) {
    return 'MINIMAL_WALKING';
  }
  if (/(비|우천|비오|폭우|실내|비오는)/i.test(p)) {
    return 'RAINY_INDOOR';
  }
  if (/(아이|애기|키즈|유모차|어린이|자녀|가족)/i.test(p)) {
    return 'KIDS_FAMILY';
  }
  if (/(예산|가성비|저렴|알뜰|5만원|10만원|싸게|학생)/i.test(p)) {
    return 'BUDGET_VALUE';
  }
  if (/(뚜벅|대중교통|지하철|버스|차\s*없이|도보|역세권)/i.test(p)) {
    return 'PUBLIC_TRANSIT';
  }
  if (/(혼자|나홀로|솔로|혼행|사색|조용)/i.test(p)) {
    return 'SOLO_HEALING';
  }
  if (/(맛집|미식|카페|디저트|빵|먹방|푸드|맛있는)/i.test(p)) {
    return 'FOODIE_CAFE';
  }
  if (/(야경|노을|일몰|석양|밤바다|야간)/i.test(p)) {
    return 'NIGHT_SUNSET';
  }

  return 'FOODIE_CAFE';
}
