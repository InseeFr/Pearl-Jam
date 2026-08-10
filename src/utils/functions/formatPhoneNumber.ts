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