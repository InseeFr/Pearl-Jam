import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

export const getDateAttributes = timestamp => {
  const date = new Date(timestamp);
  const dayOfWeek = format(date, 'EEEE', {
    locale: fr,
  });
  const twoDigitdayNumber = format(date, 'dd', {
    locale: fr,
  });
  const month = format(date, 'MMMM', {
    locale: fr,
  });
  const hour = format(date, 'HH');
  const minutes = format(date, 'mm');
  const year = format(date, 'yyyy');

  return { dayOfWeek, twoDigitdayNumber, year, month, hour, minutes };
};

/**
 * @param {number} time - Timestamp in seconds
 * @param {boolean} [withTime] - Add time information (hour / minutes)
 * @return string
 */
export const formatDate = (time, withTime) => {
  if (!time) {
    return '';
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: withTime ? 'short' : undefined,
  }).format(new Date(time));
};
