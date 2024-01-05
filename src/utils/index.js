import { fr, enUS } from 'date-fns/locale';
import { getLang } from '../i18n/build-dictionary';

export const dateFnsLocal = getLang() === 'fr' ? fr : enUS;
