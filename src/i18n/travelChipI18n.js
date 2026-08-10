export function getI18nTravelNote(nextTravel, lang = 'ko') {
  if (!nextTravel) return { driveNote: '', transitNote: '', isLongDistance: false };

  const hours = nextTravel.distKm ? (parseFloat(nextTravel.distKm) / 70 + 0.3).toFixed(1) : '2.5';
  const isJejuTrip = nextTravel.longDistanceNote && (nextTravel.longDistanceNote.includes('비행기') || nextTravel.longDistanceNote.includes('Flight'));
  const distKm = nextTravel.distKm || '1.0';
  const carMin = nextTravel.carMin || 10;
  const transitMin = nextTravel.transitMin || Math.round(carMin * 1.5);
  const walkMin = Math.round(parseFloat(distKm) * 14 + 3);

  // 1. Long Distance Travel
  if (nextTravel.isLongDistance) {
    let longNote = '';
    if (isJejuTrip) {
      switch (lang) {
        case 'en': longNote = '✈️ Flight / Ferry (~3.5 hrs)'; break;
        case 'ja': longNote = '✈️ 飛行機 / 旅客船 (約 3.5時間)'; break;
        case 'zh': longNote = '✈️ 飞机 / 客轮 (约 3.5小时)'; break;
        case 'zht': longNote = '✈️ 飛機 / 客輪 (約 3.5小時)'; break;
        case 'de': longNote = '✈️ Flug / Fähre (~3.5 Std.)'; break;
        case 'fr': longNote = '✈️ Vol / Ferry (~3.5 h)'; break;
        case 'es': longNote = '✈️ Avión / Ferry (~3.5 hrs)'; break;
        case 'ru': longNote = '✈️ Самолет / Паром (~3.5 ч)'; break;
        default: longNote = '✈️ 비행기 / 연안여객선 (약 3.5시간)'; break;
      }
    } else {
      switch (lang) {
        case 'en': longNote = `🚄 KTX / Express Bus (~${hours} hrs)`; break;
        case 'ja': longNote = `🚄 KTX / 高速バス (約 ${hours}時間)`; break;
        case 'zh': longNote = `🚄 KTX / 高速巴士 (约 ${hours}小时)`; break;
        case 'zht': longNote = `🚄 KTX / 高速巴士 (約 ${hours}小時)`; break;
        case 'de': longNote = `🚄 KTX / Expressbus (~${hours} Std.)`; break;
        case 'fr': longNote = `🚄 KTX / Bus express (~${hours} h)`; break;
        case 'es': longNote = `🚄 KTX / Autobús exprés (~${hours} hrs)`; break;
        case 'ru': longNote = `🚄 KTX / Скоростной автобус (~${hours} ч)`; break;
        default: longNote = `🚄 KTX / 고속버스 (약 ${hours}시간)`; break;
      }
    }
    return { driveNote: '', transitNote: longNote, isLongDistance: true, longNote };
  }

  // 2. Drive Note
  let driveNote = '';
  switch (lang) {
    case 'en': driveNote = `🚗 Car ~${carMin} min (${distKm}km)`; break;
    case 'ja': driveNote = `🚗 車で約 ${carMin}分 (${distKm}km)`; break;
    case 'zh': driveNote = `🚗 驾车约 ${carMin}分钟 (${distKm}km)`; break;
    case 'zht': driveNote = `🚗 開車約 ${carMin}分鐘 (${distKm}km)`; break;
    case 'de': driveNote = `🚗 Auto ~${carMin} Min. (${distKm}km)`; break;
    case 'fr': driveNote = `🚗 Voiture ~${carMin} min (${distKm}km)`; break;
    case 'es': driveNote = `🚗 Coche ~${carMin} min (${distKm}km)`; break;
    case 'ru': driveNote = `🚗 На авто ~${carMin} мин (${distKm}km)`; break;
    default: driveNote = `🚗 차량 약 ${carMin}분 (${distKm}km)`; break;
  }

  // 3. Transit Note
  let transitNote = '';
  const isWalk = nextTravel.transitType === 'walk' || parseFloat(distKm) < 1.5;
  const isSubway = nextTravel.transitType === 'subway' || parseFloat(distKm) < 7.0;

  if (isWalk) {
    switch (lang) {
      case 'en': transitNote = `🚶 Walk ~${walkMin} min (${distKm}km)`; break;
      case 'ja': transitNote = `🚶 徒歩約 ${walkMin}分 (${distKm}km)`; break;
      case 'zh': transitNote = `🚶 步行约 ${walkMin}分钟 (${distKm}km)`; break;
      case 'zht': transitNote = `🚶 步行約 ${walkMin}分鐘 (${distKm}km)`; break;
      case 'de': transitNote = `🚶 Zu Fuß ~${walkMin} Min. (${distKm}km)`; break;
      case 'fr': transitNote = `🚶 À pied ~${walkMin} min (${distKm}km)`; break;
      case 'es': transitNote = `🚶 A pie ~${walkMin} min (${distKm}km)`; break;
      case 'ru': transitNote = `🚶 Пешком ~${walkMin} мин (${distKm}km)`; break;
      default: transitNote = `🚶 도보 약 ${walkMin}분 (${distKm}km)`; break;
    }
  } else if (isSubway) {
    switch (lang) {
      case 'en': transitNote = `🚇 Subway / 🚌 Bus (~${transitMin} min)`; break;
      case 'ja': transitNote = `🚇 地下鉄 / 🚌 路線バス (約 ${transitMin}分)`; break;
      case 'zh': transitNote = `🚇 地铁 / 🚌 公交车 (约 ${transitMin}分钟)`; break;
      case 'zht': transitNote = `🚇 地鐵 / 🚌 公車 (約 ${transitMin}分鐘)`; break;
      case 'de': transitNote = `🚇 U-Bahn / 🚌 Bus (~${transitMin} Min.)`; break;
      case 'fr': transitNote = `🚇 Métro / 🚌 Bus (~${transitMin} min)`; break;
      case 'es': transitNote = `🚇 Metro / 🚌 Autobús (~${transitMin} min)`; break;
      case 'ru': transitNote = `🚇 Метро / 🚌 Автобус (~${transitMin} мин)`; break;
      default: transitNote = `🚇 지하철 / 🚌 시내버스 (약 ${transitMin}분)`; break;
    }
  } else {
    switch (lang) {
      case 'en': transitNote = `🚇 Subway / 🚌 Transit (~${transitMin} min)`; break;
      case 'ja': transitNote = `🚇 地下鉄 / 🚌 公共交通 (約 ${transitMin}分)`; break;
      case 'zh': transitNote = `🚇 地铁 / 🚌 公共交通 (约 ${transitMin}分钟)`; break;
      case 'zht': transitNote = `🚇 地鐵 / 🚌 公共交通 (約 ${transitMin}分鐘)`; break;
      case 'de': transitNote = `🚇 U-Bahn / 🚌 ÖPNV (~${transitMin} Min.)`; break;
      case 'fr': transitNote = `🚇 Métro / 🚌 Transports (~${transitMin} min)`; break;
      case 'es': transitNote = `🚇 Metro / 🚌 Transporte (~${transitMin} min)`; break;
      case 'ru': transitNote = `🚇 Метро / 🚌 Транспорт (~${transitMin} мин)`; break;
      default: transitNote = `🚇 지하철 환승 / 🚌 대중교통 (약 ${transitMin}분)`; break;
    }
  }

  return { driveNote, transitNote, isLongDistance: false };
}
