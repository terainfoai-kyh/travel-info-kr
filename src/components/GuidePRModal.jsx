import React, { useState } from 'react';
import { X, BookOpen, Megaphone, Sparkles, MapPin, Map, Compass, ShieldCheck, Mail, ExternalLink, Check, Copy, Navigation, Utensils, Sun, Globe } from 'lucide-react';
import { useModalHistory } from '../hooks/useModalHistory';

const GUIDE_PR_TRANSLATIONS = {
  ko: {
    modalTitle: 'K-Travel 이용안내 매뉴얼 & 공식 홍보관',
    modalSub: 'AI 맞춤 여행 플래너 활용법 및 한국관광공사 연동 서비스 소개',
    tabManual: '📖 이용 안내 매뉴얼',
    tabPR: '📢 플랫폼 홍보관 & 제휴',
    step1Title: '1. AI 1:1 맞춤 코스 추천 활용법',
    step1Desc: '메인 상단 "✨ AI 여행 코스 추천" 버튼을 클릭하세요! 원하는 시작일자, 지역(서울, 제주, 부산 등), 일수(최대 5일 코스), 비 오는 날 옵션을 설정하면 3초 만에 이동 시간과 맛집이 연동된 맞춤 일정이 생성됩니다.',
    step2Title: '2. "+ 코스 담기" 나만의 최적 동선 조합',
    step2Desc: '관광명소 카드 우측 상단의 "+ 코스 담기" 버튼을 눌러 가고 싶은 곳들을 자유롭게 수집하세요! 하단 Floating Bar에서 "✓ 담은 명소로 코스 잡기"를 누르면 AI가 최소 이동 거리(TSP 알고리즘)로 순서를 최적 정렬해 드립니다.',
    step3Title: '3. 전체 동선 줌아웃 지도 & 원클릭 내비게이션',
    step3Desc: '코스 모달이 열리면 1번부터 4번까지 전체 명소와 점선 이동 경로가 지도 위에 줌아웃(Fit-Bounds) 상태로 한눈에 표시됩니다. "🚗 전체 경로 내비 연결" 버튼을 터치하면 카카오맵/구글맵 멀티 길찾기로 바로 연결됩니다.',
    step4Title: '4. 실시간 기후 맞춤 코디 & 100선 맛집 추천',
    step4Desc: '기상청 공공데이터 실시간 연동으로 기온과 습도에 알맞은 옷차림 가이드를 제안하며, 한국관광공사 DB 기반 지역별 100선 대표 맛집 정보 및 지도 검색을 바로 이용할 수 있습니다.',
    step5Title: '5. 글로벌 9개 국어 지원 (Foreigner-First UX)',
    step5Desc: '우측 상단 언어 선택기를 통해 한국어, 영어, 일본어, 중국어(간체/번체), 독일어, 프랑스어, 스페인어, 러시아어 등 9개 언어로 원스톱 전환할 수 있으며, 외국인 사용자에게는 한국관광공사 Official 다국어 API 데이터가 수신됩니다.',
    pr1Title: '🇰🇷 한국관광공사 TourAPI 4.0 정품 공공데이터 플랫폼',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc)는 대한민국 공공기관인 한국관광공사 Official DB 및 기상청 실시간 기후 데이터를 100% 공식 연동하여 운영되는 대한민국 스마트 여행 안내 서비스입니다.',
    pr2Title: '✈️ 글로벌 제휴사 혜택 제공 (Agoda & Klook)',
    pr2ItemHotel: 'Agoda 최저가 숙소 연동: 추천 코스 지역 주변의 최저가 호텔/리조트를 1클릭으로 검색 및 할인 예약.',
    pr2ItemEsim: 'Klook eSIM & 패스 혜택: 대한민국 입국 외국인 관광객 전용 eSIM, K-PASS, 교통권 제휴 혜택 제공.',
    pr3Title: '지자체 · 관광재단 · 기업 제휴 및 광고 문의',
    pr3Desc: '전국 지자체 관광 홍보, 한옥/명소 입점 등록, 스폰서십 및 인플루언서 제휴 문의를 언제든 환영합니다.',
    copyEmailBtn: '공식 이메일 복사',
    copiedEmailSuccess: '이메일 주소 복사완료!',
    openInquiryFormBtn: '온라인 제휴 문의 폼 작성하기 ➔'
  },
  en: {
    modalTitle: 'K-Travel User Manual & Official PR Hub',
    modalSub: 'AI Travel Planner usage & Korea Tourism Organization Official DB intro',
    tabManual: '📖 User Manual',
    tabPR: '📢 Platform PR & Partnership',
    step1Title: '1. AI 1-on-1 Customized Itinerary Guide',
    step1Desc: 'Click the "✨ AI Course Recommendation" button on the main header! Set start date, region (Seoul, Jeju, Busan), days (up to 5 days), and rainy-day options to generate a smart itinerary in 3 seconds.',
    step2Title: '2. "+ Add to Course" Custom Route Optimizer',
    step2Desc: 'Click "+ Add to Course" on attraction cards to collect your favorite spots! Tap "✓ Create Itinerary from Saved Spots" in the bottom bar to optimize the route order using TSP algorithms.',
    step3Title: '3. Whole Route Zoomed-Out Map & Navigation',
    step3Desc: 'When the itinerary modal opens, all spots from 1 to 4 and the connecting path line are automatically framed together (Fit-Bounds). Tap "🚗 Open Full Route Navigation" to open Kakao / Google Maps multi-waypoint directions.',
    step4Title: '4. Weather Outfit Guide & Top 100 Food Search',
    step4Desc: 'Integrated with real-time Meteorological Agency data to suggest optimal clothing outfits. Provides Korea Tourism Organization Top 100 famous local restaurant search and map integration.',
    step5Title: '5. Global 9 Languages Support (Foreigner-First UX)',
    step5Desc: 'Switch seamlessly between Korean, English, Japanese, Chinese (Simp/Trad), German, French, Spanish, and Russian. Foreign users receive official Korea Tourism Organization multilingual API data.',
    pr1Title: '🇰🇷 Official Korea Tourism Organization TourAPI 4.0 Platform',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) is an official smart Korea travel guide powered by 100% official Korea Tourism Organization DB and Meteorological Agency real-time climate data.',
    pr2Title: '✈️ Global Partner Benefits (Agoda & Klook)',
    pr2ItemHotel: 'Agoda Lowest Hotel Guarantee: Search & book lowest price hotels near recommended routes in 1 click.',
    pr2ItemEsim: 'Klook eSIM & Pass Deals: Special discounts on eSIM, K-PASS, transit passes for inbound travelers.',
    pr3Title: 'Municipalities, Tourism Boards & Sponsorship Inquiries',
    pr3Desc: 'We welcome local government tourism campaigns, spot listings, sponsorships, and influencer partnerships.',
    copyEmailBtn: 'Copy Official Email',
    copiedEmailSuccess: 'Email Address Copied!',
    openInquiryFormBtn: 'Fill Online Partnership Form ➔'
  },
  ja: {
    modalTitle: 'K-Travel 利用案内マニュアル＆公式広報館',
    modalSub: 'AI旅行プランナーの活用法および韓国観光公社連動サービスの紹介',
    tabManual: '📖 利用案内マニュアル',
    tabPR: '📢 プラットフォーム広報館＆提携',
    step1Title: '1. AI 1:1 カスタムコース推薦の活用法',
    step1Desc: 'メインヘッダーの「✨ AIコース推薦」ボタンをクリック！出発日、地域（ソウル、済州、釜山など）、日数（最大5日）、雨の日オプションを設定すると、3秒で最適な日程が生成されます。',
    step2Title: '2. 「+ コースに追加」自分だけの最適動線組み合わせ',
    step2Desc: '観光地カード右上の「+ コースに追加」ボタンで好きなスポットを収集！下部バーの「✓ 保存したスポットでコース作成」を押すと、最小移動距離（TSP）で順番が最適化されます。',
    step3Title: '3. 全体動線ズームアウト地図＆ワンクリックナビ',
    step3Desc: 'コースモーダルが開くと、1番から4番までの全スポットと点線移動ルートが地図上に自動ズームアウト表示されます。「🚗 全体ルートナビ接続」を押すとカカオマップ/Googleマップでナビが開きます。',
    step4Title: '4. リアルタイム気候コード＆グルメ100選推薦',
    step4Desc: '気象庁のリアルタイムデータと連動し、気温や湿度に合った服装ガイドを提案。韓国観光公社DBに基づく地域別100選グルメ検索と地図連携がすぐ利用できます。',
    step5Title: '5. グローバル9ヶ国語対応 (Foreigner-First UX)',
    step5Desc: '右上言語セレクターで日本語、英語、韓国語、中国語、ドイツ語、フランス語、スペイン語、ロシア語など9言語に切り替え可能。公式多言語APIデータをリアルタイム受信します。',
    pr1Title: '🇰🇷 韓国観光公社 TourAPI 4.0 正規品公共データプラットフォーム',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc)は、韓国観光公社Official DBおよび気象庁のリアルタイム気候データを100%公式連動して運営されるスマート韓国旅行ガイドです。',
    pr2Title: '✈️ グローバル提携パートナー特典 (Agoda & Klook)',
    pr2ItemHotel: 'Agoda 最安値宿泊連動：推薦コース周辺の最安値ホテル・リゾートを1クリックで検索・割引予約。',
    pr2ItemEsim: 'Klook eSIM＆パス特典：訪韓外国人観光客専用eSIM、K-PASS、交通パスの提携割引を提供。',
    pr3Title: '自治体・観光財団・企業提携および広告のお問い合わせ',
    pr3Desc: '全国自治体の観光PR、スポット掲載登録、スポンサーシップおよび提携のお問い合わせを歓迎いたします。',
    copyEmailBtn: '公式メールをコピー',
    copiedEmailSuccess: 'メールアドレスをコピーしました！',
    openInquiryFormBtn: 'オンライン提携お問い合わせフォーム作成 ➔'
  },
  zh: {
    modalTitle: 'K-Travel 使用指南手册与官方宣传馆',
    modalSub: 'AI定制旅行规划器使用方法及韩国旅游发展局联动服务介绍',
    tabManual: '📖 使用指南手册',
    tabPR: '📢 平台宣传馆与合作',
    step1Title: '1. AI 1대1定制行程推荐使用指南',
    step1Desc: '点击主页标头的“✨ AI行程推荐”按钮！选择出发日期、地区（首尔、济州、釜山等）、天数（最多5天）及雨天模式，3秒内生成包含移动时间和美食的定制行程。',
    step2Title: '2. “+ 加入行程” 专属最佳动线组合',
    step2Desc: '点击景点卡片右上角的“+ 加入行程”收集心仪景点！点击底部浮动条中的“✓ 用已选景点生成行程”，AI将根据最短移动距离（TSP算法）自动排列最佳顺序。',
    step3Title: '3. 全局动线缩放地图与一键导航',
    step3Desc: '打开行程弹窗时，1号至4号景点及虚线移动路径将在地图上自动缩放（Fit-Bounds）全景展示。点击“🚗 打开全路线导航”即可跳转至Kakao / Google地图多途径地导航。',
    step4Title: '4. 实时气候穿搭指南与100精选美食',
    step4Desc: '与气象厅实时数据联动，推荐最适合温度与湿度的穿搭指南；并提供基于韩国旅游发展局精选的各地区100大代表美食与地图搜索。',
    step5Title: '5. 全球9种语言支持 (外国游客优先UX)',
    step5Desc: '通过右上角语言选择器可随时切换韩语、英语、日语、中文（简体/繁体）、德语、法语、西班牙语、俄语等9种语言，为外国游客实时提供韩国旅游发展局多语言官方API数据。',
    pr1Title: '🇰🇷 韩国旅游发展局 TourAPI 4.0 正版公共数据平台',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) 是100%官方接入韩国旅游发展局(KTO) Official DB及气象厅实时气候数据打造的智能韩国旅游指南服务。',
    pr2Title: '✈️ 全球合作伙伴优惠 (Agoda & Klook)',
    pr2ItemHotel: 'Agoda 最低价酒店联动：一键搜索并折扣预订推荐路线周边最低价酒店/度假村。',
    pr2ItemEsim: 'Klook eSIM与交通卡优惠：为入境外国游客提供专属eSIM、K-PASS、交通卡合作折扣。',
    pr3Title: '地方政府・旅游局・企业合作与广告咨询',
    pr3Desc: '随时欢迎各地方政府旅游宣传、景点及韩屋入驻登记、赞助与网红合作咨询。',
    copyEmailBtn: '复制官方邮箱',
    copiedEmailSuccess: '邮箱地址复制成功！',
    openInquiryFormBtn: '填写在线合作咨询表 ➔'
  },
  zht: {
    modalTitle: 'K-Travel 使用指南手冊與官方宣傳館',
    modalSub: 'AI定製旅行規劃器使用方法及韓國旅遊發展局聯動服務介紹',
    tabManual: '📖 使用指南手冊',
    tabPR: '📢 平台宣傳館與合作',
    step1Title: '1. AI 1對1定製行程推薦使用指南',
    step1Desc: '點擊主頁標頭的「✨ AI行程推薦」按鈕！選擇出發日期、地區（首爾、濟州、釜山等）、天數（最多5天）及雨天模式，3秒內生成包含移動時間和美食的定製行程。',
    step2Title: '2. 「+ 加入行程」 專屬最佳動線組合',
    step2Desc: '點擊景點卡片右上角的「+ 加入行程」收集心儀景點！點擊底部浮動條中的「✓ 用已選景點生成行程」，AI將根據最短移動距離（TSP演算法）自動排列最佳順序。',
    step3Title: '3. 全局動線縮放地圖與一鍵導航',
    step3Desc: '打開行程彈窗時，1號至4號景點及虛線移動路徑將在地圖上自動縮放（Fit-Bounds）全景展示。點擊「🚗 打開全路線導航」即可跳轉至Kakao / Google地圖多途經地導航。',
    step4Title: '4. 實時氣候穿搭指南與100精選美食',
    step4Desc: '與氣象廳實時數據聯動，推薦最適合溫度與濕度的穿搭指南；並提供基於韓國旅遊發展局精選的各地區100大代表美食與地圖搜尋。',
    step5Title: '5. 全球9種語言支持 (外國遊客優先UX)',
    step5Desc: '透過右上角語言選擇器可隨時切換韓語、英語、日語、中文（簡體/繁體）、德語、法語、西班牙語、俄語等9種語言，為外國遊客實時提供韓國旅遊發展局多語言官方API數據。',
    pr1Title: '🇰🇷 韓國旅遊發展局 TourAPI 4.0 正版公共數據平台',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) 是100%官方接入韓國旅遊發展局(KTO) Official DB及氣象廳實時氣候數據打造的智能韓國旅遊指南服務。',
    pr2Title: '✈️ 全球合作夥伴優惠 (Agoda & Klook)',
    pr2ItemHotel: 'Agoda 最低價酒店聯動：一鍵搜尋並折扣預訂推薦路線周邊最低價酒店/度假村。',
    pr2ItemEsim: 'Klook eSIM與交通卡優惠：為入境外國遊客提供專屬eSIM、K-PASS、交通卡合作折扣。',
    pr3Title: '地方政府・旅遊局・企業合作與廣告諮詢',
    pr3Desc: '隨時歡迎各地方政府旅遊宣傳、景點及韓屋入駐登記、贊助與網紅合作諮詢。',
    copyEmailBtn: '複製官方郵箱',
    copiedEmailSuccess: '郵箱地址複製成功！',
    openInquiryFormBtn: '填寫線上合作諮詢表 ➔'
  },
  de: {
    modalTitle: 'K-Travel Benutzerhandbuch & Offizielles PR-Zentrum',
    modalSub: 'Nutzung des AI-Reiseplaners & Einführung in die offizielle Datenbank der KTO',
    tabManual: '📖 Benutzerhandbuch',
    tabPR: '📢 Plattform-PR & Partnerschaft',
    step1Title: '1. KI-individuelle Reiseroutenempfehlungen',
    step1Desc: 'Klicken Sie auf "✨ AI Course Recommendation"! Wählen Sie Datum, Region (Seoul, Jeju, Busan), Tage (bis zu 5 Tage) und Regenoptionen für eine smarte Route in 3 Sekunden.',
    step2Title: '2. "+ Zu Kurs hinzufügen" Routenoptimierung',
    step2Desc: 'Klicken Sie bei Attraktionen auf "+ Zu Kurs hinzufügen"! Tippen Sie unten auf "✓ Kurs aus gespeicherten Orten erstellen", um die Reihenfolge nach minimaler Distanz zu optimieren.',
    step3Title: '3. Gesamtrouten-Karte & Ein-Klick-Navigation',
    step3Desc: 'Im Routen-Modal werden alle Orte (1 bis 4) und die Verbindungslinie automatisch gemeinsam angezeigt. Tippen Sie auf "🚗 Navigation öffnen", um Google Maps mit allen Wegpunkten zu starten.',
    step4Title: '4. Wetter-Outfit-Guide & Top 100 Restaurants',
    step4Desc: 'Echtzeit-Wetterdaten zur Empfehlung optimaler Kleidung. Bietet Suche nach den Top 100 KTO-Restaurants inklusive Kartenintegration.',
    step5Title: '5. Unterstützung von 9 Sprachen (Foreigner-First UX)',
    step5Desc: 'Wechseln Sie nahtlos zwischen 9 Sprachen. Ausländische Nutzer erhalten offizielle KTO-Mehrsprachen-API-Daten.',
    pr1Title: '🇰🇷 Offizielle KTO TourAPI 4.0 Open Data-Plattform',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) ist ein offizieller Reiseführer, der zu 100% mit der KTO-Datenbank und Wetterdaten verbunden ist.',
    pr2Title: '✈️ Globale Partner-Vorteile (Agoda & Klook)',
    pr2ItemHotel: 'Agoda Bestpreis-Garantie: Hotels in der Nähe der Routen mit 1 Klick suchen und buchen.',
    pr2ItemEsim: 'Klook eSIM & Pass Deals: Rabatte auf eSIM, K-PASS und Fahrkarten für Einreisende.',
    pr3Title: 'Gemeinden, Tourismusverbände & Sponsoring-Anfragen',
    pr3Desc: 'Wir begrüßen lokale Tourismuskampagnen, Eintragsregistrierungen und Sponsoring-Partnerschaften.',
    copyEmailBtn: 'E-Mail kopieren',
    copiedEmailSuccess: 'E-Mail-Adresse kopiert!',
    openInquiryFormBtn: 'Online-Partnerschaftsformular ausfüllen ➔'
  },
  fr: {
    modalTitle: 'Guide d\'utilisation K-Travel & Centre PR Officiel',
    modalSub: 'Utilisation du planificateur IA et présentation de la BDD officielle KTO',
    tabManual: '📖 Manuel d\'utilisation',
    tabPR: '📢 RP de la plateforme et partenariat',
    step1Title: '1. Utilisation des itinéraires personnalisés IA',
    step1Desc: 'Cliquez sur "✨ Recommandation IA"! Choisissez la date, région (Séoul, Jeju, Busan), durée (jusqu\'à 5 jours) et l\'option temps de pluie pour créer votre circuit en 3 secondes.',
    step2Title: '2. "+ Ajouter au circuit" Optimisation d\'itinéraire',
    step2Desc: 'Cliquez sur "+ Ajouter au circuit" sur les cartes d\'attraction! Appuyez sur "✓ Créer un itinéraire à partir des lieux enregistrés" pour optimiser l\'ordre du parcours.',
    step3Title: '3. Carte zoomée globale & Navigation en 1 clic',
    step3Desc: 'Au démarrage de la modal, tous les lieux (1 à 4) et la ligne de parcours s\'affichent ensemble. Appuyez sur "🚗 Ouvrir la navigation" pour lancer Google Maps multi-étapes.',
    step4Title: '4. Guide vestimentaire météo & Top 100 gastronomie',
    step4Desc: 'Intégration météo en temps réel pour suggérer la tenue idéale. Recherche des 100 meilleurs restaurants KTO avec carte.',
    step5Title: '5. Prise en charge de 9 langues (Foreigner-First UX)',
    step5Desc: 'Passez facilement entre 9 langues. Les utilisateurs étrangers reçoivent les données API multilingues officielles de la KTO.',
    pr1Title: '🇰🇷 Plateforme de données publiques officielle TourAPI 4.0 KTO',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) est un guide officiel basé à 100% sur la base de données KTO et la météo en temps réel.',
    pr2Title: '✈️ Avantages partenaires mondiaux (Agoda & Klook)',
    pr2ItemHotel: 'Hôtels Agoda prix minimum: Recherchez et réservez des hôtels près des itinéraires en 1 clic.',
    pr2ItemEsim: 'Klook eSIM & Pass: Réductions sur les eSIM, K-PASS et cartes de transport pour les voyageurs.',
    pr3Title: 'Collectivités, offices de tourisme & partenariats',
    pr3Desc: 'Nous accueillons les campagnes touristiques locales, l\'ajout de lieux et les partenariats.',
    copyEmailBtn: 'Copier l\'e-mail officiel',
    copiedEmailSuccess: 'E-mail copié !',
    openInquiryFormBtn: 'Remplir le formulaire de partenariat ➔'
  },
  es: {
    modalTitle: 'Manual de Usuario K-Travel y Centro Oficial de RP',
    modalSub: 'Uso del planificador IA e introducción a la BD oficial de la KTO',
    tabManual: '📖 Manual de Usuario',
    tabPR: '📢 RP de la plataforma y alianzas',
    step1Title: '1. Guía de itinerarios personalizados por IA',
    step1Desc: '¡Haz clic en "✨ Recomendación IA"! Selecciona fecha, región (Seúl, Jeju, Busan), días (hasta 5 días) y opción de lluvia para generar un itinerario en 3 segundos.',
    step2Title: '2. "+ Añadir al curso" Optimización de ruta',
    step2Desc: '¡Haz clic en "+ Añadir al curso" en las tarjetas de lugares! Presiona "✓ Crear itinerario con guardados" para optimizar la secuencia con distancia mínima.',
    step3Title: '3. Mapa completo de ruta y navegación en 1 clic',
    step3Desc: 'Al abrir el modal, los puntos (1 a 4) y la línea de ruta se muestran juntos automáticamente. Toca "🚗 Abrir navegación completa" para ir a Google Maps con todos los destinos.',
    step4Title: '4. Guía de ropa según el clima y Top 100 restaurantes',
    step4Desc: 'Integrado con datos meteorológicos en tiempo real para recomendar atuendos ideales. Búsqueda de los Top 100 restaurantes según la KTO.',
    step5Title: '5. Soporte para 9 idiomas (Foreigner-First UX)',
    step5Desc: 'Cambia entre 9 idiomas fácilmente. Los usuarios extranjeros reciben datos oficiales multilingües de la API de la KTO.',
    pr1Title: '🇰🇷 Plataforma de Datos Públicos Oficial TourAPI 4.0 de KTO',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) es una guía oficial conectada al 100% con la BD de la KTO y datos climáticos en tiempo real.',
    pr2Title: '✈️ Beneficios de socios globales (Agoda y Klook)',
    pr2ItemHotel: 'Hoteles Agoda precio mínimo: Busca y reserva hoteles cerca de tus rutas en 1 clic.',
    pr2ItemEsim: 'Ofertas Klook eSIM y Pases: Descuentos especiales en eSIM, K-PASS y pases de transporte.',
    pr3Title: 'Gobiernos locales, oficinas de turismo y patrocinio',
    pr3Desc: 'Damos la bienvenida a campañas de turismo local, registro de lugares y patrocinios.',
    copyEmailBtn: 'Copiar correo oficial',
    copiedEmailSuccess: '¡Correo copiado!',
    openInquiryFormBtn: 'Rellenar formulario de alianza ➔'
  },
  ru: {
    modalTitle: 'Руководство пользователя K-Travel и Официальный PR-центр',
    modalSub: 'Использование ИИ-планировщика и презентация официальной БД KTO',
    tabManual: '📖 Руководство пользователя',
    tabPR: '📢 PR платформы и партнерство',
    step1Title: '1. Персональные ИИ-маршруты путешествий',
    step1Desc: 'Нажмите "✨ ИИ-рекомендация"! Выберите дату, регион (Сеул, Чеджу, Пусан), дни (до 5 дней) и опцию дождливого дня для мгновенного создания маршрута.',
    step2Title: '2. "+ Добавить в маршрут" Оптимизация пути',
    step2Desc: 'Нажимайте "+ Добавить в маршрут" на карточках! Выберите "✓ Создать маршрут из сохраненных", и ИИ упорядочит локации по кратчайшему расстоянию.',
    step3Title: '3. Общая карта маршрута и навигация в 1 клик',
    step3Desc: 'При открытии модального окна все локации (с 1 по 4) и пунктирная линия пути сразу видны на карте. Нажмите "🚗 Навигация", чтобы открыть Картах маршрут со всеми остановками.',
    step4Title: '4. Рекомендации по одежде по погоде и Топ 100 кулинарии',
    step4Desc: 'Интеграция с метеоданными для подбора одежды. Поиск 100 лучших ресторанов от KTO с отображением на карте.',
    step5Title: '5. Поддержка 9 языков (Foreigner-First UX)',
    step5Desc: 'Переключайтесь между 9 языками. Иностранные пользователи получают официальные данные мультиязычного API KTO.',
    pr1Title: '🇰🇷 Официальная платформа открытых данных KTO TourAPI 4.0',
    pr1Desc: 'K-Travel Explorer (koreatravel.cc) — официальный гид, на 100% интегрированный с БД KTO и метеоданными в реальном времени.',
    pr2Title: '✈️ Преимущества глобальных партнеров (Agoda и Klook)',
    pr2ItemHotel: 'Отели Agoda по минимальной цене: поиск и бронирование отелей рядом с маршрутом в 1 клик.',
    pr2ItemEsim: 'Скидки Klook на eSIM и пассы: выгодные eSIM, K-PASS и транспортные карты для туристов.',
    pr3Title: 'Запросы от муниципалитетов, турофисов и партнеров',
    pr3Desc: 'Мы открыты к региональным туристским кампаниям, добавлению локаций и спонсорству.',
    copyEmailBtn: 'Скопировать e-mail',
    copiedEmailSuccess: 'E-mail скопирован!',
    openInquiryFormBtn: 'Заполнить форму партнерства ➔'
  }
};

export default function GuidePRModal({ isOpen, onClose, lang = 'ko', onOpenPartnerInquiry }) {
  useModalHistory(isOpen, onClose, 'guide-pr');

  const t = GUIDE_PR_TRANSLATIONS[lang] || GUIDE_PR_TRANSLATIONS.ko;
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'pr'
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const contactEmail = 'terainfoai@gmail.com';

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="modal-overlay-backdrop" style={{ zIndex: 1100 }}>
      <div
        className="animate-fade-in glass-panel modal-responsive-card"
        style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          maxWidth: '780px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-highlight)',
          position: 'relative'
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '0',
            float: 'right',
            marginRight: '-0.5rem',
            marginTop: '-0.5rem',
            zIndex: 10,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Title Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff'
            }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }} className="gradient-text">
                {t.modalTitle}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          {/* Navigation Tab Selector */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem'
          }}>
            <button
              onClick={() => setActiveTab('manual')}
              style={{
                background: activeTab === 'manual' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'manual' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={16} />
              <span>{t.tabManual}</span>
            </button>

            <button
              onClick={() => setActiveTab('pr')}
              style={{
                background: activeTab === 'pr' ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === 'pr' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Megaphone size={16} />
              <span>{t.tabPR}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: User Manual */}
        {activeTab === 'manual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Guide Item 1 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} />
                <span>{t.step1Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.step1Desc}
              </p>
            </div>

            {/* Guide Item 2 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={18} />
                <span>{t.step2Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.step2Desc}
              </p>
            </div>

            {/* Guide Item 3 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Map size={18} />
                <span>{t.step3Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.step3Desc}
              </p>
            </div>

            {/* Guide Item 4 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sun size={18} />
                <span>{t.step4Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.step4Desc}
              </p>
            </div>

            {/* Guide Item 5 */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={18} />
                <span>{t.step5Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.step5Desc}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PR & Partnership */}
        {activeTab === 'pr' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* PR Card 1: Official Data Certification */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(56, 189, 248, 0.08))',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={22} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {t.pr1Title}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {t.pr1Desc}
              </p>
            </div>

            {/* PR Card 2: Partner Benefits */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {t.pr2Title}
              </h3>
              <ul style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.2rem', margin: 0 }}>
                <li>{t.pr2ItemHotel}</li>
                <li>{t.pr2ItemEsim}</li>
              </ul>
            </div>

            {/* PR Card 3: Municipal & Business Inquiry */}
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-highlight)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={18} color="var(--accent-primary)" />
                <span>{t.pr3Title}</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {t.pr3Desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedEmail ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                  <span>{copiedEmail ? t.copiedEmailSuccess : `${t.copyEmailBtn} (${contactEmail})`}</span>
                </button>

                {onOpenPartnerInquiry && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPartnerInquiry();
                    }}
                    className="btn-primary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>{t.openInquiryFormBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
