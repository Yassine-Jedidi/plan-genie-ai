import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../src/locales/en/translation.json';
import fr from '../src/locales/fr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // cache user language on
      caches: ['localStorage'],
      
      // convert detected language to base language
      convertDetectedLanguage: (lng: string) => {
        // Map language codes with regions to base language
        const languageMap: { [key: string]: string } = {
          'fr-FR': 'fr',
          'fr-CA': 'fr',
          'fr-BE': 'fr',
          'fr-CH': 'fr',
          'en-US': 'en',
          'en-GB': 'en',
          'en-CA': 'en',
          'en-AU': 'en',
        };
        return languageMap[lng] || lng;
      },
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n; 