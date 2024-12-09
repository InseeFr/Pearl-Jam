type RGB = [number, number, number];

/**
 * Convert a number (base10) in hex
 */
function hex(c: number) {
  const s = '0123456789abcdef';
  let i = parseInt(c.toString());

  if (i === 0 || isNaN(c)) return '00';

  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/**
 * Convert an RGB triplet to a hex string
 **/
function convertToHex(rgb: RGB) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/**
 * Trims a string representing a color code by removing the '#' symbol if present.
 */
function trim(s: string) {
  return s.startsWith('#') ? s.substring(1, 7) : s;
}

/**
 * Convert a hex color into RGB triplet
 */
function convertToRGB(hex: string): RGB {
  const trimHexa = trim(hex);
  return [
    parseInt(trimHexa.substring(0, 2), 16),
    parseInt(trimHexa.substring(2, 4), 16),
    parseInt(trimHexa.substring(4, 6), 16),
  ];
}

/**
 * Generate a color in a specific position in a gradient
 */
export function generateColorInGradient(colorStart: string, colorEnd: string, alpha: number) {
  const start = convertToRGB(colorStart);
  const end = convertToRGB(colorEnd);
  const c: RGB = [
    start[0] * (1 - alpha) + alpha * end[0],
    start[1] * (1 - alpha) + alpha * end[1],
    start[2] * (1 - alpha) + alpha * end[2],
  ];
  return '#' + convertToHex(c);
}
