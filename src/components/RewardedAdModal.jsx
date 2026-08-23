import React, { useState, useEffect } from 'react';
import { X, Play, Award, Sparkles, CheckCircle2, Volume2, VolumeX, ExternalLink, ShieldCheck } from 'lucide-react';
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
      brand: 'Klook Official Partner',
      title: '디스커버 서울패스 (Discover Seoul Pass) 24h & 48h 특별할인',
      desc: '서울 주요 50개 대표 명소 무료 입장 + 대중교통 티머니(T-Money) 기능 기본 탑재!',
      discount: '최대 25% OFF',
      tag: 'K-Travel 스폰서 파트너',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1400&q=85'
    }
  ];

  const SPONSOR_ADS_EN = [
    {
      brand: 'Klook Official Partner',
      title: 'Discover Seoul Pass 24h & 48h Special Discount',
      desc: 'Free admission to 50+ top Seoul attractions + Built-in Transit T-Money card included!',
      discount: 'Up to 25% OFF',
      tag: 'K-Travel Sponsor Partner',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1400&q=85'
    }
  ];

  const SPONSOR_ADS_JA = [
    {
      brand: 'Klook 公式パートナー',
      title: 'ディスカバーソウルパス 24h/48h 特別割引キャンペーン',
      desc: 'ソウル主要50箇所の人気スポット無料入場＋交通T-Money機能付き！',
      discount: '最大 25% OFF',
      tag: 'K-Travel スポンサーパートナー',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1400&q=85'
    }
  ];

  const SPONSOR_ADS_ZH = [
    {
      brand: 'Klook 官方合作伙伴',
      title: '首尔探索卡 (Discover Seoul Pass) 限时特惠',
      desc: '免费畅游首尔50+热门景点，内置T-Money交通卡畅行无阻！',
      discount: '最高 75折特惠',
      tag: 'K-Travel 官方赞助商',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1400&q=85'
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
    if (onRewardGranted) {
      onRewardGranted();
    }
    onClose();
  };

  const progressPercent = ((15 - timeLeft) / 15) * 100;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Cinematic Modal Container (Responsive 760px Widescreen) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          width: '100%',
          maxWidth: '760px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 50px rgba(59, 130, 246, 0.15)',
          position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              padding: '0.22rem 0.55rem',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              {lang === 'en' ? 'Sponsored Special' : lang === 'ja' ? 'スポンサー特別広告' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '贊助商特惠' : '赞助商特惠') : '스폰서 특가 보상'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {isCompleted ? (
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={16} />
                  {lang === 'en' ? 'Viewing Complete!' : lang === 'ja' ? '視聴完了！' : (lang === 'zh' || lang === 'zht') ? '观看完成！' : '시청 완료!'}
                </span>
              ) : (
                <span>
                  {lang === 'en' ? `⏳ Reward unlock in ${timeLeft}s` : lang === 'ja' ? `⏳ ${timeLeft}秒後にリワード付与` : (lang === 'zh' || lang === 'zht') ? `⏳ ${timeLeft}秒后解锁奖励` : `⏳ ${timeLeft}초 후 보상 지급`}
                </span>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {isCompleted ? (
              <button
                onClick={onClose}
                aria-label={getCloseButtonLabel(lang)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
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
                  ? '🎁 Claim +3 Free Questions Now' 
                  : lang === 'ja' 
                  ? '🎁 質問＋3回を今すぐ獲得' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? (lang === 'zht' ? '🎁 立即領取 +3次免費提問' : '🎁 立即领取 +3次免费提问') 
                  : '🎁 질문 +3회 즉시 충전받기'}
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
                  ? `+3 Free Questions will be credited in ${timeLeft}s` 
                  : lang === 'ja' 
                  ? `${timeLeft}秒後に＋3回の無料質問が付与されます` 
                  : (lang === 'zh' || lang === 'zht') 
                  ? `${timeLeft}秒后将自动充值+3次提问额度` 
                  : `${timeLeft}초 후 +3회 무료 질문이 충전됩니다`}
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
                ? 'VORA AI ＆ 公式グローバル提携パートナー' 
                : (lang === 'zh' || lang === 'zht') 
                ? 'VORA AI 与官方全球合作伙伴' 
                : 'VORA AI & 공식 글로벌 제휴 파트너'}
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
                  ? 'スポンサー特典を見る' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '查看赞助商优惠' 
                  : '스폰서 특가 보러가기'}
              </span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

