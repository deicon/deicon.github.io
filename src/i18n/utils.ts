import { defaultLang, translations, type Lang } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof translations[typeof defaultLang]): string {
    return translations[lang][key] || translations[defaultLang][key];
  };
}

export function getLocalePath(lang: Lang, path: string = ''): string {
  if (lang === defaultLang) return `/${path}`;
  return `/${lang}/${path}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'de' ? 'en' : 'de';
}
