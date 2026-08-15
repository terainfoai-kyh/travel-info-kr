import React from 'react';
import ReactDOM from 'react-dom';
import { Wifi, CreditCard, Hotel, DollarSign, ExternalLink, Sparkles, ShieldCheck, X, Check, Tag } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';

export default function TravelEssentialsModal({ isOpen, onClose, lang = 'ko', targetRegion = '서울' }) {
  if (!isOpen) return null;

const ESSENTIALS_I18N = {
  ko: {
    modalTitle: '✈️ 한국 여행 필수템 & 공식 제휴 혜택관',
    modalBadge: '공식 파트너 인증',
    modalSub: 'eSIM · 공항철도 AREX · 대중교통카드 · 최저가 호텔까지 원스톱 제휴 특가로 준비하세요',
    footerDisclaimer: '본 제휴 링크는 한국관광공사 및 Klook/Agoda 공식 제휴 규정을 준수합니다.',
    closeBtn: '닫기',
    esim: {
      title: '무제한 4G/5G 데이터 eSIM & USIM',
      tag: 'Klook 15% 단독할인',
      desc: '인천/김포/김해공항 도착 즉시 QR코드로 간편 개통되는 한국 무제한 고속 데이터 패스',
      features: ['실시간 통신망 100% 보장', 'QR코드 즉시 발급', '핫스팟 테더링 지원'],
      btnText: 'eSIM 15% 할인가로 예약하기 ↗'
    },
    transit: {
      title: '공항철도 AREX 직통열차 & 교통카드',
      tag: 'KKday 공식 제휴',
      desc: '인천공항 ➔ 서울역 43분 쾌속 직통열차 및 전국 지하철/버스/편의점 통합 T-Money 패스',
      features: ['공항철도 AREX 직통 승차권', '전국 대중교통 자유 탑승', 'WOWPASS 올인원 지원'],
      btnText: '교통패스 특가 예약하기 ↗'
    },
    hotel: {
      title: '[{region}] 추천 호텔 & 감성 숙소',
      tag: 'Agoda 최저가 보장',
      desc: '{region} 주요 관광지 및 지하철역 인근 인기 호텔, 리조트, 한옥 스테이 최대 75% 특별 제휴가',
      features: ['최저가 보상제 적용', '무료 취소 가능 객실 다수', '외국인 선호 평점 9.0+ 숙소'],
      btnText: '{region} 숙소 특가 확인하기 ↗'
    },
    taxfree: {
      title: '택스 리펀(Tax Refund) & 쇼핑 패스',
      tag: '쇼핑 혜택 가이드',
      desc: '올리브영, 주요 백화점, 마트 즉시 면세 환급 꿀팁 및 한국 대표 쇼핑몰/액티비티 할인 쿠폰',
      features: ['여권 제시 즉시 환급 방법 안내', 'K-뷰티/패션 쇼핑 쿠폰북', '공항 환급 창구 위치 안내'],
      btnText: '쇼핑 할인 쿠폰 받기 ↗'
    }
  },
  en: {
    modalTitle: '✈️ Korea Travel Essentials & Partner Deals',
    modalBadge: 'Official Partner Verified',
    modalSub: 'Prepare your eSIM, AREX airport train, transit pass, and hotels with exclusive discounts',
    footerDisclaimer: 'Official partner affiliate verified with Klook, KKday & Agoda.',
    closeBtn: 'Close',
    esim: {
      title: 'Unlimited 4G/5G Data eSIM & USIM',
      tag: 'Klook 15% Off',
      desc: 'Instant QR code activation upon arrival at Incheon/Gimpo airports. Unlimited high-speed data.',
      features: ['100% Guaranteed Local Network', 'Instant QR Code Delivery', 'Hotspot Tethering Supported'],
      btnText: 'Book eSIM at 15% Off ↗'
    },
    transit: {
      title: 'AREX Airport Express & Transit Pass',
      tag: 'KKday Official',
      desc: 'Incheon Airport to Seoul Station in 43 mins + T-Money all-in-one card for subway, bus & stores.',
      features: ['AREX Direct Train Ticket', 'Nationwide Subway & Bus Pass', 'WOWPASS All-in-One Option'],
      btnText: 'Book Transit Pass Deal ↗'
    },
    hotel: {
      title: '[{region}] Top Hotels & Hanok Stays',
      tag: 'Agoda Best Price',
      desc: 'Exclusive up to 75% discount for popular hotels, luxury resorts, and hanok stays in {region}.',
      features: ['Best Price Guarantee', 'Free Cancellation Rooms', 'Foreigner Top Rated 9.0+'],
      btnText: 'View {region} Hotel Deals ↗'
    },
    taxfree: {
      title: 'Tax Refund & Duty Free Shopping Guide',
      tag: 'Shopping Guide',
      desc: 'Instant passport tax refund guide for Olive Young, department stores, and K-Beauty shopping discounts.',
      features: ['Instant Tax Refund on Passport', 'K-Beauty & Fashion Coupons', 'Airport Refund Counter Guide'],
      btnText: 'Get Shopping Coupons ↗'
    }
  },
  ja: {
    modalTitle: '✈️ 韓国旅行の必需品＆公式提携特典',
    modalBadge: '公式パートナー認証',
    modalSub: 'eSIM・空港鉄道AREX・交通カード・最安値ホテルまでワンストップでお得に準備',
    footerDisclaimer: '本アフィリエイトリンクはKlook・KKday・Agodaの公式規約を遵守しています。',
    closeBtn: '閉じる',
    esim: {
      title: '韓国無制限 4G/5G 高速データ eSIM & SIM',
      tag: 'Klook 15%割引',
      desc: '仁川・金浦空港到着後すぐにQRコードで開通できる韓国無制限高速データパス。',
      features: ['韓国大手キャリア回線 100%保証', 'QRコード即時発行', 'テザリング対応'],
      btnText: 'eSIMを15%割引で予約 ↗'
    },
    transit: {
      title: '空港鉄道 AREX 直通列車 & 交通カード',
      tag: 'KKday 公式提携',
      desc: '仁川空港からソウル駅まで最速43分直通列車＆全国地下鉄・バス・コンビニ対応T-Moneyパス。',
      features: ['空港鉄道 AREX 直通乗車券', '全国公共交通 乗り放題', 'WOWPASS オールインワン対応'],
      btnText: '交通パスを特別価格で予約 ↗'
    },
    hotel: {
      title: '[{region}] おすすめホテル＆伝統韓屋宿泊',
      tag: 'Agoda 最安値保証',
      desc: '{region}の主要観光地や駅チカの人気ホテル、リゾート、韓屋ステイが最大75%割引。',
      features: ['最安値保証制度適用', '無料キャンセル可能プラン多数', '外国人旅行客クチコミ9.0+'],
      btnText: '{region}の宿泊特恵を見る ↗'
    },
    taxfree: {
      title: 'タックスリファンド(即時免税)＆ショッピング',
      tag: '免税特典ガイド',
      desc: 'オリーブヤングや百貨店でのパスポート即時免税還付のコツ＆K-Beautyショッピング割引クーポン。',
      features: ['パスポート提示で即時還付', 'K-Beauty・ファッション割引券', '空港還付カウンター案内'],
      btnText: 'ショッピング割引券を受け取る ↗'
    }
  },
  zh: {
    modalTitle: '✈️ 韩国旅行必备指南与官方特惠',
    modalBadge: '官方认证伙伴',
    modalSub: '一站式特惠预订 eSIM、机场快线、交通卡及全韩精选酒店',
    footerDisclaimer: '本特惠链接严格遵守 Klook、KKday 及 Agoda 官方合作伙伴规范。',
    closeBtn: '关闭',
    esim: {
      title: '韩国无限流量 4G/5G 高速 eSIM & SIM卡',
      tag: 'Klook 独家85折',
      desc: '仁川/金浦机场抵达即刻扫码激活，韩国畅享无限高速4G/5G流量。',
      features: ['韩国官方高速通信网络', '即刻下发激活二维码', '支持热点共享'],
      btnText: '85折优惠预订 eSIM ↗'
    },
    transit: {
      title: '机场快线 AREX 直通列车 & 交通卡',
      tag: 'KKday 官方合作',
      desc: '仁川机场至首尔站43分钟快速直达，全韩地铁、公交、便利店通用交通卡。',
      features: ['机场快线直通车车票', '全韩公共交通畅行卡', '支持 WOWPASS 一体化'],
      btnText: '特惠预订交通卡 ↗'
    },
    hotel: {
      title: '[{region}] 精选酒店与特色韩屋民宿',
      tag: 'Agoda 最低价保证',
      desc: '{region}热门景区及地铁站周边优质酒店、度假村及韩屋体验，最高享75%专属特惠。',
      features: ['官方最低价格保障', '支持免费取消房型', '外国游客精选好评9.0+'],
      btnText: '查看{region}特惠酒店 ↗'
    },
    taxfree: {
      title: '退税攻略与免税购物优惠指南',
      tag: '免税购物指南',
      desc: 'Olive Young、百货商场护照即时免税指南及韩国代表性K-Beauty购物优惠券。',
      features: ['持护照即享现场即时退税', 'K-Beauty美妆服饰优惠券', '机场退税窗口详细指引'],
      btnText: '领取购物优惠券 ↗'
    }
  },
  zht: {
    modalTitle: '✈️ 韓國旅行必備指南與官方特惠',
    modalBadge: '官方認證夥伴',
    modalSub: '一站式特惠預訂 eSIM、機場快線、交通卡及全韓精選飯店',
    footerDisclaimer: '本特惠連結嚴格遵守 Klook、KKday 及 Agoda 官方合作夥伴規範。',
    closeBtn: '關閉',
    esim: {
      title: '韓國無限流量 4G/5G 高速 eSIM & SIM卡',
      tag: 'Klook 獨家85折',
      desc: '仁川/金浦機場抵達即刻掃碼激活，韓國暢享無限高速4G/5G流量。',
      features: ['韓國官方高速通信網路', '即刻下發激活二維碼', '支援熱點共享'],
      btnText: '85折優惠預訂 eSIM ↗'
    },
    transit: {
      title: '機場快線 AREX 直通列車 & 交通卡',
      tag: 'KKday 官方合作',
      desc: '仁川機場至首爾站43分鐘快速直達，全韓地鐵、公車、便利商店通用交通卡。',
      features: ['機場快線直通車車票', '全韓大眾運輸暢行卡', '支援 WOWPASS 一體化'],
      btnText: '特惠預訂交通卡 ↗'
    },
    hotel: {
      title: '[{region}] 精選飯店與特色韓屋民宿',
      tag: 'Agoda 最低價保證',
      desc: '{region}熱門景區及地鐵站周邊優質飯店、度假村及韓屋體驗，最高享75%專屬特惠。',
      features: ['官方最低價格保證', '支援免費取消房型', '外國遊客精選好評9.0+'],
      btnText: '查看{region}特惠飯店 ↗'
    },
    taxfree: {
      title: '退稅攻略與免稅購物優惠指南',
      tag: '免稅購物指南',
      desc: 'Olive Young、百貨公司護照即時退稅指南及韓國代表性K-Beauty購物優惠券。',
      features: ['持護照即享現場即時退稅', 'K-Beauty美妝服飾優惠券', '機場退稅窗口詳細指引'],
      btnText: '領取購物優惠券 ↗'
    }
  },
  de: {
    modalTitle: '✈️ Korea Reise-Essentials & Partner-Angebote',
    modalBadge: 'Offizieller Partner Verifiziert',
    modalSub: 'eSIM, AREX Flughafen-Express, Transportkarte und Hotels zum besten Preis',
    footerDisclaimer: 'Offiziell verifizierter Partner von Klook, KKday & Agoda.',
    closeBtn: 'Schließen',
    esim: {
      title: 'Unbegrenztes 4G/5G Daten-eSIM & SIM',
      tag: 'Klook 15% Rabatt',
      desc: 'Sofortige QR-Code-Aktivierung nach Landung in Incheon/Gimpo. Unbegrenztes Highspeed-Internet.',
      features: ['100% Lokales Netz Garantiert', 'Sofortige QR-Code-Lieferung', 'Hotspot-Tethering Unterstützt'],
      btnText: 'eSIM mit 15% Rabatt buchen ↗'
    },
    transit: {
      title: 'AREX Flughafen-Express & Transportkarte',
      tag: 'KKday Offiziell',
      desc: 'Flughafen Incheon zum Seoul Bahnhof in 43 Min + T-Money All-in-One für U-Bahn & Bus.',
      features: ['AREX Express Zugticket', 'Landesweiter U-Bahn- & Bus-Pass', 'WOWPASS All-in-One Option'],
      btnText: 'Transportpass-Angebot buchen ↗'
    },
    hotel: {
      title: '[{region}] Top Hotels & Hanok-Unterkünfte',
      tag: 'Agoda Bestpreis-Garantie',
      desc: 'Bis zu 75% Rabatt auf beliebte Hotels, Resorts und traditionelle Hanoks in {region}.',
      features: ['Bestpreis-Garantie', 'Kostenlose Stornierung', 'Ausländer-Topbewertung 9.0+'],
      btnText: '{region} Hotel-Angebote ansehen ↗'
    },
    taxfree: {
      title: 'Tax-Free & Duty-Free Einkaufsführer',
      tag: 'Shopping-Guide',
      desc: 'Sofortige Pass-Steuererstattung bei Olive Young, Kaufhäusern und K-Beauty-Rabattcoupons.',
      features: ['Direkte Rückerstattung mit Pass', 'K-Beauty & Mode-Gutscheine', 'Flughafen-Schalter-Leitfaden'],
      btnText: 'Shopping-Gutscheine sichern ↗'
    }
  },
  fr: {
    modalTitle: '✈️ Indispensables Voyage Corée & Offres Partenaires',
    modalBadge: 'Partenaire Officiel Vérifié',
    modalSub: 'Préparez votre eSIM, train AREX, pass transport et hôtels avec des réductions exclusives',
    footerDisclaimer: 'Affilié partenaire officiel vérifié avec Klook, KKday & Agoda.',
    closeBtn: 'Fermer',
    esim: {
      title: 'eSIM & SIM Données 4G/5G Illimitées',
      tag: 'Klook 15% de Réduction',
      desc: 'Activation instantanée par QR code dès l\'arrivée à Incheon/Gimpo. Données illimitées.',
      features: ['Réseau local 100% garanti', 'Envoi instantané du QR code', 'Partage de connexion inclus'],
      btnText: 'Réserver l\'eSIM à -15% ↗'
    },
    transit: {
      title: 'Train Express AREX & Carte de Transport',
      tag: 'KKday Officiel',
      desc: 'Aéroport d\'Incheon à la gare de Séoul en 43 min + T-Money pour métro, bus et supérettes.',
      features: ['Billet direct AREX', 'Pass transport métro & bus national', 'Option WOWPASS Tout-en-un'],
      btnText: 'Réserver le pass transport ↗'
    },
    hotel: {
      title: '[{region}] Meilleurs Hôtels & Séjours Hanok',
      tag: 'Garantie Meilleur Prix Agoda',
      desc: 'Jusqu\'à 75% de réduction sur les hôtels, resorts et hébergements Hanok à {region}.',
      features: ['Garantie du meilleur prix', 'Chambres avec annulation gratuite', 'Note voyageurs 9.0+'],
      btnText: 'Voir les offres d\'hôtels à {region} ↗'
    },
    taxfree: {
      title: 'Détaxe & Guide du Shopping Duty Free',
      tag: 'Guide Shopping',
      desc: 'Guide de détaxe immédiate sur passeport chez Olive Young, grands magasins et coupons K-Beauty.',
      features: ['Détaxe immédiate avec passeport', 'Coupons K-Beauty & Mode', 'Guide guichet aéroport'],
      btnText: 'Obtenir les coupons shopping ↗'
    }
  },
  es: {
    modalTitle: '✈️ Esenciales de Viaje a Corea & Ofertas',
    modalBadge: 'Socio Oficial Verificado',
    modalSub: 'Prepara tu eSIM, tren AREX, tarjeta de transporte y hoteles con descuentos exclusivos',
    footerDisclaimer: 'Afiliado oficial verificado con Klook, KKday y Agoda.',
    closeBtn: 'Cerrar',
    esim: {
      title: 'eSIM y SIM de Datos 4G/5G Ilimitados',
      tag: 'Klook 15% de Descuento',
      desc: 'Activación instantánea por código QR al llegar a Incheon/Gimpo. Internet ilimitado.',
      features: ['Red local 100% garantizada', 'Entrega instantánea por QR', 'Zona Wi-Fi compartida'],
      btnText: 'Reservar eSIM con 15% de Descuento ↗'
    },
    transit: {
      title: 'Tren Exprés AREX & Tarjeta de Transporte',
      tag: 'KKday Oficial',
      desc: 'Aeropuerto Incheon a Estación de Seúl en 43 min + T-Money para metro, autobús y tiendas.',
      features: ['Billetes tren directo AREX', 'Pase nacional de metro y autobús', 'Opción WOWPASS Todo en Uno'],
      btnText: 'Reservar pase de transporte ↗'
    },
    hotel: {
      title: '[{region}] Mejores Hoteles & Alojamientos Hanok',
      tag: 'Mejor Precio Agoda',
      desc: 'Hasta 75% de descuento en hoteles populares, resorts y casas Hanok en {region}.',
      features: ['Garantía de mejor precio', 'Habitaciones con cancelación gratis', 'Calificación turistas 9.0+'],
      btnText: 'Ver ofertas de hoteles en {region} ↗'
    },
    taxfree: {
      title: 'Guía de Tax Free & Compras Libres de Impuestos',
      tag: 'Guía de Compras',
      desc: 'Reembolso inmediato con pasaporte en Olive Young, grandes almacenes y cupones K-Beauty.',
      features: ['Reembolso inmediato con pasaporte', 'Cupones de moda y K-Beauty', 'Guía de ventanillas del aeropuerto'],
      btnText: 'Obtener cupones de compra ↗'
    }
  },
  ru: {
    modalTitle: '✈️ Всё необходимое для поездки в Корею & Скидки',
    modalBadge: 'Официальный партнер',
    modalSub: 'Оформите eSIM, экспресс AREX, транспортную карту и отели по специальным ценам',
    footerDisclaimer: 'Официальный партнер Klook, KKday и Agoda.',
    closeBtn: 'Закрыть',
    esim: {
      title: 'Безлимитная 4G/5G eSIM и SIM-карта',
      tag: 'Скидка 15% на Klook',
      desc: 'Мгновенная активация по QR-коду по прибытии в Инчхон/Кимпхо. Безлимитный интернет.',
      features: ['100% гарантия местной сети', 'Мгновенная выдача QR-кода', 'Поддержка раздачи интернета'],
      btnText: 'Забронировать eSIM со скидкой 15% ↗'
    },
    transit: {
      title: 'Экспресс AREX и Транспортная карта',
      tag: 'Официально на KKday',
      desc: 'Аэропорт Инчхон — вокзал Сеула за 43 мин + карта T-Money для метро, автобусов и магазинов.',
      features: ['Билет на прямой поезд AREX', 'Проезд в метро и автобусах Кореи', 'Опция карты WOWPASS'],
      btnText: 'Купить транспортный проездной ↗'
    },
    hotel: {
      title: '[{region}] Лучшие отели и традиционные ханоки',
      tag: 'Гарантия лучшей цены Agoda',
      desc: 'Скидки до 75% на отели, курорты и традиционные дома ханок в регионе {region}.',
      features: ['Гарантия лучшей цены', 'Бесплатная отмена бронирования', 'Рейтинг туристов 9.0+'],
      btnText: 'Смотреть отели в {region} ↗'
    },
    taxfree: {
      title: 'Tax Refund и гид по покупкам без налогов',
      tag: 'Гид по покупкам',
      desc: 'Мгновенный возврат налога по паспорту в Olive Young, универмагах и купоны на K-Beauty.',
      features: ['Мгновенный возврат по паспорту', 'Купоны на косметику и одежду', 'Гид по окнам возврата в аэропорту'],
      btnText: 'Получить купоны на скидку ↗'
    }
  }
};

const REGION_NAMES = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾', de: 'Seoul', fr: 'Séoul', es: 'Seúl', ru: 'Сеул' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山', de: 'Busan', fr: 'Busan', es: 'Busan', ru: 'Пусан' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州', de: 'Jeju', fr: 'Jeju', es: 'Jeju', ru: 'Чеджу' }
};

export default function TravelEssentialsModal({ isOpen, onClose, lang = 'ko', targetRegion = '서울' }) {
  if (!isOpen) return null;

  const et = ESSENTIALS_I18N[lang] || ESSENTIALS_I18N.en || ESSENTIALS_I18N.ko;
  const localizedRegion = (REGION_NAMES[targetRegion] && REGION_NAMES[targetRegion][lang]) || targetRegion;

  const ESSENTIALS = [
    {
      id: 'esim',
      icon: <Wifi size={24} color="#0284c7" />,
      title: et.esim.title,
      tag: et.esim.tag,
      badgeBg: 'rgba(2, 132, 199, 0.1)',
      badgeColor: '#0284c7',
      desc: et.esim.desc,
      features: et.esim.features,
      link: buildKlookDeepLink('한국 eSIM'),
      btnText: et.esim.btnText
    },
    {
      id: 'transit',
      icon: <CreditCard size={24} color="#7c3aed" />,
      title: et.transit.title,
      tag: et.transit.tag,
      badgeBg: 'rgba(124, 58, 237, 0.1)',
      badgeColor: '#7c3aed',
      desc: et.transit.desc,
      features: et.transit.features,
      link: buildKKdayDeepLink('한국 교통카드'),
      btnText: et.transit.btnText
    },
    {
      id: 'hotel',
      icon: <Hotel size={24} color="#ea580c" />,
      title: et.hotel.title.replace('{region}', localizedRegion),
      tag: et.hotel.tag,
      badgeBg: 'rgba(234, 88, 12, 0.1)',
      badgeColor: '#ea580c',
      desc: et.hotel.desc.replace(/\{region\}/g, localizedRegion),
      features: et.hotel.features,
      link: buildAgodaDeepLink(targetRegion),
      btnText: et.hotel.btnText.replace('{region}', localizedRegion)
    },
    {
      id: 'taxfree',
      icon: <DollarSign size={24} color="#059669" />,
      title: et.taxfree.title,
      tag: et.taxfree.tag,
      badgeBg: 'rgba(5, 150, 105, 0.1)',
      badgeColor: '#059669',
      desc: et.taxfree.desc,
      features: et.taxfree.features,
      link: buildKlookDeepLink('한국 쇼핑 면세'),
      btnText: et.taxfree.btnText
    }
  ];

  const modalNode = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderRadius: '24px',
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
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  {et.modalTitle}
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px'
                }}>
                  {et.modalBadge}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', margin: '0.2rem 0 0 0' }}>
                {et.modalSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Cards Grid */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          maxHeight: 'calc(90vh - 150px)'
        }}>
          {ESSENTIALS.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: item.badgeBg,
                    color: item.badgeColor
                  }}>
                    {item.tag}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-main, #0f172a)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem' }}>
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
                      <Check size={13} color="#059669" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'opacity 0.2s'
                }}
              >
                <span>{item.btnText}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #94a3b8)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#059669" />
            {et.footerDisclaimer}
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {et.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
