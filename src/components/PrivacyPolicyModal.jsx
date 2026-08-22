import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function PrivacyPolicyModal({ isOpen, onClose, lang = 'ko' }) {
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
            <ShieldCheck size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'Privacy Policy' : lang === 'ja' ? 'プライバシーポリシー' : (lang === 'zh' || lang === 'zht') ? '隐私政策' : '개인정보처리방침 (Privacy Policy)'}
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
                  1. General Provisions & Information Collected
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI (koreatravel.cc) values user privacy and complies with applicable international privacy standards. As a free travel intelligence platform usable without account registration, we do not collect, store, or sell any sensitive personal identification data.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. Cookies & Google AdSense Advertising Policies
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  This website utilizes browser local storage (localStorage) and standard cookies to remember user preferences (such as selected language, wishlist bookmarks, and dark mode).
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google AdSense & Third-Party Cookies Policy:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google Analytics
                </h4>
                <p style={{ margin: 0 }}>
                  We use Google Analytics to monitor traffic and aggregate usage metrics in order to improve user experience. All collected data is anonymized and cannot identify individual users.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. Privacy Officer & Inquiries
                </h4>
                <p style={{ margin: 0 }}>
                  For inquiries or suggestions regarding our privacy practices, please contact us at:<br />
                  • Email: <strong>terainfoai@gmail.com</strong>
                </p>
              </div>
            </>
          ) : lang === 'ja' ? (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. 総則および収集する情報
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI (koreatravel.cc) は、ユーザーのプライバシーを尊重し、関連する国際的な保護基準を遵守します。本サービスは会員登録なしで利用できる無料の旅行情報プラットフォームであり、機密性の高い個人情報を収集・保存・販売することはありません。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. クッキー（Cookie）および Google AdSense 広告ポリシー
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  本ウェブサイトは、ユーザーの利便性（言語設定、お気に入りリスト、ダークモード設定など）のためにローカルストレージ（localStorage）およびCookieを使用します。
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google AdSense ポリシー:</strong> Google を含む第三者配信事業者は、Cookie を使用して、ユーザーがウェブサイトにアクセスした際の情報に基づいて広告を配信します。パーソナライズ広告は Google 広告設定（https://www.google.com/settings/ads）で無効にできます。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google アナリティクス
                </h4>
                <p style={{ margin: 0 }}>
                  サービス品質向上のため、Google アナリティクスを使用してトラフィックを分析しています。収集されるデータは完全に匿名化されており、個人を特定することはありません。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. 個人情報保護管理者およびお問い合わせ
                </h4>
                <p style={{ margin: 0 }}>
                  プライバシーポリシーに関するご質問は、下記までお問い合わせください。<br />
                  • メール: <strong>terainfoai@gmail.com</strong>
                </p>
              </div>
            </>
          ) : (lang === 'zh' || lang === 'zht') ? (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. 总则及收集的信息
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI (koreatravel.cc) 高度重视用户隐私，并遵守相关国际隐私保护规范。本服务为无需注册即可使用的免费智能旅行平台，绝不收集、储存或出售任何敏感个人身份信息。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. Cookie 与 Google AdSense 广告政策
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  本网站使用浏览器本地存储 (localStorage) 及 Cookie 来记录用户的偏好设置（如选择的语言、心愿单收藏、深色模式等）。
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google AdSense 广告政策：</strong> 包括 Google 在内的第三方广告服务商使用 Cookie 根据用户此前访问本网站或其他网站的记录来投放广告。用户可访问 Google 广告设置 (https://www.google.com/settings/ads) 停用个性化广告。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google Analytics（网站数据分析）
                </h4>
                <p style={{ margin: 0 }}>
                  为了持续优化用户体验，我们使用 Google Analytics 分析流量与使用情况。所有收集的数据均为匿名化处理，无法识别具体个人。
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. 隐私保护责任人与联系方式
                </h4>
                <p style={{ margin: 0 }}>
                  如有任何关于隐私政策的疑问或建议，请随时通过以下邮箱联系我们：<br />
                  • 邮箱：<strong>terainfoai@gmail.com</strong>
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. 총칙 및 수집하는 정보
                </h4>
                <p style={{ margin: 0 }}>
                  VORA AI(koreatravel.cc)는 이용자의 개인정보를 중요시하며, '개인정보 보호법' 및 관련 법령을 준수합니다. 본 서비스는 회원가입 없이 이용 가능한 무료 여행 정보 플랫폼으로, 이용자의 민감한 개인 식별 정보를 일체 저장하거나 요구하지 않습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. 쿠키(Cookie) 및 Google AdSense 광고 정책 준수
                </h4>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  본 웹사이트는 이용자 편의(언어 설정, 위시리스트 저장, 다크모드 설정)를 위해 브라우저 로컬 저장소(localStorage) 및 쿠키를 활용합니다.
                </p>
                <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong>Google 애드센스 및 제3자 쿠키 정책:</strong> Google을 포함한 타사 공급업체는 쿠키를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 광고를 게재합니다. Google의 DART 쿠키 사용을 통해 Google 및 파트너는 사용자의 인터넷 사이트 방문을 기반으로 적절한 맞춤 광고를 게재할 수 있습니다. 사용자는 Google 광고 설정(https://www.google.com/settings/ads)을 방문하여 맞춤설정 광고를 선택 해제할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  3. Google Analytics (웹로그 분석)
                </h4>
                <p style={{ margin: 0 }}>
                  본 서비스는 방문자의 트래픽 및 사용 통계를 분석하여 서비스 품질을 개선하기 위해 Google Analytics를 사용합니다. 수집되는 데이터는 익명화 처리되며 개인을 식별할 수 없습니다.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontWeight: 800 }}>
                  4. 개인정보 보호책임자 및 문의처
                </h4>
                <p style={{ margin: 0 }}>
                  서비스 이용 중 개인정보와 관련된 문의사항이나 정책에 대한 의견은 아래 공식 연락처로 문의해 주시기 바랍니다.<br />
                  • 이메일: <strong>terainfoai@gmail.com</strong>
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
