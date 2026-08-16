import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Utensils, Shirt, Sparkles, X, MapPin } from 'lucide-react';
import { TRANSLATIONS, getTranslatedAddress, getTranslatedTitle } from '../i18n/translations';

const POPULAR_CITIES = [
  '서울', '거제', '부산', '제주', '경주', '강릉', '전주', '여수', '속초', '수원'
];

const CITY_I18N = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾', de: 'Seoul', fr: 'Séoul', es: 'Seúl', ru: 'Сеул' },
  '거제': { en: 'Geoje', ja: '巨済', zh: '巨济', zht: '巨濟', de: 'Geoje', fr: 'Geoje', es: 'Geoje', ru: 'Кодже' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山', de: 'Busan', fr: 'Busan', es: 'Busan', ru: 'Пусан' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州', de: 'Jeju', fr: 'Jeju', es: 'Jeju', ru: 'Чеджу' },
  '경주': { en: 'Gyeongju', ja: '慶州', zh: '庆州', zht: '慶州', de: 'Gyeongju', fr: 'Gyeongju', es: 'Gyeongju', ru: 'Кёнджу' },
  '강릉': { en: 'Gangneung', ja: '江陵', zh: '江陵', zht: '江陵', de: 'Gangneung', fr: 'Gangneung', es: 'Gangneung', ru: 'Каннын' },
  '전주': { en: 'Jeonju', ja: '全州', zh: '全州', zht: '全州', de: 'Jeonju', fr: 'Jeonju', es: 'Jeonju', ru: 'Чонджу' },
  '여수': { en: 'Yeosu', ja: '麗水', zh: '丽水', zht: '麗水', de: 'Yeosu', fr: 'Yeosu', es: 'Yeosu', ru: 'Ёсу' },
  '속초': { en: 'Sokcho', ja: '束草', zh: '束草', zht: '束草', de: 'Sokcho', fr: 'Sokcho', es: 'Sokcho', ru: 'Сокчхо' },
  '수원': { en: 'Suwon', ja: '水原', zh: '水原', zht: '水原', de: 'Suwon', fr: 'Suwon', es: 'Suwon', ru: 'Сувон' }
};

const getCityName = (city, lang) => {
  if (CITY_I18N[city] && CITY_I18N[city][lang]) {
    return CITY_I18N[city][lang];
  }
  return city;
};

const REGIONAL_FOOD_DATA = {
  서울: [
    {
      name: '명동 칼국수 & 수제만두',
      enName: 'Myeongdong Handmade Noodle Soup & Mandu Dumplings',
      jaName: '明洞 手打ちカルグクス＆手作りマンドゥ',
      zhName: '明洞 传统手工刀削面与鲜肉水饺',
      tag: '서울 미식 1번지',
      enTag: 'Seoul Must-Eat',
      jaTag: 'ソウル必食グルメ',
      zhTag: '首尔必吃名吃',
      desc: '진하고 깊은 고기 육수에 쫄깃한 면발과 알싸한 마늘 김치가 일품인 60년 전통 명동 칼국수',
      enDesc: 'Rich, savory broth noodles served with punchy garlic kimchi—a legendary 60-year Myeongdong signature.',
      jaDesc: '濃厚な肉スープにもちもち麺、にんにくキムチが絶品の60年伝統明洞カルグクス。',
      zhDesc: '浓郁醇厚的高汤搭配筋道面条与特制蒜香泡菜，60年历史首尔明洞招牌名店。',
      place: '서울 명동 관광특구'
    },
    {
      name: '종로 빈대떡 & 마약김밥',
      enName: 'Jongno Crispy Mung Bean Pancake & Mini Gimbap',
      jaName: '鐘路 カリカリ緑豆チヂミ＆麻薬キンパ',
      zhName: '钟路 广藏市场香脆绿豆煎饼与一口紫菜包饭',
      tag: '광장시장 필수',
      enTag: 'Gwangjang Market Pick',
      jaTag: '広蔵市場マスト',
      zhTag: '广藏市场超人气',
      desc: '맷돌로 갈아 바삭하게 부쳐낸 고소한 녹두빈대떡과 겨자소스에 찍어먹는 마약김밥',
      enDesc: 'Stone-ground crispy savory mung bean pancakes paired with addictively delicious mini seaweed rolls.',
      jaDesc: '石臼挽き緑豆の香ばしいカリカリチヂミと特製からしタレで食べるやみつきキンパ。',
      zhDesc: '石磨慢磨外酥里嫩的香脆绿豆煎饼，搭配蘸特制芥末酱汁的超人气一口紫菜包饭。',
      place: '서울 종로 광장시장'
    },
    {
      name: '신당동 즉석 떡볶이 & 볶음밥',
      enName: 'Sindangdong Spicy Rice Cake Hotpot & Fried Rice',
      jaName: '新堂洞 即席トッポッキ鍋＆ポックンパ',
      zhName: '新堂洞 即食辣炒年糕火锅与香油炒饭',
      tag: 'K-스트리트 푸드',
      enTag: 'K-Street Food Classic',
      jaTag: 'K-屋台フード',
      zhTag: '韩流街头美食代表',
      desc: '춘장과 고추장의 황금비율 소스에 라면, 쫄면, 튀김만두를 즉석에서 끓여먹는 K-소울푸드',
      enDesc: 'Korea’s favorite soul food hotpot simmered at the table with ramyeon, chewy noodles, and dumplings.',
      jaDesc: '特製コチュジャンソースでラーメン、チョル麺、揚げ餃子を目の前で煮込むK-ソウルフード。',
      zhDesc: '特制甜辣酱与炸酱黄金比例调制，加入拉面、韧面与炸饺子现煮现吃的大众招牌美食。',
      place: '서울 신당동 떡볶이타운'
    }
  ],
  거제: [
    {
      name: '거제 참숯 굴구이 & 굴국밥',
      enName: 'Geoje Charcoal Grilled Fresh Oysters & Oyster Soup',
      jaName: '巨済 炭火焼き生牡蠣＆熱々牡蠣クッパ',
      zhName: '巨济 炭火现烤鲜牡蛎与清甜生蚝汤饭',
      tag: '청정 남해 미식',
      enTag: 'Clean Ocean Gourmet',
      jaTag: '南海の清冷グルメ',
      zhTag: '南海纯净海味',
      desc: '통통하게 살이 오른 청정 해역 굴을 직화로 구워 바다 향을 입안 가득 즐기는 남해의 겨울·사계절 별미',
      enDesc: 'Plump South Sea oysters grilled over open fire, bursting with fresh ocean sweetness.',
      jaDesc: '身がぷりぷりの巨済産生牡蠣を豪快に炭火で焼き上げる贅沢な海の幸。',
      zhDesc: '南海清澈海域饱满肥美的天然生蚝炭火直烤，浓郁海鲜原汁原味鲜甜四溢。',
      place: '거제 남부면 & 거제도 전역'
    },
    {
      name: '거제 멍게비빔밥 & 넙치미역국',
      enName: 'Geoje Fresh Sea Squirt Bibimbap & Seaweed Soup',
      jaName: '巨済 ホヤの海鮮ビビンバ＆ヒラメわかめスープ',
      zhName: '巨济 特鲜海鞘拌饭与比目鱼鲜浓海带汤',
      tag: '해녀 직송',
      enTag: 'Haenyeo Diver Catch',
      jaTag: '海女さん直送',
      zhTag: '海女每日新鲜直采',
      desc: '은은한 바다 향의 숙성 멍게를 참기름과 김가루에 비벼먹는 거제 대표 향토 미식',
      enDesc: 'Fragrant seasoned sea squirt tossed with sesame oil and seaweed over warm rice.',
      jaDesc: '磯の香り豊かな熟成ホヤをごま油と海苔で混ぜていただく巨済の代表郷土料理。',
      zhDesc: '鲜香熟成海鞘搭配纯正香油与海苔碎，入口香醇甘甜的巨济当地特色养生拌饭。',
      place: '거제 포로수용소 근처 & 지세포항'
    },
    {
      name: '거제 바람의 핫도그 & 해물라면',
      enName: 'Geoje Windy Hill Premium Hotdog & Seafood Ramyeon',
      jaName: '巨済 風の丘名物ホットドッグ＆海鮮ラーメン',
      zhName: '巨济 风之丘招牌香脆热狗与豪华海鲜拉面',
      tag: '감성 디저트',
      enTag: 'Trendy Scenic Bite',
      jaTag: '映えカフェスイーツ',
      zhTag: '网红打卡特色小吃',
      desc: '바람의 언덕 바다를 바라보며 즐기는 겉바속촉 수제 핫도그와 통문어 해물라면',
      enDesc: 'Crispy gourmet corn dogs and octopus seafood ramyeon with breathtaking scenic ocean views.',
      jaDesc: '名所「風の丘」の絶景を眺めながら味わうサクサクの特製ホットドッグ。',
      zhDesc: '一边眺望风之丘蔚蓝海岸，一边品尝外酥里嫩的手工特色热狗与整只章鱼拉面。',
      place: '거제 도장포 바람의언덕'
    }
  ],
  부산: [
    {
      name: '자갈치 활어회 & 매운탕',
      enName: 'Jagalchi Fresh Sashimi & Spicy Fish Stew',
      jaName: 'チャガルチ市場 新鮮活魚刺身＆メウンタン',
      zhName: '札嘎其水产市场 现捞活鱼刺身与香辣海鲜锅',
      tag: '자갈치 랜드마크',
      enTag: 'Jagalchi Landmark',
      jaTag: 'チャガルチ名所',
      zhTag: '札嘎其必打卡地标',
      desc: '살아 숨 쉬는 싱싱한 제철 활어회를 바로 썰어 맛보고 얼큰한 매운탕으로 마무리하는 코스',
      enDesc: 'Freshly sliced seasonal sashimi right from the market tanks followed by boiling spicy fish stew.',
      jaDesc: '活気あふれる市場でその場で捌く新鮮な刺身とピリ辛の魚アラ鍋（メウンタン）。',
      zhDesc: '水产市场现捞现切的弹牙新鲜刺身，搭配浓郁鲜甜的热辣海鲜鱼汤完美收尾。',
      place: '부산 자갈치 시장'
    },
    {
      name: '부산 원조 돼지국밥 & 수육',
      enName: 'Busan Pork Rice Soup & Steamed Pork (Dwaeji Gukbap)',
      jaName: '釜山元祖 豚骨テジクッパ＆特製スユク',
      zhName: '釜山正宗 浓厚白汤猪肉汤饭与白切肉拼盘',
      tag: '부산 소울푸드',
      enTag: 'Busan Soul Food',
      jaTag: '釜山ソウルフード',
      zhTag: '釜山灵魂美食',
      desc: '뽀얗게 우려낸 진국 사골 육수에 야들야들한 돼지고기와 부추무침을 듬뿍 넣어 먹는 든든한 한 끼',
      enDesc: 'Rich, comforting pork bone broth simmered for hours, packed with tender sliced pork and chives.',
      jaDesc: 'じっくり煮込んだコク旨豚骨スープに柔らかい豚肉とニラをたっぷり入れて食べる一杯。',
      zhDesc: '慢火熬煮的乳白猪骨浓汤加入软嫩猪肉片与调味韭菜，暖胃满足的釜山招牌代表。',
      place: '서면 돼지국밥 골목 & 광안리'
    },
    {
      name: '남포동 씨앗호떡 & 비빔당면',
      enName: 'Nampodong Seed Hotteok & Spicy Glass Noodles',
      jaName: '南浦洞 シアホットク＆ピリ辛ビビンタンミョン',
      zhName: '南浦洞 坚果糖饼与韩式拌粉条',
      tag: '길거리 먹거리',
      enTag: 'Street Food Star',
      jaTag: '屋台グルメ定番',
      zhTag: '街头特色小吃',
      desc: '해바라기씨와 땅콩이 듬뿍 들어간 고소한 찹쌀호떡과 새콤달콤 매콤한 비빔당면',
      enDesc: 'Sweet chewy pancakes packed with crunchy sunflower seeds alongside spicy seasoned glass noodles.',
      jaDesc: 'ナッツ類がぎっしり詰まった香ばしいホットクと甘酸っぱ辛い春雨料理。',
      zhDesc: '香脆软糯包裹丰富葵花籽坚果的招牌糖饼，搭配开胃爽口的特色拌红薯粉条。',
      place: '남포동 BIFF 광장 & 국제시장'
    }
  ],
  제주: [
    {
      name: '제주 흑돼지 근고기 숯불구이',
      enName: 'Jeju Black Pork Charcoal Thick BBQ',
      jaName: '済州 黒豚炭火焼き＆特製イワシ塩辛タレ',
      zhName: '济州 顶级黑猪厚切炭火烤肉',
      tag: '제주 대표 미식',
      enTag: 'Jeju Signature BBQ',
      jaTag: '済州代表グルメ',
      zhTag: '济州代表顶级美食',
      desc: '두툼한 제주산 흑돼지를 참숯에 구워 멜젓(멸치젓갈 소스)에 찍어먹는 육즙 가득 구이',
      enDesc: 'Thick, succulent Jeju black pork grilled over charcoal and dipped in warm salted anchovy sauce.',
      jaDesc: 'ジューシーな厚切り黒豚を炭火で焼き、特製イワシ塩辛タレにつけて食べる極上肉。',
      zhDesc: '厚切济州土种黑猪经炭火慢烤锁住鲜美肉汁，蘸取特制银鱼酱汁风味醇厚独特。',
      place: '중문관광단지 & 흑돼지거리'
    },
    {
      name: '통갈치 조림 & 은갈치구이',
      enName: 'Jeju Whole Silver Cutlassfish Stew & Grilled Fish',
      jaName: '済州 一本太刀魚の辛煮込み＆塩焼き',
      zhName: '济州 巨型银带鱼炖锅与香烤带鱼',
      tag: '제주 은갈치',
      enTag: 'Silver Cutlassfish',
      jaTag: '済州特産太刀魚',
      zhTag: '济州特产银带鱼',
      desc: '길쭉한 전용 냄비에 전복, 문어와 함께 매콤달콤하게 조려낸 은빛 갈치 요리',
      enDesc: 'Extra-long silver cutlassfish braised with abalone, octopus, and spicy Korean marinade.',
      jaDesc: '専用の長鍋でアワビやタコと一緒に甘辛く煮込んだ豪華な一本太刀魚料理。',
      zhDesc: '特制超长锅中与鲜活鲍鱼、章鱼慢炖的浓香银带鱼，鲜香微辣极其下饭。',
      place: '성산일출봉 근처 & 서귀포항'
    },
    {
      name: '제주 고기국수 & 돔베고기',
      enName: 'Jeju Pork Noodle Soup & Dombe Meat',
      jaName: '済州 コギククス (肉うどん)＆ドムベコギ',
      zhName: '济州 浓汤猪肉面与木板白切肉',
      tag: '전통 향토음식',
      enTag: 'Jeju Heritage Dish',
      jaTag: '伝統郷土料理',
      zhTag: '传统特色乡土名点',
      desc: '담백하고 진한 고기 육수에 중면과 야들야들 삶아낸 돔베고기(도마 위 수육)',
      enDesc: 'Rich pork broth noodles served with tender boiled pork slices placed directly on wooden cutting boards.',
      jaDesc: 'あっさり濃厚な豚スープ麺と、まな板に盛り付けられた柔らかい茹で豚肉。',
      zhDesc: '醇厚清甜的猪肉高汤中面，搭配原木板上桌的热气腾腾鲜嫩白切猪肉。',
      place: '제주시 고기국수 거리'
    }
  ],
  경주: [
    {
      name: '경주 교리김밥 & 잔치국수',
      enName: 'Gyeongju Gyori Egg Ribbon Gimbap & Noodle Soup',
      jaName: '慶州 校里キンパ (薄焼き卵巻き)＆温麺',
      zhName: '庆州 校里厚蛋丝紫菜包饭与温汤面',
      tag: '황리단길 핫플',
      enTag: 'Hwangnidan-gil Pick',
      jaTag: '皇理団通り名物',
      zhTag: '皇理团路人气打卡',
      desc: '폭신폭신한 달걀지단이 가득 들어가 부드럽고 담백한 맛이 일품인 50년 전통 김밥',
      enDesc: 'Stuffed with hundreds of fluffy, finely sliced egg ribbons for an incredibly light and savory flavor.',
      jaDesc: 'ふわふわの錦糸卵がぎっしり入った、まろやかで優しい味わいの50年伝統キンパ。',
      zhDesc: '包裹满满松软细腻蛋皮丝，口感蓬松清香绵密，50年历史的庆州传奇紫菜包饭。',
      place: '경주 황리단길 & 교촌마을'
    },
    {
      name: '황남빵 & 찰보리빵',
      enName: 'Hwangnam Red Bean Pastry & Barley Bread',
      jaName: '皇南パン (薄皮あんぱん)＆チャルボリパン',
      zhName: '皇南 红豆薄皮小饼与糯大麦红豆铜锣烧',
      tag: '경주 대표 디저트',
      enTag: 'Gyeongju Sweet Heritage',
      jaTag: '慶州伝統スイーツ',
      zhTag: '庆州传统伴手礼代表',
      desc: '얇은 피 속에 달지 않고 부드러운 팥 앙금이 꽉 들어찬 1939년부터 이어진 한국 대표 전통 빵',
      enDesc: 'Thin pastry crust packed to the brim with naturally sweet, smooth Korean red bean paste since 1939.',
      jaDesc: '薄皮の中に上品な甘さの小豆あんがぎっしり詰まった1939年創業の伝統銘菓。',
      zhDesc: '皮薄如纸且内馅塞满细腻绵密纯红豆沙，始于1939年的韩国代表级传统伴手礼名点。',
      place: '경주 황남동 & 대릉원 주변'
    },
    {
      name: '경주 한우 떡갈비 정식 & 쌈밥',
      enName: 'Gyeongju Hanwoo Beef Tteokgalbi & Organic Ssambap',
      jaName: '慶州 韓牛トッカルビ定食＆有機野菜包みご飯',
      zhName: '庆州 顶级韩牛纯手工烤肉饼全席与包饭',
      tag: '신라 전통 밥상',
      enTag: 'Royal Heritage Table',
      jaTag: '新羅伝統膳',
      zhTag: '新罗王室传统定食',
      desc: '국내산 한우를 정성스럽게 다져 숯불에 구워낸 육즙 가득 떡갈비와 푸짐한 쌈 채소 한 상',
      enDesc: 'Minced premium Korean Hanwoo beef grilled over sweet smoky charcoal, served with fresh wrap greens.',
      jaDesc: '上質な韓牛を手ごねして炭火で香ばしく焼き上げたジューシーな韓国式ハンバーグ定食。',
      zhDesc: '严选优质纯韩牛细密剁碎慢火炭烤，香气四溢汁水充沛，配搭丰富鲜蔬的尊贵全席。',
      place: '경주 보문관광단지'
    }
  ],
  강릉: [
    {
      name: '초당 순두부 짬뽕 & 순두부 젤라또',
      enName: 'Chodang Soft Tofu Seafood Jjamppong & Tofu Gelato',
      jaName: '草堂 スンドゥブ海鮮チャンポン＆豆腐ジェラート',
      zhName: '草堂 纯手工嫩豆腐海鲜辣面与豆腐意式冰淇淋',
      tag: '강릉 시그니처',
      enTag: 'Gangneung Signature',
      jaTag: '江陵名物',
      zhTag: '江陵地标级必吃',
      desc: '동해 바닷물로 빚은 고소한 초당 순두부와 얼큰 불맛 짬뽕의 환상적인 만남',
      enDesc: 'Silky soft tofu curd curdled with clean East Sea seawater mixed into fiery wok-charred spicy soup.',
      jaDesc: '東海の海水で作る香ばしい純豆腐と、スモーキーで辛口な海鮮チャンポンの絶品コラボ。',
      zhDesc: '采用东海洁净深层海水凝固的点卤嫩豆腐，与镬气十足的海鲜辣汤面的超人气碰撞。',
      place: '강릉 초당 순두부마을'
    },
    {
      name: '강릉 장칼국수 & 감자전',
      enName: 'Gangneung Spicy Gochujang Kalguksu & Potato Pancake',
      jaName: '江陵 コチュジャンカルグクス＆ジャガイモチヂミ',
      zhName: '江陵 传统香浓辣椒酱手擀刀削面与纯土豆饼',
      tag: '강원도 전통',
      enTag: 'Gangwon Heritage',
      jaTag: '江原道伝統の味',
      zhTag: '江原道传统风味',
      desc: '칼칼하고 구수한 고추장·된장 베이스 육수에 끓여낸 강릉 대표 힐링 면 요리',
      enDesc: 'Hearty noodles boiled in deep, comforting spicy red pepper & soybean paste broth.',
      jaDesc: 'ピリ辛のコチュジャンと味噌を合わせた濃厚スープで煮込む江陵の代表あったか麺。',
      zhDesc: '以香辣辣椒酱与大酱为汤底慢熬的手擀面，汤汁浓郁醇香，江原道招牌暖胃美食。',
      place: '강릉 중앙시장 & 시내 맛집거리'
    },
    {
      name: '주문진 오징어순대 & 모둠물회',
      enName: 'Jumunjin Stuffed Squid Sundae & Cold Sashimi Soup',
      jaName: '注文津 イカスンデ (イカ飯風)＆冷製刺身ムルフェ',
      zhName: '注文津 鱿鱼米肠与综合冷汤海鲜刺身',
      tag: '동해안 해산물',
      enTag: 'East Coast Seafood',
      jaTag: '東海岸の獲れたて魚介',
      zhTag: '东海岸新鲜水产',
      desc: '신선한 통오징어 속에 채소와 당면을 채워 노릇하게 계란물 입혀 구워낸 별미',
      enDesc: 'Fresh whole squid stuffed with vegetables and glass noodles, dipped in egg wash and pan-fried.',
      jaDesc: '新鮮な丸ごとイカに野菜と春雨を詰め、卵をつけて香ばしく焼き上げた名物料理。',
      zhDesc: '整只新鲜鱿鱼包裹蔬菜与红薯粉条，裹上金黄蛋液现煎至香脆诱人的特色海味。',
      place: '강릉 주문진항 & 안목 해변'
    }
  ],
  전주: [
    {
      name: '전주 전통 놋그릇 비빔밥',
      enName: 'Jeonju Royal Brass Bowl Bibimbap',
      jaName: '全州 伝統真鍮器の本格ビビンバ',
      zhName: '全州 传统黄铜碗正宗全席拌饭',
      tag: '유네스코 미식도시',
      enTag: 'UNESCO City of Gastronomy',
      jaTag: 'ユネスコ美食都市',
      zhTag: '联合国教科文组织美食之都',
      desc: '사골 육수로 지은 밥에 황포묵, 육회, 나물 등 10여 가지 고명이 어우러진 한국 최고의 비빔밥',
      enDesc: 'Rice cooked in beef bone stock crowned with fresh beef tartare, seasonal vegetables, and yellow jelly.',
      jaDesc: '牛骨スープで炊いたご飯にユッケや旬のナムルなど彩り豊かな具材が乗った王道ビビンバ。',
      zhDesc: '牛骨高汤焖制米饭，搭配鲜甜韩牛生肉刺身、黄绿豆凉粉与十余种时令山野菜的至尊名馔。',
      place: '전주 한옥마을'
    },
    {
      name: '전주 콩나물국밥 & 모주',
      enName: 'Jeonju Bean Sprout Rice Soup & Warm Herbal Moju',
      jaName: '全州 もやしクッパ＆伝統薬膳酒モジュ',
      zhName: '全州 爽脆黄豆芽汤饭与低度暖胃母酒',
      tag: '아침 해장 1위',
      enTag: 'Morning Hangover Cure',
      jaTag: '朝の癒やし定番',
      zhTag: '清晨元气暖胃必选',
      desc: '아삭한 전주 특산 콩나물과 수란, 오징어 사리를 넣어 시원하게 끓여낸 최고의 해장 국밥',
      enDesc: 'Crisp locally grown bean sprouts served with poached egg, diced squid, and fragrant warm sweet herbal liquor.',
      jaDesc: 'シャキシャキ豆もやしと温泉卵、イカを入れたあっさりコク深い絶品朝食クッパ。',
      zhDesc: '特选爽脆黄豆芽搭配半熟水波蛋与鲜鱿鱼粒，汤头清澈回甘，配以肉桂生姜甜母酒。',
      place: '전주 남부시장'
    },
    {
      name: '전주 수제 초코파이 & 길거리야 바게트',
      enName: 'Jeonju Handmade Choco Pie & Spicy Baguette',
      jaName: '全州 手作りチョコパイ＆ピリ辛バゲットサンド',
      zhName: '全州 传统手工巧克力派与香辣法棍三明治',
      tag: '한옥마을 디저트',
      enTag: 'Hanok Village Sweets',
      jaTag: '韓屋村スイーツ',
      zhTag: '韩屋村网红甜点',
      desc: '진한 초콜릿 코팅과 딸기잼, 호두가 어우러진 전통 수제 초코파이',
      enDesc: 'Dense chocolate-dipped artisanal pies filled with strawberry jam and crunchy walnuts.',
      jaDesc: '濃厚チョココーティングにいちごジャムとくるみが入った全州名物スイーツ。',
      zhDesc: '纯正浓厚巧克力涂层搭配草莓果酱与核桃仁，香甜醇厚的手工传统巧克力糕点。',
      place: '전주 한옥마을 거리'
    }
  ],
  여수: [
    {
      name: '여수 돌산 갓김치 & 게장백반',
      enName: 'Yeosu Dolsan Mustard Kimchi & Soy Marinated Crab Set',
      jaName: '麗水 突山からし菜キムチ＆醤油・ヤンニョムケジャン定食',
      zhName: '丽水 突山芥菜辛香泡菜与酱蟹全席',
      tag: '여수 밥도둑',
      enTag: 'Rice-Thief Legend',
      jaTag: 'ご飯泥棒',
      zhTag: '米饭杀手绝配',
      desc: '알싸하고 향긋한 돌산 갓김치와 달콤 짭조름한 간장게장·양념게장으로 즐기는 남도 백반',
      enDesc: 'Zesty Dolsan mustard greens paired with sweet, savory soy and chili marinated blue crabs.',
      jaDesc: 'ピリッとした突山名産のからし菜キムチと、とろける甘みの絶品カニ醤油漬け（ケジャン）。',
      zhDesc: '丽水突山特产脆爽微辣雪里蕻泡菜，搭配鲜嫩入味甜咸兼备的秘制生腌酱蟹套餐。',
      place: '여수 게장골목 & 돌산도'
    },
    {
      name: '여수 낭만포차 해물삼합',
      enName: 'Yeosu Romantic Night Market Seafood Samhap (Pork, Octopus, Kimchi)',
      jaName: '麗水 浪漫屋台 海鮮サムハプ (豚肉・タコ・キムチ炒め)',
      zhName: '丽水 浪漫夜市海鲜五花肉泡菜三合铁板烧',
      tag: '여수 밤바다 핫플',
      enTag: 'Yeosu Night View Hotspot',
      jaTag: '夜景名物屋台',
      zhTag: '丽水夜景超人气排档',
      desc: '돌문어, 전복, 관자와 삼겹살, 갓김치를 철판에서 함께 볶아내는 여수 밤바다 대표 요리',
      enDesc: 'Tender octopus, abalone, pork belly, and mustard kimchi stir-fried together against coastal views.',
      jaDesc: 'タコ、アワビ、豚バラ肉、からし菜キムチを鉄板で豪快に炒める夜景屋台の看板メニュー。',
      zhDesc: '鲜活章鱼、鲍鱼、鲜贝与五花肉、芥菜泡菜同锅铁板现炒，丽水海滨夜市王牌代表。',
      place: '여수 거북선대교 낭만포차거리'
    },
    {
      name: '여수 하모(갯장어) 샤브샤브',
      enName: 'Yeosu Fresh Sea Eel (Hamo) Shabu-Shabu',
      jaName: '麗水 旬のハモ (鱧) しゃぶしゃぶ',
      zhName: '丽水 鲜甜海鳗(Hamo)药膳清汤涮涮锅',
      tag: '여름·사계절 보양식',
      enTag: 'Health & Vitality Dine',
      jaTag: '最高級スタミナ料理',
      zhTag: '高级清爽四季滋补',
      desc: '담백한 약재 육수에 칼집 낸 신선한 갯장어를 살짝 데쳐 양파와 쌈장으로 싸 먹는 고급 보양식',
      enDesc: 'Delicately scored fresh sea eel gently poached in hot broth, eaten wrapped in sweet fresh onion.',
      jaDesc: '薬膳スープにさっとくぐらせて花のように開く鱧を、生玉ねぎに包んで食べる絶品スタミナ食。',
      zhDesc: '刀工细腻的鲜活海鳗片在清甜药膳汤中轻涮即化成白花，配以生甜洋葱与特调蘸酱。',
      place: '여수 경도 & 국동항'
    }
  ],
  속초: [
    {
      name: '속초 아바이순대 & 오징어순대',
      enName: 'Sokcho Abai Village Pork & Pan-Fried Squid Sundae',
      jaName: '束草 アバイスンデ＆香ばしいイカスンデ焼き',
      zhName: '束草 阿爸村传统大肠米肠与金黄鱿鱼米肠',
      tag: '아바이마을 명물',
      enTag: 'Abai Village Specialty',
      jaTag: 'アバイ村名物',
      zhTag: '阿爸村经典名吃',
      desc: '오징어 몸통에 찹쌀과 채소를 채워 계란물에 부쳐낸 오징어순대와 담백한 아바이순대',
      enDesc: 'Tender squid tubes filled with glutinous rice, dipped in egg and fried golden on the griddle.',
      jaDesc: 'イカの身にもち米と野菜を詰めて香ばしく焼いたイカスンデと伝統の具沢山スンデ。',
      zhDesc: '以饱满鲜鱿鱼填入糯米与多种蔬菜煎至金黄酥香，搭配传统阿爸村经典风味米肠。',
      place: '속초 아바이마을 & 갯배 선착장'
    },
    {
      name: '속초 항구 모둠물회 & 닭강정',
      enName: 'Sokcho Port Cold Assorted Raw Fish Soup & Sweet Crisp Chicken',
      jaName: '束草 港町の海鮮盛り合わせムルフェ＆特製タッカンジョン',
      zhName: '束草 综合冷汤生鱼片与香脆甜辣炸鸡块',
      tag: '속초 관광 1순위',
      enTag: 'Sokcho Must-Try',
      jaTag: '束草観光No.1',
      zhTag: '束草旅游超人气榜首',
      desc: '신선한 해삼, 전복, 활어회에 새콤매콤 슬러시 육수를 부어 먹는 모둠물회와 바삭한 닭강정',
      enDesc: 'Refreshing iced spicy fish soup loaded with sea cucumber and abalone alongside famous crispy chicken.',
      jaDesc: 'アワビやナマコ、新鮮な刺身にひんやり甘酸っぱいスープを注ぐムルフェと人気チキン。',
      zhDesc: '冰爽酸辣碎冰红汤融入海参、鲍鱼与鲜鱼刺身，搭配冷热皆酥脆爽口的束草招牌炸鸡块。',
      place: '속초 중앙시장 & 봉포 머구리집'
    },
    {
      name: '동명항 대게찜 & 게딱지 볶음밥',
      enName: 'Dongmyeong Port Steamed Snow Crab & Crab Fried Rice',
      jaName: '東明港 ズワイガニ蒸し＆甲羅みそチャーハン',
      zhName: '东明港 鲜甜清蒸雪蟹与浓郁蟹盖香油炒饭',
      tag: '동해 대게 만찬',
      enTag: 'Snow Crab Feast',
      jaTag: '東海の蟹三昧',
      zhTag: '东海雪蟹海鲜盛宴',
      desc: '살이 꽉 찬 동해안 대게를 바로 쪄내어 달콤한 게살과 고소한 게딱지 볶음밥으로 즐기는 만찬',
      enDesc: 'Freshly steamed sweet East Sea snow crab served with fragrant rice stir-fried inside the crab shell.',
      jaDesc: '身がぎっしり詰まった蒸し立てのズワイガニと、濃厚な蟹味噌で炒める香ばしい甲羅ご飯。',
      zhDesc: '新鲜肥美的清蒸东海雪蟹肉质鲜甜弹牙，拌入蟹黄蟹膏现炒的热腾腾米饭香醇无比。',
      place: '속초 동명항 & 대포항'
    }
  ],
  수원: [
    {
      name: '수원 정통 왕갈비구이 & 갈비탕',
      enName: 'Suwon Royal Giant Grilled Beef Ribs & Soup',
      jaName: '水原 伝統の王カルビ炭火焼き＆濃厚カルビタンスープ',
      zhName: '水原 正统王牛排炭火烧烤与清炖牛排骨汤',
      tag: '수원 3대 갈비',
      enTag: 'Suwon Ribs Heritage',
      jaTag: '水原3大カルビ',
      zhTag: '水原三大烤牛排传承',
      desc: '소금 양념으로 본연의 육향을 극대화하여 참숯에 구워내는 부드럽고 웅장한 수원 대표 왕갈비',
      enDesc: 'Massive, tender beef ribs seasoned in light sea salt to highlight pure beef flavors over charcoal.',
      jaDesc: '素材本来の旨味を引き出す特製塩タレで炭火焼きする、柔らかく大迫力の水原王カルビ。',
      zhDesc: '以纯正天然海盐与秘制酱料引出牛肉原香，大块炭火慢烤的鲜嫩多汁水原代表级王牛排。',
      place: '수원 화성 행궁 주변 & 인계동'
    },
    {
      name: '수원 통닭거리 가마솥 통닭',
      enName: 'Suwon Cauldron Whole Crisp Fried Chicken',
      jaName: '水原 チキン通り 鉄釜丸揚げチキン',
      zhName: '水原 炸鸡一条街传统大铁锅香酥炸全鸡',
      tag: '통닭거리 명물',
      enTag: 'Chicken Street Star',
      jaTag: 'チキン通りの名物',
      zhTag: '炸鸡一条街老字号',
      desc: '무쇠 가마솥의 높은 온도로 튀겨내 겉은 바삭하고 속은 촉촉한 50년 전통 옛날 통닭과 왕갈비통닭',
      enDesc: 'Crisp whole chicken deep-fried in traditional cast-iron cauldrons, including the famous galbi-sauce flavor.',
      jaDesc: '高温の鉄釜で揚げることで外はカリカリ、中はジューシーな50年伝統の元祖チキン。',
      zhDesc: '传统铸铁大釜高温现炸，外皮极其香脆肉质多汁，涵盖经典原味与风靡的特制王牛排炸鸡。',
      place: '수원 팔달문 통닭거리'
    },
    {
      name: '지동시장 순대타운 철판 순대곱창볶음',
      enName: 'Jidong Market Sundae Town Stir-Fried Pork Intestines',
      jaName: '池洞市場 スンデタウン 鉄板スンデホルモン炒め',
      zhName: '池洞市场 米肠小镇铁板辣炒米肠牛肚粉条',
      tag: '수원 시장 명소',
      enTag: 'Market Foodie Hotspot',
      jaTag: '伝統市場の名所',
      zhTag: '传统集市人气街区',
      desc: '매콤달콤한 양념에 깻잎, 들깨가루, 쫄깃한 당면과 함께 볶아먹는 40년 전통 순대철판볶음',
      enDesc: 'Chewy glass noodles, sundae sausage, perilla leaves, and savory chili paste on a sizzling plate.',
      jaDesc: 'エゴマの葉と特製辛口タレで香ばしく炒める40年伝統のボリューム満点鉄板料理。',
      zhDesc: '搭配香浓芝麻叶、野苏子粉与红薯宽粉，在热铁板上翻炒出浓郁香辣滋味的40年经典名吃。',
      place: '수원 지동시장 순대타운'
    }
  ]
};

const MODAL_I18N = {
  ko: {
    headerTitle: 'AI 지역별 대표 맛집 & K-패션 코디 가이드',
    badge: '16개 권역 향토 미식',
    headerSub: '대한민국 16개 권역 대표 향토 미식과 사진 잘 나오는 K-패션 스타일링',
    cityLabel: '지역:',
    foodTab: '[{city}] 대표 시그니처 미식 (3선)',
    outfitTab: '[{city}] 여행 K-패션 코디 팁',
    outfitHeader: '[{city}] 도심 & 자연 관광 인생샷 K-스타일링',
    photoTipTitle: '촬영 꿀팁',
    photoTipDesc: '명소의 푸른 바다/전통 기와 배경과 대비되는 밝은 아이보리, 파스텔 톤 또는 모던 캐주얼 셋업을 추천합니다.',
    shoesTipTitle: '발 편한 여행 슈즈',
    shoesTipDesc: '하루 평균 1만 보 이상 걷는 관광 코스 특성상 푹신한 쿠셔닝 스니커즈나 워킹화가 필수입니다.',
    hanbokTipTitle: '한복 체험 팁',
    hanbokTipDesc: '경복궁(서울), 한옥마을(전주), 황리단길(경주) 등 전통 명소에서는 한복 대여 착용 시 고궁 무료입장 혜택이 적용됩니다!',
    askBtn: '제미나이에게 [{city}] 1:1 맛집·코디 질문하기 ➔',
    closeBtn: '닫기',
    geminiPrompt: '{city} 현지인 추천 진짜 맛집과 감성 카페, 날씨 맞춤 코디 알려줘'
  },
  en: {
    headerTitle: 'AI Regional Gourmet & K-Fashion Guide',
    badge: '16 Regions Cuisine',
    headerSub: 'Authentic regional culinary delights and photogenic K-styling tips across Korea',
    cityLabel: 'City:',
    foodTab: '[{city}] Signature Food Top 3',
    outfitTab: '[{city}] K-Fashion Styling Tips',
    outfitHeader: '[{city}] Urban & Scenic K-Styling Photo Tips',
    photoTipTitle: 'Photo Tip',
    photoTipDesc: 'Wear bright ivory, pastel tones, or smart casual outfits that contrast beautifully with blue seas and traditional tiled roof landscapes.',
    shoesTipTitle: 'Comfortable Footwear',
    shoesTipDesc: 'Since walking 10,000+ steps a day is common, cushioned sneakers or walking shoes are essential.',
    hanbokTipTitle: 'Hanbok Benefit',
    hanbokTipDesc: 'At major traditional sites like Gyeongbokgung Palace (Seoul) and Hanok Villages (Jeonju/Gyeongju), wearing a rented Hanbok grants FREE royal palace admission!',
    askBtn: 'Ask Gemini AI 1:1 for {city} Food & Fashion ➔',
    closeBtn: 'Close',
    geminiPrompt: 'Recommend authentic local gourmet restaurants, trendy cafes, and weather styling tips for {city}'
  },
  ja: {
    headerTitle: 'AI 地域別名物グルメ＆K-ファッション案内',
    badge: '16地域 郷土グルメ',
    headerSub: '韓国各地域の郷土グルメと写真映えするK-ファッションスタイル',
    cityLabel: '地域:',
    foodTab: '[{city}] 代表シグネチャーグルメ (3選)',
    outfitTab: '[{city}] 旅行K-ファッションコーデ',
    outfitHeader: '[{city}] 街歩き＆自然観光 映えK-スタイリング',
    photoTipTitle: '撮影のコツ',
    photoTipDesc: '青い海や伝統的な瓦屋根の風景と美しく調和する明るいアイボリーやパステルカラー、きれいめカジュアルコーデがおすすめです。',
    shoesTipTitle: '快適な靴',
    shoesTipDesc: '1日平均1万歩以上歩く観光コースのため、クッション性の高いスニーカーやウォーキングシューズが必須です。',
    hanbokTipTitle: '韓服(チマチョゴリ)特典',
    hanbokTipDesc: '景福宮(ソウル)や韓屋村(全州・慶州)など伝統名所では、レンタル韓服を着用して入場すると古宮の入場料が無料になります！',
    askBtn: 'Geminiに [{city}] 1:1 グルメ・コーデを質問 ➔',
    closeBtn: '閉じる',
    geminiPrompt: '{city}の地元民おすすめ名店グルメ・感性カフェ・天気別服装コーデを教えて'
  },
  zh: {
    headerTitle: 'AI 地区特色美食与韩系穿搭指南',
    badge: '16大区域地道名吃',
    headerSub: '韩国精选地道特色美食与上镜韩风服饰搭配技巧',
    cityLabel: '地区:',
    foodTab: '[{city}] 精选特色美食 (前3名)',
    outfitTab: '[{city}] 旅行韩系穿搭建议',
    outfitHeader: '[{city}] 都市与风景名胜绝美韩系拍照穿搭',
    photoTipTitle: '拍照建议',
    photoTipDesc: '建议选择明亮米白色、温柔马卡龙色系或利落韩系休闲套装，与蓝海和传统瓦房背景形成绝美对比。',
    shoesTipTitle: '舒适鞋履',
    shoesTipDesc: '韩国游览平均每日步行超1万步，轻便且缓震良好的运动鞋或健步鞋必不可少。',
    hanbokTipTitle: '韩服体验特权',
    hanbokTipDesc: '在首尔景福宫、全州韩屋村及庆州等传统古迹，身着租赁的韩服可直接享受免门票免费入宫特权！',
    askBtn: '向 Gemini AI 1对1 咨询 [{city}] 美食穿搭 ➔',
    closeBtn: '关闭',
    geminiPrompt: '请推荐{city}当地人必吃美食餐厅、人气网红咖啡馆及天气穿搭建议'
  },
  zht: {
    headerTitle: 'AI 地區特色美食與韓系穿搭指南',
    badge: '16大區域地道名吃',
    headerSub: '韓國精選地道特色美食與上鏡韓風服飾搭配技巧',
    cityLabel: '地區:',
    foodTab: '[{city}] 精選特色美食 (前3名)',
    outfitTab: '[{city}] 旅行韓系穿搭建議',
    outfitHeader: '[{city}] 都市與風景名勝絕美韓系拍照穿搭',
    photoTipTitle: '拍照建議',
    photoTipDesc: '建議選擇明亮米白色、溫柔馬卡龍色系或俐落韓系休閒套裝，與藍海和傳統瓦房背景形成絕美對比。',
    shoesTipTitle: '舒適鞋履',
    shoesTipDesc: '韓國遊覽平均每日步行超1萬步，輕便且緩震良好的運動鞋或健步鞋必不可少。',
    hanbokTipTitle: '韓服體驗特權',
    hanbokTipDesc: '在首爾景福宮、全州韓屋村及慶州等傳統古蹟，身著租賃的韓服可直接享受免門票免費入宮特權！',
    askBtn: '向 Gemini AI 1對1 諮詢 [{city}] 美食穿搭 ➔',
    closeBtn: '關閉',
    geminiPrompt: '請推薦{city}當地人必吃美食餐廳、人氣網紅咖啡館及天氣穿搭建議'
  },
  de: {
    headerTitle: 'AI Regionale Gourmet- & K-Fashion-Guide',
    badge: '16 Regionen Spezialitäten',
    headerSub: 'Authentische regionale kulinarische Highlights und Fototipps für K-Fashion',
    cityLabel: 'Stadt:',
    foodTab: '[{city}] Top 3 Spezialitäten',
    outfitTab: '[{city}] K-Fashion Styling-Tipps',
    outfitHeader: '[{city}] K-Fashion Foto-Tipps für Städte & Natur',
    photoTipTitle: 'Foto-Tipp',
    photoTipDesc: 'Helle Creme- und Pastelltöne oder Smart-Casual Outfits harmonieren perfekt mit dem blauen Meer und traditioneller Architektur.',
    shoesTipTitle: 'Bequemes Schuhwerk',
    shoesTipDesc: 'Da man bei Besichtigungen oft über 10.000 Schritte am Tag geht, sind bequeme Sneaker unerlässlich.',
    hanbokTipTitle: 'Hanbok-Vorteil',
    hanbokTipDesc: 'An traditionellen Orten wie dem Gyeongbokgung (Seoul) und Hanok-Dörfern (Jeonju/Gyeongju) ist der Palasteintritt im gemieteten Hanbok KOSTENLOS!',
    askBtn: 'Gemini AI 1:1 nach {city} Essen & Mode fragen ➔',
    closeBtn: 'Schließen',
    geminiPrompt: 'Empfehle authentische lokale Restaurants, Cafés und wettergerechte K-Fashion-Tipps für {city}'
  },
  fr: {
    headerTitle: 'Guide Gastronomique Régional & K-Fashion par IA',
    badge: 'Spécialités de 16 Régions',
    headerSub: 'Délices culinaires régionaux authentiques et conseils de style K-Fashion',
    cityLabel: 'Ville:',
    foodTab: '[{city}] Top 3 Spécialités',
    outfitTab: '[{city}] Conseils de Style K-Fashion',
    outfitHeader: '[{city}] Conseils Photos & K-Style Urbain et Nature',
    photoTipTitle: 'Conseil Photo',
    photoTipDesc: 'Privilégiez les tons ivoire, pastel ou décontractés chics qui contrastent harmonieusement avec la mer et les toits traditionnels.',
    shoesTipTitle: 'Chaussures Confortables',
    shoesTipDesc: 'Avec plus de 10 000 pas par jour en visite, des baskets confortables sont indispensables.',
    hanbokTipTitle: 'Avantage Hanbok',
    hanbokTipDesc: 'Dans les palais comme Gyeongbokgung (Séoul) ou les villages Hanok, le port du Hanbok loué offre l\'entrée GRATUITE !',
    askBtn: 'Demander à Gemini IA pour {city} Gastronomie & Mode ➔',
    closeBtn: 'Fermer',
    geminiPrompt: 'Recommande les meilleurs restaurants locaux authentiques, cafés tendance et conseils de tenue pour {city}'
  },
  es: {
    headerTitle: 'Guía Gastronómica Regional y K-Fashion con IA',
    badge: '16 Regiones Gastronómicas',
    headerSub: 'Delicias culinarias tradicionales y consejos de estilo K-Fashion fotogénico',
    cityLabel: 'Ciudad:',
    foodTab: '[{city}] Top 3 Gastronomía',
    outfitTab: '[{city}] Consejos de Moda K-Fashion',
    outfitHeader: '[{city}] Consejos de Fotos y K-Style Urbano y Paisajístico',
    photoTipTitle: 'Consejo Fotográfico',
    photoTipDesc: 'Se recomiendan tonos marfil claros, colores pastel o conjuntos casuales modernos que contrasten con el mar azul y tejados tradicionales.',
    shoesTipTitle: 'Calzado Cómodo',
    shoesTipDesc: 'Dado que se suelen caminar más de 10.000 pasos al día, unas zapatillas acolchadas son indispensables.',
    hanbokTipTitle: 'Beneficio Hanbok',
    hanbokTipDesc: '¡En palacios como Gyeongbokgung (Seúl) y pueblos Hanok (Jeonju/Gyeongju), vestir un Hanbok alquilado otorga ENTRADA GRATUITA!',
    askBtn: 'Preguntar a Gemini IA sobre {city} Comida y Moda ➔',
    closeBtn: 'Cerrar',
    geminiPrompt: 'Recomienda restaurantes auténticos locales, cafeterías con estilo y consejos de vestimenta según el clima para {city}'
  },
  ru: {
    headerTitle: 'ИИ Гид по региональной кухне и K-Fashion',
    badge: 'Кухня 16 регионов',
    headerSub: 'Аутентичные региональные блюда и советы по стильной корейской моде для фото',
    cityLabel: 'Город:',
    foodTab: '[{city}] Топ-3 блюда региона',
    outfitTab: '[{city}] Советы по стилю K-Fashion',
    outfitHeader: '[{city}] Советы по фото и стилю для города и природы',
    photoTipTitle: 'Совет для фото',
    photoTipDesc: 'Рекомендуются светлые тона слоновой кости, пастельные оттенки или стиль smart casual, гармонирующие с морем и традиционными черепичными крышами.',
    shoesTipTitle: 'Удобная обувь',
    shoesTipDesc: 'В туристических поездках легко пройти более 10 000 шагов в день, поэтому мягкие кроссовки просто необходимы.',
    hanbokTipTitle: 'Бонус за ханбок',
    hanbokTipDesc: 'В королевских дворцах, таких как Кёнбоккун (Сеул), и деревнях ханок (Чонджу/Кёнджу), при аренде ханбока вход БЕСПЛАТНЫЙ!',
    askBtn: 'Спросить Gemini ИИ о еде и моде в {city} ➔',
    closeBtn: 'Закрыть',
    geminiPrompt: 'Посоветуй лучшие аутентичные рестораны, стильные кафе и советы по одежде для погоды в городе {city}'
  }
};

export default function FoodOutfitModal({ isOpen, onClose, lang = 'ko', initialCity = '서울' }) {
  if (!isOpen) return null;

  const [selectedCity, setSelectedCity] = useState(initialCity || '서울');
  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'outfit'
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 640 : false;

  const fmt = MODAL_I18N[lang] || MODAL_I18N.en;
  const currentCityName = getCityName(selectedCity, lang);

  const foods = REGIONAL_FOOD_DATA[selectedCity] || REGIONAL_FOOD_DATA['서울'];

  const handleAskGemini = () => {
    onClose();
    const promptText = fmt.geminiPrompt.replace('{city}', currentCityName);
    window.dispatchEvent(new CustomEvent('vora-trigger-quick-prompt', {
      detail: { prompt: promptText }
    }));
    const inputEl = document.querySelector('textarea') || document.querySelector('input[type="text"]');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const modalNode = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000000,
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: isMobile ? '0' : '1rem',
      boxSizing: 'border-box'
    }}>
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: isMobile ? '92vh' : '90vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderRadius: isMobile ? '24px 24px 0 0' : '24px',
          border: '1.5px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: isMobile ? '0.85rem 1rem' : '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: isMobile ? '34px' : '38px',
              height: isMobile ? '34px' : '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)',
              flexShrink: 0
            }}>
              <Utensils size={isMobile ? 18 : 20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: isMobile ? '0.98rem' : '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  {fmt.headerTitle}
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#ea580c',
                  background: 'rgba(234, 88, 12, 0.1)',
                  border: '1px solid rgba(234, 88, 12, 0.25)',
                  padding: '0.08rem 0.4rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap'
                }}>
                  {fmt.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', margin: '0.1rem 0 0 0' }}>
                {fmt.headerSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={fmt.closeBtn}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted, #64748b)',
              padding: '0.35rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* City Filter Pills */}
        <div style={{
          padding: '0.65rem 1.2rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          gap: '0.45rem',
          overflowX: 'auto',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          scrollbarWidth: 'none'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
            <MapPin size={13} /> {fmt.cityLabel}
          </span>
          {POPULAR_CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: selectedCity === city ? 800 : 600,
                border: selectedCity === city ? '1.5px solid #ea580c' : '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: selectedCity === city ? '#ea580c' : 'var(--bg-primary, #ffffff)',
                color: selectedCity === city ? '#ffffff' : 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>

        {/* Tab Selector */}
        <div style={{
          padding: '0.6rem 1.2rem',
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          backgroundColor: 'var(--bg-primary, #ffffff)'
        }}>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              flex: 1,
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              border: activeTab === 'food' ? '1.5px solid #ea580c' : '1px solid var(--border-color, #e2e8f0)',
              backgroundColor: activeTab === 'food' ? 'rgba(234, 88, 12, 0.08)' : 'transparent',
              color: activeTab === 'food' ? '#ea580c' : 'var(--text-muted, #64748b)',
              cursor: 'pointer'
            }}
          >
            <Utensils size={14} />
            <span>{fmt.foodTab.replace('{city}', currentCityName)}</span>
          </button>

          <button
            onClick={() => setActiveTab('outfit')}
            style={{
              flex: 1,
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              border: activeTab === 'outfit' ? '1.5px solid #9333ea' : '1px solid var(--border-color, #e2e8f0)',
              backgroundColor: activeTab === 'outfit' ? 'rgba(147, 51, 234, 0.08)' : 'transparent',
              color: activeTab === 'outfit' ? '#9333ea' : 'var(--text-muted, #64748b)',
              cursor: 'pointer'
            }}
          >
            <Shirt size={14} />
            <span>{fmt.outfitTab.replace('{city}', currentCityName)}</span>
          </button>
        </div>

        {/* Body Content */}
        <div style={{
          padding: '1.2rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}>
          {activeTab === 'food' ? (
            foods.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-color, #e2e8f0)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#ea580c',
                    background: 'rgba(234, 88, 12, 0.1)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {lang === 'en' || lang === 'de' || lang === 'fr' || lang === 'es' || lang === 'ru' ? (item.enTag || item.tag) : lang === 'ja' ? (item.jaTag || item.tag) : lang === 'zh' || lang === 'zht' ? (item.zhTag || item.tag) : item.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPin size={12} color="#ea580c" />
                    {lang !== 'ko' ? (getTranslatedAddress(item.place, lang) || getTranslatedTitle(item.place, lang) || item.place) : item.place}
                  </span>
                </div>

                <div style={{ fontSize: '1.02rem', fontWeight: 900, color: 'var(--text-main, #0f172a)' }}>
                  {lang === 'en' || lang === 'de' || lang === 'fr' || lang === 'es' || lang === 'ru' ? (item.enName || item.name) : lang === 'ja' ? (item.jaName || item.name) : lang === 'zh' || lang === 'zht' ? (item.zhName || item.name) : item.name}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #475569)', lineHeight: 1.45 }}>
                  {lang === 'en' || lang === 'de' || lang === 'fr' || lang === 'es' || lang === 'ru' ? (item.enDesc || item.desc) : lang === 'ja' ? (item.jaDesc || item.desc) : lang === 'zh' || lang === 'zht' ? (item.zhDesc || item.desc) : item.desc}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#9333ea', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shirt size={18} />
                  <span>{fmt.outfitHeader.replace('{city}', currentCityName)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  📸 <strong>{fmt.photoTipTitle}</strong>: {fmt.photoTipDesc}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  👟 <strong>{fmt.shoesTipTitle}</strong>: {fmt.shoesTipDesc}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                borderRadius: '16px',
                border: '1.5px dashed rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                fontSize: '0.78rem',
                color: '#6b21a8',
                lineHeight: 1.45
              }}>
                ✨ <strong>{fmt.hanbokTipTitle}</strong>: {fmt.hanbokTipDesc}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Gemini 1:1 Prompt Trigger Button */}
        <div style={{
          padding: '0.85rem 1.4rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          backgroundColor: 'var(--bg-secondary, #f8fafc)'
        }}>
          <button
            onClick={handleAskGemini}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
            }}
          >
            <Sparkles size={16} />
            <span>🤖 {fmt.askBtn.replace('{city}', currentCityName)}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {fmt.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
