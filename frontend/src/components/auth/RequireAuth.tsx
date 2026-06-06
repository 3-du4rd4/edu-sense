"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, accessToken, loadMe } = useAuth();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setIsCheckingAuth(true);

      if (!accessToken) {
        router.replace("/signin");
        return;
      }

      const user = await loadMe();

      if (!user) {
        router.replace("/signin");
        return;
      }

      setIsCheckingAuth(false);
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
