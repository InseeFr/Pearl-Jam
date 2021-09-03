import { fr, enUS } from 'date-fns/locale';
import { getLang } from 'i18n/build-dictionary';

export { default as addOnlineStatusObserver } from './online-status-observer';

export const dateFnsLocal = getLang() === 'fr' ? fr : enUS;
