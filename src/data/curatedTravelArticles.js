/**
 * curatedTravelArticles.js - 4-Language Editorial Travel Magazine & Landmark Guides
 * 
 * Provides high-value authentic travel content for international visitors and search crawlers.
 * Supports: KO, EN, JA, ZH (Simplified / Traditional).
 */

export const CURATED_ARTICLES = [
  {
    id: 'art_seoul_palaces',
    category: {
      ko: '🏛️ 헤리티지 & 한옥',
      en: '🏛️ Heritage & Hanok',
      ja: '🏛️ 歴史遺産＆韓屋',
      zh: '🏛️ 历史古迹·韩屋'
    },
    titles: {
      ko: '서울의 시간 여행: 5대 궁궐과 북촌 한옥마을 완벽 탐방기',
      en: 'Time Travel in Seoul: Complete Guide to the 5 Royal Palaces & Bukchon Hanok',
      ja: 'ソウルの時空旅行：五大王宮と北村韓屋村の完全ガイド',
      zh: '首尔时空漫游：五大古宫与北村韩屋村深度探秘指南'
    },
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1546874177-9e664107314e?w=700&auto=format&fit=crop&q=80',
    summary: {
      ko: '조선 왕조의 웅장한 정궁 경복궁부터 유네스코 세계유산 창덕궁 후원(비원), 그리고 돌담길 감성이 살아있는 북촌 한옥마을의 전통 찻집 팁을 만나보세요.',
      en: 'Discover Gyeongbokgung, the grand main palace of the Joseon Dynasty, the UNESCO Secret Garden of Changdeokgung, and authentic teahouses along the alleys of Bukchon Hanok Village.',
      ja: '朝鮮王朝の威容を誇る景福宮から、世界遺産・昌徳宮の秘密の庭園（秘苑）、そして石畳の風情ある北村韓屋村の伝統茶屋まで徹底紹介。',
      zh: '领略朝鲜王朝正宫景福宫的恢弘气势、联合国教科文组织世界遗产昌德宫后苑的静谧雅致，漫步北村韩屋村的古朴石墙古巷与传统茶屋。'
    },
    highlights: [
      { ko: '한복 착용 시 4대 궁 무료 입장 팁', en: 'Free palace entry when wearing traditional Hanbok', ja: '韓服着用で王宮無料入場の特典', zh: '身着传统韩服可免费入宫参观' },
      { ko: '창덕궁 후원(비원) 사전 예약 가이드', en: 'Changdeokgung Secret Garden booking advice', ja: '昌徳宮秘苑の事前予約のコツ', zh: '昌德宫后苑中文讲解预约指南' }
    ]
  },

  {
    id: 'art_busan_ocean',
    category: {
      ko: '🌊 오션뷰 & 힐링',
      en: '🌊 Ocean View & Coastal',
      ja: '🌊 オーシャンビュー＆海岸',
      zh: '🌊 海景疗愈·海滨步道'
    },
    titles: {
      ko: '부산 푸른 바다를 달리는 해운대 블루라인파크 & 광안대교 야경',
      en: 'Coastal Bliss in Busan: Haeundae Blueline Park & Gwangalli Night View',
      ja: '釜山の青い海を駆ける：海雲台ブルーラインパークと広安大橋の夜景',
      zh: '奔赴釜山碧海：海云台蓝线公园海岸列车与广安大桥璀璨夜景'
    },
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=700&auto=format&fit=crop&q=80',
    summary: {
      ko: '동해 남부선 옛 철길을 따라 해변 열차와 스카이캡슐을 타고 달리는 해안 절경, 그리고 광안리 해변에서 펼쳐지는 주말 드론 라이트쇼의 감동을 소개합니다.',
      en: 'Ride colorful Sky Capsules along the cliffside coastline of Haeundae and enjoy the dazzling weekend Drone Light Show over the sparkling waters of Gwangalli Beach.',
      ja: '海雲台の海岸線沿いをカラフルなスカイカプセルで巡る絶景ルートと、広安里ビーチで毎週開催される幻想的なドローンショーの見どころ。',
      zh: '乘坐色彩斑斓的空中胶囊列车沿着海云台壮丽海岸线前行，并在广安里海水浴场欣赏震撼的周末无人机灯光秀。'
    },
    highlights: [
      { ko: '청사포 다릿돌전망대 스카이워크', en: 'Cheongsapo Daritdol Skywalk viewpoint', ja: '青沙浦タリットル展望台', zh: '青沙浦踏石观景台玻璃步道' },
      { ko: '매주 토요일 광안리 드론쇼 명당', en: 'Best spot for Gwangalli Saturday Drone Show', ja: '広安里土曜ドローンショーおすすめ観覧席', zh: '广安里周六无人机灯光秀最佳观景点' }
    ]
  },

  {
    id: 'art_kfood_nightmarket',
    category: {
      ko: '🍴 로컬 미식 & 마켓',
      en: '🍴 Local Foodie & Markets',
      ja: '🍴 グルメ＆夜市',
      zh: '🍴 地道美食·夜市风情'
    },
    titles: {
      ko: '외국인이 가장 열광하는 K-스트리트 푸드: 광장시장 & 성수동 카페 투어',
      en: 'The Ultimate K-Street Food Odyssey: Gwangjang Market & Seongsu Cafe Street',
      ja: '世界の旅人が熱狂するK-フード：広蔵市場と聖水洞カフェめぐり',
      zh: '征服全球味蕾的韩国街头美食：广藏市场小吃街与圣水洞潮流咖啡地图'
    },
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=700&auto=format&fit=crop&q=80',
    summary: {
      ko: '바삭한 빈대떡과 마약김밥, 신선한 육회 탕탕이의 성지 광장시장부터 힙스터들의 성지 성수동 디저트 카페까지 놓칠 수 없는 K-미식을 안내합니다.',
      en: 'Taste crispy bindaetteok (mungbean pancakes), hand-rolled kimbap, and fresh beef tartare at Gwangjang Market, followed by artisanal bakery cafes in hipster Seongsu-dong.',
      ja: '香ばしい緑豆チヂミや麻薬キンパ、新鮮なユッケが名物の広蔵市場から、MZ世代に大人気の聖水洞ベーカリーカフェまで満喫する美食の旅。',
      zh: '从广藏市场香脆的绿豆煎饼、一口麻药紫菜包饭与新鲜生牛肉，到首尔年轻人最爱的圣水洞工业风烘焙甜品店，开启全方位美食之旅。'
    },
    highlights: [
      { ko: '광장시장 필수 주문 메뉴 가이드', en: 'Top must-order dishes at Gwangjang Market', ja: '広蔵市場のマスト注文メニュー', zh: '广藏市场必吃经典特色美食清单' },
      { ko: '성수동 감성 팩토리 베이커리 팁', en: 'Trending industrial bakery cafes in Seongsu', ja: '聖水洞の映えカフェ巡り', zh: '圣水洞最出片的宝藏复古咖啡馆' }
    ]
  }
];
