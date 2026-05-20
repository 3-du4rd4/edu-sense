"use client";

import { useEnvironmentStore } from "@/stores/environmentStore";

export function EnvironmentCards() {
  const latestReading = useEnvironmentStore((state) => state.latestReading);

  return (
    <section className="rounded-xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Ambiente em tempo real</h2>

      {!latestReading ? (
        <p className="text-sm text-gray-500">Nenhuma leitura recebida ainda.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-gray-500">Temperatura</p>
            <p className="text-2xl font-semibold">
              {latestReading.temperature}°C
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm text-gray-500">Ruído</p>
            <p className="text-2xl font-semibold">{latestReading.noise}</p>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm text-gray-500">Luz</p>
            <p className="text-2xl font-semibold">{latestReading.light}</p>
          </div>
        </div>
      )}
    </section>
  );
}
