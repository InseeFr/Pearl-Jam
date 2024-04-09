/**
 * Convert a number (base10) in hex
 * @param c
 * @returns {string}
 */
function hex(c) {
  const s = '0123456789abcdef';
  let i = parseInt(c);

  if (i === 0 || isNaN(c)) return '00';

  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/**
 * Convert an RGB triplet to a hex string
 *
 * @param {[number, number, number]} rgb
 **/
function convertToHex(rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/**
 * Trims a string representing a color code by removing the '#' symbol if present.
 *
 * @param {string} s - The input color code, possibly starting with '#'.
 * @returns {string} - The trimmed color code without the '#' symbol.
 */
function trim(s) {
  return s.charAt(0) == '#' ? s.substring(1, 7) : s;
}

/**
 * Convert a hex color into RGB triplet
 */
function convertToRGB(hex) {
  const color = [];
  color[0] = parseInt(trim(hex).substring(0, 2), 16);
  color[1] = parseInt(trim(hex).substring(2, 4), 16);
  color[2] = parseInt(trim(hex).substring(4, 6), 16);
  return color;
}

/**
 * Generate a color in a specific position in a gradient
 *
 * @param {string} colorStart - The starting color in hexadecimal format.
 * @param {string} colorEnd - The ending color in hexadecimal format.
 * @param {string} colorEnd - The ending color in hexadecimal format.
 * @param {number} ratio - The position ratio within the gradient, ranging from 0 to 1.
 * @returns {string} - The interpolated color at the specified position.
 */
export function generateColorInGradient(colorStart, colorEnd, alpha) {
  const start = convertToRGB(colorStart);
  const end = convertToRGB(colorEnd);
  const c = [];
  c[0] = start[0] * (1 - alpha) + alpha * end[0];
  c[1] = start[1] * (1 - alpha) + alpha * end[1];
  c[2] = start[2] * (1 - alpha) + alpha * end[2];
  return '#' + convertToHex(c);
}
