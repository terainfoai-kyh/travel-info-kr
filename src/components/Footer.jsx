import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Map, 
  PhoneCall, 
  Train
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
        marginTop: '0.35rem',
        borderTop: '1px solid rgba(240, 235, 225, 0.95)',
        background: 'linear-gradient(180deg, rgba(250, 248, 245, 0.96) 0%, #f4eee4 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '0.85rem 1.25rem 4.8rem 1.25rem',
        color: '#78716c',
        fontSize: '0.82rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{
        maxWidth: '980px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        textAlign: 'center'
      }}>
        {/* Row 1: Brand Logo + Official Verification Badges + Quick Action Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {/* Brand Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            padding: '3px 9px 3px 5px',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '11px'
            }}>
              V
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#1e293b' }}>
              VORA AI <span style={{ fontSize: '0.70rem', color: '#7c3aed', fontWeight: 800 }}>v3.0</span>
            </span>
          </div>

          {/* Certified Data Badges */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            fontSize: '11px',
            fontWeight: 700,
            color: '#334155'
          }}>
            <ShieldCheck size={12} color="#0284c7" />
            <span>{lang === 'en' ? 'TourAPI 4.0' : lang === 'ja' ? '韓国観光公社 4.0' : (lang === 'zh' || lang === 'zht') ? '韩国旅游局 4.0' : '한국관광공사 TourAPI 4.0'}</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            fontSize: '11px',
            fontWeight: 700,
            color: '#334155'
          }}>
            <Sparkles size={11} color="#7c3aed" />
            <span>Google Gemini AI</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            fontSize: '11px',
            fontWeight: 700,
            color: '#334155'
          }}>
            <span>☁️ {lang === 'en' ? 'KMA Weather' : lang === 'ja' ? '気象庁' : (lang === 'zh' || lang === 'zht') ? '气象厅' : '기상청 실시간 날씨'}</span>
          </div>

          {/* Quick Action Buttons */}
          {onOpenHelpline && (
            <button
              onClick={onOpenHelpline}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer'
              }}
            >
              <PhoneCall size={11} color="#ef4444" />
              <span>{lang === 'en' ? '1330 Hotline' : lang === 'ja' ? '1330 通訳案内' : (lang === 'zh' || lang === 'zht') ? '1330 旅游热线' : '1330 안내전화'}</span>
            </button>
          )}

          {onOpenSubway && (
            <button
              onClick={onOpenSubway}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer'
              }}
            >
              <Map size={11} color="#0284c7" />
              <span>{lang === 'en' ? 'Metro Maps' : lang === 'ja' ? '地下鉄' : (lang === 'zh' || lang === 'zht') ? '地铁路线' : '지하철 노선도'}</span>
            </button>
          )}

          {onOpenEssentials && (
            <button
              onClick={onOpenEssentials}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer'
              }}
            >
              <Train size={11} color="#10b981" />
              <span>{lang === 'en' ? 'Transit Guide' : lang === 'ja' ? '交通ガイド' : (lang === 'zh' || lang === 'zht') ? '交通指南' : '교통 안내'}</span>
            </button>
          )}
        </div>

        {/* Row 2: Legal Policies + Copyright + Contact Inline */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '11.5px',
          color: '#64748b'
        }}>
          {onOpenPrivacy && (
            <button
              onClick={onOpenPrivacy}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '11.5px' }}
            >
              {t.privacyPolicy || '개인정보처리방침'}
            </button>
          )}
          <span style={{ color: '#cbd5e1' }}>•</span>
          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '11.5px' }}
            >
              {t.termsOfService || '이용약관'}
            </button>
          )}
          <span style={{ color: '#cbd5e1' }}>•</span>
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '11.5px' }}
            >
              {t.aboutUs || '서비스 소개'}
            </button>
          )}
          <span style={{ color: '#cbd5e1' }}>•</span>
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '11.5px' }}
            >
              {t.contactUs || '제휴 및 문의'}
            </button>
          )}
          <span style={{ color: '#cbd5e1', margin: '0 4px' }}>|</span>
          <span style={{ color: '#94a3b8' }}>
            © 2026 VORA AI
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ color: '#94a3b8' }}>
            Official: <a href="mailto:terainfoai@gmail.com" style={{ color: '#64748b', textDecoration: 'none' }}>terainfoai@gmail.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
