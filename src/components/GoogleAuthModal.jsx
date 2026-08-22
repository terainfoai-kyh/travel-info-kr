import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Shield, Bookmark, MapPin, Zap, User } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser = null,
  lang = 'ko'
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleSimulatedGoogleLogin = (email = 'traveler@gmail.com', name = 'K-Traveler') => {
    setIsLoading(true);
    setTimeout(() => {
      const finalName = customName.trim() || name;
      const userProfile = {
        email: email,
        name: finalName,
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isGoogleLoggedIn: true,
        loginTime: new Date().toISOString()
      };

      try {
        localStorage.setItem('vora_user_profile', JSON.stringify(userProfile));
      } catch (e) {}

      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
      onClose();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '460px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl), 0 0 40px rgba(37, 99, 235, 0.15)',
        position: 'relative'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
              {lang === 'en' ? 'Google Quick Sign-in' : lang === 'ja' ? 'Google 簡単ログイン' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? 'Google 快速登入' : 'Google 快捷登录') : 'Google 간편 로그인'}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Main Title & VIP Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#d97706',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '0.8rem'
            }}>
              <Sparkles size={14} />
              <span>
                {lang === 'en' ? 'Member VIP Benefits Automatically Applied' : lang === 'ja' ? '会員専用VIP特典を自動適用' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '會員專享VIP權益自動生效' : '会员专属VIP权益自动生效') : '회원 전용 VIP 혜택 자동 적용'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.4rem', color: 'var(--text-main)' }}>
              {lang === 'en' ? 'Sign In & Get 15 Daily Prompts' : lang === 'ja' ? 'ログインで毎日15回の質問が可能' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '登入即享每日15次AI提問額度' : '登录即享每日15次AI提问额度') : '로그인하고 매일 15회 질문 받기'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {lang === 'en'
                ? 'Enjoy 3x more AI prompts than guest mode (5 prompts) and securely cloud-save your custom trips.'
                : lang === 'ja'
                ? 'ゲスト（5回）の3倍質問でき、お気に入りの旅程をクラウドに安全に保存できます。'
                : (lang === 'zh' || lang === 'zht')
                ? (lang === 'zht' ? '享有遊客模式（5次）3倍的提問額度，並永久雲端同步專屬旅行路線。' : '享有游客模式（5次）3倍的提问额度，并永久云端同步专属旅行路线。')
                : '비회원(5회) 대비 3배 많은 질문과 나만의 일정이 안전하게 보관됩니다.'}
            </p>
          </div>

          {/* Benefit Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--accent-primary)',
                padding: '0.5rem',
                borderRadius: '10px'
              }}>
                <Zap size={18} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.9rem', fontWeight: 800 }}>
                  {lang === 'en' ? '15 Free AI Prompts Daily' : lang === 'ja' ? '毎日15回のAI質問が無料' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '每日免費提供15次AI諮詢' : '每日免费提供15次AI咨询') : '매일 15회 AI 질문 무료 제공'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {lang === 'en'
                    ? 'Automatically recharges to 15 prompts every midnight for effortless multi-day planning.'
                    : lang === 'ja'
                    ? '毎晩深夜0時に15回へ自動リセットされ、ゆったりと旅行プランを作成できます。'
                    : (lang === 'zh' || lang === 'zht')
                    ? (lang === 'zht' ? '每日午夜0點自動重置為15次，輕鬆定制多日完整行程。' : '每日午夜0点自动重置为15次，轻松定制多日完整行程。')
                    : '매일 자정마다 15회가 자동 충전되어 여유롭게 5일 코스를 설계합니다.'}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                padding: '0.5rem',
                borderRadius: '10px'
              }}>
                <Bookmark size={18} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.9rem', fontWeight: 800 }}>
                  {lang === 'en' ? 'Cloud Save for Custom Itineraries' : lang === 'ja' ? 'カスタム旅程のクラウド永久保存' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '定制行程雲端永久儲存' : '定制行程云端永久保存') : '내 맞춤 여행 일정 클라우드 영구 저장'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {lang === 'en'
                    ? 'Your generated courses and wishlist spots are safely synchronized with your account.'
                    : lang === 'ja'
                    ? '作成したおすすめルートやウィッシュリストがアカウントに自動同期されます。'
                    : (lang === 'zh' || lang === 'zht')
                    ? (lang === 'zht' ? '生成的推薦路線與心願單景點將自動同步至您的帳號。' : '生成的推荐路线与心愿单景点将自动同步至您的账号。')
                    : '생성한 추천 코스와 위시리스트가 계정에 자동 동기화됩니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Custom Nickname (Optional) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Traveler Nickname (Optional, e.g. Alex)' : lang === 'ja' ? 'ニックネーム（任意、例：Yuki）' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '旅客暱稱（選填，例：小明）' : '旅客昵称（选填，例：小明）') : '여행자 닉네임 (선택사항, 예: 민지)'}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Google Sign-in Action Button */}
          <button
            onClick={() => handleSimulatedGoogleLogin('traveler@gmail.com', lang === 'en' ? 'Global Traveler' : lang === 'ja' ? '日本旅行者' : '旅行者')}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.95rem',
              borderRadius: '14px',
              border: '1px solid #dadce0',
              backgroundColor: '#ffffff',
              color: '#3c4043',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>
              {isLoading 
                ? (lang === 'en' ? 'Connecting Google Account...' : lang === 'ja' ? 'Googleアカウント連携中...' : (lang === 'zh' || lang === 'zht') ? '正在连接Google账号...' : '구글 계정 연동 중...') 
                : (lang === 'en' ? 'Start in 3s with Google' : lang === 'ja' ? 'Googleアカウントで3秒スタート' : (lang === 'zh' || lang === 'zht') ? (lang === 'zht' ? '使用Google帳號3秒開啟' : '使用Google账号3秒开启') : 'Google 계정으로 3초 만에 시작')}
            </span>
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            🔒 {lang === 'en' ? 'Securely connected via your Google account without passwords.' : lang === 'ja' ? 'パスワード不要で安全にGoogleアカウントと連携されます。' : (lang === 'zh' || lang === 'zht') ? '无需单独密码，通过Google账号安全便捷连接。' : '별도의 비밀번호 없이 안전하게 구글 계정으로 연동됩니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
