import React, { useState } from 'react';
import { 
  Building2, 
  BookOpen, 
  Star, 
  ExternalLink, 
  MapPin, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { CURATED_HOTELS } from '../data/curatedHotelGuides';
import { CURATED_ARTICLES } from '../data/curatedTravelArticles';

export default function CuratedTravelGuides({ lang = 'ko' }) {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'articles'
  const [selectedCity, setSelectedCity] = useState('all'); // 'all' | 'Seoul' | 'Busan' | 'Jeju'

  const labels = {
    ko: {
      sectionBadge: '✨ VORA 공식 파트너 큐레이션',
      sectionTitle: '대한민국 추천 숙소 & 여행 매거진',
      sectionDesc: '한국관광공사 공식 인증 명소와 연계된 인기 호텔 및 로컬 여행 가이드를 만나보세요.',
      tabHotels: '🏨 인기 추천 호텔 & 숙소',
      tabArticles: '🌸 한국 여행 가이드 매거진',
      filterAll: '전체 (All)',
      filterSeoul: '서울 (Seoul)',
      filterBusan: '부산 (Busan)',
      filterJeju: '제주 (Jeju)',
      bookAgoda: '아고다에서 최저가 확인 및 예약',
      partnerNotice: '공식 제휴 파트너(Agoda)를 통해 안전하고 합리적인 요금으로 예약하실 수 있습니다.',
      readArticle: '가이드 읽기',
      verifiedData: '한국관광공사 TourAPI 4.0 정품 데이터 연동'
    },
    en: {
      sectionBadge: '✨ VORA Curated Selection',
      sectionTitle: 'Recommended Hotels & Travel Guides',
      sectionDesc: 'Explore top-rated accommodations and authentic local travel stories across South Korea.',
      tabHotels: '🏨 Featured Hotels & Stays',
      tabArticles: '🌸 Korea Travel Magazine',
      filterAll: 'All Regions',
      filterSeoul: 'Seoul',
      filterBusan: 'Busan',
      filterJeju: 'Jeju Island',
      bookAgoda: 'Check Best Deals & Book on Agoda',
      partnerNotice: 'Official partner bookings powered by Agoda with lowest price guarantee.',
      readArticle: 'Read Full Guide',
      verifiedData: 'Verified by Korea Tourism Organization TourAPI 4.0'
    },
    ja: {
      sectionBadge: '✨ VORA 厳選トラベルセレクション',
      sectionTitle: 'おすすめ宿泊施設＆韓国旅マガジン',
      sectionDesc: '韓国観光公社認定スポットと直結した人気ホテルとトレンドガイドをお届けします。',
      tabHotels: '🏨 人気おすすめホテル＆宿泊',
      tabArticles: '🌸 韓国旅行ガイドマガジン',
      filterAll: 'すべて (All)',
      filterSeoul: 'ソウル (Seoul)',
      filterBusan: '釜山 (Busan)',
      filterJeju: '済州 (Jeju)',
      bookAgoda: 'Agodaで最安値をチェック・予約',
      partnerNotice: '公式パートナー(Agoda)を通じて安心・お得な価格でご予約いただけます。',
      readArticle: 'ガイドを読む',
      verifiedData: '韓国観光公社 TourAPI 4.0 公式連携'
    },
    zh: {
      sectionBadge: '✨ VORA 甄选旅行精选',
      sectionTitle: '韩国精选酒店住宿与深度漫游指南',
      sectionDesc: '为您推荐紧邻韩国旅游发展局权威景点的热门酒店与地道潮流旅行攻略。',
      tabHotels: '🏨 精选热门酒店与度假住宿',
      tabArticles: '🌸 韩国旅行潮流特辑',
      filterAll: '全部区域 (All)',
      filterSeoul: '首尔 (Seoul)',
      filterBusan: '釜山 (Busan)',
      filterJeju: '济州岛 (Jeju)',
      bookAgoda: '在 Agoda 查看最新特惠并预订',
      partnerNotice: '通过官方合作伙伴 Agoda 享受特惠低价与安全快捷预订服务。',
      readArticle: '阅读攻略',
      verifiedData: '韩国旅游发展局 TourAPI 4.0 官方认证'
    }
  };

  const t = labels[lang] || labels.en || labels.ko;

  const filteredHotels = selectedCity === 'all' 
    ? CURATED_HOTELS 
    : CURATED_HOTELS.filter(h => h.city === selectedCity);

  return (
    <section 
      className="vora-curated-section"
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '2rem auto 1.5rem',
        padding: '0 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        padding: '1.75rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.4rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1))',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.78rem',
            fontWeight: 800
          }}>
            <Sparkles size={13} />
            <span>{t.sectionBadge}</span>
          </div>

          <h3 style={{
            margin: '0.2rem 0 0',
            fontSize: '1.4rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            {t.sectionTitle}
          </h3>

          <p style={{
            margin: 0,
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            maxWidth: '620px'
          }}>
            {t.sectionDesc}
          </p>
        </div>

        {/* Top Tab Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('hotels')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '14px',
              border: activeTab === 'hotels' ? '1px solid #3b82f6' : '1px solid var(--border-color)',
              backgroundColor: activeTab === 'hotels' ? '#3b82f6' : 'var(--bg-primary)',
              color: activeTab === 'hotels' ? '#ffffff' : 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'hotels' ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
            }}
          >
            <Building2 size={16} />
            <span>{t.tabHotels}</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '14px',
              border: activeTab === 'articles' ? '1px solid #7c3aed' : '1px solid var(--border-color)',
              backgroundColor: activeTab === 'articles' ? '#7c3aed' : 'var(--bg-primary)',
              color: activeTab === 'articles' ? '#ffffff' : 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'articles' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <BookOpen size={16} />
            <span>{t.tabArticles}</span>
          </button>
        </div>

        {/* TAB 1: HOTELS */}
        {activeTab === 'hotels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* City Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: t.filterAll },
                { key: 'Seoul', label: t.filterSeoul },
                { key: 'Busan', label: t.filterBusan },
                { key: 'Jeju', label: t.filterJeju }
              ].map(chip => (
                <button
                  key={chip.key}
                  onClick={() => setSelectedCity(chip.key)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: selectedCity === chip.key ? 'var(--text-main)' : 'var(--bg-card)',
                    color: selectedCity === chip.key ? 'var(--bg-card)' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Hotel Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.1rem'
            }}>
              {filteredHotels.map(hotel => (
                <div 
                  key={hotel.id}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '18px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Photo & Badge */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                    <img 
                      src={hotel.image} 
                      alt={hotel.names[lang] || hotel.names.en} 
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      {hotel.badge[lang] || hotel.badge.en}
                    </div>

                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '0.6rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontSize: '0.72rem', fontWeight: 800 }}>
                        <MapPin size={13} />
                        <span>{hotel.regionTag[lang] || hotel.regionTag.en}</span>
                      </div>
                      <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {hotel.names[lang] || hotel.names.en}
                      </h4>
                    </div>

                    <p style={{
                      margin: 0,
                      fontSize: '0.80rem',
                      lineHeight: 1.55,
                      color: 'var(--text-muted)',
                      flex: 1
                    }}>
                      {hotel.descriptions[lang] || hotel.descriptions.en}
                    </p>

                    {/* Amenities Tag Cloud */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '0.2rem 0' }}>
                      {hotel.amenities.map(am => (
                        <span 
                          key={am}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Agoda Affiliate CTA Button */}
                    <a
                      href={hotel.agodaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.65rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        marginTop: '0.4rem',
                        boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <span>{t.bookAgoda}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Notice Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              paddingTop: '0.4rem'
            }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>{t.partnerNotice}</span>
            </div>
          </div>
        )}

        {/* TAB 2: EDITORIAL ARTICLES */}
        {activeTab === 'articles' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.1rem'
          }}>
            {CURATED_ARTICLES.map(art => (
              <div
                key={art.id}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Photo */}
                <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden' }}>
                  <img 
                    src={art.image} 
                    alt={art.titles[lang] || art.titles.en}
                    loading="lazy" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {art.category[lang] || art.category.en}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.70rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={11} />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.6rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.45 }}>
                    {art.titles[lang] || art.titles.en}
                  </h4>

                  <p style={{ margin: 0, fontSize: '0.80rem', lineHeight: 1.6, color: 'var(--text-muted)', flex: 1 }}>
                    {art.summary[lang] || art.summary.en}
                  </p>

                  {/* Highlights Bullet List */}
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    {art.highlights.map((hl, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>{hl[lang] || hl.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
