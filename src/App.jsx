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
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 1.5rem 1.5rem', flex: 1, position: 'relative', zIndex: 1 }}>
        <AITestWorkbench 
          lang={lang} 
          onOpenDetail={(spot) => setSelectedSpot(spot)}
          bookmarks={bookmarks}
          onToggleBookmark={(spotId) => {
            setBookmarks(prev => prev.includes(spotId) ? prev.filter(id => id !== spotId) : [...prev, spotId]);
          }}
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
