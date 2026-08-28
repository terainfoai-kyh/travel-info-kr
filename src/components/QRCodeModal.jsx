import React, { useState, useMemo } from 'react';
import { X, Smartphone, Copy, Check, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { generateShareableTripUrl } from '../services/tripSyncService';
import { generateQRCodeSVG } from '../services/qrCodeGenerator';

export default function QRCodeModal({
  isOpen,
  onClose,
  trip,
  lang = 'ko'
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!trip) return '';
    return generateShareableTripUrl(trip);
  }, [trip]);

  const qrSvg = useMemo(() => {
    if (!shareUrl) return '';
    return generateQRCodeSVG(shareUrl, 210);
  }, [shareUrl]);

  if (!isOpen || !trip) return null;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.85rem',
          color: '#ffffff',
          boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
        }}>
          <Smartphone size={26} />
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '0.35rem'
        }}>
          {lang === 'en' ? '📱 Open on Mobile Instantly' : '📱 스마트폰으로 1초 만에 열기'}
        </h3>

        <p style={{
          fontSize: '0.82rem',
          color: '#64748b',
          marginBottom: '1.2rem',
          lineHeight: 1.45
        }}>
          {lang === 'en' 
            ? 'Scan this QR code with your smartphone camera to immediately load and carry this itinerary on the go!'
            : '스마트폰 기본 카메라로 아래 QR 코드를 비추면, PC에서 짠 일정이 폰 화면에 0.1초 만에 짠! 하고 열립니다.'}
        </p>

        {/* Local Crisp SVG QR Code Container */}
        <div style={{
          background: '#f8fafc',
          padding: '0.85rem',
          borderRadius: '18px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          marginBottom: '1.2rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
          minWidth: '220px',
          minHeight: '220px'
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: qrSvg }} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        </div>

        {/* Trip Title Badge */}
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#2563eb',
          backgroundColor: '#eff6ff',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          ✨ {trip.tripTitle || '내 여행 일정'}
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: copied ? '#10b981' : '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? (lang === 'en' ? 'Link Copied!' : '링크 복사 완료!') : (lang === 'en' ? 'Copy Direct Link' : '공유 링크 복사')}</span>
        </button>
      </div>
    </div>
  );
}
