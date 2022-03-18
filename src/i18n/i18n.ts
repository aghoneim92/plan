import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar';
import en from './en';

import languageDetectorPlugin from './languageDetectorPlugin';

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ar,
      en,
    },
  });

export default i18n;
