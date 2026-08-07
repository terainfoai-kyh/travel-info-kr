import { PUBLIC_API_CONFIG, REGION_META } from './apiConfig';

// 기상청 중기예보 (Mid-term Forecast: getMidLandFcst, getMidTa, getMidFcst)
export async function fetchMidTermWeather(regionName = '서울', baseTm = '') {
  const meta = REGION_META[regionName] || REGION_META['서울'];
  
  // Format baseTm (e.g. 202608050600)
  if (!baseTm) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    baseTm = `${year}${month}${day}0600`;
  }

  const urlLand = `${PUBLIC_API_CONFIG.WEATHER_MID_BASE}/getMidLandFcst?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${meta.regIdLand}&tmFc=${baseTm}`;
  const urlTa = `${PUBLIC_API_CONFIG.WEATHER_MID_BASE}/getMidTa?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&regId=${meta.regIdTa}&tmFc=${baseTm}`;

  try {
    const [resLand, resTa] = await Promise.all([
      fetch(urlLand).catch(() => null),
      fetch(urlTa).catch(() => null)
    ]);

    let dailyList = [];

    if (resLand && resLand.ok && resTa && resTa.ok) {
      const dataLand = await resLand.json();
      const dataTa = await resTa.json();
      const itemLand = dataLand.response?.body?.items?.item?.[0];
      const itemTa = dataTa.response?.body?.items?.item?.[0];

      if (itemLand && itemTa) {
        // Construct 3-day to 7-day forecasts
        for (let d = 3; d <= 7; d++) {
          const wf = itemLand[`wf${d}Am`] || itemLand[`wf${d}`] || '구름많음';
          const pop = itemLand[`rnSt${d}Am`] || itemLand[`rnSt${d}`] || 30;
          const taMin = itemTa[`taMin${d}`] || 22;
          const taMax = itemTa[`taMax${d}`] || 31;

          let icon = 'Sun';
          if (wf.includes('비') || wf.includes('소나기')) icon = 'CloudRain';
          else if (wf.includes('구름') || wf.includes('흐림')) icon = 'Cloud';

          dailyList.push({
            dayOffset: d,
            weatherText: wf,
            weatherIcon: icon,
            pop: `${pop}%`,
            tempRange: `${taMin}°C / ${taMax}°C`
          });
        }
      }
    }
    return dailyList;
  } catch (err) {
    console.warn('Mid-term Weather API Fallback:', err);
    return [];
  }
}

// Helper to generate deterministic but dynamic weather info per region & date range
function generateDynamicWeather(regionName, startDate, endDate) {
  const meta = REGION_META[regionName] || REGION_META['서울'];
  
  // Seed hash based on region name + startDate
  const seed = (regionName + (startDate || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Weather profiles per region characteristics
  const tempBaseMap = {
    '서울': 25, '인천': 24, '경기': 24, '강원': 22, '충북': 25,
    '충남': 25, '대전': 26, '세종': 25, '전북': 26, '전남': 27,
    '광주': 27, '경북': 26, '경남': 27, '대구': 29, '울산': 26,
    '부산': 26, '제주': 27, '전국': 25
  };

  const weatherTypes = [
    { text: '맑고 쾌청함', icon: 'Sun', pop: '10%' },
    { text: '구름 조금', icon: 'Sun', pop: '20%' },
    { text: '구름 많음', icon: 'Cloud', pop: '30%' },
    { text: '흐림', icon: 'Cloud', pop: '40%' },
    { text: '한때 소나기', icon: 'CloudRain', pop: '60%' },
    { text: '비 / 뇌우', icon: 'CloudRain', pop: '80%' }
  ];

  const baseTemp = tempBaseMap[regionName] || 25;
  const tempVar = (seed % 7) - 3; // -3 to +3
  const currentTemp = `${baseTemp + tempVar}°C`;
  const wType = weatherTypes[seed % weatherTypes.length];

  const midTermList = [];
  for (let d = 3; d <= 7; d++) {
    const daySeed = seed + d;
    const dayW = weatherTypes[daySeed % weatherTypes.length];
    const minT = baseTemp + (daySeed % 3) - 4;
    const maxT = baseTemp + (daySeed % 4) + 3;
    midTermList.push({
      dayOffset: d,
      weatherText: dayW.text,
      weatherIcon: dayW.icon,
      pop: dayW.pop,
      tempRange: `${minT}°C / ${maxT}°C`
    });
  }

  return {
    region: regionName,
    temperature: currentTemp,
    rainProbability: wType.pop,
    weatherText: wType.text,
    weatherIcon: wType.icon,
    forecastDate: startDate && endDate ? `${startDate} ~ ${endDate}` : '실시간 예보',
    midTermForecast: midTermList
  };
}

export async function fetchRealtimeWeather(regionName = '서울', startDate, endDate) {
  const meta = REGION_META[regionName] || REGION_META['서울'];
  
  // Format dates
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const baseDate = `${year}${month}${day}`;

  const dateRangeStr = startDate && endDate ? `${startDate} ~ ${endDate}` : `${year}-${month}-${day}`;

  const urlShort = `${PUBLIC_API_CONFIG.WEATHER_SHORT_BASE}/getVilageFcst?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&pageNo=1&numOfRows=60&dataType=JSON&base_date=${baseDate}&base_time=0500&nx=${meta.nx}&ny=${meta.ny}`;

  try {
    const res = await fetch(urlShort);
    if (!res.ok) throw new Error('Weather API HTTP error');
    const data = await res.json();
    const items = data.response?.body?.items?.item || [];

    if (!items || items.length === 0) {
      return generateDynamicWeather(regionName, startDate, endDate);
    }

    let temp = '25°C';
    let pop = '20%';
    let skyText = '맑음';
    let skyIcon = 'Sun';

    items.forEach(item => {
      if (item.category === 'TMP') temp = `${item.fcstValue}°C`;
      if (item.category === 'POP') pop = `${item.fcstValue}%`;
      if (item.category === 'SKY') {
        const val = parseInt(item.fcstValue, 10);
        if (val <= 5) {
          skyText = '맑음';
          skyIcon = 'Sun';
        } else if (val <= 8) {
          skyText = '구름 많음';
          skyIcon = 'Cloud';
        } else {
          skyText = '흐림';
          skyIcon = 'CloudRain';
        }
      }
      if (item.category === 'PTY' && item.fcstValue !== '0') {
        skyText = '비/눈 예보';
        skyIcon = 'CloudRain';
      }
    });

    // Also fetch Mid-Term Weather forecast for multi-day travels
    const midTermForecast = await fetchMidTermWeather(regionName, `${baseDate}0600`);

    return {
      region: regionName,
      temperature: temp,
      rainProbability: pop,
      weatherText: skyText,
      weatherIcon: skyIcon,
      forecastDate: dateRangeStr,
      midTermForecast: midTermForecast.length > 0 ? midTermForecast : generateDynamicWeather(regionName, startDate, endDate).midTermForecast
    };
  } catch (err) {
    console.warn('Weather API Dynamic Fallback triggered:', err);
    return generateDynamicWeather(regionName, startDate, endDate);
  }
}
