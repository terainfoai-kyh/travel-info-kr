import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, MapPin, Coffee, Train, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function AdSenseArticlesSection({ lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [openFaq, setOpenFaq] = useState(null);

  const ARTICLES_KO = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: '핫플 가이드',
      title: '2026 서울 핫플레이스 트렌드: 성수동에서 한남동까지',
      summary: '옛 공장 지대에서 글로벌 패션과 팝업스토어의 성지로 거듭난 성수동(Seongsu-dong)과 감성적인 부티크 숍이 가득한 한남동의 숨은 명소를 소개합니다.',
      readTime: '3분 소요',
      content: '성수동은 디올 성수, 아더에러 플래그십, 수많은 로컬 로스터리 카페가 밀집한 서울의 브루클린입니다. 뚝섬역과 성수역 일대를 도보로 이동하며 팝업스토어와 서울숲 피크닉을 동시에 즐길 수 있습니다.'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: '교통 꿀팁',
      title: '외국인을 위한 대중교통 완벽 정복: 기후동행카드 vs T-Money',
      summary: '지하철과 시내버스를 무제한으로 탈 수 있는 단기 관광권 기후동행카드 구매 방법과 공항철도, 광역버스 탑승 요령을 완벽 정리해 드립니다.',
      readTime: '4분 소요',
      content: '기후동행카드(Climate Card)는 서울 시내 지하철과 버스를 1일, 2일, 3일, 5일권으로 무제한 이용할 수 있는 관광객 전용 교통패스입니다. 서울역 및 주요 지하철역 고객안전실에서 실물 카드를 구매 후 무인 충전기에서 충전하여 즉시 사용 가능합니다.'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-미식 문화',
      title: '한국 맛집 탐방 & 식사 에티켓: 팁 문화 없는 최고의 미식 여행',
      summary: '한국은 별도의 팁(Tip) 문화가 없으며, 테이블 벨과 무료 반찬 리필 시스템이 잘 갖춰져 있습니다. 광장시장 K-스트리트 푸드부터 한우 오마카세까지 놓치지 마세요.',
      readTime: '3분 소요',
      content: '한국의 식당에서는 물과 기본 반찬이 무료로 제공되며, 식사 후 카운터에서 결제하는 것이 기본입니다. 유명 맛집은 테이블링이나 캐치테이블 앱을 통한 원격 줄서기가 가능합니다.'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: '사계절 스타일링',
      title: '2026 대한민국 사계절 여행 & 날씨별 코디 가이드',
      summary: '봄 벚꽃 궁궐 나들이부터 여름 동해안 서핑, 가을 경주 단풍 로드, 겨울 스키장까지 계절별 최적의 여행지와 기온별 맞춤 옷차림 꿀팁을 전수합니다.',
      readTime: '4분 소요',
      content: '한국은 사계절이 뚜렷하여 계절마다 색다른 매력을 자랑합니다. 봄(3~5월)과 가을(9~11월)은 일교차가 있어 얇은 아우터 레이어드가 필수이며, 여름(6~8월)은 통기성 좋은 린넨과 자외선 차단용 선글라스가 유용합니다. 겨울(12~2월)에는 방한 패딩과 핫팩을 챙겨 따뜻한 온천이나 야경 투어를 즐겨보세요.'
    }
  ];

  const ARTICLES_EN = [
    {
      icon: <Sparkles size={20} style={{ color: '#2563eb' }} />,
      tag: 'Hotspot Trend',
      title: '2026 Seoul Travel Trends: From Seongsu-dong to Hannam-dong',
      summary: 'Explore Seongsu-dong, Seoul’s Brooklyn of pop-up stores and independent fashion boutiques, and the charming aesthetic cafes of Hannam-dong.',
      readTime: '3 min read',
      content: 'Seongsu-dong is Seoul’s premier cultural hub featuring Dior Seongsu, Ader Error flagship store, and artisanal coffee roasteries. Walk comfortably from Ttukseom to Seongsu station and enjoy a picnic at Seoul Forest.'
    },
    {
      icon: <Train size={20} style={{ color: '#10b981' }} />,
      tag: 'Transit Tips',
      title: 'Foreign Traveler Transit Masterclass: Climate Card vs T-Money',
      summary: 'Complete guide on purchasing short-term Climate Cards for unlimited subway & bus rides, plus airport express (AREX) and intercity bus tips.',
      readTime: '4 min read',
      content: 'The Climate Card offers unlimited subway and public bus rides for 1, 2, 3, or 5 days. Purchase physical cards at Seoul Station or subway customer centers and top up instantly at automated kiosks.'
    },
    {
      icon: <Coffee size={20} style={{ color: '#f59e0b' }} />,
      tag: 'K-Food Culture',
      title: 'Korean Food & Dining Etiquette: No-Tip Gourmet Paradise',
      summary: 'Korea has zero tipping culture, with call buttons at tables and free side dish (Banchan) refills. From Gwangjang market street food to Korean BBQ.',
      readTime: '3 min read',
      content: 'Water and side dishes are complimentary in Korean restaurants, and payment is settled at the front counter after dining. Popular gourmet spots allow remote queueing via CatchTable.'
    },
    {
      icon: <MapPin size={20} style={{ color: '#ec4899' }} />,
      tag: 'Four-Season Styling',
      title: '2026 Korea Four-Season Travel & Weather Outfit Guide',
      summary: 'From spring cherry blossom palaces to summer East Coast surfing, autumn foliage in Gyeongju, and winter ski resorts with temperature-matched outfits.',
      readTime: '4 min read',
      content: 'Korea has four distinct seasons. Spring (Mar-May) and autumn (Sep-Nov) require light cardigan layering for day/night temperature drops. Summer (Jun-Aug) calls for breathable linen and UV sunglasses, while winter (Dec-Feb) requires warm padding and heat packs.'
    }
  ];

  const FAQS_KO = [
    {
      q: 'VORA AI 여행 일정은 어떻게 생성되나요?',
      a: 'VORA AI는 최신 Google Gemini 3.0 자연어 AI와 Google Places Platform 공식 위치 데이터베이스를 결합하여, 사용자가 입력한 여행 지역과 취향에 맞는 최적의 동선, 실제 위경도 좌표 기반 구글맵 길찾기, 로컬 미식을 실시간으로 자동 생성합니다.'
    },
    {
      q: '한국 여행 중 현금 환전이 필수인가요?',
      a: '대부분의 상점, 카페, 택시, 대중교통에서 해외 신용카드(Visa, Mastercard 등) 및 애플페이가 널리 통용됩니다. 다만 전통시장 먹거리나 지하철 교통카드 충전을 위해 소액(약 3~5만 원)의 현금을 소지하시는 것을 추천합니다.'
    },
    {
      q: '비 오는 날에는 어떤 코스를 추천하나요?',
      a: '비가 올 때는 국립중앙박물관, 더현대 서울, 코엑스 아쿠아리움 및 별마당 도서관, 롯데월드타워 서울스카이, 동대문디자인플라자(DDP) 등 대형 실내 복합 문화공간 중심의 동선을 추천합니다. VORA 채팅창에 "비 오는 날 코스로 바꿔줘"라고 입력하시면 즉시 변경됩니다.'
    },
    {
      q: '응급 상황 시 외국어 통역 지원을 받을 수 있나요?',
      a: '대한민국 관광통역안내 1330 헬프라인(국번 없이 1330)으로 전화하시면 연중무휴 24시간 한국어, 영어, 일본어, 중국어 무료 통역 및 여행 안내, 긴급 구호 연계 서비스를 받으실 수 있습니다.'
    }
  ];

  const FAQS_EN = [
    {
      q: 'How does VORA AI create my travel itinerary?',
      a: 'VORA AI combines Google Gemini 3.0 natural language AI with the Google Places Platform database to automatically generate optimal daily routes, real-time Google Maps coordinates, transit times, and authentic local gourmet recommendations tailored to your style.'
    },
    {
      q: 'Is cash exchange necessary for traveling in South Korea?',
      a: 'Most shops, cafes, taxis, and public transit widely accept international credit cards (Visa, Mastercard) and Apple Pay. However, carrying a small amount of cash (~30,000 to 50,000 KRW) is recommended for street food markets and transit card reloads.'
    },
    {
      q: 'What courses do you recommend for rainy days?',
      a: 'On rainy days, we recommend large indoor cultural hubs like the National Museum of Korea, The Hyundai Seoul, Starfield Library in COEX, Lotte World Tower Seoul Sky, and DDP. You can simply ask VORA chat: "Change to an indoor rainy day course".'
    },
    {
      q: 'Can I get foreign language interpretation during an emergency?',
      a: 'Yes! Call the 1330 Korea Travel Helpline (dial 1330 without area code) for 24/7 free multilingual interpretation in English, Japanese, and Chinese, general travel assistance, and emergency relief services.'
    }
  ];

  const ARTICLES = lang === 'en' ? ARTICLES_EN : ARTICLES_KO;
  const FAQS = lang === 'en' ? FAQS_EN : FAQS_KO;

  return (
    <section style={{
      padding: '1.5rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto',
      borderTop: '1px solid var(--border-color)'
    }}>
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--accent-primary)',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '0.5rem'
        }}>
          <BookOpen size={15} />
          <span>Travel Editorial & FAQ</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          {t.editorialTitle || '대한민국 여행 완벽 가이드 & FAQ'}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
          {t.editorialSubtitle || '한국을 처음 방문하는 여행자를 위한 검증된 로컬 꿀팁'}
        </p>
      </div>

      {/* 3-Column Articles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {ARTICLES.map((art, idx) => (
          <article
            key={idx}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {art.icon}
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {art.tag}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  {art.readTime}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                {art.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {art.summary}
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              padding: '0.85rem',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              border: '1px solid var(--border-color)'
            }}>
              💡 {art.content}
            </div>
          </article>
        ))}
      </div>

      {/* Interactive FAQ Accordion */}
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
            <span>{lang === 'en' ? 'Frequently Asked Questions (FAQ)' : '자주 묻는 질문 (FAQ)'}</span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--text-main)'
                }}
              >
                <span>Q. {faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openFaq === idx && (
                <div style={{
                  padding: '0 1.25rem 1.25rem 1.25rem',
                  fontSize: '0.86rem',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  backgroundColor: 'var(--bg-primary)'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
