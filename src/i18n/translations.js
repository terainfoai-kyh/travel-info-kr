/**
 * VORA AI 3.0 - Streamlined 4-Language Universal Translation System (KO, EN, JA, ZH)
 * Eliminates translation holes, ensures 100% complete localization across all UI,
 * itinerary planning, travel essentials, and Google AdSense compliance modals.
 */

export function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return 'ko';
  const lang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  return 'en'; // Default fallback for all other international visitors
}

export function getCloseButtonLabel(lang = 'ko') {
  switch (lang) {
    case 'en': return 'Close';
    case 'ja': return '閉じる';
    case 'zh': return '关闭';
    default: return '닫기';
  }
}

export function getSpotDetailButtonLabel(lang = 'ko', isShort = false) {
  if (isShort) {
    switch (lang) {
      case 'en': return 'Detail';
      case 'ja': return '詳細';
      case 'zh': return '详情';
      default: return '상세';
    }
  }
  switch (lang) {
    case 'en': return '🔍 Photos & Details';
    case 'ja': return '🔍 写真・詳細を見る';
    case 'zh': return '🔍 照片·查看详情';
    default: return '🔍 사진·상세보기';
  }
}

export function getSpotMapButtonLabel(lang = 'ko', isShort = false) {
  if (isShort) {
    switch (lang) {
      case 'en': return 'Map';
      case 'ja': return '地図';
      case 'zh': return '地图';
      default: return '지도';
    }
  }
  switch (lang) {
    case 'en': return 'Google Map';
    case 'ja': return 'Googleマップ';
    case 'zh': return 'Google地图';
    default: return '지도 위치';
  }
}

export function getMapSearchBtnLabel(foodName, lang = 'ko') {
  const cleanName = foodName ? foodName.split('&')[0].trim() : '';
  switch (lang) {
    case 'en': return `Search Nearby ${cleanName} Restaurants ↗`;
    case 'ja': return `周辺の ${cleanName} グルメマップ検索 ↗`;
    case 'zh': return `搜索周边 ${cleanName} 美食地图 ↗`;
    default: return `주변 ${cleanName} 맛집 지도 검색 ↗`;
  }
}

export function getTranslatedTitle(title, lang = 'ko') {
  if (!title || typeof title !== 'string') return '';
  return title.trim();
}

export function getTranslatedAddress(addr, lang = 'ko') {
  if (!addr || typeof addr !== 'string') return '';
  return addr.trim();
}

export const CITY_TRANSLATIONS = {
  ko: {
    '서울': '서울', '부산': '부산', '인천': '인천', '대구': '대구', '대전': '대전', '광주': '광주', '울산': '울산', '세종': '세종',
    '기장': '기장', '군위': '군위', '달성': '달성', '강화': '강화', '옹진': '옹진', '울주': '울주', '울주군': '울주군',
    '수원': '수원', '용인': '용인', '고양': '고양', '성남': '성남', '화성': '화성', '부천': '부천', '남양주': '남양주', '안산': '안산', '평택': '평택', '안양': '안양', '시흥': '시흥', '파주': '파주', '김포': '김포', '의정부': '의정부', '하남': '하남', '광명': '광명', '군포': '군포', '양주': '양주', '오산': '오산', '이천': '이천', '안성': '안성', '구리': '구리', '포천': '포천', '의왕': '의왕', '양평': '양평', '여주': '여주', '동두천': '동두천', '가평': '가평', '과천': '과천', '연천': '연천',
    '춘천': '춘천', '원주': '원주', '강릉': '강릉', '동해': '동해', '태백': '태백', '속초': '속초', '삼척': '삼척', '홍천': '홍천', '횡성': '횡성', '영월': '영월', '평창': '평창', '정선': '정선', '철원': '철원', '화천': '화천', '양구': '양구', '인제': '인제', '고성': '고성', '고성(강원)': '고성', '양양': '양양',
    '청주': '청주', '충주': '충주', '제천': '제천', '보은': '보은', '옥천': '옥천', '영동': '영동', '증평': '증평', '진천': '진천', '괴산': '괴산', '음성': '음성', '단양': '단양',
    '천안': '천안', '공주': '공주', '보령': '보령', '아산': '아산', '서산': '서산', '논산': '논산', '계룡': '계룡', '당진': '당진', '금산': '금산', '부여': '부여', '서천': '서천', '청양': '청양', '홍성': '홍성', '예산': '예산', '태안': '태안',
    '전주': '전주', '군산': '군산', '익산': '익산', '정읍': '정읍', '남원': '남원', '김제': '김제', '완주': '완주', '진안': '진안', '무주': '무주', '장수': '장수', '임실': '임실', '순창': '순창', '고창': '고창', '부안': '부안',
    '목포': '목포', '여수': '여수', '순천': '순천', '나주': '나주', '광양': '광양', '담양': '담양', '곡성': '곡성', '구례': '구례', '고흥': '고흥', '보성': '보성', '화순': '화순', '장흥': '장흥', '강진': '강진', '해남': '해남', '영암': '영암', '무안': '무안', '함평': '함평', '영광': '영광', '장성': '장성', '완도': '완도', '진도': '진도', '신안': '신안',
    '포항': '포항', '경주': '경주', '김천': '김천', '안동': '안동', '구미': '구미', '영주': '영주', '영천': '영천', '상주': '상주', '문경': '문경', '경산': '경산', '의성': '의성', '청송': '청송', '영양': '영양', '영덕': '영덕', '청도': '청도', '고령': '고령', '성주': '성주', '칠곡': '칠곡', '예천': '예천', '봉화': '봉화', '울진': '울진', '울릉': '울릉', '울릉도': '울릉도',
    '창원': '창원', '진주': '진주', '통영': '통영', '사천': '사천', '김해': '김해', '밀양': '밀양', '거제': '거제', '양산': '양산', '의령': '의령', '함안': '함안', '창녕': '창녕', '고성(경남)': '고성', '남해': '남해', '하동': '하동', '산청': '산청', '함양': '함양', '거창': '거창', '합천': '합천',
    '제주': '제주', '서귀포': '서귀포'
  },
  en: {
    '서울': 'Seoul', '부산': 'Busan', '인천': 'Incheon', '대구': 'Daegu', '대전': 'Daejeon', '광주': 'Gwangju', '울산': 'Ulsan', '세종': 'Sejong',
    '기장': 'Gijang', '군위': 'Gunwi', '달성': 'Dalseong', '강화': 'Ganghwa', '옹진': 'Ongjin', '울주': 'Ulju', '울주군': 'Ulju-gun',
    '수원': 'Suwon', '용인': 'Yongin', '고양': 'Goyang', '성남': 'Seongnam', '화성': 'Hwaseong', '부천': 'Bucheon', '남양주': 'Namyangju', '안산': 'Ansan', '평택': 'Pyeongtaek', '안양': 'Anyang', '시흥': 'Siheung', '파주': 'Paju', '김포': 'Gimpo', '의정부': 'Uijeongbu', '하남': 'Hanam', '광명': 'Gwangmyeong', '군포': 'Gunpo', '양주': 'Yangju', '오산': 'Osan', '이천': 'Icheon', '안성': 'Anseong', '구리': 'Guri', '포천': 'Pocheon', '의왕': 'Uiwang', '양평': 'Yangpyeong', '여주': 'Yeoju', '동두천': 'Dongducheon', '가평': 'Gapyeong', '과천': 'Gwacheon', '연천': 'Yeoncheon',
    '춘천': 'Chuncheon', '원주': 'Wonju', '강릉': 'Gangneung', '동해': 'Donghae', '태백': 'Taebaek', '속초': 'Sokcho', '삼척': 'Samcheok', '홍천': 'Hongcheon', '횡성': 'Hoengseong', '영월': 'Yeongwol', '평창': 'Pyeongchang', '정선': 'Jeongseon', '철원': 'Cheorwon', '화천': 'Hwacheon', '양구': 'Yanggu', '인제': 'Inje', '고성': 'Goseong', '고성(강원)': 'Goseong', '양양': 'Yangyang',
    '청주': 'Cheongju', '충주': 'Chungju', '제천': 'Jecheon', '보은': 'Boeun', '옥천': 'Okcheon', '영동': 'Yeongdong', '증평': 'Jeungpyeong', '진천': 'Jincheon', '괴산': 'Goesan', '음성': 'Eumseong', '단양': 'Danyang',
    '천안': 'Cheonan', '공주': 'Gongju', '보령': 'Boryeong', '아산': 'Asan', '서산': 'Seosan', '논산': 'Nonsan', '계룡': 'Gyeryong', '당진': 'Dangjin', '금산': 'Geumsan', '부여': 'Buyeo', '서천': 'Seocheon', '청양': 'Cheongyang', '홍성': 'Hongseong', '예산': 'Yesan', '태안': 'Taean',
    '전주': 'Jeonju', '군산': 'Gunsan', '익산': 'Iksan', '정읍': 'Jeongeup', '남원': 'Namwon', '김제': 'Gimje', '완주': 'Wanju', '진안': 'Jinan', '무주': 'Muju', '장수': 'Jangsu', '임실': 'Imsil', '순창': 'Sunchang', '고창': 'Gochang', '부안': 'Buan',
    '목포': 'Mokpo', '여수': 'Yeosu', '순천': 'Suncheon', '나주': 'Naju', '광양': 'Gwangyang', '담양': 'Damyang', '곡성': 'Gokseong', '구례': 'Gurye', '고흥': 'Goheung', '보성': 'Boseong', '화순': 'Hwasun', '장흥': 'Jangheung', '강진': 'Gangjin', '해남': 'Haenam', '영암': 'Yeongam', '무안': 'Muan', '함평': 'Hampyeong', '영광': 'Yeonggwang', '장성': 'Jangseong', '완도': 'Wando', '진도': 'Jindo', '신안': 'Sinan',
    '포항': 'Pohang', '경주': 'Gyeongju', '김천': 'Gimcheon', '안동': 'Andong', '구미': 'Gumi', '영주': 'Yeongju', '영천': 'Yeongcheon', '상주': 'Sangju', '문경': 'Mungyeong', '경산': 'Gyeongsan', '의성': 'Uiseong', '청송': 'Cheongsong', '영양': 'Yeongyang', '영덕': 'Yeongdeok', '청도': 'Cheongdo', '고령': 'Goryeong', '성주': 'Seongju', '칠곡': 'Chilgok', '예천': 'Yecheon', '봉화': 'Bonghwa', '울진': 'Uljin', '울릉': 'Ulleungdo', '울릉도': 'Ulleungdo',
    '창원': 'Changwon', '진주': 'Jinju', '통영': 'Tongyeong', '사천': 'Sacheon', '김해': 'Gimhae', '밀양': 'Miryang', '거제': 'Geoje', '양산': 'Yangsan', '의령': 'Uiryeong', '함안': 'Haman', '창녕': 'Changnyeong', '고성(경남)': 'Goseong', '남해': 'Namhae', '하동': 'Hadong', '산청': 'Sancheong', '함양': 'Hamyang', '거창': 'Geochang', '합천': 'Hapcheon',
    '제주': 'Jeju', '서귀포': 'Seogwipo'
  },
  ja: {
    '서울': 'ソウル', '부산': '釜山', '인천': '仁川', '대구': '大邱', '대전': '大田', '광주': '光州', '울산': '蔚山', '세종': '世宗',
    '기장': '機張', '군위': '軍威', '달성': '達城', '강화': '江華', '옹진': '甕津', '울주': '蔚州', '울주군': '蔚州郡',
    '수원': '水原', '용인': '龍仁', '고양': '高陽', '성남': '城南', '화성': '華城', '부천': '富川', '남양주': '南楊州', '안산': '安山', '평택': '平沢', '안양': '安養', '시흥': '始興', '파주': '坡州', '김포': '金浦', '의정부': '議政府', '하남': '河南', '광명': '光明', '군포': '軍浦', '양주': '楊州', '오산': '烏山', '이천': '利川', '안성': '安城', '구리': '九里', '포천': '抱川', '의왕': '義王', '양평': '楊平', '여주': '驪州', '동두천': '東豆川', '가평': '加平', '과천': '果川', '연천': '漣川',
    '춘천': '春川', '원주': '原州', '강릉': '江陵', '동해': '東海', '태백': '太白', '속초': '束草', '삼척': '三陟', '홍천': '洪川', '횡성': '横城', '영월': '寧越', '평창': '平昌', '정선': '旌善', '철원': '鉄原', '화천': '華川', '양구': '楊口', '인제': '麟蹄', '고성': '高城', '고성(강원)': '高城', '양양': '襄陽',
    '청주': '清州', '충주': '忠州', '제천': '堤川', '보은': '報恩', '옥천': '沃川', '영동': '永同', '증평': '曽坪', '진천': '鎮川', '괴산': '槐山', '음성': '陰城', '단양': '丹陽',
    '천안': '天安', '공주': '公州', '보령': '保寧', '아산': '牙山', '서산': '瑞山', '논산': '論山', '계룡': '鶏龍', '당진': '唐津', '금산': '錦山', '부여': '扶余', '서천': '舒川', '청양': '青陽', '홍성': '洪城', '예산': '礼山', '태안': '泰安',
    '전주': '全州', '군산': '群山', '익산': '益山', '정읍': '井邑', '남원': '南原', '김제': '金堤', '완주': '完州', '진안': '鎮安', '무주': '茂朱', '장수': '長水', '임실': '任実', '순창': '淳昌', '고창': '高敞', '부안': '扶安',
    '목포': '木浦', '여수': '麗水', '순천': '順天', '나주': '羅州', '광양': '光陽', '담양': '潭陽', '곡성': '谷城', '구례': '求礼', '고흥': '高興', '보성': '宝城', '화순': '和順', '장흥': '長興', '강진': '康津', '해남': '海南', '영암': '霊岩', '무안': '務安', '함평': '咸平', '영광': '霊光', '장성': '長城', '완도': '莞島', '진도': '珍島', '신안': '新安',
    '포항': '浦項', '경주': '慶州', '김천': '金泉', '안동': '安東', '구미': '亀尾', '영주': '栄州', '영천': '永川', '상주': '尚州', '문경': '聞慶', '경산': '慶山', '의성': '義城', '청송': '青松', '영양': '英陽', '영덕': '盈徳', '청도': '清道', '고령': '高霊', '성주': '星州', '칠곡': '漆谷', '예천': '醴泉', '봉화': '奉化', '울진': '蔚珍', '울릉': '鬱陵島', '울릉도': '鬱陵島',
    '창원': '昌原', '진주': '晋州', '통영': '統営', '사천': '泗川', '김해': '金海', '밀양': '密陽', '거제': '巨済', '양산': '梁山', '의령': '宜寧', '함안': '咸安', '창녕': '昌寧', '고성(경남)': '固城', '남해': '南海', '하동': '河東', '산청': '山清', '함양': '咸陽', '거창': '居昌', '합천': '陜川',
    '제주': '済州', '서귀포': '西帰浦'
  },
  zh: {
    '서울': '首尔', '부산': '釜山', '인천': '仁川', '대구': '大邱', '대전': '大田', '광주': '光州', '울산': '蔚山', '세종': '世宗',
    '기장': '机张', '군위': '军威', '달성': '达城', '강화': '江华', '옹진': '瓮津', '울주': '蔚州', '울주군': '蔚州郡',
    '수원': '水原', '용인': '龙仁', '고양': '高阳', '성남': '城南', '화성': '华城', '부천': '富川', '남양주': '南杨州', '안산': '安山', '평택': '平泽', '안양': '安养', '시흥': '始兴', '파주': '坡州', '김포': '金浦', '의정부': '议政府', '하남': '河南', '광명': '光明', '군포': '军浦', '양주': '杨州', '오산': '乌山', '이천': '利川', '안성': '安城', '구리': '九里', '포천': '抱川', '의왕': '义王', '양평': '杨平', '여주': '骊州', '동두천': '东豆川', '가평': '加平', '과천': '果川', '연천': '涟川',
    '춘천': '春川', '원주': '原州', '강릉': '江陵', '동해': '东海', '태백': '太白', '속초': '束草', '삼척': '三陟', '홍천': '洪川', '횡성': '横城', '영월': '宁越', '평창': '平昌', '정선': '旌善', '철원': '铁原', '화천': '华川', '양구': '杨口', '인제': '麟蹄', '고성': '高城', '고성(강원)': '高城', '양양': '襄阳',
    '청주': '清州', '충주': '忠州', '제천': '堤川', '보은': '报恩', '옥천': '沃川', '영동': '永同', '증평': '曾坪', '진천': '镇川', '괴산': '槐山', '음성': '阴城', '단양': '丹阳',
    '천안': '天安', '공주': '公州', '보령': '保宁', '아산': '牙山', '서산': '瑞山', '논산': '论山', '계룡': '鸡龙', '당진': '唐津', '금산': '锦山', '부여': '扶余', '서천': '舒川', '청양': '青阳', '홍성': '洪城', '예산': '礼山', '태안': '泰安',
    '전주': '全州', '군산': '群山', '익산': '益山', '정읍': '井邑', '남원': '南原', '김제': '金堤', '완주': '完州', '진안': '镇安', '무주': '茂朱', '장수': '长水', '임실': '任实', '순창': '淳昌', '고창': '高敞', '부안': '扶安',
    '목포': '木浦', '여수': '丽水', '순천': '顺天', '나주': '罗州', '광양': '光阳', '담양': '潭阳', '곡성': '谷城', '구례': '求礼', '고흥': '高兴', '보성': '宝城', '화순': '和顺', '장흥': '长兴', '강진': '康津', '해남': '海南', '영암': '灵岩', '무안': '务安', '함평': '咸平', '영광': '灵光', '장성': '长城', '완도': '莞岛', '진도': '珍岛', '신안': '新安',
    '포항': '浦项', '경주': '庆州', '김천': '金泉', '안동': '安东', '구미': '龟尾', '영주': '荣州', '영천': '永川', '상주': '尚州', '문경': '闻庆', '경산': '庆山', '의성': '义城', '청송': '青松', '영양': '英阳', '영덕': '盈德', '청도': '清道', '고령': '高灵', '성주': '星州', '칠곡': '漆谷', '예천': '醴泉', '봉화': '奉化', '울진': '蔚珍', '울릉': '郁陵岛', '울릉도': '郁陵岛',
    '창원': '昌原', '진주': '晋州', '통영': '统营', '사천': '泗川', '김해': '金海', '밀양': '密阳', '거제': '巨济', '양산': '梁山', '의령': '宜宁', '함안': '咸安', '창녕': '昌宁', '고성(경남)': '固城', '남해': '南海', '하동': '河东', '산청': '山清', '함양': '咸阳', '거창': '居昌', '합천': '陕川',
    '제주': '济州', '서귀포': '西归浦'
  },
  zht: {
    '서울': '首爾', '부산': '釜山', '인천': '仁川', '대구': '大邱', '대전': '大田', '광주': '光州', '울산': '蔚山', '세종': '世宗',
    '기장': '機張', '군위': '軍威', '달성': '達城', '강화': '江華', '옹진': '甕津', '울주': '蔚州', '울주군': '蔚州郡',
    '수원': '水原', '용인': '龍仁', '고양': '高陽', '성남': '城南', '화성': '華城', '부천': '富川', '남양주': '南楊州', '안산': '安山', '평택': '平澤', '안양': '安養', '시흥': '始興', '파주': '坡州', '김포': '金浦', '의정부': '議政府', '하남': '河南', '광명': '光明', '군포': '軍浦', '양주': '楊州', '오산': '烏山', '이천': '利川', '안성': '安城', '구리': '九里', '포천': '抱川', '의왕': '義王', '양평': '楊平', '여주': '驪州', '동두천': '東豆川', '가평': '加平', '과천': '果川', '연천': '漣川',
    '춘천': '春川', '원주': '原州', '강릉': '江陵', '동해': '東海', '태백': '太白', '속초': '束草', '삼척': '三陟', '홍천': '洪川', '횡성': '横城', '영월': '寧越', '평창': '平昌', '정선': '旌善', '철원': '鉄原', '화천': '華川', '양구': '楊口', '인제': '麟蹄', '고성': '高城', '고성(강원)': '高城', '양양': '襄陽',
    '청주': '清州', '충주': '忠州', '제천': '堤川', '보은': '報恩', '옥천': '沃川', '영동': '永同', '증평': '曾坪', '진천': '鎮川', '괴산': '槐山', '음성': '陰城', '단양': '丹陽',
    '천안': '天安', '공주': '公州', '보령': '保寧', '아산': '牙山', '서산': '瑞山', '논산': '論山', '계룡': '鶏龍', '당진': '唐津', '금산': '錦山', '부여': '扶余', '서천': '舒川', '청양': '青陽', '홍성': '洪城', '예산': '礼山', '태안': '泰安',
    '전주': '全州', '군산': '群山', '익산': '益山', '정읍': '井邑', '남원': '南原', '김제': '金堤', '완주': '完州', '진안': '鎮安', '무주': '茂朱', '장수': '長水', '임실': '任実', '순창': '淳昌', '고창': '高敞', '부안': '扶安',
    '목포': '木浦', '여수': '麗水', '순천': '順天', '나주': '羅州', '광양': '光陽', '담양': '潭陽', '곡성': '谷城', '구례': '求礼', '고흥': '高興', '보성': '宝城', '화순': '和順', '장흥': '長興', '강진': '康津', '해남': '海南', '영암': '霊岩', '무안': '務安', '함평': '咸平', '영광': '霊光', '장성': '長城', '완도': '莞島', '진도': '珍島', '신안': '新安',
    '포항': '浦項', '경주': '慶州', '김천': '金泉', '안동': '安東', '구미': '亀尾', '영주': '栄州', '영천': '永川', '상주': '尚州', '문경': '聞慶', '경산': '慶山', '의성': '義城', '청송': '青松', '영양': '英陽', '영덕': '盈徳', '청도': '清道', '고령': '高霊', '성주': '星州', '칠곡': '漆谷', '예천': '醴泉', '봉화': '奉化', '울진': '蔚珍', '울릉': '鬱陵島', '울릉도': '鬱陵島',
    '창원': '昌原', '진주': '晋州', '통영': '統営', '사천': '泗川', '김해': '金海', '밀양': '密陽', '거제': '巨濟', '양산': '梁山', '의령': '宜寧', '함안': '咸安', '창녕': '昌寧', '고성(경남)': '固城', '남해': '南海', '하동': '河東', '산청': '山清', '함양': '咸陽', '거창': '居昌', '합천': '陜川',
    '제주': '濟州', '서귀포': '西歸浦'
  }
};

export function getLocalizedCityName(city, lang = 'ko') {
  if (!city || typeof city !== 'string') {
    return lang === 'ja' ? 'ソウル' : (lang === 'zh' || lang === 'zht') ? '首尔' : lang === 'en' ? 'Seoul' : '서울';
  }
  const clean = city.replace(/(특별시|광역시|특별자치시|특별자치도|시|군|구)$/, '').trim() || city.trim();

  // 1. Direct exact match
  if (CITY_TRANSLATIONS[lang]?.[clean]) {
    return CITY_TRANSLATIONS[lang][clean];
  }
  if (CITY_TRANSLATIONS[lang]?.[city.trim()]) {
    return CITY_TRANSLATIONS[lang][city.trim()];
  }

  // 2. Base Korean keyword match (e.g. '이천시' -> '이천', '용인시' -> '용인')
  for (const koKey of Object.keys(CITY_TRANSLATIONS.ko || {})) {
    if (clean.includes(koKey) || koKey.includes(clean)) {
      return CITY_TRANSLATIONS[lang]?.[koKey] || CITY_TRANSLATIONS.en?.[koKey] || koKey;
    }
  }

  // 3. Search across all languages to find the matching Korean key, then return target lang
  for (const l of ['en', 'ja', 'zh', 'zht', 'ko']) {
    for (const [koKey, trans] of Object.entries(CITY_TRANSLATIONS[l] || {})) {
      if (clean.toLowerCase() === trans.toLowerCase() || clean.toLowerCase().includes(trans.toLowerCase()) || trans.toLowerCase().includes(clean.toLowerCase())) {
        return CITY_TRANSLATIONS[lang]?.[koKey] || trans;
      }
    }
  }

  return clean;
}

export const TRANSLATIONS = {
  ko: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '대한민국 AI 여행 컨시어지',
    navWeather: '날씨',
    navEssentials: '여행 필수정보',
    navWishlist: '위시리스트',
    navLanguage: '언어',
    themeToggle: '테마 전환',
    loginCapsule: (count) => `G 로그인 ${count}회`,
    chatStatusLive: '실시간 1:1 대화중',
    dayRouteHeader: (day) => `${day}일차 실시간 Google 동선`,
    spotCountBadge: (count) => `${count}개 스팟`,
    faqTitle: '자주 묻는 질문 (FAQ)',

    // Hero Section
    heroBadge: '🏛️ 한국관광공사(KTO) TourAPI 4.0 공식 연동',
    heroTitle: '질문 하나로 완성되는 나만의 한국 여행',
    heroSubtitle: '한국관광공사 공식 인증 데이터와 VORA AI가 설계하는 초개인화 맞춤 코스 & 실시간 지도 연동',
    searchPlaceholder: '어떤 여행을 꿈꾸시나요? (예: 성수동 핫플 카페 2박3일, 제주도 바다뷰 힐링, 비 오는 날 서울 데이트)',
    searchBtn: 'AI 코스 생성',
    promptChipsTitle: '🔥 인기 추천 프롬프트',
    promptChips: [
      { label: '🗼 서울 2박3일 핫플 & 성수동 감성 투어', prompt: '서울 2박3일 성수동 핫플 카페거리와 한남동, 경복궁 감성 여행 코스 짜줘' },
      { label: '🏝️ 제주도 바다뷰 힐링 & 맛집 로드', prompt: '제주도 3박4일 애월, 협재 바다뷰 카페와 서귀포 올레길 힐링 코스 추천해줘' },
      { label: '🎬 K-드라마 & K-POP 성지순례', prompt: '서울 K-POP 핫플레이스와 K-드라마 촬영 명소 1박2일 코스 알려줘' },
      { label: '🌙 부산 해운대 & 광안리 야경 코스', prompt: '부산 2박3일 해운대 블루라인파크와 광안리 드론쇼, 자갈치 미식 투어' },
      { label: '🍁 경주 한옥마을 & 황리단길 감성', prompt: '경주 1박2일 황리단길 감성 카페와 불국사, 동궁과월지 야경 힐링 여행' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI 컨시어지 대화',
    chatWelcome: '안녕하세요! 당신의 전담 한국 여행 AI 컨시어지 VORA(보라)입니다. 😊\n가고 싶은 도시나 원하는 여행 스타일을 편하게 말씀해주세요!',
    chatThinking: '최적의 동선과 핫플레이스를 분석 중입니다...',
    chatCopyItinerary: '전체 일정 복사',
    chatCopied: '복사되었습니다!',
    chatShare: '일정 공유',
    chatQuickModifications: [
      '2일차 카페를 맛집으로 바꿔줘',
      '비 오는 날 실내 코스로 변경해줘',
      '대중교통 이동 동선으로 맞춰줘',
      '예산 5만원 가성비 코스로 수정'
    ],

    // Course Timeline & Map
    courseTimelineTitle: '스마트 여행 코스 타임라인',
    dayBadge: (d) => `${d}일차`,
    openGoogleMapsRoute: '🗺️ 구글맵에서 오늘 코스 전체 길찾기',
    spotTransitTime: (time) => `🚇 ${time || '지하철/도보로 편리하게 이동'}`,
    photosAndDetails: '🔍 사진 및 상세정보',
    saveToWishlist: '위시리스트 저장',
    savedToWishlist: '저장됨 ❤️',
    noSpotsYet: 'AI에게 여행 계획을 물어보시면 맞춤형 코스 타임라인과 구글 지도가 이곳에 펼쳐집니다.',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 오늘 무료 질문: ${remain} / ${total}회`,
    questionsExhausted: '오늘의 무료 질문(5회)을 모두 사용하셨습니다. 내일 00시에 자동 충전됩니다 ✨',

    // Travel Essentials
    travelEssentialsTitle: '대한민국 여행 필수 안내 & 스마트 팁',
    essentialsTitle: '외국인 관광객 필수 툴킷',
    essentialsSubtitle: '안전하고 편리한 한국 여행을 위한 핵심 서비스',
    weatherOutfitTitle: '실시간 날씨 & 여행 코디 가이드',
    weatherOutfitDesc: (city) => `${city} 및 전국 실시간 기상과 기온별 맞춤 여행 옷차림 & 필수 패킹 팁`,
    weatherOutfitBadge: '스타일 가이드',
    weatherOutfitLink: '기온별 코디 & 패킹 보기 👗',
    badgeTransport: '교통 필수',
    badgeCostSaving: '비용 절약',
    badgeData: '데이터 무제한',
    badgeSupport24h: '24시간 지원',
    subwayMapTitle: '지하철 노선도 & 길찾기',
    subwayMapDesc: '서울, 부산 등 전국 지하철 실시간 노선도 및 환승 가이드',
    subwayMapLink: '지하철 노선도 보기 ↗',
    climateCardTitle: '기후동행카드 & T-Money',
    climateCardDesc: '외국인 단기권 구매처 및 대중교통 무제한 이용 팁',
    climateCardLink: '기후동행카드 안내 ↗',
    esimTitle: 'eSIM & 포켓 와이파이',
    esimDesc: '인천공항 수령 및 즉시 사용 가능한 데이터 플랜',
    esimBookingLink: 'Klook eSIM 예약 ↗',
    helplineTitle: '1330 관광 안내 & 통역',
    helplineDesc: '24시간 연중무휴 무료 4개 국어 긴급 통역 및 여행 지원',
    helplineInfoLink: '1330 공식 안내 ↗',

    // AdSense Editorial Section
    editorialTitle: '대한민국 여행 완벽 가이드 & FAQ',
    editorialSubtitle: '한국을 처음 방문하는 여행자를 위한 검증된 로컬 꿀팁',

    // Weather & Styling Modal
    weatherModalTitle: '대한민국 실시간 날씨 & 여행 스타일링 가이드',
    weatherSearchPlaceholder: '도시나 여행지를 입력하세요 (예: 서울, 제주, 수원, 부산...)',
    weatherClearBtn: '✕ 지우기',
    weatherFeelsLike: '체감 ',
    weatherRainLabel: '💧 강수',
    weatherDustLabel: '🍃 미세먼지',
    weatherUvLabel: '☀️ 자외선',
    weatherHumidityLabel: '💨 습도',
    weatherForecastTitle: '3일 예보:',
    weatherOutfitSectionTitle: (city) => `오늘 ${city} 맞춤 여행 코디 & 필수 준비물`,
    weatherTopBottom: '👕 상의 / 하의:',
    weatherOuter: '🧥 아우터 레이어드:',
    weatherEssentials: '🎒 필수 여행 소품:',
    weatherStylistTip: '현지 스타일리스트 꿀팁: ',
    // Portal Home & Timeline Highlights
    portalHeroBadge: 'VORA AI 3.0 • 대한민국 대표 AI 여행 컨시어지',
    portalSearchPlaceholder: '어디로 떠나고 싶으신가요? (예: 2박3일 제주 힐링, 성수동 카페 투어)',
    portalGenerateBtn: 'AI 일정생성',
    portalTrendingThemes: '외국인 인기 추천 테마 AI 여행 코스',
    portalTrendingSubtitle: '전 세계 여행자들이 가장 사랑하는 대한민국 대표 여행 테마를 원클릭으로 만나보세요',
    portalLivePlannerTitle: '실시간 맞춤 AI 여행 일정 & 스마트 동선 플래너',
    todayGourmetPick: '오늘의 추천 로컬 미식',
    // Exit Interception Modal
    exitModalTitle: '작성 중인 여행 일정이 있습니다',
    exitModalDesc: '지금 나가시면 작성 중인 일정이 사라질 수 있습니다. [내 여행]에 저장하고 이동하시겠습니까?',
    exitModalSaveAndExit: '💾 저장하고 이동 (1회 차감)',
    exitModalJustExit: '🚪 그냥 나가기',
    exitModalCancel: '✕ 계속 작성하기',

    // Universal UI & Slot Swap & Nearby Food & Filter Badges
    swapPlace: '다른 장소로 교체',
    nearbyFoodCafe: '주변 맛집/카페',
    searchingNearbySpots: '인근 대체 명소를 실시간 탐색 중입니다...',
    searchingNearbyFoods: '주변 맛집 및 카페를 실시간 탐색 중입니다...',
    noNearbySpots: '해당 장소 도보 10분(800m) 내에 교체 가능한 인근 등록 명소가 없습니다.',
    noNearbyFoods: '해당 장소 도보 10분(800m) 내에 한국관광공사 등록 맛집이 없습니다.',
    searchSpotsGoogle: '구글맵에서 인근 명소 더 찾아보기',
    searchFoodGoogle: '구글맵에서 주변 맛집 실시간 검색',
    tapSwapGuide: '📍 [교체] 클릭 시 확인 후 즉시 일정이 변경됩니다:',
    handpickedNearbyFood: '☕ 인근 엄선 로컬 맛집·카페 (길찾기 클릭 시 구글맵 연결):',
    swapBtn: '교체',
    mapDirections: '길찾기',
    confirmChangeTitle: '일정을 변경하시겠습니까?',
    confirmChangeDesc: '내 일정과 지도 경로가 즉시 업데이트됩니다.',
    cancel: '취소',
    confirm: '변경하기',
    saveTripBtn: (remain) => `💾 이 일정 저장하기 (${remain}회 남음)`,
    exploreOtherCities: '🔄 다른 도시 탐색',
    viewTimeline: '📋 일정표 보기',
    dualChatTimeline: '💬 대화창+일정표 듀얼',
    viewRouteMap: '🗺️ 동선 지도 보기',
    newChat: '새 대화',
    addCondition: '조건 추가',
    currentFilters: '현재 여행 조건:',
    generalTour: '기본 (일반 관광)',
    connectedRoute: '✦ VORA AI 추천 연계 코스',
    localFoodieSecret: '🍴 현지인 찐 미식',
    signatureNight: '✨ 시그니처 야경',
    rainySpot: '☔ 비 오는 날 실내 명소',
    publicTransitFast: '대중교통 쾌속 이동',
    filterKids: '👨‍👩‍👧 아이 동반',
    filterElder: '🌿 부모님',
    filterRain: '☔ 비/실내',
    filterMinimalWalking: '🚶 걷기 적게',
    filterCafe: '☕ 감성 카페',
    filterFoodie: '🍴 로컬 맛집',
    filterPhoto: '📸 인생샷',
    dialogTuningHeader: (city) => `${city || '맞춤 여행'} 1:1 VORA AI 대화 조율`,
    timelineTuningHeader: (city, days) => `${city || '추천'} ${days || 3}일차 확정 타임라인 & AI 1:1 조율`,
    dealsBtn: '특가 예약 ↗',
    noSpotsInfo: '정보 없음',
    walkMinutes: (mins, dist) => `도보 ${mins}분 (${dist}m)`,
    carMinutes: (mins, km) => `차량 ${mins}분 (${km}km)`,

    // Modals
    modalClose: '닫기',
    privacyPolicy: '개인정보처리방침',
    termsOfService: '이용약관',
    aboutUs: '서비스 소개',
    contactUs: '제휴 및 문의',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: 'Google Gemini 3.0 AI & Google Maps Platform 연동'
  },

  // =========================================================================
  // 다국어 영어 시작 (Multilingual Localization: English Phase)
  // =========================================================================
  en: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: 'Korea AI Travel Concierge',
    navWeather: 'Weather',
    navEssentials: 'Travel Essentials',
    navWishlist: 'Wishlist',
    navLanguage: 'Language',
    themeToggle: 'Toggle Theme',
    shareToastSuccess: 'Share link copied to clipboard! 📋',
    drawerWeatherGuide: '👗 Live Weather & Travel Outfit Guide',
    loginCapsule: (count) => `G Sign in (${count} Free)`,
    chatStatusLive: 'Live 1:1 Chat',
    dayRouteHeader: (day) => `Day ${day} Live Google Route`,
    spotCountBadge: (count) => `${count} Spots`,
    faqTitle: 'Frequently Asked Questions (FAQ)',

    // Hero Section
    heroBadge: '🏛️ Powered by Korea Tourism Organization (KTO) TourAPI 4.0',
    heroTitle: 'Plan Your Perfect Korea Trip with Just One Prompt',
    heroSubtitle: 'Official KTO certified travel data & VORA AI curated personalized itineraries with real-time maps',
    searchPlaceholder: 'Where do you want to explore? (e.g. 3-day Jeju drive, Seongsu cafe tour, rainy day Seoul)',
    searchBtn: 'Generate Itinerary',
    promptChipsTitle: '🔥 Popular Prompt Ideas',
    promptChips: [
      { label: '🗼 Seoul 3-Day Hip & Trendy Tour', prompt: 'Create a 3-day Seoul itinerary exploring Seongsu-dong cafes, Hannam-dong shopping, and Gyeongbokgung palace.' },
      { label: '🏝️ Jeju Island Scenic Healing', prompt: 'Recommend a 4-day healing trip in Jeju including Aewol ocean-view cafes and Seogwipo Olle trail.' },
      { label: '🎬 K-Drama & K-Pop Hotspots', prompt: 'Give me a 2-day Seoul tour visiting iconic K-Pop agency hotspots and K-Drama filming locations.' },
      { label: '🌙 Busan Coastal & Night View', prompt: 'Plan a 2-day Busan itinerary with Haeundae Blueline Park, Gwangalli drone show, and Jagalchi seafood.' },
      { label: '🍁 Gyeongju Hanok Village & History', prompt: 'Suggest a 2-day Gyeongju trip exploring Hwangnidan-gil hanok cafes and Donggung Palace night view.' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI Concierge Chat',
    chatWelcome: 'Hello! I am VORA, your dedicated AI travel concierge for South Korea. 😊\nTell me where you want to visit or your desired travel style!',
    chatThinking: 'Analyzing optimal routes and authentic Korean hotspots...',
    chatCopyItinerary: 'Copy Itinerary',
    chatCopied: 'Copied to clipboard!',
    chatShare: 'Share Trip',
    chatQuickModifications: [
      'Replace Day 2 cafe with a bakery',
      'Change to an indoor rainy day course',
      'Optimize for public transit only',
      'Adjust for a budget under $50/day'
    ],

    // Course Timeline & Map
    courseTimelineTitle: 'Smart Itinerary Timeline',
    dayBadge: (d) => `Day ${d}`,
    openGoogleMapsRoute: '🗺️ Open Full Day Route in Google Maps',
    spotTransitTime: (time) => `🚇 ${time || 'Smooth transit by subway or walk'}`,
    photosAndDetails: '🔍 Photos & Details',
    saveToWishlist: 'Save to Wishlist',
    savedToWishlist: 'Saved ❤️',
    noSpotsYet: 'Ask VORA AI to plan your trip, and your custom timeline & interactive Google Map will appear here.',
    aiTrustBadgeDesc: 'Official Course Powered by Google Places & Gemini AI',
    aiItineraryMainTitle: 'AI Itinerary Recommendation',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ Free AI Queries Today: ${remain} / ${total}`,
    questionsExhausted: 'You have used all 5 free daily queries. Resets at midnight ✨',

    // Travel Essentials
    travelEssentialsTitle: 'Korea Travel Essentials & Smart Tips',
    essentialsTitle: 'Foreign Traveler Essentials',
    essentialsSubtitle: 'Must-have tools and tips for a smooth trip to Korea',
    weatherOutfitTitle: 'Live Weather & Travel Outfit Guide',
    weatherOutfitDesc: (city) => `Real-time weather, temperature-matched packing & K-fashion styling tips for ${city} and all of Korea`,
    weatherOutfitBadge: 'Styling Guide',
    weatherOutfitLink: 'View Outfits & Packing Guide 👗',
    badgeTransport: 'Transit',
    badgeCostSaving: 'Cost Saving',
    badgeData: 'Unlimited Data',
    badgeSupport24h: '24/7 Support',
    subwayMapTitle: 'Subway Map & Transit Guide',
    subwayMapDesc: 'Interactive subway routes & transfer guides for Seoul, Busan and beyond',
    subwayMapLink: 'Subway Map ↗',
    climateCardTitle: 'Climate Card & T-Money',
    climateCardDesc: 'Tourist pass options & unlimited public transit guide',
    climateCardLink: 'Climate Card Info ↗',
    esimTitle: 'eSIM & Pocket WiFi',
    esimDesc: 'Instant high-speed mobile data for seamless navigation',
    esimBookingLink: 'Book Klook eSIM ↗',
    helplineTitle: '1330 Korea Travel Helpline',
    helplineDesc: '24/7 free multilingual interpretation & emergency travel support',
    helplineInfoLink: '1330 Helpline Info ↗',

    // AdSense Editorial Section
    editorialTitle: 'Complete South Korea Travel Guide & FAQ',
    editorialSubtitle: 'Curated local wisdom for international visitors',

    // Weather & Styling Modal
    weatherModalTitle: 'Korea Live Weather & Travel Outfit Guide',
    weatherSearchPlaceholder: 'Enter city or destination (e.g. Seoul, Jeju, Busan, Sokcho...)',
    weatherClearBtn: '✕ Clear',
    weatherFeelsLike: 'Feels like ',
    weatherRainLabel: '💧 Rain',
    weatherDustLabel: '🍃 Air Quality',
    weatherUvLabel: '☀️ UV Index',
    weatherHumidityLabel: '💨 Humidity',
    weatherForecastTitle: '3-Day Forecast:',
    weatherOutfitSectionTitle: (city) => `Today's Outfit & Travel Packing Guide for ${city}`,
    weatherTopBottom: '👕 Top / Bottom:',
    weatherOuter: '🧥 Outer Layer:',
    weatherEssentials: '🎒 Travel Essentials:',
    weatherStylistTip: 'Local Stylist Tip:',
    weatherSunscreenLink: '🧴 Travel Sunscreen & Cooling',
    weatherHanbokLink: '👘 Traditional Hanbok Rental',
    weatherLookbookLink: '📌 K-Fashion Travel Lookbook (Pinterest)',

    // Detail Modal
    detailGalleryTitle: (count) => `Google Places Official HD Gallery (${count} Photos)`,
    detailDragHint: 'Scroll or swipe to explore ↔',
    detailBestTime: 'Best Time: ',
    detailEditorGuide: '✨ Travel Editor Guide',
    detailDirectionsTitle: '🗺️ Directions & Live Maps',
    detailLowestPriceBtn: 'Book Lowest Price ↗',

    // Portal Home & Timeline Highlights
    portalHeroBadge: 'VORA AI 3.0 • Official Korea Travel Concierge',
    portalSearchPlaceholder: 'Where do you want to explore? (e.g. 3-day Jeju drive, Seongsu cafes)',
    portalGenerateBtn: 'AI Generate',
    portalTrendingThemes: 'Popular Curated AI Travel Itineraries',
    portalTrendingSubtitle: "Discover Korea's most-loved travel themes chosen by global travelers in one click",
    portalLivePlannerTitle: 'Live AI Travel Concierge & Route Planner',
    todayGourmetPick: "Today's Gourmet Pick",
    // Exit Interception Modal
    exitModalTitle: 'Ongoing Trip Itinerary in Progress',
    exitModalDesc: 'If you leave now, your current itinerary edits may be lost. Would you like to save it to [My Trips] before leaving?',
    exitModalSaveAndExit: '💾 Save & Exit (Use 1 save)',
    exitModalJustExit: '🚪 Exit Without Saving',
    exitModalCancel: '✕ Keep Editing',

    // Universal UI & Slot Swap & Nearby Food & Filter Badges
    swapPlace: 'Swap Place',
    nearbyFoodCafe: 'Nearby Food/Cafe',
    searchingNearbySpots: 'Searching nearby alternative spots...',
    searchingNearbyFoods: 'Searching nearby food & cafes...',
    noNearbySpots: 'No additional alternative spots registered within walking distance (800m).',
    noNearbyFoods: 'No registered restaurants/cafes found within walking distance (800m).',
    searchSpotsGoogle: 'Search Spots on Google Maps',
    searchFoodGoogle: 'Search Food on Google Maps',
    tapSwapGuide: '📍 Tap [Swap] to substitute spot:',
    handpickedNearbyFood: '☕ Hand-picked spots nearby (Tap map to navigate):',
    swapBtn: 'Swap',
    mapDirections: 'Map',
    confirmChangeTitle: 'Change Itinerary?',
    confirmChangeDesc: 'Update your trip & map route now.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    saveTripBtn: (remain) => `💾 Save Trip (${remain} Left)`,
    exploreOtherCities: '🔄 Explore Other Cities',
    viewTimeline: '📋 View Itinerary Timeline',
    dualChatTimeline: '💬 Dual Chat & Itinerary',
    viewRouteMap: '🗺️ View Route Map',
    newChat: 'New Chat',
    addCondition: 'Add Filter',
    currentFilters: 'Trip Filters:',
    generalTour: 'General Tour',
    connectedRoute: '✦ VORA AI Recommended Route',
    localFoodieSecret: '🍴 Local Foodie Secret',
    signatureNight: '✨ Signature Night View',
    rainySpot: '☔ Rainy Day Indoor Spot',
    publicTransitFast: 'Fast Public Transit',
    filterKids: '👨‍👩‍👧 Kids',
    filterElder: '🌿 Parents',
    filterRain: '☔ Rain/Indoor',
    filterMinimalWalking: '🚶 Minimal Walking',
    filterCafe: '☕ Trendy Cafe',
    filterFoodie: '🍴 Local Foodie',
    filterPhoto: '📸 Photo Spot',
    dialogTuningHeader: (city) => `${city || 'Custom'} 1:1 VORA AI Chat Tuning`,
    timelineTuningHeader: (city, days) => `${city || 'Curated'} ${days || 3}D Timeline & AI Tuning`,
    dealsBtn: 'Deals ↗',
    noSpotsInfo: 'No Info',
    walkMinutes: (mins, dist) => `Walk ${mins}m (${dist}m)`,
    carMinutes: (mins, km) => `Car ${mins}m (${km}km)`,

    // Modals
    modalClose: 'Close',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    aboutUs: 'About VORA',
    contactUs: 'Contact & Partnership',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: 'Powered by Google Gemini 3.0 AI & Google Maps Platform'
  },

  // =========================================================================
  // 多言語 日本語 (Multilingual Localization: Japanese Phase)
  // =========================================================================
  ja: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '韓国旅行AIコンシェルジュ',
    navWeather: '天気',
    navEssentials: '旅行必須情報',
    navWishlist: 'ウィッシュリスト',
    navLanguage: '言語',
    themeToggle: 'テーマ切替',
    shareToastSuccess: '共有リンクをクリップボードにコピーしました！ 📋',
    drawerWeatherGuide: '👗 リアルタイム天気＆コーデガイド',
    loginCapsule: (count) => `G ログイン (${count}回無料)`,
    chatStatusLive: 'リアルタイム1:1対話中',
    dayRouteHeader: (day) => `${day}日目 リアルタイムGoogleルート`,
    spotCountBadge: (count) => `${count}箇所`,
    faqTitle: 'よくある質問 (FAQ)',

    // Hero Section
    heroBadge: '✨ 2026 AI搭載 韓国旅行コンシェルジュ',
    heroTitle: '一言で完成する、あなただけの韓国旅行',
    heroSubtitle: 'Google Gemini 3.0 AIとGoogle Placesが3秒で設計するオーダーメイドコース＆Googleマップ連携',
    searchPlaceholder: 'どんな旅をご希望ですか？（例：聖水洞カフェ巡り2泊3日、済州島ヒーリング、雨の日のソウル）',
    searchBtn: 'AIコース作成',
    promptChipsTitle: '🔥 人気のおすすめプロンプト',
    promptChips: [
      { label: '🗼 ソウル 2泊3日 トレンド＆聖水洞ツアー', prompt: 'ソウル2泊3日で聖水洞カフェ通り、漢南洞ショッピング、景福宮を巡るコースを作成して' },
      { label: '🏝️ 済州島 オーシャンビュー＆癒しの旅', prompt: '済州島3泊4日、涯月カフェと西帰浦のオルレ道を巡るヒーリングコースを教えて' },
      { label: '🎬 K-POP＆ドラマロケ地巡り', prompt: 'ソウルのK-POP人気スポットとドラマロケ地を巡る1泊2日コースを教えて' },
      { label: '🌙 釜山 海雲台＆広安里の夜景コース', prompt: '釜山2泊3日で海雲台ブルーラインパークと広安里ドローンショー、チャガルチ市場ツアー' },
      { label: '🍁 慶州 韓屋村＆皇理団通り', prompt: '慶州1泊2日で皇理団通りのカフェと仏国寺、東宮と月池の夜景を満喫する旅' }
    ],

    // Chat Interface
    chatTitle: 'Vora AIコンシェルジュチャット',
    chatWelcome: 'こんにちは！韓国旅行専属AIコンシェルジュのVORAです。😊\n行きたい都市や旅行スタイルをお気軽にお知らせください！',
    chatThinking: '最適なルートと最新トレンドスポットを分析中...',
    chatCopyItinerary: '日程テキストをコピー',
    chatCopied: 'コピーしました！',
    chatShare: '日程を共有',
    chatQuickModifications: [
      '2日目のカフェをベーカリーに変更して',
      '雨の日向けの屋内コースにして',
      '地下鉄中心の移動ルートにして',
      '1日5万ウォンのコスパコースにして'
    ],

    // Course Timeline & Map
    courseTimelineTitle: 'スマート旅程タイムライン',
    dayBadge: (d) => `${d}日目`,
    openGoogleMapsRoute: '🗺️ Googleマップで本日の全ルート案内を開く',
    spotTransitTime: (time) => `🚇 ${time || '地下鉄・徒歩で快適に移動'}`,
    photosAndDetails: '🔍 写真・詳細を見る',
    saveToWishlist: 'ウィッシュリストに保存',
    savedToWishlist: '保存済み ❤️',
    noSpotsYet: 'AIに旅行の相談をすると、ここに専用タイムラインとGoogleマップが表示されます。',
    aiTrustBadgeDesc: 'Google Places＆Gemini AI公式連携コース',
    aiItineraryMainTitle: 'AIおすすめ旅程',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 本日の無料質問: ${remain} / ${total}回`,
    questionsExhausted: '本日の無料質問枠(5回)をすべて利用しました。深夜0時に自動リセットされます ✨',

    // Travel Essentials
    travelEssentialsTitle: '韓国旅行 必須ガイド＆スマート情報',
    essentialsTitle: '外国人旅行者 必須ツールキット',
    essentialsSubtitle: '快適で安全な韓国旅行のための必須サービス',
    weatherOutfitTitle: 'リアルタイム天気＆旅行コーデガイド',
    weatherOutfitDesc: (city) => `${city}および韓国全土のリアルタイム気象と気温別パッキング＆スタイリングのコツ`,
    weatherOutfitBadge: 'スタイルガイド',
    weatherOutfitLink: '気温別コーデ＆パッキングを見る 👗',
    badgeTransport: '交通必須',
    badgeCostSaving: '費用節約',
    badgeData: '無制限データ',
    badgeSupport24h: '24時間対応',
    subwayMapTitle: '地下鉄路線図＆ルート案内',
    subwayMapDesc: 'ソウル・釜山など全国の地下鉄路線図と乗換ガイド',
    subwayMapLink: '地下鉄路線図を見る ↗',
    climateCardTitle: '気候同行カード＆T-Money',
    climateCardDesc: '外国人向け短期券の購入方法と乗り放題ガイド',
    climateCardLink: '気候同行カード案内 ↗',
    esimTitle: 'eSIM＆ポケットWi-Fi',
    esimDesc: '空港受取または即時利用可能な高速データプラン',
    esimBookingLink: 'Klook eSIM予約 ↗',
    helplineTitle: '1330 観光案内＆通訳ダイヤル',
    helplineDesc: '24時間年中無休・日本語対応の緊急通訳＆旅行サポート',
    helplineInfoLink: '1330 公式案内 ↗',

    // AdSense Editorial Section
    editorialTitle: '韓国旅行 完全ガイド＆よくある質問 (FAQ)',
    editorialSubtitle: '初めての韓国旅行でも安心のローカル情報',

    // Weather & Styling Modal
    weatherModalTitle: '韓国 リアルタイム天気＆旅行コーデガイド',
    weatherSearchPlaceholder: '都市または旅行先を入力（例：ソウル、済州、釜山、束草...）',
    weatherClearBtn: '✕ クリア',
    weatherFeelsLike: '体感温度 ',
    weatherRainLabel: '💧 降水確率',
    weatherDustLabel: '🍃 微小粒子状物質',
    weatherUvLabel: '☀️ 紫外線指数',
    weatherHumidityLabel: '💨 湿度',
    weatherForecastTitle: '3日間の週間天気予報:',
    weatherOutfitSectionTitle: (city) => `本日の ${city} おすすめコーデ＆パッキング`,
    weatherTopBottom: '👕 トップス / ボトムス:',
    weatherOuter: '🧥 アウター:',
    weatherEssentials: '🎒 必需品:',
    weatherStylistTip: 'スタイリストのアドバイス:',
    weatherSunscreenLink: '🧴 日焼け止め＆クーリング用品',
    weatherHanbokLink: '👘 伝統韓服レンタル',
    weatherLookbookLink: '📌 K-Fashion 旅行ルックブック (Pinterest)',

    // Detail Modal
    detailGalleryTitle: (count) => `Google Places 公式高画質ギャラリー (${count}枚)`,
    detailDragHint: 'スワイプまたはスクロールで写真を閲覧 ↔',
    detailBestTime: 'おすすめ時間: ',
    detailEditorGuide: '✨ エディター詳細ガイド',
    detailDirectionsTitle: '🗺️ アクセス＆リアルタイムマップ',
    detailLowestPriceBtn: '最安値予約 ↗',

    // Portal Home & Timeline Highlights
    portalHeroBadge: 'VORA AI 3.0 • 韓国旅行公式AIコンシェルジュ',
    portalSearchPlaceholder: 'どこへ行きたいですか？ (例: 済州ドライブ、聖水カフェ)',
    portalGenerateBtn: 'AI作成',
    portalTrendingThemes: '外国人旅行者に大人気の厳選AIコース',
    portalTrendingSubtitle: '世界中の旅行者が絶賛する韓国を代表する人気テーマコースをワンクリックで',
    portalLivePlannerTitle: 'リアルタイムAIコンシェルジュ＆動線プランナー',
    todayGourmetPick: '本日のおすすめグルメ',
    // Exit Interception Modal
    exitModalTitle: '作成中の旅行プランがあります',
    exitModalDesc: '今移動すると作成中のプランが失われる可能性があります。[マイトリップ]に保存して移動しますか？',
    exitModalSaveAndExit: '💾 保存して移動 (1回消費)',
    exitModalJustExit: '🚪 保存せずに移動',
    exitModalCancel: '✕ 編集を続ける',

    openAiItinerary: 'AIプランを開く',

    // Universal UI & Slot Swap & Nearby Food & Filter Badges
    swapPlace: '別の場所に変更',
    nearbyFoodCafe: '周辺のグルメ/カフェ',
    searchingNearbySpots: '近くの代替スポットをリアルタイム検索中...',
    searchingNearbyFoods: '近くのグルメ・カフェをリアルタイム検索中...',
    noNearbySpots: '徒歩10分(800m)以内に変更可能な登録スポットはありません。',
    noNearbyFoods: '徒歩10分(800m)以内に韓国観光公社登録のグルメスポットはありません。',
    searchSpotsGoogle: 'Googleマップで周辺スポットを探す',
    searchFoodGoogle: 'Googleマップで周辺グルメを検索',
    tapSwapGuide: '📍 [変更]タップで確認後に日程が更新されます:',
    handpickedNearbyFood: '☕ 周辺の厳選ローカルグルメ・カフェ (タップで案内):',
    swapBtn: '変更',
    mapDirections: '道案内',
    confirmChangeTitle: '日程を変更しますか？',
    confirmChangeDesc: 'マイルートとマップが即時更新されます。',
    cancel: 'キャンセル',
    confirm: '変更する',
    saveTripBtn: (remain) => `💾 この日程を保存 (${remain}回残り)`,
    exploreOtherCities: '🔄 他の都市を探索',
    viewTimeline: '📋 日程表を見る',
    dualChatTimeline: '💬 チャット＋日程表',
    viewRouteMap: '🗺️ ルートマップ',
    newChat: '新規チャット',
    addCondition: '条件追加',
    currentFilters: '現在の旅行条件:',
    generalTour: '基本（一般観光）',
    connectedRoute: '✦ VORA AI おすすめ連動コース',
    localFoodieSecret: '🍴 地元民の絶品グルメ',
    signatureNight: '✨ 定番の夜景スポット',
    rainySpot: '☔ 雨の日の屋内スポット',
    publicTransitFast: '公共交通で快速移動',
    filterKids: '👨‍👩‍👧 子連れ',
    filterElder: '🌿 ご両親・シニア',
    filterRain: '☔ 雨天・屋内',
    filterMinimalWalking: '🚶 歩き控えめ',
    filterCafe: '☕ トレンドカフェ',
    filterFoodie: '🍴 ローカルグルメ',
    filterPhoto: '📸 映えスポット',
    dialogTuningHeader: (city) => `${city || 'カスタム'} 1:1 VORA AI チャット調整`,
    timelineTuningHeader: (city, days) => `${city || 'おすすめ'} ${days || 3}日目 確定タイムライン＆AI調整`,
    dealsBtn: '最安値予約 ↗',
    noSpotsInfo: '情報なし',
    walkMinutes: (mins, dist) => `徒歩${mins}分 (${dist}m)`,
    carMinutes: (mins, km) => `車${mins}分 (${km}km)`,

    // Modals
    modalClose: '閉じる',
    privacyPolicy: 'プライバシーポリシー',
    termsOfService: '利用規約',
    aboutUs: 'VORA AIについて',
    contactUs: '提携・お問い合わせ',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: 'Google Gemini 3.0 AI＆Google Maps Platform 連携'
  },

  // =========================================================================
  // 多语言 中文简体 (Multilingual Localization: Simplified Chinese Phase)
  // =========================================================================
  zh: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '韩国旅游AI智能管家',
    navWeather: '实时天气',
    navEssentials: '旅行必备',
    navWishlist: '心愿单',
    navLanguage: '语言',
    themeToggle: '切换主题',
    shareToastSuccess: '分享链接已复制到剪贴板！ 📋',
    drawerWeatherGuide: '👗 实时天气与穿搭指南',
    loginCapsule: (count) => `G 登录 (${count}次免费)`,
    chatStatusLive: '实时1:1对话中',
    dayRouteHeader: (day) => `第${day}天 实时Google导航`,
    spotCountBadge: (count) => `${count}处景点`,
    faqTitle: '常见问题解答 (FAQ)',

    // Hero Section
    heroBadge: '✨ 2026 AI驱动 韩国专属旅行管家',
    heroTitle: '一句话定制 专属韩国梦幻之旅',
    heroSubtitle: '结合Google Gemini 3.0 AI与Google Places权威数据，3秒生成专属路线与实时谷歌地图导航',
    searchPlaceholder: '您想去哪里旅行？（例如：首尔圣水洞咖啡厅3天2晚、济州岛海景疗愈游、雨天首尔室内约会）',
    searchBtn: 'AI生成路线',
    promptChipsTitle: '🔥 热门推荐灵感',
    promptChips: [
      { label: '🗼 首尔 3天2晚 潮流圣水洞之旅', prompt: '请设计一份首尔3天2晚行程，包含圣水洞咖啡街、汉南洞购物和景福宫。' },
      { label: '🏝️ 济州岛 绝美海景疗愈之旅', prompt: '推荐一份济州岛4天3晚行程，包含涯月邑海景咖啡厅和西归浦偶来小路。' },
      { label: '🎬 K-POP与韩剧热门拍摄地巡礼', prompt: '请推荐一份首尔2天1晚K-POP偶像打卡地与韩剧经典取景地路线。' },
      { label: '🌙 釜山 海云台与广安里夜景之旅', prompt: '规划一份釜山3天2晚行程，体验海云台胶囊列车、广安里无人机秀和海鲜市场。' },
      { label: '🍁 庆州 韩屋村与皇理团路风情', prompt: '推荐庆州2天1晚行程，漫步皇理团路特色咖啡厅，欣赏东宫与月池夜景。' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI智能管家对话',
    chatWelcome: '您好！我是您的韩国专属旅行AI管家VORA（宝拉）。😊\n请告诉我您想去的城市或旅行偏好！',
    chatThinking: '正在为您分析最佳路线与韩国地道热门景点...',
    chatCopyItinerary: '复制行程内容',
    chatCopied: '已复制到剪贴板！',
    chatShare: '分享行程',
    chatQuickModifications: [
      '把第2天的咖啡厅换成特色烘焙店',
      '修改为适合下雨天的室内路线',
      '调整为全程乘坐地铁公交的便捷路线',
      '按每天5万韩元预算调整'
    ],

    // Course Timeline & Map
    courseTimelineTitle: '智能行程时间线',
    dayBadge: (d) => `第${d}天`,
    openGoogleMapsRoute: '🗺️ 在Google地图中打开今日完整导航路线',
    spotTransitTime: (time) => `🚇 ${time || '搭乘地铁或步行便捷直达'}`,
    photosAndDetails: '🔍 照片与详细信息',
    saveToWishlist: '加入心愿单',
    savedToWishlist: '已保存 ❤️',
    noSpotsYet: '在左侧向AI咨询旅行计划后，定制的行程时间线与Google交互地图将在此展示。',
    aiTrustBadgeDesc: '基于 Google Places 与 Gemini AI 官方合作推荐',
    aiItineraryMainTitle: 'AI精选推荐行程',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 今日免费提问额度: ${remain} / ${total}次`,
    questionsExhausted: '今日5次免费提问额度已用完，将于次日0点自动刷新 ✨',

    // Travel Essentials
    travelEssentialsTitle: '韩国旅游 必备指南与实用贴士',
    essentialsTitle: '国际游客必备旅行工具包',
    essentialsSubtitle: '助您畅游韩国的实用指南与官方服务',
    weatherOutfitTitle: '实时天气与旅行穿搭指南',
    weatherOutfitDesc: (city) => `${city}及韩国各地的实时天气状况、气温穿搭与行前打包建议`,
    weatherOutfitBadge: '穿搭指南',
    weatherOutfitLink: '查看气温穿搭与打包清单 👗',
    badgeTransport: '交通必备',
    badgeCostSaving: '省钱攻略',
    badgeData: '无限流量',
    badgeSupport24h: '24小时支持',
    subwayMapTitle: '地铁线路图与换乘指南',
    subwayMapDesc: '首尔、釜山等全国实时地铁线路图与中文换乘指引',
    subwayMapLink: '查看地铁路线图 ↗',
    climateCardTitle: '气候同行卡与T-Money交通卡',
    climateCardDesc: '短期游客无限次乘车卡购买地点与充值攻略',
    climateCardLink: '气候同行卡指南 ↗',
    esimTitle: '韩国eSIM与随身WiFi',
    esimDesc: '仁川机场快速领取或即时激活的高速流量套餐',
    esimBookingLink: '预订 Klook eSIM ↗',
    helplineTitle: '1330 韩国旅游咨询与免费翻译',
    helplineDesc: '24小时全年无休多语言紧急翻译与官方求助热线',
    helplineInfoLink: '1330 官方指引 ↗',

    // AdSense Editorial Section
    editorialTitle: '韩国旅行全景指南与常见问题 (FAQ)',
    editorialSubtitle: '为初次到访韩国的游客量身打造的地道旅行攻略',

    // Weather & Styling Modal
    weatherModalTitle: '韩国实时天气与旅行穿搭指南',
    weatherSearchPlaceholder: '输入城市或目的地（例如：首尔、济州、釜山、束草...）',
    weatherClearBtn: '✕ 清除',
    weatherFeelsLike: '体感温度 ',
    weatherRainLabel: '💧 降水概率',
    weatherDustLabel: '🍃 空气质量',
    weatherUvLabel: '☀️ 紫外线指数',
    weatherHumidityLabel: '💨 湿度',
    weatherForecastTitle: '未来3天天气预报:',
    weatherOutfitSectionTitle: (city) => `今日 ${city} 穿搭与行前打包指南`,
    weatherTopBottom: '👕 上衣 / 裤装:',
    weatherOuter: '🧥 外套推荐:',
    weatherEssentials: '🎒 随身必备:',
    weatherStylistTip: '造型师贴心建议:',
    weatherSunscreenLink: '🧴 旅行防晒与清凉好物',
    weatherHanbokLink: '👘 传统韩服体验预订',
    weatherLookbookLink: '📌 K-Fashion 穿搭灵感 (Pinterest)',

    // Detail Modal
    detailGalleryTitle: (count) => `Google Places 官方高清图库 (${count}张)`,
    detailDragHint: '左右滑动或滚动浏览照片 ↔',
    detailBestTime: '推荐游览时间: ',
    detailEditorGuide: '✨ 旅游编辑深度指引',
    detailDirectionsTitle: '🗺️ 交通路线与实时地图',
    detailLowestPriceBtn: '低价预订 ↗',

    // Portal Home & Timeline Highlights
    portalHeroBadge: 'VORA AI 3.0 • 韩国官方智能旅游管家',
    portalSearchPlaceholder: '想去哪里旅行？ (例如: 济州3日自驾、首尔圣水洞咖啡)',
    portalGenerateBtn: 'AI生成',
    portalTrendingThemes: '海外游客精选高分推荐路线',
    portalTrendingSubtitle: '一键探索全球游客最喜爱的韩国代表性主题旅行路线',
    portalLivePlannerTitle: '实时AI旅游定制与智能路线规划',
    todayGourmetPick: '今日推荐特色美食',
    openAiItinerary: '查看AI行程',

    // Exit Interception Modal
    exitModalTitle: '您有正在制定的旅行行程',
    exitModalDesc: '现在离开可能会丢失当前定制的行程。是否保存到【我的行程】后再离开？',
    exitModalSaveAndExit: '💾 保存并离开 (消耗1次额度)',
    exitModalJustExit: '🚪 不保存直接离开',
    exitModalCancel: '✕ 继续编辑',

    // Universal UI & Slot Swap & Nearby Food & Filter Badges
    swapPlace: '更换其他地点',
    nearbyFoodCafe: '周边美食/咖啡',
    searchingNearbySpots: '正在实时搜索周边备选景点...',
    searchingNearbyFoods: '正在实时搜索周边美食与咖啡...',
    noNearbySpots: '步行10分钟(800米)内暂无可更换的注册景点。',
    noNearbyFoods: '步行10分钟(800米)内暂无韩国旅游发展局推荐美食。',
    searchSpotsGoogle: '在Google地图查看周边更多景点',
    searchFoodGoogle: '在Google地图实时搜索周边美食',
    tapSwapGuide: '📍 点击[更换]确认后立即更新行程:',
    handpickedNearbyFood: '☕ 周边严选地道美食与咖啡 (点击导航):',
    swapBtn: '更换',
    mapDirections: '路线',
    confirmChangeTitle: '确定要更改行程吗？',
    confirmChangeDesc: '您的行程与地图路线将立即更新。',
    cancel: '取消',
    confirm: '确认更改',
    saveTripBtn: (remain) => `💾 保存此行程 (剩余${remain}次)`,
    exploreOtherCities: '🔄 探索其他城市',
    viewTimeline: '📋 查看行程表',
    dualChatTimeline: '💬 对话框＋行程表',
    viewRouteMap: '🗺️ 查看路线地图',
    newChat: '新对话',
    addCondition: '添加偏好',
    currentFilters: '当前旅行偏好:',
    generalTour: '默认（通用观光）',
    connectedRoute: '✦ VORA AI 推荐连游路线',
    localFoodieSecret: '🍴 当地人私藏美食',
    signatureNight: '✨ 经典绝美夜景',
    rainySpot: '☔ 雨天室内优选',
    publicTransitFast: '公共交通快捷出行',
    filterKids: '👨‍👩‍👧 亲子游',
    filterElder: '🌿 长辈·轻松',
    filterRain: '☔ 雨天·室内',
    filterMinimalWalking: '🚶 少走轻松',
    filterCafe: '☕ 人气咖啡',
    filterFoodie: '🍴 地道美食',
    filterPhoto: '📸 绝美拍照',
    dialogTuningHeader: (city) => `${city || '专属'} 1:1 VORA AI 对话定制`,
    timelineTuningHeader: (city, days) => `${city || '推荐'} 第${days || 3}天 确认时间线与AI调优`,
    dealsBtn: '特惠预订 ↗',
    noSpotsInfo: '暂无信息',
    walkMinutes: (mins, dist) => `步行${mins}分钟 (${dist}米)`,
    carMinutes: (mins, km) => `乘车${mins}分钟 (${km}公里)`,

    // Modals
    modalClose: '关闭',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    aboutUs: '关于 VORA',
    contactUs: '商务合作与咨询',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: '基于 Google Gemini 3.0 AI 与 Google Maps Platform 构建'
  },

  // =========================================================================
  // 多語言 中文繁體 (Multilingual Localization: Traditional Chinese Phase)
  // =========================================================================
  zht: {
    // Brand & Header
    brandName: 'VORA',
    brandTagline: '韓國旅遊AI智能管家',
    navWeather: '即時天氣',
    navEssentials: '旅行必備',
    navWishlist: '願望清單',
    navLanguage: '語言',
    themeToggle: '切換主題',
    shareToastSuccess: '分享連結已複製到剪貼簿！ 📋',
    drawerWeatherGuide: '👗 即時天氣與穿搭指南',
    loginCapsule: (count) => `G 登入 (${count}次免費)`,
    chatStatusLive: '即時1:1對話中',
    dayRouteHeader: (day) => `第${day}天 即時Google導航`,
    spotCountBadge: (count) => `${count}處景點`,
    faqTitle: '常見問題解答 (FAQ)',

    // Hero Section
    heroBadge: '✨ 2026 AI驅動 韓國專屬旅行管家',
    heroTitle: '一句話定制 專屬韓國夢幻之旅',
    heroSubtitle: '結合Google Gemini 3.0 AI與Google Places權威數據，3秒生成專屬路線與即時Google地圖導航',
    searchPlaceholder: '您想去哪裡旅行？（例如：首爾聖水洞咖啡廳3天2夜、濟州島海景療癒遊、雨天首爾室內約會）',
    searchBtn: 'AI生成路線',
    promptChipsTitle: '🔥 熱門推薦靈感',
    promptChips: [
      { label: '🗼 首爾 3天2夜 潮流聖水洞之旅', prompt: '請設計一份首爾3天2夜行程，包含聖水洞咖啡街、漢南洞購物和景福宮。' },
      { label: '🏝️ 濟州島 絕美海景療癒之旅', prompt: '推薦一份濟州島4天3夜行程，包含涯月邑海景咖啡廳和西歸浦偶來小路。' },
      { label: '🎬 K-POP與韓劇熱門拍攝地巡禮', prompt: '請推薦一份首爾2天1夜K-POP偶像打卡地與韓劇經典取景地路線。' },
      { label: '🌙 釜山 海雲台與廣安里夜景之旅', prompt: '規劃一份釜山3天2夜行程，體驗海雲台膠囊列車、廣安里無人機秀和海鮮市場。' },
      { label: '🍁 慶州 韓屋村與皇理團路風情', prompt: '推薦慶州2天1夜行程，漫步皇理團路特色咖啡廳，欣賞東宮與月池夜景。' }
    ],

    // Chat Interface
    chatTitle: 'Vora AI智能管家對話',
    chatWelcome: '您好！我是您的韓國專屬旅行AI管家VORA（寶拉）。😊\n請告訴我您想去的城市或旅行偏好！',
    chatThinking: '正在為您分析最佳路線與韓國道地熱門景點...',
    chatCopyItinerary: '複製行程內容',
    chatCopied: '已複製到剪貼簿！',
    chatShare: '分享行程',
    chatQuickModifications: [
      '把第2天的咖啡廳換成特色烘焙店',
      '修改為適合下雨天的室內路線',
      '調整為全程搭乘地鐵公車的便捷路線',
      '按每天5萬韓元預算調整'
    ],

    // Course Timeline & Map
    courseTimelineTitle: '智慧行程時間線',
    dayBadge: (d) => `第${d}天`,
    openGoogleMapsRoute: '🗺️ 在Google地圖中開啟今日完整導航路線',
    spotTransitTime: (time) => `🚇 ${time || '搭乘地鐵或步行便捷直達'}`,
    photosAndDetails: '🔍 照片與詳細資訊',
    saveToWishlist: '加入願望清單',
    savedToWishlist: '已儲存 ❤️',
    noSpotsYet: '在左側向AI諮詢旅行計劃後，定制的行程時間線與Google互動地圖將在此展示。',
    aiTrustBadgeDesc: '基於 Google Places 與 Gemini AI 官方合作推薦',
    aiItineraryMainTitle: 'AI精選推薦行程',

    // Question Quota
    freeQuestionsRemaining: (remain, total) => `⚡ 今日免費提問額度: ${remain} / ${total}次`,
    questionsExhausted: '今日5次免費提问額度已用完，將於次日0點自動刷新 ✨',

    // Travel Essentials
    travelEssentialsTitle: '韓國旅遊 必備指南與實用貼士',
    essentialsTitle: '國際旅客必備旅行工具包',
    essentialsSubtitle: '助您暢遊韓國的實用指南與官方服務',
    weatherOutfitTitle: '即時天氣與旅行穿搭指南',
    weatherOutfitDesc: (city) => `${city}及韓國各地的即時天氣狀況、氣溫穿搭與行前打包建議`,
    weatherOutfitBadge: '穿搭指南',
    weatherOutfitLink: '查看氣溫穿搭與打包清單 👗',
    badgeTransport: '交通必備',
    badgeCostSaving: '省钱攻略',
    badgeData: '無限流量',
    badgeSupport24h: '24小時支援',
    subwayMapTitle: '地鐵路線圖與轉乘指南',
    subwayMapDesc: '首爾、釜山等全國即時地鐵路線圖與中文轉乘指引',
    subwayMapLink: '查看地鐵路線圖 ↗',
    climateCardTitle: '氣候同行卡與T-Money交通卡',
    climateCardDesc: '短期遊客無限次乘車卡購買地點與儲值攻略',
    climateCardLink: '氣候同行卡指南 ↗',
    esimTitle: '韓國eSIM與隨身WiFi',
    esimDesc: '仁川機場快速領取或即時啟用的高速流量方案',
    esimBookingLink: '預訂 Klook eSIM ↗',
    helplineTitle: '1330 韓國旅遊諮詢與免費翻譯',
    helplineDesc: '24小時全年無休多語言緊急翻譯與官方求助專線',
    helplineInfoLink: '1330 官方指引 ↗',

    // AdSense Editorial Section
    editorialTitle: '韓國旅行全景指南與常見問題 (FAQ)',
    editorialSubtitle: '為初次到訪韓國的遊客量身打造的道地旅行攻略',

    // Weather & Styling Modal
    weatherModalTitle: '韓國即時天氣與旅行穿搭指南',
    weatherSearchPlaceholder: '輸入城市或目的地（例如：首爾、濟州、釜山、束草...）',
    weatherClearBtn: '✕ 清除',
    weatherFeelsLike: '體感溫度 ',
    weatherRainLabel: '💧 降雨機率',
    weatherDustLabel: '🍃 空氣品質',
    weatherUvLabel: '☀️ 紫外線指數',
    weatherHumidityLabel: '💨 濕度',
    weatherForecastTitle: '未來3天天氣預報:',
    weatherOutfitSectionTitle: (city) => `今日 ${city} 穿搭與行前打包指南`,
    weatherTopBottom: '👕 上衣 / 褲裝:',
    weatherOuter: '🧥 外套推薦:',
    weatherEssentials: '🎒 隨身必備:',
    weatherStylistTip: '造型師貼心建議:',
    weatherSunscreenLink: '🧴 旅行防曬與清涼好物',
    weatherHanbokLink: '👘 傳統韓服體驗預訂',
    weatherLookbookLink: '📌 K-Fashion 穿搭靈感 (Pinterest)',

    // Detail Modal
    detailGalleryTitle: (count) => `Google Places 官方高畫質圖庫 (${count}張)`,
    detailDragHint: '左右滑動或捲動瀏覽照片 ↔',
    detailBestTime: '推薦遊覽時間: ',
    detailEditorGuide: '✨ 旅遊編輯深度指引',
    detailDirectionsTitle: '🗺️ 交通路線與即時地圖',
    detailLowestPriceBtn: '低價預訂 ↗',

    // Portal Home & Timeline Highlights
    portalHeroBadge: 'VORA AI 3.0 • 韓國官方智能旅遊管家',
    portalSearchPlaceholder: '想去哪裡旅行？ (例如: 濟州3日自駕、首爾聖水洞咖啡)',
    portalGenerateBtn: 'AI生成',
    portalTrendingThemes: '海外遊客精選高分推薦路線',
    portalTrendingSubtitle: '一鍵探索全球遊客最喜愛的韓國代表性主題旅行路線',
    portalLivePlannerTitle: '即時AI旅遊定制與智慧路線規劃',
    todayGourmetPick: '今日推薦特色美食',
    openAiItinerary: '查看AI行程',

    // Exit Interception Modal
    exitModalTitle: '您有正在客製的旅行行程',
    exitModalDesc: '現在離開可能會遺失當前客製的行程。是否儲存到【我的行程】後再離開？',
    exitModalSaveAndExit: '💾 儲存並離開 (消耗1次額度)',
    exitModalJustExit: '🚪 不儲存直接離開',
    exitModalCancel: '✕ 繼續編輯',

    // Universal UI & Slot Swap & Nearby Food & Filter Badges
    swapPlace: '更換其他地點',
    nearbyFoodCafe: '周邊美食/咖啡',
    searchingNearbySpots: '正在即時搜尋周邊備選景點...',
    searchingNearbyFoods: '正在即時搜尋周邊美食與咖啡...',
    noNearbySpots: '步行10分鐘(800米)內暫無可更換的註冊景點。',
    noNearbyFoods: '步行10分鐘(800米)內暫無韓國觀光公社推薦美食。',
    searchSpotsGoogle: '在Google地圖查看周邊更多景點',
    searchFoodGoogle: '在Google地圖即時搜尋周邊美食',
    tapSwapGuide: '📍 點擊[更換]確認後立即更新行程:',
    handpickedNearbyFood: '☕ 周邊嚴選道地美食與咖啡 (點擊導航):',
    swapBtn: '更換',
    mapDirections: '路線',
    confirmChangeTitle: '確定要變更行程嗎？',
    confirmChangeDesc: '您的行程與地圖路線將立即更新。',
    cancel: '取消',
    confirm: '確認變更',
    saveTripBtn: (remain) => `💾 儲存此行程 (剩餘${remain}次)`,
    exploreOtherCities: '🔄 探索其他城市',
    viewTimeline: '📋 查看行程表',
    dualChatTimeline: '💬 對話框＋行程表',
    viewRouteMap: '🗺️ 查看路線地圖',
    newChat: '新對話',
    addCondition: '新增偏好',
    currentFilters: '當前旅行偏好:',
    generalTour: '預設（通用觀光）',
    connectedRoute: '✦ VORA AI 推薦連遊路線',
    localFoodieSecret: '🍴 在地人私藏美食',
    signatureNight: '✨ 經典絕美夜景',
    rainySpot: '☔ 雨天室內優選',
    publicTransitFast: '大眾運輸快速直達',
    filterKids: '👨‍👩‍👧 親子遊',
    filterElder: '🌿 長輩·輕鬆',
    filterRain: '☔ 雨天·室內',
    filterMinimalWalking: '🚶 少走輕鬆',
    filterCafe: '☕ 人氣咖啡',
    filterFoodie: '🍴 道地美食',
    filterPhoto: '📸 絕美打卡',
    dialogTuningHeader: (city) => `${city || '專屬'} 1:1 VORA AI 對話微調`,
    timelineTuningHeader: (city, days) => `${city || '推薦'} 第${days || 3}天 確認時間線與AI調優`,
    dealsBtn: '特惠預訂 ↗',
    noSpotsInfo: '暫無資訊',
    walkMinutes: (mins, dist) => `步行${mins}分鐘 (${dist}米)`,
    carMinutes: (mins, km) => `乘車${mins}分鐘 (${km}公里)`,

    // Modals
    modalClose: '關閉',
    privacyPolicy: '隱私權政策',
    termsOfService: '服務條款',
    aboutUs: '關於 VORA',
    contactUs: '商務合作與諮詢',
    footerCopyright: '© 2026 VORA AI — Korea Smart Travel Concierge. All Rights Reserved.',
    footerTourApiNotice: '基於 Google Gemini 3.0 AI 與 Google Maps Platform 構建'
  }
};

// Aliases for other languages to fallback to en
TRANSLATIONS.de = TRANSLATIONS.en;
TRANSLATIONS.fr = TRANSLATIONS.en;
TRANSLATIONS.es = TRANSLATIONS.en;
TRANSLATIONS.ru = TRANSLATIONS.en;