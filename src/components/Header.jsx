import React from 'react';
import { Compass, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Header({ currentLang, setLang, filters, themeMode, setThemeMode }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  const getBadgeI18n = (type, value) => {
    const curLang = currentLang || 'ko';
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
        all: { ko: '전체 서비스', en: 'All Services', ja: '全サービス', zh: '所有服务', zht: '所有服務', de: 'Alle Dienste', fr: 'Tous les services', es: 'Tous les services', ru: 'Все сервисы' },
        area: { ko: '지역기반 정보', en: 'Area-based Info', ja: '地域情報', zh: '基于区域的信息', zht: '基於區域的資訊', de: 'Regionen-Info', fr: 'Info par région', es: 'Info por zona', ru: 'Информация по региону' },
        location: { ko: '위치기반 주변', en: 'Nearby Places', ja: '周辺情報', zh: '周边地点', zht: '周邊地點', de: 'In der Nähe', fr: 'À proximité', es: 'Lugares cercanos', ru: 'Рядом' },
        festival: { ko: '행사/축제', en: 'Festivals & Events', ja: 'お祭り・イベント', zh: '节日与活动', zht: '節日與活動', de: 'Festivals & Events', fr: 'Festivals & Événements', es: 'Festivales y Eventos', ru: 'Фестивали и события' },
        stay: { ko: '숙박/호텔', en: 'Hotels & Stays', ja: '宿泊・ホテル', zh: '酒店与住宿', zht: '酒店與住宿', de: 'Hotels & Unterkünfte', fr: 'Hôtels & Hébergements', es: 'Hoteles y Alojamientos', ru: 'Отели и проживание' }
      };
      return map[value]?.[curLang] || 'All Services';
    }

    return value;
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '58px',
          height: '58px',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(56, 189, 248, 0.4)',
          border: '2px solid rgba(56, 189, 248, 0.6)',
          background: '#ffffff',
          flexShrink: 0,
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}>
          <img src="/logo.png" alt="K-Travel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.1 }} className="gradient-text">
            {t.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0, marginRight: '0.25rem' }}>
              {t.subtitle}
            </p>
            {filters && (
              <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* 1. 여행 기간 (Date Range) */}
                {(filters.startDate || filters.endDate) && (
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                    📅 {filters.startDate || ''} ~ {filters.endDate || ''}
                  </span>
                )}

                {/* 2. 여행 지역 (Region) */}
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  📍 {getBadgeI18n('region', filters.region || '전국')}
                </span>

                {/* 3. 여행 테마 (Theme) */}
                <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontWeight: 600 }}>
                  🏖️ {getBadgeI18n('theme', filters.theme || '전체')}
                </span>

                {/* 4. 성별 (Gender) */}
                {filters.gender && filters.gender !== '무관' && (
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                    🚻 {getBadgeI18n('gender', filters.gender)}
                  </span>
                )}

                {/* 5. 연령대 (Age) */}
                {filters.age && filters.age !== '전체' && (
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                    👤 {getBadgeI18n('age', filters.age)}
                  </span>
                )}

                {/* 6. 정렬 순서 (Arrange Order) */}
                {filters.arrange && (
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                    ⚡ {getBadgeI18n('arrange', filters.arrange)}
                  </span>
                )}

                {/* 7. 정보 조회 유형 (API Service Type) */}
                {filters.apiServiceType && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.3)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: '#38bdf8', fontWeight: 600 }}>
                    🌐 {getBadgeI18n('apiService', filters.apiServiceType)}
                  </span>
                )}

                {/* 8. 검색 키워드 (Keyword) */}
                {filters.keyword && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: '#f97316', fontWeight: 700 }}>
                    🔍 {filters.keyword}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theme Toggle & Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          title={themeMode === 'dark' ? (currentLang === 'en' ? 'Switch to Light Mode' : '라이트 모드로 변경') : (currentLang === 'en' ? 'Switch to Dark Mode' : '다크 모드로 변경')}
        >
          {themeMode === 'dark' ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Moon size={18} color="#38bdf8" />
          )}
        </button>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={18} color="var(--accent-primary)" />
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.45rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ko">{t.langKo}</option>
            <option value="en">{t.langEn}</option>
            <option value="ja">{t.langJa}</option>
            <option value="zh">{t.langZh}</option>
            <option value="zht">{t.langZht}</option>
            <option value="de">{t.langDe || 'Deutsch (DE)'}</option>
            <option value="fr">{t.langFr || 'Français (FR)'}</option>
            <option value="es">{t.langEs || 'Español (ES)'}</option>
            <option value="ru">{t.langRu || 'Русский (RU)'}</option>
          </select>
        </div>
      </div>
    </header>
  );
}
