import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from './locales/en.json';
import sv from './locales/sv.json';

const i18n = createInstance();
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, sv: { translation: sv } },
  lng: getLocales()[0]?.languageCode === 'en' ? 'en' : 'sv',
  fallbackLng: 'sv', interpolation: { escapeValue: false }, initImmediate: false,
});
export default i18n;
