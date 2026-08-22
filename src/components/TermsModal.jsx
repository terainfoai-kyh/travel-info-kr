import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function TermsModal({ isOpen, onClose, lang = 'ko' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
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
      }}>
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
            <FileText size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'Terms of Service' : lang === 'ja' ? '利用規約' : (lang === 'zh' || lang === 'zht') ? '服务条款' : '이용약관 (Terms of Service)'}
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
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  Article 1 (Purpose)
                </h4>
                <p style={{ margin: 0 }}>
                  These Terms of Service govern the basic conditions and procedures for using the Korea travel course recommendation and tourism guide services provided by VORA AI (koreatravel.cc).
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  Article 2 (Service Description & Data Sources)
                </h4>
                <p style={{ margin: 0 }}>
                  1. VORA AI provides personalized travel itineraries and public transit guidance utilizing official Google Places Platform data and Google Gemini AI technology.<br />
                  2. Spot operating hours, closing days, and admission fees may vary depending on on-site conditions. Please verify with official venue channels before visiting.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  Article 3 (Intellectual Property & User Responsibilities)
                </h4>
                <p style={{ margin: 0 }}>
                  All designs, UI/UX structures, AI prompt architectures, and original editorial content on this platform are the intellectual property of VORA AI. Unauthorized duplication, automated crawling, or commercial redistribution is strictly prohibited.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  Article 4 (Disclaimer of Warranties)
                </h4>
                <p style={{ margin: 0 }}>
                  This service is provided free of charge as a travel guidance assistant. We assume no legal liability for any direct or indirect damages arising from unforeseen transit delays, adverse weather conditions, or unexpected venue closures.
                </p>
              </div>
            </>
          ) : lang === 'ja' ? (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第1条（目的）
                </h4>
                <p style={{ margin: 0 }}>
                  本規約は、VORA AI (koreatravel.cc) が提供する韓国旅行プラン提案および観光ガイドサービス（以下「本サービス」）の利用条件を定めるものです。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第2条（サービス内容およびデータソース）
                </h4>
                <p style={{ margin: 0 }}>
                  1. 本サービスは、Google Places Platform の公式位置データと Google Gemini AI 技術を活用して、個々のユーザーに最適化された旅行ルートと交通案内を提供します。<br />
                  2. スポットの営業時間、休業日、入場料などは現地の状況により変更される場合がありますので、訪問前に公式サイト等でご確認ください。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第3条（知的財産権および著作権保護）
                </h4>
                <p style={{ margin: 0 }}>
                  本サービスのUI/UXデザイン、AIプロンプト設計、オリジナルコンテンツの著作権は VORA AI に帰属します。無断複製、自動スクレイピング、商用再配布を固く禁じます。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第4条（免責事項）
                </h4>
                <p style={{ margin: 0 }}>
                  本サービスは無料の旅行アシスタントとして提供されており、現地の交通遅延、悪天候、施設の臨時休業等に起因する直接的・間接的な損害について、一切の法的責任を負いません。
                </p>
              </div>
            </>
          ) : (lang === 'zh' || lang === 'zht') ? (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第1条（目的）
                </h4>
                <p style={{ margin: 0 }}>
                  本条款旨在规范使用由 VORA AI (koreatravel.cc) 提供的韩国旅游行程规划与向导服务（以下简称“服务”）的相关条件与准则。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第2条（服务内容与数据来源）
                </h4>
                <p style={{ margin: 0 }}>
                  1. 本服务依托 Google Places Platform 官方认证位置数据与 Google Gemini AI 技术，为游客提供定制化旅行日程及公共交通指引。<br />
                  2. 推荐景点的营业时间、公休日及门票价格可能因现场实际情况变动，行前请务必通过官方渠道确认。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第3条（知识产权与用户规范）
                </h4>
                <p style={{ margin: 0 }}>
                  本平台的所有界面设计、UI/UX架构、AI提示词系统及原创内容版权均归 VORA AI 所有。严禁未经授权的复制、自动化爬取或商业转售行为。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  第4条（免责声明）
                </h4>
                <p style={{ margin: 0 }}>
                  本服务为免费智能旅行向导，对于因当地交通延误、极端天气或景点临时关闭等不可抗力因素造成的任何直接或间接损失，本平台不承担法律责任。
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  제1조 (목적)
                </h4>
                <p style={{ margin: 0 }}>
                  본 약관은 VORA AI(koreatravel.cc)가 제공하는 대한민국 여행 코스 추천 및 관광 정보 안내 서비스(이하 '서비스')의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  제2조 (서비스의 내용 및 데이터 출처)
                </h4>
                <p style={{ margin: 0 }}>
                  1. 본 서비스는 Google Places Platform 공식 위치 데이터와 Google Gemini AI 기술을 활용하여 맞춤형 여행 일정 및 대중교통 경로 안내를 제공합니다.<br />
                  2. 추천된 장소의 운영 시간, 휴무일, 입장료 등은 현장 사정에 따라 변동될 수 있으므로 방문 전 공식 연락처를 통해 확인하시기 바랍니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  제3조 (지식재산권 및 이용자의 의무)
                </h4>
                <p style={{ margin: 0 }}>
                  본 서비스의 디자인, UI/UX 구조, AI 프롬프트 아키텍처 및 원본 콘텐츠에 대한 저작권은 VORA AI에 귀속되며, 무단 복제, 크롤링, 상업적 재배포를 엄격히 금지합니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  제4조 (면책조항)
                </h4>
                <p style={{ margin: 0 }}>
                  본 서비스는 무료로 제공되는 여행 가이드로서, AI 추천 경로 이용 중 발생하는 현지 교통 지연, 기상 악화, 시설 휴무 등으로 인한 직간접적 손해에 대해 법적 책임을 지지 않습니다.
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
