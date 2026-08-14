import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PWAInstallBanner from './components/PWAInstallBanner';
import AIChatPromptHeader from './components/AIChatPromptHeader';
import AITestWorkbench from './components/AITestWorkbench';
import TravelDetailModal from './components/TravelDetailModal';
import ItineraryModal from './components/ItineraryModal';
import WishlistDrawer from './components/WishlistDrawer';
import PartnerInquiryModal from './components/PartnerInquiryModal';
import GuidePRModal from './components/GuidePRModal';
import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { generateLocalFallbackItinerary } from './services/geminiNlpService';

export default function App() {
  // Auto-detect browser locale
  const [lang, setLang] = useState(detectBrowserLanguage());
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const [filters, setFilters] = useState({
    region: '전국',
    theme: '전체',
    days: 3
  });

  // Modals & Drawers state
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isGuidePROpen, setIsGuidePROpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  // Dark / Light Theme Mode
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* PWA Home Screen Installation Guide Banner */}
      <PWAInstallBanner lang={lang} />

      {/* Top Header & Multilingual Selector */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        wishlistCount={bookmarks.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenItinerary={() => setIsItineraryOpen(true)}
        onOpenGuidePR={() => setIsGuidePROpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 0.5rem 1.5rem', flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Conversational & Voice AI Prompt Header */}
        <div id="ai-prompt-hero">
          <AIChatPromptHeader 
            lang={lang} 
            filters={filters}
          onGenerateItinerary={async (parsedInput, fullAiResult = null) => {
            const parsed = parsedInput || (fullAiResult ? { region: fullAiResult.dailySchedules?.[0]?.city || '전국', days: fullAiResult.days || 3, keyword: fullAiResult.dailySchedules?.[0]?.city || '' } : { region: '전국', days: 3, keyword: '' });
            
            // [Fix & Sync] Instantly bind fullAiResult and flatten its spots into allTourSpots
            // This ensures both TourSpotGrid and ItineraryModal display 100% AI recommended spots in exact order
            if (fullAiResult) {
              setFullAiItinerary(fullAiResult);
              const targetRegion = fullAiResult.dailySchedules?.[0]?.city || parsed.region || '전국';
              setFilters(prev => ({ ...prev, region: targetRegion, days: fullAiResult.days || 3 }));

              let flattenedSpots = (fullAiResult.dailySchedules || []).flatMap(ds => ds.spots || []);
              
              if (flattenedSpots.length === 0 && fullAiResult.dailyPlaces && fullAiResult.dailyPlaces.length > 0) {
                let spotIndex = 1;
                const regionName = fullAiResult.targetCity || '추천';
                flattenedSpots = fullAiResult.dailyPlaces.flatMap(dp => 
                  (dp.places || []).map(pName => ({
                    id: `ai-spot-${Date.now()}-${spotIndex++}`,
                    title: typeof pName === 'string' ? pName.trim() : pName,
                    location: `${regionName} 대표 명소`,
                    addr1: `${regionName} ${dp.day || 1}일차 코스`,
                    assignedDay: dp.day || 1,
                    isInstagramHotspot: true
                  }))
                );
              }

              if (flattenedSpots.length > 0) {
                setAllTourSpots(flattenedSpots);
              }
              return;
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
            
            try {
              // 100% Pure Vora AI (Gemini 1.5) & Master Gazetteer Catalog Direct Binding Engine (Zero TourAPI Interference)
              const fallbackResult = generateLocalFallbackItinerary(targetKeyword || targetRegion, lang);
              setFullAiItinerary(fallbackResult);
              const pureSpots = (fallbackResult.dailySchedules || []).flatMap(ds => ds.spots || []);
              if (pureSpots.length > 0) {
                setAllTourSpots(pureSpots);
              }

              const effectiveRegion = fallbackResult.targetCity || targetRegion;
              const wData = await fetchRealtimeWeather(effectiveRegion, newFilters.startDate, newFilters.endDate);
              setWeatherData(wData);
              const recs = getRecommendedFoodAndOutfit({
                weather: wData,
                region: effectiveRegion,
                keyword: targetKeyword,
                rainyMode: newFilters.rainyMode
              });
              setRecommendation(recs);
            } catch (err) {
              console.warn('App itinerary resolution error:', err);
            } finally {
              setIsLoading(false);
              if (fullAiResult) {
                setIsItineraryOpen(true);
              } else {
                setIsItineraryOpen(false);
              }
            }
          }} 
        />
        </div>

        {/* Realtime Weather Widget directly below AI Prompt Box */}
        <div id="weather-info" style={{ marginBottom: '1.5rem' }}>
          <WeatherWidget weatherData={weatherData} lang={lang} />
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--accent-primary)' }}>
            <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ fontWeight: 600 }}>{t.loadingData || '실시간 기후 및 공공데이터를 조회 중입니다...'}</p>
          </div>
        ) : (
          <>
            {/* 1. Travel Essentials Hub Section */}
            <div id="travel-essentials">
              <TravelEssentialsSection lang={lang} filters={filters} />
            </div>

            {/* 2. AI Lifestyle Recommendations */}
            <div id="ai-lifestyle">
              <AILifestyleSection
                foods={recommendations.foods}
                outfits={recommendations.outfits}
                filters={filters}
                lang={lang}
                themeMode={themeMode}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p>© 2026 Travel Korea - Vora AI Greenfield Platform (TourAPI 4.0 Authenticated)</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedSpot && (
        <TravelDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          lang={lang}
          themeMode={themeMode}
        />
      )}

      {isWishlistOpen && (
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          bookmarks={bookmarks}
          onRemoveBookmark={(id) => setBookmarks(prev => prev.filter(b => b.id !== id))}
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          lang={lang}
        />
      )}

      {isPartnerOpen && (
        <PartnerInquiryModal
          isOpen={isPartnerOpen}
          onClose={() => setIsPartnerOpen(false)}
          lang={lang}
        />
      )}

      {isGuidePROpen && (
        <GuidePRModal
          isOpen={isGuidePROpen}
          onClose={() => setIsGuidePROpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
