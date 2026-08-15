import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Search, ShieldCheck, ShieldAlert, Cpu, ExternalLink, Code, Play, RefreshCw, CheckCircle2, Mic, Send, Zap, PlusCircle, UserCheck, Crown, MessageSquare, Trash2, BarChart3, ChevronDown, ChevronUp, Map, Compass } from 'lucide-react';
import { validateTravelQuery } from '../hooks/useInputGuard';
import { useQuotaLimit } from '../hooks/useQuotaLimit';
import { extractLocationKeyword, isGreetingQuery, isMetaHelpQuery, geminiGenerateFullItinerary, generateLocalFallbackItinerary } from '../services/geminiNlpService';
import { fetchTourSpots, fetchPinpointLandmarkSpots } from '../services/tourApi';
import { getAgodaHotelSearchUrl, getKlookActivitySearchUrl } from '../services/affiliateService';
import { logAnalyticsEvent } from '../services/analyticsService';
import { TRANSLATIONS, getSpotDetailButtonLabel, getSpotMapButtonLabel, getTranslatedTitle, getTranslatedAddress } from '../i18n/translations';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import CourseMapViewModal from './CourseMapViewModal';

const WORKBENCH_I18N = {
  ko: {
    title: 'Vora AI 1:1 대화형 여행 컨시어지',
    subtitle: '맞춤 여행 일정 (1~5일) ➔ 한국관광공사 정품 명소 & 지도 GPS 연동',
    unlimitedBadge: '⚡ 무제한 패스 (UNLIMITED)',
    quotaRemaining: '🎟️ 오늘 남은 무료 대화:',
    quotaTimes: '회',
    unlimitedTag: '[ ⚡ 무제한 ]',
    quotaChatTag: '[ 오늘 대화 {current}/{total}회 ]',
    quotaExceededNotice: '안녕하세요! 여행 컨시어지 보라입니다. 😊\n\n⚠️ 오늘 제공된 무료 대화 ({limit}회)를 모두 소비하셨습니다.',
    adRechargeBtn: '🎬 15초 짧은 광고 시청하고 오늘 +3회 즉시 충전하기',
    googleExpandBtn: '🔴 Google 3초 로그인하고 매일 15회로 확장하기',
    guardHint: '💡 대한민국 관공서/관광 명소 및 미식 질문을 입력해 주시면 감사하겠습니다!',
    welcomeText: '안녕하세요! 여행 컨시어지 보라입니다. 😊\n\n매일 무료 5회의 AI 대화로 당일치기부터 최대 5박 일정까지 나만의 맞춤 여행 코스를 받아보세요!\n\n떠나고 싶은 지역이나 여행 스타일(예: 거제도 2박3일 오션뷰 카페, 수원 화성행궁 야경)을 자유롭게 물어보세요!',
    chips: ['📍 거제도 2박3일 오션뷰 카페', '📍 수원 화성행궁 야경 힐링', '📍 제주도 3박4일 맛집 탐방', '📍 여기서 뭘 할 수 있지?'],
    placeholder: '어디로 떠나고 싶으신가요? (예: 수원 2박3일 맛집 코스, 거제도 4박5일 힐링)',
    sendBtn: '전송',
    rightPanelTitle: '🗺️ 추천 1:1 명소 코스',
    rightPanelPlaceholder: '왼쪽 Vora AI 대화창에서 원하시는 여행지나 일정을 물어보시면, 추천 명소 코스가 이 우측 패널에 자동으로 실시간 동기화됩니다!',
    rightPanelLoadingTitle: '⚡ Vora AI 맞춤 여행 코스 분석 중...',
    rightPanelLoadingSub: '우측 명소 패널을 깨끗하게 초기화 후 한국관광공사 정품 코스로 동기화합니다.',
    agodaLink: '🏨 아고다 추천 할인 숙소 예약',
    klookLink: '🎟️ 클룩 추천 액티비티 예약',
    searchingSpots: '한국관광공사 정품 DB에서 추천 명소 탐색 중',
    voiceRecognitionTitle: '음성 인식',
    dayBadge: '{day}일차',
    recommendSpot: '추천 명소',
    viewRouteMap: '🗺️ 1·2·3일차 전체 지도 동선 보기',
    detailMap: '상세 지도 ➔',
    openMap: '열기 ➔',
    syncedCount: '{count}건 동기화',
    loadingSteps: [
      '한국관광공사 정품 DB에서 추천 명소 탐색 중',
      'GPS 지도 좌표 및 위치 데이터 1:1 동기화 중',
      '100% 맞춤 여행 일정을 정돈하고 있습니다'
    ]
  },
  en: {
    title: 'Vora AI 1:1 Travel Concierge',
    subtitle: 'Custom Itineraries (1~5 Days) ➔ Korea Tourism Org (KTO) Official DB & GPS Navigation',
    unlimitedBadge: '⚡ Unlimited Pass',
    quotaRemaining: '🎟️ Free Chats Remaining Today:',
    quotaTimes: '',
    unlimitedTag: '[ ⚡ Unlimited ]',
    quotaChatTag: '[ Today Chat {current}/{total} ]',
    quotaExceededNotice: 'Hello! I am Vora, your Korea Travel AI Concierge. 😊\n\n⚠️ You have used all {limit} free chats provided for today.',
    adRechargeBtn: '🎬 Watch a short 15s ad & instantly get +3 chats',
    googleExpandBtn: '🔴 3-sec Google Login for 15 chats daily',
    guardHint: '💡 Please feel free to ask about Korea travel destinations, sights, food, and transport!',
    welcomeText: 'Hello! I am Vora, your Korea Travel AI Concierge. 😊\n\nEnjoy personalized 1 to 5-day travel itineraries tailored to your style with official Korea Tourism Organization data!\n\nFeel free to ask for any city or preference (e.g. 3-day Busan ocean view cafes, 2-day Seoul K-culture tour)!',
    chips: ['📍 3-Day Busan Ocean View Cafes', '📍 2-Day Seoul K-Culture Tour', '📍 4-Day Jeju Gourmet Exploration', '📍 What can I do here?'],
    placeholder: 'Where would you like to travel? (e.g. 3-day Busan trip, 2-day Seoul tour)',
    sendBtn: 'Send',
    rightPanelTitle: '🗺️ Recommended 1:1 Course',
    rightPanelPlaceholder: 'Ask Vora AI in the left chat about your travel destination, and the recommended itinerary course will automatically sync in this panel in real time!',
    rightPanelLoadingTitle: '⚡ Vora AI analyzing your custom travel course...',
    rightPanelLoadingSub: 'Syncing official Korea Tourism Organization verified spots with GPS mapping.',
    agodaLink: '🏨 Book Discounted Hotels on Agoda',
    klookLink: '🎟️ Book Activities & Passes on Klook',
    searchingSpots: 'Searching official Korea Tourism Org database for verified attractions',
    voiceRecognitionTitle: 'Voice Search',
    dayBadge: 'Day {day}',
    recommendSpot: 'Recommended Spot',
    viewRouteMap: '🗺️ View Full Day 1-2-3 Map Route',
    detailMap: 'Detail Map ➔',
    openMap: 'Open ➔',
    syncedCount: '{count} Synced',
    loadingSteps: [
      'Searching official Korea Tourism Org database for attractions',
      'Syncing GPS map coordinates & location data 1:1',
      'Organizing 100% customized travel itinerary'
    ]
  },
  ja: {
    title: 'Vora AI 1:1 旅行コンシェルジュ',
    subtitle: 'オーダーメイド旅程 (1〜5泊) ➔ 韓国観光公社公式DB＆GPS連動',
    unlimitedBadge: '⚡ 無制限パス',
    quotaRemaining: '🎟️ 本日の無料対話残り:',
    quotaTimes: '回',
    unlimitedTag: '[ ⚡ 無制限 ]',
    quotaChatTag: '[ 本日の対話 {current}/{total}回 ]',
    quotaExceededNotice: 'こんにちは！旅行コンシェルジュのボラです。😊\n\n⚠️ 本日提供された無料対話（{limit}回）をすべてご利用いただきました。',
    adRechargeBtn: '🎬 15秒のショート広告を見て本日+3回即時チャージ',
    googleExpandBtn: '🔴 Google 3秒ログインで毎日15回に拡張',
    guardHint: '💡 韓国の観光名所やグルメ、旅行日程についてご自由にご質問ください！',
    welcomeText: 'こんにちは！韓国旅行コンシェルジュのボラです。😊\n\n日帰りから最大5泊まで、韓国観光公社公式データに基づいたあなただけの旅行コースをご案内します！\n\n行きたい都市や旅行スタイル（例：釜山2泊3日オーシャンビューカフェ、ソウル2泊3日K-Culture）をお気軽にご質問ください！',
    chips: ['📍 釜山 2泊3日 オーシャンビューカフェ', '📍 ソウル 2泊3日 K-Cultureツアー', '📍 済州島 3泊4日 グルメ旅', '📍 ここで何ができますか？'],
    placeholder: 'どこへ旅行したいですか？（例：釜山2泊3日グルメ、済州島3泊4日）',
    sendBtn: '送信',
    rightPanelTitle: '🗺️ おすすめ 1:1 コース',
    rightPanelPlaceholder: '左側のAI対話ウィンドウで行きたい場所や日程を尋ねると、おすすめのコースがこの右側パネルに自動でリアルタイム同期されます！',
    rightPanelLoadingTitle: '⚡ Vora AI おすすめコース分析中...',
    rightPanelLoadingSub: '韓国観光公社公式名所DBとGPS地図をリアルタイム同期中。',
    agodaLink: '🏨 Agoda おすすめ割引ホテルを予約',
    klookLink: '🎟️ Klook おすすめアクティビティを予約',
    searchingSpots: '韓国観光公社公式DBからおすすめ名所を探索中',
    voiceRecognitionTitle: '音声認識',
    dayBadge: '{day}日目',
    recommendSpot: 'おすすめ名所',
    viewRouteMap: '🗺️ 1・2・3日目 全体マップ動線を見る',
    detailMap: '詳細地図 ➔',
    openMap: '開く ➔',
    syncedCount: '{count}件 同期',
    loadingSteps: [
      '韓国観光公社公式DBからおすすめ名所を探索中',
      'GPS地図座標および位置データを1:1同期中',
      '100%オーダーメイド旅行日程を整理しています'
    ]
  },
  zh: {
    title: 'Vora AI 1:1 专属旅游顾问',
    subtitle: '定制旅行行程 (1~5天) ➔ 韩国旅游发展局官方数据与地图 GPS 联动',
    unlimitedBadge: '⚡ 无限通行证',
    quotaRemaining: '🎟️ 今日剩余免费对话:',
    quotaTimes: '次',
    unlimitedTag: '[ ⚡ 无限使用 ]',
    quotaChatTag: '[ 今日对话 {current}/{total}次 ]',
    quotaExceededNotice: '您好！我是您的专属旅行顾问 Vora。😊\n\n⚠️ 今日提供的免费对话次数（{limit}次）已全部用完。',
    adRechargeBtn: '🎬 观看15秒短视频广告立即获得+3次对话',
    googleExpandBtn: '🔴 3秒快捷登录 Google 每天享15次对话',
    guardHint: '💡 欢迎输入关于韩国旅游景点、特色美食及交通行程的问题！',
    welcomeText: '您好！我是您的专属韩国旅游 AI 顾问 Vora。😊\n\n基于韩国旅游发展局官方正品数据，为您量身定制 1 至 5 天的韩国个性化行程！\n\n请随时输入您想去的城市或旅行风格（例如：釜山海云台 3 天 2 晚海景咖啡馆、首尔 2 天 1 晚经典游）！',
    chips: ['📍 釜山 3天2晚 海景咖啡馆之旅', '📍 首尔 2天1晚 K-Culture 精华游', '📍 济州岛 4天3晚 美食探店', '📍 在这里可以体验什么？'],
    placeholder: '您想去哪里旅行？（例如：釜山3天2晚海景游、首尔2天1晚经典游）',
    sendBtn: '发送',
    rightPanelTitle: '🗺️ 推荐 1:1 景点路线',
    rightPanelPlaceholder: '在左侧 AI 对话框输入您想去的目的地或行程，推荐的景点路线将自动在此右侧面板实时同步！',
    rightPanelLoadingTitle: '⚡ Vora AI 正在分析定制行程...',
    rightPanelLoadingSub: '正在与韩国旅游发展局官方认证景点及 GPS 地图实时同步。',
    agodaLink: '🏨 在 Agoda 预订精选特惠酒店',
    klookLink: '🎟️ 在 Klook 预订推荐玩乐与门票',
    searchingSpots: '正在从韩国旅游发展局官方数据中检索精选景点',
    voiceRecognitionTitle: '语音识别',
    dayBadge: '第{day}天',
    recommendSpot: '推荐景点',
    viewRouteMap: '🗺️ 查看第1·2·3天完整地图路线',
    detailMap: '详细地图 ➔',
    openMap: '打开 ➔',
    syncedCount: '{count}条 已同步',
    loadingSteps: [
      '正在从韩国旅游发展局官方数据中检索精选景点',
      '正在1:1同步GPS地图坐标与位置数据',
      '正在整理100%专属定制旅游路线'
    ]
  },
  zht: {
    title: 'Vora AI 1:1 專屬旅遊顧問',
    subtitle: '定制旅行行程 (1~5天) ➔ 韓國旅遊發展局官方數據與地圖 GPS 連動',
    unlimitedBadge: '⚡ 無限通行證',
    quotaRemaining: '🎟️ 今日剩餘免費對話:',
    quotaTimes: '次',
    unlimitedTag: '[ ⚡ 無限使用 ]',
    quotaChatTag: '[ 今日對話 {current}/{total}次 ]',
    quotaExceededNotice: '您好！我是您的專屬旅行顧問 Vora。😊\n\n⚠️ 今日提供的免費對話次數（{limit}次）已全部用完。',
    adRechargeBtn: '🎬 觀看15秒短影片廣告立即獲得+3次對話',
    googleExpandBtn: '🔴 3秒快捷登入 Google 每天享15次對話',
    guardHint: '💡 歡迎輸入關於韓國旅遊景點、特色美食及交通行程的問題！',
    welcomeText: '您好！我是您的專屬韓國旅遊 AI 顧問 Vora。😊\n\n基於韓國旅遊發展局官方正品數據，為您量身定制 1 至 5 天的韓國個性化行程！\n\n請隨時輸入您想去的城市或旅行偏好（例如：釜山海雲台 3 天 2 晚海景咖啡館、首爾 2 天 1 晚經典遊）！',
    chips: ['📍 釜山 3天2晚 海景咖啡館之旅', '📍 首爾 2天1晚 K-Culture 精華遊', '📍 濟州島 4天3晚 美食探店', '📍 在這裡可以體驗什麼？'],
    placeholder: '您想去哪裡旅行？（例如：釜山3天2晚海景遊、首爾2天1晚經典遊）',
    sendBtn: '發送',
    rightPanelTitle: '🗺️ 推薦 1:1 景點路線',
    rightPanelPlaceholder: '在左側 AI 對話框輸入您想去的目的地或行程，推薦的景點路線將自動在此右側面板即時同步！',
    rightPanelLoadingTitle: '⚡ Vora AI 正在分析定制行程...',
    rightPanelLoadingSub: '正在與韓國旅遊發展局官方認證景點及 GPS 地圖即時同步。',
    agodaLink: '🏨 在 Agoda 預訂精選特惠飯店',
    klookLink: '🎟️ 在 Klook 預訂推薦玩樂與門票',
    searchingSpots: '正在從韓國旅遊發展局官方數據中檢索精選景點',
    voiceRecognitionTitle: '語音識別',
    dayBadge: '第{day}天',
    recommendSpot: '推薦景點',
    viewRouteMap: '🗺️ 查看第1·2·3天完整地圖路線',
    detailMap: '詳細地圖 ➔',
    openMap: '打開 ➔',
    syncedCount: '{count}條 已同步',
    loadingSteps: [
      '正在從韓國旅遊發展局官方數據中檢索精選景點',
      '正在1:1同步GPS地圖座標與位置數據',
      '正在整理100%專屬定制旅遊路線'
    ]
  },
  de: {
    title: 'Vora AI 1:1 Reise-Concierge',
    subtitle: 'Individuelle Reiserouten (1~5 Tage) ➔ Offizielle Korea-Tourismus-DB & GPS-Navigation',
    unlimitedBadge: '⚡ Unbegrenzter Pass',
    quotaRemaining: '🎟️ Heute verbleibende kostenlose Chats:',
    quotaTimes: '',
    unlimitedTag: '[ ⚡ Unbegrenzt ]',
    quotaChatTag: '[ Heutiger Chat {current}/{total} ]',
    quotaExceededNotice: 'Hallo! Ich bin Vora, Ihr Reise-Concierge für Korea. 😊\n\n⚠️ Sie haben alle heutigen kostenlosen Chats ({limit}) aufgebraucht.',
    adRechargeBtn: '🎬 15-Sekunden-Clip ansehen & sofort +3 Chats erhalten',
    googleExpandBtn: '🔴 3-Sek. Google-Login für 15 Chats täglich',
    guardHint: '💡 Fragen Sie gerne nach Reisezielen, Sehenswürdigkeiten und Kulinarik in Korea!',
    welcomeText: 'Hallo! Ich bin Vora, Ihr KI-Reise-Concierge für Korea. 😊\n\nErhalten Sie maßgeschneiderte Reiserouten von 1 bis 5 Tagen basierend auf offiziellen Korea-Tourismusdaten!\n\nFragen Sie nach einer Region oder Vorliebe (z.B. 3 Tage Busan Café-Tour, 2 Tage Seoul Kulturreise)!',
    chips: ['📍 3 Tage Busan Meerblick-Cafés', '📍 2 Tage Seoul K-Kultur-Tour', '📍 4 Tage Jeju Kulinarik', '📍 Was kann ich hier tun?'],
    placeholder: 'Wohin möchten Sie reisen? (z.B. 3 Tage Busan, 2 Tage Seoul)',
    sendBtn: 'Senden',
    rightPanelTitle: '🗺️ Empfohlene 1:1 Route',
    rightPanelPlaceholder: 'Fragen Sie Vora AI im linken Chat nach Ihrem Reiseziel – die empfohlene Route wird hier rechts in Echtzeit synchronisiert!',
    rightPanelLoadingTitle: '⚡ Vora AI analysiert Ihre Route...',
    rightPanelLoadingSub: 'Synchronisation mit offiziellen Korea-Tourismus-Daten.',
    agodaLink: '🏨 Hotels mit Rabatt auf Agoda buchen',
    klookLink: '🎟️ Aktivitäten & Pässe auf Klook buchen',
    searchingSpots: 'Suche nach verifizierten Attraktionen in der offiziellen Tourismus-DB',
    voiceRecognitionTitle: 'Sprachsuche',
    dayBadge: 'Tag {day}',
    recommendSpot: 'Empfohlener Ort',
    viewRouteMap: '🗺️ Vollständige 1-2-3-Tage-Kartenroute ansehen',
    detailMap: 'Detailkarte ➔',
    openMap: 'Öffnen ➔',
    syncedCount: '{count} gesynct',
    loadingSteps: [
      'Suche nach verifizierten Attraktionen in der offiziellen Tourismus-DB',
      '1:1 Synchronisation von GPS-Koordinaten & Standortdaten',
      '100% maßgeschneiderte Reiseroute wird zusammengestellt'
    ]
  },
  fr: {
    title: 'Vora AI 1:1 Concierge de Voyage',
    subtitle: 'Itinéraires sur mesure (1~5 jours) ➔ Données officielles Tourisme Corée & GPS',
    unlimitedBadge: '⚡ Pass Illimité',
    quotaRemaining: '🎟️ Conversations gratuites restantes :',
    quotaTimes: '',
    unlimitedTag: '[ ⚡ Illimité ]',
    quotaChatTag: '[ Chat du jour {current}/{total} ]',
    quotaExceededNotice: 'Bonjour ! Je suis Vora, votre concierge IA pour la Corée. 😊\n\n⚠️ Vous avez utilisé toutes les conversations gratuites du jour ({limit}).',
    adRechargeBtn: '🎬 Regarder une courte pub de 15s pour +3 chats immédiats',
    googleExpandBtn: '🔴 Connexion Google en 3s pour 15 chats/jour',
    guardHint: '💡 N\'hésitez pas à poser vos questions sur les attractions, la cuisine et les transports en Corée !',
    welcomeText: 'Bonjour ! Je suis Vora, votre concierge IA pour votre voyage en Corée. 😊\n\nProfitez d\'itinéraires personnalisés de 1 à 5 jours avec les données officielles de l\'Organisation du Tourisme de Corée !\n\nN\'hésitez pas à préciser vos envies (ex. 3 jours à Busan cafés vue mer, 2 jours à Séoul immersion culturelle) !',
    chips: ['📍 3 jours à Busan Cafés Vue Mer', '📍 2 jours à Séoul K-Culture', '📍 4 jours à Jeju Gastronomie', '📍 Que faire ici ?'],
    placeholder: 'Où souhaitez-vous voyager ? (ex. 3 jours à Busan, 2 jours à Séoul)',
    sendBtn: 'Envoyer',
    rightPanelTitle: '🗺️ Parcours 1:1 Recommandé',
    rightPanelPlaceholder: 'Demandez votre destination à Vora AI dans le chat à gauche : le parcours recommandé sera synchronisé ici en temps réel !',
    rightPanelLoadingTitle: '⚡ Vora AI analyse votre itinéraire...',
    rightPanelLoadingSub: 'Synchronisation avec les données officielles de l\'Organisation du Tourisme de Corée.',
    agodaLink: '🏨 Réserver des hôtels avec réduction sur Agoda',
    klookLink: '🎟️ Réserver des activités & pass sur Klook',
    searchingSpots: 'Recherche des attractions officielles vérifiées',
    voiceRecognitionTitle: 'Recherche Vocale',
    dayBadge: 'Jour {day}',
    recommendSpot: 'Lieu Recommandé',
    viewRouteMap: '🗺️ Voir l\'itinéraire complet de la carte (Jours 1-2-3)',
    detailMap: 'Carte détaillée ➔',
    openMap: 'Ouvrir ➔',
    syncedCount: '{count} synchronisé(s)',
    loadingSteps: [
      'Recherche des attractions officielles vérifiées',
      'Synchronisation 1:1 des coordonnées GPS et localisation',
      'Finalisation de votre itinéraire sur mesure à 100%'
    ]
  },
  es: {
    title: 'Vora AI 1:1 Asistente de Viajes',
    subtitle: 'Itinerarios a medida (1~5 días) ➔ BD Oficial de Turismo de Corea y Navegación GPS',
    unlimitedBadge: '⚡ Pase Ilimitado',
    quotaRemaining: '🎟️ Chats gratuitos restantes hoy:',
    quotaTimes: '',
    unlimitedTag: '[ ⚡ Ilimitado ]',
    quotaChatTag: '[ Chat de hoy {current}/{total} ]',
    quotaExceededNotice: '¡Hola! Soy Vora, tu asistente de viajes IA para Corea. 😊\n\n⚠️ Has utilizado todos los chats gratuitos de hoy ({limit}).',
    adRechargeBtn: '🎬 Ver anuncio de 15s y obtener +3 chats al instante',
    googleExpandBtn: '🔴 Iniciar sesión con Google en 3s para 15 chats al día',
    guardHint: '💡 ¡Pregunta sobre destinos turísticos, gastronomía y transporte en Corea!',
    welcomeText: '¡Hola! Soy Vora, tu asistente de viajes IA para Corea. 😊\n\n¡Disfruta de itinerarios personalizados de 1 a 5 días con datos oficiales de la Organización de Turismo de Corea!\n\nPregúntame sobre cualquier destino o estilo (ej. 3 días en Busan cafés con vista al mar, 2 días en Seúl tour K-Culture).',
    chips: ['📍 3 días en Busan Cafés con Vista al Mar', '📍 2 días en Seúl Tour K-Culture', '📍 4 días en Jeju Tour Gastronómico', '📍 ¿Qué puedo hacer aquí?'],
    placeholder: '¿A dónde te gustaría viajar? (ej. 3 días en Busan, 2 días en Seúl)',
    sendBtn: 'Enviar',
    rightPanelTitle: '🗺️ Ruta 1:1 Recomendada',
    rightPanelPlaceholder: 'Pregunta a Vora AI en el chat de la izquierda sobre tu destino y el recorrido recomendado se sincronizará aquí en tiempo real.',
    rightPanelLoadingTitle: '⚡ Vora AI está analizando tu itinerario...',
    rightPanelLoadingSub: 'Sincronizando atracciones verificadas de la Organización de Turismo de Corea.',
    agodaLink: '🏨 Reservar hoteles con descuento en Agoda',
    klookLink: '🎟️ Reservar actividades y pases en Klook',
    searchingSpots: 'Buscando atracciones verificadas en la base de datos oficial',
    voiceRecognitionTitle: 'Búsqueda por Voz',
    dayBadge: 'Día {day}',
    recommendSpot: 'Lugar Recomendado',
    viewRouteMap: '🗺️ Ver ruta completa en el mapa (Días 1-2-3)',
    detailMap: 'Mapa detallado ➔',
    openMap: 'Abrir ➔',
    syncedCount: '{count} sincronizado(s)',
    loadingSteps: [
      'Buscando atracciones verificadas en la base de datos oficial',
      'Sincronizando coordenadas GPS y datos de ubicación 1:1',
      'Organizando itinerario de viaje 100% personalizado'
    ]
  },
  ru: {
    title: 'Vora AI 1:1 ИИ-консьерж по Корее',
    subtitle: 'Индивидуальные маршруты (1~5 дней) ➔ Официальная база Национальной организации туризма Кореи и GPS',
    unlimitedBadge: '⚡ Безлимитный доступ',
    quotaRemaining: '🎟️ Осталось бесплатных диалогов на сегодня:',
    quotaTimes: '',
    unlimitedTag: '[ ⚡ Безлимит ]',
    quotaChatTag: '[ Чат сегодня {current}/{total} ]',
    quotaExceededNotice: 'Здравствуйте! Я Vora, ваш персональный ИИ-консьерж по Корее. 😊\n\n⚠️ Вы использовали все бесплатные диалоги на сегодня ({limit}).',
    adRechargeBtn: '🎬 Посмотреть короткое видео (15 сек) и получить +3 чата',
    googleExpandBtn: '🔴 Вход через Google за 3 сек для 15 чатов в день',
    guardHint: '💡 Задавайте вопросы о достопримечательностях, кухне и транспорте Кореи!',
    welcomeText: 'Здравствуйте! Я Vora, ваш ИИ-консьерж по путешествиям в Корею. 😊\n\nПолучайте персональные маршруты от 1 до 5 дней на основе официальных данных Национальной организации туризма Кореи!\n\nЗадайте любой вопрос по городам и стилям поездки (например: 3 дня в Пусане с кафе с видом на море, 2 дня в Се우ле по местам K-Culture)!',
    chips: ['📍 3 дня в Пусане с видовыми кафе', '📍 2 дня в Сеуле по местам K-Culture', '📍 4 дня на Чеджу гастротур', '📍 Что здесь можно посмотреть?'],
    placeholder: 'Куда вы хотите поехать? (например: 3 дня в Пусане, 2 дня в Сеуле)',
    sendBtn: 'Отправить',
    rightPanelTitle: '🗺️ Рекомендованный 1:1 маршрут',
    rightPanelPlaceholder: 'Спросите Vora AI в чате слева о вашем путешествии, и рекомендованный маршрут автоматически синхронизируется в этой панели в реальном времени!',
    rightPanelLoadingTitle: '⚡ Vora AI составляет индивидуальный маршрут...',
    rightPanelLoadingSub: 'Синхронизация с проверенными достопримечательностями туризма Кореи.',
    agodaLink: '🏨 Забронировать отель со скидкой на Agoda',
    klookLink: '🎟️ Забронировать билеты и активности на Klook',
    searchingSpots: 'Поиск проверенных достопримечательностей в официальной базе',
    voiceRecognitionTitle: 'Голосовой ввод',
    dayBadge: 'День {day}',
    recommendSpot: 'Рекомендованное место',
    viewRouteMap: '🗺️ Посмотреть полный маршрут на карте (1-2-3 день)',
    detailMap: 'Подробная карта ➔',
    openMap: 'Открыть ➔',
    syncedCount: '{count} синхр.',
    loadingSteps: [
      'Поиск проверенных мест в базе туризма Кореи',
      'Синхронизация GPS-координат и данных локаций 1:1',
      'Формирование 100% индивидуального маршрута'
    ]
  }
};

export default function AITestWorkbench({ lang = 'ko', onOpenDetail, bookmarks = [], onToggleBookmark }) {
  const wt = WORKBENCH_I18N[lang] || WORKBENCH_I18N.ko;

  // 1. Quota & Dev Bypass Hook State
  const { usedCount, remainingQuota, dailyLimit, canProceed, isDevBypass, toggleDevBypass, incrementQuota } = useQuotaLimit(5);

  // 2. Dev Test Simulator & Admin Dashboard States
  const [virtualTier, setVirtualTier] = useState('dev');
  const [virtualQuotaLimit, setVirtualQuotaLimit] = useState(5);
  const [extraRechargeCount, setExtraRechargeCount] = useState(0);
  const [isVirtualGoogleLogin, setIsVirtualGoogleLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // 3. Responsive Window Width Detection (Desktop >= 768px)
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Mobile Accordion Toggle States & PC Selected Message State
  const [expandedMobileMsgs, setExpandedMobileMsgs] = useState({});
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [isCourseMapOpen, setIsCourseMapOpen] = useState(false);
  const [selectedCourseSpots, setSelectedCourseSpots] = useState([]);
  const [selectedCourseRegion, setSelectedCourseRegion] = useState('');

  const toggleMobileAccordion = (msgId) => {
    setExpandedMobileMsgs(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // 5. Dynamic High-Visibility Animated Loading Dots & Status Step State
  const [loadingDots, setLoadingDots] = useState('●');
  const [loadingStepText, setLoadingStepText] = useState(wt.searchingSpots);

  // 6. Chat History Stream State
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome-1',
      sender: 'vora',
      text: wt.welcomeText,
      timestamp: new Date().toLocaleTimeString(),
      chips: wt.chips
    }
  ]);

  // Reset chat history and state completely whenever user changes language
  useEffect(() => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        sender: 'vora',
        text: wt.welcomeText,
        timestamp: new Date().toLocaleTimeString(),
        chips: wt.chips
      }
    ]);
    setSelectedMsgId(null);
    setInputPrompt('');
    setExpandedMobileMsgs({});
  }, [lang]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // PC Right Fixed Panel: Strictly bind ONLY to the latest vora message (Clear if latest response has no spots or is loading)
  const latestVoraMessage = [...chatHistory].reverse().find(msg => msg.sender === 'vora') || null;
  const activeSpotMessage = (!isLoading && latestVoraMessage && Array.isArray(latestVoraMessage.spots) && latestVoraMessage.spots.length > 0)
    ? latestVoraMessage
    : null;

  // Auto-scroll to bottom of chat container & Smart Auto-focus input box (Desktop PC Only)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (!isLoading) {
      setTimeout(() => {
        // Smart device check: Only auto-focus on PC desktop (non-touch) devices to prevent virtual keyboard from popping up on mobile
        const isTouchOrMobile = typeof window !== 'undefined' && (
          window.innerWidth < 768 ||
          'ontouchstart' in window ||
          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
          (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
        );
        if (!isTouchOrMobile) {
          inputRef.current?.focus();
        }
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [chatHistory, isLoading, loadingDots]);

  // High-Visibility Animated Wave Dots & Rotating Status Step Text
  useEffect(() => {
    let timerDots;
    let timerStep;
    const currentSteps = (wt && wt.loadingSteps && wt.loadingSteps.length > 0) ? wt.loadingSteps : [
      '한국관광공사 정품 DB에서 추천 명소 탐색 중',
      'GPS 지도 좌표 및 위치 데이터 1:1 동기화 중',
      '100% 맞춤 여행 일정을 정돈하고 있습니다'
    ];

    if (isLoading) {
      setLoadingDots('●');
      setLoadingStepText(currentSteps[0]);

      timerDots = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '●') return '● ●';
          if (prev === '● ●') return '● ● ●';
          if (prev === '● ● ●') return '● ● ● ●';
          return '●';
        });
      }, 350);

      let stepCount = 0;
      timerStep = setInterval(() => {
        stepCount = (stepCount + 1) % currentSteps.length;
        setLoadingStepText(currentSteps[stepCount]);
      }, 900);
    } else {
      setLoadingDots('●');
    }
    return () => {
      clearInterval(timerDots);
      clearInterval(timerStep);
    };
  }, [isLoading, wt]);

  const handleCycleVirtualTier = () => {
    if (virtualTier === 'dev') {
      setVirtualTier('guest');
      setVirtualQuotaLimit(5);
      toggleDevBypass(false);
    } else if (virtualTier === 'guest') {
      setVirtualTier('user');
      setVirtualQuotaLimit(15);
      setIsVirtualGoogleLogin(true);
      toggleDevBypass(false);
    } else if (virtualTier === 'user') {
      setVirtualTier('vip');
      setVirtualQuotaLimit(9999);
      toggleDevBypass(true);
    } else if (virtualTier === 'vip') {
      setVirtualTier('depleted');
      setVirtualQuotaLimit(5);
      toggleDevBypass(false);
    } else {
      setVirtualTier('dev');
      setVirtualQuotaLimit(5);
      toggleDevBypass(true);
    }
  };

  const handleRechargeExtra = () => {
    setExtraRechargeCount(prev => prev + 5);
    logAnalyticsEvent('VIDEO_AD');
    alert('⚡ [테스트 충전] +5회 무료 대화가 가상으로 즉시 충전되었습니다!');
  };

  const handleToggleVirtualGoogleLogin = () => {
    const nextState = !isVirtualGoogleLogin;
    setIsVirtualGoogleLogin(nextState);
    if (nextState) {
      setVirtualQuotaLimit(15);
      setVirtualTier('user');
      logAnalyticsEvent('LOGIN');
      alert('🔑 [가상 구글 로그인 완료] 일일 한도가 15회로 확장되었습니다!');
    } else {
      setVirtualQuotaLimit(5);
      setVirtualTier('guest');
      alert('🔒 [로그아웃] 일일 한도가 비회원 5회로 변경되었습니다.');
    }
  };

  const handleStartVoiceSTT = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식(STT)을 지원하지 않습니다.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : (lang === 'ja' ? 'ja-JP' : (lang === 'zh' ? 'zh-CN' : 'ko-KR'));
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
      };
      recognition.start();
    } catch (e) {
      console.warn('STT Error:', e);
      setIsListening(false);
    }
  };

  const getDayBadgeStyle = (dayIndex) => {
    const colors = [
      { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
      { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
      { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
      { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
      { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' }
    ];
    return colors[(dayIndex - 1) % colors.length];
  };

  const handleSendMessage = async (customText = null) => {
    const query = (customText || inputPrompt).trim();
    if (!query || isLoading) return;

    const totalLimit = virtualQuotaLimit + extraRechargeCount;
    const nextAskIndex = Math.min(totalLimit, usedCount + 1);
    const quotaTag = isDevBypass 
      ? (wt.unlimitedTag || '[ ⚡ Unlimited ]')
      : (wt.quotaChatTag || '[ Today Chat {current}/{total} ]').replace('{current}', nextAskIndex).replace('{total}', totalLimit);

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      quotaTag: quotaTag,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setSelectedMsgId(null);
    setIsLoading(true);

    if (isGreetingQuery(query) || isMetaHelpQuery(query)) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: '안녕하세요! 여행 컨시어지 Vora AI입니다. 😊\n\n저는 대한민국 맞춤 여행을 도와드리는 AI 컨시어지입니다:\n\n📍 **지역별 맞춤 코스 설계**: "제주도 3박4일", "부산 해운대 1박2일"\n🌿 **테마별 명소 추천**: "거제도 오션뷰 카페", "수원 화성행궁 야경 힐링"\n🚗 **동선 및 위치 동기화**: 1일차~5일차 일자별 정품 명소 & 지도 위치 제공\n\n떠나고 싶으신 지역이나 여행 스타일을 자유롭게 물어보세요!',
            timestamp: new Date().toLocaleTimeString(),
            spots: [],
            chips: ['거제도 2박3일 오션뷰 카페', '수원 화성행궁 야경 힐링', '제주도 3박4일 맛집 탐방', '여기서 뭘 할 수 있지?']
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    const isMeta = isMetaHelpQuery(query);
    if (!isMeta) {
      const guardResult = validateTravelQuery(query, lang);
      if (!guardResult.isValid) {
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            {
              id: `vora-${Date.now()}`,
              sender: 'vora',
              text: guardResult.reason,
              timestamp: new Date().toLocaleTimeString(),
              isGuardWarning: true,
              chips: ['거제도 2박3일 오션뷰 카페', '수원 화성행궁 야경 힐링', '제주도 3박4일 맛집 탐방', '여기서 뭘 할 수 있지?']
            }
          ]);
          setIsLoading(false);
        }, 300);
        return;
      }
    }

    if (!isDevBypass && usedCount >= totalLimit) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            id: `vora-${Date.now()}`,
            sender: 'vora',
            text: (wt.quotaExceededNotice || '안녕하세요! 여행 컨시어지 보라입니다. 😊\n\n⚠️ 오늘 제공된 무료 대화 ({limit}회)를 모두 소비하셨습니다.').replace('{limit}', totalLimit),
            timestamp: new Date().toLocaleTimeString(),
            isQuotaExceededNotice: true
          }
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    incrementQuota();
    let initialCity = extractLocationKeyword(query);
    
    let days = 3;
    if (/(5일|4박\s*5일|5박|5d)/i.test(query)) days = 5;
    else if (/(4일|3박\s*4일|4박|4d)/i.test(query)) days = 4;
    else if (/(3일|2박\s*3일|3박|3d)/i.test(query)) days = 3;
    else if (/(2일|1박\s*2일|2박|2d)/i.test(query)) days = 2;
    else if (/(1일|당일|1박)/i.test(query)) days = 1;

    try {
      // Clean Architecture: Guaranteed Single Atomic Tuple Result
      const aiBriefing = await geminiGenerateFullItinerary(query, lang);
      logAnalyticsEvent('CHAT', { inputTokens: 120, outputTokens: 350 });

      let spotsToRender = [];
      let agodaUrl = null;
      let klookUrl = null;
      let displayCity = aiBriefing?.targetCity || initialCity || extractLocationKeyword(query) || '추천';
      const isUnknownPlace = aiBriefing?.isUnknownPlace || false;

      if (!isMeta && !isUnknownPlace) {
        if (aiBriefing?.spots && Array.isArray(aiBriefing.spots) && aiBriefing.spots.length > 0) {
          spotsToRender = aiBriefing.spots;
        } else if (aiBriefing?.dailySchedules && aiBriefing.dailySchedules.length > 0) {
          spotsToRender = aiBriefing.dailySchedules.flatMap(ds => 
            (ds.spots || []).map(sp => ({
              ...sp,
              assignedDay: ds.day || 1
            }))
          );
        } else {
          spotsToRender = [];
        }

        agodaUrl = isUnknownPlace ? null : (aiBriefing?.agodaUrl || getAgodaHotelSearchUrl(displayCity));
        klookUrl = isUnknownPlace ? null : (aiBriefing?.klookUrl || getKlookActivitySearchUrl(displayCity));
      }

      const voraMsgId = `vora-${Date.now()}`;
      const voraResponse = {
        id: voraMsgId,
        sender: 'vora',
        text: aiBriefing?.summary || aiBriefing?.aiRecommendationSummary || `안녕하세요! 여행 컨시어지 보라입니다. 😊 '${displayCity}' 여행 코스를 준비했습니다.`,
        timestamp: new Date().toLocaleTimeString(),
        targetCity: isUnknownPlace ? null : displayCity,
        days,
        spots: isUnknownPlace ? [] : spotsToRender,
        agodaUrl,
        klookUrl
      };

      setChatHistory(prev => [...prev, voraResponse]);
      setSelectedMsgId(voraMsgId);

      if (voraMsgId && spotsToRender.length > 0) {
        setExpandedMobileMsgs(prev => ({ ...prev, [voraMsgId]: true }));
      }

    } catch (err) {
      console.warn('Pipeline execution error fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const userLabel = lang === 'en' ? '👤 You' : (lang === 'ja' ? '👤 あなた' : (lang === 'zh' ? '👤 me' : '👤 나'));

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      borderRadius: '24px',
      padding: '1.25rem',
      margin: '1rem 0',
      border: '1px solid #cbd5e1',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* 🛠️ TOP CONTROL BAR (Dev / Admin mode only) */}
      {(typeof window !== 'undefined' && (window.location.search.includes('dev=true') || window.location.hostname === 'localhost' || window.sessionStorage.getItem('vora_dev_mode') === 'true')) && (
        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '0.75rem 1rem',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: '#7e22ce' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
              🛠️ AI 쿼터 & 회원 등급 제어판 (Dev Mode):
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => toggleDevBypass()}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: isDevBypass ? '#10b981' : '#ffe4e6',
                color: isDevBypass ? '#ffffff' : '#be123c'
              }}
            >
              {isDevBypass ? <Zap size={13} /> : <ShieldAlert size={13} />}
              {isDevBypass ? '무제한 모드 ON' : '유저 제한 모드'}
            </button>

            <button
              onClick={handleRechargeExtra}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: '#2563eb',
                color: '#ffffff'
              }}
            >
              <PlusCircle size={13} />
              +5회 즉시 충전 {extraRechargeCount > 0 && `(+${extraRechargeCount})`}
            </button>

            <button
              onClick={handleToggleVirtualGoogleLogin}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: isVirtualGoogleLogin ? '#ea580c' : '#64748b',
                color: '#ffffff'
              }}
            >
              <UserCheck size={13} />
              {isVirtualGoogleLogin ? '🔑 구글 로그인 상태' : '🔒 비회원 상태'}
            </button>

            <button
              onClick={handleCycleVirtualTier}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: '#faf5ff',
                color: '#7e22ce',
                border: '1px solid #d8b4fe'
              }}
            >
              <Crown size={13} />
              등급: <strong>{userTier}</strong>
            </button>
          </div>
        </div>
      )}

      {/* CHAT CONTAINER HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.65rem',
        marginBottom: '0.85rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ padding: '0.4rem', backgroundColor: '#9333ea', color: '#ffffff', borderRadius: '10px', display: 'flex' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              {wt.title}
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {wt.subtitle}
            </span>
          </div>
        </div>

        <div style={{
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: isDevBypass ? '#d1fae5' : '#dbeafe',
          color: isDevBypass ? '#065f46' : '#1e40af',
          border: isDevBypass ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          {isDevBypass ? (
            <>{wt.unlimitedBadge}</>
          ) : (
            <>{wt.quotaRemaining} <span style={{ color: '#b45309' }}>{Math.max(0, (virtualQuotaLimit + extraRechargeCount) - usedCount)}</span> / {virtualQuotaLimit + extraRechargeCount}{wt.quotaTimes}</>
          )}
        </div>
      </div>

      {/* 🔥 RESPONSIVE HYBRID UX LAYOUT CONTAINER (PC: Left Rich Text Only | Right Fixed Cards Only) */}
      <div style={{
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        gap: '1.25rem',
        alignItems: 'flex-start'
      }}>

        {/* LEFT COLUMN: CHAT STREAM & INPUT (PC: 60% Width | Mobile: 100% Width) */}
        <div style={{
          flex: isDesktop ? '1 1 58%' : '1 1 100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>

          {/* CHAT MESSAGES STREAM CONTAINER */}
          <div
            ref={chatContainerRef}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: isDesktop ? '1rem 1rem 2.5rem 1rem' : '0.65rem 0.65rem 2.5rem 0.65rem',
              minHeight: '380px',
              maxHeight: '560px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              border: '1px solid #cbd5e1',
              marginBottom: '0.85rem',
              scrollBehavior: 'smooth'
            }}>
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                onClick={() => msg.spots && msg.spots.length > 0 && setSelectedMsgId(msg.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.15rem',
                  cursor: (msg.spots && msg.spots.length > 0) ? 'pointer' : 'default'
                }}
              >
                {/* Sender Label & Timestamp */}
                <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.1rem' }}>
                  <span>{msg.sender === 'user' ? userLabel : '🤖 Vora AI'}</span>
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div style={{
                  maxWidth: isDesktop ? '92%' : (msg.sender === 'user' ? '88%' : '100%'),
                  width: (!isDesktop && msg.sender !== 'user') ? '100%' : 'auto',
                  padding: '0.65rem 0.95rem',
                  borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.84rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.sender === 'user' ? '0 3px 8px rgba(37, 99, 235, 0.18)' : '0 3px 8px rgba(0, 0, 0, 0.04)',
                  border: (isDesktop && activeSpotMessage?.id === msg.id) ? '2px solid #9333ea' : (msg.sender === 'user' ? 'none' : '1px solid #e2e8f0')
                }}>
                  {msg.sender === 'user' && msg.quotaTag && (
                    <span style={{ fontSize: '0.68rem', opacity: 0.85, marginRight: '0.4rem', fontWeight: 600 }}>
                      {msg.quotaTag}
                    </span>
                  )}

                  {/* 🌟 RICH AI ITINERARY TEXT BRIEFING */}
                  {msg.text}

                  {msg.isGuardWarning && (
                    <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9', color: '#dc2626', fontSize: '0.75rem' }}>
                      {wt.guardHint}
                    </div>
                  )}

                  {msg.isQuotaExceededNotice && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={handleRechargeExtra}
                        style={{ padding: '0.45rem 0.75rem', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'center' }}
                      >
                        {wt.adRechargeBtn}
                      </button>
                      <button
                        onClick={handleToggleVirtualGoogleLogin}
                        style={{ padding: '0.45rem 0.75rem', backgroundColor: '#ea580c', color: '#ffffff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'center' }}
                      >
                        {wt.googleExpandBtn}
                      </button>
                    </div>
                  )}

                  {/* 📱 MOBILE VIEW ONLY: ACCORDION TOGGLE & CARDS (PC HAS ZERO INLINE CARDS ON LEFT!) */}
                  {!isDesktop && msg.spots && msg.spots.length > 0 && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMobileAccordion(msg.id);
                          setSelectedMsgId(msg.id);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          backgroundColor: '#f3e8ff',
                          color: '#7e22ce',
                          border: '1px solid #e9d5ff',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          🗺️ {msg.targetCity || (lang === 'en' ? 'Korea' : '추천')} {wt.rightPanelTitle} ({wt.syncedCount.replace('{count}', msg.spots.length)})
                        </span>
                        {expandedMobileMsgs[msg.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {expandedMobileMsgs[msg.id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
                          {/* 🗺️ MOBILE COURSE MAP ROUTE TRIGGER BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourseSpots(msg.spots);
                              setSelectedCourseRegion(msg.targetCity || '추천');
                              setIsCourseMapOpen(true);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.65rem 0.85rem',
                              backgroundColor: '#9333ea',
                              background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
                              marginBottom: '0.2rem'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Compass size={15} /> {wt.viewRouteMap}
                            </span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>{wt.openMap}</span>
                          </button>

                          {msg.spots.map((spot, idx) => {
                            const dayNum = spot.assignedDay || 1;
                            const badgeStyle = getDayBadgeStyle(dayNum);
                            const displayTitle = getTranslatedTitle(spot.title, lang);
                            const displayLocation = getTranslatedAddress(spot.location || spot.addr1, lang);
                            const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((displayTitle || spot.title) + ' ' + (displayLocation || spot.location || spot.addr1 || ''))}`;

                            return (
                              <div 
                                key={spot.id || idx} 
                                onClick={() => onOpenDetail && onOpenDetail(spot)}
                                style={{ 
                                  padding: '0.75rem 0.85rem', 
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '14px', 
                                  border: '1.5px solid #e2e8f0', 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  gap: '0.55rem',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                  transition: 'border-color 0.15s ease, transform 0.15s ease'
                                }}
                              >
                                {/* Row 1: Day Badge, Full Spot Title & Full Location */}
                                <div style={{ width: '100%' }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                    <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, backgroundColor: badgeStyle.bg, color: badgeStyle.text, border: `1px solid ${badgeStyle.border}`, whiteSpace: 'nowrap', flexShrink: 0, marginTop: '2px' }}>
                                      {spot.assignedDay ? wt.dayBadge.replace('{day}', spot.assignedDay) : wt.recommendSpot}
                                    </span>
                                    <strong style={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 800, wordBreak: 'break-word', lineHeight: 1.4 }}>
                                      {idx + 1}. {displayTitle}
                                    </strong>
                                  </div>
                                  <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-word' }}>
                                    <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                                    <span>{displayLocation || (lang === 'en' ? 'Location Provided' : '상세 위치 제공')}</span>
                                  </div>
                                </div>

                                {/* Row 2: 2 Full Touch Action Buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', width: '100%', paddingTop: '0.15rem' }} onClick={(e) => e.stopPropagation()}>
                                  {/* 🔍 Primary Action: Photos & Detail */}
                                  <button
                                    onClick={() => onOpenDetail && onOpenDetail(spot)}
                                    style={{
                                      flex: 1,
                                      minWidth: 0,
                                      padding: '0.45rem 0.35rem',
                                      backgroundColor: '#9333ea',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '10px',
                                      fontSize: '0.74rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.25rem',
                                      whiteSpace: 'nowrap',
                                      boxShadow: '0 2px 6px rgba(147, 51, 234, 0.25)'
                                    }}
                                  >
                                    <Sparkles size={12} />
                                    <span>{getSpotDetailButtonLabel(lang, false)}</span>
                                  </button>

                                  {/* 📍 Secondary Action: Google Maps */}
                                  <a
                                    href={mapSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      flex: 1,
                                      minWidth: 0,
                                      padding: '0.45rem 0.35rem',
                                      backgroundColor: '#f0f9ff',
                                      color: '#0284c7',
                                      border: '1px solid #bae6fd',
                                      borderRadius: '10px',
                                      textDecoration: 'none',
                                      fontSize: '0.74rem',
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.25rem',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <MapPin size={12} color="#0284c7" />
                                    <span>{getSpotMapButtonLabel(lang, false)}</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}

                          {msg.agodaUrl && msg.klookUrl && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                              <a href={msg.agodaUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', border: '1px solid #bfdbfe', textDecoration: 'none', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                🏨 아고다 {msg.targetCity} 할인 숙소 <ExternalLink size={10} />
                              </a>
                              <a href={msg.klookUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '6px', border: '1px solid #ffedd5', textDecoration: 'none', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                🎟️ 클룩 {msg.targetCity} 액티비티 <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                {msg.chips && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                    {msg.chips.map((chipText, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chipText)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                        }}
                      >
                        📍 {chipText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1.1rem',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #d8b4fe',
                color: '#7e22ce',
                fontSize: '0.82rem',
                fontWeight: 700,
                maxWidth: '88%',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.08)'
              }}>
                <RefreshCw size={17} className="animate-spin" style={{ color: '#9333ea' }} />
                <span>{loadingStepText} <strong style={{ color: '#7e22ce', fontSize: '0.95rem' }}>{loadingDots}</strong></span>
              </div>
            )}

            <div ref={chatEndRef} style={{ height: '10px' }} />
          </div>

          {/* 📱 MOBILE PERSISTENT FLOATING COURSE MAP BUTTON (Always in view above input bar) */}
          {!isDesktop && activeSpotMessage?.spots && activeSpotMessage.spots.length > 0 && (
            <div style={{
              marginBottom: '0.65rem',
              width: '100%'
            }}>
              <button
                onClick={() => {
                  setSelectedCourseSpots(activeSpotMessage.spots);
                  setSelectedCourseRegion(activeSpotMessage.regionName || activeSpotMessage.targetCity || '추천');
                  setIsCourseMapOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Compass size={17} /> 🗺️ {activeSpotMessage.regionName || activeSpotMessage.targetCity || '추천'} 1·2·3일차 지도 동선 ({activeSpotMessage.spots.length}곳)
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}>
                  동선 열기 ➔
                </span>
              </button>
            </div>
          )}

          {/* INPUT FORM CONTAINER */}
          <div style={{ display: 'flex', gap: '0.4rem', position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={wt.placeholder}
              style={{
                flex: 1,
                padding: '0.75rem 0.9rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />

            <button
              onClick={handleStartVoiceSTT}
              style={{
                padding: '0 0.75rem',
                backgroundColor: isListening ? '#ef4444' : '#f1f5f9',
                color: isListening ? '#ffffff' : '#334155',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={wt.voiceRecognitionTitle}
            >
              <Mic size={17} />
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              style={{
                padding: '0 1.1rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: (isLoading || !inputPrompt.trim()) ? 0.5 : 1
              }}
            >
              <Send size={15} />
              <span>{wt.sendBtn}</span>
            </button>
          </div>

        </div>

        {/* 🖥️ PC DESKTOP ONLY: 2-COLUMN RIGHT FIXED PANEL (DEDICATED EXCLUSIVE CARD LIST) */}
        {isDesktop && (
          <div style={{
            flex: '1 1 42%',
            width: '100%',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            position: 'sticky',
            top: '1rem',
            maxHeight: '620px',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.65rem',
              marginBottom: '0.85rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={18} style={{ color: '#7e22ce' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {activeSpotMessage ? `${activeSpotMessage.regionName || ''} ${wt.rightPanelTitle}` : wt.rightPanelTitle}
                </h4>
              </div>
              {activeSpotMessage?.spots && (
                <span style={{ fontSize: '0.72rem', color: '#9333ea', backgroundColor: '#f3e8ff', padding: '0.2rem 0.55rem', borderRadius: '12px', fontWeight: 600 }}>
                  {wt.syncedCount.replace('{count}', activeSpotMessage.spots.length)}
                </span>
              )}
            </div>

            {activeSpotMessage?.spots && activeSpotMessage.spots.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* 🗺️ DESKTOP COURSE MAP ROUTE TRIGGER BUTTON */}
                <button
                  onClick={() => {
                    setSelectedCourseSpots(activeSpotMessage.spots);
                    setSelectedCourseRegion(activeSpotMessage.regionName || '추천');
                    setIsCourseMapOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.95rem',
                    background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(147, 51, 234, 0.25)',
                    transition: 'all 0.2s ease',
                    marginBottom: '0.25rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(147, 51, 234, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(147, 51, 234, 0.25)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Compass size={16} /> {wt.viewRouteMap}
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.95 }}>{wt.detailMap}</span>
                </button>

                {activeSpotMessage.spots.map((spot, idx) => {
                  const dayNum = spot.assignedDay || 1;
                  const badgeStyle = getDayBadgeStyle(dayNum);
                  const displayTitle = getTranslatedTitle(spot.title, lang);
                  const displayLocation = getTranslatedAddress(spot.location || spot.addr1, lang);
                  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((displayTitle || spot.title) + ' ' + (displayLocation || spot.location || spot.addr1 || ''))}`;

                  return (
                    <div 
                      key={spot.id || idx} 
                      onClick={() => onOpenDetail && onOpenDetail(spot)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                        backgroundColor: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: '14px',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#9333ea';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Row 1: Day Badge, Spot Title & Location */}
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: badgeStyle.bg, color: badgeStyle.text, border: `1px solid ${badgeStyle.border}`, padding: '0.15rem 0.45rem', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0, marginTop: '2px' }}>
                            {spot.assignedDay ? wt.dayBadge.replace('{day}', spot.assignedDay) : wt.recommendSpot}
                          </span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', wordBreak: 'break-word', lineHeight: 1.4 }}>
                            {idx + 1}. {displayTitle}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-word' }}>
                          <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                          <span>{displayLocation || (lang === 'en' ? 'Location Provided' : '상세 위치 제공')}</span>
                        </div>
                      </div>

                      {/* Row 2: Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', width: '100%', paddingTop: '0.15rem' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenDetail && onOpenDetail(spot)}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            padding: '0.45rem 0.6rem',
                            fontSize: '0.76rem',
                            color: '#ffffff',
                            backgroundColor: '#9333ea',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 6px rgba(147, 51, 234, 0.3)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7e22ce';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#9333ea';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <Sparkles size={12} />
                          <span>{getSpotDetailButtonLabel(lang, false)}</span>
                        </button>

                        <a 
                          href={mapSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            padding: '0.45rem 0.6rem',
                            fontSize: '0.74rem',
                            color: '#0284c7',
                            backgroundColor: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e0f2fe';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <MapPin size={12} color="#0284c7" />
                          <span>{getSpotMapButtonLabel(lang, false)}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}

                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <a href="https://www.agoda.com" target="_blank" rel="noreferrer" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}>
                    <span>{wt.agodaLink}</span>
                    <span>↗</span>
                  </a>
                  <a href="https://www.klook.com" target="_blank" rel="noreferrer" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#fff7ed',
                    borderRadius: '8px',
                    border: '1px solid #fed7aa',
                    color: '#c2410c',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}>
                    <span>{wt.klookLink}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ) : isLoading ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#9333ea', fontSize: '0.8rem' }}>
                <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: '#9333ea', display: 'block' }} />
                <div style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.85rem' }}>{wt.rightPanelLoadingTitle}</div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{wt.rightPanelLoadingSub}</span>
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                <Map size={32} style={{ margin: '0 auto 0.5rem auto', color: '#cbd5e1', display: 'block' }} />
                <span>{wt.rightPanelPlaceholder}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 🗺️ INTERACTIVE DAY-BY-DAY COURSE MAP VIEW MODAL */}
      <CourseMapViewModal
        isOpen={isCourseMapOpen}
        onClose={() => setIsCourseMapOpen(false)}
        spots={selectedCourseSpots}
        regionName={selectedCourseRegion}
        lang={lang}
        onOpenDetail={onOpenDetail}
      />

    </div>
  );
}
