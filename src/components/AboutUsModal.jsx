import React from 'react';
import { X, Sparkles, Target, Compass, Award } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function AboutUsModal({ isOpen, onClose, lang = 'ko' }) {
  if (!isOpen) return null;

  return (
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
        padding: '1rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'About VORA AI' : lang === 'ja' ? 'VORA AI サービス紹介' : (lang === 'zh' || lang === 'zht') ? 'VORA AI 服务介绍' : 'VORA AI 서비스 소개 (About VORA)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {lang === 'en' ? (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  "Experience South Korea Like a Local, Powered by Next-Gen AI"
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI (koreatravel.cc) is a next-generation conversational AI travel concierge dedicated to international visitors exploring South Korea.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>Our Mission</span>
                </h4>
                <p style={{ margin: 0 }}>
                  Moving beyond generic and rigid package tours, we empower global travelers to discover Korea's vibrant culture — from <strong>Seongsu-dong pop-up stores, hidden alley cafes, K-drama pilgrimage spots, to romantic night views</strong> — all tailored through a single natural conversation.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>Core Technologies & Partnerships</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>Korea Tourism Organization (KTO) TourAPI 4.0</strong>: Official South Korea live tourism database & verified HD CDN images<br />
                  • <strong>Google DeepMind Gemini 3.5 Flash</strong>: Next-gen conversational AI itinerary & knowledge orchestration<br />
                  • <strong>CartoDB Global Maps & Spatial Clustering</strong>: Multilingual interactive map tiles, island clusters & GPS navigation<br />
                  • <strong>4 Core Languages</strong>: Seamless support for Korean, English, Japanese, and Chinese
                </p>
              </div>
            </>
          ) : lang === 'ja' ? (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  「韓国旅行のすべてを、AIとともに最もスマートに」
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI (koreatravel.cc) は、韓国を訪れる世界中の旅行者のために開発された次世代対話型スマート旅行コンシェルジュです。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>私たちのミッション (Our Mission)</span>
                </h4>
                <p style={{ margin: 0 }}>
                  型通りのツアーから脱却し、<strong>「聖水洞（ソンスドン）のポップアップストア、路地裏の隠れ家カフェ、K-Drama聖地巡礼、ロマンチックな夜景スポット」</strong>など、韓国のリアルなトレンドを自然な対話一つで完璧にプランニングします。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>コア技術と提携</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>韓国観光公社(KTO) TourAPI 4.0</strong>: 韓国公式リアルタイム観光公的データ直結<br />
                  • <strong>Google DeepMind Gemini 3.5 Flash</strong>: 高度な自然言語旅行設計インテリジェンス<br />
                  • <strong>CartoDB グローバル多言語マップ</strong>: 英語/現地語対応の精密地図と離島空間クラスタリング<br />
                  • 韓国語・英語・日本語・中国語の4大言語完全対応
                </p>
              </div>
            </>
          ) : (lang === 'zh' || lang === 'zht') ? (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  “探索韩国万千魅力，与AI一起开启潮流旅程”
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI (koreatravel.cc) 是专为全球赴韩游客打造的次时代对话式智能旅行私人助理。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>我们的使命 (Our Mission)</span>
                </h4>
                <p style={{ margin: 0 }}>
                  告别枯燥千篇一律的传统跟团游，深度探索<strong>“圣水洞潮流快闪店、隐秘胡同特色咖啡馆、韩剧取景地圣地巡礼、唯美浪漫夜景”</strong>等韩国地道文化，仅需一句话对话即可轻松定制专属旅行路线。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>核心技术与生态合作伙伴</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>韩国旅游发展局(KTO) TourAPI 4.0</strong>：官方实时公共旅游大数据直连<br />
                  • <strong>Google DeepMind Gemini 3.5 Flash</strong>：前沿自然语言旅行规划智能引擎<br />
                  • <strong>CartoDB 全球多语言互动地图</strong>：精准路线可视化与全韩国海岛空间聚类<br />
                  • 完美深度支持中（简/繁）、英、日、韩 4大核心语言
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid var(--border-highlight)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                  "대한민국 여행의 모든 것, AI와 함께 가장 트렌디하게"
                </h3>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>
                  VORA AI(koreatravel.cc)는 대한민국을 찾는 전 세계 여행객을 위해 탄생한 차세대 대화형 스마트 여행 컨시어지 플랫폼입니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  <span>우리의 미션 (Our Mission)</span>
                </h4>
                <p style={{ margin: 0 }}>
                  기존의 뻔하고 딱딱한 패키지 여행 코스에서 벗어나, 외국인과 MZ세대가 진정으로 원하는 <strong>'성수동 팝업스토어, 골목길 감성 카페, K-드라마 성지, 로컬 야경 명소'</strong> 등 살아있는 대한민국 문화를 자연어 대화 한 줄로 완벽하게 설계해 드립니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                  <span>핵심 기술 및 공식 데이터 연동 (Core Technologies)</span>
                </h4>
                <p style={{ margin: 0 }}>
                  • <strong>한국관광공사(KTO) TourAPI 4.0</strong>: 대한민국 226개 시·군 공식 관광지 및 정품 CDN 실시간 직결<br />
                  • <strong>Google DeepMind Gemini 3.5 Flash</strong>: 초개인화 자연어 여행 코디 및 5-Lane 자가학습 플라이휠<br />
                  • <strong>CartoDB 글로벌 다국어 지도</strong>: 전 세계 외국인을 위한 다국어 맵 타일 & 도서/섬 공간 클러스터링<br />
                  • 한국어·영어·일본어·중국어 4대 핵심 언어 완벽 지원
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Close */}
        <div style={{
          padding: '1rem 1.5rem',
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
              borderRadius: 'var(--radius-sm)',
              padding: '0.55rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {getCloseButtonLabel(lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
