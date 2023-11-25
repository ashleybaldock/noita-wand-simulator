import { translations } from '../calc/__generated__/translations.beta';

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
