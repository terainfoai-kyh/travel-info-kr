import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, MapPin, Coffee, Train, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function AdSenseArticlesSection({ lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [openFaq, setOpenFaq] = useState(null);

  const ARTICLES = [
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
    }
  ];

  const FAQS = [
    {
      q: 'VORA AI 여행 일정은 어떻게 생성되나요?',
      a: 'VORA AI는 Google Gemini의 최신 자연어 생성 모델과 한국관광공사 TourAPI 4.0 정품 데이터베이스를 결합하여, 사용자가 입력한 여행 지역과 취향에 맞는 최적의 동선, 실제 위경도 좌표 기반 구글맵 길찾기, 로컬 미식을 실시간으로 자동 생성합니다.'
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
      a: '한국관광공사에서 운영하는 1330 헬프라인(국번 없이 1330)으로 전화하시면 연중무휴 24시간 한국어, 영어, 일본어, 중국어 무료 통역 및 여행 안내, 긴급 구호 연계 서비스를 받으실 수 있습니다.'
    }
  ];

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
            <span>자주 묻는 질문 (FAQ)</span>
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
