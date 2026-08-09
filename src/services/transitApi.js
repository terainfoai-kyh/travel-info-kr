// Real-time Public Transit Route API Service (ODsay & Intelligent Fallback)

export async function fetchTransitRoute(lat1, lng1, lat2, lng2, apiKey = '') {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;

  const latA = parseFloat(lat1);
  const lngA = parseFloat(lng1);
  const latB = parseFloat(lat2);
  const lngB = parseFloat(lng2);

  if (isNaN(latA) || isNaN(lngA) || isNaN(latB) || isNaN(lngB)) return null;

  // Calculate straight line distance in km
  const R = 6371;
  const dLat = (latB - latA) * Math.PI / 180;
  const dLng = (lngB - lngA) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const dist = Math.max(0.5, R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

  // If ODsay API Key is present, attempt live API call
  if (apiKey) {
    try {
      const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${lngA}&SY=${latA}&EX=${lngB}&EY=${latB}&apiKey=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.result?.path && data.result.path.length > 0) {
          const bestPath = data.result.path[0];
          const info = bestPath.info;
          const totalTime = info.totalTime;
          const payment = info.payment;
          const subPath = bestPath.subPath || [];

          // Format route steps
          const steps = subPath.map(sp => {
            if (sp.trafficType === 1) return `🚇 ${sp.lane?.[0]?.name || '지하철'}`;
            if (sp.trafficType === 2) return `🚌 ${sp.lane?.[0]?.busNo || '시내버스'}`;
            if (sp.trafficType === 3) return `🚶 도보 ${sp.sectionTime}분`;
            return '';
          }).filter(Boolean);

          return {
            totalMin: totalTime,
            fareKrw: payment,
            transitNote: steps.join(' ➔ ') || `대중교통 약 ${totalTime}분`,
            isLive: true
          };
        }
      }
    } catch (e) {
      console.warn('ODsay Transit API fallback:', e);
    }
  }

  // Smart Fallback Estimation based on distance
  if (dist < 1.2) {
    const walkMin = Math.max(3, Math.round(dist * 13 + 2));
    return {
      totalMin: walkMin,
      transitNote: `🚶 도보 약 ${walkMin}분 (${dist.toFixed(1)}km)`,
      isWalk: true
    };
  } else if (dist < 6.0) {
    const min = Math.max(10, Math.round(dist * 3.0 + 8));
    return {
      totalMin: min,
      transitNote: `🚇 지하철 / 🚌 시내버스 (약 ${min}분)`,
      isSubway: true
    };
  } else {
    const min = Math.max(18, Math.round(dist * 2.5 + 12));
    return {
      totalMin: min,
      transitNote: `🚇 지하철 환승 / 🚌 광역 대중교통 (약 ${min}분)`,
      isTransfer: true
    };
  }
}
