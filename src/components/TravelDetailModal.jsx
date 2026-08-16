import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Star, MapPin, Clock, Phone, SunMedium, CheckCircle, Heart, 
  Globe, Loader2, Hotel, Ticket, ExternalLink, Sparkles, ChevronLeft, 
  ChevronRight, Car, Ban, Baby, Dog, Navigation, Camera
} from 'lucide-react';
import { fetchSpotDetailCommon, fetchSpotDetailImages, fetchSpotDetailIntro } from '../services/tourApi';
import { PUBLIC_API_CONFIG, buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';
import { TRANSLATIONS, getTranslatedTitle, getTranslatedAddress, getTranslatedReview, getTranslatedOverview, getTranslatedDetailText, getCloseButtonLabel } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';
import { useModalHistory } from '../hooks/useModalHistory';

const DETAIL_MODAL_I18N = {
  ko: {
    certifiedBadge: '• 한국관광공사 정품 인증 관광지',
    bookmarkSave: '즐겨찾기 저장',
    bookmarkSaved: '즐겨찾기 저장됨 ❤️',
    kakaoMap: '카카오맵 길찾기 ↗',
    naverMap: '네이버지도 길찾기 ↗',
    googleMap: '구글지도 (GPS) ↗',
    overviewTitle: '관광지 상세 개요',
    loadingOverview: '한국관광공사 정품 상세정보 수신 중...',
    publicDataTitle: '공공데이터 정품 이용 안내',
    locationLabel: '위치 및 주소',
    hoursLabel: '이용 및 관람 시간',
    holidayLabel: '쉬는날 (휴무일)',
    parkingLabel: '주차 시설 및 요금',
    feeLabel: '입장료 및 이용요금',
    petLabel: '반려동물 동반 정보',
    babyLabel: '유모차 및 보행 편의',
    contactLabel: '문의 및 안내 전화',
    officialWebsite: '공식 웹사이트 바로가기',
    visitBtn: '방문하기 ↗',
    snsTrends: '실시간 SNS 트렌드 & 포토존 갤러리',
    photoTag: '#인생샷명소',
    instaFeed: '인스타 실시간 피드 ↗',
    googleGallery: '구글 실시간 갤러리 ↗',
    partnerHeader: '주변 추천 숙소 및 액티비티 예약',
    agodaDeal: '아고다 특가 숙소 ↗',
    klookTours: '클룩 투어 & 티켓 ↗',
    reviewsHeader: '💬 여행자 방문 리뷰 ({count})',
    satisfaction: '평균 만족도 ★ {rating}',
    reviewPlaceholder: '이 명소에 대한 생생한 후기를 남겨보세요...',
    reviewSubmit: '등록',
    collapseReviews: '리뷰 접기 ▲',
    moreReviews: '리뷰 더보기 ({count}개) ▼'
  },
  en: {
    certifiedBadge: '• KTO Certified Official Landmark',
    bookmarkSave: 'Save Bookmark',
    bookmarkSaved: 'Saved in Bookmarks ❤️',
    kakaoMap: 'KakaoMap ↗',
    naverMap: 'Naver Map ↗',
    googleMap: 'Google Maps (GPS) ↗',
    overviewTitle: 'Attraction Overview',
    loadingOverview: 'Loading official KTO detailed info...',
    publicDataTitle: 'Official Public Data Travel Guide',
    locationLabel: 'Location & Address',
    hoursLabel: 'Operating & Visiting Hours',
    holidayLabel: 'Closed Days (Holidays)',
    parkingLabel: 'Parking Facilities & Fees',
    feeLabel: 'Admission & Ticket Fees',
    petLabel: 'Pet Friendly Policy',
    babyLabel: 'Stroller & Accessibility',
    contactLabel: 'Contact & Inquiries',
    officialWebsite: 'Visit Official Website',
    visitBtn: 'Visit ↗',
    snsTrends: 'Real-time SNS Trends & Photo Gallery',
    photoTag: '#PhotoSpot',
    instaFeed: 'Instagram Feed ↗',
    googleGallery: 'Google Live Gallery ↗',
    partnerHeader: 'Nearby Hotels & Activity Deals',
    agodaDeal: 'Agoda Hotel Deals ↗',
    klookTours: 'Klook Tours & Passes ↗',
    reviewsHeader: '💬 Traveler Reviews ({count})',
    satisfaction: 'Avg. Rating ★ {rating}',
    reviewPlaceholder: 'Share your experience about this spot...',
    reviewSubmit: 'Post',
    collapseReviews: 'Collapse Reviews ▲',
    moreReviews: 'Show More Reviews ({count}) ▼'
  },
  ja: {
    certifiedBadge: '• 韓国観光公社公式認定スポット',
    bookmarkSave: 'お気に入り保存',
    bookmarkSaved: '保存済み ❤️',
    kakaoMap: 'Kakaoマップ ↗',
    naverMap: 'Naverマップ ↗',
    googleMap: 'Googleマップ (GPS) ↗',
    overviewTitle: '観光地 詳細概要',
    loadingOverview: '韓国観光公社公式詳細データを受信中...',
    publicDataTitle: '公的データ公式利用案内',
    locationLabel: '位置および住所',
    hoursLabel: '利用および観覧時間',
    holidayLabel: '定休日（休館日）',
    parkingLabel: '駐車場および料金',
    feeLabel: '入場料および利用料金',
    petLabel: 'ペット同伴情報',
    babyLabel: 'ベビーカー・バリアフリー',
    contactLabel: 'お問い合わせ・案内電話',
    officialWebsite: '公式ウェブサイトへ移動',
    visitBtn: '訪問する ↗',
    snsTrends: 'リアルタイムSNSトレンド＆フォトスポット',
    photoTag: '#映えスポット',
    instaFeed: 'インスタグラム ↗',
    googleGallery: 'Googleギャラリー ↗',
    partnerHeader: '周辺のおすすめ宿泊＆アクティビティ予約',
    agodaDeal: 'Agoda 特価ホテル ↗',
    klookTours: 'Klook ツアー＆チケット ↗',
    reviewsHeader: '💬 旅行者レビュー ({count})',
    satisfaction: '平均満足度 ★ {rating}',
    reviewPlaceholder: 'このスポットの感想を投稿してください...',
    reviewSubmit: '登録',
    collapseReviews: 'レビューを閉じる ▲',
    moreReviews: 'レビューをもっと見る ({count}件) ▼'
  },
  zh: {
    certifiedBadge: '• 韩国旅游发展局官方认证景点',
    bookmarkSave: '收藏景点',
    bookmarkSaved: '已收藏 ❤️',
    kakaoMap: 'Kakao地图 ↗',
    naverMap: 'Naver地图 ↗',
    googleMap: '谷歌地图 (GPS) ↗',
    overviewTitle: '景点详细概况',
    loadingOverview: '正在获取韩国旅游发展局官方详细信息...',
    publicDataTitle: '公共数据官方指南',
    locationLabel: '位置与地址',
    hoursLabel: '开放与参观时间',
    holidayLabel: '休息日（公休日）',
    parkingLabel: '停车设施及收费',
    feeLabel: '门票及使用费',
    petLabel: '宠物同行信息',
    babyLabel: '婴儿车与无障碍设施',
    contactLabel: '咨询及服务电话',
    officialWebsite: '前往官方网站',
    visitBtn: '前往访问 ↗',
    snsTrends: '实时SNS热门与拍照打卡画廊',
    photoTag: '#拍照胜地',
    instaFeed: 'Instagram 动态 ↗',
    googleGallery: '谷歌实景画廊 ↗',
    partnerHeader: '周边推荐酒店与活动预订',
    agodaDeal: 'Agoda 特惠酒店 ↗',
    klookTours: 'Klook 门票与体验 ↗',
    reviewsHeader: '💬 游客真实评价 ({count})',
    satisfaction: '平均满意度 ★ {rating}',
    reviewPlaceholder: '留下您对该景点的真实评价...',
    reviewSubmit: '发布',
    collapseReviews: '收起评价 ▲',
    moreReviews: '查看更多评价 ({count}条) ▼'
  },
  zht: {
    certifiedBadge: '• 韓國旅遊發展局官方認證景點',
    bookmarkSave: '收藏景點',
    bookmarkSaved: '已收藏 ❤️',
    kakaoMap: 'Kakao地圖 ↗',
    naverMap: 'Naver地圖 ↗',
    googleMap: '谷歌地圖 (GPS) ↗',
    overviewTitle: '景點詳細概況',
    loadingOverview: '正在獲取韓國旅遊發展局官方詳細資訊...',
    publicDataTitle: '公共數據官方指南',
    locationLabel: '位置與地址',
    hoursLabel: '開放與參觀時間',
    holidayLabel: '休息日（公休日）',
    parkingLabel: '停車設施及收費',
    feeLabel: '門票及使用費',
    petLabel: '寵物同行資訊',
    babyLabel: '嬰兒車與無障礙設施',
    contactLabel: '諮詢及服務電話',
    officialWebsite: '前往官方網站',
    visitBtn: '前往訪問 ↗',
    snsTrends: '即時SNS熱門與打卡畫廊',
    photoTag: '#打卡勝地',
    instaFeed: 'Instagram 動態 ↗',
    googleGallery: '谷歌實景畫廊 ↗',
    partnerHeader: '周邊推薦飯店與活動預訂',
    agodaDeal: 'Agoda 特惠飯店 ↗',
    klookTours: 'Klook 門票與體驗 ↗',
    reviewsHeader: '💬 遊客真實評價 ({count})',
    satisfaction: '平均滿意度 ★ {rating}',
    reviewPlaceholder: '留下您對該景點的真實評價...',
    reviewSubmit: '發布',
    collapseReviews: '收起評價 ▲',
    moreReviews: '查看更多評價 ({count}條) ▼'
  },
  de: {
    certifiedBadge: '• KTO Offiziell zertifizierte Attraktion',
    bookmarkSave: 'Favorit speichern',
    bookmarkSaved: 'Gespeichert ❤️',
    kakaoMap: 'KakaoMap ↗',
    naverMap: 'Naver Map ↗',
    googleMap: 'Google Maps (GPS) ↗',
    overviewTitle: 'Überblick über die Attraktion',
    loadingOverview: 'Offizielle Daten der Korea-Tourismusorganisation werden geladen...',
    publicDataTitle: 'Offizieller Tourismusführer',
    locationLabel: 'Standort & Adresse',
    hoursLabel: 'Öffnungs- & Besuchszeiten',
    holidayLabel: 'Ruhetage (Geschlossen)',
    parkingLabel: 'Parkmöglichkeiten & Gebühren',
    feeLabel: 'Eintrittspreise & Gebühren',
    petLabel: 'Haustiermitnahme',
    babyLabel: 'Kinderwagen & Barrierefreiheit',
    contactLabel: 'Kontakt & Anfragen',
    officialWebsite: 'Offizielle Website besuchen',
    visitBtn: 'Besuchen ↗',
    snsTrends: 'Echtzeit-SNS-Trends & Fotogalerie',
    photoTag: '#Fotospot',
    instaFeed: 'Instagram Feed ↗',
    googleGallery: 'Google Live-Galerie ↗',
    partnerHeader: 'Empfohlene Hotels & Aktivitäten in der Nähe',
    agodaDeal: 'Agoda Hotelangebote ↗',
    klookTours: 'Klook Touren & Tickets ↗',
    reviewsHeader: '💬 Bewertungen von Reisenden ({count})',
    satisfaction: 'Durchschnitt ★ {rating}',
    reviewPlaceholder: 'Teilen Sie Ihre Erfahrungen über diesen Ort...',
    reviewSubmit: 'Senden',
    collapseReviews: 'Bewertungen einklappen ▲',
    moreReviews: 'Mehr Bewertungen ({count}) ▼'
  },
  fr: {
    certifiedBadge: '• Attraction officielle certifiée par KTO',
    bookmarkSave: 'Enregistrer',
    bookmarkSaved: 'Enregistré ❤️',
    kakaoMap: 'KakaoMap ↗',
    naverMap: 'Naver Map ↗',
    googleMap: 'Google Maps (GPS) ↗',
    overviewTitle: 'Aperçu du site touristique',
    loadingOverview: 'Chargement des détails officiels KTO...',
    publicDataTitle: 'Guide touristique officiel',
    locationLabel: 'Emplacement & Adresse',
    hoursLabel: 'Horaires d\'ouverture',
    holidayLabel: 'Jours de fermeture',
    parkingLabel: 'Stationnement & Tarifs',
    feeLabel: 'Tarifs d\'entrée & Billets',
    petLabel: 'Animaux de compagnie',
    babyLabel: 'Poussettes & Accessibilité',
    contactLabel: 'Contact & Renseignements',
    officialWebsite: 'Visiter le site officiel',
    visitBtn: 'Visiter ↗',
    snsTrends: 'Tendances SNS & Galerie Photo',
    photoTag: '#SpotPhoto',
    instaFeed: 'Flux Instagram ↗',
    googleGallery: 'Galerie Google ↗',
    partnerHeader: 'Hôtels & Activités recommandés',
    agodaDeal: 'Offres hôtels Agoda ↗',
    klookTours: 'Tours & Billets Klook ↗',
    reviewsHeader: '💬 Avis des voyageurs ({count})',
    satisfaction: 'Note moyenne ★ {rating}',
    reviewPlaceholder: 'Partagez votre avis sur ce lieu...',
    reviewSubmit: 'Publier',
    collapseReviews: 'Réduire les avis ▲',
    moreReviews: 'Voir plus d\'avis ({count}) ▼'
  },
  es: {
    certifiedBadge: '• Atracción oficial certificada por KTO',
    bookmarkSave: 'Guardar favorito',
    bookmarkSaved: 'Guardado ❤️',
    kakaoMap: 'KakaoMap ↗',
    naverMap: 'Naver Map ↗',
    googleMap: 'Google Maps (GPS) ↗',
    overviewTitle: 'Descripción de la atracción',
    loadingOverview: 'Cargando información oficial de KTO...',
    publicDataTitle: 'Guía oficial de información turística',
    locationLabel: 'Ubicación y dirección',
    hoursLabel: 'Horarios de visita',
    holidayLabel: 'Días de cierre (Festivos)',
    parkingLabel: 'Aparcamiento y tarifas',
    feeLabel: 'Entrada y tarifas',
    petLabel: 'Política de mascotas',
    babyLabel: 'Cochecitos y accesibilidad',
    contactLabel: 'Contacto y consultas',
    officialWebsite: 'Visitar sitio web oficial',
    visitBtn: 'Visitar ↗',
    snsTrends: 'Tendencias en redes y galería de fotos',
    photoTag: '#PuntoFotográfico',
    instaFeed: 'Feed de Instagram ↗',
    googleGallery: 'Galería de Google ↗',
    partnerHeader: 'Hoteles y actividades recomendados',
    agodaDeal: 'Ofertas de hoteles Agoda ↗',
    klookTours: 'Tours y pases Klook ↗',
    reviewsHeader: '💬 Reseñas de viajeros ({count})',
    satisfaction: 'Calificación media ★ {rating}',
    reviewPlaceholder: 'Comparte tu experiencia en este lugar...',
    reviewSubmit: 'Publicar',
    collapseReviews: 'Ocultar reseñas ▲',
    moreReviews: 'Ver más reseñas ({count}) ▼'
  },
  ru: {
    certifiedBadge: '• Официальная достопримечательность KTO',
    bookmarkSave: 'В закладки',
    bookmarkSaved: 'В избранном ❤️',
    kakaoMap: 'KakaoMap ↗',
    naverMap: 'Naver Map ↗',
    googleMap: 'Google Карты (GPS) ↗',
    overviewTitle: 'Обзор достопримечательности',
    loadingOverview: 'Загрузка официальных данных KTO...',
    publicDataTitle: 'Официальный справочник туриста',
    locationLabel: 'Адрес и расположение',
    hoursLabel: 'Время работы и посещения',
    holidayLabel: 'Выходные дни',
    parkingLabel: 'Парковка и тарифы',
    feeLabel: 'Стоимость билетов и входа',
    petLabel: 'С домашними животными',
    babyLabel: 'Коляски и доступная среда',
    contactLabel: 'Контакты и справки',
    officialWebsite: 'Официальный сайт',
    visitBtn: 'Перейти ↗',
    snsTrends: 'Тренды соцсетей и фотозона',
    photoTag: '#Фотозона',
    instaFeed: 'Лента Instagram ↗',
    googleGallery: 'Галерея Google ↗',
    partnerHeader: 'Рекомендованные отели и активности',
    agodaDeal: 'Скидки на отели Agoda ↗',
    klookTours: 'Туры и билеты Klook ↗',
    reviewsHeader: '💬 Отзывы путешественников ({count})',
    satisfaction: 'Средняя оценка ★ {rating}',
    reviewPlaceholder: 'Поделитесь впечатлениями о месте...',
    reviewSubmit: 'Отправить',
    collapseReviews: 'Свернуть отзывы ▲',
    moreReviews: 'Ещё отзывы ({count}) ▼'
  }
};

export default function TravelDetailModal({ spot, onClose, isBookmarked, onToggleBookmark, lang = 'ko' }) {
  useModalHistory(!!spot, onClose, 'travel-detail');

  const dt = DETAIL_MODAL_I18N[lang] || DETAIL_MODAL_I18N.ko;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [detailData, setDetailData] = useState(null);
  const [introData, setIntroData] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [mockReviews, setMockReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setLocalBookmarked(isBookmarked);
  }, [isBookmarked]);

  const displayTitle = getTranslatedTitle(spot?.title, lang);
  const displayRegion = spot?.region && spot.region !== '전국' && spot.region !== '한국'
    ? (t.regions?.[spot.region] || spot.region)
    : (t.countryBadge || '대한민국');

  useEffect(() => {
    if (spot) {
      setLoadingDetail(true);
      setActiveImgIndex(0);
      setGalleryImages([]);
      setIntroData(null);
      setDetailData({
        title: spot.title,
        overview: spot.description || `${spot.title}은(는) 아름다운 경관과 다양한 즐길 거리가 있는 대한민국 대표 관광 명소입니다.`,
        addr1: spot.location || spot.addr1 || '상세 주소 정보 제공',
        firstimage: spot.image || '',
        homepage: spot.homepage || null,
        tel: spot.tel || ''
      });

      // Load saved reviews for this specific spot
      try {
        const spotIdKey = spot.contentId || spot.id || 'default';
        const saved = localStorage.getItem(`ktravel_reviews_${spotIdKey}`);
        if (saved) {
          setMockReviews(JSON.parse(saved));
        } else {
          setMockReviews([
            {
              id: 1,
              author: 'Minjun Kim',
              ageGroup: '20대',
              gender: t.authorMale || '남성',
              rating: 5,
              date: '2026-08-10',
              content: '실제로 가보니 경치가 너무 아름답고 사진 찍기 정말 좋았습니다! 추천합니다.'
            },
            {
              id: 2,
              author: 'Seoyeon Lee',
              ageGroup: '30대',
              gender: t.authorFemale || '여성',
              rating: 5,
              date: '2026-08-08',
              content: '주변 카페와 맛집 동선이 편리하고 주차도 수월해서 가족들과 힐링하고 왔습니다.'
            },
            {
              id: 3,
              author: 'James Wilson',
              ageGroup: '20대',
              gender: t.authorMale || '남성',
              rating: 5,
              date: '2026-08-02',
              content: 'One of the most memorable spots in Korea! Stunning scenery and easy to navigate.'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }

      const targetContentId = spot.contentId || (isNaN(Number(spot.id)) ? null : spot.id);
      const cType = spot.contentTypeId || '12';

      if (targetContentId) {
        Promise.all([
          fetchSpotDetailCommon(targetContentId, lang).catch(() => null),
          fetchSpotDetailImages(targetContentId, lang).catch(() => []),
          fetchSpotDetailIntro(targetContentId, cType, lang).catch(() => null)
        ]).then(([commonRes, imagesRes, introRes]) => {
          if (commonRes) {
            setDetailData(prev => ({
              ...prev,
              title: commonRes.title || prev.title,
              overview: commonRes.overview || prev.overview,
              addr1: commonRes.addr1 || prev.addr1,
              firstimage: commonRes.firstimage || prev.firstimage,
              homepage: commonRes.homepage || prev.homepage,
              tel: commonRes.tel || prev.tel
            }));
          }
          setIntroData(introRes);

          // Build gallery: include spot's main photo + all TourAPI gallery photos
          const allImgs = [];
          const mainImg = commonRes?.firstimage || spot.image;
          if (mainImg && !mainImg.includes('default-spot')) {
            allImgs.push(mainImg.replace(/^http:\/\//i, 'https://'));
          }
          if (Array.isArray(imagesRes) && imagesRes.length > 0) {
            imagesRes.forEach(img => {
              const cleanImg = img.replace(/^http:\/\//i, 'https://');
              if (!allImgs.includes(cleanImg)) {
                allImgs.push(cleanImg);
              }
            });
          }
          setGalleryImages(allImgs);
          setLoadingDetail(false);
        }).catch(() => {
          setLoadingDetail(false);
        });
      } else {
        // 🎯 2차 자동 검색: contentId가 없는 스마트 카드도 공공 TourAPI 전산망에서 즉시 찾아 사진 및 상세정보 연동
        const rawTitle = (spot.title || '').replace(/^(\d+[\.\s\-\:]+|Day\s*\d+[\s\-\:]+|\[\d+일차\])/gi, '').trim();
        const noSpaceKeyword = rawTitle.replace(/\(.*?\)/g, '').replace(/\s+/g, '').trim();
        const cleanKeyword = spot.searchKeyword || rawTitle.replace(/\(.*?\)/g, '').trim();

        const searchKeywordAsync = async () => {
          // 1차: 원본 검색
          let sUrl1 = `${PUBLIC_API_CONFIG.SEARCH_KEYWORD_URL}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(cleanKeyword)}`;
          let res1 = await fetch(sUrl1).then(r => r.json()).catch(() => null);
          let items1 = res1?.response?.body?.items?.item || [];
          let arr1 = Array.isArray(items1) ? items1 : (items1 ? [items1] : []);
          if (arr1.length > 0) return arr1[0];

          // 2차: 공백 제거 압축 검색 (예: "구조라해수욕장", "거제파노라마케이블카")
          if (noSpaceKeyword && noSpaceKeyword !== cleanKeyword) {
            let sUrl2 = `${PUBLIC_API_CONFIG.SEARCH_KEYWORD_URL}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(noSpaceKeyword)}`;
            let res2 = await fetch(sUrl2).then(r => r.json()).catch(() => null);
            let items2 = res2?.response?.body?.items?.item || [];
            let arr2 = Array.isArray(items2) ? items2 : (items2 ? [items2] : []);
            if (arr2.length > 0) return arr2[0];
          }

          // 3차: 위치 기반 도시명 조합 검색
          const cityMatch = (spot.location || spot.addr1 || '').match(/([가-힣]+(?:시|군|구))/);
          if (cityMatch && cityMatch[1]) {
            let cityClean = cityMatch[1].replace(/(시|군|구)$/, '');
            let sUrl3 = `${PUBLIC_API_CONFIG.SEARCH_KEYWORD_URL}?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=KTravelApp&_type=json&arrange=B&keyword=${encodeURIComponent(cityClean + ' ' + noSpaceKeyword)}`;
            let res3 = await fetch(sUrl3).then(r => r.json()).catch(() => null);
            let items3 = res3?.response?.body?.items?.item || [];
            let arr3 = Array.isArray(items3) ? items3 : (items3 ? [items3] : []);
            if (arr3.length > 0) return arr3[0];
          }

          return null;
        };

        searchKeywordAsync().then((matched) => {
          if (matched && matched.contentid) {
            const realContentId = matched.contentid;
            const realCType = matched.contenttypeid || '12';
            return Promise.all([
              fetchSpotDetailCommon(realContentId, lang).catch(() => null),
              fetchSpotDetailImages(realContentId, lang).catch(() => []),
              fetchSpotDetailIntro(realContentId, realCType, lang).catch(() => null)
            ]).then(([commonRes, imagesRes, introRes]) => {
                if (commonRes) {
                  setDetailData(prev => ({
                    ...prev,
                    title: commonRes.title || matched.title || prev.title,
                    overview: commonRes.overview || prev.overview,
                    addr1: commonRes.addr1 || matched.addr1 || prev.addr1,
                    firstimage: commonRes.firstimage || matched.firstimage || prev.firstimage,
                    homepage: commonRes.homepage || prev.homepage,
                    tel: commonRes.tel || prev.tel
                  }));
                }
                setIntroData(introRes);
                const allImgs = [];
                const mainImg = commonRes?.firstimage || matched.firstimage || spot.image;
                if (mainImg && !mainImg.includes('default-spot')) {
                  allImgs.push(mainImg.replace(/^http:\/\//i, 'https://'));
                }
                if (Array.isArray(imagesRes) && imagesRes.length > 0) {
                  imagesRes.forEach(img => {
                    const cleanImg = img.replace(/^http:\/\//i, 'https://');
                    if (!allImgs.includes(cleanImg)) {
                      allImgs.push(cleanImg);
                    }
                  });
                }
                setGalleryImages(allImgs);
                setLoadingDetail(false);
              });
            } else {
              setLoadingDetail(false);
            }
          })
          .catch(() => {
            setLoadingDetail(false);
          });
      }
    }
  }, [spot, lang]);

  if (!spot) return null;

  const currentHeroImage = galleryImages.length > 0 && galleryImages[activeImgIndex]
    ? galleryImages[activeImgIndex]
    : (detailData?.firstimage || spot.image || '/default-spot.png');

  // Handle adding new user review
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev = {
      id: Date.now(),
      author: '여행자',
      ageGroup: '30대',
      gender: '무관',
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      content: newReviewText.trim()
    };
    const updated = [newRev, ...mockReviews];
    setMockReviews(updated);
    setNewReviewText('');
    try {
      const spotIdKey = spot.contentId || spot.id || 'default';
      localStorage.setItem(`ktravel_reviews_${spotIdKey}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to extract clean homepage URL
  const extractCleanUrl = (rawHomepage) => {
    if (!rawHomepage) return null;
    const match = rawHomepage.match(/href=["'](https?:\/\/[^"']+)["']/i) || rawHomepage.match(/(https?:\/\/[^\s<>"']+)/i);
    return match ? match[1] : (rawHomepage.startsWith('http') ? rawHomepage : null);
  };
  const cleanHomepageUrl = extractCleanUrl(detailData?.homepage || spot.homepage);

  // Fallback info helpers
  const hoursText = introData?.usetime || introData?.usetimeculture || introData?.usetimeleports || introData?.opentime || spot.details?.hours || '상세 이용시간 정보 제공 (연중무휴 권장)';
  const restDateText = introData?.restdate || introData?.restdateculture || introData?.restdateleports || '연중무휴 (공휴일 정상 운영)';
  const parkingText = introData?.parking || introData?.parkingculture || introData?.parkingfee || '주차 가능 (인근 공영/전용 주차장 구비)';
  const feeText = introData?.usefee || introData?.usefeeleports || introData?.ticket || '무료 관람 (일부 유료 시설 제외)';
  const petText = introData?.chkpet || introData?.chkpetculture || '동반 가능 (목줄 및 케이지 착용 권장)';
  const babyText = introData?.chkbabycarriage || introData?.chkbabycarriageculture || '유모차 및 휠체어 이동 가능';
  const contactText = introData?.infocenter || detailData?.tel || spot.tel || spot.details?.contact || '1330 (관광안내)';

  const modalNode = (
    <div 
      className="modal-overlay-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000005,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1.5rem 1rem 2.5rem 1rem',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP RIGHT STICKY FIXED CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'sticky',
            top: '1rem',
            float: 'right',
            marginRight: '1rem',
            marginTop: '1rem',
            marginBottom: '-46px',
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.75)',
            color: '#ffffff',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* 📸 HERO MULTI-PHOTO GALLERY SLIDER (BRIGHT & NATURAL LOOK) */}
        <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
          <TravelImageWithFallback 
            src={currentHeroImage}
            spotTitle={displayTitle || spot.title}
            lang={lang}
            showTitle={false}
          />

          {/* Soft Bottom-Only Gradient for Text Readability without Darkening the Photo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.25) 35%, rgba(0, 0, 0, 0) 65%)'
          }} />

          {/* Left / Right Navigation Arrows if multiple photos */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                }}
                aria-label="이전 사진"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1e293b',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                }}
                aria-label="다음 사진"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  color: '#1e293b',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronRight size={22} />
              </button>

              {/* Photo Index Indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                padding: '0.25rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(6px)'
              }}>
                📷 {activeImgIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          {/* Hero Bottom Title & Badges */}
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.4)'
              }}>
                {spot.assignedDay ? (
                  {
                    ko: `${spot.assignedDay}일차 명소`,
                    en: `Day ${spot.assignedDay} Spot`,
                    ja: `${spot.assignedDay}日目 スポット`,
                    zh: `第${spot.assignedDay}天 景点`,
                    zht: `第${spot.assignedDay}天 景點`,
                    de: `Tag ${spot.assignedDay} Spot`,
                    fr: `Jour ${spot.assignedDay} Spot`,
                    es: `Día ${spot.assignedDay} Lugar`,
                    ru: `День ${spot.assignedDay} Место`
                  }[lang] || `Day ${spot.assignedDay}`
                ) : displayRegion}
              </span>

              {spot.tags && spot.tags.slice(0, 3).map((tagItem, i) => {
                const cleanTag = tagItem.replace(/^#/, '');
                const translatedTag = {
                  '관광명소': { en: 'Attraction', ja: '観光スポット', zh: '观光名胜', zht: '觀光名勝', de: 'Attraktion', fr: 'Attraction', es: 'Atracción', ru: 'Достопримечательность' },
                  '핫플레이스': { en: 'Hotspot', ja: '人気スポット', zh: '热门打卡点', zht: '熱門打卡點', de: 'Hotspot', fr: 'Tendance', es: 'Popular', ru: 'Хит' },
                  'AI추천': { en: 'AI Pick', ja: 'AIおすすめ', zh: 'AI精选', zht: 'AI精選', de: 'AI-Tipp', fr: 'Choix IA', es: 'Selección IA', ru: 'Выбор ИИ' },
                  '감성핫플': { en: 'Trendy', ja: '感性スポット', zh: '网红氛围', zht: '網紅氛圍', de: 'Trendig', fr: 'Tendance', es: 'Trendy', ru: 'Трендовое' },
                  '자연명소': { en: 'Nature', ja: '自然名所', zh: '自然美景', zht: '自然美景', de: 'Natur', fr: 'Nature', es: 'Naturaleza', ru: 'Природа' },
                  '힐링여행': { en: 'Healing', ja: 'ヒーリング', zh: '疗愈之旅', zht: '療癒之旅', de: 'Erholung', fr: 'Relaxation', es: 'Relax', ru: 'Релакс' }
                }[cleanTag]?.[lang] || (lang !== 'ko' ? getTranslatedTitle(cleanTag, lang) : cleanTag);

                return (
                  <span key={i} style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    color: '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                    backdropFilter: 'blur(6px)'
                  }}>
                    #{translatedTag}
                  </span>
                );
              })}
            </div>

            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.85)',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* 🎞️ MULTI-IMAGE THUMBNAIL STRIP */}
        {galleryImages.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '0.55rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            scrollbarWidth: 'thin'
          }}>
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                style={{
                  width: '64px',
                  height: '48px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: 0,
                  border: activeImgIndex === idx ? '2.5px solid #7c3aed' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  opacity: activeImgIndex === idx ? 1 : 0.65,
                  transform: activeImgIndex === idx ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img 
                  src={imgUrl} 
                  alt={`Thumbnail ${idx + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            ))}
          </div>
        )}

        {/* MODAL MAIN CONTENT BODY */}
        <div style={{ padding: '1.5rem' }}>

          {/* Rating, Bookmark & Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{spot.rating || 4.9}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                {dt.certifiedBadge}
              </span>
            </div>

            <button
              onClick={() => {
                setLocalBookmarked(prev => !prev);
                if (onToggleBookmark) {
                  onToggleBookmark(spot);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.95rem',
                borderRadius: '10px',
                border: localBookmarked ? '1.5px solid #fecaca' : '1px solid #cbd5e1',
                backgroundColor: localBookmarked ? '#fef2f2' : '#ffffff',
                color: localBookmarked ? '#ef4444' : '#475569',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: localBookmarked ? '0 2px 8px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={16} fill={localBookmarked ? '#ef4444' : 'none'} color={localBookmarked ? '#ef4444' : '#64748b'} />
              <span>{localBookmarked ? dt.bookmarkSaved : dt.bookmarkSave}</span>
            </button>
          </div>

          {/* 🗺️ SOPHISTICATED 3-MAP NAVIGATION BAR (REFINED PASTEL PILLS) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            padding: '0.85rem',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            {/* Kakao Map Navigation */}
            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#fefce8',
                border: '1.5px solid #fef08a',
                color: '#854d0e',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Navigation size={15} color="#ca8a04" />
              <span>{dt.kakaoMap}</span>
            </a>

            {/* Naver Map Navigation */}
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                color: '#166534',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Navigation size={15} color="#16a34a" />
              <span>{dt.naverMap}</span>
            </a>

            {/* Google Map (GPS) Navigation */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayTitle + ' ' + (detailData?.addr1 || spot.location || ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.7rem 0.85rem',
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                color: '#1e40af',
                fontWeight: 800,
                fontSize: '0.84rem',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <MapPin size={15} color="#2563eb" />
              <span>{dt.googleMap}</span>
            </a>
          </div>

          {/* 📖 OVERVIEW DESCRIPTION */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#7c3aed" />
              <span>{dt.overviewTitle}</span>
            </h4>
            <p style={{
              color: '#334155',
              fontSize: '0.92rem',
              lineHeight: 1.75,
              margin: 0,
              wordBreak: 'keep-all'
            }}>
              {loadingDetail ? (
                <span style={{ color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={16} className="animate-spin" /> {dt.loadingOverview}
                </span>
              ) : (
                getTranslatedOverview(detailData?.overview || spot.description || t.defaultOverview, spot?.title, lang)
              )}
            </p>
          </div>

          {/* 📊 8 CORE PUBLIC DATA INFO CARDS (관광공사 정품 세부 안내) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="#10b981" />
              <span>{dt.publicDataTitle}</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem'
            }}>
              {/* 1. Address */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <MapPin size={14} />
                  <span>{dt.locationLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedAddress(detailData?.addr1 || spot.location, lang)}
                </div>
              </div>

              {/* 2. Operating Hours */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Clock size={14} />
                  <span>{dt.hoursLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(hoursText, lang)}
                </div>
              </div>

              {/* 3. Rest Date */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Ban size={14} />
                  <span>{dt.holidayLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(restDateText, lang)}
                </div>
              </div>

              {/* 4. Parking */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Car size={14} />
                  <span>{dt.parkingLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(parkingText, lang)}
                </div>
              </div>

              {/* 5. Admission Fee */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Ticket size={14} />
                  <span>{dt.feeLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(feeText, lang)}
                </div>
              </div>

              {/* 6. Pet Friendly */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ea580c', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Dog size={14} />
                  <span>{dt.petLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(petText, lang)}
                </div>
              </div>

              {/* 7. Stroller / Accessibility */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0891b2', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Baby size={14} />
                  <span>{dt.babyLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, wordBreak: 'keep-all' }}>
                  {getTranslatedDetailText(babyText, lang)}
                </div>
              </div>

              {/* 8. Contact & Phone */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <Phone size={14} />
                  <span>{dt.contactLabel}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                  <a href={`tel:${contactText.replace(/[^0-9\-]/g, '')}`} style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 700 }}>
                    📞 {getTranslatedDetailText(contactText, lang)}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 🌐 OFFICIAL WEBSITE BANNER (IF AVAILABLE) */}
          {cleanHomepageUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href={cleanHomepageUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#f5f3ff',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '14px',
                  color: '#6d28d9',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={18} color="#7c3aed" />
                  <span>{displayTitle} {dt.officialWebsite}</span>
                </div>
                <span>{dt.visitBtn}</span>
              </a>
            </div>
          )}

          {/* 📸 INSTAGRAM & GOOGLE LIVE EXPLORE BANNER (REFINED SOFT GLASS DESIGN) */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1.15rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #faf5ff 0%, #fdf4ff 50%, #f8fafc 100%)',
            border: '1.5px solid #f3e8ff',
            boxShadow: '0 2px 8px rgba(168, 85, 247, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={16} color="#9333ea" />
                <span>{dt.snsTrends}</span>
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                {dt.photoTag}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <a
                href={`https://www.instagram.com/explore/tags/${encodeURIComponent((displayTitle || spot.title).replace(/\s+/g, ''))}/`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem',
                  background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(217, 70, 239, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>{dt.instaFeed}</span>
              </a>

              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent((displayTitle || spot.title) + ' ' + (spot.location || ''))}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>{dt.googleGallery}</span>
              </a>
            </div>
          </div>

          {/* 🏨 PARTNER OFFERS (ELEGANT SOFT SLATE CARD - NO HARSH BLACK) */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1.15rem',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#6366f1" />
                <span>{dt.partnerHeader}</span>
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4338ca', backgroundColor: '#e0e7ff', padding: '0.2rem 0.55rem', borderRadius: '8px' }}>
                OFFICIAL PARTNER
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
              <a
                href={buildAgodaDeepLink(displayTitle || spot.title, '2026-08-20', '2026-08-22', detailData?.addr1 || spot.location || spot.region || '')}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Hotel size={16} />
                <span>{dt.agodaDeal}</span>
              </a>

              <a
                href={buildKlookDeepLink(spot.title, '2026-08-20', '2026-08-22')}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Ticket size={16} />
                <span>{dt.klookTours}</span>
              </a>
            </div>
          </div>

          {/* 💬 REAL TRAVELER REVIEWS & FEEDBACK */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {dt.reviewsHeader.replace('{count}', mockReviews.length)}
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {dt.satisfaction.replace('{rating}', spot.rating || 4.9)}
              </span>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder={dt.reviewPlaceholder}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.1rem',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {dt.reviewSubmit}
              </button>
            </form>

            {/* Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {mockReviews.slice(0, showAllReviews ? mockReviews.length : 3).map((rawRev) => {
                const rev = getTranslatedReview(rawRev, lang) || rawRev;
                const reviewText = typeof rev === 'string' 
                  ? rev 
                  : (typeof rev.content === 'string' ? rev.content : (rev.content?.text || ''));
                return (
                  <div key={rev.id || Math.random()} style={{
                    padding: '0.85rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>{rev.author}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({rev.ageGroup})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      {reviewText}
                    </p>
                  </div>
                );
              })}
            </div>

            {mockReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                style={{
                  width: '100%',
                  marginTop: '0.65rem',
                  padding: '0.5rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {showAllReviews ? dt.collapseReviews : dt.moreReviews.replace('{count}', mockReviews.length - 3)}
              </button>
            )}
          </div>

          {/* 🚪 BOTTOM EXPLICIT CLOSE BUTTON (Option C Style) */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: '0.7rem 1.5rem',
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1.5px solid #cbd5e1',
                borderRadius: '14px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <X size={18} strokeWidth={2.5} />
              <span>{getCloseButtonLabel(lang)}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
