import React from 'react';
import { X, Train, CreditCard, Wifi, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function TravelEssentialsModal({
  isOpen = false,
  onClose,
  lang = 'ko'
}) {
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
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' 
                ? 'Korea Travel Essentials & Toolkit' 
                : lang === 'ja' 
                ? '韓国旅行 必須ガイド＆お役立ち情報' 
                : (lang === 'zh' || lang === 'zht') 
                ? (lang === 'zht' ? '韓國旅遊必備指南與實用工具' : '韩国旅游必备指南与实用工具') 
                : '한국 여행 필수 가이드 & 툴킷'}
            </h3>
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

        {/* Body */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Subway Section */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Train size={20} style={{ color: '#2563eb' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                {lang === 'en' 
                  ? '1. Subway & Public Transit Tips' 
                  : lang === 'ja' 
                  ? '1. 地下鉄・公共交通機関のご利用案内' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? (lang === 'zht' ? '1. 地鐵與公共交通搭乘指南' : '1. 地铁与公共交通搭乘指南') 
                  : '1. 지하철 및 대중교통 이용 팁'}
              </h4>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'The Seoul Metropolitan Subway system seamlessly connects all major districts via Lines 1 to 9, Shinbundang Line, and Suin-Bundang Line. English audio announcements, station numbers, and multilingual signage make navigation effortless.'
                : lang === 'ja'
                ? 'ソウル地下鉄は1号線から9号線、新盆唐線、水仁・盆唐線まで市内全域を網羅しています。日本語・英語・中国語の車内放送や駅番号ナンバリングが整備されており、初めての方でも安心して利用できます。'
                : (lang === 'zh' || lang === 'zht')
                ? (lang === 'zht' 
                    ? '首爾地鐵1至9號線、新盆唐線、水仁·盆唐線四通八達。車廂內設有多語言語音播報與清晰的車站編號標識，外國遊客亦可輕鬆乘車。' 
                    : '首尔地铁1至9号线、新盆唐线、水仁·盆唐线四通八达。车厢内设有多语言语音播报与清晰的车站编号标识，外国游客亦可轻松乘车。')
                : '서울 지하철은 1호선부터 9호선 및 신분당선, 수인분당선까지 전 노선이 촘촘하게 연결되어 있습니다. 영문 및 다국어 안내방송과 번호 표지판이 완비되어 있어 초행자도 쉽게 이동할 수 있습니다.'}
            </p>
            <a
              href="http://www.seoulmetro.co.kr/kr/cyberStation.do"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                textDecoration: 'none'
              }}
            >
              <span>
                {lang === 'en' 
                  ? 'Seoul Metro Official Route Map ↗' 
                  : lang === 'ja' 
                  ? 'ソウル交通公社 公式路線図 ↗' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '首尔交通公社 官方实时路线图 ↗' 
                  : '서울교통공사 실시간 노선도 ↗'}
              </span>
            </a>
          </div>

          {/* Transit Card Section */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CreditCard size={20} style={{ color: '#10b981' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                {lang === 'en' 
                  ? '2. Climate Card (Tourist Pass) & T-Money Card' 
                  : lang === 'ja' 
                  ? '2. 気候同行カード（短期券）＆ T-Moneyカード' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? (lang === 'zht' ? '2. 氣候同行卡（短期券）與 T-Money 交通卡' : '2. 气候同行卡（短期券）与 T-Money 交通卡') 
                  : '2. 기후동행카드(단기권) & T-Money 카드'}
              </h4>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {lang === 'en' ? (
                <>
                  • <strong>Climate Card Short-Term Pass:</strong> 1-Day (5,000 KRW), 2-Day (8,000 KRW), 3-Day (10,000 KRW), 5-Day (15,000 KRW) for unlimited Seoul subway and bus rides.<br />
                  • <strong>Where to Buy:</strong> Customer safety centers at major subway stations (Seoul Station, Myeongdong, Hongdae) or nearby convenience stores.
                </>
              ) : lang === 'ja' ? (
                <>
                  • <strong>気候同行カード 短期券:</strong> 1日券(5,000ウォン)、2日券(8,000ウォン)、3日券(10,000ウォン)、5日券(15,000ウォン)でソウル市内の地下鉄・バスが乗り放題。<br />
                  • <strong>購入場所:</strong> ソウル駅、明洞駅、弘大入口駅などの主要駅の顧客安全室またはコンビニ。
                </>
              ) : (lang === 'zh' || lang === 'zht') ? (
                <>
                  • <strong>{lang === 'zht' ? '氣候同行卡短期券:' : '气候同行卡短期券:'}</strong> 1日券(5,000韩元)、2日券(8,000韩元)、3日券(10,000韩元)、5日券(15,000韩元)，首尔市内地铁与公交无限次乘坐。<br />
                  • <strong>{lang === 'zht' ? '購買地點:' : '购买地点:'}</strong> 首尔站、明洞站、弘大入口站等主要地铁站客服中心或便利店。
                </>
              ) : (
                <>
                  • <strong>기후동행카드 단기권:</strong> 1일권(5,000원), 2일권(8,000원), 3일권(10,000원), 5일권(15,000원)으로 서울 시내 대중교통 무제한 탑승 가능.<br />
                  • <strong>구매처:</strong> 서울역, 명동역, 홍대입구역 등 주요 역사 고객안전실 또는 편의점.
                </>
              )}
            </p>
          </div>

          {/* Emergency Helpline Section */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PhoneCall size={20} style={{ color: '#ef4444' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#b91c1c' }}>
                {lang === 'en' 
                  ? '3. 1330 Korea Travel Helpline (24/7 Free)' 
                  : lang === 'ja' 
                  ? '3. 1330 韓国観光通訳案内電話（24時間無料）' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '3. 1330 韩国旅游咨询翻译热线（24小时免费）' 
                  : '3. 1330 한국관광통역안내전화 (24시간 무료)'}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'If you get lost, need translation at restaurants or taxis, or encounter lost items or emergencies, dial 1330 anytime. Certified coordinators provide free 24/7 three-way interpretation service in English, Japanese, Chinese, and more.'
                : lang === 'ja'
                ? '道に迷った時、飲食店やタクシーでの通訳が必要な時、紛失物や緊急時には局番なしの「1330」にお電話ください。専門オペレーターが24時間年中無休で日本語・英語・中国語などの3者通訳を無料サポートします。'
                : (lang === 'zh' || lang === 'zht')
                ? (lang === 'zht' 
                    ? '迷路、在餐廳或計程車遇到溝通困難、遺失物品或突發緊急情況時，請隨時撥打 1330。專業翻譯諮詢人員提供24小時全年無休的中文、英文、日文等三方即時免費翻譯服務。' 
                    : '迷路、在餐厅或出租车遇到沟通困难、遗失物品或突发紧急情况时，请随时拨打 1330。专业翻译咨询人员提供24小时全年无休的中文、英文、日文等三方即时免费翻译服务。')
                : '여행 중 길을 잃었거나 식당/택시에서 의사소통이 어려울 때, 분실물이나 응급상황 발생 시 언제든지 국번 없이 1330으로 전화하시면 전문 상담사가 3자 통역을 무료로 지원합니다.'}
            </p>
          </div>
        </div>

        {/* Footer */}
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
