"use client";

import { Mail, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

export function AccountSection() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Conta</h2>
      <p className="text-sm text-muted-foreground">
        Suas informações básicas de conta.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={user?.name ?? ""} readOnly className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={user?.email ?? ""} readOnly className="pl-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
