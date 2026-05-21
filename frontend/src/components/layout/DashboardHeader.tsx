"use client";

import { Bell } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-light">Dashboard</h2>
      </div>

      <button className="flex h-10 w-10 items-center justify-center rounded-full border bg-white">
        <Bell size={18} />
      </button>
    </header>
  );
}
