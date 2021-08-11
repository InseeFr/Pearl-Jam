import React, { useEffect, useState } from 'react';
import notificationIdbService from 'indexedbb/services/notification-idb-service';
import syncReportIdbService from 'indexedbb/services/syncReport-idb-service';

export const NotificationWrapperContext = React.createContext();

export const NotificationWrapper = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

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

  const markAllAsRead = async () => {
    const newNotifs = notifications.map(notif => {
      return { ...notif, read: true };
    });
    await Promise.all(
      newNotifs.map(async notif => {
        await notificationIdbService.addOrUpdateNotif(notif);
      })
    );
    setNotifications(newNotifs);
  };

  const deleteAll = async () => {
    await notificationIdbService.deleteAll();
    await syncReportIdbService.deleteAll();
    setNotifications([]);
  };

  const unReadNotificationsNumber = notifications.filter(({ read }) => !read).length;

  const context = {
    markNotifAsRead,
    deleteAll,
    markAllAsRead,
    notifications,
    unReadNotificationsNumber,
  };

  return (
    <NotificationWrapperContext.Provider value={context}>
      {children}
    </NotificationWrapperContext.Provider>
  );
};
