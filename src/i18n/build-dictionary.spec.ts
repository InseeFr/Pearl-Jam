import { expect, test } from 'vitest';
import { createDictionary, getLang, SupportedLocales } from './build-dictionary';

['browserLanguage', 'language'].forEach(property => {
  test(`should return the french version when the navigator.${property} is FR`, () => {
    expect(createDictionary('fr').welcome).toBe('Bienvenue');
  });

  test(`should return the english version when the navigator.${property} is EN`, () => {
    expect(createDictionary('en').welcome).toBe('Welcome');
  });

  test(`should return the english version the navigator.${property} is not supported`, () => {
    expect(createDictionary('de' as SupportedLocales).welcome).toBeUndefined();
  });
});

test(`should return fr when we passe fr as a paremeter`, () => {
  expect(getLang('fr')).toBe('fr');
});

test(`should return fr when we passe fr-FR as a paremeter`, () => {
  expect(getLang('fr-FR')).toBe('fr');
});
