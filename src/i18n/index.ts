import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import messages from './local/index';

// Get saved language preference or detect from browser
const savedLanguage = localStorage.getItem('preferredLanguage');
const browserLanguage = navigator.language.split('-')[0]; // Get 'en' from 'en-US'

// List of supported languages
const supportedLanguages = ['en', 'bn', 'zh', 'es', 'fr', 'hi', 'pt', 'ru', 'tr', 'id', 'vi', 'it', 'fa'];

// Determine initial language
const initialLanguage = savedLanguage || browserLanguage || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: 'en',
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;