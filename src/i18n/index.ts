// ─── XooloLing i18n Configuration ────────────────────────────────────
import i18n from 'i18n-js';
import so from './locales/so.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n.translations = { so, en, ar };
i18n.defaultLocale = 'so';
i18n.locale = 'so';
i18n.fallbacks = true;

export const RTL_LANGUAGES = ['ar'];

export function setLanguage(lang: 'so' | 'en' | 'ar') {
  i18n.locale = lang;
}

export function isRTL(): boolean {
  return RTL_LANGUAGES.includes(i18n.locale);
}

export function getCurrentLanguage(): 'so' | 'en' | 'ar' {
  return i18n.locale as 'so' | 'en' | 'ar';
}

export default i18n;
