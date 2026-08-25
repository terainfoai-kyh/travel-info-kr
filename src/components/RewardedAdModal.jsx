import React, { useState, useEffect } from 'react';
import { X, Award, Sparkles, Volume2, VolumeX, ExternalLink, ShieldCheck } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function RewardedAdModal({
  isOpen,
  onClose,
  onRewardGranted,
  lang = 'ko'
}) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const SPONSOR_ADS_KO = [
    {
      brand: 'VORA AI Travel Korea',
      title: '나만의 맞춤 여행 코스 3초 완성 ✨',
      desc: '한국관광공사 공식 데이터 100% 연동 + 구글 지도 기반 최적 동선 설계로 나만의 완벽한 여행을 경험해 보세요.',
      discount: '100% FREE',
      tag: 'VORA 공식 프리미엄 기능',
      link: 'https://travelkorea-dev.pages.dev',
      image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'
    }
  ];

  const SPONSOR_ADS_EN = [
    {
      brand: 'VORA AI Travel Korea',
      title: 'Craft Your Perfect Korea Itinerary in 3 Seconds ✨',
      desc: 'Powered by Official Korea Tourism TourAPI & Google Maps with zero-waste route optimization!',
      discount: '100% FREE',
      tag: 'VORA Official Premium',
      link: 'https://travelkorea-dev.pages.dev',
      image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'
    }
  ];

  const SPONSOR_ADS_JA = [
    {
      brand: 'VORA AI Travel Korea',
      title: 'あなただけの韓国旅行プランを3秒で自動作成 ✨',
      desc: '韓国観光公社公式データ＆Googleマップ連動で、ノーストレスな韓国旅行を体験！',
      discount: '完全無料',
      tag: 'VORA 公式プレミアム',
      link: 'https://travelkorea-dev.pages.dev',
      image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'
    }
  ];

  const SPONSOR_ADS_ZH = [
    {
      brand: 'VORA AI Travel Korea',
      title: '3秒为您定制专属韩国精选旅行路线 ✨',
      desc: '韩国旅游发展局官方数据100%接入，谷歌地图智能路线规划，畅享无忧韩国之旅！',
      discount: '完全免费',
      tag: 'VORA 官方尊享功能',
      link: 'https://travelkorea-dev.pages.dev',
      image: 'https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg'
    }
  ];

  const currentAd = lang === 'en' 
    ? SPONSOR_ADS_EN[0] 
    : lang === 'ja' 
    ? SPONSOR_ADS_JA[0] 
    : (lang === 'zh' || lang === 'zht') 
    ? SPONSOR_ADS_ZH[0] 
    : SPONSOR_ADS_KO[0];

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      setIsCompleted(false);
      return;
    }

    setTimeLeft(15);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    if (onRewardGranted) onRewardGranted();
    if (onClose) onClose();
  };

  const progressPercent = ((15 - timeLeft) / 15) * 100;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#0f172a',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: '#0b1120',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              letterSpacing: '0.05em'
            }}>
              AD SPONSOR
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
              {currentAd.tag}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                padding: '0.4rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {isCompleted ? (
              <button
                onClick={onClose}
                aria-label={getCloseButtonLabel(lang)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={17} />
              </button>
            ) : (
              <span style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {timeLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: isCompleted 
              ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
              : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
            transition: 'width 1s linear',
            boxShadow: isCompleted ? '0 0 10px #10b981' : '0 0 10px #3b82f6'
          }} />
        </div>

        {/* Cinematic 16:9 Widescreen Ad Media Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          minHeight: '240px',
          maxHeight: '340px',
          overflow: 'hidden',
          backgroundColor: '#020617'
        }}>
          <img
            src={currentAd.image}
            alt={currentAd.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.88)'
            }}
          />

          {/* Top-left Brand Badge Overlay */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 2
          }}>
            <span style={{
              background: 'rgba(15, 23, 42, 0.82)',
              backdropFilter: 'blur(8px)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <ShieldCheck size={14} />
              {currentAd.brand}
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}>
              {currentAd.discount}
            </span>
          </div>

          {/* Bottom Gradient and Ad Information Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.6) 45%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1.5rem',
            zIndex: 2
          }}>
            <h3 style={{
              margin: '0 0 0.4rem 0',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.35,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {currentAd.title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              color: '#cbd5e1',
              lineHeight: 1.45,
              maxWidth: '92%'
            }}>
              {currentAd.desc}
            </p>
          </div>
        </div>

        {/* Bottom Reward Call-to-Action Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: '#0b1120',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {isCompleted ? (
            <button
              onClick={handleClaimReward}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.6)',
                animation: 'pulse 1.6s infinite'
              }}
            >
              <Sparkles size={22} />
              <span>
                {lang === 'en' 
                  ? '✨ Finalize & Save Itinerary to My Trip' 
                  : lang === 'ja' 
                  ? '✨ 旅行プランを確定して保存' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '✨ 确定并保存行程到我的旅行' 
                  : '✨ 일정 확정 & 내 여행에 저장'}
              </span>
            </button>
          ) : (
            <div style={{
              width: '100%',
              padding: '0.95rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Award size={20} style={{ color: '#f59e0b' }} />
              <span>
                {lang === 'en' 
                  ? `Itinerary will be unlocked in ${timeLeft}s` 
                  : lang === 'ja' 
                  ? `あと ${timeLeft}秒で保存できます` 
                  : (lang === 'zh' || lang === 'zht') 
                  ? `还有 ${timeLeft} 秒即可解锁保存` 
                  : `약 ${timeLeft}초 후 내 여행에 저장 확정됩니다`}
              </span>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            <span>
              {lang === 'en' 
                ? 'VORA AI & Official Global Partner Sponsorship' 
                : lang === 'ja' 
                ? 'VORA AI ＆ 公式グローバルパートナー' 
                : (lang === 'zh' || lang === 'zht') 
                ? 'VORA AI 官方全球赞助伙伴' 
                : 'VORA AI & 공식 글로벌 파트너십'}
            </span>
            <a
              href={currentAd.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#60a5fa',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: 600
              }}
            >
              <span>
                {lang === 'en' 
                  ? 'View Sponsor Deal' 
                  : lang === 'ja' 
                  ? '特典を見る' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '查看优惠' 
                  : '스폰서 혜택 보기'}
              </span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
