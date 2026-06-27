"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";

export function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      router.replace("/");
    }
  }, [isAuthenticated, accessToken, router]);

  if (isAuthenticated && accessToken) {
    return null;
  }

  return <>{children}</>;
}
