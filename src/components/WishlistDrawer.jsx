import React, { useState } from 'react';
import { X, Heart, Trash2, Share2, Copy, Check, ExternalLink, MapPin, Sparkles, Compass } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import TravelImageWithFallback from './TravelImageWithFallback';
import { useModalHistory } from '../hooks/useModalHistory';

const WISHLIST_I18N = {
  ko: {
    title: '내 찜한 여행지 목록',
    count: '총 {count}곳의 명소 저장됨',
    emptyTitle: '아직 찜한 여행지가 없습니다',
    emptySub: '마음에 드는 관광지의 하트(❤️) 버튼을 눌러 나만의 여행 코스 보관함을 채워보세요!',
    shareHeader: '카톡/SNS로 찜 코스 공유하기',
    shareBtn: '1클릭 공유',
    copiedText: '링크 복사완료!',
    shareTitle: 'Vora AI - 내 찜한 여행 코스',
    shareText: '대한민국 맞춤 여행지 {count}곳 코스를 공유합니다!'
  },
  en: {
    title: 'My Saved Places',
    count: '{count} spots saved',
    emptyTitle: 'No saved spots yet',
    emptySub: 'Tap the heart (❤️) icon on attractions to build your personalized Korea travel wishlist!',
    shareHeader: 'Share saved itinerary',
    shareBtn: '1-Click Share',
    copiedText: 'Link Copied!',
    shareTitle: 'Vora AI - My Saved Travel Places',
    shareText: 'Check out my custom itinerary of {count} places in Korea!'
  },
  ja: {
    title: 'お気に入り観光スポット',
    count: '合計 {count}か所 保存済み',
    emptyTitle: 'お気に入りの場所がまだありません',
    emptySub: '気になる観光地のハート（❤️）ボタンを押して、あなただけの旅行リストを作成しましょう！',
    shareHeader: 'SNSでお気に入りコースを共有',
    shareBtn: '1タップ共有',
    copiedText: 'リンクをコピーしました！',
    shareTitle: 'Vora AI - お気に入り韓国旅行コース',
    shareText: '韓国おすすめスポット {count}か所のコースを共有します！'
  },
  zh: {
    title: '我的收藏旅游清单',
    count: '已保存 {count} 个精选景点',
    emptyTitle: '暂无收藏景点',
    emptySub: '点击心仪景点的爱心（❤️）图标，打造属于您的专属韩国旅行收藏夹！',
    shareHeader: '一键分享您的收藏行程',
    shareBtn: '一键分享',
    copiedText: '链接已复制！',
    shareTitle: 'Vora AI - 我的韩国心愿行程',
    shareText: '向您分享我的 {count} 个韩国精选旅游路线！'
  },
  zht: {
    title: '我的收藏旅遊清單',
    count: '已保存 {count} 個精選景點',
    emptyTitle: '暫無收藏景點',
    emptySub: '點擊心儀景點的愛心（❤️）圖示，打造屬於您的專屬韓國旅行收藏夾！',
    shareHeader: '一鍵分享您的收藏行程',
    shareBtn: '一鍵分享',
    copiedText: '連結已複製！',
    shareTitle: 'Vora AI - 我的韓國心願行程',
    shareText: '向您分享我的 {count} 個韓國精選旅遊路線！'
  },
  de: {
    title: 'Meine gemerkten Orte',
    count: '{count} Orte gespeichert',
    emptyTitle: 'Noch keine Orte gespeichert',
    emptySub: 'Klicken Sie auf das Herz (❤️), um Ihre persönliche Wunschliste zu erstellen!',
    shareHeader: 'Gespeicherte Route teilen',
    shareBtn: '1-Klick Teilen',
    copiedText: 'Link kopiert!',
    shareTitle: 'Vora AI - Meine Reiseroute',
    shareText: 'Schau dir meine maßgeschneiderte Route mit {count} Orten in Korea an!'
  },
  fr: {
    title: 'Mes lieux enregistrés',
    count: '{count} lieux enregistrés',
    emptyTitle: 'Aucun lieu enregistré pour le moment',
    emptySub: 'Cliquez sur le cœur (❤️) des attractions pour créer votre itinéraire personnalisé en Corée !',
    shareHeader: 'Partager votre itinéraire',
    shareBtn: 'Partager en 1 clic',
    copiedText: 'Lien copié !',
    shareTitle: 'Vora AI - Mes lieux favoris',
    shareText: 'Découvrez ma sélection de {count} lieux incontournables en Corée !'
  },
  es: {
    title: 'Mis lugares guardados',
    count: '{count} lugares guardados',
    emptyTitle: 'Aún no hay lugares guardados',
    emptySub: '¡Toca el icono de corazón (❤️) en los lugares para crear tu lista de deseos de Corea!',
    shareHeader: 'Comparte tu itinerario guardado',
    shareBtn: 'Compartir en 1 clic',
    copiedText: '¡Enlace copiado!',
    shareTitle: 'Vora AI - Mis lugares guardados',
    shareText: '¡Mira mi itinerario personalizado de {count} lugares en Corea!'
  },
  ru: {
    title: 'Мои сохраненные места',
    count: 'Сохранено: {count} мест',
    emptyTitle: 'Список пока пуст',
    emptySub: 'Нажимайте на сердечко (❤️) на карточках достопримечательностей, чтобы собрать свой маршрут по Корее!',
    shareHeader: 'Поделиться сохраненным маршрутом',
    shareBtn: 'Поделиться в 1 клик',
    copiedText: 'Ссылка скопирована!',
    shareTitle: 'Vora AI - Мой маршрут по Корее',
    shareText: 'Посмотрите мой персональный маршрут из {count} мест в Корее!'
  }
};

const REGION_MAP_I18N = {
  '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾', de: 'Seoul', fr: 'Séoul', es: 'Seúl', ru: 'Сеул' },
  '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山', de: 'Busan', fr: 'Busan', es: 'Busan', ru: 'Пусан' },
  '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州', de: 'Jeju', fr: 'Jeju', es: 'Jeju', ru: 'Чеджу' },
  '제주도': { en: 'Jeju', ja: '済州島', zh: '济州岛', zht: '濟州島', de: 'Jeju', fr: 'Jeju', es: 'Jeju', ru: 'Чеджу' },
  '인천': { en: 'Incheon', ja: '仁川', zh: '仁川', zht: '仁川', de: 'Incheon', fr: 'Incheon', es: 'Incheon', ru: 'Инчхон' },
  '경상남도': { en: 'Gyeongnam', ja: '慶尚南道', zh: '庆尚南道', zht: '慶尚南道', de: 'Gyeongnam', fr: 'Gyeongnam', es: 'Gyeongnam', ru: 'Кёнсан-Намдо' },
  '경남': { en: 'Gyeongnam', ja: '慶尚南道', zh: '庆尚南道', zht: '慶尚南道', de: 'Gyeongnam', fr: 'Gyeongnam', es: 'Gyeongnam', ru: 'Кёнсан-Намдо' },
  '경상북도': { en: 'Gyeongbuk', ja: '慶尚北道', zh: '庆尚北道', zht: '慶尚北道', de: 'Gyeongbuk', fr: 'Gyeongbuk', es: 'Gyeongbuk', ru: 'Кёнсан-Пукто' },
  '경북': { en: 'Gyeongbuk', ja: '慶尚北道', zh: '庆尚北道', zht: '慶尚北道', de: 'Gyeongbuk', fr: 'Gyeongbuk', es: 'Gyeongbuk', ru: 'Кёнсан-Пукто' },
  '경기도': { en: 'Gyeonggi', ja: '京畿道', zh: '京畿道', zht: '京畿道', de: 'Gyeonggi', fr: 'Gyeonggi', es: 'Gyeonggi', ru: 'Кёнгидо' },
  '경기': { en: 'Gyeonggi', ja: '京畿道', zh: '京畿道', zht: '京畿道', de: 'Gyeonggi', fr: 'Gyeonggi', es: 'Gyeonggi', ru: 'Кёнгидо' },
  '강원도': { en: 'Gangwon', ja: '江原道', zh: '江原道', zht: '江原道', de: 'Gangwon', fr: 'Gangwon', es: 'Gangwon', ru: 'Канвондо' },
  '강원': { en: 'Gangwon', ja: '江原道', zh: '江原道', zht: '江原道', de: 'Gangwon', fr: 'Gangwon', es: 'Gangwon', ru: 'Канвондо' },
  '전라남도': { en: 'Jeonnam', ja: '全羅南道', zh: '全罗南道', zht: '全羅南道', de: 'Jeonnam', fr: 'Jeonnam', es: 'Jeonnam', ru: 'Чолла-Намдо' },
  '전남': { en: 'Jeonnam', ja: '全羅南道', zh: '全罗南道', zht: '全羅南道', de: 'Jeonnam', fr: 'Jeonnam', es: 'Jeonnam', ru: 'Чолла-Намдо' },
  '전라북도': { en: 'Jeonbuk', ja: '全羅北道', zh: '全罗北道', zht: '全羅北道', de: 'Jeonbuk', fr: 'Jeonbuk', es: 'Jeonbuk', ru: 'Чолла-Пукто' },
  '전북': { en: 'Jeonbuk', ja: '全羅北道', zh: '全罗北道', zht: '全羅北道', de: 'Jeonbuk', fr: 'Jeonbuk', es: 'Jeonbuk', ru: 'Чолла-Пукто' }
};

export default function WishlistDrawer({ isOpen, onClose, wishlistSpots = [], onRemoveWishlist, onSelectSpot, lang = 'ko' }) {
  useModalHistory(isOpen, onClose, 'wishlist-drawer');

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const wt = WISHLIST_I18N[lang] || WISHLIST_I18N.ko;

  const getRegionName = (reg) => {
    if (!reg) return lang === 'en' ? 'Korea' : '추천';
    if (REGION_MAP_I18N[reg] && REGION_MAP_I18N[reg][lang]) {
      return REGION_MAP_I18N[reg][lang];
    }
    return reg;
  };

  const handleShareLink = () => {
    const spotIds = (wishlistSpots || []).map(s => s.id || s.contentId || s.title).join(',');
    const shareUrl = `${window.location.origin}/?wishlist=${encodeURIComponent(spotIds)}`;

    if (navigator.share) {
      navigator.share({
        title: wt.shareTitle,
        text: wt.shareText.replace('{count}', wishlistSpots.length),
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderLeft: '1.5px solid #e2e8f0',
          width: '100%',
          maxWidth: 'min(460px, 100vw)',
          height: '100dvh',
          overflowY: 'auto',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.12)',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Soft Lavender Gradient */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.1rem',
          borderBottom: '1.5px solid #f1f5f9',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.5rem',
              borderRadius: '12px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.15)'
            }}>
              <Heart size={22} fill="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                {wt.title}
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                {wt.count.replace('{count}', wishlistSpots.length)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.closeBtn || '닫기'}
            style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Share Action Header */}
        {wishlistSpots.length > 0 && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            border: '1.5px solid #e2e8f0',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
              {wt.shareHeader}
            </span>
            <button
              onClick={handleShareLink}
              style={{
                background: copied ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? wt.copiedText : wt.shareBtn}</span>
            </button>
          </div>
        )}

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {wishlistSpots.length > 0 ? (
            wishlistSpots.map((spot, idx) => (
              <div 
                key={spot.id || spot.contentId || idx}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
                onClick={() => onSelectSpot && onSelectSpot(spot)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#d8b4fe';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                  <TravelImageWithFallback 
                    src={spot.image} 
                    spotTitle={spot.title}
                    lang={lang}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                      {getRegionName(spot.region)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>
                      ★ {spot.rating || 4.9}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    margin: '0.1rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {spot.title}
                  </h4>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {spot.location || spot.addr1 || (lang === 'en' ? 'Korea Travel Attraction' : '대한민국 관광 명소')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveWishlist) {
                      onRemoveWishlist(spot.id || spot.contentId || spot.title);
                    }
                  }}
                  title={t.deleteBtn || '삭제'}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.45rem',
                    borderRadius: '10px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = '#fecaca';
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <div style={{
                backgroundColor: '#f1f5f9',
                padding: '1.25rem',
                borderRadius: '50%',
                color: '#94a3b8'
              }}>
                <Compass size={38} strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {wt.emptyTitle}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '280px', lineHeight: 1.6, margin: 0 }}>
                {wt.emptySub}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
