"use client";

import * as React from "react";
import {
  LampDeskIcon,
  LayoutDashboardIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import Image from "next/image";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
      activeClassName: "bg-[#FDBC28]/15",
      iconColor: "text-[#FDBC28]",
    },
    {
      title: "Sessão de Estudo",
      url: "/sessions",
      icon: LampDeskIcon,
      activeClassName: "bg-[#FD6D3E]/15",
      iconColor: "text-[#FD6D3E]",
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: SlidersHorizontalIcon,
      activeClassName: "bg-[#45C8FF]/15",
      iconColor: "text-[#45C8FF]",
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Get Help",
  //     url: "/help",
  //     icon: BadgeQuestionMarkIcon,
  //     activeClassName: "bg-[#76DF64]/15",
  //     iconColor: "text-[#76DF64]",
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12 p-0">
              <Link href="/">
                <Image
                  src="/brand/edusense-logo.svg"
                  alt="EduSense"
                  width={120}
                  height={32}
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <Image
            src="/brand/edusense-footer.svg"
            alt="EduSense"
            width={140}
            height={32}
          />
          <span>Monitor de bem-estar estudantil</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
