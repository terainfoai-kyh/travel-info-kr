import React, { useState, useEffect } from 'react';
import { X, Play, Award, Sparkles, CheckCircle2, Volume2, VolumeX, ExternalLink } from 'lucide-react';
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
      title: '디스커버 서울패스 24h & 48h 특별할인',
      desc: '서울 주요 50개 명소 무료 입장 + 대중교통 티머니 기능 탑재!',
      discount: '최대 25% OFF',
      tag: 'K-Travel 스폰서',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const SPONSOR_ADS_EN = [
    {
      brand: 'Klook Official Partner',
      title: 'Discover Seoul Pass 24h & 48h Special Discount',
      desc: 'Free admission to 50+ top Seoul spots + Built-in Transit T-Money card!',
      discount: 'Up to 25% OFF',
      tag: 'K-Travel Sponsor',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const SPONSOR_ADS_JA = [
    {
      brand: 'Klook 公式パートナー',
      title: 'ディスカバーソウルパス 24h/48h 特別割引',
      desc: 'ソウル主要50箇所の人気スポット無料入場＋交通T-Money機能付き！',
      discount: '最大 25% OFF',
      tag: 'K-Travel スポンサー',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  const SPONSOR_ADS_ZH = [
    {
      brand: 'Klook 官方合作伙伴',
      title: '首尔探索卡 (Discover Seoul Pass) 限时特惠',
      desc: '免费进入首尔50+热门景点，内置T-Money交通卡功能！',
      discount: '最高 75折特惠',
      tag: 'K-Travel 赞助商',
      link: 'https://www.klook.com',
      image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=85'
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#111827',
        color: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        width: '100%',
        maxWidth: '520px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2)',
        position: 'relative'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px'
            }}>
              {lang === 'en' ? 'Sponsored Ad' : lang === 'ja' ? 'スポンサー広告' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '贊助商廣告' : '赞助商广告') : '스폰서 보상 광고'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>
              {isCompleted 
                ? (lang === 'en' ? '🎉 Completed!' : lang === 'ja' ? '🎉 視聴完了！' : (lang === 'zh' || lang === 'zht') ? '🎉 观看完成！' : '🎉 시청 완료!') 
                : (lang === 'en' ? `⏳ Reward in ${timeLeft}s` : lang === 'ja' ? `⏳ ${timeLeft}秒後にリワード付与` : (lang === 'zh' || lang === 'zht') ? `⏳ ${timeLeft}秒后领取奖励` : `⏳ ${timeLeft}초 후 보상 지급`)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {isCompleted ? (
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            ) : (
              <span style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                {timeLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: isCompleted ? '#10b981' : '#3b82f6',
            transition: 'width 1s linear'
          }} />
        </div>

        {/* Ad Media Display */}
        <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
          <img
            src={currentAd.image}
            alt={currentAd.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 0%, transparent 60%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#60a5fa',
                letterSpacing: '0.02em'
              }}>
                {currentAd.brand}
              </span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontWeight: 900,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px'
              }}>
                {currentAd.discount}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
              {currentAd.title}
            </h3>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#d1d5db', lineHeight: 1.4 }}>
              {currentAd.desc}
            </p>
          </div>
        </div>

        {/* Bottom Reward Call-to-Action */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {isCompleted ? (
            <button
              onClick={handleClaimReward}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
                animation: 'pulse 1.5s infinite'
              }}
            >
              <Sparkles size={20} />
              <span>
                {lang === 'en' 
                  ? '🎁 Claim +3 Free Prompts Now' 
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
              padding: '0.85rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#9ca3af',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Award size={18} style={{ color: '#f59e0b' }} />
              <span>
                {lang === 'en' 
                  ? `+3 Free Prompts will be added in ${timeLeft}s` 
                  : lang === 'ja' 
                  ? `${timeLeft}秒後に＋3回の無料質問が付与されます` 
                  : (lang === 'zh' || lang === 'zht') 
                  ? `${timeLeft}秒后将自动充值+3次提问额度` 
                  : `${timeLeft}초 후 +3회 무료 질문이 충전됩니다`}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280' }}>
            <span>
              {lang === 'en' 
                ? 'VORA AI & Official Partner Sponsorship' 
                : lang === 'ja' 
                ? 'VORA AI ＆ 公式提携パートナー スポンサーシップ' 
                : (lang === 'zh' || lang === 'zht') 
                ? 'VORA AI 与官方合作伙伴赞助' 
                : 'VORA AI & 공식 제휴 파트너 스폰서십'}
            </span>
            <a
              href={currentAd.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#93c5fd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <span>
                {lang === 'en' 
                  ? 'View Sponsor Deal' 
                  : lang === 'ja' 
                  ? 'スポンサー特典を見る' 
                  : (lang === 'zh' || lang === 'zht') 
                  ? '查看赞助商优惠' 
                  : '스폰서 혜택 보기'}
              </span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
