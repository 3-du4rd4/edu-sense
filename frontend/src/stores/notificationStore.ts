import { create } from "zustand";

import { AppNotification } from "@/types/notification";

type NotificationState = {
  notifications: AppNotification[];
  unreadCount: number;

  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read)
        .length,
    }),

  addNotification: (notification) =>
    set((state) => {
      const alreadyExists = state.notifications.some(
        (item) => item._id === notification._id,
      );

      if (alreadyExists) {
        return state;
      }

      const notifications = [notification, ...state.notifications];

      return {
        notifications,
        unreadCount: notifications.filter((item) => !item.read).length,
      };
    }),

  markAsRead: (notificationId) =>
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification,
      );

      return {
        notifications,
        unreadCount: notifications.filter((item) => !item.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unreadCount: 0,
    })),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
