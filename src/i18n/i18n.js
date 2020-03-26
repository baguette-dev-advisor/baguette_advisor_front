import I18n from 'react-native-i18n';
import en from './locales/en';
import fr from './locales/fr';
import es from './locales/es';
import ar from './locales/ar';
import cn from './locales/cn';

I18n.fallbacks = true;

I18n.translations = {
  en,
  fr,
  es,
  ar,
  cn
};

export default I18n;
