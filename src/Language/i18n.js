import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslations from './arabic.json';
import enTranslations from './english.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enTranslations,
    },
    ar: {
      translation: arTranslations,
    },
  },
});
export default i18n;
