import React from 'react';
import ReactDOM from 'react-dom';
import { X, PhoneCall, MessageSquare, Globe, ShieldCheck, Clock } from 'lucide-react';

/**
 * HelplineModal.jsx
 * 한국관광공사 1330 관광통역안내전화 24시간 스마트 헬프라인 모달
 * - 원터치 무료 전화 걸기 (국내: 1330 / 해외: +82-2-1330)
 * - 24시간 실시간 1:1 문자/채팅 상담소 직통 연결 (외국인 최애)
 * - 공식 이용 가이드 웹사이트
 */
export default function HelplineModal({ isOpen, onClose, lang = 'ko' }) {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (lang) {
      case 'en': return '1330 Korea Travel Helpline';
      case 'ja': return '1330 韓国観光通訳案内サービス';
      case 'zh':
      case 'zht': return '1330 韩国旅游咨询与免费翻译';
      default: return '1330 관광 안내 & 24시간 무료 통역';
    }
  };

  const getSubtitle = () => {
    switch (lang) {
      case 'en': return '24/7 Free interpretation & travel assistance by KTO';
      case 'ja': return '韓国観光公社運営・24時間年中無休の無料通訳＆案内';
      case 'zh':
      case 'zht': return '韩国观光公社官方运营·24小时免费多语言即时翻译';
      default: return '한국관광공사 공식 24시간 3자 무료 통역 및 긴급 지원';
    }
  };

  const officialUrl = lang === 'en' 
    ? 'https://english.visitkorea.or.kr' 
    : lang === 'ja' 
    ? 'https://japanese.visitkorea.or.kr' 
    : (lang === 'zh' || lang === 'zht') 
    ? 'https://chinese.visitkorea.or.kr' 
    : 'https://korean.visitkorea.or.kr';

  const chatUrl = 'https://1330chat.visitkorea.or.kr';

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {getTitle()}
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {getSubtitle()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Options */}
        <div style={{
          padding: '1.15rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Option 1: Direct Phone Call */}
          <a
            href="tel:1330"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <PhoneCall size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#b91c1c' }}>
                  {lang === 'en' ? 'Call 1330 (Toll-Free)' :
                   lang === 'ja' ? '1330 通話発信（通話料無料）' :
                   (lang === 'zh' || lang === 'zht') ? '拨打 1330（免费电话）' :
                   '국번 없이 1330 무료 전화 걸기'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {lang === 'en' ? 'From Overseas: +82-2-1330' :
                   lang === 'ja' ? '海外から: +82-2-1330' :
                   (lang === 'zh' || lang === 'zht') ? '海外拨打: +82-2-1330' :
                   '해외 발신: +82-2-1330 (24시간 한국어/영어/일본어/중국어)'}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ef4444' }}>
              통화 📞
            </span>
          </a>

          {/* Option 2: 24/7 Live Text Chat */}
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1rem',
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              border: '1.5px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  {lang === 'en' ? '24/7 Live Text Chat' :
                   lang === 'ja' ? '24時間 リアルタイム文字チャット' :
                   (lang === 'zh' || lang === 'zht') ? '24小时 实时在线文字客服' :
                   '1330 실시간 문자/채팅 상담 (24시간)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {lang === 'en' ? 'Chat directly with certified counselors' :
                   lang === 'ja' ? '専門オペレーターとチャットで相談' :
                   (lang === 'zh' || lang === 'zht') ? '与专业客服进行1:1在线文字沟通' :
                   '식당, 택시, 길찾기 실시간 문자 통역 및 여행 상담'}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
              채팅 💬
            </span>
          </a>

          {/* Option 3: Official KTO Website */}
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#64748b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Globe size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {lang === 'en' ? 'Official Service Guide' :
                   lang === 'ja' ? '公式サービス案内' :
                   (lang === 'zh' || lang === 'zht') ? '官方服务指南' :
                   '한국관광공사 1330 공식 웹사이트'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {lang === 'en' ? 'Languages, coverage & emergency contact' :
                   lang === 'ja' ? 'サポート言語・利用範囲・緊急連絡先' :
                   (lang === 'zh' || lang === 'zht') ? '支持语种、服务范围与应急支援' :
                   '지원 언어(8개국어), 서비스 범위 및 긴급구호 연계'}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              안내 ↗
            </span>
          </a>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-glass)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {lang === 'en' ? 'Close' : lang === 'ja' ? '閉じる' : (lang === 'zh' || lang === 'zht') ? '关闭' : '닫기'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
