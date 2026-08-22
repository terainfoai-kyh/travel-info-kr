import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ktravel_daily_quota_v1';
const DEV_BYPASS_KEY = 'ktravel_dev_bypass';
const DEFAULT_DAILY_LIMIT = 5; // 일반 사용자 일일 기본 5회

export function useQuotaLimit(customLimit = DEFAULT_DAILY_LIMIT) {
  const [usedCount, setUsedCount] = useState(0);
  const [isDevBypass, setIsDevBypass] = useState(true); // 개발자 테스트용 기본 무제한 활성화

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const today = getTodayString();
    try {
      // 1. 개발자 무제한 스위치 상태 확인
      const devState = localStorage.getItem(DEV_BYPASS_KEY);
      if (devState !== null) {
        setIsDevBypass(devState === 'true');
      } else {
        localStorage.setItem(DEV_BYPASS_KEY, 'true'); // 기본 무제한 온
      }

      // 2. 사용 횟수 카운트 확인
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          setUsedCount(parsed.count || 0);
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      setUsedCount(0);
    } catch (e) {
      console.warn('Quota localStorage error:', e);
    }
  }, []);

  const toggleDevBypass = (enabled) => {
    const nextState = typeof enabled === 'boolean' ? enabled : !isDevBypass;
    setIsDevBypass(nextState);
    try {
      localStorage.setItem(DEV_BYPASS_KEY, String(nextState));
    } catch (e) {
      console.warn('DevBypass save error:', e);
    }
  };

  const incrementQuota = () => {
    if (isDevBypass) return 0; // 개발자 모드 시 차감 안 함

    const today = getTodayString();
    const newCount = usedCount + 1;
    setUsedCount(newCount);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    } catch (e) {
      console.warn('Quota save error:', e);
    }
    return newCount;
  };

  const remainingQuota = isDevBypass ? 99999 : Math.max(0, customLimit - usedCount);
  const canProceed = isDevBypass || usedCount < customLimit;

  return {
    usedCount,
    remainingQuota,
    dailyLimit: customLimit,
    canProceed,
    isDevBypass,
    toggleDevBypass,
    incrementQuota
  };
}
