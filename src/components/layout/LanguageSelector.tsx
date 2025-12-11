"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';
import styles from './LanguageSelector.module.scss';

export default function LanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    // Set locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <div className={styles.languageSelector}>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className={styles.select}
        aria-label={t('select')}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
      <span className={styles.icon}>🌐</span>
    </div>
  );
}
