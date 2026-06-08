"use client";

import { Info, LogOut, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ApplicationSection() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/signin");
  }

  return (
    <section className="rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Application</h2>
      <p className="text-sm text-muted-foreground">
        General application information.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Monitor className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                System default for now.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            System
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Info className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-xs text-muted-foreground">
                Current prototype version.
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
          Logout
        </Button>
      </div>
    </section>
  );
}
