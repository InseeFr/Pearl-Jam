/**
 * Get a random item from an array.
 */
export function getRandomItemFromArray(array: unknown[]) {
  // Check if the array is empty
  if (array.length === 0) {
    throw new Error('Array is empty, cannot pick a random item.');
  }

  return array[Math.floor(getRandomMantissa() * array.length)];
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 */
export function getRandomIntBetween(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (min > max) {
    throw new Error('Minimum value must be less than or equal to the maximum value');
  }

  return Math.floor(getRandomMantissa() * (max - min + 1)) + min;
}

export function generateRandomInt() {
  const randomSeed = new Uint32Array(1);
  crypto.getRandomValues(randomSeed);
  return randomSeed[0];
}
/**
 *
 * @returns  a random value between 0 and 1
 */
export function getRandomMantissa() {
  return generateRandomInt() * Math.pow(2, -32);
}
