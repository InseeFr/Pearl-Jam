import dictionary from './dictionary';
// Importez le locale albanais si disponible
import { fr, sq } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';

/**
 * Based on the locale passed as a parameter, this function will return
 * the corresponding dictionary.
 *
 * @param {string} lang the lang of the user
 */
export const createDictionary = lang => {
  // Set date-fns lang for French and Albanian
  if (lang === 'fr') {
    setDefaultOptions({ locale: fr });
  } else if (lang === 'sq') {
    setDefaultOptions({ locale: sq }); // Supposant que `sq` est le locale pour l'albanais
  }

  return Object.keys(dictionary).reduce((acc, key) => {
    acc[key] = dictionary[key][lang];
    return acc;
  }, {});
};

/**
 * This function will return only the lang part of a locale
 * For example, with fr-FR, will return fr
 * If the lang is not recognized, will return en
 * Now also checks for Albanian (sq)
 * @param {string} lang the lang of the user
 */
export const getLang = defaultLang => {
  const lang = (defaultLang || navigator.language || navigator.browserLanguage).split('-')[0];
  return lang === 'fr' || lang === 'sq' ? lang : 'en';
};

export default createDictionary(getLang());
