import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, MapPin, Coffee, Train, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function AdSenseArticlesSection({ lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [openFaq, setOpenFaq] = useState(null);

  const ARTICLES_KO = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: '핫플 가이드',
      title: '2026 서울 핫플레이스 트렌드: 성수동에서 한남동까지',
      summary: '옛 공장 지대에서 글로벌 패션과 팝업스토어의 성지로 거듭난 성수동(Seongsu-dong)과 감성적인 부티크 숍이 가득한 한남동의 숨은 명소를 소개합니다.',
      readTime: '3분 소요',
      content: '성수동은 디올 성수, 아더에러 플래그십, 수많은 로컬 로스터리 카페가 밀집한 서울의 브루클린입니다. 뚝섬역과 성수역 일대를 도보로 이동하며 팝업스토어와 서울숲 피크닉을 동시에 즐길 수 있습니다.'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: '교통 꿀팁',
      title: '외국인을 위한 대중교통 완벽 정복: 기후동행카드 vs T-Money',
      summary: '지하철과 시내버스를 무제한으로 탈 수 있는 단기 관광권 기후동행카드 구매 방법과 공항철도, 광역버스 탑승 요령을 완벽 정리해 드립니다.',
      readTime: '4분 소요',
      content: '기후동행카드(Climate Card)는 서울 시내 지하철과 버스를 1일, 2일, 3일, 5일권으로 무제한 이용할 수 있는 관광객 전용 교통패스입니다. 서울역 및 주요 지하철역 고객안전실에서 실물 카드를 구매 후 무인 충전기에서 충전하여 즉시 사용 가능합니다.'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-미식 문화',
      title: '한국 맛집 탐방 & 식사 에티켓: 팁 문화 없는 최고의 미식 여행',
      summary: '한국은 별도의 팁(Tip) 문화가 없으며, 테이블 벨과 무료 반찬 리필 시스템이 잘 갖춰져 있습니다. 광장시장 K-스트리트 푸드부터 한우 오마카세까지 놓치지 마세요.',
      readTime: '3분 소요',
      content: '한국의 식당에서는 물과 기본 반찬이 무료로 제공되며, 식사 후 카운터에서 결제하는 것이 기본입니다. 유명 맛집은 테이블링이나 캐치테이블 앱을 통한 원격 줄서기가 가능합니다.'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: '사계절 스타일링',
      title: '2026 대한민국 사계절 여행 & 날씨별 코디 가이드',
      summary: '봄 벚꽃 궁궐 나들이부터 여름 동해안 서핑, 가을 경주 단풍 로드, 겨울 스키장까지 계절별 최적의 여행지와 기온별 맞춤 옷차림 꿀팁을 전수합니다.',
      readTime: '4분 소요',
      content: '한국은 사계절이 뚜렷하여 계절마다 색다른 매력을 자랑합니다. 봄(3~5월)과 가을(9~11월)은 일교차가 있어 얇은 아우터 레이어드가 필수이며, 여름(6~8월)은 통기성 좋은 린넨과 자외선 차단용 선글라스가 유용합니다. 겨울(12~2월)에는 방한 패딩과 핫팩을 챙겨 따뜻한 온천이나 야경 투어를 즐겨보세요.'
    }
  ];

  const ARTICLES_EN = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: 'Hotspot Trend',
      title: '2026 Seoul Travel Trends: From Seongsu-dong to Hannam-dong',
      summary: 'Explore Seongsu-dong, Seoul’s Brooklyn of pop-up stores and independent fashion boutiques, and the charming aesthetic cafes of Hannam-dong.',
      readTime: '3 min read',
      content: 'Seongsu-dong is Seoul’s premier cultural hub featuring Dior Seongsu, Ader Error flagship store, and artisanal coffee roasteries. Walk comfortably from Ttukseom to Seongsu station and enjoy a picnic at Seoul Forest.'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: 'Transit Tips',
      title: 'Foreign Traveler Transit Masterclass: Climate Card vs T-Money',
      summary: 'Complete guide on purchasing short-term Climate Cards for unlimited subway & bus rides, plus airport express (AREX) and intercity bus tips.',
      readTime: '4 min read',
      content: 'The Climate Card offers unlimited subway and public bus rides for 1, 2, 3, or 5 days. Purchase physical cards at Seoul Station or subway customer centers and top up instantly at automated kiosks.'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-Food Culture',
      title: 'Korean Food & Dining Etiquette: No-Tip Gourmet Paradise',
      summary: 'Korea has zero tipping culture, with call buttons at tables and free side dish (Banchan) refills. From Gwangjang market street food to Korean BBQ.',
      readTime: '3 min read',
      content: 'Water and side dishes are complimentary in Korean restaurants, and payment is settled at the front counter after dining. Popular gourmet spots allow remote queueing via CatchTable.'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: 'Four-Season Styling',
      title: '2026 Korea Four-Season Travel & Weather Outfit Guide',
      summary: 'From spring cherry blossom palaces to summer East Coast surfing, autumn foliage in Gyeongju, and winter ski resorts with temperature-matched outfits.',
      readTime: '4 min read',
      content: 'Korea has four distinct seasons. Spring (Mar-May) and autumn (Sep-Nov) require light cardigan layering for day/night temperature drops. Summer (Jun-Aug) calls for breathable linen and UV sunglasses, while winter (Dec-Feb) requires warm padding and heat packs.'
    }
  ];

  const FAQS_KO = [
    {
      q: 'VORA AI 여행 일정은 어떻게 생성되나요?',
      a: 'VORA AI는 최신 Google Gemini 3.0 자연어 AI와 Google Places Platform 공식 위치 데이터베이스를 결합하여, 사용자가 입력한 여행 지역과 취향에 맞는 최적의 동선, 실제 위경도 좌표 기반 구글맵 길찾기, 로컬 미식을 실시간으로 자동 생성합니다.'
    },
    {
      q: '한국 여행 중 현금 환전이 필수인가요?',
      a: '대부분의 상점, 카페, 택시, 대중교통에서 해외 신용카드(Visa, Mastercard 등) 및 애플페이가 널리 통용됩니다. 다만 전통시장 먹거리나 지하철 교통카드 충전을 위해 소액(약 3~5만 원)의 현금을 소지하시는 것을 추천합니다.'
    },
    {
      q: '비 오는 날에는 어떤 코스를 추천하나요?',
      a: '비가 올 때는 국립중앙박물관, 더현대 서울, 코엑스 아쿠아리움 및 별마당 도서관, 롯데월드타워 서울스카이, 동대문디자인플라자(DDP) 등 대형 실내 복합 문화공간 중심의 동선을 추천합니다. VORA 채팅창에 "비 오는 날 코스로 바꿔줘"라고 입력하시면 즉시 변경됩니다.'
    },
    {
      q: '응급 상황 시 외국어 통역 지원을 받을 수 있나요?',
      a: '대한민국 관광통역안내 1330 헬프라인(국번 없이 1330)으로 전화하시면 연중무휴 24시간 한국어, 영어, 일본어, 중국어 무료 통역 및 여행 안내, 긴급 구호 연계 서비스를 받으실 수 있습니다.'
    }
  ];

  const FAQS_EN = [
    {
      q: 'How does VORA AI create my travel itinerary?',
      a: 'VORA AI combines Google Gemini 3.0 natural language AI with the Google Places Platform database to automatically generate optimal daily routes, real-time Google Maps coordinates, transit times, and authentic local gourmet recommendations tailored to your style.'
    },
    {
      q: 'Is cash exchange necessary for traveling in South Korea?',
      a: 'Most shops, cafes, taxis, and public transit widely accept international credit cards (Visa, Mastercard) and Apple Pay. However, carrying a small amount of cash (~30,000 to 50,000 KRW) is recommended for street food markets and transit card reloads.'
    },
    {
      q: 'What courses do you recommend for rainy days?',
      a: 'On rainy days, we recommend large indoor cultural hubs like the National Museum of Korea, The Hyundai Seoul, Starfield Library in COEX, Lotte World Tower Seoul Sky, and DDP. You can simply ask VORA chat: "Change to an indoor rainy day course".'
    },
    {
      q: 'Can I get foreign language interpretation during an emergency?',
      a: 'Yes! Call the 1330 Korea Travel Helpline (dial 1330 without area code) for 24/7 free multilingual interpretation in English, Japanese, and Chinese, general travel assistance, and emergency relief services.'
    }
  ];

  const ARTICLES_JA = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: 'ホットスポットガイド',
      title: '2026年ソウル最新トレンド：聖水洞(ソンスドン)から漢南洞(ハンナムドン)まで',
      summary: 'かつての工場地帯からグローバルファッションやポップアップストアの聖地へと生まれ変わった聖水洞(ソンスドン)と、洗練されたブティックが並ぶ漢南洞の隠れ家スポットをご紹介します。',
      readTime: '所要時間3分',
      content: '聖水洞はDIOR聖水、ADER ERRORフラッグシップ、こだわりの自家焙煎カフェが集まるソウルのブルックリンです。トゥッソム駅と聖水駅周辺を徒歩で巡り、ポップアップストアやソウルの森でのピクニックを同時にお楽しみいただけます。'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: '交通便利ガイド',
      title: '外国人旅行者のための韓国公共交通ガイド：気候同行カード vs T-Money',
      summary: '地下鉄と市内バスが乗り放題になる短期観光用「気候同行カード」の購入方法や、空港鉄道(AREX)・広域バスの乗車テクニックを分かりやすく解説します。',
      readTime: '所要時間4分',
      content: '「気候同行カード(Climate Card)」は、ソウル市内の地下鉄とバスを1日券、2日券、3日券、5日券で無制限に利用できる旅行者専用の交通パスです。ソウル駅や主要地下鉄駅の顧客安全室で実物カードを購入後、無人チャージ機でチャージしてすぐにご利用いただけます。'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-グルメ文化',
      title: '韓国グルメ巡り＆食事マナー：チップ不要の美食パラダイス',
      summary: '韓国にはチップ文化がなく、テーブル呼び出しボタンや無料おかわり(パンチャン)システムが充実しています。広蔵市場の屋台グルメから極上韓牛まで満喫しましょう。',
      readTime: '所要時間3分',
      content: '韓国の飲食店ではお冷や基本のおかず(パンチャン)が無料で提供され、食後にレジカウンターで会計するのが一般的です。人気店ではCatchTable(キャッチテーブル)などのアプリで事前順番待ち予約も可能です。'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: '四季別スタイリング',
      title: '2026年韓国の四季の旅＆気温別コーディネートガイド',
      summary: '春の桜宮殿散策から夏の東海岸サーフィン、秋の慶州紅葉ロード、冬のスキーリゾートまで、季節ごとのベストスポットと気温に合わせたおすすめの服装をご紹介します。',
      readTime: '所要時間4分',
      content: '韓国は四季がはっきりしています。春(3〜5月)と秋(9〜11月)は寒暖差があるため薄手のアウターの重ね着が必須です。夏(6〜8月)は通気性の良いリネンやUV対策サングラスが役立ち、冬(12〜2月)は暖かいダウンコートとカイロを持参して温泉や夜景ツアーをお楽しみください。'
    }
  ];

  const ARTICLES_ZH = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: '潮流打卡指南',
      title: '2026首尔潮流风向标：从圣水洞到汉南洞',
      summary: '从昔日老厂区蜕变为全球时尚与快闪店圣地的圣水洞(Seongsu-dong)，以及汇聚精致买手店与小众咖啡馆的汉南洞精选指南。',
      readTime: '阅读时间 3分钟',
      content: '圣水洞汇聚了Dior圣水、Ader Error旗舰店及众多独立烘焙咖啡馆，被称为首尔的布鲁克林。漫步在纛岛站与圣水站街区，打卡人气快闪店并享受首尔林野餐时光。'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: '交通出行秘籍',
      title: '外国游客专属交通全攻略：气候同行卡 vs T-Money',
      summary: '无限次搭乘首尔地铁与市内公交的短期观光「气候同行卡」购买攻略，以及机场快线(AREX)与城际巴士出行要领。',
      readTime: '阅读时间 4分钟',
      content: '「气候同行卡(Climate Card)」支持首尔市内地铁与公交通用，提供1日、2日、3日、5日等多种定期票。可在首尔站及主要地铁站顾客安全室购买实体卡并在自动充值机充值后立即使用。'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-美食文化',
      title: '韩国美食探店与用餐礼仪：无小费机制的极致美味之旅',
      summary: '韩国无需支付小费，餐桌呼叫铃与小菜免费续加机制十分完善。从广藏市场地道街头小吃到顶级韩牛料理应有尽有。',
      readTime: '阅读时间 3分钟',
      content: '韩国餐厅免费提供饮用水和各式小菜，用餐完毕后至前台结账即可。人气热门餐厅可通过CatchTable等App进行线上取号排队。'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: '四季穿搭指南',
      title: '2026韩国四季旅行与天气穿搭全指南',
      summary: '从春季宫殿赏樱、夏季东海岸冲浪，到秋季庆州枫叶大道与冬季滑雪度假村，带您掌握各季节最佳旅行地与气温穿搭要点。',
      readTime: '阅读时间 4分钟',
      content: '韩国四季分明。春秋季(3-5月/9-11月)早晚温差较大，建议备好轻便外套叠穿；夏季(6-8月)需准备透气亚麻衣物与防晒太阳镜；冬季(12-2月)请备足保暖羽绒服和暖宝宝，尽情享受温泉与浪漫夜景。'
    }
  ];

  const FAQS_JA = [
    {
      q: 'VORA AIの旅行プランはどのように作成されますか？',
      a: 'VORA AIは最新のGoogle Gemini自然言語AIとGoogle Places Platformの公式位置情報を連携させ、ご希望の地域や旅行スタイルに合わせた最適な移動ルート、Googleマップ対応の正確な座標、本場のローカルグルメをリアルタイムで自動設計します。'
    },
    {
      q: '韓国旅行中に現金の換金は必須ですか？',
      a: 'ほとんどの店舗、カフェ、タクシー、公共交通機関で海外クレジットカード(Visa、Mastercard等)やApple Payが広く利用可能です。ただし、伝統市場の屋台や交通カードのチャージ用に少額(約3万〜5万ウォン程度)の現金をお持ちいただくことをおすすめします。'
    },
    {
      q: '雨の日にはどのようなコースがおすすめですか？',
      a: '雨の日は国立中央博物館、ザ・現代ソウル、COEXアクアリウム＆ピョルマダン図書館、ロッテワールドタワーSEOUL SKY、東大門デザインプラザ(DDP)などの大型屋内複合施設がおすすめです。VORAのチャットで「雨の日のコースに変更して」と入力すれば即座にルートを変更できます。'
    },
    {
      q: '緊急時に外国語の通訳サポートを受けることはできますか？',
      a: '韓国観光公社が運営する「1330韓国観光案内ホットライン(局番なし1330)」にお電話いただくと、年中無休・24時間いつでも日本語、英語、中国語による無料通訳、観光案内、緊急時サポートをご利用いただけます。'
    }
  ];

  const FAQS_ZH = [
    {
      q: 'VORA AI的旅行路线是如何生成的？',
      a: 'VORA AI融合了Google Gemini自然语言大模型与Google Places Platform官方地理数据库，根据您输入的旅行目的地和偏好，实时自动规划最佳游览动线、精准谷歌地图坐标以及地道特色美食推荐。'
    },
    {
      q: '在韩国旅游必须兑换现金吗？',
      a: '绝大多数商户、咖啡馆、出租车及公共交通均支持境外信用卡(Visa、Mastercard等)与Apple Pay。建议备好少量现金(约3-5万韩元)，用于传统市场街头小吃或地铁交通卡现金充值。'
    },
    {
      q: '下雨天推荐哪些旅行路线？',
      a: '雨天建议选择大型室内文化综合体，如国立中央博物馆、现代百货首尔店(The Hyundai Seoul)、COEX水族馆与星空图书馆、乐天世界塔Seoul Sky、东大门设计广场(DDP)等。在VORA对话框输入“更换为雨天室内路线”即可一键调整。'
    },
    {
      q: '遇到紧急情况时可以获得多语言翻译支持吗？',
      a: '可以！拨打韩国旅游咨询热线1330(无需区号直拨1330)，即可享受全年无休、24小时全天候中文、英文、日文免费在线翻译、旅游咨询与紧急救助联络服务。'
    }
  ];

  const ARTICLES = lang === 'en' ? ARTICLES_EN : lang === 'ja' ? ARTICLES_JA : (lang === 'zh' || lang === 'zht') ? ARTICLES_ZH : ARTICLES_KO;
  const FAQS = lang === 'en' ? FAQS_EN : lang === 'ja' ? FAQS_JA : (lang === 'zh' || lang === 'zht') ? FAQS_ZH : FAQS_KO;

  return (
    <section style={{
      padding: '1.5rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto',
      borderTop: '1px solid var(--border-color)'
    }}>
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--accent-primary)',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '0.5rem'
        }}>
          <BookOpen size={15} />
          <span>Travel Editorial & FAQ</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          {t.editorialTitle || '대한민국 여행 완벽 가이드 & FAQ'}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
          {t.editorialSubtitle || '한국을 처음 방문하는 여행자를 위한 검증된 로컬 꿀팁'}
        </p>
      </div>

      {/* 3-Column Articles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {ARTICLES.map((art, idx) => (
          <article
            key={idx}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {art.icon}
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {art.tag}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  {art.readTime}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                {art.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {art.summary}
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              padding: '0.85rem',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              border: '1px solid var(--border-color)'
            }}>
              💡 {art.content}
            </div>
          </article>
        ))}
      </div>

      {/* Interactive FAQ Accordion */}
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
            <span>{t.faqTitle || (lang === 'en' ? 'Frequently Asked Questions (FAQ)' : lang === 'ja' ? 'よくある質問 (FAQ)' : (lang === 'zh' || lang === 'zht') ? '常见问题解答 (FAQ)' : '자주 묻는 질문 (FAQ)')}</span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--text-main)'
                }}
              >
                <span>Q. {faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openFaq === idx && (
                <div style={{
                  padding: '0 1.25rem 1.25rem 1.25rem',
                  fontSize: '0.86rem',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  backgroundColor: 'var(--bg-primary)'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
