import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Map, 
  PhoneCall, 
  Train, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Footer({
  lang = 'ko',
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
  onOpenContact,
  onOpenSubway,
  onOpenHelpline,
  onOpenEssentials
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <footer 
      className="vora-global-footer"
      style={{
        marginTop: '2.5rem',
        borderTop: '1px solid rgba(226, 232, 240, 0.85)',
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, #f1f5f9 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '2.2rem 1.5rem 5.5rem 1.5rem',
        color: '#475569',
        fontSize: '0.84rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.4rem'
      }}>
        {/* Top Row: Brand Info & Certified Data Source Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.2rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          {/* Brand & Mission */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '15px',
              boxShadow: '0 4px 10px rgba(124, 58, 237, 0.25)'
            }}>
              V
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>
                  VORA AI <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>v3.0</span>
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                {lang === 'en' 
                  ? 'Official AI Travel Concierge for 226 Cities & Counties in Korea'
                  : lang === 'ja'
                  ? '韓国 226市・郡 全域対応 リアルタイム AI旅行コンシェルジュ'
                  : (lang === 'zh' || lang === 'zht')
                  ? '韩国226个市郡全域官方AI智能旅游礼宾服务'
                  : '대한민국 226개 시·군 전역 실시간 AI 여행 컨시어지'}
              </p>
            </div>
          </div>

          {/* Official Verification Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <ShieldCheck size={13} color="#0284c7" />
              <span>{lang === 'en' ? 'Korea Tourism Org TourAPI 4.0' : lang === 'ja' ? '韓国観光公社 TourAPI 4.0 連動' : (lang === 'zh' || lang === 'zht') ? '韩国旅游发展局 TourAPI 4.0 官方直连' : '한국관광공사 TourAPI 4.0 연동'}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <Sparkles size={12} color="#7c3aed" />
              <span>Google Gemini AI</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <span>☁️ {lang === 'en' ? 'KMA Live Weather' : lang === 'ja' ? '気象庁 実況天気' : (lang === 'zh' || lang === 'zht') ? '气象厅 实时气象' : '기상청 실시간 날씨'}</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Quick Tools & Traveler Helplines */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Quick Helpline Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {onOpenHelpline && (
              <button
                onClick={onOpenHelpline}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff'
                }}
              >
                <PhoneCall size={12} color="#ef4444" />
                <span>{lang === 'en' ? '1330 Korea Travel Hotline' : lang === 'ja' ? '1330 韓国観光通訳案内' : (lang === 'zh' || lang === 'zht') ? '1330 韩国旅游翻译热线' : '1330 관광통역안내전화'}</span>
              </button>
            )}

            {onOpenSubway && (
              <button
                onClick={onOpenSubway}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff'
                }}
              >
                <Map size={12} color="#0284c7" />
                <span>{lang === 'en' ? 'Nationwide Metro Maps' : lang === 'ja' ? '全国地下鉄路線図' : (lang === 'zh' || lang === 'zht') ? '全韩国地铁路线图' : '전국 지하철 노선도'}</span>
              </button>
            )}

            {onOpenEssentials && (
              <button
                onClick={onOpenEssentials}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff'
                }}
              >
                <Train size={12} color="#10b981" />
                <span>{lang === 'en' ? 'Climate Card & Transit Guide' : lang === 'ja' ? '気候同行カード・交通ガイド' : (lang === 'zh' || lang === 'zht') ? '气候同行卡与交通指南' : '기후동행카드 & 교통 안내'}</span>
              </button>
            )}
          </div>

          {/* Legal / Policy Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 0, fontWeight: 700 }}
              >
                {t.privacyPolicy || '개인정보처리방침'}
              </button>
            )}
            <span style={{ color: '#cbd5e1' }}>•</span>
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 0, fontWeight: 700 }}
              >
                {t.termsOfService || '이용약관'}
              </button>
            )}
            <span style={{ color: '#cbd5e1' }}>•</span>
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 0, fontWeight: 700 }}
              >
                {t.aboutUs || '서비스 소개'}
              </button>
            )}
            <span style={{ color: '#cbd5e1' }}>•</span>
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 0, fontWeight: 700 }}
              >
                {t.contactUs || '제휴 및 문의'}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Copyright & Disclaimers */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          paddingTop: '0.8rem',
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
          fontSize: '11px',
          color: '#94a3b8'
        }}>
          <div>
            © 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.
          </div>
          <div>
            Official Inquiries: <span style={{ color: '#64748b', fontWeight: 600 }}>terainfoai@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
