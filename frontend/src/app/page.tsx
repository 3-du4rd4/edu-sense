"use client";

import { EnvironmentCards } from "@/components/dashboard/EnvironmentCards";
import { ReadingsList } from "@/components/dashboard/ReadingsList";
import { SessionControls } from "@/components/session/SessionControls";
import { useSession } from "@/hooks/useSession";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

export default function Home() {
  const { loadActiveSession } = useSession();

  useWebSocket(TEST_USER_ID);

  useEffect(() => {
    loadActiveSession(TEST_USER_ID);
  }, [loadActiveSession]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">EduSense</h1>
        <p className="text-gray-600">
          Dashboard inicial de monitoramento em tempo real.
        </p>
      </header>

      <SessionControls />

      <EnvironmentCards />

      <ReadingsList />
    </main>
  );
}
