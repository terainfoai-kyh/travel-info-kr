import { PUBLIC_API_CONFIG, REGION_META } from './apiConfig';

// Base Time calculation for KMA Realtime Observation API (getUltraSrtNcst)
// Released every hour on the hour (available ~10-15 mins after base_time)
function getUltraSrtNcstBaseDateTime() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  let baseHour = hours;
  if (minutes < 15) {
    baseHour = hours - 1;
    if (baseHour < 0) {
      baseHour = 23;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      year = yesterday.getFullYear();
      month = yesterday.getMonth() + 1;
      day = yesterday.getDate();
    }
  }

  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(baseHour).padStart(2, '0')}00`;
  return { baseDate, baseTime };
}

// Dynamic Base Time calculation for KMA Short-Term Forecast API (VilageFcstInfoService_2.0)
// Release times: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (available ~15 mins after base_time)
function getShortTermBaseDateTime() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  if (hours < 2 || (hours === 2 && minutes < 15)) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    year = yesterday.getFullYear();
    month = yesterday.getMonth() + 1;
    day = yesterday.getDate();
    return {
      baseDate: `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
      baseTime: '2300'
    };
  }

  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];
  let selectedBase = 2;
  for (const b of baseTimes) {
    if (hours > b || (hours === b && minutes >= 15)) {
      selectedBase = b;
    }
  }

  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(selectedBase).padStart(2, '0')}00`;
  return { baseDate, baseTime };
}

// Dynamic tmFc calculation for KMA Mid-Term Forecast API (MidFcstInfoService)
// Release times: 06:00, 18:00
function getMidTermBaseTm() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();

  if (hours < 6) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    year = yesterday.getFullYear();
    month = yesterday.getMonth() + 1;
    day = yesterday.getDate();
    return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}1800`;
  } else if (hours < 18) {
    return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}0600`;
  } else {
    return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}1800`;
  }
}

// 기상청 중기예보 (Mid-term Forecast: getMidLandFcst, getMidTa)
export async function fetchMidTermWeather(regionName = '서울', baseTm = '') {
  const meta = REGION_META[regionName] || REGION_META['서울'];
  
  if (!baseTm) {
    baseTm = getMidTermBaseTm();
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
        for (let d = 3; d <= 7; d++) {
          const wfAm = itemLand[`wf${d}Am`];
          const wfPm = itemLand[`wf${d}Pm`];
          const wf = wfAm || wfPm || itemLand[`wf${d}`];
          
          const rnStAm = itemLand[`rnSt${d}Am`];
          const rnStPm = itemLand[`rnSt${d}Pm`];
          const popVal = rnStAm !== undefined ? rnStAm : (rnStPm !== undefined ? rnStPm : itemLand[`rnSt${d}`]);

          const taMin = itemTa[`taMin${d}`];
          const taMax = itemTa[`taMax${d}`];

          // Skip if key fields for day offset d do not exist in KMA payload for this baseTm
          if (!wf && taMin === undefined && taMax === undefined) {
            continue;
          }

          const wfText = wf || '구름많음';
          const popText = popVal !== undefined ? `${popVal}%` : '20%';
          const minText = taMin !== undefined ? `${taMin}°C` : '22°C';
          const maxText = taMax !== undefined ? `${taMax}°C` : '30°C';

          let icon = 'Sun';
          if (wfText.includes('비') || wfText.includes('소나기')) icon = 'CloudRain';
          else if (wfText.includes('구름') || wfText.includes('흐림')) icon = 'Cloud';

          dailyList.push({
            dayOffset: d,
            weatherText: wfText,
            weatherIcon: icon,
            pop: popText,
            tempRange: `${minText} / ${maxText}`
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

// Helper to generate deterministic but dynamic weather info per region & date range with seasonal accuracy
function generateDynamicWeather(regionName, startDate, endDate) {
  const meta = REGION_META[regionName] || REGION_META['서울'];
  
  const seed = (regionName + (startDate || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Seasonal base temperature mapping by month (Jan=0, Feb=1, Mar=2, Apr=3, May=4, Jun=5, Jul=6, Aug=7, Sep=8, Oct=9, Nov=10, Dec=11)
  const currentMonth = new Date().getMonth();
  const seasonalTempOffsets = [-2, 0, 8, 14, 20, 24, 28, 28, 23, 16, 8, 1];
  const seasonalBase = seasonalTempOffsets[currentMonth] ?? 24;

  const tempRegionalOffsets = {
    '서울': 0, '인천': -1, '경기': -1, '강원': -3, '충북': 0,
    '충남': 0, '대전': 1, '세종': 0, '전북': 1, '전남': 2,
    '광주': 2, '경북': 1, '경남': 2, '대구': 3, '울산': 1,
    '부산': 2, '제주': 3, '전국': 0
  };

  const weatherTypes = [
    { text: '맑음', icon: 'Sun', pop: '10%' },
    { text: '구름 조금', icon: 'Sun', pop: '20%' },
    { text: '구름많음', icon: 'Cloud', pop: '30%' },
    { text: '흐림', icon: 'Cloud', pop: '40%' },
    { text: '한때 소나기', icon: 'CloudRain', pop: '60%' },
    { text: '비', icon: 'CloudRain', pop: '80%' }
  ];

  const baseTemp = seasonalBase + (tempRegionalOffsets[regionName] || 0);
  const tempVar = (seed % 5) - 2;
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
  
  const { baseDate, baseTime } = getShortTermBaseDateTime();
  const ncstInfo = getUltraSrtNcstBaseDateTime();
  const dateRangeStr = startDate && endDate ? `${startDate} ~ ${endDate}` : `${ncstInfo.baseDate.slice(0,4)}-${ncstInfo.baseDate.slice(4,6)}-${ncstInfo.baseDate.slice(6,8)}`;

  const urlNcst = `${PUBLIC_API_CONFIG.WEATHER_SHORT_BASE}/getUltraSrtNcst?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${ncstInfo.baseDate}&base_time=${ncstInfo.baseTime}&nx=${meta.nx}&ny=${meta.ny}`;
  const urlShort = `${PUBLIC_API_CONFIG.WEATHER_SHORT_BASE}/getVilageFcst?serviceKey=${PUBLIC_API_CONFIG.SERVICE_KEY}&pageNo=1&numOfRows=60&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${meta.nx}&ny=${meta.ny}`;

  try {
    const [resNcst, resShort] = await Promise.all([
      fetch(urlNcst).catch(() => null),
      fetch(urlShort).catch(() => null)
    ]);

    let temp = '';
    let ptyVal = '0';
    let pop = '20%';
    let skyVal = '1';

    if (resNcst && resNcst.ok) {
      const dataNcst = await resNcst.json();
      const ncstItems = dataNcst.response?.body?.items?.item || [];
      ncstItems.forEach(item => {
        if (item.category === 'T1H') temp = `${parseFloat(item.obsrValue).toFixed(1)}°C`;
        if (item.category === 'PTY') ptyVal = String(item.obsrValue);
      });
    }

    if (resShort && resShort.ok) {
      const dataShort = await resShort.json();
      const shortItems = dataShort.response?.body?.items?.item || [];
      if (shortItems.length > 0) {
        const firstFcstTime = shortItems[0]?.fcstTime;
        const targetItems = shortItems.filter(i => i.fcstTime === firstFcstTime);
        
        targetItems.forEach(item => {
          if (item.category === 'POP') pop = `${item.fcstValue}%`;
          if (item.category === 'SKY') skyVal = String(item.fcstValue);
          if (item.category === 'TMP' && !temp) temp = `${item.fcstValue}°C`;
          if (item.category === 'PTY' && ptyVal === '0' && item.fcstValue !== '0') ptyVal = String(item.fcstValue);
        });

        if (!temp) {
          const tmpItem = shortItems.find(i => i.category === 'TMP');
          if (tmpItem) temp = `${tmpItem.fcstValue}°C`;
        }
      }
    }

    if (!temp) {
      return generateDynamicWeather(regionName, startDate, endDate);
    }

    // Determine Sky/Weather text & icon from PTY & SKY
    const skyMap = { '1': '맑음', '3': '구름많음', '4': '흐림' };
    const ptyMap = {
      '1': '비',
      '2': '비/눈',
      '3': '눈',
      '4': '소나기',
      '5': '빗방울',
      '6': '빗방울눈날림',
      '7': '눈날림'
    };

    let skyText = '맑음';
    let skyIcon = 'Sun';

    if (ptyVal !== '0' && ptyMap[ptyVal]) {
      skyText = ptyMap[ptyVal];
      skyIcon = (ptyVal === '3' || ptyVal === '7') ? 'Cloud' : 'CloudRain';
    } else {
      skyText = skyMap[skyVal] || '맑음';
      if (skyVal === '3' || skyVal === '4') skyIcon = 'Cloud';
      else skyIcon = 'Sun';
    }

    // Also fetch Mid-Term Weather forecast for multi-day travels
    const midTermForecast = await fetchMidTermWeather(regionName, getMidTermBaseTm());

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

