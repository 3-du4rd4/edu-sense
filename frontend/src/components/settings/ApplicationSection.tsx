"use client";

import { Info, LogOut, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settingsStore";

export function ApplicationSection() {
  const router = useRouter();
  const { logout } = useAuth();

  const { browserNotificationsEnabled, setBrowserNotificationsEnabled } =
    useSettingsStore();

  function handleLogout() {
    logout();
    router.replace("/signin");
  }

  async function handleBrowserNotificationsChange(checked: boolean) {
    if (!checked) {
      setBrowserNotificationsEnabled(false);
      return;
    }

    if (!("Notification" in window)) {
      setBrowserNotificationsEnabled(false);
      return;
    }

    const permission = await Notification.requestPermission();

    setBrowserNotificationsEnabled(permission === "granted");
  }

  return (
    <section className="rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Aplicação</h2>
      <p className="text-sm text-muted-foreground">
        Informações gerais sobre a aplicação.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Notificações do navegador</p>
              <p className="text-xs text-muted-foreground">
                Receba alertas quando o app estiver rodando em segundo plano.
              </p>
            </div>
          </div>

          <Switch
            checked={browserNotificationsEnabled}
            onCheckedChange={handleBrowserNotificationsChange}
          />
        </div>

        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Monitor className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Tema</p>
              <p className="text-xs text-muted-foreground">
                Padrão do sistema por enquanto.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Sistema
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Info className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Versão</p>
              <p className="text-xs text-muted-foreground">
                Versão atual do protótipo.
              </p>
            </div>
          </div>

          <span className="text-sm font-medium">v1.0.0</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="rounded-full text-red-500 hover:text-red-600 self-end"
        >
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
    </section>
  );
}
