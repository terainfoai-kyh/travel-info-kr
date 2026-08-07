import React, { useState, useEffect } from 'react';
// Trigger Cloudflare Pages automated build with updated dist output
import Header from './components/Header';
import SearchFilterForm from './components/SearchFilterForm';
import WeatherWidget from './components/WeatherWidget';
import TourSpotGrid from './components/TourSpotGrid';
import FoodRecommendation from './components/FoodRecommendation';
import OutfitRecommendation from './components/OutfitRecommendation';
import GoogleMapView from './components/GoogleMapView';
import TravelDetailModal from './components/TravelDetailModal';
import AdBanner from './components/AdBanner';
import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { fetchRealtimeWeather } from './services/weatherApi';
import { fetchTourSpots } from './services/tourApi';
import ItineraryModal from './components/ItineraryModal';
import WishlistDrawer from './components/WishlistDrawer';
import TravelEssentialsSection from './components/TravelEssentialsSection';

export default function App() {
  // Auto-detect browser locale
  const [lang, setLang] = useState(detectBrowserLanguage());
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Modals & Drawers state
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Dark / Light Theme Mode
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('ktravel_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('ktravel_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const langMap = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };
    document.documentElement.lang = langMap[lang] || 'ko-KR';
  }, [lang]);

  // Handle URL Shared Wishlist Parameters (?wishlist=id1,id2)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sharedWishlistStr = params.get('wishlist');
      if (sharedWishlistStr) {
        const ids = sharedWishlistStr.split(',').map(id => id.trim()).filter(Boolean);
        if (ids.length > 0) {
          setBookmarks(prev => {
            const merged = Array.from(new Set([...prev, ...ids]));
            localStorage.setItem('ktravel_bookmarks', JSON.stringify(merged));
            return merged;
          });
          setIsWishlistOpen(true); // Auto-open wishlist drawer when visiting via shared link!
        }
      }
    } catch (e) {
      console.error('Error parsing shared wishlist URL params:', e);
    }
  }, []);
  
  // Search Filters
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 3);

  const todayStr = today.toISOString().split('T')[0];
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    startDate: todayStr,
    endDate: nextWeekStr,
    region: '전국',
    theme: '전체',
    age: '전체',
    gender: '무관',
    keyword: '',
    arrange: 'O', // O:제목순, Q:수정일순, R:생성일순
    apiServiceType: 'all' // all, area, location, festival, stay
  });

  // State Data
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [allTourSpots, setAllTourSpots] = useState([]);
  const [recommendations, setRecommendations] = useState({ foods: [], outfits: [] });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('ktravel_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleBookmark = (spotId) => {
    setBookmarks(prev => {
      let updated;
      if (prev.includes(spotId)) {
        updated = prev.filter(id => id !== spotId);
      } else {
        updated = [...prev, spotId];
      }
      try {
        localStorage.setItem('ktravel_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };
  const ITEMS_PER_PAGE = 6;

  // Initial Fetch on load & search submit handler
  const handleSearch = async (overrideLang) => {
    const activeLang = overrideLang || lang;
    setIsLoading(true);
    try {
      // 1. Fetch Weather Data (Short-term & Mid-term API)
      const wData = await fetchRealtimeWeather(filters.region, filters.startDate, filters.endDate);
      setWeatherData(wData);

      // 2. Fetch Tour Spots Data (TourAPI 4.0 - Multilingual Endpoint)
      const spots = await fetchTourSpots({
        region: filters.region,
        theme: filters.theme,
        age: filters.age,
        gender: filters.gender,
        keyword: filters.keyword,
        arrange: filters.arrange,
        apiServiceType: filters.apiServiceType,
        startDate: filters.startDate,
        lang: activeLang
      });
      setAllTourSpots(spots);
      setPage(1); // Reset to page 1

      // 3. Recommendation Engine (Food & Outfit)
      const recs = getRecommendedFoodAndOutfit({
        weather: wData,
        region: filters.region,
        theme: filters.theme,
        age: filters.age,
        gender: filters.gender,
        keyword: filters.keyword
      });
      setRecommendations(recs);
    } catch (err) {
      console.error('Error performing search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(lang);
  }, [lang]);

  // Compute Paginated Spots (6 per page)
  const totalPages = Math.ceil(allTourSpots.length / ITEMS_PER_PAGE);
  const paginatedSpots = allTourSpots.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Compute Wishlist Full Objects
  const wishlistFullSpots = allTourSpots.filter(s => bookmarks.includes(s.id));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with active search filter badge and theme toggle */}
      <Header 
        currentLang={lang} 
        setLang={setLang} 
        filters={filters} 
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        wishlistCount={bookmarks.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenItinerary={() => setIsItineraryOpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem', flex: 1 }}>
        {/* Search Conditions Input */}
        <SearchFilterForm
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          lang={lang}
        />

        {/* Top Partner & Ad Banner */}
        <AdBanner type="leaderboard" lang={lang} />

        {/* Loading Indicator */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-primary)' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ fontWeight: 600 }}>실시간 기후 및 공공데이터를 조회 중입니다...</p>
          </div>
        ) : (
          <>
            {/* 1. Tour Spots Grid (6 items + Pagination) */}
            <TourSpotGrid
              spots={paginatedSpots}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              lang={lang}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
            />

            {/* 2. Travel Essentials Hub Section */}
            <TravelEssentialsSection lang={lang} />

            {/* 3. Weather Info */}
            <WeatherWidget weatherData={weatherData} lang={lang} />

            {/* 4. Food Recommendations */}
            <FoodRecommendation foods={recommendations.foods} lang={lang} />

            {/* 5. Outfit Recommendations */}
            <OutfitRecommendation outfits={recommendations.outfits} filters={filters} lang={lang} />

            {/* 6. Google Maps View */}
            <GoogleMapView
              selectedSpot={selectedSpot}
              allSpots={paginatedSpots}
              lang={lang}
            />
          </>
        )}
      </main>

      {/* AI Itinerary Builder Modal */}
      <ItineraryModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        filters={filters}
        spots={allTourSpots}
        lang={lang}
        onSelectSpot={(spot) => {
          setIsItineraryOpen(false);
          setSelectedSpot(spot);
        }}
      />

      {/* Wishlist Side Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistSpots={wishlistFullSpots}
        onRemoveWishlist={handleToggleBookmark}
        onSelectSpot={(spot) => {
          setIsWishlistOpen(false);
          setSelectedSpot(spot);
        }}
        lang={lang}
      />

      {/* Detail Modal */}
      <TravelDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        isBookmarked={selectedSpot ? bookmarks.includes(selectedSpot.id) : false}
        onToggleBookmark={handleToggleBookmark}
        lang={lang}
      />

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              개인정보처리방침 (Privacy Policy)
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              <p><strong>1. 수집하는 개인정보 항목 및 수집 방법</strong><br />본 서비스는 별도의 회원가입 없이 이용 가능하며, 서비스 제공 및 품질 개선을 위해 웹 브라우저 쿠키(Cookie) 및 접근 기기 정보를 자동으로 수집할 수 있습니다.</p>
              <p style={{ marginTop: '0.75rem' }}><strong>2. 구글 애드센스 (Google AdSense) 광고 및 쿠키 안내</strong><br />본 웹사이트는 구글(Google)을 비롯한 제3자 광고 사업자의 맞춤형 맞춤 광고(AdSense)를 게재할 수 있습니다. Google은 쿠키를 사용하여 사용자의 이전 방문 기록을 바탕으로 관련성 높은 광고를 표시합니다.</p>
              <p style={{ marginTop: '0.75rem' }}><strong>3. 제휴 마케팅 (Affiliate Links) 안내</strong><br />본 서비스는 아고다(Agoda), 클룩(Klook), KKday 등 파트너사의 제휴 링크를 포함하고 있으며, 방문자가 해당 링크를 통해 결제 시 당사는 소정의 수수료 보상을 받을 수 있습니다.</p>
              <p style={{ marginTop: '0.75rem' }}><strong>4. 개인정보의 보유 및 이용 기간</strong><br />원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          © 2026 대한민국 여행 정보 (K-Travel Explorer). koreatravel.cc & koreatravelsguide.com
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem' }}>
          <span>한국관광공사 TourAPI 4.0 및 기상청 공공데이터 연동</span>
          <span>•</span>
          <button
            onClick={() => setShowPrivacyModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: 0
            }}
          >
            개인정보처리방침 (Privacy Policy)
          </button>
        </div>
      </footer>
    </div>
  );
}
