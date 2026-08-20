import React, { useEffect } from 'react';

export default function AdSenseBanner({
  slot = '1234567890',
  format = 'auto',
  responsive = 'true',
  style = {}
}) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore adsbygoogle duplicate push errors
    }
  }, []);

  return (
    <div style={{
      margin: '1.5rem auto',
      textAlign: 'center',
      overflow: 'hidden',
      maxWidth: '100%',
      minHeight: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      ...style
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-9181080606912259"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
