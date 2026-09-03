// Master Nationwide 226 Cities Knowledge Vault Compiler
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function encryptVoraPayload(plain) {
  const buf = Buffer.from(plain, 'utf-8');
  const key = Buffer.from('VORA_AI_MASTER_KEY_2026_SECRET', 'utf-8');
  const shifted = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i++) {
    shifted[i] = buf[i] ^ key[i % key.length] ^ 0x5A;
  }
  return shifted.toString('base64');
}

function decryptVoraPayload(cipher) {
  const buf = Buffer.from(cipher, 'base64');
  const key = Buffer.from('VORA_AI_MASTER_KEY_2026_SECRET', 'utf-8');
  const unshifted = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i++) {
    unshifted[i] = buf[i] ^ 0x5A ^ key[i % key.length];
  }
  return unshifted.toString('utf-8');
}

// 1. Load existing Q&A items from vault
const vaultPath = path.resolve(__dirname, '../src/data/voraQnaVault.js');
let existingQnaList = [];
if (fs.existsSync(vaultPath)) {
  try {
    const vaultCode = fs.readFileSync(vaultPath, 'utf-8');
    const prefix = 'export const VORA_ENCRYPTED_VAULT_PAYLOAD = "';
    const startIdx = vaultCode.indexOf(prefix);
    if (startIdx !== -1) {
      const pStart = startIdx + prefix.length;
      const endIdx = vaultCode.indexOf('";', pStart);
      if (endIdx !== -1) {
        const cipher = vaultCode.substring(pStart, endIdx);
        const decrypted = decryptVoraPayload(cipher);
        const parsed = JSON.parse(decrypted);
        if (parsed && Array.isArray(parsed.qnaVault)) {
          existingQnaList = parsed.qnaVault.filter(q => q && q.id && !q.id.startsWith('qna_city_'));
        }
      }
    }
  } catch (e) {
    console.warn('Note: Could not parse existing non-city Q&A, will use defaults.', e.message);
  }
}

// 2. Comprehensive 226 Cities & Counties Knowledge Matrix
const CITY_KNOWLEDGE_226 = {};

function registerCity(name, {
  nameEn, nameJa, nameZh,
  badge, badgeEn, badgeJa, badgeZh,
  signatureHighlights, signatureHighlightsEn, signatureHighlightsJa, signatureHighlightsZh,
  rainyHotspots, rainyHotspotsEn, rainyHotspotsJa, rainyHotspotsZh,
  walkingMinimized,
  localFoodieSecret, localFoodieSecretEn, localFoodieSecretJa, localFoodieSecretZh,
  transitTip, transitTipEn, transitTipJa, transitTipZh,
  hotelType = 'inland',
  nightHighlights = [], nightHighlightsEn = [], nightHighlightsJa = [], nightHighlightsZh = [],
  cafeHighlights = [], signatureHotels = []
}) {
  const nEn = nameEn || name;
  const nJa = nameJa || name;
  const nZh = nameZh || name;

  CITY_KNOWLEDGE_226[name] = {
    nameKo: name,
    nameEn: nEn,
    nameJa: nJa,
    nameZh: nZh,
    badge: badge || `${name} 대표 랜드마크와 로컬 감성의 힐링 여행지`,
    badgeEn: badgeEn || `Discover iconic sights and local healing wonders in ${nEn}.`,
    badgeJa: badgeJa || `${nJa}の代表的な名所と癒やしの旅`,
    badgeZh: badgeZh || `探寻${nZh}代表性名胜与治愈之旅`,
    signatureHighlights: signatureHighlights || [`${name} 대표 명소`, `${name} 중앙공원`, `${name} 문화거리`],
    signatureHighlightsEn: signatureHighlightsEn || [`${nEn} Iconic Landmark`, `${nEn} Central Park`, `${nEn} Culture Street`],
    signatureHighlightsJa: signatureHighlightsJa || [`${nJa}代表名所`, `${nJa}中央公園`, `${nJa}文化通り`],
    signatureHighlightsZh: signatureHighlightsZh || [`${nZh}代表名胜`, `${nZh}中央公园`, `${nZh}文化街`],
    rainyHotspots: rainyHotspots || [`${name} 시립박물관`, `${name} 문화예술회관`, `${name} 실내생태체험관`],
    rainyHotspotsEn: rainyHotspotsEn || [`${nEn} Municipal Museum`, `${nEn} Arts Center`, `${nEn} Indoor Eco Center`],
    rainyHotspotsJa: rainyHotspotsJa || [`${nJa}市立博物館`, `${nJa}文化芸術会館`, `${nJa}屋内生態体験館`],
    rainyHotspotsZh: rainyHotspotsZh || [`${nZh}市立博物馆`, `${nZh}文化艺术会馆`, `${nZh}室内生态体验馆`],
    walkingMinimized: walkingMinimized || [`${name} 도심 평지 산책로`, `${name} 수변 데크로드`, `${name} 무장애 관람로`],
    localFoodieSecret: localFoodieSecret || `${name} 로컬 대표 향토음식 & 전통시장 먹거리`,
    localFoodieSecretEn: localFoodieSecretEn || `${nEn} local authentic specialties & traditional market street food`,
    localFoodieSecretJa: localFoodieSecretJa || `${nJa}の郷土料理と伝統市場の名物グルメ`,
    localFoodieSecretZh: localFoodieSecretZh || `${nZh}地道特色美食与传统市场小吃`,
    transitTip: transitTip || `${name} 중심 버스터미널 및 대중교통 거점 연결`,
    transitTipEn: transitTipEn || `Accessible via ${nEn} Central Bus Terminal & Public Transit Hub`,
    transitTipJa: transitTipJa || `${nJa}バスターミナル及び公共交通拠点接続`,
    transitTipZh: transitTipZh || `${nZh}中心客运站及公共交通枢纽换乘`,
    hotelType: hotelType || 'inland',
    nightHighlights: nightHighlights.length > 0 ? nightHighlights : [
      { name: `${name} 도심 야간 산책로`, type: '야경 명소', desc: `은은한 조명을 따라 걷는 ${name} 밤마실 명소` }
    ],
    nightHighlightsEn: nightHighlightsEn.length > 0 ? nightHighlightsEn : [`${nEn} Downtown Night Trail`],
    nightHighlightsJa: nightHighlightsJa.length > 0 ? nightHighlightsJa : [`${nJa}夜間散策路`],
    nightHighlightsZh: nightHighlightsZh.length > 0 ? nightHighlightsZh : [`${nZh}夜间漫步道`],
    cafeHighlights: cafeHighlights.length > 0 ? cafeHighlights : [
      { name: `${name} 감성 로컬 카페`, type: '감성 카페', desc: `지역 특산 디저트와 향긋한 스페셜티 커피를 즐기는 쉼터` }
    ],
    signatureHotels: signatureHotels.length > 0 ? signatureHotels : [
      { name: `${name} 대표 호텔 & 리조트`, type: '휴양 스테이', desc: `${name} 주요 명소와 자연 경관을 누리는 쾌적한 힐링 숙소` }
    ]
  };
}

// 🏛️ Seoul (서울)
registerCity('서울', {
  nameEn: 'Seoul', nameJa: 'ソウル', nameZh: '首尔',
  badge: 'K-컬처와 전통이 공존하는 글로벌 수도',
  badgeEn: 'Global Capital Blending K-Culture and Royal Heritage',
  badgeJa: 'K-Cultureと伝統が共存するグローバル首都',
  badgeZh: '融合K-Culture与王室传统的全球都会',
  signatureHighlights: ['경복궁 & 북촌한옥마을', 'N서울타워 파노라마', 'DDP & 성수동 감성 거리', '더현대 서울 & 한강공원'],
  signatureHighlightsEn: ['Gyeongbokgung Palace & Bukchon', 'N Seoul Tower Panorama', 'DDP & Seongsu Trendy Street', 'The Hyundai Seoul & Hangang Park'],
  signatureHighlightsJa: ['景福宮＆北村韓屋村', 'Nソウルタワーパノラマ', 'DDP＆聖水洞カフェ通り', 'ザ・現代ソウル＆漢江公園'],
  signatureHighlightsZh: ['景福宫与北村韩屋村', 'N首尔塔全景展望台', 'DDP与圣水洞潮流街区', '首尔现代百货与汉江公园'],
  rainyHotspots: ['코엑스 별마당도서관 & 아쿠아리움', '더현대 서울 사운즈포레스트', '국립중앙박물관 사유의 방', 'DDP 디자인랩 & 갤러리'],
  walkingMinimized: ['N서울타워 케이블카 직통 코스', '청와대 본관 평지 관람로', '한강 유람선 선상 로맨틱', '인사동 쌈지길 & 전통 찻집'],
  localFoodieSecret: '광장시장 마약김밥·빈대떡, 성수동 스페셜티 브루잉 카페, 종로 생선구이 백반',
  localFoodieSecretEn: 'Gwangjang Market Mayak Gimbap & Bindaetteok, Seongsu Specialty Coffee, Jongno Grilled Fish Set',
  localFoodieSecretJa: '広蔵市場の麻薬キンパ＆ピンデトッ、聖水洞のスペシャリティコーヒー、鍾路の焼き魚定食',
  localFoodieSecretZh: '广藏市场麻药紫菜包饭与绿豆煎饼、圣水洞精品手冲咖啡、钟路烤鱼定食',
  transitTip: '지하철 1~9호선 및 기후동행카드로 서울 전역 30분대 쾌속 이동',
  transitTipEn: 'Quick 30-min connections across Seoul via Metro Lines 1-9 & Climate Card',
  transitTipJa: '地下鉄1〜9号線および気候同行カードでソウル全域30分で移動可能',
  transitTipZh: '搭乘地铁1至9号线及气候同行卡30分钟内畅达首尔全境',
  hotelType: 'inland',
  nightHighlights: [
    { name: 'N서울타워 & 남산 케이블카', desc: '서울 도심 360도 파노라마 야경과 사랑의 자물쇠 명소' },
    { name: '낙산공원 한양도성길', desc: '은은한 성곽 조명을 따라 걷는 로맨틱 감성 밤 산책' },
    { name: '반포 한강공원 & 달빛무지개분수', desc: '달빛 야경과 함께 즐기는 시원한 한강 치맥 피크닉' },
    { name: 'DDP (동대문디자인플라자)', desc: '실버 유선형 건축물과 환상적인 LED 미디어아트 야경' }
  ],
  nightHighlightsEn: ['N Seoul Tower & Namsan Cable Car', 'Naksan Park Seoul Fortress Wall', 'Banpo Hangang Rainbow Fountain', 'DDP LED Light Show'],
  nightHighlightsJa: ['Nソウルタワー＆南山ケーブルカー', '駱山公園ソウル城郭道', '盤浦漢江公園月光虹の噴水', 'DDPメディアアート夜景'],
  nightHighlightsZh: ['N首尔塔与南山缆车', '骆山公园首尔城郭步道', '盘浦汉江公园月光彩虹喷泉', 'DDP东大门设计广场夜景']
});

// 🏛️ Busan (부산)
registerCity('부산', {
  nameEn: 'Busan', nameJa: '釜山', nameZh: '釜山',
  badge: '푸른 바다와 화려한 도심 야경의 해양 수도',
  badgeEn: 'Maritime Capital with Blue Oceans and Skyline Night Views',
  badgeJa: '青い海と華やかなスカイライン夜景の海洋首都',
  badgeZh: '碧海蓝天与繁华天际线夜景的海洋之都',
  signatureHighlights: ['해운대 블루라인파크 & 해동용궁사', '광안리해변 테마거리 & 광안대교', '감천문화마을 & 흰여울문화마을', '자갈치시장 & 남포동'],
  signatureHighlightsEn: ['Haeundae Blueline Park & Haedong Yonggungsa', 'Gwangalli Beach & Gwangandaegyo Bridge', 'Gamcheon & Huinnyeoul Culture Village', 'Jagalchi Fish Market & Nampo-dong'],
  signatureHighlightsJa: ['海雲台ブルーラインパーク＆海東龍宮寺', '広安里ビーチ＆広安大橋', '甘川文化村＆ヒンヨウル文化村', 'チャガルチ市場＆南浦洞'],
  signatureHighlightsZh: ['海云台蓝线公园与海东龙宫寺', '广安里海滩与广安大桥', '甘川文化村与白浅滩文化村', '札嘎其海鲜市场与南浦洞'],
  rainyHotspots: ['씨라이프 부산아쿠아리움', '센텀시티 스파랜드 & 신세계몰', '뮤지엄 원 미디어아트', 'F1963 복합문화공간'],
  walkingMinimized: ['송도 해상케이블카', '해운대 블루라인파크 스카이캡슐', '다이아몬드베이 요트투어', '광안리 오션 카페거리'],
  localFoodieSecret: '부산 원조 돼지국밥, 자갈치 생선구이 백반, 남포동 씨앗호떡, 기장 짚불장어',
  localFoodieSecretEn: 'Busan Pork Rice Soup, Jagalchi Grilled Fish Set, Nampodong Ssiat Hotteok, Gijang Straw-grilled Eel',
  localFoodieSecretJa: '釜山名物デジクッパ、チャガルチの焼き魚定食、南浦洞シアホットク、機張ワラ焼きウナギ',
  localFoodieSecretZh: '釜山元祖猪肉汤饭、札嘎其烤鱼定食、南浦洞坚果糖饼、机张稻草烤鳗鱼',
  transitTip: '지하철 2호선(센텀-해운대) 및 동해선으로 기장·오시리아 관광단지까지 직통 이동',
  transitTipEn: 'Direct access to Centum, Haeundae, and Gijang via Metro Line 2 & Donghae Line',
  transitTipJa: '地下鉄2号線（センタム・海雲台）および東海線で機張・オシリアまで直通移動',
  transitTipZh: '搭乘地铁2号线（Centum·海云台）及东海线直达机张及奥西利亚旅游区',
  hotelType: 'coastal',
  nightHighlights: [
    { name: '광안리 해변 & M 드론라이트쇼', desc: '광안대교 LED 조명과 수백 대 드론이 펼치는 밤하늘 쇼' },
    { name: '더베이101 & 마린시티', desc: '홍콩 야경을 방불케 하는 화려한 마천루 반영 사진 명소' }
  ],
  nightHighlightsEn: ['Gwangalli Beach M Drone Show', 'The Bay 101 & Marine City Skyline'],
  nightHighlightsJa: ['広安里ビーチ Mドローンライトショー', 'ザ・ベイ101＆マリンシティ夜景'],
  nightHighlightsZh: ['广安里海滩无人机光影秀', 'The Bay 101与Marine City摩天楼夜景']
});

// 🏛️ Jeju (제주)
registerCity('제주', {
  nameEn: 'Jeju', nameJa: '済州', nameZh: '济州',
  badge: '유네스코 자연유산과 에메랄드빛 로맨틱 섬',
  badgeEn: 'UNESCO World Natural Heritage Island with Emerald Coastlines',
  badgeJa: 'ユネスコ世界自然遺産とエメラルド色のロマンチックな島',
  badgeZh: '联合国教科文组织自然遗产与翡翠海岸浪漫之岛',
  signatureHighlights: ['성산일출봉 & 섭지코지', '함덕 서우봉 에메랄드 해변', '한림공원 & 협재해변', '중문관광단지 주상절리'],
  signatureHighlightsEn: ['Seongsan Ilchulbong & Seopjikoji', 'Hamdeok Seoubong Emerald Beach', 'Hallim Park & Hyeopjae Beach', 'Jungmun Columnar Joint'],
  signatureHighlightsJa: ['城山日出峰＆ソプチコジ', '咸徳ソウボンエメラルドビーチ', '翰林公園＆挟才ビーチ', '中文観光団地柱状節理'],
  signatureHighlightsZh: ['城山日出峰与涉地可支', '咸德犀牛峰翡翠海滩', '翰林公园与挟才海滩', '中文旅游区柱状节理'],
  rainyHotspots: ['아르떼뮤지엄 제주', '스누피가든 실내 하우스', '빛의 벙커 몰입형 미디어아트', '아쿠아플라넷 제주'],
  walkingMinimized: ['에코랜드 곶자왈 숲속 기차여행', '제주 요트보트 & 서귀포 잠수함', '용두암 & 해안도로 드라이브', '산방산 탄산온천'],
  localFoodieSecret: '제주 흑돼지 근고기, 고기국수, 갈치조림, 우도 땅콩 아이스크림',
  localFoodieSecretEn: 'Jeju Black Pork BBQ, Meat Noodles, Braised Cutlassfish, Udo Peanut Ice Cream',
  localFoodieSecretJa: '済州黒豚焼肉、コギククス（豚肉素麺）、タチウオの煮付け、牛島ピーナッツソフト',
  localFoodieSecretZh: '济州黑猪肉厚切烤肉、猪肉汤面、辣炖带鱼、牛岛花生冰淇淋',
  transitTip: '제주공항 급행버스(100~180번대)로 동서부 주요 거점 1시간 내 이동 가능',
  transitTipEn: 'Express buses 100-180 connect Airport to key eastern & western hubs within 1 hour',
  transitTipJa: '済州空港急行バス（100〜180番台）で東西の主要拠点へ1時間以内で移動可能',
  transitTipZh: '济州机场乘快速公交（100-180路）1小时内畅达东西部主要枢纽',
  hotelType: 'coastal'
});

// 🏛️ Seogwipo (서귀포)
registerCity('서귀포', {
  nameEn: 'Seogwipo', nameJa: '西帰浦', nameZh: '西归浦',
  badge: '에메랄드빛 해안절벽과 폭포·주상절리의 힐링 휴양지',
  badgeEn: 'Coastal Haven with Waterfalls, Cliffs and Columnar Joints',
  badgeJa: 'エメラルド色の海岸断崖と滝・柱状節理のヒーリングリゾート',
  badgeZh: '壮丽海岸悬崖与瀑布柱状节理的疗愈度假胜地',
  signatureHighlights: ['천지연폭포 & 새연교', '중문 주상절리대', '섭지코지 & 쇠소깍 카약', '서귀포 매일올레시장'],
  signatureHighlightsEn: ['Cheonjiyeon Falls & Saeyeongyo', 'Jungmun Columnar Joint', 'Seopjikoji & Soesokkak Kayak', 'Seogwipo Olle Market'],
  signatureHighlightsJa: ['天地淵の滝＆セヨン橋', '中文柱状節理帯', 'ソプチコジ＆牛沼河口カヤック', '西帰浦毎日オルレ市場'],
  signatureHighlightsZh: ['天地渊瀑布与新缘桥', '中文柱状节理带', '涉地可支与牛沼河口皮划艇', '西归浦每日偶来市场'],
  rainyHotspots: ['빛의 벙커', '아쿠아플라넷 제주', '이중섭미술관', '제주해양도립공원'],
  walkingMinimized: ['쇠소깍 전통조각배 투어', '새연교 평지 보도교', '올레시장 평지 야시장'],
  localFoodieSecret: '올레시장 마농치킨·모닥치기, 서귀포 옥돔구이 백반, 흑돼지 해물삼합',
  localFoodieSecretEn: 'Olle Market Garlic Fried Chicken, Modakchigi Snack Combo, Grilled Tilefish Set',
  localFoodieSecretJa: 'オルレ市場のマノンチキン＆モダクチギ、西帰浦のアマダイ焼き定食、黒豚海鮮盛り合わせ',
  localFoodieSecretZh: '每日偶来市场大蒜炸鸡与特色小吃拼盘、西归浦烤方头鱼定食、黑猪肉海鲜三合',
  transitTip: '제주공항 800번 리무진버스로 서귀포 도심 50분 쾌속 직통',
  transitTipEn: 'Airport Limousine Bus 800 reaches Downtown Seogwipo directly in 50 minutes',
  transitTipJa: '済州空港800番リムジンバスで西帰浦市内へ50分で直通',
  transitTipZh: '济州机场乘坐800路机场大巴50分钟直达西归浦市区',
  hotelType: 'coastal'
});

// 🏛️ Gyeongju (경주)
registerCity('경주', {
  nameEn: 'Gyeongju', nameJa: '慶州', nameZh: '庆州',
  badge: '천년 신라 고도의 숨결과 황리단길의 뉴트로 감성',
  badgeEn: 'Millennium Ancient Capital of Silla & Trendy Hwangnidangil',
  badgeJa: '千年の古都・新羅の息吹と皇理団通りのレトロカフェ',
  badgeZh: '千年新罗古都神韵与皇理团路复古新潮街区',
  signatureHighlights: ['불국사 & 석굴암', '동궁과 월지 야경', '대릉원 천마총 & 황리단길', '첨성대 핑크뮬리 단지'],
  signatureHighlightsEn: ['Bulguksa Temple & Seokguram', 'Donggung & Wolji Pond Night View', 'Daereungwon & Hwangnidangil', 'Cheomseongdae Observatory'],
  signatureHighlightsJa: ['仏国寺＆石窟庵', '東宮と月池（アナプチ）夜景', '大陵苑天馬塚＆皇理団通り', '瞻星台ピンクミューリー'],
  signatureHighlightsZh: ['佛国寺与石窟庵', '东宫与月池夜景', '大陵苑天马冢与皇理团路', '瞻星台粉黛乱子草花海'],
  rainyHotspots: ['국립경주박물관 & 신라천년보고', '우양미술관', '경주세계자동차박물관', '정글의법칙 미디어아트'],
  walkingMinimized: ['동궁과 월지 평지 산책로', '황리단길 한옥 카페 쉼터', '보문관광단지 호반 드라이브', '불국사 무장애 데크길'],
  localFoodieSecret: '황남빵 본점 갓 구운 팥빵, 경주 한우 물회, 맷돌순두부찌개, 황리단길 십원빵',
  localFoodieSecretEn: 'Hwangnam-ppang Fresh Red Bean Pastry, Gyeongju Hanwoo Cold Raw Beef Soup, Tofu Stew, 10-Won Bread',
  localFoodieSecretJa: '皇南パン焼きたてあんパン、慶州韓牛ムルフェ、スンドゥブチゲ、皇理団通り10ウォンパン',
  localFoodieSecretZh: '皇南饼现烤红豆饼、庆州韩牛水生牛肉汤、石磨嫩豆腐汤、皇理团路10韩元面包',
  transitTip: '신경주역 KTX에서 황리단길·대릉원 700번 급행버스로 20분 진입',
  transitTipEn: 'Express Bus 700 reaches Hwangnidangil & Daereungwon in 20 min from Singyeongju KTX',
  transitTipJa: '新慶州駅（KTX）から皇理団通り・大陵苑まで急行バス700番で20分',
  transitTipZh: '新庆州站（KTX）乘700路快速公交20分钟即达皇理团路及大陵苑',
  hotelType: 'inland'
});

// 🏛️ Gangneung (강릉)
registerCity('강릉', {
  nameEn: 'Gangneung', nameJa: '江陵', nameZh: '江陵',
  badge: '푸른 동해바다와 솔향기, 커피 향 가득한 감성 힐링 도시',
  badgeEn: 'Pine Scent, Specialty Coffee & Deep Blue East Sea',
  badgeJa: '青い東海と松の香り、コーヒーの芳醇なアロマ漂う癒やしの街',
  badgeZh: '蔚蓝东海、清雅松香与浓郁咖啡香交织的治愈之城',
  signatureHighlights: ['경포대 & 경포해변 솔숲', '안목해변 강릉 커피거리', '아르떼뮤지엄 강릉', '오죽헌 & 선교장', '정동진 썬크루즈 & 바다부채길', 'BTS 버스정류장(향호해변)'],
  signatureHighlightsEn: ['Gyeongpodae & Pine Grove', 'Anmok Beach Coffee Street', 'Arte Museum Gangneung', 'Ojukheon & Seongyojang', 'Jeongdongjin Sun Cruise & Coastal Trail', 'BTS Bus Stop (Hyangho Beach)'],
  signatureHighlightsJa: ['鏡浦台＆鏡浦ビーチ松林', '安木ビーチ江陵コーヒー通り', 'アルテミュージアム江陵', '烏竹軒＆船橋荘', '正東津サンクルーズ＆パダプチェキル', 'BTSバス停（香湖ビーチ）'],
  signatureHighlightsZh: ['镜浦台与镜浦海滩松林', '安木海滩江陵咖啡街', '江陵ARTE博物馆', '乌竹轩与船桥庄', '正东津太阳邮轮与扇形海岸步道', '防弹少年团BTS公交站（香湖海滩）'],
  rainyHotspots: ['아르떼뮤지엄 강릉', '하슬라아트월드 실내미술관', '참소리축음기·에디슨과학박물관', '오죽헌 시립박물관'],
  walkingMinimized: ['경포호 자전거 투어', '안목해변 카페 오션뷰 테라스', '정동진 바다열차', '강릉 솔향수목원 무장애 데크길'],
  localFoodieSecret: '초당 순두부마을 짬뽕순두부·순두부젤라또, 장칼국수, 중앙시장 배니닭강정·오징어순대, 커피콩빵',
  localFoodieSecretEn: 'Chodang Soft Tofu Jjambbong & Gelato, Spicy Jang-kalguksu, Central Market Squid Sundae, Coffee Bean Bread',
  localFoodieSecretJa: '草堂スンドゥブ村のチャンポンスンドゥブ＆ジェラート、ジャンカルグクス、中央市場のイカスンデ',
  localFoodieSecretZh: '草堂嫩豆腐村海鲜辣汤嫩豆腐与豆腐冰淇淋、韩式酱刀切面、中央市场鱿鱼米肠',
  transitTip: 'KTX 강릉역에서 안목커피거리·경포대 버스/택시 10~15분 쾌속 연결',
  transitTipEn: 'KTX Gangneung Station connects to Anmok Coffee Street & Gyeongpo in 10-15 min',
  transitTipJa: 'KTX江陵駅から安木コーヒー通り・鏡浦台までバス／タクシーで10〜15分',
  transitTipZh: 'KTX江陵站乘公交/出租车10-15分钟即达安木咖啡街与镜浦台',
  hotelType: 'coastal'
});

// 🏛️ Sokcho (속초)
registerCity('속초', {
  nameEn: 'Sokcho', nameJa: '束草', nameZh: '束草',
  badge: '설악산의 비경과 푸른 동해, 갯배 체험과 미식의 해양 관광도시',
  badgeEn: 'Majestic Seoraksan Peaks, Blue East Sea & Abai Village Ferries',
  badgeJa: '雪岳山の絶景と青い東海、ケッペ渡し舟と海の幸の港町',
  badgeZh: '雪岳山秘境、蔚蓝东海、人力渡船体验与海鲜美食之都',
  signatureHighlights: ['설악산 국립공원 & 권금성 케이블카', '아바이마을 & 갯배체험', '속초해수욕장 & 속초아이 대관람차', '영금정 해돋이정자', '외옹치 바다향기로'],
  signatureHighlightsEn: ['Seoraksan & Gwongeumseong Cable Car', 'Abai Village Gaetbae Ferry', 'Sokcho Beach & Sokcho Eye Wheel', 'Yeonggeumjeong Sunrise Pavilion', 'Oeongchi Coastal Path'],
  signatureHighlightsJa: ['雪岳山＆権金城ケーブルカー', 'アバイ村＆ケッペ渡し舟体験', '束草ビーチ＆束草アイ大観覧車', '霊琴亭日の出あずまや', '外翁峙海の香り路'],
  signatureHighlightsZh: ['雪岳山与权金城缆车', '阿爸村与人力渡船体验', '束草海滩与束草之眼摩天轮', '灵琴亭日出亭', '外翁峙海香路'],
  rainyHotspots: ['속초시립박물관 & 실향민문화촌', '바우지움 조각미술관', '국립산악박물관', '얼라이브하트 & 다이나믹메이즈'],
  walkingMinimized: ['설악산 권금성 케이블카', '아바이마을 갯배탑승', '속초아이 대관람차', '영금정 해상정자 평지데크'],
  localFoodieSecret: '속초관광수산시장 만석닭강정·오징어순대·씨앗호떡, 아바이순대국밥, 봉포머구리집 물회, 대게 코스요리',
  localFoodieSecretEn: 'Sokcho Tourist Market Sweet Chicken & Squid Sundae, Abai Sundae Soup, Cold Raw Fish Soup, Snow Crab',
  localFoodieSecretJa: '束草観光水産市場のタッカンジョン＆イカスンデ、アバイスンデクッパ、アワビムルフェ、ズワイガニコース',
  localFoodieSecretZh: '束草观光水产市场甜脆炸鸡与鱿鱼米肠、阿爸村米肠汤饭、水生海鲜汤、红叶蟹套餐',
  transitTip: '속초고속버스터미널에서 속초해수욕장 도보 5분, 아바이마을 시내버스 10분 연결',
  transitTipEn: 'Walk 5 min to Sokcho Beach from Sokcho Express Bus Terminal; 10 min bus to Abai Village',
  transitTipJa: '束草高速バスターミナルから束草ビーチへ徒歩5分、アバイ村へ市内バス10分',
  transitTipZh: '束草高速客运站步行5分钟即达束草海滩，乘市内公交10分钟可达阿爸村',
  hotelType: 'coastal'
});

// 🏛️ Yeosu (여수)
registerCity('여수', {
  nameEn: 'Yeosu', nameJa: '麗水', nameZh: '丽水',
  badge: '로맨틱 여수 밤바다와 에메랄드빛 해양 레저의 해양 관광도시',
  badgeEn: 'Romantic Yeosu Night Sea and Maritime Cable Car Splendor',
  badgeJa: 'ロマンチックな麗水の夜の海と海上ロープウェイの港町',
  badgeZh: '浪漫丽水夜海与跨海缆车绝景的海洋之都',
  signatureHighlights: ['오동도 동백열차 & 등대', '여수 해상케이블카 (돌산-자산)', '돌산공원 & 돌산대교 야경', '향일암 일출 명소', '이순신광장 & 하멜등대'],
  signatureHighlightsEn: ['Odongdo Camellia Train & Lighthouse', 'Yeosu Maritime Cable Car', 'Dolsan Park & Bridge Night View', 'Hyangiram Sunrise Hermitage', 'Yi Sun-sin Square & Hamel Lighthouse'],
  signatureHighlightsJa: ['梧桐島ツバキ列車＆灯台', '麗水海上ロープウェイ', '突山公園＆突山大橋の夜景', '向日庵日の出名所', '李舜臣広場＆ハーメル灯台'],
  signatureHighlightsZh: ['梧桐岛山茶花列车与灯塔', '丽水海上缆车', '突山公园与突山大桥夜景', '向日庵日出圣地', '李舜臣广场与哈梅尔灯塔'],
  rainyHotspots: ['아쿠아플라넷 여수', '녹테마레 미디어아트관', '아르떼뮤지엄 여수', '예술의 섬 장도 실내전시관'],
  walkingMinimized: ['여수 해상케이블카', '오동도 동백열차', '미남크루즈 야경 선상투어', '해상 낭만포차거리 테라스'],
  localFoodieSecret: '여수 10미: 돌게장 백반 정식(간장·양념게장 무한리필), 서대회무침, 갓김치, 낭만포차 해물삼합, 갯장어(하모) 샤브샤브',
  localFoodieSecretEn: 'Yeosu 10 Flavors: Stone Crab Set, Seasoned Raw Tongue Sole, Gat Kimchi, Seafood Samhap, Hamo Shabu-shabu',
  localFoodieSecretJa: '麗水10味：イシガニ定食（醤油・ヤンニョムケジャン）、コウライアカシタビラメ刺身和え、カラシナキムチ、海鮮盛り合わせ',
  localFoodieSecretZh: '丽水十味：石头蟹定食酱蟹、凉拌舌鳎鱼、芥菜泡菜、海鲜浪漫大排档三合、海鳗涮涮锅',
  transitTip: 'KTX 여수엑스포역에서 오동도·이순신광장 도보 및 버스로 10분 진입',
  transitTipEn: 'Reach Odongdo & Yi Sun-sin Square in 10 min by walk or bus from Yeosu Expo KTX',
  transitTipJa: 'KTX麗水エキスポ駅から梧桐島・李舜臣広場まで徒歩およびバスで10分',
  transitTipZh: 'KTX丽水世博站步行或乘车10分钟即达梧桐岛与李舜臣广场',
  hotelType: 'coastal'
});

// 🏛️ Jeonju (전주)
registerCity('전주', {
  nameEn: 'Jeonju', nameJa: '全州', nameZh: '全州',
  badge: '700여 채 한옥의 멋과 유네스코 음식창의도시 전주 8미의 한국 전통 수도',
  badgeEn: 'UNESCO Creative City of Gastronomy with 700 Traditional Hanok Roofs',
  badgeJa: '700軒の韓屋の風情とユネスコ食文化創造都市・全州8味の伝統首都',
  badgeZh: '七百座韩屋古韵与联合国教科文组织美食之都全州传统风味',
  signatureHighlights: ['전주 한옥마을 (경기전 & 전동성당)', '오목대 한옥마을 전망대', '전주 향교 & 자만벽화마을', '남부시장 청년몰 & 야시장', '덕진공원 연화교'],
  signatureHighlightsEn: ['Jeonju Hanok Village (Gyeonggijeon & Jeondong)', 'Omokdae Panorama Viewpoint', 'Jeonju Hyanggyo & Jaman Mural Village', 'Nambu Market Youth Mall & Night Market', 'Deokjin Park Lotus Bridge'],
  signatureHighlightsJa: ['全州韓屋村（慶基殿＆全洞聖堂）', '梧木台韓屋村展望台', '全州郷校＆滋満壁画村', '南部市場青年モール＆夜市場', '徳津公園蓮花橋'],
  signatureHighlightsZh: ['全州韩屋村（庆基殿与殿洞圣堂）', '梧木台韩屋村全景展望台', '全州乡校与滋满壁画村', '南部市场青年商城与夜市', '德津公园莲花桥'],
  rainyHotspots: ['국립무형유산원', '전주난장(레트로 근현대사 체험박물관)', '어진박물관', '전주한지박물관'],
  walkingMinimized: ['한옥마을 전동스쿠터 투어', '경기전 대숲 평지길', '오목대 셔틀', '남부시장 평지 아케이드'],
  localFoodieSecret: '전주 비빔밥(놋그릇 육회비빔밥), 전주 콩나물국밥(현대옥·삼백집 수란 정식), 남부시장 피순대국밥, 풍년제과 수제 초코파이, 전주 막걸리 골목 20첩 한상',
  localFoodieSecretEn: 'Jeonju Raw Beef Bibimbap, Bean Sprout Soup with Poached Egg, Blood Sundae Soup, Pungnyeon Choco Pie, Makgeolli Alley Table',
  localFoodieSecretJa: '全州ビビンバ（ユッケビビンバ）、全州もやしクッパ、南部市場のピスンデ、豊年製菓の手作りチョコパイ、全州マッコリ横丁',
  localFoodieSecretZh: '全州生牛肉拌饭、全州黄豆芽汤饭配温泉蛋、南部市场血肠汤饭、丰年制果手工巧克力派、全州米酒巷20道下酒菜盛宴',
  transitTip: 'KTX 전주역에서 한옥마을 119번·79번 버스로 15분 직통 연결',
  transitTipEn: 'Buses 119 & 79 connect KTX Jeonju Station directly to Hanok Village in 15 min',
  transitTipJa: 'KTX全州駅から韓屋村まで119番・79番バスで15分直通',
  transitTipZh: 'KTX全州站乘119路或79路公交车15分钟直达韩屋村',
  hotelType: 'inland'
});

// 🏛️ Suwon (수원)
registerCity('수원', {
  nameEn: 'Suwon', nameJa: '水原', nameZh: '水原',
  badge: '유네스코 세계유산 수원화성과 행궁동 감성 골목길',
  badgeEn: 'UNESCO World Heritage Suwon Hwaseong Fortress & Haenggung-dong',
  badgeJa: '世界遺産・水原華城と行宮洞のおしゃれなカフェ通り',
  badgeZh: '世界文化遗产水原华城与行宫洞特色潮流小巷',
  signatureHighlights: ['수원화성 & 방화수류정', '화성행궁 & 행리단길', '창룡문 플라잉수원 열기구', '수원 통닭거리 & 왕갈비'],
  signatureHighlightsEn: ['Suwon Hwaseong Fortress & Banghwasuryujeong', 'Hwaseong Haenggung & Haengridangil', 'Flying Suwon Hot Air Balloon', 'Suwon Fried Chicken Alley & King Galbi'],
  signatureHighlightsJa: ['水原華城＆訪花随柳亭', '華城行宮＆行理団通り', 'フライング水原気球体験', '水原チキン横丁＆王カルビ'],
  signatureHighlightsZh: ['水原华城与访花随柳亭', '华城行宫与行理团路', 'Flying Suwon热气球体验', '水原炸鸡街与王排骨'],
  localFoodieSecret: '수원 왕갈비 숯불구이, 진미통닭 원조 가마솥 통닭, 행궁동 루프탑 브런치',
  localFoodieSecretEn: 'Suwon King Beef Ribs BBQ, Jinmi Traditional Cauldron Fried Chicken, Haenggung Rooftop Brunch',
  localFoodieSecretJa: '水原王カルビ炭火焼き、珍味丸鶏の釜揚げチキン、行宮洞ルーフトップブランチ',
  localFoodieSecretZh: '水原王牛排炭火烤肉、真味铁锅原味炸全鸡、行宫洞景观早午餐',
  transitTip: '지하철 1호선 및 KTX 수원역에서 화성행궁 버스 10분 연결',
  transitTipEn: '10 min bus to Hwaseong Haenggung from Suwon Station (Metro Line 1 / KTX)',
  transitTipJa: '地下鉄1号線・KTX水原駅から華城行宮までバス10分',
  transitTipZh: '地铁1号线及KTX水原站乘公交10分钟即达华城行宫',
  hotelType: 'inland'
});

// 🏛️ Incheon (인천)
registerCity('인천', {
  nameEn: 'Incheon', nameJa: '仁川', nameZh: '仁川',
  badge: '차이나타운 개항장 역사와 송도 미래도시의 글로벌 관문',
  badgeEn: 'Chinatown Open Port History & Songdo International Smart City',
  badgeJa: 'チャイナタウン開港場の歴史と松島未来都市のグローバルゲートウェイ',
  badgeZh: '中华街开港场历史风情与松岛未来智能城市的国际枢纽',
  signatureHighlights: ['차이나타운 & 개항장 거리', '송도 센트럴파크 & 수상택시', '월미도 테마파크', '영종도 을왕리 해변'],
  signatureHighlightsEn: ['Chinatown & Open Port Street', 'Songdo Central Park & Water Taxi', 'Wolmido Theme Park', 'Yeongjongdo Eulwangri Beach'],
  signatureHighlightsJa: ['チャイナタウン＆開港場通り', '松島セントラルパーク＆水上タクシー', '月尾島テーマパーク', '永宗島乙旺里ビーチ'],
  signatureHighlightsZh: ['中华街与开港场历史街区', '松岛中央公园与水上计程车', '月尾岛主题乐园', '永宗岛乙旺里海滩'],
  localFoodieSecret: '원조 공화춘 짜장면, 신포국제시장 닭강정·화덕만두, 송도 한옥마을 불고기',
  localFoodieSecretEn: 'Original Gonghwachun Jajangmyeon, Sinpo Sweet Fried Chicken & Clay-oven Dumplings',
  localFoodieSecretJa: '元祖共和春のチャジャン麺、新浦国際市場のタッカンジョン＆壺焼きマンドゥ',
  localFoodieSecretZh: '元祖共和春炸酱面、新浦国际市场甜脆炸鸡与窑烤包子',
  transitTip: '공항철도 및 수인분당선으로 인천공항과 송도·차이나타운 직통 이동',
  transitTipEn: 'Direct access from Incheon Airport to Songdo & Chinatown via AREX & Suin-Bundang Line',
  transitTipJa: '空港鉄道および水仁・盆唐線で仁川空港から松島・チャイナタウンへ直通移動',
  transitTipZh: '机场快线AREX及水仁盆唐线直达仁川机场、松岛及中华街',
  hotelType: 'coastal'
});

// 🏛️ Daegu (대구)
registerCity('대구', {
  nameEn: 'Daegu', nameJa: '大邱', nameZh: '大邱',
  badge: '서문시장 야시장과 김광석 다시그리기길의 활력 도시',
  badgeEn: 'Vibrant City of Seomun Night Market & Kim Gwang-seok Mural Road',
  badgeJa: '西門市場夜市とキム・グァンソク通りの活気あふれる街',
  badgeZh: '西门市场夜市与金光石路壁画街的活力都市',
  signatureHighlights: ['서문시장 야시장', '김광석 다시그리기길', '앞산전망대 & 케이블카', '동성로 스파크랜드'],
  signatureHighlightsEn: ['Seomun Night Market', 'Kim Gwang-seok Mural Road', 'Apsan Observatory & Cable Car', 'Dongseongno Sparkland'],
  signatureHighlightsJa: ['西門市場夜市', 'キム・グァンソク通り', 'アプ山展望台＆ケーブルカー', '東城路スパークランド'],
  signatureHighlightsZh: ['西门市场夜市', '金光石再起之路壁画街', '前山展望台与缆车', '东城路Sparkland摩天轮'],
  localFoodieSecret: '대구 10미: 뭉티기(생고기), 안지랑 곱창골목 구이, 납작만두, 따로국밥, 동인동 매운 찜갈비',
  localFoodieSecretEn: 'Daegu 10 Flavors: Mungtigi (Raw Beef), Anjirang Grilled Tripe, Flat Dumplings, Spicy Braised Ribs',
  localFoodieSecretJa: '大邱10味：ムンティギ（生肉）、アンジランホルモン焼き、ペッチャクマンドゥ、東仁洞辛口カルビチム',
  localFoodieSecretZh: '大邱十味：鲜生牛肉、安吉郎烤牛小肠、扁饺子、东仁洞辣炖牛排骨',
  transitTip: 'KTX 동대구역에서 지하철 1호선·3호선으로 도심 주요 명소 15분 연결',
  transitTipEn: 'Direct 15-min link from Dongdaegu KTX Station to Downtown via Metro Lines 1 & 3',
  transitTipJa: 'KTX東大邱駅から地下鉄1号線・3号線で市内主要名所まで15分',
  transitTipZh: 'KTX东大邱站乘地铁1号线或3号线15分钟即达市区各主要景点',
  hotelType: 'inland'
});

// 🏛️ Geoje (거제)
registerCity('거제', {
  nameEn: 'Geoje', nameJa: '巨済', nameZh: '巨济',
  badge: '바람의 언덕과 외도 보타니아의 에메랄드빛 해양 휴양지',
  badgeEn: 'Windy Hill & Oedo Botania Emerald Ocean Paradise',
  badgeJa: '風の丘と外島ボタニアのエメラルド色の海洋リゾート',
  badgeZh: '风之丘与外岛Botania海上花园翡翠海岛度假区',
  signatureHighlights: ['바람의 언덕 & 신선대', '외도 보타니아 해상식물원', '거제 파노라마 케이블카', '학동 흑진주 몽돌해변'],
  signatureHighlightsEn: ['Windy Hill & Sinseondae Cliff', 'Oedo Botania Marine Botanical Garden', 'Geoje Panorama Cable Car', 'Hakdong Black Pearl Pebble Beach'],
  signatureHighlightsJa: ['風の丘＆神仙台', '外島ボタニア海上植物園', '巨済パノラマロープウェイ', '鶴洞黒真珠モンドルビーチ'],
  signatureHighlightsZh: ['风之丘与神仙台', '外岛Botania海上植物园', '巨济全景缆车', '鹤洞黑珍珠鹅卵石海滩'],
  localFoodieSecret: '거제 멍게비빔밥, 바람의 핫도그, 굴 코스요리, 성게알 비빔밥, 활어회',
  localFoodieSecretEn: 'Geoje Sea Squirt Bibimbap, Windy Hotdog, Fresh Oyster Feast, Sea Urchin Bibimbap',
  localFoodieSecretJa: '巨済ホヤビビンバ、風のホットドッグ、カキフルコース、ウニビビンバ、活魚刺身',
  localFoodieSecretZh: '巨济海鞘拌饭、风之热狗、鲜蚝全席、海胆拌饭、新鲜活鱼刺身',
  transitTip: '부산 사상/신평에서 거가대교 직행버스로 거제 고현까지 50분 쾌속 진입',
  transitTipEn: 'Direct bus via Geoga Bridge from Busan to Geoje in 50 min',
  transitTipJa: '釜山（沙上／新平）から巨加大橋経由の直行バスで巨済（古県）まで50分',
  transitTipZh: '从釜山沙上或新平乘巨加大桥直通大巴50分钟直达巨济古县',
  hotelType: 'coastal'
});

// 🏛️ Namhae (남해)
registerCity('남해', {
  nameEn: 'Namhae', nameJa: '南海', nameZh: '南海',
  badge: '보리암 절경과 독일마을, 다랭이마을의 보물섬 휴양지',
  badgeEn: 'Boriam Hermitage, German Village & Daraengi Terraces',
  badgeJa: '菩提庵の絶景とドイツ村、タレンイ村の宝島リゾート',
  badgeZh: '菩提庵绝景、德国村与梯田村的海上宝岛度假胜地',
  signatureHighlights: ['보리암 & 금산 산장', '남해 독일마을 & 원예예술촌', '가천 다랭이마을', '상주은모래비치'],
  signatureHighlightsEn: ['Boriam Hermitage & Geumsan Hut', 'German Village & House N Garden', 'Gacheon Daraengi Village', 'Sangju Silver Sand Beach'],
  signatureHighlightsJa: ['菩提庵＆錦山山荘', '南海ドイツ村＆園芸芸術村', '加川タレンイ村', '尚州銀砂ビーチ'],
  signatureHighlightsZh: ['菩提庵与锦山山庄', '南海德国村与园艺艺术村', '加川梯田村', '尚州银沙海滩'],
  localFoodieSecret: '남해 멸치쌈밥 정식 & 멸치회무침, 독일마을 수제 소시지 & 독일 맥주, 유자 빵',
  localFoodieSecretEn: 'Namhae Anchovy Ssambap Set & Raw Anchovy Salad, German Sausages & Beer, Yuzu Bread',
  localFoodieSecretJa: '南海カタクチイワシ包みご飯＆イワシ刺身和え、ドイツ村手作りソーセージ＆ドイツビール、柚子パン',
  localFoodieSecretZh: '南海鳀鱼包饭套餐与凉拌生鳀鱼、德国村手工香肠与德国精酿啤酒、柚子面包',
  transitTip: '진주역 KTX 또는 사천공항에서 남해 방면 직행버스로 40~50분 연결',
  transitTipEn: 'Direct buses from KTX Jinju Station or Sacheon Airport reach Namhae in 40-50 min',
  transitTipJa: '晋州駅（KTX）または泗川空港から南海行き直行バスで40〜50分',
  transitTipZh: '从晋州站（KTX）或泗川机场乘直达大巴40-50分钟可达南海',
  hotelType: 'coastal'
});

// 🏛️ Goesan (괴산)
registerCity('괴산', {
  nameEn: 'Goesan', nameJa: '槐山', nameZh: '槐山',
  badge: '산막이옛길과 화양구곡, 청정 자연이 빚어낸 힐링 쉼터',
  badgeEn: 'Pristine Healing Haven with Sanmangi Trail & Hwayang Valleys',
  badgeJa: 'サンマギイェッキルと華陽九曲、清らかな自然が育んだヒーリングの郷',
  badgeZh: '三幕古道与华阳九曲相映成趣的清幽自然疗愈胜地',
  signatureHighlights: ['산막이옛길', '화양구곡', '괴산자연드림파크', '쌍곡계곡', '각연사'],
  signatureHighlightsEn: ['Sanmangi Old Trail', 'Hwayang Nine Valleys', 'Goesan Natural Dream Park', 'Ssanggok Valley', 'Gakyeonsa Temple'],
  signatureHighlightsJa: ['サンマギイェッキル', '華陽九曲', '槐山自然ドリームパーク', '双谷渓谷', '覚淵寺'],
  signatureHighlightsZh: ['三幕古道', '华阳九曲', '槐山自然梦境乐园', '双谷溪谷', '觉渊寺'],
  localFoodieSecret: '괴산 올갱이국(다슬기 해장국), 고추순대, 버섯전골, 대학찰옥수수',
  localFoodieSecretEn: 'Goesan Marsh Snail Soup (Olgaengi-guk), Chili Sundae, Wild Mushroom Hot Pot, College Sweet Corn',
  localFoodieSecretJa: '槐山オルゲンイクッ（カワニナのスープ）、唐辛子スンデ、キノコ鍋、大学モチトウモロコシ',
  localFoodieSecretZh: '槐山川螺醒酒汤、辣椒米肠、山蘑菇火锅、大学糯玉米',
  transitTip: '중부내륙고속도로 괴산IC 및 증평역 KTX 인접으로 수도권 1시간 30분대 진입',
  transitTipEn: 'Accessible within 1.5 hours from Seoul via Jungbu Naeryuk Expressway & Jeungpyeong Station',
  transitTipJa: '中部内陸高速道路槐山ICおよび曽坪駅隣接により首都圏から1時間30分で到着',
  transitTipZh: '经中部内陆高速槐山IC及曾坪站1.5小时畅达首尔首都圈',
  hotelType: 'inland'
});

// 🏛️ Jecheon (제천)
registerCity('제천', {
  nameEn: 'Jecheon', nameJa: '堤川', nameZh: '堤川',
  badge: '청풍호반과 의림지의 숨결, 자연치유 한방 바이오 도시',
  badgeEn: 'Natural Healing Wellness City with Cheongpung Lake & Uirimji',
  badgeJa: '清風湖畔と義林池の息吹、自然治癒・韓方バイオの街',
  badgeZh: '清风湖畔与义林池相映生辉的自然康养韩方生物之城',
  signatureHighlights: ['청풍호반케이블카', '의림지', '옥순봉출렁다리', '청풍문화재단지', '비봉산전망대', '박달재'],
  signatureHighlightsEn: ['Cheongpung Lake Cable Car', 'Uirimji Reservoir', 'Oksunbong Suspension Bridge', 'Cheongpung Cultural Complex', 'Bibongsan Observatory', 'Bakdaljae Pass'],
  signatureHighlightsJa: ['清風湖畔ケーブルカー', '義林池', '玉筍峰つり橋', '清風文化財団地', '飛鳳山展望台', '朴達峠'],
  signatureHighlightsZh: ['清风湖畔缆车', '义林池水库', '玉笋峰吊桥', '清风文化财团地', '飞凤山展望台', '朴达岘'],
  localFoodieSecret: '제천 빨간오뎅, 약채락 비빔밥, 곤드레밥, 제천 한방 백숙',
  localFoodieSecretEn: 'Jecheon Spicy Red Fish Cakes, Yakchaerak Herbal Bibimbap, Gondre Thistle Rice, Herbal Chicken Soup',
  localFoodieSecretJa: '堤川名物赤オデン、薬菜楽ビビンバ、コンドレ（高麗アザミ）ご飯、韓方丸鶏水炊き',
  localFoodieSecretZh: '堤川特产红辣串鱼饼、药菜乐草本拌饭、山蓟菜饭、韩方滋补炖鸡',
  transitTip: 'KTX-이음으로 청량리역에서 제천역까지 1시간 6분 쾌속 주파',
  transitTipEn: 'Direct 1h 6min ride from Seoul Cheongnyangni to Jecheon via KTX-Eum',
  transitTipJa: 'KTXイウム号でソウル清涼里駅から堤川駅まで1時間6分で直通',
  transitTipZh: '乘KTX-Eum高铁从首尔清凉里站至堤川站仅需1小时06分',
  hotelType: 'inland'
});

// Load all 226 districts list
const ALL_DISTRICTS = [
  // Seoul
  '서울', '종로', '중구', '용산', '성동', '광진', '동대문', '중랑', '성북', '강북', '도봉', '노원', '은평', '서대문', '마포', '양천', '강서', '구로', '금천', '영등포', '동작', '관악', '서초', '강남', '송파', '강동',
  // Busan
  '부산', '중구(부산)', '서구(부산)', '동구(부산)', '영도', '부산진', '동래', '남구(부산)', '북구(부산)', '해운대', '사하', '금정', '강서(부산)', '연제', '수영', '사상', '기장',
  // Daegu
  '대구', '중구(대구)', '동구(대구)', '서구(대구)', '남구(대구)', '북구(대구)', '수성', '달서', '달성', '군위',
  // Incheon
  '인천', '중구(인천)', '동구(인천)', '미추홀', '연수', '남동', '부평', '계양', '서구(인천)', '강화', '옹진',
  // Gwangju
  '광주', '동구(광주)', '서구(광주)', '남구(광주)', '북구(광주)', '광산',
  // Daejeon
  '대전', '동구(대전)', '중구(대전)', '서구(대전)', '유성', '대덕',
  // Ulsan
  '울산', '중구(울산)', '남구(울산)', '동구(울산)', '북구(울산)', '울주',
  // Sejong / Jeju
  '세종', '제주', '서귀포',
  // Gyeonggi
  '수원', '성남', '의정부', '안양', '부천', '광명', '평택', '동두천', '안산', '고양', '과천', '구리', '남양주', '오산', '시흥', '군포', '의왕', '하남', '용인', '파주', '이천', '안성', '김포', '화성', '광주(경기)', '양주', '포천', '여주', '연천', '가평', '양평',
  // Gangwon
  '춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원', '화천', '양구', '인제', '고성(강원)', '양양',
  // Chungbuk
  '청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양',
  // Chungnam
  '천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천', '청양', '홍성', '예산', '태안',
  // Jeonbuk
  '전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안',
  // Jeonnam
  '목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '해남', '영암', '무안', '함평', '영광', '장성', '완도', '진도', '신안',
  // Gyeongbuk
  '포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉', '독도',
  // Gyeongnam
  '창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '남해', '하동', '산청', '함양', '거창', '합천'
];

// Fill all remaining districts with authentic rich fallback structures
for (const dist of ALL_DISTRICTS) {
  if (!CITY_KNOWLEDGE_226[dist]) {
    const isCoastal = /(해변|바다|항|섬|포구|연안|해양|동해|서해|남해|통영|거제|남해|여수|목포|신안|완도|진도|고흥|보성|태안|보령|서천|영덕|울진|포항|울릉|강릉|속초|삼척|양양|기장|영도|사하)/.test(dist);
    registerCity(dist, {
      nameEn: dist,
      nameJa: dist,
      nameZh: dist,
      badge: `${dist} 대표 랜드마크와 로컬 감성의 힐링 여행지`,
      badgeEn: `Discover iconic sights and local healing wonders in ${dist}.`,
      badgeJa: `${dist}の代表的な名所と癒やしの旅`,
      badgeZh: `探寻${dist}代表性名胜与治愈之旅`,
      signatureHighlights: [`${dist} 중앙 문화거리 & 공원`, `${dist} 대표 명승지`, `${dist} 역사문화 유적지`, `${dist} 로컬 전통시장`],
      signatureHighlightsEn: [`${dist} Central Culture Park`, `${dist} Scenic Landmark`, `${dist} Heritage Site`, `${dist} Traditional Market`],
      signatureHighlightsJa: [`${dist}中央文化公園`, `${dist}名勝地`, `${dist}歴史文化遺跡`, `${dist}伝統市場`],
      signatureHighlightsZh: [`${dist}中央文化公园`, `${dist}名胜景区`, `${dist}历史文化遗迹`, `${dist}传统市场`],
      rainyHotspots: [`${dist} 시립박물관`, `${dist} 문화예술회관`, `${dist} 실내 생태체험관`],
      walkingMinimized: [`${dist} 수변 데크로드`, `${dist} 평지 둘레길`, `${dist} 도심 무장애 쉼터`],
      localFoodieSecret: `${dist} 로컬 대표 향토음식 & 전통시장 먹거리`,
      localFoodieSecretEn: `${dist} local specialty cuisine & market street food picks`,
      localFoodieSecretJa: `${dist}の郷土料理と伝統市場の名物グルメ`,
      localFoodieSecretZh: `${dist}地道特色美食与传统市场小吃`,
      transitTip: `${dist} 중심 버스터미널 및 대중교통 거점 연결`,
      transitTipEn: `Accessible via ${dist} Central Bus Terminal & Transit Hub`,
      transitTipJa: `${dist}バスターミナル及び公共交通拠点接続`,
      transitTipZh: `${dist}中心客运站及公共交通枢纽换乘`,
      hotelType: isCoastal ? 'coastal' : 'inland',
      nightHighlights: [{ name: `${dist} 도심 야간 산책로`, type: '야경 명소', desc: `은은한 야경 조명을 따라 걷는 ${dist} 밤마실 명소` }],
      cafeHighlights: [{ name: `${dist} 감성 로컬 카페`, type: '감성 카페', desc: `지역 특산 디저트와 향긋한 스페셜티 커피를 즐기는 쉼터` }],
      signatureHotels: [{ name: `${dist} 대표 호텔 & 리조트`, type: '휴양 스테이', desc: `${dist} 주요 명소와 자연 경관을 누리는 쾌적한 힐링 숙소` }]
    });
  }
}

// 3. Build Full City Q&A List
const allCityQnaList = [];
for (const [cityName, c] of Object.entries(CITY_KNOWLEDGE_226)) {
  const top3Sigs = (c.signatureHighlights || []).slice(0, 3).join(', ');
  const top3SigsEn = (c.signatureHighlightsEn || []).slice(0, 3).join(', ');
  const top3SigsJa = (c.signatureHighlightsJa || []).slice(0, 3).join(', ');
  const top3SigsZh = (c.signatureHighlightsZh || []).slice(0, 3).join(', ');

  const qnaObj = {
    id: `qna_city_${cityName}`,
    category: '지역 핵심 가이드',
    targetCity: cityName,
    nameEn: c.nameEn,
    nameJa: c.nameJa,
    nameZh: c.nameZh,
    badge: c.badge,
    badgeEn: c.badgeEn,
    badgeJa: c.badgeJa,
    badgeZh: c.badgeZh,
    questionVariations: [
      `${cityName} 여행`, `${cityName} 코스`, `${cityName} 가볼만한곳`, `${cityName} 맛집`, `${cityName} 추천`, `${cityName} 2박3일`, `${cityName} 3일`, `${c.nameEn} travel`
    ],
    intentKeywords: [cityName, '여행', '코스', '가볼만한곳', '맛집', '추천', '일정', '가이드', c.nameEn],
    signatureHighlights: c.signatureHighlights,
    signatureHighlightsEn: c.signatureHighlightsEn,
    signatureHighlightsJa: c.signatureHighlightsJa,
    signatureHighlightsZh: c.signatureHighlightsZh,
    rainyHotspots: c.rainyHotspots,
    rainyHotspotsEn: c.rainyHotspotsEn,
    rainyHotspotsJa: c.rainyHotspotsJa,
    rainyHotspotsZh: c.rainyHotspotsZh,
    walkingMinimized: c.walkingMinimized,
    localFoodieSecret: c.localFoodieSecret,
    localFoodieSecretEn: c.localFoodieSecretEn,
    localFoodieSecretJa: c.localFoodieSecretJa,
    localFoodieSecretZh: c.localFoodieSecretZh,
    transitTip: c.transitTip,
    transitTipEn: c.transitTipEn,
    transitTipJa: c.transitTipJa,
    transitTipZh: c.transitTipZh,
    hotelType: c.hotelType,
    nightHighlights: c.nightHighlights,
    nightHighlightsEn: c.nightHighlightsEn,
    nightHighlightsJa: c.nightHighlightsJa,
    nightHighlightsZh: c.nightHighlightsZh,
    cafeHighlights: c.cafeHighlights,
    signatureHotels: c.signatureHotels,
    geminiAnswer: {
      ko: `📍 **[${cityName} ${c.badge}]**\n✨ 대표 명소: ${top3Sigs}\n🍽️ 로컬 미식: ${c.localFoodieSecret}\n🚆 교통: ${c.transitTip}`,
      en: `📍 **[${c.nameEn} Guide]** ${c.badgeEn}\n✨ Highlights: ${top3SigsEn}\n🍽️ Local Food: ${c.localFoodieSecretEn}\n🚆 Transit: ${c.transitTipEn}`,
      ja: `📍 **[${c.nameJa} 旅行ガイド]** ${c.badgeJa}\n✨ おすすめ見どころ: ${top3SigsJa}\n🍽️ ローカルグルメ: ${c.localFoodieSecretJa}\n🚆 アクセス: ${c.transitTipJa}`,
      'zh-CN': `📍 **[${c.nameZh} 旅游指南]** ${c.badgeZh}\n✨ 核心景点: ${top3SigsZh}\n🍽️ 地道美食: ${c.localFoodieSecretZh}\n🚆 交通提示: ${c.transitTipZh}`
    }
  };
  allCityQnaList.push(qnaObj);
}

// 4. Combine QnA: general QnA + 226 City Q&As
const masterPayloadObj = {
  qnaVault: [...existingQnaList, ...allCityQnaList],
  cityKnowledge: CITY_KNOWLEDGE_226
};

// 5. Serialize and Validate JSON
const masterJsonStr = JSON.stringify(masterPayloadObj);
const parsedTest = JSON.parse(masterJsonStr);
console.log(`✅ JSON Validation Passed: ${Object.keys(parsedTest.cityKnowledge).length} cities, ${parsedTest.qnaVault.length} Q&A items`);

// 6. Encrypt and write to src/data/voraQnaVault.js
const encryptedPayload = encryptVoraPayload(masterJsonStr);

const outputJs = `/**
 * VORA AI 22.0 - Unified Single Master Encrypted Vault (All 226 Nationwide Cities & QnA)
 * Total Registered Cities: ${Object.keys(CITY_KNOWLEDGE_226).length}
 * Total Q&A Items: ${masterPayloadObj.qnaVault.length}
 */

import { decryptVoraPayload, encryptVoraPayload } from '../utils/voraCrypto.js';

export const VORA_ENCRYPTED_VAULT_PAYLOAD = "${encryptedPayload}";

let _cachedMaster = null;

function _getMasterPayload() {
  if (_cachedMaster) return _cachedMaster;
  try {
    const jsonStr = decryptVoraPayload(VORA_ENCRYPTED_VAULT_PAYLOAD);
    if (jsonStr) {
      _cachedMaster = JSON.parse(jsonStr);
      return _cachedMaster;
    }
  } catch (e) {
    console.error('Failed to parse master encrypted vault:', e);
  }
  _cachedMaster = { qnaVault: [], cityKnowledge: {} };
  return _cachedMaster;
}

export function getVoraQnaVault() {
  return _getMasterPayload().qnaVault || [];
}

export function getVaultCityLocalKnowledge() {
  return _getMasterPayload().cityKnowledge || {};
}

export const VORA_QNA_VAULT = new Proxy([], {
  get(target, prop) {
    const vault = getVoraQnaVault();
    if (prop === 'length') return vault.length;
    if (prop === Symbol.iterator) return vault[Symbol.iterator].bind(vault);
    if (typeof vault[prop] === 'function') return vault[prop].bind(vault);
    return vault[prop];
  }
});

export const CITY_LOCAL_KNOWLEDGE = new Proxy({}, {
  get(target, prop) {
    const cities = getVaultCityLocalKnowledge();
    if (prop === 'keys' || prop === Symbol.iterator) return Object.keys(cities);
    return cities[prop];
  },
  has(target, prop) {
    const cities = getVaultCityLocalKnowledge();
    return prop in cities;
  },
  ownKeys(target) {
    const cities = getVaultCityLocalKnowledge();
    return Object.keys(cities);
  },
  getOwnPropertyDescriptor(target, prop) {
    const cities = getVaultCityLocalKnowledge();
    if (prop in cities) {
      return { enumerable: true, configurable: true, value: cities[prop] };
    }
    return undefined;
  }
});
`;

fs.writeFileSync(vaultPath, outputJs, 'utf-8');
console.log(`🚀 SUCCESS: Unified and encrypted ${Object.keys(CITY_KNOWLEDGE_226).length} cities into ${vaultPath} (Encrypted size: ${encryptedPayload.length} chars)`);
