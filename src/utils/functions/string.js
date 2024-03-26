/**
 * Normalizes a string converting special character.
 *
 * @param {string} string
 * @returns {string}
 * @example
 * normalize("Café") // cafe;
 */
export function normalize(string) {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
