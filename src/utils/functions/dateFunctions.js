import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

export const getDateAttributes = timestamp => {
  const dayOfWeek = format(new Date(timestamp), 'EEEE', {
    locale: fr,
  });
  const twoDigitdayNumber = format(new Date(timestamp), 'dd', {
    locale: fr,
  });
  const month = format(new Date(timestamp), 'MMMM', {
    locale: fr,
  });
  const hour = format(new Date(timestamp), 'HH');
  const minutes = format(new Date(timestamp), 'mm');

  return { dayOfWeek, twoDigitdayNumber, month, hour, minutes };
};
