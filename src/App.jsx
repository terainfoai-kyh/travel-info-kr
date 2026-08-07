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
import { getRecommendedFoodAndOutfit } from './services/recommendationEngine';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Auto-detect browser locale
  const [lang, setLang] = useState(detectBrowserLanguage());

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with active search filter badge and theme toggle */}
      <Header 
        currentLang={lang} 
        setLang={setLang} 
        filters={filters} 
        themeMode={themeMode}
        setThemeMode={setThemeMode}
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

            {/* 2. Weather Info */}
            <WeatherWidget weatherData={weatherData} lang={lang} />

            {/* 3. Food Recommendations */}
            <FoodRecommendation foods={recommendations.foods} lang={lang} />

            {/* 4. Outfit Recommendations */}
            <OutfitRecommendation outfits={recommendations.outfits} filters={filters} lang={lang} />

            {/* 5. Google Maps View */}
            <GoogleMapView
              selectedSpot={selectedSpot}
              allSpots={paginatedSpots}
              lang={lang}
            />
          </>
        )}
      </main>

      {/* Detail Modal */}
      <TravelDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        isBookmarked={selectedSpot ? bookmarks.includes(selectedSpot.id) : false}
        onToggleBookmark={handleToggleBookmark}
        lang={lang}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        background: 'var(--bg-primary)'
      }}>
        © 2026 대한민국 여행 정보 (K-Travel Info). 한국관광공사 TourAPI & 기상청 공공데이터 연동.
      </footer>
    </div>
  );
}
