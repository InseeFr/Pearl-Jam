/**
 * Normalizes a string converting special character.
 *
 * @example
 * normalize("Café") // cafe;
 */
export function normalize(string: string) {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
