/**
 * Formats a phone number by grouping digits in pairs separated by spaces,
 * while preserving any leading '+' sign.
 *
 * @example
 * formatPhoneNumber("+33612345678") // returns "+33 61 23 45 67 8"
 * formatPhoneNumber("0612345678")   // returns "06 12 34 56 78"
 */
export const formatPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber) {
    return '';
  }

  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  if (cleaned.includes('+')) {
    cleaned = (cleaned.startsWith('+') ? '+' : '') + cleaned.replace(/\+/g, '');
  }

  if (cleaned === '+') {
    return '+';
  }

  const groups = cleaned.match(/\+?\d{1,2}/g);

  return groups ? groups.join(' ') : '';
};