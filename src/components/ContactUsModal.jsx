import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { getCloseButtonLabel } from '../i18n/translations';

export default function ContactUsModal({ isOpen, onClose, lang = 'ko' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

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
        maxWidth: '560px',
        width: '100%',
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
            <Mail size={22} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
              {lang === 'en' ? 'Contact Us & Partnership' : lang === 'ja' ? 'お問い合わせ・提携' : (lang === 'zh' || lang === 'zht') ? '商务合作与咨询' : '제휴 및 문의 (Contact Us)'}
            </h2>
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

        {/* Form Body */}
        <div style={{ padding: '1.5rem' }}>
          {isSent ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CheckCircle2 size={48} style={{ color: '#10b981' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                {lang === 'en' ? 'Message Sent Successfully!' : lang === 'ja' ? 'お問い合わせを受け付けました！' : (lang === 'zh' || lang === 'zht') ? '咨询信息已成功提交！' : '문의가 정상 접수되었습니다!'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {lang === 'en' 
                  ? 'We will review your inquiry and get back to you via email shortly. Thank you.' 
                  : lang === 'ja'
                  ? 'ご入力いただいたメールアドレス宛に折り返しご連絡いたします。ありがとうございます。'
                  : (lang === 'zh' || lang === 'zht')
                  ? '我们将尽快通过您留下的电子邮箱进行答复，感谢您的关注与支持。'
                  : '남겨주신 이메일로 빠른 시일 내에 답변드리겠습니다. 감사합니다.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {lang === 'en' ? 'Name / Organization' : lang === 'ja' ? 'お名前 / 会社名' : (lang === 'zh' || lang === 'zht') ? '姓名 / 机构名称' : '성함 / 기업명'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. John Doe or Travel Partner' : lang === 'ja' ? '例：山田 太郎 または 提携パートナー' : (lang === 'zh' || lang === 'zht') ? '例如：张三 或 旅游合作机构' : '예: 홍길동 또는 한국관광 파트너스'}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {lang === 'en' ? 'Email Address (for reply) *' : lang === 'ja' ? '返信用メールアドレス *' : (lang === 'zh' || lang === 'zht') ? '回复接收邮箱 *' : '이메일 주소 (답변 수신용) *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {lang === 'en' ? 'Inquiry / Partnership Proposal *' : lang === 'ja' ? 'お問い合わせ・提携提案内容 *' : (lang === 'zh' || lang === 'zht') ? '咨询与合作提案内容 *' : '문의 및 제휴 제안 내용 *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang === 'en' 
                    ? 'Please describe your inquiry, spot listing, partnership proposal, or feature feedback.' 
                    : lang === 'ja'
                    ? 'スポット登録、広告・提携、機能のご要望などを自由にご記入ください。'
                    : (lang === 'zh' || lang === 'zht')
                    ? '请填写您的景点入驻、商务推广合作或产品功能建议。'
                    : '관광지 등록, 광고/제휴, 기능 건의사항을 자유롭게 작성해 주세요.'}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                backgroundColor: 'var(--bg-primary)',
                padding: '0.6rem',
                borderRadius: '8px',
                lineHeight: 1.4
              }}>
                📧 {lang === 'en' ? 'Official Support Email:' : lang === 'ja' ? '公式サポートメール:' : (lang === 'zh' || lang === 'zht') ? '官方支持邮箱:' : '공식 지원 이메일:'} <strong>terainfoai@gmail.com</strong>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                <Send size={16} />
                <span>{lang === 'en' ? 'Send Message' : lang === 'ja' ? 'メッセージを送信' : (lang === 'zh' || lang === 'zht') ? '发送咨询' : '문의 및 제안 보내기'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
