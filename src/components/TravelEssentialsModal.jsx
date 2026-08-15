import React from 'react';
import ReactDOM from 'react-dom';
import { Wifi, CreditCard, Hotel, DollarSign, ExternalLink, Sparkles, ShieldCheck, X, Check, Tag } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { buildAgodaDeepLink, buildKlookDeepLink, buildKKdayDeepLink } from '../services/apiConfig';

export default function TravelEssentialsModal({ isOpen, onClose, lang = 'ko', targetRegion = '서울' }) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const ESSENTIALS = [
    {
      id: 'esim',
      icon: <Wifi size={24} color="#0284c7" />,
      title: lang === 'en' ? 'Unlimited 4G/5G Data eSIM & USIM' :
             lang === 'ja' ? '韓国無制限 4G/5G 高速データ eSIM & SIM' :
             lang === 'zh' ? '韩国无限流量 4G/5G 高速 eSIM & SIM卡' :
             lang === 'zht' ? '韓國無限流量 4G/5G 高速 eSIM & SIM卡' :
             '무제한 4G/5G 데이터 eSIM & USIM',
      tag: lang === 'en' ? 'Klook 15% Off' :
           lang === 'ja' ? 'Klook 15%割引' :
           lang === 'zh' || lang === 'zht' ? 'Klook 独家85折' :
           'Klook 15% 단독할인',
      badgeBg: 'rgba(2, 132, 199, 0.1)',
      badgeColor: '#0284c7',
      desc: lang === 'en' ? 'Instant QR code activation upon arrival at Incheon/Gimpo airports. Unlimited high-speed 4G/5G data.' :
            lang === 'ja' ? '仁川・金浦空港到着後すぐにQRコードで開通できる韓国無制限高速データパス。' :
            lang === 'zh' || lang === 'zht' ? '仁川/金浦机场抵达即刻扫码激活，韩国畅享无限高速4G/5G流量。' :
            '인천/김포/김해공항 도착 즉시 QR코드로 간편 개통되는 한국 무제한 고속 데이터 패스',
      features: lang === 'en' ? ['100% Guaranteed Local Network', 'Instant QR Code Delivery', 'Hotspot Tethering Supported'] :
                lang === 'ja' ? ['韓国大手キャリア回線 100%保証', 'QRコード即時発行', 'テザリング対応'] :
                lang === 'zh' || lang === 'zht' ? ['韩国官方高速通信网络', '即刻下发激活二维码', '支持热点共享'] :
                ['실시간 통신망 100% 보장', 'QR코드 즉시 발급', '핫스팟 테더링 지원'],
      link: buildKlookDeepLink('한국 eSIM'),
      btnText: lang === 'en' ? 'Book eSIM at 15% Off ↗' :
               lang === 'ja' ? 'eSIMを15%割引で予約 ↗' :
               lang === 'zh' || lang === 'zht' ? '85折优惠预订 eSIM ↗' :
               'eSIM 15% 할인가로 예약하기'
    },
    {
      id: 'transit',
      icon: <CreditCard size={24} color="#7c3aed" />,
      title: lang === 'en' ? 'AREX Airport Express & Transit Card' :
             lang === 'ja' ? '空港鉄道 AREX 直通列車 & 交通カード' :
             lang === 'zh' ? '机场快线 AREX 直通列车 & 交通卡' :
             lang === 'zht' ? '機場快線 AREX 直通列車 & 交通卡' :
             '공항철도 AREX 직통열차 & 교통카드',
      tag: lang === 'en' ? 'KKday Official' :
           lang === 'ja' ? 'KKday 公式提携' :
           lang === 'zh' || lang === 'zht' ? 'KKday 官方合作' :
           'KKday 공식 제휴',
      badgeBg: 'rgba(124, 58, 237, 0.1)',
      badgeColor: '#7c3aed',
      desc: lang === 'en' ? 'Incheon Airport to Seoul Station in 43 mins + T-Money all-in-one pass for subway, bus, convenience stores.' :
            lang === 'ja' ? '仁川空港からソウル駅まで最速43分直通列車＆全国地下鉄・バス・コンビニ対応T-Moneyパス。' :
            lang === 'zh' || lang === 'zht' ? '仁川机场至首尔站43分钟快速直达，全韩地铁、公交、便利店通用交通卡。' :
            '인천공항 ➔ 서울역 43분 쾌속 직통열차 및 전국 지하철/버스/편의점 통합 T-Money 패스',
      features: lang === 'en' ? ['AREX Direct Train Ticket', 'Nationwide Subway & Bus Pass', 'WOWPASS All-in-One Option'] :
                lang === 'ja' ? ['空港鉄道 AREX 直通乗車券', '全国公共交通 乗り放題', 'WOWPASS オールインワン対応'] :
                lang === 'zh' || lang === 'zht' ? ['机场快线直通车车票', '全韩公共交通畅行卡', '支持 WOWPASS 一体化'] :
                ['공항철도 AREX 직통 승차권', '전국 대중교통 자유 탑승', 'WOWPASS 올인원 지원'],
      link: buildKKdayDeepLink('한국 교통카드'),
      btnText: lang === 'en' ? 'Book Transit Pass Deal ↗' :
               lang === 'ja' ? '交通パスを特別価格で予約 ↗' :
               lang === 'zh' || lang === 'zht' ? '特惠预订交通卡 ↗' :
               '교통패스 특가 예약하기'
    },
    {
      id: 'hotel',
      icon: <Hotel size={24} color="#ea580c" />,
      title: lang === 'en' ? `[${targetRegion}] Top Hotels & Hanok Stays` :
             lang === 'ja' ? `[${targetRegion}] おすすめホテル＆伝統韓屋宿泊` :
             lang === 'zh' || lang === 'zht' ? `[${targetRegion}] 精选酒店与特色韩屋民宿` :
             `[${targetRegion}] 추천 호텔 & 감성 숙소`,
      tag: lang === 'en' ? 'Agoda Best Price' :
           lang === 'ja' ? 'Agoda 最安値保証' :
           lang === 'zh' || lang === 'zht' ? 'Agoda 最低价保证' :
           'Agoda 최저가 보장',
      badgeBg: 'rgba(234, 88, 12, 0.1)',
      badgeColor: '#ea580c',
      desc: lang === 'en' ? `Exclusive up to 75% discount for popular hotels, luxury resorts, and hanok stays near ${targetRegion} attractions.` :
            lang === 'ja' ? `${targetRegion}の主要観光地や駅チカの人気ホテル、リゾート、韓屋ステイが最大75%割引。` :
            lang === 'zh' || lang === 'zht' ? `${targetRegion}热门景区及地铁站周边优质酒店、度假村及韩屋体验，最高享75%专属特惠。` :
            `${targetRegion} 주요 관광지 및 지하철역 인근 인기 호텔, 리조트, 한옥 스테이 최대 75% 특별 제휴가`,
      features: lang === 'en' ? ['Best Price Guarantee', 'Free Cancellation Rooms', 'Foreigner Top Rated 9.0+'] :
                lang === 'ja' ? ['最安値保証制度適用', '無料キャンセル可能プラン多数', '外国人旅行客クチコミ9.0+'] :
                lang === 'zh' || lang === 'zht' ? ['官方最低价格保障', '支持免费取消房型', '外国游客精选好评9.0+'] :
                ['최저가 보상제 적용', '무료 취소 가능 객실 다수', '외국인 선호 평점 9.0+ 숙소'],
      link: buildAgodaDeepLink(targetRegion),
      btnText: lang === 'en' ? `View ${targetRegion} Hotel Deals ↗` :
               lang === 'ja' ? `${targetRegion}の宿泊特恵を見る ↗` :
               lang === 'zh' || lang === 'zht' ? `查看${targetRegion}特惠酒店 ↗` :
               `${targetRegion} 숙소 특가 확인하기`
    },
    {
      id: 'taxfree',
      icon: <DollarSign size={24} color="#059669" />,
      title: lang === 'en' ? 'Tax Refund & Duty Free Shopping Tips' :
             lang === 'ja' ? 'タックスリファンド(即時免税)＆ショッピング' :
             lang === 'zh' || lang === 'zht' ? '退税攻略与免税购物优惠指南' :
             '택스 리펀(Tax Refund) & 쇼핑 패스',
      tag: lang === 'en' ? 'Shopping Guide' :
           lang === 'ja' ? '免税特典ガイド' :
           lang === 'zh' || lang === 'zht' ? '免税购物指南' :
           '쇼핑 혜택 가이드',
      badgeBg: 'rgba(5, 150, 105, 0.1)',
      badgeColor: '#059669',
      desc: lang === 'en' ? 'Instant passport tax refund guide for Olive Young, department stores, and K-Beauty shopping coupons.' :
            lang === 'ja' ? 'オリーブヤングや百貨店でのパスポート即時免税還付のコツ＆K-Beautyショッピング割引クーポン。' :
            lang === 'zh' || lang === 'zht' ? 'Olive Young、百货商场护照即时免税指南及韩国代表性K-Beauty购物优惠券。' :
            '올리브영, 주요 백화점, 마트 즉시 면세 환급 꿀팁 및 한국 대표 쇼핑몰/액티비티 할인 쿠폰',
      features: lang === 'en' ? ['Instant Tax Refund on Passport', 'K-Beauty & Fashion Coupons', 'Airport Refund Counter Guide'] :
                lang === 'ja' ? ['パスポート提示で即時還付', 'K-Beauty・ファッション割引券', '空港還付カウンター案内'] :
                lang === 'zh' || lang === 'zht' ? ['持护照即享现场即时退税', 'K-Beauty美妆服饰优惠券', '机场退税窗口详细指引'] :
                ['여권 제시 즉시 환급 방법 안내', 'K-뷰티/패션 쇼핑 쿠폰북', '공항 환급 창구 위치 안내'],
      link: buildKlookDeepLink('한국 쇼핑 면세'),
      btnText: lang === 'en' ? 'Get Shopping Coupons ↗' :
               lang === 'ja' ? 'ショッピング割引券を受け取る ↗' :
               lang === 'zh' || lang === 'zht' ? '领取购物优惠券 ↗' :
               '쇼핑 할인 쿠폰 받기'
    }
  ];

  const modalNode = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div 
        className="animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  ✈️ {lang === 'en' ? 'Korea Travel Essentials & Partner Deals' :
                      lang === 'ja' ? '韓国旅行の必需品＆公式提携特典' :
                      lang === 'zh' || lang === 'zht' ? '韩国旅行必备指南与官方特惠' :
                      '한국 여행 필수템 & 공식 제휴 혜택관'}
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px'
                }}>
                  {lang === 'en' ? 'Official Partner' : lang === 'ja' ? '公式パートナー' : lang === 'zh' || lang === 'zht' ? '官方认证' : '공식 파트너 인증'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', margin: '0.2rem 0 0 0' }}>
                {lang === 'en' ? 'Prepare eSIM, AREX airport train, transit cards, and best hotel deals all in one place' :
                 lang === 'ja' ? 'eSIM・空港鉄道AREX・交通カード・最安値ホテルまでワンストップでお得に準備' :
                 lang === 'zh' || lang === 'zht' ? '一站式特惠预订 eSIM、机场快线、交通卡及全韩精选酒店' :
                 'eSIM · 공항철도 AREX · 대중교통카드 · 최저가 호텔까지 원스톱 제휴 특가로 준비하세요'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Cards Grid */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          maxHeight: 'calc(90vh - 150px)'
        }}>
          {ESSENTIALS.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '16px',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: item.badgeBg,
                    color: item.badgeColor
                  }}>
                    {item.tag}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-main, #0f172a)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem' }}>
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
                      <Check size={13} color="#059669" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'opacity 0.2s'
                }}
              >
                <span>{item.btnText}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary, #f8fafc)',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #94a3b8)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#059669" />
            {lang === 'en' ? 'Official partner affiliate verified with Klook & Agoda.' :
             lang === 'ja' ? '本アフィリエイトリンクはKlook・Agodaの公式規約を遵守しています。' :
             lang === 'zh' || lang === 'zht' ? '本特惠链接严格遵守Klook及Agoda官方合作伙伴规范。' :
             '본 제휴 링크는 한국관광공사 및 Klook/Agoda 공식 제휴 규정을 준수합니다.'}
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {lang === 'en' ? 'Close' : lang === 'ja' ? '閉じる' : lang === 'zh' || lang === 'zht' ? '关闭' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modalNode, document.body) : null;
}
