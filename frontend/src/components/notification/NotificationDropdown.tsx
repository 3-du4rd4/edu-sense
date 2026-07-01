"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notificationService";
import { useNotificationStore } from "@/stores/notificationStore";

export function NotificationDropdown() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  async function handleMarkAsRead(notificationId: string) {
    await markNotificationAsRead(notificationId);
    markAsRead(notificationId);
  }

  async function handleMarkAllAsRead() {
    await markAllNotificationsAsRead();
    markAllAsRead();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="size-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 top-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Nenhuma notificação encontrada.
            </p>
          ) : (
            notifications.map((notification, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleMarkAsRead(notification._id)}
                className="flex w-full gap-3 border-b p-3 text-left transition hover:bg-muted/60"
              >
                <span
                  className={`mt-1 size-2 rounded-full ${
                    notification.read ? "bg-muted" : "bg-red-500"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
