/**
 * Master City Spots Database for South Korea (VORA AI Pure Dynamic Knowledge)
 * 
 * Includes:
 * 1. Rich 5-day zone pools for major Korean destinations (Seoul, Jeju, Busan, Suwon, Gyeongju, Gangneung, Jeonju, etc.)
 * 2. Accurate metadata: dwellMinutes, zone, slotCategory, lat, lng, photo, sig, desc
 * 3. Daily regional themes and iconic foodRecommendations (pure sightseeing separation)
 */

export const MASTER_SPOTS_DB = {
  '서울': [
    // Zone 1: 종로 / 고궁 / 전통 (Jongno Heritage)
    { id: 'seoul_z1_1', name: '경복궁', nameEn: 'Gyeongbokgung Palace', dwellMinutes: 90, zone: 1, slotCategory: 'morning', cat: 'History & Culture', theme: '조선 왕실의 정취와 향원정', desc: '조선 왕조 제일의 법궁으로 근정전의 웅장함과 향원정 연못의 고즈넉한 풍경을 감상할 수 있습니다.', photo: '📸 향원정 연못 반영 & 한복 스냅', sig: '👑 왕실 한복 대여 & 고궁 산책', lat: 37.5796, lng: 126.9770 },
    { id: 'seoul_z1_2', name: '국립민속박물관', nameEn: 'National Folk Museum of Korea', dwellMinutes: 50, zone: 1, slotCategory: 'morning', cat: 'History & Culture', theme: '한국 전통 생활사와 7080 추억의 거리', desc: '한국인의 사계절 전통 생활 문화와 옛 정취를 느낄 수 있는 복원 거리가 조성되어 있습니다.', photo: '📸 7080 추억의 거리 레트로 스냅', sig: '🏺 전통 민속 유물 & 레트로 사진', lat: 37.5815, lng: 126.9790 },
    { id: 'seoul_z1_3', name: '인사동 쌈지길', nameEn: 'Insadong Ssamziegil', dwellMinutes: 60, zone: 1, slotCategory: 'afternoon', cat: 'Trendy Street', theme: '전통 공예와 나선형 아트 골목', desc: '한국 전통 공예품과 아기자기한 디자인 숍들이 나선형 계단을 따라 이어지는 문화 명소입니다.', photo: '📸 쌈지길 중앙 정원 & 개성주악 디저트', sig: '🍵 전통 오미자차 & 개성주악', lat: 37.5743, lng: 126.9848 },
    { id: 'seoul_z1_4', name: '북촌한옥마을', nameEn: 'Bukchon Hanok Village', dwellMinutes: 70, zone: 1, slotCategory: 'afternoon', cat: 'Hanok Heritage', theme: '기와지붕 골목과 도시 파노라마', desc: '조선 시대 양반들의 거주지로 백 년의 역사를 품은 고즈넉한 기와지붕 골목길입니다.', photo: '📸 북촌 6경 기와지붕 사이로 보이는 서울 시내', sig: '📸 돌담길 힐링 산책 & 한옥 골든아워', lat: 37.5826, lng: 126.9836 },
    { id: 'seoul_z1_5', name: '광화문광장', nameEn: 'Gwanghwamun Square', dwellMinutes: 45, zone: 1, slotCategory: 'evening', cat: 'Night View', theme: '역사 광장과 야간 분수 조명', desc: '세종대왕상과 이순신 장군상이 자리한 도심 속 열린 광장으로 저녁 조명이 아름답습니다.', photo: '📸 경복궁 광화문 야경 & 세종대왕상 조명', sig: '🌙 광화문 야간 산책 & 세종문화회관', lat: 37.5716, lng: 126.9768 },

    // Zone 2: 성수 / 서울숲 / 트렌드 (Seongsu Lifestyle)
    { id: 'seoul_z2_1', name: '디올 성수', nameEn: 'Dior Seongsu Concept Store', dwellMinutes: 45, zone: 2, slotCategory: 'morning', cat: 'Trendy Spot', theme: '파리 감성의 건축 파사드와 팝업', desc: '성수동의 랜드마크로 떠오른 유리 온실 모티브의 화려한 건축물과 팝업 쇼룸입니다.', photo: '📸 디올 성수 황금빛 건축 파사드 인증샷', sig: '✨ 럭셔리 컨셉 쇼룸 & 건축물 사진', lat: 37.5446, lng: 127.0560 },
    { id: 'seoul_z2_2', name: '성수동 카페거리', nameEn: 'Seongsu Cafe Street', dwellMinutes: 60, zone: 2, slotCategory: 'afternoon', cat: 'Trendy Cafe', theme: '붉은 벽돌 팩토리와 아티잔 베이커리', desc: '옛 공장 건물을 감각적으로 리모델링한 대형 베이커리 카페와 플래그십 스토어가 가득합니다.', photo: '📸 빈티지 벽돌 카페 & 시그니처 소금빵', sig: '☕ 아인슈페너 & 명란 소금빵', lat: 37.5435, lng: 127.0570 },
    { id: 'seoul_z2_3', name: '서울숲', nameEn: 'Seoul Forest Park', dwellMinutes: 75, zone: 2, slotCategory: 'afternoon', cat: 'Scenic Nature', theme: '도심 속 거대 생태 숲과 거울연못', desc: '울창한 은행나무 숲과 잔디광장, 사슴 방사장이 있는 서울 대표 힐링 자연 공원입니다.', photo: '📸 서울숲 거울연못 메타세콰이어 반영', sig: '🧺 잔디밭 피크닉 & 은행나무 숲길 걷기', lat: 37.5443, lng: 127.0374 },
    { id: 'seoul_z2_4', name: '언더스탠드에비뉴', nameEn: 'Under Stand Avenue', dwellMinutes: 40, zone: 2, slotCategory: 'afternoon', cat: 'Shopping & Leisure', theme: '알록달록 컨테이너 문화 쇼핑 거리', desc: '친환경 컨테이너로 조성된 청년 창업 편집숍과 아트 갤러리가 모여 있습니다.', photo: '📸 컬러풀 컨테이너 골목 포토존', sig: '🛍️ 로컬 디자인 굿즈 & 젤라또', lat: 37.5412, lng: 127.0401 },
    { id: 'seoul_z2_5', name: 'N서울타워', nameEn: 'N Seoul Tower', dwellMinutes: 80, zone: 2, slotCategory: 'evening', cat: 'Night View', theme: '남산 360도 파노라마 야경과 사랑의 자물쇠', desc: '서울의 중심 남산 꼭대기에서 도시 전체의 화려한 석양과 반짝이는 야경을 한눈에 조망합니다.', photo: '📸 타워 전망대 선셋 & 사랑의 자물쇠 데크', sig: '🗼 360도 서울 야경 & 남산 케이블카', lat: 37.5512, lng: 126.9882 },

    // Zone 3: 용산 / 여의도 / K-컬처 (Yongsan & Yeouido)
    { id: 'seoul_z3_1', name: '하이브 인사이트', nameEn: 'HYBE Insight Landmark', dwellMinutes: 60, zone: 3, slotCategory: 'morning', cat: 'K-POP Landmark', theme: '글로벌 K-POP 문화와 미디어 아트', desc: '전 세계 음악 팬들의 성지로 K-POP 아티스트들의 음악적 유산과 전시를 경험할 수 있습니다.', photo: '📸 대형 미디어 아트 월 & 뮤직 포토존', sig: '🎵 아티스트 공식 굿즈 & 사운드 갤러리', lat: 37.5283, lng: 126.9685 },
    { id: 'seoul_z3_2', name: '용리단길 감성 카페거리', nameEn: 'Yongridan-gil Cafe Street', dwellMinutes: 50, zone: 3, slotCategory: 'afternoon', cat: 'Trendy Cafe', theme: '이국적인 골목 감성과 핫플레이스', desc: '베트남, 홍콩, 유럽 감성의 독특한 카페와 맛집들이 옹기종기 모여 있는 트렌디한 골목입니다.', photo: '📸 이국적인 외관 카페 & 베이커리 쇼케이스', sig: '☕ 바닐라빈 라떼 & 에그타르트', lat: 37.5312, lng: 126.9710 },
    { id: 'seoul_z3_3', name: '더현대 서울', nameEn: 'The Hyundai Seoul & Sounds Forest', dwellMinutes: 80, zone: 3, slotCategory: 'afternoon', cat: 'Shopping & Leisure', theme: '5층 실내 정원 사운즈포레스트와 K-패션', desc: '자연 채광이 쏟아지는 5층 실내 숲과 글로벌 트렌드를 이끄는 최신 팝업 쇼핑몰입니다.', photo: '📸 5층 사운즈 포레스트 실내 정원 뷰', sig: '🛍️ 지하 2층 K-패션 팝업 & 지하 1층 미식 홀', lat: 37.5259, lng: 126.9284 },
    { id: 'seoul_z3_4', name: '여의도 한강공원', nameEn: 'Yeouido Hangang Park', dwellMinutes: 70, zone: 3, slotCategory: 'evening', cat: 'Night View', theme: '시원한 강바람과 낭만 한강 라면', desc: '탁 트인 한강을 바라보며 즉석 라면과 치킨을 즐길 수 있는 서울 시민 최고의 힐링 공간입니다.', photo: '📸 한강 일몰 & 마포대교 야간 조명', sig: '🧺 즉석 한강 라면 & 선셋 돗자리 피크닉', lat: 37.5270, lng: 126.9325 },

    // Zone 4: 익선동 / 동대문 / 낙산 (Retro Alleys & Design)
    { id: 'seoul_z4_1', name: '익선동 한옥거리', nameEn: 'Ikseon-dong Hanok Alleys', dwellMinutes: 60, zone: 4, slotCategory: 'morning', cat: 'Hanok Heritage', theme: '100년 한옥 골목과 감성 디저트', desc: '좁은 골목길 사이로 감각적인 한옥 카페, 브런치 다이닝, 플라워 숍이 어우러진 명소입니다.', photo: '📸 익선동 한옥 처마 골목길 스냅', sig: '☕ 가마솥 수플레 팬케이크 & 크림 라떼', lat: 37.5742, lng: 126.9893 },
    { id: 'seoul_z4_2', name: '동대문 디자인 플라자 (DDP)', nameEn: 'Dongdaemun Design Plaza (DDP)', dwellMinutes: 70, zone: 4, slotCategory: 'afternoon', cat: 'History & Culture', theme: '자하 하디드의 미래형 유선형 건축', desc: '세계적인 건축가 자하 하디드가 설계한 우주선 모양의 비정형 건축물과 디자인 뮤지엄입니다.', photo: '📸 DDP 유선형 은빛 외관 & 야간 미디어 조명', sig: '🎨 디자인 전시회 & K-패션 쇼룸', lat: 37.5665, lng: 127.0090 },
    { id: 'seoul_z4_3', name: '낙산공원 성곽길', nameEn: 'Naksan Park Seoul City Wall', dwellMinutes: 70, zone: 4, slotCategory: 'evening', cat: 'Night View', theme: '은은한 성곽 조명과 서울 도심 파노라마', desc: '조선 한양도성을 따라 은은한 조명이 켜진 성곽길을 걸으며 서울의 낭만적인 밤 풍경을 감상합니다.', photo: '📸 성곽 실루엣 사이로 빛나는 도심 야경', sig: '🌙 로맨틱 성곽길 야경 산책 & 대학로 데이트', lat: 37.5804, lng: 127.0076 },

    // Zone 5: 한남 / 국립중앙박물관 / 반포 (Art & River Sunset)
    { id: 'seoul_z5_1', name: '국립중앙박물관', nameEn: 'National Museum of Korea', dwellMinutes: 90, zone: 5, slotCategory: 'morning', cat: 'History & Culture', theme: '오천 년 역사의 국보와 사유의 방', desc: '한국의 유구한 역사와 국보 반가사유상을 고요하게 감상할 수 있는 세계적인 박물관입니다.', photo: '📸 사유의 방 반가사유상 & 거울못 청자정', sig: '🏺 사유의 방(반가사유상) 관람 & 거울못 산책', lat: 37.5240, lng: 126.9803 },
    { id: 'seoul_z5_2', name: '리움미술관 & 한남동', nameEn: 'Leeum Museum of Art & Hannam-dong', dwellMinutes: 80, zone: 5, slotCategory: 'afternoon', cat: 'Trendy Spot', theme: '현대 미술의 정수와 프리미엄 라이프스타일', desc: '세계적인 현대 미술품 컬렉션과 한남동의 고급스러운 디자이너 부티크 거리를 즐깁니다.', photo: '📸 리움 로툰다 나선형 계단 & 현대 조형물', sig: '☕ 한남동 스페셜티 드립 커피 & 브런치', lat: 37.5385, lng: 127.0003 },
    { id: 'seoul_z5_3', name: '반포 한강공원 달빛무지개분수', nameEn: 'Banpo Hangang Park Moonlight Rainbow Fountain', dwellMinutes: 70, zone: 5, slotCategory: 'evening', cat: 'Night View', theme: '기네스 등재 세계 최장 교량 분수쇼', desc: '음악에 맞춰 오색 무지개 물줄기가 쏟아지는 분수쇼와 세빛섬 야경을 즐길 수 있습니다.', photo: '📸 달빛무지개분수 라이트쇼 & 세빛섬 야경', sig: '🌊 세빛섬 테라스 산책 & 한강 야경 감상', lat: 37.5103, lng: 126.9960 }
  ],

  '수원': [
    // Zone 1: 수원화성 / 방화수류정 / 행궁동
    { id: 'suwon_z1_1', name: '수원화성 방화수류정', nameEn: 'Banghwasuryujeong Pavilion', dwellMinutes: 80, zone: 1, slotCategory: 'morning', cat: 'UNESCO Heritage', theme: '용연 연못과 조선 최고의 정자 풍경', desc: '유네스코 세계문화유산 수원화성의 백미로, 용연 연못을 내려다보는 정자의 자태가 압권입니다.', photo: '📸 용연 연못에 비친 방화수류정 반영', sig: '🧺 잔디밭 피크닉 & 성곽 둘레길 산책', lat: 37.2891, lng: 127.0194 },
    { id: 'suwon_z1_2', name: '화성행궁', nameEn: 'Hwaseong Haenggung Palace', dwellMinutes: 60, zone: 1, slotCategory: 'morning', cat: 'History & Culture', theme: '정조대왕의 효심이 깃든 임시 궁궐', desc: '조선 왕실의 임시 궁궐로 화려한 봉수당과 전통 무예24기 시연을 관람할 수 있습니다.', photo: '📸 화성행궁 신풍루 정문 & 궁궐 전경', sig: '👑 궁궐 스탬프 투어 & 소원나무 리본', lat: 37.2842, lng: 127.0142 },
    { id: 'suwon_z1_3', name: '행리단길 감성 카페거리', nameEn: 'Haengnidan-gil Cafe Street', dwellMinutes: 60, zone: 1, slotCategory: 'afternoon', cat: 'Trendy Cafe', theme: '성곽 옆 레트로 한옥 카페와 소품샵', desc: '성곽길을 따라 옛 주택을 개조한 감성 카페, 베이커리, 아기자기한 독립서점이 이어집니다.', photo: '📸 성곽 뷰 루프탑 테라스 & 감성 디저트', sig: '☕ 시그니처 흑임자 라떼 & 수플레 팬케이크', lat: 37.2830, lng: 127.0150 },
    { id: 'suwon_z1_4', name: '플라잉수원', nameEn: 'Flying Suwon Helium Balloon', dwellMinutes: 50, zone: 1, slotCategory: 'evening', cat: 'Night View', theme: '150m 상공에서 내려다보는 성곽 야경', desc: '헬륨 기구를 타고 하늘 높이 올라가 불빛이 켜진 웅장한 수원화성 전체를 360도로 조망합니다.', photo: '📸 상공에서 내려다본 수원화성 불빛 라인', sig: '🎈 열기구 비행 체험 & 성곽 야경 감상', lat: 37.2872, lng: 127.0225 },

    // Zone 2: 장안문 / 미술관 / 통닭거리
    { id: 'suwon_z2_1', name: '수원시장안문', nameEn: 'Janganmun Gate', dwellMinutes: 50, zone: 2, slotCategory: 'morning', cat: 'History & Culture', theme: '대한민국 최대 규모의 웅장한 북문', desc: '우리나라 성문 중 가장 웅장한 크기를 자랑하며 둥근 옹성이 성문을 든든하게 감싸고 있습니다.', photo: '📸 장안문 옹성 파노라마 & 성곽 잔디', sig: '🚶 장안문 성벽 안쪽 아치길 걷기', lat: 37.2885, lng: 127.0125 },
    { id: 'suwon_z2_2', name: '수원시립미술관 (SUMA)', nameEn: 'Suwon Museum of Art', dwellMinutes: 60, zone: 2, slotCategory: 'afternoon', cat: 'History & Culture', theme: '전통 궁궐과 어우러진 현대 미술 공간', desc: '화성행궁 바로 옆에 위치하여 모던한 건축과 수준 높은 현대 미술 전시를 감상할 수 있습니다.', photo: '📸 미술관 옥상에서 바라본 화성행궁 기와 뷰', sig: '🎨 현대 기획 전시 & 디자인 아트숍', lat: 37.2842, lng: 127.0142 },
    { id: 'suwon_z2_3', name: '수원 통닭거리', nameEn: 'Suwon Fried Chicken Street', dwellMinutes: 70, zone: 2, slotCategory: 'afternoon', cat: 'Local Gourmet', theme: '가마솥 통닭과 원조 왕갈비통닭', desc: '대형 가마솥에 바삭하게 튀겨낸 고소한 옛날 통닭과 달콤 짭조름한 수원왕갈비통닭의 원조 거리입니다.', photo: '📸 가마솥에 튀겨지는 바삭한 통닭', sig: '🍗 원조 왕갈비통닭 & 시원한 생맥주', lat: 37.2798, lng: 127.0165 },
    { id: 'suwon_z2_4', name: '팔달산 서장대 야경', nameEn: 'Seojangdae Night View on Paldalsan', dwellMinutes: 70, zone: 2, slotCategory: 'evening', cat: 'Night View', theme: '수원화성 최고 정상에서 보는 도심 야경', desc: '팔달산 정상 군사 지휘소였던 서장대에서 사방으로 뻗어 나가는 성곽 조명과 시내를 조망합니다.', photo: '📸 서장대 처마 사이로 빛나는 수원 야경', sig: '🌙 팔달산 솔숲 산책 & 서장대 선셋', lat: 37.2818, lng: 127.0118 },

    // Zone 3: 스타필드 수원 / 별마당도서관 / 일월수목원
    { id: 'suwon_z3_1', name: '스타필드 수원 별마당도서관', nameEn: 'Starfield Suwon Library', dwellMinutes: 80, zone: 3, slotCategory: 'morning', cat: 'Shopping & Leisure', theme: '4개 층 웅장한 높이의 오픈 라이브러리', desc: '웅장한 4층 규모의 서가가 시선을 압도하며 최신 패션 팝업과 글로벌 라이프스타일을 만납니다.', photo: '📸 별마당도서관 4층 대형 서가 중심 인증샷', sig: '📚 별마당도서관 포토존 & 고메스트리트', lat: 37.2978, lng: 126.9912 },
    { id: 'suwon_z3_2', name: '일월수목원', nameEn: 'Ilwol Arboretum', dwellMinutes: 70, zone: 3, slotCategory: 'afternoon', cat: 'Scenic Nature', theme: '유리온실과 사계절 다채로운 정원', desc: '도심 속 대형 유리온실과 수변 식물이 어우러져 평화로운 산책과 힐링을 선사합니다.', photo: '📸 대형 유리온실 열대 식물 배경 스냅', sig: '🌿 온실 산책로 & 수목원 힐링 티타임', lat: 37.2960, lng: 126.9740 },
    { id: 'suwon_z3_3', name: '광교호수공원 프라이부르크전망대', nameEn: 'Gwanggyo Lake Park & Freiburg Observatory', dwellMinutes: 70, zone: 3, slotCategory: 'evening', cat: 'Night View', theme: '화려한 수변 데크로드와 야경 명소', desc: '대한민국 최대 규모의 도심 호수공원으로 호숫가를 따라 펼쳐지는 수변 조명이 환상적입니다.', photo: '📸 프라이부르크 전망대에서 본 호수 야경', sig: '☕ 호수 뷰 테라스 카페 & 수변 달빛 산책', lat: 37.2844, lng: 127.0673 }
  ],

  '제주': [
    // Zone 1: 애월 / 한담 / 서부 해안
    { id: 'jeju_z1_1', name: '애월 한담해변 산책로', nameEn: 'Aewol Handam Coastal Trail', dwellMinutes: 70, zone: 1, slotCategory: 'morning', cat: 'Scenic Ocean', theme: '에메랄드빛 바다와 현무암 해안길', desc: '구불구불한 현무암 바위 사이로 맑은 에메랄드빛 바다를 따라 걷는 제주 서부 최고 힐링 산책로입니다.', photo: '📸 투명한 에메랄드 바다와 해안 데크길', sig: '🌊 해안길 산책 & 투명 카약 체험', lat: 33.4623, lng: 126.3110 },
    { id: 'jeju_z1_2', name: '애월 카페거리', nameEn: 'Aewol Cafe Street', dwellMinutes: 60, zone: 1, slotCategory: 'afternoon', cat: 'Trendy Cafe', theme: '탁 트인 오션뷰 테라스와 디저트', desc: '바다 바로 앞 통유리창과 야외 테라스에서 파도 소리를 들으며 달콤한 디저트를 맛봅니다.', photo: '📸 통창 오션뷰 & 한라봉 시그니처 음료', sig: '☕ 한라봉 주스 & 제주 흑돼지 도넛', lat: 33.4610, lng: 126.3105 },
    { id: 'jeju_z1_3', name: '협재해수욕장 & 비양도', nameEn: 'Hyeopjae Beach & Biyangdo Island', dwellMinutes: 75, zone: 1, slotCategory: 'afternoon', cat: 'Scenic Ocean', theme: '은빛 모래사장과 에메랄드빛 비양도 뷰', desc: '조개껍데기가 섞인 은빛 백사장과 얕고 투명한 바다 너머로 비양도가 그림처럼 떠 있습니다.', photo: '📸 비양도 배경 에메랄드 바다 포토존', sig: '🏖️ 모래사장 힐링 & 해변 피크닉', lat: 33.3941, lng: 126.2397 },
    { id: 'jeju_z1_4', name: '신창풍차해안도로 선셋', nameEn: 'Sinchang Windmill Coastal Road Sunset', dwellMinutes: 60, zone: 1, slotCategory: 'evening', cat: 'Night View', theme: '거대한 흰색 풍차와 붉은 노을', desc: '바다 한가운데 서 있는 거대한 해상 풍차들과 바다를 붉게 물들이는 환상적인 일몰 명소입니다.', photo: '📸 일몰 실루엣 풍차 해상 데크길', sig: '🌅 풍차 해안 드라이브 & 노을 감상', lat: 33.3421, lng: 126.1742 },

    // Zone 2: 성산 / 동부 / 비자림
    { id: 'jeju_z2_1', name: '성산일출봉', nameEn: 'Seongsan Ilchulbong Tuff Cone', dwellMinutes: 90, zone: 2, slotCategory: 'morning', cat: 'UNESCO Heritage', theme: '유네스코 세계자연유산 거대 분화구', desc: '바다 위로 우뚝 솟은 거대한 화산 분화구로 정상에서 바라보는 푸른 바다 파노라마가 장관입니다.', photo: '📸 분화구 정상 파노라마 & 광치기 해변 뷰', sig: '🍊 신선한 착즙 한라봉 주스 & 해녀 물질', lat: 33.4581, lng: 126.9426 },
    { id: 'jeju_z2_2', name: '비자림', nameEn: 'Bijarim Nutmeg Forest', dwellMinutes: 80, zone: 2, slotCategory: 'afternoon', cat: 'Scenic Nature', theme: '천년 비자나무 숲과 붉은 화산송이길', desc: '수령 500~800년의 비자나무들이 빽빽하게 우거져 피톤치드를 온몸으로 느끼는 치유의 숲입니다.', photo: '📸 붉은 화산송이 흙길과 울창한 초록 숲', sig: '🌲 맨발 숲길 걷기 & 피톤치드 삼림욕', lat: 33.4912, lng: 126.8115 },
    { id: 'jeju_z2_3', name: '월정리해변 카페거리', nameEn: 'Woljeongri Beach & Colorful Chairs', dwellMinutes: 60, zone: 2, slotCategory: 'evening', cat: 'Trendy Cafe', theme: '알록달록 해변 의자와 오션뷰 카페', desc: '모래사장 위에 놓인 감성적인 색색의 의자와 트렌디한 당근 케이크 카페들이 늘어서 있습니다.', photo: '📸 바다 앞 오색 의자 인증샷', sig: '🍰 구좌 유기농 당근 케이크 & 말차 라떼', lat: 33.5562, lng: 126.7958 },

    // Zone 3: 중문 / 서귀포 남부
    { id: 'jeju_z3_1', name: '대포주상절리대', nameEn: 'Daepo Jusangjeolli Cliff', dwellMinutes: 60, zone: 3, slotCategory: 'morning', cat: 'Scenic Nature', theme: '육각형 현무암 돌기둥과 부서지는 파도', desc: '용암이 식으면서 빚어낸 웅장한 육각형 돌기둥 병풍 사이로 짙푸른 파도가 솟구칩니다.', photo: '📸 육각형 주상절리 기둥과 솟구치는 파도', sig: '🌊 해안 절벽 전망대 관람', lat: 33.2380, lng: 126.4253 },
    { id: 'jeju_z3_2', name: '오설록 티 뮤지엄', nameEn: 'Osulloc Tea Museum & Green Tea Field', dwellMinutes: 70, zone: 3, slotCategory: 'afternoon', cat: 'Trendy Cafe', theme: '끝없이 펼쳐진 초록빛 유기농 차밭', desc: '초록빛 녹차밭 산책과 함께 진한 녹차 소프트아이스크림과 롤케이크를 맛보는 복합 문화 공간입니다.', photo: '📸 광활한 초록 녹차밭 중앙 포토존', sig: '🍵 오설록 녹차 아이스크림 & 롤케이크', lat: 33.3060, lng: 126.2895 },
    { id: 'jeju_z3_3', name: '서귀포 매일올레시장', nameEn: 'Seogwipo Maeil Olle Market', dwellMinutes: 75, zone: 3, slotCategory: 'evening', cat: 'Local Gourmet', theme: '활기찬 야시장과 흑돼지 야식 투어', desc: '달콤한 딱새우회, 흑돼지 김치말이, 마늘통닭 등 제주의 신선한 로컬 미식이 가득한 전통 야시장입니다.', photo: '📸 활기찬 야시장 골목 & 불쇼 야식', sig: '🍢 흑돼지 말이 꼬치, 딱새우회 & 모닥치기', lat: 33.2494, lng: 126.5638 }
  ],

  '부산': [
    // Zone 1: 해운대 / 블루라인파크 / 광안리
    { id: 'busan_z1_1', name: '해운대 블루라인파크 스카이캡슐', nameEn: 'Haeundae Blueline Park Sky Capsule', dwellMinutes: 70, zone: 1, slotCategory: 'morning', cat: 'Activity & View', theme: '바다 위를 달리는 컬러풀 레트로 캡슐', desc: '해안 절벽을 따라 공중에 떠서 푸른 바다를 내려다보며 달리는 부산 최고의 인기 체험입니다.', photo: '📸 푸른 바다를 배경으로 달리는 색색의 스카이캡슐', sig: '🚊 해안 스카이캡슐 탑승 & 청사포 뷰', lat: 35.1587, lng: 129.1604 },
    { id: 'busan_z1_2', name: '청사포 다릿돌전망대', nameEn: 'Cheongsapo Daritdol Observatory', dwellMinutes: 50, zone: 1, slotCategory: 'afternoon', cat: 'Scenic Ocean', theme: '투명 유리 스카이워크와 쌍둥이 등대', desc: '바다 위로 시원하게 뻗은 투명 유리 바닥 전망대로 발아래로 부서지는 파도를 느낄 수 있습니다.', photo: '📸 투명 스카이워크 & 빨간/하얀 쌍둥이 등대', sig: '☕ 청사포 오션뷰 루프탑 카페', lat: 35.1610, lng: 129.1915 },
    { id: 'busan_z1_3', name: '광안리해수욕장 광안대교 야경', nameEn: 'Gwangalli Beach & Gwangan Bridge Night View', dwellMinutes: 75, zone: 1, slotCategory: 'evening', cat: 'Night View', theme: '다이아몬드 브릿지 조명과 해변 펍', desc: '밤바다 위를 수놓는 화려한 광안대교 조명과 시원한 바닷바람 속 해변 펍 문화를 즐깁니다.', photo: '📸 광안대교 다이아몬드 조명 & 모래사장 반영', sig: '🍺 오션뷰 수제맥주 & 광안리 드론 라이트쇼', lat: 35.1532, lng: 129.1186 },

    // Zone 2: 감천문화마을 / 자갈치 / 용두산
    { id: 'busan_z2_1', name: '감천문화마을 어린왕자', nameEn: 'Gamcheon Culture Village & Little Prince', dwellMinutes: 80, zone: 2, slotCategory: 'morning', cat: 'Hotspot', theme: '한국의 산토리니 파스텔 계단식 마을', desc: '언덕을 따라 늘어선 파스텔톤 집들과 벽화 골목, 어린왕자 조형물이 반겨주는 명소입니다.', photo: '📸 난간에 앉은 어린왕자와 파스텔 마을 파노라마', sig: '☕ 마을 전망대 카페 & 부산 씨앗호떡', lat: 35.0975, lng: 129.0106 },
    { id: 'busan_z2_2', name: '자갈치시장 & BIFF 광장', nameEn: 'Jagalchi Fish Market & BIFF Square', dwellMinutes: 60, zone: 2, slotCategory: 'afternoon', cat: 'Local Gourmet', theme: '살아 숨 쉬는 수산시장과 길거리 미식', desc: '국내 최대 수산시장의 활기와 함께 BIFF 광장의 고소한 마가린 씨앗호떡을 맛봅니다.', photo: '📸 싱싱한 수산물 수조 & 활기찬 항구 풍경', sig: '🐟 모듬 생선구이 백반 & 남포동 씨앗호떡', lat: 35.0968, lng: 129.0306 },
    { id: 'busan_z2_3', name: '용두산공원 부산 다이아몬드타워', nameEn: 'Busan Diamond Tower & Yongdusan Park', dwellMinutes: 60, zone: 2, slotCategory: 'evening', cat: 'Night View', theme: '부산 원도심과 항구가 한눈에 보이는 전망대', desc: '타워 전망대에 올라 부산항 대교와 원도심의 반짝이는 야경을 360도로 감상합니다.', photo: '📸 타워 전망대에서 본 부산항대교 조명', sig: '🗼 360도 원도심 야경 조망 & 광복동 쇼핑', lat: 35.1005, lng: 129.0325 },

    // Zone 3: 영도 / 흰여울 / 피아크
    { id: 'busan_z3_1', name: '흰여울문화마을 해안터널', nameEn: 'Huinnyeoul Culture Village & Ocean Tunnel', dwellMinutes: 80, zone: 3, slotCategory: 'morning', cat: 'Hotspot', theme: '절벽 위 흰 담장 마을과 바다 포토존', desc: '영화 변호인 촬영지로 유명한 절벽 해안 마을로 해안터널 실루엣 사진이 유명합니다.', photo: '📸 해안터널 안에서 바다를 배경으로 한 실루엣 샷', sig: '☕ 절벽 위 오션뷰 카페에서 아이스 아메리카노', lat: 35.0785, lng: 129.0450 },
    { id: 'busan_z3_2', name: '국립해양박물관', nameEn: 'National Maritime Museum of Korea', dwellMinutes: 60, zone: 3, slotCategory: 'afternoon', cat: 'History & Culture', theme: '거대 원통형 수족관과 해양 문화', desc: '바다를 마주한 웅장한 박물관으로 거대한 원통 수족관과 해양 유물을 무료로 관람할 수 있습니다.', photo: '📸 원통형 대형 수족관 가오리 먹이주기', sig: '🐠 대형 수족관 관람 & 부산항 야외 데크 산책', lat: 35.0780, lng: 129.0800 },
    { id: 'busan_z3_3', name: '피아크 복합문화공간', nameEn: 'P.ARK Cultural Center & Cafe', dwellMinutes: 70, zone: 3, slotCategory: 'evening', cat: 'Trendy Cafe', theme: '부산항이 내려다보이는 초대형 오션뷰 카페', desc: '선박을 닮은 압도적인 크기의 현대 건축물에서 스페셜티 커피와 갓 구운 빵을 즐깁니다.', photo: '📸 스타디움 계단식 좌석에서 본 부산항 뷰', sig: '🥐 명란 바게트 & 오션 스페셜티 드립 커피', lat: 35.0880, lng: 129.0700 }
  ]
};

export const CITY_THEMES_MAP = {
  '서울': [
    { day: 1, theme: '조선 왕실의 정취와 전통 거리', themeEn: 'Royal Joseon Heritage & Historic Alleys', transitTip: '지하철 3호선 안국역/경복궁역 일대 도보 10~15분 동선', food: { dishName: '삼계탕 & 궁중 비빔밥', dishNameEn: 'Ginseng Chicken Soup & Bibimbap', description: '원기 회복에 좋은 깊고 진한 한방 삼계탕과 정갈한 나물 비빔밥', descriptionEn: 'Deep restorative ginseng chicken broth and royal-style mixed rice with fresh herbs' } },
    { day: 2, theme: '트렌디 핫플 성수와 남산 선셋', themeEn: 'Trendy Seongsu & Romantic Namsan Sunset', transitTip: '지하철 2호선 성수역/뚝섬역 인근 도보 및 남산 순환버스', food: { dishName: '성수 감자탕 & 소금빵', dishNameEn: 'Seongsu Pork Backbone Stew & Salt Bread', description: '진하고 칼칼한 국물의 감자탕과 갓 구운 버터 풍미의 바삭한 소금빵', descriptionEn: 'Savory rich pork backbone hotpot paired with crispy golden artisan butter bread' } },
    { day: 3, theme: 'K-POP 문화의 성지와 한강 피크닉', themeEn: 'K-POP Mecca & Hangang Sunset Picnic', transitTip: '지하철 5호선 여의나루역 및 용산역 인근 이동', food: { dishName: '여의도 불고기 & 즉석 한강 라면', dishNameEn: 'Yeouido Bulgogi & Hangang Instant Ramen', description: '달콤 짭조름한 뚝배기 불고기와 강바람 맞으며 먹는 보글보글 한강 라면', descriptionEn: 'Tender marinated sweet soy beef paired with piping hot lakeside instant noodles' } },
    { day: 4, theme: '레트로 한옥 골목과 미래형 DDP', themeEn: 'Retro Hanok Alleys & Futuristic DDP', transitTip: '지하철 1/3/5호선 종로3가역 및 2/4/5호선 DDP역', food: { dishName: '광장시장 마약김밥 & 녹두빈대떡', dishNameEn: 'Gwangjang Market Mung Bean Pancake & Gimbap', description: '겉은 바삭하고 속은 촉촉한 맷돌 녹두전과 중독성 강한 마약김밥', descriptionEn: 'Crispy stone-ground golden mung bean pancakes and iconic bite-sized seaweed rolls' } },
    { day: 5, theme: '오천 년 역사의 숨결과 반포 무지개분수', themeEn: 'National Treasures & Moonlight Rainbow Fountain', transitTip: '지하철 4호선 이촌역 및 3/7/9호선 고속터미널역', food: { dishName: '이촌동 메밀소바 & 반포 한강 치맥', dishNameEn: 'Buckwheat Soba & Banpo Riverside Chimaek', description: '깔끔하고 시원한 메밀국수와 시원한 강변에서 즐기는 바삭한 치킨과 맥주', descriptionEn: 'Refreshing chilled buckwheat noodles and crispy riverside fried chicken with draft beer' } }
  ],
  '수원': [
    { day: 1, theme: '수원화성 성곽과 행궁동 감성 투어', themeEn: 'Suwon Hwaseong Fortress & Haengnidan-gil', transitTip: '화성행궁 중심 도보 10분 내 인근 성곽길 동선', food: { dishName: '수원 왕갈비탕 & 가마솥 통닭', dishNameEn: 'Suwon King Galbi Soup & Fried Chicken', description: '커다란 소갈비가 통째로 들어간 맑고 진한 갈비탕과 바삭한 가마솥 통닭', descriptionEn: 'Rich slow-simmered beef short rib soup and legendary crispy cauldron fried chicken' } },
    { day: 2, theme: '장안문 웅장한 북문과 가마솥 통닭거리', themeEn: 'Janganmun Grand Gate & Chicken Street', transitTip: '장안문에서 화홍문, 통닭거리로 이어지는 수원천 산책로', food: { dishName: '원조 왕갈비통닭', dishNameEn: 'Original King Galbi Seasoned Chicken', description: '달콤 짭짤한 갈비 소스에 갓 튀긴 치킨을 볶아낸 수원의 명물 통닭', descriptionEn: 'Crispy fried chicken tossed in sweet and savory Suwon beef rib barbecue sauce' } },
    { day: 3, theme: '스타필드 별마당과 광교호수공원 야경', themeEn: 'Starfield Suwon & Gwanggyo Lake Night View', transitTip: '화서역 스타필드 및 신분당선 광교중앙역 이동', food: { dishName: '광교 호수 뷰 브런치 파스타', dishNameEn: 'Gwanggyo Lakeside Artisan Pasta', description: '호수를 바라보며 즐기는 신선한 해산물 바질 파스타와 수제 화덕 피자', descriptionEn: 'Fresh seafood basil pesto pasta and wood-fired artisan pizza with lake panoramas' } }
  ],
  '제주': [
    { day: 1, theme: '애월 에메랄드 해변과 신창 풍차 노을', themeEn: 'Aewol Emerald Coast & Windmill Sunset', transitTip: '제주 서부 일주도로 해안 드라이브 코스', food: { dishName: '제주 흑돼지 근고기 & 해물라면', dishNameEn: 'Jeju Black Pork BBQ & Seafood Ramen', description: '육즙 가득 두툼한 제주 흑돼지 구이와 신선한 꽃게, 문어가 듬뿍 들어간 라면', descriptionEn: 'Juicy thick charcoal-grilled black pork paired with spicy seafood crab ramen' } },
    { day: 2, theme: '성산일출봉 분화구와 천년 비자나무 숲', themeEn: 'Seongsan Sunrise Crater & Ancient Nutmeg Forest', transitTip: '제주 동부 번영로 및 해안도로 연결 코스', food: { dishName: '성산 갈치조림 & 전복죽', dishNameEn: 'Braised Hairtail Fish & Abalone Porridge', description: '매콤달콤한 양념에 졸여낸 두툼한 은갈치 조림과 고소한 전복 내장죽', descriptionEn: 'Spicy braised silver hairtail fish hotpot with rich creamy green abalone porridge' } },
    { day: 3, theme: '중문 주상절리 절경과 서귀포 야시장', themeEn: 'Jusangjeolli Cliff & Night Street Food', transitTip: '서귀포 중문관광단지 및 서귀포 시내 중심 동선', food: { dishName: '서귀포 딱새우회 & 흑돼지 말이', dishNameEn: 'Sweet Red Shrimp Sashimi & Black Pork Roll', description: '입안에서 사르르 녹는 달콤한 딱새우회와 불향 가득한 흑돼지 야채말이', descriptionEn: 'Sweet fresh raw red shrimp sashimi and flame-torched black pork vegetable rolls' } }
  ],
  '부산': [
    { day: 1, theme: '해운대 스카이캡슐과 광안대교 야경', themeEn: 'Haeundae Sky Capsule & Gwangan Bridge Night View', transitTip: '해운대 미포에서 송정, 광안리 해변으로 이어지는 동부 해안선', food: { dishName: '부산 돼지국밥 & 광안리 활어회', dishNameEn: 'Busan Pork Soup & Gwangalli Fresh Sashimi', description: '뽀얗고 진하게 우려낸 뜨끈한 돼지국밥과 바다 앞에서 맛보는 싱싱한 활어회', descriptionEn: 'Deep slow-boiled pork bone broth soup and super fresh raw fish sashimi by the sea' } },
    { day: 2, theme: '감천문화마을과 활기찬 자갈치시장', themeEn: 'Gamcheon Pastel Village & Jagalchi Harbor', transitTip: '지하철 1호선 남포역/자갈치역 중심 원도심 투어', food: { dishName: '자갈치 생선구이 백반 & 씨앗호떡', dishNameEn: 'Jagalchi Grilled Fish & Sweet Seed Hotteok', description: '노릇노릇 구워낸 제철 모듬 생선구이와 바삭하고 달콤한 고소한 씨앗호떡', descriptionEn: 'Crispy hot grilled fish platter served with steamed rice and sweet nut-filled pancake' } },
    { day: 3, theme: '흰여울 해안 절벽과 초대형 피아크 뷰', themeEn: 'Huinnyeoul Cliff Village & P.ARK Ocean View', transitTip: '영도 해안 순환 버스 및 도보 이동', food: { dishName: '영도 조개구이 & 해녀 해산물', dishNameEn: 'Yeongdo Charcoal Clam BBQ & Fresh Seafood', description: '파도 소리를 들으며 숯불에 구워 먹는 신선한 가리비와 해녀가 갓 잡은 해삼/멍게', descriptionEn: 'Charcoal-grilled fresh scallops by the waves and freshly caught sea delicacies' } }
  ]
};
