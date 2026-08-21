import React, { useEffect, useRef, useState } from 'react';

export default function AdSenseBanner({
  slot = '1234567890',
  format = 'auto',
  responsive = 'true',
  style = {}
}) {
  const adRef = useRef(null);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore duplicate push errors
    }

    // Observer to detect when Google AdSense actually fills an ad
    const currentAd = adRef.current;
    if (!currentAd) return;

    const checkAdStatus = () => {
      if (
        currentAd.getAttribute('data-ad-status') === 'filled' ||
        (currentAd.innerHTML && currentAd.innerHTML.trim().length > 0 && currentAd.getAttribute('data-ad-status') !== 'unfilled')
      ) {
        setIsFilled(true);
      }
    };

    checkAdStatus();

    const observer = new MutationObserver(() => {
      checkAdStatus();
    });

    observer.observe(currentAd, { attributes: true, childList: true, subtree: true });

    return () => observer.disconnect();
  }, [slot]);

  return (
    <div
      className="adsense-banner-wrapper"
      style={{
        margin: isFilled ? '1rem auto' : '0',
        textAlign: 'center',
        overflow: 'hidden',
        maxWidth: '100%',
        display: isFilled ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        ...style
      }}
    >
      <ins
        ref={adRef}
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
