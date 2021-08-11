import React, { useEffect, useState } from 'react';
import notificationIdbService from 'indexedbb/services/notification-idb-service';
import syncReportIdbService from 'indexedbb/services/syncReport-idb-service';
import { NOTIFICATION_TYPE_SYNC } from 'utils/constants';

export const NotificationWrapperContext = React.createContext();

export const NotificationWrapper = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsFiltered, setNotificatiosFiltered] = useState([]);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    const newNotif = filterType
      ? notifications.filter(({ type }) => type === filterType)
      : notifications;
    setNotificatiosFiltered(newNotif);
  }, [notifications, filterType]);

  useEffect(() => {
    const load = async () => {
      const notificationsDB = await notificationIdbService.getAll();
      const orderNotif = notificationsDB.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
      setNotifications(orderNotif);
    };
    load();
  }, []);

  const markNotifAsRead = async notifId => {
    const notif = notifications.filter(({ id }) => id === notifId)[0];
    const newNotif = { ...notif, read: true };
    await notificationIdbService.addOrUpdateNotif(newNotif);
    const newNotifs = notifications.map(n => {
      if (n.id === notifId) return newNotif;
      return n;
    });
    setNotifications(newNotifs);
  };

  const markAllFilteredNotifAsRead = async () => {
    const newNotifs = notifications.map(notif => {
      const { type } = notif;
      if (filterType && type === filterType) return { ...notif, read: true };
      return notif;
    });
    await Promise.all(
      newNotifs.map(async notif => {
        await notificationIdbService.addOrUpdateNotif(notif);
      })
    );
    setNotifications(newNotifs);
  };

  const deleteAll = async () => {
    if (filterType === NOTIFICATION_TYPE_SYNC) await syncReportIdbService.deleteAll();
    const idsToDelete = notificationsFiltered.map(({ id }) => id);
    await notificationIdbService.deleteByIds(idsToDelete);
    const newNotifs = notifications.filter(({ id }) => !idsToDelete.includes(id));
    setNotifications(newNotifs);
  };

  const unReadNotificationsNumber = notifications.filter(({ read }) => !read).length;
  const unReadNotificationsNumberFilterd = notificationsFiltered.filter(({ read }) => !read).length;

  const context = {
    markNotifAsRead,
    deleteAll,
    markAllAsRead: markAllFilteredNotifAsRead,
    filterType,
    setFilterType,
    notifications: notificationsFiltered,
    unReadNotificationsNumberFilterd,
    unReadNotificationsNumber,
  };

  return (
    <NotificationWrapperContext.Provider value={context}>
      {children}
    </NotificationWrapperContext.Provider>
  );
};
