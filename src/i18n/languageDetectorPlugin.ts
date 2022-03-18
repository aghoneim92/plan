import { locale } from 'expo-localization';
import { ModuleType } from 'i18next';

const languageDetectorPlugin = {
  type: 'languageDetector' as ModuleType,
  async: false,
  init: () => {},
  detect: () => locale,
  cacheUserLanguage() {},
};

export default languageDetectorPlugin;
