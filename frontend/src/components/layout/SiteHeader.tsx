"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getPageHeaderConfig } from "@/lib/get-page-header-config";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const config = getPageHeaderConfig(pathname);

  const shouldShowUserMenu = !pathname.startsWith("/sessions");

  function handleLogout() {
    logout();

    router.replace("/signin");
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <h1 className="text-base font-medium underline underline-offset-8">
          {config.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {config.showStartSessionButton && (
            <Button asChild className="rounded-full">
              <Link href="/sessions?mode=setup">Start session</Link>
            </Button>
          )}

          {shouldShowUserMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full h-8 w-8 !bg-green-500 text-xs">
                  {getInitials(user?.name)}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
