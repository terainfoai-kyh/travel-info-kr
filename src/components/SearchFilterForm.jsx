import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale/ko';
import { enUS } from 'date-fns/locale/en-US';
import { ja } from 'date-fns/locale/ja';
import { zhCN } from 'date-fns/locale/zh-CN';
import { de } from 'date-fns/locale/de';
import { fr } from 'date-fns/locale/fr';
import { es } from 'date-fns/locale/es';
import { ru } from 'date-fns/locale/ru';
import { useState } from 'react';
import { Search, Calendar, MapPin, Compass, User, Users, Sparkles, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { REGION_META, API_SERVICE_TYPES } from '../services/apiConfig';
import { TRANSLATIONS } from '../i18n/translations';

registerLocale('ko', ko);
registerLocale('en', enUS);
registerLocale('ja', ja);
registerLocale('zh', zhCN);
registerLocale('de', de);
registerLocale('fr', fr);
registerLocale('es', es);
registerLocale('ru', ru);

export default function SearchFilterForm({ filters, setFilters, onSearch, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getBadgeI18n = (type, value) => {
    const curLang = lang || 'ko';
    if (type === 'region') {
      const map = {
        '전국': { en: 'All Korea', ja: '全国', zh: '全国', zht: '全國', de: 'Ganz Korea', fr: 'Toute la Corée', es: 'Toda Corea', ru: 'Вся Корея' },
        '서울': { en: 'Seoul', ja: 'ソウル', zh: '首尔', zht: '首爾', de: 'Seoul', fr: 'Séoul', es: 'Seúl', ru: 'Сеул' },
        '제주': { en: 'Jeju', ja: '済州', zh: '济州', zht: '濟州', de: 'Jeju', fr: 'Jeju', es: 'Jeju', ru: 'Чеджу' },
        '부산': { en: 'Busan', ja: '釜山', zh: '釜山', zht: '釜山', de: 'Busan', fr: 'Busan', es: 'Busan', ru: 'Пусан' },
        '강원': { en: 'Gangwon', ja: '江原', zh: '江原', zht: '江原', de: 'Gangwon', fr: 'Gangwon', es: 'Gangwon', ru: 'Кангвон' },
        '경주': { en: 'Gyeongju', ja: '慶州', zh: '庆州', zht: '慶州', de: 'Gyeongju', fr: 'Gyeongju', es: 'Gyeongju', ru: 'Кёнджу' },
        '전주': { en: 'Jeonju', ja: '全州', zh: '全州', zht: '全州', de: 'Jeonju', fr: 'Jeonju', es: 'Jeonju', ru: 'Чонджу' },
        '인천': { en: 'Incheon', ja: '仁川', zh: '仁川', zht: '仁川', de: 'Incheon', fr: 'Incheon', es: 'Incheon', ru: 'Инчхон' },
        '경기': { en: 'Gyeonggi', ja: '京畿', zh: '京畿', zht: '京畿', de: 'Gyeonggi', fr: 'Gyeonggi', es: 'Gyeonggi', ru: 'Кёнги' }
      };
      return map[value]?.[curLang] || value;
    }

    if (type === 'theme') {
      const map = {
        '전체': { en: 'All Themes', ja: 'すべてのテーマ', zh: '所有主题', zht: '所有主題', de: 'Alle Themen', fr: 'Tous les thèmes', es: 'Todos los temas', ru: 'Все темы' },
        '자연/힐링': { en: 'Nature / Healing', ja: '自然 / ヒーリング', zh: '自然 / 疗愈', zht: '自然 / 療癒', de: 'Natur / Erholung', fr: 'Nature / Détente', es: 'Naturaleza / Relax', ru: 'Природа / Отдых' },
        '역사/문화': { en: 'History / Culture', ja: '歴史 / 文化', zh: '历史 / 文化', zht: '歷史 / 文化', de: 'Geschichte / Kultur', fr: 'Histoire / Culture', es: 'Historia / Cultura', ru: 'История / Культура' },
        '미식/쇼핑': { en: 'Food / Shopping', ja: 'グルメ / ショッピング', zh: '美食 / 购物', zht: '美食 / 購物', de: 'Essen / Shopping', fr: 'Gastronomie / Shopping', es: 'Comida / Compras', ru: 'Еда / Шопинг' },
        '액티비티/레저': { en: 'Activity / Leisure', ja: 'アクティビティ / レジャー', zh: '活动 / 休闲', zht: '活動 / 休閒', de: 'Aktivitäten / Freizeit', fr: 'Activités / Loisirs', es: 'Actividades / Ocio', ru: 'Активный отдых' },
        'K-컬처/이벤트': { en: 'K-Culture / Events', ja: 'K-カルチャー / イベント', zh: 'K-文化 / 活动', zht: 'K-文化 / 活動', de: 'K-Kultur / Events', fr: 'Culture K / Événements', es: 'Cultura K / Eventos', ru: 'K-культура / События' }
      };
      return map[value]?.[curLang] || value;
    }

    if (type === 'gender') {
      const map = {
        '무관': { en: 'Any Gender', ja: '指定なし', zh: '不限', zht: '不限', de: 'Egal', fr: 'Tous', es: 'Cualquiera', ru: 'Любой' },
        '남성': { en: 'Male', ja: '男性', zh: '男性', zht: '男性', de: 'Männlich', fr: 'Homme', es: 'Hombre', ru: 'Мужской' },
        '여성': { en: 'Female', ja: '女性', zh: '女性', zht: '女性', de: 'Weiblich', fr: 'Femme', es: 'Mujer', ru: 'Женский' }
      };
      return map[value]?.[curLang] || value;
    }

    if (type === 'age') {
      const map = {
        '전체': { en: 'All Ages', ja: '全年齢', zh: '所有年龄', zht: '所有年齡', de: 'Alle Alter', fr: 'Tous âges', es: 'Todas las edades', ru: 'Все возраста' },
        '10대': { en: 'Teens', ja: '10代', zh: '10多岁', zht: '10多歲', de: '10er', fr: '10s', es: '10s', ru: '10-е' },
        '20대': { en: '20s', ja: '20代', zh: '20多岁', zht: '20多歲', de: '20er', fr: '20s', es: '20s', ru: '20-е' },
        '30대': { en: '30s', ja: '30代', zh: '30多岁', zht: '30多歲', de: '30er', fr: '30s', es: '30s', ru: '30-е' },
        '40대': { en: '40s', ja: '40代', zh: '40多岁', zht: '40多歲', de: '40er', fr: '40s', es: '40s', ru: '40-е' },
        '50대이상': { en: '50s+', ja: '50代以上', zh: '50岁以上', zht: '50歲以上', de: '50er+', fr: '50s+', es: '50s+', ru: '50+' }
      };
      return map[value]?.[curLang] || value;
    }

    if (type === 'arrange') {
      const map = {
        O: { ko: '제목순', en: 'By Title', ja: 'タイトル順', zh: '按标题', zht: '按標題', de: 'Nach Titel', fr: 'Par titre', es: 'Por título', ru: 'По названию' },
        Q: { ko: '최근 수정일순', en: 'Recently Modified', ja: '最近の更新順', zh: '按最近修改', zht: '按最近修改', de: 'Zuletzt geändert', fr: 'Modifié récemment', es: 'Modificado recientemente', ru: 'Недавно измененные' },
        R: { ko: '최근 등록일순', en: 'Recently Created', ja: '最近の登録順', zh: '按最近创建', zht: '按最近創建', de: 'Zuletzt erstellt', fr: 'Créé récemment', es: 'Creado recientemente', ru: 'Недавно созданные' }
      };
      return map[value]?.[curLang] || (value === 'Q' ? 'Recently Modified' : value === 'R' ? 'Recently Created' : 'By Title');
    }

    if (type === 'apiService') {
      const map = {
        all: { ko: '전체 서비스', en: 'All Services', ja: '全サービス', zh: '所有服务', zht: '所有服務', de: 'Alle Dienste', fr: 'Tous les services', es: 'Todos los servicios', ru: 'Все сервисы' },
        area: { ko: '지역기반 정보', en: 'Area-based Info', ja: '地域情報', zh: '基于区域的信息', zht: '基於區域的資訊', de: 'Regionen-Info', fr: 'Info par région', es: 'Info por zona', ru: 'Информация по региону' },
        location: { ko: '위치기반 주변', en: 'Nearby Places', ja: '周辺情報', zh: '周边地点', zht: '周邊地點', de: 'In der Nähe', fr: 'À proximité', es: 'Lugares cercanos', ru: 'Рядом' },
        festival: { ko: '행사/축제', en: 'Festivals & Events', ja: 'お祭り・イベント', zh: '节日与活动', zht: '節日與活動', de: 'Festivals & Events', fr: 'Festivals & Événements', es: 'Festivales y Eventos', ru: 'Фестивали и события' },
        stay: { ko: '숙박/호텔', en: 'Hotels & Stays', ja: '宿泊・ホテル', zh: '酒店与住宿', zht: '酒店與住宿', de: 'Hotels & Unterkünfte', fr: 'Hôtels & Hébergements', es: 'Hoteles y Alojamientos', ru: 'Отели и проживание' }
      };
      return map[value]?.[curLang] || 'All Services';
    }

    if (type === 'toggle') {
      const map = {
        ko: { expand: '조회 조건 펼치기 ▼', collapse: '조회 조건 접기 ▲' },
        en: { expand: 'Expand Filters ▼', collapse: 'Collapse Filters ▲' },
        ja: { expand: '検索条件を開く ▼', collapse: '検索条件を閉じる ▲' },
        zh: { expand: '展开筛选条件 ▼', collapse: '折叠筛选条件 ▲' },
        zht: { expand: '展開篩選條件 ▼', collapse: '摺疊篩選條件 ▲' },
        de: { expand: 'Filter erweitern ▼', collapse: 'Filter einklappen ▲' },
        fr: { expand: 'Déplier les filtres ▼', collapse: 'Replier les filtres ▲' },
        es: { expand: 'Expandir filtros ▼', collapse: 'Plegar filtros ▲' },
        ru: { expand: 'Развернуть фильтры ▼', collapse: 'Свернуть фильтры ▲' }
      };
      const l = map[curLang] || map.ko;
      return value === 'collapse' ? l.collapse : l.expand;
    }

    return value;
  };

  const regions = Object.keys(REGION_META);
  const themes = ['전체', '자연/힐링', '역사/문화', '미식/쇼핑', '액티비티/레저', 'K-컬처/이벤트'];
  const ages = ['전체', '10대', '20대', '30대', '40대', '50대이상'];
  const genders = ['무관', '남성', '여성'];

  const startDateObj = filters.startDate ? new Date(filters.startDate) : new Date();
  const endDateObj = filters.endDate ? new Date(filters.endDate) : startDateObj;

  const formatDateStr = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleFormSearch = () => {
    onSearch();
    setIsCollapsed(true); // Auto-collapse on search for clean UI
  };

  return (
    <div style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.75rem',
      margin: '1.5rem 0',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header Bar with Accordion Toggle */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: isCollapsed ? 0 : '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(56, 189, 248, 0.15)',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-full)'
          }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{t.searchTitle}</h2>
          </div>

          {/* Active Summary Badges when Collapsed - IN EXACT FORM INPUT ORDER */}
          {isCollapsed && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* 1. 여행 기간 (Date Range) */}
              {(filters.startDate || filters.endDate) && (
                <span style={{ fontSize: '0.78rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  📅 {filters.startDate || ''} ~ {filters.endDate || ''}
                </span>
              )}

              {/* 2. 여행 지역 (Region) */}
              <span style={{ fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                📍 {getBadgeI18n('region', filters.region || '전국')}
              </span>

              {/* 3. 여행 테마 (Theme) */}
              <span style={{ fontSize: '0.78rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontWeight: 600 }}>
                🏖️ {getBadgeI18n('theme', filters.theme || '전체')}
              </span>

              {/* 4. 성별 (Gender) */}
              {filters.gender && filters.gender !== '무관' && (
                <span style={{ fontSize: '0.78rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  🚻 {getBadgeI18n('gender', filters.gender)}
                </span>
              )}

              {/* 5. 연령대 (Age) */}
              {filters.age && filters.age !== '전체' && (
                <span style={{ fontSize: '0.78rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  👤 {getBadgeI18n('age', filters.age)}
                </span>
              )}

              {/* 6. 정렬 순서 (Arrange Order) */}
              {filters.arrange && (
                <span style={{ fontSize: '0.78rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                  ⚡ {getBadgeI18n('arrange', filters.arrange)}
                </span>
              )}

              {/* 7. 정보 조회 유형 (API Service Type) */}
              {filters.apiServiceType && (
                <span style={{ fontSize: '0.78rem', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: '#38bdf8', fontWeight: 600 }}>
                  🌐 {getBadgeI18n('apiService', filters.apiServiceType)}
                </span>
              )}

              {/* 8. 검색 키워드 (Keyword) */}
              {filters.keyword && (
                <span style={{ fontSize: '0.78rem', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: '#f97316', fontWeight: 700 }}>
                  🔍 {filters.keyword}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Filter size={14} color="var(--accent-primary)" />
          <span>{getBadgeI18n('toggle', isCollapsed ? 'expand' : 'collapse')}</span>
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* ROW 1 (1단): Date Range (2 cols), Region (1 col), Theme (1 col) */}
        {/* Date Range (From ~ To) */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Calendar size={15} color="var(--accent-primary)" /> {t.period} (From ~ To)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <DatePicker
                selected={startDateObj}
                onChange={(d) => setFilters(prev => ({ ...prev, startDate: formatDateStr(d) }))}
                locale={lang === 'zht' ? 'zh' : (lang || 'ko')}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker-input"
                showIcon
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="datepicker-custom-icon">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                }
              />
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>~</span>
            <div style={{ flex: 1, position: 'relative' }}>
              <DatePicker
                selected={endDateObj}
                onChange={(d) => setFilters(prev => ({ ...prev, endDate: formatDateStr(d) }))}
                locale={lang === 'zht' ? 'zh' : (lang || 'ko')}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker-input"
                showIcon
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="datepicker-custom-icon">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Region (Row 1 - 1 col) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <MapPin size={15} color="var(--accent-primary)" /> {t.region}
          </label>
          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          >
            {regions.map(r => (
              <option key={r} value={r}>
                {t.regions?.[r] || r}
              </option>
            ))}
          </select>
        </div>

        {/* Theme (Row 1 - 1 col) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Compass size={15} color="var(--accent-primary)" /> {t.theme}
          </label>
          <select
            value={filters.theme}
            onChange={(e) => setFilters(prev => ({ ...prev, theme: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          >
            {themes.map(th => (
              <option key={th} value={th}>
                {t.themes?.[th] || th}
              </option>
            ))}
          </select>
        </div>

        {/* ROW 2 (2단): Gender (1 col), Age Group (1 col), Arrange Sort (2 cols) */}
        {/* Gender (Row 2 - 1 col) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <User size={15} color="var(--accent-primary)" /> {t.gender}
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          >
            {genders.map(g => (
              <option key={g} value={g}>
                {t.genders?.[g] || g}
              </option>
            ))}
          </select>
        </div>

        {/* Age Group (Row 2 - 1 col) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Users size={15} color="var(--accent-primary)" /> {t.age}
          </label>
          <select
            value={filters.age}
            onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          >
            {ages.map(a => (
              <option key={a} value={a}>
                {t.ages?.[a] || a}
              </option>
            ))}
          </select>
        </div>

        {/* TourAPI Arrange Sort Filter (Moved to Row 2 - 2 cols) */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Sparkles size={15} color="var(--accent-primary)" /> {t.arrange || '정렬 옵션'}
          </label>
          <select
            value={filters.arrange || 'O'}
            onChange={(e) => setFilters(prev => ({ ...prev, arrange: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          >
            <option value="O">{t.arrangeO || '제목순 (가나다)'}</option>
            <option value="Q">{t.arrangeQ || '최근 수정일순'}</option>
            <option value="R">{t.arrangeR || '최근 등록일순'}</option>
          </select>
        </div>

        {/* ROW 3 (3단): TourAPI Service Type (2 cols) & Keyword (2 cols) */}
        {/* TourAPI Service Type Filter */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Compass size={15} color="var(--accent-primary)" /> {t.apiServiceTypeLabel || '정보 조회 유형 (API 서비스 선택)'}
          </label>
          <select
            value={filters.apiServiceType || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, apiServiceType: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            {API_SERVICE_TYPES.map(st => (
              <option key={st.id} value={st.id}>
                {t.apiServices?.[st.id] || st.name}
              </option>
            ))}
          </select>
        </div>

        {/* Keyword Search Input (Moved to Row 3 - 2 cols) */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Search size={15} color="var(--accent-primary)" /> {t.keyword || '검색 키워드'}
          </label>
          <input
            type="text"
            placeholder={t.keywordPlaceholder || "명소 이름, 도시, 태그(#일출, #데이트 등) 검색..."}
            value={filters.keyword || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFormSearch(); }}
            style={{
              width: '100%',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={handleFormSearch}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '300px', justifyContent: 'center', padding: '0.85rem' }}
        >
          <Search size={18} />
          <span>{t.searchBtn}</span>
        </button>
      </div>
        </>
      )}
    </div>
  );
}
