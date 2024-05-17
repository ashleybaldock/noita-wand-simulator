import { languages } from '../calc/__generated__/i18n/';
import { en as translations } from '../calc/__generated__/i18n/';

const isKnownTranslationKey = (key: string): key is keyof typeof translations =>
  Object.prototype.hasOwnProperty.call(translations, key);

export const translate = (key: string): string => {
  const strippedKey = key.replace(/^\$/, '');
  if (isKnownTranslationKey(strippedKey)) {
    return translations[strippedKey];
  } else {
    return key;
  }
};
