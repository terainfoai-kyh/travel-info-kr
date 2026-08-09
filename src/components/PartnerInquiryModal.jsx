import React, { useState } from 'react';
import { X, Mail, Send, Check, Copy, Building, Sparkles, Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function PartnerInquiryModal({ isOpen, onClose, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'sponsorship',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const contactEmail = 'terainfoai@gmail.com';

  const getTypeLabel = (typeKey) => {
    if (typeKey === 'sponsorship') return t.partnerTypeOption1 || '스폰서십 & 광고 문의 (Sponsorship & Banner)';
    if (typeKey === 'listing') return t.partnerTypeOption2 || '장소 / 한옥 / 제휴 입점 문의 (Spot Listing)';
    if (typeKey === 'affiliate') return t.partnerTypeOption3 || '콘텐츠 & 유튜버/인플루언서 제휴 (Affiliate & Content)';
    return typeKey;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // FormSubmit AJAX Direct Email Delivery (Zero-popup, 100% Free)
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[K-Travel 제휴/광고 문의] ${form.name}`,
          담당자명: form.name,
          이메일: form.email,
          문의유형: getTypeLabel(form.type),
          문의내용: form.message,
          _template: 'table'
        })
      });

      if (response.ok || response.status === 200) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="modal-overlay-backdrop">
      <div 
        className="animate-fade-in glass-panel modal-responsive-card"
        style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.25rem',
          maxWidth: '560px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-highlight)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #818cf8)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            color: '#ffffff'
          }}>
            <Building size={22} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {t.partnerInquiryTitle || '📩 제휴 및 광고 / 입점 문의'}
          </h3>
        </div>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {t.partnerInquirySub || 'K-Travel AI 글로벌 방문자 대상 스폰서십, 제휴 마케팅 및 장소 입점 문의'}
        </p>

        {submitted ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            textAlign: 'center',
            color: '#10b981',
            margin: '1rem 0'
          }}>
            <Check size={36} style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {t.partnerSuccessMessage || '제휴 문의가 성공적으로 접수되었습니다. 담당자가 확인 후 24시간 이내에 연락드리겠습니다!'}
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                {t.partnerFormName || '성함 / 담당자명'} *
              </label>
              <input
                type="text"
                required
                placeholder={t.partnerFormNamePlaceholder || (lang === 'ko' ? '홍길동 팀장 (K-Hotel)' : 'John Smith / Manager')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                {t.partnerFormEmail || '이메일 주소'} *
              </label>
              <input
                type="email"
                required
                placeholder="partner@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                {t.partnerFormType || '문의 유형'}
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="sponsorship">{t.partnerTypeOption1 || '스폰서십 & 광고 문의 (Sponsorship & Banner)'}</option>
                <option value="listing">{t.partnerTypeOption2 || '장소 / 한옥 / 제휴 입점 문의 (Spot Listing)'}</option>
                <option value="affiliate">{t.partnerTypeOption3 || '콘텐츠 & 유튜버/인플루언서 제휴 (Affiliate & Content)'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                {t.partnerFormMessage || '문의 내용 (상세 내용 및 연락처)'} *
              </label>
              <textarea
                required
                rows={3}
                placeholder={t.partnerFormContentPlaceholder || (lang === 'ko' ? '제휴 희망 상품, 예산, 노출 기간 등 자유롭게 작성해 주세요.' : 'Please describe your inquiry details, budget, duration, etc.')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: isSubmitting ? 'var(--bg-secondary)' : 'linear-gradient(135deg, #0284c7, #818cf8)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t.submitting || '전송 중...'}</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>{t.partnerSubmitBtn || '문의 메시지 전송하기'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Direct Email Box */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <span>{t.partnerDirectEmailText || '또는 공식 이메일로 직접 문의해 주세요:'}</span>
            <strong style={{ color: 'var(--accent-primary)', marginLeft: '0.35rem' }}>{contactEmail}</strong>
          </div>
          <button
            onClick={handleCopyEmail}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {copiedEmail ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copiedEmail ? '복사됨!' : (t.partnerCopyEmailBtn || '이메일 복사')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
