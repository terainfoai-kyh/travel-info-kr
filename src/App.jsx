import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import PWAInstallBanner from './components/PWAInstallBanner';
import AIChatPromptHeader from './components/AIChatPromptHeader';
import WeatherWidget from './components/WeatherWidget';
import TravelEssentialsSection from './components/TravelEssentialsSection';
import AILifestyleSection from './components/AILifestyleSection';
import AITestWorkbench from './components/AITestWorkbench';
import TravelDetailModal from './components/TravelDetailModal';
import ItineraryModal from './components/ItineraryModal';
import WishlistDrawer from './components/WishlistDrawer';
import PartnerInquiryModal from './components/PartnerInquiryModal';
import GuidePRModal from './components/GuidePRModal';
import WeatherModal from './components/WeatherModal';
import TravelEssentialsModal from './components/TravelEssentialsModal';
import FoodOutfitModal from './components/FoodOutfitModal';
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

  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({ foods: [], outfits: [] });
  const [fullAiItinerary, setFullAiItinerary] = useState(null);

  // Modals & Drawers state
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);
  const [isFoodOutfitOpen, setIsFoodOutfitOpen] = useState(false);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isGuidePROpen, setIsGuidePROpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  // Persistent Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('ktravel_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleToggleBookmark = (spotToToggle) => {
    if (!spotToToggle) return;
    setBookmarks(prev => {
      const spotId = typeof spotToToggle === 'object' 
        ? (spotToToggle.contentId || spotToToggle.id || spotToToggle.title) 
        : spotToToggle;
      const spotTitle = typeof spotToToggle === 'object' ? spotToToggle.title : spotToToggle;
      
      const exists = prev.some(b => 
        (typeof b === 'object' && ((b.contentId && b.contentId === spotId) || (b.id && b.id === spotId) || (b.title && b.title === spotTitle))) ||
        (typeof b === 'string' && b === spotId)
      );
      
      let updated;
      if (exists) {
        updated = prev.filter(b => 
          typeof b === 'object' 
            ? ((b.contentId && b.contentId !== spotId) && (b.id && b.id !== spotId) && (!spotTitle || b.title !== spotTitle))
            : b !== spotId
        );
      } else {
        const spotObj = typeof spotToToggle === 'object' ? {
          id: spotToToggle.id || spotId,
          contentId: spotToToggle.contentId || spotId,
          title: spotToToggle.title || '추천 관광지',
          location: spotToToggle.location || spotToToggle.addr1 || '상세 위치 제공',
          image: spotToToggle.image || '/default-spot.png',
          rating: spotToToggle.rating || 4.9,
          region: spotToToggle.region || '추천',
          tags: spotToToggle.tags || ['관광명소']
        } : { id: spotId, title: spotId, location: '상세 위치 제공', image: '/default-spot.png', rating: 4.9 };
        updated = [spotObj, ...prev];
      }
      try {
        localStorage.setItem('ktravel_bookmarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

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
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenEssentials={() => setIsEssentialsOpen(true)}
        onOpenFoodOutfit={() => setIsFoodOutfitOpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 1.5rem 1.5rem', flex: 1, position: 'relative', zIndex: 1 }}>
        <AITestWorkbench 
          lang={lang} 
          onOpenDetail={(spot) => setSelectedSpot(spot)}
          bookmarks={bookmarks}
          onToggleBookmark={(spot) => handleToggleBookmark(spot)}
        />
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
          isBookmarked={bookmarks.some(b => 
            (typeof b === 'object' && ((b.contentId && b.contentId === (selectedSpot.contentId || selectedSpot.id)) || (b.id && b.id === selectedSpot.id) || (b.title && b.title === selectedSpot.title))) ||
            (typeof b === 'string' && (b === selectedSpot.id || b === selectedSpot.contentId || b === selectedSpot.title))
          )}
          onToggleBookmark={(spot) => handleToggleBookmark(spot || selectedSpot)}
        />
      )}

      {isWeatherOpen && (
        <WeatherModal
          isOpen={isWeatherOpen}
          onClose={() => setIsWeatherOpen(false)}
          lang={lang}
          initialRegion="서울"
        />
      )}

      {isEssentialsOpen && (
        <TravelEssentialsModal
          isOpen={isEssentialsOpen}
          onClose={() => setIsEssentialsOpen(false)}
          lang={lang}
          targetRegion="서울"
        />
      )}

      {isFoodOutfitOpen && (
        <FoodOutfitModal
          isOpen={isFoodOutfitOpen}
          onClose={() => setIsFoodOutfitOpen(false)}
          lang={lang}
          initialCity="서울"
        />
      )}

      {isWishlistOpen && (
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistSpots={bookmarks}
          onRemoveWishlist={(id) => handleToggleBookmark({ id })}
          onSelectSpot={(spot) => {
            setIsWishlistOpen(false);
            setSelectedSpot(spot);
          }}
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
