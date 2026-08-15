import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Utensils, Shirt, Sparkles, X, MapPin, ExternalLink, ChevronRight, MessageSquare, Flame, Check } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

const POPULAR_CITIES = [
  '서울', '거제', '부산', '제주', '경주', '강릉', '전주', '여수', '속초', '수원'
];

const CITY_I18N = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾' },
  '거제': { en: 'Geoje', ja: '巨済', zh: '巨济', zht: '巨濟' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州' },
  '경주': { en: 'Gyeongju', ja: '慶州', zh: '庆州', zht: '慶州' },
  '강릉': { en: 'Gangneung', ja: '江陵', zh: '江陵', zht: '江陵' },
  '전주': { en: 'Jeonju', ja: '全州', zh: '全州', zht: '全州' },
  '여수': { en: 'Yeosu', ja: '麗水', zh: '丽水', zht: '麗水' },
  '속초': { en: 'Sokcho', ja: '束草', zh: '束草', zht: '束草' },
  '수원': { en: 'Suwon', ja: '水原', zh: '水原', zht: '水原' }
};

export function getCityName(city, lang = 'ko') {
  if (CITY_I18N[city] && CITY_I18N[city][lang]) {
    return CITY_I18N[city][lang];
  }
  return city;
}

// Curated Regional Signature Food Data
const REGIONAL_FOOD_DATA = {
  서울: [
    { name: '종로·광장시장 마약김밥 & 빈대떡', enName: 'Gwangjang Market Mini Gimbap & Mung Bean Pancake (Bindaetteok)', jaName: '広蔵市場 麻薬キンパ＆緑豆ピンデトック', zhName: '广藏市场 迷你紫菜包饭与绿豆煎饼', tag: 'K-스트리트푸드', enTag: 'K-Street Food', jaTag: 'K-屋台グルメ', zhTag: '韩国街头美食', desc: '바삭한 녹두빈대떡과 겨자소스에 찍어먹는 원조 마약김밥', enDesc: 'Crispy savory mung bean pancakes paired with famous mini gimbap dipped in mustard sauce.', jaDesc: 'カリカリの緑豆ピンデトックと特製マスタードタレで味わう麻薬キンパ。', zhDesc: '香脆绿豆煎饼配以招牌芥末酱蘸食的迷你紫菜包饭。', place: '종로 광장시장' },
    { name: '명동 명품 설렁탕 & 칼국수', enName: 'Myeongdong Ox Bone Soup (Seolleongtang) & Kalguksu', jaName: '明洞 ソルロンタン＆カルグクス', zhName: '明洞 经典雪浓汤与手工刀切面', tag: '정통 한식', enTag: 'Authentic K-Food', jaTag: '正統派韓国料理', zhTag: '正宗韩式料理', desc: '진한 사골 육수에 부드러운 양지와 겉절이 김치의 환상 조합', enDesc: 'Rich ox bone broth with tender beef slices and freshly made kimchi.', jaDesc: 'コク深い牛骨スープに柔らかい牛肉と浅漬けキムチの絶妙なハーモニー。', zhDesc: '浓郁牛骨高汤搭配鲜嫩牛肉片与现拌爽口泡菜。', place: '명동 음식문화거리' },
    { name: '신당동 원조 즉석 떡볶이', enName: 'Sindang-dong Original Tabletop Tteokbokki', jaName: '新堂洞 元祖トッポッキ鍋', zhName: '新堂洞 原祖即食炒年糕锅', tag: 'K-분식', enTag: 'K-Snack', jaTag: 'K-スナック', zhTag: '韩国特色小吃', desc: '고추장과 춘장 베이스의 감칠맛 넘치는 추억의 즉석 떡볶이', enDesc: 'Flavorful spicy and sweet simmered rice cakes made right at your table.', jaDesc: 'コチュジャンと黒味噌ベースの旨味たっぷりテーブル調理トッポッキ。', zhDesc: '以秘制辣椒酱与甜面酱为底料现煮现吃的人气年糕火锅。', place: '신당동 떡볶이 타운' }
  ],
  거제: [
    { name: '거제 굴구이 & 굴코스 요리', enName: 'Geoje Steamed Fresh Oysters & Course Meal', jaName: '巨済 焼き牡蠣＆牡蠣フルコース', zhName: '巨济 鲜蒸生蚝与生蚝全席', tag: '바다별미', enTag: 'Seafood Specialty', jaTag: '海の味覚', zhTag: '海鲜特色', desc: '청정 거제 바다에서 갓 채취한 싱싱한 굴을 통째로 쪄먹는 별미', enDesc: 'Freshly harvested plump oysters steamed directly from Geoje clean sea waters.', jaDesc: '巨済の清らかな海で獲れた新鮮な牡蠣を丸ごと蒸して楽しむ逸品。', zhDesc: '产自巨济清澈海域现捞现蒸的肥美生蚝大餐。', place: '거제도 거제면·칠천도' },
    { name: '거제 멍게·성게 비빔밥', enName: 'Geoje Sea Urchin & Sea Squirt Bibimbap', jaName: '巨済 ウニ・ホヤビビンバ', zhName: '巨济 海胆与海鞘拌饭', tag: '해산물 로컬푸드', enTag: 'Local Seafood', jaTag: '郷土海鮮料理', zhTag: '当地海鲜名吃', desc: '향긋한 바다 내음 가득한 성게알과 멍게를 참기름과 쓱쓱 비벼먹는 별미', enDesc: 'Ocean-scented fresh sea urchin roe and sea squirt mixed with rice and sesame oil.', jaDesc: '海の香り豊かなウニとホヤにごま油をかけて香ばしく混ぜて食べるご馳走。', zhDesc: '满口海香的鲜海胆与海鞘淋上香油拌饭，鲜美无比。', place: '포로수용소 인근 및 지세포항' },
    { name: '바람의 핫도그 & 몽돌 해물라면', enName: 'Windy Hill Hotdog & Mongdol Seafood Ramyeon', jaName: '風の丘名物ホットドッグ＆海鮮ラーメン', zhName: '风之丘特制热狗与海鲜拉面', tag: '인기 디저트', enTag: 'Popular Snack', jaTag: '人気スイーツ', zhTag: '人气名吃', desc: '바람의 언덕 명물 핫도그와 통문어가 들어간 해물 라면', enDesc: 'Famous Windy Hill specialty corn dog and hearty whole octopus ramen.', jaDesc: '風の丘名物ホットドッグとタコが丸ごと入った海鮮ラーメン。', zhDesc: '风之丘标志性脆皮热狗与整只章鱼浓香海鲜拉面。', place: '도장포 마을 & 바람의 언덕' }
  ],
  부산: [
    { name: '부산 원조 돼지국밥', enName: 'Busan Original Pork Soup with Rice (Dwaeji Gukbap)', jaName: '釜山 元祖デジクッパ (豚骨スープご飯)', zhName: '釜山 原祖猪肉汤饭', tag: '부산 소울푸드', enTag: 'Busan Soul Food', jaTag: '釜山ソウルフード', zhTag: '釜山灵魂美食', desc: '뽀얗고 진한 돼지 사골 국물에 부추무침과 다대기를 듬뿍 넣어 먹는 든든한 한끼', enDesc: 'Rich pork bone broth served with tender pork slices, chives, and spicy sauce.', jaDesc: '濃厚な豚骨スープにニラと辛味タレをたっぷり入れて楽しむ釜山の名物。', zhDesc: '浓白猪骨原汤加入鲜嫩猪肉片、拌韭菜与秘制辣酱的暖心一餐。', place: '서면 국밥골목 & 해운대' },
    { name: '해운대·초량 부산 밀면', enName: 'Haeundae Choryang Chilled Wheat Noodles (Milmyeon)', jaName: '海雲台・草梁 釜山冷製ミルミョン', zhName: '海云台草梁 釜山小麦冷面', tag: '시원한 면요리', enTag: 'Refreshing Noodles', jaTag: '爽快麺料理', zhTag: '清爽冷面', desc: '살얼음 동동 띄운 한방 육수에 쫄깃한 면발과 매콤달콤 양념장', enDesc: 'Chewy wheat noodles in icy herbal broth topped with sweet spicy sauce.', jaDesc: '氷の浮かぶ特製スープにもちもち麺と甘辛タレが絶妙な夏の定番。', zhDesc: '冰爽药膳高汤配以劲道小麦面条与甜辣秘制调料。', place: '초량 및 해운대 전통시장' },
    { name: '남포동 씨앗호떡 & 비빔당면', enName: 'Nampodong Seed Hotteok & Spicy Glass Noodles', jaName: '南浦洞 種入りホットク＆ビビンタンミョン', zhName: '南浦洞 坚果糖饼与拌杂粉', tag: '길거리 먹거리', enTag: 'Street Snacks', jaTag: '屋台名物', zhTag: '街头特色小吃', desc: '견과류가 듬뿍 들어간 고소한 찹쌀호떡과 매콤한 비빔당면', enDesc: 'Sweet chewy pancake packed with nuts and seeds, plus savory glass noodles.', jaDesc: 'ナッツ類がぎっしり詰まった香ばしいホットクと辛味春雨。', zhDesc: '香脆软糯且包裹丰富坚果的特色糖饼与爽口拌粉条。', place: '남포동 BIFF 광장' }
  ],
  제주: [
    { name: '제주 흑돼지 근고기 구이', enName: 'Jeju Black Pork Charcoal BBQ', jaName: '済州 黒豚炭火焼き', zhName: '济州 特级黑猪肉炭火烤肉', tag: '제주 대표 미식', enTag: 'Jeju Signature BBQ', jaTag: '済州を代表する美食', zhTag: '济州代表性美食', desc: '두툼한 제주산 흑돼지를 참숯에 구워 멜젓(멸치젓)에 콕 찍어먹는 풍미', enDesc: 'Thick local black pork grilled over charcoal and dipped in savory salted anchovy sauce.', jaDesc: 'ジューシーな黒豚を炭火で焼き、特製イワシ塩辛タレにつけて食べる極上の味。', zhDesc: '厚切济州黑猪肉经木炭炙烤后蘸取特制银鱼酱，风味独特醇香。', place: '중문관광단지 & 흑돼지거리' },
    { name: '통갈치 조림 & 갈치구이', enName: 'Jeju Whole Silver Cutlassfish Stew & Grilled Fish', jaName: '済州 太刀魚の煮付け＆塩焼き', zhName: '济州 巨型整条带鱼锅与烤带鱼', tag: '제주 은갈치', enTag: 'Silver Cutlassfish', jaTag: '済州特産太刀魚', zhTag: '济州特产银带鱼', desc: '길쭉한 전용 냄비에 전복, 문어와 함께 매콤하게 조려낸 통갈치', enDesc: 'Freshly braised whole silver fish cooked with abalone and octopus in a long pan.', jaDesc: '専用の長鍋でアワビやタコと一緒に甘辛く煮込んだ豪華な太刀魚料理。', zhDesc: '在特制长锅中与鲍鱼、章鱼一同慢炖的浓香整条带鱼料理。', place: '성산일출봉 인근' },
    { name: '제주 고기국수 & 돔베고기', enName: 'Jeju Pork Noodle Soup & Boiled Sliced Pork (Dombe Meat)', jaName: '済州 肉うどん＆ドムベコギ (茹で豚肉)', zhName: '济州 浓汤猪肉面与白切猪肉', tag: '전통 향토음식', enTag: 'Traditional Local', jaTag: '伝統郷土料理', zhTag: '传统特色乡土料理', desc: '담백한 고기 육수에 중면과 야들야들 삶아낸 돔베고기 수육', enDesc: 'Savory pork broth noodles served with tender boiled pork on a wooden board.', jaDesc: 'あっさりとした肉スープに中太麺と柔らかい茹で豚肉の郷土料理。', zhDesc: '醇厚清甜猪肉高汤配面条及木板盛装的鲜嫩白切猪肉。', place: '제주시 고기국수 거리' }
  ]
};

export default function FoodOutfitModal({ isOpen, onClose, lang = 'ko', initialCity = '서울' }) {
  if (!isOpen) return null;

  const [selectedCity, setSelectedCity] = useState(initialCity || '서울');
  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'outfit'
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 640 : false;

  const foods = REGIONAL_FOOD_DATA[selectedCity] || REGIONAL_FOOD_DATA.서울;

  const handleAskGemini = () => {
    onClose();
    const cityLabel = getCityName(selectedCity, lang);
    const promptText = lang === 'en' ? `Recommend authentic local gourmet restaurants, trendy cafes, and weather styling tips for ${cityLabel}` :
                       lang === 'ja' ? `${cityLabel}の地元民おすすめ名店グルメ・感性カフェ・天気別服装コーデを教えて` :
                       lang === 'zh' || lang === 'zht' ? `请推荐${cityLabel}当地人必吃美食餐厅、人气网红咖啡馆及天气穿搭指南` :
                       `${selectedCity} 현지인 추천 진짜 맛집과 감성 카페, 날씨 맞춤 코디 알려줘`;
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
                  🍴 {lang === 'en' ? 'AI Regional Gourmet & K-Fashion Guide' :
                      lang === 'ja' ? 'AI 地域別名物グルメ＆K-ファッション案内' :
                      lang === 'zh' || lang === 'zht' ? 'AI 地区特色美食与韩系穿搭指南' :
                      'AI 대표 맛집 & K-컬처 코디 가이드'}
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#ea580c',
                  background: 'rgba(234, 88, 12, 0.1)',
                  border: '1px solid rgba(234, 88, 12, 0.25)',
                  padding: '0.08rem 0.4rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  Gemini AI
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', margin: '0.1rem 0 0 0' }}>
                {lang === 'en' ? 'Authentic regional culinary delights and photogenic K-styling tips' :
                 lang === 'ja' ? '韓国各地域の郷土グルメと写真映えするK-ファッションスタイル' :
                 lang === 'zh' || lang === 'zht' ? '韩国精选地道特色美食与上镜韩风服饰搭配技巧' :
                 '대한민국 16개 권역 대표 향토 미식과 사진 잘 나오는 K-패션 스타일링'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* City Selector Pills */}
        <div style={{
          padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.4rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          scrollbarWidth: 'none'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
            <MapPin size={13} /> {lang === 'en' ? 'City:' : lang === 'ja' ? '地域:' : lang === 'zh' || lang === 'zht' ? '地区:' : '지역:'}
          </span>
          {POPULAR_CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                background: selectedCity === city ? 'linear-gradient(135deg, #ea580c, #9333ea)' : '#ffffff',
                color: selectedCity === city ? '#ffffff' : '#334155',
                border: selectedCity === city ? 'none' : '1px solid #cbd5e1',
                padding: isMobile ? '0.2rem 0.55rem' : '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: isMobile ? '0.72rem' : '0.76rem',
                fontWeight: selectedCity === city ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCity === city ? '0 2px 6px rgba(234, 88, 12, 0.3)' : 'none',
                flexShrink: 0
              }}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>

        {/* Tab switcher: 맛집 vs 코디 */}
        <div style={{
          padding: '0.5rem 1.4rem',
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderBottom: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '10px',
              border: activeTab === 'food' ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
              background: activeTab === 'food' ? 'rgba(234, 88, 12, 0.08)' : '#ffffff',
              color: activeTab === 'food' ? '#ea580c' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Utensils size={14} />
            <span>[{getCityName(selectedCity, lang)}] {lang === 'en' ? 'Signature Food Top 3' : lang === 'ja' ? '代表シグネチャーグルメ (3選)' : lang === 'zh' || lang === 'zht' ? '精选特色美食 (前3名)' : '대표 시그니처 미식 (3선)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('outfit')}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: '10px',
              border: activeTab === 'outfit' ? '1.5px solid #9333ea' : '1px solid #e2e8f0',
              background: activeTab === 'outfit' ? 'rgba(147, 51, 234, 0.08)' : '#ffffff',
              color: activeTab === 'outfit' ? '#9333ea' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Shirt size={14} />
            <span>[{getCityName(selectedCity, lang)}] {lang === 'en' ? 'K-Fashion Styling Tips' : lang === 'ja' ? '旅行K-ファッションコーデ' : lang === 'zh' || lang === 'zht' ? '旅行韩系穿搭建议' : '여행 K-패션 코디 팁'}</span>
          </button>
        </div>

        {/* Body Cards Content */}
        <div style={{
          padding: isMobile ? '1rem' : '1.25rem 1.4rem',
          overflowY: 'auto',
          maxHeight: isMobile ? 'calc(92vh - 220px)' : 'calc(90vh - 230px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {activeTab === 'food' ? (
            foods.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-color, #e2e8f0)',
                  padding: '1rem 1.15rem',
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
                    {lang === 'en' ? (item.enTag || item.tag) : lang === 'ja' ? (item.jaTag || item.tag) : lang === 'zh' || lang === 'zht' ? (item.zhTag || item.tag) : item.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPin size={12} color="#ea580c" />
                    {item.place}
                  </span>
                </div>

                <div style={{ fontSize: '1.02rem', fontWeight: 900, color: 'var(--text-main, #0f172a)' }}>
                  {lang === 'en' ? (item.enName || item.name) : lang === 'ja' ? (item.jaName || item.name) : lang === 'zh' || lang === 'zht' ? (item.zhName || item.name) : item.name}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #475569)', lineHeight: 1.45 }}>
                  {lang === 'en' ? (item.enDesc || item.desc) : lang === 'ja' ? (item.jaDesc || item.desc) : lang === 'zh' || lang === 'zht' ? (item.zhDesc || item.desc) : item.desc}
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
                  <span>[{getCityName(selectedCity, lang)}] {lang === 'en' ? 'Urban & Scenic K-Styling Photo Tips' : lang === 'ja' ? '街歩き＆自然観光 映えK-スタイリング' : lang === 'zh' || lang === 'zht' ? '都市与风景名胜绝美韩系拍照穿搭' : '도심 & 자연 관광 인생샷 K-스타일링'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  📸 <strong>{lang === 'en' ? 'Photo Tip' : lang === 'ja' ? '撮影のコツ' : lang === 'zh' || lang === 'zht' ? '拍照建议' : '촬영 꿀팁'}</strong>: {lang === 'en' ? 'Wear bright ivory, pastel tones, or smart casual outfits that contrast beautifully with blue seas and traditional tiled roof landscapes.' : lang === 'ja' ? '青い海や伝統的な瓦屋根の風景と美しく調和する明るいアイボリーやパステルカラー、きれいめカジュアルコーデがおすすめです。' : lang === 'zh' || lang === 'zht' ? '建议选择明亮米白色、温柔马卡龙色系或利落韩系休闲套装，与蓝海和传统瓦房背景形成绝美对比。' : '명소의 푸른 바다/전통 기와 배경과 대비되는 밝은 아이보리, 파스텔 톤 또는 모던 캐주얼 셋업을 추천합니다.'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  👟 <strong>{lang === 'en' ? 'Comfortable Footwear' : lang === 'ja' ? '快適な靴' : lang === 'zh' || lang === 'zht' ? '舒适鞋履' : '발 편한 여행 슈즈'}</strong>: {lang === 'en' ? 'Since walking 10,000+ steps a day is common, cushioned sneakers or walking shoes are essential.' : lang === 'ja' ? '1日平均1万歩以上歩く観光コースのため、クッション性の高いスニーカーやウォーキングシューズが必須です。' : lang === 'zh' || lang === 'zht' ? '韩国游览平均每日步行超1万步，轻便且缓震良好的运动鞋或健步鞋必不可少。' : '하루 평균 1만 보 이상 걷는 관광 코스 특성상 푹신한 쿠셔닝 스니커즈나 워킹화가 필수입니다.'}
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
                ✨ <strong>{lang === 'en' ? 'Hanbok Benefit' : lang === 'ja' ? '韓服(チマチョゴリ)特典' : lang === 'zh' || lang === 'zht' ? '韩服体验特权' : '한복 체험 팁'}</strong>: {lang === 'en' ? 'At major traditional sites like Gyeongbokgung Palace (Seoul) and Hanok Villages (Jeonju/Gyeongju), wearing a rented Hanbok grants FREE royal palace admission!' : lang === 'ja' ? '景福宮(ソウル)や韓屋村(全州・慶州)など伝統名所では、レンタル韓服を着用して入場すると古宮の入場料が無料になります！' : lang === 'zh' || lang === 'zht' ? '在首尔景福宫、全州韩屋村及庆州等传统古迹，身着租赁的韩服可直接享受免门票免费入宫特权！' : '경복궁(서울), 한옥마을(전주), 황리단길(경주) 등 전통 명소에서는 한복 대여 착용 시 고궁 무료입장 혜택이 적용됩니다!'}
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
            <span>🤖 {lang === 'en' ? `Ask Gemini AI 1:1 for ${getCityName(selectedCity, lang)} Food & Fashion ➔` :
                        lang === 'ja' ? `Geminiに [${getCityName(selectedCity, lang)}] 1:1 グルメ・コーデを質問 ➔` :
                        lang === 'zh' || lang === 'zht' ? `向 Gemini AI 1对1 咨询 [${getCityName(selectedCity, lang)}] 美食穿搭 ➔` :
                        `제미나이에게 [${selectedCity}] 1:1 맛집·코디 질문하기 ➔`}</span>
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
            {lang === 'en' ? 'Close' : lang === 'ja' ? '閉じる' : lang === 'zh' || lang === 'zht' ? '关闭' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
