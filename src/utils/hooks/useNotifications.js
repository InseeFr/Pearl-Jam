import { computed, signal } from '@maverick-js/signals';
import notificationIdbService from '../indexeddb/services/notification-idb-service';
import { useSignalValue } from './useSignalValue';

const $notifications = signal([]);
const $unreadCount = computed(() => $notifications().filter(v => !v.read).length);

export async function loadNotifications() {
  const notifications = await notificationIdbService.getAll();
  $notifications.set(notifications.sort((a, b) => b.date - a.date));
}

export async function deleteNotification(notification) {
  await notificationIdbService.delete(notification.id);
  $notifications.set($notifications().filter(n => n !== notification));
}

export async function markNotificationAsRead(notification) {
  const updatedNotification = { ...notification, read: true };
  await notificationIdbService.addOrUpdateNotif(updatedNotification);
  $notifications.set($notifications().map(n => (n === notification ? updatedNotification : n)));
}

/**
 * @return {{notifications: {type: string, id: number, state: string, date: number, title:string, read: boolean}[]}}
 */
export function useNotifications() {
  return {
    notifications: useSignalValue($notifications),
  };
}

export function useUnreadNotificationsCount() {
  return useSignalValue($unreadCount);
}
