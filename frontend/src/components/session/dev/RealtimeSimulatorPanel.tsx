"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { createEnvironmentReading } from "@/services/environmentService";
import { createFacialMetrics } from "@/services/facialMetricsService";
import { useAuthStore } from "@/stores/authStore";

export function RealtimeSimulatorPanel() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function sendEnvironmentUpdate() {
    if (!userId) return;

    await createEnvironmentReading({
      userId: userId,
      temperature: randomBetween(30, 34),
      light: randomBetween(250, 950),
      noise: randomBetween(30, 80),
    });
  }

  async function sendFacialMetricsUpdate() {
    if (!userId) return;

    const eyesClosed = Math.random() < 0.15;
    const yawning = Math.random() < 0.1;

    await createFacialMetrics({
      userId: userId,
      ear: eyesClosed ? randomBetween(0.12, 0.18) : randomBetween(0.22, 0.34),
      mar: yawning ? randomBetween(0.6, 0.85) : randomBetween(0.15, 0.35),
      eyesClosed,
      yawning,
    });
  }

  async function sendBoth() {
    await Promise.all([sendEnvironmentUpdate(), sendFacialMetricsUpdate()]);
  }

  function startSimulation() {
    if (intervalRef.current) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      sendBoth().catch(console.error);
    }, 20000);
  }

  function stopSimulation() {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-72 rounded-3xl border bg-background p-4 shadow-lg">
      <h3 className="text-sm font-semibold">Realtime simulator</h3>

      <p className="mt-1 text-xs text-muted-foreground">
        Development tool for environment and facial metrics.
      </p>

      <div className="mt-4 grid gap-2">
        <Button variant="outline" size="sm" onClick={sendEnvironmentUpdate}>
          Send environment update
        </Button>

        <Button variant="outline" size="sm" onClick={sendFacialMetricsUpdate}>
          Send facial metrics update
        </Button>

        <Button variant="outline" size="sm" onClick={sendBoth}>
          Send both
        </Button>

        {isRunning ? (
          <Button size="sm" onClick={stopSimulation}>
            Stop auto simulation
          </Button>
        ) : (
          <Button size="sm" onClick={startSimulation}>
            Start auto simulation
          </Button>
        )}
      </div>
    </div>
  );
}

function randomBetween(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}
