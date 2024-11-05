import dictionary from './dictionary';
// Importez le locale albanais si disponible
import { fr, sq } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';

type DictionaryKey = keyof typeof dictionary;
export type SupportedLocales = 'fr' | 'sq' | 'en';
type DictionaryValue = Record<SupportedLocales, any>;
type Dictionary = Record<DictionaryKey, DictionaryValue>;
/**
 * Based on the locale passed as a parameter, this function will return
 * the corresponding dictionary.
 *
 * @param {string} lang the lang of the user
 */
export const createDictionary = (lang: SupportedLocales): Record<string, string> => {
  // Set date-fns lang for French and Albanian
  if (lang === 'fr') {
    setDefaultOptions({ locale: fr });
  } else if (lang === 'sq') {
    setDefaultOptions({ locale: sq }); // Supposant que `sq` est le locale pour l'albanais
  }

  return Object.entries(dictionary as Dictionary).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value[lang],
    };
  }, {});
};

/**
 * This function will return only the lang part of a locale
 * For example, with fr-FR, will return fr
 * If the lang is not recognized, will return en
 * Now also checks for Albanian (sq)
 */
export const getLang = (defaultLang?: string) => {
  const lang = (defaultLang ?? navigator.language).split('-')[0];
  return lang === 'fr' || lang === 'sq' ? lang : 'en';
};

export default createDictionary(getLang()) as any;
