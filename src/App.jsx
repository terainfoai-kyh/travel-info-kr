import React, { useState, useEffect } from 'react';
// Trigger Cloudflare Pages automated build with updated dist output
import Header from './components/Header';
import SearchFilterForm from './components/SearchFilterForm';
import WeatherWidget from './components/WeatherWidget';
import TourSpotGrid from './components/TourSpotGrid';
import AILifestyleSection from './components/AILifestyleSection';
import GoogleMapView from './components/GoogleMapView';
import TravelDetailModal from './components/TravelDetailModal';
import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { fetchRealtimeWeather } from './services/weatherApi';
import { fetchTourSpots, fetchPinpointLandmarkSpots } from './services/tourApi';
import { getRecommendedFoodAndOutfit } from './services/recommendationEngine';
import { Loader2, X } from 'lucide-react';
import ItineraryModal from './components/ItineraryModal';
import WishlistDrawer from './components/WishlistDrawer';
import TravelEssentialsSection from './components/TravelEssentialsSection';
import AIFloatingButton from './components/AIFloatingButton';
import PartnerInquiryModal from './components/PartnerInquiryModal';
import SplashScreen from './components/SplashScreen';
import CustomCourseFloatingBar from './components/CustomCourseFloatingBar';
import GuidePRModal from './components/GuidePRModal';
import AIChatPromptHeader from './components/AIChatPromptHeader';
import PWAInstallBanner from './components/PWAInstallBanner';
import FloatingAIDock from './components/FloatingAIDock';

export default function App() {
  // Auto-detect browser locale
  const [lang, setLang] = useState(detectBrowserLanguage());
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [showSplash, setShowSplash] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isGuidePROpen, setIsGuidePROpen] = useState(false);

  // Modals & Drawers state
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showOverseasModal, setShowOverseasModal] = useState(false);
  const [overseasQuery, setOverseasQuery] = useState('');

  // Selected Spots for Custom Picked Itinerary
  const [selectedCourseSpotIds, setSelectedCourseSpotIds] = useState([]);

  const handleToggleCourseSpot = (spotId) => {
    setSelectedCourseSpotIds(prev => {
      if (prev.includes(spotId)) {
        return prev.filter(id => id !== spotId);
      }
      return [...prev, spotId];
    });
  };

  const handleClearCourseSelection = () => {
    setSelectedCourseSpotIds([]);
  };

  // Dark / Light Theme Mode (Auto-detect system preference, defaulting to light mode)
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('ktravel_theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      // Fallback
    }
    return 'light';
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

  const [filters, setFilters] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        startDate: todayStr,
        endDate: nextWeekStr,
        region: params.get('region') || '전국',
        theme: params.get('theme') || '전체',
        age: params.get('age') || '전체',
        gender: params.get('gender') || '무관',
        keyword: params.get('keyword') || '',
        arrange: params.get('arrange') || 'A',
        apiServiceType: params.get('apiServiceType') || 'all'
      };
    } catch (e) {
      return {
        startDate: todayStr,
        endDate: nextWeekStr,
        region: '전국',
        theme: '전체',
        age: '전체',
        gender: '무관',
        keyword: '',
        arrange: 'A',
        apiServiceType: 'all'
      };
    }
  });

  // State Data
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [allTourSpots, setAllTourSpots] = useState([]);
  const [recommendations, setRecommendations] = useState({ foods: [], outfits: [] });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [fullAiItinerary, setFullAiItinerary] = useState(null);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Dynamic K-Aurora Mesh Background System */}
      <div className="k-aurora-bg">
        <div className="k-aurora-glow-1" />
        <div className="k-aurora-glow-2" />
        <div className="k-aurora-glow-3" />
        <div className="k-aurora-pattern" />
      </div>

      {/* 1.8s Cinematic Intro Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} lang={lang} />}

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
        onOpenGuidePR={() => setIsGuidePROpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 0.5rem 1.5rem', flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Conversational & Voice AI Prompt Header */}
        <AIChatPromptHeader 
          lang={lang} 
          filters={filters}
          onGenerateItinerary={async (parsedInput, fullAiResult = null) => {
            const parsed = parsedInput || (fullAiResult ? { region: fullAiResult.dailySchedules?.[0]?.city || '전국', days: fullAiResult.days || 3, keyword: fullAiResult.dailySchedules?.[0]?.city || '' } : { region: '전국', days: 3, keyword: '' });
            if (fullAiResult) {
              setFullAiItinerary(fullAiResult);
            }
            const targetRegion = parsed.region || '전국';
            const targetKeyword = parsed.keyword || '';
            const newFilters = {
              ...filters,
              region: targetRegion,
              keyword: targetKeyword,
              days: parsed.days || 3,
              rainyMode: parsed.rainyMode || false,
              nightKeyword: parsed.nightKeyword || '',
              day2Keyword: parsed.day2Keyword || '',
              dailyRegions: parsed.dailyRegions || [],
              userLandmarks: parsed.userLandmarks || []
            };
            setFilters(newFilters);
            setIsLoading(true);
            let fetchedSpots = [];
            try {
              fetchedSpots = await fetchTourSpots({
                ...newFilters,
                lang
              });

              // Fallback if targetKeyword returned 0 spots (e.g. demographic words like '50대')
              if ((!fetchedSpots || fetchedSpots.length === 0) && targetKeyword) {
                fetchedSpots = await fetchTourSpots({
                  ...newFilters,
                  keyword: '',
                  lang
                });
              }

              // Pinpoint TourAPI Keyword Search for User Mentioned Landmarks (e.g. "화성행궁", "방화수류정", "명동")
              if (parsed.userLandmarks && parsed.userLandmarks.length > 0) {
                const pinpointSpots = await fetchPinpointLandmarkSpots(parsed.userLandmarks, lang);
                if (pinpointSpots.length > 0) {
                  const existingTitles = new Set(pinpointSpots.map(s => (s.title || '').toLowerCase().replace(/\s+/g, '')));
                  const remainingSpots = fetchedSpots.filter(s => !existingTitles.has((s.title || '').toLowerCase().replace(/\s+/g, '')));
                  fetchedSpots = [...pinpointSpots, ...remainingSpots];
                }
              }

              setAllTourSpots(fetchedSpots);
              const effectiveRegion = (targetRegion === '전국' && fetchedSpots[0] && fetchedSpots[0].regionName && fetchedSpots[0].regionName !== '전국')
                ? fetchedSpots[0].regionName
                : targetRegion;
              const wData = await fetchRealtimeWeather(effectiveRegion, newFilters.startDate, newFilters.endDate);
              setWeatherData(wData);
              const recs = getRecommendedFoodAndOutfit({
                weather: wData,
                region: effectiveRegion,
                keyword: targetKeyword,
                theme: newFilters.theme,
                age: newFilters.age,
                gender: newFilters.gender
              });
              setRecommendations(recs);
            } catch (err) {
              console.error('Error fetching itinerary spots:', err);
            } finally {
              setIsLoading(false);
              if ((fetchedSpots && fetchedSpots.length > 0) || fullAiResult) {
                setIsItineraryOpen(true);
              } else {
                setIsItineraryOpen(false);
              }
            }
          }} 
        />

        {/* Loading Indicator */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-primary)' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ fontWeight: 600 }}>{t.loadingData || '실시간 기후 및 공공데이터를 조회 중입니다...'}</p>
          </div>
        ) : (
          <>
            {/* 1. Tour Spots Grid */}
            <div id="tour-spots">
              <TourSpotGrid
                spots={paginatedSpots}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                lang={lang}
                themeMode={themeMode}
                onSelectSpot={(spot) => setSelectedSpot(spot)}
                onOpenItinerary={() => setIsItineraryOpen(true)}
                filters={filters}
                selectedCourseSpotIds={selectedCourseSpotIds}
                onToggleCourseSpot={handleToggleCourseSpot}
                onResetFilters={async (newF) => {
                  const updated = {
                    ...filters,
                    nightKeyword: '',
                    userLandmarks: [],
                    ...newF
                  };
                  setFilters(updated);
                  setIsLoading(true);
                  try {
                    const spots = await fetchTourSpots({ ...updated, lang });
                    setAllTourSpots(spots);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            </div>

            {/* 2. Travel Essentials Hub Section */}
            <div id="travel-essentials">
              <TravelEssentialsSection lang={lang} filters={filters} />
            </div>

            {/* 3. Weather Info */}
            <div id="weather-info">
              <WeatherWidget weatherData={weatherData} lang={lang} />
            </div>

            {/* 4. AI Lifestyle Recommendations */}
            <div id="ai-lifestyle">
              <AILifestyleSection
                foods={recommendations.foods}
                outfits={recommendations.outfits}
                filters={filters}
                lang={lang}
                themeMode={themeMode}
              />
            </div>

            {/* 5. Google Maps View */}
            <div id="google-map">
              <GoogleMapView
                selectedSpot={selectedSpot}
                allSpots={paginatedSpots}
                lang={lang}
                themeMode={themeMode}
              />
            </div>
          </>
        )}
      </main>

      {/* Mobile & Desktop Custom Course Floating Action Bar */}
      <CustomCourseFloatingBar
        selectedCount={selectedCourseSpotIds.length}
        onBuildRoute={() => setIsItineraryOpen(true)}
        onClear={handleClearCourseSelection}
        lang={lang}
      />

      {/* AI Itinerary Builder Modal */}
      <ItineraryModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        filters={filters}
        spots={allTourSpots}
        lang={lang}
        fullAiItinerary={fullAiItinerary}
        customPickedSpots={allTourSpots.filter(s => selectedCourseSpotIds.includes(s.id))}
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
        <div className="modal-overlay-backdrop">
          <div 
            className="animate-fade-in glass-panel modal-responsive-card"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.25rem',
              maxWidth: '650px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              {t.privacyPolicyTitle || '개인정보처리방침'}
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              <p><strong>{t.privacySection1Title || '1. 수집하는 개인정보 항목 및 수집 방법'}</strong><br />{t.privacySection1Desc}</p>
              <p style={{ marginTop: '0.75rem' }}><strong>{t.privacySection2Title || '2. 구글 애드센스 (Google AdSense) 광고 및 쿠키 안내'}</strong><br />{t.privacySection2Desc}</p>
              <p style={{ marginTop: '0.75rem' }}><strong>{t.privacySection3Title || '3. 제휴 마케팅 (Affiliate Links) 안내'}</strong><br />{t.privacySection3Desc}</p>
              <p style={{ marginTop: '0.75rem' }}><strong>{t.privacySection4Title || '4. 개인정보의 보유 및 이용 기간'}</strong><br />{t.privacySection4Desc}</p>
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
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {t.privacyCloseBtn || '확인 및 닫기'}
            </button>
          </div>
        </div>
      )}

      {/* Partner & Sponsorship Inquiry Modal */}
      <PartnerInquiryModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
        lang={lang}
      />

      {/* Floating Action AI Button (Bottom-Right Corner) */}
      <AIFloatingButton
        onOpenItinerary={() => setIsItineraryOpen(true)}
        lang={lang}
        themeMode={themeMode}
        hasCustomBar={selectedCourseSpotIds.length > 0}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid var(--accent-primary)',
        padding: '1.75rem 1.25rem 6.5rem 1.25rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        background: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ marginBottom: '0.65rem', fontWeight: 600, color: 'var(--text-main)' }}>
          © 2026 {t.travelKorea || '대한민국 여행 정보'} (K-Travel Explorer) ·{' '}
          <a
            href="https://koreatravel.cc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-primary)', fontWeight: 800, textDecoration: 'none' }}
          >
            koreatravel.cc
          </a>
          {' & '}
          <a
            href="https://koreatravelsguide.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-primary)', fontWeight: 800, textDecoration: 'none' }}
          >
            koreatravelsguide.com
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>{t.footerAttribution || '한국관광공사 TourAPI 4.0 및 기상청 공공데이터 연동'}</span>
          <span>•</span>
          <button
            onClick={() => setIsGuidePROpen(true)}
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
            📖 {t.userGuideBtn || '이용가이드 & 홍보관'}
          </button>
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
            {t.privacyPolicyTitle || '개인정보처리방침'}
          </button>
          <span>•</span>
          <button
            onClick={() => setIsPartnerOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem'
            }}
          >
            {t.partnerInquiryBtn || '📩 제휴 & 광고 문의'}
          </button>
        </div>
      </footer>

      {/* User Guide & PR Publicity Hub Modal */}
      <GuidePRModal
        isOpen={isGuidePROpen}
        onClose={() => setIsGuidePROpen(false)}
        lang={lang}
        onOpenPartnerInquiry={() => setIsPartnerOpen(true)}
      />

      {/* Overseas Query Notice Modal */}
      {showOverseasModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button
              onClick={() => setShowOverseasModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1rem auto'
            }}>
              ✈️
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              대한민국(한국) 관광 전용 서비스 안내
            </h2>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              입력하신 <strong style={{ color: '#2563eb' }}>'{overseasQuery}'</strong>은(는) 해외 지역으로, 본 플랫폼은 <strong style={{ color: '#0f172a' }}>한국관광공사 TourAPI 4.0</strong> 기반의 <strong>대한민국 전용 관광 플랫폼</strong>입니다.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.75rem 0' }}>
                💡 대표적인 대한민국 인기도시 코스를 추천받으시겠어요?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setShowOverseasModal(false);
                    const newFilters = { ...filters, region: '서울', keyword: '성수동', nightKeyword: '', userLandmarks: [] };
                    setFilters(newFilters);
                    fetchTourSpots({ ...newFilters, lang }).then(spots => {
                      setAllTourSpots(spots);
                      setIsItineraryOpen(true);
                    });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🗼 서울 핫플 코스 (성수동, 홍대, 경복궁)</span>
                  <span style={{ color: '#2563eb' }}>선택 ➔</span>
                </button>
                <button
                  onClick={() => {
                    setShowOverseasModal(false);
                    const newFilters = { ...filters, region: '제주', keyword: '서귀포', nightKeyword: '', userLandmarks: [] };
                    setFilters(newFilters);
                    fetchTourSpots({ ...newFilters, lang }).then(spots => {
                      setAllTourSpots(spots);
                      setIsItineraryOpen(true);
                    });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🏝️ 제주 감성 힐링 코스 (애월, 서귀포, 성산)</span>
                  <span style={{ color: '#2563eb' }}>선택 ➔</span>
                </button>
                <button
                  onClick={() => {
                    setShowOverseasModal(false);
                    const newFilters = { ...filters, region: '부산', keyword: '해운대', nightKeyword: '', userLandmarks: [] };
                    setFilters(newFilters);
                    fetchTourSpots({ ...newFilters, lang }).then(spots => {
                      setAllTourSpots(spots);
                      setIsItineraryOpen(true);
                    });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>🌊 부산 해운대 바다뷰 코스 (블루라인파크, 광안리)</span>
                  <span style={{ color: '#2563eb' }}>선택 ➔</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowOverseasModal(false)}
              style={{
                width: '100%',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '12px',
                padding: '0.65rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              닫기 (국내 도시 검색하기)
            </button>
          </div>
        </div>
      )}

      {/* PWA Home Screen Shortcut Banner & Guide */}
      <PWAInstallBanner lang={lang} />

      {/* Sticky Bottom Thumb-Zone Floating AI Concierge Dock */}
      <FloatingAIDock
        lang={lang}
        onOpenChat={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartVoice={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
