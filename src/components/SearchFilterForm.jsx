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
import { Search, Calendar, MapPin, Compass, User, Users, Sparkles } from 'lucide-react';
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

  return (
    <div style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      margin: '1.5rem 0',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Sparkles size={20} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t.searchTitle}</h2>
      </div>

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
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
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
          onClick={onSearch}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '300px', justifyContent: 'center', padding: '0.85rem' }}
        >
          <Search size={18} />
          <span>{t.searchBtn}</span>
        </button>
      </div>
    </div>
  );
}
