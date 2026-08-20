import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import VoraAIChat from './components/VoraAIChat';
import CourseMagazineView from './components/CourseMagazineView';
import TravelEssentialsSection from './components/TravelEssentialsSection';
import AdSenseArticlesSection from './components/AdSenseArticlesSection';
import AdSenseBanner from './components/AdSenseBanner';
import TravelDetailModal from './components/TravelDetailModal';
import WishlistDrawer from './components/WishlistDrawer';
import WeatherModal from './components/WeatherModal';
import TravelEssentialsModal from './components/TravelEssentialsModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import AboutUsModal from './components/AboutUsModal';
import ContactUsModal from './components/ContactUsModal';
import PWAInstallBanner from './components/PWAInstallBanner';

import { detectBrowserLanguage, TRANSLATIONS } from './i18n/translations';
import { geminiGenerateFullItinerary, generateLocalFallbackItinerary } from './services/geminiNlpService';

export default function App() {
  // 4-Language State (ko, en, ja, zh)
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_lang');
      if (saved) return saved;
    } catch (e) {}
    return detectBrowserLanguage();
  });

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('vora_lang', newLang);
    } catch (e) {}
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Dark / Light Theme Mode
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('vora_theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    try {
      localStorage.setItem('vora_theme', themeMode);
    } catch (e) {}
  }, [themeMode]);

  useEffect(() => {
    const langMap = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };
    document.documentElement.lang = langMap[lang] || 'ko-KR';
  }, [lang]);

  // Itinerary & Chat State - Pre-populated with rich 3-day Seoul tour on initial load
  const initialItinerary = React.useMemo(() => {
    try {
      return generateLocalFallbackItinerary('서울 3일 핫플 감성 투어', '서울', 3, lang);
    } catch (e) {
      return null;
    }
  }, [lang]);

  const [itineraryData, setItineraryData] = useState(initialItinerary);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      text: '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA(보라)입니다. 😊\n어떤 여행을 꿈꾸시나요? 가고 싶은 도시나 스타일을 편하게 말씀해 주세요!'
    },
    {
      id: 'featured-1',
      role: 'assistant',
      text: '✨ [서울 3일 핫플 감성 투어]를 추천 코스로 준비해 두었습니다.\n수정을 원하시거나 새로운 지역을 가고 싶으시면 언제든 질문해 주세요!',
      itinerary: initialItinerary
    }
  ]);
  const [activeDay, setActiveDay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Persistent Bookmarks / Wishlist
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('vora_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleToggleBookmark = (spotToToggle) => {
    if (!spotToToggle) return;
    setBookmarks(prev => {
      const spotId = spotToToggle.contentId || spotToToggle.id || spotToToggle.title;
      const spotTitle = spotToToggle.title;
      
      const exists = prev.some(b => 
        (typeof b === 'object' && ((b.contentId && b.contentId === spotId) || (b.id && b.id === spotId) || (b.title && b.title === spotTitle))) ||
        (typeof b === 'string' && (b === spotId || b === spotTitle))
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
          contentId: spotToToggle.contentId || null,
          title: spotToToggle.title || '추천 관광지',
          location: spotToToggle.location || spotToToggle.addr1 || '상세 위치 제공',
          image: spotToToggle.image || '/default-spot.png',
          rating: spotToToggle.rating || 4.9,
          region: spotToToggle.region || '한국',
          category: spotToToggle.category || spotToToggle.theme || '명소'
        } : { id: spotId, title: spotId, location: '상세 위치 제공', image: '/default-spot.png', rating: 4.9 };
        updated = [spotObj, ...prev];
      }
      try {
        localStorage.setItem('vora_bookmarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Modals & Drawers Open State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Trigger Master Itinerary Planning with Conversational Memory
  const handleGenerateItinerary = async (promptQuery) => {
    if (!promptQuery || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptQuery
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // If query mentions a specific day (e.g. "2일차", "3일차"), auto focus on that day
    const dayMatch = promptQuery.match(/([1-5])일차/);
    if (dayMatch && dayMatch[1]) {
      setActiveDay(Number(dayMatch[1]));
    }

    try {
      const result = await geminiGenerateFullItinerary(promptQuery, lang, itineraryData);
      const finalResult = result || generateLocalFallbackItinerary(promptQuery, itineraryData?.targetCity || '서울', itineraryData?.days || 3, lang);
      
      setItineraryData(finalResult);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${finalResult.tripTitle}**\n${finalResult.summary}`,
        itinerary: finalResult
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('[VORA AI Error]', err);
      const fallback = generateLocalFallbackItinerary(promptQuery, itineraryData?.targetCity || '서울', itineraryData?.days || 3, lang);
      setItineraryData(fallback);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `✨ **${fallback.tripTitle}**\n${fallback.summary}`,
        itinerary: fallback
      };
      setChatMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-main)',
      position: 'relative'
    }}>
      {/* PWA Home Screen Installation Guide Banner */}
      <PWAInstallBanner lang={lang} />

      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        wishlistCount={bookmarks.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenEssentials={() => setIsEssentialsOpen(true)}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1320px',
        width: '100%',
        margin: '0 auto',
        padding: '0 0.85rem 1.5rem 0.85rem',
        boxSizing: 'border-box',
        flex: 1
      }}>
        {/* 1. Ultra-Compact Modern Hero Section with Smart Prompt Bar */}
        <HeroSection
          lang={lang}
          onSearch={handleGenerateItinerary}
          isLoading={isLoading}
        />

        {/* 2. PC 2-Column Split Hub (Dashboard view: Chat on Left / Timeline & Map on Right) */}
        <section id="itinerary-hub" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1rem',
          margin: '0.5rem 0 1.5rem 0',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Vora AI Conversational Chat Stream */}
          <div style={{ height: '620px' }}>
            <VoraAIChat
              lang={lang}
              chatMessages={chatMessages}
              isLoading={isLoading}
              onSendMessage={handleGenerateItinerary}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
            />
          </div>

          {/* Right Column: Course Magazine View & Google Map */}
          <div style={{ height: '620px' }}>
            <CourseMagazineView
              lang={lang}
              itineraryData={itineraryData}
              activeDay={activeDay}
              onSelectDay={(day) => setActiveDay(day)}
              onOpenDetail={(spot) => setSelectedSpot(spot)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        </section>

        {/* 3. Mid-page Google AdSense Unit */}
        <AdSenseBanner slot="7890123456" />

        {/* 4. Travel Essentials Section (Subway, Climate card, eSIM, 1330) */}
        <TravelEssentialsSection lang={lang} />

        {/* 5. Mid-page Google AdSense Unit */}
        <AdSenseBanner slot="8901234567" />

        {/* 6. AdSense Editorial Travel Articles & FAQ Section (High Content Authority) */}
        <AdSenseArticlesSection lang={lang} />
      </main>

      {/* Footer with Google AdSense Required Policy Links */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* AdSense Policy Links */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '1.25rem',
            fontWeight: 700
          }}>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.privacyPolicy || '개인정보처리방침'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTermsOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.termsOfService || '이용약관'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.aboutUs || '서비스 소개'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              {t.contactUs || '제휴 및 문의'}
            </button>
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            {t.footerCopyright || '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.'}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {t.footerTourApiNotice || '한국관광공사 TourAPI 4.0 공공데이터 및 Google Maps Platform 연동'} | Official Contact: terainfoai@gmail.com
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedSpot && (
        <TravelDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          lang={lang}
          isBookmarked={bookmarks.some(b => 
            (typeof b === 'object' && ((b.contentId && b.contentId === (selectedSpot.contentId || selectedSpot.id)) || (b.id && b.id === selectedSpot.id) || (b.title && b.title === selectedSpot.title))) ||
            (typeof b === 'string' && (b === selectedSpot.id || b === selectedSpot.contentId || b === selectedSpot.title))
          )}
          onToggleBookmark={(spot) => handleToggleBookmark(spot || selectedSpot)}
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

      {isWeatherOpen && (
        <WeatherModal
          isOpen={isWeatherOpen}
          onClose={() => setIsWeatherOpen(false)}
          lang={lang}
          initialRegion={itineraryData?.targetCity || '서울'}
        />
      )}

      {isEssentialsOpen && (
        <TravelEssentialsModal
          isOpen={isEssentialsOpen}
          onClose={() => setIsEssentialsOpen(false)}
          lang={lang}
        />
      )}

      {isPrivacyOpen && (
        <PrivacyPolicyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          lang={lang}
        />
      )}

      {isTermsOpen && (
        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          lang={lang}
        />
      )}

      {isAboutOpen && (
        <AboutUsModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          lang={lang}
        />
      )}

      {isContactOpen && (
        <ContactUsModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
