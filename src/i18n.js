import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationKO from './locales/ko/translation.json';
import translationJA from './locales/ja/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
  ja: {
    translation: translationJA,
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next) // i18next를 react-i18next에 전달
  .init({
    resources,
    fallbackLng: 'en', // 언어 감지 실패시 사용할 언어
    interpolation: {
      escapeValue: false, // React는 이미 XSS 방지를 하므로 false로 설정
    },
  });

export default i18n;