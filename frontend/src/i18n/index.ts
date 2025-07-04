import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  // Load translations using http backend
  .use(HttpBackend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    supportedLngs: ['en', 'fr'],
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Detection configuration
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n; 