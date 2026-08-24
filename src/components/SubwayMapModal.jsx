import React from 'react';
import ReactDOM from 'react-dom';
import { X, Train, MapPin, ExternalLink } from 'lucide-react';

/**
 * SubwayMapModal.jsx
 * 전국 주요 도시(수도권/서울, 부산, 대구, 대전, 광주) 다국어 지하철 노선도 선택 모달
 */
export default function SubwayMapModal({ isOpen, onClose, lang = 'ko' }) {
  if (!isOpen) return null;

  const SUBWAY_NETWORKS = [
    {
      id: 'seoul',
      icon: '🚇',
      nameKo: '수도권 (서울·인천·경기)',
      nameEn: 'Seoul Metropolitan (Lines 1-9 & KTX)',
      nameJa: '首都圏（ソウル・仁川・京畿）',
      nameZh: '首都圈（首尔·仁川·京畿）',
      descKo: '1~9호선, 신분당선, 공항철도, 수인분당선',
      descEn: 'Lines 1-9, Airport Express (AREX), Shinbundang',
      descJa: '1〜9号線、空港鉄道、新盆唐線',
      descZh: '1~9号线、机场铁道、新盆唐线',
      urlKo: 'http://www.seoulmetro.co.kr/kr/cyberStation.do',
      urlEn: 'http://www.seoulmetro.co.kr/en/cyberStation.do',
      urlJa: 'http://www.seoulmetro.co.kr/jp/cyberStation.do',
      urlZh: 'http://www.seoulmetro.co.kr/ch/cyberStation.do',
      color: '#2563eb'
    },
    {
      id: 'busan',
      icon: '🌊',
      nameKo: '부산·동해선 지하철',
      nameEn: 'Busan & Donghae Line Metro',
      nameJa: '釜山・東海線 地下鉄',
      nameZh: '釜山·东海线 地铁',
      descKo: '1~4호선, 부산김해경전철, 동해선',
      descEn: 'Lines 1-4, Busan-Gimhae Light Rail, Donghae Line',
      descJa: '1〜4号線、釜山-金海軽電鉄、東海線',
      descZh: '1~4号线、釜山金海轻轨、东海线',
      urlKo: 'https://www.humetro.busan.kr',
      urlEn: 'https://www.humetro.busan.kr/eng/index.do',
      urlJa: 'https://www.humetro.busan.kr/jpn/index.do',
      urlZh: 'https://www.humetro.busan.kr/chn/index.do',
      color: '#0284c7'
    },
    {
      id: 'daegu',
      icon: '🌿',
      nameKo: '대구 도시철도',
      nameEn: 'Daegu Metro (Lines 1-3)',
      nameJa: '大邱 都市鉄道（1〜3号線）',
      nameZh: '大邱 城市铁路（1~3号线）',
      descKo: '1~3호선 (모노레일 포함)',
      descEn: 'Lines 1-3 including Sky Monorail',
      descJa: '1〜3号線（モノレール含む）',
      descZh: '1~3号线（包含单轨列车）',
      urlKo: 'https://www.dtro.or.kr',
      urlEn: 'https://www.dtro.or.kr/eng/index.do',
      urlJa: 'https://www.dtro.or.kr/jpn/index.do',
      urlZh: 'https://www.dtro.or.kr/chn/index.do',
      color: '#10b981'
    },
    {
      id: 'daejeon_gwangju',
      icon: '🚆',
      nameKo: '대전 & 광주 도시철도',
      nameEn: 'Daejeon & Gwangju Metro',
      nameJa: '大田＆光州 都市鉄道',
      nameZh: '大田＆光州 城市铁路',
      descKo: '대전 1호선 & 광주 1호선',
      descEn: 'Daejeon Line 1 & Gwangju Line 1',
      descJa: '大田1号線＆光州1号線',
      descZh: '大田1号线＆光州1号线',
      urlKo: 'https://www.djtc.kr',
      urlEn: 'https://www.djtc.kr',
      urlJa: 'https://www.djtc.kr',
      urlZh: 'https://www.djtc.kr',
      color: '#8b5cf6'
    }
  ];

  const getTitle = () => {
    switch (lang) {
      case 'en': return 'Korea Metro Network Maps';
      case 'ja': return '韓国 全国の地下鉄路線図';
      case 'zh':
      case 'zht': return '韩国 全国地铁路线图';
      default: return '전국 지하철 실시간 노선도';
    }
  };

  const getSubtitle = () => {
    switch (lang) {
      case 'en': return 'Select your travel city for live station map & transfers';
      case 'ja': return '旅行する都市を選択して公式路線図を確認';
      case 'zh':
      case 'zht': return '请选择旅行目的地城市查看官方即时地铁图';
      default: return '이동하시는 도시를 선택하시면 공식 노선도로 연결됩니다';
    }
  };

  const handleOpenMap = (network) => {
    let targetUrl = network.urlKo;
    if (lang === 'en' && network.urlEn) targetUrl = network.urlEn;
    else if (lang === 'ja' && network.urlJa) targetUrl = network.urlJa;
    else if ((lang === 'zh' || lang === 'zht') && network.urlZh) targetUrl = network.urlZh;
    
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

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
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Train size={20} />
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

        {/* City Subway List */}
        <div style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          {SUBWAY_NETWORKS.map((net) => {
            const cityName = lang === 'en' ? net.nameEn : lang === 'ja' ? net.nameJa : (lang === 'zh' || lang === 'zht') ? net.nameZh : net.nameKo;
            const cityDesc = lang === 'en' ? net.descEn : lang === 'ja' ? net.descJa : (lang === 'zh' || lang === 'zht') ? net.descZh : net.descKo;

            return (
              <button
                key={net.id}
                onClick={() => handleOpenMap(net)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{net.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {cityName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {cityDesc}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: 'var(--accent-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  <span>노선도 ↗</span>
                </div>
              </button>
            );
          })}
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
