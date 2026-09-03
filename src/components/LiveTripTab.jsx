import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sun, 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  CloudRain, 
  Camera, 
  Navigation, 
  ExternalLink, 
  Info,
  X,
  MapPin,
  Star
} from 'lucide-react';
import { getGooglePlaceSearchUrl } from '../services/geminiNlpService';
import { CITY_LOCAL_KNOWLEDGE } from '../data/voraDialogKnowledge';
import { getLocalizedCityName } from '../i18n/translations';

// 🌟 [Universal Pipeline] 도시별 기본 다음 목적지 4개국어 생성기
function getDefaultNextSpotForCity(targetCity = '서울', lang = 'ko') {
  const clean = (targetCity || '').replace(/^(대한민국|한국)\s*/, '').trim();
  const c = clean.toLowerCase();

  if (c.includes('부산') || c.includes('busan')) {
    return {
      id: 'live-default-next-busan',
      title: lang === 'en' ? 'Haeundae Blueline Park & Sky Capsule' : lang === 'ja' ? '海雲台ブルーラインパーク＆スカイカプセル' : (lang === 'zh' || lang === 'zht') ? '海云台蓝线公园与天空胶囊' : '해운대 블루라인파크 & 스카이캡슐',
      name: '해운대 블루라인파크',
      addr1: '부산광역시 해운대구 청사포로 116',
      description: lang === 'en' ? 'Panoramic coastal cliff train along the East Sea with vibrant aerial capsules.' : lang === 'ja' ? '海岸断崖の上を走るカラフルな空中カプセルと東海パノラマビュー。' : (lang === 'zh' || lang === 'zht') ? '行驶在东海海岸悬崖之上的色彩缤纷高空胶囊观光列车。' : '동해남부선 폐선 부지 해안 절벽 위를 달리는 알록달록 공중 캡슐 열차와 해안 산책로입니다.',
      transitTime: lang === 'en' ? 'Accessible via Subway & Local Bus' : lang === 'ja' ? '地下鉄・市内バスで便利に移動' : (lang === 'zh' || lang === 'zht') ? '乘坐地铁或市内公交便捷前往' : '지하철 및 시내버스로 편리하게 이동'
    };
  }
  if (c.includes('제주') || c.includes('jeju')) {
    return {
      id: 'live-default-next-jeju',
      title: lang === 'en' ? 'Seongsan Ilchulbong & Gwangchigi Beach' : lang === 'ja' ? '城山日出峰＆広峙基海岸' : (lang === 'zh' || lang === 'zht') ? '城山日出峰与广峙其海滩' : '성산일출봉 & 광치기해변',
      name: '성산일출봉',
      addr1: '제주특별자치도 서귀포시 성산읍 일출로 284-12',
      description: lang === 'en' ? 'UNESCO World Heritage volcanic tuff cone rising directly above the azure ocean.' : lang === 'ja' ? 'ユネスコ世界自然遺産、青い海の上にそびえ立つ雄大な火山噴火口。' : (lang === 'zh' || lang === 'zht') ? '联合国教科文组织世界自然遗产，巍然耸立于碧海之上的火山熔岩地貌。' : '푸른 바다 위로 웅장하게 솟아오른 유네스코 세계자연유산이자 제주의 대표 일출 랜드마크입니다.',
      transitTime: lang === 'en' ? 'Accessible via Jeju Express Bus / Rental Car' : lang === 'ja' ? '急行バス・レンタカーで快適に移動' : (lang === 'zh' || lang === 'zht') ? '乘坐急行公交或自驾租车便捷前往' : '급행버스 또는 렌터카로 편리하게 이동'
    };
  }
  if (c.includes('경주') || c.includes('gyeongju')) {
    return {
      id: 'live-default-next-gyeongju',
      title: lang === 'en' ? 'Hwangridan-gil & Daereungwon Ancient Tombs' : lang === 'ja' ? '皇理団通り＆大陵苑古墳群' : (lang === 'zh' || lang === 'zht') ? '皇理团路与大陵苑古坟群' : '황리단길 & 대릉원 고분군',
      name: '대릉원 & 황리단길',
      addr1: '경상북도 경주시 계림로 9',
      description: lang === 'en' ? 'Charming historic Hanok cafes and thousands of years of Silla royal heritage.' : lang === 'ja' ? '風情ある韓屋カフェと千年の新羅王族の歴史が息づく王宮ストリート。' : (lang === 'zh' || lang === 'zht') ? '古色古香的韩屋咖啡街与千年轻罗王室历史遗迹。' : '천년 신라의 고분과 트렌디한 한옥 카페, 감성 소품샵이 어우러진 경주 대표 핫플레이스입니다.',
      transitTime: lang === 'en' ? 'Approx. 10 mins walk from Gyeongju Express Terminal' : lang === 'ja' ? '慶州バスターミナルから徒歩10分' : (lang === 'zh' || lang === 'zht') ? '距庆州长途汽车站步行约10分钟' : '경주고속버스터미널에서 도보 10분'
    };
  }
  if (c.includes('강릉') || c.includes('gangneung')) {
    return {
      id: 'live-default-next-gangneung',
      title: lang === 'en' ? 'Anmok Beach Coffee Street & Songjeong Pine Forest' : lang === 'ja' ? '安木海辺コーヒー通り＆松亭松林' : (lang === 'zh' || lang === 'zht') ? '安木海边咖啡一条街与松亭松林' : '안목해변 커피거리 & 송정솔밭',
      name: '안목해변 커피거리',
      addr1: '강원특별자치도 강릉시 창해로 14번길 20-1',
      description: lang === 'en' ? 'Specialty hand-drip oceanfront cafes overlooking the crystal-clear East Sea.' : lang === 'ja' ? 'どこまでも広がる澄んだ東海を眺めながら楽しむスペシャルティコーヒー通り。' : (lang === 'zh' || lang === 'zht') ? '面朝清澈东海、聚集众多手冲精品咖啡馆的浪漫海滨名街。' : '시원한 동해 바다를 마주보며 향긋한 스페셜티 커피와 디저트를 즐기는 강릉의 대표 커피 명소입니다.',
      transitTime: lang === 'en' ? 'Approx. 15 mins by bus from Gangneung Station' : lang === 'ja' ? '江陵駅から市内バスで約15分' : (lang === 'zh' || lang === 'zht') ? '从江陵站乘坐市内公交约15分钟' : '강릉역에서 시내버스로 15분'
    };
  }
  if (c.includes('수원') || c.includes('suwon')) {
    return {
      id: 'live-default-next-suwon',
      title: lang === 'en' ? 'Hwaseong Haenggung & Banghwasuryujeong Lake' : lang === 'ja' ? '華城行宮＆訪花随柳亭' : (lang === 'zh' || lang === 'zht') ? '华城行宫与访花随柳亭' : '화성행궁 & 방화수류정',
      name: '화성행궁 & 방화수류정',
      addr1: '경기도 수원시 팔달구 정조로 825',
      description: lang === 'en' ? 'UNESCO World Heritage fortress palace and the serene Dragon Pond pavilion.' : lang === 'ja' ? 'ユネスコ世界文化遺産・水原華城と池に映る優雅な東屋の絶景。' : (lang === 'zh' || lang === 'zht') ? '联合国教科文组织世界文化遗产水原华城与倒映在龙渊之上的雅致亭阁。' : '조선 정조대왕의 효심과 개혁정신이 깃든 유서 깊은 행궁과 그림 같은 용연 연못 정자입니다.',
      transitTime: lang === 'en' ? 'Approx. 10 mins by bus from Suwon Station' : lang === 'ja' ? '水原駅から市内バスで約10分' : (lang === 'zh' || lang === 'zht') ? '从水原站乘坐市内公交约10分钟' : '수원역에서 시내버스로 10분'
    };
  }

  // 기본 서울 핫플
  return {
    id: 'live-default-next-seoul',
    title: lang === 'en' ? 'Insadong Ssamzigil & Traditional Teahouses' : lang === 'ja' ? '仁寺洞サムジギル＆伝統茶屋' : (lang === 'zh' || lang === 'zht') ? '仁寺洞人人街与传统茶馆' : '인사동 쌈지길 & 전통찻집',
    name: '인사동 쌈지길',
    addr1: '서울특별시 종로구 인사동길 44',
    description: lang === 'en' ? 'Atmospheric craft workshops and cozy traditional teahouses along spiraling alleys.' : lang === 'ja' ? 'らせん状の小道沿いに可愛い工芸品店と伝統茶屋が並ぶソウルの文化ストリート。' : (lang === 'zh' || lang === 'zht') ? '沿螺旋通道错落分布的精致传统手工艺品店与静谧传统茶馆。' : '나선형 계단을 따라 아기자기한 공예품점과 전통 찻집이 늘어선 서울의 대표적인 전통 문화 예술 거리입니다.',
    transitTime: lang === 'en' ? 'Accessible via Subway Line 3 (Anguk Stn)' : lang === 'ja' ? '地下鉄3号線 安国駅から徒歩5分' : (lang === 'zh' || lang === 'zht') ? '乘坐地铁3号线安国站步行5分钟' : '지하철 3호선 안국역에서 도보 5분'
  };
}

// 🌟 [Universal Pipeline] 도시별 맞춤형 4대 실시간 핫플(카페/맛집/실내/포토존) 생성 엔진
function getNearbyActionsForCity(targetCity = '서울', lang = 'ko') {
  const clean = (targetCity || '').replace(/^(대한민국|한국)\s*/, '').trim();
  const c = clean.toLowerCase();

  const cafeLabel = lang === 'en' ? 'Trendy Local Cafes' : lang === 'ja' ? '周辺のおしゃれカフェ' : (lang === 'zh' || lang === 'zht') ? '周边人气咖啡馆' : '주변 감성 카페';
  const foodLabel = lang === 'en' ? 'Authentic Local Food' : lang === 'ja' ? '地元で人気の名店' : (lang === 'zh' || lang === 'zht') ? '当地人追捧的地道美食' : '현지인 인기 맛집';
  const rainLabel = lang === 'en' ? 'Rainy Day Indoor Spots' : lang === 'ja' ? '雨の日の屋内スポット' : (lang === 'zh' || lang === 'zht') ? '雨天精选室内热门地标' : '비 올 때 실내 핫플';
  const photoLabel = lang === 'en' ? 'Best Photo Spots' : lang === 'ja' ? '映え写真フォトスポット' : (lang === 'zh' || lang === 'zht') ? '绝美拍照打卡点' : '인생샷 포토존';

  // 1. 부산 (Busan)
  if (c.includes('부산') || c.includes('busan')) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          {
            name: lang === 'en' ? 'Cafe Diart (Cheongsapo)' : lang === 'ja' ? '青沙浦ディ・アート' : (lang === 'zh' || lang === 'zht') ? '青沙浦Diart咖啡馆' : '청사포 디아트 (Cafe Diart)',
            desc: lang === 'en' ? 'Kaymak dessert & panoramic ocean view' : lang === 'ja' ? 'オーシャンビュー＆名物カイマクデザート' : (lang === 'zh' || lang === 'zht') ? '海景与土耳其卡伊马克甜品名店' : '오션뷰와 부드러운 카이막 디저트 명소',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'MOMOS Coffee Yeongdo' : lang === 'ja' ? '影島モモスコーヒー' : (lang === 'zh' || lang === 'zht') ? '影岛MOMOS咖啡' : '영도 모모스커피 (MOMOS)',
            desc: lang === 'en' ? 'World Barista Champion flagship roastery' : lang === 'ja' ? 'ワールドバリスタ王者の大型ロースタリー' : (lang === 'zh' || lang === 'zht') ? '世界咖啡师冠军旗舰精品烘焙馆' : '월드 바리스타 챔피언의 대형 스페셜티 로스터리',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Waveon Coffee Gijang' : lang === 'ja' ? '機張ウェーブオン' : (lang === 'zh' || lang === 'zht') ? '机张Waveon海景咖啡' : '기장 웨이브온 커피 (Waveon)',
            desc: lang === 'en' ? 'Architectural masterpiece overlooking East Sea' : lang === 'ja' ? '東海の絶景が広がる建築美あふれる名所' : (lang === 'zh' || lang === 'zht') ? '坐拥东海绝美全景建筑艺术地标' : '동해 파노라마 오션뷰와 건축미 랜드마크',
            dist: lang === 'en' ? '7 min bus' : lang === 'ja' ? 'バス7分' : (lang === 'zh' || lang === 'zht') ? '公交7分钟' : '버스 7분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Sonmokseoga Huinnyeoul' : lang === 'ja' ? '白瀬ソンモクソガ' : (lang === 'zh' || lang === 'zht') ? '白险滩手腕书架' : '흰여울 손목서가',
            desc: lang === 'en' ? 'Cozy seaside book cafe and hand-drip coffee' : lang === 'ja' ? '海を望むエモいハンドドリップブックカフェ' : (lang === 'zh' || lang === 'zht') ? '面朝大海的文艺海景手冲书店' : '바다를 마주한 감성 북카페와 핸드드립',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          {
            name: lang === 'en' ? 'Jagalchi Grilled Fish Alley' : lang === 'ja' ? 'チャガルチ焼き魚通り' : (lang === 'zh' || lang === 'zht') ? '札嘎其香煎鱼街' : '자갈치시장 생선구이 골목',
            desc: lang === 'en' ? 'Crispy fresh grilled fish sets and raw sashimi' : lang === 'ja' ? '焼きたての焼き魚定食と新鮮な刺身' : (lang === 'zh' || lang === 'zht') ? '现烤酥脆海鱼套餐与鲜活生鱼片' : '노릇하게 구워낸 신선한 생선구이 백반 & 회',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Haeundae Somunnan Amso Galbi' : lang === 'ja' ? '海雲台有名アムソカルビ' : (lang === 'zh' || lang === 'zht') ? '海云台母牛烤排骨' : '해운대 소문난 암소갈비',
            desc: lang === 'en' ? 'Tender Hanwoo marinated ribs with potato noodles' : lang === 'ja' ? '柔らかい韓牛味付けカルビと名物ジャガイモ麺' : (lang === 'zh' || lang === 'zht') ? '鲜嫩多汁韩牛调味排骨与招牌土豆粉' : '야들야들한 한우 양념갈비와 감자사리 별미',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Millak Raw Fish Town' : lang === 'ja' ? '広安里民楽刺身センター' : (lang === 'zh' || lang === 'zht') ? '广安里民乐水边生鱼片中心' : '광안리 민락회타운',
            desc: lang === 'en' ? 'Live ocean seafood with Gwangan Bridge view' : lang === 'ja' ? '広安大橋の絶景と楽しむ新鮮な活魚刺身' : (lang === 'zh' || lang === 'zht') ? '赏广安大桥夜景品尝鲜活现切刺身' : '광안대교 야경을 바라보며 맛보는 싱싱한 활어회',
            dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Nampo-dong Seed Hotteok & Wandang' : lang === 'ja' ? '南浦洞 種ホットク＆ワンタン' : (lang === 'zh' || lang === 'zht') ? '南浦洞坚果糖饼与暖胃云吞' : '남포동 원조 씨앗호떡 & 18번완당',
            desc: lang === 'en' ? 'Crispy sweet nutty pancakes & 70-year thin soup dumplings' : lang === 'ja' ? '香ばしい種ホットクと70年伝統の極薄ワンタン' : (lang === 'zh' || lang === 'zht') ? '香脆坚果糖饼与70年传统老字号云吞' : '고소한 씨앗호떡과 70년 전통 얇은 피 완당',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          {
            name: lang === 'en' ? 'National Maritime Museum' : lang === 'ja' ? '国立海洋博物館' : (lang === 'zh' || lang === 'zht') ? '韩国国立海洋博物馆' : '국립해양박물관',
            desc: lang === 'en' ? 'Free admission giant cylinder aquarium & media lab' : lang === 'ja' ? '無料観覧の巨大円筒形水族館と海洋メディア館' : (lang === 'zh' || lang === 'zht') ? '免费参观的巨型圆柱水族馆与海洋互动展' : '무료 관람 대형 원통 수족관과 해양 미디어 체험관',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Shinsegae Centum City Spaland' : lang === 'ja' ? 'センタムシティ スパランド' : (lang === 'zh' || lang === 'zht') ? '新世界SpaLand水疗汗蒸' : '신세계 센텀시티 스파랜드',
            desc: lang === 'en' ? 'World-class luxury hot spring and relaxation healing' : lang === 'ja' ? '世界最高峰のラグジュアリー天然温泉・癒し' : (lang === 'zh' || lang === 'zht') ? '世界级高端豪华天然温泉与休闲养生' : '세계적 규모의 럭셔리 도심 천연온천 힐링',
            dist: lang === 'en' ? 'Subway 10 min' : lang === 'ja' ? '地下鉄10分' : (lang === 'zh' || lang === 'zht') ? '地铁10分钟' : '지하철 10분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Busan Museum of Art' : lang === 'ja' ? '釜山市立美術館' : (lang === 'zh' || lang === 'zht') ? '釜山市立美术馆' : '부산시립미술관 & 이우환공간',
            desc: lang === 'en' ? 'Contemporary modern art and minimalist Space Lee Ufan' : lang === 'ja' ? '現代アート展示と静謐な李禹煥空間' : (lang === 'zh' || lang === 'zht') ? '当代现代艺术大展与李禹焕禅意艺术空间' : '현대 미술 기획전과 고요한 이우환 공간',
            dist: lang === 'en' ? 'Subway 12 min' : lang === 'ja' ? '地下鉄12分' : (lang === 'zh' || lang === 'zht') ? '地铁12分钟' : '지하철 12분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Arte Museum Busan' : lang === 'ja' ? 'アルテミュージアム釜山' : (lang === 'zh' || lang === 'zht') ? 'Arte Museum釜山' : '아르떼뮤지엄 부산',
            desc: lang === 'en' ? 'Immersive digital light & sound nature exhibition' : lang === 'ja' ? '光と音で描く没入型デジタルアート展' : (lang === 'zh' || lang === 'zht') ? '光影科技打造的沉浸式新媒体艺术展' : '빛과 소리로 빚어낸 몰입형 실내 미디어아트',
            dist: lang === 'en' ? '15 min bus' : lang === 'ja' ? 'バス15分' : (lang === 'zh' || lang === 'zht') ? '公交15分钟' : '버스 15분',
            rating: 4.8
          }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          {
            name: lang === 'en' ? 'Haeundae Sky Capsule' : lang === 'ja' ? '海雲台 スカイカプセル' : (lang === 'zh' || lang === 'zht') ? '海云台天空胶囊列车' : '해운대 블루라인 스카이캡슐',
            desc: lang === 'en' ? 'Colorful aerial capsule along coastal cliffs' : lang === 'ja' ? '海岸断崖の上を走るカラフルな空中カプセル' : (lang === 'zh' || lang === 'zht') ? '海岸悬崖之上的高空马卡龙观光胶囊' : '해안 절벽 위를 달리는 알록달록 공중 캡슐 열차',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Gamcheon Little Prince' : lang === 'ja' ? '甘川文化村 星の王子さま' : (lang === 'zh' || lang === 'zht') ? '甘川文化村小王子打卡点' : '감천문화마을 어린왕자 포토존',
            desc: lang === 'en' ? 'Pastel terraced village & iconic Little Prince statue' : lang === 'ja' ? 'パステル調の町並みと星の王子さま像' : (lang === 'zh' || lang === 'zht') ? '阶梯式彩色村落与经典小王子背影打卡' : '계단식 파스텔 마을과 어린왕자 뒷모습 포토존',
            dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Huinnyeoul Coastal Tunnel' : lang === 'ja' ? '白瀬文化村 海岸トンネル' : (lang === 'zh' || lang === 'zht') ? '白险滩海岸隧道' : '흰여울 해안터널 포토존',
            desc: lang === 'en' ? 'Cave silhouette frame with shimmering blue ocean' : lang === 'ja' ? '洞窟シルエットの先に広がる青い海' : (lang === 'zh' || lang === 'zht') ? '洞穴剪影框住湛蓝大海的绝美拍照点' : '동굴 실루엣 너머 에메랄드 바다 인생샷 명소',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Gwangalli Beach & Bridge' : lang === 'ja' ? '広安里海水浴場＆広安大橋' : (lang === 'zh' || lang === 'zht') ? '广安里海水浴场与大桥' : '광안리 해수욕장 & 드론쇼',
            desc: lang === 'en' ? 'Gwangandaegyo Bridge night LED lights & drone show' : lang === 'ja' ? '広安大橋のLED夜景と週末ドローンショー' : (lang === 'zh' || lang === 'zht') ? '广安大桥璀璨LED夜景与周末无人机秀' : '광안대교 LED 야경과 주말 드론 라이트쇼',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          }
        ]
      }
    ];
  }

  // 2. 제주 (Jeju)
  if (c.includes('제주') || c.includes('jeju')) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          {
            name: lang === 'en' ? 'Aewol Handam Beach Cafe Street' : lang === 'ja' ? '涯月ハンダムカフェ通り' : (lang === 'zh' || lang === 'zht') ? '涯月汉潭海边咖啡街' : '애월 한담해변 카페거리',
            desc: lang === 'en' ? 'Sunset views & emerald ocean walking trail' : lang === 'ja' ? 'エメラルドグリーンの海と夕日の名所' : (lang === 'zh' || lang === 'zht') ? '绝美夕阳与清澈翡翠色海滨漫步道' : '에메랄드빛 바다 산책로와 환상적인 노을 뷰',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Gujwa Carrot Cake Cafe' : lang === 'ja' ? '旧左にんじんケーキカフェ' : (lang === 'zh' || lang === 'zht') ? '旧左胡萝卜蛋糕咖啡馆' : '구좌 당근케이크 감성카페',
            desc: lang === 'en' ? 'Sweet local Gujwa carrot cake & cozy stone walls' : lang === 'ja' ? '甘い名物人参ケーキと石垣の癒し空間' : (lang === 'zh' || lang === 'zht') ? '香甜地道旧左胡萝卜蛋糕与治愈石墙' : '달콤한 구좌 흙당근 케이크와 돌담 감성',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Seongsan Ocean Bakery' : lang === 'ja' ? '城山オーシャンベーカリー' : (lang === 'zh' || lang === 'zht') ? '城山日出峰海景面包房' : '성산 오션뷰 베이커리',
            desc: lang === 'en' ? 'Fresh pastries with direct Seongsan Ilchulbong view' : lang === 'ja' ? '城山日出峰を一望できる焼きたてパン' : (lang === 'zh' || lang === 'zht') ? '直面城山日出峰的现烤面包咖啡馆' : '성산일출봉을 마주보는 갓 구운 베이커리',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Seogwipo Tangerine Farm Cafe' : lang === 'ja' ? '西帰浦みかん畑カフェ' : (lang === 'zh' || lang === 'zht') ? '西归浦柑橘果园咖啡馆' : '서귀포 귤밭 감성카페',
            desc: lang === 'en' ? 'Picturesque citrus grove and fresh Hallabong juice' : lang === 'ja' ? 'オレンジ色のみかん畑とハルラボンジュース' : (lang === 'zh' || lang === 'zht') ? '橙黄相间的柑橘果园与新鲜汉拿峰果汁' : '주황빛 감귤나무 숲과 상큼한 한라봉 주스',
            dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          {
            name: lang === 'en' ? 'Jeju Charcoal Black Pork' : lang === 'ja' ? '済州黒豚炭火焼き' : (lang === 'zh' || lang === 'zht') ? '济州炭烤黑猪肉' : '제주 흑돼지 근고기 전문점',
            desc: lang === 'en' ? 'Thick juicy grilled pork with savory anchovy sauce' : lang === 'ja' ? '肉厚でジューシーな黒豚とメルジョッの旨味' : (lang === 'zh' || lang === 'zht') ? '厚切鲜嫩多汁黑猪肉与特色银鱼酱' : '두툼한 육즙의 흑돼지 구이와 감칠맛 멜젓',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Jame Guksu (Pork Noodle)' : lang === 'ja' ? '姉妹ククス（豚肉麺）' : (lang === 'zh' || lang === 'zht') ? '姐妹面条（猪肉汤面）' : '자매국수 (고기국수 & 돔베고기)',
            desc: lang === 'en' ? 'Rich pork bone broth noodle & boiled pork slices' : lang === 'ja' ? '濃厚な豚骨スープの麺と柔らかいゆで豚' : (lang === 'zh' || lang === 'zht') ? '浓郁高汤猪肉面与软嫩白切猪肉' : '진하고 구수한 사골 육수 고기국수와 돔베고기',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Jeju Braised Hairtail Set' : lang === 'ja' ? '済州 太刀魚の煮付け' : (lang === 'zh' || lang === 'zht') ? '济州辣炖带鱼套餐' : '제주 통갈치조림 & 전복뚝배기',
            desc: lang === 'en' ? 'Spicy sweet braised hairtail fish and abalones' : lang === 'ja' ? '甘辛いタレの太刀魚の煮付けとアワビ鍋' : (lang === 'zh' || lang === 'zht') ? '鲜辣浓郁整条带鱼锅与滋补鲍鱼汤' : '매콤달콤한 양념의 통갈치조림과 싱싱한 전복',
            dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Dongmun Night Market Street Food' : lang === 'ja' ? '東門夜市 屋台グルメ' : (lang === 'zh' || lang === 'zht') ? '东门传统夜市特色小吃' : '동문재래시장 야시장 먹거리',
            desc: lang === 'en' ? 'Abalone gimbap, redbanded lobster & pork rolls' : lang === 'ja' ? 'アワビ海苔巻き、赤エビ刺身、黒豚焼き' : (lang === 'zh' || lang === 'zht') ? '鲍鱼紫菜包饭、甜虾刺身与黑猪肉卷' : '전복김밥, 달달한 딱새우회, 불쇼 흑돼지말이',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          {
            name: lang === 'en' ? 'Arte Museum Jeju' : lang === 'ja' ? 'アルテミュージアム済州' : (lang === 'zh' || lang === 'zht') ? '济州Arte Museum' : '아르떼뮤지엄 제주',
            desc: lang === 'en' ? 'Sensory immersive digital art in massive speaker factory' : lang === 'ja' ? '圧巻のスケールを誇る没入型デジタルアート' : (lang === 'zh' || lang === 'zht') ? '巨大空间打造的震撼视听沉浸式新媒体展' : '빛과 소리로 만든 웅장한 몰입형 미디어아트',
            dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Bunker de Lumieres' : lang === 'ja' ? '光のバンカー' : (lang === 'zh' || lang === 'zht') ? '光之堡垒' : '빛의 벙커 (Bunker de Lumieres)',
            desc: lang === 'en' ? 'Classic master paintings alive in secret underground bunker' : lang === 'ja' ? '秘密の地下バンカーで出会う巨匠たちの名画' : (lang === 'zh' || lang === 'zht') ? '秘密地下掩体中重现的世界大师经典名画' : '옛 군사 벙커에서 만나는 거장들의 명화 전시',
            dist: lang === 'en' ? '12 min bus' : lang === 'ja' ? 'バス12分' : (lang === 'zh' || lang === 'zht') ? '公交12分钟' : '버스 12분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Aqua Planet Jeju' : lang === 'ja' ? 'アクアプラネット済州' : (lang === 'zh' || lang === 'zht') ? '济州水上星球水族馆' : '아쿠아플라넷 제주',
            desc: lang === 'en' ? 'Asia largest oceanarium with huge main tank' : lang === 'ja' ? 'アジア最大級の超大型水族館' : (lang === 'zh' || lang === 'zht') ? '亚洲超大规模顶级海洋水族馆' : '초대형 메인 수조를 품은 아시아 최대급 수족관',
            dist: lang === 'en' ? '8 min bus' : lang === 'ja' ? 'バス8分' : (lang === 'zh' || lang === 'zht') ? '公交8分钟' : '버스 8분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Osulloc Tea Museum' : lang === 'ja' ? 'オソロック ティーミュージアム' : (lang === 'zh' || lang === 'zht') ? '雪绿茶博物馆' : '오설록 티뮤지엄 & 이니스프리',
            desc: lang === 'en' ? 'Organic green tea plantation & premium matcha treats' : lang === 'ja' ? '緑茶畑とプレミアム抹茶アイス・デザート' : (lang === 'zh' || lang === 'zht') ? '青翠茶园风光与高品质抹茶甜品' : '푸른 유기농 녹차밭과 프리미엄 녹차 디저트',
            dist: lang === 'en' ? '15 min bus' : lang === 'ja' ? 'バス15分' : (lang === 'zh' || lang === 'zht') ? '公交15分钟' : '버스 15분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          {
            name: lang === 'en' ? 'Gwangchigi Beach' : lang === 'ja' ? '広峙基海岸' : (lang === 'zh' || lang === 'zht') ? '广峙其海滩' : '광치기해변 (성산일출봉 뷰)',
            desc: lang === 'en' ? 'Green moss volcanic rocks facing Seongsan peak' : lang === 'ja' ? '緑の苔岩と城山日出峰を背景にした絶景' : (lang === 'zh' || lang === 'zht') ? '绿苔火山岩与城山日出峰相映的绝景' : '초록 이끼 암반 너머 성산일출봉 인생샷',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Hyeopjae Emerald Beach' : lang === 'ja' ? '挟才海水浴場' : (lang === 'zh' || lang === 'zht') ? '挟才海水浴场' : '협재해수욕장 (비양도 뷰)',
            desc: lang === 'en' ? 'Crystal turquoise water and Biyangdo island view' : lang === 'ja' ? '透明なエメラルドの海と飛揚島のパノラマ' : (lang === 'zh' || lang === 'zht') ? '清澈见底的绿松石色海面与飞扬岛全景' : '투명한 옥빛 에메랄드 바다와 비양도 뷰',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Camellia Hill Garden' : lang === 'ja' ? 'カメリアヒル' : (lang === 'zh' || lang === 'zht') ? '山茶花之丘' : '카멜리아힐 동백숲',
            desc: lang === 'en' ? 'Enchanting floral pathways with pink camellia blooms' : lang === 'ja' ? 'ピンクの椿の花咲くロマンチックな散歩道' : (lang === 'zh' || lang === 'zht') ? '浪漫粉红山茶花盛开的唯美森林步道' : '사계절 꽃이 피어나는 낭만적인 동백나무 숲길',
            dist: lang === 'en' ? '8 min bus' : lang === 'ja' ? 'バス8分' : (lang === 'zh' || lang === 'zht') ? '公交8分钟' : '버스 8분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'St. Isidore Cteshphon' : lang === 'ja' ? '聖イシドル牧場' : (lang === 'zh' || lang === 'zht') ? '圣伊始石牧场' : '성이시돌목장 테쉬폰',
            desc: lang === 'en' ? 'Exotic arched architecture and peaceful grassland' : lang === 'ja' ? '異国情緒漂うテュシュポン建築と牧草地' : (lang === 'zh' || lang === 'zht') ? '充满异国风情的特色拱形建筑与辽阔草原' : '이국적인 아치형 테쉬폰 건축물과 푸른 목장',
            dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분',
            rating: 4.7
          }
        ]
      }
    ];
  }

  // 3. 경주 (Gyeongju)
  if (c.includes('경주') || c.includes('gyeongju')) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          {
            name: lang === 'en' ? 'Hwangridan-gil Hanok Cafe' : lang === 'ja' ? '皇理団通り 韓屋カフェ' : (lang === 'zh' || lang === 'zht') ? '皇理团路韩屋咖啡馆' : '황리단길 한옥 감성카페',
            desc: lang === 'en' ? 'Ancient tile roof views with signature Einspanner' : lang === 'ja' ? '伝統的な瓦屋根を望むアインシュペナー' : (lang === 'zh' || lang === 'zht') ? '古朴青瓦屋檐景观与招牌维也纳咖啡' : '고즈넉한 기와 지붕 뷰와 시그니처 아인슈페너',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Gyochon Village Traditional Tea' : lang === 'ja' ? '校村マウル 伝統茶屋' : (lang === 'zh' || lang === 'zht') ? '校村传统茶馆' : '교촌마을 전통 찻집',
            desc: lang === 'en' ? 'Serene tea time in historic Choe clan estate' : lang === 'ja' ? '伝統家屋の縁側で楽しむ香り豊かなお茶' : (lang === 'zh' || lang === 'zht') ? '在历史悠久的崔氏古宅回廊品味清香茗茶' : '고택 툇마루에서 여유롭게 즐기는 향긋한 잎차',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Bomun Lake Terrace Cafe' : lang === 'ja' ? '普門湖 テラスカフェ' : (lang === 'zh' || lang === 'zht') ? '普门湖畔露台景观咖啡' : '보문호수 오션뷰 카페',
            desc: lang === 'en' ? 'Peaceful lakeside terrace with cherry blossom views' : lang === 'ja' ? '静かな湖畔と桜を望む広々としたテラス' : (lang === 'zh' || lang === 'zht') ? '坐赏静谧湖畔与四季花景的开阔露台' : '탁 트인 잔잔한 호수를 내려다보는 대형 테라스',
            dist: lang === 'en' ? '6 min bus' : lang === 'ja' ? 'バス6分' : (lang === 'zh' || lang === 'zht') ? '公交6分钟' : '버스 6분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Cheomseongdae Rooftop View Cafe' : lang === 'ja' ? '瞻星台 ルーフトップカフェ' : (lang === 'zh' || lang === 'zht') ? '瞻星台夜景露台咖啡' : '첨성대 뷰 루프탑 카페',
            desc: lang === 'en' ? 'Observatory silhouette and sunset over royal tombs' : lang === 'ja' ? '瞻星台と王陵の美しい夕日を一望' : (lang === 'zh' || lang === 'zht') ? '俯瞰瞻星台剪影与古坟壮丽日落' : '첨성대와 고분군 너머 붉은 노을이 보이는 명소',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          {
            name: lang === 'en' ? 'Hwangridan-gil 10-Won Bread' : lang === 'ja' ? '皇理団通り 10ウォンパン' : (lang === 'zh' || lang === 'zht') ? '皇理团路10韩元芝士饼' : '황리단길 원조 10원빵',
            desc: lang === 'en' ? 'Melted stretchy cheese in nostalgic coin waffle' : lang === 'ja' ? 'モッツァレラチーズがたっぷり伸びる名物おやつ' : (lang === 'zh' || lang === 'zht') ? '拉丝芝士满满的庆州代表性铜板点心' : '모짜렐라 치즈가 길게 늘어나는 경주 필수 간식',
            dist: lang === 'en' ? '2 min walk' : lang === 'ja' ? '徒歩2分' : (lang === 'zh' || lang === 'zht') ? '步行2分钟' : '도보 2분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Gyori Gimbap Head Store' : lang === 'ja' ? '校里キンパ 本店' : (lang === 'zh' || lang === 'zht') ? '校里紫菜包饭总店' : '교리김밥 본점',
            desc: lang === 'en' ? 'Famous soft egg ribbons filling signature gimbap' : lang === 'ja' ? 'ふわふわの薄焼き卵がぎっしり詰まったキンパ' : (lang === 'zh' || lang === 'zht') ? '裹满蓬松嫩滑鸡蛋丝的名物紫菜包饭' : '포슬포슬한 계란지단이 가득 찬 전국 3대 김밥',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Hwangnam Mill Tofu Hot Pot' : lang === 'ja' ? '皇南スンドゥブ' : (lang === 'zh' || lang === 'zht') ? '皇南石磨嫩豆腐锅' : '황남맷돌순두부',
            desc: lang === 'en' ? 'Authentic 100% Korean stone-ground soft tofu stew' : lang === 'ja' ? '100%国産大豆で作る香ばしい手作りスンドゥブ' : (lang === 'zh' || lang === 'zht') ? '纯正大豆现磨石磨浓郁嫩豆腐汤' : '100% 국산콩으로 맷돌에 갈아 만든 고소한 순두부',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Gyeongju Tteokgalbi Rice Set' : lang === 'ja' ? '慶州トッカルビ定食' : (lang === 'zh' || lang === 'zht') ? '庆州炭烤牛肉饼套餐' : '경주 떡갈비 쌈밥 정식',
            desc: lang === 'en' ? 'Juicy grilled minced beef patties with rich side dishes' : lang === 'ja' ? '肉汁あふれる炭火焼きトッカルビと豊かなおかず' : (lang === 'zh' || lang === 'zht') ? '炭香四溢多汁牛肉饼与丰盛包饭菜' : '숯불향 가득한 부드러운 떡갈비와 푸짐한 쌈채소',
            dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          {
            name: lang === 'en' ? 'Gyeongju National Museum' : lang === 'ja' ? '国立慶州博物館' : (lang === 'zh' || lang === 'zht') ? '国立庆州博物馆' : '국립경주박물관 & 신라미소관',
            desc: lang === 'en' ? 'Free admission Golden Crown of Silla & Divine Bell' : lang === 'ja' ? '国宝の新羅金冠とエミレの鐘（入場無料）' : (lang === 'zh' || lang === 'zht') ? '免费参观新罗纯金金冠与圣德大王神钟' : '국보 신라 금관과 천년의 소리 성덕대왕신종',
            dist: lang === 'en' ? '5 min bus' : lang === 'ja' ? 'バス5分' : (lang === 'zh' || lang === 'zht') ? '公交5分钟' : '버스 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Solgeo Art Museum' : lang === 'ja' ? 'ソルゴ美術館' : (lang === 'zh' || lang === 'zht') ? '率居美术馆' : '경주 엑스포 솔거미술관',
            desc: lang === 'en' ? 'Scenic window pond frame and modern Korean ink art' : lang === 'ja' ? '窓越しに見る池の絶景と現代韓国画' : (lang === 'zh' || lang === 'zht') ? '画框窗景倒映莲池与当代水墨名作' : '창문 프레임 너머 연못이 그림 같은 힐링 미술관',
            dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Wooyang Museum of Art' : lang === 'ja' ? 'ウヤン美術館' : (lang === 'zh' || lang === 'zht') ? '宇洋当代美术馆' : '우양미술관',
            desc: lang === 'en' ? 'World-class modern art exhibitions in Bomun Resort' : lang === 'ja' ? '普門リゾート内の世界的な現代アート特別展' : (lang === 'zh' || lang === 'zht') ? '普门度假区内举办的世界级现代艺术特展' : '보문관광단지 내 세계적 수준의 현대미술 전시',
            dist: lang === 'en' ? '8 min bus' : lang === 'ja' ? 'バス8分' : (lang === 'zh' || lang === 'zht') ? '公交8分钟' : '버스 8분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Gyeongju Kidult Museum' : lang === 'ja' ? '慶州キダルトミュージアム' : (lang === 'zh' || lang === 'zht') ? '庆州Kidult玩具博物馆' : '경주 키덜트뮤지엄',
            desc: lang === 'en' ? 'Retro vintage toys, collectibles and pop culture' : lang === 'ja' ? '懐かしいレトロ玩具とフィギュアの展示' : (lang === 'zh' || lang === 'zht') ? '怀旧复古玩具与经典手办潮流展' : '추억의 빈티지 장난감과 피규어 감성 박물관',
            dist: lang === 'en' ? '12 min bus' : lang === 'ja' ? 'バス12分' : (lang === 'zh' || lang === 'zht') ? '公交12分钟' : '버스 12분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          {
            name: lang === 'en' ? 'Donggung Palace & Wolji Pond' : lang === 'ja' ? '東宮と月池（アナプチ）夜景' : (lang === 'zh' || lang === 'zht') ? '东宫与月池（雁鸭池）夜景' : '동궁과 월지 (안압지) 달빛 야경',
            desc: lang === 'en' ? 'Magical water reflection of Silla royal night palace' : lang === 'ja' ? '水面に映る幻想的な新羅の別宮夜景' : (lang === 'zh' || lang === 'zht') ? '倒映在碧水之上的梦幻新罗王宫夜景' : '잔잔한 물 위에 반사되는 환상적인 천년 야경',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Daereungwon Ancient Tomb Photo Spot' : lang === 'ja' ? '大陵苑 古墳フォトゾーン' : (lang === 'zh' || lang === 'zht') ? '大陵苑古坟经典打卡点' : '대릉원 목련 포토존',
            desc: lang === 'en' ? 'Iconic standalone tree framed by massive royal hills' : lang === 'ja' ? '巨大な古墳の間に佇むモクレンの木' : (lang === 'zh' || lang === 'zht') ? '伫立于宏伟古坟之间的标志性木兰树打卡点' : '거대한 고분 사이에 서서 찍는 경주 최고의 인생샷',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Cheomseongdae Pink Muhly Field' : lang === 'ja' ? '瞻星台 ピンクミューリー花畑' : (lang === 'zh' || lang === 'zht') ? '瞻星台粉黛乱子草花海' : '첨성대 핑크뮬리 꽃단지',
            desc: lang === 'en' ? 'Dreamy pink grass waving around the ancient stone tower' : lang === 'ja' ? '古代の天文台を彩るピンクの幻想的な花畑' : (lang === 'zh' || lang === 'zht') ? '环绕古老天文台的粉色梦幻浪漫花海' : '동양 최고 천문대 주변을 수놓은 분홍빛 꽃물결',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Bulguksa Cheongungyo & Baegungyo' : lang === 'ja' ? '仏国寺 青雲橋・白雲橋' : (lang === 'zh' || lang === 'zht') ? '佛国寺青云桥与白云桥' : '불국사 청운교 백운교',
            desc: lang === 'en' ? 'UNESCO World Heritage majestic stone bridge stairway' : lang === 'ja' ? 'ユネスコ世界文化遺産 壮麗な石橋と階段' : (lang === 'zh' || lang === 'zht') ? '联合国教科文组织世界遗产壮丽石阶古桥' : '유네스코 세계문화유산 웅장한 신라 석조 예술',
            dist: lang === 'en' ? '15 min bus' : lang === 'ja' ? 'バス15分' : (lang === 'zh' || lang === 'zht') ? '公交15分钟' : '버스 15분',
            rating: 4.9
          }
        ]
      }
    ];
  }

  // 4. 강릉 (Gangneung)
  if (c.includes('강릉') || c.includes('gangneung')) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          {
            name: lang === 'en' ? 'Anmok Beach Coffee Street' : lang === 'ja' ? '安木海辺コーヒー通り' : (lang === 'zh' || lang === 'zht') ? '安木海边咖啡街' : '안목해변 커피거리',
            desc: lang === 'en' ? 'Oceanfront specialty hand-drip roasting cafes' : lang === 'ja' ? '海を見下ろすスペシャルティコーヒーの聖地' : (lang === 'zh' || lang === 'zht') ? '面朝大海的精品手冲现烘咖啡一条街' : '푸른 동해 바다를 바라보며 즐기는 핸드드립 커피',
            dist: lang === 'en' ? '2 min walk' : lang === 'ja' ? '徒歩2分' : (lang === 'zh' || lang === 'zht') ? '步行2分钟' : '도보 2분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Terarosa Coffee Factory' : lang === 'ja' ? 'テラロサ コーヒー工場' : (lang === 'zh' || lang === 'zht') ? 'Terarosa咖啡工厂' : '테라로사 커피공장 본점',
            desc: lang === 'en' ? 'Forest brick architecture & world single-origin beans' : lang === 'ja' ? '森の中の赤レンガ建築と最高級シングルオリジン' : (lang === 'zh' || lang === 'zht') ? '森林红砖建筑与世界顶级单一产区咖啡' : '숲속 붉은 벽돌 건물과 전 세계 스페셜티 원두',
            dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Cafe Toetmaru' : lang === 'ja' ? 'カフェ トゥンマル' : (lang === 'zh' || lang === 'zht') ? '툇마루黑芝麻拿铁' : '카페 툇마루 (흑임자라떼)',
            desc: lang === 'en' ? 'Famous savory nutty black sesame cream coffee' : lang === 'ja' ? '濃厚で香ばしい元祖黒ごまラテ' : (lang === 'zh' || lang === 'zht') ? '浓郁香醇的正宗招牌黑芝麻奶油拿铁' : '고소하고 진한 크림의 원조 흑임자 커피',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Sacheon Beach Ocean Cafe' : lang === 'ja' ? '沙川オーシャンカフェ' : (lang === 'zh' || lang === 'zht') ? '沙川海景咖啡馆' : '사천해변 감성 오션카페',
            desc: lang === 'en' ? 'Quiet sandy beach view and glass photo stairway' : lang === 'ja' ? '静かなビーチと天国の階段フォトゾーン' : (lang === 'zh' || lang === 'zht') ? '静谧沙滩海景与网红天梯拍照点' : '한적한 바다와 천국의 계단 포토존이 있는 테라스',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          {
            name: lang === 'en' ? 'Chodang Soft Tofu Village' : lang === 'ja' ? '草堂スンドゥブ村' : (lang === 'zh' || lang === 'zht') ? '草堂嫩豆腐村' : '초당 순두부마을 (짬뽕순두부)',
            desc: lang === 'en' ? 'Tofu made with East Sea water & spicy seafood jjamppong' : lang === 'ja' ? '東海の海水で作るふわふわ豆腐と海鮮チャンポン' : (lang === 'zh' || lang === 'zht') ? '东海天然海水点制嫩豆腐与香辣海鲜面' : '동해 바닷물로 만든 부드러운 순두부와 매콤한 짬뽕',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Gangneung Jungang Market Dakgangjeong' : lang === 'ja' ? '中央市場 タッカンジョン' : (lang === 'zh' || lang === 'zht') ? '中央市场香脆甜辣炸鸡丁' : '강릉 중앙시장 닭강정',
            desc: lang === 'en' ? 'Crispy sweet and spicy glazed fried chicken' : lang === 'ja' ? '外はサクサク甘辛タレの名物タッカンジョン' : (lang === 'zh' || lang === 'zht') ? '外酥里嫩裹满特制甜辣酱料的传统炸鸡' : '바삭하게 튀겨 달콤 매콤한 소스를 입힌 대표 먹거리',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Eomjine Kkomak Cockle Bibimbap' : lang === 'ja' ? 'オムジネ コマッビビンバ' : (lang === 'zh' || lang === 'zht') ? '拇指家鲜香泥蚶拌饭' : '엄지네 포장마차 꼬막비빔밥',
            desc: lang === 'en' ? 'Mountain of savory marinated cockles and rice' : lang === 'ja' ? '香ばしい味付けハイガイが山盛りのビビンバ' : (lang === 'zh' || lang === 'zht') ? '分量十足鲜香微辣的招牌泥蚶拌饭' : '신선한 꼬막을 푸짐하게 비벼 먹는 원조 맛집',
            dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Jumunjin Squid Sundae' : lang === 'ja' ? '注文津 イカスンデ' : (lang === 'zh' || lang === 'zht') ? '注文津鲜鱿鱼米肠' : '주문진항 오징어순대 & 물회',
            desc: lang === 'en' ? 'Stuffed whole fresh squid & cold spicy sashimi soup' : lang === 'ja' ? '具だくさんのイカスンデと冷たいムルフェ' : (lang === 'zh' || lang === 'zht') ? '馅料满满的新鲜鱿鱼米肠与清爽水生鱼片' : '속이 꽉 찬 오징어순대와 시원하고 새콤한 물회',
            dist: lang === 'en' ? '8 min bus' : lang === 'ja' ? 'バス8分' : (lang === 'zh' || lang === 'zht') ? '公交8分钟' : '버스 8분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          {
            name: lang === 'en' ? 'Arte Museum Gangneung' : lang === 'ja' ? 'アルテミュージアム江陵' : (lang === 'zh' || lang === 'zht') ? '强陵Arte Museum' : '아르떼뮤지엄 강릉',
            desc: lang === 'en' ? 'Stunning digital waves and valley nature light shows' : lang === 'ja' ? '谷と海を表現した光と音のイマーシブアート' : (lang === 'zh' || lang === 'zht') ? '展现江原道山谷与浩瀚海洋的沉浸式光影展' : '강원도의 웅장한 자연을 빛과 소리로 재해석한 미디어아트',
            dist: lang === 'en' ? '5 min bus' : lang === 'ja' ? 'バス5分' : (lang === 'zh' || lang === 'zht') ? '公交5分钟' : '버스 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Haslla Art World' : lang === 'ja' ? 'ハスラアートワールド' : (lang === 'zh' || lang === 'zht') ? 'Haslla艺术世界' : '하슬라아트월드 현대미술관',
            desc: lang === 'en' ? 'Cliffside contemporary sculpture garden & Pinocchio museum' : lang === 'ja' ? '海岸断崖の彫刻公園とピノキオ博物館' : (lang === 'zh' || lang === 'zht') ? '海岸悬崖现代雕塑花园与皮诺丘博物馆' : '바다 절벽 위 현대미술관과 이색 피노키오 박물관',
            dist: lang === 'en' ? '12 min bus' : lang === 'ja' ? 'バス12分' : (lang === 'zh' || lang === 'zht') ? '公交12分钟' : '버스 12분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Chamsori Edison Science Museum' : lang === 'ja' ? 'エジソン科学博物館' : (lang === 'zh' || lang === 'zht') ? '爱迪生科学博物馆' : '참소리축음기 에디슨과학박물관',
            desc: lang === 'en' ? 'World largest vintage phonograph & gramophone collection' : lang === 'ja' ? '世界最大規模の蓄音機・エジソン発明品展示' : (lang === 'zh' || lang === 'zht') ? '世界最大规模留声机与爱迪生发明馆' : '세계 최대 규모의 축음기와 에디슨 발명품 전시',
            dist: lang === 'en' ? '7 min bus' : lang === 'ja' ? 'バス7分' : (lang === 'zh' || lang === 'zht') ? '公交7分钟' : '버스 7분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Ojukheon Memorial Museum' : lang === 'ja' ? '烏竹軒 記念館' : (lang === 'zh' || lang === 'zht') ? '乌竹轩栗谷纪念馆' : '오죽헌 율곡기념관',
            desc: lang === 'en' ? 'Historic birthplace of Shin Saimdang and Yi I' : lang === 'ja' ? '申師任堂と栗谷李珥の歴史を刻む展示館' : (lang === 'zh' || lang === 'zht') ? '申师任堂与栗谷李珥历史文化纪念馆' : '검은 대나무 숲과 5만원권·5천원권 인물의 역사관',
            dist: lang === 'en' ? '6 min bus' : lang === 'ja' ? 'バス6分' : (lang === 'zh' || lang === 'zht') ? '公交6分钟' : '버스 6분',
            rating: 4.8
          }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          {
            name: lang === 'en' ? 'Jumunjin BTS Bus Stop' : lang === 'ja' ? '注文津 BTSバス停' : (lang === 'zh' || lang === 'zht') ? '注文津BTS海边公交站' : '주문진 BTS 버스정류장',
            desc: lang === 'en' ? 'Famous K-pop album cover beachside photo spot' : lang === 'ja' ? '世界的人気K-POPアルバムジャケット撮影地' : (lang === 'zh' || lang === 'zht') ? '闻名全球的K-POP专辑封面海边打卡地' : '청량한 바다를 배경으로 찍는 방탄소년단 앨범 촬영지',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Gyeongpo Lake Moonlight Boardwalk' : lang === 'ja' ? '鏡浦湖 月光散策路' : (lang === 'zh' || lang === 'zht') ? '镜浦湖月光木栈道' : '경포호수 달빛 산책로',
            desc: lang === 'en' ? 'Serene lake reflection of moon and historic pavilions' : lang === 'ja' ? '静かな湖面に月が映るロマンチックな散歩道' : (lang === 'zh' || lang === 'zht') ? '湖面倒映明月与古色古香亭阁的浪漫步道' : '달빛이 잔잔하게 비치는 호수 둘레길과 정자 뷰',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Jeongdongjin Sun Cruise Cliff' : lang === 'ja' ? '正東津 サンクルーズ' : (lang === 'zh' || lang === 'zht') ? '正东津太阳邮轮观景台' : '정동진 썬크루즈 일출전망대',
            desc: lang === 'en' ? 'Iconic luxury cruise ship perched on coastal cliffs' : lang === 'ja' ? '断崖の上にそびえる巨大豪華客船と日の出' : (lang === 'zh' || lang === 'zht') ? '耸立于悬崖之上的豪华邮轮与海上日出' : '절벽 위에 자리 잡은 대형 크루즈선과 일출 뷰',
            dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Anmok Red Lighthouse' : lang === 'ja' ? '安木 赤い灯台' : (lang === 'zh' || lang === 'zht') ? '安木海边红灯塔' : '안목해변 빨간등대',
            desc: lang === 'en' ? 'Striking red beacon against the deep blue ocean' : lang === 'ja' ? '深い青の海に映える鮮やかな赤い灯台' : (lang === 'zh' || lang === 'zht') ? '湛蓝东海衬托下格外显眼的红色灯塔' : '푸른 동해 바다 끝자락에 붉게 빛나는 등대 포토존',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.7
          }
        ]
      }
    ];
  }

  // 5. 수원 (Suwon)
  if (c.includes('수원') || c.includes('suwon')) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          {
            name: lang === 'en' ? 'Haenggung-dong Rooftop Cafe' : lang === 'ja' ? '行宮洞 ルーフトップカフェ' : (lang === 'zh' || lang === 'zht') ? '行宫洞网红露台咖啡' : '행궁동 행리단길 루프탑 카페',
            desc: lang === 'en' ? 'Historic fortress wall views & cozy atmosphere' : lang === 'ja' ? '水原華城の城郭を望むエモいテラス' : (lang === 'zh' || lang === 'zht') ? '面朝古城郭的治愈系露台咖啡馆' : '수원화성 성곽 라인을 한눈에 담는 감성 테라스',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Banghwasuryujeong Lake View' : lang === 'ja' ? '訪花随柳亭 カフェ' : (lang === 'zh' || lang === 'zht') ? '访花随柳亭湖景咖啡' : '방화수류정 용연 뷰 카페',
            desc: lang === 'en' ? 'Serene pond willow trees and traditional pavilion' : lang === 'ja' ? '柳の木と池の東屋が広がる絶景' : (lang === 'zh' || lang === 'zht') ? '垂柳依依与湖中雅致亭阁相映' : '버드나무 휘늘어진 용연 연못과 정자가 보이는 뷰',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Hwahongmun Stream Tea House' : lang === 'ja' ? '華虹門 伝統茶屋' : (lang === 'zh' || lang === 'zht') ? '华虹门雅致茶馆' : '화홍문 감성 찻집',
            desc: lang === 'en' ? 'Soothing sound of water flowing through seven floodgates' : lang === 'ja' ? '水門を流れる清らかなせせらぎとお茶' : (lang === 'zh' || lang === 'zht') ? '伴着七孔水门潺潺流水声品茗' : '7개 수문 아래 흐르는 물소리를 들으며 즐기는 차',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Janganmun Heritage Bakery' : lang === 'ja' ? '長安門 ベーカリー' : (lang === 'zh' || lang === 'zht') ? '长安门古城面包房' : '장안문 헤리티지 베이커리',
            desc: lang === 'en' ? 'Fresh croissants facing the majestic northern gate' : lang === 'ja' ? '雄大な長安門を眺めながら味わう焼きたてパン' : (lang === 'zh' || lang === 'zht') ? '直面雄伟长安门城楼的现烤可颂' : '웅장한 북쪽 정문을 마주보는 갓 구운 베이커리',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.8
          }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          {
            name: lang === 'en' ? 'Suwon Wanggalbi (Marinated Ribs)' : lang === 'ja' ? '水原 王カルビ' : (lang === 'zh' || lang === 'zht') ? '水原大排骨' : '수원 왕갈비 본점',
            desc: lang === 'en' ? 'Grand sweet savory marinated charcoal grilled beef ribs' : lang === 'ja' ? '伝統の甘辛タレで焼き上げる名物炭火牛カルビ' : (lang === 'zh' || lang === 'zht') ? '传统秘制咸甜多汁炭烤特大牛排骨' : '달콤 짭조름한 비법 양념의 원조 수원 숯불 갈비',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Suwon Chicken Street (Jinmi)' : lang === 'ja' ? '水原 チキン通り（珍味）' : (lang === 'zh' || lang === 'zht') ? '水原炸鸡一条街（珍味）' : '수원 통닭거리 진미통닭',
            desc: lang === 'en' ? 'Crispy traditional whole fried chicken from iron cauldron' : lang === 'ja' ? '大釜でカラッと揚げた昔ながらのチキン' : (lang === 'zh' || lang === 'zht') ? '传统大铁锅现炸香脆原汁原味炸鸡' : '무쇠 가마솥에서 튀겨낸 바삭한 원조 통닭',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Jidong Market Sundae Town' : lang === 'ja' ? '池洞市場 スンデタウン' : (lang === 'zh' || lang === 'zht') ? '池洞市场米肠一条街' : '지동시장 순대타운',
            desc: lang === 'en' ? 'Spicy stir-fried blood sausage and warm soup' : lang === 'ja' ? '甘辛いスンデ炒めと熱々のスンデクッパ' : (lang === 'zh' || lang === 'zht') ? '香辣炒米肠牛肚与热气腾腾米肠汤饭' : '철판에 볶아내는 매콤한 순대곱창볶음과 국밥',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Hwaseomun Handmade Noodle' : lang === 'ja' ? '華西門 手打ち麺' : (lang === 'zh' || lang === 'zht') ? '华西门手工刀切面' : '화서문 손칼국수',
            desc: lang === 'en' ? 'Rich anchovy broth and chewy hand-rolled noodles' : lang === 'ja' ? '煮干しダシの効いたコシのある手打ちうどん' : (lang === 'zh' || lang === 'zht') ? '鲜浓凤尾鱼高汤与劲道手工刀切面' : '진한 멸치 육수에 쫄깃하게 썬 손반죽 칼국수',
            dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          {
            name: lang === 'en' ? 'Suwon Ipark Museum of Art' : lang === 'ja' ? '水原市立アイパーク美術館' : (lang === 'zh' || lang === 'zht') ? '水原市立IPARK美术馆' : '수원시립아이파크미술관',
            desc: lang === 'en' ? 'Sleek contemporary art museum right next to the palace' : lang === 'ja' ? '華城行宮の隣に位置する洗練された現代美術館' : (lang === 'zh' || lang === 'zht') ? '毗邻华城行宫的高雅现代艺术馆' : '화성행궁 바로 옆에 위치한 세련된 도심 현대미술관',
            dist: lang === 'en' ? '2 min walk' : lang === 'ja' ? '徒歩2分' : (lang === 'zh' || lang === 'zht') ? '步行2分钟' : '도보 2분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Starfield Suwon Starfield Library' : lang === 'ja' ? 'スターフィールド水原 星の広場図書館' : (lang === 'zh' || lang === 'zht') ? '水原星空图书馆' : '스타필드 수원 별마당도서관',
            desc: lang === 'en' ? '22m towering 4-story grand open bookshelves landmark' : lang === 'ja' ? '高さ22m、圧巻の4階吹き抜け大書架' : (lang === 'zh' || lang === 'zht') ? '高达22米震撼的4层通高开放式巨型书架' : '22m 높이 4개 층 개방형 초대형 책장 랜드마크',
            dist: lang === 'en' ? '8 min bus' : lang === 'ja' ? 'バス8分' : (lang === 'zh' || lang === 'zht') ? '公交8分钟' : '버스 8분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Suwon Hwaseong Museum' : lang === 'ja' ? '水原華城博物館' : (lang === 'zh' || lang === 'zht') ? '水原华城博物馆' : '수원화성박물관',
            desc: lang === 'en' ? 'Construction history & King Jeongjo historical models' : lang === 'ja' ? '世界遺産の築城技術と正祖大王の歴史展示' : (lang === 'zh' || lang === 'zht') ? '世界遗产筑城工艺与正祖大王历史展' : '세계문화유산 축성 과정과 정조대왕의 역사관',
            dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
            rating: 4.7
          },
          {
            name: lang === 'en' ? 'Gyeonggi Arts Center' : lang === 'ja' ? '京畿アーツセンター' : (lang === 'zh' || lang === 'zht') ? '京畿艺术中心' : '경기아트센터 복합공연장',
            desc: lang === 'en' ? 'Premium indoor classical orchestra and dance halls' : lang === 'ja' ? '最高峰のクラシックオーケストラと舞踊公演' : (lang === 'zh' || lang === 'zht') ? '高水准交响乐与传统舞蹈综合演艺剧场' : '수준 높은 클래식 및 무용 공연 관람',
            dist: lang === 'en' ? '12 min bus' : lang === 'ja' ? 'バス12分' : (lang === 'zh' || lang === 'zht') ? '公交12分钟' : '버스 12분',
            rating: 4.7
          }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          {
            name: lang === 'en' ? 'Banghwasuryujeong Dragon Pond Picnic' : lang === 'ja' ? '訪花随柳亭 ピクニック' : (lang === 'zh' || lang === 'zht') ? '访花随柳亭湖畔野餐打卡' : '방화수류정 용연 피크닉 & 야경',
            desc: lang === 'en' ? 'Pond willow trees and lighted fortress pavilion reflection' : lang === 'ja' ? '柳の池とライトアップされた城郭東屋の絶景' : (lang === 'zh' || lang === 'zht') ? '池畔垂柳与夜间古城灯光倒影绝美打卡' : '연못과 은은한 조명이 켜진 정자가 빚는 인생샷',
            dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
            rating: 4.9
          },
          {
            name: lang === 'en' ? 'Janganmun Fortress Outer Wall' : lang === 'ja' ? '長安門 甕城ビュー' : (lang === 'zh' || lang === 'zht') ? '长安门瓮城全景打卡' : '수원화성 장안문 옹성 뷰',
            desc: lang === 'en' ? 'Grandest Joseon stone gate curve and night lights' : lang === 'ja' ? '朝鮮最大の城門が織りなす重厚な曲線美と夜景' : (lang === 'zh' || lang === 'zht') ? '朝鲜最大城门巍峨石雕与夜景照明' : '조선 최고의 웅장한 성곽 문루와 야경',
            dist: lang === 'en' ? '3 min walk' : lang === 'ja' ? '徒歩3分' : (lang === 'zh' || lang === 'zht') ? '步行3分钟' : '도보 3분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Hwaseong Haenggung Moonlight Tour' : lang === 'ja' ? '華城行宮 夜間特別観覧' : (lang === 'zh' || lang === 'zht') ? '华城行宫夜间月光游' : '화성행궁 야간개장 달빛투어',
            desc: lang === 'en' ? 'Gentle lanterns illuminating royal courtyards' : lang === 'ja' ? '月明かりと提灯に照らされた風情ある宮殿' : (lang === 'zh' || lang === 'zht') ? '月色与雅致宫灯掩映下的古行宫' : '달빛 아래 은은한 조명이 켜진 행궁 고궁 투어',
            dist: lang === 'en' ? '2 min walk' : lang === 'ja' ? '徒歩2分' : (lang === 'zh' || lang === 'zht') ? '步行2分钟' : '도보 2분',
            rating: 4.8
          },
          {
            name: lang === 'en' ? 'Flying Suwon Hot Air Balloon' : lang === 'ja' ? 'フライング水原 係留気球' : (lang === 'zh' || lang === 'zht') ? '飞行水原系留热气球' : '플라잉수원 계류식 열기구',
            desc: lang === 'en' ? '150m high panoramic sky view over the fortress' : lang === 'ja' ? '上空150mから水原華城全景を一望' : (lang === 'zh' || lang === 'zht') ? '升至150米高空俯瞰水原华城全景' : '150m 상공에서 내려다보는 수원화성 전경',
            dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
            rating: 4.7
          }
        ]
      }
    ];
  }

  // 6. 기본 서울 (Default Seoul & Universal City Fallback)
  const locCity = getLocalizedCityName(targetCity || '서울', lang);
  const cityKn = CITY_LOCAL_KNOWLEDGE[targetCity] || null;

  const dynamicCafeDesc = lang === 'en' ? `Atmospheric roastery & dessert cafe in ${locCity}` : lang === 'ja' ? `${locCity}のおしゃれなロースタリー＆デザートカフェ` : (lang === 'zh' || lang === 'zht') ? `${locCity}特色精品烘焙与甜品咖啡馆` : `${targetCity} 감성 로스터리 & 베이커리 카페`;
  const dynamicFoodDesc = cityKn?.localFoodieSecret || (lang === 'en' ? `Authentic local culinary specialty in ${locCity}` : lang === 'ja' ? `${locCity}を代表する地元名物グルメ` : (lang === 'zh' || lang === 'zht') ? `${locCity}代表性地道名吃美食` : `${targetCity} 대표 향토 미식과 인기 맛집`);
  const dynamicRainDesc = (cityKn?.rainyHotspots && cityKn.rainyHotspots[0]) ? `${cityKn.rainyHotspots[0]} ${lang === 'en' ? 'indoor culture' : lang === 'ja' ? '屋内文化体験' : (lang === 'zh' || lang === 'zht') ? '室内文化体验' : '실내 문화 체험'}` : (lang === 'en' ? `Indoor museum & interactive cultural space in ${locCity}` : lang === 'ja' ? `${locCity}の屋内博物館＆文化スペース` : (lang === 'zh' || lang === 'zht') ? `${locCity}室内博物馆与特色文化空间` : `${targetCity} 실내 박물관 및 문화 예술 공간`);
  const dynamicPhotoDesc = (cityKn?.signatureHighlights && cityKn.signatureHighlights[0]) ? `${cityKn.signatureHighlights[0]} ${lang === 'en' ? 'photo spot' : lang === 'ja' ? 'フォトスポット' : (lang === 'zh' || lang === 'zht') ? '打卡胜地' : '포토존'}` : (lang === 'en' ? `Top iconic landmark photo spot in ${locCity}` : lang === 'ja' ? `${locCity}を代表する人気フォトスポット` : (lang === 'zh' || lang === 'zht') ? `${locCity}代表性标志地标打卡胜地` : `${targetCity} 대표 랜드마크와 인생샷 포토존`);

  if (targetCity && targetCity !== '서울' && cityKn) {
    return [
      {
        id: 'cafe',
        label: cafeLabel,
        icon: Coffee,
        color: '#d97706',
        items: [
          { name: `${locCity} ${lang === 'en' ? 'Specialty Cafe' : lang === 'ja' ? '名物カフェ' : (lang === 'zh' || lang === 'zht') ? '特色咖啡馆' : '감성 로스터리'}`, desc: dynamicCafeDesc, dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분', rating: 4.8 },
          { name: `${locCity} ${lang === 'en' ? 'Bakery House' : lang === 'ja' ? 'ベーカリー' : (lang === 'zh' || lang === 'zht') ? '现烤面包房' : '베이커리 하우스'}`, desc: dynamicCafeDesc, dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분', rating: 4.7 },
          { name: `${locCity} ${lang === 'en' ? 'Traditional Tea Room' : lang === 'ja' ? '伝統茶屋' : (lang === 'zh' || lang === 'zht') ? '传统茶馆' : '전통 찻집'}`, desc: dynamicCafeDesc, dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분', rating: 4.8 },
          { name: `${locCity} ${lang === 'en' ? 'Scenic Terrace' : lang === 'ja' ? '絶景テラス' : (lang === 'zh' || lang === 'zht') ? '观景露台' : '전망 테라스'}`, desc: dynamicCafeDesc, dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분', rating: 4.7 }
        ]
      },
      {
        id: 'food',
        label: foodLabel,
        icon: UtensilsCrossed,
        color: '#ef4444',
        items: [
          { name: `${locCity} ${lang === 'en' ? 'Local Specialty' : lang === 'ja' ? '名物料理' : (lang === 'zh' || lang === 'zht') ? '地道名吃' : '대표 향토 맛집'}`, desc: dynamicFoodDesc, dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분', rating: 4.9 },
          { name: `${locCity} ${lang === 'en' ? 'Traditional Market Food' : lang === 'ja' ? '市場グルメ' : (lang === 'zh' || lang === 'zht') ? '传统市场小吃' : '원조 전통시장'}`, desc: dynamicFoodDesc, dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분', rating: 4.8 },
          { name: `${locCity} ${lang === 'en' ? 'Gourmet Restaurant' : lang === 'ja' ? '人気名店' : (lang === 'zh' || lang === 'zht') ? '人气名店' : '현지인 추천 식당'}`, desc: dynamicFoodDesc, dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분', rating: 4.7 },
          { name: `${locCity} ${lang === 'en' ? 'Signature Dish House' : lang === 'ja' ? '名物専門店' : (lang === 'zh' || lang === 'zht') ? '特色专门店' : '시그니처 미식 전문점'}`, desc: dynamicFoodDesc, dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분', rating: 4.7 }
        ]
      },
      {
        id: 'rain',
        label: rainLabel,
        icon: CloudRain,
        color: '#3b82f6',
        items: [
          { name: cityKn.rainyHotspots?.[0] || `${locCity} Art Museum`, desc: dynamicRainDesc, dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분', rating: 4.8 },
          { name: cityKn.rainyHotspots?.[1] || `${locCity} History Museum`, desc: dynamicRainDesc, dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분', rating: 4.7 },
          { name: cityKn.rainyHotspots?.[2] || `${locCity} Culture Hall`, desc: dynamicRainDesc, dist: lang === 'en' ? '10 min bus' : lang === 'ja' ? 'バス10分' : (lang === 'zh' || lang === 'zht') ? '公交10分钟' : '버스 10분', rating: 4.8 },
          { name: `${locCity} ${lang === 'en' ? 'Indoor Experience Lab' : lang === 'ja' ? '屋内体験館' : (lang === 'zh' || lang === 'zht') ? '室内体验馆' : '실내 미디어 체험관'}`, desc: dynamicRainDesc, dist: lang === 'en' ? '12 min bus' : lang === 'ja' ? 'バス12分' : (lang === 'zh' || lang === 'zht') ? '公交12分钟' : '버스 12분', rating: 4.7 }
        ]
      },
      {
        id: 'photo',
        label: photoLabel,
        icon: Camera,
        color: '#ec4899',
        items: [
          { name: cityKn.signatureHighlights?.[0] || `${locCity} Landmark`, desc: dynamicPhotoDesc, dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분', rating: 4.9 },
          { name: cityKn.signatureHighlights?.[1] || `${locCity} Heritage`, desc: dynamicPhotoDesc, dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분', rating: 4.8 },
          { name: cityKn.signatureHighlights?.[2] || `${locCity} Observatory`, desc: dynamicPhotoDesc, dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분', rating: 4.8 },
          { name: `${locCity} ${lang === 'en' ? 'Sunset Point' : lang === 'ja' ? '夕日スポット' : (lang === 'zh' || lang === 'zht') ? '绝美日落观景点' : '일몰 전망대'}`, desc: dynamicPhotoDesc, dist: lang === 'en' ? '10 min walk' : lang === 'ja' ? '徒歩10分' : (lang === 'zh' || lang === 'zht') ? '步行10分钟' : '도보 10분', rating: 4.7 }
        ]
      }
    ];
  }

  // 서울 기본 리스트
  return [
    {
      id: 'cafe',
      label: cafeLabel,
      icon: Coffee,
      color: '#d97706',
      items: [
        {
          name: lang === 'en' ? 'Cafe Onion Anguk' : lang === 'ja' ? 'オニオン 安国店' : (lang === 'zh' || lang === 'zht') ? 'Onion安国店' : '어니언 안국 (Cafe Onion)',
          desc: lang === 'en' ? 'Atmospheric Hanok courtyard bakery cafe' : lang === 'ja' ? '風情ある伝統韓屋の中庭ベーカリーカフェ' : (lang === 'zh' || lang === 'zht') ? '古朴韩屋庭院现烤面包咖啡馆' : '고즈넉한 한옥 중정 베이커리 카페',
          dist: lang === 'en' ? '4 min walk' : lang === 'ja' ? '徒歩4分' : (lang === 'zh' || lang === 'zht') ? '步行4分钟' : '도보 4분',
          rating: 4.8
        },
        {
          name: lang === 'en' ? 'Daelim Changgo Gallery' : lang === 'ja' ? '大林倉庫 ギャラリー' : (lang === 'zh' || lang === 'zht') ? '大林木仓画廊咖啡' : '대림창고 갤러리 (성수)',
          desc: lang === 'en' ? 'Industrial vibe large art cafe in Seongsu' : lang === 'ja' ? 'インダストリアルな大型アートカフェ' : (lang === 'zh' || lang === 'zht') ? '工业复古风大型艺术画廊咖啡馆' : '인더스트리얼 감성 대형 아트 카페',
          dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
          rating: 4.7
        },
        {
          name: lang === 'en' ? 'Tailor Coffee' : lang === 'ja' ? 'テイラーコーヒー' : (lang === 'zh' || lang === 'zht') ? 'Tailor精品咖啡' : '테일러커피 (Tailor Coffee)',
          desc: lang === 'en' ? 'Specialty roastery famous for Cream Mocha' : lang === 'ja' ? '名物クリームモカが人気のロースタリー' : (lang === 'zh' || lang === 'zht') ? '以招牌奶油摩卡闻名的精品烘焙馆' : '크림모카가 유명한 스페셜티 로스터리',
          dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
          rating: 4.8
        },
        {
          name: lang === 'en' ? 'Fritz Coffee Company' : lang === 'ja' ? 'プリッツ コーヒー' : (lang === 'zh' || lang === 'zht') ? 'Fritz复古咖啡面包' : '프릳츠 커피 컴퍼니',
          desc: lang === 'en' ? 'Vintage retro aesthetic bread & coffee spot' : lang === 'ja' ? 'ヴィンテージレトロ感性のパンとコーヒー' : (lang === 'zh' || lang === 'zht') ? '复古怀旧感性面包与香醇咖啡名店' : '빈티지 레트로 감성의 빵과 커피 명소',
          dist: lang === 'en' ? '8 min walk' : lang === 'ja' ? '徒歩8分' : (lang === 'zh' || lang === 'zht') ? '步行8分钟' : '도보 8분',
          rating: 4.6
        }
      ]
    },
    {
      id: 'food',
      label: foodLabel,
      icon: UtensilsCrossed,
      color: '#ef4444',
      items: [
        {
          name: lang === 'en' ? 'Tosokchon Samgyetang' : lang === 'ja' ? '土俗村 サムゲタン' : (lang === 'zh' || lang === 'zht') ? '土俗村参鸡汤' : '토속촌 삼계탕',
          desc: lang === 'en' ? 'Rich nutty broth ginseng chicken soup' : lang === 'ja' ? '濃厚なナッツ入りスープのソウル代表サムゲタン' : (lang === 'zh' || lang === 'zht') ? '浓郁坚果高汤首尔代表性参鸡汤名店' : '진한 견과류 육수의 서울 대표 삼계탕',
          dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
          rating: 4.8
        },
        {
          name: lang === 'en' ? 'Samcheongdong Sujebi' : lang === 'ja' ? '三清洞スジェビ' : (lang === 'zh' || lang === 'zht') ? '三清洞面疙瘩汤' : '삼청동 수제비',
          desc: lang === 'en' ? 'Michelin Guide refreshing anchovy broth hand-pulled dough' : lang === 'ja' ? 'ミシュラン選定 澄んだ煮干しダシのすいとん' : (lang === 'zh' || lang === 'zht') ? '米其林指南精选鲜美凤尾鱼高汤面疙瘩' : '미쉐린 가이드 선정 시원한 멸치 육수 수제비',
          dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
          rating: 4.6
        },
        {
          name: lang === 'en' ? 'Myeongdong Kyoja' : lang === 'ja' ? '明洞餃子 本店' : (lang === 'zh' || lang === 'zht') ? '明洞饺子总店' : '명동교자 본점',
          desc: lang === 'en' ? 'Michelin Bib Gourmand Kalguksu & garlic kimchi' : lang === 'ja' ? 'ミシュランビブグルマン カルグクス＆特製キムチ' : (lang === 'zh' || lang === 'zht') ? '米其林必比登精选鸡汤刀切面与蒜香泡菜' : '미쉐린 빕구르망 칼국수 & 중독성 있는 마늘김치',
          dist: lang === 'en' ? 'Subway 10 min' : lang === 'ja' ? '地下鉄10分' : (lang === 'zh' || lang === 'zht') ? '地铁10分钟' : '지하철 10분',
          rating: 4.7
        },
        {
          name: lang === 'en' ? 'Gwangjang Market Bindaetteok' : lang === 'ja' ? '広蔵市場 スニネピンデトッ' : (lang === 'zh' || lang === 'zht') ? '广藏市场顺熙家绿豆煎饼' : '광장시장 순희네 빈대떡',
          desc: lang === 'en' ? 'Crispy golden mung bean pancakes & fresh beef tartare' : lang === 'ja' ? '香ばしい緑豆チヂミと新鮮なユッケ' : (lang === 'zh' || lang === 'zht') ? '香脆可口现磨绿豆煎饼与鲜嫩生拌牛肉' : '바삭하고 고소한 맷돌 녹두 빈대떡 & 육회',
          dist: lang === 'en' ? 'Subway 5 min' : lang === 'ja' ? '地下鉄5分' : (lang === 'zh' || lang === 'zht') ? '地铁5分钟' : '지하철 5분',
          rating: 4.7
        }
      ]
    },
    {
      id: 'rain',
      label: rainLabel,
      icon: CloudRain,
      color: '#3b82f6',
      items: [
        {
          name: lang === 'en' ? 'MMCA Seoul (Contemporary Art)' : lang === 'ja' ? '国立現代美術館 ソウル館' : (lang === 'zh' || lang === 'zht') ? '韩国国立现代美术馆首尔馆' : '국립현대미술관 서울',
          desc: lang === 'en' ? 'Atmospheric modern art museum in the city center' : lang === 'ja' ? '雨の日に風情ある都心の現代美術館' : (lang === 'zh' || lang === 'zht') ? '雨天极具艺术氛围的市中心现代美术馆' : '비 오는 날 운치 있는 도심 속 현대 미술관',
          dist: lang === 'en' ? '6 min walk' : lang === 'ja' ? '徒歩6分' : (lang === 'zh' || lang === 'zht') ? '步行6分钟' : '도보 6분',
          rating: 4.8
        },
        {
          name: lang === 'en' ? 'COEX Starfield Library' : lang === 'ja' ? 'COEX 星の広場図書館' : (lang === 'zh' || lang === 'zht') ? 'COEX星空图书馆' : '코엑스 별마당 도서관',
          desc: lang === 'en' ? '13m towering open bookshelves indoor landmark' : lang === 'ja' ? '高さ13mの巨大書架が広がる屋内ランドマーク' : (lang === 'zh' || lang === 'zht') ? '高约13米壮观开放式巨型书架室内地标' : '13m 높이의 거대한 책장 실내 랜드마크',
          dist: lang === 'en' ? 'Subway 15 min' : lang === 'ja' ? '地下鉄15分' : (lang === 'zh' || lang === 'zht') ? '地铁15分钟' : '지하철 15분',
          rating: 4.9
        },
        {
          name: lang === 'en' ? 'Dongdaemun DDP Design Lab' : lang === 'ja' ? '東大門 DDP デザインラボ' : (lang === 'zh' || lang === 'zht') ? '东大门DDP设计实验室' : '동대문 DDP 디자인랩',
          desc: lang === 'en' ? 'Futuristic architecture & design exhibitions' : lang === 'ja' ? '未来的な建築美と複合デザイン展示' : (lang === 'zh' || lang === 'zht') ? '未来感流线型建筑与综合设计展' : '미래지향적 건축물과 복합 문화 디자인 전시',
          dist: lang === 'en' ? 'Subway 8 min' : lang === 'ja' ? '地下鉄8分' : (lang === 'zh' || lang === 'zht') ? '地铁8分钟' : '지하철 8분',
          rating: 4.7
        },
        {
          name: lang === 'en' ? 'The Hyundai Seoul (Sounds Forest)' : lang === 'ja' ? 'ザ・現代ソウル サウンズフォレスト' : (lang === 'zh' || lang === 'zht') ? '首尔现代百货室内森林花园' : '더현대 서울 (사운즈 포레스트)',
          desc: lang === 'en' ? 'Indoor botanical forest and trendy global pop-up stores' : lang === 'ja' ? '屋内庭園とトレンドのポップアップストア' : (lang === 'zh' || lang === 'zht') ? '室内天然植物森林与潮流快闪聚集地' : '실내 정원과 트렌디한 글로벌 팝업스토어',
          dist: lang === 'en' ? 'Subway 18 min' : lang === 'ja' ? '地下鉄18分' : (lang === 'zh' || lang === 'zht') ? '地铁18分钟' : '지하철 18분',
          rating: 4.8
        }
      ]
    },
    {
      id: 'photo',
      label: photoLabel,
      icon: Camera,
      color: '#ec4899',
      items: [
        {
          name: lang === 'en' ? 'Bukchon Hanok Village 8 Views' : lang === 'ja' ? '北村韓屋村 8景' : (lang === 'zh' || lang === 'zht') ? '北村韩屋村八景' : '북촌 한옥마을 8경',
          desc: lang === 'en' ? 'Hanok tiled roofs framing N Seoul Tower view' : lang === 'ja' ? '伝統的な瓦屋根の間に望むNソウルタワー' : (lang === 'zh' || lang === 'zht') ? '传统青瓦屋檐与远眺首尔塔的经典打卡' : '한옥 처마선 사이로 남산타워가 보이는 뷰',
          dist: lang === 'en' ? '5 min walk' : lang === 'ja' ? '徒歩5分' : (lang === 'zh' || lang === 'zht') ? '步行5分钟' : '도보 5분',
          rating: 4.8
        },
        {
          name: lang === 'en' ? 'Changgyeonggung Grand Greenhouse' : lang === 'ja' ? '昌慶宮 大温室' : (lang === 'zh' || lang === 'zht') ? '昌庆宫大温室' : '창경궁 대온실',
          desc: lang === 'en' ? 'Korea first Western-style glass botanical greenhouse' : lang === 'ja' ? '韓国初の西洋式ガラス温室フォトスポット' : (lang === 'zh' || lang === 'zht') ? '韩国最早西式复古玻璃植物温室打卡点' : '한국 최초의 서양식 유리 온실 포토스팟',
          dist: lang === 'en' ? '10 min walk' : lang === 'ja' ? '徒歩10分' : (lang === 'zh' || lang === 'zht') ? '步行10分钟' : '도보 10분',
          rating: 4.7
        },
        {
          name: lang === 'en' ? 'Ikseon-dong Hanok Alleys' : lang === 'ja' ? '益善洞 韓屋小道' : (lang === 'zh' || lang === 'zht') ? '益善洞韩屋胡同' : '익선동 한옥 골목길',
          desc: lang === 'en' ? 'Charming flower shops & warm nostalgic lanterns' : lang === 'ja' ? '可愛い花屋と温かい照明が灯る小道' : (lang === 'zh' || lang === 'zht') ? '精致花店与暖黄色灯光点缀的文艺胡同' : '아기자기한 꽃집과 감성 조명 골목길',
          dist: lang === 'en' ? '7 min walk' : lang === 'ja' ? '徒歩7分' : (lang === 'zh' || lang === 'zht') ? '步行7分钟' : '도보 7분',
          rating: 4.6
        },
        {
          name: lang === 'en' ? 'Seongsu Yeonmujang-gil Murals' : lang === 'ja' ? '聖水洞 演武場通り 壁画' : (lang === 'zh' || lang === 'zht') ? '圣水洞演武场路涂鸦壁画街' : '성수동 연무장길 벽화거리',
          desc: lang === 'en' ? 'Hip graffiti murals and flagship pop-up photo zones' : lang === 'ja' ? 'ヒップなグラフィティとフラッグシップストア' : (lang === 'zh' || lang === 'zht') ? '潮流涂鸦壁画与潮流旗舰快闪打卡点' : '트렌디한 그래피티와 브랜드 팝업 포토존',
          dist: lang === 'en' ? 'Subway 15 min' : lang === 'ja' ? '地下鉄15分' : (lang === 'zh' || lang === 'zht') ? '地铁15分钟' : '지하철 15분',
          rating: 4.7
        }
      ]
    }
  ];
}

export default function LiveTripTab({
  lang = 'ko',
  targetCity = '서울',
  nextSpot = null,
  onOpenDetail,
  onOpenWeather
}) {
  // '지금 뭐하지?' 선택된 카테고리 모달 상태
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);

  // 🌟 도시별 맞춤형 기본 다음 목적지 및 핫플 리스트
  const activeNext = nextSpot || getDefaultNextSpotForCity(targetCity, lang);
  const NEARBY_ACTIONS = getNearbyActionsForCity(targetCity, lang);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* 1. Realtime Weather & Status Header (클릭 시 실시간 날씨/코디 팝업 즉시 오픈!) */}
      <div 
        onClick={() => onOpenWeather && onOpenWeather(targetCity)}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
          borderRadius: '24px',
          padding: '1.25rem 1.4rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(2, 132, 199, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(2, 132, 199, 0.25)';
        }}
      >
        <div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '0.35rem'
          }}>
            📍 {targetCity} • {lang === 'en' ? 'Live Concierge (Tap for Weather & Outfit)' : lang === 'ja' ? 'Live Concierge (タップして天気・服装を確認)' : (lang === 'zh' || lang === 'zht') ? 'Live Concierge (点击查看天气与穿搭)' : 'Live Concierge (탭하여 날씨/코디 보기)'}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
            {lang === 'en' ? 'Enjoying Your Trip?' : lang === 'ja' ? '韓国旅行をお楽しみ中ですか？😊' : (lang === 'zh' || lang === 'zht') ? '正在享受愉快的韩国之旅吗？😊' : '즐거운 한국 여행 중이신가요? 😊'}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
            {lang === 'en' ? 'Sunny 24°C • Perfect weather for travel ➔' : lang === 'ja' ? '快晴 24°C • お出かけに絶好の天気 ➔' : (lang === 'zh' || lang === 'zht') ? '晴朗 24°C • 非常适合外出游玩 ➔' : '맑음 24°C • 나들이하기 아주 좋은 날씨 ➔'}
          </p>
        </div>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sun size={28} style={{ color: '#fef08a' }} />
        </div>
      </div>

      {/* 2. 'Next Destination' Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1.5px solid var(--border-highlight)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Navigation size={12} />
            <span>{lang === 'en' ? 'Next Destination' : lang === 'ja' ? '次の目的地' : (lang === 'zh' || lang === 'zht') ? '下一站行程' : '다음 일정'}</span>
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
            🕒 {activeNext.transitTime || (lang === 'en' ? 'Transit via Subway or Walk' : lang === 'ja' ? '地下鉄または徒歩で移動' : (lang === 'zh' || lang === 'zht') ? '乘坐地铁或步行前往' : '지하철 또는 도보로 이동')}
          </span>
        </div>

        <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
          {activeNext.title}
        </h4>
        <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {activeNext.description || activeNext.addr1}
        </p>

        {/* Dual Actions: [🗺️ 길찾기] & [ℹ️ 상세보기] */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <a
            href={getGooglePlaceSearchUrl(activeNext.title, targetCity)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.55rem',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Navigation size={13} />
            <span>{lang === 'en' ? 'Google Maps ↗' : lang === 'ja' ? 'ルート案内 ↗' : (lang === 'zh' || lang === 'zht') ? '地图导航 ↗' : '길찾기 ↗'}</span>
          </a>

          <button
            onClick={() => onOpenDetail && onOpenDetail({ ...activeNext, isExploreOnly: true })}
            style={{
              padding: '0.55rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Info size={13} style={{ color: '#2563eb' }} />
            <span>{lang === 'en' ? 'Details' : lang === 'ja' ? '詳細を見る' : (lang === 'zh' || lang === 'zht') ? '查看详情' : '상세보기'}</span>
          </button>
        </div>
      </div>

      {/* 3. '지금 뭐하지?' (주변 실시간 탐색) Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '1.15rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Sparkles size={16} style={{ color: '#2563eb' }} />
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {lang === 'en' ? 'What to do right now?' : lang === 'ja' ? '今、何する？ (周辺リアルタイム探索)' : (lang === 'zh' || lang === 'zht') ? '现在去哪？(周边实时探索)' : '지금 뭐하지? (주변 실시간 탐색)'}
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
          {NEARBY_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setSelectedQuickCategory(action)}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <Icon size={16} style={{ color: action.color, flexShrink: 0 }} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 4. '지금 뭐하지?' 주변 핫플 4선 퀵 리스트 모달 (createPortal로 화면 정중앙 100% 고정 렌더링!) */}
      {selectedQuickCategory && typeof document !== 'undefined' && createPortal(
        (() => {
          const QuickIcon = selectedQuickCategory.icon;
          return (
            <div 
              onClick={() => setSelectedQuickCategory(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100dvh',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box'
              }}
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '24px',
                  maxWidth: '440px',
                  width: '100%',
                  maxHeight: 'min(82vh, 82dvh)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {QuickIcon && <QuickIcon size={18} style={{ color: selectedQuickCategory.color }} />}
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {getLocalizedCityName(targetCity, lang)} {selectedQuickCategory.label}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedQuickCategory(null)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* List Body */}
                <div style={{
                  padding: '0.85rem 1rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {selectedQuickCategory.items.map((item, idx) => {
                    const itemMapUrl = getGooglePlaceSearchUrl(item.name, targetCity);
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0.65rem 0.8rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>
                              ★ {item.rating}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              ({item.dist})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {item.desc}
                          </div>
                        </div>

                        <a
                          href={itemMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.35rem 0.6rem',
                            backgroundColor: 'var(--accent-primary)',
                            color: '#ffffff',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                          }}
                        >
                          <span>{lang === 'en' ? 'Map ↗' : lang === 'ja' ? 'マップ ↗' : (lang === 'zh' || lang === 'zht') ? '地图 ↗' : '구글맵 ↗'}</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}
